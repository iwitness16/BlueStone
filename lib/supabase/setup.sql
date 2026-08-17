-- ============================================================
-- BlueStone Trust Bank — Full Setup SQL
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  first_name          text not null default '',
  last_name           text not null default '',
  email               text not null unique,
  phone               text,
  country             text,
  city                text,
  zip                 text,
  address             text,
  profession          text,
  account_number      text unique not null,
  balance             numeric(15,2) not null default 10.00,
  joining_date        timestamptz default now(),
  verification_status text not null default 'unverified'
                        check (verification_status in ('unverified','pending','rejected','verified')),
  kyc_submitted       boolean default false,
  notifications       int default 1,
  referral_code       text unique,
  front_id_url        text,
  back_id_url         text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create table if not exists public.transactions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  type            text not null check (type in ('credit','debit')),
  description     text not null,
  amount          numeric(15,2) not null,
  date            timestamptz not null default now(),
  status          text not null default 'success'
                    check (status in ('success','pending','failed')),
  method          text,
  transaction_id  text unique not null,
  created_at      timestamptz default now()
);

create table if not exists public.kyc_submissions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  first_name   text,
  last_name    text,
  phone        text,
  city         text,
  zip          text,
  address      text,
  profession   text,
  dob          date,
  front_id_url text,
  back_id_url  text,
  submitted_at timestamptz default now(),
  reviewed_at  timestamptz,
  reviewed_by  text
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.kyc_submissions enable row level security;

-- Drop policies first so re-running this script is safe
do $$ begin
  drop policy if exists "Users can read own profile" on public.profiles;
  drop policy if exists "Users can update own profile" on public.profiles;
  drop policy if exists "Service role can read all profiles" on public.profiles;
  drop policy if exists "Service role can update all profiles" on public.profiles;

  drop policy if exists "Users can read own transactions" on public.transactions;
  drop policy if exists "Users can insert own transactions" on public.transactions;
  drop policy if exists "Service role can read all transactions" on public.transactions;
  drop policy if exists "Service role can insert transactions for any user" on public.transactions;

  drop policy if exists "Users can read own KYC" on public.kyc_submissions;
  drop policy if exists "Users can submit KYC" on public.kyc_submissions;
  drop policy if exists "Service role can read all KYC" on public.kyc_submissions;
  drop policy if exists "Service role can update all KYC" on public.kyc_submissions;
end $$;

-- Profiles
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Service role can read all profiles"
  on public.profiles for select
  using (auth.role() = 'service_role');

create policy "Service role can update all profiles"
  on public.profiles for update
  using (auth.role() = 'service_role');

-- Transactions
create policy "Users can read own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Service role can read all transactions"
  on public.transactions for select
  using (auth.role() = 'service_role');

create policy "Service role can insert transactions for any user"
  on public.transactions for insert
  with check (auth.role() = 'service_role');

-- KYC
create policy "Users can read own KYC"
  on public.kyc_submissions for select
  using (auth.uid() = user_id);

create policy "Users can submit KYC"
  on public.kyc_submissions for insert
  with check (auth.uid() = user_id);

create policy "Service role can read all KYC"
  on public.kyc_submissions for select
  using (auth.role() = 'service_role');

create policy "Service role can update all KYC"
  on public.kyc_submissions for update
  using (auth.role() = 'service_role');

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================

drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $func$
declare
  acc_num  text;
  ref_code text;
begin
  acc_num  := 'BST-' || upper(substr(md5(random()::text), 1, 9));
  ref_code := upper(substr(md5(random()::text), 1, 8));

  insert into public.profiles (
    id, first_name, last_name, email, phone, country, account_number, referral_code
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name',  ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone',   ''),
    coalesce(new.raw_user_meta_data->>'country', ''),
    acc_num,
    ref_code
  )
  on conflict (id) do nothing;  -- safe to re-run

  -- Signup bonus transaction
  insert into public.transactions (
    user_id, type, description, amount, status, method, transaction_id
  ) values (
    new.id,
    'credit',
    'Signup Bonus',
    10.00,
    'success',
    'System',
    'TRX' || upper(substr(md5(random()::text), 1, 10))
  );

  return new;
end;
$func$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- BACKFILL: create profile rows for any auth users that signed
-- up before this schema was applied (no profile row yet).
-- ============================================================

insert into public.profiles (
  id, first_name, last_name, email, phone, country, account_number, referral_code
)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'first_name', ''),
  coalesce(u.raw_user_meta_data->>'last_name',  ''),
  u.email,
  coalesce(u.raw_user_meta_data->>'phone',   ''),
  coalesce(u.raw_user_meta_data->>'country', ''),
  'BST-' || upper(substr(md5(u.id::text), 1, 9)),
  upper(substr(md5(u.email), 1, 8))
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);

-- Give backfilled users a signup bonus transaction too
insert into public.transactions (
  user_id, type, description, amount, status, method, transaction_id
)
select
  p.id,
  'credit',
  'Signup Bonus',
  10.00,
  'success',
  'System',
  'TRX' || upper(substr(md5(p.id::text), 1, 10))
from public.profiles p
where not exists (
  select 1 from public.transactions t
  where t.user_id = p.id and t.description = 'Signup Bonus'
);

-- ============================================================
-- BlueStone Trust Bank — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: profiles (extends Supabase Auth users)
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

-- ============================================================
-- TABLE: transactions
-- ============================================================
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

-- ============================================================
-- TABLE: kyc_submissions
-- ============================================================
create table if not exists public.kyc_submissions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  first_name  text,
  last_name   text,
  phone       text,
  city        text,
  zip         text,
  address     text,
  profession  text,
  dob         date,
  front_id_url text,
  back_id_url  text,
  submitted_at timestamptz default now(),
  reviewed_at  timestamptz,
  reviewed_by  text
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles: users can only read/update their own
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Transactions: users can only read their own
alter table public.transactions enable row level security;

create policy "Users can read own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- KYC: users can insert their own
alter table public.kyc_submissions enable row level security;

create policy "Users can read own KYC"
  on public.kyc_submissions for select
  using (auth.uid() = user_id);

create policy "Users can submit KYC"
  on public.kyc_submissions for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- PASTE AND RUN THIS IN SUPABASE SQL EDITOR TO FIX THE TRIGGER
-- ============================================================
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
    id,
    first_name,
    last_name,
    email,
    phone,
    country,
    account_number,
    referral_code
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name',  ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone',   ''),
    coalesce(new.raw_user_meta_data->>'country', ''),
    acc_num,
    ref_code
  );

  -- Signup bonus
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


-- Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE: KYC documents bucket
-- ============================================================
-- Run in Supabase Dashboard → Storage → New Bucket
-- Name: kyc-documents
-- Public: false (private)
-- After creating, add policy: authenticated users can upload to their own folder:
--
-- Policy name: "Users can upload their KYC docs"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy: bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text

-- ============================================================
-- ADMIN BYPASS POLICIES (service role bypasses RLS by default,
-- but these policies allow a future server-side admin role too)
-- ============================================================

-- Allow service role full access to profiles (already granted by default,
-- but explicitly creating named policies for clarity)
create policy "Service role can read all profiles"
  on public.profiles for select
  using (auth.role() = 'service_role');

create policy "Service role can update all profiles"
  on public.profiles for update
  using (auth.role() = 'service_role');

create policy "Service role can read all transactions"
  on public.transactions for select
  using (auth.role() = 'service_role');

create policy "Service role can insert transactions for any user"
  on public.transactions for insert
  with check (auth.role() = 'service_role');

create policy "Service role can read all KYC"
  on public.kyc_submissions for select
  using (auth.role() = 'service_role');

create policy "Service role can update all KYC"
  on public.kyc_submissions for update
  using (auth.role() = 'service_role');

-- ============================================================
-- Migration: Admin-controlled withdrawal screen
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Drop old check constraint so we can add late_payment value
alter table public.profiles
  drop constraint if exists profiles_withdrawal_screen_check;

-- 2. Add withdrawal_screen column (or re-add with new enum values)
alter table public.profiles
  add column if not exists withdrawal_screen text not null default 'processing';

-- Apply updated check constraint with all 4 values
alter table public.profiles
  add constraint profiles_withdrawal_screen_check
    check (withdrawal_screen in ('open', 'processing', 'atm_required', 'late_payment'));

-- 3. Fee % column (used by atm_required)
alter table public.profiles
  add column if not exists withdrawal_fee_pct numeric(5,2) not null default 10.00;

-- 4. Fixed dollar amount column (used by late_payment)
alter table public.profiles
  add column if not exists withdrawal_late_fee numeric(10,2) not null default 301.00;

-- No extra RLS policies needed — existing "Users can read own profile" covers all columns.

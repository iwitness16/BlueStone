-- ============================================================
-- Migration: Admin-controlled withdrawal screen
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Add withdrawal_screen column
--    Values:
--      'open'         → user can withdraw normally (default for all users)
--      'processing'   → "Your account is being processed, check back later"
--      'atm_required' → ATM card required screen with custom fee %
alter table public.profiles
  add column if not exists withdrawal_screen text not null default 'processing'
    check (withdrawal_screen in ('open', 'processing', 'atm_required'));

-- 2. Add the percentage fee the admin sets per user (used when atm_required)
alter table public.profiles
  add column if not exists withdrawal_fee_pct numeric(5,2) not null default 10.00;

-- 3. RLS: allow users to read their own new fields (already covered by existing select policy)
-- No extra policy needed — existing "Users can read own profile" covers all columns.

-- 4. Backfill: existing verified users get 'processing' (already the default),
--    unverified/pending/rejected users also get 'processing' since unverified
--    path is handled separately in the UI.
-- Nothing to do — default handles it.

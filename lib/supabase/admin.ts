/**
 * Supabase Admin Client + Data Functions
 *
 * Uses the SERVICE ROLE key so it can bypass RLS and read/write all rows.
 * This file is only ever used server-side or in admin-gated client pages —
 * never expose the service role key in public user-facing code.
 *
 * Add to .env.local:
 *   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  (Settings → API → Secret keys)
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Service role key — bypasses RLS. Keep this admin-only.
const serviceKey  = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

export const adminSupabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
})

// ─── Types ───────────────────────────────────────────────────────────────────

export type VerificationStatus = "unverified" | "pending" | "rejected" | "verified"

export interface DBProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  country: string | null
  city: string | null
  zip: string | null
  address: string | null
  profession: string | null
  account_number: string
  balance: number
  joining_date: string
  verification_status: VerificationStatus
  kyc_submitted: boolean
  notifications: number
  referral_code: string | null
  front_id_url: string | null
  back_id_url: string | null
  created_at: string
}

export interface DBTransaction {
  id: string
  user_id: string
  type: "credit" | "debit"
  description: string
  amount: number
  date: string
  status: "success" | "pending" | "failed"
  method: string | null
  transaction_id: string
  created_at: string
  // joined
  profile?: { first_name: string; last_name: string; email: string; account_number: string }
}

export interface DBKycSubmission {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  city: string | null
  zip: string | null
  address: string | null
  profession: string | null
  dob: string | null
  front_id_url: string | null
  back_id_url: string | null
  submitted_at: string
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function adminGetAllUsers(): Promise<DBProfile[]> {
  const { data, error } = await adminSupabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function adminGetUserTransactions(userId: string): Promise<DBTransaction[]> {
  const { data, error } = await adminSupabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function adminUpdateVerificationStatus(
  userId: string,
  status: VerificationStatus
): Promise<void> {
  const { error } = await adminSupabase
    .from("profiles")
    .update({ verification_status: status, kyc_submitted: true, updated_at: new Date().toISOString() })
    .eq("id", userId)
  if (error) throw error
}

export async function adminCreditUser(
  userId: string,
  amount: number,
  description: string
): Promise<void> {
  // 1. Increment balance
  const { data: profile, error: fetchErr } = await adminSupabase
    .from("profiles")
    .select("balance")
    .eq("id", userId)
    .single()
  if (fetchErr) throw fetchErr

  const newBalance = Number(profile.balance) + amount
  const { error: updateErr } = await adminSupabase
    .from("profiles")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", userId)
  if (updateErr) throw updateErr

  // 2. Insert transaction record
  const txId = "TRX" + Math.random().toString(36).toUpperCase().slice(2, 12)
  const { error: txErr } = await adminSupabase.from("transactions").insert({
    user_id: userId,
    type: "credit",
    description,
    amount,
    date: new Date().toISOString(),
    status: "success",
    method: "Admin",
    transaction_id: txId,
  })
  if (txErr) throw txErr
}

export async function adminDebitUser(
  userId: string,
  amount: number,
  description: string
): Promise<void> {
  const { data: profile, error: fetchErr } = await adminSupabase
    .from("profiles")
    .select("balance")
    .eq("id", userId)
    .single()
  if (fetchErr) throw fetchErr

  const newBalance = Math.max(0, Number(profile.balance) - amount)
  const { error: updateErr } = await adminSupabase
    .from("profiles")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", userId)
  if (updateErr) throw updateErr

  const txId = "TRX" + Math.random().toString(36).toUpperCase().slice(2, 12)
  const { error: txErr } = await adminSupabase.from("transactions").insert({
    user_id: userId,
    type: "debit",
    description,
    amount,
    date: new Date().toISOString(),
    status: "success",
    method: "Admin",
    transaction_id: txId,
  })
  if (txErr) throw txErr
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function adminGetAllTransactions(): Promise<DBTransaction[]> {
  const { data, error } = await adminSupabase
    .from("transactions")
    .select(`
      *,
      profile:profiles(first_name, last_name, email, account_number)
    `)
    .order("date", { ascending: false })
  if (error) throw error
  return (data ?? []) as DBTransaction[]
}

// ─── KYC ─────────────────────────────────────────────────────────────────────

export async function adminGetKycSubmissions(): Promise<DBKycSubmission[]> {
  const { data, error } = await adminSupabase
    .from("kyc_submissions")
    .select("*")
    .order("submitted_at", { ascending: false })
  if (error) throw error
  return data ?? []
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function adminGetStats() {
  const [profilesRes, txRes] = await Promise.all([
    adminSupabase.from("profiles").select("id, balance, verification_status"),
    adminSupabase.from("transactions").select("type, amount"),
  ])
  if (profilesRes.error) throw profilesRes.error
  if (txRes.error) throw txRes.error

  const profiles = profilesRes.data ?? []
  const txs = txRes.data ?? []

  return {
    totalUsers:      profiles.length,
    verifiedUsers:   profiles.filter(p => p.verification_status === "verified").length,
    pendingKyc:      profiles.filter(p => p.verification_status === "pending").length,
    unverifiedUsers: profiles.filter(p => p.verification_status === "unverified").length,
    rejectedUsers:   profiles.filter(p => p.verification_status === "rejected").length,
    totalBalance:    profiles.reduce((s, p) => s + Number(p.balance), 0),
    totalDeposits:   txs.filter(t => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0),
    totalWithdrawals:txs.filter(t => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0),
    totalTxCount:    txs.length,
  }
}

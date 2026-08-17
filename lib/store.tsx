"use client"

import React, {
  createContext, useContext, useState, useCallback, useEffect,
} from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type VerificationStatus = "unverified" | "pending" | "rejected" | "verified"

export interface Transaction {
  id: string
  type: "credit" | "debit"
  description: string
  amount: number
  date: string
  status: "success" | "pending" | "failed"
  method?: string
  transactionId: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  zip: string
  address: string
  profession: string
  accountNumber: string
  balance: number
  joiningDate: string
  verificationStatus: VerificationStatus
  kycSubmitted: boolean
  notifications: number
  avatar?: string
  referralCode: string
  transactions: Transaction[]
  frontIdUrl?: string
  backIdUrl?: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin"
}

export interface AppState {
  currentUser: User | null
  adminUser: AdminUser | null
  isLoggedIn: boolean
  isAdminLoggedIn: boolean
  authLoading: boolean
  setCurrentUser: (user: User | null) => void
  setAdminUser: (user: AdminUser | null) => void
  refreshCurrentUser: () => Promise<void>
  addTransaction: (userId: string, tx: Omit<Transaction, "id" | "transactionId">) => void
  submitKYC: (userId: string, data: Partial<User>) => void
  logout: () => Promise<void>
  adminLogout: () => void
}

// ─── Supabase client (singleton) ─────────────────────────────────────────────

// We import the shared client for auth listener registration,
// but create a fresh scoped client per-fetch to ensure the correct
// JWT is used at the moment of the RLS-protected query.
import { supabase } from "@/lib/supabase/client"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateTxId = () =>
  "TRX" + Math.random().toString(36).toUpperCase().slice(2, 12)

function mapProfile(profile: any, txRows: any[]): User {
  return {
    id:                 profile.id,
    firstName:          profile.first_name  ?? "",
    lastName:           profile.last_name   ?? "",
    email:              profile.email       ?? "",
    phone:              profile.phone       ?? "",
    country:            profile.country     ?? "",
    city:               profile.city        ?? "",
    zip:                profile.zip         ?? "",
    address:            profile.address     ?? "",
    profession:         profile.profession  ?? "",
    accountNumber:      profile.account_number ?? "",
    balance:            Number(profile.balance ?? 0),
    joiningDate:        profile.joining_date
      ? new Date(profile.joining_date).toLocaleString("en-US", {
          month: "short", day: "numeric", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "",
    verificationStatus: (profile.verification_status ?? "unverified") as VerificationStatus,
    kycSubmitted:       profile.kyc_submitted ?? false,
    notifications:      profile.notifications ?? 0,
    referralCode:       profile.referral_code ?? "",
    frontIdUrl:         profile.front_id_url ?? undefined,
    backIdUrl:          profile.back_id_url  ?? undefined,
    transactions: txRows.map((tx: any) => ({
      id:            tx.id,
      type:          tx.type,
      description:   tx.description,
      amount:        Number(tx.amount),
      date:          new Date(tx.date).toLocaleString("en-US", {
                       month: "short", day: "numeric", year: "numeric",
                       hour: "2-digit", minute: "2-digit",
                     }),
      status:        tx.status,
      method:        tx.method ?? undefined,
      transactionId: tx.transaction_id,
    })),
  }
}

/**
 * Fetch profile + transactions using the provided access token explicitly.
 * Uses the shared supabase client but overrides the Authorization header
 * via a one-time options object — no new GoTrueClient instances created.
 */
async function fetchUserWithToken(
  userId: string,
  accessToken: string
): Promise<User | null> {
  const [profileRes, txRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .setHeader("Authorization", `Bearer ${accessToken}`),
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .setHeader("Authorization", `Bearer ${accessToken}`),
  ])

  if (profileRes.error || !profileRes.data) {
    console.error("[store] profile fetch failed:", profileRes.error?.message, "userId:", userId)
    return null
  }

  return mapProfile(profileRes.data, txRes.data ?? [])
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser,  setCurrentUserState] = useState<User | null>(null)
  const [adminUser,    setAdminUserState]   = useState<AdminUser | null>(null)
  const [authLoading,  setAuthLoadingState] = useState(true)

  useEffect(() => {
    let mounted = true
    // Prevent duplicate in-flight fetches for the same user
    let fetchingForUserId: string | null = null

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === "SIGNED_OUT" || !session) {
          fetchingForUserId = null
          setCurrentUserState(null)
          setAuthLoadingState(false)
          return
        }

        if (
          event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED"
        ) {
          const uid = session.user.id
          // If we're already fetching for this exact user (e.g. INITIAL_SESSION
          // and SIGNED_IN both fire for the same login), skip the duplicate.
          if (fetchingForUserId === uid && event !== "TOKEN_REFRESHED") return
          fetchingForUserId = uid

          setAuthLoadingState(true)
          const user = await fetchUserWithToken(uid, session.access_token)
          if (mounted) {
            setCurrentUserState(user)
            setAuthLoadingState(false)
            fetchingForUserId = null
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ── Actions ───────────────────────────────────────────────────────────────

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user)
  }, [])

  const setAdminUser = useCallback((user: AdminUser | null) => {
    setAdminUserState(user)
  }, [])

  const refreshCurrentUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const user = await fetchUserWithToken(session.user.id, session.access_token)
    setCurrentUserState(user)
  }, [])

  const addTransaction = useCallback(
    async (userId: string, txData: Omit<Transaction, "id" | "transactionId">) => {
      const txId = generateTxId()

      await supabase.from("transactions").insert({
        user_id:        userId,
        type:           txData.type,
        description:    txData.description,
        amount:         txData.amount,
        date:           new Date().toISOString(),
        status:         txData.status,
        method:         txData.method ?? null,
        transaction_id: txId,
      })

      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single()

      if (profile) {
        const newBal = txData.type === "credit"
          ? Number(profile.balance) + txData.amount
          : Math.max(0, Number(profile.balance) - txData.amount)

        await supabase
          .from("profiles")
          .update({ balance: newBal, updated_at: new Date().toISOString() })
          .eq("id", userId)
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const updated = await fetchUserWithToken(userId, session.access_token)
        if (updated) setCurrentUserState(updated)
      }
    },
    []
  )

  const submitKYC = useCallback(
    async (userId: string, data: Partial<User>) => {
      const status = data.verificationStatus ?? "pending"
      await supabase.from("profiles").update({
        verification_status: status,
        kyc_submitted:       true,
        first_name:          data.firstName,
        last_name:           data.lastName,
        phone:               data.phone,
        city:                data.city,
        zip:                 data.zip,
        address:             data.address,
        profession:          data.profession,
        updated_at:          new Date().toISOString(),
      }).eq("id", userId)

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const updated = await fetchUserWithToken(userId, session.access_token)
        if (updated) setCurrentUserState(updated)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setCurrentUserState(null)
  }, [])

  const adminLogout = useCallback(() => {
    setAdminUserState(null)
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        adminUser,
        isLoggedIn:      !!currentUser,
        isAdminLoggedIn: !!adminUser,
        authLoading,
        setCurrentUser,
        setAdminUser,
        refreshCurrentUser,
        addTransaction,
        submitKYC,
        logout,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside AppProvider")
  return ctx
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/store"
import DashboardShell from "@/components/dashboard/shell"

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, authLoading } = useApp()
  const router = useRouter()

  useEffect(() => {
    // Only redirect when we are certain there is no session —
    // i.e. auth has fully resolved AND there is no user.
    if (!authLoading && !currentUser) {
      router.replace("/auth/login")
    }
  }, [authLoading, currentUser, router])

  // Show spinner while auth is in-flight (covers both initial load and
  // the SIGNED_IN profile fetch that happens right after login).
  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[#e2e8f0] border-t-[#1a6fad] rounded-full animate-spin" />
          <p className="text-sm text-[#94a3b8] font-medium">Loading your account…</p>
        </div>
      </div>
    )
  }

  return <DashboardShell>{children}</DashboardShell>
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardGuard>{children}</DashboardGuard>
}

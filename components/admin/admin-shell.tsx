"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Users, ArrowLeftRight, Settings,
  ShieldCheck, Menu, X, LogOut, BarChart3, ChevronDown,
} from "lucide-react"
import Logo from "@/components/logo"
import { useApp } from "@/lib/store"

const NAV = [
  { href: "/admin",              label: "Overview",         icon: LayoutDashboard, badge: null },
  { href: "/admin/users",        label: "User Management",  icon: Users,           badge: null },
  { href: "/admin/transactions", label: "Transactions",     icon: ArrowLeftRight,  badge: null },
  { href: "/admin/kyc",          label: "KYC Verification", icon: ShieldCheck,     badge: "pending" },
  { href: "/admin/reports",      label: "Reports",          icon: BarChart3,       badge: null },
  { href: "/admin/settings",     label: "Settings",         icon: Settings,        badge: null },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { adminUser, adminLogout } = useApp()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pendingKyc, setPendingKyc] = useState(0)

  // Fetch pending KYC count from Supabase directly
  useEffect(() => {
    import("@/lib/supabase/client").then(({ supabase }) => {
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("verification_status", "pending")
        .then(({ count }) => { if (count !== null) setPendingKyc(count) })
    })
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => { adminLogout(); router.push("/admin/login") }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href)

  const currentPageLabel = NAV.find((n) => isActive(n.href))?.label ?? "Admin"

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ background: "linear-gradient(180deg, #06111f 0%, #0c1929 50%, #0a1520 100%)" }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-400/20 border border-sky-400/25 flex items-center justify-center">
              <ShieldCheck size={16} className="text-sky-400" />
            </div>
            <span className="text-white font-bold tracking-tight">Admin Console</span>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Admin info */}
        <div className="px-4 py-4 mx-3 mt-3 mb-2 rounded-xl bg-white/5 border border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400/30 to-blue-600/20 border border-sky-400/25 flex items-center justify-center text-sky-300 font-bold text-sm shrink-0">
              {adminUser?.name?.[0] ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">{adminUser?.name ?? "Administrator"}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-300 bg-sky-400/15 px-1.5 py-0.5 rounded-full">
                <ShieldCheck size={9} /> Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest px-3 pt-2 pb-2">Navigation</p>
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = isActive(href)
            const badgeCount = badge === "pending" ? pendingKyc : 0
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                  active ? "bg-white/12 text-white" : "text-white/50 hover:text-white hover:bg-white/8"
                }`}>
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-sky-400 rounded-r-full" />}
                <Icon size={16} className={active ? "text-sky-400" : "text-white/35 group-hover:text-white/60"} />
                <span className="flex-1">{label}</span>
                {badgeCount > 0 && (
                  <span className="bg-amber-400 text-[#0c2d4e] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {badgeCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Status indicators */}
        <div className="px-3 py-3 mx-3 mb-3 rounded-xl bg-white/4 border border-white/6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0e9483]" />
            <span className="text-white/40 text-xs">System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white/40 text-xs">{pendingKyc} KYC pending review</span>
          </div>
        </div>

        <div className="px-3 pb-4 border-t border-white/8 pt-3">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-white/45 hover:text-red-300 hover:bg-red-500/8 rounded-xl text-sm font-medium transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className={`bg-white border-b border-[#e2e8f0] px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-20 transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[#64748b] hover:text-[#0c2d4e] rounded-xl hover:bg-[#f1f5f9] transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-bold text-[#0c2d4e] tracking-tight hidden sm:block">{currentPageLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingKyc > 0 && (
              <Link href="/admin/kyc" className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                <ShieldCheck size={12} />
                {pendingKyc} KYC pending
              </Link>
            )}
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-600 font-bold">Admin Mode</span>
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-[#f1f5f9] rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-[#1a6fad] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {adminUser?.name?.[0] ?? "A"}
                </div>
                <ChevronDown size={13} className={`text-[#64748b] hidden sm:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl py-1.5 z-50 animate-scale-in">
                  <div className="px-4 py-2.5 border-b border-[#f1f5f9]">
                    <p className="text-sm font-bold text-[#0c2d4e]">{adminUser?.name ?? "Administrator"}</p>
                    <p className="text-xs text-[#94a3b8] truncate">{adminUser?.email}</p>
                  </div>
                  <Link href="/admin/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#334155] hover:bg-[#f8fafc] transition-colors">
                    <Settings size={14} className="text-[#64748b]" /> Settings
                  </Link>
                  <div className="border-t border-[#f1f5f9] mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 page-enter">
          {children}
        </main>
      </div>
    </div>
  )
}

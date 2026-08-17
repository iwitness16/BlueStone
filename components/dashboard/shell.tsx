"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, PlusCircle, ArrowUpFromLine, Send, Archive,
  BookOpen, Banknote, CreditCard, List, ArrowDownToLine,
  Users, PieChart, Bell, Menu, X, LogOut, User, ChevronDown,
  ShieldCheck, Home, TrendingUp, Receipt, Gift, BarChart2, Wallet
} from "lucide-react"
import Logo from "@/components/logo"
import { useApp } from "@/lib/store"

const NAV = [
  { href: "/dashboard",              label: "Dashboard",    icon: LayoutDashboard, section: "main" },
  { href: "/dashboard/deposit",      label: "Deposit",      icon: PlusCircle,      section: "transactions" },
  { href: "/dashboard/withdraw",     label: "Withdraw",     icon: ArrowDownToLine, section: "transactions" },
  { href: "/dashboard/transfer",     label: "Fund Transfer",icon: Send,            section: "transactions" },
  { href: "/dashboard/transactions", label: "Transactions", icon: Receipt,         section: "transactions" },
  { href: "/dashboard/dps",          label: "DPS",          icon: Archive,         section: "invest" },
  { href: "/dashboard/fdr",          label: "FDR",          icon: BookOpen,        section: "invest" },
  { href: "/dashboard/loan",         label: "Loan",         icon: Banknote,        section: "invest" },
  { href: "/dashboard/paybill",      label: "Pay Bill",     icon: CreditCard,      section: "invest" },
  { href: "/dashboard/referral",     label: "Referral",     icon: Gift,            section: "more" },
  { href: "/dashboard/portfolio",    label: "Portfolio",    icon: BarChart2,       section: "more" },
]

const SECTIONS = [
  { id: "main",         label: null },
  { id: "transactions", label: "Banking" },
  { id: "invest",       label: "Products" },
  { id: "more",         label: "More" },
]

const MOBILE_BOTTOM_NAV = [
  { href: "/dashboard",              label: "Home",    icon: Home },
  { href: "/dashboard/transactions", label: "History", icon: Receipt },
  { href: "/dashboard/transfer",     label: "Transfer",icon: Send },
  { href: "/dashboard/portfolio",    label: "Portfolio",icon: BarChart2 },
  { href: "/dashboard/profile",      label: "Profile", icon: User },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useApp()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => { await logout(); router.push("/auth/login") }

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  const currentPageLabel = NAV.find((n) => isActive(n.href))?.label ?? "Dashboard"

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">

      {/* Sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0c2338] via-[#0c2d4e] to-[#0a2a46] z-40 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
          <Logo size="sm" variant="light" href="/dashboard" />
          <button className="lg:hidden text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all" onClick={() => setSidebarOpen(false)}>
            <X size={19} />
          </button>
        </div>

        {/* User info */}
        <Link href="/dashboard/profile" onClick={() => setSidebarOpen(false)}
          className="mx-3 mt-3 mb-1 p-3 rounded-xl hover:bg-white/8 transition-all flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400/30 to-teal-400/20 border border-white/15 flex items-center justify-center text-sky-300 font-bold text-sm shrink-0">
            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
            <p className="text-white/40 text-xs truncate font-mono">{currentUser?.accountNumber}</p>
          </div>
          <ChevronDown size={13} className="text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
        </Link>

        {/* KYC status pill */}
        {!currentUser?.kycSubmitted && (
          <Link href="/dashboard/kyc" onClick={() => setSidebarOpen(false)}
            className="mx-3 mb-2 flex items-center gap-2 bg-amber-500/15 border border-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-amber-500/25 transition-all">
            <ShieldCheck size={12} />
            Complete verification
          </Link>
        )}
        {currentUser?.kycSubmitted && currentUser.verificationStatus === "verified" && (
          <div className="mx-3 mb-2 flex items-center gap-2 bg-[#0e9483]/15 border border-[#0e9483]/20 text-emerald-300 text-xs font-semibold px-3 py-2 rounded-xl">
            <ShieldCheck size={12} />
            Account Verified
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          {SECTIONS.map(({ id, label }) => {
            const items = NAV.filter(n => n.section === id)
            return (
              <div key={id}>
                {label && (
                  <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1.5">{label}</p>
                )}
                {items.map(({ href, label: navLabel, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                      isActive(href)
                        ? "bg-white/12 text-white"
                        : "text-white/55 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {isActive(href) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-sky-400 rounded-r-full" />
                    )}
                    <Icon size={16} className={isActive(href) ? "text-sky-300" : "text-white/40 group-hover:text-white/70"} />
                    {navLabel}
                  </Link>
                ))}
              </div>
            )
          })}
        </nav>

        {/* Balance footer */}
        <div className="px-3 py-3 mx-3 mb-3 rounded-xl bg-white/6 border border-white/8">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Balance</p>
          <p className="text-white font-bold text-base">${currentUser?.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Sign out */}
        <div className="px-3 pb-4 border-t border-white/8 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-white/50 hover:text-red-300 hover:bg-red-500/8 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className={`bg-white border-b border-[#e2e8f0] px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20 transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}>
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-[#0c2d4e] hover:bg-[#f1f5f9] rounded-xl transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-base font-bold text-[#0c2d4e] tracking-tight">{currentPageLabel}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* KYC warning chip */}
            {!currentUser?.kycSubmitted && (
              <Link href="/dashboard/kyc" className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                <ShieldCheck size={12} />
                Verify Account
              </Link>
            )}

            {/* Notification bell */}
            <Link href="/dashboard/notifications" className="relative p-2 text-[#64748b] hover:text-[#0c2d4e] hover:bg-[#f1f5f9] rounded-xl transition-colors">
              <Bell size={19} />
              {(currentUser?.notifications ?? 0) > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {currentUser?.notifications}
                </span>
              )}
            </Link>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-[#f1f5f9] rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a6fad] to-[#0e9483] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </div>
                <ChevronDown size={13} className={`text-[#64748b] hidden sm:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl py-1.5 z-50 animate-scale-in">
                  <div className="px-4 py-2.5 border-b border-[#f1f5f9]">
                    <p className="text-sm font-bold text-[#0c2d4e]">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-xs text-[#94a3b8] truncate">{currentUser?.email}</p>
                  </div>
                  <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#334155] hover:bg-[#f8fafc] transition-colors">
                    <User size={14} className="text-[#64748b]" /> Profile Settings
                  </Link>
                  <Link href="/dashboard/kyc" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#334155] hover:bg-[#f8fafc] transition-colors">
                    <ShieldCheck size={14} className="text-[#64748b]" /> KYC Verification
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

        {/* KYC banner */}
        {!currentUser?.kycSubmitted && (
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in-down">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={17} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#0c2d4e] text-sm">Verify your identity</p>
              <p className="text-xs text-[#64748b]">
                Complete KYC to unlock withdrawals and all features.{" "}
                <Link href="/dashboard/kyc" className="text-[#1a6fad] underline font-semibold">Start now →</Link>
              </p>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-5 pb-24 lg:pb-6 page-enter">
          {children}
        </main>

        {/* ===== MOBILE BOTTOM NAV ===== */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#e2e8f0] px-2 py-2 z-20 shadow-xl">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {MOBILE_BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(href)
              return (
                <Link key={href} href={href}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${active ? "text-[#1a6fad]" : "text-[#94a3b8] hover:text-[#475569]"}`}
                >
                  <div className={`transition-all duration-200 ${active ? "scale-110" : ""}`}>
                    {active ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#1a6fad]/15 rounded-lg scale-110 blur-sm" />
                        <Icon size={20} className="relative text-[#1a6fad]" />
                      </div>
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold ${active ? "text-[#1a6fad]" : ""}`}>{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { ChevronLeft, TrendingUp, TrendingDown, PieChart, BookOpen, Archive, AlertTriangle, ArrowUpRight, DollarSign, BarChart2 } from "lucide-react"
import { useApp } from "@/lib/store"

export default function PortfolioPage() {
  const { currentUser } = useApp()

  const totalDeposits = (currentUser?.transactions ?? [])
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0)

  const totalWithdrawals = (currentUser?.transactions ?? [])
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + t.amount, 0)

  const currentBalance = currentUser?.balance ?? 0
  const netGrowth = currentBalance - 10 // starting balance was $10
  const growthPct = totalDeposits > 0 ? ((netGrowth / totalDeposits) * 100) : 0

  // Mock portfolio allocations
  const allocations = [
    { label: "Savings Balance", amount: currentBalance, color: "bg-[#0c2d4e]", pct: totalDeposits > 0 ? Math.round((currentBalance / (totalDeposits + 10)) * 100) : 100 },
    { label: "FDR Investments", amount: 0, color: "bg-[#1a6fad]", pct: 0 },
    { label: "DPS Plans", amount: 0, color: "bg-[#0e9483]", pct: 0 },
    { label: "Loans Outstanding", amount: 0, color: "bg-amber-400", pct: 0 },
  ]

  const stats = [
    { label: "Current Balance", value: `$${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-[#0c2d4e]", bg: "bg-[#e8f4fd]" },
    { label: "Total Deposited", value: `$${totalDeposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-[#0e9483]", bg: "bg-green-50" },
    { label: "Total Withdrawn", value: `$${totalWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: TrendingDown, color: "text-red-500", bg: "bg-red-50" },
    { label: "Net Growth", value: `${netGrowth >= 0 ? "+" : ""}$${netGrowth.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: BarChart2, color: netGrowth >= 0 ? "text-[#0e9483]" : "text-red-500", bg: netGrowth >= 0 ? "bg-green-50" : "bg-red-50" },
  ]

  const products = [
    { label: "FDR Plans", desc: "Fixed Deposit Receipts — earn guaranteed interest", icon: BookOpen, href: "/dashboard/fdr", active: 0 },
    { label: "DPS Plans", desc: "Deposit Pension Scheme — monthly savings", icon: Archive, href: "/dashboard/dps", active: 0 },
    { label: "Loans", desc: "Personal, Business & Home loans", icon: AlertTriangle, href: "/dashboard/loan", active: 0 },
  ]

  return (
    <div className="max-w-3xl mx-auto pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="p-1.5 text-[#64748b] hover:text-[#0c2d4e] hover:bg-white rounded-lg transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e]">Portfolio Overview</h1>
          <p className="text-xs text-[#64748b]">Your complete financial picture</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-[#e2e8f0] rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-[#64748b] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Allocation */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#0c2d4e]">Asset Allocation</h2>
          <PieChart size={18} className="text-[#94a3b8]" />
        </div>

        {/* Bar representation */}
        <div className="h-4 rounded-full overflow-hidden flex mb-4">
          {allocations.map((a, i) => (
            <div key={i} style={{ width: `${Math.max(a.pct, a.amount > 0 ? 5 : 0)}%` }}
              className={`${a.color} first:rounded-l-full last:rounded-r-full`} />
          ))}
          {currentBalance === 0 && <div className="flex-1 bg-[#f1f5f9] rounded-full" />}
        </div>

        <div className="space-y-3">
          {allocations.map((a) => (
            <div key={a.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                <span className="text-sm text-[#334155]">{a.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-[#0c2d4e]">
                  ${a.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-[#94a3b8] ml-2">({a.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Member Since */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h2 className="text-base font-bold text-[#0c2d4e] mb-4">Account Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Account Number", value: currentUser?.accountNumber ?? "—" },
            { label: "Member Since", value: currentUser?.joiningDate ?? "—" },
            { label: "Account Holder", value: `${currentUser?.firstName} ${currentUser?.lastName}` },
            { label: "KYC Status", value: currentUser?.verificationStatus === "verified" ? "Verified" : currentUser?.verificationStatus === "pending" ? "Pending" : "Unverified" },
            { label: "Total Transactions", value: String(currentUser?.transactions.length ?? 0) },
            { label: "Referral Code", value: currentUser?.referralCode ?? "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-[#94a3b8] mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-[#0c2d4e] font-mono">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Investment products */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h2 className="text-base font-bold text-[#0c2d4e] mb-4">Investment Products</h2>
        <div className="space-y-3">
          {products.map(({ label, desc, icon: Icon, href, active }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between p-4 rounded-xl border border-[#e2e8f0] hover:border-[#1a6fad]/40 hover:bg-[#f8fafc] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center group-hover:bg-[#e8f4fd] transition-colors">
                  <Icon size={18} className="text-[#1a6fad]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0c2d4e] text-sm">{label}</p>
                  <p className="text-xs text-[#64748b]">{desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${active > 0 ? "bg-green-100 text-green-600" : "bg-[#f1f5f9] text-[#94a3b8]"}`}>
                  {active} active
                </span>
                <ArrowUpRight size={16} className="text-[#94a3b8] group-hover:text-[#1a6fad] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { BarChart3, TrendingUp, TrendingDown, Users, Shield, DollarSign, ArrowLeftRight, CheckCircle, XCircle, Clock } from "lucide-react"
import AdminShell from "@/components/admin/admin-shell"
import { useApp } from "@/lib/store"

export default function AdminReportsPage() {
  const { users } = useApp()

  const allTx = users.flatMap((u) => u.transactions)
  const credits = allTx.filter((t) => t.type === "credit")
  const debits  = allTx.filter((t) => t.type === "debit")

  const totalBalance   = users.reduce((s, u) => s + u.balance, 0)
  const totalDeposits  = credits.reduce((s, t) => s + t.amount, 0)
  const totalWithdrawn = debits.reduce((s, t) => s + t.amount, 0)
  const avgBalance     = users.length ? totalBalance / users.length : 0

  const verified   = users.filter((u) => u.verificationStatus === "verified").length
  const pending    = users.filter((u) => u.verificationStatus === "pending").length
  const rejected   = users.filter((u) => u.verificationStatus === "rejected").length
  const unverified = users.filter((u) => u.verificationStatus === "unverified").length

  const topUsers = [...users]
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5)

  const recentTx = [...allTx]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((tx) => {
      const owner = users.find((u) => u.transactions.some((t) => t.id === tx.id))
      return { ...tx, userName: owner ? `${owner.firstName} ${owner.lastName}` : "—" }
    })

  const stats = [
    { label: "Total Users",       value: users.length,                                      icon: Users,         color: "text-[#1a6fad]", bg: "bg-[#e8f4fd]" },
    { label: "Total Balance",     value: `$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-[#0c2d4e]", bg: "bg-slate-100" },
    { label: "Total Deposits",    value: `$${totalDeposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-[#0e9483]", bg: "bg-teal-50" },
    { label: "Total Withdrawals", value: `$${totalWithdrawn.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: TrendingDown, color: "text-red-500", bg: "bg-red-50" },
    { label: "All Transactions",  value: allTx.length,                                      icon: ArrowLeftRight, color: "text-[#1a6fad]", bg: "bg-blue-50" },
    { label: "Avg. Balance",      value: `$${avgBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
  ]

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0c2d4e]">Reports & Analytics</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Platform-wide financial and user statistics</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                <Icon size={20} className={color} />
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs font-semibold text-[#334155] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* KYC breakdown */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <h2 className="text-base font-bold text-[#0c2d4e] mb-4 flex items-center gap-2">
              <Shield size={16} className="text-[#1a6fad]" /> KYC Status Breakdown
            </h2>
            <div className="space-y-3">
              {[
                { label: "Verified",          count: verified,   total: users.length, icon: CheckCircle, color: "text-green-600", bar: "bg-green-500" },
                { label: "Pending Review",    count: pending,    total: users.length, icon: Clock,       color: "text-amber-600", bar: "bg-amber-400" },
                { label: "Unable to Verify",  count: rejected,   total: users.length, icon: XCircle,     color: "text-red-500",   bar: "bg-red-400" },
                { label: "Unverified",        count: unverified, total: users.length, icon: Users,       color: "text-[#94a3b8]", bar: "bg-slate-300" },
              ].map(({ label, count, total, icon: Icon, color, bar }) => {
                const pct = total ? Math.round((count / total) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${color}`}>
                        <Icon size={12} /> {label}
                      </span>
                      <span className="text-xs text-[#64748b]">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-2">
                      <div className={`${bar} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top accounts by balance */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <h2 className="text-base font-bold text-[#0c2d4e] mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#1a6fad]" /> Top Accounts by Balance
            </h2>
            <div className="space-y-2">
              {topUsers.map((u, i) => (
                <div key={u.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#e8f4fd] text-[#1a6fad] text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-xs font-bold text-[#0c2d4e] shrink-0">
                    {u.firstName[0]}{u.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0c2d4e] truncate">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-[#94a3b8] font-mono truncate">{u.accountNumber}</p>
                  </div>
                  <p className="text-sm font-bold text-[#0e9483] shrink-0">
                    ${u.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
          <h2 className="text-base font-bold text-[#0c2d4e] mb-4 flex items-center gap-2">
            <ArrowLeftRight size={16} className="text-[#1a6fad]" /> Recent Transactions
          </h2>
          <div className="space-y-2">
            {recentTx.map((tx, i) => (
              <div key={tx.id + i} className="flex items-center justify-between py-2.5 border-b border-[#f1f5f9] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-teal-50" : "bg-red-50"}`}>
                    {tx.type === "credit"
                      ? <TrendingUp size={14} className="text-[#0e9483]" />
                      : <TrendingDown size={14} className="text-red-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0c2d4e]">{tx.description}</p>
                    <p className="text-xs text-[#94a3b8]">{tx.userName} · {tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === "credit" ? "text-[#0e9483]" : "text-red-500"}`}>
                  {tx.type === "credit" ? "+" : "-"}${tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

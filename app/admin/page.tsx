"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users, ArrowLeftRight, DollarSign, TrendingUp, TrendingDown,
  CheckCircle, Clock, XCircle, ArrowUpRight, ShieldCheck, Activity,
  RefreshCw, AlertCircle,
} from "lucide-react"
import AdminShell from "@/components/admin/admin-shell"
import {
  adminGetStats, adminGetAllUsers, adminGetAllTransactions,
  type DBProfile, type DBTransaction,
} from "@/lib/supabase/admin"

interface Stats {
  totalUsers: number
  verifiedUsers: number
  pendingKyc: number
  unverifiedUsers: number
  rejectedUsers: number
  totalBalance: number
  totalDeposits: number
  totalWithdrawals: number
  totalTxCount: number
}

export default function AdminOverviewPage() {
  const [stats, setStats]           = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers]   = useState<DBProfile[]>([])
  const [recentTx, setRecentTx]         = useState<DBTransaction[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, users, txs] = await Promise.all([
        adminGetStats(),
        adminGetAllUsers(),
        adminGetAllTransactions(),
      ])
      setStats(s)
      setRecentUsers(users.slice(0, 5))
      setRecentTx(txs.slice(0, 8))
    } catch (e: any) {
      setError(e.message ?? "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 })

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      verified:   "bg-green-50 text-green-600",
      pending:    "bg-amber-50 text-amber-600",
      rejected:   "bg-red-50 text-red-500",
      unverified: "bg-[#f1f5f9] text-[#94a3b8]",
    }
    return map[s] ?? "bg-[#f1f5f9] text-[#94a3b8]"
  }

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2d4e] tracking-tight">Dashboard Overview</h1>
            <p className="text-sm text-[#64748b] mt-0.5">Live platform data from Supabase</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-[#1a6fad] border border-[#e2e8f0] px-4 py-2 rounded-xl hover:bg-[#f0f7ff] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm text-red-600">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Skeleton / Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-[#e2e8f0] rounded-2xl p-5 h-28 shimmer" />
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Users",   value: stats.totalUsers,           sub: `${stats.verifiedUsers} verified`,      icon: Users,         color: "text-[#1a6fad]", bg: "bg-[#e8f4fd]" },
                { label: "Transactions",  value: stats.totalTxCount,         sub: "All time",                              icon: ArrowLeftRight, color: "text-[#0e9483]", bg: "bg-teal-50" },
                { label: "Total Balance", value: fmt(stats.totalBalance),    sub: "Across all accounts",                  icon: DollarSign,    color: "text-[#0c2d4e]", bg: "bg-slate-100" },
                { label: "KYC Pending",   value: stats.pendingKyc,           sub: `${stats.unverifiedUsers} unverified`,  icon: Activity,      color: "text-amber-600", bg: "bg-amber-50" },
              ].map(({ label, value, sub, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white border border-[#e2e8f0] rounded-2xl p-5 stat-card">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                    <Icon size={20} className={color} />
                  </div>
                  <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
                  <p className="text-xs font-bold text-[#334155] mt-0.5">{label}</p>
                  <p className="text-[11px] text-[#94a3b8]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Money flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 stat-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-[#0c2d4e] tracking-tight">Total Deposits</p>
                  <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                    <TrendingUp size={16} className="text-[#0e9483]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#0e9483] tracking-tight">+{fmt(stats.totalDeposits)}</p>
                <p className="text-xs text-[#94a3b8] mt-1">All credit transactions</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 stat-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-[#0c2d4e] tracking-tight">Total Withdrawals</p>
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                    <TrendingDown size={16} className="text-red-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-500 tracking-tight">-{fmt(stats.totalWithdrawals)}</p>
                <p className="text-xs text-[#94a3b8] mt-1">All debit transactions</p>
              </div>
            </div>

            {/* KYC breakdown */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#0c2d4e] tracking-tight">KYC Status Overview</h2>
                <Link href="/admin/kyc" className="text-xs text-[#1a6fad] font-bold hover:underline flex items-center gap-1">
                  Manage <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Verified",   count: stats.verifiedUsers,   icon: CheckCircle, color: "text-[#0e9483]", bg: "bg-green-50" },
                  { label: "Pending",    count: stats.pendingKyc,      icon: Clock,       color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Unverified", count: stats.unverifiedUsers, icon: ShieldCheck, color: "text-[#1a6fad]", bg: "bg-[#e8f4fd]" },
                  { label: "Rejected",   count: stats.rejectedUsers,   icon: XCircle,     color: "text-red-500",   bg: "bg-red-50" },
                ].map(({ label, count, icon: Icon, color, bg }) => (
                  <div key={label} className="text-center">
                    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <Icon size={20} className={color} />
                    </div>
                    <p className={`text-xl font-bold tracking-tight ${color}`}>{count}</p>
                    <p className="text-xs text-[#64748b]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent users */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[#0c2d4e] tracking-tight">Recent Users</h2>
                  <Link href="/admin/users" className="text-xs text-[#1a6fad] font-bold hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {recentUsers.length === 0 ? (
                    <p className="text-sm text-[#94a3b8] text-center py-4">No users yet</p>
                  ) : recentUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a6fad] to-[#0e9483] flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {u.first_name?.[0]}{u.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0c2d4e]">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-[#94a3b8]">{u.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusBadge(u.verification_status)}`}>
                        {u.verification_status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent transactions */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[#0c2d4e] tracking-tight">Recent Transactions</h2>
                  <Link href="/admin/transactions" className="text-xs text-[#1a6fad] font-bold hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {recentTx.length === 0 ? (
                    <p className="text-sm text-[#94a3b8] text-center py-4">No transactions yet</p>
                  ) : recentTx.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-teal-50" : "bg-red-50"}`}>
                          {tx.type === "credit"
                            ? <TrendingUp size={13} className="text-[#0e9483]" />
                            : <TrendingDown size={13} className="text-red-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0c2d4e] truncate max-w-[160px]">{tx.description}</p>
                          <p className="text-[10px] text-[#94a3b8] font-mono">{tx.transaction_id}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${tx.type === "credit" ? "text-[#0e9483]" : "text-red-500"}`}>
                        {tx.type === "credit" ? "+" : "−"}${Number(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminShell>
  )
}

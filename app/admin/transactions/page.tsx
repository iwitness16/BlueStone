"use client"

import { useEffect, useState, useCallback } from "react"
import { Search, X, Filter, TrendingUp, TrendingDown, ArrowLeftRight, RefreshCw, AlertCircle, Clock } from "lucide-react"
import AdminShell from "@/components/admin/admin-shell"
import { adminGetAllTransactions, type DBTransaction } from "@/lib/supabase/admin"

type TypeFilter = "all" | "credit" | "debit"

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<DBTransaction[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [search, setSearch]             = useState("")
  const [typeFilter, setTypeFilter]     = useState<TypeFilter>("all")

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await adminGetAllTransactions()
      setTransactions(data)
    } catch (e: any) {
      setError(e.message ?? "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = transactions.filter(tx => {
    const matchType = typeFilter === "all" || tx.type === typeFilter
    const userName = `${tx.profile?.first_name ?? ""} ${tx.profile?.last_name ?? ""}`.toLowerCase()
    const matchSearch = !search ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      userName.includes(search.toLowerCase()) ||
      (tx.profile?.account_number ?? "").toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const totalCredit = transactions.filter(t => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0)
  const totalDebit  = transactions.filter(t => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0)

  const statusBadge = (s: string) => {
    if (s === "success") return "bg-green-50 text-green-700 border border-green-100"
    if (s === "pending") return "bg-amber-50 text-amber-700 border border-amber-100"
    return "bg-red-50 text-red-500 border border-red-100"
  }

  return (
    <AdminShell>
      <div className="space-y-5 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2d4e] tracking-tight">Transaction History</h1>
            <p className="text-sm text-[#64748b] mt-0.5">All transactions across all user accounts</p>
          </div>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 text-sm text-[#1a6fad] border border-[#e2e8f0] px-4 py-2 rounded-xl hover:bg-[#f0f7ff] transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm text-red-600">
            <AlertCircle size={15} className="shrink-0" /> {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Transactions", value: transactions.length,                                                   icon: ArrowLeftRight, color: "text-[#1a6fad]", bg: "bg-[#e8f4fd]" },
            { label: "Total Credits",      value: `+$${totalCredit.toLocaleString("en-US",{minimumFractionDigits:2})}`, icon: TrendingUp,     color: "text-[#0e9483]", bg: "bg-green-50" },
            { label: "Total Debits",       value: `-$${totalDebit.toLocaleString("en-US",{minimumFractionDigits:2})}`,  icon: TrendingDown,   color: "text-red-500",   bg: "bg-red-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-[#e2e8f0] rounded-2xl p-5 stat-card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <p className={`text-xl sm:text-2xl font-bold tracking-tight ${color}`}>{value}</p>
              <p className="text-xs text-[#64748b] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 placeholder:text-[#c4d4e0]"
                placeholder="Search by description, ID, user, or account..." />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0c2d4e]"><X size={14} /></button>}
            </div>
            <div className="flex gap-2">
              {(["all", "credit", "debit"] as TypeFilter[]).map(f => (
                <button key={f} onClick={() => setTypeFilter(f)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${typeFilter === f
                    ? f === "credit" ? "bg-[#0e9483] text-white" : f === "debit" ? "bg-red-500 text-white" : "bg-[#0c2d4e] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] px-5 py-3 border-b border-[#f1f5f9] bg-[#fafbfc]">
            <span className="col-span-3">User</span>
            <span className="col-span-4">Description</span>
            <span className="col-span-2 text-center">Trx. ID</span>
            <span className="col-span-1 text-center">Status</span>
            <span className="col-span-2 text-right">Amount</span>
          </div>

          {loading ? (
            <div className="space-y-0">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 border-b border-[#f8fafc] last:border-0 shimmer mx-5 my-2 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Filter size={22} className="text-[#c4d4e0]" />
              </div>
              <p className="text-sm font-semibold text-[#94a3b8]">No transactions found</p>
              <p className="text-xs text-[#c4d4e0] mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            filtered.map((tx, i) => {
              const userName = `${tx.profile?.first_name ?? "—"} ${tx.profile?.last_name ?? ""}`.trim()
              const acct = tx.profile?.account_number ?? "—"
              return (
                <div key={tx.id}
                  className={`grid grid-cols-2 sm:grid-cols-12 px-5 py-3.5 gap-2 items-center border-b border-[#f8fafc] last:border-0 tx-row ${i % 2 !== 0 ? "bg-[#fafbfc]" : ""}`}>
                  {/* User */}
                  <div className="col-span-1 sm:col-span-3 min-w-0">
                    <p className="text-xs font-bold text-[#0c2d4e] truncate">{userName}</p>
                    <p className="text-[10px] text-[#94a3b8] font-mono truncate">{acct}</p>
                  </div>
                  {/* Description */}
                  <div className="col-span-1 sm:col-span-4 min-w-0">
                    <p className="text-xs font-medium text-[#334155] truncate">{tx.description}</p>
                    <p className="text-[10px] text-[#94a3b8] flex items-center gap-1">
                      <Clock size={9} /> {new Date(tx.date).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {/* Trx ID */}
                  <div className="hidden sm:flex sm:col-span-2 justify-center">
                    <span className="font-mono text-[10px] text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-md">{tx.transaction_id}</span>
                  </div>
                  {/* Status */}
                  <div className="hidden sm:flex sm:col-span-1 justify-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusBadge(tx.status)}`}>{tx.status}</span>
                  </div>
                  {/* Amount */}
                  <div className="sm:col-span-2 text-right">
                    <span className={`text-sm font-bold ${tx.type === "credit" ? "text-[#0e9483]" : "text-red-500"}`}>
                      {tx.type === "credit" ? "+" : "−"}${Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )
            })
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 bg-[#fafbfc] border-t border-[#f1f5f9]">
              <p className="text-xs text-[#94a3b8]">
                Showing <strong className="text-[#64748b]">{filtered.length}</strong> of <strong className="text-[#64748b]">{transactions.length}</strong> transactions
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}

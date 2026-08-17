"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Filter, Search, Clock, X, Receipt, ArrowDownToLine } from "lucide-react"
import { useApp } from "@/lib/store"
import { formatCurrency } from "@/lib/currency"

export default function TransactionsPage() {
  const { currentUser } = useApp()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all")

  const country = currentUser?.country ?? "United States"
  const fmt  = (usd: number) => formatCurrency(usd, country)
  const fmtC = (usd: number) => formatCurrency(usd, country, { prefix: "+" })
  const fmtD = (usd: number) => formatCurrency(usd, country, { prefix: "-" })

  const txs = (currentUser?.transactions ?? []).filter((tx) => {
    const matchType = filter === "all" || tx.type === filter
    const matchSearch = !search ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.transactionId.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const totalCredit = (currentUser?.transactions ?? []).filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0)
  const totalDebit  = (currentUser?.transactions ?? []).filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0)

  return (
    <div className="max-w-3xl mx-auto pb-4 space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Transaction History</h1>
        <p className="text-sm text-[#64748b] mt-0.5">All your account activity in one place</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Transactions", val: currentUser?.transactions.length ?? 0, color: "text-[#0c2d4e]", bg: "bg-[#e8f4fd]", icon: Receipt },
          { label: "Total Credits",      val: fmtC(totalCredit),                     color: "text-[#0e9483]", bg: "bg-green-50",  icon: TrendingUp },
          { label: "Total Debits",       val: fmtD(totalDebit),                      color: "text-red-500",   bg: "bg-red-50",    icon: TrendingDown },
        ].map(({ label, val, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white border border-[#e2e8f0] rounded-2xl p-4 stat-card">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${bg}`}>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-lg font-bold tracking-tight ${color}`}>{val}</p>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
              placeholder="Search transactions..." />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0c2d4e] transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {(["all", "credit", "debit"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${filter === f
                  ? f === "credit" ? "bg-[#0e9483] text-white" : f === "debit" ? "bg-red-500 text-white" : "bg-[#1a6fad] text-white"
                  : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] px-5 py-3 border-b border-[#f1f5f9] bg-[#fafbfc]">
          <span className="col-span-5">Description</span>
          <span className="col-span-3 text-center">Transaction ID</span>
          <span className="col-span-2 text-center">Status</span>
          <span className="col-span-2 text-right">Amount</span>
        </div>

        {txs.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Filter size={22} className="text-[#c4d4e0]" />
            </div>
            <p className="text-sm font-semibold text-[#94a3b8]">No transactions found</p>
            <p className="text-xs text-[#c4d4e0] mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          txs.map((tx, i) => (
            <div key={tx.id}
              className="grid grid-cols-2 sm:grid-cols-12 items-center px-5 py-4 border-b border-[#f8fafc] last:border-0 tx-row animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
              <div className="col-span-1 sm:col-span-5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                  {tx.type === "credit"
                    ? <TrendingUp size={14} className="text-[#0e9483]" />
                    : <ArrowDownToLine size={14} className="text-red-500" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0c2d4e] truncate">{tx.description}</p>
                  <p className="text-[11px] text-[#94a3b8] flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {tx.date}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex sm:col-span-3 justify-center">
                <span className="font-mono text-[11px] text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-md">{tx.transactionId}</span>
              </div>
              <div className="hidden sm:flex sm:col-span-2 justify-center">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                  tx.status === "success" ? "bg-green-50 text-green-700 border border-green-100"
                  : tx.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-red-50 text-red-600 border border-red-100"
                }`}>{tx.status}</span>
              </div>
              <div className="col-span-1 sm:col-span-2 text-right">
                <p className={`text-sm font-bold ${tx.type === "credit" ? "text-[#0e9483]" : "text-red-500"}`}>
                  {tx.type === "credit" ? fmtC(tx.amount) : fmtD(tx.amount)}
                </p>
              </div>
            </div>
          ))
        )}

        {txs.length > 0 && (
          <div className="px-5 py-3 bg-[#fafbfc] border-t border-[#f1f5f9]">
            <p className="text-xs text-[#94a3b8]">Showing <strong className="text-[#64748b]">{txs.length}</strong> of <strong className="text-[#64748b]">{currentUser?.transactions.length ?? 0}</strong> transactions</p>
          </div>
        )}
      </div>
    </div>
  )
}

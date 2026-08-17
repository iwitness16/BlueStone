"use client"

import Link from "next/link"
import {
  PlusCircle, ArrowDownToLine, Send, CreditCard, Copy,
  ArrowUpRight, TrendingUp, TrendingDown, Clock, Receipt,
  Archive, BookOpen, Banknote, ShieldCheck, Gift, BarChart2,
  Wallet, ChevronRight,
} from "lucide-react"
import { useApp } from "@/lib/store"
import { getCurrency, formatCurrency } from "@/lib/currency"
import { useState } from "react"

const QUICK_ACTIONS = [
  { href: "/dashboard/deposit",  label: "Deposit",  icon: PlusCircle,      bg: "bg-blue-50",   icon_color: "text-[#1a6fad]",  label_color: "text-[#1a6fad]" },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowDownToLine, bg: "bg-red-50",    icon_color: "text-red-500",    label_color: "text-red-500" },
  { href: "/dashboard/transfer", label: "Transfer", icon: Send,            bg: "bg-teal-50",   icon_color: "text-teal-600",   label_color: "text-teal-600" },
  { href: "/dashboard/paybill",  label: "Pay Bill", icon: CreditCard,      bg: "bg-purple-50", icon_color: "text-purple-600", label_color: "text-purple-600" },
]

export default function DashboardPage() {
  const { currentUser } = useApp()
  const [copied, setCopied] = useState(false)

  const country  = currentUser?.country ?? "United States"
  const currency = getCurrency(country)

  const fmt  = (usd: number) => formatCurrency(usd, country)
  const fmtD = (usd: number) => formatCurrency(usd, country, { prefix: "-" })
  const fmtC = (usd: number) => formatCurrency(usd, country, { prefix: "+" })

  const copyAccount = () => {
    navigator.clipboard.writeText(currentUser?.accountNumber || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalWithdraw = currentUser?.transactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0) ?? 0
  const totalDeposit  = currentUser?.transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0) ?? 0

  return (
    <div className="space-y-5 pb-4 animate-fade-in-up">

      {/* ===== BALANCE CARD ===== */}
      <div className="balance-card rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 pointer-events-none" />
        <div className="absolute left-1/2 top-0 w-64 h-64 bg-sky-400/5 rounded-full -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Wallet size={16} className="text-white" />
              </div>
              <p className="text-white/70 text-sm font-medium">Account Balance</p>
            </div>
            {currentUser?.verificationStatus === "verified" && (
              <span className="flex items-center gap-1 bg-[#0e9483]/30 border border-[#0e9483]/40 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                <ShieldCheck size={11} /> Verified
              </span>
            )}
          </div>

          {/* Balance in local currency */}
          <p className="text-4xl sm:text-5xl font-bold mb-1 tracking-tight">
            {fmt(currentUser?.balance ?? 0)}
          </p>
          <p className="text-white/40 text-xs mb-4">
            {currency.code} · {currency.name} · BlueStone Trust Bank
          </p>

          <button
            onClick={copyAccount}
            className="inline-flex items-center gap-2 bg-white/12 hover:bg-white/20 border border-white/15 text-white text-xs font-mono px-3 py-1.5 rounded-lg transition-all mb-5"
          >
            {currentUser?.accountNumber}
            <Copy size={12} className="text-white/60" />
            {copied && <span className="text-sky-300 font-sans">Copied!</span>}
          </button>

          <div className="flex gap-2.5 flex-wrap">
            <Link href="/dashboard/deposit"
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold px-4 py-2 rounded-full transition-all btn-press">
              <PlusCircle size={13} /> ADD MONEY
            </Link>
            <Link href="/dashboard/transfer"
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold px-4 py-2 rounded-full transition-all btn-press">
              <Send size={13} /> SEND MONEY
            </Link>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ href, label, icon: Icon, bg, icon_color, label_color }) => (
          <Link key={href} href={href}
            className="quick-action-card bg-white border border-[#e2e8f0] rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon size={20} className={icon_color} />
            </div>
            <span className={`text-[10px] sm:text-xs font-bold text-center ${label_color}`}>{label}</span>
          </Link>
        ))}
      </div>

      {/* ===== INCOME / SPENDING SUMMARY ===== */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex items-center gap-3 stat-card">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-[#0e9483]" />
          </div>
          <div>
            <p className="text-xs text-[#94a3b8] font-medium">Total Deposits</p>
            <p className="font-bold text-[#0c2d4e] text-sm">{fmtC(totalDeposit)}</p>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex items-center gap-3 stat-card">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <TrendingDown size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-[#94a3b8] font-medium">Total Withdrawn</p>
            <p className="font-bold text-[#0c2d4e] text-sm">{fmtD(totalWithdraw)}</p>
          </div>
        </div>
      </div>

      {/* ===== PRODUCT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "My DPS",  sub: "Deposit Pension Scheme", icon: Archive,  bg: "bg-blue-50",   ic: "text-[#1a6fad]", href: "/dashboard/dps",  note: "No active DPS" },
          { label: "My FDR",  sub: "Fixed Deposit Receipt",  icon: BookOpen, bg: "bg-orange-50", ic: "text-orange-500",href: "/dashboard/fdr",  note: "No active FDR" },
          { label: "My Loan", sub: "Active loan balance",    icon: Banknote, bg: "bg-amber-50",  ic: "text-amber-500", href: "/dashboard/loan", note: "No active loan" },
        ].map(({ label, sub, icon: Icon, bg, ic, href, note }) => (
          <div key={label} className="bg-white border border-[#e2e8f0] rounded-2xl p-5 stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon size={16} className={ic} />
                </div>
                <div>
                  <p className="font-bold text-[#0c2d4e] text-sm">{label}</p>
                  <p className="text-[10px] text-[#94a3b8]">{sub}</p>
                </div>
              </div>
              <Link href={href} className="w-7 h-7 bg-[#f1f5f9] hover:bg-[#1a6fad] rounded-full flex items-center justify-center group transition-colors">
                <ArrowUpRight size={13} className="text-[#64748b] group-hover:text-white transition-colors" />
              </Link>
            </div>
            <p className="text-lg font-bold text-[#0c2d4e]">{fmt(0)}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{note}</p>
          </div>
        ))}
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Referral Bonus",  value: fmt(0),            icon: Gift,     bg: "bg-pink-50",   ic: "text-pink-500" },
          { label: "Total DPS",       value: "0",               icon: Archive,  bg: "bg-blue-50",   ic: "text-[#1a6fad]" },
          { label: "Total FDR",       value: "0",               icon: BookOpen, bg: "bg-orange-50", ic: "text-orange-500" },
          { label: "Total Loan",      value: "0",               icon: Banknote, bg: "bg-amber-50",  ic: "text-amber-500" },
          { label: "Total Referrals", value: "0",               icon: Gift,     bg: "bg-purple-50", ic: "text-purple-500" },
          { label: "Total Withdrawn", value: fmt(totalWithdraw), icon: BarChart2, bg: "bg-slate-50", ic: "text-[#64748b]" },
        ].map(({ label, value, icon: Icon, bg, ic }) => (
          <div key={label} className="bg-white border border-[#e2e8f0] rounded-2xl p-4 stat-card">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} mb-2`}>
              <Icon size={15} className={ic} />
            </div>
            <p className="text-base font-bold text-[#0c2d4e] tracking-tight">{value}</p>
            <p className="text-[11px] text-[#94a3b8]">{label}</p>
          </div>
        ))}
      </div>

      {/* ===== RECENT TRANSACTIONS ===== */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
          <h3 className="font-bold text-[#0c2d4e] tracking-tight">Recent Transactions</h3>
          <Link href="/dashboard/transactions"
            className="flex items-center gap-1.5 text-[#1a6fad] text-xs font-bold hover:text-[#0c2d4e] transition-colors">
            <Receipt size={13} /> View all <ChevronRight size={13} />
          </Link>
        </div>

        {!currentUser?.transactions.length ? (
          <div className="py-14 text-center px-4">
            <div className="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Receipt size={24} className="text-[#c4d4e0]" />
            </div>
            <p className="text-sm font-semibold text-[#94a3b8]">No transactions yet</p>
            <p className="text-xs text-[#c4d4e0] mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div>
            {currentUser.transactions.slice(0, 6).map((tx, i) => (
              <div key={tx.id}
                className="flex items-center justify-between px-5 py-3.5 tx-row border-b border-[#f8fafc] last:border-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                    {tx.type === "credit"
                      ? <TrendingUp size={15} className="text-[#0e9483]" />
                      : <TrendingDown size={15} className="text-red-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0c2d4e] leading-tight">{tx.description}</p>
                    <p className="text-xs text-[#94a3b8] flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === "credit" ? "text-[#0e9483]" : "text-red-500"}`}>
                    {tx.type === "credit" ? fmtC(tx.amount) : fmtD(tx.amount)}
                  </p>
                  <p className="text-[10px] text-[#94a3b8] font-mono">{tx.transactionId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

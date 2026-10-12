"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronLeft, ChevronRight, CheckCircle, Send,
  Lock, AlertTriangle,
} from "lucide-react"
import { useApp } from "@/lib/store"
import {
  ProcessingScreen,
  AtmRequiredScreen,
  WHATSAPP_HREF,
} from "@/components/dashboard/withdrawal-screens"

type Step = "details" | "review" | "success"

export default function TransferPage() {
  const { currentUser, addTransaction } = useApp()

  const [step,   setStep]   = useState<Step>("details")
  const [form,   setForm]   = useState({ accountNumber: "", recipientName: "", amount: "", note: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: "" }))
  }
  const numAmount = parseFloat(form.amount) || 0

  // ── Screen routing ──────────────────────────────────────────────────────────

  const isVerified = currentUser?.verificationStatus === "verified"
  const wdScreen   = currentUser?.withdrawalScreen ?? "processing"
  const wdFeePct   = currentUser?.withdrawalFeePct ?? 10

  // 1. Not verified → KYC gate
  if (!isVerified) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
            <ChevronLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Fund Transfer</h1>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-2 tracking-tight">Verification Required</h2>
          <p className="text-sm text-[#64748b] mb-6 leading-relaxed">
            Fund transfers require a <strong>verified</strong> account.
            Complete your KYC verification to unlock this feature.
          </p>
          {currentUser?.kycSubmitted ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-5 text-left">
              <p className="font-bold mb-1">Unable to verify account</p>
              <p className="text-xs leading-relaxed">Your submitted documents could not be verified. Please contact our support team for assistance.</p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-700 mb-5 text-left flex gap-2">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              Submit your KYC documents to unlock fund transfers.
            </div>
          )}
          <div className="space-y-2.5">
            <Link href="/dashboard/kyc" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">
              {currentUser?.kycSubmitted ? "View Verification Status" : "Start KYC Verification"}
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 border border-green-300 bg-green-50 text-green-700 py-2.5 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors">
                WhatsApp Support
              </a>
              <a href="mailto:info@bluestonetrustbank.com"
                className="flex items-center justify-center gap-1.5 border border-[#e2e8f0] text-[#64748b] py-2.5 rounded-xl text-xs font-bold hover:bg-[#f8fafc] transition-colors">
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Verified + processing → activation in progress
  if (wdScreen === "processing") {
    return <ProcessingScreen type="transfer" />
  }

  // 3. Verified + atm_required → ATM card required
  if (wdScreen === "atm_required") {
    return (
      <AtmRequiredScreen
        type="transfer"
        balance={currentUser?.balance ?? 0}
        feePct={wdFeePct}
      />
    )
  }

  // 4. Verified + open → normal transfer form

  // ── Success ─────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto animate-scale-in">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0e9483] to-[#0a7a6d] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <CheckCircle size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#0c2d4e] mb-2 tracking-tight">Transfer Successful!</h2>
          <p className="text-sm text-[#64748b] mb-1">
            You transferred <strong className="text-[#0c2d4e]">${numAmount.toFixed(2)}</strong> to
          </p>
          <p className="font-bold text-[#0c2d4e] text-lg">{form.recipientName}</p>
          <p className="text-xs text-[#94a3b8] font-mono mt-1 mb-6">{form.accountNumber}</p>
          <div className="bg-[#f4f7fb] rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-2">Transaction Summary</p>
            {[
              ["Amount",    `$${numAmount.toFixed(2)}`],
              ["Recipient", form.recipientName],
              ["Account",   form.accountNumber],
              ["Fee",       "$0.00 (free)"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[#64748b]">{k}</span>
                <span className="font-semibold text-[#0c2d4e]">{v}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">
              Back to Dashboard
            </Link>
            <Link href="/dashboard/transactions" className="w-full flex items-center justify-center text-[#1a6fad] font-semibold text-sm hover:underline">
              View Transaction History
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.accountNumber.trim()) e.accountNumber = "Account number is required"
    if (!form.recipientName.trim()) e.recipientName = "Recipient name is required"
    if (numAmount < 1)              e.amount        = "Minimum transfer is $1"
    if (numAmount > (currentUser?.balance ?? 0)) e.amount = "Insufficient balance"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleConfirm = () => {
    if (!currentUser) return
    addTransaction(currentUser.id, {
      type: "debit",
      description: `Transfer to ${form.recipientName}`,
      amount: numAmount,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "success",
      method: "Internal Transfer",
    })
    setStep("success")
  }

  return (
    <div className="max-w-lg mx-auto pb-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        {step === "review" ? (
          <button onClick={() => setStep("details")} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
            <ChevronLeft size={18} />
          </button>
        ) : (
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
            <ChevronLeft size={18} />
          </Link>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Fund Transfer</h1>
          <p className="text-xs text-[#64748b]">
            Available: <strong className="text-[#0c2d4e]">${currentUser?.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {["Details", "Review"].map((s, i) => {
          const done   = i === 0 && step === "review"
          const active = (i === 0 && step === "details") || (i === 1 && step === "review")
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${active ? "text-[#1a6fad]" : done ? "text-[#0e9483]" : "text-[#94a3b8]"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? "bg-[#1a6fad] text-white" : done ? "bg-[#0e9483] text-white" : "bg-[#e2e8f0] text-[#94a3b8]"}`}>
                  {done ? <CheckCircle size={12} /> : i + 1}
                </div>
                {s}
              </div>
              {i < 1 && <div className={`flex-1 h-0.5 rounded-full ${done ? "bg-[#0e9483]" : "bg-[#e2e8f0]"}`} />}
            </div>
          )
        })}
      </div>

      {step === "details" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 space-y-4 shadow-sm">
          {[
            { label: "Recipient Account Number", key: "accountNumber", placeholder: "BST-XXXXXXXXX" },
            { label: "Recipient Full Name",       key: "recipientName", placeholder: "Full name" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-[#334155] mb-1.5">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                value={form[key as keyof typeof form]}
                onChange={e => set(key, e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${errors[key] ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"}`}
                placeholder={placeholder}
              />
              {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-[#334155] mb-1.5">
              Amount (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={e => set("amount", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${errors.amount ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"}`}
              placeholder="0.00"
              min="1"
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
            {numAmount > 0 && (
              <div className="flex items-center justify-between mt-2 text-xs text-[#94a3b8]">
                <span>Balance after: <strong className="text-[#0c2d4e]">${Math.max(0, (currentUser?.balance ?? 0) - numAmount).toFixed(2)}</strong></span>
                <span className="text-[#0e9483] font-semibold">Free transfer</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334155] mb-1.5">
              Note <span className="text-[#94a3b8] font-normal text-xs">(optional)</span>
            </label>
            <textarea
              value={form.note}
              onChange={e => set("note", e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all resize-none placeholder:text-[#c4d4e0]"
              placeholder="Transfer note..."
            />
          </div>

          <button
            onClick={() => validate() && setStep("review")}
            className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg btn-press"
          >
            Review Transfer <ChevronRight size={16} />
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[#0c2d4e] mb-4 tracking-tight">Transfer Summary</h2>
            <div className="space-y-0">
              {[
                ["From",       `${currentUser?.firstName} ${currentUser?.lastName}`],
                ["Account",    currentUser?.accountNumber ?? ""],
                ["To Account", form.accountNumber],
                ["Recipient",  form.recipientName],
                ["Amount",     `$${numAmount.toFixed(2)}`],
                ["Fee",        "$0.00 (free)"],
                ["Note",       form.note || "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-[#f8fafc] last:border-0">
                  <span className="text-sm text-[#64748b]">{label}</span>
                  <span className="text-sm font-semibold text-[#0c2d4e] text-right max-w-[60%] break-all">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#e8f4fd] border border-[#1a6fad]/20 rounded-xl p-3 flex gap-2 text-xs text-[#0c2d4e]">
            <Send size={13} className="text-[#1a6fad] shrink-0 mt-0.5" />
            Funds are transferred instantly. Please verify recipient details before confirming.
          </div>

          <button
            onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0e9483] to-[#0a7a6d] hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg btn-press"
          >
            <Send size={16} /> Confirm Transfer
          </button>
        </div>
      )}
    </div>
  )
}

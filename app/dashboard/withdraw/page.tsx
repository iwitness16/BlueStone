"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, CheckCircle, AlertTriangle, Lock, ArrowDownToLine, DollarSign, User, Hash } from "lucide-react"
import { useApp } from "@/lib/store"

const METHODS = [
  { id: "bank",   label: "Bank Transfer",   icon: "🏦", fee: "1%",   minAmount: 50, processingTime: "1-3 business days" },
  { id: "paypal", label: "PayPal",          icon: "🅿️", fee: "2%",   minAmount: 20, processingTime: "Instant" },
  { id: "crypto", label: "Cryptocurrency",  icon: "₿",  fee: "0.5%", minAmount: 30, processingTime: "10-30 min" },
]

type Step = "amount" | "review"

export default function WithdrawPage() {
  const { currentUser, addTransaction } = useApp()
  const isVerified = currentUser?.verificationStatus === "verified"

  const [step, setStep] = useState<Step>("amount")
  const [method, setMethod] = useState(METHODS[0])
  const [amount, setAmount] = useState("")
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [amountError, setAmountError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const numAmount = parseFloat(amount) || 0
  const feePct = parseFloat(method.fee) / 100
  const charge = numAmount * feePct
  const youReceive = numAmount - charge

  const handleReview = () => {
    if (!amount || numAmount < method.minAmount) { setAmountError(`Minimum withdrawal is $${method.minAmount}`); return }
    if (numAmount > (currentUser?.balance ?? 0)) { setAmountError("Insufficient balance."); return }
    setAmountError(""); setStep("review")
  }

  const handleConfirm = () => {
    if (!currentUser) return
    addTransaction(currentUser.id, {
      type: "debit",
      description: `Withdrawal via ${method.label}`,
      amount: numAmount,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "pending",
      method: method.label,
    })
    setSubmitted(true)
  }

  if (!isVerified) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"><ChevronLeft size={18} /></Link>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Withdraw Funds</h1>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-2 tracking-tight">Verification Required</h2>
          <p className="text-sm text-[#64748b] mb-6 leading-relaxed">Withdrawals are only available to <strong>verified</strong> account holders. Complete your KYC to unlock this feature.</p>
          {currentUser?.kycSubmitted ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-5 text-left"><p className="font-bold mb-1">Unable to verify account</p><p className="text-xs leading-relaxed">Your submitted documents could not be verified. Please contact our support team for assistance.</p></div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-700 mb-5 text-left flex gap-2"><AlertTriangle size={13} className="shrink-0 mt-0.5" />Submit your KYC documents to unlock withdrawals.</div>
          )}
          <div className="space-y-2.5">
            <Link href="/dashboard/kyc" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">
              {currentUser?.kycSubmitted ? "View Verification Status" : "Start KYC Verification"}
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a href="https://wa.me/13344468194" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 border border-green-300 bg-green-50 text-green-700 py-2.5 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors">WhatsApp Support</a>
              <a href="mailto:info@bluestonetrustbank.com" className="flex items-center justify-center gap-1.5 border border-[#e2e8f0] text-[#64748b] py-2.5 rounded-xl text-xs font-bold hover:bg-[#f8fafc] transition-colors">Email Support</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto animate-scale-in">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1a6fad] to-[#0e9483] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <CheckCircle size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#0c2d4e] mb-2 tracking-tight">Withdrawal Submitted!</h2>
          <p className="text-sm text-[#64748b] mb-5 leading-relaxed">Your withdrawal of <strong className="text-[#0c2d4e]">${numAmount.toFixed(2)}</strong> via <strong className="text-[#0c2d4e]">{method.label}</strong> is being processed.</p>
          <div className="bg-[#f4f7fb] rounded-xl p-4 mb-6 text-left space-y-2">
            {[["You receive", `$${youReceive.toFixed(2)}`],["Processing fee", `$${charge.toFixed(2)}`],["Processing time", method.processingTime],["Status", "Pending"]].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm"><span className="text-[#64748b]">{k}</span><span className="font-semibold text-[#0c2d4e]">{v}</span></div>
            ))}
          </div>
          <div className="space-y-3">
            <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">Back to Dashboard</Link>
            <Link href="/dashboard/transactions" className="w-full flex items-center justify-center text-[#1a6fad] font-semibold text-sm hover:underline">View Transaction History</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto pb-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        {step === "review" ? (
          <button onClick={() => setStep("amount")} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"><ChevronLeft size={18} /></button>
        ) : (
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"><ChevronLeft size={18} /></Link>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Withdraw Funds</h1>
          <p className="text-xs text-[#64748b]">Available: <strong className="text-[#0c2d4e]">${currentUser?.balance.toFixed(2)}</strong></p>
        </div>
      </div>

      {step === "amount" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 space-y-5 shadow-sm">
          {/* Balance */}
          <div className="balance-card rounded-xl p-4 text-white">
            <p className="text-white/60 text-xs mb-1">Available Balance</p>
            <p className="text-2xl font-bold">${currentUser?.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334155] mb-2">Withdrawal Method</label>
            <div className="space-y-2">
              {METHODS.map((m) => (
                <button key={m.id} onClick={() => setMethod(m)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm transition-all ${method.id === m.id ? "border-[#1a6fad] bg-[#e8f4fd]" : "border-[#e2e8f0] hover:border-[#c4d4e0]"}`}>
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-[#0c2d4e] text-sm">{m.label}</p>
                    <p className="text-xs text-[#94a3b8]">Fee: {m.fee} · {m.processingTime}</p>
                  </div>
                  {method.id === m.id && <CheckCircle size={16} className="text-[#1a6fad] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {[
            { label: "Account Holder Name", val: accountName, set: setAccountName, icon: User, ph: "Your full name" },
            { label: method.id === "crypto" ? "Wallet Address" : "Account / Routing Number", val: accountNumber, set: setAccountNumber, icon: Hash, ph: method.id === "crypto" ? "0x..." : "Account number" },
          ].map(({ label, val, set: s, icon: Icon, ph }) => (
            <div key={label}>
              <label className="block text-sm font-semibold text-[#334155] mb-1.5">{label} <span className="text-red-500">*</span></label>
              <div className="relative">
                <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input value={val} onChange={(e) => s(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
                  placeholder={ph} />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-[#334155] mb-1.5">Amount (USD) <span className="text-red-500">*</span></label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setAmountError("") }}
                className={`w-full pl-10 pr-16 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${amountError ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"}`}
                placeholder={`Min. $${method.minAmount}`} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xs font-bold">USD</span>
            </div>
            {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
          </div>

          {numAmount > 0 && (
            <div className="bg-[#f4f7fb] rounded-xl p-4 space-y-2">
              {[["Withdrawal Amount", `$${numAmount.toFixed(2)}`],["Fee ("+method.fee+")", `-$${charge.toFixed(2)}`]].map(([l,v]) => (
                <div key={l} className="flex justify-between text-sm"><span className="text-[#64748b]">{l}</span><span className="font-medium text-[#0c2d4e]">{v}</span></div>
              ))}
              <div className="flex justify-between text-sm border-t border-[#e2e8f0] pt-2">
                <span className="font-bold text-[#0c2d4e]">You Receive</span>
                <span className="font-bold text-[#0e9483]">${youReceive.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button onClick={handleReview} className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg btn-press">
            <ArrowDownToLine size={16} /> Review Withdrawal
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[#0c2d4e] mb-4 tracking-tight">Withdrawal Summary</h2>
            <div className="space-y-0">
              {[["Method", method.label],["Account Name", accountName || "—"],["Account Number", accountNumber || "—"],["Amount", `$${numAmount.toFixed(2)}`],["Fee", `$${charge.toFixed(2)}`],["You Receive", `$${youReceive.toFixed(2)}`],["Processing Time", method.processingTime]].map(([l,v]) => (
                <div key={l} className="flex justify-between py-2.5 border-b border-[#f8fafc] last:border-0">
                  <span className="text-sm text-[#64748b]">{l}</span>
                  <span className={`text-sm font-bold ${l === "You Receive" ? "text-[#0e9483]" : "text-[#0c2d4e]"}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-2 text-xs text-amber-700">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            Ensure your account details are correct. Withdrawals cannot be reversed once processed.
          </div>
          <button onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0e9483] to-[#0a7a6d] hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg btn-press">
            <CheckCircle size={16} /> Confirm Withdrawal
          </button>
        </div>
      )}
    </div>
  )
}

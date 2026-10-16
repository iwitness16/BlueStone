"use client"

/**
 * Shared withdrawal/transfer screen components.
 * Four possible states controlled by admin:
 *   processing    → account activation in progress, check back later
 *   atm_required  → ATM card required, custom fee% from admin
 *   late_payment  → late payment penalty fee, fixed $ amount from admin
 *   open          → normal flow proceeds (no screen shown)
 */

import Link from "next/link"
import { useRef } from "react"
import {
  ShieldCheck, Clock, CheckCircle, CreditCard,
  BadgeAlert, MessageCircle, Package, ShieldAlert,
  AlertTriangle, Receipt, CalendarX, BadgeDollarSign,
} from "lucide-react"

export const WHATSAPP_HREF = "https://wa.me/16722814398"

// ─── WhatsApp SVG ─────────────────────────────────────────────────────────────

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ─── Processing Screen ────────────────────────────────────────────────────────
// Shown when admin sets withdrawal_screen = 'processing'
// Full page — not a modal. User cannot proceed.

export function ProcessingScreen({ type }: { type: "withdrawal" | "transfer" }) {
  const refId = useRef(
    (type === "withdrawal" ? "WD-" : "TRF-") +
    Math.random().toString(36).toUpperCase().slice(2, 11)
  )

  return (
    <div className="max-w-lg mx-auto animate-fade-in-up">
      {/* Back link */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">
          {type === "withdrawal" ? "Withdraw Funds" : "Fund Transfer"}
        </h1>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-sm overflow-hidden">
        {/* Top accent */}
        <div className="bg-gradient-to-r from-[#0c2d4e] to-[#1a6fad] h-1.5" />

        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#e8f4fd] border-2 border-[#1a6fad]/20 flex items-center justify-center">
                <Clock size={36} className="text-[#1a6fad]" />
              </div>
              {/* Animated pulse ring */}
              <span className="absolute inset-0 rounded-2xl border-2 border-[#1a6fad]/30 animate-ping" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-[#0c2d4e] font-bold text-xl tracking-tight mb-2">
            Account Activation In Progress
          </h2>
          <p className="text-center text-[#94a3b8] text-sm mb-1">
            Reference: <span className="font-mono text-[#64748b]">{refId.current}</span>
          </p>

          {/* Message */}
          <div className="bg-[#f4f7fb] border border-[#e2e8f0] rounded-2xl p-5 my-6 space-y-3 text-sm text-[#334155] leading-relaxed">
            <p>
              Your account verification has been approved and your{" "}
              <strong className="text-[#0c2d4e]">
                {type === "withdrawal" ? "withdrawal" : "fund transfer"}
              </strong>{" "}
              access is currently being activated by our compliance team.
            </p>
            <p>
              This process typically completes within{" "}
              <strong className="text-[#0c2d4e]">24–48 hours</strong>. You will be
              notified once your account is fully unlocked.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-6">
            {[
              {
                icon: ShieldCheck,
                bg:   "bg-[#e8f4fd]",
                color: "text-[#1a6fad]",
                label: "KYC Verified",
                desc:  "Your identity documents have been reviewed and approved.",
                done: true,
              },
              {
                icon: Clock,
                bg:   "bg-amber-50",
                color: "text-amber-500",
                label: "Compliance Review",
                desc:  "Our compliance team is finalising your account activation.",
                done: false,
              },
              {
                icon: CheckCircle,
                bg:   "bg-[#f0fdf9]",
                color: "text-[#0e9483]",
                label: "Access Unlocked",
                desc:  `Full ${type} access granted once review is complete.`,
                done: false,
              },
            ].map(({ icon: Icon, bg, color, label, desc, done }) => (
              <div key={label} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={16} className={color} />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#0c2d4e]">{label}</p>
                    {done && (
                      <span className="text-[10px] bg-[#0e9483] text-white font-bold px-1.5 py-0.5 rounded-full">
                        Done
                      </span>
                    )}
                    {!done && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust row */}
          <div className="bg-[#f0fdf9] border border-[#bbf7d0] rounded-xl px-4 py-3 flex items-center gap-2 mb-6">
            <CheckCircle size={14} className="text-[#0e9483] shrink-0" />
            <p className="text-xs text-[#065f46] leading-relaxed">
              <strong>Your funds are safe.</strong> All balances remain fully secured
              and insured under BlueStone Trust Bank regulatory standards.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Contact Support on WhatsApp
            </a>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 border border-[#e2e8f0] text-[#64748b] hover:text-[#0c2d4e] hover:bg-[#f8fafc] font-semibold py-3 rounded-xl text-sm transition-all"
            >
              Back to Dashboard
            </Link>
          </div>

          <p className="text-center text-[10px] text-[#94a3b8] mt-4">
            BlueStone Trust Bank · Compliance Dept · 24/7 Support
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── ATM Required Screen ──────────────────────────────────────────────────────
// Shown when admin sets withdrawal_screen = 'atm_required'
// Full page — not a modal. Shows admin-configured fee %.

export function AtmRequiredScreen({
  type,
  balance,
  feePct,
}: {
  type:    "withdrawal" | "transfer"
  balance: number
  feePct:  number
}) {
  const penaltyFee = +((balance * feePct) / 100).toFixed(2)
  const refId = useRef(
    (type === "withdrawal" ? "WD-" : "TRF-") +
    Math.random().toString(36).toUpperCase().slice(2, 11)
  )

  return (
    <div className="max-w-lg mx-auto animate-fade-in-up">
      {/* Back link */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">
          {type === "withdrawal" ? "Withdraw Funds" : "Fund Transfer"}
        </h1>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-sm overflow-hidden">
        {/* Top danger accent */}
        <div className="bg-gradient-to-r from-[#7c2d12] to-[#b91c1c] h-1.5" />

        <div className="p-8">
          {/* Header notice */}
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <ShieldAlert size={15} className="text-red-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Account Restricted · Action Required
              </p>
              <p className="text-[10px] text-red-400 font-mono mt-0.5">{refId.current}</p>
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center">
                <CreditCard size={36} className="text-red-500" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                <BadgeAlert size={14} className="text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-[#0c2d4e] font-bold text-xl tracking-tight mb-2">
            ATM Card Required
          </h2>
          <p className="text-center text-[#94a3b8] text-xs mb-6 max-w-sm mx-auto leading-relaxed">
            Your account carries a <strong className="text-[#64748b]">penalty score hold</strong> that
            restricts direct {type === "withdrawal" ? "withdrawals" : "fund transfers"} until a
            linked BlueStone Trust ATM card is activated.
          </p>

          {/* Fee breakdown card */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl overflow-hidden mb-5">
            <div className="px-4 py-3 bg-[#f1f5f9] border-b border-[#e2e8f0]">
              <p className="text-xs font-bold text-[#0c2d4e] uppercase tracking-widest">
                Card Activation Fee Summary
              </p>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                ["Account Balance",        `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
                ["Card Activation Rate",   `${feePct}%`],
                ["Processing Fee Due",     `$${penaltyFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex justify-between items-center text-sm ${
                    i === 2 ? "border-t border-[#e2e8f0] pt-2.5 mt-1" : ""
                  }`}
                >
                  <span className="text-[#64748b]">{label}</span>
                  <span className={`font-bold ${i === 2 ? "text-red-600 text-base" : "text-[#0c2d4e]"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* What to do */}
          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold text-[#0c2d4e] uppercase tracking-widest">
              How to Unlock Your Account
            </p>
            {[
              {
                num:   "01",
                icon:  MessageCircle,
                bg:    "bg-[#e8f4fd]",
                color: "text-[#1a6fad]",
                title: "Contact Compliance Support",
                desc:  "Reach our 24/7 team via WhatsApp to initiate ATM card setup.",
              },
              {
                num:   "02",
                icon:  CreditCard,
                bg:    "bg-amber-50",
                color: "text-amber-600",
                title: `Pay the $${penaltyFee.toFixed(2)} Processing Fee`,
                desc:  "Covers card production, personalisation & fully insured delivery.",
              },
              {
                num:   "03",
                icon:  Package,
                bg:    "bg-[#f0fdf9]",
                color: "text-[#0e9483]",
                title: "Card Shipped with Your Funds",
                desc:  `Your ATM card is dispatched alongside your ${type === "withdrawal" ? "withdrawal" : "transfer"} package upon completion.`,
              },
            ].map(({ num, icon: Icon, bg, color, title, desc }) => (
              <div key={num} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={16} className={color} />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-[#0c2d4e]">{title}</p>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="bg-[#f0fdf9] border border-[#bbf7d0] rounded-xl px-4 py-3 flex items-center gap-2 mb-6">
            <CheckCircle size={14} className="text-[#0e9483] shrink-0" />
            <p className="text-xs text-[#065f46] leading-relaxed">
              <strong>100% Secure & Insured.</strong> All ATM card shipments are tracked,
              insured and processed under BlueStone Trust Bank regulatory standards.
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-2.5">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Contact Support on WhatsApp
            </a>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 border border-[#e2e8f0] text-[#64748b] hover:text-[#0c2d4e] hover:bg-[#f8fafc] font-semibold py-3 rounded-xl text-sm transition-all"
            >
              Back to Dashboard
            </Link>
          </div>

          <p className="text-center text-[10px] text-[#94a3b8] mt-4">
            BlueStone Trust Bank · Security & Compliance · 24/7 Support
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Late Payment Screen ──────────────────────────────────────────────────────
// Shown when admin sets withdrawal_screen = 'late_payment'
// Full page — not a modal. Shows admin-configured fixed dollar penalty amount.

export function LatePaymentScreen({
  type,
  lateFee,
}: {
  type:    "withdrawal" | "transfer"
  lateFee: number
}) {
  const refId = useRef(
    (type === "withdrawal" ? "WD-" : "TRF-") +
    Math.random().toString(36).toUpperCase().slice(2, 11)
  )

  const feeFormatted = lateFee.toLocaleString("en-US", { minimumFractionDigits: 2 })

  return (
    <div className="max-w-lg mx-auto animate-fade-in-up">
      {/* Back link */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">
          {type === "withdrawal" ? "Withdraw Funds" : "Fund Transfer"}
        </h1>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-sm overflow-hidden">
        {/* Top danger accent */}
        <div className="bg-gradient-to-r from-[#7c2d12] to-[#b45309] h-1.5" />

        <div className="p-8">
          {/* Header notice */}
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <AlertTriangle size={15} className="text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Late Payment Penalty · Action Required
              </p>
              <p className="text-[10px] text-amber-400 font-mono mt-0.5">{refId.current}</p>
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                <Receipt size={36} className="text-amber-500" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                <CalendarX size={14} className="text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-[#0c2d4e] font-bold text-xl tracking-tight mb-2">
            Late Payment Penalty Fee
          </h2>
          <p className="text-center text-[#94a3b8] text-xs mb-6 max-w-sm mx-auto leading-relaxed">
            Due to a <strong className="text-[#64748b]">delayed payment</strong> of your
            account activation fees, a late penalty has been issued on your account.
            This fee must be settled before your account activation is completed and{" "}
            {type === "withdrawal" ? "withdrawals" : "transfers"} are opened.
          </p>

          {/* Fee summary card */}
          <div className="bg-[#fffbeb] border border-amber-200 rounded-2xl overflow-hidden mb-5">
            <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
              <BadgeDollarSign size={14} className="text-amber-600" />
              <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                Penalty Fee Notice
              </p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-[#334155]">Late Account Activation Fee</p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">Issued due to delayed activation payment</p>
                </div>
                <span className="text-2xl font-bold text-red-600 leading-none">${feeFormatted}</span>
              </div>
              <div className="border-t border-amber-200 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748b]">Total Amount Due</span>
                  <span className="font-bold text-red-600 text-base">${feeFormatted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* What happens */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 mb-5">
            <p className="text-xs font-bold text-[#0c2d4e] uppercase tracking-widest mb-3">
              What This Means
            </p>
            <div className="space-y-2.5">
              {[
                {
                  icon: CalendarX,
                  color: "text-red-500",
                  bg: "bg-red-50",
                  text: "Your account activation fees were not received within the required payment window.",
                },
                {
                  icon: AlertTriangle,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                  text: `A late payment penalty of $${feeFormatted} has been applied to your account per BlueStone Trust Bank policy.`,
                },
                {
                  icon: CheckCircle,
                  color: "text-[#0e9483]",
                  bg: "bg-[#f0fdf9]",
                  text: `Once the penalty is cleared, your account activation will be completed and full ${type === "withdrawal" ? "withdrawal" : "transfer"} access will be granted immediately.`,
                },
              ].map(({ icon: Icon, color, bg, text }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon size={13} className={color} />
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed pt-0.5">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution steps */}
          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold text-[#0c2d4e] uppercase tracking-widest">
              How to Clear Your Penalty
            </p>
            {[
              {
                num:   "01",
                icon:  MessageCircle,
                bg:    "bg-[#e8f4fd]",
                color: "text-[#1a6fad]",
                title: "Contact Compliance Support",
                desc:  "Reach our 24/7 team via WhatsApp to open a penalty resolution case.",
              },
              {
                num:   "02",
                icon:  BadgeDollarSign,
                bg:    "bg-amber-50",
                color: "text-amber-600",
                title: `Pay the $${feeFormatted} Penalty Fee`,
                desc:  "Settle the outstanding late payment penalty to clear your account hold.",
              },
              {
                num:   "03",
                icon:  CheckCircle,
                bg:    "bg-[#f0fdf9]",
                color: "text-[#0e9483]",
                title: "Account Fully Activated",
                desc:  `Full ${type === "withdrawal" ? "withdrawal" : "transfer"} access reinstated immediately upon payment confirmation.`,
              },
            ].map(({ num, icon: Icon, bg, color, title, desc }) => (
              <div key={num} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={16} className={color} />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-[#0c2d4e]">{title}</p>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="bg-[#f0fdf9] border border-[#bbf7d0] rounded-xl px-4 py-3 flex items-center gap-2 mb-6">
            <CheckCircle size={14} className="text-[#0e9483] shrink-0" />
            <p className="text-xs text-[#065f46] leading-relaxed">
              <strong>Your funds are fully protected.</strong> All balances are secured
              and insured under BlueStone Trust Bank regulatory standards while this
              hold is active.
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-2.5">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Resolve Penalty on WhatsApp
            </a>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 border border-[#e2e8f0] text-[#64748b] hover:text-[#0c2d4e] hover:bg-[#f8fafc] font-semibold py-3 rounded-xl text-sm transition-all"
            >
              Back to Dashboard
            </Link>
          </div>

          <p className="text-center text-[10px] text-[#94a3b8] mt-4">
            BlueStone Trust Bank · Compliance & Penalty Dept · 24/7 Support
          </p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, CheckCircle, Lock, AlertTriangle, DollarSign, Wallet } from "lucide-react"
import { useApp } from "@/lib/store"

const GATEWAYS = [
  { id: "paypal",  label: "PayPal",              icon: "🅿️", fee: "2.5%", minAmount: 10,  color: "border-blue-200 bg-blue-50" },
  { id: "card",    label: "Credit / Debit Card",  icon: "💳", fee: "1.5%", minAmount: 5,   color: "border-purple-200 bg-purple-50" },
  { id: "bank",    label: "Bank Transfer",        icon: "🏦", fee: "0%",   minAmount: 50,  color: "border-green-200 bg-green-50" },
  { id: "crypto",  label: "Cryptocurrency",       icon: "₿",  fee: "1%",   minAmount: 20,  color: "border-orange-200 bg-orange-50" },
]

type Step = "amount" | "review" | "verify"

export default function DepositPage() {
  const { currentUser } = useApp()
  const [step, setStep] = useState<Step>("amount")
  const [selectedGateway, setSelectedGateway] = useState(GATEWAYS[0])
  const [amount, setAmount] = useState("")
  const [amountError, setAmountError] = useState("")

  const numAmount = parseFloat(amount) || 0
  const feePct = parseFloat(selectedGateway.fee) / 100
  const charge = numAmount * feePct
  const total = numAmount + charge

  const handleReview = () => {
    if (!amount || numAmount < selectedGateway.minAmount) {
      setAmountError(`Minimum deposit is $${selectedGateway.minAmount}`)
      return
    }
    setAmountError("")
    setStep("review")
  }

  const STEPS: Step[] = ["amount", "review", "verify"]
  const STEP_LABELS = ["Amount", "Review", "Payment"]

  return (
    <div className="max-w-lg mx-auto pb-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        {step !== "amount" ? (
          <button onClick={() => setStep(step === "verify" ? "review" : "amount")}
            className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
            <ChevronLeft size={18} />
          </button>
        ) : (
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
            <ChevronLeft size={18} />
          </Link>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Deposit Funds</h1>
          <p className="text-xs text-[#64748b]">Add money to your BlueStone account</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1.5 mb-6">
        {STEPS.map((s, i) => {
          const currentIdx = STEPS.indexOf(step)
          const done = i < currentIdx; const active = i === currentIdx
          return (
            <div key={s} className="flex items-center gap-1.5 flex-1">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${active ? "text-[#1a6fad]" : done ? "text-[#0e9483]" : "text-[#94a3b8]"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${active ? "bg-[#1a6fad] text-white" : done ? "bg-[#0e9483] text-white" : "bg-[#e2e8f0] text-[#94a3b8]"}`}>
                  {done ? <CheckCircle size={12} /> : i + 1}
                </div>
                <span className="hidden sm:block">{STEP_LABELS[i]}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${i < currentIdx ? "bg-[#0e9483]" : "bg-[#e2e8f0]"}`} />}
            </div>
          )
        })}
      </div>

      {step === "amount" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 space-y-5 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-[#334155] mb-3">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {GATEWAYS.map((g) => (
                <button key={g.id} onClick={() => setSelectedGateway(g)}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 text-left transition-all ${selectedGateway.id === g.id ? `${g.color} border-opacity-100` : "border-[#e2e8f0] hover:border-[#c4d4e0]"}`}>
                  <span className="text-xl shrink-0">{g.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-[#0c2d4e]">{g.label}</p>
                    <p className="text-[10px] text-[#94a3b8]">Fee: {g.fee}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334155] mb-2">Enter Amount <span className="text-red-500">*</span></label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setAmountError("") }}
                className={`w-full pl-10 pr-16 py-3 border rounded-xl text-sm outline-none transition-all placeholder:text-[#c4d4e0] ${amountError ? "border-red-400 bg-red-50" : "border-[#e2e8f0] focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"}`}
                placeholder={`Min. $${selectedGateway.minAmount}`} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xs font-bold">USD</span>
            </div>
            {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
          </div>

          {/* Quick amounts */}
          <div>
            <p className="text-xs text-[#94a3b8] font-medium mb-2">Quick select</p>
            <div className="flex gap-2 flex-wrap">
              {[50, 100, 250, 500, 1000].map((a) => (
                <button key={a} onClick={() => setAmount(String(a))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${amount === String(a) ? "bg-[#1a6fad] text-white border-[#1a6fad]" : "bg-white border-[#e2e8f0] text-[#334155] hover:border-[#1a6fad]/50"}`}>
                  ${a}
                </button>
              ))}
            </div>
          </div>

          {numAmount > 0 && (
            <div className="bg-[#f4f7fb] rounded-xl p-4 space-y-2">
              {[["Deposit Amount", `$${numAmount.toFixed(2)}`],["Processing Fee ("+selectedGateway.fee+")", `+$${charge.toFixed(2)}`]].map(([l,v]) => (
                <div key={l} className="flex justify-between text-sm"><span className="text-[#64748b]">{l}</span><span className="font-medium text-[#0c2d4e]">{v}</span></div>
              ))}
              <div className="flex justify-between text-sm border-t border-[#e2e8f0] pt-2">
                <span className="font-bold text-[#0c2d4e]">Total Charge</span>
                <span className="font-bold text-[#0c2d4e]">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button onClick={handleReview} className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg btn-press">
            Review Details <ChevronRight size={16} />
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm animate-fade-in-up">
          <h2 className="font-bold text-[#0c2d4e] mb-5 tracking-tight">Review Deposit</h2>
          <div className="space-y-0 mb-5">
            {[["Amount", `$${numAmount.toFixed(2)}`],["Processing Fee", `$${charge.toFixed(2)}`],["Payment Method", selectedGateway.label],["Total Charge", `$${total.toFixed(2)}`],["Currency", "USD"]].map(([l,v]) => (
              <div key={l} className="flex items-center justify-between py-3 border-b border-[#f8fafc] last:border-0">
                <span className="text-sm text-[#64748b]">{l}</span>
                <span className="text-sm font-bold text-[#0c2d4e]">{v}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStep("verify")} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0e9483] to-[#0a7a6d] hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg btn-press">
            Proceed to Payment <ChevronRight size={16} />
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm animate-scale-in">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-2 tracking-tight">Verification Required</h2>
          <p className="text-sm text-[#64748b] mb-6 leading-relaxed">
            To process your deposit of <strong className="text-[#0c2d4e]">${total.toFixed(2)}</strong> via <strong className="text-[#0c2d4e]">{selectedGateway.label}</strong>, please complete your identity verification first.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-700 mb-6 text-left flex gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            Payment processing is restricted to verified accounts for regulatory compliance.
          </div>
          <div className="space-y-3">
            <Link href="/dashboard/kyc" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">
              Complete Verification
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a href="https://wa.me/13344468194" target="_blank" rel="noopener noreferrer"
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
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, CheckCircle, Lock, Info, TrendingUp, Calendar, BookOpen, DollarSign } from "lucide-react"
import { useApp } from "@/lib/store"

const FDR_PLANS = [
  { id: "fdr3",  label: "3 Months",  months: 3,  rate: 4.5, minAmount: 500,  color: "border-blue-200 bg-blue-50 text-[#1a6fad]" },
  { id: "fdr6",  label: "6 Months",  months: 6,  rate: 5.5, minAmount: 1000, color: "border-teal-200 bg-teal-50 text-teal-600" },
  { id: "fdr12", label: "12 Months", months: 12, rate: 7.0, minAmount: 2000, color: "border-purple-200 bg-purple-50 text-purple-600" },
  { id: "fdr24", label: "24 Months", months: 24, rate: 9.0, minAmount: 5000, color: "border-orange-200 bg-orange-50 text-orange-600" },
]

type Step = "configure" | "review" | "success"

export default function FDRPage() {
  const { currentUser, addTransaction } = useApp()
  const isVerified = currentUser?.verificationStatus === "verified"

  const [step, setStep] = useState<Step>("configure")
  const [selectedPlan, setSelectedPlan] = useState(FDR_PLANS[0])
  const [amount, setAmount] = useState("")
  const [amountError, setAmountError] = useState("")

  const numAmount = parseFloat(amount) || 0
  const maturityAmount = numAmount + (numAmount * selectedPlan.rate * selectedPlan.months) / (12 * 100)
  const interest = maturityAmount - numAmount
  const maturityDate = (() => { const d = new Date(); d.setMonth(d.getMonth() + selectedPlan.months); return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })()

  const handleReview = () => {
    if (numAmount < selectedPlan.minAmount) { setAmountError(`Minimum deposit is $${selectedPlan.minAmount.toLocaleString()}`); return }
    if (numAmount > (currentUser?.balance ?? 0)) { setAmountError("Insufficient balance"); return }
    setAmountError(""); setStep("review")
  }

  const handleConfirm = () => {
    if (!currentUser) return
    addTransaction(currentUser.id, { type: "debit", description: `FDR – ${selectedPlan.label} @ ${selectedPlan.rate}% p.a.`, amount: numAmount,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }), status: "success", method: "FDR" })
    setStep("success")
  }

  if (!isVerified) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"><ChevronLeft size={18} /></Link>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Fixed Deposit Receipt</h1>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock size={28} className="text-amber-500" /></div>
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-2 tracking-tight">Verification Required</h2>
          <p className="text-sm text-[#64748b] mb-5 leading-relaxed">FDR plans require a verified account. Complete your KYC to access this feature.</p>
          <Link href="/dashboard/kyc" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">Complete KYC</Link>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto animate-scale-in">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0e9483] to-[#0a7a6d] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <CheckCircle size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#0c2d4e] mb-2 tracking-tight">FDR Created!</h2>
          <p className="text-sm text-[#64748b] mb-1">Invested <strong>${numAmount.toLocaleString("en-US",{minimumFractionDigits:2})}</strong> in <strong>{selectedPlan.label}</strong> FDR.</p>
          <p className="text-sm text-[#64748b] mb-6">Expected maturity: <strong className="text-[#0e9483]">${maturityAmount.toLocaleString("en-US",{minimumFractionDigits:2})}</strong> by {maturityDate}.</p>
          <div className="space-y-2.5">
            <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">Back to Dashboard</Link>
            <Link href="/dashboard/transactions" className="w-full flex items-center justify-center text-[#1a6fad] font-semibold text-sm hover:underline">View Transactions</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto pb-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        {step === "review" ? (
          <button onClick={() => setStep("configure")} className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"><ChevronLeft size={18} /></button>
        ) : (
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"><ChevronLeft size={18} /></Link>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Fixed Deposit Receipt</h1>
          <p className="text-xs text-[#64748b]">Earn guaranteed interest on your savings</p>
        </div>
      </div>

      <div className="bg-[#e8f4fd] border border-[#1a6fad]/20 rounded-xl p-3.5 flex gap-2.5 mb-5 text-xs text-[#0c2d4e]">
        <Info size={14} className="text-[#1a6fad] shrink-0 mt-0.5" />
        Lock your funds for a fixed term and earn guaranteed interest. Returns with principal at maturity.
      </div>

      {step === "configure" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-bold text-[#0c2d4e] mb-3">Select FDR Plan</label>
            <div className="grid grid-cols-2 gap-3">
              {FDR_PLANS.map(plan => (
                <button key={plan.id} onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${selectedPlan.id === plan.id ? plan.color : "border-[#e2e8f0] hover:border-[#c4d4e0]"}`}>
                  <BookOpen size={16} className={selectedPlan.id === plan.id ? "" : "text-[#94a3b8]"} />
                  <p className="font-bold text-[#0c2d4e] text-sm mt-1.5">{plan.label}</p>
                  <p className="text-[#1a6fad] font-bold text-lg">{plan.rate}%</p>
                  <p className="text-[10px] text-[#94a3b8]">Min: ${plan.minAmount.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-bold text-[#0c2d4e] mb-1.5">Deposit Amount (USD)</label>
            <p className="text-xs text-[#94a3b8] mb-3">Balance: <strong className="text-[#0c2d4e]">${currentUser?.balance.toLocaleString("en-US",{minimumFractionDigits:2})}</strong></p>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setAmountError("") }}
                className="w-full pl-10 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
                placeholder={`Minimum $${selectedPlan.minAmount.toLocaleString()}`} />
            </div>
            {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}

            {numAmount >= selectedPlan.minAmount && (
              <div className="mt-4 bg-[#f4f7fb] rounded-xl p-4 space-y-2">
                {[["Principal",`$${numAmount.toLocaleString("en-US",{minimumFractionDigits:2})}`],["Interest ("+selectedPlan.rate+"% p.a.)",`+$${interest.toLocaleString("en-US",{minimumFractionDigits:2})}`],["Maturity Amount",`$${maturityAmount.toLocaleString("en-US",{minimumFractionDigits:2})}`]].map(([l,v],i) => (
                  <div key={l} className={`flex justify-between text-sm ${i===2 ? "border-t border-[#e2e8f0] pt-2" : ""}`}>
                    <span className="text-[#64748b]">{l}</span>
                    <span className={`font-bold ${i===1 ? "text-[#0e9483]" : "text-[#0c2d4e]"}`}>{v}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] pt-1">
                  <Calendar size={11} />
                  <span>Matures: {maturityDate}</span>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleReview}
            className="w-full bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press flex items-center justify-center gap-2">
            <TrendingUp size={16} /> Continue to Review
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm animate-fade-in-up">
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-5 tracking-tight">Review FDR Investment</h2>
          <div className="space-y-0 mb-6">
            {[["Plan Duration",selectedPlan.label],["Interest Rate",`${selectedPlan.rate}% per annum`],["Principal",`$${numAmount.toLocaleString("en-US",{minimumFractionDigits:2})}`],["Expected Interest",`+$${interest.toLocaleString("en-US",{minimumFractionDigits:2})}`],["Maturity Amount",`$${maturityAmount.toLocaleString("en-US",{minimumFractionDigits:2})}`],["Maturity Date",maturityDate]].map(([l,v]) => (
              <div key={l} className="flex justify-between py-2.5 border-b border-[#f8fafc] last:border-0">
                <span className="text-sm text-[#64748b]">{l}</span>
                <span className={`text-sm font-bold ${l==="Expected Interest" ? "text-[#0e9483]" : "text-[#0c2d4e]"}`}>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94a3b8] mb-5">${numAmount.toLocaleString("en-US",{minimumFractionDigits:2})} will be locked for {selectedPlan.months} months.</p>
          <button onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-[#0c2d4e] to-[#1a4a72] hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">
            Confirm FDR Investment
          </button>
        </div>
      )}
    </div>
  )
}

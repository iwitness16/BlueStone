"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, CheckCircle, Lock, Info, DollarSign, Banknote } from "lucide-react"
import { useApp } from "@/lib/store"

const LOAN_TYPES = [
  { id: "personal", label: "Personal Loan", icon: "👤", rate: 8.5,  maxMonths: 36,  maxAmount: 25000,  color: "border-blue-200 bg-blue-50" },
  { id: "business", label: "Business Loan", icon: "🏢", rate: 6.5,  maxMonths: 60,  maxAmount: 100000, color: "border-purple-200 bg-purple-50" },
  { id: "home",     label: "Home Loan",     icon: "🏠", rate: 5.0,  maxMonths: 240, maxAmount: 500000, color: "border-teal-200 bg-teal-50" },
  { id: "auto",     label: "Auto Loan",     icon: "🚗", rate: 4.5,  maxMonths: 72,  maxAmount: 75000,  color: "border-orange-200 bg-orange-50" },
]

type Step = "configure" | "review" | "success"

export default function LoanPage() {
  const { currentUser, addTransaction } = useApp()
  const isVerified = currentUser?.verificationStatus === "verified"

  const [step, setStep] = useState<Step>("configure")
  const [loanType, setLoanType] = useState(LOAN_TYPES[0])
  const [amount, setAmount] = useState("")
  const [tenure, setTenure] = useState(12)
  const [purpose, setPurpose] = useState("")
  const [amountError, setAmountError] = useState("")

  const numAmount = parseFloat(amount) || 0
  const monthlyRate = loanType.rate / 100 / 12
  const emi = numAmount > 0 && tenure > 0
    ? (numAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    : 0
  const totalRepayable = emi * tenure
  const totalInterest  = totalRepayable - numAmount

  const handleReview = () => {
    if (numAmount < 100) { setAmountError("Minimum loan amount is $100"); return }
    if (numAmount > loanType.maxAmount) { setAmountError(`Maximum is $${loanType.maxAmount.toLocaleString()}`); return }
    if (!purpose.trim()) { setAmountError("Please describe the purpose of the loan"); return }
    setAmountError(""); setStep("review")
  }

  const handleSubmit = () => {
    if (!currentUser) return
    addTransaction(currentUser.id, {
      type: "credit", description: `${loanType.label} – ${tenure} months`,
      amount: numAmount,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "pending", method: "Loan",
    })
    setStep("success")
  }

  if (!isVerified) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"><ChevronLeft size={18} /></Link>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Apply for Loan</h1>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock size={28} className="text-amber-500" /></div>
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-2 tracking-tight">Verification Required</h2>
          <p className="text-sm text-[#64748b] mb-5 leading-relaxed">Loan applications require a verified account. Complete your KYC to apply.</p>
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
          <h2 className="text-xl font-bold text-[#0c2d4e] mb-2 tracking-tight">Application Submitted!</h2>
          <p className="text-sm text-[#64748b] mb-2">Your <strong>{loanType.label}</strong> application for <strong>${numAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong> has been submitted.</p>
          <p className="text-sm text-[#64748b] mb-6">Our team will review within <strong>2–3 business days</strong>.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-amber-600 font-bold mb-0.5">Estimated Monthly EMI</p>
            <p className="text-2xl font-bold text-amber-600">${emi.toFixed(2)}<span className="text-sm font-normal text-amber-400">/month</span></p>
            <p className="text-xs text-amber-500 mt-1">For {tenure} months at {loanType.rate}% p.a.</p>
          </div>
          <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">Back to Dashboard</Link>
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
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Apply for Loan</h1>
          <p className="text-xs text-[#64748b]">Fast approval · Competitive rates</p>
        </div>
      </div>

      {step === "configure" && (
        <div className="space-y-4">
          <div className="bg-[#e8f4fd] border border-[#1a6fad]/20 rounded-xl p-3.5 flex gap-2.5 text-xs text-[#0c2d4e]">
            <Info size={14} className="text-[#1a6fad] shrink-0 mt-0.5" />
            Loan applications are subject to approval. Funds are credited within 2–3 business days.
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-bold text-[#0c2d4e] mb-3">Loan Type</label>
            <div className="grid grid-cols-2 gap-3">
              {LOAN_TYPES.map((lt) => (
                <button key={lt.id} onClick={() => setLoanType(lt)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${loanType.id === lt.id ? `${lt.color} border-opacity-100` : "border-[#e2e8f0] hover:border-[#c4d4e0]"}`}>
                  <span className="text-2xl">{lt.icon}</span>
                  <p className="font-bold text-[#0c2d4e] text-sm mt-1.5">{lt.label}</p>
                  <p className="text-[#1a6fad] text-xs font-bold">{lt.rate}% p.a.</p>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5">Up to ${(lt.maxAmount/1000).toFixed(0)}K</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 space-y-4 shadow-sm">
            <div>
              <label className="block text-sm font-bold text-[#0c2d4e] mb-1.5">Loan Amount (USD)</label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setAmountError("") }}
                  className="w-full pl-10 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
                  placeholder={`Up to $${loanType.maxAmount.toLocaleString()}`} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0c2d4e] mb-2">Tenure (months)</label>
              <div className="flex gap-2 flex-wrap">
                {[6,12,24,36,60].filter(t => t <= loanType.maxMonths).map(t => (
                  <button key={t} onClick={() => setTenure(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tenure === t ? "bg-[#1a6fad] text-white shadow-sm" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"}`}>
                    {t} mo
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0c2d4e] mb-1.5">Purpose of Loan</label>
              <textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={2}
                className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all resize-none placeholder:text-[#c4d4e0]"
                placeholder="Briefly describe your loan purpose..." />
            </div>

            {amountError && <p className="text-xs text-red-500">{amountError}</p>}

            {numAmount >= 100 && emi > 0 && (
              <div className="bg-[#f4f7fb] rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                {[["Monthly EMI",`$${emi.toFixed(2)}`],["Total Interest",`$${totalInterest.toFixed(2)}`],["Total Payable",`$${totalRepayable.toFixed(2)}`]].map(([l,v]) => (
                  <div key={l}><p className="font-bold text-[#0c2d4e] text-sm">{v}</p><p className="text-[10px] text-[#94a3b8]">{l}</p></div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleReview}
            className="w-full bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press flex items-center justify-center gap-2">
            <Banknote size={16} /> Review Application
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm animate-fade-in-up">
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-5 tracking-tight">Review Application</h2>
          <div className="space-y-0 mb-6">
            {[["Loan Type",loanType.label],["Amount",`$${numAmount.toLocaleString("en-US",{minimumFractionDigits:2})}`],["Interest Rate",`${loanType.rate}% per annum`],["Tenure",`${tenure} months`],["Monthly EMI",`$${emi.toFixed(2)}`],["Total Repayable",`$${totalRepayable.toFixed(2)}`],["Purpose",purpose]].map(([l,v]) => (
              <div key={l} className="flex justify-between py-2.5 border-b border-[#f8fafc] last:border-0">
                <span className="text-sm text-[#64748b]">{l}</span>
                <span className="text-sm font-bold text-[#0c2d4e] text-right max-w-[60%]">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94a3b8] mb-5">Subject to approval. Funds credited within 2–3 business days after approval.</p>
          <button onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#0c2d4e] to-[#1a4a72] hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg btn-press">
            Submit Application
          </button>
        </div>
      )}
    </div>
  )
}

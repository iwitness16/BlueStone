"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, CreditCard, CheckCircle, Lock, Zap, Wifi, Phone, Tv, Droplets, Car } from "lucide-react"
import { useApp } from "@/lib/store"

const BILL_CATEGORIES = [
  { id: "electricity", label: "Electricity", icon: Zap, color: "bg-yellow-50 text-yellow-600" },
  { id: "internet", label: "Internet", icon: Wifi, color: "bg-blue-50 text-[#1a6fad]" },
  { id: "mobile", label: "Mobile / Phone", icon: Phone, color: "bg-green-50 text-green-600" },
  { id: "tv", label: "Cable / TV", icon: Tv, color: "bg-purple-50 text-purple-600" },
  { id: "water", label: "Water", icon: Droplets, color: "bg-sky-50 text-sky-600" },
  { id: "insurance", label: "Insurance", icon: Car, color: "bg-orange-50 text-orange-600" },
]

type Step = "select" | "details" | "review" | "success"

export default function PayBillPage() {
  const { currentUser, addTransaction } = useApp()
  const isVerified = currentUser?.verificationStatus === "verified"

  const [step, setStep] = useState<Step>("select")
  const [category, setCategory] = useState(BILL_CATEGORIES[0])
  const [accountNo, setAccountNo] = useState("")
  const [providerName, setProviderName] = useState("")
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const numAmount = parseFloat(amount) || 0

  const validate = () => {
    const e: Record<string, string> = {}
    if (!accountNo.trim()) e.accountNo = "Account / Bill number is required"
    if (!providerName.trim()) e.providerName = "Provider name is required"
    if (numAmount < 1) e.amount = "Minimum bill payment is $1"
    if (numAmount > (currentUser?.balance ?? 0)) e.amount = "Insufficient balance"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = () => {
    if (!currentUser) return
    addTransaction(currentUser.id, {
      type: "debit",
      description: `${category.label} Bill - ${providerName}`,
      amount: numAmount,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "success",
      method: "Bill Pay",
    })
    setStep("success")
  }

  if (!isVerified) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="p-1.5 text-[#64748b] hover:text-[#0c2d4e] hover:bg-white rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-[#0c2d4e]">Pay Bills</h1>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-2">Verification Required</h2>
          <p className="text-sm text-[#475569] mb-5">Bill payments require a verified account. Complete your KYC to use this feature.</p>
          <Link href="/dashboard/kyc" className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#1a4a72] transition-colors">
            Complete KYC
          </Link>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-[#0e9483]" />
          </div>
          <h2 className="text-xl font-bold text-[#0c2d4e] mb-2">Bill Paid Successfully!</h2>
          <p className="text-sm text-[#475569] mb-1">
            You paid <strong>${numAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong> for your <strong>{category.label}</strong> bill.
          </p>
          <p className="text-sm text-[#475569] mb-6">Provider: <strong>{providerName}</strong></p>
          <div className="space-y-3">
            <button
              onClick={() => { setStep("select"); setAccountNo(""); setProviderName(""); setAmount(""); setErrors({}) }}
              className="w-full flex items-center justify-center gap-2 bg-[#0c2d4e] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#1a4a72] transition-colors">
              Pay Another Bill
            </button>
            <Link href="/dashboard" className="w-full flex items-center justify-center text-[#1a6fad] font-semibold text-sm hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto pb-8">
      <div className="flex items-center gap-3 mb-6">
        {step !== "select" ? (
          <button
            onClick={() => setStep(step === "review" ? "details" : step === "details" ? "select" : "select")}
            className="p-1.5 text-[#64748b] hover:text-[#0c2d4e] hover:bg-white rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
        ) : (
          <Link href="/dashboard" className="p-1.5 text-[#64748b] hover:text-[#0c2d4e] hover:bg-white rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </Link>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e]">Pay Bills</h1>
          <p className="text-xs text-[#64748b]">Quick & secure bill payments</p>
        </div>
      </div>

      {step === "select" && (
        <div className="space-y-5">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <label className="block text-sm font-semibold text-[#0c2d4e] mb-3">Select Bill Category</label>
            <div className="grid grid-cols-3 gap-3">
              {BILL_CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <button key={cat.id} onClick={() => setCategory(cat)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${category.id === cat.id ? "border-[#1a6fad] bg-[#e8f4fd]" : "border-[#e2e8f0] hover:border-[#1a6fad]/40"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-[#0c2d4e] text-center leading-tight">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <button onClick={() => setStep("details")}
            className="w-full bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
            <CreditCard size={16} /> Continue with {category.label}
          </button>
        </div>
      )}

      {step === "details" && (
        <div className="space-y-5">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${category.color}`}>
                {(() => { const Icon = category.icon; return <Icon size={20} /> })()}
              </div>
              <div>
                <p className="font-semibold text-[#0c2d4e]">{category.label} Bill</p>
                <p className="text-xs text-[#64748b]">Enter your billing details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Provider / Company Name</label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => { setProviderName(e.target.value); setErrors((p) => ({ ...p, providerName: "" })) }}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"
                  placeholder="e.g. Pacific Gas & Electric"
                />
                {errors.providerName && <p className="text-xs text-red-500 mt-1">{errors.providerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Account / Bill Number</label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => { setAccountNo(e.target.value); setErrors((p) => ({ ...p, accountNo: "" })) }}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"
                  placeholder="Enter your account / bill number"
                />
                {errors.accountNo && <p className="text-xs text-red-500 mt-1">{errors.accountNo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Amount (USD)</label>
                <p className="text-xs text-[#64748b] mb-2">
                  Available: <span className="font-semibold text-[#0c2d4e]">${currentUser?.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] font-semibold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: "" })) }}
                    className="w-full pl-8 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
              </div>
            </div>
          </div>

          <button onClick={() => { if (validate()) setStep("review") }}
            className="w-full bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors">
            Review Payment
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#0c2d4e] mb-5">Confirm Payment</h2>
          <div className="space-y-3 mb-6">
            {[
              { label: "Bill Category", value: category.label },
              { label: "Provider", value: providerName },
              { label: "Account Number", value: accountNo },
              { label: "Amount", value: `$${numAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-[#f1f5f9] last:border-0">
                <span className="text-sm text-[#64748b]">{label}</span>
                <span className="text-sm font-semibold text-[#0c2d4e]">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94a3b8] mb-5">
            ${numAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} will be deducted from your account.
          </p>
          <button onClick={handlePay}
            className="w-full bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors">
            Pay ${numAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </button>
        </div>
      )}
    </div>
  )
}

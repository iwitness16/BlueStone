"use client"

import Link from "next/link"
import { ChevronLeft, Archive, Lock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"
import { useApp } from "@/lib/store"

const DPS_PLANS = [
  { name: "Starter DPS",  monthly: 50,  duration: 12, interest: 8,  total: 652,   color: "from-blue-500 to-[#1a6fad]",    bg: "bg-blue-50",   icon_color: "text-[#1a6fad]" },
  { name: "Premium DPS",  monthly: 200, duration: 24, interest: 10, total: 5280,  color: "from-[#0e9483] to-teal-600",    bg: "bg-teal-50",   icon_color: "text-teal-600" },
  { name: "Elite DPS",    monthly: 500, duration: 36, interest: 12, total: 20160, color: "from-purple-500 to-purple-700",  bg: "bg-purple-50", icon_color: "text-purple-600" },
]

export default function DPSPage() {
  const { currentUser } = useApp()
  const isVerified = currentUser?.verificationStatus === "verified"

  return (
    <div className="max-w-2xl mx-auto pb-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all"><ChevronLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight">Deposit Pension Scheme</h1>
          <p className="text-xs text-[#64748b]">Save regularly and earn guaranteed returns</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-gradient-to-r from-[#e8f4fd] to-[#e0f7f4] border border-[#1a6fad]/15 rounded-xl p-4 mb-5 flex gap-3">
        <TrendingUp size={18} className="text-[#1a6fad] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#0c2d4e]">How DPS works</p>
          <p className="text-xs text-[#64748b] mt-0.5">Choose a plan, make monthly deposits, and receive your principal plus interest at maturity. Fully guaranteed.</p>
        </div>
      </div>

      <div className="space-y-4">
        {DPS_PLANS.map((plan, i) => (
          <div key={plan.name} className={`bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm stat-card animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            {/* Colored header */}
            <div className={`bg-gradient-to-r ${plan.color} px-5 py-4 flex items-center justify-between`}>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">{plan.name}</h3>
                <p className="text-white/70 text-xs">{plan.duration} months · {plan.interest}% p.a.</p>
              </div>
              <div className={`w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center`}>
                <Archive size={20} className="text-white" />
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                {[["Monthly","$"+plan.monthly,"Deposit"],["Interest",plan.interest+"%","Per annum"],["Maturity","$"+plan.total.toLocaleString(),"Return"]].map(([l,v,sub]) => (
                  <div key={l} className="bg-[#f4f7fb] rounded-xl p-3">
                    <p className="text-xs text-[#94a3b8] mb-0.5">{l}</p>
                    <p className="text-lg font-bold text-[#0c2d4e] tracking-tight">{v}</p>
                    <p className="text-[10px] text-[#94a3b8]">{sub}</p>
                  </div>
                ))}
              </div>

              {isVerified ? (
                <button className="w-full bg-[#0c2d4e] hover:bg-[#1a4a72] text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg btn-press flex items-center justify-center gap-2">
                  <CheckCircle size={15} /> Apply for {plan.name}
                </button>
              ) : (
                <Link href="/dashboard/kyc"
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#c4d4e0] text-[#94a3b8] py-3 rounded-xl text-sm hover:bg-[#f8fafc] hover:border-[#1a6fad]/50 hover:text-[#1a6fad] transition-all font-semibold">
                  <Lock size={14} /> Verify Account to Apply
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isVerified && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 flex gap-2.5">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>DPS plans require a verified account. <Link href="/dashboard/kyc" className="underline font-bold">Complete KYC →</Link></span>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Copy, CheckCircle, Sparkles } from "lucide-react"
import Logo from "@/components/logo"
import { supabase } from "@/lib/supabase/client"
import { formatBonus } from "@/lib/currency"
import confetti from "canvas-confetti"

export default function CongratsPage() {
  const fired = useRef(false)
  const [firstName, setFirstName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [country, setCountry] = useState("United States")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return
      const meta = session.user.user_metadata
      setFirstName(meta?.first_name ?? session.user.email?.split("@")[0] ?? "there")
      supabase
        .from("profiles")
        .select("account_number, country")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setAccountNumber(data.account_number)
            setCountry(data.country || "United States")
          }
        })
    })
  }, [])

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    const colors = ["#0c2d4e", "#1a6fad", "#38bdf8", "#0e9483", "#ffffff"]
    const end = Date.now() + 4500
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors })
      confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
    setTimeout(() => confetti({ particleCount: 140, spread: 100, origin: { y: 0.45 }, colors }), 200)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f4f7fb] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-16 left-8 w-40 h-40 bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-24 right-8 w-56 h-56 bg-[#e8f4fd]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-sm w-full animate-fade-in-up">
        <div className="mb-8"><Logo size="lg" href="/" /></div>

        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a6fad] to-[#0e9483] rounded-full animate-glow-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a6fad] to-[#0e9483] rounded-full flex items-center justify-center shadow-2xl">
            <CheckCircle size={42} className="text-white" strokeWidth={2} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-amber-500 text-sm font-bold">Account Created!</span>
          <Sparkles size={16} className="text-amber-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0c2d4e] mb-3 tracking-tight">
          Welcome{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="text-[#64748b] text-sm mb-5 leading-relaxed">
          Your BlueStone Trust Bank account has been created successfully.
        </p>

        <div className="bg-gradient-to-r from-[#e8f4fd] to-[#e0f7f4] border border-[#1a6fad]/20 rounded-2xl px-6 py-5 my-5 shadow-sm">
          <p className="text-sm text-[#475569] mb-1 flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-[#1a6fad]" />
            Welcome bonus credited to your account
          </p>
          <p className="text-5xl font-bold text-[#0c2d4e] tracking-tight">{formatBonus(country)}</p>
          <p className="text-xs text-[#64748b] mt-1.5">Equivalent to $10 USD · Available now</p>
        </div>

        {accountNumber && (
          <div className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-semibold mb-0.5">Account Number</p>
              <p className="font-mono font-bold text-[#0c2d4e]">{accountNumber}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(accountNumber)}
              className="p-2 text-[#94a3b8] hover:text-[#1a6fad] hover:bg-[#f0f7ff] rounded-lg transition-colors">
              <Copy size={15} />
            </button>
          </div>
        )}

        <Link href="/dashboard"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0c2d4e] to-[#1a4a72] hover:from-[#1a4a72] hover:to-[#1a6fad] text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm hover:shadow-lg btn-press">
          <LayoutDashboard size={16} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

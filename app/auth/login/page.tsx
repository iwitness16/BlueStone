"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, KeyRound, Mail, Lock, AlertCircle, ShieldCheck } from "lucide-react"
import Logo from "@/components/logo"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm]       = useState({ email: "", password: "" })
  const [showPw, setShowPw]   = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    form.email.trim(),
      password: form.password,
    })

    if (authError) {
      if (authError.message.toLowerCase().includes("invalid login credentials")) {
        setError("Incorrect email or password. Please try again.")
      } else if (authError.message.toLowerCase().includes("email not confirmed")) {
        setError("Your email is not confirmed yet. Check your inbox for a confirmation link, or contact support to have it manually confirmed.")
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    // Login succeeded. The store's SIGNED_IN handler will fetch the profile
    // and clear authLoading. The dashboard guard shows a spinner until ready.
    router.push("/dashboard")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e8f4fd]/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e8f4fd]/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">

          <div className="text-center mb-8">
            <div className="mb-6">
              <Logo size="lg" href="/" />
            </div>
            <h1 className="text-2xl font-bold text-[#0c2d4e] tracking-tight">Welcome back</h1>
            <p className="text-[#64748b] text-sm mt-1.5">Sign in to your BlueStone account</p>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-7 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setError("") }}
                    className="w-full pl-10 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm text-[#0c2d4e] outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-[#334155]">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-[#1a6fad] hover:text-[#0c2d4e] font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setError("") }}
                    className="w-full pl-10 pr-11 py-3 border border-[#e2e8f0] rounded-xl text-sm text-[#0c2d4e] outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#1a6fad] transition-colors">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div onClick={() => setRemember(!remember)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${remember ? "bg-[#1a6fad] border-[#1a6fad]" : "border-[#c4d4e0] group-hover:border-[#1a6fad]"}`}>
                  {remember && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4l3 3 5-6"/></svg>}
                </div>
                <span className="text-sm text-[#475569]">Remember me for 30 days</span>
              </label>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm text-red-600 animate-scale-in">
                  <AlertCircle size={15} className="shrink-0" /> {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0c2d4e] to-[#1a4a72] hover:from-[#1a4a72] hover:to-[#1a6fad] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm hover:shadow-lg btn-press mt-1">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <KeyRound size={16} />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 h-px bg-[#f1f5f9]" />
              <span className="text-xs text-[#94a3b8]">New to BlueStone?</span>
              <div className="flex-1 h-px bg-[#f1f5f9]" />
            </div>

            <Link href="/auth/signup"
              className="w-full mt-4 flex items-center justify-center gap-2 border border-[#e2e8f0] hover:border-[#1a6fad] hover:bg-[#f0f7ff] text-[#0c2d4e] font-semibold py-3 rounded-xl transition-all text-sm">
              Create a free account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[#94a3b8]">
            <ShieldCheck size={13} className="text-[#0e9483]" />
            <span>256-bit SSL encrypted · FDIC Insured</span>
          </div>
        </div>
      </div>
    </div>
  )
}

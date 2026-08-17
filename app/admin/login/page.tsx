"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react"
import { useApp } from "@/lib/store"
import Logo from "@/components/logo"

const ADMIN_USERNAME = "bankmanager"
const ADMIN_PASSWORD = "Fredo123#"

export default function AdminLoginPage() {
  const { setAdminUser } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => { setForm((p) => ({ ...p, [k]: v })); setError("") }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    await new Promise((r) => setTimeout(r, 900))

    if (form.username.toLowerCase() === ADMIN_USERNAME && form.password === ADMIN_PASSWORD) {
      setAdminUser({ id: "admin-1", name: "Bank Manager", email: "bankmanager@globallinexpress.com", role: "admin" })
      router.push("/admin")
    } else {
      setError("Invalid credentials. Access denied.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2038] via-[#0c2d4e] to-[#0a3a5c] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in-up">

        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 mb-5 animate-glow-pulse">
            <ShieldCheck size={30} className="text-sky-300" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-white/50 text-sm mt-1.5">BlueStone Trust Bank — Authorized Access Only</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6 pb-6 border-b border-[#f1f5f9]">
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-1">Secure Administration Console</p>
            <p className="text-sm text-[#475569]">Enter your administrator credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#334155] mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => set("username", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#334155] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="w-full pl-10 pr-11 py-3 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all placeholder:text-[#c4d4e0]"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0c2d4e] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm text-red-600 animate-scale-in">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0c2d4e] to-[#1a4a72] hover:from-[#1a4a72] hover:to-[#1a6fad] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg btn-press mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
              ) : (
                <><ShieldCheck size={16} /> Access Admin Panel</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/25 text-xs mt-6">
          Unauthorized access is strictly prohibited and monitored. All activity is logged.
        </p>
      </div>
    </div>
  )
}

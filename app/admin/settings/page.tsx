"use client"

import { useState } from "react"
import { Settings, Shield, Bell, Globe, Key, Save, CheckCircle, Eye, EyeOff, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import AdminShell from "@/components/admin/admin-shell"
import { useApp } from "@/lib/store"

type Tab = "general" | "security" | "notifications"

export default function AdminSettingsPage() {
  const { adminUser, adminLogout } = useApp()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("general")
  const [saved, setSaved] = useState(false)
  const [showOldPw, setShowOldPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState("")

  const [generalForm, setGeneralForm] = useState({
    bankName: "BlueStone Trust Bank",
    supportEmail: "info@bluestonetrustbank.com",
    phone: "+1 (334) 446-8194",
    address: "100 Financial District, New York, NY 10005",
    currency: "USD",
    signupBonus: "10",
  })

  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" })

  const handleGeneralSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPwError("")
    if (pwForm.newPassword.length < 8) { setPwError("Password must be at least 8 characters."); return }
    if (pwForm.oldPassword !== "Admin@1234") { setPwError("Current password is incorrect."); return }
    setPwSaved(true)
    setPwForm({ oldPassword: "", newPassword: "" })
    setTimeout(() => setPwSaved(false), 3000)
  }

  const handleLogout = () => {
    adminLogout()
    router.push("/admin/login")
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "general",       label: "General",      icon: Globe },
    { id: "security",      label: "Security",     icon: Shield },
    { id: "notifications", label: "Notifications",icon: Bell },
  ]

  return (
    <AdminShell>
      <div className="space-y-5 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2d4e]">Admin Settings</h1>
            <p className="text-sm text-[#64748b] mt-0.5">Configure platform settings and admin preferences</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Admin info card */}
        <div className="bg-[#0c2d4e] text-white rounded-2xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sky-400/20 flex items-center justify-center text-sky-300 text-xl font-bold shrink-0">
            A
          </div>
          <div>
            <p className="font-bold text-lg">{adminUser?.name ?? "Administrator"}</p>
            <p className="text-white/60 text-sm">{adminUser?.email ?? "admin@bluestonebank.com"}</p>
            <span className="inline-flex items-center gap-1.5 bg-sky-400/20 text-sky-300 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1.5">
              <Shield size={10} /> Super Admin
            </span>
          </div>
        </div>

        {/* Tab pills */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-2 flex gap-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === id ? "bg-[#0c2d4e] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* General settings */}
        {activeTab === "general" && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#0c2d4e] mb-1">General Settings</h2>
            <p className="text-sm text-[#64748b] mb-5">Configure platform-wide information and defaults.</p>
            <form onSubmit={handleGeneralSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">Bank Name</label>
                  <input
                    value={generalForm.bankName}
                    onChange={(e) => setGeneralForm((p) => ({ ...p, bankName: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">Currency</label>
                  <select
                    value={generalForm.currency}
                    onChange={(e) => setGeneralForm((p) => ({ ...p, currency: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all bg-white"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Support Email</label>
                <input
                  value={generalForm.supportEmail}
                  onChange={(e) => setGeneralForm((p) => ({ ...p, supportEmail: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Support Phone</label>
                <input
                  value={generalForm.phone}
                  onChange={(e) => setGeneralForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Bank Address</label>
                <textarea
                  value={generalForm.address}
                  onChange={(e) => setGeneralForm((p) => ({ ...p, address: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">New User Signup Bonus ($)</label>
                <input
                  type="number"
                  value={generalForm.signupBonus}
                  onChange={(e) => setGeneralForm((p) => ({ ...p, signupBonus: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all max-w-xs"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="flex items-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
                  <Save size={14} /> Save Settings
                </button>
                {saved && <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><CheckCircle size={14} /> Saved!</span>}
              </div>
            </form>
          </div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#0c2d4e] mb-1">Security Settings</h2>
              <p className="text-sm text-[#64748b]">Manage admin account password and access security.</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <h3 className="text-sm font-semibold text-[#0c2d4e] flex items-center gap-2"><Key size={14} /> Change Admin Password</h3>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPw ? "text" : "password"}
                    value={pwForm.oldPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, oldPassword: e.target.value }))}
                    className="w-full px-4 pr-10 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    {showOldPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                    className="w-full px-4 pr-10 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                    required
                    minLength={8}
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {pwError && <p className="text-sm text-red-600">{pwError}</p>}
              <div className="flex items-center gap-3 pt-1">
                <button type="submit" className="bg-[#0c2d4e] hover:bg-[#1a4a72] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
                  Update Password
                </button>
                {pwSaved && <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><CheckCircle size={14} /> Password updated!</span>}
              </div>
            </form>

            <div className="border-t border-[#f1f5f9] pt-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#0c2d4e]">Access Security</h3>
              {[
                { label: "Admin Session Timeout", value: "30 minutes", badge: "Enabled", badgeColor: "bg-green-50 text-green-700" },
                { label: "Two-Factor Authentication", value: "Not configured", badge: "Disabled", badgeColor: "bg-red-50 text-red-600" },
                { label: "Login Activity Logging", value: "All admin logins recorded", badge: "Enabled", badgeColor: "bg-green-50 text-green-700" },
              ].map(({ label, value, badge, badgeColor }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-[#f8fafc] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#0c2d4e]">{label}</p>
                    <p className="text-xs text-[#64748b]">{value}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#0c2d4e] mb-1">Admin Notifications</h2>
            <p className="text-sm text-[#64748b] mb-5">Configure alerts and admin notification preferences.</p>
            <div className="space-y-4">
              {[
                { label: "New User Registrations", desc: "Alert when a new user signs up", enabled: true },
                { label: "KYC Submissions", desc: "Alert when a user submits KYC documents", enabled: true },
                { label: "Large Transactions", desc: "Alert for transactions over $10,000", enabled: true },
                { label: "Failed Login Attempts", desc: "Alert on repeated failed login attempts", enabled: true },
                { label: "System Reports", desc: "Weekly platform performance summary", enabled: false },
              ].map(({ label, desc, enabled }) => (
                <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-[#f1f5f9] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#0c2d4e]">{label}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{desc}</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full flex items-center transition-all cursor-pointer shrink-0 ${enabled ? "bg-[#1a6fad]" : "bg-[#e2e8f0]"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${enabled ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}

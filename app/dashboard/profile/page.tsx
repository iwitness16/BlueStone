"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Building2, Calendar, Save, ChevronLeft, Lock, Eye, EyeOff, Bell, Shield, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/lib/store"

type Tab = "profile" | "password" | "security" | "notifications" | "closing"

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [saved, setSaved] = useState(false)
  const [showOldPw, setShowOldPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfPw, setShowConfPw] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const [form, setForm] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    country: currentUser?.country || "",
    city: currentUser?.city || "",
    zip: currentUser?.zip || "",
    address: currentUser?.address || "",
    profession: currentUser?.profession || "",
  })

  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })
  const [pwError, setPwError] = useState("")
  const [pwSaved, setPwSaved] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...form })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault()
    setPwError("")
    if (pwForm.newPassword.length < 6) { setPwError("New password must be at least 6 characters."); return }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError("Passwords do not match."); return }
    setPwSaved(true)
    setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
    setTimeout(() => setPwSaved(false), 3000)
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "security", label: "Security Settings", icon: Shield },
    { id: "notifications", label: "All Notifications", icon: Bell },
    { id: "closing", label: "Account Closing", icon: Trash2 },
  ]

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors">
          <ChevronLeft size={18} className="text-[#334155]" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#0c2d4e]">Account Settings</h1>
          <p className="text-xs text-[#64748b]">Manage your account preferences</p>
        </div>
      </div>

      {/* Tab pills */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-3 flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-[#0c2d4e] text-white shadow-sm"
                : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0c2d4e]"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#f1f5f9]">
            <div className="w-16 h-16 rounded-full bg-[#e8f4fd] flex items-center justify-center text-2xl font-bold text-[#1a6fad]">
              {form.firstName?.[0]}{form.lastName?.[0]}
            </div>
            <div>
              <p className="font-semibold text-[#0c2d4e]">{form.firstName} {form.lastName}</p>
              <p className="text-sm text-[#64748b]">{form.email}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1 px-2.5 py-0.5 rounded-full ${
                currentUser?.verificationStatus === "verified"
                  ? "bg-green-50 text-green-700"
                  : currentUser?.verificationStatus === "pending"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-600"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {currentUser?.verificationStatus === "verified" ? "Verified" : currentUser?.verificationStatus === "pending" ? "Pending Review" : "Unverified"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">First Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Last Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Profession</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    value={form.profession}
                    onChange={(e) => set("profession", e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Country</label>
              <input
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">City</label>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">ZIP Code</label>
                <input
                  value={form.zip}
                  onChange={(e) => set("zip", e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">Joining Date</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    value={currentUser?.joiningDate || ""}
                    readOnly
                    className="w-full pl-9 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm bg-[#f8fafc] text-[#94a3b8]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Address</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-3.5 text-[#94a3b8]" />
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  rows={2}
                  className="w-full pl-9 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#0c2d4e] hover:bg-[#1a4a72] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                <Save size={15} /> Save Changes
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <CheckCircle size={15} /> Changes saved!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Change Password */}
      {activeTab === "password" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6">
          <h2 className="text-base font-bold text-[#0c2d4e] mb-1">Change Password</h2>
          <p className="text-sm text-[#64748b] mb-6">Update your account password. Use a strong, unique password.</p>
          <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
            {[
              { label: "Current Password", key: "oldPassword", show: showOldPw, toggle: () => setShowOldPw(!showOldPw) },
              { label: "New Password", key: "newPassword", show: showNewPw, toggle: () => setShowNewPw(!showNewPw) },
              { label: "Confirm New Password", key: "confirmPassword", show: showConfPw, toggle: () => setShowConfPw(!showConfPw) },
            ].map(({ label, key, show, toggle }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">{label}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type={show ? "text" : "password"}
                    value={pwForm[key as keyof typeof pwForm]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full pl-9 pr-10 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 transition-all"
                    required
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
            {pwError && <p className="text-sm text-red-600">{pwError}</p>}
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="bg-[#0c2d4e] hover:bg-[#1a4a72] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
                Update Password
              </button>
              {pwSaved && <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><CheckCircle size={15} /> Password updated!</span>}
            </div>
          </form>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#0c2d4e] mb-1">Security Settings</h2>
            <p className="text-sm text-[#64748b]">Manage your account security and login activity.</p>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {[
              { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", badge: "Disabled", badgeColor: "bg-red-50 text-red-600" },
              { label: "Login Notifications", desc: "Receive email alerts when a new login is detected", badge: "Enabled", badgeColor: "bg-green-50 text-green-700" },
              { label: "Active Sessions", desc: "View and manage all active login sessions", badge: "1 Active", badgeColor: "bg-blue-50 text-blue-700" },
            ].map(({ label, desc, badge, badgeColor }) => (
              <div key={label} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-[#0c2d4e]">{label}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{desc}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeColor}`}>{badge}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#e8f4fd] border border-[#1a6fad]/20 rounded-xl p-4">
            <p className="text-sm font-semibold text-[#0c2d4e] mb-1">Account Number</p>
            <p className="font-mono text-lg font-bold text-[#1a6fad]">{currentUser?.accountNumber}</p>
            <p className="text-xs text-[#64748b] mt-1">Keep this number confidential.</p>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6">
          <h2 className="text-base font-bold text-[#0c2d4e] mb-1">Notification Preferences</h2>
          <p className="text-sm text-[#64748b] mb-5">Choose what notifications you want to receive.</p>
          <div className="space-y-4">
            {[
              { label: "Transaction Alerts", desc: "Get notified for every debit or credit on your account", enabled: true },
              { label: "Promotional Offers", desc: "Receive updates on new products and special offers", enabled: false },
              { label: "Security Alerts", desc: "Get notified about suspicious login attempts", enabled: true },
              { label: "Statement Ready", desc: "Notification when your monthly statement is available", enabled: true },
              { label: "KYC Status Updates", desc: "Get updates on your verification status", enabled: true },
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

      {/* Account Closing */}
      {activeTab === "closing" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6">
          <h2 className="text-base font-bold text-[#0c2d4e] mb-1">Close Account</h2>
          <p className="text-sm text-[#64748b] mb-6">Permanently close your BlueStone Trust Bank account. This action cannot be undone.</p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 space-y-1.5">
            <p className="text-sm font-semibold text-red-700">Warning — Before you close your account:</p>
            {[
              "All remaining balance must be withdrawn first.",
              "All pending transactions will be cancelled.",
              "Your account data will be permanently deleted.",
              "You will lose access to all transaction history.",
            ].map((item) => (
              <p key={item} className="text-xs text-red-600 flex items-start gap-1.5">
                <span className="mt-1 shrink-0">•</span> {item}
              </p>
            ))}
          </div>
          {!showCloseConfirm ? (
            <button
              onClick={() => setShowCloseConfirm(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Trash2 size={15} /> Close My Account
            </button>
          ) : (
            <div className="border border-red-300 rounded-xl p-4 bg-red-50">
              <p className="text-sm font-semibold text-red-700 mb-3">Are you absolutely sure? Please contact support to proceed.</p>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/13344468194"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Contact Support on WhatsApp
                </a>
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="bg-white border border-[#e2e8f0] text-sm text-[#64748b] px-4 py-2 rounded-lg hover:bg-[#f1f5f9] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

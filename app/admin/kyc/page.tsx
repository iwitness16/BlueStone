"use client"

import { useEffect, useState, useCallback } from "react"
import {
  ShieldCheck, Search, CheckCircle, XCircle, Clock, Eye,
  ChevronRight, Phone, MapPin, Briefcase, User, RefreshCw,
  AlertCircle, Calendar, Hash,
} from "lucide-react"
import AdminShell from "@/components/admin/admin-shell"
import {
  adminGetAllUsers, adminUpdateVerificationStatus,
  type DBProfile, type VerificationStatus,
} from "@/lib/supabase/admin"

const STATUS_LABELS: Record<VerificationStatus, { label: string; color: string; bg: string }> = {
  unverified: { label: "Unverified",       color: "text-[#64748b]",  bg: "bg-slate-100" },
  pending:    { label: "Pending Review",   color: "text-amber-700",  bg: "bg-amber-50" },
  rejected:   { label: "Unable to Verify", color: "text-red-600",    bg: "bg-red-50" },
  verified:   { label: "Verified",         color: "text-green-700",  bg: "bg-green-50" },
}

export default function AdminKYCPage() {
  const [users, setUsers]             = useState<DBProfile[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [search, setSearch]           = useState("")
  const [filter, setFilter]           = useState<VerificationStatus | "all">("all")
  const [selectedUser, setSelectedUser] = useState<DBProfile | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMsg, setActionMsg]     = useState<{ msg: string; ok: boolean } | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await adminGetAllUsers()
      setUsers(data)
      // Keep selected user fresh
      if (selectedUser) {
        const fresh = data.find(u => u.id === selectedUser.id)
        if (fresh) setSelectedUser(fresh)
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [selectedUser?.id])

  useEffect(() => { load() }, [])

  const handleStatusChange = async (userId: string, status: VerificationStatus) => {
    setActionLoading(true); setActionMsg(null)
    try {
      await adminUpdateVerificationStatus(userId, status)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, verification_status: status } : u))
      setSelectedUser(prev => prev?.id === userId ? { ...prev, verification_status: status } : prev)
      setActionMsg({ msg: `KYC status updated to "${STATUS_LABELS[status].label}".`, ok: true })
    } catch (e: any) {
      setActionMsg({ msg: e.message ?? "Update failed.", ok: false })
    } finally {
      setActionLoading(false)
      setTimeout(() => setActionMsg(null), 4000)
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = `${u.first_name} ${u.last_name} ${u.email} ${u.account_number}`
      .toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || u.verification_status === filter
    return matchSearch && matchFilter
  })

  const counts = {
    all:        users.length,
    unverified: users.filter(u => u.verification_status === "unverified").length,
    pending:    users.filter(u => u.verification_status === "pending").length,
    rejected:   users.filter(u => u.verification_status === "rejected").length,
    verified:   users.filter(u => u.verification_status === "verified").length,
  }

  return (
    <AdminShell>
      <div className="space-y-5 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2d4e] tracking-tight">KYC Verification</h1>
            <p className="text-sm text-[#64748b] mt-0.5">Review and manage user identity verifications</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-xl">
              <Clock size={15} />
              <span className="text-sm font-bold">{counts.pending} Pending</span>
            </div>
            <button onClick={load} disabled={loading}
              className="flex items-center gap-2 text-sm text-[#1a6fad] border border-[#e2e8f0] px-4 py-2 rounded-xl hover:bg-[#f0f7ff] transition-colors disabled:opacity-50">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm text-red-600">
            <AlertCircle size={15} className="shrink-0" /> {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "unverified", "rejected", "verified"] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                filter === s ? "bg-[#0c2d4e] text-white" : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#1a6fad] hover:text-[#1a6fad]"
              }`}>
              {s === "all" ? "All" : STATUS_LABELS[s as VerificationStatus].label} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 bg-white transition-all placeholder:text-[#c4d4e0]"
            placeholder="Search by name, email, or account number..." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* User list */}
          <div className="lg:col-span-1 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
            {loading ? (
              <div className="space-y-0 p-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-16 shimmer rounded-xl mb-2" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-[#94a3b8] text-sm">No users found</div>
            ) : (
              <div className="divide-y divide-[#f1f5f9]">
                {filtered.map(u => {
                  const st = STATUS_LABELS[u.verification_status]
                  const isSelected = selectedUser?.id === u.id
                  return (
                    <button key={u.id} onClick={() => setSelectedUser(u)}
                      className={`w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-[#f8fafc] transition-colors ${isSelected ? "bg-[#f0f7ff] border-r-2 border-[#1a6fad]" : ""}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a6fad] to-[#0e9483] flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {u.first_name?.[0]}{u.last_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#0c2d4e] truncate">{u.first_name} {u.last_name}</p>
                        <p className="text-xs text-[#64748b] truncate">{u.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                        <ChevronRight size={12} className="text-[#94a3b8]" />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 space-y-5">
                {/* User header */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a6fad] to-[#0e9483] flex items-center justify-center text-2xl font-bold text-white shrink-0">
                    {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0c2d4e] tracking-tight">{selectedUser.first_name} {selectedUser.last_name}</h2>
                    <p className="text-sm text-[#64748b]">{selectedUser.email}</p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mt-1.5 ${STATUS_LABELS[selectedUser.verification_status].bg} ${STATUS_LABELS[selectedUser.verification_status].color}`}>
                      {selectedUser.verification_status === "verified" && <CheckCircle size={11} />}
                      {selectedUser.verification_status === "rejected"  && <XCircle size={11} />}
                      {selectedUser.verification_status === "pending"   && <Clock size={11} />}
                      {STATUS_LABELS[selectedUser.verification_status].label}
                    </span>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Account Number", value: selectedUser.account_number, icon: Hash },
                    { label: "Phone",          value: selectedUser.phone || "—",   icon: Phone },
                    { label: "Country",        value: selectedUser.country || "—", icon: MapPin },
                    { label: "Profession",     value: selectedUser.profession || "—", icon: Briefcase },
                    { label: "City",           value: selectedUser.city || "—",    icon: MapPin },
                    { label: "Joined",         value: new Date(selectedUser.joining_date).toLocaleDateString(), icon: Calendar },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-[#f8fafc] rounded-xl p-3 border border-[#f1f5f9]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={11} className="text-[#94a3b8]" />
                        <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">{label}</p>
                      </div>
                      <p className="text-sm font-bold text-[#0c2d4e] truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {/* ID documents */}
                <div>
                  <h3 className="text-sm font-bold text-[#0c2d4e] mb-3">Identity Documents</h3>
                  {selectedUser.kyc_submitted ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Front ID Card", url: selectedUser.front_id_url },
                        { label: "Back ID Card",  url: selectedUser.back_id_url },
                      ].map(({ label, url }) => (
                        <div key={label} className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                          <div className="bg-[#f8fafc] aspect-video flex items-center justify-center">
                            {url ? (
                              <img src={url} alt={label} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center">
                                <Eye size={22} className="text-[#c4d4e0] mx-auto mb-1" />
                                <p className="text-xs text-[#c4d4e0]">No preview available</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-white">
                            <p className="text-xs font-semibold text-[#334155]">{label}</p>
                            {url && (
                              <a href={url} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] text-[#1a6fad] font-bold hover:underline flex items-center gap-1">
                                <Eye size={10} /> View
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 flex items-center gap-2">
                      <Clock size={14} className="shrink-0" />
                      No KYC documents submitted yet.
                    </div>
                  )}
                </div>

                {/* Action feedback */}
                {actionMsg && (
                  <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold animate-scale-in ${actionMsg.ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
                    {actionMsg.msg}
                  </div>
                )}

                {/* Action buttons */}
                {selectedUser.kyc_submitted && (
                  <div className="space-y-3 pt-2 border-t border-[#f1f5f9]">
                    <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Update Verification Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["verified", "pending", "unverified", "rejected"] as VerificationStatus[]).map(status => {
                        const isActive = selectedUser.verification_status === status
                        const styles: Record<VerificationStatus, string> = {
                          verified:   "bg-green-600 hover:bg-green-700 text-white",
                          pending:    "bg-amber-500 hover:bg-amber-600 text-white",
                          unverified: "bg-slate-400 hover:bg-slate-500 text-white",
                          rejected:   "bg-red-600 hover:bg-red-700 text-white",
                        }
                        return (
                          <button key={status}
                            onClick={() => handleStatusChange(selectedUser.id, status)}
                            disabled={isActive || actionLoading}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold capitalize transition-all btn-press ${
                              isActive ? "opacity-40 cursor-default bg-[#e2e8f0] text-[#94a3b8]" : styles[status]
                            } disabled:opacity-50`}>
                            {status === "verified"   && <CheckCircle size={14} />}
                            {status === "rejected"   && <XCircle size={14} />}
                            {status === "pending"    && <Clock size={14} />}
                            {status === "unverified" && <ShieldCheck size={14} />}
                            {isActive ? `${status} ✓` : `Set ${status}`}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {!selectedUser.kyc_submitted && (
                  <div className="pt-2 border-t border-[#f1f5f9]">
                    <p className="text-xs text-[#94a3b8] text-center">Action buttons appear once the user submits KYC documents.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl min-h-64 flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-14 h-14 rounded-full bg-[#e8f4fd] flex items-center justify-center">
                  <ShieldCheck size={24} className="text-[#1a6fad]" />
                </div>
                <p className="font-bold text-[#0c2d4e] tracking-tight">Select a user to review</p>
                <p className="text-sm text-[#94a3b8] max-w-xs">Click any user from the list to view their KYC details and take action.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

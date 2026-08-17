"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Search, X, CheckCircle, XCircle, Clock, ShieldCheck, DollarSign,
  ChevronDown, ChevronUp, Plus, Minus, Eye, RefreshCw, AlertCircle,
  User, Phone, MapPin, Calendar, Hash, TrendingUp, TrendingDown,
} from "lucide-react"
import AdminShell from "@/components/admin/admin-shell"
import {
  adminGetAllUsers, adminGetUserTransactions, adminUpdateVerificationStatus,
  adminCreditUser, adminDebitUser,
  type DBProfile, type DBTransaction, type VerificationStatus,
} from "@/lib/supabase/admin"
import { sendCreditEmail, sendDebitEmail } from "@/lib/send-email-client"
import { formatCurrency } from "@/lib/currency"

const STATUS_STYLES: Record<VerificationStatus, { label: string; badge: string; icon: React.ElementType }> = {
  verified:   { label: "Verified",         badge: "bg-green-100 text-green-700",  icon: CheckCircle },
  pending:    { label: "Pending Review",   badge: "bg-amber-100 text-amber-700",  icon: Clock },
  unverified: { label: "Unverified",       badge: "bg-slate-100 text-[#94a3b8]", icon: ShieldCheck },
  rejected:   { label: "Unable to Verify", badge: "bg-red-100 text-red-500",     icon: XCircle },
}

export default function AdminUsersPage() {
  const [users, setUsers]               = useState<DBProfile[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [search, setSearch]             = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | VerificationStatus>("all")
  const [expandedId, setExpandedId]     = useState<string | null>(null)
  const [userTxs, setUserTxs]           = useState<Record<string, DBTransaction[]>>({})
  const [txLoading, setTxLoading]       = useState<Record<string, boolean>>({})

  // Per-user balance form state
  const [amountInputs, setAmountInputs] = useState<Record<string, string>>({})
  const [descInputs, setDescInputs]     = useState<Record<string, string>>({})
  const [feedback, setFeedback]         = useState<Record<string, { msg: string; ok: boolean }>>({})
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  const loadUsers = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await adminGetAllUsers()
      setUsers(data)
    } catch (e: any) {
      setError(e.message ?? "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  const toggleExpand = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return }
    setExpandedId(id)
    if (!userTxs[id]) {
      setTxLoading(p => ({ ...p, [id]: true }))
      try {
        const txs = await adminGetUserTransactions(id)
        setUserTxs(p => ({ ...p, [id]: txs }))
      } catch { /* silent */ } finally {
        setTxLoading(p => ({ ...p, [id]: false }))
      }
    }
  }

  const showFeedback = (id: string, msg: string, ok: boolean) => {
    setFeedback(p => ({ ...p, [id]: { msg, ok } }))
    setTimeout(() => setFeedback(p => { const n = { ...p }; delete n[id]; return n }), 3500)
  }

  const handleBalance = async (userId: string, type: "credit" | "debit") => {
    const amount = parseFloat(amountInputs[userId] || "0")
    const desc   = descInputs[userId]?.trim() || (type === "credit" ? "Admin Credit" : "Admin Debit")
    if (!amount || amount <= 0) { showFeedback(userId, "Enter a valid amount.", false); return }

    setActionLoading(p => ({ ...p, [userId]: true }))
    try {
      if (type === "credit") await adminCreditUser(userId, amount, desc)
      else await adminDebitUser(userId, amount, desc)

      setAmountInputs(p => ({ ...p, [userId]: "" }))
      setDescInputs(p => ({ ...p, [userId]: "" }))
      showFeedback(userId, `${type === "credit" ? "Credited" : "Debited"} $${amount.toFixed(2)} successfully!`, true)

      // Refresh user list and transactions
      const [fresh, freshTxs] = await Promise.all([
        adminGetAllUsers(),
        adminGetUserTransactions(userId),
      ])
      setUsers(fresh)
      setUserTxs(p => ({ ...p, [userId]: freshTxs }))

      // Find the updated user to send email
      const updatedUser = fresh.find(u => u.id === userId)
      if (updatedUser) {
        const country     = updatedUser.country || "United States"
        const amountFmt   = formatCurrency(amount, country)
        const newBalFmt   = formatCurrency(Number(updatedUser.balance), country)
        const now         = new Date().toLocaleString("en-US", {
          month: "long", day: "numeric", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
        // Grab the latest transaction ID from the fresh list
        const latestTx = freshTxs[0]
        const txId     = latestTx?.transaction_id ?? "N/A"

        if (type === "credit") {
          await sendCreditEmail({
            to:            updatedUser.email,
            firstName:     updatedUser.first_name || "Valued Customer",
            email:         updatedUser.email,
            accountNumber: updatedUser.account_number,
            amount:        amountFmt,
            description:   desc,
            newBalance:    newBalFmt,
            transactionId: txId,
            date:          now,
          })
        } else {
          await sendDebitEmail({
            to:            updatedUser.email,
            firstName:     updatedUser.first_name || "Valued Customer",
            email:         updatedUser.email,
            accountNumber: updatedUser.account_number,
            amount:        amountFmt,
            description:   desc,
            newBalance:    newBalFmt,
            transactionId: txId,
            date:          now,
          })
        }
      }
    } catch (e: any) {
      showFeedback(userId, e.message ?? "Operation failed.", false)
    } finally {
      setActionLoading(p => ({ ...p, [userId]: false }))
    }
  }

  const handleKycChange = async (userId: string, status: VerificationStatus) => {
    setActionLoading(p => ({ ...p, [userId]: true }))
    try {
      await adminUpdateVerificationStatus(userId, status)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, verification_status: status } : u))
      showFeedback(userId, `Status updated to "${status}".`, true)
    } catch (e: any) {
      showFeedback(userId, e.message ?? "Update failed.", false)
    } finally {
      setActionLoading(p => ({ ...p, [userId]: false }))
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      `${u.first_name} ${u.last_name} ${u.email} ${u.account_number}`
        .toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || u.verification_status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all:        users.length,
    verified:   users.filter(u => u.verification_status === "verified").length,
    pending:    users.filter(u => u.verification_status === "pending").length,
    unverified: users.filter(u => u.verification_status === "unverified").length,
    rejected:   users.filter(u => u.verification_status === "rejected").length,
  }

  return (
    <AdminShell>
      <div className="space-y-5 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2d4e] tracking-tight">User Management</h1>
            <p className="text-sm text-[#64748b] mt-0.5">Manage accounts, balances and KYC verification</p>
          </div>
          <button onClick={loadUsers} disabled={loading}
            className="flex items-center gap-2 text-sm text-[#1a6fad] border border-[#e2e8f0] px-4 py-2 rounded-xl hover:bg-[#f0f7ff] transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm text-red-600">
            <AlertCircle size={15} className="shrink-0" /> {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20 placeholder:text-[#c4d4e0]"
                placeholder="Search by name, email, or account number..." />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0c2d4e]"><X size={14} /></button>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "verified", "pending", "unverified", "rejected"] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${statusFilter === s ? "bg-[#0c2d4e] text-white" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"}`}>
                  {s} ({counts[s]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white border border-[#e2e8f0] rounded-2xl shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-14 text-center">
            <div className="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <User size={24} className="text-[#c4d4e0]" />
            </div>
            <p className="text-sm font-semibold text-[#94a3b8]">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(user => {
              const st = STATUS_STYLES[user.verification_status]
              const Icon = st.icon
              const isExpanded = expandedId === user.id
              const txs = userTxs[user.id] ?? []

              return (
                <div key={user.id} className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
                  {/* Row */}
                  <div onClick={() => toggleExpand(user.id)}
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#f8fafc] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a6fad] to-[#0e9483] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-[#0c2d4e] text-sm">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-[#94a3b8]">{user.email}</p>
                        <p className="text-xs font-mono text-[#64748b]">{user.account_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-[#0c2d4e]">${Number(user.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-[#94a3b8]">{new Date(user.joining_date).toLocaleDateString()}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${st.badge}`}>
                        <Icon size={11} />
                        <span className="hidden sm:inline capitalize">{user.verification_status}</span>
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-[#94a3b8]" /> : <ChevronDown size={16} className="text-[#94a3b8]" />}
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div className="border-t border-[#f1f5f9] p-5 bg-[#f8fafc] space-y-5">
                      {/* Detail grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Country",      value: user.country || "—",     icon: MapPin },
                          { label: "Phone",        value: user.phone || "—",       icon: Phone },
                          { label: "Joined",       value: new Date(user.joining_date).toLocaleDateString(), icon: Calendar },
                          { label: "KYC Submitted",value: user.kyc_submitted ? "Yes" : "No", icon: ShieldCheck },
                        ].map(({ label, value, icon: Ico }) => (
                          <div key={label} className="bg-white rounded-xl p-3 border border-[#e2e8f0]">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Ico size={11} className="text-[#94a3b8]" />
                              <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">{label}</p>
                            </div>
                            <p className="text-sm font-semibold text-[#0c2d4e] truncate">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* KYC doc links */}
                      {(user.front_id_url || user.back_id_url) && (
                        <div className="flex gap-3">
                          {user.front_id_url && (
                            <a href={user.front_id_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-[#1a6fad] border border-[#1a6fad]/30 bg-[#e8f4fd] px-3 py-1.5 rounded-lg hover:bg-[#d0eafb] transition-colors font-semibold">
                              <Eye size={12} /> View Front ID
                            </a>
                          )}
                          {user.back_id_url && (
                            <a href={user.back_id_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-[#1a6fad] border border-[#1a6fad]/30 bg-[#e8f4fd] px-3 py-1.5 rounded-lg hover:bg-[#d0eafb] transition-colors font-semibold">
                              <Eye size={12} /> View Back ID
                            </a>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Balance management */}
                        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
                          <p className="text-sm font-bold text-[#0c2d4e] mb-3 flex items-center gap-2">
                            <DollarSign size={15} className="text-[#1a6fad]" /> Adjust Balance
                          </p>
                          <p className="text-xs text-[#64748b] mb-3">
                            Current: <strong className="text-[#0c2d4e]">${Number(user.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                          </p>
                          <div className="space-y-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-sm font-bold">$</span>
                              <input type="number" value={amountInputs[user.id] || ""} onChange={e => setAmountInputs(p => ({ ...p, [user.id]: e.target.value }))}
                                className="w-full pl-7 pr-3 py-2.5 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"
                                placeholder="Enter amount..." />
                            </div>
                            <input type="text" value={descInputs[user.id] || ""} onChange={e => setDescInputs(p => ({ ...p, [user.id]: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-xl text-sm outline-none focus:border-[#1a6fad] focus:ring-2 focus:ring-[#1a6fad]/20"
                              placeholder="Description (optional)" />
                            <div className="flex gap-2">
                              <button onClick={() => handleBalance(user.id, "credit")} disabled={actionLoading[user.id]}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-[#0e9483] hover:bg-[#0c7a6e] disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-colors btn-press">
                                <Plus size={13} /> Credit
                              </button>
                              <button onClick={() => handleBalance(user.id, "debit")} disabled={actionLoading[user.id]}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-colors btn-press">
                                <Minus size={13} /> Debit
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* KYC status */}
                        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
                          <p className="text-sm font-bold text-[#0c2d4e] mb-3 flex items-center gap-2">
                            <ShieldCheck size={15} className="text-[#1a6fad]" /> KYC Verification
                          </p>
                          <p className="text-xs text-[#64748b] mb-3">
                            Status: <span className={`font-bold capitalize ${
                              user.verification_status === "verified" ? "text-[#0e9483]" :
                              user.verification_status === "pending"  ? "text-amber-600" :
                              user.verification_status === "rejected" ? "text-red-500" : "text-[#94a3b8]"
                            }`}>{user.verification_status}</span>
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {(["verified", "pending", "unverified", "rejected"] as VerificationStatus[]).map(status => (
                              <button key={status} onClick={() => handleKycChange(user.id, status)}
                                disabled={user.verification_status === status || actionLoading[user.id]}
                                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all btn-press ${
                                  user.verification_status === status ? "bg-[#e2e8f0] text-[#94a3b8] cursor-default" :
                                  status === "verified"   ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100" :
                                  status === "pending"    ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100" :
                                  status === "rejected"   ? "bg-red-50 text-red-500 hover:bg-red-100 border border-red-100" :
                                  "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                                }`}>
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Feedback */}
                      {feedback[user.id] && (
                        <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold animate-scale-in ${feedback[user.id].ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
                          {feedback[user.id].msg}
                        </div>
                      )}

                      {/* Recent transactions */}
                      <div>
                        <p className="text-sm font-bold text-[#0c2d4e] mb-3">Recent Transactions</p>
                        {txLoading[user.id] ? (
                          <div className="h-10 shimmer rounded-xl" />
                        ) : txs.length === 0 ? (
                          <p className="text-xs text-[#94a3b8]">No transactions yet</p>
                        ) : (
                          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                            {txs.slice(0, 10).map(tx => (
                              <div key={tx.id} className="flex items-center justify-between bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-teal-50" : "bg-red-50"}`}>
                                    {tx.type === "credit" ? <TrendingUp size={12} className="text-[#0e9483]" /> : <TrendingDown size={12} className="text-red-500" />}
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-[#0c2d4e]">{tx.description}</p>
                                    <p className="text-[10px] text-[#94a3b8] font-mono">{tx.transaction_id}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm font-bold ${tx.type === "credit" ? "text-[#0e9483]" : "text-red-500"}`}>
                                    {tx.type === "credit" ? "+" : "−"}${Number(tx.amount).toFixed(2)}
                                  </p>
                                  <p className="text-[10px] text-[#94a3b8]">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {!loading && (
          <p className="text-xs text-[#94a3b8] text-center">
            Showing <strong className="text-[#64748b]">{filtered.length}</strong> of <strong className="text-[#64748b]">{users.length}</strong> users
          </p>
        )}
      </div>
    </AdminShell>
  )
}

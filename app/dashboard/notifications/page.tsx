"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell, ChevronLeft, ShieldCheck, TrendingUp, TrendingDown,
  Gift, Info, CheckCircle, Trash2, BellOff,
} from "lucide-react"
import { useApp } from "@/lib/store"

type NotifCategory = "all" | "transactions" | "security" | "system"

interface Notification {
  id: string
  type: "transaction_credit" | "transaction_debit" | "security" | "kyc" | "system" | "bonus"
  title: string
  message: string
  time: string
  read: boolean
}

function buildNotifications(currentUser: any): Notification[] {
  const notifs: Notification[] = []

  // Signup bonus
  notifs.push({
    id: "welcome",
    type: "bonus",
    title: "Welcome to BlueStone Trust Bank",
    message: "Your account has been created and a welcome bonus has been credited to your balance.",
    time: currentUser?.joiningDate ?? "Just now",
    read: true,
  })

  // KYC status
  if (!currentUser?.kycSubmitted) {
    notifs.push({
      id: "kyc-prompt",
      type: "kyc",
      title: "Complete your identity verification",
      message: "Verify your identity to unlock withdrawals, transfers, and all premium features.",
      time: "Pending",
      read: false,
    })
  } else if (currentUser?.verificationStatus === "pending") {
    notifs.push({
      id: "kyc-pending",
      type: "kyc",
      title: "KYC documents under review",
      message: "Your identity documents have been submitted and are currently being reviewed by our team.",
      time: "In review",
      read: false,
    })
  } else if (currentUser?.verificationStatus === "verified") {
    notifs.push({
      id: "kyc-verified",
      type: "kyc",
      title: "Identity verified successfully",
      message: "Your account is fully verified. You now have access to all banking features.",
      time: "Completed",
      read: true,
    })
  } else if (currentUser?.verificationStatus === "rejected") {
    notifs.push({
      id: "kyc-rejected",
      type: "kyc",
      title: "Verification could not be completed",
      message: "We were unable to verify your documents. Please contact our support team for assistance.",
      time: "Action required",
      read: false,
    })
  }

  // Recent transactions
  const recentTxs = (currentUser?.transactions ?? []).slice(0, 5)
  for (const tx of recentTxs) {
    notifs.push({
      id: tx.id,
      type: tx.type === "credit" ? "transaction_credit" : "transaction_debit",
      title: tx.type === "credit" ? "Money received" : "Money sent",
      message: `${tx.description} — ${tx.type === "credit" ? "+" : "-"}$${Number(tx.amount).toFixed(2)}`,
      time: tx.date,
      read: true,
    })
  }

  // Security notice
  notifs.push({
    id: "security-tip",
    type: "security",
    title: "Keep your account secure",
    message: "Never share your password or OTP with anyone including bank staff. BlueStone will never ask for your password.",
    time: currentUser?.joiningDate ?? "Account tip",
    read: true,
  })

  return notifs
}

const TYPE_ICON: Record<string, React.ElementType> = {
  transaction_credit: TrendingUp,
  transaction_debit:  TrendingDown,
  security:           ShieldCheck,
  kyc:                ShieldCheck,
  system:             Info,
  bonus:              Gift,
}

const TYPE_STYLE: Record<string, { icon_bg: string; icon_color: string }> = {
  transaction_credit: { icon_bg: "bg-green-50",   icon_color: "text-[#0e9483]" },
  transaction_debit:  { icon_bg: "bg-red-50",     icon_color: "text-red-500" },
  security:           { icon_bg: "bg-blue-50",    icon_color: "text-[#1a6fad]" },
  kyc:                { icon_bg: "bg-amber-50",   icon_color: "text-amber-500" },
  system:             { icon_bg: "bg-slate-50",   icon_color: "text-[#64748b]" },
  bonus:              { icon_bg: "bg-purple-50",  icon_color: "text-purple-600" },
}

const CATEGORY_MAP: Record<NotifCategory, string[]> = {
  all:          ["transaction_credit","transaction_debit","security","kyc","system","bonus"],
  transactions: ["transaction_credit","transaction_debit"],
  security:     ["security","kyc"],
  system:       ["system","bonus"],
}

export default function NotificationsPage() {
  const { currentUser } = useApp()
  const [filter, setFilter]     = useState<NotifCategory>("all")
  const [readIds, setReadIds]   = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const allNotifs = buildNotifications(currentUser)

  const visible = allNotifs.filter(n =>
    !dismissed.has(n.id) &&
    CATEGORY_MAP[filter].includes(n.type)
  )

  const unreadCount = allNotifs.filter(n =>
    !n.read && !readIds.has(n.id) && !dismissed.has(n.id)
  ).length

  const markAllRead = () => {
    setReadIds(new Set(allNotifs.map(n => n.id)))
  }

  const dismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]))
  }

  const isRead = (n: Notification) => n.read || readIds.has(n.id)

  return (
    <div className="max-w-2xl mx-auto pb-4 space-y-5 animate-fade-in-up">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard"
            className="w-9 h-9 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl text-[#64748b] hover:text-[#0c2d4e] transition-all">
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#0c2d4e] tracking-tight flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-xs text-[#64748b]">Your account activity and alerts</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-[#1a6fad] font-semibold hover:text-[#0c2d4e] transition-colors border border-[#e2e8f0] px-3 py-2 rounded-xl hover:bg-[#f0f7ff]">
            <CheckCircle size={13} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-2 flex gap-2 overflow-x-auto">
        {([
          { id: "all",          label: "All" },
          { id: "transactions", label: "Transactions" },
          { id: "security",     label: "Security" },
          { id: "system",       label: "System" },
        ] as { id: NotifCategory; label: string }[]).map(({ id, label }) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              filter === id ? "bg-[#0c2d4e] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {visible.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-14 text-center">
          <div className="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BellOff size={24} className="text-[#c4d4e0]" />
          </div>
          <p className="text-sm font-semibold text-[#94a3b8]">No notifications here</p>
          <p className="text-xs text-[#c4d4e0] mt-1">Check back later for updates</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          {visible.map((notif, i) => {
            const Icon  = TYPE_ICON[notif.type] ?? Bell
            const style = TYPE_STYLE[notif.type]
            const read  = isRead(notif)

            return (
              <div key={notif.id}
                onClick={() => setReadIds(prev => new Set([...prev, notif.id]))}
                className={`flex items-start gap-4 px-5 py-4 border-b border-[#f8fafc] last:border-0 transition-colors cursor-pointer group ${
                  read ? "hover:bg-[#fafbfc]" : "bg-[#f0f7ff] hover:bg-[#e8f4fd]"
                } animate-fade-in-up`}
                style={{ animationDelay: `${i * 40}ms` }}>

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${style.icon_bg}`}>
                  <Icon size={18} className={style.icon_color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-tight ${read ? "font-medium text-[#334155]" : "font-bold text-[#0c2d4e]"}`}>
                      {notif.title}
                    </p>
                    {!read && (
                      <span className="w-2 h-2 rounded-full bg-[#1a6fad] shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-[#94a3b8] mt-1.5">{notif.time}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(notif.id) }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-[#c4d4e0] hover:text-red-400 hover:bg-red-50 rounded-lg shrink-0"
                  title="Dismiss">
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-[#94a3b8] text-center">
        Notifications are based on your account activity. Dismissed notifications cannot be recovered.
      </p>
    </div>
  )
}

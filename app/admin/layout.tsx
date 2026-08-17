"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useApp } from "@/lib/store"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAdminLoggedIn && pathname !== "/admin/login") {
      router.replace("/admin/login")
    }
  }, [isAdminLoggedIn, pathname, router])

  if (!isAdminLoggedIn && pathname !== "/admin/login") {
    return null
  }

  return <>{children}</>
}

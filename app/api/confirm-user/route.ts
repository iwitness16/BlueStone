import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import {
  sendEmail,
  welcomeEmailHtml,
  adminNewUserEmailHtml,
  ADMIN,
} from "@/lib/email"
import { formatBonus } from "@/lib/currency"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // ── 1. Confirm the user's email ──────────────────────────────────────────
    // auth.admin.updateUser is not available in this version of the JS client.
    // Call the Supabase Auth admin REST API directly instead.
    const adminRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "apikey":        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        body: JSON.stringify({ email_confirm: true }),
      }
    )

    if (!adminRes.ok) {
      const adminErr = await adminRes.text()
      console.error("[confirm-user] admin REST failed:", adminErr)
      // Fallback via RPC function if available
      const { error: rpcError } = await supabaseAdmin.rpc("confirm_user_email", {
        user_id: userId,
      })
      if (rpcError) {
        console.error("[confirm-user] rpc fallback failed:", rpcError.message)
        // Don't block signup — continue even if confirmation fails
      }
    }

    // ── 2. Fetch profile to get user details for emails ──────────────────────
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("first_name, last_name, email, account_number, country, phone, joining_date")
      .eq("id", userId)
      .single()

    if (profile) {
      const bonusDisplay = formatBonus(profile.country || "United States")
      const joinedAt = profile.joining_date
        ? new Date(profile.joining_date).toLocaleString("en-US", {
            month: "long", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })
        : new Date().toLocaleString("en-US", {
            month: "long", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })

      // ── 3. Send welcome email to the new user ────────────────────────────
      await sendEmail({
        to:      profile.email,
        subject: `Welcome to BlueStone Trust Bank — Your account is ready`,
        html:    welcomeEmailHtml({
          firstName:     profile.first_name  || "Valued Customer",
          email:         profile.email,
          accountNumber: profile.account_number,
          bonusAmount:   bonusDisplay,
          country:       profile.country || "Not specified",
        }),
      })

      // ── 4. Send admin notification ───────────────────────────────────────
      await sendEmail({
        to:      ADMIN,
        subject: `[BlueStone] New customer registered — ${profile.first_name} ${profile.last_name}`,
        html:    adminNewUserEmailHtml({
          firstName:     profile.first_name  || "",
          lastName:      profile.last_name   || "",
          email:         profile.email,
          accountNumber: profile.account_number,
          country:       profile.country || "Not specified",
          phone:         profile.phone   || "Not provided",
          joinedAt,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[confirm-user] unexpected error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

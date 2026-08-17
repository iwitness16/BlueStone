import { NextRequest, NextResponse } from "next/server"
import {
  sendEmail,
  welcomeEmailHtml,
  adminNewUserEmailHtml,
  creditEmailHtml,
  debitEmailHtml,
  ADMIN,
} from "@/lib/email"

/**
 * POST /api/send-email
 *
 * Body shape (type discriminated):
 *
 * { type: "welcome",    to, firstName, email, accountNumber, bonusAmount, country }
 * { type: "admin_new_user", firstName, lastName, email, accountNumber, country, phone, joinedAt }
 * { type: "credit",    to, firstName, email, accountNumber, amount, description, newBalance, transactionId, date }
 * { type: "debit",     to, firstName, email, accountNumber, amount, description, newBalance, transactionId, date }
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type } = body

    if (!type) {
      return NextResponse.json({ error: "Missing email type" }, { status: 400 })
    }

    let result: { ok: boolean; error?: string }

    switch (type) {

      case "welcome": {
        // 1. Welcome email to the new user
        result = await sendEmail({
          to:      body.to,
          subject: `Welcome to BlueStone Trust Bank — Your account is ready`,
          html:    welcomeEmailHtml({
            firstName:     body.firstName,
            email:         body.email,
            accountNumber: body.accountNumber,
            bonusAmount:   body.bonusAmount,
            country:       body.country,
          }),
        })
        break
      }

      case "admin_new_user": {
        // 2. Admin notification of new registration
        result = await sendEmail({
          to:      ADMIN,
          subject: `[BlueStone] New customer registered — ${body.firstName} ${body.lastName}`,
          html:    adminNewUserEmailHtml({
            firstName:     body.firstName,
            lastName:      body.lastName,
            email:         body.email,
            accountNumber: body.accountNumber,
            country:       body.country,
            phone:         body.phone,
            joinedAt:      body.joinedAt,
          }),
        })
        break
      }

      case "credit": {
        // 3. Credit notification to user
        result = await sendEmail({
          to:      body.to,
          subject: `Funds credited to your account — ${body.amount}`,
          html:    creditEmailHtml({
            firstName:     body.firstName,
            email:         body.email,
            accountNumber: body.accountNumber,
            amount:        body.amount,
            description:   body.description,
            newBalance:    body.newBalance,
            transactionId: body.transactionId,
            date:          body.date,
          }),
        })
        break
      }

      case "debit": {
        // 4. Debit notification to user
        result = await sendEmail({
          to:      body.to,
          subject: `Account debit notice — ${body.amount} has been debited`,
          html:    debitEmailHtml({
            firstName:     body.firstName,
            email:         body.email,
            accountNumber: body.accountNumber,
            amount:        body.amount,
            description:   body.description,
            newBalance:    body.newBalance,
            transactionId: body.transactionId,
            date:          body.date,
          }),
        })
        break
      }

      default:
        return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 })
    }

    if (!result.ok) {
      console.error("[send-email] send failed:", result.error)
      // Return 200 so caller doesn't break — email failure is non-fatal
      return NextResponse.json({ ok: false, error: result.error })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[send-email] unexpected error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

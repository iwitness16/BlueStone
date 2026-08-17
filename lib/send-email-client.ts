/**
 * Thin client-side wrapper around POST /api/send-email
 * Use this from any client component or page — never import lib/email.ts directly
 * on the client (it contains server-only nodemailer code).
 */

async function post(body: Record<string, unknown>) {
  try {
    await fetch("/api/send-email", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    })
  } catch {
    // Email is non-fatal — silently ignore network errors
  }
}

export async function sendWelcomeEmail(opts: {
  to:            string
  firstName:     string
  email:         string
  accountNumber: string
  bonusAmount:   string
  country:       string
}) {
  await post({ type: "welcome", ...opts })
}

export async function sendAdminNewUserEmail(opts: {
  firstName:     string
  lastName:      string
  email:         string
  accountNumber: string
  country:       string
  phone:         string
  joinedAt:      string
}) {
  await post({ type: "admin_new_user", ...opts })
}

export async function sendCreditEmail(opts: {
  to:            string
  firstName:     string
  email:         string
  accountNumber: string
  amount:        string
  description:   string
  newBalance:    string
  transactionId: string
  date:          string
}) {
  await post({ type: "credit", ...opts })
}

export async function sendDebitEmail(opts: {
  to:            string
  firstName:     string
  email:         string
  accountNumber: string
  amount:        string
  description:   string
  newBalance:    string
  transactionId: string
  date:          string
}) {
  await post({ type: "debit", ...opts })
}

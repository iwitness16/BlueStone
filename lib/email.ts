/**
 * BlueStone Trust Bank — Email Service
 * Uses Nodemailer with SpaceMail SMTP
 * Sends branded HTML emails on behalf of the bank / Global Line Express refunds dept.
 */

import nodemailer from "nodemailer"

// ─── Transport ────────────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   ?? "mail.spacemail.com",
  port:   Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
  tls: { rejectUnauthorized: false },
})

export const FROM    = process.env.EMAIL_FROM   ?? "BlueStone Trust Bank <noreply@bluestonetrustbank.com>"
export const ADMIN   = process.env.ADMIN_EMAIL  ?? "info@bluestonetrustbank.com"
export const BANK    = "BlueStone Trust Bank"
export const DEPT    = "Refunds Department"
export const SUPPORT = "info@bluestonetrustbank.com"
export const PHONE   = "+1 (334) 446-8194"
export const SITE    = "https://bluestonetrustbank.com"

// ─── Shared layout ────────────────────────────────────────────────────────────

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${BANK}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c2d4e 0%,#1a4a72 60%,#1a6fad 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">${BANK}</p>
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.55);letter-spacing:1px;text-transform:uppercase;">${DEPT}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#64748b;">
              ${BANK} &nbsp;|&nbsp; ${DEPT}
            </p>
            <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;">
              Support: <a href="mailto:${SUPPORT}" style="color:#1a6fad;text-decoration:none;">${SUPPORT}</a>
              &nbsp;|&nbsp; ${PHONE}
            </p>
            <p style="margin:0;font-size:10px;color:#c4d4e0;">
              100 Financial District, New York, NY 10005, USA &nbsp;|&nbsp; FDIC Insured &nbsp;|&nbsp; 256-bit SSL
            </p>
            <p style="margin:8px 0 0;font-size:10px;color:#c4d4e0;">
              This is an automated message from ${BANK}. Please do not reply directly to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Helper components ────────────────────────────────────────────────────────

function badge(text: string, color: string, bg: string) {
  return `<span style="display:inline-block;background:${bg};color:${color};font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${text}</span>`
}

function divider() {
  return `<div style="height:1px;background:#f1f5f9;margin:24px 0;"></div>`
}

function row(label: string, value: string, valueColor = "#0c2d4e") {
  return `
  <tr>
    <td style="padding:8px 0;font-size:13px;color:#64748b;width:40%;">${label}</td>
    <td style="padding:8px 0;font-size:13px;font-weight:600;color:${valueColor};text-align:right;">${value}</td>
  </tr>`
}

// ─── Template: Welcome email (sent to new user) ───────────────────────────────

export function welcomeEmailHtml(opts: {
  firstName: string
  email: string
  accountNumber: string
  bonusAmount: string
  country: string
}) {
  return layout(`
    <p style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0c2d4e;">Welcome, ${opts.firstName}!</p>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      Your ${BANK} account has been created successfully. We're glad to have you with us.
    </p>

    <!-- Bonus highlight -->
    <div style="background:linear-gradient(135deg,#e8f4fd,#e0f7f4);border:1px solid rgba(26,111,173,0.2);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Welcome Bonus Credited</p>
      <p style="margin:0;font-size:36px;font-weight:900;color:#0c2d4e;">${opts.bonusAmount}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#64748b;">Available in your account balance right now</p>
    </div>

    <!-- Account details -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0c2d4e;text-transform:uppercase;letter-spacing:0.5px;">Your Account Details</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Account Holder", opts.firstName)}
        ${row("Email Address", opts.email)}
        ${row("Account Number", `<span style="font-family:monospace;">${opts.accountNumber}</span>`)}
        ${row("Country", opts.country)}
        ${row("Account Status", badge("Active", "#0e9483", "#e0f7f4"))}
      </table>
    </div>

    ${divider()}

    <!-- Next steps -->
    <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0c2d4e;">What to do next</p>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${[
        ["1", "Complete your KYC verification to unlock withdrawals and transfers"],
        ["2", "Set up your profile and update your address details"],
        ["3", "Explore FDR and DPS plans to grow your savings"],
      ].map(([n, text]) => `
      <tr>
        <td style="width:28px;vertical-align:top;padding:4px 0;">
          <span style="display:inline-flex;width:20px;height:20px;background:#0c2d4e;color:#fff;border-radius:50%;font-size:11px;font-weight:700;align-items:center;justify-content:center;">${n}</span>
        </td>
        <td style="padding:4px 0 4px 8px;font-size:13px;color:#475569;">${text}</td>
      </tr>`).join("")}
    </table>

    ${divider()}

    <p style="margin:0 0 16px;font-size:13px;color:#64748b;line-height:1.6;">
      As the official refunds processing bank for <strong>Your Agency</strong>, we handle all
      refund disbursements on their behalf. Your account is ready to receive any eligible refunds.
    </p>

    <a href="${SITE}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#0c2d4e,#1a4a72);color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">
      Go to Dashboard
    </a>
  `)
}

// ─── Template: Admin new-user alert ──────────────────────────────────────────

export function adminNewUserEmailHtml(opts: {
  firstName: string
  lastName: string
  email: string
  accountNumber: string
  country: string
  phone: string
  joinedAt: string
}) {
  return layout(`
    <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#0c2d4e;">New User Registration</p>
    <p style="margin:0 0 24px;font-size:13px;color:#64748b;">A new customer has signed up on ${BANK}.</p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Customer Details</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Full Name",       `${opts.firstName} ${opts.lastName}`)}
        ${row("Email",           opts.email)}
        ${row("Phone",           opts.phone || "Not provided")}
        ${row("Account Number",  `<span style="font-family:monospace;">${opts.accountNumber}</span>`)}
        ${row("Country",         opts.country || "Not specified")}
        ${row("Registered At",   opts.joinedAt)}
        ${row("KYC Status",      badge("Unverified — Pending", "#92400e", "#fef3c7"))}
      </table>
    </div>

    <p style="margin:0 0 16px;font-size:13px;color:#475569;line-height:1.6;">
      Log in to the admin panel to review this account, manage KYC verification, and credit or debit balances.
    </p>

    <a href="${SITE}/admin/users" style="display:inline-block;background:linear-gradient(135deg,#0c2d4e,#1a4a72);color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">
      View in Admin Panel
    </a>
  `)
}

// ─── Template: Credit notification (sent to user) ────────────────────────────

export function creditEmailHtml(opts: {
  firstName: string
  email: string
  accountNumber: string
  amount: string
  description: string
  newBalance: string
  transactionId: string
  date: string
}) {
  return layout(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:#e0f7f4;border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;margin-bottom:12px;">
        <span style="font-size:28px;">💳</span>
      </div>
      <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#0c2d4e;">Funds Received</p>
      <p style="margin:0;font-size:13px;color:#64748b;">A credit has been applied to your account</p>
    </div>

    <!-- Amount highlight -->
    <div style="background:linear-gradient(135deg,#e0f7f4,#e8f4fd);border:1px solid rgba(14,148,131,0.25);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Amount Credited</p>
      <p style="margin:0;font-size:40px;font-weight:900;color:#0e9483;">+${opts.amount}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#475569;">${opts.description}</p>
    </div>

    <!-- Transaction details -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Transaction Details</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Account Holder",   opts.firstName)}
        ${row("Account Number",   `<span style="font-family:monospace;">${opts.accountNumber}</span>`)}
        ${row("Amount Credited",  `+${opts.amount}`, "#0e9483")}
        ${row("Description",      opts.description)}
        ${row("Transaction ID",   `<span style="font-family:monospace;font-size:11px;">${opts.transactionId}</span>`)}
        ${row("Date &amp; Time",  opts.date)}
        ${row("New Balance",      opts.newBalance, "#0c2d4e")}
        ${row("Status",           badge("Successful", "#065f46", "#d1fae5"))}
      </table>
    </div>

    ${divider()}

    <p style="margin:0 0 16px;font-size:13px;color:#475569;line-height:1.6;">
      This credit was processed by <strong>${BANK}</strong> on behalf of
      <strong>Refunds Department</strong>.
      If you did not expect this payment or have questions, please contact our support team immediately.
    </p>

    <div style="display:flex;gap:12px;margin-bottom:0;">
      <a href="${SITE}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#0c2d4e,#1a4a72);color:#ffffff;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;margin-right:12px;">
        View Dashboard
      </a>
      <a href="${SITE}/dashboard/transactions" style="display:inline-block;border:2px solid #0c2d4e;color:#0c2d4e;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;">
        Transaction History
      </a>
    </div>
  `)
}

// ─── Template: Debit notification (sent to user) ─────────────────────────────

export function debitEmailHtml(opts: {
  firstName: string
  email: string
  accountNumber: string
  amount: string
  description: string
  newBalance: string
  transactionId: string
  date: string
}) {
  return layout(`
    <div style="text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#0c2d4e;">Account Debit Notice</p>
      <p style="margin:0;font-size:13px;color:#64748b;">A debit has been applied to your account</p>
    </div>

    <div style="background:#fff5f5;border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Amount Debited</p>
      <p style="margin:0;font-size:40px;font-weight:900;color:#ef4444;">-${opts.amount}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#475569;">${opts.description}</p>
    </div>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Transaction Details</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Account Holder",   opts.firstName)}
        ${row("Account Number",   `<span style="font-family:monospace;">${opts.accountNumber}</span>`)}
        ${row("Amount Debited",   `-${opts.amount}`, "#ef4444")}
        ${row("Description",      opts.description)}
        ${row("Transaction ID",   `<span style="font-family:monospace;font-size:11px;">${opts.transactionId}</span>`)}
        ${row("Date &amp; Time",  opts.date)}
        ${row("New Balance",      opts.newBalance, "#0c2d4e")}
        ${row("Status",           badge("Processed", "#1e40af", "#dbeafe"))}
      </table>
    </div>

    ${divider()}

    <p style="margin:0 0 16px;font-size:13px;color:#475569;line-height:1.6;">
      If you did not authorise this debit or believe this is an error, please contact our support team immediately.
    </p>

    <a href="${SITE}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#0c2d4e,#1a4a72);color:#ffffff;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;">
      View Dashboard
    </a>
  `)
}

// ─── Core send function ───────────────────────────────────────────────────────

export interface SendEmailOpts {
  to:      string
  subject: string
  html:    string
  replyTo?: string
}

export async function sendEmail(opts: SendEmailOpts): Promise<{ ok: boolean; error?: string }> {
  try {
    await transporter.sendMail({
      from:    FROM,
      to:      opts.to,
      subject: opts.subject,
      html:    opts.html,
      replyTo: opts.replyTo ?? SUPPORT,
    })
    return { ok: true }
  } catch (err: any) {
    console.error("[sendEmail] failed:", err.message)
    return { ok: false, error: err.message }
  }
}

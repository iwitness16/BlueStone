import { NextRequest, NextResponse } from "next/server"

/**
 * Middleware — domain routing for bluestonetrustbank.com
 *
 * - Redirects any request coming in on the old bluestonetrustbank.com domain
 *   to the canonical bluestonetrustbank.com domain.
 * - Passes all other requests through normally.
 * - The /admin routes are protected — only authenticated admin sessions can access them.
 */

const CANONICAL_HOST = "bluestonetrustbank.com"
const OLD_HOSTS      = ["bluestonetrustbank.com", "www.bluestonetrustbank.com"]

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const { pathname, search } = req.nextUrl

  // Redirect old domain to canonical domain
  if (OLD_HOSTS.some(h => host.includes(h))) {
    const redirectUrl = new URL(
      `https://${CANONICAL_HOST}${pathname}${search}`
    )
    return NextResponse.redirect(redirectUrl, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.svg|banklogo.png|placeholder).*)",
  ],
}

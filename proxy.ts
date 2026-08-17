import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy — domain routing for bluestonetrustbank.com
 *
 * Only redirects www.bluestonetrustbank.com → bluestonetrustbank.com (non-www canonical).
 * All other requests pass through normally.
 */

const CANONICAL_HOST = "bluestonetrustbank.com"

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const { pathname, search } = req.nextUrl

  // Only redirect www → non-www, never redirect the canonical host itself
  if (host === `www.${CANONICAL_HOST}`) {
    const redirectUrl = new URL(`https://${CANONICAL_HOST}${pathname}${search}`)
    return NextResponse.redirect(redirectUrl, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.svg|banklogo.png|placeholder).*)",
  ],
}

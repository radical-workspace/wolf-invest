import { type NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { nextUrl, cookies, headers } = req
  const pathname = nextUrl.pathname

  // Public paths
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // --- BYPASS in v0 preview / usercontent iframes ---
  const host = headers.get("host") || ""
  if (host.includes("v0.app") || host.includes("usercontent.net")) {
    return NextResponse.next()
  }
  // ---------------------------------------------------

  // Normal gating (production/local)
  const pinVerified = cookies.get("pin_verified")?.value === "true"
  const hasSupabaseCookie =
    cookies.has("sb-access-token") || cookies.has("sb-access-token.sig") || cookies.has("supabase-auth-token") // old helper

  if (!hasSupabaseCookie) {
    const to = new URL("/auth/sign-in", nextUrl.origin)
    to.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(to)
  }

  if (!pinVerified) {
    const to = new URL("/auth/pin", nextUrl.origin)
    to.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(to)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\.(?:png|jpg|svg|ico|css|js|map|txt)).*)"],
}

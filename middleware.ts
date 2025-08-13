import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow auth routes to pass through without middleware processing
  if (request.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
}

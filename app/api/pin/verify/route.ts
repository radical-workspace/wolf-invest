import { type NextRequest, NextResponse } from "next/server"
import { sbClient } from "@/lib/supabase/client"

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()

    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      return NextResponse.json({ error: "Invalid PIN format" }, { status: 400 })
    }

    const sb = sbClient()
    const {
      data: { user },
      error: authError,
    } = await sb.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const storedPin = user.user_metadata?.pin

    if (!storedPin) {
      return NextResponse.json({ error: "PIN not set" }, { status: 400 })
    }

    if (storedPin !== pin) {
      return NextResponse.json({ error: "Wrong PIN" }, { status: 400 })
    }

    // Set PIN verification cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set("pin_verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

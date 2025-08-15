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

    // Store PIN in user metadata (simple approach for demo)
    const { error } = await sb.auth.updateUser({
      data: { pin: pin }, // In production, hash this PIN
    })

    if (error) {
      return NextResponse.json({ error: "Failed to save PIN" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

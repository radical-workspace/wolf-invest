import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export function sbServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error("Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  const cookieStore = cookies()

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 })
      },
    },
  })
}

/** Convenience helper (optional) */
export async function getServerUser() {
  const sb = sbServer()
  const {
    data: { user },
  } = await sb.auth.getUser()
  return user
}

export const createClient = sbServer
export const isSupabaseConfigured = true

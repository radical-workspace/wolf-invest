// USE ONLY IN SERVER CODE (API routes/server actions)
import { createClient } from "@supabase/supabase-js"

export const sbAdmin = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // never expose to client
    { auth: { persistSession: false } },
  )
}

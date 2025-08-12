import { createClient } from "@supabase/supabase-js"

// Create a single Supabase client for client-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required for client-side Supabase.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

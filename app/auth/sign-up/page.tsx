"use client"
import { useState } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { sbClient } from "@/lib/supabase/client"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()
  const redirectedFrom = sp.get("redirectedFrom") || "/dashboard"

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const sb = sbClient()
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push(`/auth/pin-setup?redirectedFrom=${encodeURIComponent(redirectedFrom)}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm space-y-4 rounded-2xl p-6 shadow-lg bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join WilliamsHoldings today</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
          <button
            disabled={loading}
            className="w-full rounded-xl p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors"
          >
            {loading ? "Creating…" : "Sign up"}
          </button>
        </form>
        <div className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a
            className="text-blue-600 hover:underline"
            href={`/auth/sign-in?redirectedFrom=${encodeURIComponent(redirectedFrom)}`}
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}

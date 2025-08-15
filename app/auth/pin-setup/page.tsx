"use client"
import { useState } from "react"
import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PinSetupPage() {
  const [pin, setPin] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()
  const redirectedFrom = sp.get("redirectedFrom") || "/dashboard"

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (pin !== confirm) {
      setError("PINs do not match")
      return
    }
    if (pin.length !== 6) {
      setError("PIN must be 6 digits")
      return
    }
    setLoading(true)

    // Save hashed PIN
    let res = await fetch("/api/pin/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    })
    let data = await res.json()
    if (!res.ok) {
      setLoading(false)
      setError(data.error || "Failed to set PIN")
      return
    }

    // Verify to set cookie
    res = await fetch("/api/pin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    })
    data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || "Failed to verify")
      return
    }
    router.push(redirectedFrom)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm space-y-4 rounded-2xl p-6 shadow-lg bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Set your PIN</h1>
          <p className="text-gray-600 mt-2">Create a 6-digit PIN for secure access</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            inputMode="numeric"
            pattern="^\d{6}$"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit PIN"
            className="w-full rounded-xl border border-gray-300 p-3 text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            inputMode="numeric"
            pattern="^\d{6}$"
            maxLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
            placeholder="Confirm PIN"
            className="w-full rounded-xl border border-gray-300 p-3 text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
          <button
            disabled={loading}
            className="w-full rounded-xl p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors"
          >
            {loading ? "Saving…" : "Save PIN"}
          </button>
        </form>
      </div>
    </div>
  )
}

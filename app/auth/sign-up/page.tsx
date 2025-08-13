"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            full_name: fullName,
            role: "user",
            plan: "basic",
          },
        ])

        if (profileError) {
          console.error("Error creating user profile:", profileError)
        }

        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Sign up error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
          <CardContent className="text-center py-8">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-purple-200 mb-4">
              Please check your email to verify your account, then you can sign in.
            </p>
            <p className="text-purple-300 text-sm">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white font-serif mb-2">Wolv-Invest</CardTitle>
          <p className="text-purple-200">Create your investment account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded">{error}</div>
            )}

            <div>
              <Label htmlFor="fullName" className="text-white">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-purple-200 text-sm mt-4">
              <p>
                Already have an account?{" "}
                <Link href="/auth/login" className="text-purple-300 hover:text-white underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

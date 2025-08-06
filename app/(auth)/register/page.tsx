"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, UserPlus, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToRisk: false,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { register, isLoading } = useAuth()
  const router = useRouter()
  const [confirmationMessage, setConfirmationMessage] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <LoadingSpinner message="Initializing..." />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms and Conditions")
      return
    }

    if (!formData.agreeToRisk) {
      setError("Please acknowledge the risk disclosure")
      return
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })

    if (result.success) {
      setSuccess(true)
      if (result.error) {
        setConfirmationMessage(result.error)
      }
      setTimeout(() => {
        router.push("/login")
      }, 5000)
    } else {
      setError(result.error || "Registration failed")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
        <Card className="border-green-700 bg-green-800/50 backdrop-blur-lg shadow-2xl max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
              <p className="text-green-200">
                {confirmationMessage ||
                  "Your account has been created successfully. You can now log in."}
              </p>
              <Button onClick={() => router.push("/login")} className="bg-green-600 hover:bg-green-700">
                Continue to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4 relative overflow-hidden">
      {/* Web3 Background Illustration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-blue-300 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-blue-500 rounded-full animate-spin"></div>
        {/* Blockchain network lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/images/wolv-invest-logo.png"
                alt="WOLV-INVEST"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">WOLV-INVEST</span>
                <span className="text-sm text-blue-200">Invest Smarter</span>
              </div>
            </div>
          </Link>
          <p className="text-blue-200 mt-4">Create your investment account</p>
        </div>

        <Card className="border-blue-700 bg-blue-800/50 backdrop-blur-lg shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Create Account</CardTitle>
            <CardDescription className="text-center text-blue-200">
              Join thousands of smart investors on WOLV-INVEST
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-300 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-300 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-300 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-300 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-blue-200">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="risk"
                    checked={formData.agreeToRisk}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToRisk: checked as boolean }))}
                  />
                  <label htmlFor="risk" className="text-sm text-blue-200">
                    I acknowledge the{" "}
                    <Link href="/risk-disclosure" className="text-blue-400 hover:text-blue-300">
                      Risk Disclosure
                    </Link>{" "}
                    and understand investment risks
                  </label>
                </div>
              </div>

              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-200">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-blue-200 hover:text-blue-300">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

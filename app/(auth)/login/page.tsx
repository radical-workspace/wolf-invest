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
import { Loader2, ArrowRight } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const { login, isLoading, isAdmin } = useAuth()
  const router = useRouter()

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

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const result = await login(email, password)
    if (result.success) {
      router.push(isAdmin ? "/admin/dashboard" : "/user/dashboard")
    } else {
      setError(result.error || "Login failed")
    }
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
          <p className="text-blue-200 mt-4">Sign in to your investment account</p>
        </div>

        <Card className="border-blue-700 bg-blue-800/50 backdrop-blur-lg shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Welcome Back</CardTitle>
            <CardDescription className="text-center text-blue-200">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-300 focus:border-blue-400"
                  required
                />
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-200">
                {"Don't have an account? "}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                  Create Account
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

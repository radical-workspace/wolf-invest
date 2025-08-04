import type React from "react"
import { AuthProvider } from "@/components/auth-provider"
import { AuthNavbar } from "@/components/auth-navbar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <AuthNavbar />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  )
}

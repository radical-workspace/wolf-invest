"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export type UserRole = "user" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: { name: string; email: string; password: string }) => Promise<{
    success: boolean
    error?: string
  }>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Optionally, load user from session/cookie here
  }, [])

  const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setIsLoading(true)
    try {
      // Check if user already exists
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        setIsLoading(false)
        return { success: false, error: "Email already registered" }
      }
      // Hash password
      const hashed = await bcrypt.hash(password, 10)
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          role: "user",
        },
      })
      setUser({
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as UserRole,
        isActive: true,
        createdAt: newUser.createdAt.toISOString(),
      })
      setIsLoading(false)
      return { success: true }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed. Please try again.",
      }
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const found = await prisma.user.findUnique({ where: { email } })
      if (!found) {
        setIsLoading(false)
        return { success: false, error: "Invalid email or password" }
      }
      const valid = await bcrypt.compare(password, found.password)
      if (!valid) {
        setIsLoading(false)
        return { success: false, error: "Invalid email or password" }
      }
      setUser({
        id: String(found.id),
        name: found.name,
        email: found.email,
        role: found.role as UserRole,
        isActive: true,
        createdAt: found.createdAt.toISOString(),
      })
      setIsLoading(false)
      return { success: true }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed. Please try again.",
      }
    }
  }

  const logout = async () => {
    setUser(null)
    // Optionally clear session/cookie here
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin" && user?.isActive === true

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

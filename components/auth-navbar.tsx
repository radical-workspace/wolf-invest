"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, User, Shield } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function AuthNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout, isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false) // Close menu on logout
      window.location.href = "/"
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <Image
              src="/images/wolv-invest-logo.png"
              alt="WOLV-INVEST"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-blue-600">WOLV-INVEST</span>
              <span className="text-xs text-gray-500">Invest Smarter</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/investment-plans" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Investment Plans
          </Link>
          {isAuthenticated && (
            <Link
              href={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user?.name}</p>
                      {isAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={isAdmin ? "/admin/dashboard" : "/user/dashboard"}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/users">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container md:hidden py-4">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors" onClick={closeMenu}>
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              href="/investment-plans"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              onClick={closeMenu}
            >
              Investment Plans
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin/users"
                    className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-2"
                    onClick={closeMenu}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMenu}>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

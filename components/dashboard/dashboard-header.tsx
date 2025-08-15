"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Settings, LogOut } from "lucide-react"
import { signOut } from "@/lib/actions"

interface DashboardHeaderProps {
  user: {
    full_name?: string
    email: string
  } | null
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email[0].toUpperCase() || "U"

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Williams Holdings</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.full_name || "User"}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <form action={signOut}>
              <Button variant="ghost" size="icon" type="submit">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}

"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, BarChart3, CreditCard, User } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/stats",
      icon: BarChart3,
      label: "Stats",
      active: pathname === "/stats",
    },
    {
      href: "/cards",
      icon: CreditCard,
      label: "Cards",
      active: pathname === "/cards",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      active: pathname === "/profile",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
              item.active ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <item.icon className={`h-5 w-5 ${item.active ? "text-blue-600" : "text-gray-600"}`} />
            <span className={`text-xs font-medium ${item.active ? "text-blue-600" : "text-gray-600"}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

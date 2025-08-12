"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, LayoutDashboard, Settings, Users, Crown, Star, Shield, Zap } from "lucide-react"

import { SearchForm } from "./search-form"
import { UserAccountNav } from "./user-account-nav"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/user",
      isActive: pathname === "/dashboard/user",
      roles: ["user", "admin"],
    },
    {
      title: "Admin Panel",
      icon: Users,
      href: "/dashboard/admin",
      isActive: pathname === "/dashboard/admin",
      roles: ["admin"],
    },
    {
      title: "Analytics",
      icon: BarChart,
      href: "/dashboard/analytics",
      isActive: pathname === "/dashboard/analytics",
      roles: ["user", "admin"],
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      isActive: pathname === "/dashboard/settings",
      roles: ["user", "admin"],
    },
  ]

  const investmentPlans = [
    {
      name: "Basic Plan",
      href: "/investment-plans#basic",
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      range: "$200 - $999",
      roi: "2-3%",
    },
    {
      name: "Amateur Plan",
      href: "/investment-plans#amateur",
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-50",
      range: "$1K - $1.9K",
      roi: "3-4%",
    },
    {
      name: "Retirement Plan",
      href: "/investment-plans#retirement",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      range: "Long-term",
      roi: "4-5%",
    },
    {
      name: "VIP Plan",
      href: "/investment-plans#vip",
      icon: Crown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      range: "Premium",
      roi: "5%+",
    },
  ]

  const userRole = "admin"
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wolv-Invest
              </span>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </Link>
          <SidebarTrigger className="-mr-1" />
        </div>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.title === "Admin Panel" && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          Admin
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            Investment Plans
            <Badge variant="outline" className="text-xs">
              4 Plans
            </Badge>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {investmentPlans.map((plan) => (
                <SidebarMenuItem key={plan.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={plan.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${plan.bgColor}`}>
                        <plan.icon className={`h-4 w-4 ${plan.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{plan.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{plan.range}</span>
                          <Badge variant="secondary" className="text-xs">
                            {plan.roi}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserAccountNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

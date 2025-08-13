"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PinAuth } from "@/components/pin-auth"
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Plus,
  User,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Home,
  BarChart3,
  Wallet,
  Shield,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function UserDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [userData, setUserData] = useState({
    name: "John Doe",
    accountNumber: "****1234",
    balance: 15750.0,
    status: "Active",
    plan: "VIP",
  })
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      type: "Investment",
      amount: 5000,
      date: "Today",
      status: "Completed",
      icon: ArrowDownRight,
      color: "text-red-500",
    },
    {
      id: 2,
      type: "Profit",
      amount: 175,
      date: "Yesterday",
      status: "Completed",
      icon: ArrowUpRight,
      color: "text-green-500",
    },
    {
      id: 3,
      type: "Withdrawal",
      amount: 1000,
      date: "2 days ago",
      status: "Pending",
      icon: ArrowUpRight,
      color: "text-orange-500",
    },
  ])

  const supabase = createClient()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { data: portfolio } = await supabase.from("portfolios").select("*").eq("user_id", user.id).single()

          if (portfolio) {
            setUserData((prev) => ({
              ...prev,
              balance: portfolio.current_value || 0,
              name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
            }))
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (isAuthenticated) {
      fetchUserData()
    }
  }, [isAuthenticated, supabase])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!isAuthenticated) {
    return <PinAuth onSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-800 text-white p-4 pb-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm opacity-90 font-medium">{getGreeting()}, dear</p>
                <p className="font-bold text-xl font-serif bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  {userData.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-3xl font-bold font-mono bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              {formatTime()}
            </p>
            <p className="text-sm opacity-90 font-medium tracking-wide">{formatDate()}</p>
          </div>

          <Card className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/30 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="text-sm opacity-90 font-medium mb-2">Available Balance</p>
                  <div className="flex items-center gap-3">
                    <p className="text-5xl font-bold font-serif bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent leading-tight">
                      {showBalance ? `$${userData.balance.toLocaleString()}` : "••••••"}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/20"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <p className="text-xs opacity-75 font-medium">Live • Updated 2 mins ago</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-emerald-100 border border-emerald-400/50 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    {userData.status}
                  </div>
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div>
                  <p className="text-xs opacity-75 mb-1">Account Number</p>
                  <p className="font-mono text-sm font-bold tracking-wider">{userData.accountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75 mb-1">Investment Plan</p>
                  <Badge className="bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-purple-100 border border-purple-400/50 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      {userData.plan}
                    </div>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="px-4 -mt-16 mb-8 relative z-20">
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-20 bg-gradient-to-br from-white to-slate-50 shadow-xl hover:shadow-2xl transition-all duration-500 text-slate-700 hover:text-slate-900 justify-start gap-4 hover:scale-105 border border-slate-200/50 backdrop-blur-sm group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Top Up</p>
              <p className="text-xs opacity-70 font-medium">Add funds instantly</p>
            </div>
          </Button>

          <Button className="h-20 bg-gradient-to-br from-white to-slate-50 shadow-xl hover:shadow-2xl transition-all duration-500 text-slate-700 hover:text-slate-900 justify-start gap-4 hover:scale-105 border border-slate-200/50 backdrop-blur-sm group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Transactions</p>
              <p className="text-xs opacity-70 font-medium">View history</p>
            </div>
          </Button>
        </div>
      </div>

      <div className="px-4 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 font-serif bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          What would you like to do today?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: User, title: "Account Info", desc: "View details", gradient: "from-purple-500 to-purple-600" },
            { icon: Send, title: "Send Money", desc: "Transfer funds", gradient: "from-orange-500 to-red-500" },
            {
              icon: TrendingUp,
              title: "Investments",
              desc: "Manage portfolio",
              gradient: "from-emerald-500 to-green-500",
            },
            { icon: Shield, title: "Security", desc: "Account safety", gradient: "from-blue-500 to-indigo-500" },
          ].map((item, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-slate-200/50 backdrop-blur-sm group"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                >
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <p className="font-bold text-slate-800 text-lg mb-1">{item.title}</p>
                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="px-4 mb-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 font-serif bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Recent Transactions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:text-purple-700 font-bold hover:bg-purple-50 rounded-xl px-4"
          >
            View All
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-white to-slate-50/50 shadow-xl border border-slate-200/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-300 group ${
                  index !== recentTransactions.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 ${
                      transaction.type === "Investment"
                        ? "bg-gradient-to-br from-red-50 to-red-100 border border-red-200"
                        : transaction.type === "Profit"
                          ? "bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
                          : "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
                    }`}
                  >
                    <transaction.icon className={`h-6 w-6 ${transaction.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{transaction.type}</p>
                    <p className="text-sm text-slate-500 font-medium">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${transaction.color}`}>
                    {transaction.type === "Investment" ? "-" : "+"}${transaction.amount.toLocaleString()}
                  </p>
                  <Badge
                    variant={transaction.status === "Completed" ? "default" : "secondary"}
                    className={`text-xs mt-1 ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-orange-100 text-orange-800 border-orange-200"
                    }`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {showNotifications && (
        <div className="fixed top-20 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <h3 className="font-bold text-lg">Notifications</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-semibold text-slate-800">Investment Update</p>
                <p className="text-sm text-slate-600">Your VIP plan earned $175 today</p>
                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-semibold text-slate-800">Deposit Confirmed</p>
                <p className="text-sm text-slate-600">$5,000 added to your account</p>
                <p className="text-xs text-slate-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed top-20 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <h3 className="font-bold text-lg">Settings</h3>
          </div>
          <div className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 p-3 rounded-xl hover:bg-slate-50">
              <User className="h-5 w-5 text-slate-600" />
              <span className="text-slate-700">Profile Settings</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 p-3 rounded-xl hover:bg-slate-50">
              <Shield className="h-5 w-5 text-slate-600" />
              <span className="text-slate-700">Security</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 p-3 rounded-xl hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="text-slate-700">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600"
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = "/auth/login"
              }}
            >
              <ArrowUpRight className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-around">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: BarChart3, label: "Stats", active: false },
            { icon: Wallet, label: "Cards", active: false },
            { icon: User, label: "Profile", active: false },
          ].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`flex-col gap-1 h-auto py-3 px-4 rounded-2xl transition-all duration-300 ${
                item.active
                  ? "text-purple-600 bg-purple-50 font-bold shadow-md"
                  : "text-slate-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

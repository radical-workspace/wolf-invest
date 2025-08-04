"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  UserCheck,
  Banknote,
  Activity,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeInvestments: number;
    totalInvested: number;
    totalPaidOut: number;
    pendingWithdrawals: number;
    newUsersToday: number;
    platformRevenue: number;
    activeUsersToday: number;
  }>({
    totalUsers: 0,
    activeInvestments: 0,
    totalInvested: 0,
    totalPaidOut: 0,
    pendingWithdrawals: 0,
    newUsersToday: 0,
    platformRevenue: 0,
    activeUsersToday: 0,
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch users
        const { data: users, error: usersError } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, created_at")
          .order("created_at", { ascending: false })
          .limit(5)
        if (usersError) throw usersError
        setRecentUsers(users || [])

        // Fetch investments
        const { data: investments, error: invError } = await supabase
          .from("investments")
          .select("*")
        if (invError) throw invError
        setStats((prev: any) => ({
          ...prev,
          totalInvested: investments.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
          activeInvestments: investments.filter((inv: any) => inv.status === "active").length,
        }))

        // Fetch withdrawals
        const { data: withdrawals, error: wdError } = await supabase
          .from("withdrawals")
          .select("*")
        if (wdError) throw wdError
        setPendingWithdrawals(withdrawals || [])
        setStats((prev: any) => ({ ...prev, pendingWithdrawals: withdrawals.length }))

        // Fetch activity (example: last 10 investments)
        setRecentActivity(
          (investments || []).slice(0, 10).map((inv: any) => ({
            id: inv.id,
            type: "investment_created",
            user: inv.userId,
            amount: inv.amount,
            time: new Date(inv.createdAt).toLocaleString(),
          }))
        )

        // Fetch total users
        setStats((prev: any) => ({ ...prev, totalUsers: users.length }))
      } catch (err) {
        setError("Failed to load dashboard data.")
      }
      setLoading(false)
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r flex flex-col justify-between py-6 px-4">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Users className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Admin Panel</span>
          </div>
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 font-medium">Dashboard</Link>
            <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900">Users</Link>
            <Link href="/admin/investments" className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900">Investments</Link>
            <Link href="/admin/transactions" className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900">Transactions</Link>
            <Link href="/admin/analytics" className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900">Analytics</Link>
            <Link href="/admin/settings" className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900">Settings</Link>
          </nav>
        </div>
        <div className="mt-8">
          <Button className="w-full" variant="outline">Logout</Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.name}! Here's your platform overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.activeInvestments} active investments</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingWithdrawals}</div>
              <p className="text-xs text-muted-foreground">Withdrawal requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>Summary of platform statistics and health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500">New Users Today</span>
                    <span className="text-lg font-bold">{stats.newUsersToday}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500">Active Users Today</span>
                    <span className="text-lg font-bold">{stats.activeUsersToday}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500">Platform Revenue</span>
                    <span className="text-lg font-bold">${stats.platformRevenue}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500">Total Paid Out</span>
                    <span className="text-lg font-bold">${stats.totalPaidOut}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Link href="/admin/users">
                    <Button className="w-full h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      <span>All Users</span>
                    </Button>
                  </Link>
                  <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                    <UserCheck className="h-6 w-6" />
                    <span>Active Users</span>
                  </Button>
                  <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Pending Users</span>
                  </Button>
                  <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                    <Activity className="h-6 w-6" />
                    <span>User Activity</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.type === "user_registered" && "New user registered"}
                            {activity.type === "investment_created" && "New investment created"}
                            {activity.type === "withdrawal_requested" && "Withdrawal requested"}
                            {activity.type === "roi_paid" && "ROI payment processed"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.user}
                            {activity.amount && ` - $${activity.amount}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="actions" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/admin/users">
                    <Button className="w-full" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                  </Link>
                  <Button className="w-full" variant="outline">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Approve Accounts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/admin/transactions">
                    <Button className="w-full" variant="outline">
                      <Banknote className="mr-2 h-4 w-4" />
                      Process Withdrawals
                    </Button>
                  </Link>
                  <Link href="/admin/investments">
                    <Button className="w-full" variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Manage Investments
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/admin/analytics">
                    <Button className="w-full" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </Link>
                  <Button className="w-full" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

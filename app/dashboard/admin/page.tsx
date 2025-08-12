import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
  UserPlus,
  Settings,
  Shield,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  Bell,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Wallet,
  BarChart3,
  PieChart,
} from "lucide-react"
import { sql } from "@/lib/db"

// Define types for your data
type AdminStats = {
  total_users: number
  active_investments: number
  platform_roi: number
  total_invested_capital: number
  platform_performance: { month: string; roi: number }[]
}

type UserRegistration = {
  id: string
  email: string
  created_at: string // Or Date
}

// Server-side data fetching functions
async function getAdminStats(): Promise<AdminStats | null> {
  try {
    const [stats] = await sql`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM portfolios WHERE current_value > 0) AS active_investments,
        (SELECT AVG(daily_roi) FROM portfolios) AS platform_roi,
        (SELECT SUM(amount) FROM transactions WHERE type = 'Deposit') AS total_invested_capital,
        -- Placeholder for platform_performance, ideally from a historical data table
        '[]'::jsonb as platform_performance -- Default empty JSON array
    `

    // Mock historical performance if not available from DB
    const mockPerformance = [
      { month: "Jan", roi: 3.8 },
      { month: "Feb", roi: 4.1 },
      { month: "Mar", roi: 3.9 },
      { month: "Apr", roi: 4.5 },
      { month: "May", roi: 4.2 },
      { month: "Jun", roi: 4.0 },
    ]

    return stats
      ? {
          ...stats,
          platform_performance: stats.platform_performance || mockPerformance,
        }
      : null
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (
      errorMessage.includes("relation") ||
      errorMessage.includes("does not exist") ||
      errorMessage.includes("database")
    ) {
      // Return mock data when database tables don't exist
      return {
        total_users: 1247,
        active_investments: 892,
        platform_roi: 0.038,
        total_invested_capital: 2847500,
        platform_performance: [
          { month: "Jan", roi: 3.8 },
          { month: "Feb", roi: 4.1 },
          { month: "Mar", roi: 3.9 },
          { month: "Apr", roi: 4.5 },
          { month: "May", roi: 4.2 },
          { month: "Jun", roi: 4.0 },
        ],
      }
    }
    // For other errors, return mock data as well to prevent crashes
    return {
      total_users: 1247,
      active_investments: 892,
      platform_roi: 0.038,
      total_invested_capital: 2847500,
      platform_performance: [
        { month: "Jan", roi: 3.8 },
        { month: "Feb", roi: 4.1 },
        { month: "Mar", roi: 3.9 },
        { month: "Apr", roi: 4.5 },
        { month: "May", roi: 4.2 },
        { month: "Jun", roi: 4.0 },
      ],
    }
  }
}

async function getRecentUserRegistrations(): Promise<UserRegistration[]> {
  try {
    const registrations = await sql`
      SELECT id, email, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5;
    `
    return registrations.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: new Date(u.created_at).toLocaleDateString(), // Format date
    }))
  } catch (error) {
    console.error("Error fetching recent user registrations:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (
      errorMessage.includes("relation") ||
      errorMessage.includes("does not exist") ||
      errorMessage.includes("database")
    ) {
      // Return mock data when database tables don't exist
      return [
        { id: "usr_001", email: "john.doe@example.com", created_at: "12/15/2024" },
        { id: "usr_002", email: "sarah.smith@example.com", created_at: "12/14/2024" },
        { id: "usr_003", email: "mike.johnson@example.com", created_at: "12/13/2024" },
        { id: "usr_004", email: "emma.wilson@example.com", created_at: "12/12/2024" },
        { id: "usr_005", email: "david.brown@example.com", created_at: "12/11/2024" },
      ]
    }
    // For other errors, return mock data as well
    return [
      { id: "usr_001", email: "john.doe@example.com", created_at: "12/15/2024" },
      { id: "usr_002", email: "sarah.smith@example.com", created_at: "12/14/2024" },
      { id: "usr_003", email: "mike.johnson@example.com", created_at: "12/13/2024" },
      { id: "usr_004", email: "emma.wilson@example.com", created_at: "12/12/2024" },
      { id: "usr_005", email: "david.brown@example.com", created_at: "12/11/2024" },
    ]
  }
}

export default async function AdminDashboardPage() {
  const adminStats = await getAdminStats()
  const recentUserRegistrations = await getRecentUserRegistrations()

  const defaultAdminStats: AdminStats = {
    total_users: 0,
    active_investments: 0,
    platform_roi: 0,
    total_invested_capital: 0,
    platform_performance: [],
  }

  const displayAdminStats = adminStats || defaultAdminStats
  const isUsingMockData = adminStats && adminStats.total_users === 1247

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Wolv-Invest Admin
            </h1>
            <p className="text-slate-600 mt-1">Complete platform management & analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all bg-transparent"
          >
            <UserCheck className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-medium">Approve Users</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-300 transition-all bg-transparent"
          >
            <Wallet className="h-5 w-5 text-green-600" />
            <span className="text-xs font-medium">Deposits</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300 transition-all bg-transparent"
          >
            <CreditCard className="h-5 w-5 text-orange-600" />
            <span className="text-xs font-medium">Withdrawals</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all bg-transparent"
          >
            <Shield className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-medium">Security</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-red-50 hover:border-red-300 transition-all bg-transparent"
          >
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-xs font-medium">Alerts</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all bg-transparent"
          >
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <span className="text-xs font-medium">Reports</span>
          </Button>
        </div>

        {isUsingMockData && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Demo Mode Active</p>
                <p className="text-sm text-amber-700">Connect your database to view live platform data</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {displayAdminStats.total_users.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-700">+8.2%</span>
              </div>
              <span className="text-xs text-slate-500">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-600">Active Investments</CardTitle>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {displayAdminStats.active_investments.toLocaleString()}
            </div>
            <div className="space-y-2">
              <Progress
                value={(displayAdminStats.active_investments / displayAdminStats.total_users) * 100}
                className="h-2 bg-slate-200"
              />
              <p className="text-xs text-slate-500">
                {((displayAdminStats.active_investments / displayAdminStats.total_users) * 100).toFixed(1)}% conversion
                rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-600">Platform ROI</CardTitle>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {(displayAdminStats.platform_roi * 100).toFixed(2)}%
            </div>
            <div className="space-y-2">
              <Progress value={displayAdminStats.platform_roi * 20} className="h-2 bg-slate-200" />
              <p className="text-xs text-slate-500">Above target performance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-orange-50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-slate-600">Total Capital</CardTitle>
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              ${displayAdminStats.total_invested_capital.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-700">+15.3%</span>
              </div>
              <span className="text-xs text-slate-500">growth</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  Platform Performance
                </CardTitle>
                <CardDescription>Real-time analytics and ROI tracking</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <p className="text-slate-700 font-semibold text-lg">Advanced Analytics</p>
                <p className="text-sm text-slate-500">Interactive performance dashboard</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {displayAdminStats.platform_performance.slice(0, 4).map((data, index) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {data.month.slice(0, 1)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">{data.month}</span>
                      <p className="text-xs text-slate-500">2024</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-600">{data.roi.toFixed(2)}%</span>
                    <Progress value={data.roi * 20} className="w-16 h-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
              <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentUserRegistrations.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">{user.email}</p>
                      <p className="text-xs text-slate-500">{user.created_at}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              View All Users
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
          <CardHeader className="border-b border-green-100">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                <div>
                  <p className="font-medium text-sm">Deposit Requests</p>
                  <p className="text-xs text-slate-500">12 pending</p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100">
                <div>
                  <p className="font-medium text-sm">Withdrawal Requests</p>
                  <p className="text-xs text-slate-500">8 pending</p>
                </div>
                <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 bg-transparent">
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50">
          <CardHeader className="border-b border-red-100">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Suspicious Activity</p>
                  <p className="text-xs text-slate-500">2 accounts flagged</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-100">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Failed Login Attempts</p>
                  <p className="text-xs text-slate-500">15 in last hour</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50">
          <CardHeader className="border-b border-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Settings className="h-5 w-5" />
              Quick Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                <Shield className="h-4 w-4" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                <BarChart3 className="h-4 w-4" />
                Reports & Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

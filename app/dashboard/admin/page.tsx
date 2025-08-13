import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
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
  Clock,
  Zap,
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
    <div className="flex flex-col gap-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Wolv-Invest Admin
            </h1>
            <p className="text-slate-600 text-lg">Complete platform management & analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="gap-3 bg-white/80 backdrop-blur-sm border-2 hover:bg-white hover:shadow-lg transition-all"
            >
              <Download className="h-5 w-5" />
              Export Data
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-3 bg-white/80 backdrop-blur-sm border-2 hover:bg-white hover:shadow-lg transition-all relative"
            >
              <Bell className="h-5 w-5" />
              Notifications
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1">3</Badge>
            </Button>
            <Button
              size="lg"
              className="gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-blue-50 hover:border-blue-400 hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm border-2 group"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-700">Approve Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-green-50 hover:border-green-400 hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm border-2 group relative"
            >
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-700">Deposits</span>
              <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs">12</Badge>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-orange-50 hover:border-orange-400 hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm border-2 group relative"
            >
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-orange-700">Withdrawals</span>
              <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs">8</Badge>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-purple-50 hover:border-purple-400 hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm border-2 group"
            >
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-purple-700">Security</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-red-50 hover:border-red-400 hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm border-2 group relative"
            >
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-red-700">Alerts</span>
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs animate-pulse">!</Badge>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-3 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm border-2 group"
            >
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-indigo-700">Reports</span>
            </Button>
          </div>
        </div>

        {isUsingMockData && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-amber-800 text-lg">Demo Mode Active</p>
                <p className="text-amber-700">Connect your database to view live platform data</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
            <CardTitle className="text-base font-semibold text-slate-600">Total Users</CardTitle>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-4xl font-bold text-slate-900">{displayAdminStats.total_users.toLocaleString()}</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">+8.2%</span>
              </div>
              <span className="text-sm text-slate-500">this month</span>
            </div>
            <Progress value={82} className="h-3 bg-slate-200" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50 hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
            <CardTitle className="text-base font-semibold text-slate-600">Active Investments</CardTitle>
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-4xl font-bold text-slate-900">
              {displayAdminStats.active_investments.toLocaleString()}
            </div>
            <div className="space-y-3">
              <Progress
                value={(displayAdminStats.active_investments / displayAdminStats.total_users) * 100}
                className="h-3 bg-slate-200"
              />
              <p className="text-sm text-slate-600 font-medium">
                {((displayAdminStats.active_investments / displayAdminStats.total_users) * 100).toFixed(1)}% conversion
                rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
            <CardTitle className="text-base font-semibold text-slate-600">Platform ROI</CardTitle>
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-4xl font-bold text-slate-900">
              {(displayAdminStats.platform_roi * 100).toFixed(2)}%
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">Above Target</span>
                </div>
              </div>
              <Progress value={displayAdminStats.platform_roi * 20} className="h-3 bg-slate-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
            <CardTitle className="text-base font-semibold text-slate-600">Total Capital</CardTitle>
            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="text-4xl font-bold text-slate-900">
              ${displayAdminStats.total_invested_capital.toLocaleString()}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">+15.3%</span>
              </div>
              <span className="text-sm text-slate-500">growth</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="col-span-2 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="border-b border-slate-100 pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                  Platform Performance
                </CardTitle>
                <CardDescription className="text-base">Real-time analytics and ROI tracking</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="lg" className="gap-2 bg-white/80 backdrop-blur-sm border-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="lg" className="gap-2 bg-white/80 backdrop-blur-sm border-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-80 w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 mb-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-xl">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <p className="text-slate-700 font-bold text-xl">Advanced Analytics</p>
                  <p className="text-slate-500">Interactive performance dashboard</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {displayAdminStats.platform_performance.slice(0, 4).map((data, index) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-slate-100 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {data.month.slice(0, 1)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-lg">{data.month}</span>
                      <p className="text-sm text-slate-500">2024</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2">
                      {data.roi > 4.0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-xl font-bold ${data.roi > 4.0 ? "text-green-600" : "text-red-600"}`}>
                        {data.roi.toFixed(2)}%
                      </span>
                    </div>
                    <Progress value={data.roi * 20} className="w-20 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="border-b border-slate-100 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                User Management
              </CardTitle>
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentUserRegistrations.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-100 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.email}</p>
                      <p className="text-sm text-slate-500">{user.created_at}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-green-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 gap-2 bg-white/80 backdrop-blur-sm border-2 h-12">
              <Users className="h-4 w-4" />
              View All Users
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 relative">
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500 text-white animate-pulse">
              <Clock className="h-3 w-3 mr-1" />
              Urgent
            </Badge>
          </div>
          <CardHeader className="border-b border-green-100 pb-6">
            <CardTitle className="flex items-center gap-3 text-green-700 text-xl">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-green-100 hover:shadow-lg transition-all">
                <div className="space-y-1">
                  <p className="font-semibold">Deposit Requests</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">12 pending</Badge>
                    <Zap className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-lg">
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-orange-100 hover:shadow-lg transition-all">
                <div className="space-y-1">
                  <p className="font-semibold">Withdrawal Requests</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-700">8 pending</Badge>
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-orange-300 text-orange-600 bg-white hover:bg-orange-50"
                >
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-red-50 relative">
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-500 text-white animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Critical
            </Badge>
          </div>
          <CardHeader className="border-b border-red-100 pb-6">
            <CardTitle className="flex items-center gap-3 text-red-700 text-xl">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-red-100 hover:shadow-lg transition-all">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="font-semibold">Suspicious Activity</p>
                  <p className="text-sm text-slate-500">2 accounts flagged</p>
                </div>
                <Badge className="bg-red-100 text-red-700">High</Badge>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-yellow-100 hover:shadow-lg transition-all">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-semibold">Failed Login Attempts</p>
                  <p className="text-sm text-slate-500">15 in last hour</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50">
          <CardHeader className="border-b border-indigo-100 pb-6">
            <CardTitle className="flex items-center gap-3 text-indigo-700 text-xl">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                <Settings className="h-5 w-5 text-white" />
              </div>
              Quick Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-14 bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all"
              >
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Security Settings</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-14 bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all"
              >
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Notifications</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-14 bg-white/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all"
              >
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Reports & Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

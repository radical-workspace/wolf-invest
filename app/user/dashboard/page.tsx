"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PieChart,
  BarChart3,
} from "lucide-react"
import { generateMockInvestments, calculateInvestmentStats, INVESTMENT_PLANS } from "@/lib/investment-data"
import { supabase } from "@/lib/supabase"
import type { Investment } from "@/lib/investment-data"

function UserDashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch investments from Supabase
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .eq('userId', user.id);
        if (error) {
          setError('Failed to load investments.');
          setInvestments([]);
        } else {
          setInvestments(data || []);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
        setInvestments([]);
      }
      setLoading(false);
    };
    fetchInvestments();
  }, [user]);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  const stats = calculateInvestmentStats(investments)

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "text-blue-600",
  }: {
    title: string
    value: string
    icon: any
    trend?: "up" | "down"
    trendValue?: string
    color?: string
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span className="ml-1">{trendValue}</span>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )

  const InvestmentCard = ({ investment }: { investment: Investment }) => {
    const plan = INVESTMENT_PLANS.find((p) => p.type === investment.planType)
    const progress = investment.status === "completed" ? 100 : ((7 - investment.daysRemaining) / 7) * 100

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{plan?.name}</h3>
              <p className="text-sm text-muted-foreground">
                Started {new Date(investment.startDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={investment.status === "active" ? "default" : "secondary"}>{investment.status}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Investment Amount</span>
              <span className="font-medium">${investment.amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Total Earnings</span>
              <span className="font-medium text-green-600">+${investment.totalEarnings.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Daily ROI</span>
              <span className="font-medium">{investment.dailyROI}%</span>
            </div>

            {investment.status === "active" && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex justify-between text-sm">
                  <span>Days Remaining</span>
                  <span className="font-medium">{investment.daysRemaining} days</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Next Payout</span>
                  <span className="font-medium">{new Date(investment.nextPayoutDate).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Track your investments and monitor your portfolio performance</p>
        </div>
        <Button onClick={() => router.push("/investment-plans")} className="bg-blue-600 hover:bg-blue-700">
          New Investment
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`$${stats.totalBalance.toLocaleString()}`}
          icon={Wallet}
          trend="up"
          trendValue="12.5%"
          color="text-green-600"
        />
        <StatCard
          title="Total Invested"
          value={`$${stats.totalInvested.toLocaleString()}`}
          icon={DollarSign}
          color="text-blue-600"
        />
        <StatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          icon={TrendingUp}
          trend="up"
          trendValue={`${stats.roi.toFixed(1)}%`}
          color="text-green-600"
        />
        <StatCard
          title="Active Investments"
          value={stats.activeInvestments.toString()}
          icon={Target}
          color="text-purple-600"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Portfolio Value</span>
                    <span className="text-2xl font-bold text-green-600">${stats.totalBalance.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Principal Amount</span>
                      <span>${stats.totalInvested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Profits</span>
                      <span className="text-green-600">+${stats.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Overall ROI</span>
                      <span className="text-green-600">+{stats.roi.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Daily ROI Credited</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">+$52.50</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Investment Started</p>
                      <p className="text-xs text-muted-foreground">Dec 1, 2024</p>
                    </div>
                    <span className="text-sm font-medium">Amateur Plan</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Investment Completed</p>
                      <p className="text-xs text-muted-foreground">Nov 27, 2024</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">+$87.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Investments</h2>
            <Button onClick={() => router.push("/investment-plans")}>Start New Investment</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investments.length > 0 ? (
              investments.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Investments Yet</h3>
                  <p className="text-muted-foreground mb-4">Start your investment journey with one of our plans</p>
                  <Button onClick={() => router.push("/investment-plans")}>View Investment Plans</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your investment transactions and earnings</CardDescription>
            </CardHeader>
            <CardContent>
              {investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((inv) => (
                    <div key={inv.id} className="border-b pb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">{INVESTMENT_PLANS.find(p => p.type === inv.planType)?.name || inv.planType}</span>
                        <span className="text-green-600">${inv.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Status: {inv.status}</span>
                        <span>Started: {new Date(inv.startDate).toLocaleDateString()}</span>
                        <span>Ended: {new Date(inv.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
                  <p className="text-muted-foreground">Your investment transactions will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Analytics</CardTitle>
              <CardDescription>Detailed analytics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">Comprehensive analytics and charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function UserDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (!user) {
    return null
  }

  return <UserDashboardContent />
}

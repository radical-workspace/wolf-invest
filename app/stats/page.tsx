import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import SpendingChart from "@/components/stats/spending-chart"
import CategoryBreakdown from "@/components/stats/category-breakdown"
import MonthlyTrends from "@/components/stats/monthly-trends"
import StatsOverview from "@/components/stats/stats-overview"
import BottomNav from "@/components/navigation/bottom-nav"

export default async function StatsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get all transactions for analytics
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      accounts!inner(account_type, account_number)
    `)
    .eq("accounts.user_id", user.id)
    .order("created_at", { ascending: false })

  // Get accounts for balance trends
  const { data: accounts } = await supabase.from("accounts").select("*").eq("user_id", user.id).eq("is_active", true)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DashboardHeader user={userProfile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="text-gray-600 mt-2">Track your spending patterns and financial trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <StatsOverview transactions={transactions || []} accounts={accounts || []} />
            <SpendingChart transactions={transactions || []} />
            <MonthlyTrends transactions={transactions || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <CategoryBreakdown transactions={transactions || []} />
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

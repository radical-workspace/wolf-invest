import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import AccountBalances from "@/components/dashboard/account-balances"
import RecentTransactions from "@/components/dashboard/recent-transactions"
import InvestmentOverview from "@/components/dashboard/investment-overview"
import QuickActions from "@/components/dashboard/quick-actions"
import BottomNav from "@/components/navigation/bottom-nav"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get accounts with balances
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  // Get recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      accounts!inner(account_type, account_number)
    `)
    .eq("accounts.user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get investments
  const { data: investments } = await supabase
    .from("investments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DashboardHeader user={userProfile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AccountBalances accounts={accounts || []} />
            <RecentTransactions transactions={transactions || []} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <QuickActions />
            <InvestmentOverview investments={investments || []} />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

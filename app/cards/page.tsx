import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import CardsList from "@/components/cards/cards-list"
import CardTransactions from "@/components/cards/card-transactions"
import CardStats from "@/components/cards/card-stats"
import BottomNav from "@/components/navigation/bottom-nav"

export default async function CardsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get user's cards
  const { data: cards } = await supabase
    .from("cards")
    .select(`
      *,
      accounts(account_type, account_number, balance)
    `)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Get card-related transactions
  const { data: cardTransactions } = await supabase
    .from("transactions")
    .select(`
      *,
      accounts!inner(account_type, account_number)
    `)
    .eq("accounts.user_id", user.id)
    .in("transaction_type", ["payment", "withdrawal"])
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DashboardHeader user={userProfile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
          <p className="text-gray-600 mt-2">Manage your debit and credit cards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CardsList cards={cards || []} />
            <CardTransactions transactions={cardTransactions || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <CardStats cards={cards || []} transactions={cardTransactions || []} />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

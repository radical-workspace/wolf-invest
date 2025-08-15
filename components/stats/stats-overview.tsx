"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"

interface Transaction {
  id: string
  transaction_type: string
  amount: number
  created_at: string
}

interface Account {
  id: string
  balance: number
  account_type: string
}

interface StatsOverviewProps {
  transactions: Transaction[]
  accounts: Account[]
}

export default function StatsOverview({ transactions, accounts }: StatsOverviewProps) {
  // Calculate current month stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.created_at)
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
  })

  const totalIncome = currentMonthTransactions
    .filter((t) => t.transaction_type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = currentMonthTransactions
    .filter((t) => ["withdrawal", "payment"].includes(t.transaction_type))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netIncome = totalIncome - totalExpenses
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  // Calculate previous month for comparison
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const prevMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.created_at)
    return transactionDate.getMonth() === prevMonth && transactionDate.getFullYear() === prevYear
  })

  const prevMonthExpenses = prevMonthTransactions
    .filter((t) => ["withdrawal", "payment"].includes(t.transaction_type))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const expenseChange = prevMonthExpenses > 0 ? ((totalExpenses - prevMonthExpenses) / prevMonthExpenses) * 100 : 0

  const stats = [
    {
      title: "Total Balance",
      value: totalBalance,
      icon: DollarSign,
      change: null,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Monthly Income",
      value: totalIncome,
      icon: TrendingUp,
      change: null,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Monthly Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      change: expenseChange,
      color: "text-red-600 bg-red-100",
    },
    {
      title: "Net Income",
      value: netIncome,
      icon: CreditCard,
      change: null,
      color: netIncome >= 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.abs(stat.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            {stat.change !== null && (
              <p className={`text-xs ${stat.change >= 0 ? "text-red-600" : "text-green-600"}`}>
                {stat.change >= 0 ? "+" : ""}
                {stat.change.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

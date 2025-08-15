"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, TrendingUp, DollarSign, Calendar } from "lucide-react"

interface CardData {
  id: string
  card_type: string
  credit_limit?: number
  available_credit?: number
}

interface Transaction {
  id: string
  amount: number
  created_at: string
}

interface CardStatsProps {
  cards: CardData[]
  transactions: Transaction[]
}

export default function CardStats({ cards, transactions }: CardStatsProps) {
  // Calculate monthly spending
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlySpending = transactions
    .filter((t) => {
      const transactionDate = new Date(t.created_at)
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  // Calculate total credit available
  const totalCreditLimit = cards
    .filter((card) => card.card_type === "credit")
    .reduce((sum, card) => sum + (card.credit_limit || 0), 0)

  const totalAvailableCredit = cards
    .filter((card) => card.card_type === "credit")
    .reduce((sum, card) => sum + (card.available_credit || 0), 0)

  const creditUtilization =
    totalCreditLimit > 0 ? ((totalCreditLimit - totalAvailableCredit) / totalCreditLimit) * 100 : 0

  const stats = [
    {
      title: "Total Cards",
      value: cards.length.toString(),
      icon: CreditCard,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Monthly Spending",
      value: `$${monthlySpending.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: Calendar,
      color: "text-red-600 bg-red-100",
    },
    {
      title: "Available Credit",
      value: `$${totalAvailableCredit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Credit Utilization",
      value: `${creditUtilization.toFixed(1)}%`,
      icon: TrendingUp,
      color: creditUtilization > 30 ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Card Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Credit Utilization Breakdown */}
      {cards.some((card) => card.card_type === "credit") && (
        <Card>
          <CardHeader>
            <CardTitle>Credit Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cards
              .filter((card) => card.card_type === "credit")
              .map((card) => {
                const utilization =
                  card.credit_limit && card.available_credit
                    ? ((card.credit_limit - card.available_credit) / card.credit_limit) * 100
                    : 0

                return (
                  <div key={card.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Credit Card ••••{card.id.slice(-4)}</span>
                      <span>{utilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          utilization > 70 ? "bg-red-500" : utilization > 30 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

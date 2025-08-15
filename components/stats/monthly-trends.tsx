"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Transaction {
  id: string
  transaction_type: string
  amount: number
  created_at: string
}

interface MonthlyTrendsProps {
  transactions: Transaction[]
}

export default function MonthlyTrends({ transactions }: MonthlyTrendsProps) {
  // Generate data for the last 12 months
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      name: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    }
  }).reverse()

  const trendData = last12Months.map(({ month, year, name }) => {
    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.created_at)
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year
    })

    const expenses = monthTransactions
      .filter((t) => ["withdrawal", "payment"].includes(t.transaction_type))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return {
      month: name,
      expenses,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trend (Last 12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Expenses"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

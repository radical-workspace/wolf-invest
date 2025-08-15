"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Transaction {
  id: string
  transaction_type: string
  amount: number
  created_at: string
}

interface SpendingChartProps {
  transactions: Transaction[]
}

export default function SpendingChart({ transactions }: SpendingChartProps) {
  // Group transactions by month for the last 6 months
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      name: date.toLocaleDateString("en-US", { month: "short" }),
    }
  }).reverse()

  const chartData = last6Months.map(({ month, year, name }) => {
    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.created_at)
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year
    })

    const income = monthTransactions
      .filter((t) => t.transaction_type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => ["withdrawal", "payment"].includes(t.transaction_type))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return {
      month: name,
      income,
      expenses,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

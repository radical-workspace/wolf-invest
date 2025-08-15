"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Transaction {
  id: string
  transaction_type: string
  amount: number
  description: string
}

interface CategoryBreakdownProps {
  transactions: Transaction[]
}

export default function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  // Categorize expenses based on description keywords
  const categorizeTransaction = (description: string) => {
    const desc = description.toLowerCase()
    if (desc.includes("grocery") || desc.includes("food") || desc.includes("restaurant")) return "Food & Dining"
    if (desc.includes("gas") || desc.includes("fuel") || desc.includes("transport")) return "Transportation"
    if (desc.includes("shopping") || desc.includes("store") || desc.includes("purchase")) return "Shopping"
    if (desc.includes("bill") || desc.includes("utility") || desc.includes("electric")) return "Bills & Utilities"
    if (desc.includes("entertainment") || desc.includes("movie") || desc.includes("game")) return "Entertainment"
    return "Other"
  }

  const expenseTransactions = transactions.filter((t) => ["withdrawal", "payment"].includes(t.transaction_type))

  const categoryData = expenseTransactions.reduce(
    (acc, transaction) => {
      const category = categorizeTransaction(transaction.description)
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount)
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value)

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-medium">
                ${item.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

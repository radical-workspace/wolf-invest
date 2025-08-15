"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, CreditCard, Repeat } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  transaction_type: string
  amount: number
  description: string
  created_at: string
  status: string
  accounts: {
    account_type: string
    account_number: string
  }
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "transfer":
        return <Repeat className="h-4 w-4 text-blue-600" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-600" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const getAmountColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600"
      case "withdrawal":
      case "payment":
        return "text-red-600"
      default:
        return "text-gray-900"
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === "deposit" ? "+" : type === "withdrawal" || type === "payment" ? "-" : ""
    return `${prefix}$${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Transactions
          <Badge variant="secondary">{transactions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions found</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-full">{getTransactionIcon(transaction.transaction_type)}</div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="capitalize">{transaction.accounts.account_type}</span>
                      <span>••••{transaction.accounts.account_number.slice(-4)}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getAmountColor(transaction.transaction_type)}`}>
                    {formatAmount(transaction.amount, transaction.transaction_type)}
                  </p>
                  <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ArrowUpRight } from "lucide-react"

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

interface CardTransactionsProps {
  transactions: Transaction[]
}

export default function CardTransactions({ transactions }: CardTransactionsProps) {
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
          Recent Card Transactions
          <Badge variant="secondary">{transactions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No card transactions found</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                  </div>
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
                  <p className="font-semibold text-red-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />$
                    {Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
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

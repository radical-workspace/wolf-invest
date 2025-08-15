"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, PiggyBank, TrendingUp, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Account {
  id: string
  account_type: string
  account_number: string
  balance: number
  currency: string
}

interface AccountBalancesProps {
  accounts: Account[]
}

export default function AccountBalances({ accounts }: AccountBalancesProps) {
  const [showBalances, setShowBalances] = useState(true)

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-6 w-6" />
      case "savings":
        return <PiggyBank className="h-6 w-6" />
      case "investment":
        return <TrendingUp className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case "checking":
        return "text-blue-600 bg-blue-100"
      case "savings":
        return "text-green-600 bg-green-100"
      case "investment":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatBalance = (balance: number) => {
    return showBalances ? `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••"
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Account Overview</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBalances(!showBalances)}
          className="flex items-center gap-2"
        >
          {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showBalances ? "Hide" : "Show"} Balances
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm">Total Balance</p>
              <p className="text-3xl font-bold">{formatBalance(totalBalance)}</p>
            </div>
            <div className="text-blue-200">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">{account.account_type} Account</CardTitle>
              <div className={`p-2 rounded-full ${getAccountColor(account.account_type)}`}>
                {getAccountIcon(account.account_type)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{formatBalance(account.balance)}</div>
                <p className="text-xs text-gray-500">••••{account.account_number.slice(-4)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, PiggyBank, TrendingUp, Settings } from "lucide-react"

interface Account {
  id: string
  account_type: string
  account_number: string
  balance: number
  is_active: boolean
}

interface AccountSettingsProps {
  accounts: Account[]
}

export default function AccountSettings({ accounts }: AccountSettingsProps) {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-4 w-4" />
      case "savings":
        return <PiggyBank className="h-4 w-4" />
      case "investment":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Account Management
          <Button variant="outline" size="sm" className="bg-transparent">
            Add Account
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No accounts found</p>
          ) : (
            accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getAccountColor(account.account_type)}`}>
                    {getAccountIcon(account.account_type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 capitalize">{account.account_type} Account</p>
                      <Badge variant={account.is_active ? "default" : "secondary"}>
                        {account.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">••••{account.account_number.slice(-4)}</p>
                    <p className="text-sm font-medium">
                      ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

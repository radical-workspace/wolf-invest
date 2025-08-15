"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Investment {
  id: string
  investment_type: string
  symbol: string
  name: string
  quantity: number
  purchase_price: number
  current_price: number
  total_value: number
  profit_loss: number
}

interface InvestmentOverviewProps {
  investments: Investment[]
}

export default function InvestmentOverview({ investments }: InvestmentOverviewProps) {
  const totalValue = investments.reduce((sum, inv) => sum + inv.total_value, 0)
  const totalProfitLoss = investments.reduce((sum, inv) => sum + inv.profit_loss, 0)
  const profitLossPercentage = totalValue > 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Investments
          <Badge variant="secondary">{investments.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Portfolio Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Portfolio Value</span>
              <span className="font-semibold">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total P&L</span>
              <div className="flex items-center space-x-1">
                {totalProfitLoss >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-semibold ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${Math.abs(totalProfitLoss).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-xs ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ({profitLossPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Individual Investments */}
          <div className="space-y-3">
            {investments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No investments found</p>
            ) : (
              investments.slice(0, 5).map((investment) => {
                const profitLossPercent =
                  ((investment.current_price - investment.purchase_price) / investment.purchase_price) * 100

                return (
                  <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{investment.symbol}</span>
                        <Badge variant="outline" className="text-xs">
                          {investment.investment_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{investment.name}</p>
                      <p className="text-xs text-gray-500">{investment.quantity} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${investment.total_value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex items-center space-x-1">
                        {investment.profit_loss >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={`text-xs ${investment.profit_loss >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {profitLossPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

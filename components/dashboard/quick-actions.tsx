"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Download, CreditCard, Plus } from "lucide-react"

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent">
            <Send className="h-5 w-5" />
            <span className="text-xs">Transfer</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent">
            <Download className="h-5 w-5" />
            <span className="text-xs">Deposit</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Pay Bills</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Invest</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

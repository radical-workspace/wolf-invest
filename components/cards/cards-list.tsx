"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Eye, EyeOff, MoreVertical } from "lucide-react"
import { useState } from "react"

interface CardData {
  id: string
  card_type: string
  card_number: string
  card_holder_name: string
  expiry_date: string
  credit_limit?: number
  available_credit?: number
  accounts: {
    account_type: string
    account_number: string
    balance: number
  }
}

interface CardsListProps {
  cards: CardData[]
}

export default function CardsList({ cards }: CardsListProps) {
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({})

  const toggleCardNumber = (cardId: string) => {
    setShowNumbers((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  const formatCardNumber = (cardNumber: string, show: boolean) => {
    if (show) {
      return cardNumber.replace(/(.{4})/g, "$1 ").trim()
    }
    return `•••• •••• •••• ${cardNumber.slice(-4)}`
  }

  const getCardGradient = (type: string) => {
    return type === "credit"
      ? "bg-gradient-to-r from-purple-600 to-purple-800"
      : "bg-gradient-to-r from-blue-600 to-blue-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Cards</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <CreditCard className="h-4 w-4 mr-2" />
          Add New Card
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card className="p-8 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
          <p className="text-gray-600 mb-4">Add your first card to get started</p>
          <Button>Add Card</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Card key={card.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Card Visual */}
                <div className={`${getCardGradient(card.card_type)} text-white p-6 relative`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {card.card_type.toUpperCase()}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono tracking-wider">
                        {formatCardNumber(card.card_number, showNumbers[card.id])}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleCardNumber(card.id)}
                        className="text-white hover:bg-white/20"
                      >
                        {showNumbers[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-80">CARDHOLDER NAME</p>
                        <p className="font-medium">{card.card_holder_name}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80">EXPIRES</p>
                        <p className="font-medium">
                          {new Date(card.expiry_date).toLocaleDateString("en-US", {
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Linked Account</span>
                    <span className="font-medium">
                      {card.accounts.account_type} ••••{card.accounts.account_number.slice(-4)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available Balance</span>
                    <span className="font-medium">
                      ${card.accounts.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {card.card_type === "credit" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Credit Limit</span>
                        <span className="font-medium">
                          ${card.credit_limit?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Available Credit</span>
                        <span className="font-medium text-green-600">
                          ${card.available_credit?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Freeze Card
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

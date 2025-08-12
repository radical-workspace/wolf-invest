"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Delete } from "lucide-react"

interface PinAuthProps {
  onSuccess: () => void
}

export function PinAuth({ onSuccess }: PinAuthProps) {
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleNumberClick = (number: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + number)
      setError("")
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
    setError("")
  }

  const handleSubmit = async () => {
    if (pin.length !== 4) return

    setIsLoading(true)
    setError("")

    // Simulate PIN verification (replace with actual Supabase auth)
    setTimeout(() => {
      if (pin === "1234") {
        // Demo PIN
        onSuccess()
      } else {
        setError("Invalid PIN. Try again.")
        setPin("")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-700 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-serif">
            Wolv-Invest
          </CardTitle>
          <p className="text-slate-600 text-sm font-medium">Enter your 4-digit PIN to continue</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  pin.length > index
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-500 shadow-lg shadow-purple-500/50"
                    : "border-slate-300"
                }`}
              />
            ))}
          </div>

          {error && <div className="text-center text-red-500 text-sm font-medium">{error}</div>}

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant="outline"
                className="h-14 text-xl font-bold hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200 bg-transparent shadow-sm"
                onClick={() => handleNumberClick(number.toString())}
                disabled={isLoading}
              >
                {number}
              </Button>
            ))}
            <div></div> {/* Empty space */}
            <Button
              variant="outline"
              className="h-14 text-xl font-bold hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200 bg-transparent shadow-sm"
              onClick={() => handleNumberClick("0")}
              disabled={isLoading}
            >
              0
            </Button>
            <Button
              variant="outline"
              className="h-14 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 bg-transparent shadow-sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Delete className="h-5 w-5" />
            </Button>
          </div>

          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            onClick={handleSubmit}
            disabled={pin.length !== 4 || isLoading}
          >
            {isLoading ? "Verifying..." : "Enter"}
          </Button>

          <p className="text-center text-xs text-slate-500">Demo PIN: 1234</p>
        </CardContent>
      </Card>
    </div>
  )
}

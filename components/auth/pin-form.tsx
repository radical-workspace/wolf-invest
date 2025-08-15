"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { verifyPin, setPin } from "@/lib/actions"

function SubmitButton({ isSettingPin }: { isSettingPin: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isSettingPin ? "Setting PIN..." : "Verifying..."}
        </>
      ) : isSettingPin ? (
        "Set PIN"
      ) : (
        "Enter PIN"
      )}
    </Button>
  )
}

export default function PinForm({ hasPin }: { hasPin: boolean }) {
  const router = useRouter()
  const [isSettingPin, setIsSettingPin] = useState(!hasPin)
  const [verifyState, verifyAction] = useActionState(verifyPin, null)
  const [setPinState, setPinAction] = useActionState(setPin, null)

  useEffect(() => {
    if (verifyState?.success) {
      router.push("/dashboard")
    }
  }, [verifyState, router])

  useEffect(() => {
    if (setPinState?.success) {
      setIsSettingPin(false)
      // Refresh the page to update hasPin status
      window.location.reload()
    }
  }, [setPinState])

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-600 rounded-full">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          {isSettingPin ? "Set Your PIN" : "Enter Your PIN"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isSettingPin
            ? "Create a 4-digit PIN to secure your account"
            : "Enter your 4-digit PIN to access your account"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSettingPin ? (
          <form action={setPinAction} className="space-y-4">
            {setPinState?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {setPinState.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                PIN (4 digits)
              </label>
              <Input
                id="pin"
                name="pin"
                type="password"
                placeholder="••••"
                maxLength={4}
                pattern="[0-9]{4}"
                required
                className="h-12 text-center text-2xl tracking-widest"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700">
                Confirm PIN
              </label>
              <Input
                id="confirmPin"
                name="confirmPin"
                type="password"
                placeholder="••••"
                maxLength={4}
                pattern="[0-9]{4}"
                required
                className="h-12 text-center text-2xl tracking-widest"
              />
            </div>

            <SubmitButton isSettingPin={true} />
          </form>
        ) : (
          <form action={verifyAction} className="space-y-4">
            {verifyState?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {verifyState.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                Enter PIN
              </label>
              <Input
                id="pin"
                name="pin"
                type="password"
                placeholder="••••"
                maxLength={4}
                pattern="[0-9]{4}"
                required
                className="h-12 text-center text-2xl tracking-widest"
                autoFocus
              />
            </div>

            <SubmitButton isSettingPin={false} />

            {hasPin && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsSettingPin(true)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Change PIN
                </Button>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}

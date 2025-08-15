"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Building2 } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        "Create Account"
      )}
    </Button>
  )
}

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null)

  return (
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-600 rounded-full">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Williams Holdings</CardTitle>
        <CardDescription className="text-gray-600">Create your banking account</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {state.success}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input id="fullName" name="fullName" type="text" placeholder="John Doe" required className="h-12" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" required className="h-12" />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input id="password" name="password" type="password" required className="h-12" />
          </div>

          <SubmitButton />

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

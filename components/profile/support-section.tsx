"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail, FileText, LogOut } from "lucide-react"
import { signOut } from "@/lib/actions"

export default function SupportSection() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "1-800-WILLIAMS",
      action: "Call Now",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@williamsholdings.com",
      action: "Send Email",
    },
    {
      icon: FileText,
      title: "Help Center",
      description: "Browse our knowledge base",
      action: "Visit",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support & Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supportOptions.map((option, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <option.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{option.title}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signOut}>
            <Button
              type="submit"
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

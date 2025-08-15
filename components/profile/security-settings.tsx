"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Key, Smartphone, AlertTriangle } from "lucide-react"

interface SecuritySettingsProps {
  user: {
    id: string
    pin_hash?: string
  } | null
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const securityItems = [
    {
      icon: Key,
      title: "Change PIN",
      description: "Update your 4-digit security PIN",
      action: "Change",
      status: user?.pin_hash ? "Set" : "Not Set",
      statusColor: user?.pin_hash ? "text-green-600" : "text-red-600",
    },
    {
      icon: Shield,
      title: "Password",
      description: "Change your account password",
      action: "Update",
      status: "Set",
      statusColor: "text-green-600",
    },
    {
      icon: Smartphone,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      action: "Enable",
      status: "Disabled",
      statusColor: "text-yellow-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Security Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <item.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className={`text-xs ${item.statusColor}`}>{item.status}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                {item.action}
              </Button>
            </div>
          ))}

          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Account Security</h4>
                <p className="text-sm text-red-700 mt-1">
                  Keep your account secure by enabling two-factor authentication and using a strong PIN.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

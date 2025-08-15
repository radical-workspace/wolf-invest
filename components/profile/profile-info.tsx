"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Mail, Phone, User } from "lucide-react"
import { useState } from "react"

interface ProfileInfoProps {
  user: {
    id: string
    full_name?: string
    email: string
    phone?: string
  } | null
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    phone: user?.phone || "",
  })

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email[0].toUpperCase() || "U"

  const handleSave = () => {
    // TODO: Implement profile update
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Personal Information
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-blue-600 text-white text-xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{user?.full_name || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{user?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

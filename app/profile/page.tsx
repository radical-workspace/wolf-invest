import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import ProfileInfo from "@/components/profile/profile-info"
import SecuritySettings from "@/components/profile/security-settings"
import AccountSettings from "@/components/profile/account-settings"
import SupportSection from "@/components/profile/support-section"

export default async function ProfilePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get user's accounts for account settings
  const { data: accounts } = await supabase.from("accounts").select("*").eq("user_id", user.id).eq("is_active", true)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DashboardHeader user={userProfile} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileInfo user={userProfile} />
            <AccountSettings accounts={accounts || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <SecuritySettings user={userProfile} />
            <SupportSection />
          </div>
        </div>
      </main>
    </div>
  )
}

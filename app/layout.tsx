import type React from "react"
import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css" // Ensure your global styles are imported

export async function generateMetadata() {
  return {
    title: "Wolv.pro Investment Dashboard",
    description: "Your personal and administrative investment dashboard for Wolv.pro",
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en">
      <body>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };

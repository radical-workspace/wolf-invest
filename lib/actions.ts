"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Update the signIn function to handle redirects properly
export async function signIn(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (authError) {
      return { error: authError.message }
    }

    if (authData.user) {
      // Check user role for proper redirect
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
        return { success: true, redirect: "/dashboard/user" }
      } else {
        // Return redirect based on user role
        if (userProfile.role === "admin") {
          return { success: true, redirect: "/dashboard/admin" }
        } else {
          return { success: true, redirect: "/dashboard/user" }
        }
      }
    }

    return { success: true, redirect: "/dashboard/user" }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Update the signUp function to handle potential null formData
export async function signUp(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")

  // Validate required fields
  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
    })

    if (authError) {
      return { error: authError.message }
    }

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: email.toString(),
        full_name: fullName.toString(),
        role: "user",
        plan: "basic",
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
      }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
}

"use server"

import { supabase } from "@/lib/supabase/client"
import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Check if user has PIN set
    if (data.user) {
      const { data: userData } = await supabase.from("users").select("pin").eq("id", data.user.id).single()

      if (!userData?.pin) {
        redirect("/auth/pin?setup=true")
      } else {
        redirect("/auth/pin")
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")

  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        data: {
          full_name: fullName.toString(),
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Create user profile in our users table
    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: email.toString(),
        full_name: fullName.toString(),
      })
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  await supabase.auth.signOut()
  redirect("/auth/sign-in")
}

export async function verifyPin(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const pin = formData.get("pin")

  if (!pin) {
    return { error: "PIN is required" }
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "User not authenticated" }
    }

    // Get user's stored PIN
    const { data: userData, error } = await supabase.from("users").select("pin").eq("id", user.id).single()

    if (error || !userData) {
      return { error: "User data not found" }
    }

    if (!userData.pin) {
      return { error: "PIN not set. Please set up your PIN first." }
    }

    // Simple PIN comparison (in production, use proper hashing)
    if (pin.toString() !== userData.pin) {
      return { error: "Invalid PIN" }
    }

    redirect("/dashboard")
  } catch (error) {
    console.error("PIN verification error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function setPin(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const pin = formData.get("pin")
  const confirmPin = formData.get("confirmPin")

  if (!pin || !confirmPin) {
    return { error: "Both PIN fields are required" }
  }

  if (pin !== confirmPin) {
    return { error: "PINs do not match" }
  }

  if (pin.toString().length !== 4) {
    return { error: "PIN must be 4 digits" }
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "User not authenticated" }
    }

    // Store PIN directly (in production, use proper hashing)
    const { error } = await supabase.from("users").update({ pin: pin.toString() }).eq("id", user.id)

    if (error) {
      return { error: "Failed to set PIN" }
    }

    redirect("/dashboard")
  } catch (error) {
    console.error("Set PIN error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

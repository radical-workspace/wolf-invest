import { neon } from "@neondatabase/serverless"

// <CHANGE> Updated to use correct Neon environment variables
const databaseUrl = process.env.NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("Database URL not found. Please check your environment variables.")
}

const cleanDatabaseUrl = databaseUrl.trim().replace(/^=+/, "")

if (!cleanDatabaseUrl.startsWith("postgres://")) {
  throw new Error(`Invalid database URL format: ${cleanDatabaseUrl}`)
}

// Create a reusable SQL client for Neon
export const sql = neon(cleanDatabaseUrl)

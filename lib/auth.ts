import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"

// Get the base URL for the current environment
const getBaseURL = () => {
  // Always use environment variables first for consistency
  const envURL = process.env.BETTER_AUTH_URL || 
                 process.env.NEXTAUTH_URL || 
                 process.env.NEXT_PUBLIC_APP_URL
  
  if (envURL) {
    return envURL
  }
  
  // Fallback to window.location.origin only in browser
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Final fallback for server-side
  return "http://localhost:3000"
}

const baseURL = getBaseURL()
const isProduction = process.env.NODE_ENV === "production"

console.log('🔧 Better Auth Config:', {
  baseURL,
  isProduction,
  nodeEnv: process.env.NODE_ENV
})

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  
  // Email/Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  
  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieName: "better-auth.session_token",
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  
  // Cookie configuration for production
  cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      httpOnly: true,
      secure: isProduction, // Only secure in production (HTTPS)
      sameSite: "lax", // Allows top-level navigation
      path: "/", // Available on all routes
      maxAge: 60 * 60 * 24 * 7, // 7 days
      // Remove domain restriction - let it use the current domain
    },
  },
  
  // Base URL and trusted origins
  baseURL,
  trustedOrigins: [
    baseURL,
    "https://kandid-assignment-eta.vercel.app",
    "http://localhost:3000"
  ],
  
  // Secret for signing tokens
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  
  // User configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
  
  // Advanced settings
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
  
  // Logging for debugging
  logger: {
    level: isProduction ? "error" : "debug",
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

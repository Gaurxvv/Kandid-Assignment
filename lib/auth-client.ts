import { createAuthClient } from "better-auth/react"

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

console.log('🌐 Auth Client Base URL:', baseURL)

export const authClient = createAuthClient({
  baseURL,
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient
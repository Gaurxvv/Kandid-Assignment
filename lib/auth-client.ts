import { createAuthClient } from "better-auth/react"
import { config } from "./config"

export const authClient = createAuthClient({
  baseURL: config.baseURL,
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient

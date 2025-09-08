'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

interface User {
  id: string
  email: string
  name: string
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

interface Session {
  token: string
  user: User
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 AuthProvider: Initializing...')
        const { data } = await authClient.getSession()
        
        if (data?.user) {
          console.log('✅ AuthProvider: User found:', data.user.email)
          setUser(data.user)
          setSession({
            token: data.session?.token || '',
            user: data.user
          })
        } else {
          console.log('❌ AuthProvider: No user found')
          setUser(null)
          setSession(null)
        }
      } catch (error) {
        console.error('🚨 AuthProvider: Initialization error:', error)
        setUser(null)
        setSession(null)
      } finally {
        setLoading(false)
        console.log('🏁 AuthProvider: Initialization complete')
      }
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 AuthProvider: Starting sign in for:', email)
    
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    })

    if (error) {
      console.error('🚨 AuthProvider: Sign in error:', error)
      throw new Error(error.message)
    }

    if (data?.user) {
      console.log('✅ AuthProvider: Sign in successful for:', data.user.email)
      setUser(data.user)
      setSession({
        token: data.token || '',
        user: data.user
      })
    } else {
      throw new Error('Sign in failed - no user data returned')
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    console.log('📝 AuthProvider: Starting sign up for:', email)
    
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    })

    if (error) {
      console.error('🚨 AuthProvider: Sign up error:', error)
      throw new Error(error.message)
    }

    if (data?.user) {
      console.log('✅ AuthProvider: Sign up successful for:', data.user.email)
      setUser(data.user)
      setSession({
        token: data.token || '',
        user: data.user
      })
    } else {
      throw new Error('Sign up failed - no user data returned')
    }
  }

  const signOut = async () => {
    console.log('🚪 AuthProvider: Signing out...')
    
    try {
      // Clear local state first
      setUser(null)
      setSession(null)
      
      // Then call the API to clear server-side session
      await authClient.signOut()
      
      console.log('✅ AuthProvider: Sign out successful')
      
      // Redirect to login page after successful logout
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('🚨 AuthProvider: Sign out error:', error)
      // Still clear local state even if API call fails
      setUser(null)
      setSession(null)
      
      // Redirect to login page even if API call fails
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  const refreshSession = async () => {
    console.log('🔄 AuthProvider: Refreshing session...')
    
    try {
      const { data } = await authClient.getSession()
      
      if (data?.user) {
        console.log('✅ AuthProvider: Session refreshed for:', data.user.email)
        setUser(data.user)
        setSession({
          token: data.session?.token || '',
          user: data.user
        })
      } else {
        console.log('❌ AuthProvider: No user in refreshed session')
        setUser(null)
        setSession(null)
      }
    } catch (error) {
      console.error('🚨 AuthProvider: Session refresh error:', error)
      setUser(null)
      setSession(null)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
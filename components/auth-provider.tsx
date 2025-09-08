'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

type User = {
  id: string
  email: string
  name: string
  image?: string | null | undefined
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

type Session = {
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

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('AuthProvider: Initializing auth...')
        const { data } = await authClient.getSession()
        console.log('AuthProvider: Session data:', { hasUser: !!data?.user, hasSession: !!data?.session })
        if (data?.user) {
          setUser(data.user)
          setSession({
            token: data.session?.token || '',
            user: data.user
          })
          console.log('AuthProvider: User set successfully')
        } else {
          setUser(null)
          setSession(null)
          console.log('AuthProvider: No user found')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
        setSession(null)
      } finally {
        setLoading(false)
        console.log('AuthProvider: Initialization complete')
      }
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Starting sign in process')
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    })

    console.log('AuthProvider: Sign in response:', { data, error })

    if (error) {
      throw new Error(error.message)
    }

    if (data?.user) {
      console.log('AuthProvider: Setting user and session:', data.user)
      setUser(data.user)
      setSession({
        token: data.token || '',
        user: data.user
      })
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data?.user) {
      setUser(data.user)
      setSession({
        token: data.token || '',
        user: data.user
      })
    }
  }

  const signOut = async () => {
    await authClient.signOut()
    setUser(null)
    setSession(null)
  }

  const refreshSession = async () => {
    try {
      const { data } = await authClient.getSession()
      if (data?.user) {
        setUser(data.user)
        setSession({
          token: data.session?.token || '',
          user: data.user
        })
      } else {
        setUser(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      setUser(null)
      setSession(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, refreshSession }}>
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

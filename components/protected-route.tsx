'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: Checking auth state:', {
      hasUser: !!user,
      loading,
      pathname: window.location.pathname
    })

    // Only redirect if we're not loading and there's no user
    if (!loading && !user) {
      console.log('🚫 ProtectedRoute: No user, redirecting to login')
      router.push('/login')
    } else if (!loading && user) {
      console.log('✅ ProtectedRoute: User authenticated, allowing access')
    }
  }, [user, loading, router])

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('⏳ ProtectedRoute: Loading...')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If no user after loading, don't render anything (redirect will happen)
  if (!user) {
    console.log('❌ ProtectedRoute: No user, not rendering')
    return null
  }

  // User is authenticated, render the protected content
  console.log('🎉 ProtectedRoute: Rendering protected content')
  return <>{children}</>
}
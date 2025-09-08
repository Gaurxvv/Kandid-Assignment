import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/login', 
    '/signup', 
    '/api/auth',
    '/_next', // Next.js static files
    '/favicon.ico'
  ]
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Get session token from cookies
  const sessionToken = request.cookies.get('better-auth.session_token')?.value
  
  // Debug logging for production debugging
  console.log('🔍 Middleware Debug:', {
    pathname,
    hasSessionToken: !!sessionToken,
    tokenPreview: sessionToken ? `${sessionToken.substring(0, 10)}...` : 'none',
    allCookies: request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 10)}...`),
    userAgent: request.headers.get('user-agent')?.substring(0, 30),
    timestamp: new Date().toISOString()
  })
  
  // If no session token, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    
    console.log('🚫 No session token, redirecting to:', loginUrl.toString())
    return NextResponse.redirect(loginUrl)
  }
  
  // Session token exists, allow access
  console.log('✅ Session token found, allowing access to:', pathname)
  return NextResponse.next()
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
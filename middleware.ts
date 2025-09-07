import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/api/auth']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get the session token from cookies
  const sessionToken = request.cookies.get('better-auth.session_token')?.value

  // If no session token, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url)
    // Add the current path as a redirect parameter so we can redirect back after login
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If session token exists, allow access
  return NextResponse.next()
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

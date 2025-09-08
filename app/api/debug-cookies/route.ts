import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll()
  
  return NextResponse.json({
    cookies: cookies.map(c => ({
      name: c.name,
      value: c.value.substring(0, 20) + '...',
      hasValue: !!c.value
    })),
    sessionToken: request.cookies.get('better-auth.session_token')?.value ? 'present' : 'missing',
    userAgent: request.headers.get('user-agent')?.substring(0, 50),
    timestamp: new Date().toISOString()
  })
}

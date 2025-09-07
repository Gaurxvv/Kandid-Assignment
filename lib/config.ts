// Client-side configuration utility
export const getBaseURL = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    console.log('🌐 Client-side baseURL:', origin)
    return origin
  }
  
  // In server environment
  const serverURL = process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  console.log('🖥️ Server-side baseURL:', serverURL)
  return serverURL
}

export const config = {
  baseURL: getBaseURL(),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

// Debug logging
console.log('🔧 Auth config:', {
  baseURL: config.baseURL,
  isDevelopment: config.isDevelopment,
  isProduction: config.isProduction,
  env: {
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }
})

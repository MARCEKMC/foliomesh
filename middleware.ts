import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Development vs Production domain handling
  const isDev = process.env.NODE_ENV === 'development'
  const baseDomain = isDev ? 'foliomesh.local' : 'foliomesh.com'
  
  // Extract subdomain
  const subdomain = hostname.replace(`.${baseDomain}`, '')
  
  // If it's the main domain (no subdomain or www)
  if (hostname === baseDomain || hostname === `www.${baseDomain}` || subdomain === hostname) {
    // Main app routes - continue normally
    return NextResponse.next()
  }
  
  // If it's a subdomain, rewrite to portfolio viewer
  if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
    // Check if it's a private portfolio (has token in path)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const hasToken = pathSegments.length > 0 && /^[a-zA-Z0-9]{6}$/.test(pathSegments[0])
    
    if (hasToken) {
      // Private portfolio with token
      const token = pathSegments[0]
      url.pathname = `/portfolio/${subdomain}/${token}`
    } else {
      // Public portfolio
      url.pathname = `/portfolio/${subdomain}`
    }
    
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
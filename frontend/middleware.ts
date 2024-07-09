import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname, searchParams } = request.nextUrl
  const publicPaths = ['/login', '/signup']

  if (publicPaths.includes(pathname)) {
    if (token) {
      const callbackUrl = searchParams.get('callbackUrl') || '/'
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images/static|images/login|sw.js|workbox-.*|manifest.json).*)',
  ],
}

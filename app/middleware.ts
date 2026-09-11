// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // Extract session token or auth cookie
  const sessionToken = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Unauthenticated users trying to access protected routes
  if (pathname.startsWith('/workspace') && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname); // Retain target destination
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already authenticated users trying to access /login
  if (pathname === '/login' && sessionToken) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  return NextResponse.next();
}

// Ensure middleware ONLY intercepts targeted routes
export const config = {
  matcher: ['/workspace/:path*', '/login'],
};
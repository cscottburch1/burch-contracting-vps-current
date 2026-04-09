import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow admin login shell and public api endpoints.
  if (!pathname.startsWith('/admin') || pathname === '/admin') {
    return NextResponse.next();
  }

  const cookieValue = req.cookies.get(ADMIN_COOKIE_NAME)?.value || '';
  if (!cookieValue || !cookieValue.includes('.')) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

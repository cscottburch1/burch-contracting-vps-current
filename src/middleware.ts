import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin authentication logic
  let response: NextResponse;
  
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const cookieValue = req.cookies.get(ADMIN_COOKIE_NAME)?.value || '';
    if (!cookieValue || !cookieValue.includes('.')) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin';
      loginUrl.searchParams.set('next', pathname);
      response = NextResponse.redirect(loginUrl);
    } else {
      response = NextResponse.next();
    }
  } else {
    response = NextResponse.next();
  }

  // Apply comprehensive security headers to all responses
  const headers = response.headers;

  // 1. HSTS - Force HTTPS for 2 years including subdomains
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // 2. Content Security Policy - Comprehensive but allows necessary external resources
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://api.bing.microsoft.com https://indexnow.org",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ];
  headers.set('Content-Security-Policy', cspDirectives.join('; '));

  // 3. X-Frame-Options - Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // 4. X-Content-Type-Options - Prevent MIME sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // 5. Referrer-Policy - Control referrer information
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. Permissions-Policy - Restrict browser features
  const permissionsPolicy = [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ];
  headers.set('Permissions-Policy', permissionsPolicy.join(', '));

  // 7. X-DNS-Prefetch-Control - Control DNS prefetching
  headers.set('X-DNS-Prefetch-Control', 'on');

  // 8. X-XSS-Protection - Legacy XSS protection (still useful for older browsers)
  headers.set('X-XSS-Protection', '1; mode=block');

  // 9. X-Permitted-Cross-Domain-Policies - Restrict cross-domain policies
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // 10. Cross-Origin-Embedder-Policy - Prevent resource loading attacks
  headers.set('Cross-Origin-Embedder-Policy', 'credentialless');

  // 11. Cross-Origin-Opener-Policy - Isolate browsing context
  headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  // 12. Cross-Origin-Resource-Policy - Control resource sharing
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and Next.js internals
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};

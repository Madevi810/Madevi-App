import { randomUUID } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

const REQUEST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Webpack's development runtime evaluates client chunks.  Blocking eval in
// development leaves the SSR document visible while preventing React from
// hydrating any interactive client component.  Keep production strict.
const SCRIPT_SOURCE =
  process.env.NODE_ENV === 'development'
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";

export function proxy(request: NextRequest) {
  const supplied = request.headers.get('x-request-id');
  const requestId = supplied && REQUEST_ID.test(supplied) ? supplied.toLowerCase() : randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('x-request-id', requestId);
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('referrer-policy', 'no-referrer');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set(
    'content-security-policy',
    `default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src ${SCRIPT_SOURCE}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self' blob:;`,
  );
  response.headers.set(
    'permissions-policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

import { NextRequest } from 'next/server';
import { errorResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { SecurityService } from '@/services/security';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { requestIdFromHeaders } from '@/server/request-id';

export type RequestHandler = (
  req: Request | NextRequest, 
  // Next route handlers use route-specific context shapes. The wrapper forwards
  // that value untouched and does not inspect it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any
) => Promise<Response>;

interface ProtectionOptions {
  actionName: string; 
  checkPayload?: boolean;
}

/**
 * Higher-order function to wrap API routes with high-level security and rate limiting.
 * Achieves O(1) rate limit check and payload inspection for SQLi/XSS/SSRF.
 */
export function withProtection(handler: RequestHandler, options: ProtectionOptions): RequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: Request | NextRequest, context?: any) => {
    const requestId = requestIdFromHeaders(req.headers);
    try {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '127.0.0.1';
      const security = new SecurityService(getDatabaseClients().pool, getDatabaseSchema());

      // 1. O(1) Atomic Rate Limiting
      const limit = await security.checkActionRateLimit(ip, options.actionName);
      if (!limit.allowed) {
        return new Response(
          JSON.stringify({
            error: { code: 'RATE_LIMITED', message: `Batas permintaan terlampaui. Coba lagi dalam ${limit.retryAfterSeconds} detik.` },
            requestId
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(limit.retryAfterSeconds),
              'X-RateLimit-Remaining': String(limit.remaining)
            }
          }
        );
      }

      // 2. High-level Security Payload Inspection (SQLi, XSS, SSRF)
      if (options.checkPayload && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        // Clone request so the actual handler can still consume the body
        const clone = req.clone();
        try {
          const payload = await clone.json();
          await security.inspectPayload(payload, new URL(req.url).pathname, ip);
        } catch (e: unknown) {
          // If it fails to parse or fails inspection
          const message = e instanceof Error ? e.message : '';
          if (message.startsWith('Blocked:')) {
            // Log threat asynchronously
            security.logThreat(
              message.includes('SQLi') ? 'SQLI_ATTEMPT' :
              message.includes('XSS') ? 'XSS_ATTEMPT' : 'MALICIOUS_PAYLOAD',
              ip,
              new URL(req.url).pathname,
              '[REDACTED]'
            ).catch(() => {});
            
            throw new ApiError('ACCESS_DENIED', 'Payload diblokir oleh sistem keamanan');
          }
        }
      }

      // 3. Execute actual handler
      const response = await handler(req, context);
      
      // Inject rate limit headers into successful response
      response.headers.set('X-RateLimit-Remaining', String(limit.remaining));
      
      return response;
    } catch (error) {
      return errorResponse(error, requestId);
    }
  };
}

import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { TelemetryService } from '@/services/telemetry';
import { requestIdFromHeaders } from '@/server/request-id';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // P1 fix (audit 2026-10-15): rate limit telemetry — cegah spam log tak terbatas.
    const guard = await new SecurityService(getDatabaseClients().pool).checkActionRateLimit(
      clientIp(request),
      'telemetry',
    );
    if (!guard.allowed) {
      return successResponse({ tracked: false }, requestId);
    }

    const body = await request.json();
    const { eventCategory, eventName, url, metadata, sessionId } = body;

    if (!eventCategory || !eventName) {
      // Return 200 anyway for telemetry to not show console errors on the client,
      // but in real life we might want 400. Let's do 400.
      return errorResponse(new Error('Missing eventCategory or eventName'), requestId);
    }

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    // We do NOT block the request waiting for DB. We fire and forget!
    // But since Vercel edge/serverless might kill the process, we use `waitUntil` if available, 
    // or just await it if we are on a long-running Node server.
    const service = new TelemetryService(getDatabaseClients().pool, getDatabaseSchema());
    
    // Madevi runs on standard Node.js server (pm2/docker), so awaiting is fine and fast.
    // To be truly performant, we don't await the insertion directly in the main thread if we can avoid it.
    // For now, we await it since we have a Postgres Pool and it's fast.
    await service.trackEvent({
      eventCategory,
      eventName,
      url: url || request.headers.get('referer') || 'unknown',
      metadata,
      sessionId,
      ipAddress,
      userAgent,
      // Principal ID would be injected if we parsed the session cookie, but for anonymous tracking it's fine without.
    });

    return successResponse({ tracked: true }, requestId);
  } catch (error) {
    // Suppress telemetry errors from the client
    return successResponse({ tracked: false, error: 'Silently ignored' }, requestId);
  }
}

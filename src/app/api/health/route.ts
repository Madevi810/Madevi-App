import { probeHealth } from '@/server/health';
import { logEvent } from '@/server/logger';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  const health = await probeHealth(requestId);

  logEvent(health.status === 'ok' ? 'info' : 'error', 'health_check', {
    requestId,
    status: health.status,
    database: health.services.database,
  });

  return Response.json(
    { data: health, requestId },
    {
      status: health.status === 'ok' ? 200 : 503,
      headers: {
        'cache-control': 'no-store',
        'x-request-id': requestId,
      },
    },
  );
}

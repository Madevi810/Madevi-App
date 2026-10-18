import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/api/response';
import { getPool } from '@/db/pool';
import { accountsService } from '@/app/api/v1/auth/route-utils';
import { OAuthSimulationService } from '@/services/oauth-simulation';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * Mulai OAuth tiruan: terbitkan state anti-CSRF lalu redirect ke layar
 * persetujuan tiruan milik provider.
 */
export async function GET(req: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    const { provider } = await context.params;
    const pool = await getPool();
    const guard = await new SecurityService(pool).checkActionRateLimit(
      clientIp(req),
      'oauth_simulate',
    );
    if (!guard.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Terlalu banyak percobaan login. Coba lagi nanti.', requestId } },
        { status: 429 },
      );
    }
    const service = new OAuthSimulationService(pool, accountsService());
    const { consentUrl } = await service.beginAuthorize(provider);
    return NextResponse.redirect(new URL(consentUrl, req.url));
  } catch (e: unknown) {
    return errorResponse(e, requestId);
  }
}

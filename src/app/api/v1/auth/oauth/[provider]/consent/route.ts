import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { getPool } from '@/db/pool';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { OAuthSimulationService } from '@/services/oauth-simulation';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { requestIdFromHeaders } from '@/server/request-id';
import { parseJsonObject } from '@/api/validation';

export const dynamic = 'force-dynamic';

/**
 * Persetujuan di layar consent tiruan: tukar state -> authorization code.
 * Body: { state, subject, name, email } — identitas "terverifikasi" tiruan
 * yang dipilih/diketik pengguna di layar consent.
 */
export async function POST(req: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    const { provider } = await context.params;
    const pool = await getPool();
    const guard = await new SecurityService(pool).checkActionRateLimit(
      clientIp(req),
      'oauth_simulate',
    );
    if (!guard.allowed) {
      throw new ApiError('RATE_LIMITED', 'Terlalu banyak percobaan login. Coba lagi nanti.');
    }
    const body = await parseJsonObject(req);
    const service = new OAuthSimulationService(pool, accountsService());
    const result = await service.handleConsent(provider, {
      state: bodyText(body, 'state', 512),
      subject: bodyText(body, 'subject', 128),
      name: bodyText(body, 'name', 120),
      email: bodyText(body, 'email', 254),
    });
    return successResponse(
      {
        data: {
          provider,
          code: result.code,
          state: result.state,
          // Klien melanjutkan ke callback seperti redirect provider asli.
          callbackUrl: `/api/v1/auth/oauth/${encodeURIComponent(provider)}/callback?code=${encodeURIComponent(result.code)}&state=${encodeURIComponent(result.state)}`,
        },
      },
      requestId,
    );
  } catch (e: unknown) {
    return errorResponse(e, requestId);
  }
}

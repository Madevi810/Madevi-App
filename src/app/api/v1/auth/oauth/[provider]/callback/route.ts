import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/api/response';
import { getPool } from '@/db/pool';
import { accountsService } from '@/app/api/v1/auth/route-utils';
import { appendSessionCookies } from '@/auth/http';
import { OAuthSimulationService } from '@/services/oauth-simulation';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * Callback OAuth tiruan: tukar code -> sesi Madevi.
 * Meniru redirect provider asli: ?code=...&state=...
 *
 * Bila akun mengaktifkan 2FA email, sesi belum dibuat — pengguna diarahkan
 * ke /auth untuk memasukkan kode OTP seperti alur login biasa.
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
      return NextResponse.redirect(new URL('/auth?error=rate_limited', req.url));
    }
    const url = new URL(req.url);
    const code = url.searchParams.get('code') ?? '';
    const state = url.searchParams.get('state') ?? '';
    const service = new OAuthSimulationService(pool, accountsService());
    const result = await service.handleCallback(provider, { code, state });

    if (result.status === 'MFA_REQUIRED') {
      return NextResponse.redirect(
        new URL(`/auth?oauth_mfa=${encodeURIComponent(result.challengeId)}`, req.url),
      );
    }
    const response = NextResponse.redirect(new URL('/profile', req.url));
    return appendSessionCookies(response, result.session, req.url);
  } catch (e: unknown) {
    return errorResponse(e, requestId);
  }
}

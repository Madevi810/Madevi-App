import { createHash } from 'node:crypto';

import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { appendSessionCookies } from '@/auth/http';
import { parseJsonObject } from '@/api/validation';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';
import { getPool } from '@/db/pool';
import { SecurityService } from '@/services/security';

/**
 * Ambil IP klien untuk pembatasan laju brute-force login.
 * CATATAN: header X-Forwarded-For bisa dipalsukan — karena itu rate limit
 * selalu 2 lapis (per-IP + per-akun). IP header hanya lapis pertama.
 */
function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/** Hash identifier akun agar tidak tersimpan mentah di tabel rate limit. */
function accountPrincipal(identifier: string): string {
  return 'acct:' + createHash('sha256').update(identifier.toLowerCase().trim()).digest('hex').slice(0, 32);
}

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // Brute-force protection: 2 lapis — per-IP (header bisa di-spoof) + per-akun (hash).
    const pool = await getPool();
    const ip = clientIp(request);
    const body = await parseJsonObject(request);
    const identifier = bodyText(body, 'identifier', 254);
    const security = new SecurityService(pool);

    const ipGuard = await security.checkActionRateLimit(ip, 'login');
    if (!ipGuard.allowed) {
      throw new ApiError('RATE_LIMITED', 'Terlalu banyak percobaan login. Coba lagi nanti.');
    }
    const acctGuard = await security.checkActionRateLimit(accountPrincipal(identifier), 'login_account');
    if (!acctGuard.allowed) {
      throw new ApiError('RATE_LIMITED', 'Terlalu banyak percobaan login untuk akun ini. Coba lagi nanti.');
    }

    const result = await accountsService().login({
      identifier,
      password: bodyText(body, 'password', 128),
    });
    if (result.status === 'MFA_REQUIRED')
      return successResponse(result, requestId, { status: 202 });
    const response = successResponse(
      {
        status: 'AUTHENTICATED',
        accessExpiresAt: result.session.accessExpiresAt,
        refreshExpiresAt: result.session.refreshExpiresAt,
      },
      requestId,
    );
    return appendSessionCookies(response, result.session, request.url);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

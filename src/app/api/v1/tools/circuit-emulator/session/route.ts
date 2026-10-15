import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { AccountsService } from '@/services/accounts';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

type SessionPhase = 'RESERVE' | 'COMMIT' | 'RELEASE';

/** Reserve/commit/release one Tools trial around a client-side Web Worker solve. */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const body = await parseJsonObject(request, 4 * 1024);
    if (
      Object.keys(body).some((key) => key !== 'phase' && key !== 'idempotencyKey') ||
      (body.phase !== 'RESERVE' && body.phase !== 'COMMIT' && body.phase !== 'RELEASE')
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Payload sesi emulator tidak valid.');
    }
    const phase = body.phase as SessionPhase;
    const idempotencyKey = body.idempotencyKey;
    if (
      typeof idempotencyKey !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Kunci sesi emulator tidak valid.');
    }

    const pool = await getPool();
    if (phase === 'RESERVE') {
      const rateLimit = await new SecurityService(pool).checkActionRateLimit(
        clientIp(request),
        'tools_execute',
      );
      if (!rateLimit.allowed) {
        throw new ApiError('RATE_LIMITED', 'Batas penggunaan alat tercapai. Coba lagi nanti.');
      }
    }

    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const accounts = new AccountsService(pool);

    if (phase === 'RESERVE') {
      const reserved = await accounts.reserveToolsTrial(auth.principal, {
        toolKind: 'circuit-emulator',
        idempotencyKey,
      });
      if (!reserved.allowed) {
        throw new ApiError(
          'TRIAL_EXHAUSTED',
          'Akses Tools belum tersedia. Periksa sisa trial atau paket pada Profil.',
          { remaining: '0' },
        );
      }
      return successResponse(
        { authorized: true, remaining: reserved.remaining, alreadyCommitted: reserved.consumedTrial },
        requestId,
      );
    }

    if (phase === 'COMMIT') {
      const committed = await accounts.commitToolsTrial(auth.principal, {
        toolKind: 'circuit-emulator',
        idempotencyKey,
      });
      return successResponse(
        { authorized: true, remaining: committed.remaining, trialConsumed: committed.consumedTrial },
        requestId,
      );
    }

    await accounts.releaseToolsTrial(auth.principal, idempotencyKey);
    return successResponse({ released: true }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

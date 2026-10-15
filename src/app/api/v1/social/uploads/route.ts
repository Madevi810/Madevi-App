import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { getServerEnv } from '@/server/env';
import { requestIdFromHeaders } from '@/server/request-id';
import { LocalStorageService } from '@/services/storage';

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

// POST /api/v1/social/uploads — simpan media ke karantina sebelum moderasi.
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // P17: rate limit per aksi — upload adalah vector spam + storage abuse.
    // 0024 harus terpasang agar rate_limits_by_action tersedia.
    const guard = await new SecurityService(getDatabaseClients().pool).checkActionRateLimit(
      clientIp(request),
      'upload',
    );
    if (!guard.allowed) {
      return errorResponse(
        new ApiError('RATE_LIMITED', 'Batas upload tercapai. Coba lagi nanti.'),
        requestId,
      );
    }
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const idempotencyKey = request.headers.get('idempotency-key') ?? '';
    if (!/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) {
      throw new ApiError(
        'VALIDATION_FAILED',
        'Idempotency-Key wajib berisi 8-128 karakter yang aman',
      );
    }
    const form = await request.formData();
    const value = form.get('file');
    if (!(value instanceof File)) throw new ApiError('VALIDATION_FAILED', 'Field file wajib diisi');
    if (value.size < 1 || value.size > MAX_UPLOAD_BYTES) {
      throw new ApiError('PAYLOAD_TOO_LARGE', 'Ukuran media sosial harus antara 1 byte dan 50 MB');
    }
    const mediaType = value.type || 'application/octet-stream';
    const storage = new LocalStorageService(
      getDatabaseClients().pool,
      getServerEnv().MADEVI_RUNTIME_ROOT,
      getDatabaseSchema(),
    );
    const reservation = await storage.reserve({
      principal: auth.principal,
      bytes: value.size,
      idempotencyKey,
    });
    const stored = await storage.storeQuarantined({
      principal: auth.principal,
      reservationId: reservation.reservationId,
      bytes: new Uint8Array(await value.arrayBuffer()),
      mediaType,
      originalName: value.name,
      fixture: auth.principal.fixture,
    });
    return successResponse(
      { ...stored, state: 'QUARANTINE', assessment: 'UNASSESSED' },
      requestId,
      { status: 202 },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

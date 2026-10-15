import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { guardMutation } from '@/api/mutation-guard';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { getPrincipal } from '@/lib/session';
import { SecurityService } from '@/services/security';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * L07 AC-03: mutation quarantine memakai guard terpusat + envelope konsisten.
 * Request ID, bounded schema, authn/authz objek, CSRF, rate-limit aksi,
 * transaction/audit di service, error mapping konsisten.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const principal = await getPrincipal(request);
    if (!principal || principal.role !== 'OWNER') {
      throw new ApiError('ACCESS_DENIED', 'Hanya Admin');
    }
    const guard = await guardMutation({
      request,
      requestId,
      maxBytes: 16 * 1024,
      validate: (body) => {
        const fileId = typeof body.fileId === 'string' ? body.fileId : '';
        const reason = typeof body.reason === 'string' ? body.reason : '';
        if (!/^[0-9a-f-]{36}$/i.test(fileId)) throw new ApiError('VALIDATION_FAILED', 'fileId tidak valid');
        if (reason.trim().length < 10 || reason.trim().length > 1000) {
          throw new ApiError('VALIDATION_FAILED', 'Alasan karantina 10–1000 karakter');
        }
        return { fileId, reason: reason.trim() };
      },
    });
    const v = guard.validated as { fileId: string; reason: string };
    const service = new SecurityService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.quarantineFile(v.fileId, v.reason, principal.id);
    return successResponse(result, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

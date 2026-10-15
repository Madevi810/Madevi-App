import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { guardMutation } from '@/api/mutation-guard';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { getPrincipal } from '@/lib/session';
import { OperasiService } from '@/services/operasi';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * L07 AC-05: trigger backup hanya mencatat IN_PROGRESS + operation correlation.
 * SUCCESS hanya setelah manifest + checksum terverifikasi (completeBackupWithManifest).
 * Envelope konsisten + request ID; tanpa klaim dump selesai di sini.
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
      maxBytes: 8 * 1024,
      validate: (body) => {
        const type = typeof body.type === 'string' ? body.type : 'FULL';
        if (!['FULL', 'DB_ONLY', 'STORAGE_ONLY'].includes(type)) {
          throw new ApiError('VALIDATION_FAILED', 'Tipe backup tidak valid');
        }
        return { type };
      },
    });
    const v = guard.validated as { type: string };
    const service = new OperasiService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.triggerBackup(v.type);
    return successResponse(
      { ...result, note: 'IN_PROGRESS — manifest + checksum menyusul via Admin-local command' },
      requestId,
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

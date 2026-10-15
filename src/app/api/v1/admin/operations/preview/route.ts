import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { guardMutation } from '@/api/mutation-guard';
import { authenticateAdmin, assertRequestCsrf } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { AdminOperationService } from '@/services/admin-operations';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * L07 AC-02: preview operasi massal — read-only, tidak menulis domain.
 * Filter → preview dampak → confirmation kuat (terikat actor/action/filter/
 * version/TTL) → execute terpisah. Tanpa tombol destruktif sekali klik.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateAdmin(request, { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'ADMIN');
    const guard = await guardMutation({
      request,
      requestId,
      maxBytes: 32 * 1024,
      validate: (body) => {
        const action = typeof body.action === 'string' ? body.action.trim() : '';
        if (action.length < 3 || action.length > 120) {
          throw new ApiError('VALIDATION_FAILED', 'Aksi operasi tidak valid');
        }
        const targets = Array.isArray(body.targets) ? body.targets : [];
        if (targets.length > 200) throw new ApiError('VALIDATION_FAILED', 'Maksimal 200 target');
        for (const t of targets) {
          if (
            !t ||
            typeof t !== 'object' ||
            typeof (t as Record<string, unknown>).targetType !== 'string' ||
            typeof (t as Record<string, unknown>).targetId !== 'string'
          ) {
            throw new ApiError('VALIDATION_FAILED', 'Target operasi tidak valid');
          }
        }
        const key =
          typeof body.idempotencyKey === 'string' ? body.idempotencyKey.trim() : '';
        if (!/^[0-9A-Za-z-]{8,128}$/.test(key)) {
          throw new ApiError('VALIDATION_FAILED', 'Idempotency key tidak valid');
        }
        return {
          action,
          filter: (body as Record<string, unknown>).filter ?? {},
          targets: targets as Array<{ targetType: string; targetId: string }>,
          idempotencyKey: key,
        };
      },
    });
    const v = guard.validated as {
      action: string;
      filter: unknown;
      targets: Array<{ targetType: string; targetId: string }>;
      idempotencyKey: string;
    };
    const service = new AdminOperationService(
      getDatabaseClients().pool,
      getDatabaseSchema(),
    );
    const preview = await service.preview({
      actorId: auth.principal.id,
      action: v.action,
      filter: v.filter,
      targets: v.targets,
      idempotencyKey: v.idempotencyKey,
      requestId,
    });
    return successResponse(preview, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

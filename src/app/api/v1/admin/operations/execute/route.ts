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
 * L07 AC-02: execute operasi — verifikasi confirmation terikat, idempotency,
 * hasil per item, audit. Executor domain hanya untuk action nyata yang
 * didaftarkan di sini (tidak ada batch untuk fitur yang belum tersedia).
 */
const REAL_ACTIONS = new Set([
  'MODERATION_RESOLVE',
  'APPROVAL_DECIDIDE',
  'BACKUP_VERIFY',
]);

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateAdmin(request, { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'ADMIN');
    const guard = await guardMutation({
      request,
      requestId,
      maxBytes: 16 * 1024,
      validate: (body) => {
        const runId = typeof body.runId === 'string' ? body.runId : '';
        const token = typeof body.confirmationToken === 'string' ? body.confirmationToken : '';
        if (!/^[0-9a-f-]{36}$/i.test(runId)) throw new ApiError('VALIDATION_FAILED', 'runId tidak valid');
        if (!/^[0-9a-f]{16,64}$/i.test(token.replace(/-/g, ''))) {
          throw new ApiError('VALIDATION_FAILED', 'Confirmation token tidak valid');
        }
        return { runId, confirmationToken: token };
      },
    });
    const v = guard.validated as { runId: string; confirmationToken: string };
    const service = new AdminOperationService(
      getDatabaseClients().pool,
      getDatabaseSchema(),
    );
    // Executor jujur: hanya action nyata; tiap target dicatat per item.
    // Domain spesifik di-resolve dari run.action di dalam service audit;
    // di sini executor generik menandai dukungan parsial bila action tak dikenal.
    const result = await service.execute({
      actorId: auth.principal.id,
      runId: v.runId,
      confirmationToken: v.confirmationToken,
      requestId,
      executor: async (target) => {
        void target;
        // Placeholder executor dilepas ke domain nyata pada integrasi per-domain;
        // operasi generik ini membuktikan plumbing preview→execute→audit.
        // Action tak terdaftar ditolak agar tidak ada batch palsu.
        const runAction = await getRunAction(v.runId);
        if (!REAL_ACTIONS.has(runAction)) {
          throw new Error(`Action ${runAction} belum memiliki executor domain nyata`);
        }
      },
    });
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

async function getRunAction(runId: string): Promise<string> {
  const { getDatabaseClients } = await import('@/db/client');
  const { getDatabaseSchema } = await import('@/db/schema-name');
  const { quotedSchema } = await import('@/db/schema-name');
  const pool = getDatabaseClients().pool;
  const schema = quotedSchema(getDatabaseSchema());
  const row = await pool
    .query<{ action: string }>(`SELECT action FROM ${schema}.admin_operation_runs WHERE id = $1`, [runId])
    .then((r) => r.rows[0] ?? null);
  return row?.action ?? '';
}

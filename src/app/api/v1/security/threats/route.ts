import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { guardMutation } from '@/api/mutation-guard';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { quotedSchema } from '@/db/schema-name';
import { getPrincipal } from '@/lib/session';
import { SecurityService } from '@/services/security';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * L07 G-04: threat log dengan schema ketat + redaksi.
 * POST memakai guard terpusat (request ID, bounded JSON, CSRF, authz).
 * Payload mentah tidak disimpan — hanya fingerprint/size.
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
        const type = typeof body.type === 'string' ? body.type : '';
        const path = typeof body.path === 'string' ? body.path : '';
        const payload = typeof body.payload === 'string' ? body.payload : '';
        if (type.length < 2 || type.length > 40) throw new ApiError('VALIDATION_FAILED', 'Jenis threat tidak valid');
        if (path.length < 1 || path.length > 500) throw new ApiError('VALIDATION_FAILED', 'Path tidak valid');
        if (payload.length > 8000) throw new ApiError('VALIDATION_FAILED', 'Payload terlalu besar');
        return { type, path, payload };
      },
    });
    const v = guard.validated as { type: string; path: string; payload: string };
    const service = new SecurityService(getDatabaseClients().pool, getDatabaseSchema());
    const ip = request.headers.get('x-forwarded-for')?.slice(0, 64) ?? '0.0.0.0';
    const result = await service.logThreat(v.type, ip, v.path, v.payload, principal.id);
    return successResponse(result, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * L07 G-04: GET memakai cursor + kolom eksplisit + redaksi; tanpa SELECT *.
 * Audit baca dicatat via request ID (di service bila diperlukan).
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER');
    const { searchParams } = new URL(request.url);
    const limitRaw = Number(searchParams.get('limit') ?? '20');
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;
    const cursor = searchParams.get('cursor') ?? undefined;
    const pool = getDatabaseClients().pool;
    const schema = quotedSchema(getDatabaseSchema());
    let cursorCond = '';
    const params: unknown[] = [limit + 1];
    if (cursor) {
      const [ts, id] = cursor.split('__');
      if (!ts || !id || Number.isNaN(Date.parse(ts)) || !/^[0-9a-f-]{36}$/i.test(id)) {
        throw new ApiError('VALIDATION_FAILED', 'Cursor tidak valid');
      }
      params.push(ts, id);
      cursorCond = `AND (created_at, id) < ($2::timestamptz, $3::uuid)`;
    }
    const rows = await pool.query(
      `SELECT id, threat_type, ip_address, request_path, request_payload, created_at
         FROM ${schema}.security_threat_logs
        WHERE 1 = 1 ${cursorCond}
        ORDER BY created_at DESC, id DESC LIMIT $1`,
      params,
    );
    const sliced = rows.rows.slice(0, limit);
    const last = sliced[sliced.length - 1] as { created_at?: Date; id?: string } | undefined;
    const nextCursor =
      rows.rows.length > limit && last?.created_at && last.id
        ? `${new Date(last.created_at).toISOString()}__${last.id}`
        : null;
    return successResponse(sliced, requestId, { page: { nextCursor, limit } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

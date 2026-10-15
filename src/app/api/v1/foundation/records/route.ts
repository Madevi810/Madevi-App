import { parseLimit, parseJsonObject, requiredText } from '@/api/validation';
import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { RecordsService } from '@/services/records';
import { SecurityService } from '@/services/security';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/**
 * Guard rate-limit best-effort: bila tabel 0024 belum ada (instalasi/schema
 * parsial pra-migrasi), lanjutkan dengan peringatan — mengikuti preseden
 * proyeksi Search di ArticleService. Pada schema penuh, guard selalu aktif.
 */
async function guardRateLimit(request: Request): Promise<void> {
  try {
    const pool = getDatabaseClients().pool;
    const guard = await new SecurityService(pool).checkActionRateLimit(
      clientIp(request),
      'general',
    );
    if (!guard.allowed) {
      throw new ApiError('RATE_LIMITED', 'Terlalu banyak permintaan. Coba lagi nanti.');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if ((error as { code?: string })?.code === '42P01') return;
    throw error;
  }
}

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await guardRateLimit(request);
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') ?? 'createdAt:desc';
    if (!['createdAt:asc', 'createdAt:desc'].includes(sort)) {
      throw new ApiError('VALIDATION_FAILED', 'Sort tidak valid', {
        sort: 'createdAt:asc atau createdAt:desc',
      });
    }
    const filter = url.searchParams.get('q')?.trim();
    if (filter && filter.length > 100) {
      throw new ApiError('VALIDATION_FAILED', 'Filter terlalu panjang');
    }
    const auth = await authenticateRequest(request, 'MEMBER');
    const service = new RecordsService(getDatabaseClients().pool);
    const result = await service.list({
      principal: auth.principal,
      limit: parseLimit(url.searchParams.get('limit')),
      cursor: url.searchParams.get('cursor'),
      filter,
      sort: sort as 'createdAt:asc' | 'createdAt:desc',
    });
    return successResponse(result.data, requestId, { page: result.page });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await guardRateLimit(request);
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const service = new RecordsService(getDatabaseClients().pool);
    const data = await service.create({
      principal: auth.principal,
      label: requiredText(body.label, 'label'),
      idempotencyKey: request.headers.get('idempotency-key') ?? '',
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

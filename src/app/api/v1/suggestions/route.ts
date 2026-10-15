import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { ArticleError, ArticleService } from '@/services/article';

// POST /api/v1/suggestions — ajukan usulan topik (pengguna login, approved)
export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  try {
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const principal = auth.principal;

    const body = (await req.json()) as Record<string, unknown>;
    if (!body.topic || typeof body.topic !== 'string' || body.topic.trim().length < 5) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Topik minimal 5 karakter', { topic: 'terlalu pendek' }),
        requestId,
      );
    }
    if (!body.reason || typeof body.reason !== 'string' || body.reason.trim().length < 5) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Alasan wajib diisi', { reason: 'wajib diisi' }),
        requestId,
      );
    }
    if (!body.idempotencyKey || typeof body.idempotencyKey !== 'string') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'idempotency-key diperlukan', {
          idempotencyKey: 'wajib diisi',
        }),
        requestId,
      );
    }

    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    const suggestion = await service.submitSuggestion(principal, {
      topic: body.topic,
      reason: body.reason,
      sourcesNote: typeof body.sourcesNote === 'string' ? body.sourcesNote : undefined,
      idempotencyKey: body.idempotencyKey,
    });

    return successResponse(suggestion, requestId, { status: 201 });
  } catch (err) {
    if (err instanceof ArticleError) {
      const code = err.code === 'FORBIDDEN' ? 'ACCESS_DENIED' : 'VALIDATION_FAILED';
      return errorResponse(new ApiError(code as ApiError['code'], err.message), requestId);
    }
    return errorResponse(err, requestId);
  }
}

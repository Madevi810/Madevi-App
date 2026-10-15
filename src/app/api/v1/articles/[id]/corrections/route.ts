import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { ArticleService, ArticleError } from '@/services/article';

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/v1/articles/[id]/corrections — ajukan koreksi (pengguna login, approved)
export async function POST(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  const { id } = await params;
  try {
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const principal = auth.principal;

    const body = (await req.json()) as Record<string, unknown>;
    if (!body.locationHint || typeof body.locationHint !== 'string') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Lokasi masalah diperlukan', {
          locationHint: 'wajib diisi',
        }),
        requestId,
      );
    }
    if (!body.description || typeof body.description !== 'string' || body.description.length < 10) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Deskripsi minimal 10 karakter', {
          description: 'terlalu pendek',
        }),
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

    const correction = await service.submitCorrection(principal, id, {
      locationHint: body.locationHint,
      issueType: (typeof body.issueType === 'string' ? body.issueType : 'OTHER') as Parameters<
        ArticleService['submitCorrection']
      >[2]['issueType'],
      description: body.description,
      suggestion: typeof body.suggestion === 'string' ? body.suggestion : undefined,
      sourceReference: typeof body.sourceReference === 'string' ? body.sourceReference : undefined,
      idempotencyKey: body.idempotencyKey,
    });

    return successResponse(correction, requestId, { status: 201 });
  } catch (err) {
    if (err instanceof ArticleError)
      return errorResponse(
        new ApiError(err.code === 'FORBIDDEN' ? 'ACCESS_DENIED' : 'VALIDATION_FAILED', err.message),
        requestId,
      );
    return errorResponse(err, requestId);
  }
}

// POST /api/v1/suggestions — ajukan usulan topik (pengguna login, approved)
// Route terpisah di bawah

import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { ArticleService, ArticleError } from '@/services/article';
import type { ArticleStatus } from '@/services/article';

type RouteParams = { params: Promise<{ id: string }> };

const VALID_STATUSES: ArticleStatus[] = [
  'DRAFT',
  'AUTO_CHECK',
  'AWAITING_OWNER',
  'NEEDS_REVISION',
  'APPROVED',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
  'TRASH',
];

// POST /api/v1/articles/[id]/status — ubah lifecycle status (hanya Admin)
export async function POST(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  const { id } = await params;
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const principal = auth.principal;

    const body = (await req.json()) as { status?: string; scheduledAt?: string };
    if (!body.status || !VALID_STATUSES.includes(body.status as ArticleStatus)) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Status tidak valid', { status: 'nilai tidak dikenali' }),
        requestId,
      );
    }

    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    const article = await service.transitionStatus(principal, id, body.status as ArticleStatus, {
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
    });

    return successResponse(article, requestId);
  } catch (err) {
    if (err instanceof ArticleError)
      return errorResponse(
        new ApiError(
          err.code === 'NOT_FOUND'
            ? 'NOT_FOUND'
            : err.code === 'FORBIDDEN'
              ? 'ACCESS_DENIED'
              : 'VALIDATION_FAILED',
          err.message,
        ),
        requestId,
      );
    return errorResponse(err, requestId);
  }
}

// POST /api/v1/articles/[id]/check — jalankan auto-check (hanya Admin)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  const { id } = await params;
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const principal = auth.principal;

    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    const result = await service.runAutoCheck(principal, id);
    return successResponse(result, requestId);
  } catch (err) {
    if (err instanceof ArticleError)
      return errorResponse(new ApiError('ACCESS_DENIED', err.message), requestId);
    return errorResponse(err, requestId);
  }
}

import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { getSessionPrincipal } from '@/auth/session';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { ArticleService, ArticleError } from '@/services/article';
import type { AccessLevel, ArticleStatus, CreateArticleInput } from '@/services/article';

function mapArticleError(err: ArticleError): ApiError {
  const code =
    err.code === 'NOT_FOUND'
      ? 'NOT_FOUND'
      : err.code === 'FORBIDDEN'
        ? 'ACCESS_DENIED'
        : err.code === 'VALIDATION_FAILED'
          ? 'VALIDATION_FAILED'
          : err.code === 'INVALID_TRANSITION'
            ? 'VALIDATION_FAILED'
            : 'INTERNAL_ERROR';
  return new ApiError(code, err.message);
}

// POST /api/v1/articles — buat draf artikel baru (hanya Admin)
export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const principal = auth.principal;

    const body = (await req.json()) as CreateArticleInput & Record<string, unknown>;
    if (!body.title || typeof body.title !== 'string') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Judul diperlukan', { title: 'wajib diisi' }),
        requestId,
      );
    }
    if (!body.slug || typeof body.slug !== 'string') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Slug diperlukan', { slug: 'wajib diisi' }),
        requestId,
      );
    }

    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    const article = await service.createDraft(principal, {
      title: body.title,
      slug: body.slug,
      summary: typeof body.summary === 'string' ? body.summary : undefined,
      language: body.language === 'en' ? 'en' : 'id',
      readingMinutes: typeof body.readingMinutes === 'number' ? body.readingMinutes : undefined,
      creatorName: typeof body.creatorName === 'string' ? body.creatorName : undefined,
      creatorPrincipalId:
        typeof body.creatorPrincipalId === 'string' ? body.creatorPrincipalId : undefined,
      accessLevel: body.accessLevel === 'PUBLIC' ? 'PUBLIC' : 'MEMBER',
      isIndexed: typeof body.isIndexed === 'boolean' ? body.isIndexed : undefined,
      taxonomyNodeId: typeof body.taxonomyNodeId === 'string' ? body.taxonomyNodeId : undefined,
      ownerNotes: typeof body.ownerNotes === 'string' ? body.ownerNotes : undefined,
      attributionType: body.attributionType as CreateArticleInput['attributionType'],
      isTest: body.isTest === true,
    });

    if (typeof body.body === 'string' && body.body.trim()) {
      await service.upsertBlock(principal, article.id, {
        blockType: 'PARAGRAPH',
        position: 0,
        content: { text: body.body.trim() },
      });
    }

    return successResponse(article, requestId, { status: 201 });
  } catch (err) {
    if (err instanceof ArticleError) return errorResponse(mapArticleError(err), requestId);
    return errorResponse(err, requestId);
  }
}

// GET /api/v1/articles — list artikel dengan cursor pagination
export async function GET(req: NextRequest) {
  const requestId = randomUUID();
  try {
    const principal = await getSessionPrincipal(req);
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor') ?? undefined;
    const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 100);
    const status = searchParams.get('status') ?? undefined;
    const accessLevel = searchParams.get('accessLevel') ?? undefined;
    const taxonomyNodeId = searchParams.get('taxonomyNodeId') ?? undefined;

    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    const result = await service.listArticles(principal, {
      cursor,
      limit,
      status: status as ArticleStatus | undefined,
      accessLevel: accessLevel as AccessLevel | undefined,
      taxonomyNodeId,
    });

    return successResponse(result.items, requestId, {
      page: { nextCursor: result.nextCursor, limit },
    });
  } catch (err) {
    if (err instanceof ArticleError) return errorResponse(mapArticleError(err), requestId);
    return errorResponse(err, requestId);
  }
}

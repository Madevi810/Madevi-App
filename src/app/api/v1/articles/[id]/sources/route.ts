import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getSessionPrincipal } from '@/auth/session';
import { ArticleService, ArticleError } from '@/services/article';

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/v1/articles/[id]/sources — tambah sumber (hanya Admin)
export async function POST(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  const { id } = await params;
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const principal = auth.principal;

    const body = (await req.json()) as Record<string, unknown>;
    if (!body.title || typeof body.title !== 'string') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Judul sumber diperlukan', { title: 'wajib diisi' }),
        requestId,
      );
    }
    if (!body.authorOrOrg || typeof body.authorOrOrg !== 'string') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Penulis/lembaga diperlukan', {
          authorOrOrg: 'wajib diisi',
        }),
        requestId,
      );
    }

    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    const source = await service.addSource(principal, id, {
      position: typeof body.position === 'number' ? body.position : 0,
      title: body.title,
      authorOrOrg: body.authorOrOrg as string,
      publisher: typeof body.publisher === 'string' ? body.publisher : '',
      publicationDate: typeof body.publicationDate === 'string' ? body.publicationDate : null,
      accessedDate: typeof body.accessedDate === 'string' ? body.accessedDate : null,
      url: typeof body.url === 'string' ? body.url : null,
      isbn: typeof body.isbn === 'string' ? body.isbn : null,
      doi: typeof body.doi === 'string' ? body.doi : null,
      documentNumber: typeof body.documentNumber === 'string' ? body.documentNumber : null,
      sectionReference: typeof body.sectionReference === 'string' ? body.sectionReference : '',
      mediaLicense: typeof body.mediaLicense === 'string' ? body.mediaLicense : '',
      sourceType: (typeof body.sourceType === 'string' ? body.sourceType : 'WEBSITE') as Parameters<
        ArticleService['addSource']
      >[2]['sourceType'],
      linkStatus: 'ACTIVE',
      isPrimary: body.isPrimary === true,
    });

    return successResponse(source, requestId, { status: 201 });
  } catch (err) {
    if (err instanceof ArticleError)
      return errorResponse(
        new ApiError(err.code === 'FORBIDDEN' ? 'ACCESS_DENIED' : 'VALIDATION_FAILED', err.message),
        requestId,
      );
    return errorResponse(err, requestId);
  }
}

// GET /api/v1/articles/[id]/sources — list sumber artikel
export async function GET(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  const { id } = await params;
  try {
    const principal = await getSessionPrincipal(req);
    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    const { sources } = await service.getArticle(principal, id);
    return successResponse(sources, requestId);
  } catch (err) {
    if (err instanceof ArticleError)
      return errorResponse(
        new ApiError(err.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'ACCESS_DENIED', err.message),
        requestId,
      );
    return errorResponse(err, requestId);
  }
}

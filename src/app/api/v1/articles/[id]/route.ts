import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { getSessionPrincipal } from '@/auth/session';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { ArticleService, ArticleError } from '@/services/article';
import type { UpdateArticleInput } from '@/services/article';

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
            : err.code === 'ACCESS_DENIED'
              ? 'ACCESS_DENIED'
              : 'INTERNAL_ERROR';
  return new ApiError(code, err.message);
}

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/v1/articles/[id] — baca artikel (dengan policy cek)
// Hanya judul yang dikirim ke guest jika body terkunci; body lengkap hanya jika hak akses valid.
export async function GET(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  const { id } = await params;
  try {
    const principal = await getSessionPrincipal(req);
    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    try {
      const result = await service.getArticle(principal, id);
      const article = result.article;
      const breadcrumb = article.taxonomy_node_id
        ? await pool
            .query<{ id: string; name: string; path_slug: string; level: string }>(
              `WITH RECURSIVE ancestors AS (
               SELECT n.node_id, n.parent_id, n.name, n.path_slug, n.level, 0 AS distance
                 FROM "${schema}".taxonomy_nodes n
                 JOIN "${schema}".taxonomy_state s ON s.active_revision_id = n.revision_id
                WHERE n.node_id = $1
               UNION ALL
               SELECT parent.node_id, parent.parent_id, parent.name, parent.path_slug, parent.level, ancestors.distance + 1
                 FROM "${schema}".taxonomy_nodes parent
                 JOIN ancestors ON ancestors.parent_id = parent.node_id
                 JOIN "${schema}".taxonomy_state s ON s.active_revision_id = parent.revision_id
             )
             SELECT node_id AS id, name, path_slug, level FROM ancestors ORDER BY distance DESC`,
              [article.taxonomy_node_id],
            )
            .then((result) => result.rows)
        : [];
      const isOwner = principal?.role === 'OWNER';
      const hasFull =
        isOwner ||
        article.access_level === 'PUBLIC' ||
        (principal?.approvalStatus === 'APPROVED' && principal.entitlementStatus !== 'NONE');
      if (!hasFull) {
        const metadata = await service.getPublicMetadata(id);
        return successResponse(
          { ...metadata, blocks: [], sources: [], bodyLocked: true },
          requestId,
        );
      }
      const publicArticle = Object.fromEntries(
        Object.entries(article).filter(
          ([key]) => !['owner_notes', 'created_by', 'updated_by'].includes(key),
        ),
      );
      return successResponse(
        {
          ...publicArticle,
          blocks: result.blocks,
          sources: result.sources,
          taxonomyBreadcrumb: breadcrumb,
          bodyLocked: false,
        },
        requestId,
      );
    } catch (error) {
      if (!(error instanceof ArticleError) || error.code !== 'ACCESS_DENIED') throw error;
      const metadata = await service.getPublicMetadata(id);
      return successResponse({ ...metadata, blocks: [], sources: [], bodyLocked: true }, requestId);
    }
  } catch (err) {
    if (err instanceof ArticleError) return errorResponse(mapArticleError(err), requestId);
    return errorResponse(err, requestId);
  }
}

// PATCH /api/v1/articles/[id] — update metadata (hanya Admin)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  const { id } = await params;
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const principal = auth.principal;

    const body = (await req.json()) as UpdateArticleInput & Record<string, unknown>;
    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const service = new ArticleService(pool, schema);

    const article = await service.updateArticle(principal, id, {
      title: typeof body.title === 'string' ? body.title : undefined,
      slug: typeof body.slug === 'string' ? body.slug : undefined,
      summary: typeof body.summary === 'string' ? body.summary : undefined,
      language: body.language === 'en' ? 'en' : body.language === 'id' ? 'id' : undefined,
      readingMinutes: typeof body.readingMinutes === 'number' ? body.readingMinutes : undefined,
      creatorName:
        typeof body.creatorName === 'string'
          ? body.creatorName
          : body.creatorName === null
            ? null
            : undefined,
      accessLevel:
        body.accessLevel === 'PUBLIC'
          ? 'PUBLIC'
          : body.accessLevel === 'MEMBER'
            ? 'MEMBER'
            : undefined,
      isIndexed: typeof body.isIndexed === 'boolean' ? body.isIndexed : undefined,
      ownerNotes: typeof body.ownerNotes === 'string' ? body.ownerNotes : undefined,
      taxonomyNodeId: typeof body.taxonomyNodeId === 'string' ? body.taxonomyNodeId : undefined,
    });

    return successResponse(article, requestId);
  } catch (err) {
    if (err instanceof ArticleError) return errorResponse(mapArticleError(err), requestId);
    return errorResponse(err, requestId);
  }
}

// POST /api/v1/articles/[id]/status — ubah lifecycle status (hanya Admin)
// Body: { status: ArticleStatus, scheduledAt?: string }
// Diakses via: POST /api/v1/articles/[id]/status — route terpisah ada di sub-route

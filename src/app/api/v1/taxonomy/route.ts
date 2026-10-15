import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { requestIdFromHeaders } from '@/server/request-id';
import { TaxonomyService } from '@/services/taxonomy';

// GET /api/v1/taxonomy?path=...&q=...&cursor=...&limit=20
// Publik: dipakai category-browser, owner-taxonomy-panel, taxonomy-page (slug).
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') ?? searchParams.get('slug') ?? undefined;
    const query = searchParams.get('q') ?? searchParams.get('query') ?? undefined;
    const cursor = searchParams.get('cursor') ?? undefined;
    const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 100);

    const service = new TaxonomyService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.browse({
      path: path ?? undefined,
      query: query ?? undefined,
      limit: Number.isSafeInteger(limit) && limit > 0 ? limit : 20,
      cursor: cursor ?? undefined,
    });

    return successResponse(result, requestId);
  } catch (err) {
    return errorResponse(err, requestId);
  }
}

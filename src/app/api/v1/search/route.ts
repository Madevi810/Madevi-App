import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { searchService, currentPrincipal } from '@/app/api/v1/ai/route-utils';
import { SearchError } from '@/services/search';
import { requestIdFromHeaders } from '@/server/request-id';

import type { SearchEntryType } from '@/services/search';
import type { SearchSpaceKey } from '@/contracts/search';

const ALLOWED_TYPES: SearchEntryType[] = [
  'MENU',
  'ARTICLE',
  'PROFILE',
  'SOFTWARE',
  'PAGE',
  'SERVICE',
  'PRODUCT',
  'POST',
];

const ALLOWED_SPACES: SearchSpaceKey[] = [
  'explore',
  'tutorial',
  'school',
  'line',
  'services',
  'shop',
  'tools',
];

// GET /api/v1/search?q=...&category=ARTICLE&space=explore&cursor=...&limit=20
// L06: satu kontrak hasil bertipe + filter ruang + targetHref tervalidasi server.
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const principal = await currentPrincipal(request);
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';
    const raw = searchParams.get('category')?.split(',') ?? [];
    const categories = raw.filter((c) =>
      ALLOWED_TYPES.includes(c as SearchEntryType),
    ) as SearchEntryType[];
    const rawSpace =
      searchParams.get('space')?.split(',') ??
      searchParams.get('spaces')?.split(',') ??
      [];
    const spaces = rawSpace.filter((s) =>
      (ALLOWED_SPACES as string[]).includes(s),
    ) as SearchSpaceKey[];
    const cursor = searchParams.get('cursor') ?? undefined;
    const rawLimit = Number(searchParams.get('limit') ?? '20');
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 20;

    const result = await searchService().search(principal, {
      query: q,
      categories: categories.length ? categories : undefined,
      spaces: spaces.length ? spaces : undefined,
      cursor,
      limit,
    });

    return successResponse(result.items, requestId, {
      page: { nextCursor: result.nextCursor, limit },
    });
  } catch (err) {
    if (err instanceof SearchError) {
      return errorResponse(new ApiError('VALIDATION_FAILED', err.message), requestId);
    }
    return errorResponse(err, requestId);
  }
}

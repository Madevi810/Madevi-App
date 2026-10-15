import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { requestIdFromHeaders } from '@/server/request-id';
import { BundleService } from '@/services/bundle';

export const dynamic = 'force-dynamic';

function bundleService() {
  return new BundleService(getDatabaseClients().pool, getDatabaseSchema());
}

/**
 * POST /api/v1/ebelanja/bundles/[id]/join — gabung bundel terbuka (member).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const item = (body.item ?? {}) as {
      name?: unknown;
      price?: unknown;
      link?: unknown;
    };
    const data = await bundleService().joinBundle(auth.principal.id, id, {
      name: requiredText(item.name, 'item.name', { minimum: 2, maximum: 200 }),
      price: typeof item.price === 'number' && Number.isFinite(item.price) ? item.price : 0,
      link: requiredText(item.link, 'item.link', { minimum: 8, maximum: 2000 }),
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

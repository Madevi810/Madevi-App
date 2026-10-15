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

/** GET /api/v1/ebelanja/bundles — daftar bundel (publik, tamu boleh melihat). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city') ?? undefined;
    const status = url.searchParams.get('status') ?? undefined;
    // Viewer login untuk menandai keanggotaan; tamu tetap boleh melihat.
    let viewerId: string | null = null;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      viewerId = auth.principal.id;
    } catch {
      viewerId = null;
    }
    const data = await bundleService().listBundles(viewerId, { city, status });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** POST /api/v1/ebelanja/bundles — bentuk bundel baru (member). */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const item = (body.item ?? {}) as {
      name?: unknown;
      price?: unknown;
      link?: unknown;
    };
    const data = await bundleService().createBundle(auth.principal.id, {
      city: requiredText(body.city, 'city'),
      item: {
        name: requiredText(item.name, 'item.name', { minimum: 2, maximum: 200 }),
        price: typeof item.price === 'number' && Number.isFinite(item.price) ? item.price : 0,
        link: requiredText(item.link, 'item.link', { minimum: 8, maximum: 2000 }),
      },
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

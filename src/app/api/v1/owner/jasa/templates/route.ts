import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

const service = () => new JasaService(getDatabaseClients().pool);

/** GET /api/v1/owner/jasa/templates — daftar semua template (Admin) */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER', { humanActivity: true });
    return successResponse(await service().listAllTemplates(), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** POST /api/v1/owner/jasa/templates — tambah template (status DRAFT) */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request, 128 * 1024);
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!slug || !name) {
      return errorResponse(new Error('Slug dan nama wajib diisi.'), requestId);
    }
    const formats = Array.isArray(body.formats)
      ? body.formats.filter((f) => f === 'ONLINE' || f === 'PRINT' || f === 'BOTH')
      : undefined;
    const created = await service().createTemplate({
      slug,
      name,
      description: typeof body.description === 'string' ? body.description : '',
      formats: formats && formats.length ? formats : undefined,
      priceStartsFrom: typeof body.priceStartsFrom === 'number' ? body.priceStartsFrom : 0,
      currency: typeof body.currency === 'string' ? body.currency : 'IDR',
      coverImageUrl: typeof body.coverImageUrl === 'string' ? body.coverImageUrl : '',
      previewUrl: typeof body.previewUrl === 'string' ? body.previewUrl : '',
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
    });
    return successResponse(created, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

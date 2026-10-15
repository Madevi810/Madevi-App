import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

/** PATCH /api/v1/owner/jasa/templates/[id] — edit template */
export async function PATCH(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const { id } = await context.params;
    const body = await parseJsonObject(request, 128 * 1024);
    const result = await new JasaService(getDatabaseClients().pool).updateTemplate(id, {
      name: typeof body.name === 'string' ? body.name : undefined,
      description: typeof body.description === 'string' ? body.description : undefined,
      formats: Array.isArray(body.formats)
        ? body.formats.filter((f) => f === 'ONLINE' || f === 'PRINT' || f === 'BOTH')
        : undefined,
      priceStartsFrom: typeof body.priceStartsFrom === 'number' ? body.priceStartsFrom : undefined,
      coverImageUrl: typeof body.coverImageUrl === 'string' ? body.coverImageUrl : undefined,
      previewUrl: typeof body.previewUrl === 'string' ? body.previewUrl : undefined,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
    });
    if (!result.updated)
      return errorResponse(new Error('Tidak ada perubahan / tidak ditemukan.'), requestId);
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** PUT /api/v1/owner/jasa/templates/[id]?status=PUBLISHED — terbit/arsip/draft */
export async function PUT(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const { id } = await context.params;
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    if (status !== 'DRAFT' && status !== 'PUBLISHED' && status !== 'ARCHIVED') {
      return errorResponse(new Error('Status tidak valid.'), requestId);
    }
    const result = await new JasaService(getDatabaseClients().pool).setTemplateLifecycle(
      id,
      status,
    );
    if (!result.updated) return errorResponse(new Error('Template tidak ditemukan.'), requestId);
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

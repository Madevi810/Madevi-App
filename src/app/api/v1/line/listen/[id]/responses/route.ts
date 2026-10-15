import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { listenService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { ApiError } from '@/api/errors';
import type { ListenResponseKind } from '@/services/listen';

export const dynamic = 'force-dynamic';

/** GET /api/v1/line/listen/[id] — detail sesi + respons pendengar. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const data = await listenService().readSession(id, null);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * POST /api/v1/line/listen/[id]/responses — kirim respons pendengar.
 *
 * Body: { kind: 'REFLEKSI' | 'SEMANGAT' | 'SARAN', body: string }.
 * kind SARAN ditolak selama pembicara belum mengaktifkan "Saya butuh saran".
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
    const kind = requiredText(body.kind, 'kind') as ListenResponseKind;
    if (kind !== 'REFLEKSI' && kind !== 'SEMANGAT' && kind !== 'SARAN') {
      throw new ApiError('VALIDATION_FAILED', 'kind harus REFLEKSI/SEMANGAT/SARAN');
    }
    const data = await listenService().submitResponse(auth.principal, id, kind, requiredText(body.body, 'body'));
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

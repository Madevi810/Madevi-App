import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { sidangService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { ApiError } from '@/api/errors';
import type { SidangArgumentKind } from '@/services/sidang';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/line/sidang/[id]/arguments — tambah argumen.
 *
 * Body: { kind: 'TANYA' | 'JAWAB' | 'SANGGAH' | 'DUKUNG', body: string }.
 * Kind yang diperbolehkan tergantung fase aktif (dipaksa server-side).
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
    const kind = requiredText(body.kind, 'kind') as SidangArgumentKind;
    const validKinds: SidangArgumentKind[] = ['TANYA', 'JAWAB', 'SANGGAH', 'DUKUNG'];
    if (!validKinds.includes(kind)) {
      throw new ApiError('VALIDATION_FAILED', 'kind tidak valid');
    }
    const data = await sidangService().addArgument(
      auth.principal,
      id,
      kind,
      requiredText(body.body, 'body'),
    );
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { softwareService } from '@/app/api/v1/software/route-utils';

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Params) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { slug } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const software = await softwareService().getByIdOrSlug(auth.principal, slug);
    const body = (await request.json()) as { kind?: string; description?: string };
    if (!body.kind || !['MALWARE', 'DAMAGED', 'LICENSE'].includes(body.kind)) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Jenis laporan tidak valid'),
        requestId,
      );
    }
    await softwareService().report(auth.principal, {
      softwareId: software.id,
      kind: body.kind as 'MALWARE' | 'DAMAGED' | 'LICENSE',
      description: typeof body.description === 'string' ? body.description.slice(0, 2000) : '',
    });
    return successResponse({ ok: true }, requestId, { status: 201 });
  } catch (err) {
    return errorResponse(err, requestId);
  }
}

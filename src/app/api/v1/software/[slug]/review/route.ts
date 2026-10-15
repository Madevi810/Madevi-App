import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { softwareService } from '@/app/api/v1/software/route-utils';

type Params = { params: Promise<{ slug: string }> };

// POST /api/v1/software/[slug]/review — rating/ulasan (login).
export async function POST(request: Request, { params }: Params) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { slug } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const software = await softwareService().getByIdOrSlug(auth.principal, slug);
    const body = (await request.json()) as { rating?: number; reviewText?: string };
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Rating 1–5'), requestId);
    }
    await softwareService().review(auth.principal, {
      softwareId: software.id,
      rating: body.rating,
      reviewText: body.reviewText,
    });
    return successResponse({ ok: true }, requestId, { status: 201 });
  } catch (err) {
    return errorResponse(err, requestId);
  }
}

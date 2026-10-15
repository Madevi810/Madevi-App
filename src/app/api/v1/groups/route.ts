import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { childAudience, socialService, stringValue } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // L05 G-08: teruskan viewer opsional agar membershipStatus terisi;
    // direktori tetap metadata minimal grup APPROVED untuk tamu.
    let viewer = null;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      viewer = auth.principal;
    } catch {
      viewer = null;
    }
    return successResponse(await socialService().listGroups(viewer), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    return successResponse(
      await socialService().createGroup(auth.principal, {
        name: requiredText(body.name, 'name', { minimum: 3, maximum: 160 }),
        description: stringValue(body.description),
        audiencePolicy: childAudience(body.audiencePolicy),
      }),
      requestId,
      { status: 202 },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

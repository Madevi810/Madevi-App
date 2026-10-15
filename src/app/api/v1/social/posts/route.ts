import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, parseLimit } from '@/api/validation';
import {
  childAudience,
  socialService,
  stringArray,
  stringValue,
} from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    let principalId: string | undefined;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      principalId = auth.principal.id;
    } catch {
      // Guest or unauthenticated viewer
    }
    const data = await socialService().listFeed({
      cursor: url.searchParams.get('cursor') ?? undefined,
      limit: parseLimit(url.searchParams.get('limit')),
      groupId: url.searchParams.get('groupId') ?? undefined,
      principalId,
    });
    return successResponse(data.items, requestId, {
      page: { nextCursor: data.nextCursor, limit: parseLimit(url.searchParams.get('limit')) },
    });
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
    const data = await socialService().createPost(auth.principal, {
      body: stringValue(body.body),
      linkUrl: stringValue(body.linkUrl),
      attachmentIds: stringArray(body.attachmentIds),
      groupId: stringValue(body.groupId),
      audiencePolicy: childAudience(body.audiencePolicy),
      postType: body.postType === 'CURHAT' ? 'CURHAT' : 'KARYA',
      anonymous: body.anonymous === true,
    });
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

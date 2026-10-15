import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const data = await accountsService().listOwnerInbox(auth.principal);
    return successResponse(data, requestId);
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
    const kind = body.kind === 'APPEAL' || body.kind === 'RECOVERY' ? body.kind : 'REPORT';
    const data = await accountsService().submitOwnerInbox({
      principal: auth.principal,
      kind,
      subject: bodyText(body, 'subject', 180),
      body: bodyText(body, 'body', 4000),
    });
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

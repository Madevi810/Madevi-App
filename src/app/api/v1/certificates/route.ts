import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { assertSchoolAccess, examService } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    await assertSchoolAccess(auth.principal.id);
    const body = await parseJsonObject(request);
    const data = await examService().issueCertificate(
      auth.principal,
      requiredText(body.pathId, 'pathId', { maximum: 80 }),
    );
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

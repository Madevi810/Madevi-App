import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { assertSchoolAccess, examService } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; articleId: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    await assertSchoolAccess(auth.principal.id);
    const { id, articleId } = await params;
    const data = await examService().markArticleRead(auth.principal, id, articleId);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { assertSchoolAccess, examService } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    await assertSchoolAccess(auth.principal.id);
    const { id } = await params;
    return successResponse(await examService().restartLearningCycle(auth.principal, id), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

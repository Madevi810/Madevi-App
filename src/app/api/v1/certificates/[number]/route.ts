import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { assertRequestCsrf } from '@/auth/http';
import { authenticateMemberOrOwner, examService } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request, { params }: { params: Promise<{ number: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateMemberOrOwner(request);
    const { number } = await params;
    return successResponse(
      await examService().verifyCertificate(auth.principal, number),
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ number: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateMemberOrOwner(request);
    if (auth.audience !== 'OWNER')
      throw new ApiError('ACCESS_DENIED', 'Hanya Admin yang diizinkan');
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (body.status !== 'REPLACED' && body.status !== 'REVOKED') {
      throw new ApiError('VALIDATION_FAILED', 'Status sertifikat tidak valid');
    }
    const { number } = await params;
    const data = await examService().changeCertificateStatus(auth.principal, number, {
      status: body.status,
      reason: requiredText(body.reason, 'reason', { minimum: 5, maximum: 1_000 }),
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

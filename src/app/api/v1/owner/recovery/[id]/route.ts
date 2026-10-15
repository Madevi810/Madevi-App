import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { accountsService } from '@/app/api/v1/auth/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (!['VERIFIED_CONTACT', 'ACTIVE_DEVICE', 'RECOVERY_CODE'].includes(String(body.proofKind))) {
      throw new ApiError('VALIDATION_FAILED', 'Bukti pemulihan tidak valid');
    }
    const { id } = await params;
    const data = await accountsService().verifyRecoveryProof(
      auth.principal,
      id,
      body.proofKind as 'VERIFIED_CONTACT' | 'ACTIVE_DEVICE' | 'RECOVERY_CODE',
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

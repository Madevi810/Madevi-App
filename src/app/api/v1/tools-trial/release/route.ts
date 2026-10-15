import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * Lepaskan reservasi trial tanpa mengurangi counter (P06 / kontrak 05).
 * Dipakai saat eksekusi Tools gagal/divalidasi gagal/dibatalkan, sehingga
 * kesalahan teknis tidak memakan jatah pengguna.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await accountsService().releaseToolsTrial(
      auth.principal,
      bodyText(body, 'idempotencyKey', 120),
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

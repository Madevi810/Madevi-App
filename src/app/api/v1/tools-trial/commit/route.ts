import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * Konfirmasi pemakaian trial SETELAH hasil sukses (P06 / kontrak 05).
 * Mengurangi sisa counter secara atomik; commit ulang dengan key sama tidak
 * mengurangi dua kali.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await accountsService().commitToolsTrial(auth.principal, {
      toolKind: bodyText(body, 'toolKind', 64),
      idempotencyKey: bodyText(body, 'idempotencyKey', 120),
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

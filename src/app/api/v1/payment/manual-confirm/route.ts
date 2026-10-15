import { createHmac, timingSafeEqual } from 'node:crypto';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { getPool } from '@/db/pool';
import { PaymentService } from '@/services/payment';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(req: Request) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const body = (await req.json()) as { orderId?: unknown; providerEventId?: unknown };
    if (typeof body.orderId !== 'string' || typeof body.providerEventId !== 'string') {
      throw new ApiError('VALIDATION_FAILED', 'orderId dan providerEventId wajib diisi');
    }
    assertManualSignature(req, body.orderId, body.providerEventId);
    const pool = await getPool();
    const service = new PaymentService(pool);
    const result = await service.handleManualConfirmation(body.orderId, body.providerEventId);
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

function assertManualSignature(request: Request, orderId: string, providerEventId: string) {
  const secret = process.env.PAYMENT_MANUAL_CONFIRM_SECRET;
  if (!secret) {
    throw new ApiError('DEPENDENCY_UNAVAILABLE', 'Secret konfirmasi manual belum dikonfigurasi');
  }
  const supplied = request.headers.get('x-madevi-manual-signature');
  if (!supplied || !/^[0-9a-f]{64}$/i.test(supplied)) {
    throw new ApiError('ACCESS_DENIED', 'Signature konfirmasi manual tidak valid');
  }
  const expected = createHmac('sha256', secret)
    .update(`${orderId}.${providerEventId}`)
    .digest('hex');
  const suppliedBytes = Buffer.from(supplied, 'hex');
  const expectedBytes = Buffer.from(expected, 'hex');
  if (
    suppliedBytes.length !== expectedBytes.length ||
    !timingSafeEqual(suppliedBytes, expectedBytes)
  ) {
    throw new ApiError('ACCESS_DENIED', 'Signature konfirmasi manual tidak valid');
  }
}

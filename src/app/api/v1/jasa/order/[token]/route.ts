import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { requestIdFromHeaders } from '@/server/request-id';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ token: string }> };

/**
 * GET /api/v1/jasa/order/[token] — status order custom/PCB melalui token privat.
 * Response sengaja tidak memuat brief mentah, URL file, atau secret token itu sendiri.
 */
export async function GET(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { token } = await context.params;
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return errorResponse(new ApiError('NOT_FOUND', 'Order tidak ditemukan.'), requestId);
    }
    const order = await new JasaService(getDatabaseClients().pool).getServiceOrder(token);
    if (!order)
      return errorResponse(new ApiError('NOT_FOUND', 'Order tidak ditemukan.'), requestId);

    return successResponse(
      {
        id: order.id,
        kind: order.kind,
        status: order.status,
        revisionCount: order.revisionCount,
        revisionLimit: order.revisionLimit,
        priceSnapshot: {
          serviceTitle: order.priceSnapshot?.serviceTitle ?? '',
          snapshotPrice: order.priceSnapshot?.snapshotPrice ?? 0,
          currency: order.priceSnapshot?.currency ?? 'IDR',
          pricingStatus: order.priceSnapshot?.pricingStatus ?? 'QUOTE_PENDING',
        },
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        completedAt: order.completedAt,
      },
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

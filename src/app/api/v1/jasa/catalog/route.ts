import { errorResponse, successResponse } from '@/api/response';
import { requestIdFromHeaders } from '@/server/request-id';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/jasa/catalog — item katalog terbit (publik).
 * Sumber tunggal preview + snapshot order (L04 AC1/AC2).
 * Harga 0 berarti Gratis; tidak ada harga "belum ditetapkan".
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const items = await new JasaService(getDatabaseClients().pool).listPublishedCatalogItems();
    return successResponse(items, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

import { errorResponse, successResponse } from '@/api/response';
import { authenticateAdmin } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { AdminService } from '@/services/admin';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * L07 AC-02: capability dashboard dari server — hanya layanan nyata.
 * Tidak ada dua array menu/kartu palsu; unavailable disembunyikan jujur.
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateAdmin(request, { humanActivity: true });
    const service = new AdminService(getDatabaseClients().pool, getDatabaseSchema());
    const caps = await service.getCapabilities();
    return successResponse(caps, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

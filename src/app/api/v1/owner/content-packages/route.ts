import { errorResponse, successResponse } from '@/api/response';
import { requestIdFromHeaders } from '@/server/request-id';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { RuntimeContentPackageService } from '@/services/runtime-content';

export const dynamic = 'force-dynamic';

/**
 * L06: panel Admin membaca tabel runtime_content_packages yang sama dengan
 * runtime menu. DTO metadata/storage sama; draft tidak dipromosikan di sini
 * (promosi hanya L08/Admin). Baris tidak valid dilaporkan sebagai invalid,
 * bukan disembunyikan.
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const service = new RuntimeContentPackageService(
      getDatabaseClients().pool,
      getDatabaseSchema(),
    );
    const { valid, invalid } = await service.listPackages();
    return successResponse({ packages: valid, invalid }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

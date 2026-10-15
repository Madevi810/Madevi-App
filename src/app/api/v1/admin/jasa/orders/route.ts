import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { authenticateAdmin } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

type JasaKind = 'UNDANGAN' | 'LOGO' | 'SERVICE';

const KNOWN_KINDS: ReadonlySet<JasaKind> = new Set(['UNDANGAN', 'LOGO', 'SERVICE']);

/**
 * L04 / JASA-API-001: daftar order per kind untuk panel Owner Jasa. Sebelumnya panel
 * memanggil route ini padahal tidak ada, sehingga ketiga daftar diam-diam memuat array
 * kosong. Lapisan service sudah ada; route inilah yang hilang.
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateAdmin(request, { humanActivity: true });
    const url = new URL(request.url);
    const kind = url.searchParams.get('kind');

    if (!kind || !KNOWN_KINDS.has(kind as JasaKind)) {
      throw new ApiError(
        'VALIDATION_FAILED',
        "Query 'kind' wajib salah satu dari: UNDANGAN, LOGO, SERVICE.",
        { kind: 'UNDANGAN | LOGO | SERVICE' },
      );
    }

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const rows =
      kind === 'UNDANGAN'
        ? await service.listAllInvitationOrders()
        : kind === 'LOGO'
          ? await service.listAllLogoOrders()
          : await service.listAllServiceOrders();
    return successResponse(rows, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

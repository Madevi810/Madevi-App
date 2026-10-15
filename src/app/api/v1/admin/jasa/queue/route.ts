import { errorResponse, successResponse } from '@/api/response';
import { authenticateAdmin } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateAdmin(request, { humanActivity: true });
    const url = new URL(request.url);
    const urgency = url.searchParams.get('urgency') as 'HIGH' | 'MEDIUM' | 'NORMAL' | undefined;
    const waitingOn = url.searchParams.get('waitingOn') as 'ADMIN' | 'USER' | 'NONE' | undefined;
    const kind = url.searchParams.get('kind') as 'UNDANGAN' | 'LOGO' | 'LAYOUT' | 'CUSTOM_DESIGN' | 'PCB_LAYOUT' | undefined;

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const queue = await service.adminQueue({ urgency, waitingOn, kind });
    return successResponse(queue, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

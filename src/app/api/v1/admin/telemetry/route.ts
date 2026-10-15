import { errorResponse, successResponse } from '@/api/response';
import { authenticateAdmin } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { TelemetryService } from '@/services/telemetry';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateAdmin(request, { humanActivity: true });

    const url = new URL(request.url);
    const hoursParam = url.searchParams.get('hours');
    const hours = hoursParam ? parseInt(hoursParam, 10) : 24;

    const service = new TelemetryService(getDatabaseClients().pool, getDatabaseSchema());
    const data = await service.getAnalyticsSummary(hours);

    return successResponse({
      timeRangeHours: hours,
      summary: data,
    }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

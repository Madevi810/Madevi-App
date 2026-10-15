import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ token: string }> };

const service = () => new JasaService(getDatabaseClients().pool);

/** GET /api/v1/jasa/undangan/order/[token] — akses private via secret token */
export async function GET(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { token } = await context.params;
    const order = await service().getInvitationOrderByToken(token);
    if (!order) return errorResponse(new Error('Order tidak ditemukan.'), requestId);
    // P11: jangan kembalikan kolom internal (secret_token, dsb.) ke klien.
    const { secret_token, ...publicOrder } = order as Record<string, unknown>;
    void secret_token;
    return successResponse(publicOrder, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * PATCH /api/v1/jasa/undangan/order/[token] — form private (setelah persetujuan)
 * Bukan CSRF sesi member: secret token ITU SENDIRI adalah kredensial.
 */
export async function PATCH(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { token } = await context.params;
    const body = await parseJsonObject(request, 128 * 1024);
    const rawDate = typeof body.eventDate === 'string' ? body.eventDate : undefined;
    const eventDate = rawDate ? new Date(rawDate) : undefined;
    const result = await service().updateInvitationOrderByToken(token, {
      groomName: typeof body.groomName === 'string' ? body.groomName.trim() : undefined,
      brideName: typeof body.brideName === 'string' ? body.brideName.trim() : undefined,
      eventDate: eventDate && !Number.isNaN(eventDate.getTime()) ? eventDate : undefined,
      venue: typeof body.venue === 'string' ? body.venue : undefined,
      city: typeof body.city === 'string' ? body.city : undefined,
      note: typeof body.note === 'string' ? body.note : undefined,
    });
    if (!result.updated) {
      return errorResponse(new Error(result.reason ?? 'Tidak dapat memperbarui.'), requestId);
    }
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

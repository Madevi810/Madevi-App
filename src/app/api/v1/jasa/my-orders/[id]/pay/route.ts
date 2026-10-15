import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';
import { withProtection } from '@/api/with-protection';

async function handler(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const session = await authenticateRequest(request, 'USER');
    const { id } = await context.params;
    const body = await request.json();
    const { kind } = body as { kind: 'UNDANGAN' | 'LOGO' | 'SERVICE' };

    if (!kind) {
      throw new Error('Kami memerlukan jenis layanan (kind) untuk memproses persetujuan Anda.');
    }

    const pool = getDatabaseClients().pool;
    const schema = getDatabaseSchema();
    const service = new JasaService(pool, schema);
    const order = await service.getMyServiceOrder(session.principal.id, id);
    
    if (!order) {
      return errorResponse(new ApiError('NOT_FOUND', 'Pesanan tidak ditemukan atau tautan ini bukan milik Anda.'), requestId);
    }
    
    if (order.status !== 'APPROVED') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', `Maaf, pesanan ini sedang dalam status '${order.status}'. Persetujuan penawaran hanya bisa dilakukan saat statusnya 'APPROVED'.`), 
        requestId
      );
    }

    const snapshotPrice = order.priceSnapshot?.snapshotPrice;
    const pricingStatus = order.priceSnapshot?.pricingStatus;
    
    if (pricingStatus === 'QUOTE_PENDING' || typeof snapshotPrice !== 'number') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Kami belum menerbitkan rincian biaya resmi untuk pesanan ini. Mohon tunggu tim kami meninjaunya terlebih dahulu.'),
        requestId
      );
    }
    
    let result;
    if (kind === 'UNDANGAN') {
      result = await service.transitionInvitationOrder(id, 'IN_REVISION');
    } else if (kind === 'LOGO') {
      result = await service.transitionLogoOrder(id, 'IN_REVISION');
    } else {
      result = await service.transitionServiceOrder(id, 'IN_REVISION', { actor: session.principal.id });
    }

    if (!result.transitioned) {
      return errorResponse(new ApiError('VALIDATION_FAILED', result.reason || 'Sistem kami gagal memproses persetujuan Anda. Silakan coba beberapa saat lagi.'), requestId);
    }

    const isFree = snapshotPrice === 0;
    const msg = isFree 
      ? 'Penawaran gratis telah Anda terima. Tim kami akan segera memulai proses pengerjaan (Revisi pertama).'
      : `Penawaran senilai Rp${snapshotPrice.toLocaleString('id-ID')} telah disetujui. Tim kami akan segera memulai pengerjaan desain Anda.`;

    return successResponse({ 
      message: msg, 
      result,
      nextStep: 'Pantau status pesanan Anda secara berkala, kami akan menghubungi Anda segera!' 
    }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export const POST = withProtection(handler, { actionName: 'payment_create', checkPayload: true });

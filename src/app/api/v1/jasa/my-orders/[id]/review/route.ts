import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { PublicFeedbackService } from '@/services/public-feedback';
import { requestIdFromHeaders } from '@/server/request-id';
import { randomUUID } from 'crypto';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const session = await authenticateRequest(request, 'USER');
    await assertRequestCsrf(request, session.sessionId, 'USER');
    const { id } = await context.params;
    const body = await request.json();
    const { rating, message } = body as { rating: number, message: string };

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new Error('Mohon berikan penilaian bintang antara 1 hingga 5.');
    }

    if (!message || message.trim().length < 10) {
      throw new Error('Ceritakan sedikit pengalaman Anda (minimal 10 karakter) agar kami bisa terus berkembang.');
    }

    const pool = getDatabaseClients().pool;
    const schema = getDatabaseSchema();
    const service = new JasaService(pool, schema);
    const order = await service.getMyServiceOrder(session.principal.id, id);
    
    if (!order) {
      return errorResponse(new ApiError('NOT_FOUND', 'Pesanan tidak ditemukan di akun Anda.'), requestId);
    }
    
    if (order.status !== 'COMPLETED') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Ulasan hanya bisa diberikan setelah pesanan selesai sepenuhnya. Kami menantikan pendapat Anda nanti!'), 
        requestId
      );
    }

    const feedbackService = new PublicFeedbackService(pool, schema);
    
    // Idempotency: mencegah user spam submit berulang kali dengan menempelkan order id
    // Jika mereka edit, harusnya beda endpoint, ini anggapannya 1 order 1 ulasan untuk sekarang
    const idempotencyKey = `jasa-review-${order.id}`;
    
    // Bintang untuk display
    const stars = '⭐'.repeat(rating);
    const topic = `[Ulasan Jasa] ${order.kind} - ${stars}`;

    const result = await feedbackService.enqueue({
      kind: 'REVIEW',
      topic,
      message: message.trim(),
      idempotencyKey,
      senderPrincipalId: session.principal.id,
    });

    return successResponse({ 
      message: 'Terima kasih banyak atas ulasan Anda! Masukan Anda sangat berarti bagi pengembangan Madevi.', 
      queued: result.queued 
    }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

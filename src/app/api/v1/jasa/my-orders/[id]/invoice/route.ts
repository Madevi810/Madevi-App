import { errorResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const session = await authenticateRequest(request, 'USER');
    const { id } = await context.params;

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const order = await service.getMyServiceOrder(session.principal.id, id);
    
    if (!order) {
      return errorResponse(new ApiError('NOT_FOUND', 'Order not found or access denied'), requestId);
    }
    
    const doc = await PDFDocument.create();
    const page = doc.addPage([595.28, 841.89]); // A4
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
    
    page.drawText('INVOICE / QUOTATION', { x: 50, y: 780, font: boldFont, size: 24 });
    page.drawText(`Order ID: ${order.id}`, { x: 50, y: 750, font, size: 12 });
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: 730, font, size: 12 });
    page.drawText(`Status: ${order.status}`, { x: 50, y: 710, font: boldFont, size: 12 });
    
    page.drawText('Service Details', { x: 50, y: 670, font: boldFont, size: 16 });
    page.drawText(`Service Kind: ${order.kind}`, { x: 50, y: 640, font, size: 12 });
    
    const snapshotPrice = order.priceSnapshot?.snapshotPrice ?? 0;
    const currency = order.priceSnapshot?.currency ?? 'IDR';
    
    page.drawText('Pricing', { x: 50, y: 600, font: boldFont, size: 16 });
    page.drawText(`Amount: ${snapshotPrice.toLocaleString()} ${currency}`, { x: 50, y: 570, font, size: 14 });
    
    page.drawText('Thank you for choosing Madevi Services.', { x: 50, y: 50, font, size: 12 });

    const pdfBytes = await doc.save();
    
    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.id}.pdf"`
      }
    });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

import { errorResponse, successResponse } from '@/api/response';
import { guardToolExecution } from '@/api/tools-gate';
import { requestIdFromHeaders } from '@/server/request-id';
import { PdfToolsService } from '@/services/pdf-tools';

export const dynamic = 'force-dynamic';

/** Konversi Uint8Array ke base64 untuk JSON response. */
function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, Math.min(i + chunk, bytes.length));
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

const TOOL_KIND = 'pdf-tools';

/**
 * POST /api/v1/pdf/process — pemrosesan PDF server-side.
 * Body: FormData { operation, file0..fileN, pages?, angle?, order?, idempotencyKey? }
 * Output: base64 PDF (tunggal) atau array (split).
 *
 * L03: operasi yang menghasilkan output (MERGE/SPLIT/ROTATE/DELETE_PAGES/
 * REORDER/COMPRESS) wajib sesi MEMBER + CSRF + gate trial/paket Tools.
 * `INFO` tetap bebas (hanya membaca metadata, tidak menghasilkan deliverable).
 * Sukses → commit trial (hanya inilah yang mengurangi sisa Free).
 * Gagal validasi/proses → release trial (tidak mengurangi sisa).
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const form = await request.formData();
    const operation = String(form.get('operation') ?? 'INFO');
    const files: Array<{ name: string; bytes: Uint8Array }> = [];
    for (const [key, value] of form.entries()) {
      if (key.startsWith('file') && value instanceof Blob) {
        const buffer = await value.arrayBuffer();
        files.push({ name: key, bytes: new Uint8Array(buffer) });
      }
    }

    const service = new PdfToolsService();

    // INFO hanya membaca metadata dokumen — tidak memakan trial.
    if (operation === 'INFO') {
      if (files.length === 0) return errorResponse(new Error('PDF wajib diunggah.'), requestId);
      const result = await service.info(files[0].bytes);
      return successResponse(result, requestId);
    }

    // L03: gate eksekusi Tools (auth + CSRF + reserve trial/paket, idempoten).
    const rawKey = form.get('idempotencyKey');
    const idempotencyKey =
      typeof rawKey === 'string' && rawKey.trim().length > 0
        ? rawKey.trim()
        : `${TOOL_KIND}-${operation.toLowerCase()}-${Date.now()}`;
    const gate = await guardToolExecution(request, `${TOOL_KIND}-${operation.toLowerCase()}`, idempotencyKey);

    try {
      if (operation === 'MERGE') {
        const result = await service.merge(files);
        await gate.accounts.commitToolsTrial(gate.auth.principal, {
          toolKind: `${TOOL_KIND}-merge`,
          idempotencyKey,
        });
        return successResponse(
          { outputName: result.outputName, outputBase64: toBase64(result.output!) },
          requestId,
        );
      }

      if (operation === 'SPLIT') {
        if (files.length === 0) return errorResponse(new Error('PDF wajib diunggah.'), requestId);
        const baseName = (form.get('baseName') as string) || 'dokumen';
        const result = await service.split(files[0].bytes, baseName);
        await gate.accounts.commitToolsTrial(gate.auth.principal, {
          toolKind: `${TOOL_KIND}-split`,
          idempotencyKey,
        });
        return successResponse(
          {
            outputs: (result.outputs ?? []).map((o) => ({
              name: o.name,
              base64: toBase64(o.bytes),
            })),
          },
          requestId,
        );
      }

      if (operation === 'ROTATE') {
        if (files.length === 0) return errorResponse(new Error('PDF wajib diunggah.'), requestId);
        const pages = String(form.get('pages') ?? '')
          .split(/[\s,]+/)
          .map((t) => parseInt(t, 10))
          .filter((n) => Number.isInteger(n) && n > 0);
        const rawAngle = parseInt(String(form.get('angle') ?? '90'), 10);
        const angle = (rawAngle === 180 || rawAngle === 270 ? rawAngle : 90) as 90 | 180 | 270;
        const result = await service.rotate(files[0].bytes, pages, angle);
        await gate.accounts.commitToolsTrial(gate.auth.principal, {
          toolKind: `${TOOL_KIND}-rotate`,
          idempotencyKey,
        });
        return successResponse(
          { outputName: result.outputName, outputBase64: toBase64(result.output!) },
          requestId,
        );
      }

      if (operation === 'DELETE_PAGES') {
        if (files.length === 0) return errorResponse(new Error('PDF wajib diunggah.'), requestId);
        const pages = String(form.get('pages') ?? '')
          .split(/[\s,]+/)
          .map((t) => parseInt(t, 10))
          .filter((n) => Number.isInteger(n) && n > 0);
        const result = await service.deletePages(files[0].bytes, pages);
        await gate.accounts.commitToolsTrial(gate.auth.principal, {
          toolKind: `${TOOL_KIND}-delete-pages`,
          idempotencyKey,
        });
        return successResponse(
          { outputName: result.outputName, outputBase64: toBase64(result.output!) },
          requestId,
        );
      }

      if (operation === 'REORDER') {
        if (files.length === 0) return errorResponse(new Error('PDF wajib diunggah.'), requestId);
        const order = String(form.get('order') ?? '')
          .split(/[\s,]+/)
          .map((t) => parseInt(t, 10))
          .filter((n) => Number.isInteger(n) && n > 0);
        const result = await service.reorder(files[0].bytes, order);
        await gate.accounts.commitToolsTrial(gate.auth.principal, {
          toolKind: `${TOOL_KIND}-reorder`,
          idempotencyKey,
        });
        return successResponse(
          { outputName: result.outputName, outputBase64: toBase64(result.output!) },
          requestId,
        );
      }

      if (operation === 'COMPRESS') {
        if (files.length === 0) return errorResponse(new Error('PDF wajib diunggah.'), requestId);
        const result = await service.compress(files[0].bytes);
        await gate.accounts.commitToolsTrial(gate.auth.principal, {
          toolKind: `${TOOL_KIND}-compress`,
          idempotencyKey,
        });
        return successResponse(
          {
            outputName: result.outputName,
            outputBase64: toBase64(result.output!),
            info: result.info,
          },
          requestId,
        );
      }

      return errorResponse(new Error('Operasi tidak dikenal.'), requestId);
    } catch (error) {
      // Gagal (validasi input / proses) → lepas reservasi; trial tidak berkurang.
      await gate.accounts.releaseToolsTrial(gate.auth.principal, idempotencyKey).catch(() => {
        /* best-effort cleanup: jangan menutup error asli */
      });
      throw error;
    }
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

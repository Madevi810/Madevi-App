/**
 * P17: ekstrak IP klien untuk rate-limiting per aksi.
 *
 * Offline/localhost: `x-forwarded-for` tidak dipercaya begitu saja (bisa
 * dipalsukan). Dipakai HANYA bila tidak ada koneksi langsung; jika tidak,
 * fallback ke socket peer. Tidak pernah null (rate-limit butuh key stabil).
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  // Localhost dev: Next.js tidak selalu ekspos socket di Request standar.
  return '127.0.0.1';
}

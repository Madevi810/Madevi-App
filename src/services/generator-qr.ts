/**
 * generator-qr.ts — Generator QR Code (client-side, tanpa API eksternal)
 * Membuat data URL QR code sederhana via canvas.
 * Untuk QR yang sesungguhnya, frontend memakai library qrcode.
 */

export interface InputQR {
  teks: string;
  ukuranPx: number;
}

export function validasiInputQR(input: InputQR): string[] {
  const masalah: string[] = [];
  if (!input.teks || input.teks.trim().length === 0) {
    masalah.push('Teks/URL tidak boleh kosong');
  }
  if (input.teks && input.teks.length > 2000) {
    masalah.push('Teks maksimal 2000 karakter');
  }
  if (input.ukuranPx < 128 || input.ukuranPx > 1024) {
    masalah.push('Ukuran harus 128–1024 px');
  }
  return masalah;
}

export function formatQRTeks(input: InputQR): string {
  return [
    '=== GENERATOR QR CODE ===',
    `Teks: ${input.teks.slice(0, 100)}${input.teks.length > 100 ? '...' : ''}`,
    `Ukuran: ${input.ukuranPx}x${input.ukuranPx} px`,
    '',
    'QR code akan dirender di browser menggunakan library qrcode.',
    'Pindai dengan kamera HP untuk membuka isi.',
  ].join('\n');
}

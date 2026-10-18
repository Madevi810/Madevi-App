/**
 * terbilang.ts — Konversi angka ke kata Bahasa Indonesia (terbilang)
 * Untuk kwitansi, kontrak, dan dokumen resmi.
 */

const SATUAN = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

function terbilangKecil(n: number): string {
  if (n < 12) return SATUAN[n];
  if (n < 20) return terbilangKecil(n - 10) + ' belas';
  if (n < 100) {
    const d = terbilangKecil(Math.floor(n / 10)) + ' puluh';
    const s = n % 10 === 0 ? '' : ' ' + terbilangKecil(n % 10);
    return d + s;
  }
  if (n < 200) return 'seratus' + (n % 100 === 0 ? '' : ' ' + terbilangKecil(n % 100));
  if (n < 1000) {
    const r = terbilangKecil(Math.floor(n / 100)) + ' ratus';
    return r + (n % 100 === 0 ? '' : ' ' + terbilangKecil(n % 100));
  }
  return '';
}

export function terbilang(n: number): string {
  if (!Number.isSafeInteger(n)) throw new Error('Hanya bilangan bulat aman');
  if (n < 0) return 'minus ' + terbilang(-n);
  if (n === 0) return 'nol';
  if (n < 1000) return terbilangKecil(n);

  const parts: string[] = [];
  const triliun = Math.floor(n / 1_000_000_000_000);
  const miliar = Math.floor((n % 1_000_000_000_000) / 1_000_000_000);
  const juta = Math.floor((n % 1_000_000_000) / 1_000_000);
  const ribu = Math.floor((n % 1_000_000) / 1000);
  const sisa = n % 1000;

  if (triliun > 0) parts.push((triliun === 1 ? 'se' : terbilangKecil(triliun) + ' ') + 'triliun');
  if (miliar > 0) parts.push((miliar === 1 ? 'se' : terbilangKecil(miliar) + ' ') + 'miliar');
  if (juta > 0) parts.push((juta === 1 ? 'se' : terbilangKecil(juta) + ' ') + 'juta');
  if (ribu > 0) parts.push(ribu === 1 ? 'seribu' : terbilangKecil(ribu) + ' ribu');
  if (sisa > 0) parts.push(terbilangKecil(sisa));

  return parts.join(' ');
}

export function formatTerbilangTeks(n: number): string {
  const kata = terbilang(n);
  const kapital = kata.charAt(0).toUpperCase() + kata.slice(1);
  return [
    '=== TERBILANG ===',
    `Angka: ${n.toLocaleString('id-ID')}`,
    `Terbilang: ${kapital} rupiah`,
  ].join('\n');
}

/**
 * kalender-haid.ts — Pelacak Siklus Haid
 * Estimasi masa subur & ovulasi. Bukan alat kontrasepsi medis.
 */

export interface HasilSiklus {
  haidBerikutnya: string; // YYYY-MM-DD
  estimasiOvulasi: string;
  masaSuburAwal: string;
  masaSuburAkhir: string;
  panjangSiklus: number;
}

function keISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parseISO(iso: string): Date {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error('Format tanggal harus YYYY-MM-DD');
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (d.getFullYear() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) {
    throw new Error('Tanggal tidak valid');
  }
  return d;
}

function tambahHari(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function hitungSiklus(haidTerakhirIso: string, panjangSiklus = 28): HasilSiklus {
  const haidTerakhir = parseISO(haidTerakhirIso);
  if (panjangSiklus < 21 || panjangSiklus > 45) {
    throw new Error('Panjang siklus normal 21–45 hari. Di luar itu, konsultasikan ke dokter.');
  }
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);
  if (haidTerakhir > hariIni) throw new Error('Tanggal haid terakhir tidak boleh di masa depan');

  const haidBerikutnya = tambahHari(haidTerakhir, panjangSiklus);
  // Ovulasi ≈ 14 hari sebelum haid berikutnya
  const ovulasi = tambahHari(haidBerikutnya, -14);
  const suburAwal = tambahHari(ovulasi, -5);
  const suburAkhir = tambahHari(ovulasi, 1);

  return {
    haidBerikutnya: keISO(haidBerikutnya),
    estimasiOvulasi: keISO(ovulasi),
    masaSuburAwal: keISO(suburAwal),
    masaSuburAkhir: keISO(suburAkhir),
    panjangSiklus,
  };
}

export function formatSiklusTeks(hasil: HasilSiklus): string {
  return [
    '=== PELACAK SIKLUS HAID ===',
    `Panjang siklus: ${hasil.panjangSiklus} hari`,
    `Haid berikutnya: ${hasil.haidBerikutnya}`,
    `Estimasi ovulasi: ${hasil.estimasiOvulasi}`,
    `Masa subur: ${hasil.masaSuburAwal} s/d ${hasil.masaSuburAkhir}`,
    '',
    'Catatan: ini estimasi. Bukan pengganti konsultasi medis atau alat kontrasepsi.',
  ].join('\n');
}

/**
 * kalkulator-umur.ts — Kalkulator Umur & Selisih Tanggal
 * Hitung umur tepat (tahun, bulan, hari) dan selisih dua tanggal.
 */

export interface HasilUmur {
  tahun: number;
  bulan: number;
  hari: number;
  totalHari: number;
  totalBulan: number;
  hariMenujuUltahBerikutnya: number | null;
}

function parseTanggal(iso: string): Date {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error('Format tanggal harus YYYY-MM-DD, contoh 1990-05-17');
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (isNaN(d.getTime())) throw new Error('Tanggal tidak valid');
  // Validasi komponen (Date JS melunakkan nilai tak valid)
  if (d.getFullYear() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) {
    throw new Error('Tanggal tidak valid');
  }
  return d;
}

export function hitungUmur(tanggalLahirIso: string, tanggalAcuanIso?: string): HasilUmur {
  const lahir = parseTanggal(tanggalLahirIso);
  const acuan = tanggalAcuanIso ? parseTanggal(tanggalAcuanIso) : new Date();
  acuan.setHours(0, 0, 0, 0);

  if (lahir > acuan) throw new Error('Tanggal lahir tidak boleh di masa depan');

  let tahun = acuan.getFullYear() - lahir.getFullYear();
  let bulan = acuan.getMonth() - lahir.getMonth();
  let hari = acuan.getDate() - lahir.getDate();

  if (hari < 0) {
    bulan -= 1;
    const bulanLalu = new Date(acuan.getFullYear(), acuan.getMonth(), 0);
    hari += bulanLalu.getDate();
  }
  if (bulan < 0) {
    tahun -= 1;
    bulan += 12;
  }

  const totalHari = Math.floor((acuan.getTime() - lahir.getTime()) / 86400000);
  const totalBulan = tahun * 12 + bulan;

  // Hari menuju ulang tahun berikutnya
  let ultahBerikut = new Date(acuan.getFullYear(), lahir.getMonth(), lahir.getDate());
  if (ultahBerikut <= acuan) {
    ultahBerikut = new Date(acuan.getFullYear() + 1, lahir.getMonth(), lahir.getDate());
  }
  const hariMenujuUltahBerikutnya = Math.ceil((ultahBerikut.getTime() - acuan.getTime()) / 86400000);

  return { tahun, bulan, hari, totalHari, totalBulan, hariMenujuUltahBerikutnya };
}

export function formatUmurTeks(hasil: HasilUmur): string {
  return [
    '=== KALKULATOR UMUR ===',
    `Umur: ${hasil.tahun} tahun, ${hasil.bulan} bulan, ${hasil.hari} hari`,
    `Total: ${hasil.totalHari.toLocaleString('id-ID')} hari (${hasil.totalBulan} bulan)`,
    `Ulang tahun berikutnya: ${hasil.hariMenujuUltahBerikutnya} hari lagi`,
  ].join('\n');
}

/**
 * Ongkos Tukang — pembanding sistem harian vs borongan (engine Tools gratis).
 *
 * Pemilik rumah yang bangun/renovasi selalu dihadapkan pada pilihan klasik:
 * bayar tukang HARIAN atau BORONGAN? Artikel di internet (arsitur, tomps,
 * sonora, 88bangunan) hanya menjelaskan teori pro-kontra — belum ada
 * kalkulator interaktif berbahasa Indonesia yang membandingkan langsung dari
 * angka milik user sendiri: susunan tim + upah harian + estimasi hari vs
 * harga borongan yang ditawarkan.
 *
 * Fungsi murni & deterministik.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - SEMUA angka rupiah berasal dari input user (upah harian tim-nya sendiri,
 *    harga borongan hasil negosiasi). Engine tidak menebak/menyarankan harga
 *    pasar — tidak ada default harga karangan (aturan #2, #31 dipatuhi).
 *  - Rekomendasi bersifat perbandingan aritmetika + catatan risiko umum
 *    (harian: risiko molor; borongan: risiko kualitas) — bukan nasihat
 *    memilih pemborong tertentu.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

export type PeranTim = 'KEPALA_TUKANG' | 'TUKANG' | 'KENEK';

export const PERAN_TIM: { id: PeranTim; nama: string }[] = [
  { id: 'KEPALA_TUKANG', nama: 'Kepala tukang' },
  { id: 'TUKANG', nama: 'Tukang' },
  { id: 'KENEK', nama: 'Kenek/laden' },
];

export interface AnggotaTim {
  peran: PeranTim;
  /** Jumlah orang — bilangan bulat ≥ 1. */
  jumlah: number;
  /** Upah per orang per hari (Rp) — dari user, ≥ 0. */
  upahHarianRp: number;
}

export interface InputBanding {
  /** Nama pekerjaan — wajib diisi user, tidak dikarang engine. */
  namaPekerjaan: string;
  /** Susunan tim harian — minimal 1 peran. */
  tim: AnggotaTim[];
  /** Estimasi lama kerja (hari) — bilangan bulat ≥ 1. */
  estimasiHari: number;
  /** Harga borongan yang ditawarkan (Rp) — dari negosiasi user, ≥ 0. */
  hargaBoronganRp: number;
}

export interface HasilBanding {
  /** Total upah tim per hari (Rp). */
  biayaPerHariRp: number;
  /** Total bila dibayar harian: biayaPerHari × estimasiHari. */
  totalHarianRp: number;
  totalBoronganRp: number;
  /** totalBorongan − totalHarian. Positif = borongan lebih mahal. */
  selisihRp: number;
  /** Jumlah hari di mana total harian tepat sama dengan borongan. */
  hariImpas: number;
  lebihMurah: 'HARIAN' | 'BORONGAN' | 'SAMA';
  rekomendasi: string;
  langkah: string[];
  catatan: string[];
}

function formatRp(n: number): string {
  return 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function namaPeran(p: PeranTim): string {
  return PERAN_TIM.find((r) => r.id === p)?.nama ?? p;
}

/**
 * Bandingkan total ongkos sistem harian vs harga borongan.
 * @throws bila input tidak valid.
 */
export function bandingkanOngkos(input: InputBanding): HasilBanding {
  if (!input.namaPekerjaan || input.namaPekerjaan.trim().length === 0) {
    throw new Error('Nama pekerjaan wajib diisi.');
  }
  if (!Array.isArray(input.tim) || input.tim.length === 0) {
    throw new Error('Susunan tim wajib diisi (minimal 1 peran).');
  }
  for (const a of input.tim) {
    if (!PERAN_TIM.some((r) => r.id === a.peran)) {
      throw new Error(`Peran tidak dikenal: "${a.peran}".`);
    }
    if (!Number.isInteger(a.jumlah) || a.jumlah < 1 || a.jumlah > 1000) {
      throw new Error(`Jumlah ${namaPeran(a.peran)} harus bilangan bulat 1–1000.`);
    }
    if (!Number.isFinite(a.upahHarianRp) || a.upahHarianRp < 0 || a.upahHarianRp > 1e9) {
      throw new Error(`Upah harian ${namaPeran(a.peran)} harus angka 0–1 miliar.`);
    }
  }
  if (!Number.isInteger(input.estimasiHari) || input.estimasiHari < 1 || input.estimasiHari > 3650) {
    throw new Error('Estimasi hari harus bilangan bulat 1–3650.');
  }
  if (!Number.isFinite(input.hargaBoronganRp) || input.hargaBoronganRp < 0 || input.hargaBoronganRp > 1e12) {
    throw new Error('Harga borongan harus angka 0–1 triliun.');
  }

  const biayaPerHariRp = input.tim.reduce((s, a) => s + a.jumlah * a.upahHarianRp, 0);
  const totalHarianRp = biayaPerHariRp * input.estimasiHari;
  const totalBoronganRp = input.hargaBoronganRp;
  const selisihRp = totalBoronganRp - totalHarianRp;

  let lebihMurah: HasilBanding['lebihMurah'];
  if (selisihRp > 0) lebihMurah = 'HARIAN';
  else if (selisihRp < 0) lebihMurah = 'BORONGAN';
  else lebihMurah = 'SAMA';

  const hariImpas = biayaPerHariRp > 0 ? totalBoronganRp / biayaPerHariRp : 0;

  const langkah = [
    `Biaya tim per hari: ${input.tim
      .map((a) => `${a.jumlah}×${namaPeran(a.peran)} ${formatRp(a.upahHarianRp)}`)
      .join(' + ')} = ${formatRp(biayaPerHariRp)}`,
    `Total harian: ${formatRp(biayaPerHariRp)} × ${input.estimasiHari} hari = ${formatRp(totalHarianRp)}`,
    `Total borongan: ${formatRp(totalBoronganRp)} (harga penawaran)`,
    `Selisih: ${formatRp(totalBoronganRp)} − ${formatRp(totalHarianRp)} = ${formatRp(selisihRp)}`,
    biayaPerHariRp > 0
      ? `Titik impas: ${formatRp(totalBoronganRp)} ÷ ${formatRp(biayaPerHariRp)} = ${hariImpas.toFixed(1)} hari`
      : 'Titik impas tidak terdefinisi (biaya harian Rp0).',
  ];

  let rekomendasi: string;
  if (biayaPerHariRp === 0) {
    rekomendasi =
      'Biaya harian Rp0 — periksa kembali upah tim. Perbandingan belum bisa disimpulkan.';
  } else if (lebihMurah === 'HARIAN') {
    rekomendasi =
      `Sistem HARIAN lebih murah ${formatRp(selisihRp)} dibanding borongan — ` +
      `asal pekerjaan selesai dalam ±${input.estimasiHari} hari. ` +
      `Bila molor melewati ${hariImpas.toFixed(0)} hari, borongan jadi lebih murah. ` +
      `Harian cocok bila Anda bisa mengawasi langsung tiap hari.`;
  } else if (lebihMurah === 'BORONGAN') {
    rekomendasi =
      `Sistem BORONGAN lebih murah ${formatRp(-selisihRp)} dibanding harian — ` +
      `risiko keterlambatan ditanggung pemborong. Pastikan lingkup pekerjaan ` +
      `tertulis jelas (termasuk material bila borongan penuh) agar tidak ada ` +
      `biaya tambahan di tengah jalan.`;
  } else {
    rekomendasi =
      'Kedua sistem SAMA BESAR — pilih berdasarkan kenyamanan: harian bila Anda ' +
      'ingin kontrol penuh dan bisa mengawasi; borongan bila ingin kepastian ' +
      'jadwal tanpa urus harian.';
  }

  const catatan = [
    'Semua angka rupiah berasal dari input Anda — engine tidak memakai harga pasar.',
    'Risiko HARIAN: pekerjaan molor = biaya membengkak; butuh pengawasan.',
    'Risiko BORONGAN: pemborong mengejar cepat selesai — awasi kualitas hasil.',
    'Untuk pekerjaan kecil/spesifik (cat detail, keramik), harian dengan tukang yang teliti sering lebih pas.',
  ];

  return {
    biayaPerHariRp,
    totalHarianRp,
    totalBoronganRp,
    selisihRp,
    hariImpas: Math.round(hariImpas * 10) / 10,
    lebihMurah,
    rekomendasi,
    langkah,
    catatan,
  };
}

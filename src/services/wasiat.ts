/**
 * WasiatKu — jasa susun surat wasiat terstruktur (engine jasa berbayar).
 *
 * Di Indonesia, surat wasiat nyaris tidak dikenal di luar kalangan berharta,
 * padahal sengketa waris antar ahli waris adalah masalah nyata di banyak
 * keluarga. Layanan susun wasiat online berbahasa Indonesia praktis tidak
 * ada — yang ada hanya jasa notaris offline yang mahal dan menakutkan bagi
 * orang awam. Engine ini memandu lewat kuesioner terstruktur (data pewasiat
 * → ahli waris + porsi → daftar harta → wasiat khusus → saksi) lalu
 * menghasilkan draf dokumen teks siap cetak.
 *
 * Kejujuran data & batasan (aturan konten Madevi):
 *  - Engine ini ALAT BANTU DRAF, bukan pengganti notaris/pengacara. Setiap
 *    output memuat disclaimer tersebut + anjuran verifikasi ke notaris dan
 *    tokoh agama/ahli hukum.
 *  - Aturan "wasiat untuk non-ahli-waris ≤ 1/3 harta" adalah ATURAN UMUM
 *    fikih waris yang beredar luas — dilabeli sebagai aturan umum dan BISA
 *    diubah/dinonaktifkan user bila memakai dasar hukum lain.
 *  - Engine TIDAK memberi nasihat hukum spesifik dan TIDAK menebak nilai
 *    harta — semua angka berasal dari input user.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal dan deterministik.
 */

/** Tier harga jasa — HEMAT Rp10rb–50rb, PRO Rp50rb–150rb (aturan inovasi). */
export interface WasiatTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Jumlah dokumen wasiat yang bisa disusun per bulan; -1 = tanpa batas. */
  batasDokumenPerBulan: number;
  /** Jumlah revisi draf yang ditanggung per dokumen. */
  maksRevisi: number;
  fitur: string[];
}

export const WASIAT_TIERS: WasiatTier[] = [
  {
    id: 'HEMAT',
    nama: 'Paket Hemat',
    hargaRp: 25000,
    batasDokumenPerBulan: 1,
    maksRevisi: 0,
    fitur: [
      '1 dokumen wasiat per bulan',
      'Kuesioner terstruktur 5 bagian',
      'Draf dokumen teks siap cetak',
      'Panduan isi mandiri',
    ],
  },
  {
    id: 'PRO',
    nama: 'Paket Pro',
    hargaRp: 99000,
    batasDokumenPerBulan: -1,
    maksRevisi: 2,
    fitur: [
      'Semua fitur Paket Hemat',
      'Dokumen tanpa batas per bulan',
      '2x revisi draf per dokumen',
      'Review kelengkapan oleh tim',
      'Checklist saksi & legalisasi notaris',
    ],
  },
];

export function tierDariId(id: string): WasiatTier | null {
  return WASIAT_TIERS.find((t) => t.id === id) ?? null;
}

export interface AhliWaris {
  nama: string;
  hubungan: string;
  /** Porsi dalam persen, mis. 50 = 50%. Total semua ahli waris harus 100%. */
  porsiPersen: number;
}

export interface HartaWasiat {
  jenis: string;
  deskripsi: string;
  /** Estimasi nilai (Rp). Opsional — boleh dikosongkan bila tidak tahu. */
  estimasiNilaiRp?: number;
}

export interface WasiatKhusus {
  penerima: string;
  uraian: string;
  /** Nilai (Rp), bila berupa harta bernilai uang. */
  nilaiRp?: number;
  /** true bila penerima juga tercantum sebagai ahli waris. */
  untukAhliWaris: boolean;
}

export interface Saksi {
  nama: string;
  identitas: string;
}

export interface WasiatInput {
  namaPewasiat: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  alamat?: string;
  nomorIdentitas?: string;
  ahliWaris: AhliWaris[];
  harta: HartaWasiat[];
  wasiatKhusus: WasiatKhusus[];
  saksi: Saksi[];
  /** Batas wasiat untuk non-ahli-waris sebagai fraksi harta (aturan umum: 1/3). */
  batasWasiatNonAhliWaris?: number;
  tanggalSurat?: string;
  kotaSurat?: string;
}

export interface DrafWasiat extends WasiatInput {
  totalEstimasiHartaRp: number | null;
  totalWasiatKhususNonAhliWarisRp: number;
  peringatan: string[];
  langkah: string[];
}

export const DISCLAIMER_WASIAT =
  'DISCLAIMER: Dokumen ini adalah draf yang disusun dari jawaban Anda memakai ' +
  'aturan umum yang beredar luas. Ini BUKAN pengganti notaris/pengacara dan ' +
  'belum tentu memenuhi syarat hukum yang berlaku. Untuk kekuatan hukum penuh, ' +
  'konsultasikan draf ini ke notaris. Untuk kesesuaian syariat, verifikasikan ' +
  'ke tokoh agama/ahli hukum yang Anda percaya.';

function wajib(namaField: string, nilai: unknown): void {
  if (nilai === undefined || nilai === null || String(nilai).trim() === '') {
    throw new Error(`${namaField} wajib diisi.`);
  }
}

function harusAngkaPositif(namaField: string, nilai: number): void {
  if (!Number.isFinite(nilai) || nilai < 0) {
    throw new Error(`${namaField} harus berupa angka ≥ 0.`);
  }
}

/**
 * Menyusun draf wasiat dari input terstruktur.
 * Melempar Error berbahasa Indonesia bila validasi gagal.
 */
export function susunWasiat(input: WasiatInput): DrafWasiat {
  wajib('Nama pewasiat', input.namaPewasiat);

  if (!Array.isArray(input.ahliWaris) || input.ahliWaris.length === 0) {
    throw new Error('Minimal 1 ahli waris harus dicantumkan.');
  }
  const langkah: string[] = [];
  const peringatan: string[] = [];

  // 1. Validasi ahli waris + total porsi = 100%.
  let totalPorsi = 0;
  input.ahliWaris.forEach((a, i) => {
    wajib(`Nama ahli waris #${i + 1}`, a.nama);
    wajib(`Hubungan ahli waris #${i + 1}`, a.hubungan);
    harusAngkaPositif(`Porsi ahli waris #${i + 1}`, a.porsiPersen);
    totalPorsi += a.porsiPersen;
  });
  langkah.push(
    `Total porsi ${input.ahliWaris.length} ahli waris = ${totalPorsi}% ` +
      `(harus 100%).`,
  );
  if (Math.abs(totalPorsi - 100) > 0.01) {
    throw new Error(
      `Total porsi ahli waris harus 100%, saat ini ${totalPorsi}%. ` +
        'Sesuaikan porsi masing-masing ahli waris.',
    );
  }

  // 2. Total estimasi harta (bila user mengisi nilai).
  const harta = input.harta ?? [];
  harta.forEach((h, i) => {
    wajib(`Jenis harta #${i + 1}`, h.jenis);
    wajib(`Deskripsi harta #${i + 1}`, h.deskripsi);
    if (h.estimasiNilaiRp !== undefined) {
      harusAngkaPositif(`Estimasi nilai harta #${i + 1}`, h.estimasiNilaiRp);
    }
  });
  const adaNilai = harta.some((h) => h.estimasiNilaiRp !== undefined);
  const totalEstimasiHartaRp = adaNilai
    ? harta.reduce((s, h) => s + (h.estimasiNilaiRp ?? 0), 0)
    : null;
  if (totalEstimasiHartaRp !== null) {
    langkah.push(
      `Total estimasi harta (dari ${harta.length} item) = ` +
        formatRp(totalEstimasiHartaRp) + '.',
    );
  } else {
    langkah.push(
      'Tidak ada estimasi nilai harta yang diisi — batas 1/3 wasiat ' +
        'non-ahli-waris tidak bisa dihitung otomatis.',
    );
  }

  // 3. Wasiat khusus — batas untuk non-ahli-waris (aturan umum: ≤ 1/3).
  const wasiatKhusus = input.wasiatKhusus ?? [];
  const batasFraksi = input.batasWasiatNonAhliWaris ?? 1 / 3;
  if (!(batasFraksi > 0 && batasFraksi <= 1)) {
    throw new Error('Batas wasiat non-ahli-waris harus antara 0 dan 1.');
  }
  let totalWasiatKhususNonAhliWarisRp = 0;
  wasiatKhusus.forEach((w, i) => {
    wajib(`Penerima wasiat khusus #${i + 1}`, w.penerima);
    wajib(`Uraian wasiat khusus #${i + 1}`, w.uraian);
    if (w.nilaiRp !== undefined) {
      harusAngkaPositif(`Nilai wasiat khusus #${i + 1}`, w.nilaiRp);
      if (!w.untukAhliWaris) totalWasiatKhususNonAhliWarisRp += w.nilaiRp;
    }
  });
  if (totalEstimasiHartaRp !== null && totalEstimasiHartaRp > 0) {
    const batasRp = totalEstimasiHartaRp * batasFraksi;
    langkah.push(
      `Wasiat khusus untuk non-ahli-waris = ${formatRp(totalWasiatKhususNonAhliWarisRp)} ` +
        `(batas aturan umum ${Math.round(batasFraksi * 100)}% × estimasi harta = ${formatRp(batasRp)}).`,
    );
    if (totalWasiatKhususNonAhliWarisRp > batasRp + 0.01) {
      throw new Error(
        `Wasiat khusus untuk non-ahli-waris (${formatRp(totalWasiatKhususNonAhliWarisRp)}) ` +
          `melebihi batas aturan umum ${Math.round(batasFraksi * 100)}% dari estimasi harta ` +
          `(${formatRp(batasRp)}). Kurangi nilainya, tandai penerima sebagai ahli waris, ` +
          `atau ubah batas bila memakai dasar hukum lain.`,
      );
    }
  }

  // 4. Saksi — dianjurkan minimal 2, hanya peringatan bila kurang.
  const saksi = input.saksi ?? [];
  saksi.forEach((s, i) => {
    wajib(`Nama saksi #${i + 1}`, s.nama);
    wajib(`Identitas saksi #${i + 1}`, s.identitas);
  });
  if (saksi.length < 2) {
    peringatan.push(
      `Saksi baru ${saksi.length} orang — dianjurkan minimal 2 orang saksi ` +
        'agar dokumen lebih kuat.',
    );
  }
  langkah.push(`Saksi tercantum: ${saksi.length} orang.`);

  return {
    ...input,
    harta,
    wasiatKhusus,
    saksi,
    totalEstimasiHartaRp,
    totalWasiatKhususNonAhliWarisRp,
    peringatan,
    langkah,
  };
}

/** Kuota dokumen per tier per bulan. */
export function cekBatasDokumen(
  tierId: string,
  dipakaiBulanIni: number,
): { boleh: boolean; sisa: number; tier: WasiatTier } {
  const tier = tierDariId(tierId);
  if (!tier) throw new Error(`Tier "${tierId}" tidak dikenal.`);
  if (!Number.isInteger(dipakaiBulanIni) || dipakaiBulanIni < 0) {
    throw new Error('Jumlah pemakaian bulan ini harus bilangan bulat ≥ 0.');
  }
  if (tier.batasDokumenPerBulan < 0) {
    return { boleh: true, sisa: -1, tier };
  }
  const sisa = tier.batasDokumenPerBulan - dipakaiBulanIni;
  return { boleh: sisa > 0, sisa: Math.max(0, sisa), tier };
}

function formatRp(n: number): string {
  return 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function baris(n: number): string {
  return `${n}.`;
}

/** Draf dokumen teks bernomor pasal, siap cetak. */
export function formatWasiatTeks(d: DrafWasiat): string {
  const out: string[] = [];
  const kota = d.kotaSurat ?? '[kota]';
  const tanggal = d.tanggalSurat ?? '[tanggal]';

  out.push('SURAT WASIAT');
  out.push('');
  out.push(`Yang bertanda tangan di bawah ini:`);
  out.push(`Nama             : ${d.namaPewasiat}`);
  if (d.tempatLahir || d.tanggalLahir) {
    out.push(
      `Tempat/Tgl lahir : ${[d.tempatLahir, d.tanggalLahir].filter(Boolean).join(', ') || '-'}`,
    );
  }
  if (d.alamat) out.push(`Alamat           : ${d.alamat}`);
  if (d.nomorIdentitas) out.push(`No. identitas    : ${d.nomorIdentitas}`);
  out.push('');
  out.push(
    'Dengan ini menyatakan kehendak terakhir saya sebagai berikut:',
  );
  out.push('');

  let pasal = 1;
  out.push(`${baris(pasal++)} DAFTAR AHLI WARIS`);
  d.ahliWaris.forEach((a, i) => {
    out.push(`   ${i + 1}) ${a.nama} — ${a.hubungan}, porsi ${a.porsiPersen}%`);
  });
  out.push('');

  out.push(`${baris(pasal++)} DAFTAR HARTA`);
  if (d.harta.length === 0) {
    out.push('   (belum dicantumkan — lengkapi sebelum ditandatangani)');
  } else {
    d.harta.forEach((h, i) => {
      const nilai =
        h.estimasiNilaiRp !== undefined
          ? ` (estimasi ${formatRp(h.estimasiNilaiRp)})`
          : '';
      out.push(`   ${i + 1}) ${h.jenis}: ${h.deskripsi}${nilai}`);
    });
  }
  out.push('');

  if (d.wasiatKhusus.length > 0) {
    out.push(`${baris(pasal++)} WASIAT KHUSUS`);
    d.wasiatKhusus.forEach((w, i) => {
      const nilai =
        w.nilaiRp !== undefined ? ` (senilai ${formatRp(w.nilaiRp)})` : '';
      const status = w.untukAhliWaris ? 'ahli waris' : 'bukan ahli waris';
      out.push(`   ${i + 1}) Kepada ${w.penerima} (${status}): ${w.uraian}${nilai}`);
    });
    out.push('');
  }

  out.push(
    `${baris(pasal++)} SAKSI`,
  );
  if (d.saksi.length === 0) {
    out.push('   (belum ada saksi — tambahkan minimal 2 orang)');
  } else {
    d.saksi.forEach((s, i) => {
      out.push(`   ${i + 1}) ${s.nama} — ${s.identitas}`);
    });
  }
  out.push('');
  out.push(
    `Demikian surat wasiat ini saya buat dengan sadar dan tanpa paksaan.`,
  );
  out.push('');
  out.push(`${kota}, ${tanggal}`);
  out.push('');
  out.push('Pewasiat,');
  out.push('');
  out.push('');
  out.push(`( ${d.namaPewasiat} )`);
  if (d.saksi.length > 0) {
    out.push('');
    out.push('Saksi-saksi:');
    d.saksi.forEach((s) => {
      out.push('');
      out.push(`( ${s.nama} )`);
    });
  }
  out.push('');
  if (d.peringatan.length > 0) {
    out.push('CATATAN:');
    d.peringatan.forEach((p) => out.push(`- ${p}`));
    out.push('');
  }
  out.push(DISCLAIMER_WASIAT);
  return out.join('\n');
}

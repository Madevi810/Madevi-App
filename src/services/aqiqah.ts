/**
 * AqiqahKu — kalkulator perencanaan aqiqah (engine Tools gratis).
 *
 * Setiap kelahiran anak, keluarga muslim merencanakan aqiqah secara manual:
 * berapa ekor kambing, kapan tanggal pelaksanaannya, berapa estimasi daging,
 * berapa total biayanya. Yang ada di internet hanya daftar harga vendor/jasa
 * aqiqah — kalkulator perencanaan interaktif berbahasa Indonesia tidak ada.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Aturan "anak laki-laki 2 ekor, perempuan 1 ekor" dan "sunnah hari
 *    ke-7/14/21" adalah ATURAN UMUM fikih yang beredar luas — dilabeli
 *    demikian, jumlah ekor BISA dioverride user, anjuran verifikasi ke ustadz.
 *  - Bobot acuan & rendemen default adalah ANGKA UMUM panduan peternakan —
 *    dilabeli "contoh umum" dan SEMUA bisa diubah sesuai timbangan nyata.
 *  - Engine TIDAK menebak harga (aturan #31): total biaya hanya dihitung
 *    bila user mengisi harga per ekor / biaya masak sendiri.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal dan deterministik.
 */

export type HewanAqiqahId = 'kambing' | 'domba';
export type JenisKelamin = 'L' | 'P';

export interface HewanAqiqah {
  id: HewanAqiqahId;
  nama: string;
  /** Bobot hidup acuan (kg) — contoh umum, bisa diubah. */
  bobotAcuanKg: number;
  /** Rendemen daging dari bobot hidup (fraksi) — contoh umum, bisa diubah. */
  rendemenDefault: number;
}

export const DAFTAR_HEWAN_AQIQAH: HewanAqiqah[] = [
  { id: 'kambing', nama: 'Kambing', bobotAcuanKg: 30, rendemenDefault: 0.45 },
  { id: 'domba', nama: 'Domba', bobotAcuanKg: 35, rendemenDefault: 0.45 },
];

export function hewanAqiqahDariId(id: string): HewanAqiqah | null {
  return DAFTAR_HEWAN_AQIQAH.find((h) => h.id === id) ?? null;
}

/**
 * Jumlah ekor menurut ATURAN UMUM (bisa dioverride lewat input.jumlahEkor):
 * anak laki-laki 2 ekor, anak perempuan 1 ekor.
 */
export const ATURAN_JUMLAH_UMUM: Record<JenisKelamin, number> = { L: 2, P: 1 };

/** Hari-hari sunnah pelaksanaan aqiqah dihitung dari tanggal lahir (aturan umum). */
export const HARI_SUNNAH = [7, 14, 21] as const;

export const DISCLAIMER_AQIQAH =
  'Aturan jumlah ekor & hari pelaksanaan di atas adalah ATURAN UMUM yang ' +
  'beredar luas — verifikasi ke ustadz/ulama bila memakai dasar fikih lain. ' +
  'Angka bobot & rendemen adalah contoh umum, sesuaikan dengan timbangan ' +
  'nyata. Engine ini alat bantu hitung, bukan fatwa.';

export interface AqiqahInput {
  /** 'L' = laki-laki, 'P' = perempuan. */
  jenisKelamin: JenisKelamin;
  /** Tanggal lahir anak, format YYYY-MM-DD. */
  tanggalLahir: string;
  hewan: HewanAqiqahId;
  /** Override jumlah ekor (aturan umum: L=2, P=1). */
  jumlahEkor?: number;
  /** Bobot hidup rata-rata per ekor (kg). Default = bobot acuan hewan. */
  bobotKg?: number;
  /** Rendemen daging (fraksi 0–1). Default = rendemen default hewan. */
  rendemen?: number;
  /** Harga kambing/domba per ekor (Rp) — dari input user, bukan tebakan. */
  hargaPerEkorRp?: number;
  /** Biaya masak per ekor (Rp) — dari input user, bukan tebakan. */
  biayaMasakPerEkorRp?: number;
  /** Nama anak — opsional, hanya untuk teks siap salin. */
  namaAnak?: string;
}

export interface TanggalSunnah {
  hariKe: number;
  /** Tanggal pelaksanaan, format YYYY-MM-DD. */
  tanggal: string;
  label: string;
}

export interface HasilAqiqah {
  hewan: HewanAqiqah;
  jenisKelamin: JenisKelamin;
  jumlahEkor: number;
  tanggalLahir: string;
  timeline: TanggalSunnah[];
  bobotPerEkorKg: number;
  rendemen: number;
  estimasiDagingKg: number;
  /** null bila user tidak mengisi harga — engine tidak menebak harga. */
  totalBiayaRp: number | null;
  rincianBiaya: string[];
  peringatan: string[];
  langkah: string[];
}

function harusBilanganBulatPositif(nama: string, nilai: number): void {
  if (!Number.isInteger(nilai) || nilai <= 0) {
    throw new Error(`${nama} harus bilangan bulat > 0.`);
  }
}

function bulat2(n: number): number {
  return Math.round((n + 1e-9) * 100) / 100;
}

/** Validasi tanggal YYYY-MM-DD nyata (termasuk kabisat). */
function parseTanggal(nama: string, iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) {
    throw new Error(`${nama} harus format YYYY-MM-DD (contoh: 2026-01-01).`);
  }
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (
    d.getUTCFullYear() !== Number(m[1]) ||
    d.getUTCMonth() !== Number(m[2]) - 1 ||
    d.getUTCDate() !== Number(m[3])
  ) {
    throw new Error(`${nama} "${iso}" bukan tanggal yang nyata.`);
  }
  return d;
}

function keIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Menghitung timeline tanggal sunnah dari tanggal lahir.
 * Hari ke-1 = tanggal lahir; hari ke-7 = lahir + 6 hari.
 */
export function tanggalSunnah(tanggalLahir: string): TanggalSunnah[] {
  const lahir = parseTanggal('Tanggal lahir', tanggalLahir);
  const sekarang = new Date();
  const hariIniUtc = new Date(
    Date.UTC(
      sekarang.getUTCFullYear(),
      sekarang.getUTCMonth(),
      sekarang.getUTCDate(),
    ),
  );
  if (lahir.getTime() > hariIniUtc.getTime()) {
    throw new Error('Tanggal lahir tidak boleh di masa depan.');
  }
  return HARI_SUNNAH.map((hariKe) => {
    const t = new Date(lahir.getTime() + (hariKe - 1) * 86_400_000);
    return {
      hariKe,
      tanggal: keIso(t),
      label:
        hariKe === 7
          ? 'Hari ke-7 — waktu utama yang disunnahkan (aturan umum)'
          : `Hari ke-${hariKe} — alternatif bila terlewat (aturan umum)`,
    };
  });
}

function formatRp(n: number): string {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

/**
 * Menghitung rencana aqiqah.
 * Melempar Error berbahasa Indonesia bila validasi gagal.
 */
export function hitungAqiqah(input: AqiqahInput): HasilAqiqah {
  if (input.jenisKelamin !== 'L' && input.jenisKelamin !== 'P') {
    throw new Error('Jenis kelamin harus "L" (laki-laki) atau "P" (perempuan).');
  }
  const hewan = hewanAqiqahDariId(input.hewan);
  if (!hewan) {
    throw new Error(`Jenis hewan "${input.hewan}" tidak dikenal.`);
  }

  const jumlahEkor = input.jumlahEkor ?? ATURAN_JUMLAH_UMUM[input.jenisKelamin];
  harusBilanganBulatPositif('Jumlah ekor', jumlahEkor);

  const bobotPerEkorKg = input.bobotKg ?? hewan.bobotAcuanKg;
  if (!(bobotPerEkorKg > 0)) {
    throw new Error('Bobot per ekor harus > 0 kg.');
  }
  const rendemen = input.rendemen ?? hewan.rendemenDefault;
  if (!(rendemen > 0 && rendemen <= 1)) {
    throw new Error('Rendemen harus antara 0 dan 1 (mis. 0,45 = 45%).');
  }

  const timeline = tanggalSunnah(input.tanggalLahir);

  const langkah: string[] = [];
  const peringatan: string[] = [];

  if (input.jumlahEkor === undefined) {
    langkah.push(
      `Jumlah ekor memakai ATURAN UMUM: anak ${
        input.jenisKelamin === 'L' ? 'laki-laki' : 'perempuan'
      } → ${jumlahEkor} ekor ${hewan.nama}.`,
    );
  } else {
    langkah.push(
      `Jumlah ekor sesuai input Anda: ${jumlahEkor} ekor ${hewan.nama} ` +
        `(aturan umum: L=2, P=1).`,
    );
  }
  langkah.push(
    `Timeline dari tanggal lahir ${input.tanggalLahir}: ` +
      timeline.map((t) => `hari ke-${t.hariKe} = ${t.tanggal}`).join(', ') +
      '.',
  );

  const estimasiDagingKg = bulat2(jumlahEkor * bobotPerEkorKg * rendemen);
  langkah.push(
    `Estimasi daging = ${jumlahEkor} ekor × ${bobotPerEkorKg} kg ` +
      `× ${Math.round(rendemen * 100)}% rendemen = ${estimasiDagingKg} kg ` +
      `(contoh umum — timbang hewan nyata Anda).`,
  );

  // Biaya: hanya dari input user — tidak menebak harga.
  let totalBiayaRp: number | null = null;
  const rincianBiaya: string[] = [];
  const hargaPerEkorRp = input.hargaPerEkorRp;
  const biayaMasakPerEkorRp = input.biayaMasakPerEkorRp;
  if (hargaPerEkorRp !== undefined || biayaMasakPerEkorRp !== undefined) {
    let total = 0;
    if (hargaPerEkorRp !== undefined) {
      if (!(hargaPerEkorRp >= 0)) {
        throw new Error('Harga per ekor harus ≥ 0.');
      }
      const sub = jumlahEkor * hargaPerEkorRp;
      total += sub;
      rincianBiaya.push(
        `Hewan: ${jumlahEkor} ekor × ${formatRp(hargaPerEkorRp)} = ${formatRp(sub)}`,
      );
    }
    if (biayaMasakPerEkorRp !== undefined) {
      if (!(biayaMasakPerEkorRp >= 0)) {
        throw new Error('Biaya masak per ekor harus ≥ 0.');
      }
      const sub = jumlahEkor * biayaMasakPerEkorRp;
      total += sub;
      rincianBiaya.push(
        `Masak: ${jumlahEkor} ekor × ${formatRp(biayaMasakPerEkorRp)} = ${formatRp(sub)}`,
      );
    }
    totalBiayaRp = total;
    langkah.push(`Total biaya (dari harga yang Anda isi) = ${formatRp(total)}.`);
  } else {
    peringatan.push(
      'Total biaya tidak dihitung karena Anda belum mengisi harga per ekor / ' +
        'biaya masak — engine tidak menebak harga pasar.',
    );
  }

  peringatan.push(
    'Bobot & rendemen di atas contoh umum — hasil akhir ikut timbangan nyata.',
  );

  return {
    hewan,
    jenisKelamin: input.jenisKelamin,
    jumlahEkor,
    tanggalLahir: input.tanggalLahir,
    timeline,
    bobotPerEkorKg,
    rendemen,
    estimasiDagingKg,
    totalBiayaRp,
    rincianBiaya,
    peringatan,
    langkah,
  };
}

/** Ringkasan rencana aqiqah siap salin. */
export function formatAqiqahTeks(h: HasilAqiqah, namaAnak?: string): string {
  const baris: string[] = [];
  baris.push('RENCANA AQIQAH' + (namaAnak ? ` — ${namaAnak}` : ''));
  baris.push(
    `Anak ${h.jenisKelamin === 'L' ? 'laki-laki' : 'perempuan'} | ` +
      `Lahir ${h.tanggalLahir} | ${h.jumlahEkor} ekor ${h.hewan.nama} (aturan umum)`,
  );
  baris.push('');
  baris.push('JADWAL SUNNAH PELAKSANAAN:');
  for (const t of h.timeline) {
    baris.push(`- Hari ke-${t.hariKe}: ${t.tanggal} — ${t.label}`);
  }
  baris.push('');
  baris.push(
    `Estimasi daging: ${h.estimasiDagingKg} kg ` +
      `(${h.jumlahEkor} × ${h.bobotPerEkorKg} kg × ${Math.round(h.rendemen * 100)}%)`,
  );
  if (h.totalBiayaRp !== null) {
    baris.push('RINCIAN BIAYA (dari harga yang Anda isi):');
    for (const r of h.rincianBiaya) {
      baris.push(`- ${r}`);
    }
    baris.push(`TOTAL: ${formatRp(h.totalBiayaRp)}`);
  } else {
    baris.push('Biaya: belum diisi (isi harga per ekor & biaya masak untuk menghitung).');
  }
  baris.push('');
  baris.push('Catatan: ' + DISCLAIMER_AQIQAH);
  return baris.join('\n');
}

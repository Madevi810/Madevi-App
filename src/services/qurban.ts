/**
 * QurbanKu — kalkulator pembagian daging qurban (engine Tools gratis).
 *
 * Setiap Idul Adha, panitia qurban di masjid/musala menghitung pembagian
 * daging secara manual: berapa kg daging dari N ekor sapi/kambing, dibagi ke
 * shohibul qurban, fakir miskin, dan kerabat — lalu dijadikan berapa paket.
 * Yang ada di internet hanya artikel penjelasan hukum qurban; kalkulator
 * interaktif berbahasa Indonesia untuk pembagian daging praktis tidak ada.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Bobot acuan & rendemen default adalah ANGKA UMUM yang beredar di
 *    panduan peternakan — dilabeli "contoh umum" dan SEMUA bisa diubah user
 *    sesuai timbangan nyata. Engine tidak mengklaim angka pasti.
 *  - Aturan "patungan sapi/kerbau/unta ≤ 7 orang" dan "pembagian sepertiga"
 *    adalah ATURAN/PRAKTIK UMUM — dilabeli demikian, rasio pembagian bisa
 *    dikustom, anjuran verifikasi ke panitia/ustadz setempat.
 *  - Engine TIDAK menebak harga — hanya menghitung KG daging dan paket.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal dan deterministik.
 *
 * Angka acuan umum (bisa diubah):
 *  - Sapi potong ±300–400 kg bobot hidup, rendemen karkas ±50%.
 *  - Kambing/domba ±25–40 kg bobot hidup, rendemen ±45%.
 *  (panduan umum peternakan; BUKAN hasil timbangan hewan Anda)
 */

export type HewanQurbanId = 'sapi' | 'kerbau' | 'kambing' | 'domba' | 'unta';

export interface HewanQurban {
  id: HewanQurbanId;
  nama: string;
  /** Bobot hidup acuan (kg) — contoh umum, bisa diubah. */
  bobotAcuanKg: number;
  /** Rendemen daging dari bobot hidup (fraksi) — contoh umum, bisa diubah. */
  rendemenDefault: number;
  /** Maksimal jumlah shohibul qurban patungan per ekor (aturan umum). */
  maksPatungan: number;
}

export const DAFTAR_HEWAN: HewanQurban[] = [
  { id: 'sapi', nama: 'Sapi', bobotAcuanKg: 350, rendemenDefault: 0.5, maksPatungan: 7 },
  { id: 'kerbau', nama: 'Kerbau', bobotAcuanKg: 400, rendemenDefault: 0.48, maksPatungan: 7 },
  { id: 'kambing', nama: 'Kambing', bobotAcuanKg: 30, rendemenDefault: 0.45, maksPatungan: 1 },
  { id: 'domba', nama: 'Domba', bobotAcuanKg: 35, rendemenDefault: 0.45, maksPatungan: 1 },
  { id: 'unta', nama: 'Unta', bobotAcuanKg: 500, rendemenDefault: 0.5, maksPatungan: 7 },
];

export function hewanDariId(id: string): HewanQurban | null {
  return DAFTAR_HEWAN.find((h) => h.id === id) ?? null;
}

/**
 * Pembagian default SEPERTIGA (praktik umum):
 * 1/3 shohibul qurban, 1/3 fakir miskin, 1/3 kerabat/hadiah.
 */
export const PEMBAGIAN_SEPERTIGA = {
  shohibul: 1 / 3,
  fakirMiskin: 1 / 3,
  kerabat: 1 / 3,
} as const;

export interface RasioPembagian {
  shohibul: number;
  fakirMiskin: number;
  kerabat: number;
}

export interface QurbanInput {
  hewan: HewanQurbanId;
  jumlahHewan: number;
  /** Bobot hidup rata-rata per ekor (kg). Default = bobot acuan hewan. */
  bobotKg?: number;
  /** Rendemen daging (fraksi 0–1). Default = rendemen default hewan. */
  rendemen?: number;
  /** Jumlah shohibul qurban (untuk validasi patungan). */
  jumlahShohibul?: number;
  /** Rasio pembagian. Default = sepertiga. */
  rasio?: RasioPembagian;
  /** Jumlah paket per kelompok (untuk hitung berat per paket). */
  paketShohibul?: number;
  paketFakirMiskin?: number;
  paketKerabat?: number;
}

export interface AlokasiKelompok {
  kelompok: 'shohibul' | 'fakirMiskin' | 'kerabat';
  nama: string;
  dagingKg: number;
  jumlahPaket: number | null;
  beratPerPaketKg: number | null;
}

export interface HasilQurban {
  hewan: HewanQurban;
  jumlahHewan: number;
  bobotPerEkorKg: number;
  rendemen: number;
  totalDagingKg: number;
  alokasi: AlokasiKelompok[];
  /** Sisa akibat pembulatan paket (kg) — ditampilkan jujur. */
  sisaPembulatanKg: number;
  peringatan: string[];
  langkah: string[];
}

function harusBilanganBulatPositif(nama: string, nilai: number): void {
  if (!Number.isInteger(nilai) || nilai <= 0) {
    throw new Error(`${nama} harus bilangan bulat > 0.`);
  }
}

function bulat2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Menghitung pembagian daging qurban.
 * Melempar Error berbahasa Indonesia bila validasi gagal.
 */
export function hitungQurban(input: QurbanInput): HasilQurban {
  const hewan = hewanDariId(input.hewan);
  if (!hewan) {
    throw new Error(`Jenis hewan "${input.hewan}" tidak dikenal.`);
  }
  harusBilanganBulatPositif('Jumlah hewan', input.jumlahHewan);

  const bobotPerEkorKg = input.bobotKg ?? hewan.bobotAcuanKg;
  if (!(bobotPerEkorKg > 0)) {
    throw new Error('Bobot per ekor harus > 0 kg.');
  }
  const rendemen = input.rendemen ?? hewan.rendemenDefault;
  if (!(rendemen > 0 && rendemen <= 1)) {
    throw new Error('Rendemen harus antara 0 dan 1 (mis. 0,5 = 50%).');
  }

  const langkah: string[] = [];
  const peringatan: string[] = [];

  // Validasi patungan (aturan umum): sapi/kerbau/unta ≤ 7 per ekor.
  if (input.jumlahShohibul !== undefined) {
    harusBilanganBulatPositif('Jumlah shohibul qurban', input.jumlahShohibul);
    const maksTotal = hewan.maksPatungan * input.jumlahHewan;
    if (input.jumlahShohibul > maksTotal) {
      throw new Error(
        `Patungan ${hewan.nama} maksimal ${hewan.maksPatungan} orang per ekor ` +
          `(aturan umum) — untuk ${input.jumlahHewan} ekor maksimal ${maksTotal} orang, ` +
          `diajukan ${input.jumlahShohibul} orang.`,
      );
    }
    langkah.push(
      `Shohibul qurban: ${input.jumlahShohibul} orang ` +
        `(maks ${maksTotal} untuk ${input.jumlahHewan} ekor ${hewan.nama}).`,
    );
  }

  // Rasio pembagian — default sepertiga, bisa kustom (total harus 1).
  const rasio: RasioPembagian = input.rasio ?? { ...PEMBAGIAN_SEPERTIGA };
  const totalRasio = rasio.shohibul + rasio.fakirMiskin + rasio.kerabat;
  if (Math.abs(totalRasio - 1) > 0.001) {
    throw new Error(
      `Total rasio pembagian harus 100%, saat ini ${Math.round(totalRasio * 100)}%.`,
    );
  }
  for (const [k, v] of Object.entries(rasio) as [keyof RasioPembagian, number][]) {
    if (!(v >= 0 && v <= 1)) {
      throw new Error(`Rasio "${k}" harus antara 0 dan 1.`);
    }
  }

  const totalDagingKg = bulat2(input.jumlahHewan * bobotPerEkorKg * rendemen);
  langkah.push(
    `Total daging = ${input.jumlahHewan} ekor × ${bobotPerEkorKg} kg ` +
      `× ${Math.round(rendemen * 100)}% rendemen = ${totalDagingKg} kg.`,
  );

  const paketMap: Record<AlokasiKelompok['kelompok'], number | undefined> = {
    shohibul: input.paketShohibul,
    fakirMiskin: input.paketFakirMiskin,
    kerabat: input.paketKerabat,
  };
  const namaMap: Record<AlokasiKelompok['kelompok'], string> = {
    shohibul: 'Shohibul qurban',
    fakirMiskin: 'Fakir miskin',
    kerabat: 'Kerabat/hadiah',
  };

  const alokasi: AlokasiKelompok[] = (
    Object.keys(namaMap) as AlokasiKelompok['kelompok'][]
  ).map((kelompok) => {
    const dagingKg = bulat2(totalDagingKg * rasio[kelompok]);
    const jumlahPaket = paketMap[kelompok];
    let beratPerPaketKg: number | null = null;
    if (jumlahPaket !== undefined) {
      harusBilanganBulatPositif(`Jumlah paket ${namaMap[kelompok]}`, jumlahPaket);
      beratPerPaketKg = bulat2(dagingKg / jumlahPaket);
    }
    return {
      kelompok,
      nama: namaMap[kelompok],
      dagingKg,
      jumlahPaket: jumlahPaket ?? null,
      beratPerPaketKg,
    };
  });

  // Sisa pembulatan: selisih total vs jumlah alokasi (jujur, bukan disembunyikan).
  const teralokasi = alokasi.reduce((s, a) => s + a.dagingKg, 0);
  const sisaPembulatanKg = bulat2(totalDagingKg - teralokasi);
  if (Math.abs(sisaPembulatanKg) > 0.005) {
    peringatan.push(
      `Sisa pembulatan ${sisaPembulatanKg} kg — bagikan manual atau masukkan ` +
        'ke salah satu kelompok.',
    );
  }

  if (input.rasio === undefined) {
    peringatan.push(
      'Memakai pembagian SEPERTIGA (praktik umum: 1/3 shohibul, 1/3 fakir ' +
        'miskin, 1/3 kerabat). Sesuaikan rasionya bila panitia memakai acuan lain.',
    );
  }
  if (input.bobotKg === undefined || input.rendemen === undefined) {
    peringatan.push(
      'Bobot/rendemen memakai angka acuan umum — ganti dengan hasil ' +
        'timbangan nyata agar akurat.',
    );
  }

  langkah.push(
    `Alokasi: shohibul ${alokasi[0].dagingKg} kg, fakir miskin ` +
      `${alokasi[1].dagingKg} kg, kerabat ${alokasi[2].dagingKg} kg.`,
  );

  return {
    hewan,
    jumlahHewan: input.jumlahHewan,
    bobotPerEkorKg,
    rendemen,
    totalDagingKg,
    alokasi,
    sisaPembulatanKg,
    peringatan,
    langkah,
  };
}

/** Ringkasan teks siap salin untuk grup panitia. */
export function formatQurbanTeks(h: HasilQurban): string {
  const out: string[] = [];
  out.push('QURBANKU — RINGKASAN PEMBAGIAN DAGING QURBAN');
  out.push(
    `${h.jumlahHewan} ekor ${h.hewan.nama} @ ${h.bobotPerEkorKg} kg, ` +
      `rendemen ${Math.round(h.rendemen * 100)}%`,
  );
  out.push(`Total daging: ${h.totalDagingKg} kg`);
  out.push('');
  h.alokasi.forEach((a, i) => {
    const paket =
      a.jumlahPaket !== null
        ? ` → ${a.jumlahPaket} paket @ ${a.beratPerPaketKg} kg`
        : '';
    out.push(`${i + 1}. ${a.nama}: ${a.dagingKg} kg${paket}`);
  });
  if (Math.abs(h.sisaPembulatanKg) > 0.005) {
    out.push(`Sisa pembulatan: ${h.sisaPembulatanKg} kg`);
  }
  if (h.peringatan.length > 0) {
    out.push('');
    out.push('Catatan:');
    h.peringatan.forEach((p) => out.push(`- ${p}`));
  }
  return out.join('\n');
}

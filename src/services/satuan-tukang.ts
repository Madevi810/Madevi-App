/**
 * Konverter Satuan Tukang Indonesia — Tools gratis (LOCAL_LIGHT).
 *
 * Satuan dagang bahan bangunan yang dipakai tukang/kontraktor Indonesia dan
 * tidak tersedia di konverter umum: zak semen, batang besi, lembar triplek,
 * dus keramik, kubik (m³), kaleng cat.
 *
 * Aturan kontrak (seperti utilities.ts):
 *  - Fungsi DETERMINISTIK dan murni. Input sama => output sama.
 *  - Tidak ada tebakan: satuan yang butuh data kemasan (isi dus, isi kaleng,
 *    diameter besi) WAJIB diisi user — tidak ada nilai default karangan.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

/** Kategori besaran — konversi hanya boleh dalam kategori yang sama. */
export type KategoriSatuan = 'MASSA' | 'VOLUME' | 'PANJANG' | 'LUAS';

export type ParamSatuan = 'diameterMm' | 'luasPerDus' | 'beratPerKaleng';

export interface DefinisiSatuan {
  key: string;
  label: string;
  kategori: KategoriSatuan;
  /**
   * Faktor ke satuan dasar kategori (kg / liter / meter / m²).
   * `null` berarti faktor dihitung dari parameter user (tidak ada default).
   */
  keDasar: number | null;
  param?: ParamSatuan;
  catatan?: string;
}

export interface InfoParam {
  key: ParamSatuan;
  label: string;
  satuan: string;
  dipakaiOleh: string[];
}

export const PARAM_INFO: InfoParam[] = [
  {
    key: 'diameterMm',
    label: 'Diameter besi',
    satuan: 'mm',
    dipakaiOleh: ['kgBesi'],
  },
  {
    key: 'luasPerDus',
    label: 'Luas per dus keramik',
    satuan: 'm²',
    dipakaiOleh: ['dus'],
  },
  {
    key: 'beratPerKaleng',
    label: 'Berat isi per kaleng cat',
    satuan: 'kg',
    dipakaiOleh: ['kaleng'],
  },
];

/** Satuan dasar tiap kategori: MASSA=kg, VOLUME=liter, PANJANG=meter, LUAS=m². */
export const DAFTAR_SATUAN: DefinisiSatuan[] = [
  // ---- MASSA (dasar: kg) ----
  { key: 'kg', label: 'kilogram (kg)', kategori: 'MASSA', keDasar: 1 },
  { key: 'gram', label: 'gram (g)', kategori: 'MASSA', keDasar: 0.001 },
  { key: 'ton', label: 'ton', kategori: 'MASSA', keDasar: 1000 },
  {
    key: 'zak',
    label: 'zak semen',
    kategori: 'MASSA',
    keDasar: 50,
    catatan: '1 zak semen = 50 kg (kemasan standar Indonesia)',
  },
  {
    key: 'kaleng',
    label: 'kaleng cat',
    kategori: 'MASSA',
    keDasar: null,
    param: 'beratPerKaleng',
    catatan: 'Isi kaleng berbeda per kemasan — wajib isi berat per kaleng (kg)',
  },
  // ---- VOLUME (dasar: liter) ----
  { key: 'liter', label: 'liter (L)', kategori: 'VOLUME', keDasar: 1 },
  { key: 'ml', label: 'mililiter (mL)', kategori: 'VOLUME', keDasar: 0.001 },
  {
    key: 'm3',
    label: 'meter kubik (m³ / kubik)',
    kategori: 'VOLUME',
    keDasar: 1000,
  },
  // ---- PANJANG (dasar: meter) ----
  { key: 'meter', label: 'meter (m)', kategori: 'PANJANG', keDasar: 1 },
  { key: 'cm', label: 'sentimeter (cm)', kategori: 'PANJANG', keDasar: 0.01 },
  { key: 'mm', label: 'milimeter (mm)', kategori: 'PANJANG', keDasar: 0.001 },
  {
    key: 'batang',
    label: 'batang besi',
    kategori: 'PANJANG',
    keDasar: 12,
    catatan: '1 batang besi beton = 12 m (panjang standar)',
  },
  {
    key: 'kgBesi',
    label: 'kilogram besi (kg)',
    kategori: 'PANJANG',
    keDasar: null,
    param: 'diameterMm',
    catatan: 'Dihitung dari diameter via berat jenis baja 7850 kg/m³',
  },
  // ---- LUAS (dasar: m²) ----
  { key: 'm2', label: 'meter persegi (m²)', kategori: 'LUAS', keDasar: 1 },
  {
    key: 'lembar',
    label: 'lembar triplek/GRC',
    kategori: 'LUAS',
    keDasar: 2.9768,
    catatan: 'Ukuran standar 122 × 244 cm = 2,9768 m²',
  },
  {
    key: 'dus',
    label: 'dus keramik',
    kategori: 'LUAS',
    keDasar: null,
    param: 'luasPerDus',
    catatan: 'Isi dus berbeda per merk/ukuran — wajib isi luas per dus (m²)',
  },
];

export interface ParamsKonversi {
  diameterMm?: number;
  luasPerDus?: number;
  beratPerKaleng?: number;
}

export interface HasilKonversi {
  nilai: number;
  satuan: string;
  langkah: string[];
}

/** Pembulatan stabil agar deterministik. */
function bulatkan(value: number, digits = 4): number {
  if (!Number.isFinite(value)) return NaN;
  const f = Math.pow(10, digits);
  return Math.round((value + Number.EPSILON) * f) / f;
}

export function satuanDariKey(key: string): DefinisiSatuan | null {
  return DAFTAR_SATUAN.find((s) => s.key === key) ?? null;
}

/** Berat besi beton per meter (kg/m) dari diameter — fisika, bukan tebakan. */
function beratBesiPerMeter(diameterMm: number): number {
  // Luas penampang lingkaran (m²) × berat jenis baja 7850 kg/m³.
  const luasM2 = Math.PI * Math.pow(diameterMm / 2000, 2);
  return luasM2 * 7850;
}

function faktorKeDasar(
  def: DefinisiSatuan,
  params: ParamsKonversi,
): number {
  if (def.keDasar !== null) return def.keDasar;
  switch (def.param) {
    case 'diameterMm': {
      const d = params.diameterMm;
      if (d === undefined || !Number.isFinite(d) || d <= 0) {
        throw new Error(
          'Diameter besi (mm) wajib diisi dengan angka > 0 — lihat spesifikasi besi yang dipakai',
        );
      }
      // kgBesi → meter: 1 kg = 1 / (kg per meter) meter.
      return 1 / beratBesiPerMeter(d);
    }
    case 'luasPerDus': {
      const l = params.luasPerDus;
      if (l === undefined || !Number.isFinite(l) || l <= 0) {
        throw new Error(
          'Luas per dus (m²) wajib diisi dengan angka > 0 — lihat kemasan dus keramik',
        );
      }
      return l;
    }
    case 'beratPerKaleng': {
      const b = params.beratPerKaleng;
      if (b === undefined || !Number.isFinite(b) || b <= 0) {
        throw new Error(
          'Berat isi per kaleng (kg) wajib diisi dengan angka > 0 — lihat kemasan kaleng cat',
        );
      }
      return b;
    }
    default:
      throw new Error(`Satuan "${def.key}" tidak punya faktor konversi`);
  }
}

/**
 * Konversi nilai dari satu satuan ke satuan lain dalam kategori yang sama.
 * Melempar Error berbahasa Indonesia bila input tidak valid.
 */
export function konversi(
  nilai: number,
  dariKey: string,
  keKey: string,
  params: ParamsKonversi = {},
): HasilKonversi {
  if (!Number.isFinite(nilai)) {
    throw new Error('Nilai harus berupa angka');
  }
  if (nilai < 0) {
    throw new Error('Nilai tidak boleh negatif');
  }
  const dari = satuanDariKey(dariKey);
  if (!dari) throw new Error(`Satuan asal "${dariKey}" tidak dikenal`);
  const ke = satuanDariKey(keKey);
  if (!ke) throw new Error(`Satuan tujuan "${keKey}" tidak dikenal`);
  if (dari.kategori !== ke.kategori) {
    throw new Error(
      `Tidak bisa konversi ${dari.label} ke ${ke.label} — beda besaran`,
    );
  }

  const faktorDari = faktorKeDasar(dari, params);
  const faktorKe = faktorKeDasar(ke, params);
  const dalamDasar = nilai * faktorDari;
  const hasil = dalamDasar / faktorKe;

  const dasarLabel =
    dari.kategori === 'MASSA'
      ? 'kg'
      : dari.kategori === 'VOLUME'
        ? 'liter'
        : dari.kategori === 'PANJANG'
          ? 'meter'
          : 'm²';

  const langkah: string[] = [
    `${nilai} ${dari.label} → satuan dasar: ${nilai} × ${faktorDari} = ${bulatkan(dalamDasar)} ${dasarLabel}`,
    `${bulatkan(dalamDasar)} ${dasarLabel} → ${ke.label}: ${bulatkan(dalamDasar)} ÷ ${faktorKe} = ${bulatkan(hasil)} ${ke.label}`,
  ];
  if (dari.catatan) langkah.push(`Catatan asal: ${dari.catatan}`);
  if (ke.catatan && ke.key !== dari.key) langkah.push(`Catatan tujuan: ${ke.catatan}`);

  return { nilai: bulatkan(hasil), satuan: ke.label, langkah };
}

/** Daftar key satuan per kategori — untuk membangun UI pemilih. */
export function satuanPerKategori(): Record<KategoriSatuan, string[]> {
  const hasil: Record<KategoriSatuan, string[]> = {
    MASSA: [],
    VOLUME: [],
    PANJANG: [],
    LUAS: [],
  };
  for (const s of DAFTAR_SATUAN) hasil[s.kategori].push(s.key);
  return hasil;
}

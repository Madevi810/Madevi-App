/**
 * Kalkulator Material & Estimasi RAB Mini Bangunan — engine jasa berbayar.
 *
 * Fungsi murni & deterministik: hitung kebutuhan material dari volume
 * pekerjaan, lalu estimasi biaya dari harga satuan yang diisi user.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Koefisien material adalah NILAI UMUM (estimasi awal tukang) dan selalu
 *    ditampilkan bersama catatan agar user menyesuaikan dengan kondisi
 *    lapangan. Bukan klaim standar SNI/AHSP.
 *  - Harga satuan TIDAK ditebak — wajib diisi user dari harga toko setempat.
 *    Material tanpa harga dilaporkan di `tanpaHarga`, bukan diisi nol diam-diam.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

/** Tier harga jasa — HEMAT Rp10rb–50rb, PRO Rp50rb–150rb (aturan inovasi 43). */
export interface RabTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Batas proyek tersimpan; -1 = tanpa batas. */
  batasProyek: number;
  fitur: string[];
}

export const RAB_TIERS: RabTier[] = [
  {
    id: 'HEMAT',
    nama: 'Paket Hemat',
    hargaRp: 25000,
    batasProyek: 5,
    fitur: [
      'Kalkulator 5 jenis pekerjaan',
      'Koefisien material bisa diubah sendiri',
      'Simpan sampai 5 proyek',
      'Riwayat perhitungan 30 hari',
    ],
  },
  {
    id: 'PRO',
    nama: 'Paket Pro',
    hargaRp: 99000,
    batasProyek: -1,
    fitur: [
      'Semua fitur Paket Hemat',
      'Proyek tanpa batas + multi-ruang per proyek (rekap otomatis)',
      'Riwayat harga satuan per material per toko',
      'Export ringkasan RAB (PDF)',
      'Prioritas revisi koefisien custom',
    ],
  },
];

export function tierDariId(id: string): RabTier | null {
  return RAB_TIERS.find((t) => t.id === id) ?? null;
}

export interface KoefisienMaterial {
  material: string;
  satuan: string;
  /** Kebutuhan per 1 satuan input pekerjaan (nilai umum, bisa diubah). */
  perUnit: number;
}

export interface JenisPekerjaan {
  id: string;
  nama: string;
  deskripsi: string;
  satuanInput: 'm2' | 'm3';
  labelInput: string;
  koefisien: KoefisienMaterial[];
  catatanKoefisien: string;
}

const CATATAN_UMUM =
  'Koefisien di bawah adalah nilai UMUM (estimasi awal). ' +
  'Selalu sesuaikan dengan kondisi lapangan, merk material, dan harga toko setempat.';

export const JENIS_PEKERJAAN: JenisPekerjaan[] = [
  {
    id: 'dinding_bata',
    nama: 'Pasangan Dinding Bata Merah',
    deskripsi: 'Dinding bata merah tebal ½ bata dengan spesi semen-pasir.',
    satuanInput: 'm2',
    labelInput: 'Luas dinding (m²)',
    koefisien: [
      { material: 'Bata merah', satuan: 'buah', perUnit: 70 },
      { material: 'Semen', satuan: 'zak', perUnit: 0.25 },
      { material: 'Pasir', satuan: 'm³', perUnit: 0.05 },
    ],
    catatanKoefisien: CATATAN_UMUM,
  },
  {
    id: 'plester_aci',
    nama: 'Plester + Acian Dinding',
    deskripsi: 'Plester semen-pasir dilanjut acian semen.',
    satuanInput: 'm2',
    labelInput: 'Luas dinding (m²)',
    koefisien: [
      { material: 'Semen', satuan: 'zak', perUnit: 0.15 },
      { material: 'Pasir', satuan: 'm³', perUnit: 0.02 },
    ],
    catatanKoefisien: CATATAN_UMUM,
  },
  {
    id: 'beton_campuran',
    nama: 'Cor Beton (campuran 1:2:3)',
    deskripsi: 'Beton campuran semen : pasir : kerikil = 1 : 2 : 3.',
    satuanInput: 'm3',
    labelInput: 'Volume cor (m³)',
    koefisien: [
      { material: 'Semen', satuan: 'zak', perUnit: 6.5 },
      { material: 'Pasir', satuan: 'm³', perUnit: 0.54 },
      { material: 'Kerikil', satuan: 'm³', perUnit: 0.81 },
    ],
    catatanKoefisien: CATATAN_UMUM,
  },
  {
    id: 'keramik_lantai',
    nama: 'Pasang Keramik Lantai',
    deskripsi: 'Keramik lantai dengan spesi semen-pasir (cadangan 10%).',
    satuanInput: 'm2',
    labelInput: 'Luas lantai (m²)',
    koefisien: [
      { material: 'Keramik', satuan: 'm²', perUnit: 1.1 },
      { material: 'Semen', satuan: 'zak', perUnit: 0.1 },
      { material: 'Pasir', satuan: 'm³', perUnit: 0.03 },
    ],
    catatanKoefisien: CATATAN_UMUM,
  },
  {
    id: 'cat_dinding',
    nama: 'Pengecatan Dinding',
    deskripsi: 'Cat tembok 2 lapis.',
    satuanInput: 'm2',
    labelInput: 'Luas dinding (m²)',
    koefisien: [{ material: 'Cat tembok', satuan: 'liter', perUnit: 0.2 }],
    catatanKoefisien: CATATAN_UMUM,
  },
];

export interface KebutuhanMaterial {
  material: string;
  satuan: string;
  jumlah: number;
}

export interface HasilKebutuhan {
  pekerjaanId: string;
  namaPekerjaan: string;
  volume: number;
  satuanInput: 'm2' | 'm3';
  rincian: KebutuhanMaterial[];
  catatanKoefisien: string;
}

function bulatkan(value: number, digits = 3): number {
  if (!Number.isFinite(value)) return NaN;
  const f = Math.pow(10, digits);
  return Math.round((value + Number.EPSILON) * f) / f;
}

export function pekerjaanDariId(id: string): JenisPekerjaan | null {
  return JENIS_PEKERJAAN.find((p) => p.id === id) ?? null;
}

/** Hitung kebutuhan material dari volume pekerjaan. */
export function hitungKebutuhan(
  pekerjaanId: string,
  volume: number,
): HasilKebutuhan {
  const pekerjaan = pekerjaanDariId(pekerjaanId);
  if (!pekerjaan) {
    throw new Error(`Jenis pekerjaan "${pekerjaanId}" tidak dikenal`);
  }
  if (!Number.isFinite(volume) || volume <= 0) {
    throw new Error('Volume pekerjaan harus angka lebih dari 0');
  }
  return {
    pekerjaanId: pekerjaan.id,
    namaPekerjaan: pekerjaan.nama,
    volume,
    satuanInput: pekerjaan.satuanInput,
    rincian: pekerjaan.koefisien.map((k) => ({
      material: k.material,
      satuan: k.satuan,
      jumlah: bulatkan(k.perUnit * volume),
    })),
    catatanKoefisien: pekerjaan.catatanKoefisien,
  };
}

export interface ItemBiaya extends KebutuhanMaterial {
  hargaSatuan: number | null;
  subtotal: number | null;
}

export interface HasilEstimasi {
  rincian: ItemBiaya[];
  totalRp: number;
  /** Material yang belum punya harga — tidak ikut total. */
  tanpaHarga: string[];
}

/**
 * Estimasi biaya dari kebutuhan material + harga satuan (Rp) per material.
 * Harga satuan WAJIB dari user; yang kosong dilaporkan, bukan ditebak.
 */
export function estimasiBiaya(
  kebutuhan: KebutuhanMaterial[],
  hargaSatuan: Record<string, number>,
): HasilEstimasi {
  const rincian: ItemBiaya[] = [];
  const tanpaHarga: string[] = [];
  let total = 0;
  for (const k of kebutuhan) {
    const harga = hargaSatuan[k.material];
    if (harga === undefined || harga === null || !Number.isFinite(harga)) {
      tanpaHarga.push(k.material);
      rincian.push({ ...k, hargaSatuan: null, subtotal: null });
      continue;
    }
    if (harga < 0) {
      throw new Error(`Harga satuan "${k.material}" tidak boleh negatif`);
    }
    const subtotal = Math.round(k.jumlah * harga);
    total += subtotal;
    rincian.push({ ...k, hargaSatuan: harga, subtotal });
  }
  return { rincian, totalRp: total, tanpaHarga };
}

export interface HasilCekProyek {
  boleh: boolean;
  pesan: string;
  perluUpgrade: boolean;
}

/** Cek batas proyek tersimpan sesuai tier. */
export function cekBatasProyek(
  tierId: string,
  jumlahProyekAktif: number,
): HasilCekProyek {
  const tier = tierDariId(tierId);
  if (!tier) throw new Error(`Tier "${tierId}" tidak dikenal`);
  if (tier.batasProyek === -1) {
    return {
      boleh: true,
      pesan: `${tier.nama}: proyek tanpa batas.`,
      perluUpgrade: false,
    };
  }
  if (jumlahProyekAktif < tier.batasProyek) {
    return {
      boleh: true,
      pesan: `${tier.nama}: ${jumlahProyekAktif}/${tier.batasProyek} proyek terpakai.`,
      perluUpgrade: false,
    };
  }
  return {
    boleh: false,
    pesan:
      `${tier.nama} hanya sampai ${tier.batasProyek} proyek. ` +
      'Hapus proyek lama atau upgrade ke Paket Pro.',
    perluUpgrade: true,
  };
}

/** Format rupiah Indonesia tanpa desimal: 125000 -> "Rp125.000". */
export function formatRupiah(nilai: number): string {
  if (!Number.isFinite(nilai)) throw new Error('Nilai rupiah harus angka');
  const bulat = Math.round(nilai);
  return 'Rp' + bulat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

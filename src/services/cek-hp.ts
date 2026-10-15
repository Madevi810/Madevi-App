/**
 * CekHP — asisten diagnostik HP bekas (engine jasa berbayar).
 *
 * Walkthrough pemeriksaan interaktif: user menjawab kondisi tiap item
 * saat memegang unitnya, engine menghitung skor 0–100, grade A/B/C/D,
 * dan menandai red flag keras.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Engine TIDAK menebak harga pasar — hanya menilai kondisi dari jawaban user.
 *    Harga tawar bersifat catatan opsional dari user, bukan hasil engine.
 *  - Bobot tiap item terbuka dan bisa dilihat user; skor murni penjumlahan bobot.
 *  - Red flag keras (IMEI tidak cocok, tidak ada sinyal) membatasi grade
 *    maksimal — ditampilkan eksplisit, bukan disembunyikan.
 *  - Semua item wajib dijawab; yang belum dijawab ditolak, bukan diasumsikan.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

/** Tier harga jasa — HEMAT Rp10rb–50rb, PRO Rp50rb–150rb (aturan inovasi 43). */
export interface CekHpTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Batas sesi cek tersimpan; -1 = tanpa batas. */
  batasSesi: number;
  fitur: string[];
}

export const CEK_HP_TIERS: CekHpTier[] = [
  {
    id: 'HEMAT',
    nama: 'Paket Hemat',
    hargaRp: 10000,
    batasSesi: 1,
    fitur: [
      '1 sesi cek HP bekas lengkap',
      '14 titik pemeriksaan terpandu',
      'Skor kondisi + grade A/B/C/D',
      'Laporan hasil bisa disalin',
    ],
  },
  {
    id: 'PRO',
    nama: 'Paket Pro',
    hargaRp: 50000,
    batasSesi: 10,
    fitur: [
      'Semua fitur Paket Hemat',
      '10 sesi cek tersimpan',
      'Riwayat per perangkat (bandingkan unit)',
      'Checklist cetak untuk dibawa saat cek unit',
    ],
  },
];

export function tierDariId(id: string): CekHpTier | null {
  return CEK_HP_TIERS.find((t) => t.id === id) ?? null;
}

export type JawabanCek = 'baik' | 'kurang' | 'rusak';

export interface ItemCek {
  id: string;
  kategori: string;
  label: string;
  /** Panduan singkat cara memeriksa item ini. */
  panduan: string;
  /** Bobot 1–100; total semua item = 100. */
  bobot: number;
  /** Red flag keras membatasi grade maksimal bila bermasalah. */
  redFlagKeras: boolean;
}

export const ITEM_CEK: ItemCek[] = [
  {
    id: 'body-mulus',
    kategori: 'Fisik & Body',
    label: 'Body mulus, tidak penyok/retak',
    panduan: 'Periksa sudut dan belakang HP di bawah cahaya; retak halus terlihat dari samping.',
    bobot: 6,
    redFlagKeras: false,
  },
  {
    id: 'tombol-fungsi',
    kategori: 'Fisik & Body',
    label: 'Semua tombol fisik berfungsi',
    panduan: 'Tekan tombol power dan volume satu per satu, pastikan ada respon.',
    bobot: 4,
    redFlagKeras: false,
  },
  {
    id: 'layar-nyala',
    kategori: 'Layar & Sentuh',
    label: 'Layar menyala normal tanpa garis/flek',
    panduan: 'Buka layar putih polos; cari garis, shadow, atau bercak di semua area.',
    bobot: 10,
    redFlagKeras: false,
  },
  {
    id: 'sentuh-responsif',
    kategori: 'Layar & Sentuh',
    label: 'Touchscreen responsif di semua area',
    panduan: 'Seret ikon ke seluruh layar; area yang macet berarti digitizer bermasalah.',
    bobot: 10,
    redFlagKeras: false,
  },
  {
    id: 'baterai-tahan',
    kategori: 'Baterai',
    label: 'Baterai tahan dipakai normal',
    panduan: 'Pakai 10 menit (video/kamera); baterai sehat tidak drop belasan persen.',
    bobot: 10,
    redFlagKeras: false,
  },
  {
    id: 'cas-normal',
    kategori: 'Baterai',
    label: 'Pengisian daya normal, tidak panas berlebih',
    panduan: 'Colok charger 5 menit; hangat wajar, panas menyengat tidak wajar.',
    bobot: 5,
    redFlagKeras: false,
  },
  {
    id: 'sinyal-ada',
    kategori: 'Sinyal & Jaringan',
    label: 'Sinyal seluler muncul dan bisa telepon',
    panduan: 'Pasang kartu SIM sendiri; pastikan sinyal muncul dan bisa menelepon.',
    bobot: 10,
    redFlagKeras: true,
  },
  {
    id: 'imei-cocok',
    kategori: 'IMEI & Keamanan',
    label: 'IMEI (*#06#) cocok dengan dus/body',
    panduan: 'Ketik *#06# lalu bandingkan dengan IMEI di dus dan body HP.',
    bobot: 12,
    redFlagKeras: true,
  },
  {
    id: 'bukti-milik',
    kategori: 'IMEI & Keamanan',
    label: 'Penjual menunjukkan bukti kepemilikan',
    panduan: 'Minta nota pembelian, dus asli, atau kwitansi; waspada unit tanpa identitas.',
    bobot: 8,
    redFlagKeras: false,
  },
  {
    id: 'kamera-depan',
    kategori: 'Kamera',
    label: 'Kamera depan jernih',
    panduan: 'Foto selfie; lensa berjamur terlihat buram permanen.',
    bobot: 5,
    redFlagKeras: false,
  },
  {
    id: 'kamera-belakang',
    kategori: 'Kamera',
    label: 'Kamera belakang jernih dan fokus normal',
    panduan: 'Foto objek dekat dan jauh; pastikan autofokus bekerja.',
    bobot: 5,
    redFlagKeras: false,
  },
  {
    id: 'speaker-mic',
    kategori: 'Sensor & Lainnya',
    label: 'Speaker dan mic jernih saat telepon',
    panduan: 'Telepon seseorang; cek suara pecah atau mic tidak terdengar.',
    bobot: 5,
    redFlagKeras: false,
  },
  {
    id: 'kunci-layar',
    kategori: 'Sensor & Lainnya',
    label: 'Fingerprint/face unlock berfungsi',
    panduan: 'Daftarkan sidik jari/wajah baru lalu coba buka kunci.',
    bobot: 5,
    redFlagKeras: false,
  },
  {
    id: 'wifi-bluetooth',
    kategori: 'Sensor & Lainnya',
    label: 'WiFi dan Bluetooth bisa terhubung',
    panduan: 'Sambungkan ke WiFi dan ke perangkat Bluetooth terdekat.',
    bobot: 5,
    redFlagKeras: false,
  },
];

const NILAI_JAWABAN: Record<JawabanCek, number> = {
  baik: 1,
  kurang: 0.5,
  rusak: 0,
};

const URUTAN_GRADE: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

export function itemDariId(id: string): ItemCek | null {
  return ITEM_CEK.find((i) => i.id === id) ?? null;
}

export interface HasilItem extends ItemCek {
  jawaban: JawabanCek;
  /** Kontribusi ke skor total (bobot × nilai jawaban). */
  kontribusi: number;
}

export interface HasilSesi {
  skor: number;
  grade: 'A' | 'B' | 'C' | 'D';
  /** Red flag keras yang bermasalah (label item). */
  redFlags: string[];
  /** Catatan perhatian untuk item rusak non-keras. */
  perhatian: string[];
  /** True bila grade dibatasi red flag keras (maksimal C). */
  gradeDibatasi: boolean;
  rincian: HasilItem[];
}

function gradeDariSkor(skor: number): 'A' | 'B' | 'C' | 'D' {
  if (skor >= 85) return 'A';
  if (skor >= 70) return 'B';
  if (skor >= 50) return 'C';
  return 'D';
}

/**
 * Nilai satu sesi cek dari jawaban user.
 * Semua 14 item wajib dijawab; jawaban asing/missing ditolak.
 */
export function nilaiSesi(hasil: Record<string, JawabanCek>): HasilSesi {
  const kunciAsing = Object.keys(hasil).filter((k) => !itemDariId(k));
  if (kunciAsing.length > 0) {
    throw new Error(`Item cek tidak dikenal: ${kunciAsing.join(', ')}`);
  }
  const belum = ITEM_CEK.filter((i) => !(i.id in hasil)).map((i) => i.id);
  if (belum.length > 0) {
    throw new Error(`Item belum dijawab: ${belum.join(', ')}`);
  }

  const rincian: HasilItem[] = ITEM_CEK.map((item) => {
    const jawaban = hasil[item.id];
    if (!(jawaban in NILAI_JAWABAN)) {
      throw new Error(`Jawaban "${item.id}" harus baik/kurang/rusak`);
    }
    return { ...item, jawaban, kontribusi: item.bobot * NILAI_JAWABAN[jawaban] };
  });

  const skor = Math.round(rincian.reduce((acc, r) => acc + r.kontribusi, 0));
  let grade = gradeDariSkor(skor);

  const redFlags = rincian
    .filter((r) => r.redFlagKeras && r.jawaban !== 'baik')
    .map((r) => r.label);
  const perhatian = rincian
    .filter((r) => !r.redFlagKeras && r.jawaban === 'rusak')
    .map((r) => r.label);

  // Red flag keras yang RUSAK membatasi grade maksimal C.
  let gradeDibatasi = false;
  const kerasRusak = rincian.some((r) => r.redFlagKeras && r.jawaban === 'rusak');
  if (kerasRusak && URUTAN_GRADE.indexOf(grade) < URUTAN_GRADE.indexOf('C')) {
    grade = 'C';
    gradeDibatasi = true;
  }

  return { skor, grade, redFlags, perhatian, gradeDibatasi, rincian };
}

export interface InfoPerangkat {
  merk: string;
  tipe: string;
  /** Harga tawar dari user — catatan saja, bukan hasil engine. */
  hargaTawarRp?: number;
}

/** Ringkasan laporan teks dari hasil sesi. */
export function buildRingkasan(hasil: HasilSesi, info: InfoPerangkat): string {
  const baris: string[] = [
    `HASIL CEK HP BEKAS — ${info.merk} ${info.tipe}`,
    `Skor kondisi: ${hasil.skor}/100 (Grade ${hasil.grade})`,
  ];
  if (hasil.gradeDibatasi) {
    baris.push('Catatan: grade dibatasi maksimal C karena ada red flag keras.');
  }
  if (hasil.redFlags.length > 0) {
    baris.push(`RED FLAG: ${hasil.redFlags.join('; ')}`);
  }
  if (hasil.perhatian.length > 0) {
    baris.push(`Perlu perhatian: ${hasil.perhatian.join('; ')}`);
  }
  const rusak = hasil.rincian.filter((r) => r.jawaban === 'rusak').length;
  const kurang = hasil.rincian.filter((r) => r.jawaban === 'kurang').length;
  baris.push(`Rincian: ${rusak} rusak, ${kurang} kurang, ${14 - rusak - kurang} baik dari 14 titik cek.`);
  if (info.hargaTawarRp !== undefined) {
    baris.push(`Harga tawar (catatan user): Rp${info.hargaTawarRp}.`);
  }
  baris.push('Skor dihitung dari jawaban Anda sendiri; bukan estimasi harga pasar.');
  return baris.join('\n');
}

export interface HasilCekSesi {
  boleh: boolean;
  pesan: string;
  perluUpgrade: boolean;
}

/** Cek batas sesi cek tersimpan sesuai tier. */
export function cekBatasSesi(tierId: string, jumlahSesi: number): HasilCekSesi {
  const tier = tierDariId(tierId);
  if (!tier) throw new Error(`Tier "${tierId}" tidak dikenal`);
  if (tier.batasSesi === -1) {
    return { boleh: true, pesan: `${tier.nama}: sesi tanpa batas.`, perluUpgrade: false };
  }
  if (jumlahSesi < tier.batasSesi) {
    return {
      boleh: true,
      pesan: `${tier.nama}: ${jumlahSesi}/${tier.batasSesi} sesi terpakai.`,
      perluUpgrade: false,
    };
  }
  return {
    boleh: false,
    pesan: `${tier.nama} hanya sampai ${tier.batasSesi} sesi. Upgrade ke Paket Pro untuk 10 sesi.`,
    perluUpgrade: true,
  };
}

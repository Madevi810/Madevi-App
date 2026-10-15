/**
 * Satuan Tanah — konverter satuan luas tanah Nusantara + estimasi luas petak
 * (engine Tools gratis).
 *
 * Petani & pemilik tanah Indonesia masih memakai satuan lokal: ubin/bata/
 * tumbak (Jawa Barat), bahu (Jawa), rante (Sumatera), are, hektar. Tool ini
 * mengkonversi antar satuan tersebut dan mengestimasi luas petak dari ukuran
 * keempat sisinya (cara yang dipakai di lapangan).
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Nilai default satuan lokal memakai nilai umum yang lazim; tiap satuan
 *    lokal membawa `catatan` yang jujur bahwa nilainya BISA BERBEDA antar
 *    daerah. Tidak ada klaim satu nilai berlaku nasional.
 *  - Estimasi luas memakai metode rata-rata sisi — cocok untuk petak yang
 *    mendekati segiempat; untuk bentuk tak beraturan hasilnya perkiraan,
 *    dinyatakan eksplisit di `catatan`.
 *  - Semua angka dari user; tidak ada default karangan.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

export interface SatuanTanah {
  key: string;
  label: string;
  /** Nilai 1 satuan ini dalam m². */
  keM2: number;
  /** Catatan kejujuran: variasi daerah dsb. */
  catatan?: string;
}

export const DAFTAR_SATUAN_TANAH: SatuanTanah[] = [
  { key: 'm2', label: 'meter persegi (m²)', keM2: 1 },
  { key: 'are', label: 'are', keM2: 100 },
  { key: 'hektar', label: 'hektar (ha)', keM2: 10000 },
  {
    key: 'ubin',
    label: 'ubin',
    keM2: 14.0625,
    catatan: 'Nilai standar 14,0625 m².',
  },
  {
    key: 'bata',
    label: 'bata (Jawa Barat)',
    keM2: 14.0625,
    catatan: 'Umumnya setara ubin; bisa berbeda antar daerah.',
  },
  {
    key: 'tumbak',
    label: 'tumbak (Jawa Barat)',
    keM2: 14.0625,
    catatan: 'Umumnya setara ubin; bisa berbeda antar daerah.',
  },
  {
    key: 'bahu',
    label: 'bahu (Jawa)',
    keM2: 7031.25,
    catatan: 'Nilai umum 500 ubin; bisa berbeda antar daerah — cek setempat.',
  },
  {
    key: 'rante',
    label: 'rante (Sumatera)',
    keM2: 400,
    catatan: 'Nilai umum di Aceh/Sumatera Utara; bisa berbeda antar daerah.',
  },
];

export function satuanTanahDariKey(key: string): SatuanTanah | null {
  return DAFTAR_SATUAN_TANAH.find((s) => s.key === key.toLowerCase()) ?? null;
}

export interface HasilKonversiTanah {
  nilai: number;
  satuan: string;
  langkah: string[];
}

/**
 * Konversi antar satuan luas tanah.
 * @throws bila nilai negatif/bukan angka atau satuan tidak dikenal.
 */
export function konversiTanah(
  nilai: number,
  dariKey: string,
  keKey: string,
): HasilKonversiTanah {
  if (!Number.isFinite(nilai)) throw new Error('Nilai harus berupa angka.');
  if (nilai < 0) throw new Error('Nilai luas tidak boleh negatif.');
  const dari = satuanTanahDariKey(dariKey);
  if (!dari) throw new Error(`Satuan tidak dikenal: "${dariKey}".`);
  const ke = satuanTanahDariKey(keKey);
  if (!ke) throw new Error(`Satuan tidak dikenal: "${keKey}".`);
  const dalamM2 = nilai * dari.keM2;
  const hasil = dalamM2 / ke.keM2;
  const langkah = [
    `${nilai} ${dari.label} = ${dalamM2} m²`,
    `${dalamM2} m² = ${hasil} ${ke.label}`,
  ];
  // Bulatkan ke 4 desimal agar tidak ada deret desimal panjang.
  const nilaiBulat = Math.round(hasil * 10000) / 10000;
  return { nilai: nilaiBulat, satuan: ke.label, langkah };
}

export interface HasilEstimasiLuas {
  /** Luas estimasi dalam m². */
  luasM2: number;
  langkah: string[];
  catatan: string;
}

/**
 * Estimasi luas petak segiempat dari keempat sisinya (meter).
 * sisiA & sisiC berhadapan, sisiB & sisiD berhadapan.
 * Metode rata-rata sisi — cara lapangan untuk petak mendekati segiempat.
 */
export function estimasiLuasSegi4(
  sisiA: number,
  sisiB: number,
  sisiC: number,
  sisiD: number,
): HasilEstimasiLuas {
  const sisi = [sisiA, sisiB, sisiC, sisiD];
  const nama = ['A', 'B', 'C', 'D'];
  sisi.forEach((s, i) => {
    if (!Number.isFinite(s)) throw new Error(`Sisi ${nama[i]} harus angka.`);
    if (s <= 0) throw new Error(`Sisi ${nama[i]} harus lebih dari 0.`);
  });
  const rataPanjang = (sisiA + sisiC) / 2;
  const rataLebar = (sisiB + sisiD) / 2;
  const luas = rataPanjang * rataLebar;
  return {
    luasM2: Math.round(luas * 100) / 100,
    langkah: [
      `Rata-rata sisi A–C: (${sisiA} + ${sisiC}) / 2 = ${rataPanjang} m`,
      `Rata-rata sisi B–D: (${sisiB} + ${sisiD}) / 2 = ${rataLebar} m`,
      `Luas ≈ ${rataPanjang} × ${rataLebar} = ${luas} m²`,
    ],
    catatan:
      'Metode rata-rata sisi: akurat untuk petak mendekati persegi/persegi ' +
      'panjang; untuk bentuk tak beraturan hasilnya hanya perkiraan.',
  };
}

/**
 * Kalkulator Bagi Hasil Tani — pembagi hasil panen untuk pemilik & penggarap lahan
 * (engine Tools gratis).
 *
 * Masalah: di desa, bagi hasil sawah/ladang (maro, mertelu, merpat, sewa kontan)
 * dihitung manual pakai kalkulator HP atau bahkan kira-kira di atas kertas —
 * rawan selisih paham soal: biaya dipotong dulu atau tidak, siapa menanggung
 * benih/pupuk, dan berapa tepatnya bagian tiap pihak dalam rupiah. Di internet
 * belum ada ALAT interaktif berbahasa Indonesia untuk ini — yang ada hanya
 * penjelasan artikel tentang istilah-istilahnya.
 *
 * Fungsi murni & deterministik. Tanpa koneksi eksternal.
 *
 * Kejujuran data (aturan konten Madevi #2, #25, #28):
 *  - Nama skema (maro/mertelu/merpat) mengikuti istilah umum di Jawa, tetapi
 *    engine TIDAK mengklaim satu angka baku adat: tiap preset menampilkan
 *    rasionya secara eksplisit (mis. mertelu = 1:2) dan berlabel "contoh umum".
 *    Angka final selalu mengikuti kesepakatan kedua belah pihak — tersedia
 *    skema 'kustom' untuk rasio bebas dan 'sewa' untuk sewa kontan.
 *  - Engine tidak menebak harga gabah atau biaya tani — semua angka diinput user.
 *  - Bila biaya melebihi hasil (rugi), engine menampilkannya apa adanya,
 *    bukan disembunyikan.
 */

export type SkemaBagiId = 'maro' | 'mertelu' | 'merpat' | 'sewa' | 'kustom';

export interface SkemaInfo {
  id: SkemaBagiId;
  nama: string;
  /** Rasio penggarap : pemilik. null untuk sewa (nominal tetap). */
  rasioPenggarap: number | null;
  rasioPemilik: number | null;
  /** Ditampilkan ke user — selalu menyebut rasio/nominal secara eksplisit. */
  catatan: string;
}

export const DAFTAR_SKEMA: SkemaInfo[] = [
  {
    id: 'maro',
    nama: 'Maro',
    rasioPenggarap: 1,
    rasioPemilik: 1,
    catatan:
      'Contoh umum: hasil dibagi dua sama rata — penggarap 1 : pemilik 1. ' +
      'Angka pasti mengikuti kesepakatan setempat.',
  },
  {
    id: 'mertelu',
    nama: 'Mertelu',
    rasioPenggarap: 1,
    rasioPemilik: 2,
    catatan:
      'Contoh umum: dibagi tiga — penggarap 1 : pemilik 2. ' +
      'Angka pasti mengikuti kesepakatan setempat.',
  },
  {
    id: 'merpat',
    nama: 'Merpat',
    rasioPenggarap: 1,
    rasioPemilik: 3,
    catatan:
      'Contoh umum: dibagi empat — penggarap 1 : pemilik 3. ' +
      'Angka pasti mengikuti kesepakatan setempat.',
  },
  {
    id: 'sewa',
    nama: 'Sewa kontan',
    rasioPenggarap: null,
    rasioPemilik: null,
    catatan:
      'Pemilik menerima nominal sewa TETAP yang disepakati; penggarap menerima ' +
      'sisa hasil setelah dikurangi sewa (dan biaya yang ditanggungnya).',
  },
  {
    id: 'kustom',
    nama: 'Rasio kustom',
    rasioPenggarap: null,
    rasioPemilik: null,
    catatan:
      'Tentukan sendiri perbandingan penggarap : pemilik sesuai kesepakatan.',
  },
];

export type PenanggungBiaya = 'pemilik' | 'penggarap' | 'proporsional' | 'sudah_dipotong';

export const DAFTAR_PENANGGUNG_BIAYA: { id: PenanggungBiaya; nama: string }[] = [
  { id: 'pemilik', nama: 'Pemilik lahan' },
  { id: 'penggarap', nama: 'Penggarap' },
  { id: 'proporsional', nama: 'Dipotong dari hasil lalu dibagi (proporsional)' },
  { id: 'sudah_dipotong', nama: 'Hasil input sudah bersih dari biaya' },
];

export interface InputBagiHasil {
  /** Nilai hasil panen kotor dalam rupiah (mis. kg gabah × harga/kg). */
  hasilKotorRp: number;
  skema: SkemaBagiId;
  /** Wajib bila skema = 'kustom'. */
  rasioPenggarap?: number;
  /** Wajib bila skema = 'kustom'. */
  rasioPemilik?: number;
  /** Wajib bila skema = 'sewa'. Nominal sewa tetap dalam rupiah. */
  nominalSewaRp?: number;
  /** Total biaya produksi (benih, pupuk, pestisida, tenaga). Default 0. */
  biayaRp?: number;
  penanggungBiaya: PenanggungBiaya;
}

export interface HasilBagi {
  hasilKotorRp: number;
  biayaRp: number;
  skema: SkemaInfo;
  /** Rupiah yang dibagi menurut rasio (setelah perlakuan biaya). */
  dasarBagiRp: number;
  rasioTampil: string;
  bagianPenggarapRp: number;
  bagianPemilikRp: number;
  /** Setelah dikurangi biaya yang ditanggung masing-masing pihak. */
  bersihPenggarapRp: number;
  bersihPemilikRp: number;
  /** true bila biaya melebihi hasil — ditampilkan jujur sebagai rugi. */
  rugi: boolean;
  langkah: string[];
}

function skemaDariId(id: string): SkemaInfo {
  const s = DAFTAR_SKEMA.find((x) => x.id === id);
  if (!s) {
    throw new Error(
      `Skema tidak dikenal: "${id}". Pilih: ${DAFTAR_SKEMA.map((x) => x.id).join(', ')}.`,
    );
  }
  return s;
}

function wajibAngka(nilai: unknown, nama: string, bolehNol: boolean): number {
  const n = Number(nilai);
  if (!Number.isFinite(n)) {
    throw new Error(`${nama} harus berupa angka.`);
  }
  if (n < 0 || (!bolehNol && n <= 0)) {
    throw new Error(`${nama} harus ${bolehNol ? '≥ 0' : '> 0'}.`);
  }
  return n;
}

const formatRp = (n: number): string =>
  `Rp${Math.round(n).toLocaleString('id-ID')}`;

/**
 * Hitung pembagian hasil panen antara pemilik lahan dan penggarap.
 * @throws bila input tidak valid (angka negatif/bukan angka, skema tak dikenal,
 *         rasio kustom/sewa tidak lengkap).
 */
export function hitungBagiHasil(input: InputBagiHasil): HasilBagi {
  const hasilKotorRp = wajibAngka(input.hasilKotorRp, 'Hasil kotor', true);
  const biayaInput = input.biayaRp ?? 0;
  const biayaRp = wajibAngka(biayaInput, 'Biaya produksi', true);
  const skema = skemaDariId(input.skema);

  const penanggung = input.penanggungBiaya;
  if (!DAFTAR_PENANGGUNG_BIAYA.some((p) => p.id === penanggung)) {
    throw new Error(
      `Penanggung biaya tidak dikenal: "${penanggung}". Pilih: ` +
        DAFTAR_PENANGGUNG_BIAYA.map((p) => p.id).join(', ') +
        '.',
    );
  }

  const langkah: string[] = [];
  langkah.push(`Hasil panen kotor: ${formatRp(hasilKotorRp)}.`);
  if (penanggung !== 'sudah_dipotong' && biayaRp > 0) {
    langkah.push(`Biaya produksi: ${formatRp(biayaRp)} (ditanggung: ${penanggung}).`);
  } else if (penanggung === 'sudah_dipotong') {
    langkah.push('Hasil input dianggap sudah bersih dari biaya.');
  }

  // Biaya yang masih perlu dialokasikan (0 bila sudah dipotong di awal).
  const biayaEfektif = penanggung === 'sudah_dipotong' ? 0 : biayaRp;

  let rasioTampil: string;
  let bagianPenggarapRp: number;
  let bagianPemilikRp: number;
  let dasarBagiRp: number;

  if (skema.id === 'sewa') {
    const nominalSewaRp = wajibAngka(input.nominalSewaRp, 'Nominal sewa', true);
    rasioTampil = `sewa tetap ${formatRp(nominalSewaRp)}`;
    dasarBagiRp = hasilKotorRp;
    bagianPemilikRp = Math.round(nominalSewaRp);
    bagianPenggarapRp = Math.round(hasilKotorRp - nominalSewaRp);
    langkah.push(
      `Skema sewa kontan: pemilik menerima tetap ${formatRp(nominalSewaRp)}; ` +
        `penggarap menerima sisa ${formatRp(hasilKotorRp)} − ${formatRp(nominalSewaRp)} = ${formatRp(bagianPenggarapRp)}.`,
    );
  } else {
    let rp: number | null = skema.rasioPenggarap;
    let rm: number | null = skema.rasioPemilik;
    if (skema.id === 'kustom') {
      rp = wajibAngka(input.rasioPenggarap, 'Rasio penggarap', false);
      rm = wajibAngka(input.rasioPemilik, 'Rasio pemilik', false);
    }
    const rasioP = rp as number;
    const rasioM = rm as number;
    const total = rasioP + rasioM;
    rasioTampil = `${skema.nama} — penggarap ${rasioP} : pemilik ${rasioM}`;

    if (penanggung === 'proporsional') {
      dasarBagiRp = hasilKotorRp - biayaEfektif;
      langkah.push(
        `Biaya dipotong dulu dari hasil (proporsional): ${formatRp(hasilKotorRp)} − ${formatRp(biayaEfektif)} = ${formatRp(dasarBagiRp)}.`,
      );
    } else {
      dasarBagiRp = hasilKotorRp;
      if (penanggung === 'pemilik') {
        langkah.push('Biaya tidak dipotong dari hasil — dibebankan ke bagian pemilik.');
      } else if (penanggung === 'penggarap') {
        langkah.push('Biaya tidak dipotong dari hasil — dibebankan ke bagian penggarap.');
      }
    }

    // Bulatkan satu sisi lalu turunkan sisi lain agar total pas.
    bagianPenggarapRp = Math.round((dasarBagiRp * rasioP) / total);
    bagianPemilikRp = Math.round(dasarBagiRp) - bagianPenggarapRp;
    langkah.push(
      `Dibagi ${rasioP}:${rasioM} dari ${formatRp(dasarBagiRp)} → ` +
        `penggarap ${formatRp(bagianPenggarapRp)}, pemilik ${formatRp(bagianPemilikRp)}.`,
    );
  }

  let bersihPenggarapRp = bagianPenggarapRp;
  let bersihPemilikRp = bagianPemilikRp;
  if (penanggung === 'pemilik') {
    bersihPemilikRp = bagianPemilikRp - Math.round(biayaEfektif);
    langkah.push(
      `Biaya ${formatRp(biayaEfektif)} dibebankan ke pemilik: ${formatRp(bagianPemilikRp)} − ${formatRp(biayaEfektif)} = ${formatRp(bersihPemilikRp)}.`,
    );
  } else if (penanggung === 'penggarap') {
    bersihPenggarapRp = bagianPenggarapRp - Math.round(biayaEfektif);
    langkah.push(
      `Biaya ${formatRp(biayaEfektif)} dibebankan ke penggarap: ${formatRp(bagianPenggarapRp)} − ${formatRp(biayaEfektif)} = ${formatRp(bersihPenggarapRp)}.`,
    );
  }

  const rugi = bersihPenggarapRp < 0 || bersihPemilikRp < 0;
  if (rugi) {
    langkah.push(
      'PERHATIAN: biaya melebihi hasil — ada pihak yang tekor. ' +
        'Pertimbangkan ulang kesepakatan atau skema.',
    );
  }

  return {
    hasilKotorRp: Math.round(hasilKotorRp),
    biayaRp: Math.round(biayaRp),
    skema,
    dasarBagiRp: Math.round(dasarBagiRp),
    rasioTampil,
    bagianPenggarapRp,
    bagianPemilikRp,
    bersihPenggarapRp,
    bersihPemilikRp,
    rugi,
    langkah,
  };
}

/** Format hasil menjadi teks siap tampil/salin. */
export function formatBagiHasilTeks(h: HasilBagi): string {
  const baris = [
    `BAGI HASIL TANI — ${h.rasioTampil}`,
    `Hasil kotor: ${formatRp(h.hasilKotorRp)} | Biaya: ${formatRp(h.biayaRp)}`,
    `Dasar bagi: ${formatRp(h.dasarBagiRp)}`,
    `• Penggarap terima: ${formatRp(h.bersihPenggarapRp)}`,
    `• Pemilik terima: ${formatRp(h.bersihPemilikRp)}`,
  ];
  if (h.rugi) {
    baris.push('Status: RUGI — biaya melebihi hasil.');
  }
  baris.push(
    '',
    'Catatan: preset maro/mertelu/merpat adalah contoh umum — angka final mengikuti kesepakatan kedua belah pihak.',
  );
  return baris.join('\n');
}

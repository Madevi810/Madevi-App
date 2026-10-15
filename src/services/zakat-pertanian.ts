/**
 * Kalkulator Zakat Hasil Pertanian — hitung zakat panen (engine Tools gratis).
 *
 * Masalah: petani Muslim sering bingung kapan panennya wajib zakat dan berapa
 * besarnya — nishabnya berapa kg? Kadarnya 10% atau 5%? Bedanya sawah tadah
 * hujan dengan yang pakai pompa air? Kalkulator zakat yang beredar di internet
 * umumnya hanya melayani zakat mal/profesi/fitrah; yang khusus HASIL PERTANIAN
 * hanya segelintir dan sering tanpa penjelasan nishab & kadar per jenis
 * pengairan.
 *
 * Fungsi murni & deterministik. Tanpa koneksi eksternal.
 *
 * Kejujuran data (aturan konten Madevi #2, #25, #28):
 *  - Parameter memakai ketentuan yang umum dirujuk (nishab 5 wasaq ≈ 653 kg
 *    gabah; kadar 10% tadah hujan / 5% irigasi berbiaya / 7,5% campuran;
 *    wajib saat panen tanpa haul) — dilabeli sebagai ketentuan umum.
 *  - Perbedaan pendapat antar madzhab TIDAK disembunyikan: ada catatan jujur
 *    dan anjuran memastikan ke BAZNAS/ustadz. Untuk palawija/buah yang bukan
 *    makanan pokok, nishab dihitung senilai (harga) — engine mendukung via
 *    nishab kustom.
 *  - Engine adalah alat hitung, bukan fatwa: tidak memutuskan status hukum
 *    per kasus di luar angka.
 */

/** Kadar zakat menurut jumhur untuk tiap jenis pengairan. */
export type PengairanId = 'hujan' | 'irigasi' | 'campuran';

export interface PengairanInfo {
  id: PengairanId;
  nama: string;
  /** Kadar desimal: 0.10 = 10%. */
  kadar: number;
  penjelasan: string;
}

export const DAFTAR_PENGAIRAN: PengairanInfo[] = [
  {
    id: 'hujan',
    nama: 'Tadah hujan / tanpa biaya irigasi',
    kadar: 0.1,
    penjelasan:
      'Diairi hujan, sungai, atau mata air tanpa biaya — kadar 1/10 (10%).',
  },
  {
    id: 'irigasi',
    nama: 'Irigasi dengan biaya',
    kadar: 0.05,
    penjelasan:
      'Diairi dengan mengeluarkan biaya (pompa air, sewa air, dst.) — kadar 1/20 (5%).',
  },
  {
    id: 'campuran',
    nama: 'Campuran keduanya',
    kadar: 0.075,
    penjelasan:
      'Sebagian tadah hujan, sebagian memakai biaya — kadar tengah 7,5%.',
  },
];

/**
 * Nishab default (kg gabah kering) — angka umum setara 5 wasaq yang dipakai
 * luas. Dapat dioverride untuk komoditas non-pokok (dihitung senilai).
 */
export const NISHAB_KG_DEFAULT = 653;

export interface InputZakat {
  /** Hasil panen dalam kg (gabah kering / komoditas). */
  hasilKg: number;
  pengairan: PengairanId;
  /** Harga per kg (Rp) — opsional, untuk menampilkan nominal rupiah. */
  hargaPerKgRp?: number;
  /** Override nishab (kg). Default 653. */
  nishabKg?: number;
}

export interface HasilZakat {
  wajib: boolean;
  hasilKg: number;
  nishabKg: number;
  pengairan: PengairanInfo;
  /** 0 bila belum mencapai nishab. */
  zakatKg: number;
  /** undefined bila harga tidak diinput. */
  zakatRp?: number;
  langkah: string[];
  catatan: string[];
}

function pengairanDariId(id: string): PengairanInfo {
  const p = DAFTAR_PENGAIRAN.find((x) => x.id === id);
  if (!p) {
    throw new Error(
      `Jenis pengairan tidak dikenal: "${id}". Pilih: ${DAFTAR_PENGAIRAN.map((x) => x.id).join(', ')}.`,
    );
  }
  return p;
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
 * Hitung zakat hasil pertanian.
 * @throws bila input tidak valid (angka negatif/bukan angka, pengairan tak dikenal).
 */
export function hitungZakatPertanian(input: InputZakat): HasilZakat {
  const hasilKg = wajibAngka(input.hasilKg, 'Hasil panen', false);
  const pengairan = pengairanDariId(input.pengairan);
  const nishabKg = input.nishabKg === undefined ? NISHAB_KG_DEFAULT : wajibAngka(input.nishabKg, 'Nishab', false);
  const harga =
    input.hargaPerKgRp === undefined
      ? undefined
      : wajibAngka(input.hargaPerKgRp, 'Harga per kg', true);

  const langkah: string[] = [];
  langkah.push(`Hasil panen: ${hasilKg} kg.`);
  langkah.push(`Nishab: ${nishabKg} kg (≈ 5 wasaq, angka umum).`);
  langkah.push(`Pengairan: ${pengairan.nama} → kadar ${pengairan.kadar * 100}%.`);

  const catatan: string[] = [
    'Zakat pertanian dibayar SAAT PANEN — tidak menunggu haul (satu tahun).',
    'Nishab 653 kg adalah angka umum setara 5 wasaq untuk gabah/padi. Untuk palawija, buah, atau sayur yang bukan makanan pokok, nishab dihitung SENILAI — gunakan kolom nishab kustom.',
    'Ketentuan dapat berbeda menurut madzhab dan kondisi setempat. Pastikan ke BAZNAS/lembaga amil atau ustadz sebelum menunaikan.',
  ];

  if (hasilKg < nishabKg) {
    langkah.push(
      `${hasilKg} kg < ${nishabKg} kg — belum mencapai nishab, belum wajib zakat.`,
    );
    return {
      wajib: false,
      hasilKg,
      nishabKg,
      pengairan,
      zakatKg: 0,
      langkah,
      catatan,
    };
  }

  // Bulatkan ke 2 desimal agar kg tidak menjadi pecahan aneh.
  const zakatKg = Math.round(hasilKg * pengairan.kadar * 100) / 100;
  const zakatRp = harga === undefined ? undefined : Math.round(zakatKg * harga);
  langkah.push(
    `Mencapai nishab → zakat = ${hasilKg} kg × ${pengairan.kadar * 100}% = ${zakatKg} kg` +
      (zakatRp !== undefined ? ` (≈ ${formatRp(zakatRp)}).` : '.'),
  );

  return {
    wajib: true,
    hasilKg,
    nishabKg,
    pengairan,
    zakatKg,
    zakatRp,
    langkah,
    catatan,
  };
}

/** Format hasil menjadi teks siap tampil/salin. */
export function formatZakatTeks(h: HasilZakat): string {
  const baris = [
    `ZAKAT HASIL PERTANIAN — ${h.pengairan.nama}`,
    `Hasil: ${h.hasilKg} kg | Nishab: ${h.nishabKg} kg`,
  ];
  if (!h.wajib) {
    baris.push('Status: BELUM WAJIB — hasil di bawah nishab.');
  } else {
    baris.push(
      `Zakat wajib: ${h.zakatKg} kg` +
        (h.zakatRp !== undefined ? ` (≈ ${formatRp(h.zakatRp)})` : ''),
    );
  }
  baris.push('', 'Alat hitung — pastikan ketentuan ke BAZNAS/ustadz.');
  return baris.join('\n');
}

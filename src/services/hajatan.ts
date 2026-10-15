/**
 * HajatanKu — kalkulator kebutuhan hajatan (engine jasa berbayar).
 *
 * Tuan rumah hajatan (pernikahan, sunatan, syukuran, tahlilan) sering bingung
 * memperkirakan kebutuhan: berapa kg beras, berapa ekor ayam, berapa kursi
 * dan tenda untuk N tamu. Yang ada di internet hanya artikel statis berisi
 * rumus per orang — belum ada kalkulator interaktif berbahasa Indonesia yang
 * menghitung dari jumlah tamu menjadi daftar kebutuhan siap belanja.
 *
 * Fungsi murni & deterministik: menghitung kebutuhan bahan + perlengkapan
 * dari jumlah tamu dan koefisien per porsi.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Koefisien default memakai angka umum yang beredar di panduan katering/
 *    kenduri (dicantumkan sumbernya di bawah); SEMUA koefisien bisa diubah
 *    user via `koefisien` — engine tidak memaksa satu angka.
 *  - Engine TIDAK menebak harga — hanya menghitung JUMLAH kebutuhan,
 *    bukan rupiah. Tidak ada harga barang di sini (aturan #31 dipatuhi).
 *  - Buffer cadangan dinyatakan eksplisit sebagai asumsi, bukan fakta.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 *
 * Sumber koefisien default:
 *  - Beras 1 kg ≈ 10 porsi; daging 1 kg ≈ 10 porsi; ayam 1 ekor (potong 16)
 *    ≈ 16 porsi; mie 1 pak ≈ 6 porsi; gula 1 kg ≈ 60 gelas minuman —
 *    panduan sukatan masakan kenduri (Lemon8 @kakrai81).
 *  - Tambahan porsi cadangan 5–10% — praktik umum vendor katering
 *    (investor.id, artikel hitung catering pernikahan).
 *  - Kursi & tenda: fraksi/angka awal yang lazim di lapangan, bisa diubah.
 */

/** Tier harga jasa — HEMAT Rp10rb–50rb, PRO Rp50rb–150rb (aturan inovasi 43). */
export interface HajatanTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Batas acara per bulan; -1 = tanpa batas. */
  batasAcaraPerBulan: number;
  /** Jumlah skenario menu yang bisa disimpan per acara. */
  maksSkenario: number;
  fitur: string[];
}

export const HAJATAN_TIERS: HajatanTier[] = [
  {
    id: 'HEMAT',
    nama: 'Paket Hemat',
    hargaRp: 15000,
    batasAcaraPerBulan: 3,
    maksSkenario: 1,
    fitur: [
      'Sampai 3 acara per bulan',
      '1 skenario menu per acara (prasmanan / nasi kotak)',
      'Estimasi bahan + kursi + tenda dari jumlah tamu',
      'Langkah perhitungan terbuka',
    ],
  },
  {
    id: 'PRO',
    nama: 'Paket Pro',
    hargaRp: 75000,
    batasAcaraPerBulan: -1,
    maksSkenario: 3,
    fitur: [
      'Semua fitur Paket Hemat',
      'Acara tanpa batas per bulan',
      '3 skenario menu per acara (bandingkan prasmanan vs nasi kotak)',
      'Koefisien custom tersimpan + daftar belanja teks siap cetak',
    ],
  },
];

export function tierDariId(id: string): HajatanTier | null {
  return HAJATAN_TIERS.find((t) => t.id === id) ?? null;
}

export type JenisHidangan = 'PRASMANAN' | 'NASI_KOTAK';

export const JENIS_HIDANGAN: { id: JenisHidangan; nama: string; deskripsi: string }[] = [
  {
    id: 'PRASMANAN',
    nama: 'Prasmanan (masak sendiri)',
    deskripsi: 'Hidangan dimasak gotong royong; tamu mengambil sendiri.',
  },
  {
    id: 'NASI_KOTAK',
    nama: 'Nasi kotak',
    deskripsi: 'Satu kotak per tamu: nasi + lauk + minuman dalam kemasan.',
  },
];

export function jenisHidanganDariId(id: string): { id: JenisHidangan; nama: string; deskripsi: string } | null {
  return JENIS_HIDANGAN.find((j) => j.id === id) ?? null;
}

/**
 * Koefisien per porsi. Semua nilai default adalah TITIK AWAL yang lazim —
 * user WAJIB bisa mengubahnya; engine tidak mengklaim satu angka mutlak.
 */
export interface KoefisienHajatan {
  /** Porsi nasi per 1 kg beras. Default 10. */
  porsiPerKgBeras: number;
  /** Porsi per 1 ekor ayam (potong standar). Default 16. */
  porsiPerEkorAyam: number;
  /** Porsi per 1 kg daging. Default 10. */
  porsiPerKgDaging: number;
  /** Porsi per 1 pak mie. Default 6. */
  porsiPerPakMie: number;
  /** Gelas minuman per 1 kg gula. Default 60. */
  gelasPerKgGula: number;
  /** Fraksi tamu yang duduk dalam satu waktu (0–1). Default 0.6. */
  fraksiKursi: number;
  /** Kapasitas tamu per 1 unit tenda sewa. Default 50. */
  tamuPerTenda: number;
  /** Cadangan tambahan sebagai fraksi (0–0.5). Default 0.1. */
  buffer: number;
}

export const KOEFISIEN_DEFAULT: KoefisienHajatan = {
  porsiPerKgBeras: 10,
  porsiPerEkorAyam: 16,
  porsiPerKgDaging: 10,
  porsiPerPakMie: 6,
  gelasPerKgGula: 60,
  fraksiKursi: 0.6,
  tamuPerTenda: 50,
  buffer: 0.1,
};

function gabungKoefisien(custom?: Partial<KoefisienHajatan>): KoefisienHajatan {
  const k = { ...KOEFISIEN_DEFAULT, ...(custom ?? {}) };
  const cek: [string, number, number, number][] = [
    ['porsiPerKgBeras', k.porsiPerKgBeras, 0.01, 1000],
    ['porsiPerEkorAyam', k.porsiPerEkorAyam, 0.01, 1000],
    ['porsiPerKgDaging', k.porsiPerKgDaging, 0.01, 1000],
    ['porsiPerPakMie', k.porsiPerPakMie, 0.01, 1000],
    ['gelasPerKgGula', k.gelasPerKgGula, 0.01, 10000],
    ['fraksiKursi', k.fraksiKursi, 0.01, 1],
    ['tamuPerTenda', k.tamuPerTenda, 1, 10000],
    ['buffer', k.buffer, 0, 0.5],
  ];
  for (const [nama, nilai, min, maks] of cek) {
    if (!Number.isFinite(nilai) || nilai < min || nilai > maks) {
      throw new Error(`Koefisien "${nama}" harus angka antara ${min} dan ${maks}.`);
    }
  }
  return k;
}

export interface InputHajatan {
  /** Nama acara — wajib diisi user, tidak dikarang engine. */
  namaAcara: string;
  /** Jumlah tamu undangan — bilangan bulat 1..100000. */
  jumlahTamu: number;
  jenisHidangan: JenisHidangan;
  koefisien?: Partial<KoefisienHajatan>;
}

export interface KebutuhanItem {
  nama: string;
  /** Jumlah beli — selalu dibulatkan KE ATAS ke satuan praktis. */
  jumlah: number;
  satuan: string;
  langkah: string;
}

export interface HasilHajatan {
  namaAcara: string;
  jumlahTamu: number;
  /** Tamu + buffer cadangan. */
  tamuEfektif: number;
  jenisHidangan: JenisHidangan;
  items: KebutuhanItem[];
  catatan: string[];
}

function bulatKeAtas(nilai: number, kelipatan = 1): number {
  // Epsilon: cegah debu floating-point (mis. 220.00000000000003) membuat
  // pembulatan ke atas kelebihan 1 unit.
  return Math.ceil(nilai / kelipatan - 1e-9) * kelipatan;
}

/**
 * Hitung kebutuhan hajatan dari jumlah tamu.
 * @throws bila input tidak valid.
 */
export function hitungHajatan(input: InputHajatan): HasilHajatan {
  if (!input.namaAcara || input.namaAcara.trim().length === 0) {
    throw new Error('Nama acara wajib diisi.');
  }
  if (!Number.isInteger(input.jumlahTamu) || input.jumlahTamu < 1 || input.jumlahTamu > 100000) {
    throw new Error('Jumlah tamu harus bilangan bulat 1–100000.');
  }
  const jenis = jenisHidanganDariId(input.jenisHidangan);
  if (!jenis) throw new Error(`Jenis hidangan tidak dikenal: "${input.jenisHidangan}".`);

  const k = gabungKoefisien(input.koefisien);
  // Epsilon: cegah debu floating-point (200 × 1.1 = 220.00000000000003)
  // membuat tamu efektif kelebihan 1.
  const tamuEfektif = Math.ceil(input.jumlahTamu * (1 + k.buffer) - 1e-9);

  const items: KebutuhanItem[] = [];
  const push = (nama: string, mentah: number, satuan: string, langkah: string, kelipatan = 1) => {
    items.push({ nama, jumlah: bulatKeAtas(mentah, kelipatan), satuan, langkah });
  };

  // Beras — dipakai kedua jenis hidangan.
  const berasKg = tamuEfektif / k.porsiPerKgBeras;
  push(
    'Beras',
    berasKg,
    'kg',
    `${tamuEfektif} porsi ÷ ${k.porsiPerKgBeras} porsi/kg = ${berasKg.toFixed(2)} kg → beli ${bulatKeAtas(berasKg)} kg`,
  );

  if (input.jenisHidangan === 'PRASMANAN') {
    const ayamEkor = tamuEfektif / k.porsiPerEkorAyam;
    push(
      'Ayam (utuh)',
      ayamEkor,
      'ekor',
      `${tamuEfektif} porsi ÷ ${k.porsiPerEkorAyam} porsi/ekor = ${ayamEkor.toFixed(2)} ekor → siapkan ${bulatKeAtas(ayamEkor)} ekor`,
    );
    const dagingKg = tamuEfektif / k.porsiPerKgDaging;
    push(
      'Daging',
      dagingKg,
      'kg',
      `${tamuEfektif} porsi ÷ ${k.porsiPerKgDaging} porsi/kg = ${dagingKg.toFixed(2)} kg → beli ${bulatKeAtas(dagingKg)} kg`,
    );
    const miePak = tamuEfektif / k.porsiPerPakMie;
    push(
      'Mie (pak)',
      miePak,
      'pak',
      `${tamuEfektif} porsi ÷ ${k.porsiPerPakMie} porsi/pak = ${miePak.toFixed(2)} pak → beli ${bulatKeAtas(miePak)} pak`,
    );
    const gulaKg = tamuEfektif / k.gelasPerKgGula;
    push(
      'Gula (untuk minuman)',
      gulaKg,
      'kg',
      `${tamuEfektif} gelas ÷ ${k.gelasPerKgGula} gelas/kg = ${gulaKg.toFixed(2)} kg → beli ${bulatKeAtas(gulaKg)} kg`,
    );
  } else {
    // NASI_KOTAK: lauk per kotak mengikuti porsi ayam; minuman 1 kemasan per tamu.
    const ayamEkor = tamuEfektif / k.porsiPerEkorAyam;
    push(
      'Ayam (untuk lauk kotak)',
      ayamEkor,
      'ekor',
      `${tamuEfektif} kotak ÷ ${k.porsiPerEkorAyam} porsi/ekor = ${ayamEkor.toFixed(2)} ekor → siapkan ${bulatKeAtas(ayamEkor)} ekor`,
    );
    push(
      'Minuman kemasan',
      tamuEfektif,
      'pcs',
      `1 kemasan per tamu × ${tamuEfektif} tamu efektif = ${tamuEfektif} pcs`,
    );
    push(
      'Kotak + sendok',
      tamuEfektif,
      'set',
      `1 set per tamu × ${tamuEfektif} tamu efektif = ${tamuEfektif} set`,
    );
  }

  // Perlengkapan — kedua jenis hidangan.
  const kursi = tamuEfektif * k.fraksiKursi;
  push(
    'Kursi',
    kursi,
    'buah',
    `${tamuEfektif} tamu × ${k.fraksiKursi} (duduk bergantian) = ${kursi.toFixed(1)} → siapkan ${bulatKeAtas(kursi)} buah`,
  );
  const tenda = tamuEfektif / k.tamuPerTenda;
  push(
    'Tenda (sewa)',
    tenda,
    'unit',
    `${tamuEfektif} tamu ÷ ${k.tamuPerTenda} tamu/unit = ${tenda.toFixed(2)} → sewa ${bulatKeAtas(tenda)} unit`,
  );

  const catatan = [
    `Tamu efektif ${tamuEfektif} = ${input.jumlahTamu} tamu + buffer ${(k.buffer * 100).toFixed(0)}% cadangan.`,
    'Semua jumlah dibulatkan ke atas — lebih baik sisa daripada kurang di hari-H.',
    'Koefisien di atas adalah titik awal umum; sesuaikan dengan kebiasaan masak keluarga/daerah Anda.',
    'Engine ini menghitung JUMLAH kebutuhan, bukan harga — cek harga pasar setempat untuk anggaran.',
  ];

  return {
    namaAcara: input.namaAcara.trim(),
    jumlahTamu: input.jumlahTamu,
    tamuEfektif,
    jenisHidangan: input.jenisHidangan,
    items,
    catatan,
  };
}

export interface HasilCekAcara {
  boleh: boolean;
  pesan: string;
}

/** Cek batas acara per bulan untuk tier. */
export function cekBatasAcara(tierId: string, jumlahBulanIni: number): HasilCekAcara {
  const tier = tierDariId(tierId);
  if (!tier) throw new Error(`Tier tidak dikenal: "${tierId}".`);
  if (!Number.isInteger(jumlahBulanIni) || jumlahBulanIni < 0) {
    throw new Error('Jumlah acara bulan ini harus bilangan bulat ≥ 0.');
  }
  if (tier.batasAcaraPerBulan !== -1 && jumlahBulanIni >= tier.batasAcaraPerBulan) {
    return {
      boleh: false,
      pesan: `Batas ${tier.nama} (${tier.batasAcaraPerBulan} acara/bulan) tercapai. Upgrade ke Paket Pro untuk acara tanpa batas.`,
    };
  }
  return { boleh: true, pesan: 'OK' };
}

/** Format daftar belanja teks — siap salin ke WhatsApp / cetak. */
export function formatDaftarBelanja(hasil: HasilHajatan): string {
  const baris = [
    `DAFTAR KEBUTUHAN — ${hasil.namaAcara}`,
    `Tamu: ${hasil.jumlahTamu} (efektif ${hasil.tamuEfektif} dgn buffer) • ${jenisHidanganDariId(hasil.jenisHidangan)?.nama}`,
    '─'.repeat(32),
  ];
  hasil.items.forEach((it, i) => {
    baris.push(`${i + 1}. ${it.nama}: ${it.jumlah} ${it.satuan}`);
  });
  baris.push('─'.repeat(32));
  baris.push(...hasil.catatan);
  return baris.join('\n');
}

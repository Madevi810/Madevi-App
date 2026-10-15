/**
 * UmrohKu — perencana anggaran umroh mandiri vs travel (engine Services berbayar).
 *
 * Calon jemaah Indonesia bingung memilih umroh mandiri atau paket travel —
 * yang ada di internet hanya artikel perbandingan statis (alshatravel,
 * aistourtravel, poparena24, skorcard, bizbox, medium). Kalkulator
 * interaktif tidak ada.
 *
 * Cara pakai: user mengisi SENDIRI tiap komponen biaya umroh mandiri
 * (tiket, visa, hotel, makan, transport, muthawif, ziarah, perlengkapan,
 * dana darurat) + harga paket travel → engine menghasilkan tabel
 * perbandingan, selisih, verdict logis, timeline tabungan, dan checklist
 * persiapan. Pola engine berdiri sendiri seperti WasiatKu/ProposalKu
 * (API + halaman + katalog DB = tahap berikut).
 *
 * Kejujuran (aturan konten Madevi):
 *  - Engine TIDAK menebak harga (aturan #31): SEMUA angka biaya berasal
 *    dari input user; komponen yang tidak diisi dihitung Rp0 + peringatan.
 *  - BUKAN biro travel resmi — disclaimer tegas di setiap output; user
 *    diarahkan memverifikasi travel berizin Kemenag.
 *  - Catatan risiko umroh mandiri dilabeli umum/edukasi, bukan nasihat.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal dan deterministik.
 */

export interface UmrohTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Maksimal jemaah per rencana. */
  maksJemaah: number;
  /** Maksimal skenario perbandingan dalam satu order. */
  maksSkenario: number;
  timelineTabungan: boolean;
  analisisSensitivitas: boolean;
  checklistLengkap: boolean;
  deskripsi: string;
}

export const UMROH_TIERS: UmrohTier[] = [
  {
    id: 'HEMAT',
    nama: 'Hemat',
    hargaRp: 25000,
    maksJemaah: 4,
    maksSkenario: 1,
    timelineTabungan: false,
    analisisSensitivitas: false,
    checklistLengkap: false,
    deskripsi:
      '1 skenario perbandingan, sampai 4 jemaah, perbandingan dasar, ' +
      'checklist inti 12 item.',
  },
  {
    id: 'PRO',
    nama: 'Pro',
    hargaRp: 99000,
    maksJemaah: 12,
    maksSkenario: 3,
    timelineTabungan: true,
    analisisSensitivitas: true,
    checklistLengkap: true,
    deskripsi:
      '3 skenario perbandingan, sampai 12 jemaah, timeline tabungan, ' +
      'analisis sensitivitas ±10%, checklist lengkap 40 item.',
  },
];

export function tierUmrohDariId(id: string): UmrohTier | null {
  return UMROH_TIERS.find((t) => t.id === id) ?? null;
}

export interface KomponenBiayaUmroh {
  id: string;
  nama: string;
  keterangan: string;
}

/** 10 komponen biaya umroh mandiri — nilai Rp SELALU dari input user. */
export const KOMPONEN_BIAYA_UMROH: KomponenBiayaUmroh[] = [
  {
    id: 'tiket-pp',
    nama: 'Tiket pesawat PP',
    keterangan: 'Indonesia – Jeddah/Madinah, pulang-pergi per jemaah.',
  },
  {
    id: 'visa-asuransi',
    nama: 'Visa umroh + asuransi',
    keterangan: 'Biaya visa dan asuransi perjalanan per jemaah.',
  },
  {
    id: 'hotel-mekkah',
    nama: 'Hotel Mekkah',
    keterangan: 'Total menginap di Mekkah selama durasi.',
  },
  {
    id: 'hotel-madinah',
    nama: 'Hotel Madinah',
    keterangan: 'Total menginap di Madinah selama durasi.',
  },
  {
    id: 'transport-lokal',
    nama: 'Transportasi lokal',
    keterangan: 'Taksi, bus, atau kereta cepat antar kota.',
  },
  {
    id: 'makan',
    nama: 'Makan',
    keterangan: 'Estimasi makan selama di Tanah Suci.',
  },
  {
    id: 'muthawif',
    nama: 'Muthawif / pembimbing',
    keterangan: 'Bila menyewa pembimbing sendiri (0 bila tidak pakai).',
  },
  {
    id: 'ziarah',
    nama: 'Ziarah & city tour',
    keterangan: 'Sewa mobil/pemandu untuk ziarah.',
  },
  {
    id: 'perlengkapan',
    nama: 'Perlengkapan',
    keterangan: 'Koper, kain ihram, obat pribadi, dan lain-lain.',
  },
  {
    id: 'dana-darurat',
    nama: 'Dana darurat',
    keterangan: 'Cadangan tak terduga selama perjalanan.',
  },
];

export function komponenUmrohDariId(id: string): KomponenBiayaUmroh | null {
  return KOMPONEN_BIAYA_UMROH.find((k) => k.id === id) ?? null;
}

export type VerdictUmroh =
  | 'MANDIRI_LEBIH_HEMAT'
  | 'TRAVEL_LEBIH_HEMAT'
  | 'SEIMBANG';

/** Selisih < 5% dari harga travel dianggap seimbang. */
export const AMBANG_SEIMBANG_PERSEN = 5;

export interface KomponenInputUmroh {
  id: string;
  /** Nilai dalam Rupiah — dari input user, bukan tebakan engine. */
  nilaiRp: number;
}

export interface RencanaUmrohInput {
  namaRencana: string;
  tierId: string;
  jumlahJemaah: number;
  /** Durasi perjalanan dalam hari. */
  durasiHari: number;
  komponen: KomponenInputUmroh[];
  /** Harga paket travel per jemaah (Rp) — dari input user. */
  hargaPaketTravelRp: number;
}

export interface RincianBiayaUmroh {
  id: string;
  nama: string;
  nilaiRp: number;
}

export interface RencanaUmroh {
  namaRencana: string;
  tier: UmrohTier;
  jumlahJemaah: number;
  durasiHari: number;
  rincian: RincianBiayaUmroh[];
  totalMandiriRp: number;
  perJemaahMandiriRp: number;
  hargaPaketTravelRp: number;
  totalTravelRp: number;
  /** totalMandiri − totalTravel (negatif = mandiri lebih hemat). */
  selisihRp: number;
  selisihPersen: number;
  verdict: VerdictUmroh;
  peringatan: string[];
  catatanRisiko: string[];
  langkah: string[];
}

export const CATATAN_RISIKO_UMROH: string[] = [
  'Umroh mandiri: visa & administrasi diurus sendiri — keliru prosedur ' +
    'bisa berakibat gagal berangkat (catatan umum, bukan nasihat).',
  'Umroh mandiri: tanpa pendamping travel — manasik dan problem solving ' +
    'di Tanah Suci menjadi tanggung jawab sendiri.',
  'Harga tiket & hotel bersifat fluktuatif mengikuti kurs dan musim — ' +
    'angka rencana ini bisa bergeser saat eksekusi.',
  'Bila memilih paket travel: pastikan biro berizin resmi — verifikasi ' +
    'mandiri ke daftar resmi Kemenag sebelum membayar.',
];

export const DISCLAIMER_UMROH =
  'UmrohKu adalah alat bantu hitung anggaran, BUKAN biro travel resmi. ' +
  'Semua angka biaya berasal dari yang Anda isi sendiri — engine tidak ' +
  'menebak harga pasar. Verifikasi harga aktual dan izin resmi travel ke ' +
  'sumber tepercaya (termasuk daftar resmi Kemenag) sebelum memutuskan.';

/**
 * Susun rencana anggaran umroh mandiri vs travel dari input user.
 * Deterministik: input sama → hasil sama.
 */
export function buatRencanaUmroh(input: RencanaUmrohInput): RencanaUmroh {
  const langkah: string[] = [];
  const peringatan: string[] = [];

  const nama = input.namaRencana.trim();
  if (nama === '') throw new Error('Nama rencana wajib diisi.');

  const tier = tierUmrohDariId(input.tierId);
  if (!tier) throw new Error(`Tier tidak dikenal: "${input.tierId}".`);

  if (!Number.isInteger(input.jumlahJemaah) || input.jumlahJemaah < 1) {
    throw new Error('Jumlah jemaah minimal 1 orang.');
  }
  if (input.jumlahJemaah > tier.maksJemaah) {
    throw new Error(
      `Tier ${tier.nama} maksimal ${tier.maksJemaah} jemaah ` +
        `(diminta ${input.jumlahJemaah}).`,
    );
  }
  if (
    !Number.isInteger(input.durasiHari) ||
    input.durasiHari < 7 ||
    input.durasiHari > 40
  ) {
    throw new Error('Durasi perjalanan 7–40 hari.');
  }
  if (
    !Number.isFinite(input.hargaPaketTravelRp) ||
    input.hargaPaketTravelRp <= 0
  ) {
    throw new Error('Harga paket travel (Rp) wajib diisi lebih dari 0.');
  }

  const nilaiPerKomponen = new Map<string, number>();
  for (const k of input.komponen) {
    const def = komponenUmrohDariId(k.id);
    if (!def) throw new Error(`Komponen biaya tidak dikenal: "${k.id}".`);
    if (!Number.isFinite(k.nilaiRp) || k.nilaiRp < 0) {
      throw new Error(`Nilai komponen "${k.id}" harus angka ≥ 0.`);
    }
    if (nilaiPerKomponen.has(k.id)) {
      throw new Error(`Komponen "${k.id}" diisi dua kali.`);
    }
    nilaiPerKomponen.set(k.id, k.nilaiRp);
  }

  const rincian: RincianBiayaUmroh[] = KOMPONEN_BIAYA_UMROH.map((def) => {
    const nilai = nilaiPerKomponen.get(def.id);
    if (nilai === undefined) {
      peringatan.push(
        `Komponen "${def.nama}" belum diisi — dihitung Rp0. ` +
          `Isi angkanya agar perbandingan akurat.`,
      );
    }
    return { id: def.id, nama: def.nama, nilaiRp: nilai ?? 0 };
  });

  const perJemaahMandiriRp = rincian.reduce((s, r) => s + r.nilaiRp, 0);
  const totalMandiriRp = perJemaahMandiriRp * input.jumlahJemaah;
  const totalTravelRp = input.hargaPaketTravelRp * input.jumlahJemaah;
  const selisihRp = totalMandiriRp - totalTravelRp;
  const selisihPersen =
    totalTravelRp === 0
      ? 0
      : Math.round((Math.abs(selisihRp) / totalTravelRp) * 1000) / 10;

  let verdict: VerdictUmroh;
  if (selisihPersen < AMBANG_SEIMBANG_PERSEN) {
    verdict = 'SEIMBANG';
  } else if (selisihRp < 0) {
    verdict = 'MANDIRI_LEBIH_HEMAT';
  } else {
    verdict = 'TRAVEL_LEBIH_HEMAT';
  }

  langkah.push(
    `Total mandiri per jemaah = Σ 10 komponen = ${formatRp(perJemaahMandiriRp)}.`,
  );
  langkah.push(
    `Total mandiri ${input.jumlahJemaah} jemaah = ${formatRp(totalMandiriRp)}; ` +
      `total travel = ${formatRp(totalTravelRp)}.`,
  );
  langkah.push(
    `Selisih = ${formatRp(selisihRp)} (${selisihPersen}% dari harga travel).`,
  );
  langkah.push(
    `Selisih ${selisihPersen}% ${
      selisihPersen < AMBANG_SEIMBANG_PERSEN
        ? `< ambang ${AMBANG_SEIMBANG_PERSEN}% → SEIMBANG`
        : `≥ ambang ${AMBANG_SEIMBANG_PERSEN}% → ${
            verdict === 'MANDIRI_LEBIH_HEMAT' ? 'mandiri lebih hemat' : 'travel lebih hemat'
          }`
    }.`,
  );

  return {
    namaRencana: nama,
    tier,
    jumlahJemaah: input.jumlahJemaah,
    durasiHari: input.durasiHari,
    rincian,
    totalMandiriRp,
    perJemaahMandiriRp,
    hargaPaketTravelRp: input.hargaPaketTravelRp,
    totalTravelRp,
    selisihRp,
    selisihPersen,
    verdict,
    peringatan,
    catatanRisiko: CATATAN_RISIKO_UMROH,
    langkah,
  };
}

export interface JadwalTabungan {
  totalRp: number;
  setoranPerBulanRp: number;
  jumlahBulan: number;
  bulanMulai: string;
  bulanLunas: string;
  jadwal: { bulan: string; setoranRp: number; terkumpulRp: number }[];
}

/** Validasi & parsing "YYYY-MM" → {tahun, bulan}. */
function parseBulan(ym: string): { tahun: number; bulan: number } {
  const m = ym.match(/^(\d{4})-(\d{2})$/);
  if (!m) throw new Error(`Bulan mulai harus format YYYY-MM (diterima: "${ym}").`);
  const tahun = Number(m[1]);
  const bulan = Number(m[2]);
  if (bulan < 1 || bulan > 12) {
    throw new Error(`Bulan tidak valid dalam "${ym}".`);
  }
  return { tahun, bulan };
}

function formatBulan(tahun: number, bulan: number): string {
  return `${tahun}-${String(bulan).padStart(2, '0')}`;
}

/**
 * Timeline tabungan: berapa bulan sampai total terkumpul + jadwal per bulan.
 * Deterministik.
 */
export function timelineTabungan(
  totalRp: number,
  setoranPerBulanRp: number,
  bulanMulai: string,
): JadwalTabungan {
  if (!Number.isFinite(totalRp) || totalRp <= 0) {
    throw new Error('Total biaya harus > 0.');
  }
  if (!Number.isFinite(setoranPerBulanRp) || setoranPerBulanRp <= 0) {
    throw new Error('Setoran per bulan harus > 0.');
  }
  const { tahun, bulan } = parseBulan(bulanMulai);
  const jumlahBulan = Math.ceil(totalRp / setoranPerBulanRp);

  const jadwal: JadwalTabungan['jadwal'] = [];
  let terkumpul = 0;
  for (let i = 0; i < jumlahBulan; i++) {
    const t = tahun + Math.floor((bulan - 1 + i) / 12);
    const b = ((bulan - 1 + i) % 12) + 1;
    const setoran = Math.min(setoranPerBulanRp, totalRp - terkumpul);
    terkumpul += setoran;
    jadwal.push({ bulan: formatBulan(t, b), setoranRp: setoran, terkumpulRp: terkumpul });
  }
  const terakhir = jadwal[jadwal.length - 1];

  return {
    totalRp,
    setoranPerBulanRp,
    jumlahBulan,
    bulanMulai,
    bulanLunas: terakhir.bulan,
    jadwal,
  };
}

export interface ChecklistUmroh {
  kategori: 'DOKUMEN' | 'KESEHATAN' | 'MANASIK' | 'KEUANGAN';
  teks: string;
  /** true = termasuk checklist inti tier HEMAT (12 item). */
  inti: boolean;
}

/** 40 item checklist persiapan (4 kategori × 10) — 12 di antaranya inti. */
export function checklistPersiapan(): ChecklistUmroh[] {
  const c = (
    kategori: ChecklistUmroh['kategori'],
    teks: string,
    inti: boolean,
  ): ChecklistUmroh => ({ kategori, teks, inti });
  return [
    // DOKUMEN
    c('DOKUMEN', 'Paspor aktif (masa berlaku min. 7 bulan sebelum keberangkatan)', true),
    c('DOKUMEN', 'KTP & Kartu Keluarga (asli + fotokopi)', false),
    c('DOKUMEN', 'Buku nikah (bila bepergian dengan pasangan)', false),
    c('DOKUMEN', 'Visa umroh sudah terbit & sesuai jadwal', true),
    c('DOKUMEN', 'Tiket pesawat PP (e-ticket tersimpan)', true),
    c('DOKUMEN', 'Bukti booking hotel Mekkah & Madinah', true),
    c('DOKUMEN', 'Asuransi perjalanan aktif', false),
    c('DOKUMEN', 'Pas foto sesuai syarat visa (cadangan)', false),
    c('DOKUMEN', 'Surat keterangan mahram (bila diperlukan)', false),
    c('DOKUMEN', 'Salinan digital semua dokumen di HP/cloud', false),
    // KESEHATAN
    c('KESEHATAN', 'Vaksinasi sesuai syarat (mis. meningitis) + kartu vaksin', true),
    c('KESEHATAN', 'Cek kesehatan umum sebelum berangkat', false),
    c('KESEHATAN', 'Obat rutin + salinan resep dokter', true),
    c('KESEHATAN', 'Vitamin & suplemen daya tahan', false),
    c('KESEHATAN', 'Masker & hand sanitizer', false),
    c('KESEHATAN', 'Catat riwayat alergi & golongan darah', false),
    c('KESEHATAN', 'Nomor darurat keluarga & asuransi tersimpan', true),
    c('KESEHATAN', 'Istirahat cukup 3 hari sebelum keberangkatan', false),
    c('KESEHATAN', 'Siapkan strategi adaptasi cuaca panas', false),
    c('KESEHATAN', 'Asuransi kesehatan mencakup rawat jalan di luar negeri', false),
    // MANASIK
    c('MANASIK', 'Ikut bimbingan manasik (minimal 1x)', true),
    c('MANASIK', 'Hafal niat umroh & bacaan talbiyah', true),
    c('MANASIK', 'Pahami rukun & wajib umroh', true),
    c('MANASIK', 'Pahami larangan selama ihram', false),
    c('MANASIK', 'Susun jadwal ziarah (Mekkah & Madinah)', false),
    c('MANASIK', 'Unduh aplikasi peta/panduan Tanah Suci (offline)', false),
    c('MANASIK', 'Siapkan buku/panduan doa ringkas', false),
    c('MANASIK', 'Pahami etika & adab di Masjidil Haram / Nabawi', false),
    c('MANASIK', 'Kenali lokasi hotel dari masjid (jarak & rute)', false),
    c('MANASIK', 'Simpan kontak muthawif/pendamping (bila memakai)', false),
    // KEUANGAN
    c('KEUANGAN', 'Anggaran tertulis per komponen biaya', true),
    c('KEUANGAN', 'Dana darurat terpisah dari biaya pokok', false),
    c('KEUANGAN', 'Kartu debit aktif untuk transaksi internasional', false),
    c('KEUANGAN', 'Uang tunai Riyal (SAR) secukupnya', false),
    c('KEUANGAN', 'Catat pengeluaran harian selama perjalanan', false),
    c('KEUANGAN', 'Pisahkan uang belanja oleh-oleh dari biaya ibadah', false),
    c('KEUANGAN', 'Waspada penipuan penukaran uang — tukar di tempat resmi', false),
    c('KEUANGAN', 'Simpan semua bukti transaksi/pembayaran', false),
    c('KEUANGAN', 'Pastikan tabungan/biaya lunas SEBELUM berangkat', true),
    c('KEUANGAN', 'Batasi limit kartu kredit selama perjalanan', false),
  ];
}

/**
 * Analisis sensitivitas (PRO): rentang total bila tiap komponen
 * bergeser ±10%.
 */
export function analisisSensitivitas(rencana: RencanaUmroh): {
  minRp: number;
  maksRp: number;
} {
  return {
    minRp: Math.round(rencana.totalMandiriRp * 0.9),
    maksRp: Math.round(rencana.totalMandiriRp * 1.1),
  };
}

const LABEL_VERDICT: Record<VerdictUmroh, string> = {
  MANDIRI_LEBIH_HEMAT: 'UMROH MANDIRI LEBIH HEMAT',
  TRAVEL_LEBIH_HEMAT: 'PAKET TRAVEL LEBIH HEMAT',
  SEIMBANG: 'SEIMBANG (selisih di bawah 5%)',
};

export function formatRp(n: number): string {
  return 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Laporan rencana siap salin + disclaimer bukan-biro-travel. */
export function formatRencanaTeks(r: RencanaUmroh): string {
  const garis = '='.repeat(52);
  const out: string[] = [];
  out.push('UMROHKU — RENCANA ANGGARAN UMROH');
  out.push(garis);
  out.push(`Rencana : ${r.namaRencana} (tier ${r.tier.nama})`);
  out.push(`Jemaah  : ${r.jumlahJemaah} orang | Durasi: ${r.durasiHari} hari`);
  out.push('');
  out.push('RINCIAN BIAYA MANDIRI (per jemaah):');
  r.rincian.forEach((k, i) => {
    out.push(
      `${String(i + 1).padStart(2, ' ')}. ${k.nama.padEnd(24, ' ')} ${formatRp(k.nilaiRp)}`,
    );
  });
  out.push('');
  out.push(`Total mandiri  : ${formatRp(r.totalMandiriRp)} (${r.jumlahJemaah} jemaah)`);
  out.push(`Total travel   : ${formatRp(r.totalTravelRp)} (${formatRp(r.hargaPaketTravelRp)}/jemaah)`);
  out.push(
    `Selisih        : ${formatRp(r.selisihRp)} (${r.selisihPersen}%)`,
  );
  out.push(`Verdict        : ${LABEL_VERDICT[r.verdict]}`);
  if (r.peringatan.length > 0) {
    out.push('');
    out.push('PERINGATAN:');
    r.peringatan.forEach((p) => out.push(`- ${p}`));
  }
  out.push('');
  out.push('CATATAN RISIKO (umum):');
  r.catatanRisiko.forEach((c) => out.push(`- ${c}`));
  out.push('');
  out.push('CARA HITUNG:');
  r.langkah.forEach((l) => out.push(`- ${l}`));
  out.push('');
  out.push('DISCLAIMER: ' + DISCLAIMER_UMROH);
  return out.join('\n');
}

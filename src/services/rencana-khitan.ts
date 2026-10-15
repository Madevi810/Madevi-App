/**
 * KhitanKu — perencana walimatul khitan
 * (engine Services berbayar, 2 tier; pola WasiatKu/UmrohKu).
 *
 * Masalah: orang tua yang mengadakan walimatul khitan menyusun anggaran,
 * rundown, dan checklist secara terpisah-pisah — yang ada di internet hanya
 * PDF RAB statis dan artikel susunan acara. Belum ada perencana interaktif.
 *
 * Fungsi murni & deterministik. Tanpa koneksi eksternal.
 * API + halaman + katalog DB = tahap berikut (engine berdiri sendiri).
 *
 * Kejujuran data (aturan konten Madevi #2, #25, #28; aturan #31):
 *  - Engine TIDAK menebak harga — semua nilai rupiah diinput user.
 *  - Analisis sensitivitas tamu hanya menskalakan komponen konsumsi
 *    (yang memang proporsional tamu); komponen lain tetap.
 *  - Rundown 8 susunan mengikuti format umum walimatul khitan yang beredar,
 *    berlabel sebagai susunan umum yang bisa disesuaikan.
 */

export interface TierKhitan {
  id: string;
  nama: string;
  hargaRp: number;
  maksTamu: number;
  maksSkenario: number;
  deskripsi: string;
}

export const KHITAN_TIERS: TierKhitan[] = [
  {
    id: 'hemat',
    nama: 'HEMAT',
    hargaRp: 25000,
    maksTamu: 150,
    maksSkenario: 1,
    deskripsi:
      '1 skenario, sampai 150 tamu, rundown dasar, checklist inti (12 item).',
  },
  {
    id: 'pro',
    nama: 'PRO',
    hargaRp: 99000,
    maksTamu: 500,
    maksSkenario: 3,
    deskripsi:
      '3 skenario, sampai 500 tamu, timeline mundur H-30, checklist lengkap ' +
      '(32 item), analisis sensitivitas jumlah tamu.',
  },
];

export function tierKhitanDariId(id: string): TierKhitan | null {
  return KHITAN_TIERS.find((t) => t.id === id) ?? null;
}

export interface KomponenBiayaKhitan {
  id: string;
  nama: string;
  keterangan: string;
}

export const KOMPONEN_BIAYA_KHITAN: KomponenBiayaKhitan[] = [
  { id: 'tenda-dekorasi', nama: 'Tenda & Dekorasi', keterangan: 'Sewa tenda, kursi, dekorasi pelaminan khitan.' },
  { id: 'konsumsi', nama: 'Konsumsi Tamu', keterangan: 'Nasi kotak/prasmanan, snack, air mineral — proporsional jumlah tamu.' },
  { id: 'hiburan', nama: 'Hiburan', keterangan: 'Organ tunggal, badut, wahana anak, dsb.' },
  { id: 'dokumentasi', nama: 'Dokumentasi', keterangan: 'Foto & video.' },
  { id: 'souvenir', nama: 'Souvenir', keterangan: 'Bingkisan untuk tamu/anak.' },
  { id: 'baju-anak', nama: 'Baju & Perlengkapan Anak', keterangan: 'Koko, peci, sarung, celana khitan.' },
  { id: 'arak-arakan', nama: 'Arak-arakan', keterangan: 'Kuda/delman/marching band penjemputan anak.' },
  { id: 'konsumsi-panitia', nama: 'Konsumsi Panitia', keterangan: 'Makan & snack panitia/keluarga inti.' },
  { id: 'lainnya', nama: 'Lainnya', keterangan: 'MC, penceramah tausiyah, keamanan, tak terduga.' },
];

export function komponenKhitanDariId(id: string): KomponenBiayaKhitan | null {
  return KOMPONEN_BIAYA_KHITAN.find((k) => k.id === id) ?? null;
}

export interface SusunanAcara {
  tahap: number;
  nama: string;
  keterangan: string;
}

/** Susunan umum walimatul khitan — bisa disesuaikan tiap keluarga. */
export const RUNDOWN_KHITAN: SusunanAcara[] = [
  { tahap: 1, nama: 'Penyambutan / Arak-arakan', keterangan: 'Penjemputan anak yang dikhitan menuju lokasi acara.' },
  { tahap: 2, nama: 'Pembukaan', keterangan: 'Dibuka MC; pembacaan susunan acara.' },
  { tahap: 3, nama: 'Lantunan Ayat Suci Al-Quran', keterangan: 'Tilawah oleh qari/qariah.' },
  { tahap: 4, nama: 'Sambutan', keterangan: 'Sambutan orang tua / tuan rumah.' },
  { tahap: 5, nama: 'Tausiyah', keterangan: 'Ceramah agama oleh penceramah/ustadz.' },
  { tahap: 6, nama: 'Pemotongan Tumpeng', keterangan: 'Simbolis oleh anak & orang tua.' },
  { tahap: 7, nama: 'Ucapan Selamat & Hiburan', keterangan: 'Tamu memberi selamat; hiburan/penyaweran keluarga.' },
  { tahap: 8, nama: 'Penutup & Doa', keterangan: 'Doa penutup bersama.' },
];

export interface ChecklistKhitan {
  kategori: 'PERSIAPAN_ANAK' | 'ACARA' | 'KONSUMSI' | 'DOKUMENTASI';
  teks: string;
  inti: boolean;
}

export function checklistKhitan(): ChecklistKhitan[] {
  const daftar: Array<[ChecklistKhitan['kategori'], string, boolean]> = [
    ['PERSIAPAN_ANAK', 'Baju koko anak', true],
    ['PERSIAPAN_ANAK', 'Peci/kopiah anak', true],
    ['PERSIAPAN_ANAK', 'Sarung anak', true],
    ['PERSIAPAN_ANAK', 'Celana khitan khusus', true],
    ['PERSIAPAN_ANAK', 'Jadwal & tempat khitan (medis) sudah pasti', true],
    ['PERSIAPAN_ANAK', 'Obat & perawatan pasca-khitan disiapkan', false],
    ['PERSIAPAN_ANAK', 'Bingkisan untuk anak (mainan/uang saku)', false],
    ['PERSIAPAN_ANAK', 'Foto keluarga pra-acara', false],
    ['ACARA', 'Tenda, kursi, dan dekorasi dipesan', true],
    ['ACARA', 'Sound system & MC dikonfirmasi', true],
    ['ACARA', 'Penceramah tausiyah dihubungi & jadwal cocok', true],
    ['ACARA', 'Arak-arakan (kuda/delman/marching band) dipesan', false],
    ['ACARA', 'Hiburan anak (badut/wahana) dipesan', false],
    ['ACARA', 'Izin keramaian ke RT/RW & keamanan disiapkan', false],
    ['ACARA', 'Parkir & akses tamu diatur', false],
    ['ACARA', 'Rundown dibagikan ke semua panitia', false],
    ['KONSUMSI', 'Jumlah tamu final & menu ditentukan', true],
    ['KONSUMSI', 'Katering/prasmanan dipesan & DP dibayar', true],
    ['KONSUMSI', 'Snack & air mineral disiapkan', true],
    ['KONSUMSI', 'Konsumsi panitia & keluarga inti disiapkan', false],
    ['KONSUMSI', 'Tumpeng & perlengkapan potong tumpeng', false],
    ['KONSUMSI', 'Cadangan 10% porsi untuk tamu tak terduga', false],
    ['KONSUMSI', 'Jadwal distribusi konsumsi ke meja diatur', false],
    ['KONSUMSI', 'Tempat sampah & kebersihan disiapkan', false],
    ['DOKUMENTASI', 'Fotografer/videografer dipesan', true],
    ['DOKUMENTASI', 'Buku tamu & kotak amplop disiapkan', false],
    ['DOKUMENTASI', 'Souvenir tamu disiapkan & dihitung', false],
    ['DOKUMENTASI', 'Denah foto keluarga & momen penting dicatat', false],
    ['DOKUMENTASI', 'Listrik/cadangan daya untuk sound & lampu', false],
    ['DOKUMENTASI', 'Arsip foto & video dibackup setelah acara', false],
    ['ACARA', 'Gladi bersih H-1', false],
    ['KONSUMSI', 'Konfirmasi ulang katering H-3', false],
  ];
  return daftar.map(([kategori, teks, inti]) => ({ kategori, teks, inti }));
}

export interface TonggakKhitan {
  kode: string;
  tanggal: string;
  tugas: string[];
}

/** Timeline mundur konkret dari tanggal acara (PRO). */
export function timelineMundur(tanggalAcara: string): TonggakKhitan[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalAcara)) {
    throw new Error('"tanggalAcara" harus format YYYY-MM-DD.');
  }
  const acara = new Date(tanggalAcara + 'T00:00:00');
  if (Number.isNaN(acara.getTime())) throw new Error('"tanggalAcara" tidak valid.');
  const mundur = (hari: number): string => {
    const d = new Date(acara);
    d.setDate(d.getDate() - hari);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };
  return [
    { kode: 'H-30', tanggal: mundur(30), tugas: ['Tentukan tanggal & lokasi acara', 'Bentuk panitia inti keluarga', 'Pesan tenda, dekorasi, dan katering (survei harga)'] },
    { kode: 'H-21', tanggal: mundur(21), tugas: ['Jadwal khitan medis anak dipastikan', 'Pesan hiburan, arak-arakan, dan dokumentasi', 'Hubungi penceramah tausiyah'] },
    { kode: 'H-14', tanggal: mundur(14), tugas: ['Finalisasi jumlah tamu undangan', 'Pesan souvenir & perlengkapan anak (koko, peci, sarung)', 'Sebar undangan'] },
    { kode: 'H-7', tanggal: mundur(7), tugas: ['Konfirmasi ulang semua vendor', 'Siapkan buku tamu, kotak amplop, dan tumpeng', 'Rundown final dibagikan ke panitia'] },
    { kode: 'H-3', tanggal: mundur(3), tugas: ['Konfirmasi ulang katering & jumlah porsi', 'Cek sound system, listrik, dan parkir', 'Siapkan konsumsi panitia'] },
    { kode: 'H-1', tanggal: mundur(1), tugas: ['Gladi bersih & dekorasi terpasang', 'Briefing panitia per seksi', 'Anak istirahat cukup'] },
    { kode: 'H-0', tanggal: mundur(0), tugas: ['Acara berlangsung sesuai rundown', 'Dokumentasi berjalan', 'Evaluasi & arsip setelah acara'] },
  ];
}

export interface InputRencanaKhitan {
  namaAnak: string;
  tanggalAcara: string;
  tierId: string;
  jumlahTamu: number;
  komponen: Array<{ id: string; nilaiRp: number }>;
}

export interface RencanaKhitan {
  namaAnak: string;
  tanggalAcara: string;
  tier: TierKhitan;
  jumlahTamu: number;
  totalBiayaRp: number;
  biayaPerTamuRp: number;
  rincian: Array<{ id: string; nama: string; nilaiRp: number }>;
  langkah: string[];
}

export const DISCLAIMER_KHITAN =
  'Rencana berdasar angka yang Anda masukkan sendiri — bukan penawaran vendor. ' +
  'Harga tiap daerah dan waktu berbeda; verifikasi langsung ke penyedia jasa ' +
  'sebelum membayar DP apa pun.';

export function buatRencanaKhitan(input: InputRencanaKhitan): RencanaKhitan {
  const { namaAnak, tanggalAcara, tierId, jumlahTamu, komponen } = input;

  if (typeof namaAnak !== 'string' || namaAnak.trim().length === 0) {
    throw new Error('"namaAnak" wajib diisi.');
  }
  const tier = tierKhitanDariId(tierId);
  if (!tier) throw new Error(`"tierId" tidak dikenal: ${tierId}.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalAcara)) {
    throw new Error('"tanggalAcara" harus format YYYY-MM-DD.');
  }
  const tgl = new Date(tanggalAcara + 'T00:00:00');
  if (Number.isNaN(tgl.getTime())) throw new Error('"tanggalAcara" tidak valid.');
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);
  if (tgl < hariIni) throw new Error('"tanggalAcara" tidak boleh di masa lalu.');
  if (!Number.isInteger(jumlahTamu) || jumlahTamu < 1 || jumlahTamu > tier.maksTamu) {
    throw new Error(`"jumlahTamu" harus bilangan bulat 1–${tier.maksTamu} untuk tier ${tier.nama}.`);
  }
  if (!Array.isArray(komponen) || komponen.length === 0) {
    throw new Error('"komponen" wajib diisi minimal 1 komponen biaya.');
  }
  const ids = new Set<string>();
  const rincian: RencanaKhitan['rincian'] = [];
  for (const k of komponen) {
    const def = komponenKhitanDariId(k.id);
    if (!def) throw new Error(`Komponen tidak dikenal: ${k.id}.`);
    if (ids.has(k.id)) throw new Error(`Komponen duplikat: ${k.id}.`);
    ids.add(k.id);
    if (typeof k.nilaiRp !== 'number' || !Number.isFinite(k.nilaiRp) || k.nilaiRp < 0) {
      throw new Error(`Nilai komponen "${k.id}" harus angka ≥ 0.`);
    }
    rincian.push({ id: k.id, nama: def.nama, nilaiRp: k.nilaiRp });
  }

  const totalBiayaRp = rincian.reduce((s, r) => s + r.nilaiRp, 0);
  const biayaPerTamuRp = totalBiayaRp / jumlahTamu;

  const langkah = [
    `Total biaya: Σ ${rincian.length} komponen = Rp${totalBiayaRp}.`,
    `Biaya per tamu: Rp${totalBiayaRp} ÷ ${jumlahTamu} tamu = Rp${Math.round(biayaPerTamuRp)}/tamu.`,
    `Rundown ${RUNDOWN_KHITAN.length} susunan walimatul khitan disiapkan.`,
  ];

  return {
    namaAnak: namaAnak.trim(),
    tanggalAcara,
    tier,
    jumlahTamu,
    totalBiayaRp,
    biayaPerTamuRp,
    rincian,
    langkah,
  };
}

export interface SkenarioTamu {
  jumlahTamu: number;
  totalBiayaRp: number;
  selisihRp: number;
}

/**
 * Analisis sensitivitas jumlah tamu (PRO): hanya komponen 'konsumsi' yang
 * diskalakan proporsional terhadap tamu; komponen lain dianggap tetap.
 */
export function analisisSensitivitasTamu(
  rencana: RencanaKhitan,
  komponen: Array<{ id: string; nilaiRp: number }>,
): SkenarioTamu[] {
  const peta = new Map(komponen.map((k) => [k.id, k.nilaiRp]));
  const konsumsi = peta.get('konsumsi') ?? 0;
  const tetap = rencana.totalBiayaRp - konsumsi;
  const dasar = rencana.jumlahTamu;
  return [-0.2, 0.2].map((delta) => {
    const jumlahTamu = Math.max(1, Math.round(dasar * (1 + delta)));
    const totalBiayaRp = tetap + konsumsi * (jumlahTamu / dasar);
    return { jumlahTamu, totalBiayaRp: Math.round(totalBiayaRp), selisihRp: Math.round(totalBiayaRp - rencana.totalBiayaRp) };
  });
}

function rupiah(nilai: number): string {
  return 'Rp' + Math.round(nilai).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatKhitanTeks(r: RencanaKhitan): string {
  const baris = [
    'KHITANKU — RENCANA WALIMATUL KHITAN',
    '',
    `Anak          : ${r.namaAnak}`,
    `Tanggal acara : ${r.tanggalAcara}`,
    `Tier          : ${r.tier.nama} (${rupiah(r.tier.hargaRp)})`,
    `Jumlah tamu   : ${r.jumlahTamu}`,
    '',
    'RINCIAN BIAYA:',
    ...r.rincian.map((x) => `- ${x.nama}: ${rupiah(x.nilaiRp)}`),
    `TOTAL         : ${rupiah(r.totalBiayaRp)}`,
    `Per tamu      : ${rupiah(r.biayaPerTamuRp)}`,
    '',
    'RUNDOWN ACARA:',
    ...RUNDOWN_KHITAN.map((s) => `${s.tahap}. ${s.nama} — ${s.keterangan}`),
    '',
    'Catatan: ' + DISCLAIMER_KHITAN,
  ];
  return baris.join('\n');
}

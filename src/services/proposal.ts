/**
 * ProposalKu — jasa susun proposal kegiatan terstruktur (engine jasa berbayar).
 *
 * Karang taruna, RT/RW, OSIS, dan komunitas kecil rutin butuh proposal
 * kegiatan untuk pengajuan dana/sponsor, tetapi kemampuan menulis proposal
 * formal minim. Yang ada di internet hanya template statis dan tutorial —
 * pembangun proposal interaktif berbahasa Indonesia belum ada. Engine ini
 * memandu lewat kuesioner terstruktur 8 bagian lalu menghasilkan draf
 * dokumen proposal lengkap dengan RAB otomatis + terbilang rupiah.
 *
 * Kejujuran data & batasan (aturan konten Madevi):
 *  - Engine ini ALAT BANTU DRAF, bukan dokumen resmi yang sudah disahkan.
 *    Setiap output memuat disclaimer + anjuran memeriksa ulang sebelum
 *    diajukan ke sponsor/pemberi dana.
 *  - Engine TIDAK menebak harga (aturan #31) — semua rupiah di RAB berasal
 *    dari input user (volume × harga satuan).
 *  - Struktur bab mengikuti konvensi proposal kegiatan Indonesia yang umum
 *    dipakai (latar belakang → tujuan → waktu/tempat → panitia → RAB →
 *    penutup → pengesahan).
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal dan deterministik.
 */

/** Tier harga jasa — HEMAT Rp10rb–50rb, PRO Rp50rb–150rb (aturan inovasi). */
export interface ProposalTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Jumlah dokumen proposal yang bisa disusun per bulan; -1 = tanpa batas. */
  batasDokumenPerBulan: number;
  /** Jumlah revisi draf yang ditanggung per dokumen. */
  maksRevisi: number;
  fitur: string[];
}

export const PROPOSAL_TIERS: ProposalTier[] = [
  {
    id: 'HEMAT',
    nama: 'Paket Hemat',
    hargaRp: 25000,
    batasDokumenPerBulan: 1,
    maksRevisi: 0,
    fitur: [
      '1 dokumen proposal per bulan',
      'Kuesioner terstruktur 8 bagian',
      'RAB otomatis + terbilang rupiah',
      'Draf dokumen teks siap salin/cetak',
    ],
  },
  {
    id: 'PRO',
    nama: 'Paket Pro',
    hargaRp: 99000,
    batasDokumenPerBulan: -1,
    maksRevisi: 2,
    fitur: [
      'Semua fitur Paket Hemat',
      'Dokumen tanpa batas per bulan',
      '2x revisi draf per dokumen',
      'Review kelengkapan oleh tim',
      'Checklist pengajuan ke sponsor/donatur',
    ],
  },
];

export function tierProposalDariId(id: string): ProposalTier | null {
  return PROPOSAL_TIERS.find((t) => t.id === id) ?? null;
}

export interface Panitia {
  jabatan: string;
  nama: string;
}

export interface RabItem {
  uraian: string;
  volume: number;
  satuan: string;
  /** Harga satuan (Rp) — dari input user, bukan tebakan engine. */
  hargaSatuanRp: number;
}

export interface ProposalInput {
  judul: string;
  latarBelakang: string;
  /** Dasar kegiatan, mis. "Program kerja Karang Taruna 2026". */
  dasarKegiatan: string[];
  namaKegiatan: string;
  tema?: string;
  tujuan: string[];
  manfaat: string[];
  /** Format YYYY-MM-DD. */
  tanggalMulai: string;
  tanggalSelesai: string;
  tempat: string;
  panitia: Panitia[];
  rab: RabItem[];
  penutup?: string;
  kotaTanggal?: string;
  penandaTangan: Panitia[];
}

export interface RabItemHitung extends RabItem {
  jumlahRp: number;
}

export interface DrafProposal extends ProposalInput {
  totalRabRp: number;
  terbilang: string;
  rabHitung: RabItemHitung[];
  peringatan: string[];
  langkah: string[];
}

export const DISCLAIMER_PROPOSAL =
  'Dokumen ini adalah DRAF alat bantu yang disusun dari data yang Anda isi — ' +
  'periksa ulang isi, angka RAB, dan susunan panitia sebelum dicetak atau ' +
  'diajukan ke sponsor/pemberi dana.';

function harusTeks(nama: string, nilai: string): void {
  if (!nilai || !nilai.trim()) {
    throw new Error(`${nama} wajib diisi.`);
  }
}

function parseTanggal(nama: string, iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) {
    throw new Error(`${nama} harus format YYYY-MM-DD (contoh: 2026-08-17).`);
  }
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (
    d.getUTCFullYear() !== Number(m[1]) ||
    d.getUTCMonth() !== Number(m[2]) - 1 ||
    d.getUTCDate() !== Number(m[3])
  ) {
    throw new Error(`${nama} "${iso}" bukan tanggal yang nyata.`);
  }
  return d;
}

function formatRp(n: number): string {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

const SATUAN_KATA = [
  '',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
  'sepuluh',
  'sebelas',
];

function terbilangBilangan(n: number): string {
  if (n < 12) return SATUAN_KATA[n];
  if (n < 20) return terbilangBilangan(n - 10) + ' belas';
  if (n < 100) {
    const sisa = n % 10;
    return (
      terbilangBilangan(Math.floor(n / 10)) +
      ' puluh' +
      (sisa ? ' ' + terbilangBilangan(sisa) : '')
    );
  }
  if (n < 200) return 'seratus' + (n % 100 ? ' ' + terbilangBilangan(n % 100) : '');
  if (n < 1000) {
    const sisa = n % 100;
    return (
      terbilangBilangan(Math.floor(n / 100)) +
      ' ratus' +
      (sisa ? ' ' + terbilangBilangan(sisa) : '')
    );
  }
  if (n < 2000) return 'seribu' + (n % 1000 ? ' ' + terbilangBilangan(n % 1000) : '');
  if (n < 1_000_000) {
    const sisa = n % 1000;
    return (
      terbilangBilangan(Math.floor(n / 1000)) +
      ' ribu' +
      (sisa ? ' ' + terbilangBilangan(sisa) : '')
    );
  }
  if (n < 1_000_000_000) {
    const sisa = n % 1_000_000;
    return (
      terbilangBilangan(Math.floor(n / 1_000_000)) +
      ' juta' +
      (sisa ? ' ' + terbilangBilangan(sisa) : '')
    );
  }
  const sisa = n % 1_000_000_000;
  return (
    terbilangBilangan(Math.floor(n / 1_000_000_000)) +
    ' miliar' +
    (sisa ? ' ' + terbilangBilangan(sisa) : '')
  );
}

/** Angka rupiah → kata Indonesia + "rupiah". Hanya untuk bilangan bulat ≥ 0. */
export function terbilangRupiah(n: number): string {
  if (!Number.isFinite(n) || n < 0) {
    throw new Error('Terbilang hanya untuk angka ≥ 0.');
  }
  const bulat = Math.round(n);
  if (bulat === 0) return 'nol rupiah';
  return terbilangBilangan(bulat) + ' rupiah';
}

/**
 * Menyusun draf proposal kegiatan dari kuesioner terstruktur.
 * Melempar Error berbahasa Indonesia bila validasi gagal.
 */
export function susunProposal(input: ProposalInput): DrafProposal {
  harusTeks('Judul proposal', input.judul);
  harusTeks('Latar belakang', input.latarBelakang);
  harusTeks('Nama kegiatan', input.namaKegiatan);
  harusTeks('Tempat kegiatan', input.tempat);

  const mulai = parseTanggal('Tanggal mulai', input.tanggalMulai);
  const selesai = parseTanggal('Tanggal selesai', input.tanggalSelesai);
  if (selesai.getTime() < mulai.getTime()) {
    throw new Error('Tanggal selesai tidak boleh sebelum tanggal mulai.');
  }

  const langkah: string[] = [];
  const peringatan: string[] = [];

  if (input.tujuan.length === 0) {
    peringatan.push('Daftar tujuan masih kosong — proposal tanpa tujuan sulit meyakinkan sponsor.');
  }
  if (input.panitia.length < 3) {
    peringatan.push(
      `Susunan panitia hanya ${input.panitia.length} orang — umumnya proposal mencantumkan minimal ketua, sekretaris, dan bendahara.`,
    );
  }
  if (input.dasarKegiatan.length === 0) {
    peringatan.push('Dasar kegiatan kosong — cantumkan mis. program kerja organisasi atau momen peringatan.');
  }

  // RAB: jumlah = volume × harga satuan; semua angka dari user.
  const rabHitung: RabItemHitung[] = input.rab.map((item, i) => {
    harusTeks(`Uraian RAB baris ${i + 1}`, item.uraian);
    if (!(item.volume >= 0)) {
      throw new Error(`Volume RAB "${item.uraian}" harus ≥ 0.`);
    }
    if (!(item.hargaSatuanRp >= 0)) {
      throw new Error(`Harga satuan RAB "${item.uraian}" harus ≥ 0 (Rp).`);
    }
    return { ...item, jumlahRp: item.volume * item.hargaSatuanRp };
  });
  const totalRabRp = rabHitung.reduce((s, r) => s + r.jumlahRp, 0);
  const terbilang =
    totalRabRp > 0 ? terbilangRupiah(totalRabRp) : 'nol rupiah';

  if (rabHitung.length === 0) {
    peringatan.push('RAB masih kosong — proposal pengajuan dana tanpa rincian anggaran jarang disetujui.');
  } else {
    langkah.push(
      `RAB: ${rabHitung.length} baris × (volume × harga satuan) = ${formatRp(totalRabRp)} (${terbilang}).`,
    );
  }

  langkah.push(
    `Struktur dokumen: judul → latar belakang & dasar → nama/tema → tujuan & manfaat → waktu & tempat → panitia (${input.panitia.length} orang) → RAB → penutup → pengesahan.`,
  );

  return {
    ...input,
    totalRabRp,
    terbilang,
    rabHitung,
    peringatan,
    langkah,
  };
}

function tanggalPanjang(iso: string): string {
  const d = parseTanggal('Tanggal', iso);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Dokumen proposal lengkap siap salin/cetak. */
export function formatProposalTeks(d: DrafProposal): string {
  const b: string[] = [];
  b.push(d.judul.toUpperCase());
  b.push('='.repeat(Math.min(d.judul.length, 60)));
  b.push('');
  b.push('I. LATAR BELAKANG');
  b.push(d.latarBelakang);
  if (d.dasarKegiatan.length > 0) {
    b.push('');
    b.push('Dasar kegiatan:');
    d.dasarKegiatan.forEach((x, i) => b.push(`${i + 1}. ${x}`));
  }
  b.push('');
  b.push('II. NAMA DAN TEMA KEGIATAN');
  b.push(`Nama kegiatan : ${d.namaKegiatan}`);
  if (d.tema) b.push(`Tema          : ${d.tema}`);
  b.push('');
  b.push('III. TUJUAN DAN MANFAAT');
  b.push('Tujuan:');
  d.tujuan.forEach((x, i) => b.push(`${i + 1}. ${x}`));
  if (d.manfaat.length > 0) {
    b.push('Manfaat:');
    d.manfaat.forEach((x, i) => b.push(`${i + 1}. ${x}`));
  }
  b.push('');
  b.push('IV. WAKTU DAN TEMPAT');
  const rentang =
    d.tanggalMulai === d.tanggalSelesai
      ? tanggalPanjang(d.tanggalMulai)
      : `${tanggalPanjang(d.tanggalMulai)} s.d. ${tanggalPanjang(d.tanggalSelesai)}`;
  b.push(`Waktu  : ${rentang}`);
  b.push(`Tempat : ${d.tempat}`);
  b.push('');
  b.push('V. SUSUNAN PANITIA');
  d.panitia.forEach((p) => b.push(`- ${p.jabatan}: ${p.nama}`));
  b.push('');
  b.push('VI. RENCANA ANGGARAN BIAYA (RAB)');
  if (d.rabHitung.length > 0) {
    d.rabHitung.forEach((r, i) => {
      b.push(
        `${i + 1}. ${r.uraian} — ${r.volume} ${r.satuan} × ${formatRp(r.hargaSatuanRp)} = ${formatRp(r.jumlahRp)}`,
      );
    });
    b.push(`TOTAL: ${formatRp(d.totalRabRp)}`);
    b.push(`Terbilang: "${d.terbilang}"`);
  } else {
    b.push('(RAB belum diisi)');
  }
  b.push('');
  b.push('VII. PENUTUP');
  b.push(
    d.penutup ??
      'Demikian proposal ini kami susun sebagai bahan pertimbangan. Atas perhatian dan bantuan Bapak/Ibu/Saudara, kami mengucapkan terima kasih.',
  );
  b.push('');
  const kotaTanggal = d.kotaTanggal ?? '........, .................... 20....';
  b.push(kotaTanggal);
  b.push('');
  b.push('Panitia Pelaksana,');
  d.penandaTangan.forEach((p) => {
    b.push('');
    b.push(p.jabatan);
    b.push('');
    b.push('');
    b.push(`( ${p.nama} )`);
  });
  b.push('');
  b.push('Catatan: ' + DISCLAIMER_PROPOSAL);
  return b.join('\n');
}

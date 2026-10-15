/**
 * Rundown Adat — jasa penyusunan prosesi adat pernikahan (engine Services berbayar).
 *
 * Masalah: pasangan yang menikah dengan adat (mis. Jawa) dan keluarganya
 * sering tidak hafal URUTAN prosesi yang benar — apa dulu: siraman atau
 * midodareni? Apa saja isi panggih? Yang ada di internet hanya ARTIKEL
 * deskriptif (bridestory, seputarpernikahan, jurnal UNS, repositori IAIN Kudus)
 * — belum ada layanan yang menyusunkan RUNDOWN checklist siap pakai mengikuti
 * pakem umum, lengkap dengan makna tiap prosesi.
 *
 * Fungsi murni & deterministik. Tanpa koneksi eksternal.
 *
 * Kejujuran data (aturan konten Madevi #2, #25):
 *  - Data prosesi dirangkum dari sumber akademik/publikasi di atas, dilabeli
 *    sebagai "pakem umum" (Solo/Jawa Tengah) — BUKAN klaim satu-satunya cara
 *    yang benar. Urutan dapat berbeda antar daerah, juru rias/penghulu adat,
 *    dan kesepakatan keluarga.
 *  - Hanya suku dengan data terdokumentasi kuat yang dibuka (mulai dari Jawa).
 *    Suku lain menyusul setelah riset — tidak dikarang.
 *  - Engine TIDAK menebak biaya/vendor — hanya susunan prosesi + makna.
 *
 * Tier (aturan #43):
 *  - HEMAT Rp25.000/bln: 2 rundown/bulan, 1 suku, checklist teks siap cetak.
 *  - PRO Rp99.000/bln: rundown tanpa batas, varian ringkas/lengkap, arsip tersimpan.
 */

export type SukuAdatId = 'jawa';

export interface SukuAdatInfo {
  id: SukuAdatId;
  nama: string;
  pakem: string;
  sumber: string[];
}

export const DAFTAR_SUKU_ADAT: SukuAdatInfo[] = [
  {
    id: 'jawa',
    nama: 'Jawa',
    pakem:
      'Pakem umum Solo/Jawa Tengah. Urutan dapat berbeda menurut daerah, ' +
      'penata adat, dan kesepakatan kedua keluarga.',
    sumber: [
      'Jurnal UNS — Pernikahan Adat Jawa di Desa Nengahan, Bayat, Klaten',
      'Repositori IAIN Kudus — BAB I skripsi upacara adat pernikahan Jawa',
      'Bridestory — 8 istilah tradisi pernikahan Jawa',
      'SeputarPernikahan — Rangkaian prosesi pernikahan adat Jawa',
    ],
  },
];

export type Fase = 'PRA' | 'HARI_H' | 'PASCA';

export const NAMA_FASE: Record<Fase, string> = {
  PRA: 'Sebelum hari H',
  HARI_H: 'Hari H',
  PASCA: 'Sesudah hari H',
};

export interface Prosesi {
  id: string;
  nama: string;
  fase: Fase;
  /** Nomor urut dalam fasenya. */
  urutan: number;
  /** Makna/tujuan singkat — dirangkum dari sumber di atas. */
  makna: string;
}

const PROSESI_JAWA: Prosesi[] = [
  { id: 'nontoni', nama: 'Nontoni', fase: 'PRA', urutan: 1, makna: 'Penjajakan/silaturahmi awal keluarga calon mempelai pria ke pihak wanita.' },
  { id: 'nglamar', nama: 'Nglamar (lamaran)', fase: 'PRA', urutan: 2, makna: 'Lamaran resmi; pihak pria menyampaikan maksud meminang.' },
  { id: 'wangsulan', nama: 'Wangsulan', fase: 'PRA', urutan: 3, makna: 'Jawaban atas lamaran dari pihak keluarga wanita.' },
  { id: 'asok_tukon', nama: 'Asok tukon (peningset)', fase: 'PRA', urutan: 4, makna: 'Pemberian uang/barang sebagai tanda jadi dan tanggung jawab.' },
  { id: 'srahsrahan', nama: 'Srah-srahan (seserahan)', fase: 'PRA', urutan: 5, makna: 'Penyerahan hadiah/hantaran dari calon mempelai pria.' },
  { id: 'pasang_tarub', nama: 'Pasang tarub', fase: 'PRA', urutan: 6, makna: 'Memasang tarub (janur kuning) — tanda keluarga sedang punya hajatan.' },
  { id: 'siraman', nama: 'Siraman', fase: 'PRA', urutan: 7, makna: 'Mandi kembang oleh 7 orang — penyucian diri calon pengantin.' },
  { id: 'midodareni', nama: 'Midodareni', fase: 'PRA', urutan: 8, makna: 'Malam sebelum hari H; doa bersama agar prosesi lancar (calon pengantin wanita dipingit).' },
  { id: 'akad', nama: 'Akad nikah', fase: 'HARI_H', urutan: 1, makna: 'Ijab kabul — inti sah pernikahan.' },
  { id: 'panggih', nama: 'Panggih (temu pengantin)', fase: 'HARI_H', urutan: 2, makna: 'Pertemuan kedua mempelai; meliputi balangan gantal, ngidak tigan, bobot timbang, kacar kucur, dulangan, hingga sungkeman.' },
  { id: 'balangan_gantal', nama: 'Balangan gantal', fase: 'HARI_H', urutan: 3, makna: 'Lempar daun sirih berbalas — janji setia memikul tanggung jawab bersama.' },
  { id: 'ngidak_tigan', nama: 'Ngidak tigan', fase: 'HARI_H', urutan: 4, makna: 'Mempelai pria menginjak telur — harapan keturunan.' },
  { id: 'bobot_timbang', nama: 'Bobot timbang', fase: 'HARI_H', urutan: 5, makna: 'Duduk di pangkuan ayah mempelai wanita — lambang kesepadanan.' },
  { id: 'kacar_kucur', nama: 'Kacar kucur', fase: 'HARI_H', urutan: 6, makna: 'Mengucurkan uang logam & biji-bijian — simbol nafkah kepala keluarga.' },
  { id: 'dulangan', nama: 'Dulangan (dahar klimah)', fase: 'HARI_H', urutan: 7, makna: 'Suap-menyuap — lambang saling memberi dalam rumah tangga.' },
  { id: 'sungkeman', nama: 'Sungkeman', fase: 'HARI_H', urutan: 8, makna: 'Berlutut di hadapan orang tua — hormat dan mohon doa restu.' },
  { id: 'boyongan', nama: 'Boyongan / ngunduh mantu', fase: 'PASCA', urutan: 1, makna: 'Kunjungan pengantin wanita ke kediaman keluarga pria setelah hari H.' },
];

export type TierRundownId = 'HEMAT' | 'PRO';

export interface TierRundown {
  id: TierRundownId;
  nama: string;
  hargaRp: number;
  /** null = tanpa batas. */
  batasRundownPerBulan: number | null;
  varianLengkap: boolean;
  fitur: string[];
}

export const TIER_RUNDOWN: TierRundown[] = [
  {
    id: 'HEMAT',
    nama: 'Hemat',
    hargaRp: 25000,
    batasRundownPerBulan: 2,
    varianLengkap: false,
    fitur: ['2 rundown/bulan', '1 suku adat', 'Checklist teks siap cetak'],
  },
  {
    id: 'PRO',
    nama: 'Pro',
    hargaRp: 99000,
    batasRundownPerBulan: null,
    varianLengkap: true,
    fitur: [
      'Rundown tanpa batas',
      'Semua suku adat yang tersedia',
      'Varian ringkas & lengkap',
      'Arsip rundown tersimpan',
    ],
  },
];

export function tierRundownDariId(id: string): TierRundown {
  const t = TIER_RUNDOWN.find((x) => x.id === id);
  if (!t) {
    throw new Error(`Tier tidak dikenal: "${id}". Pilih: HEMAT, PRO.`);
  }
  return t;
}

export interface HasilRundown {
  suku: SukuAdatInfo;
  tier: TierRundown;
  /** Prosesi terurut: PRA → HARI_H → PASCA, lalu menurut `urutan`. */
  prosesi: Prosesi[];
  jumlahProsesi: number;
}

/**
 * Susun rundown prosesi adat untuk satu suku.
 * @throws bila suku tidak didukung / tier tidak dikenal.
 */
export function susunRundown(sukuId: string, tierId: string): HasilRundown {
  const suku = DAFTAR_SUKU_ADAT.find((s) => s.id === sukuId);
  if (!suku) {
    const tersedia = DAFTAR_SUKU_ADAT.map((s) => s.id).join(', ');
    throw new Error(
      `Suku adat "${sukuId}" belum didukung. Tersedia: ${tersedia}. ` +
        `Suku lain dibuka setelah riset — tidak dikarang.`,
    );
  }
  const tier = tierRundownDariId(tierId);
  const bobotFase: Record<Fase, number> = { PRA: 0, HARI_H: 1, PASCA: 2 };
  const prosesi = [...PROSESI_JAWA].sort(
    (a, b) => bobotFase[a.fase] - bobotFase[b.fase] || a.urutan - b.urutan,
  );
  return { suku, tier, prosesi, jumlahProsesi: prosesi.length };
}

export interface CekBatas {
  boleh: boolean;
  dipakai: number;
  batas: number | null;
  pesan: string;
}

/** Cek kuota rundown bulan berjalan untuk satu tier. */
export function cekBatasRundown(tierId: string, dipakaiBulanIni: number): CekBatas {
  const tier = tierRundownDariId(tierId);
  if (!Number.isInteger(dipakaiBulanIni) || dipakaiBulanIni < 0) {
    throw new Error('Jumlah pemakaian bulan ini harus bilangan bulat ≥ 0.');
  }
  if (tier.batasRundownPerBulan === null) {
    return {
      boleh: true,
      dipakai: dipakaiBulanIni,
      batas: null,
      pesan: `Tier ${tier.nama}: tanpa batas rundown.`,
    };
  }
  const boleh = dipakaiBulanIni < tier.batasRundownPerBulan;
  return {
    boleh,
    dipakai: dipakaiBulanIni,
    batas: tier.batasRundownPerBulan,
    pesan: boleh
      ? `Tier ${tier.nama}: sisa ${tier.batasRundownPerBulan - dipakaiBulanIni} rundown bulan ini.`
      : `Tier ${tier.nama}: kuota ${tier.batasRundownPerBulan} rundown/bulan habis. Naik ke PRO untuk tanpa batas.`,
  };
}

/** Format rundown menjadi checklist teks siap salin/cetak. */
export function formatRundownTeks(r: HasilRundown): string {
  const baris: string[] = [
    `RUNDOWN ADAT ${r.suku.nama.toUpperCase()} — Tier ${r.tier.nama}`,
    r.suku.pakem,
    '',
  ];
  let faseAktif: Fase | '' = '';
  for (const p of r.prosesi) {
    if (p.fase !== faseAktif) {
      faseAktif = p.fase;
      baris.push(`== ${NAMA_FASE[p.fase].toUpperCase()} ==`);
    }
    baris.push(`[ ] ${p.urutan}. ${p.nama} — ${p.makna}`);
  }
  baris.push('', `Total ${r.jumlahProsesi} prosesi. Sumber: ${r.suku.sumber.join('; ')}.`);
  return baris.join('\n');
}

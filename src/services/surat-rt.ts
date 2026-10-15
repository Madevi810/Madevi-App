/**
 * SuratKu RT — generator surat keterangan RT/RW (engine jasa berbayar).
 *
 * Fungsi murni & deterministik: memformat nomor surat resmi, memvalidasi
 * data pemohon, dan membangun teks surat dari template per jenis surat.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Semua data pemohon WAJIB diisi user (nama, NIK, alamat, dst).
 *    Tidak ada nilai default karangan — field kosong ditolak dengan error jelas.
 *  - Nomor urut surat berasal dari buku agenda user (parameter wajib),
 *    engine tidak mengarang nomor.
 *  - Format surat mengikuti pola umum administrasi RT/RW Indonesia;
 *    kop instansi mengikuti input user dan bisa diganti (tier PRO).
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

/** Tier harga jasa — HEMAT Rp10rb–50rb, PRO Rp50rb–150rb (aturan inovasi 43). */
export interface SuratRtTier {
  id: 'HEMAT' | 'PRO';
  nama: string;
  hargaRp: number;
  /** Batas surat per bulan; -1 = tanpa batas. */
  batasSuratPerBulan: number;
  fitur: string[];
}

export const SURAT_RT_TIERS: SuratRtTier[] = [
  {
    id: 'HEMAT',
    nama: 'Paket Hemat',
    hargaRp: 15000,
    batasSuratPerBulan: 10,
    fitur: [
      '4 jenis surat keterangan RT/RW',
      'Nomor surat format resmi otomatis',
      'Sampai 10 surat per bulan',
      'Validasi NIK & data pemohon',
    ],
  },
  {
    id: 'PRO',
    nama: 'Paket Pro',
    hargaRp: 75000,
    batasSuratPerBulan: -1,
    fitur: [
      'Semua fitur Paket Hemat',
      'Surat tanpa batas per bulan',
      'Kop surat custom (nama RT/RW + logo teks)',
      'Arsip surat 1 tahun + cari nomor surat',
    ],
  },
];

export function tierDariId(id: string): SuratRtTier | null {
  return SURAT_RT_TIERS.find((t) => t.id === id) ?? null;
}

export type JenisSurat = 'DOMISILI' | 'USAHA' | 'PENGANTAR_KTP' | 'KELAHIRAN';

export interface JenisSuratMeta {
  id: JenisSurat;
  nama: string;
  /** Kode yang dipakai di nomor surat, mis. SKD. */
  kodeNomor: string;
  deskripsi: string;
}

export const JENIS_SURAT: JenisSuratMeta[] = [
  {
    id: 'DOMISILI',
    nama: 'Surat Keterangan Domisili',
    kodeNomor: 'SKD',
    deskripsi: 'Menyatakan seseorang benar berdomisili di wilayah RT/RW.',
  },
  {
    id: 'USAHA',
    nama: 'Surat Keterangan Usaha',
    kodeNomor: 'SKU',
    deskripsi: 'Menyatakan seseorang memiliki usaha di wilayah RT/RW.',
  },
  {
    id: 'PENGANTAR_KTP',
    nama: 'Surat Pengantar KTP',
    kodeNomor: 'SP-KTP',
    deskripsi: 'Pengantar RT/RW untuk pengurusan KTP di kelurahan.',
  },
  {
    id: 'KELAHIRAN',
    nama: 'Surat Keterangan Lahir',
    kodeNomor: 'SKL',
    deskripsi: 'Laporan kelahiran untuk diteruskan ke kelurahan.',
  },
];

export function jenisSuratDariId(id: string): JenisSuratMeta | null {
  return JENIS_SURAT.find((j) => j.id === id) ?? null;
}

export interface DataPemohon {
  nama: string;
  /** 16 digit angka. */
  nik: string;
  tempatLahir: string;
  /** Format YYYY-MM-DD. */
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  pekerjaan: string;
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
}

export interface OpsiSurat {
  /** Nomor urut dari buku agenda user — wajib, tidak dikarang engine. */
  nomorUrut: number;
  /** Tanggal surat, format YYYY-MM-DD. */
  tanggalSurat: string;
  namaKetuaRt: string;
  /** Kop custom (tier PRO). Jika kosong dipakai kop default dari data wilayah. */
  kopCustom?: string;
}

export type DataTambahan =
  | { jenis: 'DOMISILI'; sejakTahun: number }
  | {
      jenis: 'USAHA';
      namaUsaha: string;
      bidangUsaha: string;
      alamatUsaha: string;
    }
  | {
      jenis: 'PENGANTAR_KTP';
      keperluan: 'baru' | 'perpanjangan' | 'pengganti_hilang' | 'pengganti_rusak';
    }
  | {
      jenis: 'KELAHIRAN';
      namaAnak: string;
      tanggalLahirAnak: string;
      jamLahir: string;
      jenisKelaminAnak: 'L' | 'P';
      namaAyah: string;
      namaIbu: string;
    };

export interface SuratJadi {
  jenis: JenisSurat;
  judul: string;
  nomor: string;
  kop: string;
  /** Paragraf isi surat berurutan. */
  paragraf: string[];
  namaKetuaRt: string;
  tanggalSuratTeks: string;
}

const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const ROMAWI = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
];

/** Validasi NIK: harus tepat 16 digit angka. */
export function validasiNik(nik: string): void {
  if (!/^[0-9]{16}$/.test(nik)) {
    throw new Error('NIK harus tepat 16 digit angka');
  }
}

function parseTanggalIso(iso: string, namaField: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`${namaField} harus format YYYY-MM-DD`);
  const tahun = Number(m[1]);
  const bulan = Number(m[2]);
  const hari = Number(m[3]);
  const d = new Date(Date.UTC(tahun, bulan - 1, hari));
  if (
    d.getUTCFullYear() !== tahun ||
    d.getUTCMonth() !== bulan - 1 ||
    d.getUTCDate() !== hari
  ) {
    throw new Error(`${namaField} bukan tanggal yang valid`);
  }
  return d;
}

/** "2026-10-15" -> "15 Oktober 2026". */
export function formatTanggalId(iso: string): string {
  const d = parseTanggalIso(iso, 'Tanggal');
  return `${d.getUTCDate()} ${NAMA_BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function bulanRomawi(bulan: number): string {
  if (!Number.isInteger(bulan) || bulan < 1 || bulan > 12) {
    throw new Error('Bulan harus angka 1–12');
  }
  return ROMAWI[bulan - 1];
}

/**
 * Format nomor surat resmi: 007/SKD/RT.05/RW.02/X/2026
 * nomorUrut wajib dari buku agenda user.
 */
export function formatNomorSurat(
  nomorUrut: number,
  kodeJenis: string,
  rt: string,
  rw: string,
  tanggalSuratIso: string,
): string {
  if (!Number.isInteger(nomorUrut) || nomorUrut < 1) {
    throw new Error('Nomor urut surat harus bilangan bulat mulai dari 1');
  }
  if (!kodeJenis.trim()) throw new Error('Kode jenis surat wajib diisi');
  if (!rt.trim() || !rw.trim()) throw new Error('RT/RW wajib diisi');
  const d = parseTanggalIso(tanggalSuratIso, 'Tanggal surat');
  const no = String(nomorUrut).padStart(3, '0');
  return `${no}/${kodeJenis.trim()}/RT.${rt.trim()}/RW.${rw.trim()}/${bulanRomawi(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}

function wajib(value: string, namaField: string): string {
  if (!value || !value.trim()) {
    throw new Error(`${namaField} wajib diisi`);
  }
  return value.trim();
}

function validasiPemohon(p: DataPemohon): DataPemohon {
  validasiNik(p.nik);
  parseTanggalIso(p.tanggalLahir, 'Tanggal lahir');
  if (p.jenisKelamin !== 'L' && p.jenisKelamin !== 'P') {
    throw new Error('Jenis kelamin harus "L" atau "P"');
  }
  return {
    nama: wajib(p.nama, 'Nama'),
    nik: p.nik,
    tempatLahir: wajib(p.tempatLahir, 'Tempat lahir'),
    tanggalLahir: p.tanggalLahir,
    jenisKelamin: p.jenisKelamin,
    pekerjaan: wajib(p.pekerjaan, 'Pekerjaan'),
    alamat: wajib(p.alamat, 'Alamat'),
    rt: wajib(p.rt, 'RT'),
    rw: wajib(p.rw, 'RW'),
    kelurahan: wajib(p.kelurahan, 'Kelurahan'),
    kecamatan: wajib(p.kecamatan, 'Kecamatan'),
    kota: wajib(p.kota, 'Kota'),
  };
}

function jenisKelaminTeks(jk: 'L' | 'P'): string {
  return jk === 'L' ? 'Laki-laki' : 'Perempuan';
}

function blokDataPemohon(p: DataPemohon): string {
  return (
    `Nama : ${p.nama}\n` +
    `NIK : ${p.nik}\n` +
    `Tempat/Tgl Lahir : ${p.tempatLahir}, ${formatTanggalId(p.tanggalLahir)}\n` +
    `Jenis Kelamin : ${jenisKelaminTeks(p.jenisKelamin)}\n` +
    `Pekerjaan : ${p.pekerjaan}\n` +
    `Alamat : ${p.alamat}`
  );
}

function kopDefault(p: DataPemohon): string {
  return (
    `PENGURUS RT ${p.rt} / RW ${p.rw}\n` +
    `Kelurahan ${p.kelurahan}, Kecamatan ${p.kecamatan}\n` +
    `${p.kota}`
  );
}

const KEPERLUAN_KTP: Record<string, string> = {
  baru: 'pembuatan KTP baru',
  perpanjangan: 'perpanjangan KTP',
  pengganti_hilang: 'penggantian KTP karena hilang',
  pengganti_rusak: 'penggantian KTP karena rusak',
};

function paragrafPerJenis(
  jenis: JenisSurat,
  p: DataPemohon,
  tambahan: DataTambahan,
): string[] {
  switch (jenis) {
    case 'DOMISILI': {
      if (tambahan.jenis !== 'DOMISILI') throw new Error('Data tambahan tidak cocok untuk surat domisili');
      const t = tambahan;
      if (!Number.isInteger(t.sejakTahun) || t.sejakTahun < 1900 || t.sejakTahun > 2100) {
        throw new Error('Tahun domisili tidak valid');
      }
      return [
        'Yang bertanda tangan di bawah ini, Ketua RT setempat, dengan ini menerangkan bahwa:',
        blokDataPemohon(p),
        `Nama tersebut di atas adalah benar warga kami yang berdomisili di ${p.alamat}, RT ${p.rt}/RW ${p.rw}, Kelurahan ${p.kelurahan}, sejak tahun ${t.sejakTahun}.`,
        'Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.',
      ];
    }
    case 'USAHA': {
      if (tambahan.jenis !== 'USAHA') throw new Error('Data tambahan tidak cocok untuk surat keterangan usaha');
      const t = tambahan;
      return [
        'Yang bertanda tangan di bawah ini, Ketua RT setempat, dengan ini menerangkan bahwa:',
        blokDataPemohon(p),
        `Nama tersebut di atas adalah benar warga kami yang memiliki usaha "${wajib(t.namaUsaha, 'Nama usaha')}" di bidang ${wajib(t.bidangUsaha, 'Bidang usaha')}, beralamat di ${wajib(t.alamatUsaha, 'Alamat usaha')}, wilayah RT ${p.rt}/RW ${p.rw}.`,
        'Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.',
      ];
    }
    case 'PENGANTAR_KTP': {
      if (tambahan.jenis !== 'PENGANTAR_KTP') throw new Error('Data tambahan tidak cocok untuk surat pengantar KTP');
      const keperluan = KEPERLUAN_KTP[tambahan.keperluan];
      if (!keperluan) throw new Error('Keperluan pengantar KTP tidak dikenal');
      return [
        'Yang bertanda tangan di bawah ini, Ketua RT setempat, dengan ini menerangkan bahwa:',
        blokDataPemohon(p),
        `Nama tersebut di atas adalah benar warga kami, dan diberikan pengantar untuk ${keperluan} di Kelurahan ${p.kelurahan}, Kecamatan ${p.kecamatan}.`,
        'Demikian surat pengantar ini dibuat untuk dipergunakan sebagaimana mestinya.',
      ];
    }
    case 'KELAHIRAN': {
      if (tambahan.jenis !== 'KELAHIRAN') throw new Error('Data tambahan tidak cocok untuk surat keterangan lahir');
      const t = tambahan;
      parseTanggalIso(t.tanggalLahirAnak, 'Tanggal lahir anak');
      if (t.jenisKelaminAnak !== 'L' && t.jenisKelaminAnak !== 'P') {
        throw new Error('Jenis kelamin anak harus "L" atau "P"');
      }
      return [
        'Yang bertanda tangan di bawah ini, Ketua RT setempat, dengan ini menerangkan bahwa telah lahir seorang anak:',
        `Nama : ${wajib(t.namaAnak, 'Nama anak')}\n` +
          `Tanggal Lahir : ${formatTanggalId(t.tanggalLahirAnak)}\n` +
          `Jam Lahir : ${wajib(t.jamLahir, 'Jam lahir')}\n` +
          `Jenis Kelamin : ${jenisKelaminTeks(t.jenisKelaminAnak)}\n` +
          `Nama Ayah : ${wajib(t.namaAyah, 'Nama ayah')}\n` +
          `Nama Ibu : ${wajib(t.namaIbu, 'Nama ibu')}\n` +
          `Alamat : ${p.alamat}, RT ${p.rt}/RW ${p.rw}`,
        `Kelahiran tersebut dilaporkan oleh ${p.nama} (NIK ${p.nik}) selaku orang tua/wali.`,
        'Demikian surat keterangan ini dibuat dengan sebenarnya untuk diteruskan ke Kelurahan.',
      ];
    }
  }
}

/**
 * Bangun surat lengkap dari jenis + data pemohon + data tambahan + opsi.
 * Semua data wajib dari user; tidak ada yang dikarang.
 */
export function bangunSurat(
  jenis: JenisSurat,
  pemohon: DataPemohon,
  tambahan: DataTambahan,
  opsi: OpsiSurat,
): SuratJadi {
  const meta = jenisSuratDariId(jenis);
  if (!meta) throw new Error(`Jenis surat "${jenis}" tidak dikenal`);
  const p = validasiPemohon(pemohon);
  const namaKetuaRt = wajib(opsi.namaKetuaRt, 'Nama Ketua RT');
  const nomor = formatNomorSurat(opsi.nomorUrut, meta.kodeNomor, p.rt, p.rw, opsi.tanggalSurat);
  const paragraf = paragrafPerJenis(jenis, p, tambahan);
  return {
    jenis,
    judul: meta.nama.toUpperCase(),
    nomor,
    kop: opsi.kopCustom?.trim() ? opsi.kopCustom.trim() : kopDefault(p),
    paragraf,
    namaKetuaRt,
    tanggalSuratTeks: formatTanggalId(opsi.tanggalSurat),
  };
}

export interface HasilCekSurat {
  boleh: boolean;
  pesan: string;
  perluUpgrade: boolean;
}

/** Cek batas surat per bulan sesuai tier. */
export function cekBatasSurat(tierId: string, jumlahBulanIni: number): HasilCekSurat {
  const tier = tierDariId(tierId);
  if (!tier) throw new Error(`Tier "${tierId}" tidak dikenal`);
  if (tier.batasSuratPerBulan === -1) {
    return { boleh: true, pesan: `${tier.nama}: surat tanpa batas.`, perluUpgrade: false };
  }
  if (jumlahBulanIni < tier.batasSuratPerBulan) {
    return {
      boleh: true,
      pesan: `${tier.nama}: ${jumlahBulanIni}/${tier.batasSuratPerBulan} surat bulan ini.`,
      perluUpgrade: false,
    };
  }
  return {
    boleh: false,
    pesan: `${tier.nama} hanya sampai ${tier.batasSuratPerBulan} surat per bulan. Upgrade ke Paket Pro untuk tanpa batas.`,
    perluUpgrade: true,
  };
}

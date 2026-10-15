/**
 * Panggilan Kekerabatan Nusantara — pencari sebutan keluarga per suku (engine Tools gratis).
 *
 * Masalah: orang Indonesia sering bingung memanggil kerabat dengan sebutan
 * yang benar menurut sukunya — "pakdhe" atau "paklik"? "tulang" atau "namboru"?
 * "uda" atau "abang"? Yang ada di internet hanya ARTIKEL statis daftar istilah
 * (blog, Brainly, jurnal) — belum ada ALAT interaktif berbahasa Indonesia yang
 * menjawab "hubungan X di suku Y dipanggil apa" plus pencarian terbalik
 * "sebutan X itu hubungan apa".
 *
 * Fungsi murni & deterministik. Tanpa koneksi eksternal.
 *
 * Kejujuran data (aturan konten Madevi #2, #25, #28):
 *  - Hanya sebutan UMUM yang terdokumentasi luas yang masuk data. Pasangan
 *    hubungan×suku yang tidak yakin TIDAK dikarang — engine menjawab jujur
 *    `adaData: false` ("belum ada data — tanyakan ke tetua/keluarga").
 *  - Tiap suku membawa catatan variasi: sebutan dapat berbeda antar daerah,
 *    dialek, dan kebiasaan keluarga.
 *  - Tidak ada klaim pakem tunggal; data dilabeli "sebutan umum", bukan fakta mutlak.
 */

export type SukuId = 'jawa' | 'sunda' | 'minang' | 'batak_toba';

export interface SukuInfo {
  id: SukuId;
  nama: string;
  wilayah: string;
  catatanVariasi: string;
}

export const DAFTAR_SUKU: SukuInfo[] = [
  {
    id: 'jawa',
    nama: 'Jawa',
    wilayah: 'Jawa Tengah, DI Yogyakarta, Jawa Timur',
    catatanVariasi:
      'Sebutan umum; dapat berbeda antara Solo–Yogya, Jawa Timuran, dan kebiasaan tiap keluarga.',
  },
  {
    id: 'sunda',
    nama: 'Sunda',
    wilayah: 'Jawa Barat, Banten',
    catatanVariasi:
      'Sebutan umum; dialek Priangan, Bogor, dan Banten bisa memakai varian lain.',
  },
  {
    id: 'minang',
    nama: 'Minangkabau',
    wilayah: 'Sumatera Barat',
    catatanVariasi:
      'Sistem matrilineal: peran mamak (saudara laki-laki ibu) sangat sentral. Varian antar nagari ada.',
  },
  {
    id: 'batak_toba',
    nama: 'Batak Toba',
    wilayah: 'Sumatera Utara (Toba)',
    catatanVariasi:
      'Sebutan umum Batak Toba; sub-suku Batak lain (Karo, Simalungun, Mandailing) berbeda.',
  },
];

export type HubunganId =
  | 'ayah'
  | 'ibu'
  | 'kakek'
  | 'nenek'
  | 'kakak_l'
  | 'kakak_p'
  | 'adik'
  | 'paman'
  | 'bibi'
  | 'cucu'
  | 'menantu_l'
  | 'menantu_p'
  | 'ipar_l'
  | 'ipar_p';

export interface HubunganInfo {
  id: HubunganId;
  nama: string;
  /** true bila sebutan bisa berbeda menurut urutan kelahiran (kakak/adik dari orang tua). */
  dukungUrutan: boolean;
}

export const DAFTAR_HUBUNGAN: HubunganInfo[] = [
  { id: 'ayah', nama: 'Ayah', dukungUrutan: false },
  { id: 'ibu', nama: 'Ibu', dukungUrutan: false },
  { id: 'kakek', nama: 'Kakek', dukungUrutan: false },
  { id: 'nenek', nama: 'Nenek', dukungUrutan: false },
  { id: 'kakak_l', nama: 'Kakak laki-laki', dukungUrutan: false },
  { id: 'kakak_p', nama: 'Kakak perempuan', dukungUrutan: false },
  { id: 'adik', nama: 'Adik (lk/pr)', dukungUrutan: false },
  { id: 'paman', nama: 'Paman (saudara ayah/ibu)', dukungUrutan: true },
  { id: 'bibi', nama: 'Bibi (saudara ayah/ibu)', dukungUrutan: true },
  { id: 'cucu', nama: 'Cucu', dukungUrutan: false },
  { id: 'menantu_l', nama: 'Menantu laki-laki', dukungUrutan: false },
  { id: 'menantu_p', nama: 'Menantu perempuan', dukungUrutan: false },
  { id: 'ipar_l', nama: 'Ipar laki-laki', dukungUrutan: false },
  { id: 'ipar_p', nama: 'Ipar perempuan', dukungUrutan: false },
];

export interface DataSebutan {
  sebutan: string;
  alternatif?: string[];
  catatan?: string;
  /** Varian menurut urutan kelahiran — hanya dipakai bila relevan (mis. Jawa). */
  varianUrutan?: { kakak: string; adik: string };
}

type PetaSebutan = Partial<Record<HubunganId, DataSebutan>>;

const DATA: Record<SukuId, PetaSebutan> = {
  jawa: {
    ayah: { sebutan: 'bapak', alternatif: ['ayah', 'rama'] },
    ibu: { sebutan: 'ibu', alternatif: ['biyung'] },
    kakek: { sebutan: 'mbah kakung', alternatif: ['eyang kakung'] },
    nenek: { sebutan: 'mbah putri', alternatif: ['eyang putri'] },
    kakak_l: { sebutan: 'mas', alternatif: ['kangmas'] },
    kakak_p: { sebutan: 'mbak', alternatif: ['mbakyu'] },
    adik: { sebutan: 'adik', alternatif: ['dhik'] },
    paman: {
      sebutan: 'pakdhe / paklik',
      alternatif: ['pakde', 'paklek'],
      varianUrutan: { kakak: 'pakdhe', adik: 'paklik' },
      catatan: 'Kakak laki-laki ayah/ibu = pakdhe; adik laki-laki ayah/ibu = paklik.',
    },
    bibi: {
      sebutan: 'budhe / bulik',
      varianUrutan: { kakak: 'budhe', adik: 'bulik' },
      catatan: 'Kakak perempuan ayah/ibu = budhe; adik perempuan ayah/ibu = bulik.',
    },
    cucu: { sebutan: 'putu' },
    menantu_l: { sebutan: 'mantu' },
    menantu_p: { sebutan: 'mantu' },
    ipar_l: { sebutan: 'ipar' },
    ipar_p: { sebutan: 'ipar' },
  },
  sunda: {
    ayah: { sebutan: 'bapa', alternatif: ['apak'] },
    ibu: { sebutan: 'ema', alternatif: ['ambu', 'indung'] },
    kakek: { sebutan: 'aki' },
    nenek: { sebutan: 'nini' },
    kakak_l: { sebutan: 'aa', alternatif: ['akang'] },
    kakak_p: { sebutan: 'teteh', alternatif: ['ceceu'] },
    adik: { sebutan: 'adi' },
    paman: {
      sebutan: 'emang',
      alternatif: ['mamang'],
      catatan: 'Tidak membedakan kakak/adik maupun pihak ayah/ibu.',
    },
    bibi: {
      sebutan: 'embi',
      alternatif: ['bibi'],
      catatan: 'Tidak membedakan kakak/adik maupun pihak ayah/ibu.',
    },
    cucu: { sebutan: 'incu' },
    menantu_l: { sebutan: 'mantu' },
    menantu_p: { sebutan: 'mantu' },
  },
  minang: {
    ayah: { sebutan: 'apak', alternatif: ['ayah'] },
    ibu: { sebutan: 'amak', alternatif: ['mande'] },
    kakak_l: { sebutan: 'uda' },
    kakak_p: { sebutan: 'uni' },
    adik: { sebutan: 'adiak' },
    paman: {
      sebutan: 'mamak',
      catatan:
        'Khusus saudara laki-laki IBU — tokoh sentral dalam adat matrilineal Minang.',
    },
    bibi: { sebutan: 'etek', catatan: 'Umumnya untuk saudara perempuan ibu.' },
    menantu_l: { sebutan: 'minantu' },
    menantu_p: { sebutan: 'minantu' },
  },
  batak_toba: {
    ayah: { sebutan: 'ama' },
    ibu: { sebutan: 'ina' },
    kakek: { sebutan: 'ompung', catatan: 'Ompung dipakai untuk kakek maupun nenek.' },
    nenek: { sebutan: 'ompung', catatan: 'Ompung dipakai untuk kakek maupun nenek.' },
    kakak_l: { sebutan: 'abang' },
    kakak_p: { sebutan: 'kakak' },
    adik: { sebutan: 'anggi' },
    paman: {
      sebutan: 'tulang',
      catatan: 'Saudara laki-laki ibu — sangat dihormati dalam adat Batak.',
    },
    bibi: {
      sebutan: 'namboru',
      catatan: 'Saudara perempuan ayah.',
    },
    cucu: { sebutan: 'pahompu' },
    menantu_l: { sebutan: 'hela' },
    menantu_p: { sebutan: 'parumaen' },
    ipar_l: { sebutan: 'lae' },
    ipar_p: { sebutan: 'eda' },
  },
};

export interface HasilSebutan {
  hubungan: HubunganInfo;
  suku: SukuInfo;
  /** false bila pasangan hubungan×suku belum ada datanya — bukan error. */
  adaData: boolean;
  sebutan?: string;
  alternatif?: string[];
  catatan?: string;
  urutanDipakai?: 'kakak' | 'adik';
}

function sukuDariId(id: string): SukuInfo {
  const s = DAFTAR_SUKU.find((x) => x.id === id);
  if (!s) {
    throw new Error(
      `Suku tidak dikenal: "${id}". Pilih: ${DAFTAR_SUKU.map((x) => x.id).join(', ')}.`,
    );
  }
  return s;
}

function hubunganDariId(id: string): HubunganInfo {
  const h = DAFTAR_HUBUNGAN.find((x) => x.id === id);
  if (!h) {
    throw new Error(
      `Hubungan tidak dikenal: "${id}". Pilih: ${DAFTAR_HUBUNGAN.map((x) => x.id).join(', ')}.`,
    );
  }
  return h;
}

export function daftarSuku(): SukuInfo[] {
  return [...DAFTAR_SUKU];
}

export function daftarHubungan(): HubunganInfo[] {
  return [...DAFTAR_HUBUNGAN];
}

/**
 * Cari sebutan untuk satu hubungan pada satu suku.
 * @param urutan 'kakak'|'adik' — hanya berpengaruh bila data punya varianUrutan.
 * @throws bila id suku/hubungan tidak dikenal.
 */
export function cariSebutan(
  hubunganId: string,
  sukuId: string,
  urutan?: 'kakak' | 'adik',
): HasilSebutan {
  const hubungan = hubunganDariId(hubunganId);
  const suku = sukuDariId(sukuId);
  const data = DATA[suku.id][hubungan.id];

  if (!data) {
    return { hubungan, suku, adaData: false };
  }

  let sebutan = data.sebutan;
  let urutanDipakai: HasilSebutan['urutanDipakai'];
  if (urutan && data.varianUrutan) {
    sebutan = data.varianUrutan[urutan];
    urutanDipakai = urutan;
  }

  return {
    hubungan,
    suku,
    adaData: true,
    sebutan,
    alternatif: data.alternatif ? [...data.alternatif] : undefined,
    catatan: data.catatan,
    urutanDipakai,
  };
}

export interface TemuanSebutan {
  suku: SukuInfo;
  hubungan: HubunganInfo;
  sebutan: string;
  cocokAlternatif?: string;
}

/**
 * Pencarian terbalik: diberi sebuah sebutan (mis. "pakdhe"), kembalikan
 * semua pasangan suku×hubungan yang memakai sebutan itu.
 */
export function cariDariSebutan(teks: string): TemuanSebutan[] {
  const kunci = teks.trim().toLowerCase();
  if (!kunci) {
    throw new Error('Teks sebutan wajib diisi.');
  }
  const hasil: TemuanSebutan[] = [];
  for (const suku of DAFTAR_SUKU) {
    const peta = DATA[suku.id];
    for (const hubungan of DAFTAR_HUBUNGAN) {
      const d = peta[hubungan.id];
      if (!d) continue;
      const kandidat: string[] = [d.sebutan, ...(d.alternatif ?? [])];
      if (d.varianUrutan) kandidat.push(d.varianUrutan.kakak, d.varianUrutan.adik);
      // Pecah "pakdhe / paklik" menjadi token individual agar bisa dicari.
      const token = kandidat.flatMap((k) =>
        k
          .split('/')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      );
      if (token.includes(kunci)) {
        const cocokAlternatif =
          d.sebutan.toLowerCase() === kunci
            ? undefined
            : kandidat.find((k) => k.toLowerCase() === kunci);
        hasil.push({ suku, hubungan, sebutan: d.sebutan, cocokAlternatif });
      }
    }
  }
  return hasil;
}

/** Format jawaban menjadi teks siap tampil/salin. */
export function formatJawaban(h: HasilSebutan): string {
  if (!h.adaData) {
    return (
      `Belum ada data sebutan "${h.hubungan.nama}" untuk suku ${h.suku.nama}.\n` +
      `Data hanya memuat sebutan umum yang terdokumentasi luas — ` +
      `tanyakan langsung ke tetua/keluarga untuk kepastian.`
    );
  }
  const baris = [
    `${h.hubungan.nama} dalam suku ${h.suku.nama}: "${h.sebutan}"`,
  ];
  if (h.alternatif && h.alternatif.length > 0) {
    baris.push(`Alternatif: ${h.alternatif.join(', ')}`);
  }
  if (h.urutanDipakai) {
    baris.push(`(varian untuk ${h.urutanDipakai} dari orang tua)`);
  }
  if (h.catatan) baris.push(`Catatan: ${h.catatan}`);
  baris.push(`Variasi daerah: ${h.suku.catatanVariasi}`);
  return baris.join('\n');
}

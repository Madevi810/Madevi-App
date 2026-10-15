/**
 * PranataMangsaKu - perencana musim tanam Pranata Mangsa (engine Tools gratis).
 *
 * Pranata Mangsa adalah kalender musim pertanian Jawa (12 mangsa, berbasis
 * peredaran matahari) yang dipakai petani menentukan awal masa tanam. Yang ada
 * di web hanya kalkulator watak kelahiran (primbon), tampilan tanggal di
 * aplikasi kalender, dan artikel statis - belum ada perencana interaktif
 * untuk petani: input tanggal menjadi mangsa berjalan + candra + tuntunan
 * tani, plus hitung mundur ke mangsa tanam.
 *
 * Sumber data 12 mangsa: Wikipedia bahasa Indonesia, artikel "Pranata mangsa"
 * (versi Kasunanan). Fakta tabel (nama, rentang, candra, tuntunan) disalin
 * sebagai data + parafrasa ringkas, bukan kutipan panjang.
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Ini VERSI KASUNANAN untuk wilayah antara Gunung Merapi dan Gunung Lawu:
 *    bersifat lokal dan temporal, tidak berlaku mutlak di semua daerah.
 *  - Tuntunan tani konteks historis (padi sawah sekali setahun, lalu palawija
 *    atau padi gogo, lalu bera) - tidak selalu cocok untuk pola tanam modern.
 *  - Perubahan iklim membuat sebagian penciri kurang relevan; anjuran
 *    memadukan dengan prakiraan cuaca modern (mis. BMKG).
 *  - Jumlah hari Kawolu pada tabel sumber 26/27 hari sedangkan rentang
 *    kalender "4 Feb - 28/29 Feb" menghasilkan 25/26 hari; engine memakai
 *    BATAS TANGGAL MULAI tiap mangsa (yang konsisten di sumber) dan mencatat
 *    selisih ini di catatan, bukan mengarang angka.
 *  - Tidak ada klaim ramalan/watak kelahiran - hanya tuntunan tani.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal dan deterministik.
 */

export interface Mangsa {
  /** Nomor urut 1-12. */
  no: number;
  /** Nama mangsa, mis. "Kasa". */
  nama: string;
  /** Nama lengkap dengan nama bulan Jawa, mis. "Kasa (Kartika)". */
  namaLengkap: string;
  /** Musim utama, mis. "Ketiga - Terang". */
  mangsaUtama: string;
  /** Bulan mulai (1-12). */
  awalBulan: number;
  /** Tanggal mulai dalam bulan. */
  awalTanggal: number;
  /** Jumlah hari menurut tabel sumber (total 365; lihat catatan Kawolu). */
  jumlahHariTabel: number;
  /** Candra (perlambang) dalam transliterasi Latin. */
  candra: string;
  /** Arti singkat candra (parafrasa). */
  artiCandra: string;
  /** Penciri gejala alam (parafrasa ringkas). */
  penciri: string;
  /** Tuntunan bagi petani (parafrasa ringkas); "" bila sumber tidak mencantumkan. */
  tuntunan: string;
  /** Kegiatan tanam yang dianjurkan pada mangsa ini; kosong bila tidak ada. */
  kegiatanTanam: string[];
}

export const DAFTAR_MANGSA: Mangsa[] = [
  {
    no: 1, nama: 'Kasa', namaLengkap: 'Kasa (Kartika)', mangsaUtama: 'Ketiga - Terang',
    awalBulan: 6, awalTanggal: 22, jumlahHariTabel: 41,
    candra: 'Sesotya murca ing embanan', artiCandra: 'intan jatuh dari wadahnya: daun-daun berjatuhan',
    penciri: 'Daun berguguran, kayu mengering; belalang masuk ke dalam tanah.',
    tuntunan: 'Saatnya membakar jerami; mulai menanam palawija.',
    kegiatanTanam: ['palawija'],
  },
  {
    no: 2, nama: 'Karo', namaLengkap: 'Karo (Pusa)', mangsaUtama: 'Ketiga - Paceklik',
    awalBulan: 8, awalTanggal: 2, jumlahHariTabel: 23,
    candra: 'Bantala rengka', artiCandra: 'bumi merekah',
    penciri: 'Tanah mengering dan retak-retak; pohon randu dan mangga mulai berbunga.',
    tuntunan: '',
    kegiatanTanam: [],
  },
  {
    no: 3, nama: 'Katelu', namaLengkap: 'Katelu (Manggasri)', mangsaUtama: 'Ketiga - Semplah',
    awalBulan: 8, awalTanggal: 25, jumlahHariTabel: 24,
    candra: 'Suta manut ing bapa', artiCandra: 'anak menurut bapaknya',
    penciri: 'Tanaman merambat menaiki lanjaran; rebung bambu bermunculan.',
    tuntunan: 'Palawija mulai dipanen.',
    kegiatanTanam: [],
  },
  {
    no: 4, nama: 'Kapat', namaLengkap: 'Kapat (Sitra)', mangsaUtama: 'Labuh - Semplah',
    awalBulan: 9, awalTanggal: 18, jumlahHariTabel: 25,
    candra: 'Waspa kumembeng jroning kalbu', artiCandra: 'air mata menggenang dalam kalbu: mata air mulai menggenang',
    penciri: 'Mata air mulai terisi; kapuk randu mulai berbuah; burung-burung kecil bersarang dan bertelur.',
    tuntunan: 'Panen palawija; saat menggarap lahan untuk padi gaga.',
    kegiatanTanam: [],
  },
  {
    no: 5, nama: 'Kalima', namaLengkap: 'Kalima (Manggala)', mangsaUtama: 'Labuh - Semplah',
    awalBulan: 10, awalTanggal: 13, jumlahHariTabel: 27,
    candra: 'Pancuran mas sumawur ing jagad', artiCandra: 'pancuran emas menyirami dunia',
    penciri: 'Mulai ada hujan besar; laron keluar dari liang; tunas-tunas bermunculan.',
    tuntunan: 'Perbaiki selokan sawah dan aliran air di pinggir sawah; mulai menyebar padi gaga.',
    kegiatanTanam: [],
  },
  {
    no: 6, nama: 'Kanem', namaLengkap: 'Kanem (Naya)', mangsaUtama: 'Labuh - Udan',
    awalBulan: 11, awalTanggal: 9, jumlahHariTabel: 43,
    candra: 'Rasa mulya kasucian', artiCandra: 'rasa mulia kesucian',
    penciri: 'Buah-buahan (durian, rambutan, manggis) mulai bermunculan; belibis terlihat di tempat berair.',
    tuntunan: 'Para petani menyebar benih padi di pembenihan.',
    kegiatanTanam: ['sebar benih padi di pembenihan'],
  },
  {
    no: 7, nama: 'Kapitu', namaLengkap: 'Kapitu (Palguna)', mangsaUtama: 'Rendheng - Udan',
    awalBulan: 12, awalTanggal: 23, jumlahHariTabel: 43,
    candra: 'Wisa kentir ing maruta', artiCandra: 'racun hanyut bersama angin: banyak penyakit',
    penciri: 'Banyak hujan; banyak sungai yang banjir.',
    tuntunan: 'Saat memindahkan bibit padi ke sawah.',
    kegiatanTanam: ['pindah tanam bibit padi ke sawah'],
  },
  {
    no: 8, nama: 'Kawolu', namaLengkap: 'Kawolu (Wisaka)', mangsaUtama: 'Rendheng - Pangarep-arep',
    awalBulan: 2, awalTanggal: 4, jumlahHariTabel: 26,
    candra: 'Anjrah jroning kayun', artiCandra: 'keluarnya isi hati',
    penciri: 'Padi menghijau.',
    tuntunan: '',
    kegiatanTanam: [],
  },
  {
    no: 9, nama: 'Kasanga', namaLengkap: 'Kasanga (Jita)', mangsaUtama: 'Rendheng - Pangarep-arep',
    awalBulan: 3, awalTanggal: 1, jumlahHariTabel: 25,
    candra: 'Wedharing wacana mulya', artiCandra: 'munculnya suara-suara mulia',
    penciri: 'Padi berbunga; jangkrik dan tonggeret mulai bersuara.',
    tuntunan: '',
    kegiatanTanam: [],
  },
  {
    no: 10, nama: 'Kasepuluh', namaLengkap: 'Kasepuluh (Srawana)', mangsaUtama: 'Mareng - Pangarep-arep',
    awalBulan: 3, awalTanggal: 26, jumlahHariTabel: 24,
    candra: 'Gedhong mineb jroning kalbu', artiCandra: 'gedung terperangkap dalam kalbu: masanya banyak hewan bunting',
    penciri: 'Padi mulai menguning.',
    tuntunan: '',
    kegiatanTanam: [],
  },
  {
    no: 11, nama: 'Desta', namaLengkap: 'Desta (Padrawana)', mangsaUtama: 'Mareng - Panen',
    awalBulan: 4, awalTanggal: 19, jumlahHariTabel: 23,
    candra: 'Sesotya sinara wedi', artiCandra: 'intan yang bersinar mulia',
    penciri: 'Burung-burung memberi makan anaknya; buah kapuk randu merekah.',
    tuntunan: 'Saat panen raya genjah (panen untuk tanaman berumur pendek).',
    kegiatanTanam: [],
  },
  {
    no: 12, nama: 'Sada', namaLengkap: 'Sada (Asuji)', mangsaUtama: 'Mareng - Terang',
    awalBulan: 5, awalTanggal: 12, jumlahHariTabel: 41,
    candra: 'Tirta sah saking sasana', artiCandra: 'air meninggalkan rumahnya: udara dingin dan kering',
    penciri: 'Suhu menurun dan terasa dingin (bediding).',
    tuntunan: 'Saatnya menanam palawija (kedelai, kapas); menggarap tegalan untuk menanam jagung.',
    kegiatanTanam: ['palawija (kedelai, kapas)', 'jagung di tegalan'],
  },
];

export const CATATAN_BATAS =
  'Versi Kasunanan (wilayah Merapi-Lawu); bersifat lokal dan temporal. ' +
  'Tuntunan konteks historis padi sekali setahun. Padukan dengan prakiraan cuaca modern.';

function kabisat(tahun: number): boolean {
  return (tahun % 4 === 0 && tahun % 100 !== 0) || tahun % 400 === 0;
}

function hariDalamBulan(bulan: number, tahun: number): number {
  const tabel = [31, kabisat(tahun) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return tabel[bulan - 1];
}

/** Validasi tanggal kalender nyata. Melempar Error berbahasa Indonesia bila invalid. */
export function validasiTanggal(tahun: number, bulan: number, tanggal: number): void {
  if (!Number.isInteger(tahun) || tahun < 1900 || tahun > 2100) {
    throw new Error('Tahun harus bilangan bulat 1900-2100.');
  }
  if (!Number.isInteger(bulan) || bulan < 1 || bulan > 12) {
    throw new Error('Bulan harus 1-12.');
  }
  const maks = hariDalamBulan(bulan, tahun);
  if (!Number.isInteger(tanggal) || tanggal < 1 || tanggal > maks) {
    throw new Error(`Tanggal harus 1-${maks} untuk bulan ${bulan} tahun ${tahun}.`);
  }
}

const HARI_MS = 24 * 60 * 60 * 1000;

function selisihHari(dari: Date, ke: Date): number {
  return Math.round((ke.getTime() - dari.getTime()) / HARI_MS);
}

export interface HasilMangsa {
  mangsa: Mangsa;
  /** Hari ke- dalam mangsa (1-based). */
  hariKe: number;
  /** Sisa hari hingga mangsa berganti. */
  sisaHari: number;
  /** Tanggal akhir mangsa: [tahun, bulan, tanggal]. */
  tanggalAkhir: [number, number, number];
  langkah: string[];
}

/**
 * Tentukan mangsa untuk sebuah tanggal kalender.
 * Tahun mangsa berjalan 22 Juni - 21 Juni berikutnya.
 */
export function mangsaDariTanggal(tahun: number, bulan: number, tanggal: number): HasilMangsa {
  validasiTanggal(tahun, bulan, tanggal);

  // Tahun mangsa dimulai 22 Juni; tanggal sebelum itu ikut tahun mangsa sebelumnya.
  const tahunMangsa = bulan > 6 || (bulan === 6 && tanggal >= 22) ? tahun : tahun - 1;
  const awal = new Date(Date.UTC(tahunMangsa, 5, 22));
  const target = new Date(Date.UTC(tahun, bulan - 1, tanggal));
  const offset = selisihHari(awal, target);

  // Offset mulai tiap mangsa dari 22 Juni tahun mangsa.
  const mulaiOffsets: number[] = DAFTAR_MANGSA.map((m) => {
    const y = m.awalBulan >= 6 ? tahunMangsa : tahunMangsa + 1;
    return selisihHari(awal, new Date(Date.UTC(y, m.awalBulan - 1, m.awalTanggal)));
  });

  let idx = 0;
  for (let i = 0; i < mulaiOffsets.length; i++) {
    if (offset >= mulaiOffsets[i]) idx = i;
  }
  const mangsa = DAFTAR_MANGSA[idx];
  const akhirOffset =
    idx + 1 < mulaiOffsets.length
      ? mulaiOffsets[idx + 1] - 1
      : selisihHari(awal, new Date(Date.UTC(tahunMangsa + 1, 5, 22))) - 1;
  const hariKe = offset - mulaiOffsets[idx] + 1;
  const sisaHari = akhirOffset - offset;
  const tglAkhir = new Date(awal.getTime() + akhirOffset * HARI_MS);

  return {
    mangsa,
    hariKe,
    sisaHari,
    tanggalAkhir: [tglAkhir.getUTCFullYear(), tglAkhir.getUTCMonth() + 1, tglAkhir.getUTCDate()],
    langkah: [
      `Tanggal ${tanggal}/${bulan}/${tahun} masuk tahun mangsa mulai 22 Juni ${tahunMangsa}.`,
      `Offset ${offset} hari dari 22 Juni ${tahunMangsa} jatuh pada mangsa ${mangsa.namaLengkap}.`,
      `Hari ke-${hariKe} dari mangsa ${mangsa.nama}; berganti ${sisaHari} hari lagi.`,
    ],
  };
}

export function daftarMangsa(): Mangsa[] {
  return [...DAFTAR_MANGSA];
}

export function mangsaDariNama(nama: string): Mangsa | null {
  const kunci = nama.trim().toLowerCase();
  return DAFTAR_MANGSA.find((m) => m.nama.toLowerCase() === kunci) ?? null;
}

export interface RencanaTanam {
  /** Mangsa tanam yang relevan. */
  mangsa: Mangsa;
  /** Jumlah hari menuju awal mangsa (0 bila sedang berlangsung). */
  hariMenuju: number;
  /** 'berlangsung' bila tanggal input sudah di dalam mangsa tanam. */
  status: 'berlangsung' | 'mendatang';
}

/**
 * Cari mangsa tanam berikutnya: mangsa dengan kegiatanTanam tidak kosong.
 * Bila tanggal input sudah berada di mangsa tanam, kembalikan mangsa itu
 * dengan status 'berlangsung'.
 */
export function mangsaTanamBerikutnya(tahun: number, bulan: number, tanggal: number): RencanaTanam {
  const hasil = mangsaDariTanggal(tahun, bulan, tanggal);
  if (hasil.mangsa.kegiatanTanam.length > 0) {
    return { mangsa: hasil.mangsa, hariMenuju: 0, status: 'berlangsung' };
  }
  // Cari mangsa tanam berikutnya ke depan (maksimal 12 langkah).
  const target = new Date(Date.UTC(tahun, bulan - 1, tanggal));
  for (let d = 1; d <= 366; d++) {
    const t = new Date(target.getTime() + d * HARI_MS);
    const h = mangsaDariTanggal(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
    if (h.mangsa.kegiatanTanam.length > 0) {
      // Pastikan ini awal kemunculan mangsa tanam tersebut (bukan tengah).
      const kemarin = new Date(t.getTime() - HARI_MS);
      const hk = mangsaDariTanggal(kemarin.getUTCFullYear(), kemarin.getUTCMonth() + 1, kemarin.getUTCDate());
      if (hk.mangsa.no !== h.mangsa.no) {
        return { mangsa: h.mangsa, hariMenuju: d, status: 'mendatang' };
      }
    }
  }
  throw new Error('Tidak ditemukan mangsa tanam dalam 366 hari ke depan.');
}

const NAMA_BULAN = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatTanggalID(tahun: number, bulan: number, tanggal: number): string {
  return `${tanggal} ${NAMA_BULAN[bulan]} ${tahun}`;
}

/** Ringkasan siap salin untuk dibagikan (mis. grup tani). */
export function formatMangsaTeks(h: HasilMangsa, tahun: number, bulan: number, tanggal: number): string {
  const m = h.mangsa;
  const baris = [
    `PRANATA MANGSA - ${formatTanggalID(tahun, bulan, tanggal)}`,
    `Mangsa: ${m.namaLengkap} (${m.mangsaUtama})`,
    `Hari ke-${h.hariKe}; berganti mangsa ${h.sisaHari} hari lagi (${formatTanggalID(...h.tanggalAkhir)}).`,
    `Candra: ${m.candra} (${m.artiCandra}).`,
    `Penciri: ${m.penciri}`,
    `Tuntunan: ${m.tuntunan || 'tidak ada tuntunan khusus pada sumber.'}`,
  ];
  if (m.kegiatanTanam.length > 0) {
    baris.push(`Kegiatan tanam: ${m.kegiatanTanam.join(', ')}.`);
  }
  baris.push(`Catatan: ${CATATAN_BATAS}`);
  return baris.join('\n');
}

/**
 * Tipe data Madevi Line — perkumpulan pengguna.
 * Visi Ade: 2 tipe (SOSIAL KARYA + SOSIAL CURHAT) + grup/komunitas.
 * WAJIB: perlindungan dari pornografi, pengancaman, kekerasan, pelecehan.
 */

export type TipePostingan = 'karya' | 'curhat';

export const TIPE_POSTINGAN_LABEL: Record<TipePostingan, string> = {
  karya: 'Sosial Karya',
  curhat: 'Sosial Curhat',
};

export type StatusModerasi = 'menunggu' | 'disetujui' | 'ditolak' | 'dilaporkan';

export interface PostinganLine {
  id: string;
  tipe: TipePostingan;
  penulisId: string;
  penulisNama: string;
  judul?: string;
  isi: string;
  lampiran?: Array<{ jenis: 'gambar' | 'video' | 'file'; url: string; nama: string }>;
  tags: string[];
  // Curhat: anonim opsional
  anonim: boolean;
  // Moderasi
  statusModerasi: StatusModerasi;
  alasanTolak?: string;
  jumlahLaporan: number;
  // Interaksi
  suka: number;
  komentar: KomentarLine[];
  dibuatPada: string;
}

export interface KomentarLine {
  id: string;
  postinganId: string;
  penulisId: string;
  penulisNama: string;
  isi: string;
  // Untuk curhat: komentar bersifat dukungan/saran
  dibuatPada: string;
}

export interface GrupLine {
  id: string;
  nama: string;
  deskripsi: string;
  ikon?: string;
  anggotaIds: string[];
  adminIds: string[];
  aturan: string[];
  dibuatPada: string;
}

/** Kata/frasa yang memicu peninjauan moderasi otomatis. */
const POLA_BERBAHAYA = [
  /bunuh\s+diri/i,
  /mau\s+mati/i,
  /pengen\s+mati/i,
];

/**
 * Pra-moderasi otomatis: deteksi konten berbahaya.
 * Catatan: ini lapisan pertama; moderasi manusia tetap diperlukan.
 */
export function praModerasi(isi: string): { perluTinjau: boolean; alasan?: string; darurat?: boolean } {
  const teks = isi.toLowerCase();
  for (const pola of POLA_BERBAHAYA) {
    if (pola.test(teks)) {
      return {
        perluTinjau: true,
        darurat: true,
        alasan: 'Terdeteksi indikasi krisis — tampilkan sumber bantuan, JANGAN blokir total.',
      };
    }
  }
  return { perluTinjau: false };
}

export const PESAN_DARURAT_CURHAT =
  'Kami peduli padamu. Jika kamu merasa dalam krisis, hubungi: ' +
  'Kemenkes RI 119 ext 8 (24 jam, gratis) atau Into The Light Indonesia. ' +
  'Kamu tidak sendirian. 💙';

export function validasiPostingan(p: Pick<PostinganLine, 'isi' | 'tipe'>): string[] {
  const masalah: string[] = [];
  if (!p.isi.trim()) masalah.push('Isi postingan belum diisi');
  if (p.isi.length > 5000) masalah.push('Isi terlalu panjang (maks 5000 karakter)');
  return masalah;
}

// ============================================================
// Fitur adopsi dari riset komunitas (18 Okt 2026):
// Facebook Groups, Discord, Kaskus — line-analisis.md
// ============================================================

export type LevelReputasi =
  | 'pemula' | 'aktif' | 'kontributor' | 'panutan' | 'legenda';

export const LEVEL_REPUTASI_LABEL: Record<LevelReputasi, string> = {
  pemula: 'Pemula',
  aktif: 'Aktif',
  kontributor: 'Kontributor',
  panutan: 'Panutan',
  legenda: 'Legenda',
};

const BATAS_LEVEL: Array<{ level: LevelReputasi; minSkor: number }> = [
  { level: 'pemula', minSkor: 0 },
  { level: 'aktif', minSkor: 10 },
  { level: 'kontributor', minSkor: 50 },
  { level: 'panutan', minSkor: 200 },
  { level: 'legenda', minSkor: 500 },
];

/**
 * Ide 2: Reputasi apresiasi (ala cendol Kaskus, diperbaiki).
 * Hanya apresiasi positif publik; negatif hanya via laporan privat.
 */
export function levelReputasi(skorApresiasi: number): LevelReputasi {
  let hasil: LevelReputasi = 'pemula';
  for (const b of BATAS_LEVEL) {
    if (skorApresiasi >= b.minSkor) hasil = b.level;
  }
  return hasil;
}

export type RitualMingguan = {
  id: string;
  hari: 'senin' | 'jumat';
  judul: string;
  deskripsi: string;
  tipe: TipePostingan;
};

export const RITUAL_MINGGUAN: RitualMingguan[] = [
  {
    id: 'karya-senin',
    hari: 'senin',
    judul: '🎨 Karya Minggu Ini',
    deskripsi: 'Pamerkan satu karya terbaikmu minggu ini — apapun bentuknya!',
    tipe: 'karya',
  },
  {
    id: 'curhat-jumat',
    hari: 'jumat',
    judul: '💬 Curhat Jumat',
    deskripsi: 'Ceritakan beban pikiranmu minggu ini. Ruang aman, bisa anonim.',
    tipe: 'curhat',
  },
];

/**
 * Ide 1: Ritual mingguan terjadwal.
 * Kembalikan ritual yang jatuh pada hari ini (senin/jumat).
 */
export function ritualHariIni(tanggal: Date = new Date()): RitualMingguan[] {
  const hari = tanggal.getDay(); // 0=minggu
  if (hari === 1) return RITUAL_MINGGUAN.filter((r) => r.hari === 'senin');
  if (hari === 5) return RITUAL_MINGGUAN.filter((r) => r.hari === 'jumat');
  return [];
}

export const ATURAN_KOMUNITAS: string[] = [
  'Hormati semua member — tanpa SARA, ujaran kebencian, atau perundungan.',
  'Tanpa pornografi, kekerasan, ancaman, atau pelecehan dalam bentuk apapun.',
  'Jaga privasi: jangan sebarkan data pribadi orang lain.',
  'Curhat boleh anonim; jangan memaksa orang membuka identitas.',
  'Karya yang dibagikan adalah milik pembuatnya — jangan akui sebagai milikmu.',
  'Gunakan bahasa yang sopan dan membangun.',
  'Laporan pelanggaran bersifat rahasia dan ditangani moderator.',
];

/**
 * Ide 3: Gerbang partisipasi — member wajib setuju aturan sebelum posting pertama.
 * Akun < 24 jam: mode terbatas (baca + apresiasi saja).
 */
export function bolehPosting(
  sudahSetujuAturan: boolean,
  umurAkunJam: number,
): { boleh: boolean; alasan?: string } {
  if (!sudahSetujuAturan) {
    return { boleh: false, alasan: 'Setujui aturan komunitas dulu sebelum memposting.' };
  }
  if (umurAkunJam < 24) {
    return {
      boleh: false,
      alasan: 'Akun baru (< 24 jam) hanya bisa membaca dan memberi apresiasi. Coba lagi nanti.',
    };
  }
  return { boleh: true };
}

export type TingkatSanksi = 'peringatan' | 'bisu_24jam' | 'bisu_7hari' | 'banned';

export interface KeputusanModerasi {
  sanksi: TingkatSanksi | null;
  alasan: string;
  eskalasi: boolean;
}

/**
 * Ide 4: Tangga sanksi otomatis berlapis.
 * Pelanggaran berat (kekerasan/ancaman/pornografi anak) langsung banned.
 */
export function tentukanSanksi(
  jumlahPelanggaran: number,
  pelanggaranBerat: boolean,
): KeputusanModerasi {
  if (pelanggaranBerat) {
    return { sanksi: 'banned', alasan: 'Pelanggaran berat: langsung banned permanen.', eskalasi: true };
  }
  if (jumlahPelanggaran <= 0) return { sanksi: null, alasan: 'Tidak ada pelanggaran.', eskalasi: false };
  if (jumlahPelanggaran === 1) {
    return { sanksi: 'peringatan', alasan: 'Peringatan pertama.', eskalasi: false };
  }
  if (jumlahPelanggaran === 2) {
    return { sanksi: 'bisu_24jam', alasan: 'Pelanggaran kedua: dibisukan 24 jam.', eskalasi: false };
  }
  if (jumlahPelanggaran === 3) {
    return { sanksi: 'bisu_7hari', alasan: 'Pelanggaran ketiga: dibisukan 7 hari.', eskalasi: true };
  }
  return { sanksi: 'banned', alasan: 'Pelanggaran berulang (4+): banned.', eskalasi: true };
}

export interface KaryaPilihan {
  postinganId: string;
  mingguKe: string; // "2026-W42"
  skorApresiasi: number;
  dipilihAdmin: boolean;
  alasanAdmin?: string;
}

/**
 * Ide 5: Karya pilihan mingguan — kurasi ganda (skor + admin).
 */
export function pilihKaryaMingguan(
  kandidat: Array<{ id: string; suka: number }>,
  pilihanAdminId?: string,
  alasanAdmin?: string,
  mingguKe?: string,
): KaryaPilihan | null {
  if (kandidat.length === 0) return null;
  const terbaik = [...kandidat].sort((a, b) => b.suka - a.suka)[0];
  const idTerpilih = pilihanAdminId ?? terbaik.id;
  const dataTerpilih = kandidat.find((k) => k.id === idTerpilih) ?? terbaik;
  const now = new Date();
  const minggu =
    mingguKe ??
    `${now.getFullYear()}-W${String(Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7)).padStart(2, '0')}`;
  return {
    postinganId: idTerpilih,
    mingguKe: minggu,
    skorApresiasi: dataTerpilih.suka,
    dipilihAdmin: !!pilihanAdminId,
    alasanAdmin,
  };
}

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

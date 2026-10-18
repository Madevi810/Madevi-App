/**
 * Tipe data Tutorial Madevi — format baku per visi Ade:
 * masalah → penjelasan → persiapan → cara → risiko → penyelesaian.
 */

export type TingkatKesulitan = 'pemula' | 'menengah' | 'lanjutan';
export type KategoriTutorial =
  | 'kehidupan' | 'kerja' | 'alat' | 'belajar' | 'perbaikan'
  | 'mental' | 'keuangan' | 'kesehatan' | 'teknologi' | 'umkm';

export const KATEGORI_TUTORIAL_LABEL: Record<KategoriTutorial, string> = {
  kehidupan: 'Kehidupan',
  kerja: 'Kerja & Karier',
  alat: 'Alat & Perangkat',
  belajar: 'Belajar',
  perbaikan: 'Perbaikan & DIY',
  mental: 'Mental & Pikiran',
  keuangan: 'Keuangan',
  kesehatan: 'Kesehatan',
  teknologi: 'Teknologi',
  umkm: 'UMKM & Usaha',
};

export interface LangkahTutorial {
  judul: string;
  detail: string;
  tips?: string;
  peringatan?: string;
}

export interface Tutorial {
  id: string;
  slug: string;
  judul: string;
  kategori: KategoriTutorial;
  tingkat: TingkatKesulitan;
  estimasiMenit: number;
  // Format baku: masalah → penyelesaian
  masalah: string;
  penjelasan: string;
  persiapanAlat: string[];
  persiapanBahan?: string[];
  langkah: LangkahTutorial[];
  risiko: Array<{ risiko: string; pencegahan: string }>;
  penyelesaian: string;
  // Opsional: demo interaktif (pola PhET)
  demoSimId?: string;
  // Metadata
  tags: string[];
  dibuatPada: string;
  diperbaruiPada: string;
}

export interface LearningPath {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  kategori: KategoriTutorial;
  tingkat: TingkatKesulitan;
  tutorialIds: string[];
  estimasiTotalMenit: number;
}

/**
 * Validasi: setiap tutorial WAJIB punya penyelesaian (visi Ade:
 * "Semua masalah harus ada penyelesaiannya").
 */
export function validasiTutorial(t: Tutorial): string[] {
  const masalah: string[] = [];
  if (!t.masalah.trim()) masalah.push('Masalah belum diisi');
  if (!t.penjelasan.trim()) masalah.push('Penjelasan belum diisi');
  if (t.langkah.length === 0) masalah.push('Belum ada langkah cara');
  if (!t.penyelesaian.trim()) masalah.push('Penyelesaian WAJIB diisi — semua masalah harus ada penyelesaiannya');
  if (t.risiko.length === 0) masalah.push('Risiko belum diidentifikasi (boleh kosong hanya jika benar-benar tanpa risiko)');
  return masalah;
}

export function ringkasanTutorial(t: Tutorial): string {
  return [
    `MASALAH: ${t.masalah}`,
    `TINGKAT: ${t.tingkat} • ${t.estimasiMenit} menit`,
    `LANGKAH: ${t.langkah.length} langkah`,
    `PENYELESAIAN: ${t.penyelesaian.slice(0, 120)}${t.penyelesaian.length > 120 ? '...' : ''}`,
  ].join('\n');
}

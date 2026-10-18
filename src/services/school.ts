/**
 * Tipe data Madevi School — sekolah digital terasa seperti sekolah nyata.
 * Visi Ade: jenjang → kelas/semester → bab → materi → latihan → ujian → kenaikan kelas.
 */

export type Jenjang =
  | 'paud' | 'sd' | 'smp' | 'sma' | 'smk'
  | 'diploma' | 'sarjana' | 'pascasarjana'
  | 'khusus' | 'agama';

export const JENJANG_LABEL: Record<Jenjang, string> = {
  paud: 'PAUD / TK',
  sd: 'Sekolah Dasar (SD)',
  smp: 'SMP',
  sma: 'SMA',
  smk: 'SMK',
  diploma: 'Diploma',
  sarjana: 'Sarjana (S1)',
  pascasarjana: 'Pascasarjana (S2/S3)',
  khusus: 'Sekolah Kebutuhan Khusus',
  agama: 'Sekolah Agama',
};

export const KELAS_PER_JENJANG: Record<Jenjang, string[]> = {
  paud: ['Kelompok A', 'Kelompok B'],
  sd: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
  smp: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
  sma: ['Kelas 10', 'Kelas 11', 'Kelas 12'],
  smk: ['Kelas 10', 'Kelas 11', 'Kelas 12'],
  diploma: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'],
  sarjana: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'],
  pascasarjana: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'],
  khusus: ['Tingkat Dasar', 'Tingkat Menengah', 'Tingkat Lanjut'],
  agama: ['Tingkat Ibtidaiyah', 'Tingkat Tsanawiyah', 'Tingkat Aliyah'],
};

export interface Bab {
  id: string;
  judul: string;
  deskripsi: string;
  urutan: number;
}

export interface Materi {
  id: string;
  babId: string;
  judul: string;
  konten: string; // markdown
  urutan: number;
  estimasiMenit: number;
}

export type TipeSoal = 'pilihan_ganda' | 'benar_salah' | 'isian' | 'esai';

export interface Soal {
  id: string;
  tipe: TipeSoal;
  pertanyaan: string;
  opsi?: string[];
  kunciJawaban: string;
  pembahasan: string;
  bobot: number;
}

export interface Ujian {
  id: string;
  judul: string;
  jenis: 'latihan' | 'ulangan_harian' | 'uts' | 'uas' | 'ujian_kenaikan';
  babIds: string[];
  soal: Soal[];
  durasiMenit: number;
  nilaiMinimum: number; // KKM
  acakSoal: boolean;
}

export interface HasilUjian {
  ujianId: string;
  userId: string;
  jawaban: Record<string, string>;
  nilai: number;
  lulus: boolean;
  selesaiPada: string;
}

export function hitungNilai(ujian: Ujian, jawaban: Record<string, string>): { nilai: number; lulus: boolean; benar: number } {
  let skor = 0;
  let totalBobot = 0;
  let benar = 0;
  for (const s of ujian.soal) {
    totalBobot += s.bobot;
    const jawab = (jawaban[s.id] ?? '').trim().toLowerCase();
    const kunci = s.kunciJawaban.trim().toLowerCase();
    if (jawab === kunci) {
      skor += s.bobot;
      benar++;
    }
  }
  const nilai = totalBobot === 0 ? 0 : Math.round((skor / totalBobot) * 100);
  return { nilai, lulus: nilai >= ujian.nilaiMinimum, benar };
}

export function syaratKenaikanKelas(nilaiUjianKenaikan: number, kkm: number): { naik: boolean; pesan: string } {
  const naik = nilaiUjianKenaikan >= kkm;
  return {
    naik,
    pesan: naik
      ? `Selamat! Nilai ${nilaiUjianKenaikan} memenuhi KKM ${kkm}. Kamu naik kelas. 🎉`
      : `Nilai ${nilaiUjianKenaikan} belum mencapai KKM ${kkm}. Pelajari lagi materinya dan coba ujian susulan. 💪`,
  };
}

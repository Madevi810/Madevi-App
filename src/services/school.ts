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

// ============================================================
// Fitur adopsi dari riset edtech (18 Okt 2026):
// Ruangguru, Zenius, Sekolah.mu — school-analisis.md
// ============================================================

export type TingkatSoal = 'mudah' | 'sedang' | 'hots';

export interface KuisBab {
  id: string;
  babId: string;
  judul: string;
  soal: Array<Soal & { tingkat: TingkatSoal }>;
  kkm: number;
}

/**
 * Ide 1: Kuis latihan per bab (mudah → HOTS) + pembahasan langsung.
 * Bab tuntas jika nilai >= KKM.
 */
export function nilaiKuisBab(kuis: KuisBab, jawaban: Record<string, string>): {
  nilai: number;
  tuntas: boolean;
  perTingkat: Record<TingkatSoal, { benar: number; total: number }>;
  pembahasan: Array<{ soalId: string; benar: boolean; pembahasan: string }>;
} {
  const perTingkat: Record<TingkatSoal, { benar: number; total: number }> = {
    mudah: { benar: 0, total: 0 },
    sedang: { benar: 0, total: 0 },
    hots: { benar: 0, total: 0 },
  };
  const pembahasan: Array<{ soalId: string; benar: boolean; pembahasan: string }> = [];
  let skor = 0;
  let totalBobot = 0;

  for (const s of kuis.soal) {
    totalBobot += s.bobot;
    perTingkat[s.tingkat].total++;
    const jawab = (jawaban[s.id] ?? '').trim().toLowerCase();
    const kunci = s.kunciJawaban.trim().toLowerCase();
    const benar = jawab === kunci;
    if (benar) {
      skor += s.bobot;
      perTingkat[s.tingkat].benar++;
    }
    pembahasan.push({ soalId: s.id, benar, pembahasan: s.pembahasan });
  }

  const nilai = totalBobot === 0 ? 0 : Math.round((skor / totalBobot) * 100);
  return { nilai, tuntas: nilai >= kuis.kkm, perTingkat, pembahasan };
}

export type TopikStatus = 'merah' | 'kuning' | 'hijau';

export interface AnalisisTopik {
  topik: string;
  benar: number;
  total: number;
  status: TopikStatus;
}

/**
 * Ide 3: Analisis per topik (merah/kuning/hijau) dari hasil tryout.
 */
export function analisisPerTopik(
  hasilPerTopik: Array<{ topik: string; benar: number; total: number }>,
): AnalisisTopik[] {
  return hasilPerTopik.map(({ topik, benar, total }) => {
    const persen = total === 0 ? 0 : (benar / total) * 100;
    const status: TopikStatus = persen >= 75 ? 'hijau' : persen >= 50 ? 'kuning' : 'merah';
    return { topik, benar, total, status };
  });
}

/**
 * Ide 3 lanjutan: "Cek Peluang" — prediksi kelulusan sederhana.
 */
export function cekPeluang(nilaiTryout: number, passingGrade: number): {
  peluang: 'tinggi' | 'sedang' | 'rendah';
  pesan: string;
} {
  const selisih = nilaiTryout - passingGrade;
  if (selisih >= 10) {
    return { peluang: 'tinggi', pesan: `Peluang LULUS tinggi! Nilai ${nilaiTryout} di atas passing grade ${passingGrade}. Pertahankan! 🎯` };
  }
  if (selisih >= 0) {
    return { peluang: 'sedang', pesan: `Peluang SEDANG. Nilai ${nilaiTryout} mepet passing grade ${passingGrade}. Kejar topik merah! 💪` };
  }
  return { peluang: 'rendah', pesan: `Peluang masih RENDAH. Nilai ${nilaiTryout} di bawah passing grade ${passingGrade}. Fokus ke rencana belajar! 📚` };
}

export interface RencanaHarian {
  hari: string;
  kegiatan: string[];
  targetMenit: number;
}

/**
 * Ide 4: Rencana belajar mingguan otomatis dari topik lemah + materi belum tuntas.
 */
export function buatRencanaMingguan(
  topikLemah: string[],
  materiBelumTuntas: string[],
): RencanaHarian[] {
  const hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const semuaTarget = [...topikLemah.map((t) => `Perbaiki topik: ${t}`), ...materiBelumTuntas.map((m) => `Tuntaskan: ${m}`)];
  return hari.map((h, i) => {
    if (i === 6) {
      return { hari: h, kegiatan: ['Istirahat / review ringan'], targetMenit: 15 };
    }
    const kegiatan = semuaTarget.length === 0
      ? ['Latihan soal campuran']
      : [semuaTarget[i % semuaTarget.length]];
    return { hari: h, kegiatan, targetMenit: 45 };
  });
}

/**
 * Ide 4 lanjutan: Laporan orang tua format teks siap-kirim WA.
 */
export function laporanOrangTua(
  namaSiswa: string,
  mingguKe: string,
  ringkasan: { materiTuntas: number; totalMateri: number; rataNilai: number; topikLemah: string[] },
): string {
  const lines = [
    `📊 LAPORAN BELAJAR MINGGUAN`,
    `Nama: ${namaSiswa}`,
    `Periode: ${mingguKe}`,
    ``,
    `✅ Materi tuntas: ${ringkasan.materiTuntas}/${ringkasan.totalMateri}`,
    `📈 Rata-rata nilai: ${ringkasan.rataNilai}`,
  ];
  if (ringkasan.topikLemah.length > 0) {
    lines.push(`🎯 Perlu perhatian: ${ringkasan.topikLemah.join(', ')}`);
  } else {
    lines.push(`🌟 Semua topik dikuasai dengan baik!`);
  }
  lines.push(``, `Dikirim otomatis oleh Madevi School`);
  return lines.join('\n');
}

export type GayaBelajar = 'visual' | 'auditori' | 'kinestetik' | 'membaca';

export interface HasilAsesmen {
  minat: string[];
  gayaBelajar: GayaBelajar;
  rekomendasiJurusan: string[];
  jalurBabIds: string[];
}

/**
 * Ide 5: Asesmen minat bakat — input jawaban singkat, output rekomendasi.
 * Versi sederhana: 3 pertanyaan kunci → rekomendasi.
 */
export function asesmenMinatBakat(jawaban: {
  pelajaranFavorit: string;
  aktivitasFavorit: string;
  gayaBelajar: GayaBelajar;
}): HasilAsesmen {
  const petaJurusan: Record<string, string[]> = {
    matematika: ['Teknik Informatika', 'Statistika', 'Teknik Elektro'],
    fisika: ['Teknik Mesin', 'Fisika', 'Teknik Elektro'],
    biologi: ['Kedokteran', 'Farmasi', 'Biologi'],
    ekonomi: ['Manajemen', 'Akuntansi', 'Ekonomi Pembangunan'],
    bahasa: ['Sastra Indonesia', 'Ilmu Komunikasi', 'Hubungan Internasional'],
    seni: ['Desain Komunikasi Visual', 'Seni Rupa', 'Arsitektur'],
    komputer: ['Teknik Informatika', 'Sistem Informasi', 'Ilmu Komputer'],
  };
  const kunci = jawaban.pelajaranFavorit.toLowerCase();
  const rekomendasiJurusan =
    Object.entries(petaJurusan).find(([k]) => kunci.includes(k))?.[1] ??
    ['Belum terpetakan — konsultasi dengan guru BK disarankan'];
  return {
    minat: [jawaban.pelajaranFavorit, jawaban.aktivitasFavorit],
    gayaBelajar: jawaban.gayaBelajar,
    rekomendasiJurusan,
    jalurBabIds: [], // diisi dari katalog bab sesuai jurusan
  };
}

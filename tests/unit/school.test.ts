import { describe, it, expect } from 'vitest';
import {
  hitungNilai, syaratKenaikanKelas, KELAS_PER_JENJANG,
  nilaiKuisBab, analisisPerTopik, cekPeluang,
  buatRencanaMingguan, laporanOrangTua, asesmenMinatBakat,
  type Ujian, type KuisBab,
} from '@/services/school';

const ujianContoh: Ujian = {
  id: 'u1',
  judul: 'Ulangan Bab 1',
  jenis: 'ulangan_harian',
  babIds: ['b1'],
  durasiMenit: 30,
  nilaiMinimum: 70,
  acakSoal: false,
  soal: [
    { id: 's1', tipe: 'pilihan_ganda', pertanyaan: '2+2?', opsi: ['3', '4', '5'], kunciJawaban: '4', pembahasan: '2+2=4', bobot: 1 },
    { id: 's2', tipe: 'benar_salah', pertanyaan: 'Bumi bulat?', kunciJawaban: 'benar', pembahasan: 'Bumi bulat.', bobot: 1 },
  ],
};

describe('penilaian ujian', () => {
  it('semua benar = 100, lulus', () => {
    const h = hitungNilai(ujianContoh, { s1: '4', s2: 'benar' });
    expect(h.nilai).toBe(100);
    expect(h.lulus).toBe(true);
    expect(h.benar).toBe(2);
  });

  it('setengah benar = 50, tidak lulus', () => {
    const h = hitungNilai(ujianContoh, { s1: '4', s2: 'salah' });
    expect(h.nilai).toBe(50);
    expect(h.lulus).toBe(false);
  });
});

describe('kuis bab bertingkat', () => {
  const kuis: KuisBab = {
    id: 'k1',
    babId: 'b1',
    judul: 'Kuis Bab 1',
    kkm: 70,
    soal: [
      { id: 'q1', tipe: 'pilihan_ganda', tingkat: 'mudah', pertanyaan: 'Q1', kunciJawaban: 'a', pembahasan: 'P1', bobot: 1 },
      { id: 'q2', tipe: 'pilihan_ganda', tingkat: 'hots', pertanyaan: 'Q2', kunciJawaban: 'b', pembahasan: 'P2', bobot: 2 },
    ],
  };

  it('nilai dihitung dengan bobot', () => {
    const h = nilaiKuisBab(kuis, { q1: 'a', q2: 'salah' });
    expect(h.nilai).toBe(33); // 1/3
    expect(h.tuntas).toBe(false);
  });

  it('per tingkat tercatat', () => {
    const h = nilaiKuisBab(kuis, { q1: 'a', q2: 'b' });
    expect(h.perTingkat.mudah.benar).toBe(1);
    expect(h.perTingkat.hots.benar).toBe(1);
    expect(h.tuntas).toBe(true);
  });

  it('pembahasan selalu disertakan', () => {
    const h = nilaiKuisBab(kuis, { q1: 'salah', q2: 'salah' });
    expect(h.pembahasan).toHaveLength(2);
    expect(h.pembahasan[0].benar).toBe(false);
  });
});

describe('analisis topik', () => {
  it('klasifikasi merah/kuning/hijau benar', () => {
    const h = analisisPerTopik([
      { topik: 'Aljabar', benar: 9, total: 10 },
      { topik: 'Geometri', benar: 6, total: 10 },
      { topik: 'Statistika', benar: 3, total: 10 },
    ]);
    expect(h.find((x) => x.topik === 'Aljabar')?.status).toBe('hijau');
    expect(h.find((x) => x.topik === 'Geometri')?.status).toBe('kuning');
    expect(h.find((x) => x.topik === 'Statistika')?.status).toBe('merah');
  });
});

describe('cek peluang', () => {
  it('jauh di atas passing = tinggi', () => {
    expect(cekPeluang(85, 70).peluang).toBe('tinggi');
  });

  it('di bawah passing = rendah', () => {
    expect(cekPeluang(60, 70).peluang).toBe('rendah');
  });
});

describe('rencana mingguan', () => {
  it('7 hari, minggu istirahat', () => {
    const r = buatRencanaMingguan(['Aljabar'], ['Bab 2']);
    expect(r).toHaveLength(7);
    expect(r[6].hari).toBe('Minggu');
    expect(r[6].targetMenit).toBe(15);
  });
});

describe('laporan orang tua', () => {
  it('format teks siap kirim', () => {
    const l = laporanOrangTua('Budi', 'W42', {
      materiTuntas: 8, totalMateri: 10, rataNilai: 82, topikLemah: ['Geometri'],
    });
    expect(l).toContain('Budi');
    expect(l).toContain('8/10');
    expect(l).toContain('Geometri');
  });
});

describe('asesmen minat bakat', () => {
  it('matematika → rekomendasi teknik', () => {
    const h = asesmenMinatBakat({
      pelajaranFavorit: 'Matematika',
      aktivitasFavorit: 'Ngoding',
      gayaBelajar: 'visual',
    });
    expect(h.rekomendasiJurusan).toContain('Teknik Informatika');
    expect(h.gayaBelajar).toBe('visual');
  });
});

describe('struktur jenjang', () => {
  it('SD punya 6 kelas', () => {
    expect(KELAS_PER_JENJANG.sd).toHaveLength(6);
  });
});

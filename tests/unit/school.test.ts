import { describe, it, expect } from 'vitest';
import { hitungNilai, syaratKenaikanKelas, KELAS_PER_JENJANG, type Ujian } from '@/services/school';

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

  it('jawaban case-insensitive', () => {
    const h = hitungNilai(ujianContoh, { s1: '4', s2: 'BENAR' });
    expect(h.nilai).toBe(100);
  });
});

describe('kenaikan kelas', () => {
  it('nilai >= KKM naik kelas', () => {
    const h = syaratKenaikanKelas(75, 70);
    expect(h.naik).toBe(true);
    expect(h.pesan).toContain('naik kelas');
  });

  it('nilai < KKM tidak naik', () => {
    const h = syaratKenaikanKelas(60, 70);
    expect(h.naik).toBe(false);
  });
});

describe('struktur jenjang', () => {
  it('SD punya 6 kelas', () => {
    expect(KELAS_PER_JENJANG.sd).toHaveLength(6);
  });

  it('S1 punya 8 semester', () => {
    expect(KELAS_PER_JENJANG.sarjana).toHaveLength(8);
  });
});

import { describe, it, expect } from 'vitest';
import { hitungTHR, formatTHRTeks } from '@/services/kalkulator-thr';
import { terbilang, formatTerbilangTeks } from '@/services/terbilang';
import { hitungSiklus, formatSiklusTeks } from '@/services/kalender-haid';
import { acakNama, formatAcakTeks } from '@/services/acak-nama';
import { hitungLembur, formatLemburTeks } from '@/services/kalkulator-lembur';

describe('kalkulator-thr', () => {
  it('masa kerja >= 12 bulan → 1x upah', () => {
    const h = hitungTHR({ gajiPokokRp: 5000000, tunjanganTetapRp: 1000000, masaKerjaBulan: 14 });
    expect(h.thrRp).toBe(6000000);
    expect(h.proporsional).toBe(false);
  });

  it('masa kerja 6 bulan → proporsional setengah', () => {
    const h = hitungTHR({ gajiPokokRp: 5000000, tunjanganTetapRp: 1000000, masaKerjaBulan: 6 });
    expect(h.thrRp).toBe(3000000);
    expect(h.proporsional).toBe(true);
  });

  it('menolak masa kerja nol', () => {
    expect(() => hitungTHR({ gajiPokokRp: 5000000, tunjanganTetapRp: 0, masaKerjaBulan: 0 })).toThrow();
  });

  it('format teks memuat nominal', () => {
    const h = hitungTHR({ gajiPokokRp: 5000000, tunjanganTetapRp: 0, masaKerjaBulan: 12 });
    expect(formatTHRTeks(h, { gajiPokokRp: 5000000, tunjanganTetapRp: 0, masaKerjaBulan: 12 })).toContain('5.000.000');
  });
});

describe('terbilang', () => {
  it('nol', () => expect(terbilang(0)).toBe('nol'));
  it('satuan', () => expect(terbilang(7)).toBe('tujuh'));
  it('belasan', () => expect(terbilang(15)).toBe('lima belas'));
  it('puluhan', () => expect(terbilang(42)).toBe('empat puluh dua'));
  it('seratus', () => expect(terbilang(100)).toBe('seratus'));
  it('seribu', () => expect(terbilang(1000)).toBe('seribu'));
  it('sejuta', () => expect(terbilang(1000000)).toBe('sejuta'));
  it('kompleks', () => expect(terbilang(1234567)).toBe('sejuta dua ratus tiga puluh empat ribu lima ratus enam puluh tujuh'));
  it('miliar', () => expect(terbilang(2500000000)).toBe('dua miliar lima ratus juta'));
  it('negatif', () => expect(terbilang(-5)).toBe('minus lima'));
  it('format teks kapital', () => {
    expect(formatTerbilangTeks(1500)).toContain('Seribu lima ratus rupiah');
  });
});

describe('kalender-haid', () => {
  it('siklus 28 hari standar', () => {
    const h = hitungSiklus('2026-09-20', 28);
    expect(h.haidBerikutnya).toBe('2026-10-18');
    expect(h.estimasiOvulasi).toBe('2026-10-04');
    expect(h.masaSuburAwal).toBe('2026-09-29');
    expect(h.masaSuburAkhir).toBe('2026-10-05');
  });

  it('menolak siklus di luar 21–45', () => {
    expect(() => hitungSiklus('2026-09-20', 15)).toThrow();
  });

  it('menolak tanggal masa depan', () => {
    expect(() => hitungSiklus('2030-01-01', 28)).toThrow();
  });

  it('format teks memuat tanggal', () => {
    expect(formatSiklusTeks(hitungSiklus('2026-09-20', 28))).toContain('2026-10-18');
  });
});

describe('acak-nama', () => {
  it('mengembalikan jumlah pemenang yang diminta', () => {
    // seed deterministik untuk test
    let s = 42;
    const rand = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    const h = acakNama(['A', 'B', 'C', 'D'], 2, rand);
    expect(h.pemenang.length).toBe(2);
    expect(h.totalPeserta).toBe(4);
    expect(new Set(h.pemenang).size).toBe(2);
  });

  it('menghapus duplikat', () => {
    const h = acakNama(['A', 'a', 'B'], 1, () => 0.9);
    expect(h.totalPeserta).toBe(2);
  });

  it('menolak pemenang melebihi peserta', () => {
    expect(() => acakNama(['A'], 5)).toThrow();
  });

  it('menolak daftar kosong', () => {
    expect(() => acakNama([])).toThrow();
  });

  it('format teks memuat pemenang', () => {
    const h = acakNama(['Budi', 'Ani'], 1, () => 0.1);
    expect(formatAcakTeks(h)).toContain('PEMENANG');
  });
});

describe('kalkulator-lembur', () => {
  it('hari kerja 2 jam: 1,5x + 2x', () => {
    // gaji 5.200.000 → upah/jam = 30057.8
    const h = hitungLembur(5200000, 2, 'kerja');
    const perJam = 5200000 / 173;
    expect(h.totalUpahLemburRp).toBe(Math.round(1.5 * perJam + 2 * perJam));
    expect(h.rincian.length).toBe(2);
  });

  it('hari kerja 1 jam hanya 1,5x', () => {
    const h = hitungLembur(5200000, 1, 'kerja');
    expect(h.rincian.length).toBe(1);
  });

  it('hari libur 8 jam: 7x2 + 1x3', () => {
    const h = hitungLembur(5200000, 8, 'libur');
    const perJam = 5200000 / 173;
    expect(h.totalUpahLemburRp).toBe(Math.round(7 * 2 * perJam + 3 * perJam));
  });

  it('menolak jam nol', () => {
    expect(() => hitungLembur(5200000, 0, 'kerja')).toThrow();
  });

  it('format teks memuat total', () => {
    const h = hitungLembur(5200000, 2, 'kerja');
    expect(formatLemburTeks(h, 'kerja')).toContain('Total upah lembur');
  });
});

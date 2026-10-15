import { describe, expect, it } from 'vitest';

import { PERAN_TIM, bandingkanOngkos } from '@/services/ongkos-tukang';

const TIM = [
  { peran: 'KEPALA_TUKANG' as const, jumlah: 1, upahHarianRp: 220000 },
  { peran: 'TUKANG' as const, jumlah: 2, upahHarianRp: 180000 },
  { peran: 'KENEK' as const, jumlah: 2, upahHarianRp: 140000 },
];
// biaya per hari = 220.000 + 360.000 + 280.000 = 860.000

describe('peran tim', () => {
  it('tiga peran: kepala tukang, tukang, kenek', () => {
    expect(PERAN_TIM.map((p) => p.id)).toEqual(['KEPALA_TUKANG', 'TUKANG', 'KENEK']);
  });
});

describe('bandingkanOngkos — harian lebih murah', () => {
  it('90 hari × 860rb = 77,4jt vs borongan 90jt → harian menang 12,6jt', () => {
    const h = bandingkanOngkos({
      namaPekerjaan: 'Renovasi rumah',
      tim: TIM,
      estimasiHari: 90,
      hargaBoronganRp: 90000000,
    });
    expect(h.biayaPerHariRp).toBe(860000);
    expect(h.totalHarianRp).toBe(77400000);
    expect(h.totalBoronganRp).toBe(90000000);
    expect(h.selisihRp).toBe(12600000);
    expect(h.lebihMurah).toBe('HARIAN');
    expect(h.rekomendasi).toContain('HARIAN');
  });

  it('titik impas = 90000000 ÷ 860000 ≈ 104.7 hari', () => {
    const h = bandingkanOngkos({
      namaPekerjaan: 'Renovasi rumah',
      tim: TIM,
      estimasiHari: 90,
      hargaBoronganRp: 90000000,
    });
    expect(h.hariImpas).toBeCloseTo(104.7, 1);
  });
});

describe('bandingkanOngkos — borongan lebih murah', () => {
  it('90 hari × 860rb = 77,4jt vs borongan 70jt → borongan menang 7,4jt', () => {
    const h = bandingkanOngkos({
      namaPekerjaan: 'Renovasi rumah',
      tim: TIM,
      estimasiHari: 90,
      hargaBoronganRp: 70000000,
    });
    expect(h.selisihRp).toBe(-7400000);
    expect(h.lebihMurah).toBe('BORONGAN');
    expect(h.rekomendasi).toContain('BORONGAN');
  });
});

describe('bandingkanOngkos — sama besar', () => {
  it('selisih 0 → SAMA + rekomendasi netral', () => {
    const h = bandingkanOngkos({
      namaPekerjaan: 'Cat rumah',
      tim: [{ peran: 'TUKANG', jumlah: 1, upahHarianRp: 150000 }],
      estimasiHari: 10,
      hargaBoronganRp: 1500000,
    });
    expect(h.lebihMurah).toBe('SAMA');
    expect(h.rekomendasi).toContain('SAMA BESAR');
  });
});

describe('langkah & catatan', () => {
  it('langkah memuat rincian tim dan format rupiah', () => {
    const h = bandingkanOngkos({
      namaPekerjaan: 'Pasang keramik',
      tim: [{ peran: 'TUKANG', jumlah: 2, upahHarianRp: 175000 }],
      estimasiHari: 12,
      hargaBoronganRp: 5000000,
    });
    expect(h.langkah.join('\n')).toContain('Rp350.000');
    expect(h.langkah.some((l) => l.includes('Titik impas') || l.includes('titik impas'))).toBe(true);
    expect(h.catatan.length).toBeGreaterThanOrEqual(3);
  });

  it('rekomendasi harian menyebut batas hari impas', () => {
    const h = bandingkanOngkos({
      namaPekerjaan: 'X',
      tim: TIM,
      estimasiHari: 30,
      hargaBoronganRp: 50000000,
    });
    expect(h.lebihMurah).toBe('HARIAN');
    expect(h.rekomendasi).toContain('molor');
  });
});

describe('validasi', () => {
  const valid = {
    namaPekerjaan: 'X',
    tim: [{ peran: 'TUKANG' as const, jumlah: 1, upahHarianRp: 150000 }],
    estimasiHari: 10,
    hargaBoronganRp: 2000000,
  };

  it('menolak nama kosong, tim kosong, hari 0, borongan negatif', () => {
    expect(() => bandingkanOngkos({ ...valid, namaPekerjaan: '' })).toThrow();
    expect(() => bandingkanOngkos({ ...valid, tim: [] })).toThrow();
    expect(() => bandingkanOngkos({ ...valid, estimasiHari: 0 })).toThrow();
    expect(() => bandingkanOngkos({ ...valid, hargaBoronganRp: -1 })).toThrow();
  });

  it('menolak peran tidak dikenal dan jumlah/upah invalid', () => {
    // @ts-expect-error — uji runtime peran invalid
    expect(() => bandingkanOngkos({ ...valid, tim: [{ peran: 'MANDOR', jumlah: 1, upahHarianRp: 1 }] })).toThrow();
    expect(() =>
      bandingkanOngkos({ ...valid, tim: [{ peran: 'TUKANG', jumlah: 0, upahHarianRp: 1 }] }),
    ).toThrow();
    expect(() =>
      bandingkanOngkos({ ...valid, tim: [{ peran: 'TUKANG', jumlah: 1, upahHarianRp: -5 }] }),
    ).toThrow();
  });

  it('biaya harian Rp0 → rekomendasi minta periksa ulang (tidak crash)', () => {
    const h = bandingkanOngkos({
      ...valid,
      tim: [{ peran: 'KENEK', jumlah: 1, upahHarianRp: 0 }],
      hargaBoronganRp: 1000000,
    });
    expect(h.hariImpas).toBe(0);
    expect(h.rekomendasi).toContain('Rp0');
  });
});

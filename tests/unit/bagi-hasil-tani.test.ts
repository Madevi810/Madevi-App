import { describe, expect, it } from 'vitest';

import {
  DAFTAR_SKEMA,
  formatBagiHasilTeks,
  hitungBagiHasil,
} from '@/services/bagi-hasil-tani';

describe('daftar skema', () => {
  it('5 skema: maro, mertelu, merpat, sewa, kustom', () => {
    expect(DAFTAR_SKEMA.map((s) => s.id)).toEqual([
      'maro',
      'mertelu',
      'merpat',
      'sewa',
      'kustom',
    ]);
  });

  it('preset menampilkan rasio eksplisit', () => {
    const maro = DAFTAR_SKEMA.find((s) => s.id === 'maro')!;
    expect(maro.rasioPenggarap).toBe(1);
    expect(maro.rasioPemilik).toBe(1);
    const mertelu = DAFTAR_SKEMA.find((s) => s.id === 'mertelu')!;
    expect([mertelu.rasioPenggarap, mertelu.rasioPemilik]).toEqual([1, 2]);
  });
});

describe('hitungBagiHasil — skema rasio', () => {
  it('maro 10jt tanpa biaya: 5jt / 5jt', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 10_000_000,
      skema: 'maro',
      biayaRp: 0,
      penanggungBiaya: 'proporsional',
    });
    expect(h.bagianPenggarapRp).toBe(5_000_000);
    expect(h.bagianPemilikRp).toBe(5_000_000);
    expect(h.bersihPenggarapRp).toBe(5_000_000);
    expect(h.bersihPemilikRp).toBe(5_000_000);
    expect(h.rugi).toBe(false);
  });

  it('mertelu 9jt: penggarap 3jt, pemilik 6jt', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 9_000_000,
      skema: 'mertelu',
      penanggungBiaya: 'sudah_dipotong',
    });
    expect(h.bagianPenggarapRp).toBe(3_000_000);
    expect(h.bagianPemilikRp).toBe(6_000_000);
  });

  it('merpat 8jt: penggarap 2jt, pemilik 6jt', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 8_000_000,
      skema: 'merpat',
      penanggungBiaya: 'sudah_dipotong',
    });
    expect(h.bagianPenggarapRp).toBe(2_000_000);
    expect(h.bagianPemilikRp).toBe(6_000_000);
  });

  it('kustom 2:3 dari 10jt', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 10_000_000,
      skema: 'kustom',
      rasioPenggarap: 2,
      rasioPemilik: 3,
      penanggungBiaya: 'sudah_dipotong',
    });
    expect(h.bagianPenggarapRp).toBe(4_000_000);
    expect(h.bagianPemilikRp).toBe(6_000_000);
    // total selalu pas (pembulatan satu sisi)
    expect(h.bagianPenggarapRp + h.bagianPemilikRp).toBe(10_000_000);
  });

  it('biaya proporsional: 10jt hasil, 2jt biaya, maro → dasar 8jt', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 10_000_000,
      skema: 'maro',
      biayaRp: 2_000_000,
      penanggungBiaya: 'proporsional',
    });
    expect(h.dasarBagiRp).toBe(8_000_000);
    expect(h.bersihPenggarapRp).toBe(4_000_000);
    expect(h.bersihPemilikRp).toBe(4_000_000);
  });

  it('biaya ditanggung pemilik: 10jt hasil, 2jt biaya, maro', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 10_000_000,
      skema: 'maro',
      biayaRp: 2_000_000,
      penanggungBiaya: 'pemilik',
    });
    expect(h.bersihPenggarapRp).toBe(5_000_000);
    expect(h.bersihPemilikRp).toBe(3_000_000);
  });

  it('biaya ditanggung penggarap: 10jt hasil, 2jt biaya, maro', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 10_000_000,
      skema: 'maro',
      biayaRp: 2_000_000,
      penanggungBiaya: 'penggarap',
    });
    expect(h.bersihPenggarapRp).toBe(3_000_000);
    expect(h.bersihPemilikRp).toBe(5_000_000);
  });

  it('rugi terdeteksi jujur: biaya > hasil', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 5_000_000,
      skema: 'maro',
      biayaRp: 8_000_000,
      penanggungBiaya: 'proporsional',
    });
    expect(h.rugi).toBe(true);
    expect(h.bersihPenggarapRp).toBe(-1_500_000);
    expect(h.langkah.some((l) => l.includes('PERHATIAN'))).toBe(true);
  });
});

describe('hitungBagiHasil — sewa kontan', () => {
  it('sewa 3jt dari hasil 10jt, biaya 1jt ditanggung penggarap', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 10_000_000,
      skema: 'sewa',
      nominalSewaRp: 3_000_000,
      biayaRp: 1_000_000,
      penanggungBiaya: 'penggarap',
    });
    expect(h.bersihPemilikRp).toBe(3_000_000);
    expect(h.bersihPenggarapRp).toBe(6_000_000);
  });
});

describe('hitungBagiHasil — validasi', () => {
  it('skema tak dikenal → error', () => {
    expect(() =>
      hitungBagiHasil({
        hasilKotorRp: 1_000_000,
        skema: 'ngawur' as never,
        penanggungBiaya: 'proporsional',
      }),
    ).toThrow('Skema tidak dikenal');
  });

  it('kustom tanpa rasio → error', () => {
    expect(() =>
      hitungBagiHasil({
        hasilKotorRp: 1_000_000,
        skema: 'kustom',
        penanggungBiaya: 'proporsional',
      }),
    ).toThrow('Rasio penggarap');
  });

  it('sewa tanpa nominal → error', () => {
    expect(() =>
      hitungBagiHasil({
        hasilKotorRp: 1_000_000,
        skema: 'sewa',
        penanggungBiaya: 'penggarap',
      }),
    ).toThrow('Nominal sewa');
  });

  it('hasil negatif → error', () => {
    expect(() =>
      hitungBagiHasil({
        hasilKotorRp: -100,
        skema: 'maro',
        penanggungBiaya: 'proporsional',
      }),
    ).toThrow('Hasil kotor');
  });

  it('penanggung tak dikenal → error', () => {
    expect(() =>
      hitungBagiHasil({
        hasilKotorRp: 1_000_000,
        skema: 'maro',
        penanggungBiaya: 'tetangga' as never,
      }),
    ).toThrow('Penanggung biaya tidak dikenal');
  });
});

describe('formatBagiHasilTeks', () => {
  it('memuat bagian kedua pihak + catatan kesepakatan', () => {
    const h = hitungBagiHasil({
      hasilKotorRp: 9_000_000,
      skema: 'mertelu',
      penanggungBiaya: 'sudah_dipotong',
    });
    const teks = formatBagiHasilTeks(h);
    expect(teks).toContain('Penggarap terima: Rp3.000.000');
    expect(teks).toContain('Pemilik terima: Rp6.000.000');
    expect(teks).toContain('kesepakatan kedua belah pihak');
  });
});

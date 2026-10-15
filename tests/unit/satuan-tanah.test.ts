import { describe, expect, it } from 'vitest';

import {
  DAFTAR_SATUAN_TANAH,
  estimasiLuasSegi4,
  konversiTanah,
  satuanTanahDariKey,
} from '@/services/satuan-tanah';

describe('satuan-tanah', () => {
  it('1 ubin = 14,0625 m²', () => {
    expect(konversiTanah(1, 'ubin', 'm2').nilai).toBe(14.0625);
  });

  it('1 bahu = 500 ubin', () => {
    expect(konversiTanah(1, 'bahu', 'ubin').nilai).toBe(500);
  });

  it('1 rante = 400 m²', () => {
    expect(konversiTanah(1, 'rante', 'm2').nilai).toBe(400);
  });

  it('1 are = 100 m², 1 hektar = 10.000 m²', () => {
    expect(konversiTanah(1, 'are', 'm2').nilai).toBe(100);
    expect(konversiTanah(1, 'hektar', 'm2').nilai).toBe(10000);
  });

  it('bata & tumbak setara ubin', () => {
    expect(konversiTanah(2, 'bata', 'm2').nilai).toBe(28.125);
    expect(konversiTanah(2, 'tumbak', 'm2').nilai).toBe(28.125);
  });

  it('bolak-balik konsisten: 2,5 hektar → are → hektar', () => {
    const keAre = konversiTanah(2.5, 'hektar', 'are');
    expect(keAre.nilai).toBe(250);
    expect(konversiTanah(keAre.nilai, 'are', 'hektar').nilai).toBe(2.5);
  });

  it('key tidak sensitif huruf: UBIN dikenali', () => {
    expect(satuanTanahDariKey('UBIN')?.label).toBe('ubin');
  });

  it('satuan lokal membawa catatan variasi daerah', () => {
    const bahu = satuanTanahDariKey('bahu')!;
    expect(bahu.catatan).toMatch(/berbeda antar daerah/);
  });

  it('nilai negatif ditolak', () => {
    expect(() => konversiTanah(-1, 'ubin', 'm2')).toThrow(/negatif/);
  });

  it('satuan tidak dikenal ditolak', () => {
    expect(() => konversiTanah(1, 'depa', 'm2')).toThrow(/tidak dikenal/);
    expect(() => konversiTanah(1, 'm2', 'jengkal')).toThrow(/tidak dikenal/);
  });

  it('bukan angka ditolak', () => {
    expect(() => konversiTanah(NaN, 'm2', 'are')).toThrow(/angka/);
  });

  it('langkah konversi menjelaskan perhitungan', () => {
    const h = konversiTanah(1, 'ubin', 'm2');
    expect(h.langkah.length).toBeGreaterThan(0);
    expect(DAFTAR_SATUAN_TANAH.length).toBeGreaterThanOrEqual(8);
  });

  it('estimasi petak 10×10×10×10 = 100 m²', () => {
    const h = estimasiLuasSegi4(10, 10, 10, 10);
    expect(h.luasM2).toBe(100);
    expect(h.langkah.length).toBe(3);
  });

  it('estimasi sisi tak sama: (10+14)/2 × (20+20)/2 = 240 m²', () => {
    expect(estimasiLuasSegi4(10, 20, 14, 20).luasM2).toBe(240);
  });

  it('estimasi menyatakan ini perkiraan untuk bentuk tak beraturan', () => {
    expect(estimasiLuasSegi4(10, 10, 10, 10).catatan).toMatch(/perkiraan/);
  });

  it('sisi nol / negatif ditolak', () => {
    expect(() => estimasiLuasSegi4(0, 10, 10, 10)).toThrow(/lebih dari 0/);
    expect(() => estimasiLuasSegi4(10, -5, 10, 10)).toThrow(/lebih dari 0/);
  });
});

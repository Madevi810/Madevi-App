import { describe, expect, it } from 'vitest';

import {
  DAFTAR_SATUAN,
  konversi,
  satuanDariKey,
  satuanPerKategori,
} from '@/services/satuan-tukang';

describe('satuan-tukang', () => {
  it('2 zak semen = 100 kg', () => {
    const h = konversi(2, 'zak', 'kg');
    expect(h.nilai).toBe(100);
    expect(h.langkah.length).toBeGreaterThan(0);
  });

  it('100 kg = 2 zak', () => {
    expect(konversi(100, 'kg', 'zak').nilai).toBe(2);
  });

  it('1 m³ = 1000 liter (kubik pasir)', () => {
    expect(konversi(1, 'm3', 'liter').nilai).toBe(1000);
  });

  it('2 batang besi = 24 meter', () => {
    expect(konversi(2, 'batang', 'meter').nilai).toBe(24);
  });

  it('1 lembar triplek 122x244 = 2,9768 m²', () => {
    expect(konversi(1, 'lembar', 'm2').nilai).toBe(2.9768);
  });

  it('besi D10: 1 batang (12 m) ≈ 7,398 kg', () => {
    // berat/m = π × (10/2000)² × 7850 ≈ 0,6165 kg/m
    const h = konversi(12, 'meter', 'kgBesi', { diameterMm: 10 });
    expect(h.nilai).toBeCloseTo(7.398, 2);
  });

  it('besi D10: 7,398 kg ≈ 12 meter (bolak-balik konsisten)', () => {
    const h = konversi(7.398, 'kgBesi', 'meter', { diameterMm: 10 });
    expect(h.nilai).toBeCloseTo(12, 2);
  });

  it('dus keramik butuh luasPerDus dari kemasan', () => {
    const h = konversi(10, 'dus', 'm2', { luasPerDus: 1.44 });
    expect(h.nilai).toBe(14.4);
  });

  it('kaleng cat butuh beratPerKaleng dari kemasan', () => {
    const h = konversi(2, 'kaleng', 'kg', { beratPerKaleng: 25 });
    expect(h.nilai).toBe(50);
  });

  it('menolak satuan yang tidak dikenal', () => {
    expect(() => konversi(1, 'karung', 'kg')).toThrow('tidak dikenal');
  });

  it('menolak konversi beda besaran (kg ke meter)', () => {
    expect(() => konversi(1, 'kg', 'meter')).toThrow('beda besaran');
  });

  it('menolak bila parameter kemasan tidak diisi (jujur, bukan karangan)', () => {
    expect(() => konversi(1, 'dus', 'm2')).toThrow('wajib diisi');
    expect(() => konversi(1, 'kaleng', 'kg')).toThrow('wajib diisi');
    expect(() => konversi(1, 'meter', 'kgBesi')).toThrow('wajib diisi');
  });

  it('menolak nilai negatif dan bukan angka', () => {
    expect(() => konversi(-1, 'zak', 'kg')).toThrow('negatif');
    expect(() => konversi(NaN, 'zak', 'kg')).toThrow('angka');
  });

  it('semua key satuan unik dan terkategori', () => {
    const keys = DAFTAR_SATUAN.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
    const perKat = satuanPerKategori();
    expect(perKat.MASSA).toContain('zak');
    expect(perKat.PANJANG).toContain('batang');
    expect(perKat.LUAS).toContain('lembar');
    expect(perKat.VOLUME).toContain('m3');
  });

  it('satuanDariKey mengembalikan null untuk key asing', () => {
    expect(satuanDariKey('ember')).toBeNull();
  });
});

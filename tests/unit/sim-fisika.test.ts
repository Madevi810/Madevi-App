import { describe, it, expect } from 'vitest';
import {
  hukumOhm, gerakParabola, pegasOsilasi, posisiPegas,
  analisisKuadrat, hitungPH, kategoriPH, analisisPecahan,
} from '@/services/sim-fisika';

describe('hukum Ohm', () => {
  it('12V / 4Ω = 3A, 36W', () => {
    const h = hukumOhm(12, 4);
    expect(h.arusA).toBe(3);
    expect(h.dayaW).toBe(36);
  });
  it('menolak resistansi nol', () => {
    expect(() => hukumOhm(12, 0)).toThrow();
  });
});

describe('gerak parabola', () => {
  it('45° memberi jarak maksimum', () => {
    const p45 = gerakParabola(20, 45);
    const p30 = gerakParabola(20, 30);
    expect(p45.jarakMaksM).toBeGreaterThan(p30.jarakMaksM);
  });
  it('lintasan 41 titik, mulai & berakhir di tanah', () => {
    const h = gerakParabola(10, 45);
    expect(h.lintasan.length).toBe(41);
    expect(h.lintasan[0].y).toBe(0);
    expect(h.lintasan[40].y).toBe(0);
  });
  it('menolak sudut di luar 0–90', () => {
    expect(() => gerakParabola(10, 100)).toThrow();
  });
});

describe('pegas', () => {
  it('periode T=2π√(m/k)', () => {
    const h = pegasOsilasi(1, 4 * Math.PI * Math.PI);
    expect(h.periodeS).toBeCloseTo(1, 2);
  });
  it('posisi awal = amplitudo', () => {
    expect(posisiPegas(0.1, 2, 0)).toBeCloseTo(0.1, 5);
  });
  it('setengah periode = -amplitudo', () => {
    expect(posisiPegas(0.1, 2, 1)).toBeCloseTo(-0.1, 5);
  });
});

describe('fungsi kuadrat', () => {
  it('x²-5x+6: akar 2 dan 3', () => {
    const h = analisisKuadrat(1, -5, 6);
    expect(h.diskriminan).toBe(1);
    expect(h.akarReal).toContain(2);
    expect(h.akarReal).toContain(3);
    expect(h.titikPuncak.x).toBe(2.5);
  });
  it('diskriminan negatif: tidak ada akar real', () => {
    expect(analisisKuadrat(1, 0, 1).akarReal).toEqual([]);
  });
  it('menolak a=0', () => {
    expect(() => analisisKuadrat(0, 1, 1)).toThrow();
  });
});

describe('pH', () => {
  it('konsentrasi 1e-7 → pH 7', () => {
    expect(hitungPH(1e-7)).toBe(7);
  });
  it('kategori benar', () => {
    expect(kategoriPH(2)).toBe('Asam kuat');
    expect(kategoriPH(7)).toBe('Netral');
    expect(kategoriPH(13)).toBe('Basa kuat');
  });
});

describe('pecahan', () => {
  it('2/4 = 0.5 = 50% = 1/2', () => {
    const h = analisisPecahan(2, 4);
    expect(h.desimal).toBe(0.5);
    expect(h.persen).toBe(50);
    expect(h.senilai).toBe('1/2');
  });
  it('menolak penyebut nol', () => {
    expect(() => analisisPecahan(1, 0)).toThrow();
  });
});

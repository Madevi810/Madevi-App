import { describe, expect, it } from 'vitest';
import {
  CATATAN_SAWAH,
  formatSawahTeks,
  hitungBenih,
  hitungPupuk,
  hitungSawah,
} from '@/services/sawah';

describe('sawah: hitung benih', () => {
  it('1 ha jarak 25 cm -> populasi 160.000 rumpun', () => {
    const h = hitungBenih({ luasM2: 10000 });
    expect(h.populasiRumpun).toBe(160000);
    expect(h.luasHa).toBe(1);
  });

  it('benih 1 ha default = 13,5 kg (dibulatkan ke atas per 0,5)', () => {
    const h = hitungBenih({ luasM2: 10000 });
    expect(h.totalButir).toBe(480000);
    expect(h.benihKg).toBe(13.5);
  });

  it('daya tumbuh 100% menurunkan kebutuhan (12 kg pas)', () => {
    const h = hitungBenih({ luasM2: 10000, dayaTumbuh: 1 });
    expect(h.benihKg).toBe(12);
  });

  it('jarak tanam rapat menaikkan kebutuhan', () => {
    const rapat = hitungBenih({ luasM2: 10000, jarakTanamCm: 20 });
    const renggang = hitungBenih({ luasM2: 10000, jarakTanamCm: 30 });
    expect(rapat.populasiRumpun).toBe(250000);
    expect(rapat.benihKg).toBeGreaterThan(renggang.benihKg);
  });

  it('input tidak valid ditolak', () => {
    expect(() => hitungBenih({ luasM2: 0 })).toThrow();
    expect(() => hitungBenih({ luasM2: 10000, jarakTanamCm: 5 })).toThrow();
    expect(() => hitungBenih({ luasM2: 10000, dayaTumbuh: 1.5 })).toThrow();
    expect(() => hitungBenih({ luasM2: 10000, bibitPerRumpun: 0 })).toThrow();
  });
});

describe('sawah: hitung pupuk', () => {
  it('1 ha dosis default -> urea 250, SP-36 100, KCl 100, NPK 0', () => {
    const h = hitungPupuk({ luasM2: 10000 });
    expect(h.ureaKg).toBe(250);
    expect(h.sp36Kg).toBe(100);
    expect(h.kclKg).toBe(100);
    expect(h.npkKg).toBe(0);
  });

  it('5000 m2 -> setengah dosis per ha', () => {
    const h = hitungPupuk({ luasM2: 5000 });
    expect(h.ureaKg).toBe(125);
    expect(h.sp36Kg).toBe(50);
  });

  it('dosis kustom dipakai apa adanya', () => {
    const h = hitungPupuk({ luasM2: 10000, dosisUreaKgHa: 200, dosisNpkKgHa: 300 });
    expect(h.ureaKg).toBe(200);
    expect(h.npkKg).toBe(300);
  });

  it('luas tidak valid ditolak', () => {
    expect(() => hitungPupuk({ luasM2: -5 })).toThrow();
  });
});

describe('sawah: gabungan dan format', () => {
  it('hitungSawah menggabungkan benih + pupuk', () => {
    const h = hitungSawah({ luasM2: 10000 }, {});
    expect(h.benih.benihKg).toBe(13.5);
    expect(h.pupuk.ureaKg).toBe(250);
    expect(h.langkah.length).toBeGreaterThan(0);
  });

  it('format teks memuat angka dan catatan acuan umum', () => {
    const h = hitungSawah({ luasM2: 10000 }, {});
    const teks = formatSawahTeks(h);
    expect(teks).toContain('KEBUTUHAN BENIH & PUPUK PADI');
    expect(teks).toContain('13.5 kg');
    expect(teks).toContain('250 kg');
    expect(teks).toContain(CATATAN_SAWAH.slice(0, 30));
  });
});

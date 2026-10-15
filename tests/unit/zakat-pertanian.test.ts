import { describe, expect, it } from 'vitest';

import {
  DAFTAR_PENGAIRAN,
  NISHAB_KG_DEFAULT,
  formatZakatTeks,
  hitungZakatPertanian,
} from '@/services/zakat-pertanian';

describe('daftar pengairan & nishab', () => {
  it('3 jenis pengairan dengan kadar 10/5/7,5%', () => {
    expect(DAFTAR_PENGAIRAN.map((p) => p.id)).toEqual(['hujan', 'irigasi', 'campuran']);
    expect(DAFTAR_PENGAIRAN.find((p) => p.id === 'hujan')!.kadar).toBe(0.1);
    expect(DAFTAR_PENGAIRAN.find((p) => p.id === 'irigasi')!.kadar).toBe(0.05);
    expect(DAFTAR_PENGAIRAN.find((p) => p.id === 'campuran')!.kadar).toBe(0.075);
  });

  it('nishab default 653 kg (≈ 5 wasaq)', () => {
    expect(NISHAB_KG_DEFAULT).toBe(653);
  });
});

describe('hitungZakatPertanian — wajib', () => {
  it('1000 kg tadah hujan → zakat 100 kg', () => {
    const h = hitungZakatPertanian({ hasilKg: 1000, pengairan: 'hujan' });
    expect(h.wajib).toBe(true);
    expect(h.zakatKg).toBe(100);
    expect(h.zakatRp).toBeUndefined();
  });

  it('1000 kg irigasi berbiaya → zakat 50 kg', () => {
    const h = hitungZakatPertanian({ hasilKg: 1000, pengairan: 'irigasi' });
    expect(h.wajib).toBe(true);
    expect(h.zakatKg).toBe(50);
  });

  it('1000 kg campuran → zakat 75 kg', () => {
    const h = hitungZakatPertanian({ hasilKg: 1000, pengairan: 'campuran' });
    expect(h.wajib).toBe(true);
    expect(h.zakatKg).toBe(75);
  });

  it('dengan harga: 2000 kg hujan @ Rp6000 → Rp1.200.000', () => {
    const h = hitungZakatPertanian({
      hasilKg: 2000,
      pengairan: 'hujan',
      hargaPerKgRp: 6000,
    });
    expect(h.zakatKg).toBe(200);
    expect(h.zakatRp).toBe(1_200_000);
  });

  it('tepat di nishab (653 kg) → wajib', () => {
    const h = hitungZakatPertanian({ hasilKg: 653, pengairan: 'hujan' });
    expect(h.wajib).toBe(true);
    expect(h.zakatKg).toBe(65.3);
  });

  it('nishab kustom untuk komoditas non-pokok', () => {
    const h = hitungZakatPertanian({
      hasilKg: 500,
      pengairan: 'hujan',
      nishabKg: 400,
    });
    expect(h.wajib).toBe(true);
    expect(h.nishabKg).toBe(400);
    expect(h.zakatKg).toBe(50);
  });
});

describe('hitungZakatPertanian — belum wajib', () => {
  it('500 kg < 653 kg → belum wajib, zakat 0', () => {
    const h = hitungZakatPertanian({ hasilKg: 500, pengairan: 'hujan' });
    expect(h.wajib).toBe(false);
    expect(h.zakatKg).toBe(0);
    expect(h.langkah.some((l) => l.includes('belum mencapai nishab'))).toBe(true);
  });
});

describe('hitungZakatPertanian — validasi', () => {
  it('pengairan tak dikenal → error', () => {
    expect(() =>
      hitungZakatPertanian({ hasilKg: 1000, pengairan: 'selang' as never }),
    ).toThrow('Jenis pengairan tidak dikenal');
  });

  it('hasil nol → error', () => {
    expect(() =>
      hitungZakatPertanian({ hasilKg: 0, pengairan: 'hujan' }),
    ).toThrow('Hasil panen');
  });

  it('hasil negatif → error', () => {
    expect(() =>
      hitungZakatPertanian({ hasilKg: -10, pengairan: 'hujan' }),
    ).toThrow('Hasil panen');
  });

  it('nishab kustom nol → error', () => {
    expect(() =>
      hitungZakatPertanian({ hasilKg: 1000, pengairan: 'hujan', nishabKg: 0 }),
    ).toThrow('Nishab');
  });
});

describe('catatan kejujuran', () => {
  it('selalu menyertakan catatan haul & anjuran verifikasi', () => {
    const h = hitungZakatPertanian({ hasilKg: 1000, pengairan: 'hujan' });
    expect(h.catatan.some((c) => c.includes('SAAT PANEN'))).toBe(true);
    expect(h.catatan.some((c) => c.includes('BAZNAS'))).toBe(true);
  });

  it('formatZakatTeks jujur saat belum wajib', () => {
    const h = hitungZakatPertanian({ hasilKg: 500, pengairan: 'irigasi' });
    const teks = formatZakatTeks(h);
    expect(teks).toContain('BELUM WAJIB');
    expect(teks).toContain('BAZNAS');
  });
});

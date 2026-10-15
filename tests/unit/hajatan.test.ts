import { describe, expect, it } from 'vitest';

import {
  HAJATAN_TIERS,
  JENIS_HIDANGAN,
  KOEFISIEN_DEFAULT,
  cekBatasAcara,
  formatDaftarBelanja,
  hitungHajatan,
  jenisHidanganDariId,
  tierDariId,
} from '@/services/hajatan';

describe('tier', () => {
  it('dua tier: HEMAT 15rb dan PRO 75rb (aturan inovasi 43)', () => {
    expect(HAJATAN_TIERS).toHaveLength(2);
    const hemat = tierDariId('HEMAT')!;
    const pro = tierDariId('PRO')!;
    expect(hemat.hargaRp).toBe(15000);
    expect(pro.hargaRp).toBe(75000);
    expect(hemat.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro.hargaRp).toBeGreaterThanOrEqual(50000);
    expect(pro.hargaRp).toBeLessThanOrEqual(150000);
  });

  it('tier tidak dikenal → null', () => {
    expect(tierDariId('GRATIS')).toBeNull();
  });

  it('batas acara: HEMAT 3/bulan, PRO tanpa batas', () => {
    expect(cekBatasAcara('HEMAT', 2).boleh).toBe(true);
    expect(cekBatasAcara('HEMAT', 3).boleh).toBe(false);
    expect(cekBatasAcara('PRO', 999).boleh).toBe(true);
  });

  it('cekBatasAcara menolak input invalid', () => {
    expect(() => cekBatasAcara('HEMAT', -1)).toThrow();
    expect(() => cekBatasAcara('X', 0)).toThrow();
  });
});

describe('hitungHajatan — prasmanan', () => {
  it('100 tamu prasmanan: beras 11 kg (10 porsi/kg + buffer 10%)', () => {
    const h = hitungHajatan({ namaAcara: 'Nikahan Budi', jumlahTamu: 100, jenisHidangan: 'PRASMANAN' });
    expect(h.tamuEfektif).toBe(110);
    const beras = h.items.find((i) => i.nama === 'Beras')!;
    expect(beras.jumlah).toBe(11);
    expect(beras.satuan).toBe('kg');
  });

  it('100 tamu: ayam 7 ekor (110 ÷ 16 = 6.875 → 7)', () => {
    const h = hitungHajatan({ namaAcara: 'Nikahan Budi', jumlahTamu: 100, jenisHidangan: 'PRASMANAN' });
    const ayam = h.items.find((i) => i.nama === 'Ayam (utuh)')!;
    expect(ayam.jumlah).toBe(7);
  });

  it('100 tamu: kursi 66 (110 × 0.6), tenda 3 (110 ÷ 50 → 2.2 → 3)', () => {
    const h = hitungHajatan({ namaAcara: 'Nikahan Budi', jumlahTamu: 100, jenisHidangan: 'PRASMANAN' });
    expect(h.items.find((i) => i.nama === 'Kursi')!.jumlah).toBe(66);
    expect(h.items.find((i) => i.nama === 'Tenda (sewa)')!.jumlah).toBe(3);
  });

  it('langkah perhitungan terbuka di setiap item', () => {
    const h = hitungHajatan({ namaAcara: 'X', jumlahTamu: 50, jenisHidangan: 'PRASMANAN' });
    for (const it of h.items) {
      expect(it.langkah.length).toBeGreaterThan(0);
    }
  });
});

describe('hitungHajatan — nasi kotak', () => {
  it('200 tamu nasi kotak: minuman 220 pcs, kotak 220 set', () => {
    const h = hitungHajatan({ namaAcara: 'Sunatan Andi', jumlahTamu: 200, jenisHidangan: 'NASI_KOTAK' });
    expect(h.tamuEfektif).toBe(220);
    expect(h.items.find((i) => i.nama === 'Minuman kemasan')!.jumlah).toBe(220);
    expect(h.items.find((i) => i.nama === 'Kotak + sendok')!.jumlah).toBe(220);
    // nasi kotak tidak memakai item gula prasmanan
    expect(h.items.some((i) => i.nama.includes('Gula'))).toBe(false);
  });
});

describe('koefisien custom', () => {
  it('user bisa mengubah koefisien (buffer 0 → tanpa cadangan)', () => {
    const h = hitungHajatan({
      namaAcara: 'X',
      jumlahTamu: 100,
      jenisHidangan: 'PRASMANAN',
      koefisien: { buffer: 0 },
    });
    expect(h.tamuEfektif).toBe(100);
    expect(h.items.find((i) => i.nama === 'Beras')!.jumlah).toBe(10);
  });

  it('koefisien di luar batas ditolak', () => {
    expect(() =>
      hitungHajatan({ namaAcara: 'X', jumlahTamu: 100, jenisHidangan: 'PRASMANAN', koefisien: { buffer: 0.9 } }),
    ).toThrow();
    expect(() =>
      hitungHajatan({ namaAcara: 'X', jumlahTamu: 100, jenisHidangan: 'PRASMANAN', koefisien: { fraksiKursi: 2 } }),
    ).toThrow();
  });
});

describe('validasi', () => {
  it('menolak nama acara kosong, tamu 0, jenis tidak dikenal', () => {
    expect(() => hitungHajatan({ namaAcara: '  ', jumlahTamu: 100, jenisHidangan: 'PRASMANAN' })).toThrow();
    expect(() => hitungHajatan({ namaAcara: 'X', jumlahTamu: 0, jenisHidangan: 'PRASMANAN' })).toThrow();
    expect(() => hitungHajatan({ namaAcara: 'X', jumlahTamu: 1.5, jenisHidangan: 'PRASMANAN' })).toThrow();
    // @ts-expect-error — uji runtime jenis invalid
    expect(() => hitungHajatan({ namaAcara: 'X', jumlahTamu: 100, jenisHidangan: 'KATERING' })).toThrow();
  });

  it('jenisHidanganDariId dan daftar jenis valid', () => {
    expect(JENIS_HIDANGAN).toHaveLength(2);
    expect(jenisHidanganDariId('PRASMANAN')?.nama).toContain('Prasmanan');
    expect(jenisHidanganDariId('X')).toBeNull();
  });
});

describe('formatDaftarBelanja', () => {
  it('menghasilkan teks berisi nama acara dan semua item', () => {
    const h = hitungHajatan({ namaAcara: 'Tahlilan', jumlahTamu: 40, jenisHidangan: 'PRASMANAN' });
    const teks = formatDaftarBelanja(h);
    expect(teks).toContain('Tahlilan');
    expect(teks).toContain('Beras');
    expect(teks).toContain('Kursi');
    expect(teks).toContain('JUMLAH kebutuhan, bukan harga');
  });
});

describe('koefisien default terdokumentasi', () => {
  it('nilai default sesuai sumber yang dicantumkan', () => {
    expect(KOEFISIEN_DEFAULT.porsiPerKgBeras).toBe(10);
    expect(KOEFISIEN_DEFAULT.porsiPerEkorAyam).toBe(16);
    expect(KOEFISIEN_DEFAULT.buffer).toBe(0.1);
  });
});

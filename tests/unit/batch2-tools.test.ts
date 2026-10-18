import { describe, it, expect } from 'vitest';
import { hitungPPN, formatPPNTeks, hitungPPhTahunan } from '@/services/kalkulator-pajak';
import { konversiSuhu, formatSuhuTeks } from '@/services/konverter-suhu';
import { hitungKata, formatHitungKataTeks } from '@/services/penghitung-kata';
import { hitungDiskon, formatDiskonTeks } from '@/services/kalkulator-diskon';
import { hitungUmur, formatUmurTeks } from '@/services/kalkulator-umur';

describe('kalkulator-ppn', () => {
  it('harga belum PPN: 100rb + 11% = 111rb', () => {
    const h = hitungPPN({ hargaRp: 100000, tarifPersen: 11, termasukPPN: false });
    expect(h.dppRp).toBe(100000);
    expect(h.ppnRp).toBe(11000);
    expect(h.totalRp).toBe(111000);
  });

  it('harga sudah termasuk PPN: 111rb → DPP 100rb', () => {
    const h = hitungPPN({ hargaRp: 111000, tarifPersen: 11, termasukPPN: true });
    expect(h.dppRp).toBe(100000);
    expect(h.ppnRp).toBe(11000);
    expect(h.totalRp).toBe(111000);
  });

  it('menolak tarif di luar 0–100', () => {
    expect(() => hitungPPN({ hargaRp: 1000, tarifPersen: 150, termasukPPN: false })).toThrow();
  });

  it('format teks memuat total', () => {
    const h = hitungPPN({ hargaRp: 100000, tarifPersen: 11, termasukPPN: false });
    expect(formatPPNTeks(h, { hargaRp: 100000, tarifPersen: 11, termasukPPN: false })).toContain('111.000');
  });
});

describe('kalkulator-pph', () => {
  it('PKP 50jt → PPh 2,5jt (5%)', () => {
    const { pphRp } = hitungPPhTahunan(50_000_000);
    expect(pphRp).toBe(2_500_000);
  });

  it('PKP 100jt → 2 lapis (5% x 60jt + 15% x 40jt)', () => {
    const { pphRp, rincian } = hitungPPhTahunan(100_000_000);
    expect(pphRp).toBe(3_000_000 + 6_000_000);
    expect(rincian.length).toBe(2);
  });

  it('PKP 0 → PPh 0', () => {
    expect(hitungPPhTahunan(0).pphRp).toBe(0);
  });

  it('menolak PKP negatif', () => {
    expect(() => hitungPPhTahunan(-1000)).toThrow();
  });
});

describe('konverter-suhu', () => {
  it('0°C = 32°F = 273.15K = 0°R', () => {
    const h = konversiSuhu(0, 'C');
    expect(h.fahrenheit).toBe(32);
    expect(h.kelvin).toBe(273.15);
    expect(h.reamur).toBe(0);
  });

  it('100°C = 212°F = 80°R', () => {
    const h = konversiSuhu(100, 'C');
    expect(h.fahrenheit).toBe(212);
    expect(h.reamur).toBe(80);
  });

  it('32°F = 0°C', () => {
    expect(konversiSuhu(32, 'F').celsius).toBe(0);
  });

  it('menolak di bawah nol mutlak', () => {
    expect(() => konversiSuhu(-300, 'C')).toThrow();
  });

  it('format teks memuat 4 satuan', () => {
    const teks = formatSuhuTeks(konversiSuhu(25, 'C'));
    expect(teks).toContain('Celsius');
    expect(teks).toContain('Fahrenheit');
    expect(teks).toContain('Kelvin');
    expect(teks).toContain('Reamur');
  });
});

describe('penghitung-kata', () => {
  it('menghitung teks sederhana', () => {
    const h = hitungKata('Halo dunia. Apa kabar?');
    expect(h.kata).toBe(4);
    expect(h.kalimat).toBe(2);
    expect(h.karakter).toBe(22);
  });

  it('teks kosong → semua nol', () => {
    const h = hitungKata('');
    expect(h.kata).toBe(0);
    expect(h.kalimat).toBe(0);
    expect(h.paragraf).toBe(0);
  });

  it('menghitung paragraf', () => {
    const h = hitungKata('Paragraf satu.\n\nParagraf dua.');
    expect(h.paragraf).toBe(2);
  });

  it('estimasi waktu baca masuk akal', () => {
    const h = hitungKata('kata '.repeat(200).trim());
    expect(h.estimasiWaktuBacaDetik).toBe(60);
  });

  it('format teks memuat jumlah kata', () => {
    expect(formatHitungKataTeks(hitungKata('satu dua tiga'))).toContain('3');
  });
});

describe('kalkulator-diskon', () => {
  it('diskon tunggal 50%: 100rb → 50rb', () => {
    const h = hitungDiskon(100000, [50]);
    expect(h.hargaAkhirRp).toBe(50000);
    expect(h.totalDiskonRp).toBe(50000);
  });

  it('diskon bertingkat 50+20: 100rb → 40rb (bukan 30rb)', () => {
    const h = hitungDiskon(100000, [50, 20]);
    expect(h.hargaAkhirRp).toBe(40000);
    expect(h.hematPersenEfektif).toBe(60);
  });

  it('menolak diskon > 100%', () => {
    expect(() => hitungDiskon(100000, [150])).toThrow();
  });

  it('menolak tanpa diskon', () => {
    expect(() => hitungDiskon(100000, [])).toThrow();
  });

  it('format teks memuat harga akhir', () => {
    expect(formatDiskonTeks(hitungDiskon(100000, [50]))).toContain('50.000');
  });
});

describe('kalkulator-umur', () => {
  it('menghitung umur tepat', () => {
    const h = hitungUmur('2000-01-15', '2026-10-18');
    expect(h.tahun).toBe(26);
    expect(h.bulan).toBe(9);
    expect(h.hari).toBe(3);
  });

  it('menolak tanggal lahir di masa depan', () => {
    expect(() => hitungUmur('2030-01-01', '2026-10-18')).toThrow();
  });

  it('menolak format salah', () => {
    expect(() => hitungUmur('17-05-1990')).toThrow();
    expect(() => hitungUmur('1990-13-01')).toThrow();
  });

  it('hari menuju ultah positif', () => {
    const h = hitungUmur('2000-01-15', '2026-10-18');
    expect(h.hariMenujuUltahBerikutnya).toBeGreaterThan(0);
    expect(h.hariMenujuUltahBerikutnya).toBeLessThanOrEqual(366);
  });

  it('format teks memuat umur', () => {
    expect(formatUmurTeks(hitungUmur('2000-01-15', '2026-10-18'))).toContain('26 tahun');
  });
});

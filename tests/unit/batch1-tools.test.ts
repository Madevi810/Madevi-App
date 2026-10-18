import { describe, it, expect } from 'vitest';
import { hitungCicilan, formatCicilanTeks } from '@/services/kalkulator-keuangan';
import { validasiInputQR, formatQRTeks } from '@/services/generator-qr';
import {
  validasiInputPassword,
  bangunKarakterSet,
  estimasiEntropiBit,
  nilaiKekuatan,
} from '@/services/generator-password';
import { hitungBMI, formatBMITeks } from '@/services/kalkulator-bmi';
import { konversiWaktu, formatWaktuTeks, ZONA_WAKTU } from '@/services/konverter-waktu';

describe('kalkulator-cicilan', () => {
  it('menghitung cicilan flat dengan benar', () => {
    const hasil = hitungCicilan({ pokokRp: 12000000, bungaTahunanPersen: 12, tenorBulan: 12, metode: 'flat' });
    // Bunga flat 12% x 1 tahun = 1.440.000; total 13.440.000 / 12 = 1.120.000
    expect(hasil.cicilanPerBulanRp).toBe(1120000);
    expect(hasil.totalBungaRp).toBe(1440000);
    expect(hasil.totalBayarRp).toBe(13440000);
  });

  it('menghitung cicilan anuitas (mendekati nilai tabel)', () => {
    const hasil = hitungCicilan({ pokokRp: 10000000, bungaTahunanPersen: 12, tenorBulan: 12, metode: 'anuitas' });
    // Anuitas 1%/bulan x 12 bln untuk 10jt ≈ 888.488/bln
    expect(hasil.cicilanPerBulanRp).toBeGreaterThan(888000);
    expect(hasil.cicilanPerBulanRp).toBeLessThan(889000);
    expect(hasil.totalBungaRp).toBeLessThan(700000);
  });

  it('menolak pokok nol', () => {
    expect(() => hitungCicilan({ pokokRp: 0, bungaTahunanPersen: 5, tenorBulan: 12, metode: 'flat' })).toThrow();
  });

  it('format teks memuat angka penting', () => {
    const hasil = hitungCicilan({ pokokRp: 12000000, bungaTahunanPersen: 12, tenorBulan: 12, metode: 'flat' });
    const teks = formatCicilanTeks(hasil, { pokokRp: 12000000, bungaTahunanPersen: 12, tenorBulan: 12, metode: 'flat' });
    expect(teks).toContain('1.120.000');
  });
});

describe('generator-qr', () => {
  it('menerima input valid', () => {
    expect(validasiInputQR({ teks: 'https://madevi.id', ukuranPx: 256 })).toEqual([]);
  });

  it('menolak teks kosong', () => {
    expect(validasiInputQR({ teks: '', ukuranPx: 256 }).length).toBeGreaterThan(0);
  });

  it('menolak ukuran di luar rentang', () => {
    expect(validasiInputQR({ teks: 'halo', ukuranPx: 64 }).length).toBeGreaterThan(0);
  });

  it('format teks memuat info', () => {
    expect(formatQRTeks({ teks: 'halo', ukuranPx: 256 })).toContain('256x256');
  });
});

describe('generator-password', () => {
  it('menerima panjang valid', () => {
    expect(validasiInputPassword({ panjang: 16, pakaiHurufBesar: true, pakaiAngka: true, pakaiSimbol: true })).toEqual([]);
  });

  it('menolak panjang terlalu pendek', () => {
    expect(validasiInputPassword({ panjang: 4, pakaiHurufBesar: false, pakaiAngka: false, pakaiSimbol: false }).length).toBeGreaterThan(0);
  });

  it('set karakter bertambah sesuai opsi', () => {
    const dasar = bangunKarakterSet({ panjang: 16, pakaiHurufBesar: false, pakaiAngka: false, pakaiSimbol: false });
    const penuh = bangunKarakterSet({ panjang: 16, pakaiHurufBesar: true, pakaiAngka: true, pakaiSimbol: true });
    expect(penuh.length).toBeGreaterThan(dasar.length);
    expect(dasar).toBe('abcdefghijklmnopqrstuvwxyz');
  });

  it('entropi 16 karakter penuh > 80 bit (sangat kuat)', () => {
    const set = bangunKarakterSet({ panjang: 16, pakaiHurufBesar: true, pakaiAngka: true, pakaiSimbol: true });
    const entropi = estimasiEntropiBit(16, set.length);
    expect(entropi).toBeGreaterThan(80);
    expect(nilaiKekuatan(entropi)).toBe('SANGAT KUAT');
  });

  it('kategori kekuatan berjenjang', () => {
    expect(nilaiKekuatan(30)).toBe('LEMAH');
    expect(nilaiKekuatan(50)).toBe('SEDANG');
    expect(nilaiKekuatan(70)).toBe('KUAT');
  });
});

describe('kalkulator-bmi', () => {
  it('menghitung BMI normal', () => {
    const hasil = hitungBMI({ beratKg: 65, tinggiCm: 170 });
    expect(hasil.bmi).toBeCloseTo(22.5, 1);
    expect(hasil.kategori).toBe('Normal');
  });

  it('mendeteksi obesitas', () => {
    const hasil = hitungBMI({ beratKg: 100, tinggiCm: 160 });
    expect(hasil.kategori).toBe('Obesitas');
  });

  it('menghitung rentang berat ideal', () => {
    const hasil = hitungBMI({ beratKg: 65, tinggiCm: 170 });
    expect(hasil.beratIdealMinKg).toBeGreaterThan(50);
    expect(hasil.beratIdealMaxKg).toBeLessThan(75);
  });

  it('menolak berat tidak valid', () => {
    expect(() => hitungBMI({ beratKg: -5, tinggiCm: 170 })).toThrow();
  });

  it('format teks memuat kategori', () => {
    const hasil = hitungBMI({ beratKg: 65, tinggiCm: 170 });
    expect(formatBMITeks(hasil, { beratKg: 65, tinggiCm: 170 })).toContain('Normal');
  });
});

describe('konverter-waktu-dunia', () => {
  it('WIB 14:30 → WITA 15:30', () => {
    const hasil = konversiWaktu('14:30', 'WIB', 'WITA');
    expect(hasil.waktuTujuan).toBe('15:30 WITA');
    expect(hasil.selisihJam).toBe(1);
  });

  it('WIB 09:00 → UTC 02:00', () => {
    const hasil = konversiWaktu('09:00', 'WIB', 'UTC');
    expect(hasil.waktuTujuan).toBe('02:00 UTC');
  });

  it('menangani lewat tengah malam (23:00 WIB → 01:00 WIT besok)', () => {
    const hasil = konversiWaktu('23:00', 'WIB', 'WIT');
    expect(hasil.waktuTujuan).toBe('01:00 WIT');
  });

  it('menolak format salah', () => {
    expect(() => konversiWaktu('25:00', 'WIB', 'UTC')).toThrow();
    expect(() => konversiWaktu('14-30', 'WIB', 'UTC')).toThrow();
  });

  it('menolak zona tak dikenal', () => {
    expect(() => konversiWaktu('14:30', 'MARS', 'WIB')).toThrow();
  });

  it('daftar zona memuat zona Indonesia', () => {
    expect(ZONA_WAKTU['WIB']).toBeDefined();
    expect(ZONA_WAKTU['WITA']).toBeDefined();
    expect(ZONA_WAKTU['WIT']).toBeDefined();
  });

  it('format teks memuat kedua waktu', () => {
    const hasil = konversiWaktu('14:30', 'WIB', 'WITA');
    const teks = formatWaktuTeks(hasil);
    expect(teks).toContain('14:30 WIB');
    expect(teks).toContain('15:30 WITA');
  });
});

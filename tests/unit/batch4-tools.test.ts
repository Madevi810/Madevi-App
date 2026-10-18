import { describe, it, expect } from 'vitest';
import { hitungZakatMaal, formatZakatMaalTeks, hitungZakatFitrah } from '@/services/kalkulator-zakat';
import { konversiMataUang, formatMataUangTeks, KURS_TERHADAP_IDR } from '@/services/konverter-mata-uang';
import { hitungWinStreak, formatWRTeks } from '@/services/kalkulator-wr';
import { hitungKebutuhanAir, formatAirTeks } from '@/services/kalkulator-air';
import { buatJadwalPiket, formatPiketTeks } from '@/services/jadwal-piket';

describe('kalkulator-zakat', () => {
  it('harta di atas nisab wajib zakat 2,5%', () => {
    const h = hitungZakatMaal({ totalHartaRp: 100_000_000, hargaEmasPerGramRp: 1_000_000 });
    expect(h.nisabRp).toBe(85_000_000);
    expect(h.wajibZakat).toBe(true);
    expect(h.zakatRp).toBe(2_500_000);
  });

  it('harta di bawah nisab belum wajib', () => {
    const h = hitungZakatMaal({ totalHartaRp: 50_000_000, hargaEmasPerGramRp: 1_000_000 });
    expect(h.wajibZakat).toBe(false);
    expect(h.zakatRp).toBe(0);
  });

  it('zakat fitrah 4 jiwa', () => {
    const h = hitungZakatFitrah(4, 15000);
    expect(h.totalKg).toBe(10);
    expect(h.totalRp).toBe(150000);
  });

  it('menolak jiwa nol', () => {
    expect(() => hitungZakatFitrah(0, 15000)).toThrow();
  });

  it('format maal memuat status', () => {
    expect(formatZakatMaalTeks(hitungZakatMaal({ totalHartaRp: 100_000_000, hargaEmasPerGramRp: 1_000_000 }))).toContain('WAJIB');
  });
});

describe('konverter-mata-uang', () => {
  it('100 USD ke IDR', () => {
    const h = konversiMataUang(100, 'USD', 'IDR');
    expect(h.jumlahTujuan).toBe(1580000);
  });

  it('1 juta IDR ke USD', () => {
    const h = konversiMataUang(1000000, 'IDR', 'USD');
    expect(h.jumlahTujuan).toBeCloseTo(63.29, 1);
  });

  it('sama mata uang = sama jumlah', () => {
    expect(konversiMataUang(500, 'USD', 'USD').jumlahTujuan).toBe(500);
  });

  it('menolak kode tak dikenal', () => {
    expect(() => konversiMataUang(100, 'XYZ', 'IDR')).toThrow();
  });

  it('12 mata uang tersedia', () => {
    expect(Object.keys(KURS_TERHADAP_IDR).length).toBe(12);
  });

  it('format teks memuat hasil', () => {
    expect(formatMataUangTeks(konversiMataUang(100, 'USD', 'IDR'))).toContain('1.580.000');
  });
});

describe('kalkulator-winrate', () => {
  it('100 match 50% → target 60% butuh 25 win streak', () => {
    const h = hitungWinStreak(100, 50, 60);
    // (0.6*100 - 50) / 0.4 = 25
    expect(h.winStreakDibutuhkan).toBe(25);
    expect(h.totalMatchAkhir).toBe(125);
  });

  it('target sudah tercapai → 0', () => {
    expect(hitungWinStreak(100, 70, 60).winStreakDibutuhkan).toBe(0);
  });

  it('target 100% mustahil bila ada kalah', () => {
    const h = hitungWinStreak(100, 90, 100);
    expect(h.mustahil).toBe(true);
  });

  it('menolak WR di luar 0–100', () => {
    expect(() => hitungWinStreak(100, 150, 60)).toThrow();
  });

  it('format teks memuat streak', () => {
    expect(formatWRTeks(hitungWinStreak(100, 50, 60))).toContain('25');
  });
});

describe('kalkulator-air', () => {
  it('70 kg aktivitas rendah cuaca normal = 2100 ml', () => {
    const h = hitungKebutuhanAir({ beratKg: 70, aktivitas: 'rendah', cuaca: 'normal' });
    expect(h.mlPerHari).toBe(2100);
    expect(h.gelasPerHari).toBe(9); // ceil(2100/250) = 9
  });

  it('aktivitas tinggi + cuaca panas menambah 1500 ml', () => {
    const h = hitungKebutuhanAir({ beratKg: 70, aktivitas: 'tinggi', cuaca: 'panas' });
    expect(h.mlPerHari).toBe(3600);
  });

  it('menolak berat nol', () => {
    expect(() => hitungKebutuhanAir({ beratKg: 0, aktivitas: 'rendah', cuaca: 'normal' })).toThrow();
  });

  it('format teks memuat gelas', () => {
    expect(formatAirTeks(hitungKebutuhanAir({ beratKg: 70, aktivitas: 'rendah', cuaca: 'normal' }))).toContain('9 gelas');
  });
});

describe('jadwal-piket', () => {
  it('membagi 3 orang ke 3 hari', () => {
    const h = buatJadwalPiket(['A', 'B', 'C'], ['Senin', 'Selasa', 'Rabu']);
    expect(h.jadwal.length).toBe(3);
    expect(h.jadwal[0].nama).toEqual(['A']);
    expect(h.jadwal[1].nama).toEqual(['B']);
  });

  it('bergiliran saat orang kurang dari hari', () => {
    const h = buatJadwalPiket(['A', 'B'], ['Senin', 'Selasa', 'Rabu']);
    expect(h.jadwal[2].nama).toEqual(['A']);
  });

  it('2 orang per hari', () => {
    const h = buatJadwalPiket(['A', 'B', 'C', 'D'], ['Senin'], 2);
    expect(h.jadwal[0].nama).toEqual(['A', 'B']);
  });

  it('menolak nama kosong', () => {
    expect(() => buatJadwalPiket([], ['Senin'])).toThrow();
  });

  it('format teks memuat jadwal', () => {
    const teks = formatPiketTeks(buatJadwalPiket(['A', 'B'], ['Senin', 'Selasa']));
    expect(teks).toContain('Senin: A');
    expect(teks).toContain('Selasa: B');
  });
});

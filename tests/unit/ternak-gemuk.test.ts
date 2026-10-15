import { describe, expect, it } from 'vitest';

import {
  BATAS_ADG_REALISTIS_GRAM,
  DISCLAIMER_TERNAK,
  MAX_DURASI_HARI,
  MIN_DURASI_HARI,
  formatTernakTeks,
  hitungPenggemukan,
  type InputPenggemukan,
} from '@/services/ternak-gemuk';

function inputAcuan(): InputPenggemukan {
  return {
    jumlahEkor: 10,
    bobotAwalKg: 15,
    bobotTargetKg: 25,
    durasiHari: 100,
    hargaBakalanPerEkorRp: 900000,
    biayaPakanPerEkorPerHariRp: 3000,
    biayaObatPerEkorRp: 15000,
    biayaTenagaKerjaRp: 500000,
    biayaKandangRp: 1000000,
    modeJual: 'per-ekor',
    hargaJualRp: 1600000,
  };
}

describe('hitungPenggemukan — kasus acuan', () => {
  it('ADG tepat 100 g/hari untuk 10 kg dalam 100 hari', () => {
    const h = hitungPenggemukan(inputAcuan());
    expect(h.kenaikanBobotKg).toBe(10);
    expect(h.adgGramPerHari).toBeCloseTo(100, 6);
    expect(h.bobotAkhirTotalKg).toBe(250);
  });

  it('total biaya = jumlah semua komponen', () => {
    const h = hitungPenggemukan(inputAcuan());
    // bakalan 9.000.000 + pakan 3.000.000 + obat 150.000 + TK 500.000 + kandang 1.000.000
    expect(h.totalBiayaPakanRp).toBe(3000 * 10 * 100);
    expect(h.totalBiayaRp).toBe(9000000 + 3000000 + 150000 + 500000 + 1000000);
  });

  it('pendapatan, laba, margin mode per-ekor', () => {
    const h = hitungPenggemukan(inputAcuan());
    expect(h.pendapatanRp).toBe(1600000 * 10);
    expect(h.labaRp).toBe(h.pendapatanRp - h.totalBiayaRp);
    expect(h.marginPersen).toBeCloseTo((h.labaRp / h.totalBiayaRp) * 100, 6);
  });

  it('pendapatan mode per-kg', () => {
    const h = hitungPenggemukan({ ...inputAcuan(), modeJual: 'per-kg', hargaJualRp: 65000 });
    expect(h.pendapatanRp).toBe(65000 * 250);
  });

  it('BEP per kg = totalBiaya / bobotAkhir; BEP per ekor = totalBiaya / ekor', () => {
    const h = hitungPenggemukan(inputAcuan());
    expect(h.bepPerKgRp).toBeCloseTo(h.totalBiayaRp / 250, 6);
    expect(h.bepPerEkorRp).toBeCloseTo(h.totalBiayaRp / 10, 6);
  });

  it('tanpa peringatan pada kasus acuan yang sehat', () => {
    const h = hitungPenggemukan(inputAcuan());
    expect(h.peringatan).toHaveLength(0);
  });

  it('langkah perhitungan transparan & tidak kosong', () => {
    const h = hitungPenggemukan(inputAcuan());
    expect(h.langkah.length).toBeGreaterThan(4);
  });
});

describe('hitungPenggemukan — peringatan jujur', () => {
  it('rugi → peringatan rugi', () => {
    const h = hitungPenggemukan({ ...inputAcuan(), hargaJualRp: 1000000 });
    expect(h.labaRp).toBeLessThan(0);
    expect(h.peringatan.some((p) => p.includes('RUGI'))).toBe(true);
  });

  it('ADG di atas ambang → peringatan tidak realistis', () => {
    // 10 kg dalam 30 hari = 333 g/hari
    const h = hitungPenggemukan({ ...inputAcuan(), durasiHari: 30 });
    expect(h.adgGramPerHari).toBeGreaterThan(BATAS_ADG_REALISTIS_GRAM);
    expect(h.peringatan.some((p) => p.includes('tidak realistis'))).toBe(true);
  });

  it('margin tipis (<10%) → peringatan margin', () => {
    // cari harga jual yang memberi margin ~5%
    const dasar = hitungPenggemukan(inputAcuan());
    const target = dasar.totalBiayaRp * 1.05;
    const h = hitungPenggemukan({ ...inputAcuan(), hargaJualRp: target / 10 });
    expect(h.marginPersen).toBeGreaterThan(0);
    expect(h.marginPersen).toBeLessThan(10);
    expect(h.peringatan.some((p) => p.includes('tipis'))).toBe(true);
  });

  it('durasi > 120 hari → peringatan risiko pakan', () => {
    const h = hitungPenggemukan({ ...inputAcuan(), durasiHari: 150, bobotTargetKg: 30 });
    expect(h.peringatan.some((p) => p.includes('120 hari'))).toBe(true);
  });
});

describe('hitungPenggemukan — validasi', () => {
  it('bobot target <= awal ditolak', () => {
    expect(() => hitungPenggemukan({ ...inputAcuan(), bobotTargetKg: 15 })).toThrow();
    expect(() => hitungPenggemukan({ ...inputAcuan(), bobotTargetKg: 10 })).toThrow();
  });

  it('durasi di luar 30–180 ditolak', () => {
    expect(() => hitungPenggemukan({ ...inputAcuan(), durasiHari: MIN_DURASI_HARI - 1 })).toThrow();
    expect(() => hitungPenggemukan({ ...inputAcuan(), durasiHari: MAX_DURASI_HARI + 1 })).toThrow();
  });

  it('modeJual tak dikenal ditolak', () => {
    expect(() =>
      hitungPenggemukan({ ...inputAcuan(), modeJual: 'per-liter' as never }),
    ).toThrow();
  });

  it('nilai negatif & ekor 0 ditolak', () => {
    expect(() => hitungPenggemukan({ ...inputAcuan(), jumlahEkor: 0 })).toThrow();
    expect(() =>
      hitungPenggemukan({ ...inputAcuan(), biayaPakanPerEkorPerHariRp: -100 }),
    ).toThrow();
  });

  it('deterministik — dua kali hasil identik', () => {
    const a = hitungPenggemukan(inputAcuan());
    const b = hitungPenggemukan(inputAcuan());
    expect(a).toEqual(b);
  });
});

describe('formatTernakTeks', () => {
  it('memuat angka kunci + disclaimer', () => {
    const teks = formatTernakTeks(hitungPenggemukan(inputAcuan()));
    expect(teks).toContain('TERNAKKU');
    expect(teks).toContain('ADG');
    expect(teks).toContain('Titik impas (BEP)');
    expect(teks).toContain(DISCLAIMER_TERNAK.slice(0, 40));
  });
});

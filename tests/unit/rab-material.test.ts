import { describe, expect, it } from 'vitest';

import {
  RAB_TIERS,
  cekBatasProyek,
  estimasiBiaya,
  formatRupiah,
  hitungKebutuhan,
  pekerjaanDariId,
  tierDariId,
} from '@/services/rab-material';

describe('rab-material: tier harga', () => {
  it('dua tier sesuai aturan: HEMAT 10–50rb, PRO 50–150rb', () => {
    const hemat = tierDariId('HEMAT');
    const pro = tierDariId('PRO');
    expect(hemat?.hargaRp).toBe(25000);
    expect(pro?.hargaRp).toBe(99000);
    expect(hemat!.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat!.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro!.hargaRp).toBeGreaterThanOrEqual(50000);
    expect(pro!.hargaRp).toBeLessThanOrEqual(150000);
    expect(RAB_TIERS).toHaveLength(2);
  });

  it('tier asing mengembalikan null', () => {
    expect(tierDariId('SULTAN')).toBeNull();
  });
});

describe('rab-material: hitung kebutuhan', () => {
  it('dinding bata 10 m² → 700 bata, 2,5 zak, 0,5 m³ pasir', () => {
    const h = hitungKebutuhan('dinding_bata', 10);
    expect(h.namaPekerjaan).toContain('Bata');
    const map = Object.fromEntries(h.rincian.map((r) => [r.material, r]));
    expect(map['Bata merah'].jumlah).toBe(700);
    expect(map['Bata merah'].satuan).toBe('buah');
    expect(map['Semen'].jumlah).toBe(2.5);
    expect(map['Pasir'].jumlah).toBe(0.5);
    expect(h.catatanKoefisien).toContain('UMUM');
  });

  it('cor beton 2 m³ → 13 zak semen', () => {
    const h = hitungKebutuhan('beton_campuran', 2);
    const semen = h.rincian.find((r) => r.material === 'Semen');
    expect(semen?.jumlah).toBe(13);
    expect(h.satuanInput).toBe('m3');
  });

  it('cat 20 m² → 4 liter', () => {
    const h = hitungKebutuhan('cat_dinding', 20);
    expect(h.rincian[0].jumlah).toBe(4);
  });

  it('menolak pekerjaan asing dan volume invalid', () => {
    expect(() => hitungKebutuhan('bangun_rumah', 10)).toThrow('tidak dikenal');
    expect(() => hitungKebutuhan('dinding_bata', 0)).toThrow('lebih dari 0');
    expect(() => hitungKebutuhan('dinding_bata', -5)).toThrow('lebih dari 0');
  });

  it('pekerjaanDariKey null untuk id asing', () => {
    expect(pekerjaanDariId('ngawur')).toBeNull();
  });
});

describe('rab-material: estimasi biaya', () => {
  it('menghitung total dari harga satuan user', () => {
    const kebutuhan = hitungKebutuhan('dinding_bata', 10).rincian;
    const est = estimasiBiaya(kebutuhan, {
      'Bata merah': 800,
      Semen: 65000,
      Pasir: 250000,
    });
    // 700×800 + 2,5×65000 + 0,5×250000 = 560.000 + 162.500 + 125.000
    expect(est.totalRp).toBe(847500);
    expect(est.tanpaHarga).toHaveLength(0);
  });

  it('material tanpa harga dilaporkan, tidak ditebak', () => {
    const kebutuhan = hitungKebutuhan('dinding_bata', 10).rincian;
    const est = estimasiBiaya(kebutuhan, { 'Bata merah': 800 });
    expect(est.tanpaHarga).toEqual(expect.arrayContaining(['Semen', 'Pasir']));
    expect(est.totalRp).toBe(560000);
    const semen = est.rincian.find((r) => r.material === 'Semen');
    expect(semen?.subtotal).toBeNull();
  });

  it('menolak harga negatif', () => {
    const kebutuhan = hitungKebutuhan('cat_dinding', 5).rincian;
    expect(() => estimasiBiaya(kebutuhan, { 'Cat tembok': -100 })).toThrow('negatif');
  });
});

describe('rab-material: batas proyek tier', () => {
  it('HEMAT boleh sampai 5 proyek', () => {
    expect(cekBatasProyek('HEMAT', 4).boleh).toBe(true);
    const penuh = cekBatasProyek('HEMAT', 5);
    expect(penuh.boleh).toBe(false);
    expect(penuh.perluUpgrade).toBe(true);
  });

  it('PRO tanpa batas', () => {
    expect(cekBatasProyek('PRO', 999).boleh).toBe(true);
  });

  it('tier asing melempar error', () => {
    expect(() => cekBatasProyek('GRATIS', 1)).toThrow('tidak dikenal');
  });
});

describe('rab-material: formatRupiah', () => {
  it('memformat dengan titik ribuan', () => {
    expect(formatRupiah(847500)).toBe('Rp847.500');
    expect(formatRupiah(25000)).toBe('Rp25.000');
  });
});

import { describe, expect, it } from 'vitest';

import {
  CEK_HP_TIERS,
  ITEM_CEK,
  buildRingkasan,
  cekBatasSesi,
  itemDariId,
  nilaiSesi,
  tierDariId,
  type JawabanCek,
} from '@/services/cek-hp';

function semuaJawaban(jawaban: JawabanCek): Record<string, JawabanCek> {
  return Object.fromEntries(ITEM_CEK.map((i) => [i.id, jawaban]));
}

describe('cek-hp: tier harga', () => {
  it('dua tier sesuai aturan: HEMAT 10–50rb, PRO 50–150rb', () => {
    const hemat = tierDariId('HEMAT');
    const pro = tierDariId('PRO');
    expect(hemat?.hargaRp).toBe(10000);
    expect(pro?.hargaRp).toBe(50000);
    expect(hemat!.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat!.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro!.hargaRp).toBeGreaterThanOrEqual(50000);
    expect(pro!.hargaRp).toBeLessThanOrEqual(150000);
    expect(CEK_HP_TIERS).toHaveLength(2);
  });

  it('tier asing mengembalikan null', () => {
    expect(tierDariId('SULTAN')).toBeNull();
  });
});

describe('cek-hp: daftar item', () => {
  it('14 item dengan total bobot 100', () => {
    expect(ITEM_CEK).toHaveLength(14);
    const total = ITEM_CEK.reduce((a, i) => a + i.bobot, 0);
    expect(total).toBe(100);
  });

  it('dua red flag keras: sinyal & IMEI', () => {
    const keras = ITEM_CEK.filter((i) => i.redFlagKeras).map((i) => i.id);
    expect(keras).toEqual(expect.arrayContaining(['sinyal-ada', 'imei-cocok']));
    expect(itemDariId('ngawur')).toBeNull();
  });
});

describe('cek-hp: penilaian sesi', () => {
  it('semua baik → skor 100 grade A', () => {
    const h = nilaiSesi(semuaJawaban('baik'));
    expect(h.skor).toBe(100);
    expect(h.grade).toBe('A');
    expect(h.redFlags).toHaveLength(0);
  });

  it('semua rusak → skor 0 grade D', () => {
    const h = nilaiSesi(semuaJawaban('rusak'));
    expect(h.skor).toBe(0);
    expect(h.grade).toBe('D');
  });

  it('jawaban kurang bernilai setengah bobot', () => {
    const jawaban = semuaJawaban('baik');
    jawaban['body-mulus'] = 'kurang'; // bobot 6 → kontribusi 3
    const h = nilaiSesi(jawaban);
    expect(h.skor).toBe(97);
    expect(h.grade).toBe('A');
  });

  it('IMEI rusak → red flag keras & grade dibatasi C', () => {
    const jawaban = semuaJawaban('baik');
    jawaban['imei-cocok'] = 'rusak';
    const h = nilaiSesi(jawaban);
    expect(h.skor).toBe(88); // 100 - 12
    expect(h.redFlags).toEqual(expect.arrayContaining(['IMEI (*#06#) cocok dengan dus/body']));
    expect(h.grade).toBe('C');
    expect(h.gradeDibatasi).toBe(true);
  });

  it('sinyal kurang → red flag tapi grade tidak dibatasi', () => {
    const jawaban = semuaJawaban('baik');
    jawaban['sinyal-ada'] = 'kurang'; // bobot 10 → kontribusi 5
    const h = nilaiSesi(jawaban);
    expect(h.skor).toBe(95);
    expect(h.redFlags.length).toBeGreaterThan(0);
    expect(h.grade).toBe('A');
    expect(h.gradeDibatasi).toBe(false);
  });

  it('item rusak non-keras masuk daftar perhatian', () => {
    const jawaban = semuaJawaban('baik');
    jawaban['kamera-depan'] = 'rusak';
    const h = nilaiSesi(jawaban);
    expect(h.perhatian).toEqual(expect.arrayContaining(['Kamera depan jernih']));
    expect(h.grade).toBe('A');
  });

  it('menolak item belum dijawab — tidak diasumsikan', () => {
    expect(() => nilaiSesi({})).toThrow('belum dijawab');
    const sebagian = semuaJawaban('baik');
    delete sebagian['wifi-bluetooth'];
    expect(() => nilaiSesi(sebagian)).toThrow('wifi-bluetooth');
  });

  it('menolak item & jawaban asing', () => {
    expect(() => nilaiSesi({ ...semuaJawaban('baik'), 'mesin-waktu': 'baik' })).toThrow('tidak dikenal');
    const j = semuaJawaban('baik') as Record<string, string>;
    j['body-mulus'] = 'lumayan';
    expect(() => nilaiSesi(j as Record<string, JawabanCek>)).toThrow('baik/kurang/rusak');
  });
});

describe('cek-hp: ringkasan laporan', () => {
  it('ringkasan memuat skor, grade, dan disclaimer', () => {
    const h = nilaiSesi(semuaJawaban('baik'));
    const teks = buildRingkasan(h, { merk: 'Samsung', tipe: 'A54' });
    expect(teks).toContain('100/100');
    expect(teks).toContain('Grade A');
    expect(teks).toContain('bukan estimasi harga pasar');
  });

  it('harga tawar hanya catatan user', () => {
    const h = nilaiSesi(semuaJawaban('baik'));
    const teks = buildRingkasan(h, { merk: 'Xiaomi', tipe: 'Redmi 12', hargaTawarRp: 1500000 });
    expect(teks).toContain('catatan user');
  });
});

describe('cek-hp: batas sesi tier', () => {
  it('HEMAT boleh 1 sesi', () => {
    expect(cekBatasSesi('HEMAT', 0).boleh).toBe(true);
    const penuh = cekBatasSesi('HEMAT', 1);
    expect(penuh.boleh).toBe(false);
    expect(penuh.perluUpgrade).toBe(true);
  });

  it('PRO sampai 10 sesi', () => {
    expect(cekBatasSesi('PRO', 9).boleh).toBe(true);
    expect(cekBatasSesi('PRO', 10).boleh).toBe(false);
  });

  it('tier asing melempar error', () => {
    expect(() => cekBatasSesi('GRATIS', 1)).toThrow('tidak dikenal');
  });
});

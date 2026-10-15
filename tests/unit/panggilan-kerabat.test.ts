import { describe, expect, it } from 'vitest';

import {
  cariDariSebutan,
  cariSebutan,
  daftarHubungan,
  daftarSuku,
  formatJawaban,
} from '@/services/panggilan-kerabat';

describe('daftar suku & hubungan', () => {
  it('4 suku: jawa, sunda, minang, batak_toba', () => {
    expect(daftarSuku().map((s) => s.id)).toEqual(['jawa', 'sunda', 'minang', 'batak_toba']);
  });

  it('14 hubungan termasuk paman & bibi dengan dukungan urutan', () => {
    const h = daftarHubungan();
    expect(h).toHaveLength(14);
    expect(h.find((x) => x.id === 'paman')?.dukungUrutan).toBe(true);
    expect(h.find((x) => x.id === 'ayah')?.dukungUrutan).toBe(false);
  });
});

describe('cariSebutan — kasus umum', () => {
  it('jawa: kakak laki-laki = "mas"', () => {
    const h = cariSebutan('kakak_l', 'jawa');
    expect(h.adaData).toBe(true);
    expect(h.sebutan).toBe('mas');
    expect(h.alternatif).toContain('kangmas');
  });

  it('jawa paman: kakak→pakdhe, adik→paklik', () => {
    expect(cariSebutan('paman', 'jawa', 'kakak').sebutan).toBe('pakdhe');
    expect(cariSebutan('paman', 'jawa', 'adik').sebutan).toBe('paklik');
  });

  it('jawa bibi: kakak→budhe, adik→bulik', () => {
    expect(cariSebutan('bibi', 'jawa', 'kakak').sebutan).toBe('budhe');
    expect(cariSebutan('bibi', 'jawa', 'adik').sebutan).toBe('bulik');
  });

  it('sunda: ayah=bapa, ibu=ema, kakek=aki, nenek=nini, cucu=incu', () => {
    expect(cariSebutan('ayah', 'sunda').sebutan).toBe('bapa');
    expect(cariSebutan('ibu', 'sunda').sebutan).toBe('ema');
    expect(cariSebutan('kakek', 'sunda').sebutan).toBe('aki');
    expect(cariSebutan('nenek', 'sunda').sebutan).toBe('nini');
    expect(cariSebutan('cucu', 'sunda').sebutan).toBe('incu');
  });

  it('minang: uda, uni, adiak, mamak (paman pihak ibu)', () => {
    expect(cariSebutan('kakak_l', 'minang').sebutan).toBe('uda');
    expect(cariSebutan('kakak_p', 'minang').sebutan).toBe('uni');
    expect(cariSebutan('adik', 'minang').sebutan).toBe('adiak');
    const paman = cariSebutan('paman', 'minang');
    expect(paman.sebutan).toBe('mamak');
    expect(paman.catatan).toContain('matrilineal');
  });

  it('batak toba: tulang, namboru, ompung, pahompu, lae, eda, hela, parumaen', () => {
    expect(cariSebutan('paman', 'batak_toba').sebutan).toBe('tulang');
    expect(cariSebutan('bibi', 'batak_toba').sebutan).toBe('namboru');
    expect(cariSebutan('kakek', 'batak_toba').sebutan).toBe('ompung');
    expect(cariSebutan('cucu', 'batak_toba').sebutan).toBe('pahompu');
    expect(cariSebutan('ipar_l', 'batak_toba').sebutan).toBe('lae');
    expect(cariSebutan('ipar_p', 'batak_toba').sebutan).toBe('eda');
    expect(cariSebutan('menantu_l', 'batak_toba').sebutan).toBe('hela');
    expect(cariSebutan('menantu_p', 'batak_toba').sebutan).toBe('parumaen');
  });
});

describe('cariSebutan — kejujuran data', () => {
  it('pasangan tanpa data (minang kakek) → adaData false, bukan karangan', () => {
    const h = cariSebutan('kakek', 'minang');
    expect(h.adaData).toBe(false);
    expect(h.sebutan).toBeUndefined();
  });

  it('suku tidak dikenal → throw dengan daftar pilihan', () => {
    expect(() => cariSebutan('ayah', 'bugis')).toThrow('Suku tidak dikenal');
  });

  it('hubungan tidak dikenal → throw dengan daftar pilihan', () => {
    expect(() => cariSebutan('buyut', 'jawa')).toThrow('Hubungan tidak dikenal');
  });
});

describe('cariDariSebutan — pencarian terbalik', () => {
  it('"pakdhe" → jawa, paman', () => {
    const t = cariDariSebutan('pakdhe');
    expect(t.length).toBeGreaterThan(0);
    expect(t[0].suku.id).toBe('jawa');
    expect(t[0].hubungan.id).toBe('paman');
  });

  it('"tulang" → batak_toba, paman', () => {
    const t = cariDariSebutan('tulang');
    expect(t.some((x) => x.suku.id === 'batak_toba' && x.hubungan.id === 'paman')).toBe(true);
  });

  it('"mantu" → ditemukan di beberapa suku', () => {
    const t = cariDariSebutan('mantu');
    const sukuUnik = new Set(t.map((x) => x.suku.id));
    expect(sukuUnik.size).toBeGreaterThanOrEqual(2);
  });

  it('case-insensitive: "PAKDHE" tetap ketemu', () => {
    expect(cariDariSebutan('PAKDHE').length).toBeGreaterThan(0);
  });

  it('teks kosong → throw', () => {
    expect(() => cariDariSebutan('   ')).toThrow('wajib diisi');
  });

  it('sebutan asing → hasil kosong (bukan error)', () => {
    expect(cariDariSebutan('uncle')).toEqual([]);
  });
});

describe('formatJawaban', () => {
  it('memuat sebutan + catatan variasi daerah', () => {
    const teks = formatJawaban(cariSebutan('paman', 'jawa', 'kakak'));
    expect(teks).toContain('"pakdhe"');
    expect(teks).toContain('Variasi daerah');
  });

  it('tanpa data → pesan jujur, bukan karangan', () => {
    const teks = formatJawaban(cariSebutan('kakek', 'minang'));
    expect(teks).toContain('Belum ada data');
  });
});

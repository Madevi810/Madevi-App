import { describe, expect, it } from 'vitest';

import {
  DAFTAR_SUKU_ADAT,
  NAMA_FASE,
  TIER_RUNDOWN,
  cekBatasRundown,
  formatRundownTeks,
  susunRundown,
  tierRundownDariId,
} from '@/services/rundown-adat';

describe('tier rundown adat', () => {
  it('HEMAT 25rb & PRO 99rb — sesuai aturan 2 tier jasa', () => {
    const hemat = tierRundownDariId('HEMAT');
    const pro = tierRundownDariId('PRO');
    expect(hemat.hargaRp).toBe(25000);
    expect(pro.hargaRp).toBe(99000);
    expect(hemat.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro.hargaRp).toBeGreaterThanOrEqual(50000);
    expect(pro.hargaRp).toBeLessThanOrEqual(150000);
  });

  it('HEMAT dibatasi 2/bulan, PRO tanpa batas', () => {
    expect(tierRundownDariId('HEMAT').batasRundownPerBulan).toBe(2);
    expect(tierRundownDariId('PRO').batasRundownPerBulan).toBeNull();
  });

  it('tier tidak dikenal → throw', () => {
    expect(() => tierRundownDariId('SULTAN')).toThrow('Tier tidak dikenal');
  });
});

describe('susunRundown — jawa', () => {
  it('17 prosesi terurut PRA → HARI_H → PASCA', () => {
    const r = susunRundown('jawa', 'HEMAT');
    expect(r.jumlahProsesi).toBe(17);
    expect(r.prosesi[0].id).toBe('nontoni');
    expect(r.prosesi[r.prosesi.length - 1].id).toBe('boyongan');
    const fase = r.prosesi.map((p) => p.fase);
    const idx = (f: string) => fase.indexOf(f as never);
    expect(idx('PRA')).toBeLessThan(idx('HARI_H'));
    expect(idx('HARI_H')).toBeLessThan(idx('PASCA'));
  });

  it('urutan kunci: siraman < midodareni < akad < panggih < sungkeman', () => {
    const r = susunRundown('jawa', 'PRO');
    const pos = (id: string) => r.prosesi.findIndex((p) => p.id === id);
    expect(pos('siraman')).toBeLessThan(pos('midodareni'));
    expect(pos('midodareni')).toBeLessThan(pos('akad'));
    expect(pos('akad')).toBeLessThan(pos('panggih'));
    expect(pos('panggih')).toBeLessThan(pos('sungkeman'));
  });

  it('pakem dilabeli jujur sebagai pakem umum, bukan satu-satunya cara', () => {
    const r = susunRundown('jawa', 'HEMAT');
    expect(r.suku.pakem).toContain('dapat berbeda');
    expect(r.suku.sumber.length).toBeGreaterThan(0);
  });

  it('suku belum didukung → throw jujur, tidak dikarang', () => {
    expect(() => susunRundown('sunda', 'HEMAT')).toThrow('belum didukung');
  });
});

describe('cekBatasRundown', () => {
  it('HEMAT: 0–1 pakai → boleh, 2 pakai → habis', () => {
    expect(cekBatasRundown('HEMAT', 0).boleh).toBe(true);
    expect(cekBatasRundown('HEMAT', 1).boleh).toBe(true);
    const habis = cekBatasRundown('HEMAT', 2);
    expect(habis.boleh).toBe(false);
    expect(habis.pesan).toContain('PRO');
  });

  it('PRO: berapa pun → boleh', () => {
    expect(cekBatasRundown('PRO', 99).boleh).toBe(true);
  });

  it('pemakaian negatif → throw', () => {
    expect(() => cekBatasRundown('HEMAT', -1)).toThrow('≥ 0');
  });
});

describe('formatRundownTeks', () => {
  it('memuat judul, 3 fase, checklist, dan sumber', () => {
    const teks = formatRundownTeks(susunRundown('jawa', 'HEMAT'));
    expect(teks).toContain('RUNDOWN ADAT JAWA');
    expect(teks).toContain(NAMA_FASE.PRA.toUpperCase());
    expect(teks).toContain(NAMA_FASE.HARI_H.toUpperCase());
    expect(teks).toContain(NAMA_FASE.PASCA.toUpperCase());
    expect(teks).toContain('[ ] 7. Siraman');
    expect(teks).toContain('Total 17 prosesi');
    expect(teks).toContain('Sumber:');
  });
});

describe('daftar suku adat', () => {
  it('saat ini hanya jawa — suku lain dibuka setelah riset', () => {
    expect(DAFTAR_SUKU_ADAT.map((s) => s.id)).toEqual(['jawa']);
    expect(TIER_RUNDOWN).toHaveLength(2);
  });
});

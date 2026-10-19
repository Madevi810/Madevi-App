import { describe, expect, it } from 'vitest';

import {
  DISCLAIMER_KONTRAK,
  KONTRAK_CHECKLIST,
  MIN_JAWABAN_KONTRAK,
  analisisKontrak,
  contohFormatJawaban,
  formatKontrakTeks,
  itemKontrakDariId,
  skorKeGradeKontrak,
  uraiJawabanTeks,
  type JawabanMapKontrak,
} from '@/services/kontrak-freelance';

function jawabanAmanSemua(): JawabanMapKontrak {
  const m: JawabanMapKontrak = {};
  for (const item of KONTRAK_CHECKLIST) m[item.id] = item.jawabanAman;
  return m;
}

describe('KONTRAK_CHECKLIST', () => {
  it('14 item dalam 7 kategori, bobot positif, id unik', () => {
    expect(KONTRAK_CHECKLIST).toHaveLength(14);
    const kategori = new Set(KONTRAK_CHECKLIST.map((i) => i.kategori));
    expect(kategori.size).toBe(7);
    const ids = KONTRAK_CHECKLIST.map((i) => i.id);
    expect(new Set(ids).size).toBe(14);
    for (const item of KONTRAK_CHECKLIST) {
      expect(item.bobot).toBeGreaterThan(0);
      expect(item.redFlag.length).toBeGreaterThan(10);
      expect(item.saran.length).toBeGreaterThan(10);
    }
  });

  it('itemKontrakDariId: dikenal & tak dikenal', () => {
    expect(itemKontrakDariId('termin-pembayaran')!.kategori).toBe('PEMBAYARAN');
    expect(itemKontrakDariId('tidak-ada')).toBeNull();
  });
});

describe('analisisKontrak — skor & grade', () => {
  it('semua jawaban aman → skor 0, grade A, tanpa temuan', () => {
    const h = analisisKontrak(jawabanAmanSemua());
    expect(h.skorRisiko).toBe(0);
    expect(h.grade).toBe('A');
    expect(h.temuan).toHaveLength(0);
    expect(h.dijawab).toBe(14);
  });

  it('semua jawaban tidak aman → skor 100, grade D', () => {
    const m: JawabanMapKontrak = {};
    for (const item of KONTRAK_CHECKLIST) {
      m[item.id] = item.jawabanAman === 'YA' ? 'TIDAK' : 'YA';
    }
    const h = analisisKontrak(m);
    expect(h.skorRisiko).toBe(100);
    expect(h.grade).toBe('D');
    expect(h.temuan).toHaveLength(14);
  });

  it('skor sesuai rumus bobot (1 item bobot 10 tidak aman dari 104)', () => {
    const m = jawabanAmanSemua();
    m['ruang-lingkup-jelas'] = 'TIDAK'; // bobot 10
    const h = analisisKontrak(m);
    const totalBobot = KONTRAK_CHECKLIST.reduce((s, i) => s + i.bobot, 0);
    expect(h.skorRisiko).toBe(Math.round((10 / totalBobot) * 100));
    expect(h.temuan).toHaveLength(1);
    expect(h.temuan[0].redFlag).toMatch(/scope creep/);
    expect(h.temuan[0].saran.length).toBeGreaterThan(10);
  });

  it('TIDAK_TAHU → penalti setengah bobot + peringatan', () => {
    const m = jawabanAmanSemua();
    m['termin-pembayaran'] = 'TIDAK_TAHU'; // bobot 10 → penalti 5
    const h = analisisKontrak(m);
    const totalBobot = KONTRAK_CHECKLIST.reduce((s, i) => s + i.bobot, 0);
    expect(h.skorRisiko).toBe(Math.round((5 / totalBobot) * 100));
    expect(h.peringatan.length).toBeGreaterThan(0);
    expect(h.temuan).toHaveLength(1);
  });

  it('deterministik: analisis 2x hasil identik', () => {
    const m = jawabanAmanSemua();
    m['batas-revisi'] = 'TIDAK';
    const a = analisisKontrak(m);
    const b = analisisKontrak(m);
    expect(a).toEqual(b);
  });
});

describe('analisisKontrak — validasi', () => {
  it('kurang dari 5 jawaban ditolak', () => {
    const m: JawabanMapKontrak = {
      'termin-pembayaran': 'YA',
      'batas-revisi': 'TIDAK',
    };
    expect(() => analisisKontrak(m)).toThrow(`minimal ${MIN_JAWABAN_KONTRAK}`);
  });

  it('id item tak dikenal ditolak', () => {
    const m = jawabanAmanSemua();
    (m as Record<string, string>)['item-ngawur'] = 'YA';
    expect(() => analisisKontrak(m)).toThrow('tidak dikenal');
  });

  it('nilai jawaban tak valid ditolak', () => {
    const m = jawabanAmanSemua();
    (m as Record<string, string>)['termin-pembayaran'] = 'MAYBE';
    expect(() => analisisKontrak(m)).toThrow('YA, TIDAK, atau TIDAK_TAHU');
  });
});

describe('skorKeGradeKontrak', () => {
  it('ambang grade A/B/C/D', () => {
    expect(skorKeGradeKontrak(0)).toBe('A');
    expect(skorKeGradeKontrak(20)).toBe('A');
    expect(skorKeGradeKontrak(21)).toBe('B');
    expect(skorKeGradeKontrak(40)).toBe('B');
    expect(skorKeGradeKontrak(41)).toBe('C');
    expect(skorKeGradeKontrak(60)).toBe('C');
    expect(skorKeGradeKontrak(61)).toBe('D');
    expect(skorKeGradeKontrak(100)).toBe('D');
  });
});

describe('uraiJawabanTeks & contohFormatJawaban', () => {
  it('parsing "id: JAWABAN" per baris', () => {
    const teks = 'termin-pembayaran: YA\nbatas-revisi: tidak\n# komentar\ndenda-dua-arah: TIDAK_TAHU';
    const m = uraiJawabanTeks(teks);
    expect(m['termin-pembayaran']).toBe('YA');
    expect(m['batas-revisi']).toBe('TIDAK');
    expect(m['denda-dua-arah']).toBe('TIDAK_TAHU');
  });

  it('baris rusak ditolak', () => {
    expect(() => uraiJawabanTeks('baris tanpa format')).toThrow('tidak dikenali');
  });

  it('contoh format memuat semua 14 id', () => {
    const contoh = contohFormatJawaban();
    for (const item of KONTRAK_CHECKLIST) {
      expect(contoh).toContain(item.id + ':');
    }
  });
});

describe('formatKontrakTeks', () => {
  it('laporan memuat skor, temuan, saran, dan disclaimer', () => {
    const m = jawabanAmanSemua();
    m['termin-pembayaran'] = 'TIDAK';
    const h = analisisKontrak(m);
    const teks = formatKontrakTeks(h);
    expect(teks).toContain('KONTRAKKU');
    expect(teks).toContain(`Skor risiko : ${h.skorRisiko}/100`);
    expect(teks).toContain('Saran:');
    expect(teks).toContain(DISCLAIMER_KONTRAK);
    expect(teks).toContain('BUKAN nasihat hukum');
  });

  it('tanpa temuan → pesan aman tetap ada disclaimer', () => {
    const teks = formatKontrakTeks(analisisKontrak(jawabanAmanSemua()));
    expect(teks).toContain('Tidak ada red-flag');
    expect(teks).toContain(DISCLAIMER_KONTRAK);
  });
});

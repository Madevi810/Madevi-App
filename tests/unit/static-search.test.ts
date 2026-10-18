import { describe, it, expect } from 'vitest';
import { cariStatis } from '@/services/static-search';

describe('pencarian statis (A5)', () => {
  it('menemukan tools', () => {
    const h = cariStatis('kalkulator');
    expect(h.length).toBeGreaterThan(0);
    expect(h[0].ruang).toBe('Tools & Equipment');
  });

  it('menemukan simulasi', () => {
    const h = cariStatis('parabola');
    expect(h.some((x) => x.judul === 'Gerak Parabola')).toBe(true);
  });

  it('menemukan template undangan', () => {
    const h = cariStatis('adat');
    expect(h.some((x) => x.href === '/undangan/template')).toBe(true);
  });

  it('menemukan kategori tutorial', () => {
    const h = cariStatis('keuangan');
    expect(h.some((x) => x.href.startsWith('/tutorial/'))).toBe(true);
  });

  it('menemukan jenjang school', () => {
    const h = cariStatis('SMA');
    expect(h.some((x) => x.href.startsWith('/school/'))).toBe(true);
  });

  it('kata kunci kosong = hasil kosong', () => {
    expect(cariStatis('')).toEqual([]);
    expect(cariStatis('   ')).toEqual([]);
  });

  it('diurutkan berdasarkan skor', () => {
    const h = cariStatis('kalkulator');
    for (let i = 1; i < h.length; i++) {
      expect(h[i - 1].skor).toBeGreaterThanOrEqual(h[i].skor);
    }
  });
});

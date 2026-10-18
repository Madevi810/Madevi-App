import { describe, it, expect } from 'vitest';
import { verifikasiTaxonomy, verifikasiFileTaxonomy, type TaxonomyNode } from '@/services/taxonomy-verify';

const nodesSehat: TaxonomyNode[] = [
  { id: 'r1', parentId: null, level: 'R', slug: 'ruang', name: 'Ruang' },
  { id: 'd1', parentId: 'r1', level: 'D', slug: 'sains', name: 'Sains' },
  { id: 'k1', parentId: 'd1', level: 'K', slug: 'fisika', name: 'Fisika' },
];

describe('verifikasi taxonomy', () => {
  it('taxonomy sehat lulus', () => {
    const h = verifikasiTaxonomy(nodesSehat);
    expect(h.lulus).toBe(true);
    expect(h.statistik.totalNode).toBe(3);
  });

  it('orphan terdeteksi', () => {
    const h = verifikasiTaxonomy([
      ...nodesSehat,
      { id: 'x1', parentId: 'tidak-ada', level: 'K', slug: 'y', name: 'Y' },
    ]);
    expect(h.lulus).toBe(false);
    expect(h.statistik.orphan).toBe(1);
  });

  it('slug duplikat terdeteksi', () => {
    const h = verifikasiTaxonomy([
      ...nodesSehat,
      { id: 'k2', parentId: 'd1', level: 'K', slug: 'fisika', name: 'Fisika 2' },
    ]);
    expect(h.lulus).toBe(false);
    expect(h.statistik.slugDuplikat).toBe(1);
  });

  it('level tidak konsisten terdeteksi', () => {
    const h = verifikasiTaxonomy([
      ...nodesSehat,
      { id: 'j1', parentId: 'd1', level: 'J', slug: 'lompat', name: 'Lompat' },
    ]);
    expect(h.lulus).toBe(false);
    expect(h.temuan.some((t) => t.includes('tidak tepat 1 tingkat'))).toBe(true);
  });

  it('taxonomy produksi lulus verifikasi', () => {
    const h = verifikasiFileTaxonomy('database/seeds/taxonomy/madevi-multi-root-v2.json');
    expect(h.temuan).toEqual([]);
    expect(h.lulus).toBe(true);
  });
});

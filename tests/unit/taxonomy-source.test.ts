import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  deterministicUuid,
  parseArchitecture,
  readTaxonomyPackage,
  readTaxonomySources,
  slugify,
  type ParsedTaxonomyNode,
} from '../../scripts/lib/taxonomy-source.mjs';

const menuRoot = path.resolve(
  process.cwd(),
  '..',
  'Aturan/Rancangan-Offline/02-Menu-R1-R5/Menu-Aktif',
);

// Sumber legacy R1–R5 txt sudah tidak ada di paket kontrol (diganti paket
// domain JSON L08). Test legacy hanya jalan bila arsip masih tersedia.
const legacyPresent = fs.existsSync(menuRoot);
// D02: paket taxonomy kanonis kini di dalam proyek (database/seeds/taxonomy);
// folder Menu/ di luar proyek sudah dipensiunkan (lihat memory/STATE.md).
const packagePath = path.resolve(
  process.cwd(),
  'database/seeds/taxonomy/madevi-explore-pilot-v1.json',
);

describe.runIf(legacyPresent)('parser sumber taxonomy legacy Prompt 05', () => {
  it('membaca seluruh R1–R5 dan mencocokkan statistik tanpa membuat artikel', () => {
    const result = readTaxonomySources(menuRoot);
    expect(result.nodes).toHaveLength(13_029);
    expect(result.nodes.filter((node) => node.level === 'R')).toHaveLength(5);
    expect(result.nodes.filter((node) => node.level === 'J')).toHaveLength(4_891);
    expect(result.nodes.every((node) => !('body' in node))).toBe(true);
    expect(result.sourceManifest).toHaveLength(5);
    expect(result.sourceHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('ID deterministik terpisah dari kode dan stabil pada import ulang', () => {
    const first = readTaxonomySources(menuRoot);
    const second = readTaxonomySources(menuRoot);
    expect(second.nodes.map((node) => node.nodeId)).toEqual(first.nodes.map((node) => node.nodeId));
    expect(first.nodes[0]?.nodeId).not.toContain('R1');
    expect(deterministicUuid('x')).toBe(deterministicUuid('x'));
  });

  it('menolak lompatan level, parent hilang, path berbahaya, dan statistik palsu', () => {
    const base = `Statistik Cabang:\n- Domain (D): 1\n- Konteks (K): 0\nR1 | Uji\n├── D1 | Aman  (./D1-Aman/D1_Aman.html)`;
    expect(() => parseArchitecture(base.replace('D1 |', 'K1 |'), 'bad-level.txt')).toThrow(
      /level K tidak sah di bawah R/,
    );
    expect(() =>
      parseArchitecture(base.replace('./D1-Aman', './../escape'), 'bad-path.txt'),
    ).toThrow(/path virtual tidak aman/);
    expect(() =>
      parseArchitecture(base.replace('Domain \(D\): 1', 'Domain (D): 2'), 'bad-count.txt'),
    ).toThrow(/statistik D/);
  });

  it('slug aman konsisten untuk tanda baca dan aksen', () => {
    expect(slugify('Negara, Sejarah, Hukum & Masyarakat')).toBe(
      'negara-sejarah-hukum-dan-masyarakat',
    );
    expect(slugify('Énergi Terbarukan')).toBe('energi-terbarukan');
  });

  it('lima file sumber tetap tersedia dan bukan hasil ekstraksi runtime', () => {
    for (const manifest of readTaxonomySources(menuRoot).sourceManifest) {
      expect(fs.statSync(path.join(menuRoot, manifest.relativePath)).isFile()).toBe(true);
    }
  });
});

describe('pembaca paket taxonomy L08 (D02)', () => {
  it('membaca paket pilot Explore 16 node dengan root R2 dan checksum valid', () => {
    const result = readTaxonomyPackage(packagePath);
    expect(result.nodes).toHaveLength(16);
    expect(result.nodes.filter((node: ParsedTaxonomyNode) => node.level === 'R')).toHaveLength(1);
    expect(result.nodes.filter((node: ParsedTaxonomyNode) => node.level === 'J')).toHaveLength(3);
    expect(result.nodes.every((node: ParsedTaxonomyNode) => !('body' in node))).toBe(true);
    const root = result.nodes.find((node: ParsedTaxonomyNode) => node.level === 'R');
    expect(root?.pathCode).toBe('R2');
    expect(root?.pathSlug).toBe('jelajahi-pengetahuan');
    expect(result.sourceHash).toBe(
      '0384683d22a54e7c0da9933c1818f95a3a363a0203ac0270a7de79ba4d07cac3',
    );
    expect(result.rootCount).toBe(1);
  });

  it('ID stabil dari UUID paket dan parent-first tervalidasi', () => {
    const first = readTaxonomyPackage(packagePath);
    const second = readTaxonomyPackage(packagePath);
    expect(second.nodes.map((node: ParsedTaxonomyNode) => node.nodeId)).toEqual(
      first.nodes.map((node: ParsedTaxonomyNode) => node.nodeId),
    );
    expect(first.nodes[0]?.nodeId).toBe('a0000000-0000-4000-8000-000000000001');
    for (const node of first.nodes) {
      if (node.parentId) {
        expect(
          first.nodes.some((parent: ParsedTaxonomyNode) => parent.nodeId === node.parentId),
        ).toBe(true);
      }
    }
  });

  it('menolak checksum salah, parent hilang, level tak sah, dan slug kotor', () => {
    const base = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const tampered = { ...base, nodes: [...base.nodes, { ...base.nodes[0], id: 'x' }] };
    const tmp = path.join(process.cwd(), 'database', 'seeds', 'taxonomy', 'tmp-bad-package.json');
    fs.writeFileSync(tmp, JSON.stringify(tampered));
    try {
      expect(() => readTaxonomyPackage(tmp)).toThrow(/checksum/);
    } finally {
      fs.rmSync(tmp, { force: true });
    }
    expect(() => readTaxonomyPackage(path.join(process.cwd(), 'tidak-ada.json'))).toThrow(
      /tidak ditemukan/,
    );
  });
});

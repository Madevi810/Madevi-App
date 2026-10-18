/**
 * Verifikasi taxonomy (Fase B1).
 * Prinsip Ade: akar taksonomi harus RAPI dan TIDAK BOLEH MELESET.
 * Verifikasi berlapis sebelum node dipublikasikan.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

export interface TaxonomyNode {
  id: string;
  parentId: string | null;
  level: string;
  slug: string;
  name: string;
}

export interface VerifikasiHasil {
  lulus: boolean;
  temuan: string[];
  statistik: {
    totalNode: number;
    perLevel: Record<string, number>;
    orphan: number;
    slugDuplikat: number;
  };
}

const URUTAN_LEVEL = ['R', 'D', 'K', 'M', 'T', 'J'];

export function verifikasiTaxonomy(nodes: TaxonomyNode[]): VerifikasiHasil {
  const temuan: string[] = [];
  const perLevel: Record<string, number> = {};

  for (const n of nodes) {
    perLevel[n.level] = (perLevel[n.level] ?? 0) + 1;
  }

  // 1. Level valid
  for (const n of nodes) {
    if (!URUTAN_LEVEL.includes(n.level)) {
      temuan.push(`Node ${n.id} (${n.name}): level '${n.level}' tidak dikenal`);
    }
  }

  // 2. Orphan check
  const ids = new Set(nodes.map((n) => n.id));
  let orphan = 0;
  for (const n of nodes) {
    if (n.parentId && !ids.has(n.parentId)) {
      temuan.push(`Node ${n.id} (${n.name}): parent ${n.parentId} tidak ditemukan (orphan)`);
      orphan++;
    }
  }

  // 3. Slug unik per level parent
  const slugKey = new Map<string, string>();
  let slugDuplikat = 0;
  for (const n of nodes) {
    const key = `${n.parentId ?? 'root'}:${n.slug}`;
    if (slugKey.has(key)) {
      temuan.push(`Slug duplikat: '${n.slug}' di bawah parent yang sama`);
      slugDuplikat++;
    } else {
      slugKey.set(key, n.id);
    }
  }

  // 4. Hierarki level konsisten (child tepat 1 level di bawah parent)
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (const n of nodes) {
    if (!n.parentId) continue;
    const parent = byId.get(n.parentId);
    if (!parent) continue;
    const idxParent = URUTAN_LEVEL.indexOf(parent.level);
    const idxChild = URUTAN_LEVEL.indexOf(n.level);
    if (idxChild !== idxParent + 1) {
      temuan.push(
        `Node ${n.name}: level ${n.level} tidak tepat 1 tingkat di bawah parent ${parent.name} (${parent.level})`,
      );
    }
  }

  // 5. Root harus ada
  const roots = nodes.filter((n) => !n.parentId);
  if (roots.length === 0) {
    temuan.push('Tidak ada root node');
  }

  return {
    lulus: temuan.length === 0,
    temuan,
    statistik: {
      totalNode: nodes.length,
      perLevel,
      orphan,
      slugDuplikat,
    },
  };
}

export function verifikasiFileTaxonomy(pathRelatif: string): VerifikasiHasil {
  const path = join(process.cwd(), pathRelatif);
  const data = JSON.parse(readFileSync(path, 'utf-8'));
  const nodes: TaxonomyNode[] = (data.nodes ?? []).map((n: Record<string, unknown>) => ({
    id: String(n.id),
    parentId: n.parentId ? String(n.parentId) : null,
    level: String(n.level),
    slug: String(n.slug),
    name: String(n.name ?? n.label ?? n.id),
  }));
  return verifikasiTaxonomy(nodes);
}

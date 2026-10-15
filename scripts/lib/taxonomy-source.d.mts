export type TaxonomyLevel = 'R' | 'D' | 'K' | 'M' | 'SM' | 'T' | 'ST' | 'J';

export interface ParsedTaxonomyNode {
  nodeId: string;
  parentId: string | null;
  parentSourceKey: string | null;
  sourceKey: string;
  level: TaxonomyLevel;
  localCode: string;
  pathCode: string;
  name: string;
  slug: string;
  pathSlug: string;
  sortOrder: number;
  visibility: 'PUBLIC';
  lifecycleStatus: 'ACTIVE';
  emptyMarker: 'KOSONG' | 'RENCANA_ARTIKEL' | null;
  sourceFile: string;
  sourceLine: number;
  sourceVirtualPath: string | null;
  metadata: {
    depth?: number;
    packageId?: string;
    packageVersion?: string | null;
    kind?: string | null;
    routeHref?: string | null;
  };
}

export interface TaxonomySourceManifest {
  relativePath: string;
  sha256: string;
  nodeCount: number;
  counts?: Record<TaxonomyLevel, number>;
  packageId?: string;
  packageVersion?: string | null;
}

export interface TaxonomyPackageSource {
  nodes: ParsedTaxonomyNode[];
  sourceManifest: TaxonomySourceManifest[];
  sourceHash: string;
  packageId: string;
  rootCount: number;
}

export const TAXONOMY_LEVELS: TaxonomyLevel[];
export const ARCHITECTURE_FILES: string[];
export const ROOM_CODE_BY_SLUG: Record<string, string>;
export function canonicalStringify(value: unknown): string;
export function readTaxonomyPackage(packagePath: string): TaxonomyPackageSource;
export function readTaxonomySources(menuRoot: string): {
  nodes: ParsedTaxonomyNode[];
  sourceManifest: TaxonomySourceManifest[];
  sourceHash: string;
};
export function parseArchitecture(
  text: string,
  relativePath?: string,
): {
  relativePath: string;
  sha256: string;
  counts: Record<TaxonomyLevel, number>;
  nodes: ParsedTaxonomyNode[];
};
export function slugify(value: string): string;
export function deterministicUuid(value: string): string;
export function hashCanonical(value: unknown): string;

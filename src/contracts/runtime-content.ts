/**
 * Kontrak runtime-content L06 — pembaca jujur runtime_content_packages.
 *
 * - Package DRAFT tidak pernah dianggap aktif/published.
 * - Runtime menu = kontrak ruang utama + extension package PUBLISHED tervalidasi.
 * - Satu DTO dipakai API runtime-menu, panel Admin, dan consumer menu.
 * - Promosi package tetap milik L08/Admin; L06 hanya menyediakan
 *   pembaca/validator/seed fixture yang terpisah dan jujur.
 */

export type RuntimePackageKind = 'FEATURE_TEMPLATE' | 'MENU' | 'ARTICLE';
export type RuntimePackageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface RuntimePackageView {
  packageId: string;
  packageKind: RuntimePackageKind;
  version: string;
  schemaVersion: string;
  status: RuntimePackageStatus;
  accessLevel: 'PUBLIC' | 'MEMBER' | 'PLUS' | 'PRO' | 'LOVE' | 'ADMIN';
  sourceRef: string;
  licenseRef: string;
  checksum: string | null;
  rollbackReference: string;
  publishedAt: string | null;
  payload?: unknown;
}

export interface RuntimeMenuExtension {
  id: string;
  parentId: string | null;
  kind: 'SPACE' | 'DOMAIN' | 'MENU';
  label: string;
  slug: string;
  href: string | null;
  status: 'ACTIVE';
  accessLevel: 'PUBLIC';
  sortOrder: number;
  sourceRef: string;
  packageId: string;
  /** L08: parent space kanonis hasil normalisasi (mis. `space-explore`). */
  parentSpaceId?: string | null;
  /** L08: checksum payload package saat extension dibaca. */
  checksum?: string | null;
  /** L08: versi package saat extension dibaca. */
  packageVersion?: string | null;
}

export interface RuntimeMenuView {
  spaces: Array<{
    id: string;
    label: string;
    slug: string;
    href: string;
    sortOrder: number;
  }>;
  extensions: RuntimeMenuExtension[];
  /** True bila ada package PUBLISHED yang menambah extension. */
  hasPublishedExtensions: boolean;
}

const PACKAGE_ID_RE = /^[a-z0-9][a-z0-9-]{2,120}$/;
const VERSION_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const CHECKSUM_RE = /^[0-9a-f]{64}$/;

export function validateRuntimePackageRow(row: {
  package_id: string;
  package_kind: string;
  version: string;
  schema_version: string;
  status: string;
  access_level: string;
  source_ref: string;
  license_ref: string;
  checksum: string | null;
  rollback_reference: string;
  published_at: string | Date | null;
  payload?: unknown;
}): { ok: true; view: RuntimePackageView } | { ok: false; reason: string } {
  if (!PACKAGE_ID_RE.test(row.package_id)) return { ok: false, reason: 'package_id tidak valid' };
  if (!['FEATURE_TEMPLATE', 'MENU', 'ARTICLE'].includes(row.package_kind)) {
    return { ok: false, reason: 'package_kind tidak valid' };
  }
  if (!VERSION_RE.test(row.version)) return { ok: false, reason: 'version tidak valid' };
  if (!row.schema_version || row.schema_version.length > 120) {
    return { ok: false, reason: 'schema_version tidak valid' };
  }
  if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(row.status)) {
    return { ok: false, reason: 'status tidak valid' };
  }
  if (!['PUBLIC', 'MEMBER', 'PLUS', 'PRO', 'LOVE', 'ADMIN'].includes(row.access_level)) {
    return { ok: false, reason: 'access_level tidak valid' };
  }
  if (!row.source_ref || !row.license_ref || !row.rollback_reference) {
    return { ok: false, reason: 'source/license/rollback wajib diisi' };
  }
  if (row.checksum !== null && !CHECKSUM_RE.test(row.checksum)) {
    return { ok: false, reason: 'checksum harus hex 64 atau null' };
  }
  const published = row.status === 'PUBLISHED';
  if (published && !row.published_at) return { ok: false, reason: 'PUBLISHED wajib published_at' };
  if (!published && row.published_at) return { ok: false, reason: 'DRAFT/ARCHIVED tanpa published_at' };
  return {
    ok: true,
    view: {
      packageId: row.package_id,
      packageKind: row.package_kind as RuntimePackageKind,
      version: row.version,
      schemaVersion: row.schema_version,
      status: row.status as RuntimePackageStatus,
      accessLevel: row.access_level as RuntimePackageView['accessLevel'],
      sourceRef: row.source_ref,
      licenseRef: row.license_ref,
      checksum: row.checksum,
      rollbackReference: row.rollback_reference,
      publishedAt:
        row.published_at instanceof Date
          ? row.published_at.toISOString()
          : (row.published_at as string | null),
      payload: row.payload,
    },
  };
}

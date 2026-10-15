/**
 * Runtime boundary untuk paket Fitur-Template/Menu/Artikel.
 *
 * Runtime hanya menerima data yang sudah ditransformasikan oleh L08.
 * Folder Draft-HTML/Aktif tidak pernah diimpor langsung dari sini.
 */
export const DOMAIN_PACKAGE_SCHEMA_VERSION = 'madevi.domain-package.v1' as const;

export type DomainPackageKind = 'FEATURE_TEMPLATE' | 'MENU' | 'ARTICLE';

export interface DomainPackageManifest {
  schemaVersion: typeof DOMAIN_PACKAGE_SCHEMA_VERSION;
  packageId: string;
  kind: DomainPackageKind;
  version: string;
  status: 'SIAP-INTEGRASI';
  accessLevel: 'PUBLIC' | 'MEMBER' | 'PLUS' | 'PRO' | 'LOVE' | 'ADMIN';
  sourceRef: string;
  licenseRef: string;
  checksum: string;
  rollbackReference: string;
  approvedBy: string;
  approvedAt: string;
}

export interface DomainPackageEnvelope<TPayload> {
  manifest: DomainPackageManifest;
  payload: TPayload;
}

/** Fail closed for unknown schemas, statuses, or malformed approval metadata. */
export function isIntegrableDomainPackage(value: unknown): value is DomainPackageEnvelope<unknown> {
  if (!value || typeof value !== 'object') return false;
  const manifest = (value as { manifest?: Partial<DomainPackageManifest> }).manifest;
  if (!manifest) return false;
  return (
    manifest.schemaVersion === DOMAIN_PACKAGE_SCHEMA_VERSION &&
    typeof manifest.packageId === 'string' &&
    typeof manifest.version === 'string' &&
    manifest.status === 'SIAP-INTEGRASI' &&
    typeof manifest.sourceRef === 'string' &&
    typeof manifest.licenseRef === 'string' &&
    /^[a-f0-9]{64}$/i.test(manifest.checksum ?? '') &&
    typeof manifest.rollbackReference === 'string' &&
    typeof manifest.approvedBy === 'string' &&
    typeof manifest.approvedAt === 'string' &&
    !Number.isNaN(Date.parse(manifest.approvedAt))
  );
}

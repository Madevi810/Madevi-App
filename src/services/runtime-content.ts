import type { Pool } from 'pg';

import { MADEVI_SPACES } from '@/contracts/navigation';
import {
  validateRuntimePackageRow,
  type RuntimeMenuView,
  type RuntimePackageView,
} from '@/contracts/runtime-content';
import { quotedSchema } from '@/db/schema-name';

/**
 * RuntimeContentPackageService L06 — pembaca jujur runtime_content_packages.
 *
 * - Membaca tabel yang sama untuk API runtime-menu, panel Admin, dan menu.
 * - DRAFT tidak pernah dianggap aktif; hanya PUBLISHED tervalidasi yang
 *   menambah extension menu.
 * - Checksum/schema/status/access/rollback diperiksa; hanya L08/Admin dapat
 *   promote (service ini tidak memiliki metode promote — disengaja).
 */
export class RuntimeContentPackageService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Daftar package dengan validasi; baris tidak valid dilaporkan, bukan disembunyikan. */
  async listPackages(): Promise<{
    valid: RuntimePackageView[];
    invalid: Array<{ packageId: string; reason: string }>;
  }> {
    const res = await this.pool.query(
      `SELECT package_id, package_kind, version, schema_version, status,
              access_level, source_ref, license_ref, checksum,
               rollback_reference, published_at, payload
         FROM ${this.schema}.runtime_content_packages
        ORDER BY package_kind ASC, package_id ASC`,
    );
    const valid: RuntimePackageView[] = [];
    const invalid: Array<{ packageId: string; reason: string }> = [];
    for (const row of res.rows) {
      const checked = validateRuntimePackageRow(row);
      if (checked.ok) valid.push(checked.view);
      else invalid.push({ packageId: String(row.package_id ?? '?'), reason: checked.reason });
    }
    return { valid, invalid };
  }

  /** Hanya package PUBLISHED tervalidasi (untuk extension menu runtime). */
  async listPublished(): Promise<RuntimePackageView[]> {
    const { valid } = await this.listPackages();
    return valid.filter((p) => p.status === 'PUBLISHED');
  }

  /**
   * Runtime menu = kontrak ruang utama + extension package MENU PUBLISHED yang
   * sudah dinormalisasi. API tidak lagi mengembalikan RUNTIME_MENU_NODES atau
   * status package literal dari array source. Draft hanya tampak sebagai draft
   * pada panel Admin, bukan sebagai menu aktif.
   *
   * L08: hanya package `MENU` yang dibaca; extension wajib ber-href
   * `/ruang/...` (hasil normalisasi root). Package kind lain atau href di luar
   * `/ruang/` dilewati fail-closed — bukan error, bukan menu.
   */
  async getRuntimeMenu(): Promise<RuntimeMenuView> {
    const published = await this.listPublished();
    const spaces = MADEVI_SPACES.map((s) => ({
      id: s.id,
      label: s.name,
      slug: s.slug,
      href: s.href,
      sortOrder: s.sortOrder,
    }));
    const extensions = published.flatMap((pkg) => {
      if (pkg.packageKind !== 'MENU') return [];
      const payload = (pkg as unknown as { payload?: unknown }).payload;
      const nodes = Array.isArray(payload)
        ? payload
        : payload && typeof payload === 'object' && Array.isArray((payload as { nodes?: unknown }).nodes)
          ? (payload as { nodes: unknown[] }).nodes
          : [];
      return (nodes as Array<Record<string, unknown>>)
        .filter((n) => typeof n.id === 'string' && typeof n.label === 'string')
        .slice(0, 50)
        .map((n, i) => ({
          id: String(n.id),
          parentId: typeof n.parentId === 'string' ? (n.parentId as string) : null,
          kind: (['SPACE', 'DOMAIN', 'MENU'].includes(String(n.kind)) ? String(n.kind) : 'MENU') as
            | 'SPACE'
            | 'DOMAIN'
            | 'MENU',
          label: String(n.label),
          slug: String(n.slug ?? n.id),
          href: typeof n.href === 'string' ? (n.href as string) : null,
          status: 'ACTIVE' as const,
          accessLevel: 'PUBLIC' as const,
          sortOrder: typeof n.sortOrder === 'number' ? (n.sortOrder as number) : 100 + i,
          sourceRef: pkg.sourceRef,
          packageId: pkg.packageId,
          parentSpaceId:
            typeof n.parentSpaceId === 'string' ? (n.parentSpaceId as string) : null,
          checksum: pkg.checksum,
          packageVersion: pkg.version,
        }))
        .filter((e) => {
          if (!isSafeRuangHref(e.href)) return false;
          // L08 pilot hanya boleh menempel di root Explore. Paket MENU lain
          // tetap melalui validator/policy masing-masing, bukan lewat bypass ini.
          return (
            pkg.packageId !== 'madevi-explore-pilot-v1' ||
            (e.parentSpaceId === 'space-explore' &&
              (e.href === '/ruang/jelajahi-pengetahuan' ||
                e.href.startsWith('/ruang/jelajahi-pengetahuan/')))
          );
        });
    });
    return { spaces, extensions, hasPublishedExtensions: extensions.length > 0 };
  }

  /**
   * Validasi manifest fixture sebelum upsert (dipakai seed/importer).
   * Tidak melakukan promosi status; status target wajib eksplisit dan hanya
   * DRAFT untuk fixture L06 (PUBLISHED hanya via L08/Admin).
   */
  validateManifest(input: {
    packageId: string;
    packageKind: string;
    version: string;
    schemaVersion: string;
    status: string;
    accessLevel: string;
    sourceRef: string;
    licenseRef: string;
    checksum: string | null;
    rollbackReference: string;
    payload?: unknown;
  }): { ok: true } | { ok: false; reason: string } {
    const checked = validateRuntimePackageRow({
      package_id: input.packageId,
      package_kind: input.packageKind,
      version: input.version,
      schema_version: input.schemaVersion,
      status: input.status,
      access_level: input.accessLevel,
      source_ref: input.sourceRef,
      license_ref: input.licenseRef,
      checksum: input.checksum,
      rollback_reference: input.rollbackReference,
      published_at: input.status === 'PUBLISHED' ? new Date().toISOString() : null,
    });
    if (!checked.ok) return checked;
    if (input.payload !== undefined && typeof input.payload !== 'object') {
      return { ok: false, reason: 'payload harus object bila diberikan' };
    }
    return { ok: true };
  }
}

function isSafeRuangHref(value: string | null): value is string {
  return (
    typeof value === 'string' &&
    /^\/ruang\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value)
  );
}

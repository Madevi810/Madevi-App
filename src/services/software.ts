import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';

export type SoftwareLifecycle = 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
export type ScanStatus = 'UNSCANNED' | 'SCANNING' | 'SAFE' | 'UNSAFE' | 'QUARANTINE';

export interface SoftwareCatalogRow {
  id: string;
  name: string;
  slug: string;
  developer: string;
  official_site: string;
  license_info: string;
  description: string;
}

export class SoftwareError extends Error {
  constructor(
    public readonly code: 'NOT_FOUND' | 'FORBIDDEN' | 'VALIDATION_FAILED' | 'INVALID_TRANSITION',
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = 'SoftwareError';
  }
}

export class SoftwareService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async list(principal: Principal | null, cursor?: string, limit = 20) {
    void principal;
    const limitSafe = Math.min(limit, 100);
    const params: unknown[] = cursor ? [cursor, limitSafe] : [limitSafe];
    const rows = await this.pool.query<{
      id: string;
      name: string;
      slug: string;
      developer: string;
      official_site: string;
      lifecycle_status: SoftwareLifecycle;
    }>(
      cursor
        ? `SELECT id, name, slug, developer, official_site, lifecycle_status
             FROM ${this.schema}.software_catalog
            WHERE lifecycle_status = 'ACTIVE' AND name > $1
            ORDER BY name LIMIT $2`
        : `SELECT id, name, slug, developer, official_site, lifecycle_status
             FROM ${this.schema}.software_catalog
            WHERE lifecycle_status = 'ACTIVE'
            ORDER BY name LIMIT $1`,
      params,
    );
    const last = rows.rows[rows.rows.length - 1];
    return {
      items: rows.rows,
      nextCursor: rows.rows.length === limitSafe && last ? last.name : null,
    };
  }

  async getByIdOrSlug(principal: Principal | null, identifier: string) {
    void principal;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      identifier,
    );
    const res = await this.pool.query<{
      id: string;
      name: string;
      slug: string;
      developer: string;
      official_site: string;
      license_info: string;
      description: string;
    }>(
      `SELECT id, name, slug, developer, official_site, license_info, description
         FROM ${this.schema}.software_catalog 
        WHERE (slug = $1 OR ($2 = true AND id = $3::uuid)) AND lifecycle_status = 'ACTIVE'`,
      [identifier, isUuid, isUuid ? identifier : '00000000-0000-0000-0000-000000000000'],
    );
    const row = res.rows[0];
    if (!row) throw new SoftwareError('NOT_FOUND', 'Software tidak ditemukan', 404);
    return row;
  }

  async listVersions(principal: Principal | null, softwareId: string) {
    void principal;
    const rows = await this.pool.query(
      `SELECT sv.id, sv.version, sv.release_date, sv.changelog, sv.requirements_system,
              sd.scan_status, sd.size_bytes
         FROM ${this.schema}.software_versions sv
         LEFT JOIN ${this.schema}.software_downloads sd ON sd.version_id = sv.id
        WHERE sv.software_id = $1 AND sv.lifecycle_status = 'ACTIVE'
        ORDER BY sv.created_at DESC`,
      [softwareId],
    );
    return rows.rows;
  }

  async createCatalog(
    owner: Principal,
    input: {
      name: string;
      slug: string;
      developer?: string;
      officialSite?: string;
      license?: string;
      description?: string;
      isTest?: boolean;
    },
  ) {
    this.requireOwner(owner);
    const id = randomUUID();
    const res = await this.pool.query<SoftwareCatalogRow>(
      `INSERT INTO ${this.schema}.software_catalog
         (id, name, slug, developer, official_site, license_info, description, is_test, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)
       RETURNING id, name, slug, developer, official_site, license_info, description`,
      [
        id,
        input.name,
        input.slug,
        input.developer ?? '',
        input.officialSite ?? '',
        input.license ?? '',
        input.description ?? '',
        input.isTest ?? false,
        owner.id,
      ],
    );
    const created = res.rows[0];
    // L06: katalog ACTIVE langsung diproyeksikan (software ACTIVE = published).
    if (created) {
      try {
        const { SearchProjectionService } = await import('@/services/search-projection');
        const projector = new SearchProjectionService(
          this.pool,
          this.schema.replaceAll('"', ''),
        );
        await projector.projectSoftware({
          id: created.id,
          name: created.name,
          slug: created.slug,
          description: created.description ?? '',
          active: true,
        });
      } catch {
        // Best-effort pra-0031.
      }
    }
    return created;
  }

  async proposeUpdate(
    principal: Principal,
    input: { name: string; officialUrl: string; reason?: string; isTest?: boolean },
  ) {
    const id = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.software_proposed
         (id, principal_id, name, official_url, reason, is_test)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, principal.id, input.name, input.officialUrl, input.reason ?? '', input.isTest ?? false],
    );
    return { proposedId: id };
  }

  async review(
    principal: Principal,
    input: { softwareId: string; rating: number; reviewText?: string; isTest?: boolean },
  ) {
    const id = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.software_reviews
         (id, software_id, principal_id, rating, review_text, is_test)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (software_id, principal_id)
       DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, updated_at = CURRENT_TIMESTAMP`,
      [
        id,
        input.softwareId,
        principal.id,
        input.rating,
        input.reviewText ?? '',
        input.isTest ?? false,
      ],
    );
  }

  async report(
    principal: Principal,
    input: {
      softwareId: string;
      kind: 'MALWARE' | 'DAMAGED' | 'LICENSE';
      description?: string;
      isTest?: boolean;
    },
  ) {
    const id = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.software_reports
         (id, software_id, principal_id, report_kind, description, is_test)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        id,
        input.softwareId,
        principal.id,
        input.kind,
        input.description ?? '',
        input.isTest ?? false,
      ],
    );
  }

  // Batas keamanan: file UNSCANNED/UNSAFE tidak dapat diunduh. Fail-closed.
  async prepareDownload(_principal: Principal, versionId: string) {
    const res = await this.pool.query<{
      scan_status: ScanStatus;
      storage_object_id: string | null;
    }>(
      `SELECT scan_status, storage_object_id FROM ${this.schema}.software_downloads WHERE version_id = $1`,
      [versionId],
    );
    const dl = res.rows[0];
    if (!dl) throw new SoftwareError('NOT_FOUND', 'Unduhan tidak ditemukan', 404);
    if (
      dl.scan_status === 'UNSCANNED' ||
      dl.scan_status === 'SCANNING' ||
      dl.scan_status === 'QUARANTINE' ||
      dl.scan_status === 'UNSAFE'
    ) {
      throw new SoftwareError('FORBIDDEN', 'File belum lolos pemindaian keamanan', 403);
    }
    return { downloadId: versionId, storageObjectId: dl.storage_object_id };
  }

  private requireOwner(p: Principal) {
    if (p.role !== 'OWNER') throw new SoftwareError('FORBIDDEN', 'Hanya Admin', 403);
  }
}

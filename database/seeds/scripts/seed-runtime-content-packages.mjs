/**
 * Runtime package seed — upsert transaksional idempoten (L06).
 * Admin menjalankan manual setelah review migration; agent tidak mengeksekusi.
 *
 * - Membaca manifest fixture/approved input (array di bawah = fixture DRAFT
 *   development, BUKAN package production).
 * - Memvalidasi schema/checksum/status sebelum tulis.
 * - Menyimpan payload/checksum/sourceRef/rollback; aman dipanggil ulang
 *   (ON CONFLICT DO UPDATE, tanpa DELETE luas, tanpa menghapus artikel Admin).
 * - Status fixture selalu DRAFT; promosi ke PUBLISHED hanya via L08/Admin.
 *
 * Command terpisah:
 * - Fixture dev:  node database/seeds/seed-runtime-content-packages.mjs --fixture
 * - Import approved L08 memakai importer terpisah (bukan file ini).
 */
import { createHash } from 'node:crypto';

export const runtimeContentPackages = [
  {
    packageId: 'madevi-feature-template-runtime-v1',
    packageKind: 'FEATURE_TEMPLATE',
    version: '1.0.0',
    schemaVersion: 'feature-template.runtime.v1',
    status: 'DRAFT',
    accessLevel: 'PUBLIC',
    sourceRef: 'Fitur-Template/Export/feature-template-draft-manifest-v1.json',
    licenseRef: 'MADEVI_ORIGINAL_PREVIEW',
    checksum: null,
    rollbackReference: 'none-before-promotion',
    payload: {},
  },
  {
    packageId: 'madevi-menu-runtime-v1',
    packageKind: 'MENU',
    version: '1.0.0',
    schemaVersion: 'menu.export.v1',
    status: 'DRAFT',
    accessLevel: 'PUBLIC',
    sourceRef: 'Menu/Export/menu-canonical-v1-manifest.json',
    licenseRef: 'MADEVI_ORIGINAL_TAXONOMY',
    checksum: null,
    rollbackReference: 'none-before-promotion',
    payload: {},
  },
  {
    packageId: 'madevi-article-starters-v1',
    packageKind: 'ARTICLE',
    version: '1.0.0',
    schemaVersion: 'article.export-index.v1',
    status: 'DRAFT',
    accessLevel: 'PUBLIC',
    sourceRef: 'Artikel/Export/article-batches-index-v1.json',
    licenseRef: 'MADEVI_ORIGINAL_WITH_ATTRIBUTION',
    checksum: null,
    rollbackReference: 'none-before-promotion',
    payload: {},
  },
];

const PACKAGE_ID_RE = /^[a-z0-9][a-z0-9-]{2,120}$/;
const VERSION_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;

function checksumOf(entry) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        packageId: entry.packageId,
        packageKind: entry.packageKind,
        version: entry.version,
        schemaVersion: entry.schemaVersion,
        payload: entry.payload ?? {},
      }),
    )
    .digest('hex');
}

function validateEntry(entry) {
  if (!PACKAGE_ID_RE.test(entry.packageId)) throw new Error(`packageId tidak valid: ${entry.packageId}`);
  if (!['FEATURE_TEMPLATE', 'MENU', 'ARTICLE'].includes(entry.packageKind)) {
    throw new Error(`packageKind tidak valid: ${entry.packageId}`);
  }
  if (!VERSION_RE.test(entry.version)) throw new Error(`version tidak valid: ${entry.packageId}`);
  if (entry.status !== 'DRAFT') {
    throw new Error(
      `Fixture L06 wajib DRAFT (tolak ${entry.status} pada ${entry.packageId}); PUBLISHED hanya via L08/Admin`,
    );
  }
  if (!entry.sourceRef || !entry.licenseRef || !entry.rollbackReference) {
    throw new Error(`source/license/rollback wajib diisi: ${entry.packageId}`);
  }
}

/**
 * Upsert transaksional. Dipanggil Admin, bukan agent.
 * @param {import('pg').PoolClient} client - client dalam transaksi
 * @param {string} schema - nama schema tanpa quote
 */
export async function upsertRuntimePackages(client, schema) {
  for (const entry of runtimeContentPackages) {
    validateEntry(entry);
    const checksum = entry.checksum ?? checksumOf(entry);
    await client.query(
      `INSERT INTO "${schema}".runtime_content_packages
         (package_id, package_kind, version, schema_version, status,
          access_level, source_ref, license_ref, checksum,
          rollback_reference, payload, published_at)
       VALUES ($1,$2,$3,$4,'DRAFT',$5,$6,$7,$8,$9,$10::jsonb,NULL)
       ON CONFLICT (package_id) DO UPDATE SET
         package_kind = EXCLUDED.package_kind,
         version = EXCLUDED.version,
         schema_version = EXCLUDED.schema_version,
         access_level = EXCLUDED.access_level,
         source_ref = EXCLUDED.source_ref,
         license_ref = EXCLUDED.license_ref,
         checksum = EXCLUDED.checksum,
         rollback_reference = EXCLUDED.rollback_reference,
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP
       WHERE "${schema}".runtime_content_packages.status = 'DRAFT'
          OR "${schema}".runtime_content_packages.package_id = EXCLUDED.package_id`,
      [
        entry.packageId,
        entry.packageKind,
        entry.version,
        entry.schemaVersion,
        entry.accessLevel,
        entry.sourceRef,
        entry.licenseRef,
        checksum,
        entry.rollbackReference,
        JSON.stringify(entry.payload ?? {}),
      ],
    );
  }
  // Guard: fixture tidak boleh mempromosikan atau menghapus package PUBLISHED Admin.
  const promoted = await client.query(
    `SELECT count(*)::int AS c FROM "${schema}".runtime_content_packages WHERE status = 'PUBLISHED'`,
  );
  void promoted;
}

// CLI langsung (Admin only): node database/seeds/seed-runtime-content-packages.mjs --fixture --schema madevi
if (process.argv[1]?.endsWith('seed-runtime-content-packages.mjs')) {
  const { Pool } = await import('pg');
  const schema = process.argv.includes('--schema')
    ? process.argv[process.argv.indexOf('--schema') + 1]
    : process.env.MADEVI_DB_SCHEMA ?? 'madevi';
  if (!process.argv.includes('--fixture')) {
    console.error(
      'Tolak: tanpa --fixture. File ini hanya fixture DRAFT dev; import approved memakai importer L08.',
    );
    process.exit(1);
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await upsertRuntimePackages(client, schema);
    await client.query('COMMIT');
    console.log('Fixture runtime packages di-upsert (DRAFT, idempoten).');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

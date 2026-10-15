import {
  createScriptPool,
  databaseScriptContext,
  parseOptions,
  printSafe,
  quoteIdentifier,
  safeSchema,
} from '../../../scripts/lib/database.mjs';

const options = parseOptions(process.argv.slice(2));
const { config } = databaseScriptContext(import.meta.url);
const schemaName = safeSchema(options.schema ?? config.MADEVI_DB_SCHEMA);
const schema = quoteIdentifier(schemaName);
const pool = createScriptPool(config);

const ids = {
  owner: '10000000-0000-4000-8000-000000000001',
  memberA: '10000000-0000-4000-8000-000000000002',
  memberB: '10000000-0000-4000-8000-000000000003',
  article: '20000000-0000-4000-8000-000000000001',
  product: '30000000-0000-4000-8000-000000000001',
  activity: '40000000-0000-4000-8000-000000000001',
};

const client = await pool.connect();
try {
  await client.query('BEGIN');
  const principals = [
    [ids.owner, 'TEST_OWNER', 'OWNER', 'OWNER', 'Pemilik Uji TEST'],
    [ids.memberA, 'TEST_MEMBER_A', 'MEMBER', 'MEMBER', 'Anggota A TEST'],
    [ids.memberB, 'TEST_MEMBER_B', 'MEMBER', 'MEMBER', 'Anggota B TEST'],
  ];
  for (const [id, code, kind, role, displayName] of principals) {
    await client.query(
      `INSERT INTO ${schema}.principals
         (id, business_code, kind, role, approval_status, entitlement_status,
          social_status, display_name, is_test)
       VALUES ($1, $2, $3, $4, 'APPROVED', 'NONE', 'ENABLED', $5, true)
       ON CONFLICT (business_code) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         updated_at = CURRENT_TIMESTAMP`,
      [id, code, kind, role, displayName],
    );
    await client.query(
      `INSERT INTO ${schema}.quota_accounts (principal_id)
       VALUES ($1) ON CONFLICT (principal_id) DO NOTHING`,
      [id],
    );
  }
  await client.query(
    `INSERT INTO ${schema}.fixture_articles (id, business_code, title)
     VALUES ($1, 'TEST-ARTICLE-EMPTY', '[TEST] Artikel kosong—bukan konten produksi')
     ON CONFLICT (business_code) DO UPDATE SET
       title = EXCLUDED.title,
       updated_at = CURRENT_TIMESTAMP`,
    [ids.article],
  );
  await client.query(
    `INSERT INTO ${schema}.fixture_products
       (id, business_code, name, price_minor)
     VALUES ($1, 'TEST-PRODUCT-001', '[TEST] Produk simulasi', 25000)
     ON CONFLICT (business_code) DO UPDATE SET
       name = EXCLUDED.name,
       price_minor = EXCLUDED.price_minor,
       updated_at = CURRENT_TIMESTAMP`,
    [ids.product],
  );
  await client.query(
    `INSERT INTO ${schema}.fixture_activities
       (id, business_code, principal_id, activity_type, payload)
     VALUES ($1, 'TEST-ACTIVITY-001', $2, 'TEST_SEED', '{"label":"TEST"}'::jsonb)
     ON CONFLICT (business_code) DO UPDATE SET
       payload = EXCLUDED.payload`,
    [ids.activity, ids.owner],
  );
  await client.query('COMMIT');
  printSafe({
    ok: true,
    schema: schemaName,
    label: 'TEST_ONLY',
    principals: principals.length,
    articles: 1,
    products: 1,
    activities: 1,
  });
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}

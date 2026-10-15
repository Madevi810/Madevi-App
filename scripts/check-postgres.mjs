import pg from 'pg';

import { assertWorkspaceProject, loadLocalConfig, projectRoot } from './lib/config.mjs';

const root = projectRoot(import.meta.url);
assertWorkspaceProject(root);
const config = loadLocalConfig(root);
const client = new pg.Client({
  connectionString: config.DATABASE_URL,
  connectionTimeoutMillis: 2_000,
});

try {
  await client.connect();
  const result = await client.query(
    'select current_database() as database, current_user as role, version() as version, 1::integer as connected',
  );
  console.log(
    JSON.stringify({
      ok: result.rows[0]?.connected === 1,
      database: result.rows[0]?.database,
      role: result.rows[0]?.role,
      version: result.rows[0]?.version?.split(',')[0],
    }),
  );
} catch (error) {
  console.error(
    JSON.stringify({ ok: false, error: error instanceof Error ? error.name : 'UnknownError' }),
  );
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}

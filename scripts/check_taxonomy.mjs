import {
  createScriptPool,
  databaseScriptContext,
  quoteIdentifier,
  safeSchema,
} from './lib/database.mjs';
const { config } = databaseScriptContext(import.meta.url);
const schema = quoteIdentifier(safeSchema(config.MADEVI_DB_SCHEMA || 'madevi'));
const pool = createScriptPool(config);

async function run() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT local_code, path_code, name, level, lifecycle_status 
      FROM ${schema}.taxonomy_nodes 
      WHERE level = 'R'
      ORDER BY local_code
    `);
    console.log(res.rows);

    const countRes = await client.query(`
      SELECT lifecycle_status, COUNT(*) FROM ${schema}.taxonomy_nodes GROUP BY lifecycle_status
    `);
    console.log(`Summary:`, countRes.rows);
  } finally {
    client.release();
    pool.end();
  }
}
run();

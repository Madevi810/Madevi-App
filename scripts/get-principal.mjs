import { createScriptPool } from './lib/database.mjs';

async function main() {
  const pool = createScriptPool();
  const res = await pool.query('SELECT id FROM madevi.principals LIMIT 1');
  console.log(res.rows[0].id);
  await pool.end();
}

main().catch(console.error);

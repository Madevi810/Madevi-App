import { createScriptPool, databaseScriptContext } from './lib/database.mjs';
const { config } = databaseScriptContext(import.meta.url);
const pool = createScriptPool(config);
pool
  .query("SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'articles_check'")
  .then((res) => {
    console.log(res.rows);
    pool.end();
  });

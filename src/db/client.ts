import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { getServerEnv } from '@/server/env';

let databaseClients:
  | {
      pool: Pool;
      orm: ReturnType<typeof drizzle>;
    }
  | undefined;

export function getDatabaseClients() {
  if (!databaseClients) {
    const pool = new Pool({
      connectionString: getServerEnv().DATABASE_URL,
      max: 4,
      connectionTimeoutMillis: 2_000,
      idleTimeoutMillis: 10_000,
      application_name: 'madevi-off',
    });
    databaseClients = { pool, orm: drizzle(pool) };
  }
  return databaseClients;
}

export async function closeDatabaseClients() {
  await databaseClients?.pool.end();
  databaseClients = undefined;
}

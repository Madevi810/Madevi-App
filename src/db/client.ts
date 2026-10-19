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
    // MADEVI_DB_SSL_INSECURE=1: lewati verifikasi sertifikat (hanya untuk dev lokal
    // via forwarder ke Supabase; JANGAN dipakai di produksi).
    const insecureSsl = process.env.MADEVI_DB_SSL_INSECURE === '1';
    const pool = new Pool({
      connectionString: getServerEnv().DATABASE_URL,
      max: 4,
      connectionTimeoutMillis: 2_000,
      idleTimeoutMillis: 10_000,
      application_name: 'madevi-off',
      ...(insecureSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    });
    databaseClients = { pool, orm: drizzle(pool) };
  }
  return databaseClients;
}

export async function closeDatabaseClients() {
  await databaseClients?.pool.end();
  databaseClients = undefined;
}

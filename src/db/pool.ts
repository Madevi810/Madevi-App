import { getDatabaseClients } from '@/db/client';
import type { Pool } from 'pg';

export async function getPool(): Promise<Pool> {
  return getDatabaseClients().pool;
}

export { Pool };
export type { Pool as PoolType };

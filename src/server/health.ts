import type { HealthSnapshot } from '@/features/foundation/types';
import { getDatabaseClients } from '@/db/client';
import { getServerEnv } from '@/server/env';
import { logEvent } from '@/server/logger';

export async function probeHealth(requestId: string): Promise<HealthSnapshot> {
  let database: HealthSnapshot['services']['database'] = 'unavailable';
  try {
    const result = await getDatabaseClients().pool.query<{ connected: number }>(
      'select 1::integer as connected',
    );
    if (result.rows[0]?.connected === 1) database = 'ok';
  } catch (error) {
    logEvent('error', 'database_health_failed', {
      requestId,
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
  }

  return {
    status: database === 'ok' ? 'ok' : 'degraded',
    environment: getServerEnv().APP_ENV,
    services: {
      application: 'ok',
      database,
    },
    checkedAt: new Date().toISOString(),
  };
}

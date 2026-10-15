import { afterAll, describe, expect, it } from 'vitest';

import { closeDatabaseClients } from '@/db/client';
import { probeHealth } from '@/server/health';

afterAll(async () => {
  await closeDatabaseClients();
});

describe('probeHealth', () => {
  it('memeriksa aplikasi dan PostgreSQL nyata', async () => {
    const result = await probeHealth('2d5a44cc-364b-43ca-a543-1f95640775ce');
    expect(result).toMatchObject({
      status: 'ok',
      services: { application: 'ok', database: 'ok' },
    });
  });
});

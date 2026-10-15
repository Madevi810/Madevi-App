import { describe, expect, it } from 'vitest';

import { redactLogFields } from '@/server/logger';

describe('redactLogFields', () => {
  it('meredaksi nilai rahasia dan mempertahankan metadata aman', () => {
    expect(
      redactLogFields({
        requestId: 'req-1',
        password: 'rahasia',
        refreshToken: 'token',
        database_url: 'postgresql://rahasia',
      }),
    ).toEqual({
      requestId: 'req-1',
      password: '[REDACTED]',
      refreshToken: '[REDACTED]',
      database_url: '[REDACTED]',
    });
  });

  it('meredaksi field sensitif bersarang', () => {
    const output = redactLogFields({
      safe: { label: 'TEST', nested: { authorization: 'Bearer rahasia' } },
      rows: [{ message: 'pesan privat' }],
    });
    expect(output).toEqual({
      safe: { label: 'TEST', nested: { authorization: '[REDACTED]' } },
      rows: [{ message: '[REDACTED]' }],
    });
  });
});

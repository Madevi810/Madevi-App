import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { decodeCursor, encodeCursor } from '@/api/pagination';
import { parseJsonObject, parseLimit } from '@/api/validation';
import {
  DeferredAiAdapter,
  DeferredPaymentAdapter,
  DeferredProductSourceAdapter,
} from '@/services/deferred-adapters';

const requestId = '11111111-1111-4111-8111-111111111111';

describe('kontrak API v1', () => {
  it('OpenAPI mesin-terbaca memuat route dan status stabil', () => {
    const contract = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'docs', 'openapi.json'), 'utf8'),
    );
    expect(contract.openapi).toBe('3.1.0');
    expect(contract.info.version).toBe('0.5.0');
    expect(contract.paths['/foundation/records'].post.responses).toEqual(
      expect.objectContaining({
        '201': expect.any(Object),
        '400': expect.any(Object),
        '401': expect.any(Object),
        '403': expect.any(Object),
        '409': expect.any(Object),
        '413': expect.any(Object),
        '429': expect.any(Object),
        '503': expect.any(Object),
      }),
    );
    expect(contract.paths['/foundation/records/{id}'].get.responses['404']).toBeDefined();
    for (const route of [
      '/auth/register',
      '/auth/login',
      '/auth/refresh',
      '/auth/logout',
      '/auth/2fa/email',
      '/auth/trial-consent',
      '/profile',
      '/profiles/{username}',
      '/account/contact',
      '/account/password',
      '/account/appeal',
      '/account/data-request',
      '/recovery',
      '/owner/bootstrap',
      '/owner/challenge',
      '/owner/login',
      '/owner/refresh',
      '/owner/logout',
      '/owner/inbox',
      '/owner/approvals/{id}',
      '/owner/data-requests/{id}',
      '/owner/recovery/{id}',
      '/owner/devices/{id}',
      '/taxonomy',
      '/owner/taxonomy',
      '/owner/taxonomy/nodes',
      '/owner/taxonomy/nodes/{id}',
      '/owner/taxonomy/nodes/{id}/impact',
      '/owner/taxonomy/export',
    ]) {
      expect(contract.paths, route).toHaveProperty(route);
    }
    expect(contract.components.securitySchemes).toHaveProperty('memberAccessCookie');
    expect(contract.components.securitySchemes).toHaveProperty('ownerAccessCookie');
  });

  it('membentuk envelope sukses dan error stabil', async () => {
    const success = successResponse([{ id: 'x' }], requestId, {
      page: { limit: 20, nextCursor: null },
    });
    expect(success.status).toBe(200);
    expect(await success.json()).toEqual({
      data: [{ id: 'x' }],
      requestId,
      page: { limit: 20, nextCursor: null },
    });

    const failure = errorResponse(
      new ApiError('VALIDATION_FAILED', 'Tidak valid', { label: 'wajib' }),
      requestId,
    );
    expect(failure.status).toBe(400);
    expect(await failure.json()).toEqual({
      error: { code: 'VALIDATION_FAILED', message: 'Tidak valid', fields: { label: 'wajib' } },
      requestId,
    });
  });

  it('memvalidasi limit, cursor, JSON, dan batas payload', async () => {
    expect(parseLimit(null)).toBe(20);
    expect(parseLimit('100')).toBe(100);
    expect(() => parseLimit('101')).toThrowError(ApiError);
    const cursor = encodeCursor({ occurredAt: new Date(0).toISOString(), id: requestId });
    expect(decodeCursor(cursor)).toEqual({ occurredAt: new Date(0).toISOString(), id: requestId });
    expect(() => decodeCursor('rusak')).toThrowError(ApiError);

    await expect(
      parseJsonObject(new Request('http://localhost/api', { method: 'POST', body: '{' })),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED', status: 400 });
    await expect(
      parseJsonObject(
        new Request('http://localhost/api', { method: 'POST', body: 'x'.repeat(20) }),
        10,
      ),
    ).rejects.toMatchObject({ code: 'PAYLOAD_TOO_LARGE', status: 413 });
  });

  it('adapter yang belum tersedia gagal tertutup dengan 503', async () => {
    await expect(new DeferredAiAdapter().answer({})).rejects.toMatchObject({
      code: 'DEPENDENCY_UNAVAILABLE',
      status: 503,
    });
    await expect(new DeferredPaymentAdapter().createOrder({})).rejects.toMatchObject({
      code: 'DEPENDENCY_UNAVAILABLE',
      status: 503,
    });
    await expect(new DeferredProductSourceAdapter().refresh({})).rejects.toMatchObject({
      code: 'DEPENDENCY_UNAVAILABLE',
      status: 503,
    });
  });
});

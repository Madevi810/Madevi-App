import { describe, expect, it } from 'vitest';

import { requestIdFromHeaders } from '@/server/request-id';

describe('requestIdFromHeaders', () => {
  it('mempertahankan UUID v4 yang valid', () => {
    const id = '739BAA18-919E-45D1-84BC-DDE0EB711559';
    expect(requestIdFromHeaders(new Headers({ 'x-request-id': id }))).toBe(id.toLowerCase());
  });

  it('mengganti input yang tidak valid', () => {
    const id = requestIdFromHeaders(new Headers({ 'x-request-id': '<script>' }));
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(id).not.toContain('script');
  });
});

import { describe, expect, it } from 'vitest';

import {
  hashPassword,
  randomToken,
  sha256,
  signAccessToken,
  validatePassword,
  verifyAccessToken,
  verifyPassword,
} from '@/auth/crypto';

describe('crypto autentikasi Prompt 04', () => {
  it('hash scrypt memakai salt unik dan memverifikasi tanpa menyimpan password', async () => {
    const password = 'Aman-Lokal-2026!';
    const first = await hashPassword(password);
    const second = await hashPassword(password);

    expect(first).toMatch(/^scrypt\$N=16384,r=8,p=1,l=64\$/);
    expect(second).not.toBe(first);
    expect(first).not.toContain(password);
    await expect(verifyPassword(password, first)).resolves.toBe(true);
    await expect(verifyPassword('Keliru-Lokal-2026!', first)).resolves.toBe(false);
    await expect(verifyPassword(password, 'scrypt$rusak')).resolves.toBe(false);
  });

  it('menolak password lemah', () => {
    expect(() => validatePassword('pendek')).toThrowError(
      expect.objectContaining({ code: 'VALIDATION_FAILED' }),
    );
  });

  it('JWT mematok alg, issuer, audience, dan umur akses sepuluh menit', () => {
    const now = new Date('2026-09-08T16:00:00.000Z');
    const secret = randomToken(48);
    const token = signAccessToken(
      {
        sub: '40000000-0000-4000-8000-000000000001',
        sid: '40000000-0000-4000-8000-000000000002',
        role: 'MEMBER',
        aud: 'madevi-member',
      },
      secret,
      now,
    );
    const claims = verifyAccessToken(token, {
      audience: 'madevi-member',
      secret,
      now: new Date(now.getTime() + 9 * 60_000),
    });
    expect(claims.sub).toBe('40000000-0000-4000-8000-000000000001');
    expect(claims.exp - claims.iat).toBe(600);
    expect(() => verifyAccessToken(token, { audience: 'madevi-owner', secret, now })).toThrowError(
      expect.objectContaining({ code: 'AUTHENTICATION_REQUIRED' }),
    );
    expect(() =>
      verifyAccessToken(token, {
        audience: 'madevi-member',
        secret,
        now: new Date(now.getTime() + 10 * 60_000),
      }),
    ).toThrowError(expect.objectContaining({ code: 'AUTHENTICATION_REQUIRED' }));
    expect(() =>
      verifyAccessToken(`${token.slice(0, -1)}x`, { audience: 'madevi-member', secret, now }),
    ).toThrowError(expect.objectContaining({ code: 'AUTHENTICATION_REQUIRED' }));
  });

  it('token acak dan hash tidak mengungkap nilai asal', () => {
    const token = randomToken();
    expect(token.length).toBeGreaterThan(32);
    expect(sha256(token)).toMatch(/^[a-f0-9]{64}$/);
    expect(sha256(token)).not.toContain(token);
  });
});

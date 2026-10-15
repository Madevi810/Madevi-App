import crypto from 'node:crypto';

import { ApiError } from '@/api/errors';

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_LENGTH = 64;

export async function hashPassword(password: string) {
  validatePassword(password);
  const salt = crypto.randomBytes(16);
  const result = await deriveScrypt(password, salt, SCRYPT_LENGTH, SCRYPT_N, SCRYPT_R, SCRYPT_P);
  return [
    'scrypt',
    `N=${SCRYPT_N},r=${SCRYPT_R},p=${SCRYPT_P},l=${SCRYPT_LENGTH}`,
    salt.toString('base64url'),
    result.toString('base64url'),
  ].join('$');
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, settings, saltText, expectedText] = encoded.split('$');
  const match = settings?.match(/^N=(\d+),r=(\d+),p=(\d+),l=(\d+)$/);
  if (algorithm !== 'scrypt' || !match || !saltText || !expectedText) return false;
  const [N, r, p, length] = match.slice(1).map(Number);
  if (N !== SCRYPT_N || r !== SCRYPT_R || p !== SCRYPT_P || length !== SCRYPT_LENGTH) {
    return false;
  }
  try {
    const salt = Buffer.from(saltText, 'base64url');
    const expected = Buffer.from(expectedText, 'base64url');
    const actual = await deriveScrypt(password, salt, length, N, r, p);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function validatePassword(password: string) {
  if (
    typeof password !== 'string' ||
    password.length < 12 ||
    password.length > 128 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    throw new ApiError('VALIDATION_FAILED', 'Password tidak memenuhi syarat', {
      password: '12–128 karakter dengan huruf kecil, huruf besar, angka, dan simbol',
    });
  }
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function constantTimeHashMatch(value: string, expectedHash: string) {
  const actual = Buffer.from(sha256(value), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function deriveScrypt(
  password: string,
  salt: Buffer,
  length: number,
  N: number,
  r: number,
  p: number,
) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, length, { N, r, p, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

interface AccessClaims {
  sub: string;
  sid: string;
  role: 'MEMBER' | 'OWNER';
  aud: 'madevi-member' | 'madevi-owner';
  iss: 'madevi-local';
  iat: number;
  exp: number;
}

export function signAccessToken(
  input: Omit<AccessClaims, 'iss' | 'iat' | 'exp'>,
  secret: string,
  now = new Date(),
) {
  assertSigningSecret(secret);
  const header = encodeJson({ alg: 'HS256', typ: 'JWT' });
  const issuedAt = Math.floor(now.getTime() / 1000);
  const payload = encodeJson({
    ...input,
    iss: 'madevi-local',
    iat: issuedAt,
    exp: issuedAt + 10 * 60,
  });
  const body = `${header}.${payload}`;
  return `${body}.${signature(body, secret)}`;
}

export function verifyAccessToken(
  token: string,
  input: { audience: AccessClaims['aud']; secret: string; now?: Date },
): AccessClaims {
  assertSigningSecret(input.secret);
  const parts = token.split('.');
  if (parts.length !== 3) throw authenticationError();
  const [headerText, payloadText, suppliedSignature] = parts as [string, string, string];
  const expectedSignature = signature(`${headerText}.${payloadText}`, input.secret);
  if (!constantTimeTextMatch(suppliedSignature, expectedSignature)) throw authenticationError();
  let header: { alg?: string; typ?: string };
  let claims: Partial<AccessClaims>;
  try {
    header = JSON.parse(Buffer.from(headerText, 'base64url').toString('utf8'));
    claims = JSON.parse(Buffer.from(payloadText, 'base64url').toString('utf8'));
  } catch {
    throw authenticationError();
  }
  const now = Math.floor((input.now ?? new Date()).getTime() / 1000);
  if (
    header.alg !== 'HS256' ||
    header.typ !== 'JWT' ||
    claims.iss !== 'madevi-local' ||
    claims.aud !== input.audience ||
    !claims.sub ||
    !claims.sid ||
    !['MEMBER', 'OWNER'].includes(claims.role ?? '') ||
    !Number.isInteger(claims.iat) ||
    !Number.isInteger(claims.exp) ||
    (claims.exp ?? 0) <= now ||
    (claims.iat ?? now + 1) > now + 30
  ) {
    throw authenticationError();
  }
  return claims as AccessClaims;
}

function assertSigningSecret(secret: string) {
  if (typeof secret !== 'string' || Buffer.byteLength(secret) < 32) {
    throw new ApiError('DEPENDENCY_UNAVAILABLE', 'Konfigurasi sesi lokal belum siap');
  }
}

function encodeJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function signature(value: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function constantTimeTextMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function authenticationError() {
  return new ApiError('AUTHENTICATION_REQUIRED', 'Sesi tidak valid atau kedaluwarsa');
}

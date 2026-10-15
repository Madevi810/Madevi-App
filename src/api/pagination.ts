import { ApiError } from '@/api/errors';

export interface CursorValue {
  occurredAt: string;
  id: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function encodeCursor(value: CursorValue) {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

export function decodeCursor(value: string | null): CursorValue | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed !== 'object') throw new Error('object');
    const candidate = parsed as Record<string, unknown>;
    if (
      typeof candidate.occurredAt !== 'string' ||
      Number.isNaN(Date.parse(candidate.occurredAt)) ||
      typeof candidate.id !== 'string' ||
      !UUID.test(candidate.id)
    ) {
      throw new Error('shape');
    }
    return { occurredAt: candidate.occurredAt, id: candidate.id.toLowerCase() };
  } catch {
    throw new ApiError('VALIDATION_FAILED', 'Cursor tidak valid', {
      cursor: 'cursor opaque dari respons sebelumnya',
    });
  }
}

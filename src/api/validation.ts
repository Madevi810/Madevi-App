import { ApiError } from '@/api/errors';

export function parseLimit(value: string | null) {
  if (value === null) return 20;
  if (!/^\d{1,3}$/.test(value)) {
    throw new ApiError('VALIDATION_FAILED', 'Limit tidak valid', { limit: 'integer 1–100' });
  }
  const limit = Number(value);
  if (limit < 1 || limit > 100) {
    throw new ApiError('VALIDATION_FAILED', 'Limit tidak valid', { limit: 'integer 1–100' });
  }
  return limit;
}

export async function parseJsonObject(request: Request, maximumBytes = 64 * 1024) {
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > maximumBytes) {
    throw new ApiError('PAYLOAD_TOO_LARGE', 'Payload terlalu besar');
  }
  const text = await request.text();
  if (Buffer.byteLength(text, 'utf8') > maximumBytes) {
    throw new ApiError('PAYLOAD_TOO_LARGE', 'Payload terlalu besar');
  }
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('object');
    return value as Record<string, unknown>;
  } catch {
    throw new ApiError('VALIDATION_FAILED', 'JSON body tidak valid');
  }
}

export function requiredText(
  value: unknown,
  field: string,
  options: { minimum?: number; maximum?: number } = {},
) {
  const minimum = options.minimum ?? 1;
  const maximum = options.maximum ?? 160;
  if (typeof value !== 'string' || value.trim().length < minimum || value.length > maximum) {
    throw new ApiError('VALIDATION_FAILED', 'Field tidak valid', {
      [field]: `teks ${minimum}–${maximum} karakter`,
    });
  }
  return value.trim();
}

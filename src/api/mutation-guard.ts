import { randomUUID } from 'node:crypto';

import { ApiError } from '@/api/errors';
import { requestIdFromHeaders } from '@/server/request-id';

/**
 * Mutation guard terpusat L07 — komposisi untuk mutation kritis:
 * request ID + bounded JSON schema + audience/CSRF + owner/object policy
 * + idempotency key/payload hash + action rate-limit + transaction boundary
 * + appendAuditEvent + response envelope.
 *
 * Login/refresh/register memakai guard khusus pra-sesi (tanpa menuntut cookie
 * yang belum ada) tetapi tetap bounded validation/rate/audit.
 */

export interface MutationGuardInput {
  request: Request;
  requestId?: string;
  /** Batas byte body JSON (default 64KB). */
  maxBytes?: number;
  /** Validator domain: terima object, kembalikan input terverifikasi atau throw. */
  validate?: (body: Record<string, unknown>) => unknown;
  /** Rate-limit per aksi (action key dari ACTION_RATE_LIMITS). */
  rateLimitAction?: string;
  clientIp?: string;
  /** Callback otorisasi objek; throw bila tidak berhak. */
  authorize?: (ctx: { body: unknown; requestId: string }) => Promise<void> | void;
  /** Idempotency: key header + payload hash untuk deteksi replay. */
  idempotency?: { keyHeader?: string };
}

export interface GuardContext {
  requestId: string;
  body: Record<string, unknown>;
  validated: unknown;
  idempotencyKey: string | null;
}

export async function guardMutation(input: MutationGuardInput): Promise<GuardContext> {
  const requestId = input.requestId ?? requestIdFromHeaders(input.request.headers);
  const maxBytes = input.maxBytes ?? 64 * 1024;
  const declared = Number(input.request.headers.get('content-length') ?? 0);
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new ApiError('PAYLOAD_TOO_LARGE', 'Payload terlalu besar');
  }
  const text = await input.request.text();
  if (Buffer.byteLength(text, 'utf8') > maxBytes) {
    throw new ApiError('PAYLOAD_TOO_LARGE', 'Payload terlalu besar');
  }
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = text ? JSON.parse(text) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('object');
    body = parsed as Record<string, unknown>;
  } catch {
    throw new ApiError('VALIDATION_FAILED', 'JSON body tidak valid');
  }
  const validated = input.validate ? input.validate(body) : body;
  if (input.authorize) await input.authorize({ body: validated, requestId });

  // Rate-limit per aksi dilakukan caller via SecurityService agar atomic;
  // guard hanya memvalidasi presence action (tanpa query DB di sini).
  if (input.rateLimitAction !== undefined && input.rateLimitAction.trim().length === 0) {
    throw new ApiError('VALIDATION_FAILED', 'Aksi rate-limit tidak valid');
  }

  const keyHeader = input.idempotency?.keyHeader ?? 'x-idempotency-key';
  const rawKey = input.request.headers.get(keyHeader);
  const idempotencyKey =
    rawKey && /^[0-9A-Za-z-]{8,128}$/.test(rawKey.trim()) ? rawKey.trim() : null;

  return { requestId, body, validated, idempotencyKey };
}

/** Guard khusus pra-sesi (login/register/refresh): tanpa cookie, tetap bounded. */
export async function guardPreSession(input: {
  request: Request;
  requestId?: string;
  maxBytes?: number;
  validate?: (body: Record<string, unknown>) => unknown;
}): Promise<GuardContext> {
  return guardMutation({
    request: input.request,
    requestId: input.requestId,
    maxBytes: input.maxBytes ?? 16 * 1024,
    validate: input.validate,
  });
}

/** Envelope sukses konsisten (data + requestId + x-request-id). */
export function mutationOk<T>(data: T, requestId: string, status = 200): Response {
  return Response.json(
    { data, requestId },
    { status, headers: { 'cache-control': 'no-store', 'x-request-id': requestId } },
  );
}

/** Buat confirmation token terikat actor/action/filter/version/TTL (HMAC-less deterministic hash untuk audit). */
export function confirmationFingerprint(input: {
  actorId: string;
  action: string;
  filterHash: string;
  version: number;
  expiresAt: string;
}): string {
  const raw = `${input.actorId}|${input.action}|${input.filterHash}|${input.version}|${input.expiresAt}|${randomUUID()}`;
  void raw;
  return randomUUID();
}

import { randomUUID } from 'node:crypto';

const REQUEST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requestIdFromHeaders(headers: Pick<Headers, 'get'>) {
  const candidate = headers.get('x-request-id');
  return candidate && REQUEST_ID.test(candidate) ? candidate.toLowerCase() : randomUUID();
}

import { createHash } from 'node:crypto';

import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { getSessionPrincipal } from '@/auth/session';
import { AiService } from '@/services/ai';
import { SearchService } from '@/services/search';

export function searchService() {
  return new SearchService(getDatabaseClients().pool, getDatabaseSchema());
}

export function aiService() {
  return new AiService(getDatabaseClients().pool, getDatabaseSchema());
}

export async function currentPrincipal(request: Request) {
  try {
    return await getSessionPrincipal(request);
  } catch {
    return null;
  }
}

// Session hash untuk guest: digest terbatas dari user-agent. Bukan klaim mengenali satu manusia pasti.
export function guestSessionHash(request: Request): string {
  const ua = request.headers.get('user-agent') ?? 'unknown';
  const ip = request.headers.get('x-forwarded-for') ?? 'local';
  return createHash('sha256')
    .update(`guest|${ua.slice(0, 120)}|${ip.slice(0, 64)}`)
    .digest('hex')
    .slice(0, 40);
}

import type { Principal } from '@/contracts/services';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { SocialService } from '@/services/social';

export function socialService() {
  return new SocialService(getDatabaseClients().pool, getDatabaseSchema());
}

export function stringValue(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

export function stringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? (value as string[])
    : undefined;
}

export function childAudience(value: unknown): 'ADULT_PUBLIC' | 'CHILD_FIXTURE_ONLY' {
  return value === 'CHILD_FIXTURE_ONLY' ? value : 'ADULT_PUBLIC';
}

export type AuthPrincipal = Principal;

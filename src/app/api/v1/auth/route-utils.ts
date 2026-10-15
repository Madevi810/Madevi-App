import { requiredText } from '@/api/validation';
import { AccountsService } from '@/services/accounts';
import { getDatabaseClients } from '@/db/client';

export function accountsService() {
  return new AccountsService(getDatabaseClients().pool);
}

export function bodyText(body: Record<string, unknown>, field: string, maximum = 4000) {
  return requiredText(body[field], field, { maximum });
}

export function optionalBodyText(body: Record<string, unknown>, field: string) {
  const value = body[field];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

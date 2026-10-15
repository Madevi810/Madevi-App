import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { ModerationService } from '@/services/moderation';

export function moderationService() {
  return new ModerationService(getDatabaseClients().pool, getDatabaseSchema());
}

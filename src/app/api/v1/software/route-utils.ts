import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { SoftwareService } from '@/services/software';

export function softwareService() {
  return new SoftwareService(getDatabaseClients().pool, getDatabaseSchema());
}

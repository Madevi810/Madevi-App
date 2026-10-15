import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { DuelService } from '@/services/duel';
import { PetitionService } from '@/services/petition';

export function duelService() {
  return new DuelService(getDatabaseClients().pool, getDatabaseSchema());
}

export function petitionService() {
  return new PetitionService(getDatabaseClients().pool, getDatabaseSchema());
}

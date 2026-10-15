import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { KindnessService } from '@/services/kindness';
import { StoryService } from '@/services/story';
import { ListenService } from '@/services/listen';
import { DuelService } from '@/services/duel';
import { SidangService } from '@/services/sidang';
import { ClinicService } from '@/services/clinic';
import { LineageService } from '@/services/lineage';
import { PetitionService } from '@/services/petition';

export function kindnessService() {
  return new KindnessService(getDatabaseClients().pool, getDatabaseSchema());
}

export function storyService() {
  return new StoryService(getDatabaseClients().pool, getDatabaseSchema());
}

export function listenService() {
  return new ListenService(getDatabaseClients().pool, getDatabaseSchema());
}

export function duelService() {
  return new DuelService(getDatabaseClients().pool, getDatabaseSchema());
}

export function sidangService() {
  return new SidangService(getDatabaseClients().pool, getDatabaseSchema());
}

export function clinicService() {
  return new ClinicService(getDatabaseClients().pool, getDatabaseSchema());
}

export function lineageService() {
  return new LineageService(getDatabaseClients().pool, getDatabaseSchema());
}

export function petitionService() {
  return new PetitionService(getDatabaseClients().pool, getDatabaseSchema());
}

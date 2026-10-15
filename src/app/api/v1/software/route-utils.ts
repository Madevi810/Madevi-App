import type { ScannerAdapter } from '@/contracts/services';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { SoftwareService } from '@/services/software';
import { LocalModerationEngine } from '@/services/moderation';

const headerScanner = new LocalModerationEngine();
const scanner: ScannerAdapter = {
  mode: 'REAL_LOCAL',
  async scan(input: unknown) {
    if (!input || typeof input !== 'object') {
      return {
        status: 'UNSAFE',
        report: { reason: 'Input scanner tidak valid', failClosed: true },
      };
    }
    const value = input as { bytes?: Uint8Array; mediaType?: string; declaredSizeBytes?: number };
    if (!(value.bytes instanceof Uint8Array)) {
      return {
        status: 'UNSAFE',
        report: { reason: 'Byte penuh wajib tersedia', failClosed: true },
      };
    }
    const result = await headerScanner.assess({
      objectId: 'software-scan',
      relativePath: 'virtual/software-scan',
      bytes: value.bytes,
      mediaType: value.mediaType,
      declaredSizeBytes: value.declaredSizeBytes,
    });
    return {
      status: result.status === 'SAFE' ? 'SAFE' : 'UNSAFE',
      report: { ...result, mode: 'REAL_LOCAL', failClosed: result.status !== 'SAFE' },
    };
  },
};

export function softwareService() {
  return new SoftwareService(getDatabaseClients().pool, getDatabaseSchema(), scanner);
}

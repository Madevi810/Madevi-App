import { ApiError } from '@/api/errors';

/**
 * Helper server-side untuk Mode Simulasi.
 *
 * Prinsip (selaras GUARDRAIL Madevi-Control):
 * - Setiap keberhasilan simulasi tercatat dan ditampilkan sebagai SIMULASI.
 * - Tidak ada klaim transaksi nyata, token asli pihak ketiga, atau email
 *   yang benar-benar terkirim.
 * - Mekanisme internal tetap nyata: validasi, state transition, dan catatan
 *   database berjalan seperti alur aslinya.
 *
 * Mode dapat dimatikan total via env: MADEVI_SIMULATION_MODE=false
 * (default: aktif, karena Madevi berjalan 100% lokal).
 */
export function isSimulationEnabled(): boolean {
  return process.env.MADEVI_SIMULATION_MODE !== 'false';
}

export function assertSimulationEnabled(): void {
  if (!isSimulationEnabled()) {
    throw new ApiError(
      'DEPENDENCY_UNAVAILABLE',
      'Mode Simulasi dimatikan oleh konfigurasi server',
    );
  }
}

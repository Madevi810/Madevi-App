/**
 * Mesin simulasi terpusat (Fase A3).
 *
 * Satu lapisan untuk data dan perilaku dummy: akun, sesi, pesanan/brief jasa,
 * progres belajar, pesan, notifikasi, berkas. Status tersimpan nyata di database
 * sehingga alur bisa diulang dan konsisten antar halaman.
 *
 * Prinsip:
 * - Semua yang keluar dari sini BERLABEL 'Simulasi' — jujur, tidak menyesatkan.
 * - Mekanisme internal nyata: validasi, state transition, jejak database.
 * - Tidak ada panggilan ke layanan eksternal nyata.
 */
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query<T>(text: string, params: unknown[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}

export type SimulationScope =
  | 'otp'
  | 'payment'
  | 'order'
  | 'learning'
  | 'message'
  | 'notification'
  | 'file'
  | 'session';

export const SIMULATION_LABEL = 'Simulasi';

export interface SimulationRecord {
  id: string;
  scope: SimulationScope;
  key: string;
  state: Record<string, unknown>;
  label: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

function toRecord(row: Record<string, unknown>): SimulationRecord {
  return {
    id: String(row.id),
    scope: row.scope as SimulationScope,
    key: String(row.key),
    state: (row.state as Record<string, unknown>) ?? {},
    label: String(row.label ?? SIMULATION_LABEL),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    expiresAt: row.expires_at ? String(row.expires_at) : null,
  };
}

export async function getSimulationState(
  scope: SimulationScope,
  key: string,
): Promise<SimulationRecord | null> {
  const rows = await query<Record<string, unknown>>(
    `SELECT * FROM simulation_states
     WHERE scope = $1 AND key = $2
       AND (expires_at IS NULL OR expires_at > now())
     LIMIT 1`,
    [scope, key],
  );
  return rows.length > 0 ? toRecord(rows[0]) : null;
}

export async function setSimulationState(
  scope: SimulationScope,
  key: string,
  state: Record<string, unknown>,
  expiresInMinutes?: number,
): Promise<SimulationRecord> {
  const expiresClause =
    expiresInMinutes !== undefined
      ? `now() + ($3 || ' minutes')::interval`
      : 'NULL';
  const params =
    expiresInMinutes !== undefined
      ? [scope, key, JSON.stringify(state), SIMULATION_LABEL, String(expiresInMinutes)]
      : [scope, key, JSON.stringify(state), SIMULATION_LABEL];

  const rows = await query<Record<string, unknown>>(
    `INSERT INTO simulation_states (scope, key, state, label, expires_at)
     VALUES ($1, $2, $3::jsonb, $4, ${expiresClause})
     ON CONFLICT (scope, key)
     DO UPDATE SET
       state = EXCLUDED.state,
       updated_at = now(),
       expires_at = EXCLUDED.expires_at
     RETURNING *`,
    params,
  );
  return toRecord(rows[0]);
}

export async function deleteSimulationState(
  scope: SimulationScope,
  key: string,
): Promise<void> {
  await query('DELETE FROM simulation_states WHERE scope = $1 AND key = $2', [scope, key]);
}

/**
 * OTP simulasi: kode 6 digit, kedaluwarsa 5 menit.
 * Kode tampil di "kotak pesan simulasi", bukan SMS nyata.
 */
export async function buatOtpSimulasi(userKey: string): Promise<{ kode: string; kedaluwarsaMenit: number }> {
  const kode = String(Math.floor(100000 + Math.random() * 900000));
  await setSimulationState('otp', userKey, { kode, percobaan: 0 }, 5);
  return { kode, kedaluwarsaMenit: 5 };
}

export async function verifikasiOtpSimulasi(
  userKey: string,
  kodeInput: string,
): Promise<{ valid: boolean; alasan?: string }> {
  const rec = await getSimulationState('otp', userKey);
  if (!rec) {
    return { valid: false, alasan: 'Kode kedaluwarsa atau belum diminta. Minta kode baru.' };
  }
  const state = rec.state as { kode: string; percobaan: number };
  if (state.kode === kodeInput.trim()) {
    await deleteSimulationState('otp', userKey);
    return { valid: true };
  }
  const percobaan = (state.percobaan ?? 0) + 1;
  await setSimulationState('otp', userKey, { kode: state.kode, percobaan }, 5);
  if (percobaan >= 5) {
    await deleteSimulationState('otp', userKey);
    return { valid: false, alasan: 'Terlalu banyak percobaan. Minta kode baru.' };
  }
  return { valid: false, alasan: `Kode salah. Sisa percobaan: ${5 - percobaan}.` };
}

/**
 * Pembayaran simulasi: menunggu → berhasil/gagal dengan alasan.
 */
export type StatusPembayaranSimulasi = 'menunggu' | 'berhasil' | 'gagal' | 'kedaluwarsa';

export async function buatPembayaranSimulasi(
  orderKey: string,
  jumlah: number,
): Promise<SimulationRecord> {
  return setSimulationState('payment', orderKey, {
    jumlah,
    status: 'menunggu' as StatusPembayaranSimulasi,
    metode: 'simulasi',
  }, 60);
}

export async function prosesPembayaranSimulasi(
  orderKey: string,
  berhasil: boolean,
  alasan?: string,
): Promise<SimulationRecord> {
  const rec = await getSimulationState('payment', orderKey);
  const state = (rec?.state ?? {}) as Record<string, unknown>;
  return setSimulationState('payment', orderKey, {
    ...state,
    status: (berhasil ? 'berhasil' : 'gagal') as StatusPembayaranSimulasi,
    alasan: alasan ?? null,
    diprosesPada: new Date().toISOString(),
  });
}

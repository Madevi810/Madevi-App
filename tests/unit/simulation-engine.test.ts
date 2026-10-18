import { describe, it, expect, vi } from 'vitest';

vi.mock('pg', () => {
  const store = new Map<string, Record<string, unknown>>();
  return {
    Pool: class {
      async connect() {
        return {
          async query(text: string, params: unknown[]) {
            if (text.includes('SELECT * FROM simulation_states')) {
              const key = `${params[0]}:${params[1]}`;
              const row = store.get(key);
              return { rows: row ? [row] : [] };
            }
            if (text.includes('INSERT INTO simulation_states')) {
              const key = `${params[0]}:${params[1]}`;
              const row = {
                id: 'test-id',
                scope: params[0],
                key: params[1],
                state: JSON.parse(String(params[2])),
                label: 'Simulasi',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                expires_at: null,
              };
              store.set(key, row);
              return { rows: [row] };
            }
            if (text.includes('DELETE FROM simulation_states')) {
              const key = `${params[0]}:${params[1]}`;
              store.delete(key);
              return { rows: [] };
            }
            return { rows: [] };
          },
          release() {},
        };
      }
    },
  };
});

import {
  setSimulationState,
  getSimulationState,
  buatOtpSimulasi,
  verifikasiOtpSimulasi,
  buatPembayaranSimulasi,
  prosesPembayaranSimulasi,
  SIMULATION_LABEL,
} from '@/services/simulation-engine';

describe('mesin simulasi', () => {
  it('label selalu Simulasi', () => {
    expect(SIMULATION_LABEL).toBe('Simulasi');
  });

  it('set dan get state', async () => {
    await setSimulationState('session', 'user-1', { nama: 'Budi' });
    const rec = await getSimulationState('session', 'user-1');
    expect(rec?.state).toMatchObject({ nama: 'Budi' });
    expect(rec?.label).toBe('Simulasi');
  });

  it('OTP: buat lalu verifikasi benar', async () => {
    const { kode } = await buatOtpSimulasi('user-otp-1');
    expect(kode).toMatch(/^\d{6}$/);
    const hasil = await verifikasiOtpSimulasi('user-otp-1', kode);
    expect(hasil.valid).toBe(true);
  });

  it('OTP: kode salah ditolak', async () => {
    await buatOtpSimulasi('user-otp-2');
    const hasil = await verifikasiOtpSimulasi('user-otp-2', '000000');
    expect(hasil.valid).toBe(false);
    expect(hasil.alasan).toContain('Sisa percobaan');
  });

  it('pembayaran: menunggu → berhasil', async () => {
    await buatPembayaranSimulasi('order-1', 50000);
    const awal = await getSimulationState('payment', 'order-1');
    expect((awal?.state as { status: string }).status).toBe('menunggu');

    await prosesPembayaranSimulasi('order-1', true);
    const akhir = await getSimulationState('payment', 'order-1');
    expect((akhir?.state as { status: string }).status).toBe('berhasil');
  });

  it('pembayaran: gagal dengan alasan', async () => {
    await buatPembayaranSimulasi('order-2', 25000);
    await prosesPembayaranSimulasi('order-2', false, 'Saldo tidak cukup');
    const rec = await getSimulationState('payment', 'order-2');
    const state = rec?.state as { status: string; alasan: string };
    expect(state.status).toBe('gagal');
    expect(state.alasan).toBe('Saldo tidak cukup');
  });
});

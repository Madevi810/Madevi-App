/**
 * Konstanta Mode Simulasi — aman dipakai di client maupun server.
 *
 * Mode Simulasi adalah pengganti jujur untuk layanan yang membutuhkan
 * koneksi online (payment gateway, provider OAuth, SMTP). Setiap
 * keberhasilan simulasi wajib ditampilkan dan tercatat sebagai SIMULASI.
 */

/** Metode pembayaran tiruan yang didukung. */
export const SIMULATED_PAYMENT_METHODS = [
  'TRANSFER_BANK',
  'E_WALLET',
  'QRIS',
  'GERAI',
] as const;
export type SimulatedPaymentMethod = (typeof SIMULATED_PAYMENT_METHODS)[number];

export const SIMULATED_PAYMENT_METHOD_LABELS: Record<SimulatedPaymentMethod, string> = {
  TRANSFER_BANK: 'Transfer Bank (Simulasi)',
  E_WALLET: 'E-Wallet (Simulasi)',
  QRIS: 'QRIS (Simulasi)',
  GERAI: 'Gerai Ritel (Simulasi)',
};

export function isSimulatedPaymentMethod(value: unknown): value is SimulatedPaymentMethod {
  return (
    typeof value === 'string' &&
    (SIMULATED_PAYMENT_METHODS as readonly string[]).includes(value)
  );
}

/** Provider OAuth tiruan yang didukung. */
export const SIMULATED_OAUTH_PROVIDERS = ['google', 'github'] as const;
export type SimulatedOAuthProvider = (typeof SIMULATED_OAUTH_PROVIDERS)[number];

export const SIMULATED_OAUTH_PROVIDER_LABELS: Record<SimulatedOAuthProvider, string> = {
  google: 'Google (Simulasi)',
  github: 'GitHub (Simulasi)',
};

export function isSimulatedOAuthProvider(value: unknown): value is SimulatedOAuthProvider {
  return (
    typeof value === 'string' &&
    (SIMULATED_OAUTH_PROVIDERS as readonly string[]).includes(value)
  );
}

/** Label baku yang wajib tampil di setiap UI/retur simulasi. */
export const SIMULATION_BADGE = 'SIMULASI';

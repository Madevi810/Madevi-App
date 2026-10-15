/**
 * Zona Tenang (INOVASI-20261014-0841 IDE 1) — helper pure function.
 *
 * Tujuan: mode baca anti-engagement. Feed tenang = kronologis murni, tanpa angka.
 *
 * Preferensi:
 *  - user login  → disimpan di ui_preferences (JSONB) via AccountsService
 *  - tamu        → localStorage 'madevi_calm_mode' + label jujur "hanya di perangkat ini"
 *
 * Semua helper di sini PURE agar dapat diuji unit test tanpa runtime.
 */

export const CALM_MODE_STORAGE_KEY = 'madevi_calm_mode';

/** Slot ui_preferences tempat flag Zona Tenang disimpan (user login). */
export const CALM_MODE_PREFERENCE_KEY = 'calmMode';

/** Label netral pengganti counter "N orang mengirim semangat". */
export function calmSupportLabel(isId: boolean): string {
  return isId ? 'Ada dukungan untuk postingan ini' : 'This post has support';
}

/**
 * Baca preferensi Zona Tenang dari ui_preferences (JSONB principals).
 * Validasi ketat: hanya menerima boolean; nilai lain diabaikan.
 */
export function readCalmModeFromPreferences(
  uiPreferences: unknown,
): boolean | null {
  if (!uiPreferences || typeof uiPreferences !== 'object') return null;
  const record = uiPreferences as Record<string, unknown>;
  const value = record[CALM_MODE_PREFERENCE_KEY];
  return typeof value === 'boolean' ? value : null;
}

/**
 * Gabungkan preferensi server (user login) dengan localStorage (tamu).
 * Prioritas: preferensi server bila user login (authId != null);
 * selain itu localStorage. null = belum ada preferensi tersimpan.
 */
export function resolveCalmMode(input: {
  serverPreference: boolean | null;
  localStorageValue: string | null;
  isAuthenticated: boolean;
}): boolean {
  if (input.isAuthenticated) {
    return input.serverPreference === true;
  }
  return input.localStorageValue === 'true';
}

/**
 * Serialisasi aman untuk localStorage (SSR-safe: window hanya disentuh
 * secara eksplisit oleh pemanggil, bukan di sini).
 */
export function serializeCalmMode(enabled: boolean): string {
  return enabled ? 'true' : 'false';
}

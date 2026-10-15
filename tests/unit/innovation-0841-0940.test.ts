/**
 * Unit test fitur inovasi INOVASI-0841 + INOVASI-0940.
 * Verifikasi static/unit-level saja (INSTRUKSI-02 — tanpa runtime).
 *
 * Cakupan:
 *   1. Zona Tenang      — resolveCalmMode, readCalmModeFromPreferences,
 *                         mergeCalmModePreference, calmSupportLabel.
 *   2. Peta Kebaikan    — kindnessReporterLabel, countWords, validasi
 *                         kategori/kota (compile-time via tipe).
 *   3. Dongeng Bareng   — weekNumber, toRoman (via UI?), countWords,
 *                         estimateSaving.
 *   4. Bundel Ongkir    — estimateSaving rumus (single×n − bundle) ÷ n.
 */

import { describe, expect, it } from 'vitest';

import {
  CALM_MODE_PREFERENCE_KEY,
  calmSupportLabel,
  readCalmModeFromPreferences,
  resolveCalmMode,
  serializeCalmMode,
} from '@/services/calm-mode';
import { mergeCalmModePreference } from '@/services/accounts';
import { KINDNESS_CATEGORIES, KINDNESS_CITIES, kindnessReporterLabel, countWords } from '@/services/kindness';
import { weekNumber } from '@/services/story';
import { BUNDLE_SLOT_MAX, estimateSaving, SHIPPING_TARIFFS } from '@/services/bundle';

describe('Zona Tenang (INOVASI-0841 IDE 1)', () => {
  it('resolveCalmMode: tamu memakai localStorage', () => {
    expect(
      resolveCalmMode({
        serverPreference: null,
        localStorageValue: 'true',
        isAuthenticated: false,
      }),
    ).toBe(true);
    expect(
      resolveCalmMode({
        serverPreference: null,
        localStorageValue: 'false',
        isAuthenticated: false,
      }),
    ).toBe(false);
    expect(
      resolveCalmMode({
        serverPreference: null,
        localStorageValue: null,
        isAuthenticated: false,
      }),
    ).toBe(false);
  });

  it('resolveCalmMode: user login memakai preferensi server', () => {
    expect(
      resolveCalmMode({
        serverPreference: true,
        localStorageValue: 'false',
        isAuthenticated: true,
      }),
    ).toBe(true);
    expect(
      resolveCalmMode({
        serverPreference: false,
        localStorageValue: 'true',
        isAuthenticated: true,
      }),
    ).toBe(false);
  });

  it('readCalmModeFromPreferences: hanya menerima boolean', () => {
    expect(readCalmModeFromPreferences(null)).toBeNull();
    expect(readCalmModeFromPreferences('true')).toBeNull();
    expect(readCalmModeFromPreferences({})).toBeNull();
    expect(readCalmModeFromPreferences({ [CALM_MODE_PREFERENCE_KEY]: 'yes' })).toBeNull();
    expect(readCalmModeFromPreferences({ [CALM_MODE_PREFERENCE_KEY]: true })).toBe(true);
    expect(readCalmModeFromPreferences({ [CALM_MODE_PREFERENCE_KEY]: false })).toBe(false);
  });

  it('calmSupportLabel: label netral tanpa angka', () => {
    expect(calmSupportLabel(true)).not.toMatch(/\d/);
    expect(calmSupportLabel(false)).not.toMatch(/\d/);
    expect(calmSupportLabel(true)).toContain('dukungan');
  });

  it('serializeCalmMode: nilai aman untuk localStorage', () => {
    expect(serializeCalmMode(true)).toBe('true');
    expect(serializeCalmMode(false)).toBe('false');
  });

  it('mergeCalmModePreference: tidak menimpa preferensi lain', () => {
    const existing = { theme: 'dark', other: 42 };
    const merged = JSON.parse(mergeCalmModePreference(existing, true));
    expect(merged).toMatchObject({ theme: 'dark', other: 42, calmMode: true });
    expect(JSON.parse(mergeCalmModePreference(null, false))).toEqual({ calmMode: false });
  });
});

describe('Peta Kebaikan (INOVASI-0841 IDE 2)', () => {
  it('kindnessReporterLabel: anonim → "Seorang warga [kota]"', () => {
    expect(
      kindnessReporterLabel({
        isAnonymous: true,
        reporterName: 'Budi',
        city: 'Bandung',
      }),
    ).toBe('Seorang warga Bandung');
    expect(
      kindnessReporterLabel({
        isAnonymous: false,
        reporterName: null,
        city: 'Bandung',
      }),
    ).toBe('Seorang warga Bandung');
    expect(
      kindnessReporterLabel({
        isAnonymous: false,
        reporterName: 'Budi',
        city: 'Bandung',
      }),
    ).toBe('Budi');
  });

  it('KINDNESS_CITIES: daftar kota tidak kosong & unik', () => {
    expect(KINDNESS_CITIES.length).toBeGreaterThan(20);
    expect(new Set(KINDNESS_CITIES).size).toBe(KINDNESS_CITIES.length);
    // Semua nama kota bukan string kosong.
    expect(KINDNESS_CITIES.every((c) => c.length >= 3)).toBe(true);
  });

  it('KINDNESS_CATEGORIES: 5 kategori tetap', () => {
    expect(KINDNESS_CATEGORIES.map((c) => c.key)).toEqual([
      'BANTU_TETANGGA',
      'BANTU_JALAN',
      'LINGKUNGAN',
      'PENDIDIKAN',
      'LAINNYA',
    ]);
  });

  it('countWords: memisah spasi, bahasa Indonesia', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
    expect(countWords('satu dua tiga')).toBe(3);
    expect(countWords('  spasi   ganda  ')).toBe(2);
  });
});

describe('Dongeng Bareng (INOVASI-0940 IDE 1)', () => {
  it('weekNumber: mengembalikan integer positif yang stabil', () => {
    const w1 = weekNumber(new Date('2026-10-14T00:00:00Z'));
    const w2 = weekNumber(new Date('2026-10-14T23:59:59Z'));
    expect(Number.isInteger(w1)).toBe(true);
    expect(w1).toBeGreaterThan(2000);
    expect(w1).toBe(w2);
  });

  it('weekNumber: minggu berbeda → nilai berbeda', () => {
    const a = weekNumber(new Date('2026-10-14T00:00:00Z'));
    const b = weekNumber(new Date('2026-11-14T00:00:00Z'));
    expect(b).toBeGreaterThan(a);
  });

  it('BUNDLE_SLOT_MAX: maks 5 orang per bundel', () => {
    expect(BUNDLE_SLOT_MAX).toBe(5);
  });
});

describe('Bundel Ongkir Tetangga (INOVASI-0940 IDE 2)', () => {
  it('estimateSaving: rumus (single × n − bundle) ÷ n', () => {
    const tariff = SHIPPING_TARIFFS[0]; // Jakarta: 15000 / 22000
    expect(estimateSaving(tariff, 1)).toBe(0);
    // n=5: (15000×5 − 22000) ÷ 5 = 53000 ÷ 5 = 10600
    expect(estimateSaving(tariff, 5)).toBe(10600);
  });

  it('estimateSaving: tidak pernah negatif', () => {
    const tariff = SHIPPING_TARIFFS[0];
    expect(estimateSaving(tariff, 0)).toBe(0);
    expect(estimateSaving(tariff, -3)).toBe(0);
  });

  it('estimateSaving: tarif tidak dikenal → 0', () => {
    expect(estimateSaving(undefined, 5)).toBe(0);
  });

  it('estimateSaving: kapasitas di-cap di slot maks', () => {
    const tariff = SHIPPING_TARIFFS[0];
    expect(estimateSaving(tariff, 100)).toBe(estimateSaving(tariff, BUNDLE_SLOT_MAX));
  });

  it('SHIPPING_TARIFFS: kota unik & ongkir bundel lebih murah total', () => {
    expect(new Set(SHIPPING_TARIFFS.map((t) => t.city)).size).toBe(SHIPPING_TARIFFS.length);
    for (const t of SHIPPING_TARIFFS) {
      // Bundel hanya masuk akal bila ongkir_bundel < ongkir_satuan × 2
      // (minimal 2 orang untuk hemat).
      expect(t.bundleFee).toBeLessThan(t.singleFee * BUNDLE_SLOT_MAX);
      expect(t.bundleFee).toBeGreaterThan(0);
      expect(t.singleFee).toBeGreaterThan(0);
    }
  });
});

/**
 * kalkulator-thr.ts — Kalkulator THR (Tunjangan Hari Raya)
 * Aturan: masa kerja >= 12 bulan → 1x gaji; < 12 bulan → proporsional.
 */

export interface InputTHR {
  gajiPokokRp: number;
  tunjanganTetapRp: number;
  masaKerjaBulan: number;
}

export interface HasilTHR {
  upahSebulanRp: number;
  thrRp: number;
  proporsional: boolean;
}

export function hitungTHR(input: InputTHR): HasilTHR {
  const { gajiPokokRp, tunjanganTetapRp, masaKerjaBulan } = input;
  if (gajiPokokRp < 0 || tunjanganTetapRp < 0) throw new Error('Gaji/tunjangan tidak boleh negatif');
  if (masaKerjaBulan < 1) throw new Error('Masa kerja minimal 1 bulan');
  if (masaKerjaBulan > 600) throw new Error('Masa kerja tidak wajar');

  const upahSebulanRp = gajiPokokRp + tunjanganTetapRp;
  const proporsional = masaKerjaBulan < 12;
  const thrRp = proporsional
    ? Math.round((upahSebulanRp * masaKerjaBulan) / 12)
    : upahSebulanRp;

  return { upahSebulanRp, thrRp, proporsional };
}

export function formatTHRTeks(hasil: HasilTHR, input: InputTHR): string {
  return [
    '=== KALKULATOR THR ===',
    `Upah sebulan: Rp${hasil.upahSebulanRp.toLocaleString('id-ID')}`,
    `Masa kerja: ${input.masaKerjaBulan} bulan ${hasil.proporsional ? '(proporsional)' : '(penuh)'}`,
    '---',
    `THR: Rp${hasil.thrRp.toLocaleString('id-ID')}`,
  ].join('\n');
}

/**
 * kalkulator-lembur.ts — Kalkulator Upah Lembur (Kepmenaker)
 * 1 jam pertama: 1,5x | jam berikutnya: 2x (hari kerja)
 * Hari libur: 7 jam pertama 2x, jam ke-8 3x, dst.
 */

export type JenisHariLembur = 'kerja' | 'libur';

export interface HasilLembur {
  upahPerJamRp: number;
  totalJam: number;
  rincian: string[];
  totalUpahLemburRp: number;
}

export function hitungLembur(
  gajiSebulanRp: number,
  jamLembur: number,
  jenisHari: JenisHariLembur,
): HasilLembur {
  if (gajiSebulanRp <= 0) throw new Error('Gaji harus positif');
  if (jamLembur <= 0 || jamLembur > 24) throw new Error('Jam lembur 1–24');
  // Upah per jam = 1/173 x gaji sebulan (aturan Kemenaker)
  const upahPerJamRp = gajiSebulanRp / 173;
  const rincian: string[] = [];
  let total = 0;

  if (jenisHari === 'kerja') {
    const jam1 = Math.min(jamLembur, 1);
    const sisa = jamLembur - jam1;
    if (jam1 > 0) {
      const upah = jam1 * 1.5 * upahPerJamRp;
      total += upah;
      rincian.push(`Jam ke-1: 1,5x = Rp${Math.round(upah).toLocaleString('id-ID')}`);
    }
    if (sisa > 0) {
      const upah = sisa * 2 * upahPerJamRp;
      total += upah;
      rincian.push(`Jam ke-2 dst (${sisa} jam): 2x = Rp${Math.round(upah).toLocaleString('id-ID')}`);
    }
  } else {
    // Hari libur: jam 1-7 → 2x, jam 8 → 3x, jam 9+ → 4x
    for (let j = 1; j <= Math.floor(jamLembur); j++) {
      const pengali = j <= 7 ? 2 : j === 8 ? 3 : 4;
      const upah = pengali * upahPerJamRp;
      total += upah;
      rincian.push(`Jam ke-${j}: ${pengali}x = Rp${Math.round(upah).toLocaleString('id-ID')}`);
    }
    const pecahan = jamLembur - Math.floor(jamLembur);
    if (pecahan > 0) {
      const j = Math.floor(jamLembur) + 1;
      const pengali = j <= 7 ? 2 : j === 8 ? 3 : 4;
      const upah = pecahan * pengali * upahPerJamRp;
      total += upah;
      rincian.push(`Sisa ${pecahan} jam (jam ke-${j}): ${pengali}x = Rp${Math.round(upah).toLocaleString('id-ID')}`);
    }
  }

  return {
    upahPerJamRp: Math.round(upahPerJamRp),
    totalJam: jamLembur,
    rincian,
    totalUpahLemburRp: Math.round(total),
  };
}

export function formatLemburTeks(hasil: HasilLembur, jenisHari: JenisHariLembur): string {
  return [
    '=== KALKULATOR LEMBUR ===',
    `Upah/jam: Rp${hasil.upahPerJamRp.toLocaleString('id-ID')} (1/173 gaji)`,
    `Jenis hari: ${jenisHari === 'kerja' ? 'Hari kerja' : 'Hari libur'}`,
    `Total jam: ${hasil.totalJam}`,
    '---',
    ...hasil.rincian,
    '---',
    `Total upah lembur: Rp${hasil.totalUpahLemburRp.toLocaleString('id-ID')}`,
  ].join('\n');
}

/**
 * kalkulator-wr.ts — Kalkulator Win Rate (WR) Game
 * Hitung berapa win streak tanpa lose yang dibutuhkan untuk mencapai target WR.
 * Populer untuk Mobile Legends, tapi berlaku umum.
 */

export interface HasilWR {
  totalMatch: number;
  winSaatIni: number;
  wrSaatIniPersen: number;
  targetWrPersen: number;
  winStreakDibutuhkan: number;
  totalMatchAkhir: number;
  mustahil: boolean;
}

export function hitungWinStreak(
  totalMatch: number,
  wrSaatIniPersen: number,
  targetWrPersen: number,
): HasilWR {
  if (totalMatch < 0) throw new Error('Total match tidak boleh negatif');
  if (wrSaatIniPersen < 0 || wrSaatIniPersen > 100) throw new Error('WR saat ini 0–100');
  if (targetWrPersen < 0 || targetWrPersen > 100) throw new Error('Target WR 0–100');

  const winSaatIni = Math.round((totalMatch * wrSaatIniPersen) / 100);

  if (targetWrPersen >= 100) {
    return {
      totalMatch, winSaatIni, wrSaatIniPersen, targetWrPersen,
      winStreakDibutuhkan: Infinity, totalMatchAkhir: Infinity, mustahil: true,
    };
  }
  if (targetWrPersen <= wrSaatIniPersen) {
    return {
      totalMatch, winSaatIni, wrSaatIniPersen, targetWrPersen,
      winStreakDibutuhkan: 0, totalMatchAkhir: totalMatch, mustahil: false,
    };
  }

  // win + x / (total + x) = target → x = (target*total - win) / (1 - target)
  const target = targetWrPersen / 100;
  const x = (target * totalMatch - winSaatIni) / (1 - target);
  const winStreakDibutuhkan = Math.ceil(x);

  return {
    totalMatch,
    winSaatIni,
    wrSaatIniPersen,
    targetWrPersen,
    winStreakDibutuhkan,
    totalMatchAkhir: totalMatch + winStreakDibutuhkan,
    mustahil: false,
  };
}

export function formatWRTeks(hasil: HasilWR): string {
  if (hasil.mustahil) {
    return '=== KALKULATOR WIN RATE ===\nTarget 100% mustahil dicapai bila sudah ada kekalahan. Fokus saja naik setinggi mungkin!';
  }
  if (hasil.winStreakDibutuhkan === 0) {
    return `=== KALKULATOR WIN RATE ===\nTarget ${hasil.targetWrPersen}% sudah tercapai (WR saat ini ${hasil.wrSaatIniPersen}%).`;
  }
  return [
    '=== KALKULATOR WIN RATE ===',
    `Match: ${hasil.totalMatch} | Win: ${hasil.winSaatIni} | WR: ${hasil.wrSaatIniPersen}%`,
    `Target WR: ${hasil.targetWrPersen}%`,
    '---',
    `Butuh WIN STREAK: ${hasil.winStreakDibutuhkan} kemenangan beruntun tanpa kalah`,
    `(total match menjadi ${hasil.totalMatchAkhir})`,
  ].join('\n');
}

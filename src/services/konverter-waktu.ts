/**
 * konverter-waktu.ts — Konverter Waktu Dunia
 * Konversi waktu antar zona waktu (WIB, WITA, WIT, UTC, dan kota besar dunia).
 */

export const ZONA_WAKTU: Record<string, { labelId: string; offsetJam: number }> = {
  'WIB': { labelId: 'WIB (Jakarta, UTC+7)', offsetJam: 7 },
  'WITA': { labelId: 'WITA (Makassar, UTC+8)', offsetJam: 8 },
  'WIT': { labelId: 'WIT (Jayapura, UTC+9)', offsetJam: 9 },
  'UTC': { labelId: 'UTC', offsetJam: 0 },
  'Asia/Tokyo': { labelId: 'Tokyo (UTC+9)', offsetJam: 9 },
  'Asia/Singapore': { labelId: 'Singapura (UTC+8)', offsetJam: 8 },
  'Asia/Dubai': { labelId: 'Dubai (UTC+4)', offsetJam: 4 },
  'Europe/London': { labelId: 'London (UTC+0/+1)', offsetJam: 0 },
  'Europe/Paris': { labelId: 'Paris (UTC+1/+2)', offsetJam: 1 },
  'America/New_York': { labelId: 'New York (UTC-5/-4)', offsetJam: -5 },
  'America/Los_Angeles': { labelId: 'Los Angeles (UTC-8/-7)', offsetJam: -8 },
  'Australia/Sydney': { labelId: 'Sydney (UTC+10/+11)', offsetJam: 10 },
};

export interface HasilKonversiWaktu {
  waktuAsal: string;
  waktuTujuan: string;
  selisihJam: number;
}

/**
 * Konversi jam (0–23) dari zona asal ke zona tujuan.
 * Input waktu sebagai "HH:MM".
 */
export function konversiWaktu(
  jamMenit: string,
  zonaAsal: string,
  zonaTujuan: string,
): HasilKonversiWaktu {
  const zonaA = ZONA_WAKTU[zonaAsal];
  const zonaB = ZONA_WAKTU[zonaTujuan];
  if (!zonaA) throw new Error(`Zona asal tidak dikenal: ${zonaAsal}`);
  if (!zonaB) throw new Error(`Zona tujuan tidak dikenal: ${zonaTujuan}`);

  const cocok = jamMenit.match(/^(\d{1,2}):(\d{2})$/);
  if (!cocok) throw new Error('Format waktu harus HH:MM, contoh 14:30');
  const jam = Number(cocok[1]);
  const menit = Number(cocok[2]);
  if (jam > 23 || menit > 59) throw new Error('Jam/menit tidak valid');

  const totalMenitAsal = jam * 60 + menit;
  const selisihMenit = (zonaB.offsetJam - zonaA.offsetJam) * 60;
  let totalMenitTujuan = totalMenitAsal + selisihMenit;
  // Normalisasi ke 0–1439
  totalMenitTujuan = ((totalMenitTujuan % 1440) + 1440) % 1440;

  const jamT = Math.floor(totalMenitTujuan / 60);
  const menitT = totalMenitTujuan % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return {
    waktuAsal: `${pad(jam)}:${pad(menit)} ${zonaAsal}`,
    waktuTujuan: `${pad(jamT)}:${pad(menitT)} ${zonaTujuan}`,
    selisihJam: zonaB.offsetJam - zonaA.offsetJam,
  };
}

export function formatWaktuTeks(hasil: HasilKonversiWaktu): string {
  const arah = hasil.selisihJam >= 0 ? `+${hasil.selisihJam}` : `${hasil.selisihJam}`;
  return [
    '=== KONVERTER WAKTU DUNIA ===',
    `Dari  : ${hasil.waktuAsal}`,
    `Ke    : ${hasil.waktuTujuan}`,
    `Selisih: ${arah} jam`,
  ].join('\n');
}

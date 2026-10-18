/**
 * kalkulator-zakat.ts — Kalkulator Zakat Maal & Fitrah
 * Nisab emas 85 gram, tarif 2.5%.
 */

export const HARGA_EMAS_DEFAULT_RP_PER_GRAM = 1000000;

export interface InputZakatMaal {
  totalHartaRp: number;
  hargaEmasPerGramRp: number;
}

export interface HasilZakatMaal {
  nisabRp: number;
  wajibZakat: boolean;
  zakatRp: number;
}

export function hitungZakatMaal(input: InputZakatMaal): HasilZakatMaal {
  const { totalHartaRp, hargaEmasPerGramRp } = input;
  if (totalHartaRp < 0) throw new Error('Harta tidak boleh negatif');
  if (hargaEmasPerGramRp <= 0) throw new Error('Harga emas harus positif');

  const nisabRp = 85 * hargaEmasPerGramRp;
  const wajibZakat = totalHartaRp >= nisabRp;
  const zakatRp = wajibZakat ? Math.round(totalHartaRp * 0.025) : 0;

  return { nisabRp: Math.round(nisabRp), wajibZakat, zakatRp };
}

export function formatZakatMaalTeks(hasil: HasilZakatMaal): string {
  const lines = [
    '=== ZAKAT MAAL ===',
    `Nisab (85g emas): Rp${hasil.nisabRp.toLocaleString('id-ID')}`,
    `Status: ${hasil.wajibZakat ? 'WAJIB zakat' : 'BELUM wajib (harta di bawah nisab)'}`,
  ];
  if (hasil.wajibZakat) {
    lines.push(`Zakat 2,5%: Rp${hasil.zakatRp.toLocaleString('id-ID')}`);
  }
  return lines.join('\n');
}

// ---- Zakat Fitrah ----

export interface HasilZakatFitrah {
  jiwa: number;
  totalKg: number;
  totalRp: number;
}

export function hitungZakatFitrah(jiwa: number, hargaBerasPerKgRp: number): HasilZakatFitrah {
  if (jiwa < 1 || jiwa > 100) throw new Error('Jumlah jiwa 1–100');
  if (hargaBerasPerKgRp <= 0) throw new Error('Harga beras harus positif');
  const totalKg = Math.round(jiwa * 2.5 * 100) / 100;
  const totalRp = Math.round(totalKg * hargaBerasPerKgRp);
  return { jiwa, totalKg, totalRp };
}

/**
 * konverter-mata-uang.ts — Konverter Mata Uang (kurs statis, dapat diperbarui)
 * Kurs dasar terhadap IDR. Untuk estimasi cepat, bukan kurs real-time.
 */

export const KURS_TERHADAP_IDR: Record<string, { label: string; kurs: number }> = {
  IDR: { label: 'Rupiah Indonesia', kurs: 1 },
  USD: { label: 'Dolar AS', kurs: 15800 },
  EUR: { label: 'Euro', kurs: 17200 },
  GBP: { label: 'Pound Sterling', kurs: 20000 },
  JPY: { label: 'Yen Jepang', kurs: 105 },
  CNY: { label: 'Yuan China', kurs: 2180 },
  SGD: { label: 'Dolar Singapura', kurs: 11700 },
  MYR: { label: 'Ringgit Malaysia', kurs: 3350 },
  THB: { label: 'Baht Thailand', kurs: 440 },
  AUD: { label: 'Dolar Australia', kurs: 10200 },
  KRW: { label: 'Won Korea', kurs: 11.5 },
  SAR: { label: 'Riyal Arab Saudi', kurs: 4210 },
};

export interface HasilKonversiMataUang {
  dari: string;
  ke: string;
  jumlahAsal: number;
  jumlahTujuan: number;
  kursDipakai: number;
}

export function konversiMataUang(jumlah: number, dari: string, ke: string): HasilKonversiMataUang {
  const d = KURS_TERHADAP_IDR[dari.toUpperCase()];
  const k = KURS_TERHADAP_IDR[ke.toUpperCase()];
  if (!d) throw new Error(`Mata uang tidak dikenal: ${dari}`);
  if (!k) throw new Error(`Mata uang tidak dikenal: ${ke}`);
  if (jumlah < 0) throw new Error('Jumlah tidak boleh negatif');

  const dalamIdr = jumlah * d.kurs;
  const jumlahTujuan = dalamIdr / k.kurs;
  const kursDipakai = d.kurs / k.kurs;

  const bulat = (n: number) => Math.round(n * 100) / 100;
  return {
    dari: dari.toUpperCase(),
    ke: ke.toUpperCase(),
    jumlahAsal: jumlah,
    jumlahTujuan: bulat(jumlahTujuan),
    kursDipakai: bulat(kursDipakai),
  };
}

export function formatMataUangTeks(hasil: HasilKonversiMataUang): string {
  return [
    '=== KONVERTER MATA UANG ===',
    `${hasil.jumlahAsal.toLocaleString('id-ID')} ${hasil.dari} = ${hasil.jumlahTujuan.toLocaleString('id-ID')} ${hasil.ke}`,
    `Kurs: 1 ${hasil.dari} = ${hasil.kursDipakai} ${hasil.ke}`,
    '',
    'Catatan: kurs statis untuk estimasi. Cek kurs bank untuk transaksi nyata.',
  ].join('\n');
}

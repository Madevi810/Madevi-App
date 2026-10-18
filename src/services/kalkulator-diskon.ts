/**
 * kalkulator-diskon.ts — Kalkulator Diskon Bertingkat
 * Hitung harga setelah diskon tunggal maupun bertingkat (mis. 50% + 20%).
 */

export interface HasilDiskon {
  hargaAwalRp: number;
  diskonPersen: number[];
  totalDiskonRp: number;
  hargaAkhirRp: number;
  hematPersenEfektif: number;
  langkah: string[];
}

export function hitungDiskon(hargaAwalRp: number, diskonPersen: number[]): HasilDiskon {
  if (hargaAwalRp < 0) throw new Error('Harga tidak boleh negatif');
  if (diskonPersen.length === 0) throw new Error('Minimal satu diskon');
  for (const d of diskonPersen) {
    if (d < 0 || d > 100) throw new Error(`Diskon ${d}% tidak valid (0–100)`);
  }

  const langkah: string[] = [];
  let harga = hargaAwalRp;

  diskonPersen.forEach((d, i) => {
    const potongan = harga * (d / 100);
    harga -= potongan;
    langkah.push(`Diskon ${i + 1} (${d}%): -Rp${Math.round(potongan).toLocaleString('id-ID')} → Rp${Math.round(harga).toLocaleString('id-ID')}`);
  });

  const hargaAkhirRp = Math.round(harga);
  const totalDiskonRp = Math.round(hargaAwalRp - harga);
  const hematPersenEfektif = hargaAwalRp === 0 ? 0 : Math.round(((hargaAwalRp - harga) / hargaAwalRp) * 1000) / 10;

  return { hargaAwalRp, diskonPersen, totalDiskonRp, hargaAkhirRp, hematPersenEfektif, langkah };
}

export function formatDiskonTeks(hasil: HasilDiskon): string {
  return [
    '=== KALKULATOR DISKON ===',
    `Harga awal : Rp${hasil.hargaAwalRp.toLocaleString('id-ID')}`,
    `Diskon     : ${hasil.diskonPersen.map((d) => d + '%').join(' + ')}`,
    '---',
    ...hasil.langkah,
    '---',
    `Total hemat: Rp${hasil.totalDiskonRp.toLocaleString('id-ID')} (${hasil.hematPersenEfektif}% efektif)`,
    `Harga akhir: Rp${hasil.hargaAkhirRp.toLocaleString('id-ID')}`,
  ].join('\n');
}

/**
 * kalkulator-keuangan.ts — Kalkulator Cicilan & Keuangan
 * Menghitung cicilan pinjaman dengan metode flat dan anuitas.
 */

export type MetodeBunga = 'flat' | 'anuitas';

export interface InputCicilan {
  pokokRp: number;
  bungaTahunanPersen: number;
  tenorBulan: number;
  metode: MetodeBunga;
}

export interface HasilCicilan {
  cicilanPerBulanRp: number;
  totalBayarRp: number;
  totalBungaRp: number;
  langkah: string[];
}

export function hitungCicilan(input: InputCicilan): HasilCicilan {
  const { pokokRp, bungaTahunanPersen, tenorBulan, metode } = input;
  const langkah: string[] = [];

  if (pokokRp <= 0) throw new Error('Pokok pinjaman harus lebih dari 0');
  if (tenorBulan <= 0) throw new Error('Tenor harus lebih dari 0 bulan');
  if (bungaTahunanPersen < 0) throw new Error('Bunga tidak boleh negatif');

  const bungaBulanan = bungaTahunanPersen / 100 / 12;
  let cicilanPerBulanRp: number;

  if (metode === 'flat') {
    const totalBunga = pokokRp * (bungaTahunanPersen / 100) * (tenorBulan / 12);
    cicilanPerBulanRp = (pokokRp + totalBunga) / tenorBulan;
    langkah.push(`Metode flat: total bunga = Rp${Math.round(totalBunga).toLocaleString('id-ID')}`);
  } else {
    if (bungaBulanan === 0) {
      cicilanPerBulanRp = pokokRp / tenorBulan;
    } else {
      const faktor = Math.pow(1 + bungaBulanan, tenorBulan);
      cicilanPerBulanRp = (pokokRp * bungaBulanan * faktor) / (faktor - 1);
    }
    langkah.push(`Metode anuitas: bunga bulanan = ${(bungaBulanan * 100).toFixed(4)}%`);
  }

  const totalBayarRp = cicilanPerBulanRp * tenorBulan;
  const totalBungaRp = totalBayarRp - pokokRp;

  langkah.push(`Cicilan per bulan = Rp${Math.round(cicilanPerBulanRp).toLocaleString('id-ID')}`);
  langkah.push(`Total bayar = Rp${Math.round(totalBayarRp).toLocaleString('id-ID')}`);

  return {
    cicilanPerBulanRp: Math.round(cicilanPerBulanRp),
    totalBayarRp: Math.round(totalBayarRp),
    totalBungaRp: Math.round(totalBungaRp),
    langkah,
  };
}

export function formatCicilanTeks(hasil: HasilCicilan, input: InputCicilan): string {
  const lines = [
    '=== KALKULATOR CICILAN ===',
    `Pokok pinjaman : Rp${input.pokokRp.toLocaleString('id-ID')}`,
    `Bunga tahunan  : ${input.bungaTahunanPersen}% (${input.metode})`,
    `Tenor          : ${input.tenorBulan} bulan`,
    '---',
    `Cicilan/bulan  : Rp${hasil.cicilanPerBulanRp.toLocaleString('id-ID')}`,
    `Total bunga    : Rp${hasil.totalBungaRp.toLocaleString('id-ID')}`,
    `Total bayar    : Rp${hasil.totalBayarRp.toLocaleString('id-ID')}`,
  ];
  return lines.join('\n');
}

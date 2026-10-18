/**
 * konverter-suhu.ts — Konverter Suhu (Celsius, Fahrenheit, Kelvin, Reamur)
 */

export type SatuanSuhu = 'C' | 'F' | 'K' | 'R';

export const SATUAN_SUHU: Record<SatuanSuhu, string> = {
  C: 'Celsius (°C)',
  F: 'Fahrenheit (°F)',
  K: 'Kelvin (K)',
  R: 'Reamur (°R)',
};

function keCelsius(nilai: number, dari: SatuanSuhu): number {
  switch (dari) {
    case 'C': return nilai;
    case 'F': return ((nilai - 32) * 5) / 9;
    case 'K': return nilai - 273.15;
    case 'R': return (nilai * 5) / 4;
  }
}

function dariCelsius(celsius: number, ke: SatuanSuhu): number {
  switch (ke) {
    case 'C': return celsius;
    case 'F': return (celsius * 9) / 5 + 32;
    case 'K': return celsius + 273.15;
    case 'R': return (celsius * 4) / 5;
  }
}

export interface HasilSuhu {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
  reamur: number;
}

export function konversiSuhu(nilai: number, dari: SatuanSuhu): HasilSuhu {
  if (!SATUAN_SUHU[dari]) throw new Error(`Satuan tidak dikenal: ${dari}`);
  const c = keCelsius(nilai, dari);
  if (c < -273.15) throw new Error('Suhu di bawah nol mutlak (-273.15°C) tidak mungkin');
  const bulat = (n: number) => Math.round(n * 100) / 100;
  return {
    celsius: bulat(c),
    fahrenheit: bulat(dariCelsius(c, 'F')),
    kelvin: bulat(dariCelsius(c, 'K')),
    reamur: bulat(dariCelsius(c, 'R')),
  };
}

export function formatSuhuTeks(hasil: HasilSuhu): string {
  return [
    '=== KONVERTER SUHU ===',
    `Celsius    : ${hasil.celsius} °C`,
    `Fahrenheit : ${hasil.fahrenheit} °F`,
    `Kelvin     : ${hasil.kelvin} K`,
    `Reamur     : ${hasil.reamur} °R`,
  ].join('\n');
}

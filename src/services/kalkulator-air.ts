/**
 * kalkulator-air.ts — Kalkulator Kebutuhan Air Harian
 * Rumus umum: 30–35 ml per kg berat badan, disesuaikan aktivitas & cuaca.
 */

export type TingkatAktivitas = 'rendah' | 'sedang' | 'tinggi';
export type Cuaca = 'normal' | 'panas';

export interface InputAir {
  beratKg: number;
  aktivitas: TingkatAktivitas;
  cuaca: Cuaca;
}

export interface HasilAir {
  mlPerHari: number;
  literPerHari: number;
  gelasPerHari: number; // 1 gelas = 250 ml
  rincian: string[];
}

export function hitungKebutuhanAir(input: InputAir): HasilAir {
  const { beratKg, aktivitas, cuaca } = input;
  if (beratKg <= 0 || beratKg > 500) throw new Error('Berat badan tidak valid');

  const rincian: string[] = [];
  let ml = beratKg * 30;
  rincian.push(`Basis: ${beratKg} kg × 30 ml = ${Math.round(ml)} ml`);

  if (aktivitas === 'sedang') {
    ml += 500;
    rincian.push('Aktivitas sedang: +500 ml');
  } else if (aktivitas === 'tinggi') {
    ml += 1000;
    rincian.push('Aktivitas tinggi/olahraga: +1000 ml');
  }

  if (cuaca === 'panas') {
    ml += 500;
    rincian.push('Cuaca panas: +500 ml');
  }

  const mlPerHari = Math.round(ml);
  return {
    mlPerHari,
    literPerHari: Math.round((mlPerHari / 1000) * 10) / 10,
    gelasPerHari: Math.ceil(mlPerHari / 250),
    rincian,
  };
}

export function formatAirTeks(hasil: HasilAir): string {
  return [
    '=== KEBUTUHAN AIR HARIAN ===',
    ...hasil.rincian,
    '---',
    `Total: ${hasil.mlPerHari.toLocaleString('id-ID')} ml (${hasil.literPerHari} liter)`,
    `≈ ${hasil.gelasPerHari} gelas @250 ml per hari`,
    '',
    'Tips: minum sebelum haus, bawa botol minum, tambah asupan saat sakit/demam.',
  ].join('\n');
}

/**
 * kalkulator-pajak.ts — Kalkulator PPN & PPh Indonesia
 */

export interface InputPPN {
  hargaRp: number;
  tarifPersen: number; // default 11
  termasukPPN: boolean; // true jika harga sudah termasuk PPN
}

export interface HasilPPN {
  dppRp: number;
  ppnRp: number;
  totalRp: number;
}

export function hitungPPN(input: InputPPN): HasilPPN {
  const { hargaRp, tarifPersen, termasukPPN } = input;
  if (hargaRp < 0) throw new Error('Harga tidak boleh negatif');
  if (tarifPersen < 0 || tarifPersen > 100) throw new Error('Tarif PPN 0–100%');

  const tarif = tarifPersen / 100;
  let dppRp: number, ppnRp: number, totalRp: number;

  if (termasukPPN) {
    dppRp = hargaRp / (1 + tarif);
    ppnRp = hargaRp - dppRp;
    totalRp = hargaRp;
  } else {
    dppRp = hargaRp;
    ppnRp = hargaRp * tarif;
    totalRp = hargaRp + ppnRp;
  }

  return {
    dppRp: Math.round(dppRp),
    ppnRp: Math.round(ppnRp),
    totalRp: Math.round(totalRp),
  };
}

export function formatPPNTeks(hasil: HasilPPN, input: InputPPN): string {
  return [
    '=== KALKULATOR PPN ===',
    `Harga input : Rp${input.hargaRp.toLocaleString('id-ID')} ${input.termasukPPN ? '(termasuk PPN)' : '(belum PPN)'}`,
    `Tarif PPN   : ${input.tarifPersen}%`,
    '---',
    `DPP         : Rp${hasil.dppRp.toLocaleString('id-ID')}`,
    `PPN         : Rp${hasil.ppnRp.toLocaleString('id-ID')}`,
    `Total       : Rp${hasil.totalRp.toLocaleString('id-ID')}`,
  ].join('\n');
}

// ---- PPh 21 sederhana (tarif progresif tahunan, UU HPP) ----

const TARIF_PPH: Array<{ batas: number; tarif: number }> = [
  { batas: 60_000_000, tarif: 0.05 },
  { batas: 250_000_000, tarif: 0.15 },
  { batas: 500_000_000, tarif: 0.25 },
  { batas: 5_000_000_000, tarif: 0.30 },
  { batas: Infinity, tarif: 0.35 },
];

export function hitungPPhTahunan(pkpRp: number): { pphRp: number; rincian: string[] } {
  if (pkpRp < 0) throw new Error('PKP tidak boleh negatif');
  let sisa = pkpRp;
  let pphRp = 0;
  const rincian: string[] = [];
  let batasBawah = 0;

  for (const lapis of TARIF_PPH) {
    if (sisa <= 0) break;
    const kenaLapis = Math.min(sisa, lapis.batas - batasBawah);
    const pajakLapis = kenaLapis * lapis.tarif;
    pphRp += pajakLapis;
    rincian.push(
      `Rp${batasBawah.toLocaleString('id-ID')}–Rp${Math.min(pkpRp, lapis.batas).toLocaleString('id-ID')}: ${(lapis.tarif * 100).toFixed(0)}% = Rp${Math.round(pajakLapis).toLocaleString('id-ID')}`,
    );
    sisa -= kenaLapis;
    batasBawah = lapis.batas;
  }

  return { pphRp: Math.round(pphRp), rincian };
}

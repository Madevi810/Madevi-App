/**
 * penghitung-kata.ts — Penghitung Kata, Karakter, Kalimat, Paragraf
 * Untuk penulis, pelajar, dan pembuat konten.
 */

export interface HasilHitungKata {
  karakter: number;
  karakterTanpaSpasi: number;
  kata: number;
  kalimat: number;
  paragraf: number;
  estimasiWaktuBacaDetik: number;
}

const KECEPATAN_BACA_KATA_PER_MENIT = 200;

export function hitungKata(teks: string): HasilHitungKata {
  const karakter = teks.length;
  const karakterTanpaSpasi = teks.replace(/\s/g, '').length;

  const kataBersih = teks.trim().split(/\s+/).filter((w) => w.length > 0);
  const kata = teks.trim() === '' ? 0 : kataBersih.length;

  const kalimat = (teks.match(/[.!?…]+/g) ?? []).length;

  const paragraf = teks.trim() === '' ? 0 : teks.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  const estimasiWaktuBacaDetik = Math.round((kata / KECEPATAN_BACA_KATA_PER_MENIT) * 60);

  return { karakter, karakterTanpaSpasi, kata, kalimat, paragraf, estimasiWaktuBacaDetik };
}

export function formatHitungKataTeks(hasil: HasilHitungKata): string {
  const menit = Math.floor(hasil.estimasiWaktuBacaDetik / 60);
  const detik = hasil.estimasiWaktuBacaDetik % 60;
  const waktuBaca = menit > 0 ? `${menit} mnt ${detik} dtk` : `${detik} dtk`;
  return [
    '=== PENGHITUNG KATA ===',
    `Karakter (dengan spasi)   : ${hasil.karakter}`,
    `Karakter (tanpa spasi)    : ${hasil.karakterTanpaSpasi}`,
    `Kata                      : ${hasil.kata}`,
    `Kalimat                   : ${hasil.kalimat}`,
    `Paragraf                  : ${hasil.paragraf}`,
    `Estimasi waktu baca       : ${waktuBaca}`,
  ].join('\n');
}

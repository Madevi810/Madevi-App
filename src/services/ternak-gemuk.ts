/**
 * TernakKu — kalkulator perencana penggemukan kambing/domba
 * (engine Tools gratis).
 *
 * Masalah: peternak kecil yang menggemukkan kambing/domba untuk qurban atau
 * pasar menghitung modal di atas kertas — rawan salah hitung pakan × hari ×
 * ekor, dan tidak tahu di harga jual berapa ia impas. Di internet belum ada
 * KALKULATOR interaktif berbahasa Indonesia untuk ini — yang ada hanya
 * artikel dan PDF analisis usaha statis.
 *
 * Fungsi murni & deterministik. Tanpa koneksi eksternal.
 *
 * Kejujuran data (aturan konten Madevi #2, #25, #28; aturan #31):
 *  - Engine TIDAK menebak harga apa pun — semua angka rupiah diinput user.
 *  - Bila hasil rugi, ditampilkan apa adanya + peringatan, bukan disembunyikan.
 *  - Ambang ADG realistis (<=200 g/hari) berlabel jelas sebagai patokan umum,
 *    bukan klaim ilmiah per ras ternak.
 */

export type ModeJual = 'per-ekor' | 'per-kg';

export interface InputPenggemukan {
  jumlahEkor: number;
  bobotAwalKg: number;
  bobotTargetKg: number;
  durasiHari: number;
  hargaBakalanPerEkorRp: number;
  biayaPakanPerEkorPerHariRp: number;
  biayaObatPerEkorRp: number;
  biayaTenagaKerjaRp: number;
  biayaKandangRp: number;
  modeJual: ModeJual;
  hargaJualRp: number;
}

export interface HasilPenggemukan {
  kenaikanBobotKg: number;
  adgGramPerHari: number;
  bobotAkhirTotalKg: number;
  totalBiayaPakanRp: number;
  totalBiayaRp: number;
  pendapatanRp: number;
  labaRp: number;
  marginPersen: number;
  bepPerKgRp: number;
  bepPerEkorRp: number;
  biayaPerKgKenaikanRp: number;
  peringatan: string[];
  langkah: string[];
}

export const BATAS_ADG_REALISTIS_GRAM = 200;
export const MIN_DURASI_HARI = 30;
export const MAX_DURASI_HARI = 180;
export const MAX_EKOR = 1000;

export const DISCLAIMER_TERNAK =
  'Perkiraan kasar berdasar angka yang Anda masukkan sendiri — bukan nasihat ' +
  'finansial. Harga bakalan, pakan, dan harga jual berbeda-beda tiap daerah ' +
  'dan waktu; verifikasi ke pasar/peternak setempat sebelum memutuskan.';

function harusBilangan(nilai: unknown, nama: string): asserts nilai is number {
  if (typeof nilai !== 'number' || !Number.isFinite(nilai)) {
    throw new Error(`"${nama}" harus berupa angka.`);
  }
}

export function hitungPenggemukan(input: InputPenggemukan): HasilPenggemukan {
  const {
    jumlahEkor,
    bobotAwalKg,
    bobotTargetKg,
    durasiHari,
    hargaBakalanPerEkorRp,
    biayaPakanPerEkorPerHariRp,
    biayaObatPerEkorRp,
    biayaTenagaKerjaRp,
    biayaKandangRp,
    modeJual,
    hargaJualRp,
  } = input;

  harusBilangan(jumlahEkor, 'jumlahEkor');
  harusBilangan(bobotAwalKg, 'bobotAwalKg');
  harusBilangan(bobotTargetKg, 'bobotTargetKg');
  harusBilangan(durasiHari, 'durasiHari');
  harusBilangan(hargaBakalanPerEkorRp, 'hargaBakalanPerEkorRp');
  harusBilangan(biayaPakanPerEkorPerHariRp, 'biayaPakanPerEkorPerHariRp');
  harusBilangan(biayaObatPerEkorRp, 'biayaObatPerEkorRp');
  harusBilangan(biayaTenagaKerjaRp, 'biayaTenagaKerjaRp');
  harusBilangan(biayaKandangRp, 'biayaKandangRp');
  harusBilangan(hargaJualRp, 'hargaJualRp');

  if (!Number.isInteger(jumlahEkor) || jumlahEkor < 1 || jumlahEkor > MAX_EKOR) {
    throw new Error(`"jumlahEkor" harus bilangan bulat 1–${MAX_EKOR}.`);
  }
  if (bobotAwalKg <= 0) throw new Error('"bobotAwalKg" harus lebih dari 0.');
  if (bobotTargetKg <= bobotAwalKg) {
    throw new Error('"bobotTargetKg" harus lebih besar dari "bobotAwalKg".');
  }
  if (!Number.isInteger(durasiHari) || durasiHari < MIN_DURASI_HARI || durasiHari > MAX_DURASI_HARI) {
    throw new Error(`"durasiHari" harus bilangan bulat ${MIN_DURASI_HARI}–${MAX_DURASI_HARI}.`);
  }
  for (const [nama, nilai] of [
    ['hargaBakalanPerEkorRp', hargaBakalanPerEkorRp],
    ['biayaPakanPerEkorPerHariRp', biayaPakanPerEkorPerHariRp],
    ['biayaObatPerEkorRp', biayaObatPerEkorRp],
    ['biayaTenagaKerjaRp', biayaTenagaKerjaRp],
    ['biayaKandangRp', biayaKandangRp],
  ] as const) {
    if (nilai < 0) throw new Error(`"${nama}" tidak boleh negatif.`);
  }
  if (modeJual !== 'per-ekor' && modeJual !== 'per-kg') {
    throw new Error('"modeJual" harus "per-ekor" atau "per-kg".');
  }
  if (hargaJualRp <= 0) throw new Error('"hargaJualRp" harus lebih dari 0.');

  const kenaikanBobotKg = bobotTargetKg - bobotAwalKg;
  const adgGramPerHari = (kenaikanBobotKg / durasiHari) * 1000;
  const bobotAkhirTotalKg = bobotTargetKg * jumlahEkor;

  const totalBiayaBakalanRp = hargaBakalanPerEkorRp * jumlahEkor;
  const totalBiayaPakanRp = biayaPakanPerEkorPerHariRp * jumlahEkor * durasiHari;
  const totalBiayaObatRp = biayaObatPerEkorRp * jumlahEkor;
  const totalBiayaRp =
    totalBiayaBakalanRp + totalBiayaPakanRp + totalBiayaObatRp + biayaTenagaKerjaRp + biayaKandangRp;

  const pendapatanRp =
    modeJual === 'per-ekor' ? hargaJualRp * jumlahEkor : hargaJualRp * bobotAkhirTotalKg;
  const labaRp = pendapatanRp - totalBiayaRp;
  const marginPersen = totalBiayaRp === 0 ? 0 : (labaRp / totalBiayaRp) * 100;

  const bepPerKgRp = bobotAkhirTotalKg === 0 ? 0 : totalBiayaRp / bobotAkhirTotalKg;
  const bepPerEkorRp = totalBiayaRp / jumlahEkor;
  const totalKenaikanKg = kenaikanBobotKg * jumlahEkor;
  const biayaPerKgKenaikanRp = totalKenaikanKg === 0 ? 0 : (totalBiayaRp - totalBiayaBakalanRp) / totalKenaikanKg;

  const peringatan: string[] = [];
  if (adgGramPerHari > BATAS_ADG_REALISTIS_GRAM) {
    peringatan.push(
      `ADG ${Math.round(adgGramPerHari)} g/hari di atas patokan umum ` +
        `(${BATAS_ADG_REALISTIS_GRAM} g/hari) — target bobot mungkin tidak realistis, ` +
        'pertimbangkan menambah durasi atau menurunkan target.',
    );
  }
  if (labaRp < 0) {
    peringatan.push('Hasil perhitungan RUGI — jangan mulai sebelum ada angka yang berubah (harga jual, biaya pakan, atau durasi).');
  } else if (marginPersen < 10) {
    peringatan.push(
      `Margin hanya ${marginPersen.toFixed(1)}% — tipis; sedikit kenaikan harga pakan atau ` +
        'kematian ternak bisa menghapus untung.',
    );
  }
  if (durasiHari > 120) {
    peringatan.push(
      'Durasi di atas 120 hari — risiko biaya pakan membengkak dan fluktuasi harga jual makin besar.',
    );
  }

  const langkah = [
    `Kenaikan bobot per ekor: ${bobotTargetKg} − ${bobotAwalKg} = ${kenaikanBobotKg} kg.`,
    `ADG: ${kenaikanBobotKg} kg ÷ ${durasiHari} hari = ${adgGramPerHari.toFixed(1)} g/hari.`,
    `Biaya pakan: Rp${biayaPakanPerEkorPerHariRp} × ${jumlahEkor} ekor × ${durasiHari} hari = Rp${totalBiayaPakanRp}.`,
    `Total biaya: bakalan Rp${totalBiayaBakalanRp} + pakan Rp${totalBiayaPakanRp} + obat Rp${totalBiayaObatRp} + tenaga kerja Rp${biayaTenagaKerjaRp} + kandang Rp${biayaKandangRp} = Rp${totalBiayaRp}.`,
    modeJual === 'per-ekor'
      ? `Pendapatan: Rp${hargaJualRp} × ${jumlahEkor} ekor = Rp${pendapatanRp}.`
      : `Pendapatan: Rp${hargaJualRp} × ${bobotAkhirTotalKg} kg = Rp${pendapatanRp}.`,
    `Laba: Rp${pendapatanRp} − Rp${totalBiayaRp} = Rp${labaRp} (margin ${marginPersen.toFixed(1)}%).`,
    `Titik impas (BEP): Rp${Math.round(bepPerKgRp)}/kg atau Rp${Math.round(bepPerEkorRp)}/ekor.`,
  ];

  return {
    kenaikanBobotKg,
    adgGramPerHari,
    bobotAkhirTotalKg,
    totalBiayaPakanRp,
    totalBiayaRp,
    pendapatanRp,
    labaRp,
    marginPersen,
    bepPerKgRp,
    bepPerEkorRp,
    biayaPerKgKenaikanRp,
    peringatan,
    langkah,
  };
}

function rupiah(nilai: number): string {
  return 'Rp' + Math.round(nilai).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatTernakTeks(h: HasilPenggemukan): string {
  const baris = [
    'TERNAKKU — RENCANA PENGGEMUKAN KAMBING/DOMBA',
    '',
    `Kenaikan bobot per ekor : ${h.kenaikanBobotKg} kg`,
    `ADG (target harian)     : ${h.adgGramPerHari.toFixed(1)} g/hari`,
    `Bobot akhir total       : ${h.bobotAkhirTotalKg} kg`,
    `Total biaya pakan       : ${rupiah(h.totalBiayaPakanRp)}`,
    `TOTAL BIAYA             : ${rupiah(h.totalBiayaRp)}`,
    `Pendapatan              : ${rupiah(h.pendapatanRp)}`,
    `LABA/RUGI               : ${rupiah(h.labaRp)} (margin ${h.marginPersen.toFixed(1)}%)`,
    `Titik impas (BEP)       : ${rupiah(h.bepPerKgRp)}/kg atau ${rupiah(h.bepPerEkorRp)}/ekor`,
    `Biaya per kg kenaikan   : ${rupiah(h.biayaPerKgKenaikanRp)}/kg`,
    '',
  ];
  if (h.peringatan.length > 0) {
    baris.push('PERINGATAN:');
    for (const p of h.peringatan) baris.push('- ' + p);
    baris.push('');
  }
  baris.push('LANGKAH PERHITUNGAN:');
  for (const s of h.langkah) baris.push('- ' + s);
  baris.push('', 'Catatan: ' + DISCLAIMER_TERNAK);
  return baris.join('\n');
}

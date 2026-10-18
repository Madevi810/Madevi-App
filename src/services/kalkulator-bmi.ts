/**
 * kalkulator-bmi.ts — Kalkulator Indeks Massa Tubuh (BMI)
 */

export interface InputBMI {
  beratKg: number;
  tinggiCm: number;
  usiaTahun?: number;
}

export interface HasilBMI {
  bmi: number;
  kategori: string;
  kategoriEn: string;
  saranId: string;
  beratIdealMinKg: number;
  beratIdealMaxKg: number;
}

export function hitungBMI(input: InputBMI): HasilBMI {
  const { beratKg, tinggiCm } = input;

  if (beratKg <= 0 || beratKg > 500) throw new Error('Berat badan tidak valid (0–500 kg)');
  if (tinggiCm <= 0 || tinggiCm > 300) throw new Error('Tinggi badan tidak valid (0–300 cm)');

  const tinggiM = tinggiCm / 100;
  const bmi = beratKg / (tinggiM * tinggiM);

  let kategori: string;
  let kategoriEn: string;
  let saranId: string;

  if (bmi < 18.5) {
    kategori = 'Kurus';
    kategoriEn = 'Underweight';
    saranId = 'Pertimbangkan menambah asupan kalori bergizi dan konsultasi ke ahli gizi.';
  } else if (bmi < 25) {
    kategori = 'Normal';
    kategoriEn = 'Normal';
    saranId = 'Pertahankan pola makan seimbang dan aktivitas fisik rutin.';
  } else if (bmi < 30) {
    kategori = 'Gemuk';
    kategoriEn = 'Overweight';
    saranId = 'Kurangi asupan kalori berlebih dan tingkatkan aktivitas fisik.';
  } else {
    kategori = 'Obesitas';
    kategoriEn = 'Obese';
    saranId = 'Disarankan konsultasi ke dokter atau ahli gizi untuk program penurunan berat badan.';
  }

  // Rentang berat ideal untuk BMI 18.5–24.9
  const beratIdealMinKg = 18.5 * tinggiM * tinggiM;
  const beratIdealMaxKg = 24.9 * tinggiM * tinggiM;

  return {
    bmi: Math.round(bmi * 10) / 10,
    kategori,
    kategoriEn,
    saranId,
    beratIdealMinKg: Math.round(beratIdealMinKg * 10) / 10,
    beratIdealMaxKg: Math.round(beratIdealMaxKg * 10) / 10,
  };
}

export function formatBMITeks(hasil: HasilBMI, input: InputBMI): string {
  return [
    '=== KALKULATOR BMI ===',
    `Berat : ${input.beratKg} kg`,
    `Tinggi: ${input.tinggiCm} cm`,
    '---',
    `BMI      : ${hasil.bmi} (${hasil.kategori})`,
    `Berat ideal: ${hasil.beratIdealMinKg}–${hasil.beratIdealMaxKg} kg`,
    `Saran: ${hasil.saranId}`,
  ].join('\n');
}

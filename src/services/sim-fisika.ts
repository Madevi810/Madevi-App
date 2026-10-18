/**
 * Model fisika murni untuk simulasi edukasi (pola PhET).
 * Dipisahkan dari view agar bisa di-unit-test.
 */

// ---- Hukum Ohm: V = I × R ----
export interface HasilOhm { teganganV: number; arusA: number; resistansiOhm: number; dayaW: number; }

export function hukumOhm(teganganV: number, resistansiOhm: number): HasilOhm {
  if (resistansiOhm <= 0) throw new Error('Resistansi harus positif');
  const arusA = teganganV / resistansiOhm;
  return { teganganV, arusA, resistansiOhm, dayaW: teganganV * arusA };
}

// ---- Gerak parabola ----
export interface TitikParabola { x: number; y: number; t: number; }
export interface HasilParabola {
  jarakMaksM: number;
  tinggiMaksM: number;
  waktuTotalS: number;
  lintasan: TitikParabola[];
}

export function gerakParabola(kecepatanAwalMs: number, sudutDerajat: number, gravitasi = 9.8): HasilParabola {
  if (kecepatanAwalMs < 0) throw new Error('Kecepatan tidak boleh negatif');
  if (sudutDerajat < 0 || sudutDerajat > 90) throw new Error('Sudut 0–90 derajat');
  const rad = (sudutDerajat * Math.PI) / 180;
  const vx = kecepatanAwalMs * Math.cos(rad);
  const vy = kecepatanAwalMs * Math.sin(rad);
  const waktuTotalS = (2 * vy) / gravitasi;
  const jarakMaksM = vx * waktuTotalS;
  const tinggiMaksM = (vy * vy) / (2 * gravitasi);
  const lintasan: TitikParabola[] = [];
  const langkah = 40;
  for (let i = 0; i <= langkah; i++) {
    const t = (waktuTotalS * i) / langkah;
    lintasan.push({ x: vx * t, y: Math.max(0, vy * t - 0.5 * gravitasi * t * t), t });
  }
  const r = (n: number) => Math.round(n * 100) / 100;
  return { jarakMaksM: r(jarakMaksM), tinggiMaksM: r(tinggiMaksM), waktuTotalS: r(waktuTotalS), lintasan };
}

// ---- Pegas: periode osilasi T = 2π√(m/k) ----
export interface HasilPegas { periodeS: number; frekuensiHz: number; }

export function pegasOsilasi(massaKg: number, konstantaPegasNm: number): HasilPegas {
  if (massaKg <= 0 || konstantaPegasNm <= 0) throw new Error('Massa dan konstanta pegas harus positif');
  const periodeS = 2 * Math.PI * Math.sqrt(massaKg / konstantaPegasNm);
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return { periodeS: r(periodeS), frekuensiHz: r(1 / periodeS) };
}

// Posisi osilasi pada waktu t: x = A·cos(2πt/T)
export function posisiPegas(amplitudoM: number, periodeS: number, waktuS: number): number {
  return amplitudoM * Math.cos((2 * Math.PI * waktuS) / periodeS);
}

// ---- Grafik fungsi kuadrat: y = ax² + bx + c ----
export interface HasilKuadrat { diskriminan: number; akarReal: number[]; titikPuncak: { x: number; y: number }; }

export function analisisKuadrat(a: number, b: number, c: number): HasilKuadrat {
  if (a === 0) throw new Error('a tidak boleh 0 untuk fungsi kuadrat');
  const diskriminan = b * b - 4 * a * c;
  const akarReal: number[] = [];
  if (diskriminan > 0) {
    akarReal.push((-b + Math.sqrt(diskriminan)) / (2 * a), (-b - Math.sqrt(diskriminan)) / (2 * a));
  } else if (diskriminan === 0) {
    akarReal.push(-b / (2 * a));
  }
  const xp = -b / (2 * a);
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return { diskriminan: r(diskriminan), akarReal: akarReal.map(r), titikPuncak: { x: r(xp), y: r(a * xp * xp + b * xp + c) } };
}

// ---- pH dari konsentrasi H+ ----
export function hitungPH(konsentrasiHmolL: number): number {
  if (konsentrasiHmolL <= 0) throw new Error('Konsentrasi harus positif');
  return Math.round(-Math.log10(konsentrasiHmolL) * 100) / 100;
}

export function kategoriPH(ph: number): string {
  if (ph < 0 || ph > 14) throw new Error('pH 0–14');
  if (ph < 3) return 'Asam kuat';
  if (ph < 7) return 'Asam lemah';
  if (ph === 7) return 'Netral';
  if (ph <= 11) return 'Basa lemah';
  return 'Basa kuat';
}

// ---- Pecahan visual ----
export interface HasilPecahan { pembilang: number; penyebut: number; desimal: number; persen: number; senilai: string; }

export function analisisPecahan(pembilang: number, penyebut: number): HasilPecahan {
  if (penyebut === 0) throw new Error('Penyebut tidak boleh 0');
  if (pembilang < 0 || penyebut < 0) throw new Error('Gunakan bilangan non-negatif');
  const fpb = (x: number, y: number): number => (y === 0 ? x : fpb(y, x % y));
  const f = fpb(pembilang, penyebut);
  const r = (n: number) => Math.round(n * 10000) / 10000;
  return {
    pembilang, penyebut,
    desimal: r(pembilang / penyebut),
    persen: r((pembilang / penyebut) * 100),
    senilai: `${pembilang / f}/${penyebut / f}`,
  };
}

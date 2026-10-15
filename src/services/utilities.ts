/**
 * Utilities Service — Alat Bantu (Prompt 06)
 *
 * Aturan kontrak:
 *  - Formula DETERMINISTIK. Bukan tebakan AI. Input sama => output sama,
 *    dan langkah pengerjaan diturunkan dari input, bukan diacak.
 *  - Simpan privat hanya untuk pengguna login; guest hanya unduh saat itu.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';

/* ============================================================
 * Definisi rumus — deklaratif, deterministik, bisa ditambah Admin
 * ============================================================ */

export interface FormulaVariable {
  key: string;
  label: string;
  unit?: string;
}

export interface FormulaDef {
  id: string;
  category: 'MATH' | 'PHYSICS' | 'FINANCE' | 'ELECTRONICS';
  name: string;
  description: string;
  variables: FormulaVariable[];
  /** Fungsi murni: input terurut -> nilai + langkah pengerjaan. */
  compute: (values: Record<string, number>) => {
    value: number;
    unit?: string;
    steps: string[];
  };
}

/** Pembulatan stabil agar deterministik (bukan toFixed yang bisa floating noise). */
function roundTo(value: number, digits = 4): number {
  if (!Number.isFinite(value)) return NaN;
  const f = Math.pow(10, digits);
  return Math.round((value + Number.EPSILON) * f) / f;
}

function num(values: Record<string, number>, key: string): number {
  const v = values[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : NaN;
}

export const FORMULAS: FormulaDef[] = [
  /* ---------------- MATEMATIKA ---------------- */
  {
    id: 'pythagoras',
    category: 'MATH',
    name: 'Teorema Pythagoras',
    description: 'Hipotenusa segitiga siku-siku: c = √(a² + b²)',
    variables: [
      { key: 'a', label: 'Sisi a', unit: 'cm' },
      { key: 'b', label: 'Sisi b', unit: 'cm' },
    ],
    compute: (v) => {
      const a = num(v, 'a');
      const b = num(v, 'b');
      const c = Math.sqrt(a * a + b * b);
      return {
        value: roundTo(c),
        unit: 'cm',
        steps: [
          `a = ${a}, b = ${b}`,
          `c² = a² + b² = ${roundTo(a * a)} + ${roundTo(b * b)} = ${roundTo(a * a + b * b)}`,
          `c = √${roundTo(a * a + b * b)} = ${roundTo(c)} cm`,
        ],
      };
    },
  },
  {
    id: 'luas_lingkaran',
    category: 'MATH',
    name: 'Luas Lingkaran',
    description: 'L = π × r²',
    variables: [{ key: 'r', label: 'Jari-jari', unit: 'cm' }],
    compute: (v) => {
      const r = num(v, 'r');
      const L = Math.PI * r * r;
      return {
        value: roundTo(L),
        unit: 'cm²',
        steps: [
          `r = ${r}`,
          `r² = ${roundTo(r * r)}`,
          `L = π × ${roundTo(r * r)} = ${roundTo(L)} cm²`,
        ],
      };
    },
  },
  {
    id: 'solimt_ax_b',
    category: 'MATH',
    name: 'Persamaan Linear ax + b = 0',
    description: 'Solusi x = −b / a',
    variables: [
      { key: 'a', label: 'Koefisien a' },
      { key: 'b', label: 'Konstanta b' },
    ],
    compute: (v) => {
      const a = num(v, 'a');
      const b = num(v, 'b');
      if (a === 0) {
        return {
          value: NaN,
          steps: ['a = 0 → tidak ada solusi unik (tanpa solusi atau tak hingga).'],
        };
      }
      const x = -b / a;
      return {
        value: roundTo(x),
        steps: [
          `ax + b = 0 dengan a = ${a}, b = ${b}`,
          `ax = −b = ${roundTo(-b)}`,
          `x = −b / a = ${roundTo(-b)} / ${a} = ${roundTo(x)}`,
        ],
      };
    },
  },
  {
    id: 'deret_aritmatika',
    category: 'MATH',
    name: 'Jumlah n Suku Aritmatika',
    description: 'Sn = n/2 × (2a + (n−1)b)',
    variables: [
      { key: 'n', label: 'Jumlah suku (n)' },
      { key: 'a', label: 'Suku awal (a)' },
      { key: 'b', label: 'Beda (b)' },
    ],
    compute: (v) => {
      const n = num(v, 'n');
      const a = num(v, 'a');
      const b = num(v, 'b');
      const Sn = (n / 2) * (2 * a + (n - 1) * b);
      return {
        value: roundTo(Sn),
        steps: [
          `n = ${n}, a = ${a}, b = ${b}`,
          `2a + (n−1)b = ${roundTo(2 * a)} + ${roundTo((n - 1) * b)} = ${roundTo(2 * a + (n - 1) * b)}`,
          `Sn = n/2 × ${roundTo(2 * a + (n - 1) * b)} = ${roundTo(Sn)}`,
        ],
      };
    },
  },

  /* ---------------- FISIKA ---------------- */
  {
    id: 'glbb',
    category: 'PHYSICS',
    name: 'Gerak Lurus Beraturan',
    description: 'Jarak: s = v × t',
    variables: [
      { key: 'v', label: 'Kecepatan', unit: 'm/s' },
      { key: 't', label: 'Waktu', unit: 's' },
    ],
    compute: (v) => {
      const vel = num(v, 'v');
      const t = num(v, 't');
      const s = vel * t;
      return {
        value: roundTo(s),
        unit: 'm',
        steps: [`v = ${vel} m/s, t = ${t} s`, `s = v × t = ${vel} × ${t} = ${roundTo(s)} m`],
      };
    },
  },
  {
    id: 'hukum_newton_2',
    category: 'PHYSICS',
    name: 'Hukum Newton II',
    description: 'Gaya: F = m × a',
    variables: [
      { key: 'm', label: 'Massa', unit: 'kg' },
      { key: 'a', label: 'Percepatan', unit: 'm/s²' },
    ],
    compute: (v) => {
      const m = num(v, 'm');
      const a = num(v, 'a');
      const F = m * a;
      return {
        value: roundTo(F),
        unit: 'N',
        steps: [`m = ${m} kg, a = ${a} m/s²`, `F = m × a = ${m} × ${a} = ${roundTo(F)} N`],
      };
    },
  },
  {
    id: 'energi_kinetik',
    category: 'PHYSICS',
    name: 'Energi Kinetik',
    description: 'Ek = ½ × m × v²',
    variables: [
      { key: 'm', label: 'Massa', unit: 'kg' },
      { key: 'v', label: 'Kecepatan', unit: 'm/s' },
    ],
    compute: (v) => {
      const m = num(v, 'm');
      const vel = num(v, 'v');
      const Ek = 0.5 * m * vel * vel;
      return {
        value: roundTo(Ek),
        unit: 'J',
        steps: [
          `m = ${m} kg, v = ${vel} m/s`,
          `v² = ${roundTo(vel * vel)}`,
          `Ek = ½ × ${m} × ${roundTo(vel * vel)} = ${roundTo(Ek)} J`,
        ],
      };
    },
  },

  /* ---------------- KEUANGAN ---------------- */
  {
    id: 'bunga_tunggal',
    category: 'FINANCE',
    name: 'Bunga Tunggal',
    description: 'Bunga: B = P × r × t',
    variables: [
      { key: 'P', label: 'Pokok pinjaman', unit: 'Rp' },
      { key: 'r', label: 'Suku bunga/tahun', unit: '%' },
      { key: 't', label: 'Waktu', unit: 'tahun' },
    ],
    compute: (v) => {
      const P = num(v, 'P');
      const r = num(v, 'r') / 100;
      const t = num(v, 't');
      const B = P * r * t;
      return {
        value: roundTo(B),
        unit: 'Rp',
        steps: [
          `P = ${P}, r = ${num(v, 'r')}% = ${roundTo(r)}, t = ${t}`,
          `B = P × r × t = ${P} × ${roundTo(r)} × ${t} = ${roundTo(B)}`,
        ],
      };
    },
  },
  {
    id: 'diskon',
    category: 'FINANCE',
    name: 'Harga Setelah Diskon',
    description: 'Harga akhir = Harga × (1 − d/100)',
    variables: [
      { key: 'H', label: 'Harga awal', unit: 'Rp' },
      { key: 'd', label: 'Diskon', unit: '%' },
    ],
    compute: (v) => {
      const H = num(v, 'H');
      const d = num(v, 'd');
      const akhir = H * (1 - d / 100);
      return {
        value: roundTo(akhir),
        unit: 'Rp',
        steps: [
          `H = ${H}, d = ${d}%`,
          `Faktor = 1 − ${d}/100 = ${roundTo(1 - d / 100)}`,
          `Harga akhir = ${H} × ${roundTo(1 - d / 100)} = ${roundTo(akhir)}`,
        ],
      };
    },
  },
  {
    id: 'cicilan_fixed',
    category: 'FINANCE',
    name: 'Cicilan Tetap (Flat)',
    description: 'Cicilan = (Pokok + Bunga total) / tenor',
    variables: [
      { key: 'P', label: 'Pokok', unit: 'Rp' },
      { key: 'B', label: 'Total bunga', unit: 'Rp' },
      { key: 'n', label: 'Tenor (bulan)' },
    ],
    compute: (v) => {
      const P = num(v, 'P');
      const B = num(v, 'B');
      const n = num(v, 'n');
      if (n === 0) return { value: NaN, steps: ['Tenor tidak boleh 0.'] };
      const cicilan = (P + B) / n;
      return {
        value: roundTo(cicilan),
        unit: 'Rp/bulan',
        steps: [
          `P = ${P}, B = ${B}, n = ${n} bulan`,
          `Total = P + B = ${roundTo(P + B)}`,
          `Cicilan = ${roundTo(P + B)} / ${n} = ${roundTo(cicilan)} /bulan`,
        ],
      };
    },
  },

  /* ---------------- ELEKTRONIKA (inovasi TOOLS-002) ---------------- */
  {
    id: 'hukum_ohm',
    category: 'ELECTRONICS',
    name: 'Hukum Ohm + Daya',
    description: 'V = I × R, P = V × I — hitung tegangan, arus, resistansi, dan daya',
    variables: [
      { key: 'V', label: 'Tegangan (V)', unit: 'volt' },
      { key: 'I', label: 'Arus (I)', unit: 'ampere' },
      { key: 'R', label: 'Resistansi (R)', unit: 'ohm' },
    ],
    compute: (v) => {
      const V = num(v, 'V');
      const I = num(v, 'I');
      const R = num(v, 'R');
      const steps: string[] = [];
      // Kosongkan (isi 0) tepat satu dari tiga nilai untuk dihitung
      if (V === 0 && I !== 0 && R !== 0) {
        const calcV = I * R;
        const P = calcV * I;
        steps.push(`V = I × R = ${I} × ${R} = ${roundTo(calcV)} volt`);
        steps.push(`P = V × I = ${roundTo(calcV)} × ${I} = ${roundTo(P)} watt`);
        return { value: roundTo(calcV), unit: 'volt', steps };
      }
      if (I === 0 && V !== 0 && R !== 0) {
        const calcI = V / R;
        const P = V * calcI;
        steps.push(`I = V / R = ${V} / ${R} = ${roundTo(calcI)} ampere`);
        steps.push(`P = V × I = ${V} × ${roundTo(calcI)} = ${roundTo(P)} watt`);
        return { value: roundTo(calcI), unit: 'ampere', steps };
      }
      if (R === 0 && V !== 0 && I !== 0) {
        const calcR = V / I;
        const P = V * I;
        steps.push(`R = V / I = ${V} / ${I} = ${roundTo(calcR)} ohm`);
        steps.push(`P = V × I = ${V} × ${I} = ${roundTo(P)} watt`);
        return { value: roundTo(calcR), unit: 'ohm', steps };
      }
      steps.push('Isi tepat dua dari tiga nilai (V, I, R); kosongkan yang ingin dihitung dengan 0.');
      return { value: NaN, steps };
    },
  },
  {
    id: 'konversi_suhu',
    category: 'PHYSICS',
    name: 'Konversi Suhu',
    description: 'Celsius ↔ Fahrenheit ↔ Kelvin ↔ Reamur',
    variables: [
      { key: 'C', label: 'Suhu Celsius', unit: '°C' },
    ],
    compute: (v) => {
      const C = num(v, 'C');
      const F = (C * 9) / 5 + 32;
      const K = C + 273.15;
      const R = (C * 4) / 5;
      return {
        value: roundTo(F),
        unit: '°F',
        steps: [
          `${roundTo(C)}°C = ${roundTo(F)}°F`,
          `${roundTo(C)}°C = ${roundTo(K)} K`,
          `${roundTo(C)}°C = ${roundTo(R)}°R`,
        ],
      };
    },
  },
  {
    id: 'pembagi_tegangan',
    category: 'ELECTRONICS',
    name: 'Pembagi Tegangan',
    description: 'Vout = Vin × R2/(R1+R2) — hitung tegangan output pembagi tegangan',
    variables: [
      { key: 'Vin', label: 'Tegangan input (Vin)', unit: 'volt' },
      { key: 'R1', label: 'Resistor atas (R1)', unit: 'ohm' },
      { key: 'R2', label: 'Resistor bawah (R2)', unit: 'ohm' },
    ],
    compute: (v) => {
      const Vin = num(v, 'Vin');
      const R1 = num(v, 'R1');
      const R2 = num(v, 'R2');
      const steps: string[] = [];
      if (R1 <= 0 || R2 <= 0) {
        steps.push('R1 dan R2 harus lebih dari 0.');
        return { value: NaN, steps };
      }
      const Vout = (Vin * R2) / (R1 + R2);
      const I = Vin / (R1 + R2);
      steps.push(`Vout = Vin × R2/(R1+R2) = ${Vin} × ${R2}/(${R1}+${R2}) = ${roundTo(Vout)} volt`);
      steps.push(`Arus total = Vin/(R1+R2) = ${roundTo(I * 1000)} mA`);
      return { value: roundTo(Vout), unit: 'volt', steps };
    },
  },
  {
    id: 'kode_warna_resistor',
    category: 'ELECTRONICS',
    name: 'Kode Warna Resistor',
    description: 'Hitung nilai resistor dari kode warna gelang (4 gelang)',
    variables: [
      { key: 'G1', label: 'Gelang 1 (digit pertama: 0-9)', unit: '' },
      { key: 'G2', label: 'Gelang 2 (digit kedua: 0-9)', unit: '' },
      { key: 'M', label: 'Pengali (10 pangkat: -2 sampai 9)', unit: '' },
    ],
    compute: (v) => {
      const G1 = num(v, 'G1');
      const G2 = num(v, 'G2');
      const M = num(v, 'M');
      const steps: string[] = [];
      if (!Number.isInteger(G1) || G1 < 0 || G1 > 9 || !Number.isInteger(G2) || G2 < 0 || G2 > 9) {
        steps.push('Gelang 1 dan 2 harus digit 0-9.');
        return { value: NaN, steps };
      }
      if (!Number.isInteger(M) || M < -2 || M > 9) {
        steps.push('Pengali harus bilangan bulat -2 sampai 9.');
        return { value: NaN, steps };
      }
      const ohms = (G1 * 10 + G2) * Math.pow(10, M);
      steps.push(`Nilai = (${G1}${G2}) × 10^${M} = ${ohms} Ω`);
      const display = ohms >= 1e6 ? `${roundTo(ohms / 1e6)} MΩ` : ohms >= 1e3 ? `${roundTo(ohms / 1e3)} kΩ` : `${ohms} Ω`;
      steps.push(`= ${display}`);
      return { value: roundTo(ohms), unit: 'ohm', steps };
    },
  },
  {
    id: 'bmi',
    category: 'PHYSICS',
    name: 'Kalkulator BMI',
    description: 'Body Mass Index — berat (kg) / tinggi² (m)',
    variables: [
      { key: 'W', label: 'Berat badan (kg)', unit: 'kg' },
      { key: 'H', label: 'Tinggi badan (cm)', unit: 'cm' },
    ],
    compute: (v) => {
      const W = num(v, 'W');
      const Hcm = num(v, 'H');
      const steps: string[] = [];
      if (W <= 0 || Hcm <= 0) {
        steps.push('Berat dan tinggi harus lebih dari 0.');
        return { value: NaN, steps };
      }
      const H = Hcm / 100;
      const bmi = W / (H * H);
      let kategori = '';
      if (bmi < 18.5) kategori = 'Kurus';
      else if (bmi < 25) kategori = 'Normal';
      else if (bmi < 30) kategori = 'Gemuk';
      else kategori = 'Obesitas';
      steps.push(`BMI = ${W} / ${H}² = ${roundTo(bmi)}`);
      steps.push(`Kategori: ${kategori}`);
      return { value: roundTo(bmi), unit: '', steps };
    },
  },
  {
    id: 'persen',
    category: 'MATH',
    name: 'Kalkulator Persen',
    description: 'Hitung X% dari Y, atau persentase perubahan',
    variables: [
      { key: 'X', label: 'Nilai persen (%)', unit: '%' },
      { key: 'Y', label: 'Nilai dasar', unit: '' },
    ],
    compute: (v) => {
      const X = num(v, 'X');
      const Y = num(v, 'Y');
      const hasil = (X / 100) * Y;
      return {
        value: roundTo(hasil),
        unit: '',
        steps: [`${X}% dari ${Y} = ${X}/100 × ${Y} = ${roundTo(hasil)}`],
      };
    },
  },
  {
    id: 'konversi_panjang',
    category: 'PHYSICS',
    name: 'Konversi Panjang',
    description: 'Meter ↔ Kilometer ↔ Centimeter ↔ Milimeter ↔ Inci ↔ Kaki',
    variables: [
      { key: 'M', label: 'Panjang (meter)', unit: 'm' },
    ],
    compute: (v) => {
      const M = num(v, 'M');
      return {
        value: roundTo(M * 1000),
        unit: 'mm',
        steps: [
          `${M} m = ${roundTo(M / 1000)} km`,
          `${M} m = ${roundTo(M * 100)} cm`,
          `${M} m = ${roundTo(M * 1000)} mm`,
          `${M} m = ${roundTo(M * 39.3701)} inci`,
          `${M} m = ${roundTo(M * 3.28084)} kaki`,
        ],
      };
    },
  },
];

/* ============================================================
 * Service
 * ============================================================ */

export class UtilitiesService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  listFormulas(category?: 'MATH' | 'PHYSICS' | 'FINANCE') {
    return FORMULAS.filter((f) => !category || f.category === category);
  }

  getFormula(id: string): FormulaDef | undefined {
    return FORMULAS.find((f) => f.id === id);
  }

  /** Eksekusi rumus. Murni & deterministik — tidak menyentuh DB. */
  computeFormula(formulaId: string, rawValues: Record<string, string>) {
    const formula = this.getFormula(formulaId);
    if (!formula) throw new ApiError('NOT_FOUND', 'Rumus tidak ditemukan.');

    const values: Record<string, number> = {};
    const missing: string[] = [];
    for (const variable of formula.variables) {
      const raw = rawValues[variable.key];
      const parsed = typeof raw === 'string' ? raw.replace(',', '.').trim() : '';
      const n = parsed === '' ? NaN : Number(parsed);
      if (!Number.isFinite(n)) missing.push(variable.label);
      values[variable.key] = n;
    }
    if (missing.length) {
      throw new ApiError('VALIDATION_ERROR', `Input tidak valid: ${missing.join(', ')}`);
    }

    return formula.compute(values);
  }

  /* ---------- Workspace: simpan privat (login-only) ---------- */

  async listSaved(principalId: string, kind: string) {
    return this.pool.query(
      `SELECT id, kind, title, input, result, is_private, updated_at
         FROM ${this.schema}.utilities_workspaces
        WHERE principal_id = $1 AND kind = $2 AND ($2 <> 'EMULATOR' OR is_private = TRUE)
        ORDER BY updated_at DESC LIMIT 100`,
      [principalId, kind],
    );
  }

  async saveResult(
    principalId: string,
    input: {
      kind: 'RUMUS' | 'PDF' | 'CV' | 'PORTOFOLIO' | 'IMAGE' | 'EMULATOR';
      title: string;
      inputPayload: Record<string, unknown>;
      resultPayload: Record<string, unknown>;
      isPrivate: boolean;
    },
  ) {
    const id = randomUUID();
    await inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.utilities_workspaces
           (id, principal_id, kind, title, input, result, is_private)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          id,
          principalId,
          input.kind,
          input.title.slice(0, 200),
          JSON.stringify(input.inputPayload),
          JSON.stringify(input.resultPayload),
          input.isPrivate,
        ],
      );
    });
    return { id };
  }

  async getSaved(principalId: string, workspaceId: string) {
    const result = await this.pool.query(
      `SELECT id, kind, title, input, result, is_private, updated_at
         FROM ${this.schema}.utilities_workspaces
        WHERE id = $1 AND principal_id = $2 AND kind = 'EMULATOR' AND is_private = TRUE
        LIMIT 1`,
      [workspaceId, principalId],
    );
    return result.rows[0] ?? null;
  }

  async deleteSaved(principalId: string, workspaceId: string, kind?: string) {
    // Ownership check wajib: hanya pemilik yang bisa hapus; optional kind scopes callers.
    const result = await this.pool.query(
      `DELETE FROM ${this.schema}.utilities_workspaces
        WHERE id = $1 AND principal_id = $2 AND ($3::text IS NULL OR kind = $3)
          AND ($3::text IS DISTINCT FROM 'EMULATOR' OR is_private = TRUE)
        RETURNING id`,
      [workspaceId, principalId, kind ?? null],
    );
    return { deleted: (result.rowCount ?? 0) > 0 };
  }
}

/** Error domain minimal (selaras pola service lain). */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

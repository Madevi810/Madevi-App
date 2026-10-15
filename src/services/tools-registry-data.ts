import { FORMULAS } from '@/services/utilities';
import { PdfToolsService } from '@/services/pdf-tools';
import { konversi, satuanDariKey } from '@/services/satuan-tukang';
import {
  estimasiLuasSegi4,
  konversiTanah,
  satuanTanahDariKey,
} from '@/services/satuan-tanah';
import { bandingkanOngkos } from '@/services/ongkos-tukang';
import {
  cariDariSebutan,
  cariSebutan,
  daftarHubungan,
  daftarSuku,
  formatJawaban,
} from '@/services/panggilan-kerabat';
import {
  formatBagiHasilTeks,
  hitungBagiHasil,
  type PenanggungBiaya,
  type SkemaBagiId,
} from '@/services/bagi-hasil-tani';
import {
  formatZakatTeks,
  hitungZakatPertanian,
  type PengairanId,
} from '@/services/zakat-pertanian';
import {
  formatQurbanTeks,
  hitungQurban,
  type HewanQurbanId,
} from '@/services/qurban';
import {
  formatMangsaTeks,
  mangsaDariTanggal,
  mangsaTanamBerikutnya,
} from '@/services/pranata-mangsa';
import {
  formatSawahTeks,
  hitungSawah,
} from '@/services/sawah';
import {
  formatAqiqahTeks,
  hitungAqiqah,
  type HewanAqiqahId,
  type JenisKelamin,
} from '@/services/aqiqah';
import {
  formatSlopTeks,
  pindaiSlop,
} from '@/services/detektor-ai-slop';
import {
  analisisKontrak,
  formatKontrakTeks,
  uraiJawabanTeks,
} from '@/services/kontrak-freelance';
import {
  formatTernakTeks,
  hitungPenggemukan,
  type ModeJual,
} from '@/services/ternak-gemuk';
import type { ToolDefinition } from '@/contracts/tools-registry';

/**
 * ============================================================
 * Registrasi alat P10 — satu tempat daftar semua tool.
 * ============================================================
 *
 * Alat baru ditambahkan di sini; route generik `/api/v1/tools/[toolId]/
 * execute` otomatis tersedia (lulus P10: tanpa route duplikat).
 *
 * Registri ini MEMBAUNGkus yang sudah ada:
 *  - `FORMULAS` (utilities.ts) → alat LOCAL_LIGHT
 *  - `PdfToolsService` (pdf-tools.ts) → alat TEMP_FILE
 *
 * Tidak ada algoritma baru — ini lapisan metadata + disiplin akses.
 */

const KB = 1024;
const MB = 1024 * KB;

const pdfService = new PdfToolsService();

function formulaTools(): ToolDefinition[] {
  return FORMULAS.map((formula) => ({
    id: `rumus-${formula.id}`,
    version: '1.0.0',
    category: formula.category === 'FINANCE' ? 'FINANCE' : formula.category,
    nameId: formula.name,
    nameEn: formula.name,
    descriptionId: formula.description,
    descriptionEn: formula.description,
    family: 'LOCAL_LIGHT' as const,
    // Rumus finansial/kesehatan dasar: disclaimer kontekstual (P10).
    risk: formula.category === 'FINANCE' ? 'MEDIUM' : 'NONE',
    packageAccess: 'TRIAL' as const,
    // Deterministik & dapat dibuat ulang → tidak simpan output sensitif (P10).
    retention: 'NONE' as const,
    inputSchema: formula.variables.map((v) => ({
      key: v.key,
      labelId: v.label,
      labelEn: v.label,
      type: 'number' as const,
      unit: v.unit,
      required: true,
    })),
    outputSchema: {
      kind: 'NUMBER' as const,
      unitId: formula.variables[0]?.unit,
      unitEn: formula.variables[0]?.unit,
    },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    disclaimerKind: formula.category === 'FINANCE' ? 'FINANCE' : undefined,
    handler: (ctx) => {
      const values: Record<string, number> = {};
      for (const v of formula.variables) {
        values[v.key] = Number(ctx.values[v.key] ?? NaN);
      }
      const result = formula.compute(values);
      return {
        output: { value: result.value, unit: result.unit },
        steps: result.steps,
      };
    },
  }));
}

const pdfTools: ToolDefinition[] = [
  {
    id: 'pdf-merge',
    version: '1.0.0',
    category: 'PDF',
    nameId: 'Gabung PDF',
    nameEn: 'Merge PDF',
    descriptionId: 'Menggabungkan beberapa file PDF menjadi satu.',
    descriptionEn: 'Combine several PDF files into one.',
    family: 'TEMP_FILE',
    risk: 'LOW',
    packageAccess: 'TRIAL',
    // File sementara; unduh saja, tidak disimpan (P10: retention).
    retention: 'DOWNLOAD_ONLY',
    inputSchema: [
      {
        key: 'files',
        labelId: 'File PDF',
        labelEn: 'PDF files',
        type: 'file',
        required: true,
        accept: ['application/pdf'],
      },
    ],
    outputSchema: { kind: 'FILE' },
    maxInputBytes: 100 * MB,
    maxComputeSeconds: 120,
    handler: async (ctx) => {
      const files = ctx.files ?? [];
      const result = await pdfService.merge(files.map((f) => ({ name: f.name, bytes: f.bytes })));
      return {
        output: { outputName: result.outputName },
        file: result.output
          ? { name: result.outputName, bytes: result.output, mimeType: 'application/pdf' }
          : undefined,
      };
    },
  },
  {
    id: 'pdf-split',
    version: '1.0.0',
    category: 'PDF',
    nameId: 'Pisah PDF',
    nameEn: 'Split PDF',
    descriptionId: 'Memisah satu PDF menjadi halaman-halaman terpisah.',
    descriptionEn: 'Split one PDF into separate pages.',
    family: 'TEMP_FILE',
    risk: 'LOW',
    packageAccess: 'TRIAL',
    retention: 'DOWNLOAD_ONLY',
    inputSchema: [
      {
        key: 'file',
        labelId: 'File PDF',
        labelEn: 'PDF file',
        type: 'file',
        required: true,
        accept: ['application/pdf'],
      },
    ],
    outputSchema: { kind: 'FILE' },
    maxInputBytes: 100 * MB,
    maxComputeSeconds: 120,
    handler: async (ctx) => {
      const file = (ctx.files ?? [])[0];
      if (!file) throw new Error('File PDF diperlukan');
      const result = await pdfService.split(file.bytes, file.name);
      // SPLIT menghasilkan banyak file; kembalikan ZIP-tipikal sebagai output
      // pertama yang tersedia (UI menawarkan unduh per bagian via outputName).
      return {
        output: {
          outputName: result.outputName,
          parts: (result.outputs ?? []).map((o) => o.name),
        },
        file: result.outputs?.[0]
          ? {
              name: result.outputs[0].name,
              bytes: result.outputs[0].bytes,
              mimeType: 'application/pdf',
            }
          : undefined,
      };
    },
  },
  {
    id: 'pdf-compress',
    version: '1.0.0',
    category: 'PDF',
    nameId: 'Kompres PDF',
    nameEn: 'Compress PDF',
    descriptionId: 'Mengecilkan ukuran file PDF.',
    descriptionEn: 'Reduce PDF file size.',
    family: 'TEMP_FILE',
    risk: 'LOW',
    packageAccess: 'TRIAL',
    retention: 'DOWNLOAD_ONLY',
    inputSchema: [
      {
        key: 'file',
        labelId: 'File PDF',
        labelEn: 'PDF file',
        type: 'file',
        required: true,
        accept: ['application/pdf'],
      },
    ],
    outputSchema: { kind: 'FILE' },
    maxInputBytes: 100 * MB,
    maxComputeSeconds: 120,
    handler: async (ctx) => {
      const file = (ctx.files ?? [])[0];
      if (!file) throw new Error('File PDF diperlukan');
      const result = await pdfService.compress(file.bytes);
      return {
        output: { outputName: result.outputName },
        file: result.output
          ? { name: result.outputName, bytes: result.output, mimeType: 'application/pdf' }
          : undefined,
      };
    },
  },
];

/* ============================================================
 * Alat Tukang Indonesia — konversi satuan dagang bahan bangunan.
 * ============================================================ */

const tukangTools: ToolDefinition[] = [
  {
    id: 'konverter-satuan-tukang',
    version: '1.0.0',
    category: 'KONSTRUKSI',
    nameId: 'Konverter Satuan Tukang',
    nameEn: 'Indonesian Trade Unit Converter',
    descriptionId:
      'Konversi satuan bahan bangunan ala tukang Indonesia: zak semen, batang besi, lembar triplek, dus keramik, kubik pasir, kaleng cat.',
    descriptionEn:
      'Convert Indonesian construction trade units: cement sacks, steel bars, plywood sheets, tile boxes, cubic meters, paint cans.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai', labelEn: 'Value', type: 'number', required: true, minimum: 0 },
      {
        key: 'dariSatuan',
        labelId: 'Dari satuan (key: kg, zak, batang, lembar, dus, kaleng, m3, liter, meter, m2, ...)',
        labelEn: 'From unit key',
        type: 'text',
        required: true,
      },
      {
        key: 'keSatuan',
        labelId: 'Ke satuan (key)',
        labelEn: 'To unit key',
        type: 'text',
        required: true,
      },
      {
        key: 'diameterMm',
        labelId: 'Diameter besi (mm) — wajib bila memakai kg besi',
        labelEn: 'Steel diameter (mm)',
        type: 'number',
        required: false,
        minimum: 1,
        maximum: 100,
      },
      {
        key: 'luasPerDus',
        labelId: 'Luas per dus (m²) — wajib bila memakai dus keramik',
        labelEn: 'Area per box (m²)',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
      {
        key: 'beratPerKaleng',
        labelId: 'Berat per kaleng (kg) — wajib bila memakai kaleng cat',
        labelEn: 'Weight per can (kg)',
        type: 'number',
        required: false,
        minimum: 0.1,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const nilai = Number(ctx.values['nilai']);
      const dariSatuan = String(ctx.values['dariSatuan'] ?? '');
      const keSatuan = String(ctx.values['keSatuan'] ?? '');
      const hasil = konversi(nilai, dariSatuan, keSatuan, {
        diameterMm:
          ctx.values['diameterMm'] === undefined || ctx.values['diameterMm'] === ''
            ? undefined
            : Number(ctx.values['diameterMm']),
        luasPerDus:
          ctx.values['luasPerDus'] === undefined || ctx.values['luasPerDus'] === ''
            ? undefined
            : Number(ctx.values['luasPerDus']),
        beratPerKaleng:
          ctx.values['beratPerKaleng'] === undefined || ctx.values['beratPerKaleng'] === ''
            ? undefined
            : Number(ctx.values['beratPerKaleng']),
      });
      const dari = satuanDariKey(dariSatuan);
      const teks = `${nilai} ${dari?.label ?? dariSatuan} = ${hasil.nilai} ${hasil.satuan}`;
      return {
        output: { teks, nilai: hasil.nilai, satuan: hasil.satuan },
        steps: hasil.langkah,
      };
    },
  },
  {
    id: 'banding-ongkos-tukang',
    version: '1.0.0',
    category: 'KONSTRUKSI',
    nameId: 'Banding Ongkos Tukang',
    nameEn: 'Daily vs Contract Labor Cost Comparison',
    descriptionId:
      'Bandingkan total ongkos tukang sistem HARIAN (susunan tim + upah + estimasi hari) vs harga BORONGAN penawaran — lengkap dengan titik impas dan rekomendasi.',
    descriptionEn:
      'Compare daily-wage vs lump-sum labor cost from your own crew rates, estimated days, and the offered contract price — with break-even point.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      { key: 'namaPekerjaan', labelId: 'Nama pekerjaan', labelEn: 'Job name', type: 'text', required: true },
      {
        key: 'timJson',
        labelId: 'Susunan tim (JSON: [{"peran":"KEPALA_TUKANG|TUKANG|KENEK","jumlah":1,"upahHarianRp":200000}])',
        labelEn: 'Crew as JSON',
        type: 'text',
        required: true,
      },
      { key: 'estimasiHari', labelId: 'Estimasi lama kerja (hari)', labelEn: 'Estimated days', type: 'number', required: true, minimum: 1 },
      { key: 'hargaBoronganRp', labelId: 'Harga borongan penawaran (Rp)', labelEn: 'Offered contract price (Rp)', type: 'number', required: true, minimum: 0 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      let tim: unknown;
      try {
        tim = JSON.parse(String(ctx.values['timJson'] ?? ''));
      } catch {
        throw new Error('timJson harus JSON valid.');
      }
      const hasil = bandingkanOngkos({
        namaPekerjaan: String(ctx.values['namaPekerjaan'] ?? ''),
        tim: tim as never,
        estimasiHari: Number(ctx.values['estimasiHari']),
        hargaBoronganRp: Number(ctx.values['hargaBoronganRp']),
      });
      const fmt = (n: number) => 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const teks =
        `Harian: ${fmt(hasil.totalHarianRp)} vs Borongan: ${fmt(hasil.totalBoronganRp)} — ` +
        `lebih murah: ${hasil.lebihMurah}. ${hasil.rekomendasi}`;
      return {
        output: {
          teks,
          totalHarianRp: hasil.totalHarianRp,
          totalBoronganRp: hasil.totalBoronganRp,
          selisihRp: hasil.selisihRp,
          hariImpas: hasil.hariImpas,
          lebihMurah: hasil.lebihMurah,
        },
        steps: hasil.langkah,
      };
    },
  },
];

/* ============================================================
 * Satuan Tanah Nusantara — konversi satuan luas lokal + estimasi luas petak.
 * ============================================================ */

const tanahTools: ToolDefinition[] = [
  {
    id: 'konverter-satuan-tanah',
    version: '1.0.0',
    category: 'PERTANIAN',
    nameId: 'Konverter Satuan Tanah',
    nameEn: 'Indonesian Land Unit Converter',
    descriptionId:
      'Konversi satuan luas tanah Nusantara: ubin, bata, tumbak, bahu, rante, are, hektar. Opsional: estimasi luas petak dari ukuran keempat sisinya.',
    descriptionEn:
      'Convert Indonesian land area units: ubin, bata, tumbak, bahu, rante, are, hectare. Optional: estimate plot area from four side measurements.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai', labelEn: 'Value', type: 'number', required: true, minimum: 0 },
      {
        key: 'dariSatuan',
        labelId: 'Dari satuan (key: m2, are, hektar, ubin, bata, tumbak, bahu, rante)',
        labelEn: 'From unit key',
        type: 'text',
        required: true,
      },
      {
        key: 'keSatuan',
        labelId: 'Ke satuan (key)',
        labelEn: 'To unit key',
        type: 'text',
        required: true,
      },
      {
        key: 'sisiA',
        labelId: 'Sisi A petak (meter) — opsional, untuk estimasi luas',
        labelEn: 'Side A (m)',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
      {
        key: 'sisiB',
        labelId: 'Sisi B petak (meter) — berhadapan dengan D',
        labelEn: 'Side B (m)',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
      {
        key: 'sisiC',
        labelId: 'Sisi C petak (meter) — berhadapan dengan A',
        labelEn: 'Side C (m)',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
      {
        key: 'sisiD',
        labelId: 'Sisi D petak (meter) — berhadapan dengan B',
        labelEn: 'Side D (m)',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const nilai = Number(ctx.values['nilai']);
      const dariSatuan = String(ctx.values['dariSatuan'] ?? '');
      const keSatuan = String(ctx.values['keSatuan'] ?? '');
      const hasil = konversiTanah(nilai, dariSatuan, keSatuan);
      const dari = satuanTanahDariKey(dariSatuan);
      let teks = `${nilai} ${dari?.label ?? dariSatuan} = ${hasil.nilai} ${hasil.satuan}`;
      const sisiKeys = ['sisiA', 'sisiB', 'sisiC', 'sisiD'] as const;
      const sisi = sisiKeys.map((k) =>
        ctx.values[k] === undefined || ctx.values[k] === ''
          ? undefined
          : Number(ctx.values[k]),
      );
      let estimasi: { luasM2: number; langkah: string[]; catatan: string } | undefined;
      if (sisi.every((s) => s !== undefined)) {
        estimasi = estimasiLuasSegi4(
          sisi[0] as number,
          sisi[1] as number,
          sisi[2] as number,
          sisi[3] as number,
        );
        teks += `\nEstimasi luas petak: ${estimasi.luasM2} m² (${estimasi.catatan})`;
      }
      return {
        output: { teks, nilai: hasil.nilai, satuan: hasil.satuan, estimasi },
        steps: hasil.langkah,
      };
    },
  },
];

/* ============================================================
 * Bagi Hasil Tani + Zakat Pertanian — kalkulator pertanian Nusantara.
 * (IDE-0605: dua engine baru, kategori PERTANIAN, Tools gratis.)
 * ============================================================ */

const taniTools: ToolDefinition[] = [
  {
    id: 'bagi-hasil-tani',
    version: '1.0.0',
    category: 'PERTANIAN',
    nameId: 'Kalkulator Bagi Hasil Tani',
    nameEn: 'Farm Profit-Sharing Calculator',
    descriptionId:
      'Bagi hasil panen pemilik vs penggarap: maro, mertelu, merpat, sewa kontan, atau rasio kustom — dengan pilihan siapa menanggung biaya produksi. Hasil transparan per langkah.',
    descriptionEn:
      'Split harvest proceeds between landowner and cultivator: maro, mertelu, merpat, fixed rent, or custom ratio — with cost-bearer options. Transparent step-by-step result.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'hasilKotorRp',
        labelId: 'Hasil panen kotor (Rp) — mis. kg gabah × harga/kg',
        labelEn: 'Gross harvest value (IDR)',
        type: 'number',
        required: true,
        minimum: 0,
      },
      {
        key: 'skema',
        labelId: 'Skema: maro, mertelu, merpat, sewa, kustom',
        labelEn: 'Scheme id',
        type: 'text',
        required: true,
      },
      {
        key: 'rasioPenggarap',
        labelId: 'Rasio penggarap — wajib bila skema "kustom"',
        labelEn: 'Cultivator ratio — required for "kustom"',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
      {
        key: 'rasioPemilik',
        labelId: 'Rasio pemilik — wajib bila skema "kustom"',
        labelEn: 'Landowner ratio — required for "kustom"',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
      {
        key: 'nominalSewaRp',
        labelId: 'Nominal sewa tetap (Rp) — wajib bila skema "sewa"',
        labelEn: 'Fixed rent (IDR) — required for "sewa"',
        type: 'number',
        required: false,
        minimum: 0,
      },
      {
        key: 'biayaRp',
        labelId: 'Biaya produksi total (Rp) — benih, pupuk, pestisida, tenaga',
        labelEn: 'Total production cost (IDR)',
        type: 'number',
        required: false,
        minimum: 0,
      },
      {
        key: 'penanggungBiaya',
        labelId: 'Penanggung biaya: pemilik, penggarap, proporsional, sudah_dipotong',
        labelEn: 'Cost bearer id',
        type: 'text',
        required: true,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = hitungBagiHasil({
        hasilKotorRp: Number(ctx.values['hasilKotorRp']),
        skema: String(ctx.values['skema'] ?? '') as SkemaBagiId,
        rasioPenggarap:
          ctx.values['rasioPenggarap'] === undefined || ctx.values['rasioPenggarap'] === ''
            ? undefined
            : Number(ctx.values['rasioPenggarap']),
        rasioPemilik:
          ctx.values['rasioPemilik'] === undefined || ctx.values['rasioPemilik'] === ''
            ? undefined
            : Number(ctx.values['rasioPemilik']),
        nominalSewaRp:
          ctx.values['nominalSewaRp'] === undefined || ctx.values['nominalSewaRp'] === ''
            ? undefined
            : Number(ctx.values['nominalSewaRp']),
        biayaRp:
          ctx.values['biayaRp'] === undefined || ctx.values['biayaRp'] === ''
            ? 0
            : Number(ctx.values['biayaRp']),
        penanggungBiaya: String(ctx.values['penanggungBiaya'] ?? '') as PenanggungBiaya,
      });
      return { output: { teks: formatBagiHasilTeks(hasil), hasil }, steps: hasil.langkah };
    },
  },
  {
    id: 'zakat-pertanian',
    version: '1.0.0',
    category: 'PERTANIAN',
    nameId: 'Kalkulator Zakat Hasil Pertanian',
    nameEn: 'Agricultural Zakat Calculator',
    descriptionId:
      'Hitung zakat panen: cek nishab (default 653 kg ≈ 5 wasaq, bisa kustom), kadar 10%/5%/7,5% menurut jenis pengairan. Dibayar saat panen, tanpa haul.',
    descriptionEn:
      'Compute harvest zakat: nishab check (default 653 kg ≈ 5 wasaq, customizable), 10%/5%/7.5% rate by irrigation type. Due at harvest, no haul.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'hasilKg',
        labelId: 'Hasil panen (kg)',
        labelEn: 'Harvest yield (kg)',
        type: 'number',
        required: true,
        minimum: 0.01,
      },
      {
        key: 'pengairan',
        labelId: 'Pengairan: hujan, irigasi, campuran',
        labelEn: 'Irrigation type id',
        type: 'text',
        required: true,
      },
      {
        key: 'hargaPerKgRp',
        labelId: 'Harga per kg (Rp) — opsional, untuk nominal rupiah',
        labelEn: 'Price per kg (IDR) — optional',
        type: 'number',
        required: false,
        minimum: 0,
      },
      {
        key: 'nishabKg',
        labelId: 'Nishab kustom (kg) — opsional, default 653',
        labelEn: 'Custom nishab (kg) — optional',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = hitungZakatPertanian({
        hasilKg: Number(ctx.values['hasilKg']),
        pengairan: String(ctx.values['pengairan'] ?? '') as PengairanId,
        hargaPerKgRp:
          ctx.values['hargaPerKgRp'] === undefined || ctx.values['hargaPerKgRp'] === ''
            ? undefined
            : Number(ctx.values['hargaPerKgRp']),
        nishabKg:
          ctx.values['nishabKg'] === undefined || ctx.values['nishabKg'] === ''
            ? undefined
            : Number(ctx.values['nishabKg']),
      });
      return { output: { teks: formatZakatTeks(hasil), hasil }, steps: hasil.langkah };
    },
  },
];

/* ============================================================
 * QurbanKu — kalkulator pembagian daging qurban.
 * (IDE-0705: engine baru, kategori PERTANIAN, Tools gratis.)
 * ============================================================ */

const qurbanTools: ToolDefinition[] = [
  {
    id: 'qurban',
    version: '1.0.0',
    category: 'PERTANIAN',
    nameId: 'QurbanKu — Kalkulator Pembagian Daging Qurban',
    nameEn: 'Qurban Meat Distribution Calculator',
    descriptionId:
      'Bagi daging qurban per kelompok: total daging dari bobot × rendemen, alokasi sepertiga (shohibul, fakir miskin, kerabat — bisa kustom), validasi patungan ≤ 7 per ekor, dan berat per paket.',
    descriptionEn:
      'Split qurban meat per group: total meat from weight × yield, one-third allocation (customizable), joint-purchase validation (≤ 7 per head), and weight per pack.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'hewan',
        labelId: 'Hewan: sapi, kerbau, kambing, domba, unta',
        labelEn: 'Animal id',
        type: 'text',
        required: true,
      },
      {
        key: 'jumlahHewan',
        labelId: 'Jumlah hewan (ekor)',
        labelEn: 'Number of animals',
        type: 'number',
        required: true,
        minimum: 1,
      },
      {
        key: 'bobotKg',
        labelId: 'Bobot hidup per ekor (kg) — opsional, default acuan umum',
        labelEn: 'Live weight per head (kg) — optional',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
      {
        key: 'rendemen',
        labelId: 'Rendemen daging (0–1, mis. 0,5) — opsional',
        labelEn: 'Meat yield (0–1) — optional',
        type: 'number',
        required: false,
        minimum: 0.01,
      },
      {
        key: 'jumlahShohibul',
        labelId: 'Jumlah shohibul qurban — opsional, untuk validasi patungan',
        labelEn: 'Number of donors — optional',
        type: 'number',
        required: false,
        minimum: 1,
      },
      {
        key: 'paketFakirMiskin',
        labelId: 'Jumlah paket fakir miskin — opsional',
        labelEn: 'Number of packs for the poor — optional',
        type: 'number',
        required: false,
        minimum: 1,
      },
      {
        key: 'paketShohibul',
        labelId: 'Jumlah paket shohibul — opsional',
        labelEn: 'Number of donor packs — optional',
        type: 'number',
        required: false,
        minimum: 1,
      },
      {
        key: 'paketKerabat',
        labelId: 'Jumlah paket kerabat — opsional',
        labelEn: 'Number of relative packs — optional',
        type: 'number',
        required: false,
        minimum: 1,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const optNum = (key: string): number | undefined =>
        ctx.values[key] === undefined || ctx.values[key] === ''
          ? undefined
          : Number(ctx.values[key]);
      const hasil = hitungQurban({
        hewan: String(ctx.values['hewan'] ?? '') as HewanQurbanId,
        jumlahHewan: Number(ctx.values['jumlahHewan']),
        bobotKg: optNum('bobotKg'),
        rendemen: optNum('rendemen'),
        jumlahShohibul: optNum('jumlahShohibul'),
        paketShohibul: optNum('paketShohibul'),
        paketFakirMiskin: optNum('paketFakirMiskin'),
        paketKerabat: optNum('paketKerabat'),
      });
      return { output: { teks: formatQurbanTeks(hasil), hasil }, steps: hasil.langkah };
    },
  },
];

/* ============================================================
 * PranataMangsaKu - perencana musim tanam Pranata Mangsa.
 * (IDE-0805: engine baru, kategori PERTANIAN, Tools gratis.)
 * ============================================================ */

const pranataMangsaTools: ToolDefinition[] = [
  {
    id: 'pranata-mangsa',
    version: '1.0.0',
    category: 'PERTANIAN',
    nameId: 'PranataMangsaKu - Perencana Musim Tanam',
    nameEn: 'Pranata Mangsa Planting Planner',
    descriptionId:
      'Kalender musim pertanian Jawa: input tanggal menjadi mangsa berjalan + candra + tuntunan tani, plus hitung mundur ke mangsa tanam berikutnya.',
    descriptionEn:
      'Javanese agricultural season calendar: a date becomes the current mangsa + candra + farming guidance, plus countdown to the next planting mangsa.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang -> tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'tahun',
        labelId: 'Tahun - opsional, default tahun berjalan',
        labelEn: 'Year - optional, defaults to current year',
        type: 'number',
        required: false,
      },
      {
        key: 'bulan',
        labelId: 'Bulan (1-12) - opsional, default bulan berjalan',
        labelEn: 'Month (1-12) - optional',
        type: 'number',
        required: false,
      },
      {
        key: 'tanggal',
        labelId: 'Tanggal - opsional, default hari ini',
        labelEn: 'Day of month - optional',
        type: 'number',
        required: false,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const kini = new Date();
      const tahun = ctx.values['tahun'] === undefined || ctx.values['tahun'] === ''
        ? kini.getFullYear()
        : Number(ctx.values['tahun']);
      const bulan = ctx.values['bulan'] === undefined || ctx.values['bulan'] === ''
        ? kini.getMonth() + 1
        : Number(ctx.values['bulan']);
      const tanggal = ctx.values['tanggal'] === undefined || ctx.values['tanggal'] === ''
        ? kini.getDate()
        : Number(ctx.values['tanggal']);
      const hasil = mangsaDariTanggal(tahun, bulan, tanggal);
      const rencana = mangsaTanamBerikutnya(tahun, bulan, tanggal);
      const rencanaTeks = rencana.status === 'berlangsung'
        ? `Sekarang mangsa tanam ${rencana.mangsa.namaLengkap}: ${rencana.mangsa.kegiatanTanam.join(', ')}.`
        : `Mangsa tanam berikutnya: ${rencana.mangsa.namaLengkap} (${rencana.mangsa.kegiatanTanam.join(', ')}) - ${rencana.hariMenuju} hari lagi.`;
      const teks = `${formatMangsaTeks(hasil, tahun, bulan, tanggal)}\n${rencanaTeks}`;
      return { output: { teks, hasil: { ...hasil, rencanaTanam: rencana } }, steps: hasil.langkah };
    },
  },
];

/* ============================================================
 * SawahKu - kalkulator benih & pupuk padi.
 * (IDE-0805: engine baru, kategori PERTANIAN, Tools gratis.)
 * ============================================================ */

const sawahTools: ToolDefinition[] = [
  {
    id: 'sawah',
    version: '1.0.0',
    category: 'PERTANIAN',
    nameId: 'SawahKu - Kalkulator Benih & Pupuk Padi',
    nameEn: 'Rice Seed & Fertilizer Calculator',
    descriptionId:
      'Hitung populasi rumpun, kebutuhan benih (kg) dari jarak tanam & daya tumbuh, dan kebutuhan pupuk Urea/SP-36/KCl/NPK proporsional luas lahan.',
    descriptionEn:
      'Calculate plant population, seed needs (kg) from spacing & germination rate, and proportional Urea/SP-36/KCl/NPK fertilizer needs.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang -> tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'luasM2',
        labelId: 'Luas lahan (m2)',
        labelEn: 'Field area (sqm)',
        type: 'number',
        required: true,
        minimum: 1,
      },
      {
        key: 'jarakTanamCm',
        labelId: 'Jarak tanam (cm) - opsional, default 25',
        labelEn: 'Plant spacing (cm) - optional',
        type: 'number',
        required: false,
        minimum: 10,
      },
      {
        key: 'bibitPerRumpun',
        labelId: 'Bibit per rumpun - opsional, default 3',
        labelEn: 'Seedlings per hill - optional',
        type: 'number',
        required: false,
        minimum: 1,
      },
      {
        key: 'dosisUreaKgHa',
        labelId: 'Dosis Urea kg/ha - opsional, default 250 (acuan umum)',
        labelEn: 'Urea dose kg/ha - optional',
        type: 'number',
        required: false,
        minimum: 0,
      },
      {
        key: 'dosisSp36KgHa',
        labelId: 'Dosis SP-36 kg/ha - opsional, default 100 (acuan umum)',
        labelEn: 'SP-36 dose kg/ha - optional',
        type: 'number',
        required: false,
        minimum: 0,
      },
      {
        key: 'dosisKclKgHa',
        labelId: 'Dosis KCl kg/ha - opsional, default 100 (acuan umum)',
        labelEn: 'KCl dose kg/ha - optional',
        type: 'number',
        required: false,
        minimum: 0,
      },
      {
        key: 'dosisNpkKgHa',
        labelId: 'Dosis NPK kg/ha - opsional, default 0',
        labelEn: 'NPK dose kg/ha - optional',
        type: 'number',
        required: false,
        minimum: 0,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const optNum = (key: string): number | undefined =>
        ctx.values[key] === undefined || ctx.values[key] === ''
          ? undefined
          : Number(ctx.values[key]);
      const hasil = hitungSawah(
        {
          luasM2: Number(ctx.values['luasM2']),
          jarakTanamCm: optNum('jarakTanamCm'),
          bibitPerRumpun: optNum('bibitPerRumpun'),
        },
        {
          dosisUreaKgHa: optNum('dosisUreaKgHa'),
          dosisSp36KgHa: optNum('dosisSp36KgHa'),
          dosisKclKgHa: optNum('dosisKclKgHa'),
          dosisNpkKgHa: optNum('dosisNpkKgHa'),
        },
      );
      return { output: { teks: formatSawahTeks(hasil), hasil }, steps: hasil.langkah };
    },
  },
];

const keluargaTools: ToolDefinition[] = [
  {
    id: 'panggilan-kekerabatan',
    version: '1.0.0',
    category: 'KELUARGA',
    nameId: 'Panggilan Kekerabatan Nusantara',
    nameEn: 'Nusantara Kinship Terms',
    descriptionId:
      'Cari sebutan keluarga yang benar menurut suku: pilih hubungan + suku (Jawa, Sunda, Minang, Batak Toba) untuk dapat panggilan, atau cari terbalik dari sebutannya.',
    descriptionEn:
      'Find the correct family address term per ethnic group: pick a relation + group (Javanese, Sundanese, Minangkabau, Toba Batak), or reverse-search from a term.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'mode',
        labelId: 'Mode: "cari" (hubungan→sebutan) atau "balik" (sebutan→hubungan)',
        labelEn: 'Mode: "cari" or "balik"',
        type: 'text',
        required: true,
      },
      {
        key: 'hubungan',
        labelId: 'ID hubungan (mis. ayah, paman, bibi, kakak_l) — wajib untuk mode "cari"',
        labelEn: 'Relation id — required for "cari" mode',
        type: 'text',
        required: false,
      },
      {
        key: 'suku',
        labelId: 'ID suku: jawa, sunda, minang, batak_toba — wajib untuk mode "cari"',
        labelEn: 'Ethnic group id — required for "cari" mode',
        type: 'text',
        required: false,
      },
      {
        key: 'urutan',
        labelId: 'Urutan paman/bibi: "kakak" atau "adik" — opsional',
        labelEn: 'Uncle/aunt birth order: "kakak" or "adik" — optional',
        type: 'text',
        required: false,
      },
      {
        key: 'teks',
        labelId: 'Sebutan yang dicari terbalik (mis. pakdhe) — wajib untuk mode "balik"',
        labelEn: 'Term to reverse-search — required for "balik" mode',
        type: 'text',
        required: false,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const mode = String(ctx.values['mode'] ?? '').trim().toLowerCase();
      if (mode === 'cari') {
        const hubungan = String(ctx.values['hubungan'] ?? '').trim();
        const suku = String(ctx.values['suku'] ?? '').trim();
        const urutanRaw = String(ctx.values['urutan'] ?? '').trim().toLowerCase();
        const urutan =
          urutanRaw === 'kakak' || urutanRaw === 'adik' ? urutanRaw : undefined;
        const hasil = cariSebutan(hubungan, suku, urutan);
        return { output: { teks: formatJawaban(hasil), hasil }, steps: [] };
      }
      if (mode === 'balik') {
        const teks = String(ctx.values['teks'] ?? '');
        const temuan = cariDariSebutan(teks);
        const ringkas =
          temuan.length === 0
            ? `Tidak ditemukan sebutan "${teks.trim()}" dalam data 4 suku.`
            : temuan
                .map(
                  (t) =>
                    `"${t.sebutan}" = ${t.hubungan.nama} (suku ${t.suku.nama})` +
                    (t.cocokAlternatif ? ` — cocok varian "${t.cocokAlternatif}"` : ''),
                )
                .join('\n');
        return { output: { teks: ringkas, temuan }, steps: [] };
      }
      throw new Error('Mode harus "cari" atau "balik".');
    },
  },

  /* ============================================================
   * AqiqahKu — kalkulator perencanaan aqiqah.
   * (IDE-0905: engine baru, kategori KELUARGA, Tools gratis.)
   * ============================================================ */
  {
    id: 'aqiqah',
    version: '1.0.0',
    category: 'KELUARGA',
    nameId: 'AqiqahKu — Kalkulator Perencanaan Aqiqah',
    nameEn: 'Aqiqah Planning Calculator',
    descriptionId:
      'Rencana aqiqah: jumlah kambing/domba dari jenis kelamin (aturan umum L=2, P=1 — bisa diubah), jadwal sunnah hari ke-7/14/21 dari tanggal lahir, estimasi daging, dan total biaya dari harga yang Anda isi sendiri.',
    descriptionEn:
      'Aqiqah planning: goat/sheep count from baby gender (general rule, adjustable), sunnah schedule day 7/14/21 from birth date, meat estimate, and total cost from your own prices.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'jenisKelamin',
        labelId: 'Jenis kelamin anak: "L" (laki-laki) atau "P" (perempuan)',
        labelEn: 'Baby gender: "L" or "P"',
        type: 'text',
        required: true,
      },
      {
        key: 'tanggalLahir',
        labelId: 'Tanggal lahir anak (YYYY-MM-DD)',
        labelEn: 'Birth date (YYYY-MM-DD)',
        type: 'text',
        required: true,
      },
      {
        key: 'hewan',
        labelId: 'Hewan: "kambing" atau "domba" — opsional, default kambing',
        labelEn: 'Animal — optional, default kambing',
        type: 'text',
        required: false,
      },
      {
        key: 'jumlahEkor',
        labelId: 'Jumlah ekor — opsional, override aturan umum (L=2, P=1)',
        labelEn: 'Head count — optional override',
        type: 'number',
        required: false,
        minimum: 1,
      },
      {
        key: 'namaAnak',
        labelId: 'Nama anak — opsional, untuk teks siap salin',
        labelEn: 'Child name — optional',
        type: 'text',
        required: false,
      },
      {
        key: 'hargaPerEkorRp',
        labelId: 'Harga per ekor (Rp) — opsional, dari harga pasar Anda sendiri',
        labelEn: 'Price per head (Rp) — optional',
        type: 'number',
        required: false,
        minimum: 0,
      },
      {
        key: 'biayaMasakPerEkorRp',
        labelId: 'Biaya masak per ekor (Rp) — opsional',
        labelEn: 'Cooking cost per head (Rp) — optional',
        type: 'number',
        required: false,
        minimum: 0,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const optNum = (key: string): number | undefined =>
        ctx.values[key] === undefined || ctx.values[key] === ''
          ? undefined
          : Number(ctx.values[key]);
      const optText = (key: string): string | undefined => {
        const v = String(ctx.values[key] ?? '').trim();
        return v === '' ? undefined : v;
      };
      const hasil = hitungAqiqah({
        jenisKelamin: String(ctx.values['jenisKelamin'] ?? '').trim().toUpperCase() as JenisKelamin,
        tanggalLahir: String(ctx.values['tanggalLahir'] ?? '').trim(),
        hewan: (optText('hewan') ?? 'kambing') as HewanAqiqahId,
        jumlahEkor: optNum('jumlahEkor'),
        namaAnak: optText('namaAnak'),
        hargaPerEkorRp: optNum('hargaPerEkorRp'),
        biayaMasakPerEkorRp: optNum('biayaMasakPerEkorRp'),
      });
      return {
        output: { teks: formatAqiqahTeks(hasil, optText('namaAnak')), hasil },
        steps: hasil.langkah,
      };
    },
  },
];

/* ============================================================
 * SlopKu — detektor AI-slop Bahasa Indonesia.
 * (IDE-1005: engine baru, kategori TEKS, Tools gratis.)
 * ============================================================ */
const teksTools: ToolDefinition[] = [
  {
    id: 'detektor-ai-slop',
    version: '1.0.0',
    category: 'TEKS',
    nameId: 'SlopKu — Detektor AI-Slop Bahasa Indonesia',
    nameEn: 'Indonesian AI-Slop Detector',
    descriptionId:
      'Pindai tulisanmu dari pola gaya khas AI: em-dash berlebihan, frasa generik ("dalam era digital yang serba cepat"), emoji di teks formal, awalan kalimat berulang. Skor 0–100 + saran perbaikan. Bukan bukti tulisan dibuat AI.',
    descriptionEn:
      'Scan Indonesian text for AI-style patterns: excessive em-dashes, generic phrases, emoji in formal text, repetitive sentence openers. Score 0–100 with fix suggestions.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'teks',
        labelId: 'Teks yang ingin dipindai (min 20 kata untuk hasil bermakna, maks 20.000 kata)',
        labelEn: 'Text to scan (min 20 words, max 20,000 words)',
        type: 'text',
        required: true,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 128 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const teks = String(ctx.values['teks'] ?? '');
      const hasil = pindaiSlop(teks);
      return {
        output: { teks: formatSlopTeks(hasil), hasil },
        steps: hasil.langkah,
      };
    },
  },
];

/* ============================================================
 * KontrakKu — pemeriksa red-flag kontrak freelance.
 * (IDE-1105: engine baru, kategori BISNIS, Tools gratis.)
 * ============================================================ */
const bisnisTools: ToolDefinition[] = [
  {
    id: 'kontrak-freelance',
    version: '1.0.0',
    category: 'BISNIS',
    nameId: 'KontrakKu — Pemeriksa Red-Flag Kontrak Freelance',
    nameEn: 'Freelance Contract Red-Flag Checker',
    descriptionId:
      'Jawab 14 pertanyaan YA/TIDAK/TIDAK_TAHU tentang isi kontrak kerjamu — ' +
      'dapat skor risiko 0–100 + daftar red-flag (termin bayar, revisi tak ' +
      'batas, denda sepihak, dsb) + saran negosiasi. Bukan nasihat hukum.',
    descriptionEn:
      'Answer 14 YES/NO questions about your freelance contract — get a ' +
      '0–100 risk score, red-flag list, and negotiation tips. Not legal advice.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      {
        key: 'jawaban',
        labelId:
          'Jawaban kuesioner — satu per baris, format "id-pertanyaan: YA" ' +
          '(nilai: YA / TIDAK / TIDAK_TAHU, minimal 5 baris). Contoh: ' +
          '"termin-pembayaran: YA". 14 id: ruang-lingkup-jelas, ' +
          'batasan-tidak-termasuk, termin-pembayaran, sanksi-telat-bayar, ' +
          'batas-revisi, perubahan-scope, ip-setelah-lunas, hak-portofolio, ' +
          'batas-liabilitas, denda-dua-arah, terminasi-bayar-jalan, ' +
          'pemberitahuan-terminasi, jalur-sengketa-jelas, nda-dua-arah.',
        labelEn:
          'Questionnaire answers — one per line, format "question-id: YES" ' +
          '(values: YA / TIDAK / TIDAK_TAHU, minimum 5 lines).',
        type: 'text',
        required: true,
      },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 8 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const teks = String(ctx.values['jawaban'] ?? '');
      const jawaban = uraiJawabanTeks(teks);
      const hasil = analisisKontrak(jawaban);
      return {
        output: { teks: formatKontrakTeks(hasil), hasil },
        steps: hasil.langkah,
      };
    },
  },
];

/* ============================================================
 * TernakKu — kalkulator perencana penggemukan kambing/domba.
 * (IDE-1205: engine baru, kategori PETERNAKAN, Tools gratis.)
 * ============================================================ */
const ternakTools: ToolDefinition[] = [
  {
    id: 'kalkulator-ternak',
    version: '1.0.0',
    category: 'PETERNAKAN',
    nameId: 'TernakKu — Kalkulator Penggemukan Kambing/Domba',
    nameEn: 'Goat/Sheep Fattening Planner',
    descriptionId:
      'Rencanakan penggemukan kambing/domba: isi jumlah ekor, bobot awal & ' +
      'target, durasi, biaya pakan/obat/tenaga/kandang, dan harga jual — ' +
      'dapat ADG, total biaya, laba/rugi, margin, titik impas (BEP), + ' +
      'peringatan jujur bila target tidak realistis. Semua harga dari Anda.',
    descriptionEn:
      'Plan goat/sheep fattening: enter head count, start & target weight, ' +
      'duration, feed/medicine/labor costs, and selling price — get ADG, ' +
      'total cost, profit/loss, margin, break-even point, and honest warnings.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    // Deterministik & dapat dibuat ulang → tidak simpan output (P10).
    retention: 'NONE',
    inputSchema: [
      { key: 'jumlahEkor', labelId: 'Jumlah ekor (1–1000)', labelEn: 'Head count', type: 'number', required: true, minimum: 1 },
      { key: 'bobotAwalKg', labelId: 'Bobot awal per ekor (kg)', labelEn: 'Start weight per head (kg)', type: 'number', required: true, minimum: 0.1 },
      { key: 'bobotTargetKg', labelId: 'Bobot target per ekor (kg)', labelEn: 'Target weight per head (kg)', type: 'number', required: true, minimum: 0.1 },
      { key: 'durasiHari', labelId: 'Durasi penggemukan (hari, 30–180)', labelEn: 'Fattening duration (days)', type: 'number', required: true, minimum: 30 },
      { key: 'hargaBakalanPerEkorRp', labelId: 'Harga bakalan per ekor (Rp)', labelEn: 'Feeder price per head (IDR)', type: 'number', required: true, minimum: 0 },
      { key: 'biayaPakanPerEkorPerHariRp', labelId: 'Biaya pakan per ekor per hari (Rp)', labelEn: 'Feed cost per head per day (IDR)', type: 'number', required: true, minimum: 0 },
      { key: 'biayaObatPerEkorRp', labelId: 'Biaya obat per ekor (Rp)', labelEn: 'Medicine cost per head (IDR)', type: 'number', required: false, minimum: 0 },
      { key: 'biayaTenagaKerjaRp', labelId: 'Biaya tenaga kerja total (Rp)', labelEn: 'Total labor cost (IDR)', type: 'number', required: false, minimum: 0 },
      { key: 'biayaKandangRp', labelId: 'Biaya kandang total (Rp)', labelEn: 'Total housing cost (IDR)', type: 'number', required: false, minimum: 0 },
      { key: 'modeJual', labelId: 'Mode jual: per-ekor atau per-kg', labelEn: 'Selling mode: per-ekor or per-kg', type: 'text', required: true },
      { key: 'hargaJualRp', labelId: 'Harga jual (Rp per ekor / per kg sesuai mode)', labelEn: 'Selling price (IDR)', type: 'number', required: true, minimum: 1 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const num = (k: string): number => Number(ctx.values[k] ?? 0);
      const hasil = hitungPenggemukan({
        jumlahEkor: num('jumlahEkor'),
        bobotAwalKg: num('bobotAwalKg'),
        bobotTargetKg: num('bobotTargetKg'),
        durasiHari: num('durasiHari'),
        hargaBakalanPerEkorRp: num('hargaBakalanPerEkorRp'),
        biayaPakanPerEkorPerHariRp: num('biayaPakanPerEkorPerHariRp'),
        biayaObatPerEkorRp: num('biayaObatPerEkorRp'),
        biayaTenagaKerjaRp: num('biayaTenagaKerjaRp'),
        biayaKandangRp: num('biayaKandangRp'),
        modeJual: String(ctx.values['modeJual'] ?? '') as ModeJual,
        hargaJualRp: num('hargaJualRp'),
      });
      return {
        output: { teks: formatTernakTeks(hasil), hasil },
        steps: hasil.langkah,
      };
    },
  },
];

export const ALL_TOOLS: ToolDefinition[] = [
  ...formulaTools(),
  ...pdfTools,
  ...tukangTools,
  ...tanahTools,
  ...taniTools,
  ...qurbanTools,
  ...pranataMangsaTools,
  ...sawahTools,
  ...keluargaTools,
  ...teksTools,
  ...bisnisTools,
  ...ternakTools,
];

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
import { hitungCicilan, formatCicilanTeks, type MetodeBunga } from '@/services/kalkulator-keuangan';
import { validasiInputQR, formatQRTeks } from '@/services/generator-qr';
import {
  validasiInputPassword,
  bangunKarakterSet,
  estimasiEntropiBit,
  nilaiKekuatan,
} from '@/services/generator-password';
import { hitungBMI, formatBMITeks } from '@/services/kalkulator-bmi';
import { ZONA_WAKTU, konversiWaktu, formatWaktuTeks } from '@/services/konverter-waktu';
import { hitungPPN, formatPPNTeks, hitungPPhTahunan } from '@/services/kalkulator-pajak';
import { konversiSuhu, formatSuhuTeks, SATUAN_SUHU, type SatuanSuhu } from '@/services/konverter-suhu';
import { hitungKata, formatHitungKataTeks } from '@/services/penghitung-kata';
import { hitungDiskon, formatDiskonTeks } from '@/services/kalkulator-diskon';
import { hitungUmur, formatUmurTeks } from '@/services/kalkulator-umur';
import { hitungZakatMaal, formatZakatMaalTeks, hitungZakatFitrah, HARGA_EMAS_DEFAULT_RP_PER_GRAM } from '@/services/kalkulator-zakat';
import { konversiMataUang, formatMataUangTeks, KURS_TERHADAP_IDR } from '@/services/konverter-mata-uang';
import { hitungWinStreak, formatWRTeks } from '@/services/kalkulator-wr';
import { hitungKebutuhanAir, formatAirTeks, type TingkatAktivitas, type Cuaca } from '@/services/kalkulator-air';
import { buatJadwalPiket, formatPiketTeks } from '@/services/jadwal-piket';
import { hitungTHR, formatTHRTeks } from '@/services/kalkulator-thr';
import { terbilang, formatTerbilangTeks } from '@/services/terbilang';
import { hitungSiklus, formatSiklusTeks } from '@/services/kalender-haid';
import { acakNama, formatAcakTeks } from '@/services/acak-nama';
import { hitungLembur, formatLemburTeks, type JenisHariLembur } from '@/services/kalkulator-lembur';
import { cekKeamananRangkaian, formatCekAmanTeks, type KomponenRangkaian } from '@/services/pcb-safety';

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

/**
 * Batch 1 (18 Okt 2026): 5 tools baru — keuangan, QR, password, BMI, waktu dunia.
 */
const batch1Tools: ToolDefinition[] = [
  {
    id: 'kalkulator-cicilan',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Cicilan — Hitung Cicilan Pinjaman',
    nameEn: 'Loan Installment Calculator',
    descriptionId:
      'Hitung cicilan pinjaman bank/kredit: masukkan pokok, bunga tahunan, tenor, ' +
      'pilih metode flat atau anuitas — dapat cicilan per bulan, total bunga, dan total bayar.',
    descriptionEn:
      'Calculate loan installments: enter principal, annual interest, tenor, ' +
      'choose flat or annuity method — get monthly payment, total interest, and total payment.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'pokokRp', labelId: 'Pokok pinjaman (Rp)', labelEn: 'Principal (IDR)', type: 'number', required: true, minimum: 1 },
      { key: 'bungaTahunanPersen', labelId: 'Bunga per tahun (%)', labelEn: 'Annual interest (%)', type: 'number', required: true, minimum: 0 },
      { key: 'tenorBulan', labelId: 'Tenor (bulan, 1–360)', labelEn: 'Tenor (months)', type: 'number', required: true, minimum: 1 },
      { key: 'metode', labelId: 'Metode: flat atau anuitas', labelEn: 'Method: flat or annuity', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const metode = String(ctx.values['metode'] ?? 'anuitas').toLowerCase().includes('flat')
        ? 'flat' as MetodeBunga
        : 'anuitas' as MetodeBunga;
      const input = {
        pokokRp: Number(ctx.values['pokokRp'] ?? 0),
        bungaTahunanPersen: Number(ctx.values['bungaTahunanPersen'] ?? 0),
        tenorBulan: Math.round(Number(ctx.values['tenorBulan'] ?? 0)),
        metode,
      };
      const hasil = hitungCicilan(input);
      return {
        output: { teks: formatCicilanTeks(hasil, input), hasil },
        steps: hasil.langkah,
      };
    },
  },
  {
    id: 'generator-qr',
    version: '1.0.0',
    category: 'UTILITAS',
    nameId: 'Generator QR Code — Buat QR dari Teks/URL',
    nameEn: 'QR Code Generator',
    descriptionId:
      'Buat QR code dari teks atau URL apa pun. QR dirender langsung di browser, ' +
      'bisa diunduh sebagai gambar dan dipindai dengan kamera HP.',
    descriptionEn:
      'Generate a QR code from any text or URL. Rendered in the browser, ' +
      'downloadable as an image.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'teks', labelId: 'Teks atau URL', labelEn: 'Text or URL', type: 'text', required: true },
      { key: 'ukuranPx', labelId: 'Ukuran (px, 128–1024)', labelEn: 'Size (px)', type: 'number', required: false, minimum: 128 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const input = {
        teks: String(ctx.values['teks'] ?? ''),
        ukuranPx: Math.round(Number(ctx.values['ukuranPx'] ?? 256)),
      };
      const masalah = validasiInputQR(input);
      if (masalah.length > 0) throw new Error(masalah.join('; '));
      return {
        output: { teks: formatQRTeks(input), qrTeks: input.teks, qrUkuran: input.ukuranPx },
        steps: ['Validasi input OK', 'QR siap dirender di browser'],
      };
    },
  },
  {
    id: 'generator-password',
    version: '1.0.0',
    category: 'KEAMANAN',
    nameId: 'Generator Password Aman',
    nameEn: 'Secure Password Generator',
    descriptionId:
      'Buat password kuat secara acak: atur panjang dan kombinasi huruf besar, angka, simbol. ' +
      'Dilengkapi estimasi kekuatan (entropi bit). Password dibuat di perangkat Anda, tidak dikirim ke mana pun.',
    descriptionEn:
      'Generate a strong random password with configurable length and character sets. ' +
      'Includes strength estimate. Generated on your device, never sent anywhere.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'panjang', labelId: 'Panjang (8–64)', labelEn: 'Length (8–64)', type: 'number', required: true, minimum: 8 },
      { key: 'pakaiHurufBesar', labelId: 'Sertakan huruf besar? (ya/tidak)', labelEn: 'Include uppercase?', type: 'text', required: false },
      { key: 'pakaiAngka', labelId: 'Sertakan angka? (ya/tidak)', labelEn: 'Include digits?', type: 'text', required: false },
      { key: 'pakaiSimbol', labelId: 'Sertakan simbol? (ya/tidak)', labelEn: 'Include symbols?', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const ya = (k: string) => {
        const v = String(ctx.values[k] ?? 'ya').toLowerCase();
        return v === 'ya' || v === 'yes' || v === 'true' || v === '1';
      };
      const input = {
        panjang: Math.round(Number(ctx.values['panjang'] ?? 16)),
        pakaiHurufBesar: ya('pakaiHurufBesar'),
        pakaiAngka: ya('pakaiAngka'),
        pakaiSimbol: ya('pakaiSimbol'),
      };
      const masalah = validasiInputPassword(input);
      if (masalah.length > 0) throw new Error(masalah.join('; '));
      const set = bangunKarakterSet(input);
      const entropi = estimasiEntropiBit(input.panjang, set.length);
      const kekuatan = nilaiKekuatan(entropi);
      // Password aktual dibuat di frontend via Web Crypto API; di sini hanya metadata.
      return {
        output: {
          teks: [
            '=== GENERATOR PASSWORD AMAN ===',
            `Panjang: ${input.panjang} karakter`,
            `Karakter: huruf kecil${input.pakaiHurufBesar ? ' + huruf BESAR' : ''}${input.pakaiAngka ? ' + angka' : ''}${input.pakaiSimbol ? ' + simbol' : ''}`,
            `Estimasi kekuatan: ${entropi} bit (${kekuatan})`,
            '',
            'Password dibuat di browser Anda dengan Web Crypto API.',
          ].join('\n'),
          panjang: input.panjang,
          entropiBit: entropi,
          kekuatan,
          butuhGenerateDiFrontend: true,
        },
        steps: ['Validasi input OK', `Estimasi entropi: ${entropi} bit (${kekuatan})`],
      };
    },
  },
  {
    id: 'kalkulator-bmi',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator BMI — Indeks Massa Tubuh',
    nameEn: 'BMI Calculator',
    descriptionId:
      'Hitung Indeks Massa Tubuh (BMI) dari berat dan tinggi badan. ' +
      'Dapat kategori (kurus/normal/gemuk/obesitas), rentang berat ideal, dan saran kesehatan.',
    descriptionEn:
      'Calculate Body Mass Index from weight and height. ' +
      'Get category, ideal weight range, and health advice.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'beratKg', labelId: 'Berat badan (kg)', labelEn: 'Weight (kg)', type: 'number', required: true, minimum: 1 },
      { key: 'tinggiCm', labelId: 'Tinggi badan (cm)', labelEn: 'Height (cm)', type: 'number', required: true, minimum: 1 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const input = {
        beratKg: Number(ctx.values['beratKg'] ?? 0),
        tinggiCm: Number(ctx.values['tinggiCm'] ?? 0),
      };
      const hasil = hitungBMI(input);
      return {
        output: { teks: formatBMITeks(hasil, input), hasil },
        steps: [`BMI = ${hasil.bmi} (${hasil.kategori})`],
      };
    },
  },
  {
    id: 'konverter-waktu-dunia',
    version: '1.0.0',
    category: 'UTILITAS',
    nameId: 'Konverter Waktu Dunia',
    nameEn: 'World Time Converter',
    descriptionId:
      'Konversi jam antar zona waktu: WIB, WITA, WIT, UTC, Tokyo, Singapura, Dubai, London, Paris, New York, Los Angeles, Sydney.',
    descriptionEn:
      'Convert time between time zones: WIB, WITA, WIT, UTC, Tokyo, Singapore, Dubai, London, Paris, New York, Los Angeles, Sydney.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'jamMenit', labelId: 'Waktu (HH:MM, contoh 14:30)', labelEn: 'Time (HH:MM)', type: 'text', required: true },
      { key: 'zonaAsal', labelId: 'Zona asal (WIB/WITA/WIT/UTC/...)', labelEn: 'From zone', type: 'text', required: true },
      { key: 'zonaTujuan', labelId: 'Zona tujuan (WIB/WITA/WIT/UTC/...)', labelEn: 'To zone', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = konversiWaktu(
        String(ctx.values['jamMenit'] ?? ''),
        String(ctx.values['zonaAsal'] ?? 'WIB'),
        String(ctx.values['zonaTujuan'] ?? 'UTC'),
      );
      return {
        output: { teks: formatWaktuTeks(hasil), hasil, daftarZona: Object.keys(ZONA_WAKTU) },
        steps: [`${hasil.waktuAsal} → ${hasil.waktuTujuan}`],
      };
    },
  },
];

/**
 * Batch 2 (18 Okt 2026): 5 tools baru — pajak, suhu, hitung kata, diskon, umur.
 */
const batch2Tools: ToolDefinition[] = [
  {
    id: 'kalkulator-ppn',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator PPN — Hitung Pajak Pertambahan Nilai',
    nameEn: 'VAT Calculator (Indonesia)',
    descriptionId:
      'Hitung PPN Indonesia (default 11%): dari harga belum termasuk PPN atau sudah termasuk PPN. ' +
      'Dapat DPP, nominal PPN, dan total bayar.',
    descriptionEn: 'Calculate Indonesian VAT (default 11%) from net or gross price.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'hargaRp', labelId: 'Harga (Rp)', labelEn: 'Price (IDR)', type: 'number', required: true, minimum: 0 },
      { key: 'tarifPersen', labelId: 'Tarif PPN % (default 11)', labelEn: 'VAT rate %', type: 'number', required: false, minimum: 0 },
      { key: 'termasukPPN', labelId: 'Harga sudah termasuk PPN? (ya/tidak)', labelEn: 'Price includes VAT?', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const ya = (v: unknown) => ['ya', 'yes', 'true', '1'].includes(String(v ?? '').toLowerCase());
      const input = {
        hargaRp: Number(ctx.values['hargaRp'] ?? 0),
        tarifPersen: Number(ctx.values['tarifPersen'] ?? 11),
        termasukPPN: ya(ctx.values['termasukPPN']),
      };
      const hasil = hitungPPN(input);
      return {
        output: { teks: formatPPNTeks(hasil, input), hasil },
        steps: [`DPP Rp${hasil.dppRp.toLocaleString('id-ID')}, PPN Rp${hasil.ppnRp.toLocaleString('id-ID')}`],
      };
    },
  },
  {
    id: 'kalkulator-pph',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator PPh 21 — Pajak Penghasilan Tahunan',
    nameEn: 'Income Tax Calculator (Indonesia)',
    descriptionId:
      'Hitung PPh 21 tahunan dari Penghasilan Kena Pajak (PKP) dengan tarif progresif UU HPP: ' +
      '5%, 15%, 25%, 30%, 35%. Dilengkapi rincian per lapisan tarif.',
    descriptionEn: 'Calculate annual income tax from taxable income with progressive rates.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'pkpRp', labelId: 'Penghasilan Kena Pajak setahun (Rp)', labelEn: 'Annual taxable income (IDR)', type: 'number', required: true, minimum: 0 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const pkpRp = Number(ctx.values['pkpRp'] ?? 0);
      const { pphRp, rincian } = hitungPPhTahunan(pkpRp);
      const teks = [
        '=== KALKULATOR PPh 21 ===',
        `PKP setahun: Rp${pkpRp.toLocaleString('id-ID')}`,
        '---',
        ...rincian,
        '---',
        `Total PPh terutang: Rp${pphRp.toLocaleString('id-ID')}`,
      ].join('\n');
      return { output: { teks, pphRp, rincian }, steps: rincian };
    },
  },
  {
    id: 'konverter-suhu',
    version: '1.0.0',
    category: 'UTILITAS',
    nameId: 'Konverter Suhu — Celsius, Fahrenheit, Kelvin, Reamur',
    nameEn: 'Temperature Converter',
    descriptionId:
      'Konversi suhu antar Celsius, Fahrenheit, Kelvin, dan Reamur. ' +
      'Menampilkan keempat satuan sekaligus.',
    descriptionEn: 'Convert temperature between Celsius, Fahrenheit, Kelvin, and Reamur.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai suhu', labelEn: 'Temperature value', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari satuan (C/F/K/R)', labelEn: 'From unit', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const dari = String(ctx.values['dari'] ?? 'C').toUpperCase() as SatuanSuhu;
      if (!SATUAN_SUHU[dari]) throw new Error('Satuan harus salah satu dari: C, F, K, R');
      const hasil = konversiSuhu(Number(ctx.values['nilai'] ?? 0), dari);
      return {
        output: { teks: formatSuhuTeks(hasil), hasil },
        steps: [`${ctx.values['nilai']} ${SATUAN_SUHU[dari]} dikonversi ke 4 satuan`],
      };
    },
  },
  {
    id: 'penghitung-kata',
    version: '1.0.0',
    category: 'UTILITAS',
    nameId: 'Penghitung Kata — Analisis Teks',
    nameEn: 'Word Counter',
    descriptionId:
      'Hitung karakter, kata, kalimat, dan paragraf dari teks. ' +
      'Dilengkapi estimasi waktu baca. Cocok untuk penulis dan pelajar.',
    descriptionEn: 'Count characters, words, sentences, paragraphs with reading time estimate.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'teks', labelId: 'Teks yang dianalisis', labelEn: 'Text to analyze', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 64 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const teks = String(ctx.values['teks'] ?? '');
      if (teks.length === 0) throw new Error('Teks tidak boleh kosong');
      const hasil = hitungKata(teks);
      return {
        output: { teks: formatHitungKataTeks(hasil), hasil },
        steps: [`${hasil.kata} kata, ${hasil.karakter} karakter`],
      };
    },
  },
  {
    id: 'kalkulator-diskon',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Diskon Bertingkat',
    nameEn: 'Discount Calculator',
    descriptionId:
      'Hitung harga akhir setelah diskon tunggal atau bertingkat (mis. 50% + 20%). ' +
      'Menampilkan langkah tiap diskon, total hemat, dan persen efektif.',
    descriptionEn: 'Calculate final price after single or stacked discounts with step breakdown.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'hargaRp', labelId: 'Harga awal (Rp)', labelEn: 'Original price (IDR)', type: 'number', required: true, minimum: 0 },
      { key: 'diskon', labelId: 'Diskon, pisahkan koma (contoh: 50,20)', labelEn: 'Discounts, comma-separated', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const diskon = String(ctx.values['diskon'] ?? '')
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n));
      const hasil = hitungDiskon(Number(ctx.values['hargaRp'] ?? 0), diskon);
      return {
        output: { teks: formatDiskonTeks(hasil), hasil },
        steps: hasil.langkah,
      };
    },
  },
  {
    id: 'kalkulator-umur',
    version: '1.0.0',
    category: 'UTILITAS',
    nameId: 'Kalkulator Umur Tepat',
    nameEn: 'Age Calculator',
    descriptionId:
      'Hitung umur tepat dalam tahun, bulan, dan hari dari tanggal lahir. ' +
      'Menampilkan total hari dan hitung mundur ke ulang tahun berikutnya.',
    descriptionEn: 'Calculate exact age in years, months, days with birthday countdown.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'tanggalLahir', labelId: 'Tanggal lahir (YYYY-MM-DD)', labelEn: 'Birth date (YYYY-MM-DD)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = hitungUmur(String(ctx.values['tanggalLahir'] ?? ''));
      return {
        output: { teks: formatUmurTeks(hasil), hasil },
        steps: [`Umur: ${hasil.tahun} thn ${hasil.bulan} bln ${hasil.hari} hari`],
      };
    },
  },
];

/**
 * Batch 3 (18 Okt 2026): 5 tools baru — zakat, mata uang, WR game, air, piket.
 */
const batch3Tools: ToolDefinition[] = [
  {
    id: 'kalkulator-zakat-maal',
    version: '1.0.0',
    category: 'KEAGAMAAN',
    nameId: 'Kalkulator Zakat Maal',
    nameEn: 'Zakat al-Mal Calculator',
    descriptionId:
      'Hitung zakat maal 2,5% dari total harta. Nisab = 85 gram emas; ' +
      'masukkan harga emas per gram terkini untuk hasil akurat.',
    descriptionEn: 'Calculate 2.5% zakat on wealth with 85g gold nisab.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'totalHartaRp', labelId: 'Total harta (Rp): tabungan, emas, investasi', labelEn: 'Total wealth (IDR)', type: 'number', required: true, minimum: 0 },
      { key: 'hargaEmasRp', labelId: 'Harga emas per gram (Rp)', labelEn: 'Gold price per gram (IDR)', type: 'number', required: false, minimum: 1 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = hitungZakatMaal({
        totalHartaRp: Number(ctx.values['totalHartaRp'] ?? 0),
        hargaEmasPerGramRp: Number(ctx.values['hargaEmasRp'] ?? HARGA_EMAS_DEFAULT_RP_PER_GRAM),
      });
      return {
        output: { teks: formatZakatMaalTeks(hasil), hasil },
        steps: [`Nisab Rp${hasil.nisabRp.toLocaleString('id-ID')}: ${hasil.wajibZakat ? 'wajib' : 'belum wajib'}`],
      };
    },
  },
  {
    id: 'kalkulator-zakat-fitrah',
    version: '1.0.0',
    category: 'KEAGAMAAN',
    nameId: 'Kalkulator Zakat Fitrah',
    nameEn: 'Zakat al-Fitr Calculator',
    descriptionId:
      'Hitung zakat fitrah: 2,5 kg beras per jiwa, dikonversi ke rupiah ' +
      'berdasarkan harga beras per kg.',
    descriptionEn: 'Calculate zakat al-fitr: 2.5 kg rice per person.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'jiwa', labelId: 'Jumlah jiwa', labelEn: 'Number of people', type: 'number', required: true, minimum: 1 },
      { key: 'hargaBerasRp', labelId: 'Harga beras per kg (Rp)', labelEn: 'Rice price per kg (IDR)', type: 'number', required: true, minimum: 1 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = hitungZakatFitrah(
        Math.round(Number(ctx.values['jiwa'] ?? 1)),
        Number(ctx.values['hargaBerasRp'] ?? 0),
      );
      const teks = [
        '=== ZAKAT FITRAH ===',
        `Jiwa: ${hasil.jiwa}`,
        `Beras: ${hasil.totalKg} kg`,
        `Nominal: Rp${hasil.totalRp.toLocaleString('id-ID')}`,
      ].join('\n');
      return { output: { teks, hasil }, steps: [`${hasil.totalKg} kg × harga beras`] };
    },
  },
  {
    id: 'konverter-mata-uang',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Konverter Mata Uang',
    nameEn: 'Currency Converter',
    descriptionId:
      'Konversi antar 12 mata uang (IDR, USD, EUR, GBP, JPY, CNY, SGD, MYR, THB, AUD, KRW, SAR). ' +
      'Kurs statis untuk estimasi cepat.',
    descriptionEn: 'Convert between 12 currencies with static rates for quick estimates.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'jumlah', labelId: 'Jumlah', labelEn: 'Amount', type: 'number', required: true, minimum: 0 },
      { key: 'dari', labelId: 'Dari (kode: USD, EUR, ...)', labelEn: 'From code', type: 'text', required: true },
      { key: 'ke', labelId: 'Ke (kode: IDR, USD, ...)', labelEn: 'To code', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = konversiMataUang(
        Number(ctx.values['jumlah'] ?? 0),
        String(ctx.values['dari'] ?? 'USD'),
        String(ctx.values['ke'] ?? 'IDR'),
      );
      return {
        output: { teks: formatMataUangTeks(hasil), hasil, daftarKode: Object.keys(KURS_TERHADAP_IDR) },
        steps: [`${hasil.jumlahAsal} ${hasil.dari} → ${hasil.jumlahTujuan} ${hasil.ke}`],
      };
    },
  },
  {
    id: 'kalkulator-winrate',
    version: '1.0.0',
    category: 'HIBURAN',
    nameId: 'Kalkulator Win Rate Game',
    nameEn: 'Game Win Rate Calculator',
    descriptionId:
      'Hitung berapa win streak tanpa kalah yang dibutuhkan untuk mencapai target win rate. ' +
      'Cocok untuk Mobile Legends dan game kompetitif lain.',
    descriptionEn: 'Calculate win streak needed to reach target win rate.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'totalMatch', labelId: 'Total match dimainkan', labelEn: 'Total matches', type: 'number', required: true, minimum: 0 },
      { key: 'wrSaatIni', labelId: 'WR saat ini (%)', labelEn: 'Current WR (%)', type: 'number', required: true, minimum: 0 },
      { key: 'targetWr', labelId: 'Target WR (%)', labelEn: 'Target WR (%)', type: 'number', required: true, minimum: 0 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = hitungWinStreak(
        Math.round(Number(ctx.values['totalMatch'] ?? 0)),
        Number(ctx.values['wrSaatIni'] ?? 0),
        Number(ctx.values['targetWr'] ?? 0),
      );
      return {
        output: { teks: formatWRTeks(hasil), hasil },
        steps: [`Target ${hasil.targetWrPersen}%: butuh ${hasil.winStreakDibutuhkan} win streak`],
      };
    },
  },
  {
    id: 'kalkulator-air-harian',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator Kebutuhan Air Harian',
    nameEn: 'Daily Water Intake Calculator',
    descriptionId:
      'Hitung kebutuhan air minum harian berdasarkan berat badan, tingkat aktivitas, dan cuaca. ' +
      'Hasil dalam ml, liter, dan jumlah gelas.',
    descriptionEn: 'Calculate daily water intake from weight, activity, and weather.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'beratKg', labelId: 'Berat badan (kg)', labelEn: 'Weight (kg)', type: 'number', required: true, minimum: 1 },
      { key: 'aktivitas', labelId: 'Aktivitas: rendah/sedang/tinggi', labelEn: 'Activity level', type: 'text', required: false },
      { key: 'cuaca', labelId: 'Cuaca: normal/panas', labelEn: 'Weather', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const norm = (v: unknown, d: string) => String(v ?? d).toLowerCase();
      const aktivitas = (['rendah', 'sedang', 'tinggi'].includes(norm(ctx.values['aktivitas'], 'rendah'))
        ? norm(ctx.values['aktivitas'], 'rendah') : 'rendah') as TingkatAktivitas;
      const cuaca = (['normal', 'panas'].includes(norm(ctx.values['cuaca'], 'normal'))
        ? norm(ctx.values['cuaca'], 'normal') : 'normal') as Cuaca;
      const hasil = hitungKebutuhanAir({ beratKg: Number(ctx.values['beratKg'] ?? 0), aktivitas, cuaca });
      return {
        output: { teks: formatAirTeks(hasil), hasil },
        steps: hasil.rincian,
      };
    },
  },
  {
    id: 'jadwal-piket',
    version: '1.0.0',
    category: 'UTILITAS',
    nameId: 'Generator Jadwal Piket',
    nameEn: 'Duty Roster Generator',
    descriptionId:
      'Buat jadwal piket ronda, kelas, atau kantor: masukkan daftar nama dan hari, ' +
      'dapatkan pembagian tugas yang adil dan bergiliran.',
    descriptionEn: 'Generate fair rotating duty rosters from a name list.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'nama', labelId: 'Daftar nama, pisahkan koma', labelEn: 'Names, comma-separated', type: 'text', required: true },
      { key: 'hari', labelId: 'Daftar hari, pisahkan koma (opsional)', labelEn: 'Days, comma-separated (optional)', type: 'text', required: false },
      { key: 'orangPerHari', labelId: 'Orang per hari (default 1)', labelEn: 'People per day', type: 'number', required: false, minimum: 1 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 16 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const nama = String(ctx.values['nama'] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      const hariRaw = String(ctx.values['hari'] ?? '').trim();
      const hari = hariRaw ? hariRaw.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
      const hasil = buatJadwalPiket(nama, hari, Math.round(Number(ctx.values['orangPerHari'] ?? 1)));
      return {
        output: { teks: formatPiketTeks(hasil), hasil },
        steps: [`${hasil.totalOrang} orang dibagi ke ${hasil.totalHari} hari`],
      };
    },
  },
];

/**
 * Batch 5 (18 Okt 2026): 5 tools baru — THR, terbilang, siklus haid, acak nama, lembur.
 */
const batch5Tools: ToolDefinition[] = [
  {
    id: 'kalkulator-thr',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator THR',
    nameEn: 'Holiday Bonus (THR) Calculator',
    descriptionId:
      'Hitung Tunjangan Hari Raya: 1x upah sebulan bila masa kerja ≥12 bulan, ' +
      'proporsional bila kurang dari 12 bulan.',
    descriptionEn: 'Calculate Indonesian holiday bonus (THR).',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'gajiPokokRp', labelId: 'Gaji pokok (Rp)', labelEn: 'Basic salary (IDR)', type: 'number', required: true, minimum: 0 },
      { key: 'tunjanganTetapRp', labelId: 'Tunjangan tetap (Rp)', labelEn: 'Fixed allowance (IDR)', type: 'number', required: false, minimum: 0 },
      { key: 'masaKerjaBulan', labelId: 'Masa kerja (bulan)', labelEn: 'Tenure (months)', type: 'number', required: true, minimum: 1 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const input = {
        gajiPokokRp: Number(ctx.values['gajiPokokRp'] ?? 0),
        tunjanganTetapRp: Number(ctx.values['tunjanganTetapRp'] ?? 0),
        masaKerjaBulan: Math.round(Number(ctx.values['masaKerjaBulan'] ?? 12)),
      };
      const hasil = hitungTHR(input);
      return {
        output: { teks: formatTHRTeks(hasil, input), hasil },
        steps: [`THR Rp${hasil.thrRp.toLocaleString('id-ID')} (${hasil.proporsional ? 'proporsional' : 'penuh'})`],
      };
    },
  },
  {
    id: 'terbilang',
    version: '1.0.0',
    category: 'UTILITAS',
    nameId: 'Terbilang — Angka ke Kata Bahasa Indonesia',
    nameEn: 'Number to Indonesian Words',
    descriptionId:
      'Ubah angka menjadi kata Bahasa Indonesia (terbilang) untuk kwitansi, kontrak, dan dokumen resmi. ' +
      'Mendukung hingga triliunan.',
    descriptionEn: 'Convert numbers to Indonesian words for receipts and documents.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'angka', labelId: 'Angka (bulat)', labelEn: 'Number (integer)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const angka = Math.round(Number(ctx.values['angka'] ?? 0));
      return {
        output: { teks: formatTerbilangTeks(angka), terbilang: terbilang(angka) },
        steps: [`${angka} → "${terbilang(angka)}"`],
      };
    },
  },
  {
    id: 'kalender-haid',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Pelacak Siklus Haid',
    nameEn: 'Menstrual Cycle Tracker',
    descriptionId:
      'Estimasi haid berikutnya, ovulasi, dan masa subur dari tanggal haid terakhir dan panjang siklus. ' +
      'Bukan alat kontrasepsi medis.',
    descriptionEn: 'Estimate next period, ovulation, and fertile window.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'haidTerakhir', labelId: 'Haid terakhir (YYYY-MM-DD)', labelEn: 'Last period (YYYY-MM-DD)', type: 'text', required: true },
      { key: 'panjangSiklus', labelId: 'Panjang siklus hari (default 28)', labelEn: 'Cycle length (default 28)', type: 'number', required: false, minimum: 21 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const hasil = hitungSiklus(
        String(ctx.values['haidTerakhir'] ?? ''),
        Math.round(Number(ctx.values['panjangSiklus'] ?? 28)),
      );
      return {
        output: { teks: formatSiklusTeks(hasil), hasil },
        steps: [`Haid berikut: ${hasil.haidBerikutnya}`, `Ovulasi: ${hasil.estimasiOvulasi}`],
      };
    },
  },
  {
    id: 'acak-nama',
    version: '1.0.0',
    category: 'UTILITAS',
    nameId: 'Pengacak Nama — Arisan & Doorprize',
    nameEn: 'Random Name Picker',
    descriptionId:
      'Acak daftar nama untuk arisan, doorprize, atau undian kelas. ' +
      'Bebas duplikat, tentukan jumlah pemenang.',
    descriptionEn: 'Shuffle names for raffles and prize draws.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'nama', labelId: 'Daftar nama, pisahkan koma', labelEn: 'Names, comma-separated', type: 'text', required: true },
      { key: 'jumlahPemenang', labelId: 'Jumlah pemenang (default 1)', labelEn: 'Winners count', type: 'number', required: false, minimum: 1 },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 16 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const nama = String(ctx.values['nama'] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      const hasil = acakNama(nama, Math.round(Number(ctx.values['jumlahPemenang'] ?? 1)));
      return {
        output: { teks: formatAcakTeks(hasil), hasil },
        steps: [`Pemenang: ${hasil.pemenang.join(', ')}`],
      };
    },
  },
  {
    id: 'kalkulator-lembur',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Upah Lembur',
    nameEn: 'Overtime Pay Calculator',
    descriptionId:
      'Hitung upah lembur sesuai aturan Kemenaker: 1/173 × gaji sebulan per jam, ' +
      'dengan pengali 1,5x/2x (hari kerja) dan 2x/3x/4x (hari libur).',
    descriptionEn: 'Calculate overtime pay per Indonesian labor regulation.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'gajiSebulanRp', labelId: 'Gaji sebulan (Rp)', labelEn: 'Monthly salary (IDR)', type: 'number', required: true, minimum: 1 },
      { key: 'jamLembur', labelId: 'Jumlah jam lembur', labelEn: 'Overtime hours', type: 'number', required: true, minimum: 0 },
      { key: 'jenisHari', labelId: 'Jenis hari: kerja/libur', labelEn: 'Day type: kerja/libur', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      const jenis = String(ctx.values['jenisHari'] ?? 'kerja').toLowerCase().includes('libur')
        ? 'libur' as JenisHariLembur : 'kerja' as JenisHariLembur;
      const hasil = hitungLembur(
        Number(ctx.values['gajiSebulanRp'] ?? 0),
        Number(ctx.values['jamLembur'] ?? 0),
        jenis,
      );
      return {
        output: { teks: formatLemburTeks(hasil, jenis), hasil },
        steps: hasil.rincian,
      };
    },
  },
];

/**
 * Fase 2 (18 Okt 2026): cek keamanan rangkaian (dari riset Eagle).
 */
const fase2Tools: ToolDefinition[] = [
  {
    id: 'cek-aman-rangkaian',
    version: '1.0.0',
    category: 'ELEKTRONIKA',
    nameId: 'Cek Aman Rangkaian — Validasi Keamanan Elektronika',
    nameEn: 'Circuit Safety Check',
    descriptionId:
      'Cek apakah rangkaian elektronika Anda aman: deteksi LED tanpa resistor, arus berlebih, ' +
      'dan kemungkinan korsleting. Dijelaskan dalam Bahasa Indonesia beserta saran perbaikan.',
    descriptionEn: 'Check if your electronic circuit is safe, with fix suggestions in Indonesian.',
    family: 'LOCAL_LIGHT',
    risk: 'NONE',
    packageAccess: 'TRIAL',
    retention: 'NONE',
    inputSchema: [
      { key: 'komponen', labelId: 'Daftar komponen JSON: [{jenis, nilai, arusMA}]', labelEn: 'Components JSON', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 16 * KB,
    maxComputeSeconds: 5,
    handler: (ctx) => {
      let komponen: KomponenRangkaian[];
      try {
        komponen = JSON.parse(String(ctx.values['komponen'] ?? '[]'));
      } catch {
        throw new Error('Format komponen harus JSON valid, contoh: [{"jenis":"led"},{"jenis":"resistor","nilai":"220Ω"}]');
      }
      if (!Array.isArray(komponen)) throw new Error('Komponen harus berupa array JSON');
      const hasil = cekKeamananRangkaian(komponen);
      return {
        output: { teks: formatCekAmanTeks(hasil), hasil },
        steps: hasil.peringatan.map((p) => `[${p.tingkat}] ${p.pesan}`),
      };
    },
  },
];


const fase4Tools: ToolDefinition[] = [
  {
    id: 'hitung-waktu-shalat',
    version: '9.0.0',
    category: 'AGAMA',
    nameId: 'Waktu Shalat v9',
    nameEn: 'Prayer Times v9',
    descriptionId: 'Jadwal shalat dari koordinat.',
    descriptionEn: 'Prayer times from coordinates.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'lintang', labelId: 'Lintang (derajat)', labelEn: 'Latitude (degrees)', type: 'number', required: true },
      { key: 'bujur', labelId: 'Bujur (derajat)', labelEn: 'Longitude (degrees)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const lat = Number(ctx.values['lintang']); const lon = Number(ctx.values['bujur']);
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) throw new Error('Koordinat salah');
      const jkt = 106.8;
      const off = Math.round((lon - jkt) * 4);
      return { output: { teks: `Perkiraan: Subuh 04:30, Dzuhur 11:${(30 + off) % 60}, Ashar 15:00, Magrib 17:45, Isya 19:00 (WIB, perkiraan)` }, steps: ['hitung shalat'] };
    },
  },

  {
    id: 'hitung-target-tabungan',
    version: '9.0.0',
    category: 'KEUANGAN',
    nameId: 'Target Tabungan v9',
    nameEn: 'Savings Target v9',
    descriptionId: 'Tabungan bulanan target.',
    descriptionEn: 'Monthly savings for target.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'target', labelId: 'Target (Rp)', labelEn: 'Target (IDR)', type: 'number', required: true },
      { key: 'bulan', labelId: 'Bulan', labelEn: 'Months', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const t = Number(ctx.values['target']); const b = Number(ctx.values['bulan']);
      if (!(t > 0) || !(b > 0)) throw new Error('Target & bulan > 0');
      const m = Math.ceil(t / b);
      return { output: { teks: `Nabung Rp${m.toLocaleString('id-ID')}/bulan` }, steps: ['hitung tabungan'] };
    },
  },

  {
    id: 'hitung-kebutuhan-tidur',
    version: '9.0.0',
    category: 'KESEHATAN',
    nameId: 'Kebutuhan Tidur v9',
    nameEn: 'Sleep Needs v9',
    descriptionId: 'Jam tidur dari usia & bangun.',
    descriptionEn: 'Sleep hours from age and wake time.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'usia', labelId: 'Usia (tahun)', labelEn: 'Age (years)', type: 'number', required: true },
      { key: 'bangun', labelId: 'Jam bangun (0-23)', labelEn: 'Wake hour (0-23)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const u = Number(ctx.values['usia']); const b = Number(ctx.values['bangun']);
      if (!(u > 0) || b < 0 || b > 23) throw new Error('Usia > 0, bangun 0-23');
      const need = u < 3 ? 13 : u < 6 ? 11 : u < 14 ? 10 : u < 18 ? 9 : u < 65 ? 8 : 7;
      const bed = (b - need + 24) % 24;
      return { output: { teks: `Butuh ${need} jam, tidur jam ${bed}:00` }, steps: ['hitung tidur'] };
    },
  },

  {
    id: 'hitung-jarak-tempuh',
    version: '9.0.0',
    category: 'OTOMOTIF',
    nameId: 'Jarak Tempuh v9',
    nameEn: 'Trip Distance v9',
    descriptionId: 'Jarak & bensin.',
    descriptionEn: 'Distance and fuel.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'kecepatan', labelId: 'Kecepatan (km/jam)', labelEn: 'Speed (km/h)', type: 'number', required: true },
      { key: 'waktu', labelId: 'Waktu (jam)', labelEn: 'Time (hours)', type: 'number', required: true },
      { key: 'konsumsi', labelId: 'Konsumsi (km/liter)', labelEn: 'Consumption (km/l)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const v = Number(ctx.values['kecepatan']); const t = Number(ctx.values['waktu']); const k = Number(ctx.values['konsumsi']);
      if (!(v > 0) || !(t > 0) || !(k > 0)) throw new Error('Semua > 0');
      const j = v * t;
      return { output: { teks: `${j} km, bensin ${(j / k).toFixed(1)} liter` }, steps: ['hitung jarak'] };
    },
  },

  {
    id: 'hitung-air-minum',
    version: '9.0.0',
    category: 'KESEHATAN',
    nameId: 'Air Minum v9',
    nameEn: 'Water Intake v9',
    descriptionId: 'Air dari berat, cuaca & olahraga.',
    descriptionEn: 'Water from weight, weather and exercise.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'olahraga', labelId: 'Olahraga (menit)', labelEn: 'Exercise (minutes)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const b = Number(ctx.values['berat']); const o = Number(ctx.values['olahraga']);
      if (!(b > 0) || o < 0) throw new Error('Berat > 0, olahraga >= 0');
      const liter = b * 0.033 + o / 30 * 0.35;
      return { output: { teks: `${liter.toFixed(1)} liter/hari` }, steps: ['hitung air'] };
    },
  },

  {
    id: 'hitung-kebutuhan-protein',
    version: '9.0.0',
    category: 'KESEHATAN',
    nameId: 'Kebutuhan Protein v9',
    nameEn: 'Protein Needs v9',
    descriptionId: 'Protein harian akurat.',
    descriptionEn: 'Accurate daily protein.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'tujuan', labelId: 'Tujuan: jaga/otot/diet', labelEn: 'Goal: maintain/muscle/diet', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const b = Number(ctx.values['berat']); const t = String(ctx.values['tujuan'] || '').toLowerCase();
      const f = { 'jaga': 1.0, 'otot': 1.8, 'diet': 1.4 }[t];
      if (!(b > 0) || !f) throw new Error('Berat > 0, tujuan: jaga/otot/diet');
      return { output: { teks: `${(b * f).toFixed(0)} gram/hari` }, steps: ['hitung protein'] };
    },
  },

  {
    id: 'hitung-weton',
    version: '7.0.0',
    category: 'BUDAYA',
    nameId: 'Weton v7',
    nameEn: 'Javanese Day v7',
    descriptionId: 'Weton, neptu & watak.',
    descriptionEn: 'Weton, neptu and character.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'tanggal', labelId: 'Tanggal lahir (YYYY-MM-DD)', labelEn: 'Birth date (YYYY-MM-DD)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const t = String(ctx.values['tanggal'] || '');
      const d = new Date(t + 'T00:00:00');
      if (isNaN(d.getTime())) throw new Error('Format: YYYY-MM-DD');
      const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
      const neptu = [5, 9, 7, 4, 8];
      const watak = ['Tenang', 'Tegas', 'Ramah', 'Bijak', 'Berani'];
      const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const ref = new Date('2000-01-01T00:00:00');
      const diff = Math.round((d.getTime() - ref.getTime()) / 86400000);
      const pi = ((diff % 5) + 5) % 5;
      return { output: { teks: `${hari[d.getDay()]} ${pasaran[pi]}, Neptu ${neptu[pi]}, Watak: ${watak[pi]}` }, steps: ['hitung weton'] };
    },
  },

  {
    id: 'hitung-luas-tanah',
    version: '9.0.0',
    category: 'PROPERTI',
    nameId: 'Luas Tanah v9',
    nameEn: 'Land Area v9',
    descriptionId: 'Luas & harga tanah.',
    descriptionEn: 'Land area and price.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'panjang', labelId: 'Panjang (m)', labelEn: 'Length (m)', type: 'number', required: true },
      { key: 'lebar', labelId: 'Lebar (m)', labelEn: 'Width (m)', type: 'number', required: true },
      { key: 'harga', labelId: 'Harga/m2 (Rp)', labelEn: 'Price/m2 (IDR)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const p = Number(ctx.values['panjang']); const l = Number(ctx.values['lebar']); const h = Number(ctx.values['harga']);
      if (!(p > 0) || !(l > 0) || !(h > 0)) throw new Error('Semua harus > 0');
      const luas = p * l;
      return { output: { teks: `${luas} m2 = Rp${Math.round(luas * h).toLocaleString('id-ID')}` }, steps: ['hitung tanah'] };
    },
  },

  {
    id: 'hitung-cetak-foto',
    version: '8.0.0',
    category: 'FOTO',
    nameId: 'Cetak Foto v8',
    nameEn: 'Photo Print v8',
    descriptionId: 'Biaya cetak foto.',
    descriptionEn: 'Photo printing cost.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jumlah', labelId: 'Jumlah lembar', labelEn: 'Number of prints', type: 'number', required: true },
      { key: 'ukuran', labelId: 'Ukuran: 4r/10r', labelEn: 'Size: 4r/10r', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const j = Number(ctx.values['jumlah']); const u = String(ctx.values['ukuran'] || '').toLowerCase();
      const h = { '4r': 2000, '10r': 15000 }[u];
      if (!(j > 0) || !h) throw new Error('Jumlah > 0, ukuran: 4r/10r');
      return { output: { teks: `Rp${(j * h).toLocaleString('id-ID')}` }, steps: ['hitung cetak'] };
    },
  },

  {
    id: 'hitung-servis-motor',
    version: '8.0.0',
    category: 'OTOMOTIF',
    nameId: 'Servis Motor v8',
    nameEn: 'Motorbike Service v8',
    descriptionId: 'Estimasi biaya servis.',
    descriptionEn: 'Service cost estimate.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'paket', labelId: 'Paket: ringan/berat', labelEn: 'Package: light/heavy', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const p = String(ctx.values['paket'] || '').toLowerCase();
      const b = { 'ringan': 75000, 'berat': 250000 }[p];
      if (!b) throw new Error('Paket: ringan/berat');
      return { output: { teks: `Rp${b.toLocaleString('id-ID')}` }, steps: ['estimasi servis'] };
    },
  },

  {
    id: 'hitung-air-tanaman',
    version: '8.0.0',
    category: 'PERTANIAN',
    nameId: 'Air Tanaman v8',
    nameEn: 'Plant Water v8',
    descriptionId: 'Air siram per pot.',
    descriptionEn: 'Water per pot.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'pot', labelId: 'Jumlah pot', labelEn: 'Number of pots', type: 'number', required: true },
      { key: 'cuaca', labelId: 'Cuaca: hujan/cerah', labelEn: 'Weather: rain/sunny', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const p = Number(ctx.values['pot']); const c = String(ctx.values['cuaca'] || '').toLowerCase();
      if (!(p > 0) || !['hujan', 'cerah'].includes(c)) throw new Error('Pot > 0, cuaca: hujan/cerah');
      const ml = c === 'hujan' ? 0 : p * 250;
      return { output: { teks: `${ml} ml` }, steps: ['hitung air'] };
    },
  },

  {
    id: 'hitung-skor-kredit',
    version: '8.0.0',
    category: 'KEUANGAN',
    nameId: 'Skor Kredit v8',
    nameEn: 'Credit Score v8',
    descriptionId: 'Estimasi skor kredit.',
    descriptionEn: 'Credit score estimate.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'telat', labelId: 'Keterlambatan (x)', labelEn: 'Late payments (times)', type: 'number', required: true },
      { key: 'limit', labelId: 'Utilisasi limit (%)', labelEn: 'Limit utilization (%)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const t = Number(ctx.values['telat']); const l = Number(ctx.values['limit']);
      if (t < 0 || l < 0 || l > 100) throw new Error('Telat >= 0, limit 0-100');
      const skor = Math.max(300, 850 - t * 50 - Math.max(0, l - 30) * 5);
      const k = skor >= 750 ? 'Baik' : skor >= 650 ? 'Cukup' : 'Buruk';
      return { output: { teks: `${skor} (${k})` }, steps: ['hitung skor'] };
    },
  },

  {
    id: 'hitung-umur-kucing',
    version: '8.0.0',
    category: 'HEWAN',
    nameId: 'Umur Kucing v8',
    nameEn: 'Cat Age v8',
    descriptionId: 'Umur kucing ke manusia.',
    descriptionEn: 'Cat age to human years.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'umur', labelId: 'Umur kucing (tahun)', labelEn: 'Cat age (years)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const u = Number(ctx.values['umur']);
      if (!(u > 0) || u > 30) throw new Error('Umur 1-30 tahun');
      const h = u === 1 ? 15 : u === 2 ? 24 : 24 + (u - 2) * 4;
      return { output: { teks: `${h} tahun manusia` }, steps: ['konversi umur'] };
    },
  },

  {
    id: 'hitung-kalori-makanan',
    version: '8.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalori Makanan v8',
    nameEn: 'Food Calories v8',
    descriptionId: 'Kalori nasi & lauk.',
    descriptionEn: 'Calories of rice and sides.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nasi', labelId: 'Nasi (centong)', labelEn: 'Rice (scoops)', type: 'number', required: true },
      { key: 'lauk', labelId: 'Lauk: ayam/telor/tahu', labelEn: 'Side: chicken/egg/tofu', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const n = Number(ctx.values['nasi']); const l = String(ctx.values['lauk'] || '').toLowerCase();
      const lk = { 'ayam': 250, 'telor': 155, 'tahu': 145 }[l];
      if (!(n > 0) || !lk) throw new Error('Nasi > 0, lauk: ayam/telor/tahu');
      return { output: { teks: `${Math.round(n * 175 + lk)} kkal` }, steps: ['hitung kalori'] };
    },
  },






















  {
    id: 'hitung-biaya-cetak',
    version: '6.0.0',
    category: 'BISNIS',
    nameId: 'Biaya Cetak v6',
    nameEn: 'Print Cost v6',
    descriptionId: 'Biaya cetak dokumen.',
    descriptionEn: 'Document printing cost.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'halaman', labelId: 'Jumlah halaman', labelEn: 'Page count', type: 'number', required: true },
      { key: 'jilid', labelId: 'Jilid: ya/tidak', labelEn: 'Binding: yes/no', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const h = Number(ctx.values['halaman']); const j = String(ctx.values['jilid'] || '').toLowerCase();
      if (!(h > 0) || !['ya', 'tidak'].includes(j)) throw new Error('Halaman > 0, jilid: ya/tidak');
      const rp = h * 300 + (j === 'ya' ? 5000 : 0);
      return { output: { teks: `Rp${rp.toLocaleString('id-ID')}` }, steps: ['hitung cetak'] };
    },
  },



























  {
    id: 'hitung-ongkos-kirim',
    version: '4.0.0',
    category: 'BISNIS',
    nameId: 'Ongkos Kirim v4',
    nameEn: 'Shipping Cost v4',
    descriptionId: 'Estimasi ongkir dari berat & zona.',
    descriptionEn: 'Estimated shipping from weight and zone.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'zona', labelId: 'Zona: lokal/nasional', labelEn: 'Zone: local/national', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const b = Number(ctx.values['berat']); const z = String(ctx.values['zona'] || '').toLowerCase();
      if (!(b > 0) || !['lokal', 'nasional'].includes(z)) throw new Error('Berat > 0, zona: lokal/nasional');
      const tarif = z === 'lokal' ? 8000 : 15000;
      return { output: { teks: `Estimasi: Rp${(Math.ceil(b*tarif/1000)*1000).toLocaleString('id-ID')}` }, steps: ['hitung ongkir'] };
    },
  },

  {
    id: 'hitung-kebutuhan-listrik',
    version: '4.0.0',
    category: 'RUMAH',
    nameId: 'Kebutuhan Listrik v4',
    nameEn: 'Electricity Needs v4',
    descriptionId: 'Estimasi tagihan listrik bulanan.',
    descriptionEn: 'Estimated monthly electricity bill.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'daya', labelId: 'Daya (watt)', labelEn: 'Power (watt)', type: 'number', required: true },
      { key: 'jam', labelId: 'Jam/hari', labelEn: 'Hours/day', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const d = Number(ctx.values['daya']); const j = Number(ctx.values['jam']);
      if (!(d > 0) || !(j > 0 && j <= 24)) throw new Error('Daya > 0, jam 0-24');
      const kwh = d * j * 30 / 1000; const rp = kwh * 1444.7;
      return { output: { teks: `${kwh.toFixed(1)} kWh/bulan\nRp${Math.round(rp).toLocaleString('id-ID')}` }, steps: ['hitung listrik'] };
    },
  },

  {
    id: 'hitung-waktu-tempuh',
    version: '4.0.0',
    category: 'TRANSPORTASI',
    nameId: 'Waktu Tempuh v4',
    nameEn: 'Travel Time v4',
    descriptionId: 'Waktu tempuh dari jarak & kecepatan.',
    descriptionEn: 'Travel time from distance and speed.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jarak', labelId: 'Jarak (km)', labelEn: 'Distance (km)', type: 'number', required: true },
      { key: 'kecepatan', labelId: 'Kecepatan (km/jam)', labelEn: 'Speed (km/h)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const j = Number(ctx.values['jarak']); const k = Number(ctx.values['kecepatan']);
      if (!(j > 0) || !(k > 0)) throw new Error('Jarak & kecepatan harus > 0');
      const jam = j / k; const jj = Math.floor(jam); const mm = Math.round((jam - jj) * 60);
      return { output: { teks: `${jj} jam ${mm} menit` }, steps: ['hitung waktu'] };
    },
  },













  {
    id: 'hitung-kebutuhan-bbm',
    version: '3.0.0',
    category: 'OTOMOTIF',
    nameId: 'Kebutuhan BBM v3',
    nameEn: 'Fuel Needs v3',
    descriptionId: 'Biaya BBM dari jarak & konsumsi.',
    descriptionEn: 'Fuel cost from distance and consumption.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jarak', labelId: 'Jarak (km)', labelEn: 'Distance (km)', type: 'number', required: true },
      { key: 'konsumsi', labelId: 'Konsumsi (km/liter)', labelEn: 'Consumption (km/liter)', type: 'number', required: true },
      { key: 'harga', labelId: 'Harga/liter (Rp)', labelEn: 'Price/liter (Rp)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const j = Number(ctx.values['jarak']); const k = Number(ctx.values['konsumsi']); const h = Number(ctx.values['harga']);
      if (!(j > 0) || !(k > 0) || !(h > 0)) throw new Error('Semua input harus > 0');
      const liter = j / k; const biaya = liter * h;
      return { output: { teks: `BBM: ${liter.toFixed(1)} liter\nBiaya: Rp${Math.round(biaya).toLocaleString('id-ID')}` }, steps: ['hitung BBM'] };
    },
  },


  {
    id: 'hitung-target-baca',
    version: '2.0.0',
    category: 'PENDIDIKAN',
    nameId: 'Target Baca v2',
    nameEn: 'Reading Target v2',
    descriptionId: 'Halaman per hari untuk target buku.',
    descriptionEn: 'Pages per day for book target.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'halaman', labelId: 'Total halaman', labelEn: 'Total pages', type: 'number', required: true },
      { key: 'hari', labelId: 'Target hari', labelEn: 'Target days', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const h = Number(ctx.values['halaman']); const d = Number(ctx.values['hari']);
      if (!(h > 0) || !(d > 0)) throw new Error('Halaman & hari harus > 0');
      const perHari = Math.ceil(h / d);
      return { output: { teks: `Baca ${perHari} halaman/hari\n(~${Math.ceil(perHari/30)} menit/hari)` }, steps: ['hitung target'] };
    },
  },





  {
    id: 'hitung-kebutuhan-pupuk',
    version: '2.0.0',
    category: 'PERTANIAN',
    nameId: 'Kebutuhan Pupuk v2',
    nameEn: 'Fertilizer Needs v2',
    descriptionId: 'Estimasi pupuk NPK per luas lahan.',
    descriptionEn: 'Estimate NPK fertilizer per land area.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'luas', labelId: 'Luas lahan (m2)', labelEn: 'Land area (m2)', type: 'number', required: true },
      { key: 'dosis', labelId: 'Dosis (gram/m2)', labelEn: 'Dosage (gram/m2)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const l = Number(ctx.values['luas']); const d = Number(ctx.values['dosis']);
      if (!(l > 0) || !(d > 0)) throw new Error('Luas & dosis harus > 0');
      const kg = l * d / 1000;
      return { output: { teks: `Pupuk dibutuhkan: ${kg.toFixed(2)} kg\nBagi 2-3 kali aplikasi.` }, steps: ['hitung pupuk'] };
    },
  },


  {
    id: 'hitung-biaya-servis-motor',
    version: '2.0.0',
    category: 'OTOMOTIF',
    nameId: 'Biaya Servis Motor v2',
    nameEn: 'Motorcycle Service Cost v2',
    descriptionId: 'Estimasi biaya servis motor per jenis.',
    descriptionEn: 'Estimate motorcycle service cost by type.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jenis', labelId: 'Jenis: ringan/sedang/berat', labelEn: 'Type: light/medium/heavy', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const j = String(ctx.values['jenis'] || '').toLowerCase();
      const biaya: Record<string, [number, number, string]> = {
        ringan: [50000, 100000, 'Ganti oli + tune up'],
        sedang: [150000, 300000, 'Oli + CVT + rem'],
        berat: [400000, 800000, 'Turun mesin sebagian'],
      };
      if (!(j in biaya)) throw new Error('Jenis: ringan/sedang/berat');
      const [mn, mx, desc] = biaya[j];
      return { output: { teks: `Estimasi: Rp${mn.toLocaleString('id-ID')} - Rp${mx.toLocaleString('id-ID')}\n${desc}` }, steps: ['estimasi biaya'] };
    },
  },


  {
    id: 'hitung-kebutuhan-air-tanaman',
    version: '2.0.0',
    category: 'PERTANIAN',
    nameId: 'Air Tanaman v2',
    nameEn: 'Plant Watering v2',
    descriptionId: 'Estimasi kebutuhan air tanaman per hari.',
    descriptionEn: 'Estimate daily plant watering needs.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jumlah', labelId: 'Jumlah tanaman (pot)', labelEn: 'Number of plants (pots)', type: 'number', required: true },
      { key: 'ukuran', labelId: 'Ukuran pot: kecil/sedang/besar', labelEn: 'Pot size: small/medium/large', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 1024,
    maxComputeSeconds: 5,
    handler(ctx) {
      const n = Number(ctx.values['jumlah']); const uk = String(ctx.values['ukuran'] || '').toLowerCase();
      const ml: Record<string, number> = { kecil: 200, sedang: 500, besar: 1000 };
      if (!(n > 0) || !(uk in ml)) throw new Error('Jumlah > 0, ukuran: kecil/sedang/besar');
      const total = n * ml[uk];
      return { output: { teks: `Air/hari: ${total} ml (${(total/1000).toFixed(1)} L)\nSiram pagi hari.` }, steps: ['hitung kebutuhan'] };
    },
  },



  {
    id: 'hitung-plagiarisme',
    version: '2.0.0',
    category: 'PENDIDIKAN',
    nameId: 'Cek Plagiarisme Sederhana v2',
    nameEn: 'Simple Plagiarism Checker v2',
    descriptionId: 'Bandingkan kemiripan dua teks (Jaccard).',
    descriptionEn: 'Compare similarity of two texts (Jaccard).',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'teks1', labelId: 'Teks 1', labelEn: 'Text 1', type: 'text', required: true },
      { key: 'teks2', labelId: 'Teks 2', labelEn: 'Text 2', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 8192,
    maxComputeSeconds: 5,
    handler(ctx) {
      const t1 = String(ctx.values['teks1'] || '').toLowerCase().split(/\s+/).filter(Boolean);
      const t2 = String(ctx.values['teks2'] || '').toLowerCase().split(/\s+/).filter(Boolean);
      if (!t1.length || !t2.length) throw new Error('Kedua teks harus diisi');
      const s1 = new Set(t1); const s2 = new Set(t2);
      let irisan = 0;
      for (const w of s1) if (s2.has(w)) irisan++;
      const persen = Math.round(irisan / (s1.size + s2.size - irisan) * 100);
      const status = persen > 50 ? 'Kemiripan TINGGI — tulis ulang dengan bahasamu' : persen > 20 ? 'Kemiripan SEDANG — periksa sitasi' : 'Kemiripan RENDAH — aman';
      return { output: { teks: `Kemiripan: ${persen}%\n${status}` }, steps: ['Jaccard similarity'] };
    },
  },

  {
    id: 'hitung-khodam',
    version: '2.0.0',
    category: 'HIBURAN',
    nameId: 'Cek Khodam v2',
    nameEn: 'Khodam Checker v2',
    descriptionId: 'Cek khodam dari nama (hiburan semata).',
    descriptionEn: 'Check khodam from name (entertainment only).',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nama', labelId: 'Nama', labelEn: 'Name', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const nama = String(ctx.values['nama'] || '').trim();
      if (!nama) throw new Error('Nama tidak boleh kosong');
      const daftar = ['Macan Putih', 'Naga Emas', 'Kuntilanak Baik Hati', 'Tuyul Insaf', 'Genderuwo Ramah', 'Pocong Santai', 'Wewe Gombel Penyayang', 'Jenglot Mini'];
      let h = 0;
      for (const c of nama) h = (h * 31 + c.charCodeAt(0)) % 1000003;
      const khodam = daftar[h % daftar.length];
      return { output: { teks: `Khodam ${nama}: ${khodam}\n(Sekadar hiburan, jangan dianggap serius)` }, steps: ['hash nama → pilih khodam'] };
    },
  },

  {
    id: 'hitung-zodiak',
    version: '2.0.0',
    category: 'HIBURAN',
    nameId: 'Kalkulator Zodiak v2',
    nameEn: 'Zodiac Calculator v2',
    descriptionId: 'Zodiak barat & shio Cina (hiburan).',
    descriptionEn: 'Western zodiac and Chinese shio (entertainment).',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'tanggal', labelId: 'Tanggal lahir (YYYY-MM-DD)', labelEn: 'Birth date (YYYY-MM-DD)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const tgl = String(ctx.values['tanggal'] || '');
      const d = new Date(tgl + 'T00:00:00');
      if (isNaN(d.getTime())) throw new Error('Format tanggal salah. Gunakan YYYY-MM-DD');
      const m = d.getMonth() + 1; const day = d.getDate(); const y = d.getFullYear();
      const z = m === 1 ? (day < 20 ? 'Capricorn' : 'Aquarius') : m === 2 ? (day < 19 ? 'Aquarius' : 'Pisces') : m === 3 ? (day < 21 ? 'Pisces' : 'Aries') : m === 4 ? (day < 20 ? 'Aries' : 'Taurus') : m === 5 ? (day < 21 ? 'Taurus' : 'Gemini') : m === 6 ? (day < 21 ? 'Gemini' : 'Cancer') : m === 7 ? (day < 23 ? 'Cancer' : 'Leo') : m === 8 ? (day < 23 ? 'Leo' : 'Virgo') : m === 9 ? (day < 23 ? 'Virgo' : 'Libra') : m === 10 ? (day < 23 ? 'Libra' : 'Scorpio') : m === 11 ? (day < 22 ? 'Scorpio' : 'Sagitarius') : (day < 22 ? 'Sagitarius' : 'Capricorn');
      const shio = ['Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi'][(y - 4) % 12];
      return { output: { teks: `Zodiak: ${z}\nShio: ${shio}\n(Hiburan, bukan ramalan nasib)` }, steps: ['hitung zodiak & shio'] };
    },
  },









  {
    id: 'hitung-biaya-tukang',
    version: '1.0.0',
    category: 'RUMAH',
    nameId: 'Kalkulator Biaya Tukang',
    nameEn: 'Handyman Cost Calculator',
    descriptionId: 'Estimasi biaya jasa tukang harian/borongan.',
    descriptionEn: 'Estimate daily or project handyman cost.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'tarif', labelId: 'Tarif harian (Rp)', labelEn: 'Daily rate (IDR)', type: 'number', required: true },
      { key: 'hari', labelId: 'Estimasi hari', labelEn: 'Estimated days', type: 'number', required: true },
      { key: 'material', labelId: 'Biaya material (Rp)', labelEn: 'Material cost (IDR)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const tarif = Number(ctx.values['tarif']); const hari = Number(ctx.values['hari']); const mat = Number(ctx.values['material'] || 0);
      if (![tarif, hari].every(v => Number.isFinite(v) && v > 0) || !(mat >= 0)) throw new Error('Input tidak valid');
      const total = tarif * hari + mat;
      return { output: { teks: `Jasa: Rp${(tarif * hari).toLocaleString('id-ID')}\nMaterial: Rp${mat.toLocaleString('id-ID')}\nTotal: Rp${total.toLocaleString('id-ID')}` }, steps: ['tarif × hari + material'] };
    },
  },


  {
    id: 'hitung-kalori-harian',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator Kalori Harian',
    nameEn: 'Daily Calorie Calculator',
    descriptionId: 'Estimasi kebutuhan kalori harian (TDEE).',
    descriptionEn: 'Estimate daily calorie needs (TDEE).',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'bb', labelId: 'Berat badan (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'tb', labelId: 'Tinggi badan (cm)', labelEn: 'Height (cm)', type: 'number', required: true },
      { key: 'usia', labelId: 'Usia (tahun)', labelEn: 'Age (years)', type: 'number', required: true },
      { key: 'jk', labelId: 'Jenis kelamin (pria/wanita)', labelEn: 'Gender (male/female)', type: 'text', required: true },
      { key: 'aktivitas', labelId: 'Aktivitas (1.2-1.9)', labelEn: 'Activity (1.2-1.9)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const bb = Number(ctx.values['bb']); const tb = Number(ctx.values['tb']); const usia = Number(ctx.values['usia']); const jk = String(ctx.values['jk'] || '').toLowerCase(); const akt = Number(ctx.values['aktivitas'] || 1.375);
      if (![bb, tb, usia, akt].every(v => Number.isFinite(v) && v > 0)) throw new Error('Input tidak valid');
      const bmr = jk.startsWith('p') || jk.startsWith('m') ? 10 * bb + 6.25 * tb - 5 * usia + 5 : 10 * bb + 6.25 * tb - 5 * usia - 161;
      const tdee = Math.round(bmr * akt);
      return { output: { teks: `BMR: ${Math.round(bmr)} kkal\nKebutuhan harian: ±${tdee} kkal` }, steps: ['Mifflin-St Jeor × faktor aktivitas'] };
    },
  },


  {
    id: 'hitung-hemat-bensin',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Hemat Bensin',
    nameEn: 'Fuel Saving Calculator',
    descriptionId: 'Bandingkan biaya bensin vs transportasi umum.',
    descriptionEn: 'Compare fuel cost vs public transport.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jarak_harian', labelId: 'Jarak harian (km)', labelEn: 'Daily distance (km)', type: 'number', required: true },
      { key: 'konsumsi', labelId: 'Konsumsi motor (km/liter)', labelEn: 'Bike consumption (km/l)', type: 'number', required: true },
      { key: 'harga', labelId: 'Harga bensin/liter (Rp)', labelEn: 'Fuel price/liter (IDR)', type: 'number', required: true },
      { key: 'ongkos_umum', labelId: 'Ongkos umum/hari (Rp)', labelEn: 'Transit fare/day (IDR)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const j = Number(ctx.values['jarak_harian']); const k = Number(ctx.values['konsumsi']); const h = Number(ctx.values['harga']); const o = Number(ctx.values['ongkos_umum']);
      if (![j, k, h, o].every(v => Number.isFinite(v) && v > 0)) throw new Error('Input tidak valid');
      const bensin = Math.round(j / k * h * 26); const umum = o * 26;
      const hemat = bensin > umum ? `Transportasi umum hemat Rp${(bensin - umum).toLocaleString('id-ID')}` : `Motor lebih hemat Rp${(umum - bensin).toLocaleString('id-ID')}`;
      return { output: { teks: `Motor: Rp${bensin.toLocaleString('id-ID')}/bln\nUmum: Rp${umum.toLocaleString('id-ID')}/bln\n${hemat}` }, steps: ['bandingkan biaya bulanan'] };
    },
  },





  {
    id: 'hitung-kebutuhan-tabungan',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Target Tabungan',
    nameEn: 'Savings Goal Calculator',
    descriptionId: 'Hitung tabungan bulanan untuk mencapai target.',
    descriptionEn: 'Calculate monthly savings to reach a goal.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'target', labelId: 'Target (Rp)', labelEn: 'Goal (IDR)', type: 'number', required: true },
      { key: 'bulan', labelId: 'Jangka waktu (bulan)', labelEn: 'Timeframe (months)', type: 'number', required: true },
      { key: 'punya', labelId: 'Sudah punya (Rp)', labelEn: 'Already have (IDR)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const target = Number(ctx.values['target']); const bulan = Number(ctx.values['bulan']); const punya = Number(ctx.values['punya'] || 0);
      if (![target, bulan, punya].every(v => Number.isFinite(v) && v >= 0) || bulan <= 0) throw new Error('Input tidak valid');
      const kurang = Math.max(0, target - punya);
      const perBulan = Math.ceil(kurang / bulan);
      return { output: { teks: `Tabung Rp${perBulan.toLocaleString('id-ID')}/bulan selama ${bulan} bulan` }, steps: ['(target − punya) ÷ bulan'] };
    },
  },

  {
    id: 'hitung-kecepatan-internet',
    version: '1.0.0',
    category: 'TEKNOLOGI',
    nameId: 'Kalkulator Waktu Unduh',
    nameEn: 'Download Time Calculator',
    descriptionId: 'Estimasi waktu unduh dari ukuran file & kecepatan internet.',
    descriptionEn: 'Estimate download time from file size and internet speed.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'ukuran', labelId: 'Ukuran file (MB)', labelEn: 'File size (MB)', type: 'number', required: true },
      { key: 'kecepatan', labelId: 'Kecepatan (Mbps)', labelEn: 'Speed (Mbps)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const ukuran = Number(ctx.values['ukuran']); const kecepatan = Number(ctx.values['kecepatan']);
      if (![ukuran, kecepatan].every(v => Number.isFinite(v) && v > 0)) throw new Error('Input tidak valid');
      const detik = Math.round(ukuran * 8 / kecepatan);
      const menit = Math.floor(detik / 60); const sisa = detik % 60;
      return { output: { teks: `Estimasi waktu unduh: ${menit > 0 ? menit + ' mnt ' : ''}${sisa} dtk` }, steps: ['MB × 8 ÷ Mbps'] };
    },
  },

  {
    id: 'hitung-umur-anjing',
    version: '1.0.0',
    category: 'HIBURAN',
    nameId: 'Kalkulator Umur Anjing',
    nameEn: 'Dog Age Calculator',
    descriptionId: 'Konversi umur anjing ke setara umur manusia.',
    descriptionEn: 'Convert dog age to human equivalent.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'umur', labelId: 'Umur anjing (tahun)', labelEn: 'Dog age (years)', type: 'number', required: true },
      { key: 'ukuran', labelId: 'Ukuran: kecil/sedang/besar', labelEn: 'Size: small/medium/large', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const umur = Number(ctx.values['umur']);
      const ukuran = String(ctx.values['ukuran'] || 'sedang').toLowerCase();
      if (!Number.isFinite(umur) || umur < 0 || umur > 25) throw new Error('Umur tidak valid');
      const faktor = ukuran.includes('kecil') ? 4 : ukuran.includes('besar') ? 6 : 5;
      let manusia;
      if (umur <= 1) manusia = 15;
      else if (umur <= 2) manusia = 24;
      else manusia = 24 + (umur - 2) * faktor;
      return { output: { teks: `Anjing ${umur} tahun (${ukuran}) ≈ ${Math.round(manusia)} tahun manusia` }, steps: ['Tahun 1=15, tahun 2=24, dst × faktor ukuran'] };
    },
  },

  {
    id: 'hitung-kebutuhan-kalori-olahraga',
    version: '1.0.0',
    category: 'OLAHRAGA',
    nameId: 'Kalkulator Kalori Olahraga',
    nameEn: 'Exercise Calorie Calculator',
    descriptionId: 'Estimasi kalori terbakar dari jenis & durasi olahraga.',
    descriptionEn: 'Estimate calories burned from exercise type and duration.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'bb', labelId: 'Berat badan (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'met', labelId: 'MET aktivitas (mis. jalan 3.5, lari 8)', labelEn: 'Activity MET (e.g. walk 3.5, run 8)', type: 'number', required: true },
      { key: 'menit', labelId: 'Durasi (menit)', labelEn: 'Duration (min)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const bb = Number(ctx.values['bb']); const met = Number(ctx.values['met']); const menit = Number(ctx.values['menit']);
      if (![bb, met, menit].every(v => Number.isFinite(v) && v > 0)) throw new Error('Input tidak valid');
      const kkal = Math.round(met * bb * menit / 60);
      return { output: { teks: `Kalori terbakar: ±${kkal} kkal` }, steps: ['MET × bb × jam'] };
    },
  },



  {
    id: 'hitung-kebutuhan-air-minum',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator Kebutuhan Air Minum',
    nameEn: 'Water Intake Calculator',
    descriptionId: 'Estimasi kebutuhan air harian dari berat badan.',
    descriptionEn: 'Estimate daily water needs from body weight.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'bb', labelId: 'Berat badan (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'aktivitas', labelId: 'Aktivitas berat?', labelEn: 'Heavy activity?', type: 'boolean', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const bb = Number(ctx.values['bb']);
      const berat = ctx.values['aktivitas'] === true || ctx.values['aktivitas'] === 'true';
      if (!Number.isFinite(bb) || bb <= 0 || bb > 300) throw new Error('Berat badan tidak valid');
      const liter = bb * (berat ? 0.04 : 0.033);
      const gelas = Math.round(liter * 1000 / 250);
      return { output: { teks: `Kebutuhan air: ${liter.toFixed(1)} L/hari (±${gelas} gelas)` }, steps: ['bb × 33 ml (normal) / 40 ml (berat)'] };
    },
  },

  {
    id: 'hitung-target-lari',
    version: '1.0.0',
    category: 'OLAHRAGA',
    nameId: 'Kalkulator Target Lari',
    nameEn: 'Running Pace Calculator',
    descriptionId: 'Hitung pace target dari jarak & waktu tempuh.',
    descriptionEn: 'Calculate target pace from distance and time.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jarak', labelId: 'Jarak (km)', labelEn: 'Distance (km)', type: 'number', required: true },
      { key: 'menit', labelId: 'Waktu target (menit)', labelEn: 'Target time (min)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const jarak = Number(ctx.values['jarak']); const menit = Number(ctx.values['menit']);
      if (![jarak, menit].every(v => Number.isFinite(v) && v > 0)) throw new Error('Input tidak valid');
      const pace = menit / jarak;
      const pm = Math.floor(pace); const ps = Math.round((pace - pm) * 60);
      return { output: { teks: `Pace target: ${pm}:${String(ps).padStart(2, '0')} /km` }, steps: ['waktu ÷ jarak'] };
    },
  },

  {
    id: 'hitung-biaya-wifi',
    version: '1.0.0',
    category: 'RUMAH',
    nameId: 'Kalkulator Biaya WiFi',
    nameEn: 'WiFi Cost Calculator',
    descriptionId: 'Bandingkan biaya berlangganan WiFi per tahun.',
    descriptionEn: 'Compare annual WiFi subscription costs.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'bulanan', labelId: 'Biaya per bulan (Rp)', labelEn: 'Monthly cost (IDR)', type: 'number', required: true },
      { key: 'instalasi', labelId: 'Biaya instalasi (Rp)', labelEn: 'Installation fee (IDR)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const bulanan = Number(ctx.values['bulanan']); const instalasi = Number(ctx.values['instalasi'] || 0);
      if (![bulanan, instalasi].every(v => Number.isFinite(v) && v >= 0) || bulanan <= 0) throw new Error('Input tidak valid');
      const tahunan = Math.round(bulanan * 12 + instalasi);
      const perHari = Math.round(tahunan / 365);
      return { output: { teks: `Total 1 tahun: Rp${tahunan.toLocaleString('id-ID')}\nRata-rata per hari: Rp${perHari.toLocaleString('id-ID')}` }, steps: ['12× bulanan + instalasi'] };
    },
  },

  {
    id: 'hitung-waktu-tidur',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator Waktu Tidur Ideal',
    nameEn: 'Ideal Bedtime Calculator',
    descriptionId: 'Hitung jam tidur ideal dari siklus 90 menit.',
    descriptionEn: 'Calculate ideal bedtime from 90-minute sleep cycles.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'bangun', labelId: 'Jam bangun (HH:MM)', labelEn: 'Wake time (HH:MM)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const m = String(ctx.values['bangun'] || '').match(/^(\d{1,2}):(\d{2})$/);
      if (!m) throw new Error('Format jam: HH:MM');
      const bangunMin = (parseInt(m[1]) % 24) * 60 + parseInt(m[2]);
      const opsi: string[] = [];
      for (const siklus of [6, 5, 4]) {
        const t = (bangunMin - siklus * 90 - 15 + 1440) % 1440;
        const h = String(Math.floor(t / 60)).padStart(2, '0'); const mn = String(t % 60).padStart(2, '0');
        opsi.push(`${h}:${mn} (${siklus} siklus)`);
      }
      return { output: { teks: `Tidur ideal bila bangun ${m[1]}:${m[2]}:\n- ${opsi.join('\n- ')}` }, steps: ['90 menit per siklus + 15 menit tertidur'] };
    },
  },

  {
    id: 'hitung-ongkos-cetak',
    version: '1.0.0',
    category: 'BISNIS',
    nameId: 'Kalkulator Ongkos Cetak',
    nameEn: 'Print Cost Calculator',
    descriptionId: 'Estimasi biaya cetak dari jumlah halaman & harga per lembar.',
    descriptionEn: 'Estimate printing cost from pages and per-sheet price.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'halaman', labelId: 'Jumlah halaman', labelEn: 'Page count', type: 'number', required: true },
      { key: 'harga', labelId: 'Harga per lembar (Rp)', labelEn: 'Price per sheet (IDR)', type: 'number', required: true },
      { key: 'salinan', labelId: 'Jumlah salinan', labelEn: 'Copies', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const halaman = Number(ctx.values['halaman']); const harga = Number(ctx.values['harga']); const salinan = Number(ctx.values['salinan'] || 1);
      if (![halaman, harga, salinan].every(v => Number.isFinite(v) && v > 0)) throw new Error('Input tidak valid');
      const total = Math.round(halaman * harga * salinan);
      return { output: { teks: `Total biaya cetak: Rp${total.toLocaleString('id-ID')}` }, steps: ['halaman × harga × salinan'] };
    },
  },

  {
    id: 'hitung-kebutuhan-modal',
    version: '1.0.0',
    category: 'BISNIS',
    nameId: 'Kalkulator Modal Usaha',
    nameEn: 'Business Capital Calculator',
    descriptionId: 'Estimasi modal awal usaha dari komponen biaya.',
    descriptionEn: 'Estimate startup capital from cost components.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'sewa', labelId: 'Sewa tempat (Rp)', labelEn: 'Rent (IDR)', type: 'number', required: false },
      { key: 'alat', labelId: 'Peralatan (Rp)', labelEn: 'Equipment (IDR)', type: 'number', required: false },
      { key: 'bahan', labelId: 'Bahan awal (Rp)', labelEn: 'Initial stock (IDR)', type: 'number', required: false },
      { key: 'operasional', labelId: 'Operasional/bulan (Rp)', labelEn: 'Monthly ops (IDR)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const vals = ['sewa', 'alat', 'bahan', 'operasional'].map(k => Number(ctx.values[k] || 0));
      if (!vals.every(v => Number.isFinite(v) && v >= 0)) throw new Error('Input tidak valid');
      const total = vals[0] + vals[1] + vals[2] + vals[3] * 3;
      return { output: { teks: `Estimasi modal awal: Rp${Math.round(total).toLocaleString('id-ID')}\n\nTermasuk cadangan operasional 3 bulan.` }, steps: ['sewa + alat + bahan + 3× operasional'] };
    },
  },

  {
    id: 'hitung-diskon-bertumpuk',
    version: '1.0.0',
    category: 'BELANJA',
    nameId: 'Kalkulator Diskon Bertumpuk',
    nameEn: 'Stacked Discount Calculator',
    descriptionId: 'Hitung harga akhir dari beberapa diskon berurutan.',
    descriptionEn: 'Calculate final price from sequential discounts.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'harga', labelId: 'Harga awal (Rp)', labelEn: 'Original price (IDR)', type: 'number', required: true },
      { key: 'diskon', labelId: 'Diskon berurutan, pisah koma (%)', labelEn: 'Sequential discounts, comma-separated (%)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const harga = Number(ctx.values['harga']);
      const diskon = String(ctx.values['diskon'] || '').split(',').map(x => parseFloat(x.trim())).filter(x => Number.isFinite(x) && x >= 0 && x <= 100);
      if (!Number.isFinite(harga) || harga <= 0) throw new Error('Harga tidak valid');
      if (!diskon.length) throw new Error('Format diskon: mis. 50,20');
      let akhir = harga;
      for (const d of diskon) akhir *= (1 - d / 100);
      akhir = Math.round(akhir);
      const hemat = harga - akhir;
      return { output: { teks: `Harga akhir: Rp${akhir.toLocaleString('id-ID')}\nHemat: Rp${hemat.toLocaleString('id-ID')} (${Math.round(hemat / harga * 100)}%)` }, steps: ['Diskon diterapkan berurutan, bukan dijumlah'] };
    },
  },


  {
    id: 'hitung-denda-keterlambatan',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Denda Keterlambatan',
    nameEn: 'Late Fee Calculator',
    descriptionId: 'Hitung denda dari % per hari/bulan keterlambatan.',
    descriptionEn: 'Calculate late fees from daily/monthly rate.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'pokok', labelId: 'Nominal pokok (Rp)', labelEn: 'Principal (IDR)', type: 'number', required: true },
      { key: 'persen', labelId: 'Denda per bulan (%)', labelEn: 'Monthly fee (%)', type: 'number', required: true },
      { key: 'bulan', labelId: 'Telat (bulan)', labelEn: 'Late (months)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const pokok = Number(ctx.values['pokok']); const persen = Number(ctx.values['persen']); const bulan = Number(ctx.values['bulan']);
      if (![pokok, persen, bulan].every(v => Number.isFinite(v) && v >= 0)) throw new Error('Input tidak valid');
      const denda = Math.round(pokok * persen / 100 * bulan);
      return { output: { teks: `Denda: Rp${denda.toLocaleString('id-ID')}\nTotal bayar: Rp${(pokok + denda).toLocaleString('id-ID')}` }, steps: ['pokok × % × bulan'] };
    },
  },


  {
    id: 'hitung-usia-kehamilan',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator Usia Kehamilan & HPL',
    nameEn: 'Pregnancy Age and Due Date Calculator',
    descriptionId: 'Hitung usia kehamilan & Hari Perkiraan Lahir (Naegele).',
    descriptionEn: 'Calculate gestational age and estimated due date.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'hpht', labelId: 'HPHT (YYYY-MM-DD)', labelEn: 'LMP date (YYYY-MM-DD)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const hpht = String(ctx.values['hpht'] || '').trim();
      const d = new Date(hpht + 'T00:00:00');
      if (isNaN(d.getTime())) throw new Error('Format tanggal: YYYY-MM-DD');
      const now = new Date();
      const usiaHari = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (usiaHari < 0) throw new Error('HPHT di masa depan');
      const minggu = Math.floor(usiaHari / 7); const hari = usiaHari % 7;
      const hpl = new Date(d); hpl.setDate(hpl.getDate() + 280);
      return { output: { teks: `Usia kehamilan: ${minggu} minggu ${hari} hari\nHPL: ${hpl.toISOString().slice(0, 10)}\n\nKonsultasikan ke bidan/dokter.` }, steps: ['Naegele: HPHT + 280 hari'] };
    },
  },

  {
    id: 'hitung-kebutuhan-kalori-harian',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator Kalori Harian (BMR)',
    nameEn: 'Daily Calorie Calculator (BMR)',
    descriptionId: 'Hitung BMR Mifflin-St Jeor + kebutuhan kalori harian.',
    descriptionEn: 'Calculate Mifflin-St Jeor BMR and daily calorie needs.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'tinggi', labelId: 'Tinggi (cm)', labelEn: 'Height (cm)', type: 'number', required: true },
      { key: 'umur', labelId: 'Umur (tahun)', labelEn: 'Age (years)', type: 'number', required: true },
      { key: 'jk', labelId: 'Jenis kelamin (L/P)', labelEn: 'Gender (M/F)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const berat = Number(ctx.values['berat']); const tinggi = Number(ctx.values['tinggi']);
      const umur = Number(ctx.values['umur']); const jk = String(ctx.values['jk']).toUpperCase();
      if (![berat, tinggi, umur].every(v => Number.isFinite(v) && v > 0)) throw new Error('Input tidak valid');
      if (!['L', 'P', 'M', 'F'].includes(jk)) throw new Error('Jenis kelamin: L/P');
      const bmr = jk === 'L' || jk === 'M' ? 10 * berat + 6.25 * tinggi - 5 * umur + 5 : 10 * berat + 6.25 * tinggi - 5 * umur - 161;
      const tdee = Math.round(bmr * 1.55);
      return { output: { teks: `BMR: ${Math.round(bmr)} kkal\nKebutuhan harian (aktif sedang): ~${tdee} kkal` }, steps: ['Mifflin-St Jeor × faktor aktivitas 1.55'] };
    },
  },



  {
    id: 'hitung-indeks-massa-tubuh',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator IMT Detail',
    nameEn: 'Detailed BMI Calculator',
    descriptionId: 'Hitung IMT + kategori & saran berat ideal.',
    descriptionEn: 'Calculate BMI with category and ideal weight advice.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'tinggi', labelId: 'Tinggi (cm)', labelEn: 'Height (cm)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const berat = Number(ctx.values['berat']);
      const tinggi = Number(ctx.values['tinggi']);
      if (!Number.isFinite(berat) || berat <= 0 || berat > 500) throw new Error('Berat tidak valid');
      if (!Number.isFinite(tinggi) || tinggi <= 30 || tinggi > 250) throw new Error('Tinggi tidak valid');
      const m = tinggi / 100;
      const imt = berat / (m * m);
      const kat = imt < 18.5 ? 'Kurus' : imt < 25 ? 'Normal' : imt < 30 ? 'Gemuk' : 'Obesitas';
      const idealMin = Math.round(18.5 * m * m); const idealMax = Math.round(24.9 * m * m);
      return { output: { teks: `IMT: ${imt.toFixed(1)} (${kat})\nBerat ideal: ${idealMin}-${idealMax} kg` }, steps: ['berat / tinggi²'] };
    },
  },

  {
    id: 'hitung-zakat-penghasilan',
    version: '1.0.0',
    category: 'AGAMA',
    nameId: 'Kalkulator Zakat Penghasilan',
    nameEn: 'Income Zakat Calculator',
    descriptionId: 'Hitung zakat penghasilan 2,5% bila mencapai nishab.',
    descriptionEn: 'Calculate 2.5% income zakat when reaching nisab.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'penghasilan', labelId: 'Penghasilan per bulan (Rp)', labelEn: 'Monthly income (IDR)', type: 'number', required: true },
      { key: 'nishab', labelId: 'Nishab per bulan (Rp)', labelEn: 'Nisab per month (IDR)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const penghasilan = Number(ctx.values['penghasilan']);
      const nishab = Number(ctx.values['nishab'] || 7046000);
      if (!Number.isFinite(penghasilan) || penghasilan <= 0) throw new Error('Penghasilan tidak valid');
      if (penghasilan < nishab) return { output: { teks: `Belum mencapai nishab (Rp${nishab.toLocaleString('id-ID')}/bulan). Zakat belum wajib.` }, steps: [] };
      const zakat = Math.round(penghasilan * 0.025);
      return { output: { teks: `Zakat penghasilan: Rp${zakat.toLocaleString('id-ID')}/bulan (2,5%)` }, steps: ['penghasilan × 2,5%'] };
    },
  },

  {
    id: 'hitung-biaya-listrik',
    version: '1.0.0',
    category: 'RUMAH',
    nameId: 'Kalkulator Biaya Listrik',
    nameEn: 'Electricity Cost Calculator',
    descriptionId: 'Estimasi tagihan listrik dari daya alat & lama pakai.',
    descriptionEn: 'Estimate electricity bill from appliance wattage and usage.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'watt', labelId: 'Daya alat (watt)', labelEn: 'Power (watts)', type: 'number', required: true },
      { key: 'jam', labelId: 'Lama pakai per hari (jam)', labelEn: 'Hours per day', type: 'number', required: true },
      { key: 'tarif', labelId: 'Tarif per kWh (Rp)', labelEn: 'Rate per kWh (IDR)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const watt = Number(ctx.values['watt']);
      const jam = Number(ctx.values['jam']);
      const tarif = Number(ctx.values['tarif'] || 1444);
      if (!Number.isFinite(watt) || watt <= 0) throw new Error('Daya tidak valid');
      if (!Number.isFinite(jam) || jam < 0 || jam > 24) throw new Error('Jam tidak valid');
      const kwh = watt * jam * 30 / 1000;
      const biaya = Math.round(kwh * tarif);
      return { output: { teks: `Konsumsi: ${kwh.toFixed(1)} kWh/bulan\nEstimasi biaya: Rp${biaya.toLocaleString('id-ID')}/bulan` }, steps: ['watt × jam × 30 / 1000 × tarif'] };
    },
  },

  {
    id: 'hitung-konsumsi-bbm',
    version: '1.0.0',
    category: 'OTOMOTIF',
    nameId: 'Kalkulator Konsumsi BBM',
    nameEn: 'Fuel Consumption Calculator',
    descriptionId: 'Hitung konsumsi BBM km/liter & biaya perjalanan.',
    descriptionEn: 'Calculate fuel consumption and trip cost.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jarak', labelId: 'Jarak tempuh (km)', labelEn: 'Distance (km)', type: 'number', required: true },
      { key: 'bbm', labelId: 'BBM terpakai (liter)', labelEn: 'Fuel used (liters)', type: 'number', required: true },
      { key: 'harga', labelId: 'Harga per liter (Rp)', labelEn: 'Price per liter (IDR)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const jarak = Number(ctx.values['jarak']);
      const bbm = Number(ctx.values['bbm']);
      const harga = Number(ctx.values['harga'] || 0);
      if (!Number.isFinite(jarak) || jarak <= 0) throw new Error('Jarak tidak valid');
      if (!Number.isFinite(bbm) || bbm <= 0) throw new Error('BBM tidak valid');
      const kmpl = jarak / bbm;
      let teks = `Konsumsi: ${kmpl.toFixed(1)} km/liter`;
      if (harga > 0) teks += `\nBiaya/km: Rp${Math.round(harga / kmpl).toLocaleString('id-ID')}`;
      return { output: { teks }, steps: ['jarak / bbm'] };
    },
  },




  {
    id: 'hitung-porsi-makan',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Panduan Porsi Makan Sehat',
    nameEn: 'Healthy Meal Portion Guide',
    descriptionId: 'Panduan porsi makan seimbang: Isi Piringku Kemenkes.',
    descriptionEn: 'Balanced meal portion guide.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'kalori', labelId: 'Target kalori per makan (kkal)', labelEn: 'Calories per meal (kcal)', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const kalori = Number(ctx.values['kalori'] || 700);
      if (!Number.isFinite(kalori) || kalori <= 0 || kalori > 3000) throw new Error('Kalori tidak valid');
      return { output: { teks: `Isi Piringku (1x makan, ~${kalori} kkal):\n- 1/2 piring: sayur & buah\n- 1/4 piring: lauk (protein)\n- 1/4 piring: makanan pokok\n\nContoh: nasi 1 centong + ayam 1 potong + sayur 1 mangkok + buah 1 potong.` }, steps: ['Pedoman Isi Piringku Kemenkes RI'] };
    },
  },


  {
    id: 'hitung-ongkir',
    version: '1.0.0',
    category: 'BISNIS',
    nameId: 'Estimasi Ongkir',
    nameEn: 'Shipping Cost Estimator',
    descriptionId: 'Estimasi ongkos kirim dari berat & jarak (simulasi tarif).',
    descriptionEn: 'Estimate shipping cost from weight and distance.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'jarak', labelId: 'Jarak (km)', labelEn: 'Distance (km)', type: 'number', required: true },
      { key: 'layanan', labelId: 'Layanan (reguler/express)', labelEn: 'Service (regular/express)', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const berat = Number(ctx.values['berat']);
      const jarak = Number(ctx.values['jarak']);
      const layanan = String(ctx.values['layanan'] || 'reguler').toLowerCase().trim();
      if (!Number.isFinite(berat) || berat <= 0 || berat > 1000) throw new Error('Berat tidak valid');
      if (!Number.isFinite(jarak) || jarak < 0 || jarak > 5000) throw new Error('Jarak tidak valid');
      const tarifPerKm = layanan.includes('express') ? 2500 : 1200;
      const ongkir = Math.ceil(berat) * Math.max(1, Math.ceil(jarak / 50)) * tarifPerKm;
      return { output: { teks: `Estimasi ongkir (${layanan}): Rp${ongkir.toLocaleString('id-ID')}\n\nCatatan: simulasi tarif, cek ekspedisi untuk harga pasti.` }, steps: ['Berat dibulatkan ke atas × zona jarak × tarif'] };
    },
  },

  {
    id: 'konversi-suhu',
    version: '1.0.0',
    category: 'RUMUS',
    nameId: 'Konversi Suhu',
    nameEn: 'Temperature Converter',
    descriptionId: 'Konversi Celsius, Fahrenheit, Kelvin, Reamur.',
    descriptionEn: 'Convert Celsius, Fahrenheit, Kelvin, Reaumur.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai', labelEn: 'Value', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari (C/F/K/R)', labelEn: 'From (C/F/K/R)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const nilai = Number(ctx.values['nilai']);
      if (!Number.isFinite(nilai)) throw new Error('Nilai tidak valid');
      const dari = String(ctx.values['dari'] || '').toUpperCase().trim();
      let c: number;
      if (dari === 'C') c = nilai;
      else if (dari === 'F') c = ((nilai - 32) * 5) / 9;
      else if (dari === 'K') c = nilai - 273.15;
      else if (dari === 'R') c = (nilai * 5) / 4;
      else throw new Error('Satuan: C, F, K, atau R');
      const f1 = (c: number) => c.toFixed(2);
      return { output: { teks: `${nilai}°${dari} =\nCelsius: ${f1(c)}°C\nFahrenheit: ${f1((c * 9) / 5 + 32)}°F\nKelvin: ${f1(c + 273.15)} K\nReamur: ${f1((c * 4) / 5)}°R` }, steps: ['Konversi via Celsius'] };
    },
  },

  {
    id: 'hitung-kebutuhan-kalori',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator Kebutuhan Kalori',
    nameEn: 'Daily Calorie Needs Calculator',
    descriptionId: 'Hitung kebutuhan kalori harian (BMR + aktivitas).',
    descriptionEn: 'Calculate daily calorie needs (BMR + activity).',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'tinggi', labelId: 'Tinggi (cm)', labelEn: 'Height (cm)', type: 'number', required: true },
      { key: 'umur', labelId: 'Umur (tahun)', labelEn: 'Age (years)', type: 'number', required: true },
      { key: 'jk', labelId: 'Jenis kelamin (L/P)', labelEn: 'Gender (M/F)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const berat = Number(ctx.values['berat']);
      const tinggi = Number(ctx.values['tinggi']);
      const umur = Number(ctx.values['umur']);
      const jk = String(ctx.values['jk'] || '').toUpperCase().trim();
      if (!Number.isFinite(berat) || berat <= 0 || berat > 500) throw new Error('Berat tidak valid');
      if (!Number.isFinite(tinggi) || tinggi <= 0 || tinggi > 300) throw new Error('Tinggi tidak valid');
      if (!Number.isFinite(umur) || umur <= 0 || umur > 150) throw new Error('Umur tidak valid');
      if (jk !== 'L' && jk !== 'P') throw new Error('Jenis kelamin: L atau P');
      const bmr = jk === 'L' ? 88.36 + 13.4 * berat + 4.8 * tinggi - 5.7 * umur : 447.6 + 9.2 * berat + 3.1 * tinggi - 4.3 * umur;
      const ringan = Math.round(bmr * 1.375);
      const sedang = Math.round(bmr * 1.55);
      const berat2 = Math.round(bmr * 1.725);
      return { output: { teks: `BMR: ${Math.round(bmr)} kkal\nAktivitas ringan: ${ringan} kkal\nAktivitas sedang: ${sedang} kkal\nAktivitas berat: ${berat2} kkal\n\nUntuk turun BB: kurangi 500 kkal/hari dari kebutuhan.` }, steps: ['Mifflin-St Jeor × faktor aktivitas'] };
    },
  },

  {
    id: 'hitung-ipk',
    version: '1.0.0',
    category: 'PENDIDIKAN',
    nameId: 'Kalkulator IPK',
    nameEn: 'GPA Calculator',
    descriptionId: 'Hitung IPK dari daftar nilai & SKS mata kuliah.',
    descriptionEn: 'Calculate GPA from grades and credits.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'data', labelId: 'Data (format: Nilai,SKS per baris)', labelEn: 'Data (format: Grade,Credits per line)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 102400,
    maxComputeSeconds: 5,
    handler(ctx) {
      const baris = String(ctx.values['data'] || '').split('\n').map((x) => x.trim()).filter(Boolean);
      if (!baris.length) throw new Error('Data kosong');
      const bobot: Record<string, number> = { A: 4, AB: 3.5, B: 3, BC: 2.5, C: 2, D: 1, E: 0 };
      let totalBobot = 0, totalSks = 0;
      for (const b of baris) {
        const [nilaiRaw, sksRaw] = b.split(',').map((x) => x.trim().toUpperCase());
        const sks = Number(sksRaw);
        if (!(nilaiRaw in bobot) || !Number.isFinite(sks) || sks <= 0) throw new Error(`Baris tidak valid: ${b}`);
        totalBobot += bobot[nilaiRaw] * sks;
        totalSks += sks;
      }
      const ipk = totalBobot / totalSks;
      let predikat = 'Cukup';
      if (ipk >= 3.51) predikat = 'Dengan Pujian';
      else if (ipk >= 3.01) predikat = 'Sangat Memuaskan';
      else if (ipk >= 2.76) predikat = 'Memuaskan';
      return { output: { teks: `Total SKS: ${totalSks}\nIPK: ${ipk.toFixed(2)}\nPredikat: ${predikat}` }, steps: ['IPK = Σ(bobot×SKS) / ΣSKS'] };
    },
  },


  {
    id: 'acak-angka',
    version: '1.0.0',
    category: 'LAINNYA',
    nameId: 'Acak Angka',
    nameEn: 'Random Number Generator',
    descriptionId: 'Hasilkan angka acak dalam rentang tertentu.',
    descriptionEn: 'Generate random numbers in a range.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'min', labelId: 'Batas bawah', labelEn: 'Minimum', type: 'number', required: true },
      { key: 'max', labelId: 'Batas atas', labelEn: 'Maximum', type: 'number', required: true },
      { key: 'jumlah', labelId: 'Jumlah angka', labelEn: 'Count', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const min = Number(ctx.values['min']);
      const max = Number(ctx.values['max']);
      const jumlah = Number(ctx.values['jumlah'] || 1);
      if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('Batas harus bilangan bulat');
      if (min >= max) throw new Error('Batas bawah harus < batas atas');
      if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 100) throw new Error('Jumlah 1-100');
      const hasil: number[] = [];
      for (let i = 0; i < jumlah; i++) hasil.push(Math.floor(Math.random() * (max - min + 1)) + min);
      return { output: { teks: `Angka acak (${min}-${max}):\n${hasil.join(', ')}` }, steps: ['Math.random dalam rentang'] };
    },
  },

  {
    id: 'hitung-kebutuhan-air',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator Kebutuhan Air',
    nameEn: 'Daily Water Intake Calculator',
    descriptionId: 'Hitung kebutuhan air minum harian dari berat badan.',
    descriptionEn: 'Calculate daily water intake from body weight.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat badan (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'aktivitas', labelId: 'Aktivitas (ringan/sedang/berat)', labelEn: 'Activity (light/moderate/heavy)', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const berat = Number(ctx.values['berat']);
      if (!Number.isFinite(berat) || berat <= 0 || berat > 500) throw new Error('Berat tidak valid');
      const aktivitas = String(ctx.values['aktivitas'] || 'sedang').toLowerCase().trim();
      let faktor = 35;
      if (aktivitas.includes('ringan')) faktor = 30;
      else if (aktivitas.includes('berat')) faktor = 45;
      const ml = berat * faktor;
      const gelas = ml / 250;
      return { output: { teks: `Kebutuhan air: ${ml.toLocaleString('id-ID')} ml/hari\nSetara ±${gelas.toFixed(1)} gelas (250 ml)\n\nCatatan: tambah bila sakit demam / cuaca panas.` }, steps: ['35 ml × berat badan (kg), disesuaikan aktivitas'] };
    },
  },

  {
    id: 'hitung-bunga-majemuk',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Bunga Majemuk',
    nameEn: 'Compound Interest Calculator',
    descriptionId: 'Hitung pertumbuhan tabungan/investasi dengan bunga majemuk.',
    descriptionEn: 'Calculate savings growth with compound interest.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'pokok', labelId: 'Modal awal (Rp)', labelEn: 'Principal (Rp)', type: 'number', required: true },
      { key: 'bunga', labelId: 'Bunga per tahun (%)', labelEn: 'Annual rate (%)', type: 'number', required: true },
      { key: 'tahun', labelId: 'Jangka waktu (tahun)', labelEn: 'Years', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const pokok = Number(ctx.values['pokok']);
      const bunga = Number(ctx.values['bunga']);
      const tahun = Number(ctx.values['tahun']);
      if (!Number.isFinite(pokok) || pokok <= 0) throw new Error('Modal tidak valid');
      if (!Number.isFinite(bunga) || bunga < 0 || bunga > 100) throw new Error('Bunga tidak valid');
      if (!Number.isFinite(tahun) || tahun <= 0 || tahun > 100) throw new Error('Jangka waktu tidak valid');
      const akhir = pokok * Math.pow(1 + bunga / 100, tahun);
      const keuntungan = akhir - pokok;
      const fmt = (n: number) => `Rp${Math.round(n).toLocaleString('id-ID')}`;
      return { output: { teks: `Modal awal: ${fmt(pokok)}\nBunga: ${bunga}%/tahun selama ${tahun} tahun\nNilai akhir: ${fmt(akhir)}\nKeuntungan: ${fmt(keuntungan)}` }, steps: ['A = P(1+r)^t'] };
    },
  },

  {
    id: 'timer-countdown',
    version: '1.0.0',
    category: 'WAKTU',
    nameId: 'Timer Hitung Mundur',
    nameEn: 'Countdown Timer',
    descriptionId: 'Hitung selisih waktu dari sekarang ke tanggal target.',
    descriptionEn: 'Time remaining from now to a target date.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'target', labelId: 'Tanggal target (YYYY-MM-DD)', labelEn: 'Target date (YYYY-MM-DD)', type: 'text', required: true },
      { key: 'nama', labelId: 'Nama acara (opsional)', labelEn: 'Event name (optional)', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const input = String(ctx.values['target'] || '').trim();
      const target = new Date(input + 'T00:00:00');
      if (isNaN(target.getTime())) throw new Error('Format tanggal tidak valid');
      const now = new Date();
      const nama = String(ctx.values['nama'] || 'Target').trim() || 'Target';
      const selisih = target.getTime() - now.getTime();
      if (selisih < 0) {
        const lewat = Math.floor(-selisih / 86400000);
        return { output: { teks: `${nama} sudah lewat ${lewat} hari yang lalu.` }, steps: ['Hitung selisih hari'] };
      }
      const hari = Math.floor(selisih / 86400000);
      const jam = Math.floor((selisih % 86400000) / 3600000);
      const mnt = Math.floor((selisih % 3600000) / 60000);
      return { output: { teks: `${nama}: ${hari} hari, ${jam} jam, ${mnt} menit lagi.` }, steps: ['Hitung selisih waktu'] };
    },
  },

  {
    id: 'hitung-umur',
    version: '1.0.0',
    category: 'WAKTU',
    nameId: 'Kalkulator Umur',
    nameEn: 'Age Calculator',
    descriptionId: 'Hitung umur tepat: tahun, bulan, hari dari tanggal lahir.',
    descriptionEn: 'Calculate exact age: years, months, days from birth date.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'lahir', labelId: 'Tanggal lahir (YYYY-MM-DD)', labelEn: 'Birth date (YYYY-MM-DD)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const input = String(ctx.values['lahir'] || '').trim();
      const lahir = new Date(input + 'T00:00:00');
      if (isNaN(lahir.getTime())) throw new Error('Format tanggal tidak valid');
      const now = new Date();
      if (lahir > now) throw new Error('Tanggal lahir di masa depan');
      let thn = now.getFullYear() - lahir.getFullYear();
      let bln = now.getMonth() - lahir.getMonth();
      let hari = now.getDate() - lahir.getDate();
      if (hari < 0) { bln--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); hari += prev.getDate(); }
      if (bln < 0) { thn--; bln += 12; }
      const totalHari = Math.floor((now.getTime() - lahir.getTime()) / 86400000);
      return { output: { teks: `Umur: ${thn} tahun, ${bln} bulan, ${hari} hari\nTotal hari hidup: ${totalHari.toLocaleString('id-ID')} hari` }, steps: ['Hitung selisih tanggal kalender'] };
    },
  },

  {
    id: 'acak-nama-kelompok',
    version: '1.0.0',
    category: 'PENDIDIKAN',
    nameId: 'Acak Nama Kelompok',
    nameEn: 'Random Group Generator',
    descriptionId: 'Bagi daftar nama menjadi kelompok acak.',
    descriptionEn: 'Split a name list into random groups.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nama', labelId: 'Daftar nama (satu per baris)', labelEn: 'Name list (one per line)', type: 'text', required: true },
      { key: 'jumlah', labelId: 'Jumlah kelompok', labelEn: 'Number of groups', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 102400,
    maxComputeSeconds: 5,
    handler(ctx) {
      const daftar = String(ctx.values['nama'] || '').split('\n').map((x) => x.trim()).filter(Boolean);
      const jumlah = Number(ctx.values['jumlah']);
      if (daftar.length < 2) throw new Error('Minimal 2 nama');
      if (!Number.isInteger(jumlah) || jumlah < 2 || jumlah > daftar.length) throw new Error('Jumlah kelompok tidak valid');
      const acak = [...daftar];
      for (let i = acak.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [acak[i], acak[j]] = [acak[j], acak[i]];
      }
      const kelompok: string[][] = Array.from({ length: jumlah }, () => []);
      acak.forEach((n, i) => kelompok[i % jumlah].push(n));
      const teks = kelompok.map((k, i) => `Kelompok ${i + 1}: ${k.join(', ')}`).join('\n');
      return { output: { teks }, steps: ['Acak urutan (Fisher-Yates)', 'Bagi round-robin'] };
    },
  },

  {
    id: 'hitung-diskon-ganda',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Diskon Ganda',
    nameEn: 'Double Discount Calculator',
    descriptionId: 'Hitung harga akhir setelah diskon bertingkat (misal 50%+20%).',
    descriptionEn: 'Calculate final price after stacked discounts.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'harga', labelId: 'Harga awal (Rp)', labelEn: 'Original price (Rp)', type: 'number', required: true },
      { key: 'diskon', labelId: 'Diskon dipisah koma (misal 50,20)', labelEn: 'Discounts comma-separated (e.g. 50,20)', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const harga = Number(ctx.values['harga']);
      if (!Number.isFinite(harga) || harga <= 0) throw new Error('Harga tidak valid');
      const daftar = String(ctx.values['diskon'] || '').split(',').map((x) => Number(x.trim()));
      if (daftar.some((d) => !Number.isFinite(d) || d < 0 || d >= 100)) throw new Error('Diskon tidak valid (0-99)');
      let sisa = harga;
      const langkah: string[] = [];
      for (const d of daftar) {
        const potongan = (sisa * d) / 100;
        sisa -= potongan;
        langkah.push(`-${d}% → Rp${Math.round(sisa).toLocaleString('id-ID')}`);
      }
      const totalHemat = harga - sisa;
      return { output: { teks: `Harga awal: Rp${harga.toLocaleString('id-ID')}\n${langkah.join('\n')}\nHarga akhir: Rp${Math.round(sisa).toLocaleString('id-ID')}\nTotal hemat: Rp${Math.round(totalHemat).toLocaleString('id-ID')}` }, steps: langkah };
    },
  },

  {
    id: 'konversi-satuan-panjang',
    version: '1.0.0',
    category: 'RUMUS',
    nameId: 'Konversi Satuan Panjang',
    nameEn: 'Length Unit Converter',
    descriptionId: 'Konversi km, m, cm, mm, mil, inci, kaki, yard.',
    descriptionEn: 'Convert km, m, cm, mm, miles, inches, feet, yards.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai', labelEn: 'Value', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari satuan', labelEn: 'From unit', type: 'text', required: true },
      { key: 'ke', labelId: 'Ke satuan', labelEn: 'To unit', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const nilai = Number(ctx.values['nilai']);
      if (!Number.isFinite(nilai)) throw new Error('Nilai tidak valid');
      const keMeter: Record<string, number> = { km: 1000, m: 1, cm: 0.01, mm: 0.001, mil: 1609.34, inci: 0.0254, kaki: 0.3048, yard: 0.9144 };
      const dari = String(ctx.values['dari'] || '').toLowerCase().trim();
      const ke = String(ctx.values['ke'] || '').toLowerCase().trim();
      if (!(dari in keMeter) || !(ke in keMeter)) throw new Error('Satuan tidak dikenal. Pilih: km, m, cm, mm, mil, inci, kaki, yard');
      const hasil = (nilai * keMeter[dari]) / keMeter[ke];
      return { output: { teks: `${nilai} ${dari} = ${hasil.toFixed(4)} ${ke}` }, steps: ['Konversi via meter sebagai acuan'] };
    },
  },


  {
    id: 'cek-plagiarisme-sederhana',
    version: '1.0.0',
    category: 'TEKS',
    nameId: 'Cek Kesamaan Teks',
    nameEn: 'Text Similarity Checker',
    descriptionId: 'Bandingkan dua teks: hitung persen kesamaan kata.',
    descriptionEn: 'Compare two texts: word similarity percentage.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'teks1', labelId: 'Teks pertama', labelEn: 'First text', type: 'text', required: true },
      { key: 'teks2', labelId: 'Teks kedua', labelEn: 'Second text', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 102400,
    maxComputeSeconds: 5,
    handler(ctx) {
      const t1 = String(ctx.values['teks1'] || '').toLowerCase();
      const t2 = String(ctx.values['teks2'] || '').toLowerCase();
      if (!t1.trim() || !t2.trim()) throw new Error('Kedua teks harus diisi');
      const w1 = new Set(t1.split(/\s+/));
      const w2 = new Set(t2.split(/\s+/));
      let sama = 0;
      for (const w of w1) if (w2.has(w)) sama++;
      const persen = (sama / Math.max(w1.size, w2.size)) * 100;
      return { output: { teks: `Kata unik teks 1: ${w1.size}\nKata unik teks 2: ${w2.size}\nKata sama: ${sama}\nKesamaan: ${persen.toFixed(1)}%` }, steps: ['Bandingkan himpunan kata (Jaccard)'] };
    },
  },

  {
    id: 'hitung-bmi-dewasa',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator BMI Dewasa',
    nameEn: 'Adult BMI Calculator',
    descriptionId: 'Hitung indeks massa tubuh dari berat dan tinggi.',
    descriptionEn: 'Calculate body mass index from weight and height.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'berat', labelId: 'Berat badan (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'tinggi', labelId: 'Tinggi badan (cm)', labelEn: 'Height (cm)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const berat = Number(ctx.values['berat']);
      const tinggiCm = Number(ctx.values['tinggi']);
      if (!Number.isFinite(berat) || berat <= 0 || berat > 500) throw new Error('Berat tidak valid');
      if (!Number.isFinite(tinggiCm) || tinggiCm <= 0 || tinggiCm > 300) throw new Error('Tinggi tidak valid');
      const tinggiM = tinggiCm / 100;
      const bmi = berat / (tinggiM * tinggiM);
      let kategori: string;
      if (bmi < 18.5) kategori = 'Kurus';
      else if (bmi < 25) kategori = 'Normal';
      else if (bmi < 30) kategori = 'Gemuk (overweight)';
      else kategori = 'Obesitas';
      return { output: { teks: `BMI: ${bmi.toFixed(1)}\nKategori: ${kategori}\n\nCatatan: BMI tidak membedakan otot dan lemak. Konsultasi ke dokter untuk penilaian lengkap.` }, steps: ['BMI = berat(kg) / tinggi(m)²'] };
    },
  },

  {
    id: 'timer-pomodoro',
    version: '1.0.0',
    category: 'PRODUKTIVITAS',
    nameId: 'Panduan Pomodoro',
    nameEn: 'Pomodoro Guide',
    descriptionId: 'Hitung jadwal sesi fokus pomodoro dari total waktu.',
    descriptionEn: 'Plan pomodoro focus sessions from total time.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'menit', labelId: 'Total waktu tersedia (menit)', labelEn: 'Total time (minutes)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const total = Number(ctx.values['menit']);
      if (!Number.isFinite(total) || total < 25) throw new Error('Minimal 25 menit');
      const sesi: string[] = [];
      let sisa = total;
      let n = 1;
      while (sisa >= 25) {
        const fokus = 25;
        sisa -= fokus;
        let istirahat = 5;
        if (n % 4 === 0) istirahat = 15;
        if (sisa < istirahat) { sesi.push(`Sesi ${n}: fokus ${fokus} mnt`); sisa = 0; break; }
        sesi.push(`Sesi ${n}: fokus ${fokus} mnt + istirahat ${istirahat} mnt`);
        sisa -= istirahat;
        n++;
        if (n > 12) break;
      }
      return { output: { teks: `Total ${total} menit:\n${sesi.join('\n')}\n\nGunakan timer HP untuk tiap sesi.` }, steps: ['25 fokus / 5 istirahat, tiap 4 sesi istirahat 15'] };
    },
  },


  {
    id: 'saran-film',
    version: '1.0.0',
    category: 'HIBURAN',
    nameId: 'Saran Film Malam Ini (Hiburan)',
    nameEn: 'Movie Suggestion (Fun)',
    descriptionId: 'Dapatkan saran film acak berdasarkan genre untuk hiburan.',
    descriptionEn: 'Get a random movie suggestion by genre.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'genre', labelId: 'Genre (aksi/komedi/drama/horor)', labelEn: 'Genre', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const genre = String(ctx.values['genre'] || '').trim().toLowerCase();
      const daftar: Record<string, string[]> = {
        aksi: ['The Raid', 'John Wick', 'Mad Max: Fury Road'],
        komedi: ['Warkop DKI Reborn', 'My Stupid Boss', 'Hangover'],
        drama: ['Laskar Pelangi', 'Habibie & Ainun', 'Forrest Gump'],
        horor: ['Pengabdi Setan', 'KKN di Desa Penari', 'The Conjuring'],
      };
      const kunci = Object.keys(daftar).find(k => genre.includes(k)) || Object.keys(daftar)[Math.floor(Math.random() * 4)];
      const pilihan = daftar[kunci];
      const hasil = pilihan[Math.floor(Math.random() * pilihan.length)];
      return { output: { teks: `Genre: ${kunci}\nSaran film malam ini: ${hasil}\n\nSelamat menonton!` }, steps: ['Pilih acak dari daftar'] };
    },
  },

  {
    id: 'konversi-berat',
    version: '1.0.0',
    category: 'RUMAH',
    nameId: 'Konversi Satuan Berat',
    nameEn: 'Weight Converter',
    descriptionId: 'Konversi kg, gram, ons, pon, kwintal, ton.',
    descriptionEn: 'Convert kg, gram, ounce, pound, quintal, ton.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai', labelEn: 'Value', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari satuan', labelEn: 'From unit', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const nilai = Number(ctx.values['nilai']);
      const dari = String(ctx.values['dari'] || '').trim().toLowerCase();
      if (!Number.isFinite(nilai) || nilai < 0) throw new Error('Nilai tidak valid');
      const keGram: Record<string, number> = { gram: 1, kg: 1000, ons: 100, pon: 500, kwintal: 100000, ton: 1000000 };
      const faktor = keGram[dari];
      if (!faktor) throw new Error('Satuan tidak dikenal (gram/kg/ons/pon/kwintal/ton)');
      const totalGram = nilai * faktor;
      const hasil = Object.entries(keGram).map(([sat, f]) => `${sat}: ${(totalGram / f).toLocaleString('id-ID', { maximumFractionDigits: 3 })}`).join('\n');
      return { output: { teks: hasil }, steps: ['Konversi via gram'] };
    },
  },

  {
    id: 'hitung-lembur',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Upah Lembur',
    nameEn: 'Overtime Pay Calculator',
    descriptionId: 'Hitung upah lembur sesuai aturan Kemenaker (1,5x & 2x).',
    descriptionEn: 'Calculate overtime pay per Indonesian labor rules.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'gaji', labelId: 'Gaji bulanan (Rp)', labelEn: 'Monthly salary (Rp)', type: 'number', required: true },
      { key: 'jam', labelId: 'Jam lembur', labelEn: 'Overtime hours', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const gaji = Number(ctx.values['gaji']);
      const jam = Number(ctx.values['jam']);
      if (!Number.isFinite(gaji) || gaji <= 0) throw new Error('Gaji tidak valid');
      if (!Number.isFinite(jam) || jam <= 0) throw new Error('Jam lembur tidak valid');
      const upahPerJam = gaji / 173;
      const jamPertama = Math.min(jam, 1);
      const jamBerikut = Math.max(jam - 1, 0);
      const total = jamPertama * 1.5 * upahPerJam + jamBerikut * 2 * upahPerJam;
      const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
      return { output: { teks: `Upah/jam: ${fmt(upahPerJam)}\nJam pertama (1,5x): ${fmt(jamPertama * 1.5 * upahPerJam)}\nJam berikut (2x): ${fmt(jamBerikut * 2 * upahPerJam)}\nTotal lembur: ${fmt(total)}` }, steps: ['Upah/jam = gaji/173', 'Jam 1: 1,5x, sisanya 2x'] };
    },
  },

  {
    id: 'cek-khodam',
    version: '1.0.0',
    category: 'HIBURAN',
    nameId: 'Cek Khodam (Hiburan)',
    nameEn: 'Khodam Checker (Fun)',
    descriptionId: 'Hiburan: "cek khodam" acak untuk seru-seruan. Bukan hal mistis sungguhan.',
    descriptionEn: 'Fun random khodam generator. Just for laughs.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nama', labelId: 'Nama', labelEn: 'Name', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const nama = String(ctx.values['nama'] || '').trim();
      if (!nama) throw new Error('Isi nama dulu');
      const daftar = ['Khodam Macan Putih', 'Khodam Naga Emas', 'Khodam Semar Mesem', 'Khodam Kuntilanak Baik Hati', 'Khodam Tuyul Rajin', 'Khodam Genderuwo Gaul', 'Khodam Pocong Santai', 'Khodam Wewe Gombel Ramah'];
      let hash = 0;
      for (const c of nama) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
      const hasil = daftar[hash % daftar.length];
      return { output: { teks: `${nama}, khodam kamu adalah: ${hasil}\n\nCatatan: ini murni hiburan acak, jangan dianggap serius ya!` }, steps: ['Acak berdasarkan nama'] };
    },
  },

  {
    id: 'konversi-waktu',
    version: '1.0.0',
    category: 'WAKTU',
    nameId: 'Konversi Satuan Waktu',
    nameEn: 'Time Unit Converter',
    descriptionId: 'Konversi detik, menit, jam, hari, minggu, bulan, tahun.',
    descriptionEn: 'Convert seconds, minutes, hours, days, weeks, months, years.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai', labelEn: 'Value', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari satuan', labelEn: 'From unit', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const nilai = Number(ctx.values['nilai']);
      const dari = String(ctx.values['dari'] || '').trim().toLowerCase();
      if (!Number.isFinite(nilai) || nilai < 0) throw new Error('Nilai tidak valid');
      const keDetik: Record<string, number> = { detik: 1, menit: 60, jam: 3600, hari: 86400, minggu: 604800, bulan: 2592000, tahun: 31536000 };
      const faktor = keDetik[dari];
      if (!faktor) throw new Error('Satuan tidak dikenal (detik/menit/jam/hari/minggu/bulan/tahun)');
      const totalDetik = nilai * faktor;
      const hasil = Object.entries(keDetik).map(([sat, f]) => `${sat}: ${(totalDetik / f).toLocaleString('id-ID', { maximumFractionDigits: 2 })}`).join('\n');
      return { output: { teks: hasil }, steps: ['Konversi via detik'] };
    },
  },

  {
    id: 'pembalik-teks',
    version: '1.0.0',
    category: 'TEKS',
    nameId: 'Pembalik Teks',
    nameEn: 'Text Reverser',
    descriptionId: 'Balik teks per karakter atau per kata.',
    descriptionEn: 'Reverse text by character or by word.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'teks', labelId: 'Teks', labelEn: 'Text', type: 'text', required: true },
      { key: 'mode', labelId: 'Mode (karakter/kata)', labelEn: 'Mode (char/word)', type: 'text', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 102400,
    maxComputeSeconds: 5,
    handler(ctx) {
      const teks = String(ctx.values['teks'] || '');
      if (!teks) throw new Error('Teks kosong');
      const mode = String(ctx.values['mode'] || 'karakter').toLowerCase();
      const hasil = mode.startsWith('kata')
        ? teks.split(/\s+/).reverse().join(' ')
        : [...teks].reverse().join('');
      return { output: { teks: hasil }, steps: [`Mode: ${mode}`] };
    },
  },



  {
    id: 'pemisah-teks',
    version: '1.0.0',
    category: 'TEKS',
    nameId: 'Pembersih Teks',
    nameEn: 'Text Cleaner',
    descriptionId: 'Rapikan teks: hapus spasi ganda, baris kosong berlebih.',
    descriptionEn: 'Clean text: remove double spaces and excess blank lines.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'teks', labelId: 'Teks', labelEn: 'Text', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 102400,
    maxComputeSeconds: 5,
    handler(ctx) {
      const teks = String(ctx.values['teks'] || '');
      if (!teks.trim()) throw new Error('Teks kosong');
      const bersih = teks
        .replace(/[^\S\n]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .split('\n').map(l => l.trimEnd()).join('\n')
        .trim();
      return { output: { teks: bersih }, steps: ['Normalisasi spasi dan baris'] };
    },
  },

  {
    id: 'kalkulator-imbal-hasil',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Imbal Hasil Tabungan',
    nameEn: 'Savings Yield Calculator',
    descriptionId: 'Hitung pertumbuhan tabungan dengan bunga majemuk.',
    descriptionEn: 'Calculate savings growth with compound interest.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'pokok', labelId: 'Setoran awal (Rp)', labelEn: 'Initial deposit (Rp)', type: 'number', required: true },
      { key: 'bunga', labelId: 'Bunga per tahun (%)', labelEn: 'Annual rate (%)', type: 'number', required: true },
      { key: 'tahun', labelId: 'Jangka waktu (tahun)', labelEn: 'Years', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const pokok = Number(ctx.values['pokok']);
      const bunga = Number(ctx.values['bunga']);
      const tahun = Number(ctx.values['tahun']);
      if (!Number.isFinite(pokok) || pokok < 0) throw new Error('Setoran tidak valid');
      if (!Number.isFinite(bunga) || bunga < 0) throw new Error('Bunga tidak valid');
      if (!Number.isFinite(tahun) || tahun <= 0) throw new Error('Jangka waktu tidak valid');
      const akhir = pokok * Math.pow(1 + bunga / 100, tahun);
      const hasil = akhir - pokok;
      const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
      return { output: { teks: `Setoran awal: ${fmt(pokok)}\nBunga: ${bunga}%/tahun selama ${tahun} tahun\nNilai akhir: ${fmt(akhir)}\nImbal hasil: ${fmt(hasil)}` }, steps: ['A = P(1+r)^t'] };
    },
  },




  {
    id: 'kalkulator-waktu-tempuh',
    version: '1.0.0',
    category: 'WAKTU',
    nameId: 'Kalkulator Waktu Tempuh',
    nameEn: 'Travel Time Calculator',
    descriptionId: 'Hitung waktu tempuh dari jarak dan kecepatan rata-rata.',
    descriptionEn: 'Calculate travel time from distance and average speed.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jarak', labelId: 'Jarak (km)', labelEn: 'Distance (km)', type: 'number', required: true },
      { key: 'kecepatan', labelId: 'Kecepatan rata-rata (km/jam)', labelEn: 'Average speed (km/h)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 2048,
    maxComputeSeconds: 5,
    handler(ctx) {
      const jarak = Number(ctx.values['jarak']);
      const kecepatan = Number(ctx.values['kecepatan']);
      if (!Number.isFinite(jarak) || jarak < 0) throw new Error('Jarak tidak valid');
      if (!Number.isFinite(kecepatan) || kecepatan <= 0) throw new Error('Kecepatan harus > 0');
      const jamDesimal = jarak / kecepatan;
      const jam = Math.floor(jamDesimal);
      const menit = Math.round((jamDesimal - jam) * 60);
      return { output: { teks: `Jarak: ${jarak} km\nKecepatan: ${kecepatan} km/jam\nWaktu tempuh: ${jam} jam ${menit} menit` }, steps: ['Waktu = Jarak / Kecepatan'] };
    },
  },
  {
    id: 'kalkulator-zakat',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Kalkulator Zakat Penghasilan',
    nameEn: 'Income Zakat Calculator',
    descriptionId: 'Hitung zakat penghasilan 2,5% dengan nisab emas.',
    descriptionEn: 'Calculate 2.5% income zakat with gold nisab.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'penghasilan', labelId: 'Penghasilan per bulan (Rp)', labelEn: 'Monthly income (IDR)', type: 'number', required: true },
      { key: 'hargaEmas', labelId: 'Harga emas per gram (Rp)', labelEn: 'Gold price per gram (IDR)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: KB * 2,
    maxComputeSeconds: 5,
    handler(ctx) {
      const penghasilan = Number(ctx.values['penghasilan']);
      const hargaEmas = Number(ctx.values['hargaEmas']);
      if (!Number.isFinite(penghasilan) || penghasilan < 0) throw new Error('Penghasilan tidak valid');
      if (!Number.isFinite(hargaEmas) || hargaEmas <= 0) throw new Error('Harga emas tidak valid');
      const nisab = 85 * hargaEmas;
      const wajib = penghasilan >= nisab;
      const zakat = wajib ? penghasilan * 0.025 : 0;
      const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
      return { output: { teks: `Penghasilan: ${fmt(penghasilan)}\nNisab (85g emas): ${fmt(nisab)}\n${wajib ? `Wajib zakat: ${fmt(zakat)} (2,5%)` : 'Belum wajib zakat (di bawah nisab)'}\n\nCatatan: ini panduan umum; konsultasikan dengan ustadz/lembaga zakat untuk kasus khusus.` }, steps: [`Nisab = 85 × ${fmt(hargaEmas)}`, `Bandingkan penghasilan dengan nisab`] };
    },
  },
  {
    id: 'kalkulator-pecahan',
    version: '1.0.0',
    category: 'MATEMATIKA',
    nameId: 'Kalkulator Pecahan',
    nameEn: 'Fraction Calculator',
    descriptionId: 'Jumlah, kurang, kali, bagi pecahan dengan langkah penyelesaian.',
    descriptionEn: 'Add, subtract, multiply, divide fractions with steps.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'a1', labelId: 'Pembilang 1', labelEn: 'Numerator 1', type: 'number', required: true },
      { key: 'b1', labelId: 'Penyebut 1', labelEn: 'Denominator 1', type: 'number', required: true },
      { key: 'op', labelId: 'Operasi (+, -, ×, ÷)', labelEn: 'Operation', type: 'text', required: true },
      { key: 'a2', labelId: 'Pembilang 2', labelEn: 'Numerator 2', type: 'number', required: true },
      { key: 'b2', labelId: 'Penyebut 2', labelEn: 'Denominator 2', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const a1 = Number(ctx.values['a1']), b1 = Number(ctx.values['b1']);
      const a2 = Number(ctx.values['a2']), b2 = Number(ctx.values['b2']);
      const op = String(ctx.values['op']).trim();
      if (!b1 || !b2) throw new Error('Penyebut tidak boleh nol');
      const gcd = (x: number, y: number): number => y ? gcd(y, x % y) : Math.abs(x);
      let n = 0, d = 1, langkah = '';
      if (op === '+') { n = a1*b2 + a2*b1; d = b1*b2; langkah = `Samakan penyebut: ${a1}/${b1} + ${a2}/${b2} = ${a1*b2}/${d} + ${a2*b1}/${d} = ${n}/${d}`; }
      else if (op === '-') { n = a1*b2 - a2*b1; d = b1*b2; langkah = `${a1*b2}/${d} - ${a2*b1}/${d} = ${n}/${d}`; }
      else if (op === '×' || op === '*') { n = a1*a2; d = b1*b2; langkah = `Kalikan pembilang × pembilang, penyebut × penyebut = ${n}/${d}`; }
      else if (op === '÷' || op === '/') { n = a1*b2; d = b1*a2; langkah = `Balik pecahan kedua lalu kalikan = ${n}/${d}`; }
      else throw new Error('Operasi harus +, -, ×, ÷');
      const f = gcd(n, d); n /= f; d /= f;
      const bulat = Math.floor(Math.abs(n) / d);
      const sisa = Math.abs(n) % d;
      const campuran = bulat > 0 && sisa > 0 ? `${n < 0 ? '-' : ''}${bulat} ${sisa}/${d}` : `${n}/${d}`;
      return { output: { teks: `${langkah}\nSederhanakan (FPB ${f}): ${n}/${d}\nBentuk campuran: ${campuran}` }, steps: [langkah] };
    },
  },
  {
    id: 'konversi-bilangan',
    version: '1.0.0',
    category: 'MATEMATIKA',
    nameId: 'Konversi Desimal–Biner–Heksa',
    nameEn: 'Number Base Converter',
    descriptionId: 'Konversi bilangan desimal, biner, oktal, heksadesimal.',
    descriptionEn: 'Convert between decimal, binary, octal, hexadecimal.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai', labelEn: 'Value', type: 'text', required: true },
      { key: 'dari', labelId: 'Dari basis (2/8/10/16)', labelEn: 'From base', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const nilai = String(ctx.values['nilai']).trim();
      const dari = Number(ctx.values['dari']);
      if (![2, 8, 10, 16].includes(dari)) throw new Error('Basis harus 2, 8, 10, atau 16');
      const des = parseInt(nilai, dari);
      if (isNaN(des)) throw new Error('Nilai tidak valid untuk basis ' + dari);
      return { output: { teks: `Desimal: ${des}\nBiner: ${des.toString(2)}\nOktal: ${des.toString(8)}\nHeksadesimal: ${des.toString(16).toUpperCase()}` }, steps: [`${nilai} basis ${dari} = ${des} desimal`] };
    },
  },
  {
    id: 'kalkulator-subnet',
    version: '1.0.0',
    category: 'TEKNOLOGI',
    nameId: 'Kalkulator Subnet IP',
    nameEn: 'IP Subnet Calculator',
    descriptionId: 'Hitung network, broadcast, dan rentang IP dari CIDR.',
    descriptionEn: 'Calculate network, broadcast, and IP range from CIDR.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'cidr', labelId: 'CIDR (cth: 192.168.1.0/24)', labelEn: 'CIDR', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const cidr = String(ctx.values['cidr']).trim();
      const m = cidr.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
      if (!m) throw new Error('Format: 192.168.1.0/24');
      const o = [1,2,3,4].map(i => parseInt(m[i]));
      const prefix = parseInt(m[5]);
      if (o.some(x => x < 0 || x > 255) || prefix < 0 || prefix > 32) throw new Error('IP/prefix tidak valid');
      const ip = (o[0]<<24) + (o[1]<<16) + (o[2]<<8) + o[3];
      const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
      const net = (ip & mask) >>> 0;
      const bcast = (net | (~mask >>> 0)) >>> 0;
      const f = (n: number) => [(n>>>24)&255, (n>>>16)&255, (n>>>8)&255, n&255].join('.');
      const hosts = Math.max(0, Math.pow(2, 32 - prefix) - 2);
      return { output: { teks: `Network: ${f(net)}\nBroadcast: ${f(bcast)}\nSubnet mask: ${f(mask)}\nJumlah host: ${hosts}\nRentang: ${f(net+1)} - ${f(bcast-1)}` }, steps: [`Prefix /${prefix}`] };
    },
  },
  {
    id: 'konversi-resep',
    version: '1.0.0',
    category: 'KULINER',
    nameId: 'Konversi Resep Masakan',
    nameEn: 'Recipe Converter',
    descriptionId: 'Konversi takaran: sendok, gelas, gram, ml.',
    descriptionEn: 'Convert cooking measurements.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jumlah', labelId: 'Jumlah', labelEn: 'Amount', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari (sdm/sdt/gelas/gram/ml)', labelEn: 'From', type: 'text', required: true },
      { key: 'bahan', labelId: 'Bahan (tepung/gula/air/minyak/beras)', labelEn: 'Ingredient', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const jml = Number(ctx.values['jumlah']);
      const dari = String(ctx.values['dari']).toLowerCase().trim();
      const bahan = String(ctx.values['bahan']).toLowerCase().trim();
      const densitas: Record<string, number> = { tepung: 0.55, gula: 0.85, air: 1, minyak: 0.92, beras: 0.85 };
      const d = densitas[bahan] ?? 1;
      const keMl: Record<string, number> = { sdm: 15, sdt: 5, gelas: 250, ml: 1 };
      let ml = 0;
      if (dari === 'gram') ml = jml / d;
      else if (dari in keMl) ml = jml * keMl[dari];
      else throw new Error('Satuan: sdm, sdt, gelas, gram, ml');
      const gram = ml * d;
      return { output: { teks: `${jml} ${dari} ${bahan} =\n${gram.toFixed(1)} gram\n${ml.toFixed(1)} ml\n${(ml/15).toFixed(1)} sdm\n${(ml/250).toFixed(2)} gelas` }, steps: [`Densitas ${bahan}: ${d} g/ml`] };
    },
  },
  {
    id: 'kalkulator-cat',
    version: '1.0.0',
    category: 'RUMAH',
    nameId: 'Kalkulator Kebutuhan Cat',
    nameEn: 'Paint Calculator',
    descriptionId: 'Hitung liter cat berdasarkan luas dinding.',
    descriptionEn: 'Calculate paint needed by wall area.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'panjang', labelId: 'Panjang ruangan (m)', labelEn: 'Length (m)', type: 'number', required: true },
      { key: 'lebar', labelId: 'Lebar ruangan (m)', labelEn: 'Width (m)', type: 'number', required: true },
      { key: 'tinggi', labelId: 'Tinggi dinding (m)', labelEn: 'Height (m)', type: 'number', required: true },
      { key: 'lapis', labelId: 'Jumlah lapis (default 2)', labelEn: 'Coats', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const p = Number(ctx.values['panjang']), l = Number(ctx.values['lebar']), t = Number(ctx.values['tinggi']);
      const lapis = Number(ctx.values['lapis'] ?? 2) || 2;
      if (p <= 0 || l <= 0 || t <= 0) throw new Error('Ukuran harus positif');
      const luas = 2 * (p + l) * t;
      const dayaSebar = 10; // m2 per liter per lapis
      const liter = (luas * lapis) / dayaSebar;
      const kaleng5 = Math.ceil(liter / 5);
      return { output: { teks: `Luas dinding: ${luas.toFixed(1)} m²\nKebutuhan cat: ${liter.toFixed(1)} liter (${lapis} lapis)\nBeli: ${kaleng5} kaleng 5 liter (dibulatkan ke atas)` }, steps: [`Luas = 2 × (${p}+${l}) × ${t}`] };
    },
  },
  {
    id: 'estimasi-listrik',
    version: '1.0.0',
    category: 'RUMAH',
    nameId: 'Estimasi Biaya Listrik',
    nameEn: 'Electricity Cost Estimator',
    descriptionId: 'Hitung biaya listrik per alat per bulan.',
    descriptionEn: 'Estimate monthly electricity cost per appliance.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'daya', labelId: 'Daya alat (watt)', labelEn: 'Power (watts)', type: 'number', required: true },
      { key: 'jam', labelId: 'Jam pakai per hari', labelEn: 'Hours per day', type: 'number', required: true },
      { key: 'tarif', labelId: 'Tarif per kWh (Rp, default 1444)', labelEn: 'Rate per kWh', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const daya = Number(ctx.values['daya']), jam = Number(ctx.values['jam']);
      const tarif = Number(ctx.values['tarif'] ?? 1444) || 1444;
      if (daya <= 0 || jam < 0 || jam > 24) throw new Error('Daya/jam tidak valid');
      const kwh = (daya * jam * 30) / 1000;
      const biaya = kwh * tarif;
      return { output: { teks: `Konsumsi: ${kwh.toFixed(1)} kWh/bulan\nEstimasi biaya: Rp ${biaya.toLocaleString('id-ID')}/bulan\n(Tarif Rp ${tarif}/kWh)` }, steps: [`${daya}W × ${jam} jam × 30 hari`] };
    },
  },
  {
    id: 'konversi-mata-uang',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Konversi Mata Uang (Kurs Manual)',
    nameEn: 'Currency Converter (Manual Rate)',
    descriptionId: 'Konversi dengan kurs yang kamu masukkan sendiri.',
    descriptionEn: 'Convert with your own exchange rate.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'jumlah', labelId: 'Jumlah', labelEn: 'Amount', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari (cth: USD)', labelEn: 'From', type: 'text', required: true },
      { key: 'ke', labelId: 'Ke (cth: IDR)', labelEn: 'To', type: 'text', required: true },
      { key: 'kurs', labelId: 'Kurs: 1 DARI = ? KE', labelEn: 'Rate', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const jml = Number(ctx.values['jumlah']);
      const dari = String(ctx.values['dari']).toUpperCase().trim();
      const ke = String(ctx.values['ke']).toUpperCase().trim();
      const kurs = Number(ctx.values['kurs']);
      if (jml <= 0 || kurs <= 0) throw new Error('Jumlah/kurs harus positif');
      const hasil = jml * kurs;
      return { output: { teks: `${jml.toLocaleString('id-ID')} ${dari} = ${hasil.toLocaleString('id-ID')} ${ke}\n(Kurs: 1 ${dari} = ${kurs.toLocaleString('id-ID')} ${ke})\nCatatan: kurs manual, cek kurs terkini sebelum transaksi.` }, steps: [`${jml} × ${kurs}`] };
    },
  },
  {
    id: 'penghitung-hari',
    version: '1.0.0',
    category: 'WAKTU',
    nameId: 'Penghitung Selisih Hari',
    nameEn: 'Date Difference Calculator',
    descriptionId: 'Hitung selisih hari antara dua tanggal.',
    descriptionEn: 'Calculate days between two dates.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'dari', labelId: 'Dari (YYYY-MM-DD)', labelEn: 'From', type: 'text', required: true },
      { key: 'sampai', labelId: 'Sampai (YYYY-MM-DD)', labelEn: 'To', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const d1 = new Date(String(ctx.values['dari']).trim());
      const d2 = new Date(String(ctx.values['sampai']).trim());
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) throw new Error('Format: YYYY-MM-DD');
      const diff = Math.round((d2.getTime() - d1.getTime()) / 86400000);
      const minggu = Math.floor(Math.abs(diff) / 7);
      const sisa = Math.abs(diff) % 7;
      return { output: { teks: `Selisih: ${Math.abs(diff)} hari\n= ${minggu} minggu ${sisa} hari\n${diff < 0 ? '(tanggal kedua lebih awal)' : ''}` }, steps: [`${d1.toISOString().slice(0,10)} → ${d2.toISOString().slice(0,10)}`] };
    },
  },
  {
    id: 'bmi-anak',
    version: '1.0.0',
    category: 'KESEHATAN',
    nameId: 'Kalkulator BMI Anak',
    nameEn: 'Child BMI Calculator',
    descriptionId: 'Hitung IMT anak dengan kategori usia.',
    descriptionEn: 'Calculate child BMI with age category.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'bb', labelId: 'Berat badan (kg)', labelEn: 'Weight (kg)', type: 'number', required: true },
      { key: 'tb', labelId: 'Tinggi badan (cm)', labelEn: 'Height (cm)', type: 'number', required: true },
      { key: 'usia', labelId: 'Usia (tahun)', labelEn: 'Age (years)', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const bb = Number(ctx.values['bb']), tb = Number(ctx.values['tb']), usia = Number(ctx.values['usia']);
      if (bb <= 0 || tb <= 0 || usia < 0 || usia > 18) throw new Error('Input tidak valid (usia 0-18)');
      const m = tb / 100;
      const bmi = bb / (m * m);
      let kat = '';
      if (bmi < 14) kat = 'Sangat kurus — konsultasi dokter anak';
      else if (bmi < 17) kat = 'Kurus';
      else if (bmi < 22) kat = 'Normal';
      else if (bmi < 25) kat = 'Gemuk';
      else kat = 'Obesitas — konsultasi dokter anak';
      return { output: { teks: `BMI: ${bmi.toFixed(1)}\nKategori: ${kat}\nCatatan: ini skrining kasar; kurva pertumbuhan WHO/CDC lebih akurat. Konsultasi dokter untuk penilaian.` }, steps: [`${bb} / ${m}²`] };
    },
  },
  {
    id: 'suhu-oven',
    version: '1.0.0',
    category: 'KULINER',
    nameId: 'Konversi Suhu Oven',
    nameEn: 'Oven Temperature Converter',
    descriptionId: 'Celsius, Fahrenheit, dan Gas Mark.',
    descriptionEn: 'Celsius, Fahrenheit, and Gas Mark.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'suhu', labelId: 'Suhu', labelEn: 'Temperature', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari (C/F/Gas)', labelEn: 'From', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const s = Number(ctx.values['suhu']);
      const dari = String(ctx.values['dari']).toUpperCase().trim();
      let c = 0;
      if (dari === 'C') c = s;
      else if (dari === 'F') c = (s - 32) * 5/9;
      else if (dari === 'GAS' || dari === 'G') c = (s * 14) + 121; // aproksimasi
      else throw new Error('Dari: C, F, atau Gas');
      const f = c * 9/5 + 32;
      const gas = Math.max(1, Math.round((c - 121) / 14));
      return { output: { teks: `${c.toFixed(0)}°C = ${f.toFixed(0)}°F = Gas Mark ${gas}` }, steps: [`Input ${s} ${dari}`] };
    },
  },
  {
    id: 'split-bill',
    version: '1.0.0',
    category: 'KEUANGAN',
    nameId: 'Split Bill Patungan',
    nameEn: 'Bill Splitter',
    descriptionId: 'Bagi tagihan makan patungan + pajak & servis.',
    descriptionEn: 'Split restaurant bill with tax and service.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'total', labelId: 'Total tagihan (Rp)', labelEn: 'Total bill', type: 'number', required: true },
      { key: 'orang', labelId: 'Jumlah orang', labelEn: 'People', type: 'number', required: true },
      { key: 'pajak', labelId: 'Pajak+servis (%)', labelEn: 'Tax+service %', type: 'number', required: false },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const total = Number(ctx.values['total']), orang = Number(ctx.values['orang']);
      const pajak = Number(ctx.values['pajak'] ?? 0) || 0;
      if (total <= 0 || orang <= 0) throw new Error('Total/orang harus positif');
      const grand = total * (1 + pajak / 100);
      const perOrang = grand / orang;
      return { output: { teks: `Total + ${pajak}%: Rp ${Math.round(grand).toLocaleString('id-ID')}\nPer orang: Rp ${Math.round(perOrang).toLocaleString('id-ID')} (${orang} orang)` }, steps: [`${total} × ${1 + pajak/100}`] };
    },
  },
  {
    id: 'ukuran-baju',
    version: '1.0.0',
    category: 'FASHION',
    nameId: 'Panduan Ukuran Baju',
    nameEn: 'Clothing Size Guide',
    descriptionId: 'Konversi ukuran baju Indonesia/internasional.',
    descriptionEn: 'Convert clothing sizes.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'lingkar_dada', labelId: 'Lingkar dada (cm)', labelEn: 'Chest (cm)', type: 'number', required: true },
      { key: 'jenis', labelId: 'Jenis (pria/wanita)', labelEn: 'Type', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const dada = Number(ctx.values['lingkar_dada']);
      const jenis = String(ctx.values['jenis']).toLowerCase().trim();
      if (dada <= 0) throw new Error('Lingkar dada harus positif');
      const tabelPria = [[88,'S'],[96,'M'],[104,'L'],[112,'XL'],[120,'XXL']];
      const tabelWanita = [[84,'S'],[90,'M'],[96,'L'],[102,'XL'],[110,'XXL']];
      const tabel = jenis === 'wanita' ? tabelWanita : tabelPria;
      let size = tabel[0][1] as string;
      for (const [batas, s] of tabel) { if (dada <= (batas as number)) { size = s as string; break; } size = s as string; }
      return { output: { teks: `Lingkar dada ${dada} cm (${jenis})\nUkuran disarankan: ${size}\nCatatan: tiap brand bisa berbeda; cek size chart penjual.` }, steps: [`Bandingkan dengan tabel ${jenis}`] };
    },
  },
  {
    id: 'timer-stopwatch',
    version: '1.0.0',
    category: 'WAKTU',
    nameId: 'Stopwatch & Timer (Panduan)',
    nameEn: 'Stopwatch & Timer Guide',
    descriptionId: 'Panduan memakai stopwatch/timer + konversi waktu.',
    descriptionEn: 'Stopwatch/timer guide with time conversion.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'menit', labelId: 'Menit', labelEn: 'Minutes', type: 'number', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const mnt = Number(ctx.values['menit']);
      if (mnt < 0) throw new Error('Menit harus positif');
      const jam = Math.floor(mnt / 60);
      const sisa = mnt % 60;
      const detik = mnt * 60;
      return { output: { teks: `${mnt} menit =\n${jam} jam ${sisa} menit\n${detik.toLocaleString('id-ID')} detik\nTips: gunakan timer HP untuk praktik; teknik pomodoro 25/5.` }, steps: [`${mnt} menit dikonversi`] };
    },
  },
  {
    id: 'konversi-panjang-tukang',
    version: '1.0.0',
    category: 'RUMAH',
    nameId: 'Konversi Satuan Tukang',
    nameEn: 'Builder Unit Converter',
    descriptionId: 'Inci, kaki, meter, bata, semen: satuan proyek.',
    descriptionEn: 'Construction unit conversions.',
    family: 'LOCAL_LIGHT', risk: 'NONE', packageAccess: 'TRIAL', retention: 'NONE',
    inputSchema: [
      { key: 'nilai', labelId: 'Nilai', labelEn: 'Value', type: 'number', required: true },
      { key: 'dari', labelId: 'Dari (inci/kaki/meter/cm)', labelEn: 'From', type: 'text', required: true },
    ],
    outputSchema: { kind: 'TEXT' },
    maxInputBytes: 4 * KB, maxComputeSeconds: 5,
    handler: (ctx) => {
      const n = Number(ctx.values['nilai']);
      const dari = String(ctx.values['dari']).toLowerCase().trim();
      const keCm: Record<string, number> = { inci: 2.54, kaki: 30.48, meter: 100, cm: 1 };
      if (!(dari in keCm) || n < 0) throw new Error('Satuan: inci, kaki, meter, cm');
      const cm = n * keCm[dari];
      return { output: { teks: `${n} ${dari} =\n${cm.toFixed(2)} cm\n${(cm/100).toFixed(3)} meter\n${(cm/2.54).toFixed(2)} inci\n${(cm/30.48).toFixed(2)} kaki` }, steps: [`${n} ${dari} → cm`] };
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
  ...batch1Tools,
  ...batch2Tools,
  ...batch3Tools,
  ...batch5Tools,
  ...fase2Tools,
  ...fase4Tools,
];

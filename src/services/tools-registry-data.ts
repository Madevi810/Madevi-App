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
];

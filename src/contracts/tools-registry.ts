import type { ContentKind } from '@/contracts/content-guardrails';

/**
 * ============================================================
 * Tools Registry — P10 Tools by Madevi
 * ============================================================
 *
 * P10 arsitektur: "Setiap alat memiliki registry: ID permanen, input schema,
 * batas file/compute, handler, output schema, risiko, akses paket, versi, dan
 * kebijakan retensi."
 *
 * Registry ini adalah SATU tempat mendaftar alat. Route eksekusi generik
 * membaca dari sini berdasarkan `toolId` — alat baru tidak perlu route baru
 * (lulus P10: "Registry dapat menerima alat baru tanpa route duplikat").
 *
 * Trial: dipesan SEBELUM proses, dikomit HANYA setelah sukses (P06
 * `reserveToolsTrial`/`commitToolsTrial`/`releaseToolsTrial`). Alat
 * deterministik ringan tidak menyimpan output sensitif bila dapat dibuat
 * ulang (retensi `NONE`).
 */

/** Tiga keluarga alat (P10 logika ekstra: bedakan lokal/file/berat). */
export type ToolFamily = 'LOCAL_LIGHT' | 'TEMP_FILE' | 'HEAVY';

/** Tingkat risiko → menentukan disclaimer & log level. */
export type ToolRisk = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Akses paket (P10: "mematuhi trial lima kali serta entitlement Plus/Pro/Love").
 * - `TRIAL`: Free memakai 5x global; PLUS/PRO/LOVE tanpa batas.
 * - `PLUS`/`PRO`: hanya pemilik paket (tidak memakan trial).
 */
export type ToolPackageAccess = 'TRIAL' | 'PLUS' | 'PRO';

/** Kebijakan retensi output (P10: "kebijakan retensi"). */
export type ToolRetention = 'NONE' | 'DOWNLOAD_ONLY' | 'PRIVATE_SAVE';

export interface ToolInputField {
  key: string;
  labelId: string;
  labelEn: string;
  type: 'number' | 'text' | 'file' | 'boolean';
  unit?: string;
  required: boolean;
  minimum?: number;
  maximum?: number;
  /** Untuk `file`: MIME yang diizinkan. */
  accept?: string[];
}

export interface ToolOutputSchema {
  kind: 'NUMBER' | 'TEXT' | 'STEPS' | 'FILE';
  unitId?: string;
  unitEn?: string;
}

export interface ToolContext {
  /** Input teks/angka dari request. */
  values: Record<string, unknown>;
  /** File bytes untuk TEMP_FILE (validasi byte nyata, bukan ekstensi). */
  files?: Array<{ name: string; bytes: Uint8Array }>;
}

export interface ToolResult {
  output: Record<string, unknown>;
  /** File hasil untuk kind FILE. */
  file?: { name: string; bytes: Uint8Array; mimeType: string };
  steps?: string[];
}

export interface ToolDefinition {
  /** ID permanen; tidak boleh dipakai ulang setelah rilis. */
  id: string;
  /** Versi tool; ubah bila algoritma berubah (bukan input schema). */
  version: string;
  category: string;
  nameId: string;
  nameEn: string;
  descriptionId: string;
  descriptionEn: string;
  family: ToolFamily;
  risk: ToolRisk;
  packageAccess: ToolPackageAccess;
  retention: ToolRetention;
  inputSchema: ToolInputField[];
  outputSchema: ToolOutputSchema;
  /** Batas input total (byte). */
  maxInputBytes: number;
  /** Batas durasi komputasi (detik) — dipakai untuk timeout. */
  maxComputeSeconds: number;
  /**
   * Disclaimer kontekstual (P10: "Hasil kesehatan/finansial harus memiliki
   * disclaimer kontekstual"). Memakai ulang ContentKind dari P09.
   */
  disclaimerKind?: ContentKind;
  handler: (ctx: ToolContext) => Promise<ToolResult> | ToolResult;
}

/**
 * Registry tunggal. Daftarkan alat sekali di `registerTools`; route generik
 * memanggil `lookup(id)`.
 */
export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition): void {
    if (this.tools.has(tool.id)) {
      throw new Error(`Tool "${tool.id}" sudah terdaftar — ID harus permanen unik`);
    }
    this.tools.set(tool.id, tool);
  }

  lookup(toolId: string): ToolDefinition | null {
    return this.tools.get(toolId) ?? null;
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  listByCategory(category: string): ToolDefinition[] {
    return this.list().filter((t) => t.category === category);
  }
}

/** Validasi input terhadap schema — byte nyata untuk file (P10 logika ekstra). */
export function validateToolInput(
  tool: ToolDefinition,
  ctx: ToolContext,
): { valid: true } | { valid: false; message: string } {
  for (const field of tool.inputSchema) {
    const value = ctx.values[field.key];
    if (field.required) {
      const present =
        field.type === 'file'
          ? Array.isArray(ctx.files) && ctx.files.length > 0
          : value !== undefined && value !== null && value !== '';
      if (!present) {
        return { valid: false, message: `Field "${field.labelId}" wajib diisi` };
      }
    }
    if (field.type === 'number' && value !== undefined && value !== null) {
      const n = Number(value);
      if (!Number.isFinite(n)) {
        return { valid: false, message: `Field "${field.labelId}" harus angka` };
      }
      if (field.minimum !== undefined && n < field.minimum) {
        return { valid: false, message: `"${field.labelId}" minimum ${field.minimum}` };
      }
      if (field.maximum !== undefined && n > field.maximum) {
        return { valid: false, message: `"${field.labelId}" maksimum ${field.maximum}` };
      }
    }
  }

  // Batas input total — cegah decompression bomb / payload raksasa.
  const totalBytes = (ctx.files ?? []).reduce((sum, f) => sum + f.bytes.byteLength, 0);
  if (totalBytes > tool.maxInputBytes) {
    return {
      valid: false,
      message: `Total input ${totalBytes} byte melebihi batas ${tool.maxInputBytes} byte`,
    };
  }

  // Validasi MIME file — byte nyata, bukan ekstensi/claim.
  for (const file of ctx.files ?? []) {
    const accepted = tool.inputSchema.find((f) => f.type === 'file')?.accept;
    if (accepted && accepted.length > 0) {
      const detected = detectMimeType(file.bytes);
      if (!accepted.includes(detected)) {
        return {
          valid: false,
          message: `Tipe file "${file.name}" (${detected}) tidak diizinkan`,
        };
      }
    }
  }
  return { valid: true };
}

/** Deteksi MIME dari magic bytes (bukan ekstensi yang bisa dipalsukan). */
export function detectMimeType(bytes: Uint8Array): string {
  if (bytes.byteLength >= 4) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const sig = view.getUint32(0, false);
    if (sig === 0x25504446) return 'application/pdf';
    if (sig === 0x504b0304 || sig === 0x504b0506) return 'application/zip';
    if (bytes[0] === 0x1f && bytes[1] === 0x8b) return 'application/gzip';
    if (sig === 0x89504e47) return 'image/png';
    if (sig === 0x47494638) return 'image/gif';
    if (sig === 0x424d) return 'image/bmp';
    if (sig === 0x00010000) return 'image/tiff';
    if (sig === 0x49492a00 || sig === 0x4d4d002a) return 'image/tiff';
  }
  if (bytes.byteLength >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (bytes.byteLength >= 2 && bytes[0] === 0x42 && bytes[1] === 0x4d) return 'image/bmp';
  return 'application/octet-stream';
}

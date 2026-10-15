export type PrincipalRole = 'OWNER' | 'MEMBER' | 'SERVICE';

/**
 * L07: vocabulary aplikasi ADMIN/USER (contracts/identity.ts).
 * OWNER/MEMBER adalah detail persistence transisional; UI/API baru memakai
 * ADMIN/USER via adapter. SERVICE bukan user operasional (tidak dipetakan).
 */

export interface Principal {
  id: string;
  role: PrincipalRole;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  entitlementStatus: 'NONE' | 'TRIAL' | 'PAID' | 'EDUCATION';
  socialStatus: 'ENABLED' | 'RESTRICTED' | 'DISABLED';
  fixture: boolean;
}

export interface PolicyDecision {
  allowed: boolean;
  reason: string;
}

export interface ArticleReadPolicy {
  decide(input: { principal: Principal | null; articleId: string }): Promise<PolicyDecision>;
}

export interface ExamEligibility {
  decide(input: { principal: Principal; pathId: string }): Promise<PolicyDecision>;
}

export interface ModerationDecision {
  assess(input: {
    objectId: string;
    relativePath: string;
    contentText?: string;
    url?: string;
    mediaType?: string;
    bytes?: Uint8Array;
    declaredSizeBytes?: number;
  }): Promise<{
    status: 'UNASSESSED' | 'SAFE' | 'UNSAFE';
    reason: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
    category?: string;
    confidence?: number;
    inputKind?: 'TEXT' | 'URL' | 'FILE_HEADER' | 'COMPOSITE';
    engine?: { name: string; version: string; signatureVersion: string; durationMs: number };
  }>;
}

export interface StoredObject {
  id: string;
  ownerPrincipalId: string;
  state: 'QUARANTINE' | 'ACTIVE' | 'REJECTED' | 'DELETED';
  assessment: 'UNASSESSED' | 'SAFE' | 'UNSAFE';
  sizeBytes: number;
  sha256: string;
}

export interface StorageService {
  reserve(input: {
    principal: Principal;
    bytes: number;
    idempotencyKey: string;
  }): Promise<{ reservationId: string; expiresAt: string }>;
  storeQuarantined(input: {
    principal: Principal;
    reservationId: string;
    bytes: Uint8Array;
    mediaType: string;
    originalName: string;
    fixture?: boolean;
  }): Promise<StoredObject>;
}

export interface NotificationOutbox {
  enqueue(input: {
    principal: Principal;
    notificationType: string;
    payload: Record<string, unknown>;
    idempotencyKey: string;
  }): Promise<{ outboxId: string }>;
}

export interface OwnerInbox {
  list(input: { principal: Principal; cursor?: string; limit?: number }): Promise<unknown>;
}

export interface PaymentAdapter {
  readonly mode: 'NOT_IMPLEMENTED';
  createOrder(input: unknown): Promise<never>;
}

export interface ProductSourceAdapter {
  readonly mode: 'NOT_IMPLEMENTED';
  refresh(input: unknown): Promise<never>;
}

export interface ScannerAdapter {
  readonly mode: 'REAL_LOCAL' | 'SIMULASI' | 'NOT_IMPLEMENTED';
  scan(input: unknown): Promise<{ status: 'SAFE' | 'UNSAFE'; report: Record<string, unknown> }>;
}

/** Adapter AI lokal; SIMULASI dipakai oleh fixture dan tidak mengakses jaringan. */
export interface AiAdapter {
  readonly mode: 'SIMULASI' | 'REAL_LOCAL' | 'NOT_IMPLEMENTED';
  answer(input: unknown): Promise<unknown>;
}

// ============================================================
// KONTRAK MADEVI SERVICES & PCB (L04, F02, F03)
// ============================================================

export type ServiceKind = 'LAYOUT' | 'CUSTOM_DESIGN' | 'PCB_LAYOUT' | 'UNDANGAN' | 'LOGO';

export type ServiceOrderStatus =
  'PENDING_APPROVAL' | 'APPROVED' | 'IN_REVISION' | 'COMPLETED' | 'REJECTED' | 'ARCHIVED';

export type ServiceItemStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ServiceCatalogItem {
  id: string;
  kind: ServiceKind;
  title: string;
  slug: string;
  summary: string;
  description: string;
  previewUrl: string;
  fixedPrice: number; // Dalam satuan IDR (Rp)
  isFree: boolean; // true jika fixedPrice === 0
  currency: 'IDR';
  license: 'MADEVI_PERSONAL' | 'MADEVI_COMMERCIAL' | 'OPEN_SOURCE';
  version: string; // SemVer, mis. '1.0.0'
  status: ServiceItemStatus;
  deliverableFormats: string[]; // mis. ['GERBER_RS274X', 'DRILL_NC', 'BOM_CSV']
  createdAt: Date;
  updatedAt: Date;
}

/** Snapshot harga permanen saat pemesanan terjadi */
export interface ServiceOrderSnapshot {
  orderId: string;
  catalogItemId?: string;
  serviceTitle: string;
  serviceKind: ServiceKind;
  snapshotPrice: number;
  currency: 'IDR';
  /** ISO 8601 UTC; kosong bila quote custom belum diterbitkan. */
  agreedAt: string;
  revisionLimit: number; // Batas revisi (default 2, maksimal 10)
  license: string;
  version: string;
  /** Katalog memiliki harga tetap; jasa custom harus menunggu quote Admin. */
  pricingStatus?: 'FIXED' | 'QUOTE_PENDING' | 'QUOTED';
}

export type PcbRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface PcbSafetyFlags {
  hasMainsVoltage: boolean; // Tegangan tinggi mains (>= 50V AC atau >= 120V DC)
  hasLithiumBattery: boolean; // Rangkaian baterai litium / charging circuit
  hasRfWireless: boolean; // Frekuensi tinggi / antena RF / microwave
  hasHighCurrent: boolean; // Arus tinggi (> 5 Ampere)
  isSafetyCritical: boolean; // Medis / otomotif / keselamatan nyawa
}

export interface PcbManufacturingConstraints {
  targetFabHouse?: string; // mis. 'JLCPCB', 'PCBWay', 'Lokal'
  minTraceWidthMil?: number; // mis. 6 mil
  minTraceSpacingMil?: number; // mis. 6 mil
  minHoleSizeMm?: number; // mis. 0.3 mm
  boardThicknessMm?: number; // mis. 1.6 mm
  surfaceFinish?: 'HASL' | 'ENIG' | 'OSP' | 'LEAD_FREE_HASL';
  copperWeightOz?: 1 | 2;
  solderMaskColor?: 'GREEN' | 'BLUE' | 'RED' | 'BLACK' | 'WHITE' | 'PURPLE';
}

export interface PcbBrief {
  circuitDescription: string;
  dimensions: {
    widthMm: number;
    heightMm: number;
    shape: 'RECTANGULAR' | 'CIRCULAR' | 'CUSTOM';
  };
  layerCount: 1 | 2 | 4 | 6 | 8;
  stackUpNotes?: string;
  componentCountEst?: number;
  criticalFootprints: string[]; // mis. ['QFN-32', 'USB-C', 'SOIC-8']
  operatingVoltage: {
    minVolt: number;
    maxVolt: number;
  };
  operatingCurrent: {
    maxAmpere: number;
  };
  mechanicalConstraints: {
    mountingHoles: boolean;
    mountingHoleDiaMm?: number;
    keepOutZones?: string;
    enclosureFit?: string;
  };
  manufacturing: PcbManufacturingConstraints;
  safetyFlags: PcbSafetyFlags;
  riskLevel: PcbRiskLevel;
  inputFiles: Array<{
    objectId: string;
    fileName: string;
    fileType: 'SCHEMATIC_PDF' | 'NETLIST' | 'CAD_DXF' | 'BOM_CSV';
    sha256: string;
  }>;
  requestedDeliverables: Array<
    'GERBER_RS274X' | 'DRILL_NC' | 'BOM_CSV' | 'PICK_AND_PLACE' | 'STEP_3D' | 'SCHEMATIC_PRINT'
  >;
  deadlineNotes?: string;
  disclaimerAcknowledged: boolean;
}

export const PCB_SAFETY_DISCLAIMER = {
  text: 'Madevi menyediakan layanan perancangan desain layout PCB profesional berdasarkan diagram skematik dan brief masukan pengguna. Layanan ini murni berfokus pada rekayasa layout dan BUKAN jaminan kelaikan fungsi rangkaian elektronik, sertifikasi keselamatan fisik, atau garansi hasil produksi pabrik. Madevi bukan produsen fisik perakit board. Pengguna bertanggung jawab penuh atas validasi skematik, kepatuhan keselamatan listrik produk akhir, serta pengujian prototipe mandiri.',
  version: '1.0.0',
} as const;

export interface ServiceOrder {
  id: string;
  secretToken: string;
  principalId: string | null;
  kind: ServiceKind;
  catalogItemId: string | null;
  briefVersion: number;
  briefData: Record<string, unknown>; // PcbBrief atau Brief Jasa Kustom
  priceSnapshot: ServiceOrderSnapshot;
  status: ServiceOrderStatus;
  revisionCount: number;
  revisionLimit: number;
  deliverables: Array<{
    objectId: string;
    label: string;
    sha256: string;
    uploadedAt: string;
  }>;
  timeline: Array<{
    status: ServiceOrderStatus;
    timestamp: string;
    actor: 'USER' | 'ADMIN';
    note?: string;
  }>;
  tokenExpiresAt: Date | null;
  tokenRevokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

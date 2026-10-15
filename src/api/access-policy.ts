import type { Pool } from 'pg';

import { quotedSchema } from '@/db/schema-name';

/**
 * ============================================================
 * AccessPolicyResolver — P07: SATU policy resolver untuk seluruh API.
 * ============================================================
 *
 * Kontrak P07: "Satu policy resolver untuk role, paket, trial, status akun,
 * ownership, dan kondisi ujian." Sebelum ini, logika akses tersebar di
 * `ArticleReadPolicyImpl`, `ExamEligibilityImpl`, `entitlementView`, dan
 * check ownership ad-hoc per route — sehingga route menyalin logika akses.
 *
 * Resolver ini adalah satu-satunya tempat yang menerjemahkan
 * (principal, resource, action) -> keputusan. Route hanya memanggilnya,
 * tidak pernah menulis ulang logika akses.
 *
 * Sumber kebenaran:
 *  - role/admin: `principals_role_view` (0021, transisi OWNER->ADMIN)
 *  - paket: `principal_entitlement_current` (0021); fallback FREE
 *  - trial Tools: `tools_trial_remaining` (0021)
 *  - status akun: `approval_status` + `lifecycle_status`
 *  - ownership: kolom `owner_principal_id` / `principal_id` resource
 *
 * Semua cek berjalan dalam SATU round-trip gabungan untuk menghindari
 * race antar-cek (P07: race condition dalam matriks threat).
 */

export type PackageKind = 'FREE' | 'PLUS' | 'PRO' | 'LOVE';

export interface PrincipalContext {
  id: string;
  roleLegacy: 'OWNER' | 'MEMBER' | 'SERVICE';
  roleKind: 'ADMIN' | 'USER';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  lifecycleStatus: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  package: PackageKind;
  /** Sisa trial Tools; null = belum pernah dipakai (tampilan = total). */
  toolsTrialRemaining: number | null;
  toolsTrialTotal: number;
}

export interface PolicyDecision {
  allowed: boolean;
  /** Alasan stabil untuk audit + pesan pengguna; tidak membocorkan detail internal. */
  reason: PolicyReason;
  context?: Record<string, unknown>;
}

export type PolicyReason =
  | 'ALLOWED'
  | 'AUTHENTICATION_REQUIRED'
  | 'NOT_APPROVED'
  | 'ACCOUNT_SUSPENDED'
  | 'PACKAGE_INSUFFICIENT'
  | 'TRIAL_EXHAUSTED'
  | 'NOT_OWNER'
  | 'NOT_PUBLISHED'
  | 'NOT_FOUND'
  | 'EXAM_WINDOW_CLOSED'
  | 'EXAM_ATTEMPT_CONFLICT';

/** Acuan paket: Tools penuh untuk PLUS/PRO/LOVE (01-KEPUTUSAN-AKTIF). */
const TOOLS_PACKAGES: ReadonlySet<PackageKind> = new Set(['PLUS', 'PRO', 'LOVE']);
/** Acuan School: PRO/LOVE saja. */
const SCHOOL_PACKAGES: ReadonlySet<PackageKind> = new Set(['PRO', 'LOVE']);

export class AccessPolicyResolver {
  private readonly schema: string;

  constructor(
    private pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /**
   * Muat konteks keputusan untuk principal. Ini SATU tempoh query gabungan
   * sehingga semua cek melihat snapshot konsisten.
   */
  async loadPrincipalContext(principalId: string): Promise<PrincipalContext | null> {
    const result = await this.pool.query<{
      role_kind: 'ADMIN' | 'USER' | null;
      role: 'OWNER' | 'MEMBER' | 'SERVICE';
      approval_status: PrincipalContext['approvalStatus'];
      lifecycle_status: PrincipalContext['lifecycleStatus'];
      entitlement: PackageKind | null;
      tools_trial_total: number | null;
      tools_trial_remaining: number | null;
    }>(
      `SELECT p.role_kind, p.role, p.approval_status, p.lifecycle_status,
              COALESCE(ec.entitlement, 'FREE') AS entitlement,
              COALESCE(p.tools_trial_total, 5) AS tools_trial_total,
              p.tools_trial_remaining
         FROM ${this.schema}.principals p
         LEFT JOIN ${this.schema}.principal_entitlement_current ec
           ON ec.principal_id = p.id
        WHERE p.id = $1 AND p.deleted_at IS NULL`,
      [principalId],
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: principalId,
      roleLegacy: row.role,
      roleKind: row.role_kind ?? (row.role === 'OWNER' ? 'ADMIN' : 'USER'),
      approvalStatus: row.approval_status,
      lifecycleStatus: row.lifecycle_status,
      package: row.entitlement ?? 'FREE',
      toolsTrialTotal: row.tools_trial_total ?? 5,
      toolsTrialRemaining: row.tools_trial_remaining,
    };
  }

  /** Keputusan dasar: apakah principal boleh melakukan action umum? */
  decideBase(ctx: PrincipalContext | null, action: 'read' | 'write'): PolicyDecision {
    if (!ctx) return deny('AUTHENTICATION_REQUIRED');
    if (ctx.lifecycleStatus === 'DELETED') return deny('NOT_FOUND');
    if (ctx.lifecycleStatus === 'SUSPENDED') return deny('ACCOUNT_SUSPENDED');
    if (action === 'write' && ctx.approvalStatus !== 'APPROVED') return deny('NOT_APPROVED');
    return allow();
  }

  /** Akses ke Tools by Madevi: paket atau trial (5x). */
  decideToolsAccess(ctx: PrincipalContext | null): PolicyDecision {
    if (!ctx) return deny('AUTHENTICATION_REQUIRED');
    const base = this.decideBase(ctx, 'write');
    if (!base.allowed) return base;
    if (TOOLS_PACKAGES.has(ctx.package)) {
      return { allowed: true, reason: 'ALLOWED', context: { via: 'package' } };
    }
    const remaining = ctx.toolsTrialRemaining ?? ctx.toolsTrialTotal;
    if (remaining > 0) {
      return {
        allowed: true,
        reason: 'ALLOWED',
        context: { via: 'trial', remaining },
      };
    }
    return deny('TRIAL_EXHAUSTED', {
      remaining: 0,
      total: ctx.toolsTrialTotal,
      upgradeHint: 'PLUS',
    });
  }

  /** Akses ke fitur School (ujian, learning path berbayar). */
  decideSchoolAccess(ctx: PrincipalContext | null): PolicyDecision {
    if (!ctx) return deny('AUTHENTICATION_REQUIRED');
    const base = this.decideBase(ctx, 'write');
    if (!base.allowed) return base;
    if (SCHOOL_PACKAGES.has(ctx.package) || ctx.roleKind === 'ADMIN') {
      return allow();
    }
    return deny('PACKAGE_INSUFFICIENT', { required: 'PRO', current: ctx.package });
  }

  /** Ownership: principal boleh kelola resource miliknya; Admin bypass. */
  decideOwnership(ctx: PrincipalContext | null, ownerId: string | null): PolicyDecision {
    if (!ctx) return deny('AUTHENTICATION_REQUIRED');
    const base = this.decideBase(ctx, 'write');
    if (!base.allowed) return base;
    if (ctx.roleKind === 'ADMIN') return allow({ via: 'admin' });
    if (ownerId && ctx.id === ownerId) return allow({ via: 'owner' });
    return deny('NOT_OWNER');
  }

  /** Konten: hanya terbit untuk user, Admin boleh non-terbit (cermin lama). */
  decideContentVisibility(
    ctx: PrincipalContext | null,
    published: boolean,
    accessLevel: 'PUBLIC' | 'MEMBER',
  ): PolicyDecision {
    if (!published && ctx?.roleKind !== 'ADMIN') return deny('NOT_PUBLISHED');
    if (accessLevel === 'PUBLIC') return allow();
    if (!ctx) return deny('AUTHENTICATION_REQUIRED');
    if (ctx.approvalStatus !== 'APPROVED') return deny('NOT_APPROVED');
    return allow();
  }
}

function allow(context?: Record<string, unknown>): PolicyDecision {
  return { allowed: true, reason: 'ALLOWED', context };
}

function deny(reason: PolicyReason, context?: Record<string, unknown>): PolicyDecision {
  return { allowed: false, reason, context };
}

/**
 * Terjemahkan reason ke pesan pengguna aman (P07: error code stabil + pesan
 * yang tidak membocorkan keamanan). Tidak menyebutkan nama tabel/internal.
 */
export function policyReasonMessage(reason: PolicyReason): string {
  const messages: Record<PolicyReason, string> = {
    ALLOWED: 'Diizinkan',
    AUTHENTICATION_REQUIRED: 'Anda perlu login terlebih dahulu',
    NOT_APPROVED: 'Akun Anda belum disetujui Admin',
    ACCOUNT_SUSPENDED: 'Akun Anda sedang dibatasi',
    PACKAGE_INSUFFICIENT: 'Fitur ini memerlukan paket yang lebih tinggi',
    TRIAL_EXHAUSTED: 'Masa trial Tools Anda sudah habis',
    NOT_OWNER: 'Anda tidak memiliki akses ke resource ini',
    NOT_PUBLISHED: 'Konten ini belum tersedia',
    NOT_FOUND: 'Resource tidak ditemukan',
    EXAM_WINDOW_CLOSED: 'Jadwal ujian belum dibuka atau sudah ditutup',
    EXAM_ATTEMPT_CONFLICT: 'Anda sudah memiliki sesi ujian aktif',
  };
  return messages[reason];
}

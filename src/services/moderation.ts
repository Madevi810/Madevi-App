import { createHash, randomUUID } from 'node:crypto';

import type { Pool, PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import { requireApproved } from '@/api/policy';
import type { ModerationDecision, Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import {
  BLOCKED_WORDS,
  CRISIS_INDICATORS,
  findBlockedWord,
  findCrisisIndicator,
  type BlockedWordCategory,
} from '@/server/moderation/blocked-words';
import { appendAuditEvent } from '@/services/audit';

export type ModerationRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
export type ModerationCategory =
  | 'NONE'
  | 'MALWARE'
  | 'EXECUTABLE'
  | 'MIME_MISMATCH'
  | 'ARCHIVE_UNSUPPORTED'
  | 'ADULT_SEXUAL'
  | 'VIOLENCE'
  | 'CHILD_EXPLOITATION'
  | 'THREAT'
  | 'CRIME'
  | 'GROOMING'
  | 'SPAM'
  | 'PHISHING'
  | 'SCAM'
  | 'PERSONAL_DATA'
  | 'DANGEROUS_URL'
  | 'UNSUPPORTED'
  | 'ENGINE_ERROR';
export type ModerationTarget =
  | 'SOCIAL_POST'
  | 'SOCIAL_COMMENT'
  | 'DIRECT_MESSAGE'
  | 'ARTICLE_SUGGESTION'
  | 'ARTICLE_CORRECTION'
  | 'PUBLIC_FEEDBACK'
  | 'STORAGE_OBJECT';

export interface LocalModerationResult {
  status: 'UNASSESSED' | 'SAFE' | 'UNSAFE';
  reason: string;
  riskLevel: ModerationRisk;
  category: ModerationCategory;
  confidence: number;
  inputKind: 'TEXT' | 'URL' | 'FILE_HEADER' | 'COMPOSITE';
  engine: { name: string; version: string; signatureVersion: string; durationMs: number };
}

const ENGINE = {
  name: 'MADEVI_LOCAL_RULE_ENGINE',
  version: '1.0.0',
  signatureVersion: '2026-09-09',
} as const;
const TEXT_LIMIT = 65_536;
const HEADER_LIMIT = 8_192;
const TIMEOUT_MS = 250;

export class UnavailableModerationDecision implements ModerationDecision {
  async assess() {
    return {
      status: 'UNASSESSED' as const,
      reason: 'Engine moderasi tidak tersedia; konten wajib tetap dikarantina',
      riskLevel: 'UNKNOWN' as const,
      category: 'ENGINE_ERROR',
      confidence: 0,
    };
  }
}

export class LocalModerationEngine implements ModerationDecision {
  async assess(input: Parameters<ModerationDecision['assess']>[0]): Promise<LocalModerationResult> {
    const started = Date.now();
    try {
      if (input.bytes) return this.scanFileHeader(input, started);
      if (input.contentText !== undefined || input.url !== undefined) {
        return this.scanTextAndLinks(input.contentText ?? '', input.url, started);
      }
      return result(
        'UNASSESSED',
        'UNKNOWN',
        'UNSUPPORTED',
        0,
        'COMPOSITE',
        'Input tidak didukung engine lokal',
        started,
      );
    } catch (error) {
      return result(
        'UNASSESSED',
        'UNKNOWN',
        'ENGINE_ERROR',
        0,
        'COMPOSITE',
        error instanceof Error ? `Engine gagal tertutup: ${error.name}` : 'Engine gagal tertutup',
        started,
      );
    }
  }

  private scanTextAndLinks(text: string, explicitUrl: string | undefined, started: number) {
    const bytes = new TextEncoder().encode(text).byteLength;
    if (bytes > TEXT_LIMIT) {
      return result(
        'UNASSESSED',
        'UNKNOWN',
        'UNSUPPORTED',
        0,
        'TEXT',
        'Teks melampaui batas 65536 byte',
        started,
      );
    }
    if (Date.now() - started > TIMEOUT_MS) {
      return result(
        'UNASSESSED',
        'UNKNOWN',
        'ENGINE_ERROR',
        0,
        'TEXT',
        'Batas waktu engine terlampaui',
        started,
      );
    }
    const normalized = text.normalize('NFKC').toLocaleLowerCase('id-ID');

    // Filter kata terlarang dari file konfigurasi (INSTRUKSI-03 item #1).
    // Berjalan SEBELUM ruleset lain: penahanan otomatis masuk antrean moderasi.
    const blocked = findBlockedWord(text);
    if (blocked) {
      return result(
        'UNSAFE',
        'HIGH',
        blockedWordCategory(blocked.category),
        0.97,
        'TEXT',
        `Kata terlarang terdeteksi (${blocked.category}): "${blocked.pattern}"`,
        started,
      );
    }

    // Deteksi krisis Sosial Curhat (INSTRUKSI-03 item #4) — karantina + kartu
    // bantuan otomatis; penanganan kartu ada di komponen feed.
    if (findCrisisIndicator(text)) {
      return result(
        'UNASSESSED',
        'HIGH',
        'THREAT',
        0.9,
        'TEXT',
        'Indikasi krisis pada postingan curhat — karantina + kartu bantuan',
        started,
      );
    }

    const educational =
      /(untuk|for) (pendidikan|education)|konteks (sejarah|historical)|anatomi|pembahasan akademik|museum|news report/.test(
        normalized,
      );
    const rules: Array<{
      category: ModerationCategory;
      pattern: RegExp;
      risk: ModerationRisk;
      confidence: number;
      reason: string;
    }> = [
      {
        category: 'CHILD_EXPLOITATION',
        pattern: /\b(child sexual|eksploitasi seksual anak|csam|groom(?:ing)?)\b/,
        risk: 'HIGH',
        confidence: 0.99,
        reason: 'Indikasi eksploitasi/grooming anak',
      },
      {
        category: 'THREAT',
        pattern:
          /\b(?:i will|akan|ingin) (?:kill|membunuh|mengebom|serang)\b|\b(?:kill|bunuh|bom) (?:you|kamu|dia)\b/,
        risk: 'HIGH',
        confidence: 0.96,
        reason: 'Ancaman tindakan langsung',
      },
      {
        category: 'PHISHING',
        pattern:
          /\b(?:verify|verifikasi) (?:password|kata sandi|akun)|\b(?:kirim|send) (?:otp|password|pin)\b/,
        risk: 'HIGH',
        confidence: 0.94,
        reason: 'Permintaan kredensial/OTP',
      },
      {
        category: 'CRIME',
        pattern: /\b(?:cara|how to) (?:merakit bom|membobol akun|steal credentials|make a bomb)\b/,
        risk: 'HIGH',
        confidence: 0.94,
        reason: 'Instruksi tindakan berbahaya',
      },
      {
        category: 'ADULT_SEXUAL',
        pattern: /\b(?:pornografi|pornography|konten seksual eksplisit)\b/,
        risk: educational ? 'MEDIUM' : 'HIGH',
        confidence: educational ? 0.62 : 0.92,
        reason: educational
          ? 'Istilah sensitif dalam konteks pendidikan perlu review'
          : 'Konten seksual eksplisit',
      },
      {
        category: 'VIOLENCE',
        pattern: /\b(?:pembunuhan|perang|kekerasan|murder|war|violence)\b/,
        risk: educational ? 'LOW' : 'MEDIUM',
        confidence: educational ? 0.72 : 0.7,
        reason: educational
          ? 'Konteks pendidikan/sejarah yang tidak instruksional'
          : 'Kekerasan perlu review konteks',
      },
      {
        category: 'SCAM',
        pattern: /\b(?:jaminan untung|guaranteed profit|hadiah instan|transfer sekarang)\b/,
        risk: 'MEDIUM',
        confidence: 0.84,
        reason: 'Pola scam/penipuan',
      },
      {
        category: 'SPAM',
        pattern: /(.)\1{14,}|\b(?:promo|diskon)\b(?:.*\b(?:promo|diskon)\b){3,}/,
        risk: 'MEDIUM',
        confidence: 0.8,
        reason: 'Pola spam berulang',
      },
      {
        category: 'PERSONAL_DATA',
        pattern: /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:\+?62|0)8\d{8,11}\b/,
        risk: 'MEDIUM',
        confidence: 0.88,
        reason: 'Kemungkinan email/nomor telepon pribadi',
      },
    ];
    for (const rule of rules) {
      if (!rule.pattern.test(normalized)) continue;
      if (rule.risk === 'LOW') {
        return result('SAFE', 'LOW', rule.category, rule.confidence, 'TEXT', rule.reason, started);
      }
      return result(
        rule.risk === 'HIGH' ? 'UNSAFE' : 'UNASSESSED',
        rule.risk,
        rule.category,
        rule.confidence,
        'TEXT',
        rule.reason,
        started,
      );
    }
    const urls = [
      ...(text.match(/https?:\/\/[^\s<>{}"']+/gi) ?? []),
      ...(explicitUrl ? [explicitUrl] : []),
    ];
    for (const value of urls) {
      const link = this.scanUrl(value, started);
      if (link.status !== 'SAFE') return link;
    }
    return result(
      'SAFE',
      'LOW',
      'NONE',
      0.82,
      urls.length ? 'COMPOSITE' : 'TEXT',
      'Tidak ada pola risiko dalam cakupan ruleset lokal',
      started,
    );
  }

  private scanUrl(value: string, started: number) {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
        return result(
          'UNSAFE',
          'HIGH',
          'DANGEROUS_URL',
          0.99,
          'URL',
          'Skema atau kredensial URL dilarang',
          started,
        );
      }
      if (
        host === 'localhost' ||
        host.endsWith('.local') ||
        /^127\.|^10\.|^192\.168\.|^169\.254\.|^0\.|^\[?::1\]?$/.test(host)
      ) {
        return result(
          'UNSAFE',
          'HIGH',
          'DANGEROUS_URL',
          0.98,
          'URL',
          'Target jaringan lokal/private dilarang',
          started,
        );
      }
      if (
        host.startsWith('xn--') ||
        /(?:login|verify|hadiah|bonus|wallet|credential)/.test(`${host}${url.pathname}`)
      ) {
        return result(
          'UNASSESSED',
          'MEDIUM',
          'PHISHING',
          0.76,
          'URL',
          'URL menyerupai phishing dan perlu review',
          started,
        );
      }
      return result(
        'SAFE',
        'LOW',
        'NONE',
        0.75,
        'URL',
        'Struktur URL lolos pemeriksaan offline; reputasi jaringan tidak diperiksa',
        started,
      );
    } catch {
      return result(
        'UNASSESSED',
        'UNKNOWN',
        'DANGEROUS_URL',
        0,
        'URL',
        'URL tidak dapat diparse',
        started,
      );
    }
  }

  private scanFileHeader(input: Parameters<ModerationDecision['assess']>[0], started: number) {
    const bytes = input.bytes!;
    if (bytes.byteLength > HEADER_LIMIT) {
      return result(
        'UNASSESSED',
        'UNKNOWN',
        'UNSUPPORTED',
        0,
        'FILE_HEADER',
        'Hanya header maksimum 8192 byte yang diterima engine tahap 09',
        started,
      );
    }
    const magic = detectMagic(bytes);
    const declared = (input.mediaType ?? '').toLowerCase();
    if (magic === 'EXECUTABLE') {
      return result(
        'UNSAFE',
        'HIGH',
        'EXECUTABLE',
        0.99,
        'FILE_HEADER',
        'Header executable/script ditolak',
        started,
      );
    }
    if (magic === 'ARCHIVE') {
      return result(
        'UNASSESSED',
        'UNKNOWN',
        'ARCHIVE_UNSUPPORTED',
        0,
        'FILE_HEADER',
        'Arsip tidak diekstrak pada tahap 09; tetap karantina sampai scanner Prompt 11',
        started,
      );
    }
    if (magic === 'UNKNOWN') {
      return result(
        'UNASSESSED',
        'UNKNOWN',
        'UNSUPPORTED',
        0,
        'FILE_HEADER',
        'Magic file tidak didukung',
        started,
      );
    }
    if (declared && declared !== magic) {
      return result(
        'UNSAFE',
        'HIGH',
        'MIME_MISMATCH',
        0.98,
        'FILE_HEADER',
        `MIME deklarasi tidak cocok dengan magic ${magic}`,
        started,
      );
    }
    return result(
      'UNASSESSED',
      'UNKNOWN',
      'UNSUPPORTED',
      0.5,
      'FILE_HEADER',
      'Header cocok, tetapi decode/re-encode dan scanner byte penuh baru Prompt 11',
      started,
    );
  }
}

export class ModerationService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly engine: ModerationDecision = new LocalModerationEngine(),
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async assessAndRecord(
    input: {
      principal: Principal;
      targetType: ModerationTarget;
      targetId: string;
      contentText?: string;
      url?: string;
      mediaType?: string;
      bytes?: Uint8Array;
      declaredSizeBytes?: number;
    },
    existingClient?: PoolClient,
  ) {
    requireApproved(input.principal);
    const decision = await normalizedDecision(this.engine, {
      objectId: input.targetId,
      relativePath: `virtual/moderation/${input.targetType.toLowerCase()}/${input.targetId}`,
      contentText: input.contentText,
      url: input.url,
      mediaType: input.mediaType,
      bytes: input.bytes,
      declaredSizeBytes: input.declaredSizeBytes,
    });
    const record = async (client: PoolClient) => {
      const assessmentId = randomUUID();
      await client.query(
        `INSERT INTO ${this.schema}.moderation_assessments
          (id,target_type,target_id,subject_principal_id,input_kind,decision,risk_level,
           category,confidence,reason,context_sha256,engine_name,engine_version,
           signature_version,duration_ms,is_test)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [
          assessmentId,
          input.targetType,
          input.targetId,
          input.principal.id,
          decision.inputKind,
          decision.status,
          decision.riskLevel,
          decision.category,
          decision.confidence,
          decision.reason,
          hashContext(input),
          decision.engine.name,
          decision.engine.version,
          decision.engine.signatureVersion,
          decision.engine.durationMs,
          input.principal.fixture,
        ],
      );
      let caseId: string | null = null;
      if (decision.riskLevel !== 'LOW') {
        caseId = await this.upsertCase(client, input, decision, assessmentId);
        if (decision.riskLevel === 'HIGH') {
          await this.applySafetyHold(client, input.principal, caseId, decision.reason);
        }
      }
      await appendAuditEvent(client, {
        actorPrincipalId: input.principal.id,
        eventType: 'MODERATION_ASSESSED',
        objectType: input.targetType.toLowerCase(),
        objectId: input.targetId,
        details: {
          assessmentId,
          caseId,
          decision: decision.status,
          riskLevel: decision.riskLevel,
          category: decision.category,
          engine: decision.engine.name,
          engineVersion: decision.engine.version,
          confidence: decision.confidence,
        },
        fixture: input.principal.fixture,
        schema: this.schema.slice(1, -1),
      });
      return { ...decision, assessmentId, caseId };
    };
    return existingClient ? record(existingClient) : inTransaction(this.pool, record);
  }

  async listCases(
    owner: Principal,
    input: { risk?: string; status?: string; category?: string; limit?: number } = {},
  ) {
    ownerOnly(owner);
    const limit = Math.min(Math.max(input.limit ?? 50, 1), 100);
    const result = await this.pool.query(
      `SELECT c.id,c.target_type,c.target_id,c.subject_principal_id,c.risk_level,
              c.category,c.status,c.safe_preview,c.critical_policy_pending,c.created_at,
              c.updated_at,
              (SELECT count(*)::int FROM ${this.schema}.social_reports r
                WHERE r.object_id=c.target_id) report_count,
              (SELECT COALESCE(array_agg(DISTINCT r.reason_category) FILTER
                 (WHERE r.reason_category IS NOT NULL), '{}')
                 FROM ${this.schema}.social_reports r
                WHERE r.object_id=c.target_id) report_categories,
              (SELECT string_agg(DISTINCT
                  CASE r.reason_category
                    WHEN 'PORNOGRAFI' THEN 'Pornografi'
                    WHEN 'ANCAMAN' THEN 'Ancaman'
                    WHEN 'KEKERASAN' THEN 'Kekerasan'
                    WHEN 'PELECEHAN' THEN 'Pelecehan'
                    WHEN 'SARA' THEN 'SARA'
                    WHEN 'SPAM' THEN 'Spam'
                    WHEN 'LAINNYA' THEN 'Lainnya'
                    ELSE NULL
                  END, ', ')
                 FROM ${this.schema}.social_reports r
                WHERE r.object_id=c.target_id AND r.reason_category IS NOT NULL) report_category_labels,
              EXTRACT(EPOCH FROM ($5::timestamptz-c.created_at))::bigint age_seconds
         FROM ${this.schema}.moderation_cases c
        WHERE ($1::text IS NULL OR c.risk_level=$1)
          AND ($2::text IS NULL OR c.status=$2)
          AND ($3::text IS NULL OR c.category=$3)
        ORDER BY CASE WHEN c.category IN ('CHILD_EXPLOITATION','GROOMING') THEN 0 ELSE 1 END,
                 CASE c.risk_level WHEN 'HIGH' THEN 0 WHEN 'UNKNOWN' THEN 1 ELSE 2 END,
                 (SELECT count(*) FROM ${this.schema}.social_reports r
                   WHERE r.object_id=c.target_id) DESC,c.created_at,c.id
        LIMIT $4`,
      [input.risk ?? null, input.status ?? null, input.category ?? null, limit, this.now()],
    );
    return result.rows;
  }

  async engineInventory(owner: Principal) {
    ownerOnly(owner);
    return this.pool
      .query(
        `SELECT engine_name,engine_version,signature_version,language_support,
              supported_inputs,resource_limits,limitations,active
         FROM ${this.schema}.moderation_rulesets ORDER BY active DESC,created_at DESC`,
      )
      .then((query) => query.rows);
  }

  async listOwnAppeals(principal: Principal) {
    requireApproved(principal);
    return this.pool
      .query(
        `SELECT id,case_id,reason,status,owner_reason,created_at,updated_at
         FROM ${this.schema}.moderation_appeals
        WHERE principal_id=$1 ORDER BY created_at DESC,id DESC LIMIT 100`,
        [principal.id],
      )
      .then((query) => query.rows);
  }

  async openReportedCase(
    input: {
      subject: Principal;
      targetType: ModerationTarget;
      targetId: string;
      contentText?: string;
      url?: string;
    },
    existingClient?: PoolClient,
  ) {
    const decision: LocalModerationResult = {
      status: 'UNASSESSED',
      reason: 'Laporan pengguna memerlukan review Admin',
      riskLevel: 'MEDIUM',
      category: 'UNSUPPORTED',
      confidence: 0,
      inputKind: input.url ? 'COMPOSITE' : 'TEXT',
      engine: { ...ENGINE, durationMs: 0 },
    };
    const record = async (client: PoolClient) => {
      const assessmentId = randomUUID();
      await client.query(
        `INSERT INTO ${this.schema}.moderation_assessments
          (id,target_type,target_id,subject_principal_id,input_kind,decision,risk_level,
           category,confidence,reason,context_sha256,engine_name,engine_version,
           signature_version,duration_ms,is_test)
         VALUES ($1,$2,$3,$4,$5,'UNASSESSED','MEDIUM','UNSUPPORTED',0,$6,$7,$8,$9,$10,0,$11)`,
        [
          assessmentId,
          input.targetType,
          input.targetId,
          input.subject.id,
          decision.inputKind,
          decision.reason,
          hashContext(input),
          ENGINE.name,
          ENGINE.version,
          ENGINE.signatureVersion,
          input.subject.fixture,
        ],
      );
      const caseId = await this.upsertCase(
        client,
        {
          principal: input.subject,
          targetType: input.targetType,
          targetId: input.targetId,
          contentText: input.contentText,
          url: input.url,
        },
        decision,
        assessmentId,
      );
      return { caseId, assessmentId };
    };
    return existingClient ? record(existingClient) : inTransaction(this.pool, record);
  }

  async accessEvidence(owner: Principal, caseId: string, accessReason: string) {
    ownerOnly(owner);
    const reason = cleanReason(accessReason, 500);
    return inTransaction(this.pool, async (client) => {
      const item = await client
        .query<{
          target_type: ModerationTarget;
          target_id: string;
          safe_preview: unknown;
        }>(
          `UPDATE ${this.schema}.moderation_cases
            SET status=CASE WHEN status='OPEN' THEN 'IN_REVIEW' ELSE status END,
                owner_principal_id=$2,updated_at=$3
          WHERE id=$1 AND status IN ('OPEN','IN_REVIEW','ACTIONED','CLEARED','RESTORED')
          RETURNING target_type,target_id,safe_preview`,
          [caseId, owner.id, this.now()],
        )
        .then((query) => query.rows[0]);
      if (!item) throw new ApiError('NOT_FOUND', 'Kasus moderasi tidak ditemukan');
      const evidence = await this.readTargetEvidence(client, item.target_type, item.target_id);
      await client.query(
        `UPDATE ${this.schema}.moderation_case_evidence
            SET last_access_reason=$2,last_accessed_by=$3,last_accessed_at=$4
          WHERE case_id=$1 AND purged_at IS NULL AND expires_at>$4`,
        [caseId, reason, owner.id, this.now()],
      );
      await appendAuditEvent(client, {
        actorPrincipalId: owner.id,
        eventType: 'MODERATION_EVIDENCE_ACCESSED',
        objectType: 'moderation_case',
        objectId: caseId,
        details: { accessReason: reason, targetType: item.target_type },
        fixture: owner.fixture,
        schema: this.schema.slice(1, -1),
      });
      return { caseId, targetType: item.target_type, safePreview: item.safe_preview, evidence };
    });
  }

  async decideCase(
    owner: Principal,
    caseId: string,
    input: {
      decision: 'CLEAR' | 'CONFIRM_GENERAL' | 'CONFIRM_CRITICAL' | 'KEEP_QUARANTINED';
      reason: string;
      criticalSanction?: 'NONE' | 'MUTE_7D' | 'MUTE_30D' | 'PERMANENT_BLOCK';
    },
  ) {
    ownerOnly(owner);
    const reason = cleanReason(input.reason, 1000);
    return inTransaction(this.pool, async (client) => {
      const item = await client
        .query<{
          target_type: ModerationTarget;
          target_id: string;
          subject_principal_id: string | null;
          status: string;
          critical_policy_pending: boolean;
        }>(
          `SELECT target_type,target_id,subject_principal_id,status,critical_policy_pending
           FROM ${this.schema}.moderation_cases WHERE id=$1 FOR UPDATE`,
          [caseId],
        )
        .then((query) => query.rows[0]);
      if (!item || !['OPEN', 'IN_REVIEW'].includes(item.status)) {
        throw new ApiError('NOT_FOUND', 'Kasus aktif tidak ditemukan');
      }
      if (input.decision === 'CLEAR') {
        await this.restoreTarget(client, item.target_type, item.target_id);
        await this.releaseCaseHold(client, caseId, item.subject_principal_id);
        await this.finishCase(client, caseId, owner, 'RESTORED', reason);
        return { caseId, status: 'RESTORED', sanction: null };
      }
      if (input.decision === 'KEEP_QUARANTINED') {
        await this.finishCase(client, caseId, owner, 'ACTIONED', reason);
        return { caseId, status: 'ACTIONED', sanction: null };
      }
      if (!item.subject_principal_id) {
        throw new ApiError('VALIDATION_FAILED', 'Kasus tidak mempunyai principal untuk sanksi');
      }
      if (
        input.decision === 'CONFIRM_CRITICAL' &&
        (!item.critical_policy_pending || !input.criticalSanction)
      ) {
        throw new ApiError(
          'VALIDATION_FAILED',
          'Kasus kritis memerlukan pilihan sanksi Admin eksplisit karena O-02',
        );
      }
      const sanction =
        input.decision === 'CONFIRM_CRITICAL'
          ? input.criticalSanction!
          : await this.nextGeneralSanction(client, item.subject_principal_id);
      await this.releaseCaseHold(client, caseId, item.subject_principal_id);
      if (sanction !== 'NONE') {
        await this.imposeSanction(
          client,
          owner,
          caseId,
          item.subject_principal_id,
          sanction,
          reason,
        );
      }
      await this.finishCase(client, caseId, owner, 'ACTIONED', reason);
      return { caseId, status: 'ACTIONED', sanction };
    });
  }

  async submitAppeal(
    principal: Principal,
    caseId: string,
    reasonInput: string,
    idempotencyKey: string,
  ) {
    requireApproved(principal);
    const reason = cleanReason(reasonInput, 2000);
    validateKey(idempotencyKey);
    const owns = await this.pool.query(
      `SELECT 1 FROM ${this.schema}.moderation_cases
        WHERE id=$1 AND subject_principal_id=$2 AND status='ACTIONED'`,
      [caseId, principal.id],
    );
    if (!owns.rows[0])
      throw new ApiError('NOT_FOUND', 'Kasus yang dapat dibanding tidak ditemukan');
    const id = randomUUID();
    return this.pool
      .query(
        `INSERT INTO ${this.schema}.moderation_appeals
        (id,case_id,principal_id,reason,idempotency_key,is_test)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (principal_id,idempotency_key)
       DO UPDATE SET id=moderation_appeals.id RETURNING *`,
        [id, caseId, principal.id, reason, idempotencyKey, principal.fixture],
      )
      .then((query) => query.rows[0]);
  }

  async listAppeals(owner: Principal) {
    ownerOnly(owner);
    return this.pool
      .query(
        `SELECT a.id,a.case_id,a.principal_id,a.reason,a.status,a.created_at,
              c.risk_level,c.category
         FROM ${this.schema}.moderation_appeals a
         JOIN ${this.schema}.moderation_cases c ON c.id=a.case_id
        WHERE a.status IN ('PENDING','IN_REVIEW')
        ORDER BY CASE c.risk_level WHEN 'HIGH' THEN 0 ELSE 1 END,a.created_at,a.id`,
      )
      .then((query) => query.rows);
  }

  async decideAppeal(
    owner: Principal,
    appealId: string,
    input: {
      decision: 'ACCEPT' | 'MODIFY' | 'REJECT';
      reason: string;
      sanction?: 'MUTE_7D' | 'MUTE_30D' | 'PERMANENT_BLOCK';
    },
  ) {
    ownerOnly(owner);
    const reason = cleanReason(input.reason, 1000);
    return inTransaction(this.pool, async (client) => {
      const appeal = await client
        .query<{
          case_id: string;
          principal_id: string;
          status: string;
        }>(
          `SELECT case_id,principal_id,status FROM ${this.schema}.moderation_appeals
          WHERE id=$1 FOR UPDATE`,
          [appealId],
        )
        .then((query) => query.rows[0]);
      if (!appeal || !['PENDING', 'IN_REVIEW'].includes(appeal.status)) {
        throw new ApiError('NOT_FOUND', 'Banding aktif tidak ditemukan');
      }
      if (input.decision === 'ACCEPT') {
        await client.query(
          `UPDATE ${this.schema}.moderation_strikes SET status='OVERTURNED'
            WHERE case_id=$1`,
          [appeal.case_id],
        );
        const item = await client
          .query<{
            target_type: ModerationTarget;
            target_id: string;
          }>(`SELECT target_type,target_id FROM ${this.schema}.moderation_cases WHERE id=$1`, [
            appeal.case_id,
          ])
          .then((query) => query.rows[0]);
        if (item) await this.restoreTarget(client, item.target_type, item.target_id);
        await this.recomputeRestriction(client, appeal.principal_id);
        await client.query(
          `UPDATE ${this.schema}.moderation_cases SET status='RESTORED',updated_at=$2
            WHERE id=$1`,
          [appeal.case_id, this.now()],
        );
      } else if (input.decision === 'MODIFY') {
        if (!input.sanction) {
          throw new ApiError('VALIDATION_FAILED', 'Sanksi pengganti wajib dipilih');
        }
        await client.query(
          `UPDATE ${this.schema}.moderation_strikes SET status='OVERTURNED'
            WHERE case_id=$1`,
          [appeal.case_id],
        );
        await this.imposeSanction(
          client,
          owner,
          appeal.case_id,
          appeal.principal_id,
          input.sanction,
          reason,
        );
      }
      const status =
        input.decision === 'ACCEPT'
          ? 'ACCEPTED'
          : input.decision === 'MODIFY'
            ? 'MODIFIED'
            : 'REJECTED';
      const updated = await client.query(
        `UPDATE ${this.schema}.moderation_appeals
            SET status=$2,owner_principal_id=$3,owner_reason=$4,decided_at=$5,updated_at=$5
          WHERE id=$1 RETURNING *`,
        [appealId, status, owner.id, reason, this.now()],
      );
      await appendAuditEvent(client, {
        actorPrincipalId: owner.id,
        eventType: 'MODERATION_APPEAL_DECIDED',
        objectType: 'moderation_appeal',
        objectId: appealId,
        details: { decision: input.decision, reason, sanction: input.sanction ?? null },
        fixture: owner.fixture,
        schema: this.schema.slice(1, -1),
      });
      return updated.rows[0];
    });
  }

  async expireCleanWindows(owner: Principal) {
    ownerOnly(owner);
    const cutoff = new Date(this.now());
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1);
    return inTransaction(this.pool, async (client) => {
      const expired = await client.query<{ principal_id: string }>(
        `UPDATE ${this.schema}.moderation_strikes SET status='EXPIRED'
          WHERE status='ACTIVE' AND sanction<>'PERMANENT_BLOCK' AND imposed_at<$1
          RETURNING principal_id`,
        [cutoff],
      );
      for (const id of new Set(expired.rows.map((row) => row.principal_id))) {
        await this.recomputeRestriction(client, id);
      }
      return { cutoff: cutoff.toISOString(), strikesExpired: expired.rowCount ?? 0 };
    });
  }

  private async upsertCase(
    client: PoolClient,
    input: {
      principal: Principal;
      targetType: ModerationTarget;
      targetId: string;
      contentText?: string;
      url?: string;
      mediaType?: string;
      bytes?: Uint8Array;
      declaredSizeBytes?: number;
    },
    decision: LocalModerationResult,
    assessmentId: string,
  ) {
    const critical = isCritical(decision.category);
    const id = randomUUID();
    const preview = safePreview(input, decision);
    const row = await client.query<{ id: string }>(
      `INSERT INTO ${this.schema}.moderation_cases
        (id,target_type,target_id,subject_principal_id,assessment_id,risk_level,category,
         safe_preview,critical_policy_pending,is_test)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10)
       ON CONFLICT (target_type,target_id) WHERE status IN ('OPEN','IN_REVIEW')
       DO UPDATE SET
         assessment_id=CASE WHEN moderation_cases.risk_level='HIGH'
           THEN moderation_cases.assessment_id ELSE EXCLUDED.assessment_id END,
         risk_level=CASE WHEN moderation_cases.risk_level='HIGH'
           THEN moderation_cases.risk_level ELSE EXCLUDED.risk_level END,
         category=CASE WHEN moderation_cases.risk_level='HIGH'
           THEN moderation_cases.category ELSE EXCLUDED.category END,
         safe_preview=CASE WHEN moderation_cases.risk_level='HIGH'
           THEN moderation_cases.safe_preview ELSE EXCLUDED.safe_preview END,
         critical_policy_pending=(moderation_cases.critical_policy_pending
           OR EXCLUDED.critical_policy_pending),updated_at=CURRENT_TIMESTAMP
       RETURNING id`,
      [
        id,
        input.targetType,
        input.targetId,
        input.principal.id,
        assessmentId,
        decision.riskLevel,
        decision.category,
        JSON.stringify(preview),
        critical,
        input.principal.fixture,
      ],
    );
    const caseId = row.rows[0].id;
    const expires = new Date(this.now());
    expires.setUTCFullYear(expires.getUTCFullYear() + 1);
    await client.query(
      `INSERT INTO ${this.schema}.moderation_case_evidence
        (id,case_id,evidence_type,encrypted_or_redacted_payload,content_sha256,expires_at,is_test)
       VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7)`,
      [
        randomUUID(),
        caseId,
        input.bytes ? 'FILE_METADATA' : input.url ? 'URL_METADATA' : 'TEXT',
        JSON.stringify(preview),
        hashContext(input),
        expires,
        input.principal.fixture,
      ],
    );
    return caseId;
  }

  private async applySafetyHold(
    client: PoolClient,
    principal: Principal,
    caseId: string,
    reason: string,
  ) {
    await client.query(
      `INSERT INTO ${this.schema}.social_restrictions
        (principal_id,restriction_type,source_case_id,starts_at,reason)
       VALUES ($1,'SAFETY_HOLD',$2,$3,$4)
       ON CONFLICT (principal_id) DO UPDATE SET restriction_type='SAFETY_HOLD',
         source_case_id=$2,starts_at=$3,expires_at=NULL,status='ACTIVE',reason=$4,updated_at=$3`,
      [principal.id, caseId, this.now(), reason],
    );
    await client.query(
      `UPDATE ${this.schema}.principals
          SET social_status='RESTRICTED',updated_at=$2,version=version+1
        WHERE id=$1 AND social_status<>'DISABLED'`,
      [principal.id, this.now()],
    );
  }

  private async releaseCaseHold(client: PoolClient, caseId: string, principalId: string | null) {
    if (!principalId) return;
    await client.query(`DELETE FROM ${this.schema}.social_blocks WHERE source_case_id=$1`, [
      caseId,
    ]);
    await client.query(
      `UPDATE ${this.schema}.social_restrictions SET status='OVERTURNED',updated_at=$2
        WHERE principal_id=$1 AND source_case_id=$3 AND restriction_type='SAFETY_HOLD'`,
      [principalId, this.now(), caseId],
    );
    await this.recomputeRestriction(client, principalId);
  }

  private async nextGeneralSanction(
    client: PoolClient,
    principalId: string,
  ): Promise<'MUTE_7D' | 'MUTE_30D' | 'PERMANENT_BLOCK'> {
    const cutoff = new Date(this.now());
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1);
    const count = await client
      .query<{ count: string }>(
        `SELECT count(*) FROM ${this.schema}.moderation_strikes
        WHERE principal_id=$1 AND status='ACTIVE' AND imposed_at>=$2`,
        [principalId, cutoff],
      )
      .then((query) => Number(query.rows[0]?.count ?? 0));
    return count === 0 ? 'MUTE_7D' : count === 1 ? 'MUTE_30D' : 'PERMANENT_BLOCK';
  }

  private async imposeSanction(
    client: PoolClient,
    owner: Principal,
    caseId: string,
    principalId: string,
    sanction: 'MUTE_7D' | 'MUTE_30D' | 'PERMANENT_BLOCK',
    reason: string,
  ) {
    const cutoff = new Date(this.now());
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1);
    const count = await client
      .query<{ count: string }>(
        `SELECT count(*) FROM ${this.schema}.moderation_strikes
        WHERE principal_id=$1 AND status='ACTIVE' AND imposed_at>=$2`,
        [principalId, cutoff],
      )
      .then((query) => Number(query.rows[0]?.count ?? 0));
    const expires =
      sanction === 'PERMANENT_BLOCK'
        ? null
        : new Date(this.now().getTime() + (sanction === 'MUTE_7D' ? 7 : 30) * 86_400_000);
    await client.query(
      `INSERT INTO ${this.schema}.moderation_strikes
        (id,principal_id,case_id,ordinal_in_window,sanction,imposed_by,imposed_at,
         expires_at,reason,is_test)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (case_id) DO UPDATE SET ordinal_in_window=$4,sanction=$5,status='ACTIVE',
         imposed_by=$6,imposed_at=$7,expires_at=$8,reason=$9,is_test=$10`,
      [
        randomUUID(),
        principalId,
        caseId,
        Math.min(count + 1, 3),
        sanction,
        owner.id,
        this.now(),
        expires,
        reason,
        owner.fixture,
      ],
    );
    await client.query(
      `INSERT INTO ${this.schema}.social_restrictions
        (principal_id,restriction_type,source_case_id,starts_at,expires_at,reason)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (principal_id) DO UPDATE SET restriction_type=$2,source_case_id=$3,
         starts_at=$4,expires_at=$5,status='ACTIVE',reason=$6,updated_at=$4`,
      [principalId, sanction, caseId, this.now(), expires, reason],
    );
    await client.query(
      `UPDATE ${this.schema}.principals SET social_status=$2,updated_at=$3,version=version+1
        WHERE id=$1`,
      [principalId, sanction === 'PERMANENT_BLOCK' ? 'DISABLED' : 'RESTRICTED', this.now()],
    );
  }

  private async recomputeRestriction(client: PoolClient, principalId: string) {
    const activeStrike = await client
      .query<{
        sanction: 'MUTE_7D' | 'MUTE_30D' | 'PERMANENT_BLOCK';
        case_id: string;
        expires_at: Date | null;
        reason: string;
      }>(
        `SELECT sanction,case_id,expires_at,reason FROM ${this.schema}.moderation_strikes
        WHERE principal_id=$1 AND status='ACTIVE' AND (expires_at IS NULL OR expires_at>$2)
        ORDER BY CASE sanction WHEN 'PERMANENT_BLOCK' THEN 0 WHEN 'MUTE_30D' THEN 1 ELSE 2 END,
                 imposed_at DESC LIMIT 1`,
        [principalId, this.now()],
      )
      .then((query) => query.rows[0]);
    if (activeStrike) {
      await client.query(
        `INSERT INTO ${this.schema}.social_restrictions
          (principal_id,restriction_type,source_case_id,starts_at,expires_at,reason)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (principal_id) DO UPDATE SET restriction_type=$2,source_case_id=$3,
           starts_at=$4,expires_at=$5,status='ACTIVE',reason=$6,updated_at=$4`,
        [
          principalId,
          activeStrike.sanction,
          activeStrike.case_id,
          this.now(),
          activeStrike.expires_at,
          activeStrike.reason,
        ],
      );
      await client.query(
        `UPDATE ${this.schema}.principals SET social_status=$2,updated_at=$3,version=version+1
          WHERE id=$1`,
        [
          principalId,
          activeStrike.sanction === 'PERMANENT_BLOCK' ? 'DISABLED' : 'RESTRICTED',
          this.now(),
        ],
      );
      return;
    }
    await client.query(
      `UPDATE ${this.schema}.social_restrictions SET status='EXPIRED',updated_at=$2
        WHERE principal_id=$1 AND status='ACTIVE'`,
      [principalId, this.now()],
    );
    await client.query(
      `UPDATE ${this.schema}.principals SET social_status='ENABLED',updated_at=$2,
              version=version+1 WHERE id=$1`,
      [principalId, this.now()],
    );
  }

  private async finishCase(
    client: PoolClient,
    caseId: string,
    owner: Principal,
    status: string,
    reason: string,
  ) {
    await client.query(
      `UPDATE ${this.schema}.moderation_cases SET status=$2,owner_principal_id=$3,
              owner_reason=$4,decided_at=$5,updated_at=$5 WHERE id=$1`,
      [caseId, status, owner.id, reason, this.now()],
    );
    await appendAuditEvent(client, {
      actorPrincipalId: owner.id,
      eventType: 'MODERATION_CASE_DECIDED',
      objectType: 'moderation_case',
      objectId: caseId,
      details: { status, reason },
      fixture: owner.fixture,
      schema: this.schema.slice(1, -1),
    });
  }

  private async restoreTarget(client: PoolClient, type: ModerationTarget, id: string) {
    switch (type) {
      case 'SOCIAL_POST':
        await client.query(
          `UPDATE ${this.schema}.social_posts SET status='PUBLISHED',moderation_status='SAFE',
                  moderation_reason='Admin false-positive restore',
                  is_indexed=(audience_policy='ADULT_PUBLIC'),updated_at=$2,version=version+1
            WHERE id=$1 AND status<>'DELETED'`,
          [id, this.now()],
        );
        break;
      case 'SOCIAL_COMMENT':
        await client.query(
          `UPDATE ${this.schema}.social_comments SET status='PUBLISHED',
                  moderation_status='SAFE',updated_at=$2 WHERE id=$1 AND status<>'DELETED'`,
          [id, this.now()],
        );
        break;
      case 'DIRECT_MESSAGE':
        await client.query(
          `UPDATE ${this.schema}.direct_messages SET status='VISIBLE',moderation_status='SAFE',
                  moderation_reason='Admin false-positive restore'
            WHERE id=$1 AND status<>'DELETED_BOTH'`,
          [id],
        );
        break;
      case 'ARTICLE_SUGGESTION':
        await client.query(
          `UPDATE ${this.schema}.article_suggestions SET moderation_status='SAFE',
                  moderation_reason='Admin false-positive restore',updated_at=$2 WHERE id=$1`,
          [id, this.now()],
        );
        break;
      case 'ARTICLE_CORRECTION':
        await client.query(
          `UPDATE ${this.schema}.article_corrections SET moderation_status='SAFE',
                  moderation_reason='Admin false-positive restore',updated_at=$2 WHERE id=$1`,
          [id, this.now()],
        );
        break;
      case 'STORAGE_OBJECT':
      case 'PUBLIC_FEEDBACK':
        break;
    }
  }

  private async readTargetEvidence(client: PoolClient, type: ModerationTarget, id: string) {
    switch (type) {
      case 'SOCIAL_POST':
        return client
          .query(`SELECT body,link_url,status FROM ${this.schema}.social_posts WHERE id=$1`, [id])
          .then((query) => query.rows[0] ?? null);
      case 'SOCIAL_COMMENT':
        return client
          .query(`SELECT body,status FROM ${this.schema}.social_comments WHERE id=$1`, [id])
          .then((query) => query.rows[0] ?? null);
      case 'DIRECT_MESSAGE':
        return client
          .query(
            `SELECT body,status,storage_object_id FROM ${this.schema}.direct_messages WHERE id=$1`,
            [id],
          )
          .then((query) => query.rows[0] ?? null);
      case 'ARTICLE_SUGGESTION':
        return client
          .query(
            `SELECT topic,reason,sources_note,status FROM ${this.schema}.article_suggestions WHERE id=$1`,
            [id],
          )
          .then((query) => query.rows[0] ?? null);
      case 'ARTICLE_CORRECTION':
        return client
          .query(
            `SELECT location_hint,description,suggestion,source_reference,status FROM ${this.schema}.article_corrections WHERE id=$1`,
            [id],
          )
          .then((query) => query.rows[0] ?? null);
      case 'STORAGE_OBJECT':
        return client
          .query(
            `SELECT media_type,size_bytes,sha256,storage_state,assessment_status FROM ${this.schema}.storage_objects WHERE id=$1`,
            [id],
          )
          .then((query) => query.rows[0] ?? null);
      case 'PUBLIC_FEEDBACK':
        return null;
    }
  }
}

export async function requireSafeAssessment(
  moderator: ModerationDecision,
  input: Parameters<ModerationDecision['assess']>[0],
) {
  const assessed = await moderator.assess(input);
  if (assessed.status === 'UNASSESSED') {
    throw new ApiError('DEPENDENCY_UNAVAILABLE', assessed.reason);
  }
  if (assessed.status !== 'SAFE') throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');
  return assessed;
}

async function normalizedDecision(
  engine: ModerationDecision,
  input: Parameters<ModerationDecision['assess']>[0],
): Promise<LocalModerationResult> {
  try {
    const raw = await engine.assess(input);
    return {
      status: raw.status,
      reason: raw.reason,
      riskLevel:
        raw.riskLevel ??
        (raw.status === 'SAFE' ? 'LOW' : raw.status === 'UNSAFE' ? 'HIGH' : 'UNKNOWN'),
      category: (raw.category ??
        (raw.status === 'SAFE' ? 'NONE' : 'UNSUPPORTED')) as ModerationCategory,
      confidence: raw.confidence ?? 0,
      inputKind: raw.inputKind ?? 'COMPOSITE',
      engine: raw.engine ?? { ...ENGINE, durationMs: 0 },
    };
  } catch (error) {
    return {
      status: 'UNASSESSED',
      reason: error instanceof Error ? `Engine gagal: ${error.name}` : 'Engine gagal',
      riskLevel: 'UNKNOWN',
      category: 'ENGINE_ERROR',
      confidence: 0,
      inputKind: 'COMPOSITE',
      engine: { ...ENGINE, durationMs: 0 },
    };
  }
}

function result(
  status: LocalModerationResult['status'],
  riskLevel: ModerationRisk,
  category: ModerationCategory,
  confidence: number,
  inputKind: LocalModerationResult['inputKind'],
  reason: string,
  started: number,
): LocalModerationResult {
  return {
    status,
    riskLevel,
    category,
    confidence,
    inputKind,
    reason,
    engine: { ...ENGINE, durationMs: Math.max(0, Date.now() - started) },
  };
}

function detectMagic(bytes: Uint8Array) {
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x7f &&
    bytes[1] === 0x45 &&
    bytes[2] === 0x4c &&
    bytes[3] === 0x46
  )
    return 'EXECUTABLE';
  if (bytes.length >= 2 && bytes[0] === 0x4d && bytes[1] === 0x5a) return 'EXECUTABLE';
  if (bytes.length >= 2 && bytes[0] === 0x23 && bytes[1] === 0x21) return 'EXECUTABLE';
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  )
    return 'ARCHIVE';
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return 'image/jpeg';
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  )
    return 'application/pdf';
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp')
    return 'video/mp4';
  return 'UNKNOWN';
}

function safePreview(
  input: { contentText?: string; url?: string; mediaType?: string; declaredSizeBytes?: number },
  decision: LocalModerationResult,
) {
  return {
    kind: decision.inputKind,
    category: decision.category,
    riskLevel: decision.riskLevel,
    textExcerpt: input.contentText ? scrub(input.contentText).slice(0, 240) : null,
    urlHost: input.url ? safeHost(input.url) : null,
    mediaType: input.mediaType ?? null,
    declaredSizeBytes: input.declaredSizeBytes ?? null,
  };
}

function scrub(value: string) {
  return value
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[EMAIL]')
    .replace(/(?:\+?62|0)8\d{8,11}/g, '[PHONE]')
    .replace(/[\u0000-\u001f\u007f]/g, ' ');
}

function safeHost(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return '[INVALID_URL]';
  }
}

function hashContext(input: {
  contentText?: string;
  url?: string;
  mediaType?: string;
  bytes?: Uint8Array;
}) {
  const hash = createHash('sha256');
  hash.update(input.contentText ?? '');
  hash.update(input.url ?? '');
  hash.update(input.mediaType ?? '');
  if (input.bytes) hash.update(input.bytes);
  return hash.digest('hex');
}

function isCritical(category: ModerationCategory) {
  return ['CHILD_EXPLOITATION', 'THREAT', 'CRIME', 'GROOMING'].includes(category);
}

/** Peta kategori filter kata terlarang (config) → kategori engine moderasi. */
function blockedWordCategory(category: BlockedWordCategory): ModerationCategory {
  switch (category) {
    case 'PORNOGRAFI':
      return 'ADULT_SEXUAL';
    case 'ANCAMAN':
      return 'THREAT';
    case 'KEKERASAN':
      return 'VIOLENCE';
    case 'PELECEHAN':
      return 'ADULT_SEXUAL';
    case 'SARA':
      return 'CRIME';
  }
}

function ownerOnly(principal: Principal) {
  requireApproved(principal);
  if (principal.role !== 'OWNER') throw new ApiError('ACCESS_DENIED', 'Hanya Admin');
}

function cleanReason(value: string, maximum: number) {
  if (typeof value !== 'string' || value.trim().length < 10 || value.length > maximum) {
    throw new ApiError('VALIDATION_FAILED', `Alasan harus 10–${maximum} karakter`);
  }
  return value.trim();
}

function validateKey(value: string) {
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(value)) {
    throw new ApiError('VALIDATION_FAILED', 'Idempotency key tidak valid');
  }
}

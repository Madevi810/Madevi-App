import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { AiAdapter, Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';

export type AiRole = 'USER' | 'ASSISTANT' | 'SYSTEM';
export type AiEventType =
  | 'ASK'
  | 'REJECTED'
  | 'INJECTION_BLOCKED'
  | 'RATE_LIMITED'
  | 'GATE_BLOCKED'
  | 'QUALITY_FEEDBACK';

export interface ConversationRow {
  id: string;
  principalId: string | null;
  sessionHash: string | null;
  title: string;
  retentionUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageRow {
  id: string;
  conversationId: string;
  role: AiRole;
  content: string;
  sources: Array<{ id: string; title: string; url: string }>;
  createdAt: Date;
}

export interface AiAnswerInput {
  principal: Principal | null;
  conversationId?: string;
  sessionHash: string;
  message: string;
  examActive: boolean;
}

export interface AiAnswerResult {
  conversationId: string;
  messageId: string;
  answer: string;
  sources: Array<{ id: string; title: string; url: string }>;
}

export class AiService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly adapter?: AiAdapter,
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /**
   * Pastikan baris percakapan ada; buat baru bila input tidak membawa
   * conversationId. Dipakai jalur lokal maupun adapter agar riwayat konsisten.
   */
  private async ensureConversation(input: AiAnswerInput): Promise<string> {
    if (input.conversationId) return input.conversationId;
    const conversationId = randomUUID();
    const retention = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.pool.query(
      `INSERT INTO ${this.schema}.ai_conversations
         (id, principal_id, session_hash, title, retention_until)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        conversationId,
        input.principal?.id ?? null,
        input.principal ? null : input.sessionHash,
        input.message.slice(0, 100),
        retention,
      ],
    );
    return conversationId;
  }

  async ask(input: AiAnswerInput): Promise<AiAnswerResult> {
    // Gate: ujian aktif menonaktifkan asisten sumber lokal.
    if (input.examActive) {
      await this.logEvent(
        input.principal?.id ?? null,
        'GATE_BLOCKED',
        'Asisten sumber lokal dinonaktifkan selama ujian aktif',
      );
      throw new ApiError(
        'DEPENDENCY_UNAVAILABLE',
        'Asisten Madevi tidak tersedia selama ujian berlangsung',
      );
    }

    if (this.adapter) {
      const raw = await this.adapter.answer(input);
      const value = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
      const answer = typeof value.answer === 'string'
        ? value.answer
        : typeof value.content === 'string'
          ? value.content
          : this.adapter.mode === 'SIMULASI'
            ? '[SIMULASI] Adapter AI tidak mengembalikan jawaban.'
            : 'Adapter AI tidak mengembalikan jawaban.';
      const sources = Array.isArray(value.sources)
        ? (value.sources as AiAnswerResult['sources'])
        : [];
      // Adapter hanya mengganti sumber jawaban — percakapan dan riwayat tetap
      // disimpan seperti jalur lokal agar riwayat/hapus konsisten.
      const adapterConversationId = await this.ensureConversation(input);
      await this.pool.query(
        `INSERT INTO ${this.schema}.ai_messages (id, conversation_id, role, content)
         VALUES ($1, $2, 'USER', $3)`,
        [randomUUID(), adapterConversationId, input.message],
      );
      const adapterMsgId =
        typeof value.messageId === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.messageId)
          ? value.messageId
          : randomUUID();
      await this.pool.query(
        `INSERT INTO ${this.schema}.ai_messages (id, conversation_id, role, content, sources)
         VALUES ($1, $2, 'ASSISTANT', $3, $4::jsonb)`,
        [adapterMsgId, adapterConversationId, answer, JSON.stringify(sources)],
      );
      await this.logEvent(input.principal?.id ?? null, 'ASK', '');
      return {
        conversationId: adapterConversationId,
        messageId: adapterMsgId,
        answer,
        sources,
      };
    }

    // Asisten Madevi tidak memiliki kuota pengguna. Perlindungan anti-abuse
    // diterapkan pada API action rate limit agar tidak menjadi paywall atau
    // batas harian yang terlihat pengguna.

    // Cek/dapatkan percakapan.
    const conversationId = await this.ensureConversation(input);

    // Simpan pesan pengguna.
    const userMsgId = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.ai_messages (id, conversation_id, role, content)
       VALUES ($1, $2, 'USER', $3)`,
      [userMsgId, conversationId, input.message],
    );

    // Retrieve only indexed article metadata allowed by the caller (L06).
    // Locked article bodies are never placed in the assistant context. Retrieval
    // memakai policy yang sama dengan Search: access_level + is_indexed +
    // publication_state (bila kolom 0031 tersedia). Sosial/paket draft tidak
    // tidak pernah menjadi konteks asisten.
    const canReadMember = Boolean(
      input.principal &&
      input.principal.approvalStatus === 'APPROVED' &&
      (input.principal.entitlementStatus !== 'NONE' || input.principal.role === 'OWNER'),
    );
    const terms = input.message.trim().split(/\s+/).filter(Boolean).slice(0, 12);
    const patterns = terms.map((term) => `%${term.replace(/[\\%_]/g, '\\$&')}%`);
    const accessCondition = canReadMember ? '' : "AND access_level = 'PUBLIC'";
    let retrieved: { rows: Array<{ object_id: string; title: string; slug: string; summary: string }> };
    try {
      retrieved = await this.pool.query<{
        object_id: string;
        title: string;
        slug: string;
        summary: string;
      }>(
        `SELECT object_id, title, slug, summary
           FROM ${this.schema}.search_index_entries
          WHERE is_indexed AND entry_type = 'ARTICLE' AND is_test = false
            AND publication_state = 'PUBLISHED'
            ${accessCondition}
            AND (title ILIKE ANY($1) OR summary ILIKE ANY($1))
          ORDER BY updated_at DESC, object_id LIMIT 3`,
        [patterns.length ? patterns : ['%']],
      );
    } catch {
      // Fallback pra-0031 (kolom publication_state belum ada).
      retrieved = await this.pool.query<{
        object_id: string;
        title: string;
        slug: string;
        summary: string;
      }>(
        `SELECT object_id, title, slug, summary
           FROM ${this.schema}.search_index_entries
          WHERE is_indexed AND entry_type = 'ARTICLE' AND is_test = false
            ${accessCondition}
            AND (title ILIKE ANY($1) OR summary ILIKE ANY($1))
          ORDER BY updated_at DESC, object_id LIMIT 3`,
        [patterns.length ? patterns : ['%']],
      );
    }
    const sources = retrieved.rows.map((row) => ({
      id: row.object_id,
      title: row.title,
      url: `/artikel/${row.object_id}`,
    }));
    const answerText = retrieved.rows.length
      ? `Berdasarkan ${retrieved.rows.length} sumber lokal Madevi yang diizinkan: ${retrieved.rows.map((row) => `${row.title}: ${row.summary}`).join(' ')}`
      : // P14: "Bila bukti tidak ada, AI mengakui tidak tahu dan menawarkan
        // pencarian Madevi." Jujur tentang kekosongan bukti + arahkan ke
        // ruang pengetahuan, bukan mengarang jawaban.
        'Saya tidak menemukan artikel lokal yang sesuai. Saya tidak akan mengarang jawaban tanpa sumber Madevi yang dapat diverifikasi. Coba telusuri Explore & Learn (/ruang/jelajahi-pengetahuan) atau masukkan topik ini sebagai kontribusi.';

    const msgId = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.ai_messages (id, conversation_id, role, content, sources)
       VALUES ($1, $2, 'ASSISTANT', $3, $4::jsonb)`,
      [msgId, conversationId, answerText, JSON.stringify(sources)],
    );

    await this.logEvent(input.principal?.id ?? null, 'ASK', '');

    return {
      conversationId,
      messageId: msgId,
      answer: answerText,
      sources,
    };
  }

  async listConversations(
    principal: Principal | null,
    sessionHash: string,
    cursor?: string,
    limit = 20,
  ) {
    const limitSafe = Math.min(limit, 100);
    const params: unknown[] = cursor ? [cursor, limitSafe] : [limitSafe];
    const whereClause = principal ? 'principal_id = $1' : 'session_hash = $1';
    void whereClause;
    void params;

    const rows = await this.pool.query<ConversationRow>(
      `SELECT id, principal_id AS "principalId", session_hash AS "sessionHash",
              title, retention_until AS "retentionUntil",
              created_at AS "createdAt", updated_at AS "updatedAt"
         FROM ${this.schema}.ai_conversations
        WHERE ${whereClause}
          AND retention_until > NOW()
        ORDER BY updated_at DESC
        LIMIT ${limitSafe}`,
      principal ? [principal.id] : [sessionHash],
    );
    return {
      items: rows.rows.map((r) => ({
        id: r.id,
        title: r.title,
        retentionUntil: r.retentionUntil,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
    };
  }

  async getConversation(conversationId: string, principal: Principal | null, sessionHash: string) {
    const conv = await this.pool.query<ConversationRow>(
      `SELECT id, principal_id AS "principalId", session_hash AS "sessionHash",
              title, retention_until AS "retentionUntil",
              created_at AS "createdAt", updated_at AS "updatedAt"
         FROM ${this.schema}.ai_conversations WHERE id = $1 AND retention_until > NOW()`,
      [conversationId],
    );
    if (!conv.rows[0]) throw new ApiError('NOT_FOUND', 'Percakapan tidak ditemukan');

    // Verifikasi kepemilikan.
    const row = conv.rows[0];
    const ownerMatch = principal
      ? row.principalId === principal.id
      : row.sessionHash === sessionHash;
    if (!ownerMatch) throw new ApiError('ACCESS_DENIED', 'Bukan percakapan Anda');

    const msgs = await this.pool.query<MessageRow>(
      `SELECT id, conversation_id AS "conversationId", role, content, sources,
              created_at AS "createdAt"
         FROM ${this.schema}.ai_messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC`,
      [conversationId],
    );

    return {
      conversation: { id: row.id, title: row.title, retentionUntil: row.retentionUntil },
      messages: msgs.rows.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        sources: m.sources,
        createdAt: m.createdAt,
      })),
    };
  }

  async deleteConversation(
    conversationId: string,
    principal: Principal | null,
    sessionHash: string,
  ) {
    const row = await this.pool.query<{
      id: string;
      principalId: string | null;
      sessionHash: string | null;
    }>(
      `SELECT id, principal_id AS "principalId", session_hash AS "sessionHash" FROM ${this.schema}.ai_conversations WHERE id = $1`,
      [conversationId],
    );
    if (!row.rows[0]) throw new ApiError('NOT_FOUND', 'Percakapan tidak ditemukan');
    const r = row.rows[0];
    const ownerMatch = principal ? r.principalId === principal.id : r.sessionHash === sessionHash;
    if (!ownerMatch) throw new ApiError('ACCESS_DENIED', 'Bukan percakapan Anda');
    await this.pool.query(`DELETE FROM ${this.schema}.ai_conversations WHERE id = $1`, [
      conversationId,
    ]);
  }

  /**
   * Kemampuan Asisten Madevi: pencarian sumber lokal, gratis, dengan anti-abuse.
   * Tidak mengklaim model/provider online. Dipakai bubble + halaman penuh + API
   * availability agar label konsisten dengan perilaku nyata.
   */
  async getCapability(input: {
    principal: Principal | null;
    examActive: boolean;
  }): Promise<{
    mode: 'LOCAL_RETRIEVAL';
    free: true;
    allowed: boolean;
    unavailableReason: 'EXAM_ACTIVE' | null;
    allowedSources: string[];
    note: string;
  }> {
    if (input.examActive) {
      return {
        mode: 'LOCAL_RETRIEVAL',
        free: true,
        allowed: false,
        unavailableReason: 'EXAM_ACTIVE',
        allowedSources: ['ARTICLE:PUBLIC'],
        note: 'Asisten sumber lokal, gratis. Nonaktif selama ujian.',
      };
    }
    return {
      mode: 'LOCAL_RETRIEVAL',
      free: true,
      allowed: true,
      unavailableReason: null,
      allowedSources: input.principal ? ['ARTICLE:PUBLIC', 'ARTICLE:MEMBER'] : ['ARTICLE:PUBLIC'],
      note: 'Asisten sumber lokal; jawaban hanya dirangkum dari artikel yang diizinkan dan mengakui bila bukti belum ada.',
    };
  }

  private async logEvent(principalId: string | null, eventType: AiEventType, reason: string) {
    await this.pool.query(
      `INSERT INTO ${this.schema}.ai_audit_events (id, principal_id, event_type, reason)
       VALUES ($1, $2, $3, $4)`,
      [randomUUID(), principalId, eventType, reason],
    );
  }
}

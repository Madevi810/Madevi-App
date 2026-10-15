import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import { consumeRateLimit } from '@/api/rate-limit';
import { ApiError } from '@/api/errors';
import { quotedSchema } from '@/db/schema-name';
import { LocalModerationEngine } from '@/services/moderation';

export type PublicFeedbackKind = 'REVIEW' | 'REPORT';

export class PublicFeedbackService {
  private readonly schemaName: string;
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schemaName = schemaName;
    this.schema = quotedSchema(schemaName);
  }

  async enqueue(input: {
    kind: PublicFeedbackKind;
    topic: string;
    message: string;
    idempotencyKey: string;
    senderPrincipalId?: string;
  }) {
    const moderation = await new LocalModerationEngine().assess({
      objectId: `public-feedback:${input.idempotencyKey}`,
      relativePath: 'virtual/public-feedback.txt',
      contentText: `${input.topic}\n${input.message}`,
    });
    if (moderation.status !== 'SAFE') {
      throw new ApiError(
        'DEPENDENCY_UNAVAILABLE',
        'Masukan ditahan oleh moderasi lokal dan tidak diteruskan otomatis',
      );
    }

    // Rate-limit berdasarkan sender. consumeRateLimit memakai tabel api_rate_limits
    // yang principal_id-nya UUID REFERENCES principals(id) — hanya valid untuk
    // pengirim terotentikasi. Pengirim anonim (tanpa senderPrincipalId) dilewati
    // di sini karena sudah dilindungi route-level checkActionRateLimit(ip,
    // 'public_feedback') 10/jam (P1 audit 2026-10-15, terverifikasi runtime).
    // Memakai string non-UUID seperti 'anonymous-feedback' akan melempar 22P02.
    if (input.senderPrincipalId) {
      await consumeRateLimit(this.pool, {
        principalId: input.senderPrincipalId,
        bucket: `public-feedback-${input.kind.toLowerCase()}`,
        maximum: 20,
        windowSeconds: 3600,
        schema: this.schemaName,
      });
    }

    // Tulis langsung ke owner_inbox_items — hanya bisa dibaca Owner
    // melalui listOwnerInbox (Admin → Inbox). Tidak ada label simulasi.
    const id = randomUUID();
    const subject = `[${input.kind}] ${input.topic}`.slice(0, 180);
    const body = [
      `Jenis: ${input.kind}`,
      `Topik: ${input.topic}`,
      `Pesan: ${input.message}`,
      `Moderasi: ${moderation.status}${moderation.engine ? ` (${moderation.engine.name} ${moderation.engine.version})` : ''}`,
      `Key: ${input.idempotencyKey}`,
    ].join('\n').slice(0, 4000);

    await this.pool.query(
      `INSERT INTO ${this.schema}.owner_inbox_items
         (id, sender_principal_id, item_kind, subject, body_text)
       VALUES ($1, $2, 'REPORT', $3, $4)
       ON CONFLICT DO NOTHING`,
      [id, input.senderPrincipalId ?? null, subject, body],
    );

    return {
      inboxItemId: id,
      // Backward-compatible alias for older integration clients.
      outboxId: id,
      queued: true as const,
      mode: 'LOCAL_DELIVERY' as const,
      destination: 'OwnerInbox',
    };
  }
}

import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';

import { quotedSchema } from '@/db/schema-name';

export class InboxService {
  private readonly schema: string;

  constructor(
    private pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async sendToOwner(data: {
    senderPrincipalId?: string;
    senderEmail?: string;
    senderName?: string;
    category: 'TANYA_PRODUK' | 'KERJA_SAMA' | 'BANDING_KODE' | 'UMUM' | 'BALASAN';
    referenceId?: string;
    subject: string;
    content: string;
  }) {
    const id = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.owner_inbox (
        id, sender_principal_id, sender_email, sender_name, category, reference_id, subject, content
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        data.senderPrincipalId,
        data.senderEmail,
        data.senderName,
        data.category,
        data.referenceId,
        data.subject,
        data.content,
      ],
    );

    return { id, status: 'NEW', ...data };
  }
}

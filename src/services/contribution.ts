import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';

export type ContributionStatus = 'SUBMIT' | 'REVIEW' | 'NEED_REVISION' | 'SAVED' | 'PUBLISHED';

export interface ContributionRow {
  id: string;
  principalId: string | null;
  creatorName: string;
  title: string;
  description: string;
  sources: string;
  status: ContributionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ContributionService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async create(
    principal: Principal,
    input: { title: string; description: string; sources: string },
  ) {
    if (principal.role === 'SERVICE') {
      throw new ApiError('ACCESS_DENIED', 'Hanya pengguna terdaftar yang dapat berkontribusi');
    }
    const id = randomUUID();
    // Principal tidak membawa nama; ambil display_name dari profiles.
    const profileRow = await this.pool.query<{ display_name: string | null }>(
      `SELECT display_name FROM ${this.schema}.profiles WHERE principal_id = $1`,
      [principal.id],
    );
    const creatorName = profileRow.rows[0]?.display_name?.trim() || 'Pengguna';
    const res = await this.pool.query<ContributionRow>(
      `INSERT INTO ${this.schema}.user_contributions 
         (id, principal_id, creator_name, title, description, sources, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'SUBMIT')
       RETURNING id, principal_id AS "principalId", creator_name AS "creatorName", title, description, sources, status, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [id, principal.id, creatorName.slice(0, 120), input.title, input.description, input.sources],
    );
    return res.rows[0];
  }

  async listByUser(principal: Principal) {
    const res = await this.pool.query<ContributionRow>(
      `SELECT id, principal_id AS "principalId", creator_name AS "creatorName", title, description, sources, status, created_at AS "createdAt", updated_at AS "updatedAt"
         FROM ${this.schema}.user_contributions
        WHERE principal_id = $1
        ORDER BY created_at DESC`,
      [principal.id],
    );
    return res.rows;
  }

  async getById(id: string) {
    const res = await this.pool.query<ContributionRow>(
      `SELECT id, principal_id AS "principalId", creator_name AS "creatorName", title, description, sources, status, created_at AS "createdAt", updated_at AS "updatedAt"
         FROM ${this.schema}.user_contributions
        WHERE id = $1`,
      [id],
    );
    if (!res.rows[0]) throw new ApiError('NOT_FOUND', 'Kontribusi tidak ditemukan');
    return res.rows[0];
  }

  // Admin method to change status
  async updateStatus(principal: Principal, id: string, status: ContributionStatus) {
    if (principal.role !== 'OWNER') {
      throw new ApiError('ACCESS_DENIED', 'Hanya Admin yang dapat mengubah status kontribusi');
    }
    const res = await this.pool.query<ContributionRow>(
      `UPDATE ${this.schema}.user_contributions
          SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, principal_id AS "principalId", creator_name AS "creatorName", title, description, sources, status, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [status, id],
    );
    if (!res.rows[0]) throw new ApiError('NOT_FOUND', 'Kontribusi tidak ditemukan');
    return res.rows[0];
  }

  // When an account is deleted, we just set principal_id to null but keep the contribution and creator_name
  async unlinkUser(principalId: string) {
    await this.pool.query(
      `UPDATE ${this.schema}.user_contributions SET principal_id = NULL WHERE principal_id = $1`,
      [principalId],
    );
  }
}

import { randomUUID } from 'node:crypto';

import type { Pool, PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import {
  constantTimeHashMatch,
  randomToken,
  sha256,
  signAccessToken,
  verifyAccessToken,
} from '@/auth/crypto';
import type { Principal } from '@/contracts/services';
import { getDatabaseClients } from '@/db/client';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { appendAuditEvent } from '@/services/audit';

export type SessionAudience = 'MEMBER' | 'OWNER';

export interface SessionBundle {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
  audience: SessionAudience;
}

export interface AuthenticatedSession {
  sessionId: string;
  principal: Principal;
  audience: SessionAudience;
  ownerDeviceId: string | null;
}

interface SessionRow {
  id: string;
  principal_id: string;
  audience: SessionAudience;
  refresh_token_hash: string;
  csrf_token_hash: string;
  owner_device_id: string | null;
  last_activity_at: Date;
  refresh_expires_at: Date;
  absolute_expires_at: Date;
  revoked_at: Date | null;
  role: 'MEMBER' | 'OWNER' | 'SERVICE';
  approval_status: Principal['approvalStatus'];
  entitlement_status: Principal['entitlementStatus'];
  social_status: Principal['socialStatus'];
  is_test: boolean;
  lifecycle_status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  device_status: 'PENDING_EMAIL' | 'ACTIVE' | 'REVOKED' | null;
}

const ACCESS_TTL_MS = 10 * 60_000;
const MEMBER_REFRESH_TTL_MS = 30 * 24 * 60 * 60_000;
const OWNER_REFRESH_TTL_MS = 12 * 60 * 60_000;
const MEMBER_ABSOLUTE_TTL_MS = 90 * 24 * 60 * 60_000;
const OWNER_ABSOLUTE_TTL_MS = 24 * 60 * 60_000;
const OWNER_IDLE_TTL_MS = 60 * 60_000;

export class SessionService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
    private readonly secret = process.env.AUTH_TOKEN_SECRET ?? '',
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async create(input: {
    principal: Principal;
    audience: SessionAudience;
    ownerDeviceId?: string;
  }): Promise<SessionBundle> {
    if (input.audience !== input.principal.role) {
      throw new ApiError('ACCESS_DENIED', 'Audience sesi tidak sesuai principal');
    }
    if (input.audience === 'OWNER' && !input.ownerDeviceId) {
      throw new ApiError('ACCESS_DENIED', 'Perangkat Admin terverifikasi diperlukan');
    }
    const now = this.now();
    const refreshToken = randomToken();
    const csrfToken = randomToken();
    const sessionId = randomUUID();
    const refreshExpiresAt = new Date(
      now.getTime() + (input.audience === 'OWNER' ? OWNER_REFRESH_TTL_MS : MEMBER_REFRESH_TTL_MS),
    );
    const absoluteExpiresAt = new Date(
      now.getTime() + (input.audience === 'OWNER' ? OWNER_ABSOLUTE_TTL_MS : MEMBER_ABSOLUTE_TTL_MS),
    );
    await inTransaction(this.pool, async (client) => {
      if (input.audience === 'OWNER') {
        const device = await client.query<{ status: string; owner_principal_id: string }>(
          `SELECT status, owner_principal_id FROM ${this.schema}.owner_devices WHERE id = $1`,
          [input.ownerDeviceId],
        );
        if (
          device.rows[0]?.status !== 'ACTIVE' ||
          device.rows[0].owner_principal_id !== input.principal.id
        ) {
          throw new ApiError('ACCESS_DENIED', 'Perangkat Admin tidak aktif');
        }
      }
      await client.query(
        `INSERT INTO ${this.schema}.auth_sessions
           (id, principal_id, audience, refresh_token_hash, csrf_token_hash,
            owner_device_id, created_at, last_activity_at, refresh_expires_at,
            absolute_expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9)`,
        [
          sessionId,
          input.principal.id,
          input.audience,
          sha256(refreshToken),
          sha256(csrfToken),
          input.ownerDeviceId ?? null,
          now,
          refreshExpiresAt,
          absoluteExpiresAt,
        ],
      );
      await appendAuditEvent(client, {
        actorPrincipalId: input.principal.id,
        eventType: 'SESSION_CREATED',
        objectType: 'auth_session',
        objectId: sessionId,
        details: { audience: input.audience },
        fixture: input.principal.fixture,
        schema: this.schema.slice(1, -1),
      });
    });
    return this.bundle({
      sessionId,
      principal: input.principal,
      audience: input.audience,
      refreshToken,
      csrfToken,
      refreshExpiresAt,
      now,
    });
  }

  async authenticateAccess(
    token: string,
    audience: SessionAudience,
    options: { humanActivity?: boolean } = {},
  ): Promise<AuthenticatedSession> {
    const claims = verifyAccessToken(token, {
      audience: audience === 'OWNER' ? 'madevi-owner' : 'madevi-member',
      secret: this.secret,
      now: this.now(),
    });
    const row = await this.loadSession(this.pool, claims.sid);
    this.assertActive(row, audience);
    if (row.principal_id !== claims.sub || row.role !== claims.role) throw invalidSession();
    if (audience === 'OWNER' && options.humanActivity) {
      await this.pool.query(
        `UPDATE ${this.schema}.auth_sessions SET last_activity_at = $2 WHERE id = $1`,
        [row.id, this.now()],
      );
    }
    return toAuthenticated(row);
  }

  async assertCsrf(sessionId: string, headerToken: string | null, cookieToken: string | null) {
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      throw new ApiError('ACCESS_DENIED', 'Validasi CSRF gagal');
    }
    const result = await this.pool.query<{ csrf_token_hash: string }>(
      `SELECT csrf_token_hash FROM ${this.schema}.auth_sessions
        WHERE id = $1 AND revoked_at IS NULL`,
      [sessionId],
    );
    if (!result.rows[0] || !constantTimeHashMatch(headerToken, result.rows[0].csrf_token_hash)) {
      throw new ApiError('ACCESS_DENIED', 'Validasi CSRF gagal');
    }
  }

  async rotate(refreshToken: string, audience: SessionAudience): Promise<SessionBundle> {
    const tokenHash = sha256(refreshToken);
    const result = await inTransaction(this.pool, async (client) => {
      const used = await client.query<{ session_id: string }>(
        `SELECT session_id FROM ${this.schema}.used_refresh_tokens WHERE token_hash = $1`,
        [tokenHash],
      );
      if (used.rows[0]) {
        const compromised = await this.loadSession(client, used.rows[0].session_id, true);
        await client.query(
          `UPDATE ${this.schema}.auth_sessions
              SET revoked_at = COALESCE(revoked_at, $2), revoked_reason = 'REFRESH_REUSE'
            WHERE principal_id = $1 AND revoked_at IS NULL`,
          [compromised.principal_id, this.now()],
        );
        await appendAuditEvent(client, {
          actorPrincipalId: compromised.principal_id,
          eventType: 'REFRESH_REUSE_DETECTED',
          objectType: 'auth_session',
          objectId: compromised.id,
          fixture: compromised.is_test,
          schema: this.schema.slice(1, -1),
        });
        return null;
      }
      const result = await client.query<SessionRow>(
        `${sessionSelect(this.schema)} WHERE s.refresh_token_hash = $1 FOR UPDATE OF s`,
        [tokenHash],
      );
      const row = result.rows[0];
      this.assertActive(row, audience);
      const newRefresh = randomToken();
      const newCsrf = randomToken();
      const refreshExpiresAt = new Date(
        Math.min(
          this.now().getTime() +
            (audience === 'OWNER' ? OWNER_REFRESH_TTL_MS : MEMBER_REFRESH_TTL_MS),
          row.absolute_expires_at.getTime(),
        ),
      );
      await client.query(
        `INSERT INTO ${this.schema}.used_refresh_tokens (token_hash, session_id) VALUES ($1, $2)`,
        [tokenHash, row.id],
      );
      await client.query(
        `UPDATE ${this.schema}.auth_sessions
            SET refresh_token_hash = $2, csrf_token_hash = $3,
                refresh_expires_at = $4, rotated_at = $5
          WHERE id = $1`,
        [row.id, sha256(newRefresh), sha256(newCsrf), refreshExpiresAt, this.now()],
      );
      return this.bundle({
        sessionId: row.id,
        principal: toAuthenticated(row).principal,
        audience,
        refreshToken: newRefresh,
        csrfToken: newCsrf,
        refreshExpiresAt,
        now: this.now(),
      });
    });
    if (!result) throw invalidSession();
    return result;
  }

  async revokeSession(sessionId: string, reason: string) {
    await this.pool.query(
      `UPDATE ${this.schema}.auth_sessions
          SET revoked_at = COALESCE(revoked_at, $2), revoked_reason = $3
        WHERE id = $1`,
      [sessionId, this.now(), reason.slice(0, 80)],
    );
  }

  async revokeAll(principalId: string, reason: string) {
    await this.pool.query(
      `UPDATE ${this.schema}.auth_sessions
          SET revoked_at = COALESCE(revoked_at, $2), revoked_reason = $3
        WHERE principal_id = $1 AND revoked_at IS NULL`,
      [principalId, this.now(), reason.slice(0, 80)],
    );
  }

  private async loadSession(client: Pool | PoolClient, id: string, forUpdate = false) {
    const result = await client.query<SessionRow>(
      `${sessionSelect(this.schema)} WHERE s.id = $1${forUpdate ? ' FOR UPDATE OF s' : ''}`,
      [id],
    );
    if (!result.rows[0]) throw invalidSession();
    return result.rows[0];
  }

  private assertActive(row: SessionRow | undefined, audience: SessionAudience) {
    if (!row || row.audience !== audience || row.revoked_at || row.lifecycle_status !== 'ACTIVE') {
      throw invalidSession();
    }
    const now = this.now().getTime();
    if (row.refresh_expires_at.getTime() <= now || row.absolute_expires_at.getTime() <= now) {
      throw invalidSession();
    }
    if (
      audience === 'OWNER' &&
      (row.role !== 'OWNER' ||
        row.device_status !== 'ACTIVE' ||
        row.last_activity_at.getTime() + OWNER_IDLE_TTL_MS <= now)
    ) {
      throw invalidSession();
    }
  }

  private bundle(input: {
    sessionId: string;
    principal: Principal;
    audience: SessionAudience;
    refreshToken: string;
    csrfToken: string;
    refreshExpiresAt: Date;
    now: Date;
  }): SessionBundle {
    return {
      accessToken: signAccessToken(
        {
          sub: input.principal.id,
          sid: input.sessionId,
          role: input.audience,
          aud: input.audience === 'OWNER' ? 'madevi-owner' : 'madevi-member',
        },
        this.secret,
        input.now,
      ),
      refreshToken: input.refreshToken,
      csrfToken: input.csrfToken,
      accessExpiresAt: new Date(input.now.getTime() + ACCESS_TTL_MS).toISOString(),
      refreshExpiresAt: input.refreshExpiresAt.toISOString(),
      audience: input.audience,
    };
  }
}

function sessionSelect(schema: string) {
  return `SELECT s.*, p.role, p.approval_status, p.entitlement_status, p.social_status,
                 p.is_test, p.lifecycle_status, d.status AS device_status
            FROM ${schema}.auth_sessions s
            JOIN ${schema}.principals p ON p.id = s.principal_id
       LEFT JOIN ${schema}.owner_devices d ON d.id = s.owner_device_id`;
}

function toAuthenticated(row: SessionRow): AuthenticatedSession {
  return {
    sessionId: row.id,
    audience: row.audience,
    ownerDeviceId: row.owner_device_id,
    principal: {
      id: row.principal_id,
      role: row.role as 'MEMBER' | 'OWNER',
      approvalStatus: row.approval_status,
      entitlementStatus: row.entitlement_status,
      socialStatus: row.social_status,
      fixture: row.is_test,
    },
  };
}

function invalidSession() {
  return new ApiError('AUTHENTICATION_REQUIRED', 'Sesi tidak valid atau dicabut');
}

export async function getSessionPrincipal(req: Request): Promise<Principal | null> {
  try {
    const cookieHeader = req.headers.get('cookie') ?? '';
    const parts = cookieHeader.split(';').map((c) => c.trim());
    // Nama cookie sesuai COOKIE_NAMES di auth/http: madevi_access (MEMBER), madevi_owner_access (OWNER).
    const memberCookie = parts.find((c) => c.startsWith('madevi_access='));
    const ownerCookie = parts.find((c) => c.startsWith('madevi_owner_access='));
    const raw = memberCookie ?? ownerCookie;
    if (!raw) return null;
    const token = raw.split('=').slice(1).join('=').trim();
    if (!token) return null;
    const audience: SessionAudience = memberCookie ? 'MEMBER' : 'OWNER';
    const session = await new SessionService(getDatabaseClients().pool).authenticateAccess(
      token,
      audience,
    );
    return session.principal;
  } catch {
    return null;
  }
}

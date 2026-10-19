import { createHash, randomUUID } from 'crypto';
import type { Pool } from 'pg';
import { quotedSchema } from '@/db/schema-name';

export interface TelemetryEvent {
  eventCategory: string; // e.g. 'page_view', 'click', 'conversion'
  eventName: string; // e.g. 'hero_cta_click'
  url: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  principalId?: string;
}

export class TelemetryService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /**
   * Ensure telemetry table exists. (Self-healing schema design).
   */
  async ensureTableExists() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.telemetry_events (
        id UUID PRIMARY KEY,
        principal_id UUID,
        session_id UUID,
        event_category VARCHAR(100) NOT NULL,
        event_name VARCHAR(150) NOT NULL,
        url TEXT,
        user_agent TEXT,
        ip_hash VARCHAR(100),
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_telemetry_category ON ${this.schema}.telemetry_events(event_category, created_at);
      CREATE INDEX IF NOT EXISTS idx_telemetry_principal ON ${this.schema}.telemetry_events(principal_id) WHERE principal_id IS NOT NULL;
    `);
  }

  /**
   * Track an event async. Fire and forget!
   */
  async trackEvent(event: TelemetryEvent) {
    // Basic IP Anonymization for privacy-first analytics
    const ipHash = event.ipAddress
      ? createHash('sha256').update(event.ipAddress).digest('hex').substring(0, 16)
      : null;

    try {
      await this.pool.query(
        `INSERT INTO ${this.schema}.telemetry_events 
          (id, principal_id, session_id, event_category, event_name, url, user_agent, ip_hash, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)`,
        [
          randomUUID(),
          event.principalId ?? null,
          event.sessionId ?? null,
          event.eventCategory,
          event.eventName,
          event.url,
          event.userAgent ?? null,
          ipHash,
          event.metadata ? JSON.stringify(event.metadata) : null,
        ]
      );
    } catch (e) {
      // In a real-world scenario, if table doesn't exist, we might try to create it,
      // but for telemetry, we swallow the error to not break the user flow, 
      // or optionally log it to stderr.
      const err = e as { code?: string };
      if (err.code === '42P01') { // undefined_table
        await this.ensureTableExists();
        await this.trackEvent(event); // retry once
      } else {
        console.error('Telemetry tracking failed:', e);
      }
    }
  }

  /**
   * Admin Analytics Aggregation
   */
  async getAnalyticsSummary(timeRangeHours: number = 24) {
    const result = await this.pool.query(
      `SELECT 
         event_category, 
         COUNT(*) as total_events,
         COUNT(DISTINCT session_id) as unique_sessions
       FROM ${this.schema}.telemetry_events
       WHERE created_at >= NOW() - INTERVAL '1 hour' * $1
       GROUP BY event_category
       ORDER BY total_events DESC`,
      [timeRangeHours]
    );

    return result.rows.map(r => ({
      category: r.event_category,
      totalEvents: parseInt(r.total_events, 10),
      uniqueSessions: parseInt(r.unique_sessions, 10),
    }));
  }
}

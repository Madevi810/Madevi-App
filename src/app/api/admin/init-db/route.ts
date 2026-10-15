import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { Client } from 'pg';

const INIT_SECRET = process.env.DB_INIT_SECRET || 'madevi-init-2026';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  
  if (secret !== INIT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Get applied migrations
    const applied = await client.query('SELECT name FROM _migrations');
    const appliedNames = new Set(applied.rows.map(r => r.name));

    // Get migration files
    const migDir = join(process.cwd(), 'database', 'migrations');
    const files = await readdir(migDir);
    const upFiles = files.filter(f => f.endsWith('.up.sql')).sort();

    let applied_count = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const file of upFiles) {
      if (appliedNames.has(file)) {
        skipped++;
        continue;
      }

      try {
        const sql = await readFile(join(migDir, file), 'utf-8');
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        applied_count++;
      } catch (e: any) {
        await client.query('ROLLBACK').catch(() => {});
        errors.push(`${file}: ${e.message?.substring(0, 200)}`);
      }
    }

    await client.end();

    return NextResponse.json({
      success: true,
      applied: applied_count,
      skipped,
      errors: errors.slice(0, 10),
      total_files: upFiles.length
    });

  } catch (e: any) {
    await client.end().catch(() => {});
    return NextResponse.json(
      { error: e.message?.substring(0, 500) },
      { status: 500 }
    );
  }
}

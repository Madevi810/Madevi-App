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

    const seedDir = join(process.cwd(), 'database', 'seeds', 'articles');
    const files = await readdir(seedDir);
    const sqlFiles = files
      .filter(f => f.endsWith('.sql'))
      .sort((a, b) => {
        // Sort artikel-batch numerically
        const numA = parseInt(a.match(/batch-?(\d+)/)?.[1] || '0');
        const numB = parseInt(b.match(/batch-?(\d+)/)?.[1] || '0');
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
      });

    const results: Array<{ file: string; status: string; error?: string }> = [];
    let successCount = 0;
    let failCount = 0;

    // Ensure owner principal exists first (FK constraint)
    await client.query(`
      INSERT INTO madevi.principals (id, business_code, kind, role, approval_status, entitlement_status, social_status, display_name)
      VALUES ('f7125028-187e-44e0-b95b-88b69b8d5c9a', 'OWNER-SEED', 'OWNER', 'OWNER', 'APPROVED', 'NONE', 'ENABLED', 'Pemilik Madevi')
      ON CONFLICT (id) DO NOTHING
    `);

    for (const file of sqlFiles) {
      try {
        const sql = await readFile(join(seedDir, file), 'utf-8');
        await client.query(sql);
        results.push({ file, status: 'ok' });
        successCount++;
      } catch (err: any) {
        // Clean up aborted transaction state
        await client.query('ROLLBACK').catch(() => {});
        results.push({ file, status: 'error', error: err.message?.substring(0, 200) });
        failCount++;
      }
    }

    // Verify counts
    const nodes = await client.query('SELECT COUNT(*) as c FROM madevi.taxonomy_nodes');
    const articles = await client.query('SELECT COUNT(*) as c FROM madevi.articles');

    await client.end();

    return NextResponse.json({
      success: true,
      total_files: sqlFiles.length,
      succeeded: successCount,
      failed: failCount,
      taxonomy_nodes: parseInt(nodes.rows[0].c),
      articles: parseInt(articles.rows[0].c),
      details: results.filter(r => r.status === 'error'),
    });
  } catch (err: any) {
    await client.end().catch(() => {});
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

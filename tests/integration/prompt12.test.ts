import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { EBelanjaService } from '@/services/ebelanja';
import { PaymentService } from '@/services/payment';
import { InboxService } from '@/services/inbox';
import type { Principal } from '@/contracts/services';

const schema = 'test_prompt12';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt12-test',
});
const member: Principal = {
  id: 'c0000000-0000-4000-8000-000000000001',
  role: 'MEMBER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
let ebel: EBelanjaService;
let pay: PaymentService;
let inbox: InboxService;

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  // Migrasi PENUH (bukan cherry-pick): payment/ebelanja bergantung kolom
  // lintas migrasi (0021 entitlement, 0027 package_kind); pin parsial
  // merusak dependensi dan menyembunyikan bug instalasi baru.
  const r = spawnSync(process.execPath, ['scripts/migrate.mjs', 'up', '--schema', schema], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
  if (r.status !== 0) throw new Error(`Migrate gagal: ${(r.stderr || r.stdout).trim()}`);
  await pool.query(
    `INSERT INTO "${schema}".principals (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,username,is_test) VALUES ($1,'T12_MEMBER','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Member12','member12',true)`,
    [member.id],
  );
  await pool.query(
    `INSERT INTO "${schema}".ebelanja_partners (id,name,domain) VALUES ($1,'Partner Test','partner-test.example')`,
    [randomUUID()],
  );
  ebel = new EBelanjaService(pool, schema);
  pay = new PaymentService(pool, schema);
  inbox = new InboxService(pool, schema);
}, 120_000);

afterAll(async () => {
  await pool.end();
  const c = new Pool({ connectionString: process.env.DATABASE_URL });
  await c.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await c.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await c.end();
});

describe.sequential('Prompt 12 — E-Belanja & Payment', () => {
  it('F12-01: SSRF protection dan HTTPS enforcement', async () => {
    await expect(
      ebel.parseExternalProduct('https://localhost/test', '00000000-0000-4000-8000-000000000000'),
    ).rejects.toThrow();
    await expect(
      ebel.parseExternalProduct('http://evil.com/test', '00000000-0000-4000-8000-000000000000'),
    ).rejects.toThrow();
  });

  it('F12-02: search produk dan homepage', async () => {
    const products = await ebel.searchProducts({});
    expect(products.data).toBeDefined();
  });

  it('F12-03: payment create order dan redeem code', async () => {
    const order = await pay.createOrder(member.id, undefined);
    expect(order.finalPrice).toBe(25000);
    const paid = await pay.handleWebhookMock(order.id, 'evt-mock-12');
    expect(paid.status).toBe('PAID');
    if (!('code' in paid) || typeof paid.code !== 'string')
      throw new Error('Kode tidak tergenerate');
    await expect(pay.redeemCode(member.id, paid.code)).resolves.toMatchObject({ success: true });
  });

  it('F12-04: inbox inquiry ke Admin', async () => {
    const msg = await inbox.sendToOwner({
      category: 'KERJA_SAMA',
      subject: 'Mou',
      content: 'Test kerjasama',
      referenceId: randomUUID(),
    });
    expect(msg.status).toBe('NEW');
  });
});

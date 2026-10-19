import { sha256 } from '@/auth/crypto';
import { getSessionPrincipal, SessionService } from '@/auth/session';
import type { Principal } from '@/contracts/services';
import { AccountsService } from '@/services/accounts';
import { closeDatabaseClients } from '@/db/client';
import { resetServerEnvForTests } from '@/server/env';
import {
  GET as listRecordsRoute,
  POST as createRecordRoute,
} from '@/app/api/v1/foundation/records/route';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const schema = 'test_prompt04';
const secret = 'test-only-auth-signing-secret-with-at-least-32-bytes';
const bootstrapKey = 'test-only-owner-bootstrap-key';
const seededOwnerId = '10000000-0000-4000-8000-000000000001';
// Kunci publik RSA format asli (bukan mock 'test-key'): bootstrapOwner
// memvalidasi panjang PEM 80–1000, dan device crypto memakainya nyata.
const testDevicePublicKey = `-----BEGIN RSA PUBLIC KEY-----
MIGJAoGBAMtCV2cB4qpR3rt2I8HSFx2L/6OmoXicn3lCpKqW1EWOXpkdooGvuFyY
pbRbN/WGpS/JHyvja+n+M79QFr19Wcuk7dGxQxEGvOteyNbNHGNfFoylUY3WOhbb
XvoAAHG8pf4/Pfn54eshSGrDWtVaJUO0uUCrC+h+ezRVRPjePOpjAgMBAAE=
-----END RSA PUBLIC KEY-----`;
let clock = new Date('2026-09-08T16:30:00.000Z');
const now = () => new Date(clock);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 12,
  application_name: 'prompt04-integration-test',
});
const accounts = new AccountsService(
  pool,
  schema,
  secret,
  now,
  () => '123456',
  sha256(bootstrapKey),
);
const sessions = new SessionService(pool, schema, secret, now);

let owner: Principal;
let ownerSession: Awaited<ReturnType<AccountsService['ownerLogin']>>;
let member: Principal;
let memberId: string;

beforeAll(async () => {
  await resetSchema();
  await pool.query(
    `INSERT INTO "${schema}".principals
       (id, business_code, kind, role, approval_status, entitlement_status,
        social_status, display_name, is_test)
     VALUES ($1, 'TEST_OWNER', 'OWNER', 'OWNER', 'APPROVED', 'NONE',
             'ENABLED', 'Pemilik Uji TEST', true)`,
    [seededOwnerId],
  );
  const bootstrap = await accounts.bootstrapOwner({
    bootstrapKey,
    username: 'owner.local',
    email: 'owner@example.test',
    password: 'Admin-Aman-2026!',
    deviceLabel: 'test-device', publicKeyPem: testDevicePublicKey, fixture: true,
  });
  if (bootstrap.id !== seededOwnerId) throw new Error('Fixture Admin tidak diadopsi');
  const ownerRow = await principalById(bootstrap.id);
  owner = toPrincipal(ownerRow);
  ownerSession = await loginOwner();
});

afterAll(async () => {
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [
    schema,
  ]);
  await cleanup.end();
});

describe.sequential('Prompt 04 REAL_LOCAL dan SIMULASI terbatas', () => {
  it('bootstrap Admin memerlukan kunci lokal, email, perangkat aktif, dan sesi audience terpisah', async () => {
    expect(owner.id).toBe(seededOwnerId);
    await expect(
      new AccountsService(
        pool,
        schema,
        secret,
        now,
        () => '123456',
        sha256('wrong'),
      ).bootstrapOwner({
        bootstrapKey,
        username: 'owner.dua',
        email: 'owner2@example.test',
        password: 'Admin-Dua-2026!', deviceLabel: 'test-device', publicKeyPem: 'test-key',
      }),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED' });
    const authenticated = await sessions.authenticateAccess(ownerSession.accessToken, 'OWNER');
    expect(authenticated.principal.role).toBe('OWNER');
    await expect(
      sessions.authenticateAccess(ownerSession.accessToken, 'MEMBER'),
    ).rejects.toMatchObject({
      code: 'AUTHENTICATION_REQUIRED',
    });
    await expect(
      sessions.assertCsrf(authenticated.sessionId, 'wrong', 'wrong'),
    ).rejects.toMatchObject({
      code: 'ACCESS_DENIED',
    });
    await expect(
      sessions.assertCsrf(authenticated.sessionId, ownerSession.csrfToken, ownerSession.csrfToken),
    ).resolves.toBeUndefined();
  });

  it('registrasi memvalidasi data, memverifikasi minimal satu kontak, lalu menunggu Admin', async () => {
    const registration = await accounts.register({
      fullName: 'Anggota Dewasa TEST',
      username: 'anggota.test',
      email: 'member@example.test',
      phone: '+6281234567890',
      password: 'Member-Aman-2026!',
      gender: 'PEREMPUAN',
      birthDate: '1997-09-08',
      city: 'Bandung TEST',
      educationStatus: 'ALUMNI',
      fixture: true,
    });
    memberId = registration.registrationId;
    expect(registration).toMatchObject({
      status: 'VERIFICATION_REQUIRED',
      transportMode: 'LOCAL_INBOX',
    });
    let row = await principalById(memberId);
    expect(row).toMatchObject({ approval_status: 'PENDING', contact_verified_at: null });
    await expect(accounts.approveRegistration(owner, memberId, true)).rejects.toMatchObject({
      code: 'ACCESS_DENIED',
    });
    await accounts.verifyContact({
      challengeId: registration.verificationChallengeId,
      code: '123456',
    });
    row = await principalById(memberId);
    expect(row.contact_verified_at).toBeInstanceOf(Date);
    expect(row.approval_status).toBe('PENDING');
    expect(await accounts.approveRegistration(owner, memberId, true)).toMatchObject({
      status: 'APPROVED',
    });
    member = toPrincipal(await principalById(memberId));
  });

  it('login tiga identifier anti-enumerasi dan akun pending tidak memperoleh policy aktif', async () => {
    for (const identifier of ['anggota.test', 'member@example.test', '+6281234567890']) {
      const result = await accounts.login({ identifier, password: 'Member-Aman-2026!' });
      expect(result.status).toBe('AUTHENTICATED');
    }
    let badPassword: unknown;
    let unknownAccount: unknown;
    try {
      await accounts.login({ identifier: 'anggota.test', password: 'Salah-Aman-2026!' });
    } catch (error) {
      badPassword = error;
    }
    try {
      await accounts.login({ identifier: 'tidak.ada', password: 'Salah-Aman-2026!' });
    } catch (error) {
      unknownAccount = error;
    }
    expect(badPassword).toMatchObject({
      code: 'AUTHENTICATION_FAILED',
      message: 'Identifier atau password tidak valid',
    });
    expect(unknownAccount).toMatchObject({
      code: 'AUTHENTICATION_FAILED',
      message: 'Identifier atau password tidak valid',
    });

    const pending = await registerAndVerify('pending.test', 'pending@example.test', '1990-01-01');
    const pendingPrincipal = toPrincipal(await principalById(pending.registrationId));
    expect(pendingPrincipal.approvalStatus).toBe('PENDING');
    const pendingLogin = await accounts.login({
      identifier: 'pending.test',
      password: 'Member-Aman-2026!',
    });
    expect(pendingLogin.status).toBe('AUTHENTICATED');
    expect(pendingPrincipal.approvalStatus).not.toBe('APPROVED');
  });

  it('refresh diputar, reuse mencabut seluruh sesi, dan logout/revoke berlaku server-side', async () => {
    const initial = await sessions.create({ principal: member, audience: 'MEMBER' });
    await sessions.authenticateAccess(initial.accessToken, 'MEMBER');
    const rotated = await sessions.rotate(initial.refreshToken, 'MEMBER');
    expect(rotated.refreshToken).not.toBe(initial.refreshToken);
    expect((await sessions.authenticateAccess(rotated.accessToken, 'MEMBER')).principal.id).toBe(
      member.id,
    );
    await expect(sessions.rotate(initial.refreshToken, 'MEMBER')).rejects.toMatchObject({
      code: 'AUTHENTICATION_REQUIRED',
    });
    await expect(sessions.authenticateAccess(rotated.accessToken, 'MEMBER')).rejects.toMatchObject({
      code: 'AUTHENTICATION_REQUIRED',
    });
    const logout = await sessions.create({ principal: member, audience: 'MEMBER' });
    const logoutAuth = await sessions.authenticateAccess(logout.accessToken, 'MEMBER');
    await sessions.revokeSession(logoutAuth.sessionId, 'LOGOUT');
    await expect(sessions.authenticateAccess(logout.accessToken, 'MEMBER')).rejects.toMatchObject({
      code: 'AUTHENTICATION_REQUIRED',
    });
  });

  it('route fondasi memakai sesi server nyata, CSRF, dan tetap menolak akun pending', async () => {
    const previousClock = clock;
    clock = new Date();
    const routeSession = await sessions.create({ principal: member, audience: 'MEMBER' });
    const originalSchema = process.env.MADEVI_DB_SCHEMA;
    const originalSecret = process.env.AUTH_TOKEN_SECRET;
    process.env.MADEVI_DB_SCHEMA = schema;
    process.env.AUTH_TOKEN_SECRET = secret;
    resetServerEnvForTests();
    await closeDatabaseClients();
    try {
      const created = await createRecordRoute(
        new Request('http://localhost/api/v1/foundation/records', {
          method: 'POST',
          headers: {
            cookie: memberCookies(routeSession),
            'content-type': 'application/json',
            'idempotency-key': 'prompt04-route-record-001',
            'x-csrf-token': routeSession.csrfToken,
          },
          body: JSON.stringify({ label: 'Route sesi nyata TEST' }),
        }),
      );
      const createdBody = await created.clone().json();
      expect(created.status, JSON.stringify(createdBody)).toBe(201);
      const listed = await listRecordsRoute(
        new Request('http://localhost/api/v1/foundation/records', {
          headers: { cookie: memberCookies(routeSession) },
        }),
      );
      expect(listed.status).toBe(200);

      // Helper legacy yang dipakai route baca harus menanyakan sesi server,
      // bukan hanya mempercayai JWT yang masih bertanda tangan valid.
      expect(
        (
          await getSessionPrincipal(
            new Request('http://localhost/api/v1/articles', {
              headers: { cookie: memberCookies(routeSession) },
            }),
          )
        )?.id,
      ).toBe(member.id);
      const revoked = await sessions.authenticateAccess(routeSession.accessToken, 'MEMBER');
      await sessions.revokeSession(revoked.sessionId, 'TEST_REVOKED');
      await expect(
        getSessionPrincipal(
          new Request('http://localhost/api/v1/articles', {
            headers: { cookie: memberCookies(routeSession) },
          }),
        ),
      ).resolves.toBeNull();

      const pending = await registerAndVerify(
        'route.pending',
        'route-pending@example.test',
        '1990-01-01',
      );
      const pendingPrincipal = toPrincipal(await principalById(pending.registrationId));
      const pendingSession = await sessions.create({
        principal: pendingPrincipal,
        audience: 'MEMBER',
      });
      const denied = await listRecordsRoute(
        new Request('http://localhost/api/v1/foundation/records', {
          headers: { cookie: memberCookies(pendingSession) },
        }),
      );
      expect(denied.status).toBe(403);
    } finally {
      await closeDatabaseClients();
      if (originalSchema === undefined) delete process.env.MADEVI_DB_SCHEMA;
      else process.env.MADEVI_DB_SCHEMA = originalSchema;
      if (originalSecret === undefined) delete process.env.AUTH_TOKEN_SECRET;
      else process.env.AUTH_TOKEN_SECRET = originalSecret;
      clock = previousClock;
      resetServerEnvForTests();
    }
  });

  it('akun anak nyata tetap terkunci O-01 sedangkan fixture jelas SIMULASI', async () => {
    const realMinor = await registerAndVerify(
      'anak.real',
      'anak-real@example.test',
      '2012-01-01',
      false,
      'Banding tanpa wali untuk pembelajaran; bukan persetujuan aktivasi nyata.',
    );
    await expect(
      accounts.approveRegistration(owner, realMinor.registrationId, true),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED', message: expect.stringContaining('O-01') });

    const minorFixture = await registerAndVerify(
      'anak.fixture',
      'anak-fixture@example.test',
      '2012-01-01',
      true,
      'Alasan belajar fixture yang cukup panjang untuk simulasi tanpa data anak nyata.',
    );
    expect(await accounts.approveRegistration(owner, minorFixture.registrationId, true)).toEqual({
      status: 'APPROVED',
      minorSimulation: true,
    });
    const guardian = await pool.query(
      `SELECT review_status, purge_after FROM "${schema}".guardian_submissions
        WHERE principal_id = $1`,
      [minorFixture.registrationId],
    );
    expect(guardian.rows[0]).toMatchObject({
      review_status: 'SIMULATION_ONLY',
      purge_after: expect.any(Date),
    });
  });

  it('approval tidak memulai trial dan consent paralel memulai tepat sekali selama 30 hari', async () => {
    const before = await principalById(memberId);
    expect(before.trial_started_at).toBeNull();
    const [first, second] = await Promise.all([
      accounts.startTrial(member, 'terms-2026-09'),
      accounts.startTrial(member, 'terms-2026-09'),
    ]);
    expect(first).toEqual(second);
    expect(first).toMatchObject({ status: 'TRIAL', label: 'Free — 5 eksekusi Tools' });
    const consent = await pool.query(
      `SELECT count(*)::int AS count FROM "${schema}".terms_consents WHERE principal_id = $1`,
      [memberId],
    );
    expect(consent.rows[0].count).toBe(1);
    const started = await principalById(memberId);
    expect(started.trial_expires_at.getTime() - started.trial_started_at.getTime()).toBe(
      30 * 24 * 60 * 60_000,
    );
    clock = new Date(started.trial_expires_at.getTime() + 1);
    expect(await accounts.startTrial(member, 'terms-2026-09')).toMatchObject({
      status: 'RESTRICTED',
      socialAccess: true,
      memberArticleAccess: false,
    });
  });

  it('profil publik minimal dan profil privat memisahkan kontak serta data lahir', async () => {
    const publicProfile = await accounts.publicProfile('ANGGOTA.TEST');
    expect(publicProfile).toEqual({
      name: 'Anggota Dewasa TEST',
      username: 'anggota.test',
      description: '',
      avatarObjectId: null,
    });
    expect(publicProfile).not.toHaveProperty('email');
    const privateProfile = await accounts.privateProfile(member);
    expect(privateProfile).toMatchObject({
      email: 'member@example.test',
      phone: '+6281234567890',
      birth_date: expect.any(Date),
      access: { status: 'RESTRICTED', label: 'Akses Dibatasi' },
    });
  });

  it('profil dapat diubah, banding tercatat, ganti kontak memerlukan re-auth, dan ganti password mencabut sesi', async () => {
    expect(await accounts.updateProfile(member, { description: 'Deskripsi publik TEST' })).toMatchObject({
      profile_description: 'Deskripsi publik TEST',
    });
    const appeal = await accounts.submitAppeal(
      member,
      'REGISTRATION',
      'Alasan banding fiktif yang cukup panjang untuk pengujian.',
    );
    expect(appeal).toMatchObject({ status: 'PENDING', mode: 'LOCAL_QUEUE' });
    await expect(
      accounts.requestContactChange(member, {
        kind: 'EMAIL',
        value: 'member-new@example.test',
        password: 'password-salah',
      }),
    ).rejects.toMatchObject({ code: 'AUTHENTICATION_FAILED' });
    const activeBeforeContact = await sessions.create({ principal: member, audience: 'MEMBER' });
    const contact = await accounts.requestContactChange(member, {
      kind: 'EMAIL',
      value: 'member-new@example.test',
      password: 'Member-Aman-2026!',
    });
    await accounts.verifyContact({ challengeId: contact.challengeId, code: '123456' });
    expect((await accounts.privateProfile(member)).email).toBe('member-new@example.test');
    await expect(
      sessions.authenticateAccess(activeBeforeContact.accessToken, 'MEMBER'),
    ).rejects.toMatchObject({ code: 'AUTHENTICATION_REQUIRED' });

    const activeBeforePassword = await sessions.create({ principal: member, audience: 'MEMBER' });
    await accounts.changePassword(member, 'Member-Aman-2026!', 'Member-Baru-2026!');
    await expect(
      sessions.authenticateAccess(activeBeforePassword.accessToken, 'MEMBER'),
    ).rejects.toMatchObject({ code: 'AUTHENTICATION_REQUIRED' });
    await expect(
      accounts.login({ identifier: 'anggota.test', password: 'Member-Aman-2026!' }),
    ).rejects.toMatchObject({ code: 'AUTHENTICATION_FAILED' });
    expect(
      await accounts.login({ identifier: 'anggota.test', password: 'Member-Baru-2026!' }),
    ).toMatchObject({ status: 'AUTHENTICATED' });
  });

  it('2FA email opsional menahan sesi login dan recovery tidak dapat bypass dengan data diri', async () => {
    const enable = await accounts.enableEmailMfa(member);
    await accounts.confirmEmailMfa(member, enable.challengeId, '123456');
    const login = await accounts.login({
      identifier: 'anggota.test',
      password: 'Member-Baru-2026!',
    });
    expect(login).toMatchObject({ status: 'MFA_REQUIRED', transportMode: 'LOCAL_INBOX' });
    if (login.status !== 'MFA_REQUIRED') throw new Error('MFA challenge tidak dibuat');
    const session = await accounts.verifyLoginMfa({
      challengeId: login.challengeId,
      code: '123456',
    });
    expect((await sessions.authenticateAccess(session.accessToken, 'MEMBER')).principal.id).toBe(
      member.id,
    );

    const genericExisting = await accounts.requestRecovery('anggota.test');
    const genericMissing = await accounts.requestRecovery('akun.tidak.ada');
    expect(genericExisting).toEqual(genericMissing);
    const recovery = await pool.query(
      `SELECT id FROM "${schema}".recovery_cases
        WHERE principal_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [member.id],
    );
    await expect(
      accounts.verifyRecoveryProof(owner, recovery.rows[0].id, 'BIOGRAPHICAL_ONLY'),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED' });
    await expect(
      accounts.verifyRecoveryProof(owner, recovery.rows[0].id, 'VERIFIED_CONTACT'),
    ).resolves.toEqual({ status: 'PROOF_VERIFIED' });
  });

  it('ekspor hanya Admin-approved, bertoken singkat, sekali ambil, dan hanya oleh pemilik', async () => {
    const requested = await accounts.requestDataAction(member, 'EXPORT');
    const approved = await accounts.approveDataAction(owner, requested.requestId);
    expect(approved.status).toBe('AVAILABLE');
    if (approved.status !== 'AVAILABLE') throw new Error('Ekspor tidak tersedia');
    const other = toPrincipal(
      await principalById(
        (await registerAndVerify('other.test', 'other@example.test', '1992-01-01')).registrationId,
      ),
    );
    await expect(
      accounts.downloadExport(other, requested.requestId, approved.downloadToken),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    const data = await accounts.downloadExport(member, requested.requestId, approved.downloadToken);
    expect(data.account).toMatchObject({ id: member.id });
    await expect(
      accounts.downloadExport(member, requested.requestId, approved.downloadToken),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('hapus akun menjadwalkan purge 30 hari dan langsung mencabut sesi', async () => {
    const target = await registerAndVerify('delete.test', 'delete@example.test', '1988-01-01');
    await accounts.approveRegistration(owner, target.registrationId, true);
    const targetPrincipal = toPrincipal(await principalById(target.registrationId));
    const targetSession = await sessions.create({ principal: targetPrincipal, audience: 'MEMBER' });
    const requested = await accounts.requestDataAction(targetPrincipal, 'DELETE');
    const approved = await accounts.approveDataAction(owner, requested.requestId);
    expect(approved.status).toBe('SCHEDULED');
    if (approved.status !== 'SCHEDULED') throw new Error('Hapus tidak terjadwal');
    expect(new Date(approved.purgeAt).getTime() - clock.getTime()).toBe(30 * 24 * 60 * 60_000);
    await expect(
      sessions.authenticateAccess(targetSession.accessToken, 'MEMBER'),
    ).rejects.toMatchObject({
      code: 'AUTHENTICATION_REQUIRED',
    });
  });

  it('inbox memisahkan akses pengirim dan Admin serta perangkat yang dicabut mematikan sesi Admin', async () => {
    ownerSession = await loginOwner();
    const sent = await accounts.submitOwnerInbox({
      principal: member,
      kind: 'REPORT',
      subject: 'Laporan fixture',
      body: 'Isi laporan fiktif tanpa data pribadi.',
    });
    expect((await accounts.getOwnInboxItem(member, sent.inboxItemId)).id).toBe(sent.inboxItemId);
    const other = toPrincipal(
      await principalById(
        (await registerAndVerify('inbox.other', 'inbox-other@example.test', '1991-01-01'))
          .registrationId,
      ),
    );
    await expect(accounts.getOwnInboxItem(other, sent.inboxItemId)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    expect(
      (await accounts.listOwnerInbox(owner)).some((item) => item.id === sent.inboxItemId),
    ).toBe(true);
    const auth = await sessions.authenticateAccess(ownerSession.accessToken, 'OWNER');
    await accounts.revokeOwnerDevice(owner, auth.ownerDeviceId!);
    await expect(
      sessions.authenticateAccess(ownerSession.accessToken, 'OWNER'),
    ).rejects.toMatchObject({
      code: 'AUTHENTICATION_REQUIRED',
    });
  });
});

async function registerAndVerify(
  username: string,
  email: string,
  birthDate: string,
  fixture = true,
  noGuardianReason?: string,
) {
  const registration = await accounts.register({
    fullName: `${username} TEST`,
    username,
    email,
    password: 'Member-Aman-2026!',
    gender: 'LAINNYA',
    birthDate,
    city: 'Kota TEST',
    educationStatus: 'TIDAK_BERSEKOLAH',
    fixture,
    noGuardianReason,
  });
  await accounts.verifyContact({
    challengeId: registration.verificationChallengeId,
    code: '123456',
  });
  return registration;
}

async function loginOwner() {
  return accounts.ownerLogin({
    identifier: 'owner@example.test',
    password: 'Admin-Aman-2026!',
  });
}

async function principalById(id: string) {
  const result = await pool.query(`SELECT * FROM "${schema}".principals WHERE id = $1`, [id]);
  if (!result.rows[0]) throw new Error('Fixture principal hilang');
  return result.rows[0];
}

function toPrincipal(row: Record<string, unknown>): Principal {
  return {
    id: row.id as string,
    role: row.role as 'OWNER' | 'MEMBER',
    approvalStatus: row.approval_status as Principal['approvalStatus'],
    entitlementStatus: row.entitlement_status as Principal['entitlementStatus'],
    socialStatus: row.social_status as Principal['socialStatus'],
    fixture: row.is_test as boolean,
  };
}

function memberCookies(bundle: Awaited<ReturnType<SessionService['create']>>) {
  return [
    `madevi_access=${encodeURIComponent(bundle.accessToken)}`,
    `madevi_refresh=${encodeURIComponent(bundle.refreshToken)}`,
    `madevi_csrf=${encodeURIComponent(bundle.csrfToken)}`,
  ].join('; ');
}

async function resetSchema() {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [schema]);
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(process.execPath, ['scripts/migrate.mjs', 'up', '--schema', schema], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
}

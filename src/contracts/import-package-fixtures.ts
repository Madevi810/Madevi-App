/**
 * P18 — fixture paket contoh (SYNTHETIC) + verifikasi statis.
 *
 * P18 Lulus: "paket contoh valid/invalid dapat dibedakan secara statis."
 *
 * PENTING — ini BUKAN taxonomy nyata:
 *   Nama/slug di sini adalah placeholder umum ("contoh-akar", "contoh-daun")
 *   yang sengaja dipilih agar TIDAK bisa disalahbaca sebagai keputusan
 *   taxonomy final. Taxonomy final datang dari paket Menu/Artikel tervalidasi
 *   (P27); engine ini (P18) hanya memvalidasi bentuk, bukan menciptakan
 *   isi (09: P08–P13 tidak boleh mengarang taxonomy).
 *
 * Setiap fixture INVALID mematahkan SATU aturan spesifik agar sumber
 * penolakan dapat dilacak persis (P18: paket gagal tetap terisolasi).
 * Urutan pengecekan validator dirancang agar finding pertama = finding
 * yang diharapkan (lihat komentar di import-package.ts).
 */

import {
  type ImportPackage,
  inspectPackage,
  type PackageInspection,
  type ValidationStage,
} from './import-package';

/* ------------------------------------------------------------------ */
/* Fixture VALID — lulus semua tahap                                   */
/* ------------------------------------------------------------------ */

const ROOT_ID = '00000000-0000-4000-8000-000000000010';
const CABANG_ID = '00000000-0000-4000-8000-000000000011';
const DAUN_ID = '00000000-0000-4000-8000-000000000012';
const CABANG_DUA_ID = '00000000-0000-4000-8000-000000000013';

export const VALID_PACKAGE: ImportPackage = {
  manifest: {
    packageId: '00000000-0000-4000-8000-000000000001',
    version: '1.0.0',
    source: 'Menu/contoh-sintetis/v1',
    createdAt: '2026-09-20T08:00:00.000Z',
    checksum: 'a'.repeat(64),
  },
  menu: [
    {
      id: ROOT_ID,
      parentId: null,
      level: 'R',
      localCode: 'R-CONTOH',
      name: 'Contoh Akar',
      slug: 'contoh-akar',
      sortOrder: 0,
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      sourceRef: 'Menu/contoh-sintetis/r.md:1',
      targetPath: '/contoh-akar',
    },
    {
      id: CABANG_ID,
      parentId: ROOT_ID,
      level: 'D',
      localCode: 'D-CONTOH-01',
      name: 'Contoh Cabang',
      slug: 'contoh-cabang',
      sortOrder: 0,
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      sourceRef: 'Menu/contoh-sintetis/d.md:2',
      targetPath: '/contoh-akar/contoh-cabang',
    },
    {
      id: DAUN_ID,
      parentId: CABANG_ID,
      level: 'K',
      localCode: 'K-CONTOH-01',
      name: 'Contoh Daun',
      slug: 'contoh-daun',
      sortOrder: 1,
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      sourceRef: 'Menu/contoh-sintetis/k.md:3',
      targetPath: '/contoh-akar/contoh-cabang/contoh-daun',
    },
    // Sibling kedua di bawah root — diperlukan agar fixture slug/sortOrder
    // duplikat bisa mengisolasi SATU sebab (sibling = satu ruang lingkup).
    {
      id: CABANG_DUA_ID,
      parentId: ROOT_ID,
      level: 'D',
      localCode: 'D-CONTOH-02',
      name: 'Contoh Cabang Dua',
      slug: 'contoh-cabang-dua',
      sortOrder: 1,
      visibility: 'PUBLIC',
      status: 'ACTIVE',
      sourceRef: 'Menu/contoh-sintetis/d2.md:4',
      targetPath: '/contoh-akar/contoh-cabang-dua',
    },
  ],
  articles: [
    {
      id: '00000000-0000-4000-8000-000000000020',
      nodeId: DAUN_ID,
      language: 'id',
      version: 1,
      status: 'PUBLISHED',
      title: 'Contoh Artikel Sintetis',
      sources: ['Menu/Artikel/contoh/sumber.md'],
      internalLinks: ['/contoh-akar/contoh-cabang/contoh-daun'],
      checksum: 'b'.repeat(64),
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Fixture INVALID — masing-masing mematahkan satu aturan              */
/* ------------------------------------------------------------------ */

/** Salin valid lalu ubah satu hal (isolation: satu sebab per fixture). */
function clone(pkg: ImportPackage): ImportPackage {
  return JSON.parse(JSON.stringify(pkg)) as ImportPackage;
}

const node = (pkg: ImportPackage, id: string) => pkg.menu.find((n) => n.id === id)!;

const INVALID_BAD_UUID = clone(VALID_PACKAGE);
node(INVALID_BAD_UUID, CABANG_ID).id = 'bukan-uuid';

const INVALID_PARENT_MISSING = clone(VALID_PACKAGE);
node(INVALID_PARENT_MISSING, DAUN_ID).parentId = '11111111-1111-4111-8111-111111111111';

// Cycle: root (R) menjadi anak cabang (D) yang sebelumnya anaknya.
const INVALID_CYCLE = clone(VALID_PACKAGE);
node(INVALID_CYCLE, ROOT_ID).parentId = CABANG_ID;

// Level D di bawah parent D (harusnya K di bawah D).
const INVALID_KIND = clone(VALID_PACKAGE);
node(INVALID_KIND, DAUN_ID).level = 'D';

// Slug duplikat di sibling yang sama (kedua cabang di bawah root).
const INVALID_SLUG_DUP = clone(VALID_PACKAGE);
node(INVALID_SLUG_DUP, CABANG_DUA_ID).slug = 'contoh-cabang';
node(INVALID_SLUG_DUP, CABANG_DUA_ID).targetPath = '/contoh-akar/contoh-cabang';

// sortOrder duplikat pada sibling (kedua cabang order 0).
const INVALID_ORDER = clone(VALID_PACKAGE);
node(INVALID_ORDER, CABANG_DUA_ID).sortOrder = 0;

// targetPath tidak konsisten dengan pohon.
const INVALID_TARGET = clone(VALID_PACKAGE);
node(INVALID_TARGET, DAUN_ID).targetPath = '/jalur-salah';

// Credential/path lokal bocor di sumber artikel.
const INVALID_CREDENTIAL = clone(VALID_PACKAGE);
INVALID_CREDENTIAL.articles[0].sources.push('/home/user/.env');

// Artikel menempel ke node yang tidak ada di menu.
const INVALID_ARTICLE_NODE = clone(VALID_PACKAGE);
INVALID_ARTICLE_NODE.articles[0].nodeId = '22222222-2222-4222-8222-222222222222';

// Node ACTIVE di bawah parent ARCHIVED.
const INVALID_ARCHIVED_PARENT = clone(VALID_PACKAGE);
node(INVALID_ARCHIVED_PARENT, CABANG_ID).status = 'ARCHIVED';

// Checksum manifest bukan sha256.
const INVALID_CHECKSUM = clone(VALID_PACKAGE);
INVALID_CHECKSUM.manifest.checksum = 'bukan-sha256';

// Root tanpa parent tapi level bukan R.
const INVALID_ROOT_LEVEL = clone(VALID_PACKAGE);
node(INVALID_ROOT_LEVEL, ROOT_ID).level = 'D';

/**
 * Tabel verifikasi statis: setiap fixture → (valid?, stage pertama gagal,
 * kata kunci pesan). Ini adalah BUKTI STATIS bahwa validator membedakan
 * paket valid/invalid (P18 Lulus).
 *
 * Bila setiap baris cocok, engine bekerja. Bila ada yang tidak cocok,
 * validator salah — perbaiki validator, bukan fixture.
 */
export interface FixtureExpectation {
  name: string;
  package: unknown;
  expectedValid: boolean;
  /** Stage pertama yang seharusnya melaporkan (untuk yang invalid). */
  expectedStage: ValidationStage | null;
  /** Kata kunci pesan yang HARUS muncul (penyebab spesifik). */
  expectedMessageContains: string | null;
}

export const FIXTURE_EXPECTATIONS: FixtureExpectation[] = [
  {
    name: 'VALID_PACKAGE',
    package: VALID_PACKAGE,
    expectedValid: true,
    expectedStage: null,
    expectedMessageContains: null,
  },
  {
    name: 'INVALID_BAD_UUID',
    package: INVALID_BAD_UUID,
    expectedValid: false,
    expectedStage: 'schema',
    expectedMessageContains: 'id UUID',
  },
  {
    name: 'INVALID_PARENT_MISSING',
    package: INVALID_PARENT_MISSING,
    expectedValid: false,
    expectedStage: 'referential',
    expectedMessageContains: 'tidak ada di paket',
  },
  {
    name: 'INVALID_CYCLE',
    package: INVALID_CYCLE,
    expectedValid: false,
    expectedStage: 'referential',
    expectedMessageContains: 'Cycle',
  },
  {
    name: 'INVALID_KIND',
    package: INVALID_KIND,
    expectedValid: false,
    expectedStage: 'referential',
    expectedMessageContains: 'Level',
  },
  {
    name: 'INVALID_SLUG_DUP',
    package: INVALID_SLUG_DUP,
    expectedValid: false,
    expectedStage: 'semantic',
    expectedMessageContains: 'tidak unik',
  },
  {
    name: 'INVALID_ORDER',
    package: INVALID_ORDER,
    expectedValid: false,
    expectedStage: 'semantic',
    expectedMessageContains: 'tidak deterministik',
  },
  {
    name: 'INVALID_TARGET',
    package: INVALID_TARGET,
    expectedValid: false,
    expectedStage: 'semantic',
    expectedMessageContains: 'targetPath',
  },
  {
    name: 'INVALID_CREDENTIAL',
    package: INVALID_CREDENTIAL,
    expectedValid: false,
    expectedStage: 'semantic',
    expectedMessageContains: 'credential',
  },
  {
    name: 'INVALID_ARTICLE_NODE',
    package: INVALID_ARTICLE_NODE,
    expectedValid: false,
    expectedStage: 'referential',
    expectedMessageContains: 'tidak ada di menu',
  },
  {
    name: 'INVALID_ARCHIVED_PARENT',
    package: INVALID_ARCHIVED_PARENT,
    expectedValid: false,
    expectedStage: 'referential',
    expectedMessageContains: 'ARCHIVED',
  },
  {
    name: 'INVALID_CHECKSUM',
    package: INVALID_CHECKSUM,
    expectedValid: false,
    expectedStage: 'schema',
    expectedMessageContains: 'checksum',
  },
  {
    name: 'INVALID_ROOT_LEVEL',
    package: INVALID_ROOT_LEVEL,
    expectedValid: false,
    expectedStage: 'referential',
    expectedMessageContains: 'level R',
  },
];

/**
 * Jalankan verifikasi (pure; tidak ada DB/import/migrasi — P18 Batas aman).
 * Mengembalikan laporan baris-per-baris. Admin bisa panggil ini di tes statis
 * untuk membuktikan engine membedakan valid/invalid.
 */
export function verifyImportPackageFixtures(): Array<{
  name: string;
  ok: boolean;
  inspection: PackageInspection;
  mismatch: string | null;
}> {
  return FIXTURE_EXPECTATIONS.map((fixture) => {
    const inspection = inspectPackage(fixture.package);
    let mismatch: string | null = null;

    if (inspection.valid !== fixture.expectedValid) {
      mismatch = `valid=${inspection.valid} (expected ${fixture.expectedValid})`;
    } else if (!fixture.expectedValid) {
      const first = inspection.findings[0];
      if (!first) {
        mismatch = 'tidak ada finding padahal diharapkan invalid';
      } else {
        if (first.stage !== fixture.expectedStage)
          mismatch = `stage=${first.stage} (expected ${fixture.expectedStage})`;
        else if (
          fixture.expectedMessageContains &&
          !first.message.includes(fixture.expectedMessageContains)
        )
          mismatch = `message="${first.message}" tidak memuat "${fixture.expectedMessageContains}"`;
      }
    }

    return { name: fixture.name, ok: mismatch === null, inspection, mismatch };
  });
}

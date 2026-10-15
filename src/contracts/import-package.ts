/**
 * P18 — Mesin Impor Menu dan Artikel: kontrak paket + validator.
 *
 * Tahapan (P18): package → inspect → schema validate → referential validate
 *                 → semantic validate → stage → diff preview → promote
 *                 → audit → rollback pointer
 *
 * File ini berisi TIGA tahap validasi pertama yang murni (pure): tidak
 * butuh DB, tidak butuh runtime, tidak menjalankan import. Itu memenuhi
 * P18 Batas: "Agent menulis code/contract/fixture; tidak menjalankan
 * import, migrasi, atau seed."
 *
 * Tahapan stage/diff/promote/rollback sudah ada di TaxonomyService (revisi
 * staging + impact + history). Kontrak ini hanya memutuskan apakah sebuah
 * paket BOLEH masuk ke sana.
 *
 * Validasi referential & semantic memakai KONSISTENSI INTERNAL paket
 * (parent ada di dalam paket, tanpa cycle, node artikel ada di menu paket),
 * BUKAN taxonomy final — yang datang dari paket Menu/Artikel tervalidasi
 * (P27). Engine ini tidak menciptakan taxonomy (09), hanya memvalidasinya.
 */

/** Level kode pohon menu (harus cocok LEVEL_CHILDREN di services/taxonomy.ts). */
export const MENU_LEVEL_CHILDREN: Record<string, string[]> = {
  R: ['D'],
  D: ['K'],
  K: ['M'],
  M: ['SM', 'T'],
  SM: ['T'],
  T: ['ST', 'J'],
  ST: ['J'],
  J: [],
};

export const MENU_LEVELS = new Set(Object.keys(MENU_LEVEL_CHILDREN));

/** Status dan akses yang diizinkan. */
export const NODE_STATUS = new Set(['ACTIVE', 'ARCHIVED']);
export const NODE_VISIBILITY = new Set(['PUBLIC', 'PRIVATE']);
export const ARTICLE_STATUS = new Set(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export const ARTICLE_LANGUAGES = new Set(['id', 'en']);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Target akhir nyata: path URL absolut dibawah ruang, tidak protocol/host. */
const TARGET_PATH_RE = /^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
/**
 * P18: "tidak ada credential/path lokal." Pola yang ditolak di mana pun di
 * paket (sources, links, media manifest, metadata).
 */
const CREDENTIAL_LEAK_RE =
  /(?:^|[/\\])(?:\.env|\.env\.[a-z]+|id_rsa|id_ed25519|owner-bootstrap\.key|\.npmrc)(?:$|[/\\])|(?:api[_-]?key|secret|password|passwd|token)\s*[=:]\s*['"]?[a-z0-9_\-]{8,}/i;
const ABSOLUTE_LOCAL_PATH_RE = /^(?:[a-z]:[\\/]|\/(?:usr|etc|var|root|home|sdcard|proc|sys)\b)/i;

/* ------------------------------------------------------------------ */
/* Bentuk paket                                                        */
/* ------------------------------------------------------------------ */

export interface MenuNodeImport {
  /** ID unik & stabil (P18: "ID unik/stabil"). */
  id: string;
  parentId: string | null;
  level: string;
  localCode: string;
  name: string;
  slug: string;
  sortOrder: number;
  visibility: 'PUBLIC' | 'PRIVATE';
  status: 'ACTIVE' | 'ARCHIVED';
  /** P18: "sourceRef dapat dilacak". */
  sourceRef: string;
  /** P18: "target akhir nyata". */
  targetPath: string;
}

export interface MediaManifestEntry {
  path: string;
  sha256: string;
  sizeBytes: number;
}

export interface ArticleImport {
  /** P18: "ID permanen". */
  id: string;
  /** Node menu yang artikel ini tempel (referential). */
  nodeId: string;
  language: 'id' | 'en';
  version: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  title: string;
  /** P18: "minimal sumber sesuai kebijakan". */
  sources: string[];
  internalLinks: string[];
  mediaManifest?: MediaManifestEntry[];
  checksum: string;
}

export interface ImportPackageManifest {
  packageId: string;
  version: string;
  /** Asal folder Menu/Artikel (tidak dibaca runtime langsung — P18 Target). */
  source: string;
  createdAt: string;
  /** P18: "checksum". sha256 payload (menu+articles). */
  checksum: string;
}

export interface ImportPackage {
  manifest: ImportPackageManifest;
  menu: MenuNodeImport[];
  articles: ArticleImport[];
}

/* ------------------------------------------------------------------ */
/* Hasil validasi                                                      */
/* ------------------------------------------------------------------ */

export type ValidationStage = 'schema' | 'referential' | 'semantic';

export interface ValidationFinding {
  stage: ValidationStage;
  /** Path ke field bermasalah, mis. `menu[2].slug`. */
  path: string;
  message: string;
}

export interface PackageInspection {
  /** True hanya bila SEMUA tahap lulus. */
  valid: boolean;
  menuNodeCount: number;
  articleCount: number;
  rootCount: number;
  maxDepth: number;
  findings: ValidationFinding[];
  /** Ringkasan untuk diff preview (P18: dampak sebelum promote). */
  summary: {
    newNodes: number;
    archivedNodes: number;
    publishedArticles: number;
    draftArticles: number;
    mediaFiles: number;
  };
}

/* ------------------------------------------------------------------ */
/* Validator murni                                                     */
/* ------------------------------------------------------------------ */

function uuid(value: string): boolean {
  return UUID_RE.test(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Tahap 1 — SCHEMA: field presence, tipe, enum, format.
 * Tidak melihat relasi antar item (itu tahap 2).
 */
export function validatePackageSchema(pkg: unknown): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  if (!isObject(pkg)) return [{ stage: 'schema', path: 'root', message: 'Paket bukan objek' }];

  const { manifest, menu, articles } = pkg as Partial<ImportPackage>;

  // --- manifest
  if (!isObject(manifest)) {
    findings.push({ stage: 'schema', path: 'manifest', message: 'Manifest wajib berupa objek' });
  } else {
    const m = manifest as Partial<ImportPackageManifest>;
    if (!m.packageId || typeof m.packageId !== 'string')
      findings.push({ stage: 'schema', path: 'manifest.packageId', message: 'packageId wajib' });
    if (!m.version || typeof m.version !== 'string')
      findings.push({ stage: 'schema', path: 'manifest.version', message: 'version wajib' });
    if (!m.source || typeof m.source !== 'string')
      findings.push({ stage: 'schema', path: 'manifest.source', message: 'source wajib' });
    if (typeof m.createdAt !== 'string' || Number.isNaN(Date.parse(m.createdAt)))
      findings.push({
        stage: 'schema',
        path: 'manifest.createdAt',
        message: 'createdAt ISO wajib',
      });
    if (typeof m.checksum !== 'string' || !/^[0-9a-f]{64}$/i.test(m.checksum))
      findings.push({
        stage: 'schema',
        path: 'manifest.checksum',
        message: 'checksum sha256 wajib',
      });
  }

  // --- menu
  if (!Array.isArray(menu)) {
    findings.push({ stage: 'schema', path: 'menu', message: 'menu wajib array' });
  } else {
    menu.forEach((node, i) => {
      const p = `menu[${i}]`;
      if (!isObject(node)) {
        findings.push({ stage: 'schema', path: p, message: 'Node menu bukan objek' });
        return;
      }
      const n = node as Partial<MenuNodeImport>;
      if (!uuid(n.id ?? ''))
        findings.push({ stage: 'schema', path: `${p}.id`, message: 'id UUID wajib & stabil' });
      if (n.parentId !== null && typeof n.parentId === 'string' && !uuid(n.parentId))
        findings.push({
          stage: 'schema',
          path: `${p}.parentId`,
          message: 'parentId UUID atau null',
        });
      if (!MENU_LEVELS.has(n.level ?? ''))
        findings.push({
          stage: 'schema',
          path: `${p}.level`,
          message: `level tidak dikenal: ${n.level}`,
        });
      if (!n.localCode || typeof n.localCode !== 'string')
        findings.push({ stage: 'schema', path: `${p}.localCode`, message: 'localCode wajib' });
      if (!n.name || typeof n.name !== 'string' || n.name.trim().length < 1)
        findings.push({ stage: 'schema', path: `${p}.name`, message: 'name wajib' });
      if (typeof n.slug !== 'string' || !SLUG_RE.test(n.slug) || n.slug.length > 240)
        findings.push({ stage: 'schema', path: `${p}.slug`, message: 'slug tidak aman' });
      if (typeof n.sortOrder !== 'number' || !Number.isInteger(n.sortOrder) || n.sortOrder < 0)
        findings.push({
          stage: 'schema',
          path: `${p}.sortOrder`,
          message: 'sortOrder integer >= 0',
        });
      if (!NODE_VISIBILITY.has(n.visibility ?? ''))
        findings.push({
          stage: 'schema',
          path: `${p}.visibility`,
          message: 'visibility PUBLIC|PRIVATE',
        });
      if (!NODE_STATUS.has(n.status ?? ''))
        findings.push({ stage: 'schema', path: `${p}.status`, message: 'status ACTIVE|ARCHIVED' });
      if (typeof n.sourceRef !== 'string' || !n.sourceRef.trim())
        findings.push({
          stage: 'schema',
          path: `${p}.sourceRef`,
          message: 'sourceRef wajib dapat dilacak',
        });
      if (typeof n.targetPath !== 'string' || !TARGET_PATH_RE.test(n.targetPath))
        findings.push({
          stage: 'schema',
          path: `${p}.targetPath`,
          message: 'targetPath path URL absolut wajib',
        });
    });
  }

  // --- articles
  if (!Array.isArray(articles)) {
    findings.push({ stage: 'schema', path: 'articles', message: 'articles wajib array' });
  } else {
    articles.forEach((article, i) => {
      const p = `articles[${i}]`;
      if (!isObject(article)) {
        findings.push({ stage: 'schema', path: p, message: 'Artikel bukan objek' });
        return;
      }
      const a = article as Partial<ArticleImport>;
      if (!uuid(a.id ?? ''))
        findings.push({ stage: 'schema', path: `${p}.id`, message: 'id UUID permanen wajib' });
      if (typeof a.nodeId !== 'string' || !uuid(a.nodeId))
        findings.push({ stage: 'schema', path: `${p}.nodeId`, message: 'nodeId UUID wajib' });
      if (!ARTICLE_LANGUAGES.has(a.language ?? ''))
        findings.push({ stage: 'schema', path: `${p}.language`, message: 'language id|en' });
      if (typeof a.version !== 'number' || a.version < 1)
        findings.push({ stage: 'schema', path: `${p}.version`, message: 'version >= 1' });
      if (!ARTICLE_STATUS.has(a.status ?? ''))
        findings.push({
          stage: 'schema',
          path: `${p}.status`,
          message: 'status DRAFT|PUBLISHED|ARCHIVED',
        });
      if (!a.title || typeof a.title !== 'string')
        findings.push({ stage: 'schema', path: `${p}.title`, message: 'title wajib' });
      if (!Array.isArray(a.sources) || a.sources.length < 1)
        findings.push({
          stage: 'schema',
          path: `${p}.sources`,
          message: 'minimal 1 sumber sesuai kebijakan',
        });
      if (!Array.isArray(a.internalLinks))
        findings.push({
          stage: 'schema',
          path: `${p}.internalLinks`,
          message: 'internalLinks array',
        });
      if (typeof a.checksum !== 'string' || !/^[0-9a-f]{64}$/i.test(a.checksum))
        findings.push({ stage: 'schema', path: `${p}.checksum`, message: 'checksum sha256 wajib' });
      if (a.mediaManifest !== undefined && !Array.isArray(a.mediaManifest))
        findings.push({
          stage: 'schema',
          path: `${p}.mediaManifest`,
          message: 'mediaManifest array',
        });
    });
  }

  return findings;
}

/**
 * Tahap 2 — REFERENTIAL: parent ada, tidak cycle/orphan, kind sesuai parent,
 * node artikel ada di menu. (P18 Validasi Menu + Artikel.)
 *
 * Menggunakan konsistensi INTERNAL paket + status promote (node ARCHIVED
 * tidak boleh punya anak ACTIVE).
 */
export function validatePackageReferential(pkg: ImportPackage): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const byId = new Map(pkg.menu.map((n) => [n.id, n]));
  const childrenOf = new Map<string, MenuNodeImport[]>();
  for (const n of pkg.menu) {
    if (n.parentId === null) continue;
    const list = childrenOf.get(n.parentId) ?? [];
    list.push(n);
    childrenOf.set(n.parentId, list);
  }

  // P18: "ID unik" — duplikat di dalam paket.
  const seen = new Set<string>();
  for (const n of pkg.menu) {
    if (seen.has(n.id))
      findings.push({ stage: 'referential', path: `menu:${n.id}`, message: 'ID node duplikat' });
    seen.add(n.id);
  }

  // P18: "tidak ada cycle/orphan". Cycle dideteksi SEBELUM pengecekan level:
  // setiap cycle pasti melanggar hierarki level juga, jadi kalau level
  // diperiksa lebih dulu, pesan cycle tidak akan pernah muncul sebagai
  // penyebab pertama (mengaburkan isolasi penyebab).
  for (const n of pkg.menu) {
    const chain = new Set<string>();
    let current: MenuNodeImport | undefined = n;
    let guard = 0;
    while (current && current.parentId !== null && guard++ < 64) {
      if (chain.has(current.id)) {
        findings.push({
          stage: 'referential',
          path: `menu:${current.id}.parentId`,
          message: 'Cycle terdeteksi di pohon menu',
        });
        break;
      }
      chain.add(current.id);
      current = byId.get(current.parentId);
      // Parent hilang = orphan (ditangani di bawah); hentikan agar tidak loop.
      if (current === undefined) break;
    }
  }

  for (const n of pkg.menu) {
    // P18: "parent ada".
    if (n.parentId !== null && !byId.has(n.parentId)) {
      findings.push({
        stage: 'referential',
        path: `menu:${n.id}.parentId`,
        message: `Parent ${n.parentId} tidak ada di paket`,
      });
      continue;
    }
    // P18: "kind sesuai parent" — level anak harus cocok hierarki.
    const parent = n.parentId === null ? null : byId.get(n.parentId)!;
    if (parent) {
      const allowed = MENU_LEVEL_CHILDREN[parent.level] ?? [];
      if (!allowed.includes(n.level))
        findings.push({
          stage: 'referential',
          path: `menu:${n.id}.level`,
          message: `Level ${n.level} tidak sah di bawah parent ${parent.level}`,
        });
      // Node ARCHIVED tidak boleh jadi parent ACTIVE (struktur aktif bocor).
      if (parent.status === 'ARCHIVED' && n.status === 'ACTIVE')
        findings.push({
          stage: 'referential',
          path: `menu:${n.id}.status`,
          message: 'Node ACTIVE tidak boleh di bawah parent ARCHIVED',
        });
    } else if (n.level !== 'R') {
      findings.push({
        stage: 'referential',
        path: `menu:${n.id}.level`,
        message: 'Node tanpa parent (root) harus level R',
      });
    }
  }

  // P18 Validasi Artikel: "node menu valid".
  for (const a of pkg.articles) {
    if (!byId.has(a.nodeId))
      findings.push({
        stage: 'referential',
        path: `articles:${a.id}.nodeId`,
        message: `Node ${a.nodeId} tidak ada di menu paket`,
      });
  }

  return findings;
}

/**
 * Tahap 3 — SEMANTIC: slug unik dalam scope, urutan deterministik, target
 * akhir nyata konsisten, media manifest aman, tanpa credential/path lokal.
 */
export function validatePackageSemantic(pkg: ImportPackage): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  // P18: "slug unik dalam scope" — per parent (sibling) dan global path.
  const slugByParent = new Map<string, Set<string>>();
  for (const n of pkg.menu) {
    const key = n.parentId ?? '__root__';
    const set = slugByParent.get(key) ?? new Set<string>();
    if (set.has(n.slug))
      findings.push({
        stage: 'semantic',
        path: `menu:${n.id}.slug`,
        message: `Slug "${n.slug}" tidak unik di bawah parent yang sama`,
      });
    set.add(n.slug);
    slugByParent.set(key, set);
  }

  // P18: "urutan deterministik" — sortOrder boleh sama, tapi pasangan
  // (parentId, sortOrder) harus unik agar hasil import dapat diulang.
  const orderKeys = new Set<string>();
  for (const n of pkg.menu) {
    const key = `${n.parentId ?? 'root'}:${n.sortOrder}`;
    if (orderKeys.has(key))
      findings.push({
        stage: 'semantic',
        path: `menu:${n.id}.sortOrder`,
        message: 'sortOrder duplikat pada sibling — urutan tidak deterministik',
      });
    orderKeys.add(key);
  }

  // P18: "target akhir nyata" — targetPath harus konsisten dengan path pohon.
  for (const n of pkg.menu) {
    const expected = computeTargetPath(pkg, n);
    if (expected !== null && n.targetPath !== expected)
      findings.push({
        stage: 'semantic',
        path: `menu:${n.id}.targetPath`,
        message: `targetPath "${n.targetPath}" harusnya "${expected}"`,
      });
  }

  // P18 Validasi Artikel: media manifest aman + tanpa credential.
  for (const a of pkg.articles) {
    const leak = [...a.sources, ...a.internalLinks].find((v) => leaksCredentialOrPath(v));
    if (leak)
      findings.push({
        stage: 'semantic',
        path: `articles:${a.id}`,
        message: `Terdapat credential/path lokal terlarang: ${leak}`,
      });
    if (a.mediaManifest) {
      for (const m of a.mediaManifest) {
        if (!/^[0-9a-f]{64}$/i.test(m.sha256))
          findings.push({
            stage: 'semantic',
            path: `articles:${a.id}.mediaManifest`,
            message: 'sha256 media tidak valid',
          });
        if (leaksCredentialOrPath(m.path))
          findings.push({
            stage: 'semantic',
            path: `articles:${a.id}.mediaManifest.path`,
            message: 'Path media terlarang (credential/path lokal)',
          });
        if (!Number.isInteger(m.sizeBytes) || m.sizeBytes < 0)
          findings.push({
            stage: 'semantic',
            path: `articles:${a.id}.mediaManifest.sizeBytes`,
            message: 'sizeBytes integer >= 0',
          });
      }
    }
  }

  return findings;
}

/** Bangun target path yang diharapkan dari pohon (R/D/.../slug). */
function computeTargetPath(pkg: ImportPackage, node: MenuNodeImport): string | null {
  const byId = new Map(pkg.menu.map((n) => [n.id, n]));
  const segments: string[] = [];
  let current: MenuNodeImport | undefined = node;
  let guard = 0;
  while (current && guard++ < 32) {
    segments.unshift(current.slug);
    current = current.parentId === null ? undefined : byId.get(current.parentId);
  }
  return segments.length ? `/${segments.join('/')}` : null;
}

/** P18: deteksi credential / path lokal mutlak di nilai string apapun. */
export function leaksCredentialOrPath(value: string): boolean {
  return CREDENTIAL_LEAK_RE.test(value) || ABSOLUTE_LOCAL_PATH_RE.test(value);
}

/* ------------------------------------------------------------------ */
/* inspect: gabungan 3 tahap + ringkasan (P18 "inspect" & "diff preview") */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* L08 — Rilis paket Menu pilot Explore (satu PACKAGE_KIND = MENU)      */
/* ------------------------------------------------------------------ */

/**
 * L08 (paket `madevi-explore-pilot-v1` v1.0.0):
 * - Manifest rilis memakai bentuk Menu kanonis (nodes/relations/assets/
 *   dependencies/approval/rollback), BUKAN bentuk lama berisi path file.
 * - `nodes[].id` adalah SOURCE KEY fixture (mis. `a000...`), BUKAN UUID
 *   database. UUID staging/final dibuat server saat stage/promote dan hanya
 *   tercatat di snapshot hasil — tidak pernah diklaim sebelumnya.
 * - Root pilot `jelajahi-pengetahuan` dinormalisasi ke root existing
 *   `space-explore` (`/ruang/jelajahi-pengetahuan`). Validator ini tidak
 *   mengubah kontrak navigasi `MADEVI_SPACES`; perubahan ruang resmi dikelola
 *   secara terpisah oleh kontrak navigasi.
 */

export const PILOT_PACKAGE_ID = 'madevi-explore-pilot-v1';
export const PILOT_PACKAGE_VERSION = '1.0.0';
export const PILOT_ROOT_SLUG = 'jelajahi-pengetahuan';
export const PILOT_ROOT_HREF = '/ruang/jelajahi-pengetahuan';
export const SPACE_EXPLORE_ID = 'space-explore';

const HEX64_RE = /^[0-9a-f]{64}$/i;
/** Checksum template kosong yang tidak boleh lolos sebagai bukti. */
const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

export interface PilotReleaseNode {
  /** SOURCE KEY fixture — bukan UUID database. */
  id: string;
  parentId: string | null;
  level: string;
  slug: string;
  name: string;
  sortOrder: number;
  status: 'ACTIVE' | 'ARCHIVED';
  accessLevel: 'PUBLIC';
  /** Path hasil normalisasi root Explore. */
  routeHref: string;
  route?: { href: string };
  sourceRef: string;
}

export interface PilotReleaseManifest {
  packageId: string;
  schemaVersion: string;
  kind: 'MENU';
  version: string;
  status: string;
  accessLevel: 'PUBLIC';
  sourceRef: string;
  licenseRef: string;
  checksum: string;
  rollbackReference: string;
  approvedBy: string;
  approvedAt: string;
}

export interface PilotReleasePackage {
  manifest: PilotReleaseManifest;
  nodes: PilotReleaseNode[];
  relations: Array<{ sourceId: string; targetId: string; type: string }>;
  assets: Array<{ path: string; sha256: string }>;
  dependencies: Record<string, string>;
  unresolvedDependencies: string[];
  changelog: string[];
  validation: { validatorVersion: string; reportChecksum: string };
  approval: { approvedBy: string; approvedAt: string };
  rollback: { strategy: string; snapshotRef: string };
}

export interface ReleaseFinding {
  rule: string;
  message: string;
}

/**
 * Validasi rilis pilot (murni, tanpa DB):
 * - Menolak node kosong, approval/dependency/snapshot kosong, checksum template.
 * - Menolak root yang bukan ekstensi `space-explore` (setiap path hasil harus
 *   berada di `/ruang/jelajahi-pengetahuan/...` atau persis root-nya).
 * - Menolak route luar ruang, query/host, traversal, atau root lain.
 */
export function validatePilotRelease(pkg: unknown): ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];
  if (typeof pkg !== 'object' || pkg === null || Array.isArray(pkg)) {
    return [{ rule: 'PACKAGE_SHAPE', message: 'Paket rilis bukan objek' }];
  }
  const p = pkg as Partial<PilotReleasePackage>;
  const m = p.manifest;
  if (typeof m !== 'object' || m === null) {
    return [{ rule: 'MANIFEST_SHAPE', message: 'Manifest wajib objek' }];
  }
  if (m.packageId !== PILOT_PACKAGE_ID)
    findings.push({ rule: 'PACKAGE_ID', message: `packageId harus ${PILOT_PACKAGE_ID}` });
  if (m.kind !== 'MENU') findings.push({ rule: 'PACKAGE_KIND', message: 'kind harus MENU' });
  if (m.version !== PILOT_PACKAGE_VERSION)
    findings.push({ rule: 'PACKAGE_VERSION', message: `version harus ${PILOT_PACKAGE_VERSION}` });
  if (!m.schemaVersion || typeof m.schemaVersion !== 'string')
    findings.push({ rule: 'SCHEMA_VERSION', message: 'schemaVersion wajib' });
  if (!['ADMIN_REVIEW', 'SIAP-INTEGRASI'].includes(m.status ?? ''))
    findings.push({
      rule: 'MANIFEST_STATUS',
      message: 'status rilis harus ADMIN_REVIEW atau SIAP-INTEGRASI',
    });
  if (m.accessLevel !== 'PUBLIC')
    findings.push({ rule: 'ACCESS_LEVEL', message: 'accessLevel pilot harus PUBLIC' });
  if (!m.sourceRef || !m.licenseRef || !m.rollbackReference)
    findings.push({
      rule: 'MANIFEST_REFS',
      message: 'sourceRef/licenseRef/rollbackReference wajib',
    });
  if (typeof m.checksum !== 'string' || !HEX64_RE.test(m.checksum))
    findings.push({ rule: 'CHECKSUM_FORMAT', message: 'checksum sha256 wajib' });
  else if (m.checksum.toLowerCase() === EMPTY_SHA256)
    findings.push({ rule: 'CHECKSUM_TEMPLATE', message: 'checksum template kosong ditolak' });
  if (m.status === 'SIAP-INTEGRASI') {
    if (!m.approvedBy || !m.approvedAt || Number.isNaN(Date.parse(m.approvedAt)))
      findings.push({
        rule: 'APPROVAL_EMPTY',
        message: 'SIAP-INTEGRASI wajib approvedBy/approvedAt',
      });
    if (p.approval?.approvedBy !== m.approvedBy || p.approval?.approvedAt !== m.approvedAt) {
      findings.push({ rule: 'APPROVAL_MISMATCH', message: 'approval harus cocok dengan manifest' });
    }
    if (!Array.isArray(p.unresolvedDependencies))
      findings.push({ rule: 'DEPENDENCY_FIELD', message: 'unresolvedDependencies wajib array' });
    else if (p.unresolvedDependencies.length > 0)
      findings.push({
        rule: 'UNRESOLVED_DEPENDENCIES',
        message: `Masih ada dependency: ${p.unresolvedDependencies.slice(0, 5).join(', ')}`,
      });
    if (
      !p.rollback?.snapshotRef ||
      /\b(?:pending|todo|tbd)\b/i.test(p.rollback.snapshotRef) ||
      /\b(?:pending|todo|tbd)\b/i.test(m.rollbackReference)
    ) {
      findings.push({
        rule: 'ROLLBACK_PENDING',
        message: 'SIAP-INTEGRASI wajib memiliki referensi snapshot rollback non-pending',
      });
    }
  }

  const nodes = Array.isArray(p.nodes) ? p.nodes : null;
  if (!nodes || nodes.length === 0) {
    findings.push({ rule: 'NODES_EMPTY', message: 'nodes rilis kosong' });
    return findings;
  }
  const ids = new Set<string>();
  const byId = new Map<string, PilotReleaseNode>();
  for (const [i, n] of nodes.entries()) {
    const path = `nodes[${i}]`;
    if (typeof n.id !== 'string' || !n.id)
      findings.push({ rule: 'NODE_ID', message: `${path}.id wajib (source key)` });
    else if (ids.has(n.id))
      findings.push({ rule: 'DUPLICATE_ID', message: `${path}.id duplikat: ${n.id}` });
    else ids.add(n.id);
    if (n.parentId !== null && typeof n.parentId !== 'string')
      findings.push({ rule: 'NODE_PARENT', message: `${path}.parentId harus string atau null` });
    if (typeof n.slug !== 'string' || !SLUG_RE.test(n.slug))
      findings.push({ rule: 'NODE_SLUG', message: `${path}.slug tidak aman` });
    if (!MENU_LEVELS.has(n.level ?? ''))
      findings.push({ rule: 'NODE_LEVEL', message: `${path}.level tidak dikenal` });
    if (typeof n.name !== 'string' || n.name.trim().length === 0)
      findings.push({ rule: 'NODE_NAME', message: `${path}.name wajib` });
    if (!Number.isSafeInteger(n.sortOrder) || n.sortOrder < 0)
      findings.push({ rule: 'NODE_SORT', message: `${path}.sortOrder tidak valid` });
    if (n.status !== 'ACTIVE')
      findings.push({ rule: 'NODE_STATUS', message: `${path}.status harus ACTIVE` });
    if (n.accessLevel !== 'PUBLIC')
      findings.push({ rule: 'NODE_ACCESS', message: `${path} harus PUBLIC` });
    const routeCheck = checkPilotRoute(n.routeHref ?? n.route?.href);
    if (!routeCheck.ok)
      findings.push({ rule: 'NODE_ROUTE', message: `${path}: ${routeCheck.reason}` });
    if (typeof n.id === 'string' && n.id) byId.set(n.id, n);
  }
  for (const n of nodes) {
    if (n.parentId !== null) {
      const parent = byId.get(n.parentId);
      if (!parent) {
        findings.push({
          rule: 'ORPHAN_PARENT',
          message: `Parent ${n.parentId} tidak ada di paket`,
        });
      } else if (!MENU_LEVEL_CHILDREN[parent.level]?.includes(n.level)) {
        findings.push({
          rule: 'LEVEL_PARENT',
          message: `Level ${n.level} tidak sah di bawah ${parent.level}`,
        });
      }
    }
  }
  const roots = nodes.filter((n) => n.parentId === null);
  if (roots.length !== 1 || roots[0]?.level !== 'R' || roots[0]?.slug !== PILOT_ROOT_SLUG) {
    findings.push({ rule: 'PILOT_ROOT', message: 'Wajib tepat satu root R jelajahi-pengetahuan' });
  }
  if (!Array.isArray(p.relations) || p.relations.length !== nodes.length - 1) {
    findings.push({
      rule: 'RELATION_COUNT',
      message: 'Relation PARENT_OF harus satu untuk setiap child',
    });
  } else {
    for (const relation of p.relations) {
      if (
        relation.type !== 'PARENT_OF' ||
        !ids.has(relation.sourceId) ||
        !ids.has(relation.targetId) ||
        byId.get(relation.targetId)?.parentId !== relation.sourceId
      ) {
        findings.push({
          rule: 'RELATION_PARENT',
          message: 'Relation PARENT_OF tidak cocok dengan parentId',
        });
        break;
      }
    }
  }
  if (!Array.isArray(p.assets))
    findings.push({ rule: 'ASSETS_FIELD', message: 'assets wajib array' });
  if (!p.dependencies || typeof p.dependencies !== 'object' || Array.isArray(p.dependencies)) {
    findings.push({ rule: 'DEPENDENCIES_FIELD', message: 'dependencies wajib object' });
  }
  if (!p.rollback?.strategy || !p.rollback.snapshotRef) {
    findings.push({ rule: 'ROLLBACK_SNAPSHOT', message: 'rollback strategy/snapshotRef wajib' });
  }
  return findings;
}

/**
 * Hash rilis L08 yang dapat diperiksa tanpa database. Nilainya identik dengan
 * validator Menu offline: hanya payload yang dipromosikan (nodes, relations,
 * assets), bukan field approval/snapshot yang berubah sepanjang review.
 */
export async function validatePilotReleaseChecksum(pkg: unknown): Promise<ReleaseFinding[]> {
  if (typeof pkg !== 'object' || pkg === null || Array.isArray(pkg)) {
    return [{ rule: 'PACKAGE_SHAPE', message: 'Paket rilis bukan objek' }];
  }
  const p = pkg as Partial<PilotReleasePackage>;
  const manifest = p.manifest;
  if (!manifest || typeof manifest.checksum !== 'string') {
    return [{ rule: 'CHECKSUM_FORMAT', message: 'checksum manifest wajib' }];
  }
  const actual = await checksumPayload(
    canonicalStringify({
      nodes: p.nodes ?? [],
      relations: p.relations ?? [],
      assets: p.assets ?? [],
    }),
  );
  const findings: ReleaseFinding[] = [];
  if (manifest.checksum.toLowerCase() !== actual) {
    findings.push({
      rule: 'CHECKSUM_MISMATCH',
      message: 'checksum manifest tidak cocok dengan payload',
    });
  }
  if (p.validation?.reportChecksum !== actual) {
    findings.push({
      rule: 'VALIDATION_CHECKSUM_MISMATCH',
      message: 'reportChecksum tidak cocok dengan payload',
    });
  }
  return findings;
}

export interface PilotRouteCheck {
  ok: boolean;
  reason?: string;
}

/**
 * Route hasil normalisasi wajib berasal dari root Explore:
 * persis `/ruang/jelajahi-pengetahuan` atau di bawahnya. Menolak query,
 * host, traversal (`..`), backslash, spasi, dan root lain.
 */
export function checkPilotRoute(href: unknown): PilotRouteCheck {
  if (typeof href !== 'string' || !href) return { ok: false, reason: 'routeHref wajib string' };
  if (!href.startsWith('/')) return { ok: false, reason: 'harus path relatif absolut (/...)' };
  if (href.startsWith('//')) return { ok: false, reason: 'host tersembunyi ditolak' };
  if (/^[a-z]+:/i.test(href)) return { ok: false, reason: 'skema URL ditolak' };
  if (href.includes('?') || href.includes('#')) return { ok: false, reason: 'query/hash ditolak' };
  if (href.includes('..') || href.includes('\\') || href.includes(' '))
    return { ok: false, reason: 'traversal/karakter ilegal ditolak' };
  if (!/^\/[a-z0-9/_.-]*$/i.test(href)) return { ok: false, reason: 'karakter path ilegal' };
  if (href !== PILOT_ROOT_HREF && !href.startsWith(`${PILOT_ROOT_HREF}/`))
    return { ok: false, reason: `harus di dalam ${PILOT_ROOT_HREF}` };
  return { ok: true };
}

/** Checksum sha256 hex dari serialisasi kanonis (key terurut). */
export async function checksumPayload(canonicalText: string): Promise<string> {
  const { createHash } = await import('node:crypto');
  return createHash('sha256').update(canonicalText, 'utf8').digest('hex');
}

export function canonicalStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalStringify).join(',')}]`;
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${canonicalStringify((value as Record<string, unknown>)[k])}`)
    .join(',')}}`;
}

/* ---------------- Diff & snapshot ---------------- */

export type PackageDiffAction = 'ADD' | 'UPDATE' | 'ARCHIVE' | 'CONFLICT';

export interface PackageDiffItem {
  /** Source key fixture — UUID final hanya ada di snapshot stage/promote. */
  sourceNodeKey: string;
  action: PackageDiffAction;
  detail: string;
}

export interface PackageDiff {
  packageId: string;
  version: string;
  baseRevision: number;
  items: PackageDiffItem[];
  /** Nol perubahan pada root global selain ekstensi Explore. */
  otherRootsChanged: number;
}

export interface StageSnapshot {
  packageId: string;
  version: string;
  /** Revision staging yang dibuat (bukan revision aktif). */
  stagingRevisionId: string;
  stagingRevisionNumber: number;
  /** Revision ACTIVE yang dipertahankan untuk rollback pra-promote. */
  baseRevisionId: string;
  baseRevision: number;
  /** Mapping sourceNodeKey → UUID staging (dibuat server). */
  mapping: Record<string, string>;
  createdAt: string;
  /** True untuk re-import identik yang tidak membuat revision baru. */
  alreadyPromoted?: boolean;
}

export interface PromoteResult {
  packageId: string;
  version: string;
  activeRevision: number;
  /** Mapping sourceNodeKey → UUID final. */
  mapping: Record<string, string>;
}

/* ------------------------------------------------------------------ */
/* inspect: gabungan 3 tahap + ringkasan (P18 "inspect" & "diff preview") */
/* ------------------------------------------------------------------ */

export function inspectPackage(pkgRaw: unknown): PackageInspection {
  const schemaFindings = validatePackageSchema(pkgRaw);
  // Bila schema gagal, tahap 2/3 tidak aman (bentuk data tak terjamin).
  if (schemaFindings.length > 0) {
    return {
      valid: false,
      menuNodeCount: 0,
      articleCount: 0,
      rootCount: 0,
      maxDepth: 0,
      findings: schemaFindings,
      summary: {
        newNodes: 0,
        archivedNodes: 0,
        publishedArticles: 0,
        draftArticles: 0,
        mediaFiles: 0,
      },
    };
  }

  const pkg = pkgRaw as ImportPackage;
  const referentialFindings = validatePackageReferential(pkg);
  const semanticFindings = validatePackageSemantic(pkg);
  const findings = [...schemaFindings, ...referentialFindings, ...semanticFindings];

  const byId = new Map(pkg.menu.map((n) => [n.id, n]));
  const rootCount = pkg.menu.filter((n) => n.parentId === null).length;

  let maxDepth = 0;
  for (const n of pkg.menu) {
    let depth = 1;
    let current: MenuNodeImport | undefined = n;
    let guard = 0;
    while (current?.parentId !== null && current !== undefined && guard++ < 32) {
      current = byId.get(current.parentId as string);
      depth++;
    }
    maxDepth = Math.max(maxDepth, depth);
  }

  return {
    valid: findings.length === 0,
    menuNodeCount: pkg.menu.length,
    articleCount: pkg.articles.length,
    rootCount,
    maxDepth,
    findings,
    summary: {
      newNodes: pkg.menu.filter((n) => n.status === 'ACTIVE').length,
      archivedNodes: pkg.menu.filter((n) => n.status === 'ARCHIVED').length,
      publishedArticles: pkg.articles.filter((a) => a.status === 'PUBLISHED').length,
      draftArticles: pkg.articles.filter((a) => a.status === 'DRAFT').length,
      mediaFiles: pkg.articles.reduce((sum, a) => sum + (a.mediaManifest?.length ?? 0), 0),
    },
  };
}

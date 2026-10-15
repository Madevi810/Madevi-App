import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const TAXONOMY_LEVELS = ['R', 'D', 'K', 'M', 'SM', 'T', 'ST', 'J'];

/** Kode ruang legacy R1–R5 berdasarkan slug kanonis (lihat roomSlug di bawah). */
export const ROOM_CODE_BY_SLUG = {
  'pendidikan-dan-pembelajaran': 'R1',
  'jelajahi-pengetahuan': 'R2',
  'agama-dan-kepercayaan': 'R3',
  'negara-sejarah-hukum-dan-masyarakat': 'R4',
  'alat-perangkat-dan-software': 'R5',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const ARCHITECTURE_FILES = [
  'R1-Pendidikan-dan-Pembelajaran/Arsitektur_R1.txt',
  'R2-Jelajahi-Pengetahuan/Arsitektur_R2.txt',
  'R3-Agama-dan-Kepercayaan/Arsitektur_R3.txt',
  'R4-Negara-Sejarah-Hukum-dan-Masyarakat/Arsitektur_R4.txt',
  'R5-Alat-Perangkat-dan-Software/Arsitektur_R5.txt',
];

const ALLOWED_CHILDREN = {
  R: new Set(['D']),
  D: new Set(['K']),
  K: new Set(['M']),
  M: new Set(['SM', 'T']),
  SM: new Set(['T']),
  T: new Set(['ST', 'J']),
  ST: new Set(['J']),
  J: new Set(),
};

export function readTaxonomySources(menuRoot) {
  const sources = ARCHITECTURE_FILES.map((relativePath) => {
    const absolutePath = path.join(menuRoot, relativePath);
    return parseArchitecture(fs.readFileSync(absolutePath, 'utf8'), relativePath);
  });
  const nodes = sources.flatMap((source) => source.nodes);
  const pathCodes = uniqueValues(nodes, (node) => node.pathCode, 'kode jalur lintas sumber');
  const pathSlugs = uniqueValues(nodes, (node) => node.pathSlug, 'slug jalur lintas sumber');
  void pathCodes;
  void pathSlugs;
  const sourceManifest = sources.map(({ relativePath, sha256, counts, nodes: sourceNodes }) => ({
    relativePath,
    sha256,
    nodeCount: sourceNodes.length,
    counts,
  }));
  return {
    nodes,
    sourceManifest,
    sourceHash: hashCanonical(
      sourceManifest.map(({ relativePath, sha256 }) => ({ relativePath, sha256 })),
    ),
  };
}

export function parseArchitecture(text, relativePath = 'Arsitektur.txt') {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const nodes = [];
  const stack = [];
  const siblingKeys = new Set();
  const declaredCounts = {};
  let rootSeen = false;

  for (const [index, rawLine] of lines.entries()) {
    const lineNumber = index + 1;
    const countMatch = rawLine.match(/^- (?:[^()]+) \((R|D|K|M|SM|T|ST|J)\): (\d+)$/);
    if (countMatch) declaredCounts[countMatch[1]] = Number(countMatch[2]);

    const rootMatch = rawLine.match(/^(R[1-5]) \| (.+)$/);
    if (rootMatch) {
      if (rootSeen) sourceError(relativePath, lineNumber, 'root R ganda');
      const localCode = rootMatch[1];
      const name = cleanName(rootMatch[2]).name;
      const slug = roomSlug(localCode, name);
      const node = makeNode({
        relativePath,
        lineNumber,
        depth: 0,
        level: 'R',
        localCode,
        name,
        slug,
        sourceVirtualPath: null,
        parent: null,
        sortOrder: Number(localCode.slice(1)) - 1,
        emptyMarker: null,
      });
      nodes.push(node);
      stack[0] = node;
      rootSeen = true;
      continue;
    }

    const connectorAt = Math.max(rawLine.indexOf('├── '), rawLine.indexOf('└── '));
    if (connectorAt < 0) continue;
    if (connectorAt % 4 !== 0)
      sourceError(relativePath, lineNumber, 'indentasi bukan kelipatan empat');
    const prefix = rawLine.slice(0, connectorAt);
    if (!/^(?:│   |    )*$/.test(prefix))
      sourceError(relativePath, lineNumber, 'karakter pohon tidak dikenal');
    const content = rawLine.slice(connectorAt + 4);
    const match = content.match(
      /^(SM|ST|R|D|K|M|T|J)([1-9][0-9]*) \| (.+?)(?:\s{2}\((\.\/[^)]+)\))$/,
    );
    if (!match) sourceError(relativePath, lineNumber, 'baris node tidak sesuai format');
    const depth = connectorAt / 4 + 1;
    const parent = stack[depth - 1];
    if (!parent || depth < 1) sourceError(relativePath, lineNumber, 'parent tidak ditemukan');
    const level = match[1];
    if (!ALLOWED_CHILDREN[parent.level].has(level)) {
      sourceError(relativePath, lineNumber, `level ${level} tidak sah di bawah ${parent.level}`);
    }
    const sourceVirtualPath = match[4];
    validateVirtualPath(sourceVirtualPath, relativePath, lineNumber);
    const cleaned = cleanName(match[3]);
    const localCode = `${level}${match[2]}`;
    const slug = slugify(cleaned.name);
    const siblingKey = `${parent.pathCode}\0${localCode}\0${slug}`;
    if (siblingKeys.has(siblingKey))
      sourceError(relativePath, lineNumber, 'kode atau slug sibling ganda');
    siblingKeys.add(siblingKey);
    const sortOrder = nodes.filter((node) => node.parentSourceKey === parent.sourceKey).length;
    const node = makeNode({
      relativePath,
      lineNumber,
      depth,
      level,
      localCode,
      name: cleaned.name,
      slug,
      sourceVirtualPath,
      parent,
      sortOrder,
      emptyMarker: cleaned.emptyMarker,
    });
    nodes.push(node);
    stack[depth] = node;
    stack.length = depth + 1;
  }

  if (!rootSeen) sourceError(relativePath, 1, 'root R tidak ditemukan');
  for (const level of TAXONOMY_LEVELS) {
    const actual = nodes.filter((node) => node.level === level).length;
    if (level !== 'R' && declaredCounts[level] !== undefined && declaredCounts[level] !== actual) {
      sourceError(
        relativePath,
        1,
        `statistik ${level} ${declaredCounts[level]} tidak cocok dengan ${actual}`,
      );
    }
  }
  return {
    relativePath,
    sha256: crypto.createHash('sha256').update(text).digest('hex'),
    counts: Object.fromEntries(
      TAXONOMY_LEVELS.map((level) => [level, nodes.filter((n) => n.level === level).length]),
    ),
    nodes,
  };
}

function makeNode(input) {
  const pathCode = input.parent ? `${input.parent.pathCode}.${input.localCode}` : input.localCode;
  const pathSlug = input.parent ? `${input.parent.pathSlug}/${input.slug}` : input.slug;
  const sourceKey = `${input.relativePath}:${pathCode}`;
  return {
    nodeId: deterministicUuid(sourceKey),
    parentId: input.parent?.nodeId ?? null,
    parentSourceKey: input.parent?.sourceKey ?? null,
    sourceKey,
    level: input.level,
    localCode: input.localCode,
    pathCode,
    name: input.name,
    slug: input.slug,
    pathSlug,
    sortOrder: input.sortOrder,
    visibility: 'PUBLIC',
    lifecycleStatus: 'ACTIVE',
    emptyMarker: input.emptyMarker,
    sourceFile: input.relativePath,
    sourceLine: input.lineNumber,
    sourceVirtualPath: input.sourceVirtualPath,
    metadata: { depth: input.depth },
  };
}

export function slugify(value) {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' dan ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  if (!slug || slug.length > 240)
    throw new Error(`Nama tidak dapat menjadi slug aman: ${value.slice(0, 80)}`);
  return slug;
}

function roomSlug(code, name) {
  const aliases = {
    R1: 'pendidikan-dan-pembelajaran',
    R2: 'jelajahi-pengetahuan',
    R3: 'agama-dan-kepercayaan',
    R4: 'negara-sejarah-hukum-dan-masyarakat',
    R5: 'alat-perangkat-dan-software',
  };
  return aliases[code] ?? slugify(name);
}

function cleanName(raw) {
  const marker = raw.match(/\s+\[(KOSONG|RENCANA-ARTIKEL)\]$/);
  return {
    name: (marker ? raw.slice(0, marker.index) : raw).trim(),
    emptyMarker: marker ? marker[1].replace('-', '_') : null,
  };
}

function validateVirtualPath(value, file, line) {
  if (
    !value.startsWith('./') ||
    value.includes('\\') ||
    value.split('/').includes('..') ||
    /[\0\r\n]/.test(value) ||
    !value.endsWith('.html')
  ) {
    sourceError(file, line, 'path virtual tidak aman');
  }
}

function uniqueValues(values, select, label) {
  const result = new Set();
  for (const value of values) {
    const selected = select(value);
    if (result.has(selected)) throw new Error(`${label} ganda: ${selected}`);
    result.add(selected);
  }
  return result;
}

export function deterministicUuid(value) {
  const bytes = Buffer.from(
    crypto.createHash('sha256').update(`madevi-taxonomy-v1\0${value}`).digest().subarray(0, 16),
  );
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function hashCanonical(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

/** Stringify kanonis dengan kunci terurut (identik dengan validator M08). */
export function canonicalStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalStringify(value[k])}`).join(',')}}`;
}

function packageError(packagePath, message) {
  throw new Error(`${packagePath}: ${message}`);
}

/**
 * Membaca paket domain JSON (database/seeds/taxonomy/packages/taxonomy/*.json, L08) menjadi node
 * taxonomy internal yang siap staging. Bentuk node sama dengan parser legacy
 * sehingga pipeline stage/promote tidak berubah.
 *
 * Aturan:
 * - checksum manifest diverifikasi terhadap konten (nodes/relations/assets);
 * - nodeId memakai UUID paket (stabil lintas staging);
 * - root R dipetakan ke kode legacy R1–R5 via slug (pilot Explore → R2);
 * - kode lokal anak = LEVEL + nomor urut sibling (D1, K1, …);
 * - relasi parent-first; parent hilang, level tak sah, atau slug kotor ditolak.
 */
export function readTaxonomyPackage(packagePath) {
  const absolutePath = path.resolve(packagePath);
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') packageError(absolutePath, 'paket tidak ditemukan');
    packageError(absolutePath, 'JSON paket tidak valid');
  }
  const manifest = pkg.manifest ?? {};
  const packageId = manifest.packageId;
  if (!packageId) packageError(absolutePath, 'manifest.packageId hilang');
  if (!Array.isArray(pkg.nodes) || pkg.nodes.length === 0)
    packageError(absolutePath, 'nodes paket kosong');
  const contentHash = crypto
    .createHash('sha256')
    .update(
      canonicalStringify({
        nodes: pkg.nodes ?? [],
        relations: pkg.relations ?? [],
        assets: pkg.assets ?? [],
      }),
      'utf8',
    )
    .digest('hex');
  if ((manifest.checksum ?? '').toLowerCase() !== contentHash)
    packageError(absolutePath, 'checksum manifest tidak cocok dengan konten');

  const seen = new Map();
  const siblingCount = new Map();
  const nodes = [];
  for (const [index, raw] of pkg.nodes.entries()) {
    const sourceLine = index + 1;
    if (!raw.id || !UUID_RE.test(raw.id))
      packageError(absolutePath, `node #${sourceLine} id UUID hilang`);
    if (seen.has(raw.id)) packageError(absolutePath, `node id ganda ${raw.id}`);
    if (!TAXONOMY_LEVELS.includes(raw.level))
      packageError(absolutePath, `node ${raw.id} level tak dikenal`);
    const name = (raw.name ?? raw.label ?? '').trim();
    if (!name || name.length > 500) packageError(absolutePath, `node ${raw.id} nama tak valid`);
    const slug = raw.slug ?? '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      packageError(absolutePath, `node ${raw.id} slug tak aman`);
    if (!Number.isSafeInteger(raw.sortOrder) || raw.sortOrder < 0)
      packageError(absolutePath, `node ${raw.id} sortOrder tak valid`);

    let parent = null;
    let localCode;
    if (raw.parentId === null || raw.parentId === undefined) {
      if (raw.level !== 'R') packageError(absolutePath, `node ${raw.id} root harus level R`);
      localCode = raw.rootCode ?? ROOM_CODE_BY_SLUG[slug];
      if (!/^R[1-5]$/.test(localCode ?? ''))
        packageError(absolutePath, `node ${raw.id} root tak terpetakan ke R1–R5`);
    } else {
      parent = seen.get(raw.parentId);
      if (!parent) packageError(absolutePath, `node ${raw.id} parent tidak ditemukan`);
      if (!ALLOWED_CHILDREN[parent.level].has(raw.level))
        packageError(absolutePath, `level ${raw.level} tidak sah di bawah ${parent.level}`);
      const key = parent.nodeId;
      const next = (siblingCount.get(key) ?? 0) + 1;
      siblingCount.set(key, next);
      localCode = `${raw.level}${next}`;
    }
    const pathCode = parent ? `${parent.pathCode}.${localCode}` : localCode;
    const pathSlug = parent ? `${parent.pathSlug}/${slug}` : slug;
    const sourceKey = `package:${packageId}:${raw.id}`;
    const node = {
      nodeId: raw.id,
      parentId: parent?.nodeId ?? null,
      parentSourceKey: parent?.sourceKey ?? null,
      sourceKey,
      level: raw.level,
      localCode,
      pathCode,
      name,
      slug,
      pathSlug,
      sortOrder: raw.sortOrder,
      visibility: 'PUBLIC',
      lifecycleStatus: 'ACTIVE',
      emptyMarker: null,
      sourceFile: path.basename(absolutePath),
      sourceLine,
      sourceVirtualPath: raw.route?.href ?? null,
      metadata: {
        packageId,
        packageVersion: manifest.version ?? null,
        kind: raw.kind ?? null,
        routeHref: raw.route?.href ?? null,
      },
    };
    seen.set(raw.id, node);
    nodes.push(node);
  }
  const roots = nodes.filter((node) => node.parentId === null);
  if (roots.length < 1) packageError(absolutePath, 'paket tanpa root R');
  return {
    nodes,
    sourceManifest: [
      {
        relativePath: path.basename(absolutePath),
        sha256: contentHash,
        nodeCount: nodes.length,
        packageId,
        packageVersion: manifest.version ?? null,
      },
    ],
    sourceHash: contentHash,
    packageId,
    rootCount: roots.length,
  };
}

function sourceError(file, line, message) {
  throw new Error(`${file}:${line}: ${message}`);
}

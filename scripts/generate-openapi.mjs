import fs from 'node:fs';
import path from 'node:path';

import { projectRoot } from './lib/config.mjs';

/**
 * Generator kontrak OpenAPI docs/openapi.json dari source route nyata (D12).
 * Jujur mesin-terbaca: path + method + query param ditemukan via pemindaian
 * `src/app/api/**\/route.ts`; kode respons disimpulkan dari kemampuan yang
 * terdeteksi per file (auth, CSRF, validasi JSON, idempotency, rate limit).
 * Tidak mengarang perilaku: tanpa bukti = tanpa klaim.
 */

const root = projectRoot(import.meta.url);
const apiRoot = path.join(root, 'src', 'app', 'api');
const outPath = path.join(root, 'docs', 'openapi.json');

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name === 'route.ts') files.push(full);
  }
  return files;
}

function docPath(file) {
  const rel = path.relative(apiRoot, path.dirname(file)).split(path.sep).join('/');
  // Kontrak memakai path relatif API (tanpa prefix /api/v1).
  const stripped = rel === 'v1' ? '/' : rel.replace(/^v1\//, '/');
  const direct = rel === 'v1' || rel.startsWith('v1/') ? stripped : `/api/${rel}`;
  return direct
    .replace(/\[\.\.\.(.+?)\]/g, '{$1}')
    .replace(/\[(.+?)\]/g, '{$1}');
}

function detectCapabilities(src) {
  return {
    auth: /authenticateRequest|getSessionPrincipal|requireOwner|requireMember/.test(src),
    csrf: /assertRequestCsrf|csrf/i.test(src),
    json: /parseJsonObject|await request\.json\(\)/.test(src),
    idempotency: /idempotency/i.test(src),
    rateLimit: /rateLimit|RateLimit|checkActionRateLimit|mutation-guard/.test(src),
    deferred: /Deferred\w+Adapter|DEPENDENCY_UNAVAILABLE/.test(src),
    created: /successResponse\([\s\S]{0,400}?status:\s*201/.test(src),
    notFound: /NOT_FOUND|notFound\(\)/.test(src),
  };
}

function queryParams(src) {
  const params = new Set();
  for (const match of src.matchAll(/searchParams\.get\('([^']+)'\)/g)) params.add(match[1]);
  return [...params].sort();
}

function responsesFor(method, caps, hasPathParam) {
  const responses = {};
  const ok = method === 'POST' && caps.created ? '201' : '200';
  responses[ok] = { description: 'Envelope sukses { data, requestId, page? }' };
  if (caps.json) {
    responses['400'] = { description: 'VALIDATION_FAILED' };
    responses['413'] = { description: 'PAYLOAD_TOO_LARGE' };
  }
  if (caps.auth) responses['401'] = { description: 'AUTHENTICATION_FAILED' };
  if (caps.csrf) responses['403'] = { description: 'ACCESS_DENIED / CSRF' };
  else if (caps.auth) responses['403'] = { description: 'ACCESS_DENIED' };
  if (hasPathParam || caps.notFound) responses['404'] = { description: 'NOT_FOUND' };
  if (caps.idempotency) responses['409'] = { description: 'IDEMPOTENCY_CONFLICT' };
  if (caps.rateLimit) responses['429'] = { description: 'RATE_LIMITED' };
  // Pemetaan transport global di errorResponse: ECONNREFUSED/ETIMEDOUT/
  // ECONNRESET/ENOTFOUND → 503 untuk SEMUA route.
  responses['503'] = { description: 'DEPENDENCY_UNAVAILABLE' };
  return responses;
}

const paths = {};
for (const file of walk(apiRoot).sort()) {
  const src = fs.readFileSync(file, 'utf8');
  const routePath = docPath(file);
  const hasPathParam = /\{.+?\}/.test(routePath);
  const caps = detectCapabilities(src);
  const query = queryParams(src);
  const methods = METHODS.filter((m) => new RegExp(`export async function ${m}\\b`).test(src));
  if (methods.length === 0) continue;
  paths[routePath] = paths[routePath] ?? {};
  for (const method of methods) {
    paths[routePath][method.toLowerCase()] = {
      summary: `${method} ${routePath}`,
      ...(query.length > 0
        ? {
            parameters: query.map((name) => ({
              name,
              in: 'query',
              required: false,
              schema: { type: 'string' },
            })),
          }
        : {}),
      responses: responsesFor(method, caps, hasPathParam),
    };
  }
}

const contract = {
  openapi: '3.1.0',
  info: { title: 'Madevi API', version: '0.5.0' },
  servers: [{ url: '/api/v1' }],
  paths,
  components: {
    securitySchemes: {
      memberAccessCookie: { type: 'apiKey', in: 'cookie', name: 'madevi_access' },
      ownerAccessCookie: { type: 'apiKey', in: 'cookie', name: 'madevi_admin_access' },
    },
  },
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(contract, null, 2)}\n`);
process.stdout.write(
  `${JSON.stringify({ ok: true, paths: Object.keys(paths).length, out: 'docs/openapi.json' })}\n`,
);

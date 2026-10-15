import { ApiError } from '@/api/errors';
import { guardMutation } from '@/api/mutation-guard';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import {
  canonicalStringify,
  checkPilotRoute,
  checksumPayload,
  PILOT_PACKAGE_ID,
  PILOT_PACKAGE_VERSION,
  validatePilotRelease,
  validatePilotReleaseChecksum,
} from '@/contracts/import-package';
import { getDatabaseClients } from '@/db/client';
import type { Principal } from '@/contracts/services';
import { requestIdFromHeaders } from '@/server/request-id';
import { TaxonomyService } from '@/services/taxonomy';

export const dynamic = 'force-dynamic';

/**
 * L08 — endpoint Owner untuk paket Menu pilot Explore v1.0.0.
 * `POST /api/v1/owner/taxonomy/packages/inspect|stage|promote|rollback`
 *
 * - Auth Owner + CSRF + guard terpusat (request ID, JSON bounded, validasi).
 * - Runtime tidak membaca folder paket: payload paket diterima inline di body
 *   (manifest + nodes) untuk inspect/stage; stage/promote/rollback memakai
 *   revision + snapshot, bukan path file.
 * - Hanya PACKAGE_KIND MENU, paket tunggal `madevi-explore-pilot-v1` v1.0.0.
 */
export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { action } = await params;
    if (!['inspect', 'stage', 'promote', 'rollback'].includes(action)) {
      throw new ApiError('NOT_FOUND', 'Aksi paket tidak dikenal');
    }
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    if (auth.principal.role !== 'OWNER') throw new ApiError('ACCESS_DENIED', 'Hanya Admin');
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');

    if (action === 'inspect') return inspect(request, requestId);
    const service = new TaxonomyService(getDatabaseClients().pool);
    if (action === 'stage') return stage(service, request, requestId, auth.principal);
    if (action === 'promote') return promote(service, request, requestId, auth.principal);
    return rollback(service, request, requestId, auth.principal);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** Inspect murni: validasi rilis + checksum payload yang dibaca. */
async function inspect(request: Request, requestId: string) {
  const guard = await guardMutation({
    request,
    requestId,
    maxBytes: 256 * 1024,
    validate: (body) => {
      if (typeof body !== 'object' || body === null || !('manifest' in body) || !('nodes' in body)) {
        throw new ApiError('VALIDATION_FAILED', 'Body harus {manifest, nodes, ...}');
      }
      return body as { manifest: unknown; nodes: unknown };
    },
  });
  const v = guard.validated as Record<string, unknown>;
  const findings = [
    ...validatePilotRelease(v),
    ...(await validatePilotReleaseChecksum(v)),
  ];
  const checksum = await checksumPayload(
    canonicalStringify({ nodes: v.nodes ?? [], relations: v.relations ?? [], assets: v.assets ?? [] }),
  );
  return successResponse({ valid: findings.length === 0, findings, checksum }, requestId);
}

/** Stage: paket → revision STAGING + mapping sourceKey → UUID server. */
async function stage(
  service: TaxonomyService,
  request: Request,
  requestId: string,
  principal: Principal,
) {
  const guard = await guardMutation({
    request,
    requestId,
    maxBytes: 256 * 1024,
    validate: (body) => {
      const b = body as Record<string, unknown>;
      const pkg = b.package as Record<string, unknown> | undefined;
      const expectedBaseRevision = b.expectedBaseRevision;
      if (!pkg || typeof pkg !== 'object') throw new ApiError('VALIDATION_FAILED', 'package wajib');
      if (!Number.isSafeInteger(expectedBaseRevision)) {
        throw new ApiError('VALIDATION_FAILED', 'expectedBaseRevision wajib');
      }
      const findings = validatePilotRelease(pkg);
      if (findings.length > 0) {
        throw new ApiError('VALIDATION_FAILED', `Rilis tidak valid: ${findings[0]!.rule}`);
      }
      return { pkg, expectedBaseRevision: expectedBaseRevision as number };
    },
  });
  const v = guard.validated as {
    pkg: {
      manifest: {
        packageId: string;
        version: string;
        schemaVersion: string;
        sourceRef: string;
        licenseRef: string;
        rollbackReference: string;
        checksum: string;
        status: string;
        approvedBy?: string;
        approvedAt?: string;
      };
      nodes: Array<{
        id: string;
        parentId: string | null;
        level: string;
        slug: string;
        name: string;
        sortOrder: number;
        routeHref?: string;
        route?: { href?: string };
      }>;
    };
    expectedBaseRevision: number;
  };
  const checksumFindings = await validatePilotReleaseChecksum(v.pkg);
  if (checksumFindings.length > 0) {
    throw new ApiError('VALIDATION_FAILED', `Rilis tidak valid: ${checksumFindings[0]!.rule}`);
  }
  if (
    v.pkg.manifest.packageId !== PILOT_PACKAGE_ID ||
    v.pkg.manifest.version !== PILOT_PACKAGE_VERSION
  ) {
    throw new ApiError('VALIDATION_FAILED', 'Hanya paket madevi-explore-pilot-v1 v1.0.0');
  }
  const byPayloadKey = new Map(v.pkg.nodes.map((n) => [n.id, n]));
  const nodes = v.pkg.nodes.map((n, i) => {
    const chain: string[] = [String(n.slug)];
    let cur: (typeof v.pkg.nodes)[number] | undefined = n;
    let depth = 0;
    while (cur?.parentId !== null && cur !== undefined && depth++ < 32) {
      cur = byPayloadKey.get(cur.parentId as string);
      if (!cur) throw new ApiError('VALIDATION_FAILED', `Parent ${String(n.id)} hilang`);
      chain.unshift(String(cur.slug));
    }
    const targetPath = `/ruang/jelajahi-pengetahuan/${chain.slice(1).join('/')}`.replace(/\/$/, '');
    const checked = checkPilotRoute(targetPath);
    if (!checked.ok) throw new ApiError('VALIDATION_FAILED', `Route ${String(n.id)}: ${checked.reason}`);
    const declaredRoute = n.routeHref ?? n.route?.href;
    if (declaredRoute !== targetPath) {
      throw new ApiError('VALIDATION_FAILED', `Route ${String(n.id)} tidak cocok dengan hierarchy paket`);
    }
    return {
    sourceNodeKey: String(n.id),
    parentKey: n.parentId === null ? null : String(n.parentId),
    level: String(n.level),
    localCode: `L08-${String(n.level)}${i}`,
    name: String(n.name),
    slug: String(n.slug),
    sortOrder: Number.isSafeInteger(n.sortOrder) ? (n.sortOrder as number) : i,
    visibility: 'PUBLIC' as const,
    status: 'ACTIVE' as const,
    sourceRef: String(v.pkg.manifest.sourceRef),
    targetPath,
    };
  });
  const { snapshot, diff } = await service.stagePackage(principal, {
    packageId: PILOT_PACKAGE_ID,
    version: PILOT_PACKAGE_VERSION,
    expectedBaseRevision: v.expectedBaseRevision,
    manifest: {
      schemaVersion: String(v.pkg.manifest.schemaVersion),
      sourceRef: String(v.pkg.manifest.sourceRef),
      licenseRef: String(v.pkg.manifest.licenseRef),
      rollbackReference: String(v.pkg.manifest.rollbackReference),
      checksum: String(v.pkg.manifest.checksum),
      status: String(v.pkg.manifest.status),
      approvedBy: String(v.pkg.manifest.approvedBy ?? ''),
      approvedAt: String(v.pkg.manifest.approvedAt ?? ''),
    },
    nodes,
  });
  return successResponse({ snapshot, diff }, requestId, { status: 201 });
}

/** Promote: staging → ACTIVE atomik bila base revision cocok. */
async function promote(
  service: TaxonomyService,
  request: Request,
  requestId: string,
  principal: Principal,
) {
  const guard = await guardMutation({
    request,
    requestId,
    maxBytes: 16 * 1024,
    validate: (body) => {
      const b = body as Record<string, unknown>;
      if (typeof b.stagingRevisionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(b.stagingRevisionId)) {
        throw new ApiError('VALIDATION_FAILED', 'stagingRevisionId tidak valid');
      }
      if (!Number.isSafeInteger(b.expectedBaseRevision)) {
        throw new ApiError('VALIDATION_FAILED', 'expectedBaseRevision wajib');
      }
      return {
        stagingRevisionId: b.stagingRevisionId as string,
        expectedBaseRevision: b.expectedBaseRevision as number,
      };
    },
  });
  const v = guard.validated as { stagingRevisionId: string; expectedBaseRevision: number };
  const result = await service.promotePackage(principal, v);
  return successResponse(result, requestId);
}

/** Rollback: kembalikan snapshot pra-promote secara atomik. */
async function rollback(
  service: TaxonomyService,
  request: Request,
  requestId: string,
  principal: Principal,
) {
  const guard = await guardMutation({
    request,
    requestId,
    maxBytes: 16 * 1024,
    validate: (body) => {
      const b = body as Record<string, unknown>;
      if (typeof b.snapshotRevisionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(b.snapshotRevisionId)) {
        throw new ApiError('VALIDATION_FAILED', 'snapshotRevisionId tidak valid');
      }
      if (!Number.isSafeInteger(b.expectedCurrentRevision)) {
        throw new ApiError('VALIDATION_FAILED', 'expectedCurrentRevision wajib');
      }
      if (typeof b.reason !== 'string' || b.reason.trim().length < 10) {
        throw new ApiError('VALIDATION_FAILED', 'Alasan rollback minimal 10 karakter');
      }
      return {
        snapshotRevisionId: b.snapshotRevisionId as string,
        expectedCurrentRevision: b.expectedCurrentRevision as number,
        reason: (b.reason as string).trim(),
      };
    },
  });
  const v = guard.validated as {
    snapshotRevisionId: string;
    expectedCurrentRevision: number;
    reason: string;
  };
  const result = await service.rollbackPackage(principal, v);
  return successResponse(result, requestId);
}

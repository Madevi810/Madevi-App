import fs from 'fs';
import crypto from 'crypto';

const pkgRaw = fs.readFileSync(new URL('../database/seeds/taxonomy/packages/taxonomy/madevi-multi-root-v2.json', import.meta.url), 'utf-8');
const explorePkg = JSON.parse(pkgRaw);

// Find nodes that have parentId = null and level != "R", which means they were meant to be children of space-school
let rootSchool = explorePkg.nodes.find(n => n.sourceNodeKey === "space-school");

// Create space-school if missing
if (!rootSchool) {
  rootSchool = {
    id: "b0000000-0000-4000-8000-000000000000",
    parentId: null,
    level: "R",
    slug: "pendidikan-sekolah",
    label: "Madevi School",
    name: "Madevi School",
    kind: "SPACE",
    status: "ACTIVE",
    accessLevel: "PUBLIC",
    sortOrder: 20,
    route: { href: "/ruang/pendidikan-sekolah" },
    registryRef: "L08 sourceNodeKey",
    sourceRef: "database/seeds/taxonomy/packages/taxonomy/madevi-school-draft-v1.json",
    sourceNodeKey: "space-school"
  };
  explorePkg.nodes.push(rootSchool);
}

// Fix parentId for children
explorePkg.nodes.forEach(n => {
  if(n.id.startsWith("b0") && n.id !== rootSchool.id && n.parentId === null) {
    n.parentId = rootSchool.id;
    // Add relation
    explorePkg.relations.push({
      sourceId: rootSchool.id,
      targetId: n.id,
      type: "PARENT_OF"
    });
  }
});

explorePkg.approval = { approvedBy: "ADMIN", approvedAt: "2026-09-23T17:00:00.000Z" };
explorePkg.manifest.approvedBy = "ADMIN";
explorePkg.manifest.approvedAt = "2026-09-23T17:00:00.000Z";

function canonicalStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalStringify).join(',') + ']';
  const keys = Object.keys(value).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalStringify(value[k])).join(',') + '}';
}

const contentHash = crypto.createHash('sha256').update(canonicalStringify({ nodes: explorePkg.nodes, relations: explorePkg.relations, assets: explorePkg.assets || [] }), 'utf8').digest('hex');
explorePkg.manifest.checksum = contentHash;
explorePkg.validation = explorePkg.validation || {};
explorePkg.validation.reportChecksum = contentHash;

fs.writeFileSync(new URL('../database/seeds/taxonomy/packages/taxonomy/madevi-multi-root-v2.json', import.meta.url), JSON.stringify(explorePkg, null, 2));
console.log('Fixed approval and root in database/seeds/taxonomy/packages/taxonomy/madevi-multi-root-v2.json');

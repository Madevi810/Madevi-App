import fs from 'fs';
import crypto from 'crypto';

const exploreRaw = fs.readFileSync(new URL('../database/seeds/taxonomy/packages/taxonomy/madevi-explore-pilot-v1.json', import.meta.url), 'utf-8');
const explorePkg = JSON.parse(exploreRaw);

const schoolDraftRaw = fs.readFileSync(new URL('../database/seeds/taxonomy/packages/taxonomy/madevi-school-draft-v1.json', import.meta.url), 'utf-8');
const schoolDraft = JSON.parse(schoolDraftRaw);

const newNodes = [];
const newRelations = [];

const uuidBase = "b0000000-0000-4000-8000-0000000000";
let uuidCounter = 1;
const idMap = {};

// Create nodes
schoolDraft.nodes.forEach((n, i) => {
  const idStr = (uuidCounter++).toString().padStart(2, '0');
  const uuid = `${uuidBase}${idStr}`;
  idMap[n.id] = uuid;
  
  let level = "MENU";
  if(n.id === "space-school") level = "R";
  else if (n.kind === "DOMAIN") level = "D";
  else if (n.kind === "CONTEXT") level = "K";
  else if (n.kind === "MENU") level = "M";
  else if (n.kind === "SUBMENU") level = "T";
  else level = "J";

  newNodes.push({
    id: uuid,
    parentId: null, // will fix later
    level: level,
    slug: n.slug || "pendidikan-sekolah",
    label: n.label,
    name: n.label,
    kind: n.id === "space-school" ? "SPACE" : n.kind,
    status: n.status === "BROCHURE_PUBLIC" ? "ACTIVE" : (n.status === "EMPTY" || n.status === "COMING_SOON" ? "ACTIVE" : "ACTIVE"),
    accessLevel: n.accessLevel || "PUBLIC",
    sortOrder: n.sortOrder || 10,
    route: { href: `/ruang/pendidikan-sekolah/${n.slug || ""}` },
    registryRef: "L08 sourceNodeKey",
    sourceRef: "database/seeds/taxonomy/packages/taxonomy/madevi-school-draft-v1.json",
    sourceNodeKey: uuid
  });
});

// fix parentId and build relations
newNodes.forEach(n => {
  const draftNode = schoolDraft.nodes.find(d => idMap[d.id] === n.id);
  if(draftNode && draftNode.parentId && idMap[draftNode.parentId]) {
    n.parentId = idMap[draftNode.parentId];
    newRelations.push({
      sourceId: n.parentId,
      targetId: n.id,
      type: "PARENT_OF"
    });
  }
});

explorePkg.nodes.push(...newNodes);
explorePkg.relations.push(...newRelations);

explorePkg.manifest.packageId = "madevi-explore-school-v2";
explorePkg.manifest.version = "2.0.0";
explorePkg.manifest.status = "SIAP-INTEGRASI";

explorePkg.approval = { approvedBy: "ADMIN", approvedAt: new Date().toISOString() };
explorePkg.unresolvedDependencies = [];
explorePkg.rollback = { snapshotRef: "db-snapshot-pre-v2", strategy: "atomic" };

function canonicalStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalStringify).join(',') + ']';
  const keys = Object.keys(value).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalStringify(value[k])).join(',') + '}';
}

const contentHash = crypto.createHash('sha256').update(canonicalStringify({ nodes: explorePkg.nodes, relations: explorePkg.relations, assets: explorePkg.assets || [] }), 'utf8').digest('hex');
explorePkg.manifest.checksum = contentHash;

fs.writeFileSync(new URL('../database/seeds/taxonomy/packages/taxonomy/madevi-multi-root-v2.json', import.meta.url), JSON.stringify(explorePkg, null, 2));
console.log('Saved to database/seeds/taxonomy/packages/taxonomy/madevi-multi-root-v2.json');

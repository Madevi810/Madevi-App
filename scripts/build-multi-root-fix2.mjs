import fs from 'fs';
import crypto from 'crypto';

const pkgRaw = fs.readFileSync(new URL('../database/seeds/taxonomy/packages/taxonomy/madevi-multi-root-v2.json', import.meta.url), 'utf-8');
const explorePkg = JSON.parse(pkgRaw);

// Find the root school node
let rootSchool = explorePkg.nodes.find(n => n.sourceNodeKey === "space-school");
if (rootSchool) {
  rootSchool.slug = "pendidikan-dan-pembelajaran";
  rootSchool.rootCode = "R1";
  rootSchool.route.href = "/ruang/pendidikan-dan-pembelajaran";
}

// Fix routes for children of school
function fixRoute(nodeId, currentHref) {
  explorePkg.nodes.filter(n => n.parentId === nodeId).forEach(child => {
    child.route.href = currentHref + "/" + child.slug;
    fixRoute(child.id, child.route.href);
  });
}
fixRoute(rootSchool.id, rootSchool.route.href);

// Topologically sort nodes
const sorted = [];
const visited = new Set();
let remaining = explorePkg.nodes;
while(remaining.length > 0) {
  const nextNodes = remaining.filter(n => !n.parentId || visited.has(n.parentId));
  if(nextNodes.length === 0) {
    console.error("Cycle or missing parent in:", remaining.map(n => n.id));
    process.exit(1);
  }
  nextNodes.forEach(n => visited.add(n.id));
  sorted.push(...nextNodes);
  remaining = remaining.filter(n => !nextNodes.includes(n));
}
explorePkg.nodes = sorted;

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
console.log('Fixed sort and rootCode');

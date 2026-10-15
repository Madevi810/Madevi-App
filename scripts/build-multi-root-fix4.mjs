import fs from 'fs';
import crypto from 'crypto';

const pkgRaw = fs.readFileSync(new URL('../database/seeds/taxonomy/packages/taxonomy/madevi-multi-root-v2.json', import.meta.url), 'utf-8');
const explorePkg = JSON.parse(pkgRaw);

// Fix packageId to prevent stable ID conflict
explorePkg.manifest.packageId = "madevi-explore-pilot-v1";

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
console.log('Fixed packageId in database/seeds/taxonomy/packages/taxonomy/madevi-multi-root-v2.json');

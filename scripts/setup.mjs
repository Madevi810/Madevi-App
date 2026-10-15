import fs from 'node:fs';
import path from 'node:path';

import { assertWorkspaceProject, loadLocalConfig, projectRoot } from './lib/config.mjs';
import { ensureRuntimeDirectories } from './lib/process-state.mjs';

const root = projectRoot(import.meta.url);
assertWorkspaceProject(root);
const envFile = path.join(root, '.env.local');

if (!fs.existsSync(envFile)) {
  throw new Error(
    '.env.local belum ada. Salin .env.example, ganti password PostgreSQL lokal, lalu chmod 600 .env.local.',
  );
}

const config = loadLocalConfig(root);
const directories = ensureRuntimeDirectories(config);
fs.chmodSync(envFile, 0o600);
console.log(
  JSON.stringify({
    ok: true,
    projectRoot: root,
    runtimeDirectories: directories,
    note: 'Secret tidak ditampilkan.',
  }),
);

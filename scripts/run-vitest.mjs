import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { assertWorkspaceProject, projectRoot } from './lib/config.mjs';

const root = projectRoot(import.meta.url);
assertWorkspaceProject(root);

const environment = { ...process.env };
if (process.platform === 'android' && process.arch === 'arm64') {
  environment.NAPI_RS_NATIVE_LIBRARY_PATH = prepareRolldownBinding(root);
}

const result = spawnSync(
  process.execPath,
  [path.join(root, 'node_modules', 'vitest', 'vitest.mjs'), ...process.argv.slice(2)],
  { cwd: root, env: environment, stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;

function prepareRolldownBinding(projectRoot) {
  const termuxPrefix = path.resolve(path.dirname(process.execPath), '..');
  if (!termuxPrefix.startsWith('/data/data/com.termux/files/usr')) {
    throw new Error('Binding Vitest Android harus memakai Node Termux native');
  }

  const source = path.join(
    projectRoot,
    'node_modules',
    '@rolldown',
    'binding-android-arm64',
    'rolldown-binding.android-arm64.node',
  );
  const destination = path.join(
    termuxPrefix,
    'var',
    'lib',
    'madevi-runtime',
    'rolldown-binding.android-arm64.node',
  );
  // Some Termux/npm installs omit the optional Android arm64 package. The
  // repository already carries the WASI fallback, which is slower but fully
  // functional and keeps unit tests runnable without downloading a binary.
  if (!fs.existsSync(source)) {
    const wasmFallback = path.join(
      projectRoot,
      'node_modules',
      '@rolldown',
      'binding-wasm32-wasi',
      'rolldown-binding.wasi.cjs',
    );
    assertRegularFile(wasmFallback, 'Binding Rolldown WASI fallback');
    return wasmFallback;
  }

  assertRegularFile(source, 'Binding Rolldown source');
  fs.mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });

  if (!fs.existsSync(destination) || sha256(source) !== sha256(destination)) {
    if (fs.existsSync(destination)) assertRegularFile(destination, 'Binding Rolldown runtime');
    fs.copyFileSync(source, destination);
    fs.chmodSync(destination, 0o700);
  }
  assertRegularFile(destination, 'Binding Rolldown runtime');
  return destination;
}

function assertRegularFile(file, label) {
  const metadata = fs.lstatSync(file);
  if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size < 1) {
    throw new Error(`${label} tidak sah`);
  }
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

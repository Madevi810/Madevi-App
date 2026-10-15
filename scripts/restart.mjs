import { spawnSync } from 'node:child_process';
import path from 'node:path';

const scriptDirectory = path.dirname(new URL(import.meta.url).pathname);
const modeIndex = process.argv.indexOf('--mode');
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : 'production-local';
for (const [script, args] of [
  ['stop.mjs', []],
  ['start.mjs', ['--mode', mode]],
]) {
  const result = spawnSync(process.execPath, [path.join(scriptDirectory, script), ...args], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

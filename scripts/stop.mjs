import { assertWorkspaceProject, loadLocalConfig, projectRoot } from './lib/config.mjs';
import {
  inspectOwnedProcess,
  readProcessRecord,
  removeProcessRecord,
  terminateProcess,
  waitForExit,
} from './lib/process-state.mjs';

const root = projectRoot(import.meta.url);
const workspaceProject = assertWorkspaceProject(root);
const config = loadLocalConfig(root);
const record = readProcessRecord(config);

if (!record) {
  console.log(JSON.stringify({ ok: true, status: 'sudah-berhenti' }));
  process.exit(0);
}

const state = inspectOwnedProcess(record, workspaceProject);
if (!state.alive) {
  removeProcessRecord(config);
  console.log(JSON.stringify({ ok: true, status: 'record-mati-dibersihkan', pid: record.pid }));
  process.exit(0);
}
if (!state.owned) throw new Error(`PID ${record.pid} bukan milik task ini; proses tidak disentuh`);

terminateProcess(record.pid, 'SIGTERM');
let stopped = await waitForExit(record.pid, 8_000);
if (!stopped) {
  const recheck = inspectOwnedProcess(record, workspaceProject);
  if (!recheck.owned) throw new Error('Identitas PID berubah saat stop; SIGKILL dibatalkan');
  terminateProcess(record.pid, 'SIGKILL');
  stopped = await waitForExit(record.pid, 2_000);
}
if (!stopped) throw new Error(`Proses ${record.pid} belum berhenti`);
removeProcessRecord(config);
console.log(JSON.stringify({ ok: true, status: 'berhenti', pid: record.pid }));

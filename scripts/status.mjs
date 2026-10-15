import { assertWorkspaceProject, loadLocalConfig, projectRoot } from './lib/config.mjs';
import {
  inspectOwnedProcess,
  readProcessRecord,
  removeProcessRecord,
} from './lib/process-state.mjs';

const root = projectRoot(import.meta.url);
const workspaceProject = assertWorkspaceProject(root);
const config = loadLocalConfig(root);
const record = readProcessRecord(config);

if (!record) {
  console.log(JSON.stringify({ ok: true, status: 'berhenti' }));
  process.exit(0);
}
const state = inspectOwnedProcess(record, workspaceProject);
if (!state.alive && process.argv.includes('--cleanup-stale')) {
  removeProcessRecord(config);
  console.log(JSON.stringify({ ok: true, status: 'record-mati-dibersihkan', pid: record.pid }));
  process.exit(0);
}
console.log(JSON.stringify({ ok: state.owned, status: state.reason, record }));
if (!state.owned) process.exitCode = 1;

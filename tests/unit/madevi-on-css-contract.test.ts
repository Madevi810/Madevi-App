import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

const APP_ROOT = join(import.meta.dirname, '..', '..');
const DEDICATED_THEME_FILE = 'src/styles/madevi-on.css';
const ACTIVE_DECORATIVE_KEYFRAMES = new Set([
  'madevi-on-nebula-shift',
  'madevi-on-glow-drift',
  'madevi-on-map-orbit',
  'madevi-on-star-pulse',
  'madevi-on-grid-flow',
  'madevi-on-scan',
  'madevi-on-cta-charge',
  'madevi-on-assistant-pulse',
  'madevi-on-active-rail',
]);

function readCss(path: string) {
  return readFileSync(join(APP_ROOT, path), 'utf8');
}

describe('Madevi On stylesheet ownership contract', () => {
  it('keeps active Madevi On decorative keyframes in the dedicated stylesheet', () => {
    const definitions = new Map<string, string[]>();

    for (const path of [
      'src/styles/redesign.css',
      'src/styles/interface-refresh.css',
      'src/styles/atlas-redesign.css',
      DEDICATED_THEME_FILE,
    ]) {
      const ast = postcss.parse(readCss(path), { from: path });
      ast.walkAtRules(/(?:-webkit-)?keyframes/i, (rule) => {
        if (!ACTIVE_DECORATIVE_KEYFRAMES.has(rule.params)) return;
        const files = definitions.get(rule.params) ?? [];
        files.push(path);
        definitions.set(rule.params, files);
      });
    }

    const violations = [...ACTIVE_DECORATIVE_KEYFRAMES].flatMap((name) => {
      const files = definitions.get(name) ?? [];
      return files.length === 1 && files[0] === DEDICATED_THEME_FILE
        ? []
        : [`${name}: ${files.length ? files.join(', ') : 'missing'}`];
    });

    expect(violations, 'Active Madevi On keyframes must be defined only in madevi-on.css').toEqual([]);
  });
});

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores(['.next/**', '.npm-cache/**', 'node_modules/**', 'coverage/**', 'var/**']),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react-compiler/react-compiler': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off'
    }
  }
]);

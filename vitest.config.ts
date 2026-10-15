import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: [
      'tests/unit/**/*.test.ts',
      'tests/unit/**/*.test.tsx',
      'tests/integration/**/*.test.ts',
      'tests/contract/**/*.test.ts',
    ],
    setupFiles: ['./tests/setup-env.ts'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    coverage: {
      reporter: ['text', 'json-summary'],
    },
  },
});

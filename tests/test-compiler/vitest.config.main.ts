import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
  },
  esbuild: {
    target: 'node18',
  },
});

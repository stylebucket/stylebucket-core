import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
  },
  esbuild: {
    target: 'node18',
  },
});

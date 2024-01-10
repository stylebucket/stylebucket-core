/// <reference types="vitest"/>

import { defineConfig } from 'vite';
import { stylebucket } from '@stylebucket/vite-plugin';

export default defineConfig({
  plugins: [
    stylebucket(),
  ],
  test: {
    include: ['**/*.test.ts'],
  },
  esbuild: {
    target: 'node18',
  },
});

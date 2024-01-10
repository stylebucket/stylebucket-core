import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { main: 'exports/main.ts' },
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['esm'],
  skipNodeModulesBundle: true,
  watch: false,
  target: 'node18',
  outDir: 'build',
});

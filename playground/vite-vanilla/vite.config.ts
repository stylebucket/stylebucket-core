import { defineConfig } from 'vite';
import { stylebucket } from '@stylebucket/vite-plugin';

export default defineConfig({
  plugins: [
    stylebucket(),
  ],
});

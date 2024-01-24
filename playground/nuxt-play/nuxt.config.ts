// https://nuxt.com/docs/api/configuration/nuxt-config
import { stylebucket } from '@stylebucket/vite-plugin';

export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    plugins: [stylebucket()],
    build: {
      minify: false,
    },
  },
  telemetry: {
    enabled: false,
  },
  experimental: {
    typedPages: true,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
});

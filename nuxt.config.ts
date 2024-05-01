import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    clientSecret: process.env.NUXT_EBAY_CLIENT_SECRET,
    sessionSecret: process.env.NUXT_SESSION_SECRET,
    public: {
      clientId: process.env.NUXT_EBAY_CLIENT_ID || 'AndrewGi-applicat-PRD-c7f9b21e9-c28956e3',
      tokenUrl: process.env.NUXT_EBAY_TOKEN_URL || 'https://api.ebay.com/identity/v1/oauth2/token',
    },
  },
  buildModules: [
    '@nuxtjs/date-fns',
  ],
  modules: [
    '@nuxt/content',
    'nuxt-highcharts',
    '@nuxt/ui',
  ],
  colorMode: {
    classSuffix: '',
  },
  build: {
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = 'source-map';
      }
    },
  },
});

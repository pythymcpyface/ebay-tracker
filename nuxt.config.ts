import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    clientId: process.env.EBAY_CLIENT_ID,
    clientSecret: process.env.EBAY_CLIENT_SECRET,
    tokenUrl: process.env.EBAY_TOKEN_URL,
    sessionSecret: process.env.SESSION_SECRET,
  },
  buildModules: [
    '@nuxtjs/date-fns',
  ],
  modules: [
    '@nuxt/content',
    'nuxt-highcharts',
    '@nuxt/ui',
    'h3-session/nuxt',
  ],
  session: {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 900000 },
  },
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

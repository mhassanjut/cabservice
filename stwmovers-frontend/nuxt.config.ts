import { siteConfig } from './config/site'
import { seoDefaults } from './config/seo'

export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: siteConfig.siteUrl,
      apiBaseUrl: siteConfig.apiBaseUrl,
      whatsappNumber: siteConfig.whatsappNumber,
      whatsappDefaultMessage: siteConfig.whatsappDefaultMessage,
      externalTourUrl: siteConfig.externalTourUrl,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: (titleChunk) =>
        titleChunk ? `${titleChunk} | ${seoDefaults.brandName}` : seoDefaults.defaultTitle,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index,follow' },
        { name: 'theme-color', content: seoDefaults.themeColor },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  nitro: {
    prerender: {
      routes: ['/', '/cars', '/confirm'],
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

})


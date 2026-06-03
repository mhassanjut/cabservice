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
      externalTourUrl: siteConfig.externalTourUrl,
      googleMapsApiKey: '',
      stripePublicKey: '',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      // Unhead accepts a function; generated app config types may only list `string`.
      // @ts-expect-error — runtime titleTemplate callback is valid for Nuxt / Unhead
      titleTemplate: (titleChunk?: string) =>
        titleChunk ? `${titleChunk} | ${seoDefaults.brandName}` : seoDefaults.defaultTitle,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index,follow' },
        { name: 'theme-color', content: seoDefaults.themeColor },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
          crossorigin: 'anonymous',
          referrerpolicy: 'no-referrer',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  nitro: {
    prerender: {
      routes: ['/', '/cars'],
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

})


import { siteConfig } from './config/site'
import { seoDefaults } from './config/seo'

export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt', '@nuxt/image'],
  css: [
    '~/assets/styles/css/main.css',
    '~/assets/styles/css/home.css',
    '~/assets/styles/css/booking.css',
    '~/assets/styles/css/tours.css',
    '~/assets/styles/css/dashboard.css',
    'vue-tel-input/vue-tel-input.css',
  ],

  image: {
    // Serve modern formats when the browser supports them, fall back gracefully.
    format: ['webp', 'jpg'],
    quality: 78,
    // Breakpoints used to generate srcset. Must be screen-prefixed in `sizes`.
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // Reasonable presets for repeated card imagery.
    densities: [1, 2],
  },

  // Avoid dev.json / #app-manifest errors after `nuxt generate` or stale Vite cache.
  experimental: {
    appManifest: false,
  },

  ignore: ['dist/**'],

  runtimeConfig: {
    public: {
      siteUrl: siteConfig.siteUrl,
      apiBaseUrl: siteConfig.apiBaseUrl,
      externalTourUrl: siteConfig.externalTourUrl,
      googleMapsApiKey: '',
      googleClientId: '',
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
          href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Inter:wght@200;400;500;600;700&family=Manrope:wght@400;600&family=Montserrat:wght@500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Poppins:wght@400;700&display=swap',
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

  routeRules: {
    '/admin': { ssr: false },
    '/admin/**': { ssr: false },
  },

  nitro: {
    preset: 'netlify',
    prerender: {
      routes: ['/', '/cars', '/tours', '/faq'],
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

})


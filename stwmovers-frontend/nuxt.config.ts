import { siteConfig } from './config/site'
import { seoDefaults } from './config/seo'

export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt', '@nuxt/image'],
  css: [
    '~/assets/styles/css/fonts.css',
    '~/assets/styles/css/main.css',
  ],

  image: {
    // Serve modern formats when the browser supports them, fall back gracefully.
    format: ['webp', 'jpg'],
    quality: 78,
    // Allow IPX to fetch/optimize backend media (car/tour uploads).
    domains: [
      ...(() => {
        try {
          return [new URL(siteConfig.apiBaseUrl).hostname]
        } catch {
          return ['localhost']
        }
      })(),
      'stwmovers.com',
      'www.stwmovers.com',
      ...(() => {
        try {
          return [new URL(siteConfig.wordpressUrl).hostname]
        } catch {
          return ['cms.stwmovers.com']
        }
      })(),
    ],
    // Breakpoints used to generate srcset. Must be screen-prefixed in `sizes`.
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    densities: [1, 2],
    presets: {
      hero: {
        modifiers: {
          fit: 'cover',
          format: 'webp',
          quality: 78,
        },
      },
      card: {
        modifiers: {
          format: 'webp',
          quality: 75,
        },
      },
    },
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
      wordpressUrl: siteConfig.wordpressUrl,
      externalTourUrl: siteConfig.externalTourUrl,
      cookieAuth: false,
      googleMapsApiKey: '',
      googleClientId: '',
      stripePublicKey: '',
      googleAnalyticsId: '',
      microsoftClarityId: '',
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
        // Self-hosted fonts (see assets/styles/css/fonts.css). Preload critical
        // latin weights so optional font-display usually wins before first paint.
        {
          rel: 'preload',
          href: '/fonts/inter-latin-400.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/instrument-sans-latin-600.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        // Font Awesome: loaded async via plugins/fontawesome.client.ts (non-blocking).
        // Noscript fallback below for users without JS.
        { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com', crossorigin: '' },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon-light.svg',
          media: '(prefers-color-scheme: light)',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon-dark.svg',
          media: '(prefers-color-scheme: dark)',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
      ],
      noscript: [
        {
          innerHTML:
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">',
        },
      ],
    },
  },

  routeRules: {
    '/admin': { ssr: false },
    '/admin/**': { ssr: false },
    // Long-lived cache for optimized/static assets (Lighthouse cache-insight).
    '/_ipx/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/_nuxt/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/img/**': {
      headers: {
        'cache-control': 'public, max-age=2592000',
      },
    },
    '/fonts/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
  },

  nitro: {
    preset: 'node-server',
    prerender: {
      routes: [
        '/',
        '/cars',
        '/tours',
        '/faq',
        '/airport-transfer',
        '/executive-business-travel',
        '/chauffeur-service',
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

})


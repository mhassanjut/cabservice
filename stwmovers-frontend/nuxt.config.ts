// Staging CI/CD test trigger — safe to remove after verification

import { prerenderRoutes } from './config/prerenderRoutes'
import { siteConfig } from './config/site'
import { seoDefaults } from './config/seo'

export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/eslint'],
  css: [
    '~/assets/styles/css/fonts.css',
    '~/assets/styles/css/main.css',
    '~/assets/styles/css/theme.css',
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
    densities: [1],
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
      // Override at build time with NUXT_PUBLIC_SITE_URL (e.g. staging vs production).
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
      htmlAttrs: { lang: 'en', 'data-site-theme': 'dark' },
      script: [{ key: 'site-theme-init', tagPosition: 'head', innerHTML: "document.documentElement.dataset.siteTheme='dark';try{localStorage.removeItem('stw-theme-mode')}catch(e){}" }],
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
        // Crawlers (Google Search) prefer /favicon.ico and ≥48px PNG; SVG kept for modern browsers.
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
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
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLMs.txt' },
        { rel: 'author', href: '/humans.txt' },
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
    '/admin': { ssr: false, headers: { 'x-robots-tag': 'noindex, follow' } },
    '/admin/**': { ssr: false, headers: { 'x-robots-tag': 'noindex, follow' } },
    '/booking': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/bookings': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/cars': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/confirm': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/dashboard': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/dashboard/**': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/driver': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/driver/**': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/guest/**': { ssr: false, headers: { 'x-robots-tag': 'noindex, follow' } },
    '/login': { headers: { 'x-robots-tag': 'noindex, follow' } },
    '/payment': { headers: { 'x-robots-tag': 'noindex, follow' } },
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
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/fonts/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
  },

  // Nuxt 4 hybrid: top-level prerender + node-server (not static `nitro-prerender` only).
  // See https://nuxt.com/docs/getting-started/prerendering
  prerender: {
    routes: [...prerenderRoutes],
  },

  nitro: {
    preset: 'node-server',
  },

  hooks: {
    'nitro:config'(nitroConfig) {
      nitroConfig.preset = 'node-server'
    },
  },

  typescript: {
    strict: true,
    // `npm run typecheck` is the explicit type gate. Keeping Nuxt's build-time
    // checker enabled currently fails with TS5042 before Vite can bundle.
    typeCheck: false,
  },

})

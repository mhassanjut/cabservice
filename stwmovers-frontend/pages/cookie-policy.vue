<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { legalPageMap } from '~/data/legalPages'

definePageMeta({ layout: 'home' })

const page = legalPageMap['cookie-policy']!
const openCookieSettings = () => window.dispatchEvent(new Event('stw:open-measurement-settings'))

usePageSeo({ title: page.title, description: page.description, path: `/${page.slug}` })
useHead({
  script: [{
    key: `ld-json-${page.slug}`,
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      url: `${siteConfig.siteUrl}/${page.slug}`,
      dateModified: '2026-09-21',
      publisher: { '@type': 'Organization', name: 'STW Movers', url: siteConfig.siteUrl },
    }),
  }],
})
</script>

<template>
  <div class="home-page">
    <LegalPage :page="page" />
    <div class="cookie-settings-action">
      <button type="button" @click="openCookieSettings">
        Manage optional measurement
      </button>
    </div>
  </div>
</template>

<style scoped>
.cookie-settings-action { max-width: 1180px; margin: 0 auto 48px; padding: 0 24px; }
.cookie-settings-action button { min-height: 44px; padding: 0 16px; color: inherit; background: transparent; border: 1px solid currentColor; border-radius: 6px; cursor: pointer; }
.cookie-settings-action button:focus-visible { outline: 3px solid #d7b452; outline-offset: 3px; }
</style>

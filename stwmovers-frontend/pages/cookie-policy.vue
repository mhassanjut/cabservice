<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { legalPageMap } from '~/data/legalPages'

definePageMeta({ layout: 'home' })

const page = legalPageMap['cookie-policy']!

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
  </div>
</template>

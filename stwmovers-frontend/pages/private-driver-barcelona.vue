<script setup lang="ts">
import '~/assets/styles/css/ads-landing.css'
import AdsLandingPage from '~/components/seo/AdsLandingPage.vue'
import { siteConfig } from '~/config/site'
import { adsLandingPageSchema, findAdsLandingPage } from '~/data/adsLandingPages'

definePageMeta({ layout: 'home' })

const page = findAdsLandingPage('private-driver-barcelona')!

usePageSeo({
  title: 'Private Driver Barcelona',
  description: page.description,
  path: page.path,
  ogImagePath: page.image,
})

useHead({
  script: [
    {
      key: 'ld-json-ads-private-driver-barcelona',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(adsLandingPageSchema(page, siteConfig.siteUrl)),
    },
  ],
})
</script>

<template>
  <AdsLandingPage :page="page" />
</template>

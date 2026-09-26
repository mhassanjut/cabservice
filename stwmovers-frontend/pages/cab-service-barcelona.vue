<script setup lang="ts">
import '~/assets/styles/css/ads-landing.css'
import AdsLandingPage from '~/components/seo/AdsLandingPage.vue'
import { siteConfig } from '~/config/site'
import { adsLandingPageSchema, findAdsLandingPage } from '~/data/adsLandingPages'

definePageMeta({ layout: 'home' })

const page = findAdsLandingPage('cab-service-barcelona')!

usePageSeo({
  title: 'Cab Service Barcelona Alternative',
  description: page.description,
  path: page.path,
  ogImagePath: page.image,
})

useHead({
  script: [
    {
      key: 'ld-json-ads-cab-service-barcelona',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(adsLandingPageSchema(page, siteConfig.siteUrl)),
    },
  ],
})
</script>

<template>
  <AdsLandingPage :page="page" />
</template>

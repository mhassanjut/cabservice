<script setup lang="ts">
import '~/assets/styles/css/ads-landing.css'
import AdsLandingPage from '~/components/seo/AdsLandingPage.vue'
import { siteConfig } from '~/config/site'
import { adsLandingPageSchema, findAdsLandingPage } from '~/data/adsLandingPages'

definePageMeta({ layout: 'home' })

const route = useRoute()
const slug = String(route.params.slug)
const page = findAdsLandingPage(slug)

if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Landing page not found' })
}

usePageSeo({
  title: page.title,
  description: page.description,
  path: page.path,
  ogImagePath: page.image,
})

useHead({
  script: [
    {
      key: `ld-json-ads-${page.slug}`,
      type: 'application/ld+json',
      innerHTML: JSON.stringify(adsLandingPageSchema(page, siteConfig.siteUrl)),
    },
  ],
})
</script>

<template>
  <AdsLandingPage :page="page" />
</template>

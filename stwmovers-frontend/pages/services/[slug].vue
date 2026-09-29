<script setup lang="ts">
import '~/assets/styles/css/home.css'
import '~/assets/styles/css/growth-seo.css'
import GrowthSeoPage from '~/components/seo/GrowthSeoPage.vue'
import { findGrowthPage, growthPageSchema } from '~/data/growthSeoPages'

definePageMeta({ layout: 'home' })

const route = useRoute()
const slug = String(route.params.slug)
const page = findGrowthPage('service', slug)

if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Service page not found' })
}

usePageSeo({
  title: page.seoTitle,
  description: page.description,
  path: page.path,
  ogImagePath: page.image,
})
useServicePageSchema(growthPageSchema(page), `growth-service-${page.slug}`)
</script>

<template>
  <GrowthSeoPage :page="page" />
</template>

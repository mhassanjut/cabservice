<script setup lang="ts">
import '~/assets/styles/css/services.css'
import { serviceLandingPages } from '~/data/serviceLandingPages'

definePageMeta({ layout: 'service' })

const page = serviceLandingPages['airport-transfer']

usePageSeo({
  title: page.seo.title,
  description: page.seo.description,
  path: page.path,
})

useServicePageSchema(page.schema, page.id)
</script>

<template>
  <ServiceLanding page-id="airport-transfer" />
</template>

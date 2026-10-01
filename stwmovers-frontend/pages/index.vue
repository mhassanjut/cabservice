<script setup lang="ts">
import { seoDefaults } from '~/config/seo'
import { homeFaqItems } from '~/data/homeFaq'
import {
  breadcrumbSchema,
  chauffeurServiceSchema,
  faqPageSchema,
  primaryServiceItems,
  schemaGraph,
  serviceItemListSchema,
  webPageSchema,
} from '~/utils/schema'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: seoDefaults.defaultTitle,
  description: seoDefaults.defaultDescription,
  path: '/',
})

useJsonLdSchema(
  'home-page-ai-entity',
  schemaGraph([
    webPageSchema({
      id: 'webpage',
      path: '/',
      name: seoDefaults.defaultTitle,
      description: seoDefaults.defaultDescription,
      about: [
        'Barcelona taxi alternative',
        'Barcelona cab alternative',
        'Barcelona airport transfer',
        'Private driver Barcelona',
        'Executive chauffeur Barcelona',
      ],
    }),
    chauffeurServiceSchema({
      id: 'primary-service',
      path: '/',
      name: 'Barcelona Private Chauffeur, Taxi Alternative, and Airport Transfer Service',
      description:
        'STW Movers provides pre-booked Barcelona chauffeur service, BCN airport transfers, private driver hire, cruise port transfers, and premium taxi or cab alternatives.',
    }),
    serviceItemListSchema([...primaryServiceItems]),
    faqPageSchema('STW Movers Barcelona chauffeur FAQ', homeFaqItems),
    breadcrumbSchema([{ name: 'Home', path: '/' }]),
  ]),
)
</script>

<template>
  <div class="home-page">
    <HomeHero />

    <HomeConversionProof />

    <HomeBookingConfidence />

    <HomeIntentPaths />

    <HomeFleet />

    <HomeTestimonials />

    <HomeLocations />

    <HomeBookingSteps />

    <HomeExperience />

    <HomeValues />

    <HomeServiceClarity />

    <HomeCorporateBanner />

    <HomeInsights />

    <HomeFaq />

    <HomeCtaBanner />
  </div>
</template>

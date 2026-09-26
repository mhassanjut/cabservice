<script setup lang="ts">
import '~/assets/styles/css/about.css'
import { breadcrumbSchema, schemaGraph, webPageSchema } from '~/utils/schema'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'About STW Movers Barcelona Chauffeur Service',
  description:
    'About STW Movers, a Barcelona private chauffeur, airport transfer, private driver, taxi alternative, and cab alternative service for luxury pre-booked journeys.',
  path: '/about-us',
})

useJsonLdSchema(
  'about-page-ai-entity',
  schemaGraph([
    webPageSchema({
      id: 'webpage',
      path: '/about-us',
      name: 'About STW Movers Barcelona Chauffeur Service',
      description:
        'About STW Movers, a Barcelona private chauffeur, airport transfer, private driver, taxi alternative, and cab alternative service for luxury pre-booked journeys.',
      type: 'AboutPage',
      about: [
        'STW Movers',
        'Barcelona chauffeur service',
        'Private airport transfer Barcelona',
        'Private driver Barcelona',
      ],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About STW Movers', path: '/about-us' },
    ]),
  ]),
)
</script>

<template>
  <div class="home-page about-page">
    <AboutHero />

    <AboutPhilosophy />

    <AboutPeople />

    <AboutHighlights />

    <AboutTrustLinks />

    <AboutGallery />

    <AboutPromise />

    <AboutTestimonial />

    <AboutFinalCta />

  </div>
</template>

<script setup lang="ts">
import '~/assets/styles/css/tours.css'
import { seoDefaults, seoSections } from '~/config/seo'
import { routes } from '~/constants/routes'

definePageMeta({ layout: 'home' })

const tours = seoSections.tours

usePageSeo({
  title: tours.pageTitle,
  description: tours.metaDescription,
  path: routes.tours,
})

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || '').replace(/\/$/, '')

useHead({
  script: [
    {
      key: 'ld-json-tours',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${tours.pageTitle} | ${seoDefaults.brandName}`,
        description: tours.metaDescription,
        url: `${siteUrl}${routes.tours}`,
        isPartOf: { '@type': 'WebSite', name: seoDefaults.brandName, url: siteUrl },
        mainEntity: {
          '@type': 'FAQPage',
          mainEntity: tours.faqs.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        },
      }),
    },
  ],
})
</script>

<template>
  <div class="home-page tours-page">
    <ToursHero />
    <ToursListing />
    <ToursWhyChooseUs />
    <ToursConcierge />
    <ToursFaqSection />
    <ToursCinematicCta />
  </div>
</template>

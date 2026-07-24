<script setup lang="ts">
import '~/assets/styles/css/services.css'
import { servicesSplitSections } from '~/data/servicesContent'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Services',
  description:
    'Executive chauffeur services in Barcelona and across Spain — airport transfers, business travel, hourly chauffeur, private experiences, and special events, all thoughtfully planned.',
  path: '/services',
})

const airport = servicesSplitSections.find((section) => section.id === 'airport-transfers')!
const business = servicesSplitSections.find((section) => section.id === 'executive-business')!
const events = servicesSplitSections.find((section) => section.id === 'special-events')!
</script>

<template>
  <div class="home-page services-page">
    <ServicesHero />

    <ServicesIntro />

    <ServicesSplit :section="airport" />

    <ServicesSplit :section="business" />

    <ServicesHourly />

    <ServicesExperiences />

    <ServicesSplit :section="events" />

    <ServicesWhyChoose />

    <ServicesQuote />

    <ServicesSteps />

    <ServicesFinalCta />
  </div>
</template>

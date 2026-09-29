<script setup lang="ts">
import '~/assets/styles/css/growth-seo.css'
import '~/assets/styles/css/services.css'
import { growthPageGroups } from '~/data/growthSeoPages'
import {
  breadcrumbSchema,
  chauffeurServiceSchema,
  schemaGraph,
  serviceItemListSchema,
  webPageSchema,
} from '~/utils/schema'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Barcelona Chauffeur & Airport Transfer Services',
  description:
    'Executive chauffeur services in Barcelona and across Spain — airport transfers, business travel, hourly chauffeur, private experiences, and special events, all thoughtfully planned.',
  path: '/services',
})

useJsonLdSchema(
  'services-hub-ai-entity',
  schemaGraph([
    webPageSchema({
      id: 'webpage',
      path: '/services',
      name: 'Barcelona Chauffeur & Airport Transfer Services',
      description:
        'Service hub for STW Movers Barcelona chauffeur, airport transfer, private driver, cruise port transfer, hourly chauffeur, and taxi or cab alternative pages.',
      type: 'CollectionPage',
      about: [
        'Barcelona airport transfer',
        'Private driver Barcelona',
        'Executive chauffeur Barcelona',
        'Barcelona cruise port transfer',
        'Hourly chauffeur Barcelona',
      ],
    }),
    chauffeurServiceSchema({
      id: 'service-catalog',
      path: '/services',
      name: 'STW Movers Barcelona Chauffeur Services',
      description:
        'Private chauffeur service catalog for BCN airport transfers, private driver hire, executive travel, hourly chauffeur bookings, cruise port routes, and city-to-city transfers.',
    }),
    serviceItemListSchema(
      growthPageGroups.service.map((page) => ({
        name: page.title,
        path: page.path,
        description: page.description,
      })),
      'STW Movers Barcelona chauffeur service pages',
    ),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ]),
  ]),
)

</script>

<template>
  <div class="home-page services-page">
    <ServicesHero />

    <ServicesDirectory />

    <section class="growth-band growth-band--muted">
      <div class="growth-container">
        <div class="growth-section-head">
          <p class="growth-kicker">Travel your way</p>
          <h2>Compare your options</h2>
        </div>
        <div class="growth-list-grid">
          <NuxtLink v-for="page in growthPageGroups.service.filter(item => /taxi|cab/.test(item.slug))" :key="page.path" class="growth-list-card" :to="page.path">
            <span>{{ page.eyebrow }}</span>
            <h2>{{ page.title }}</h2>
            <p>{{ page.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <HomeLocations />

    <ServicesSteps />

    <HomeFaq />

    <ServicesFinalCta />
  </div>
</template>

<style scoped>
.services-page { background: #111; color: #f5f5f5; }
.services-page :deep(.services-hero) { min-height: 0; height: auto; }
.services-page :deep(.services-hero__inner) { min-height: 0; padding-block: 130px 56px; }
.services-page :deep(.services-hero__title) { font-size: 48px; font-weight: 300; max-width: 780px; line-height: 1.15; }
.services-page :deep(.services-hero__footer) { margin-top: 28px; }
@media(max-width:767px) {
 .services-page :deep(.services-hero__inner) { padding-block: 110px 36px; }
 .services-page :deep(.services-hero__title) { font-size: 34px; }
}
</style>

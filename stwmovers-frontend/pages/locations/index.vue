<script setup lang="ts">
import '~/assets/styles/css/home.css'
import '~/assets/styles/css/growth-seo.css'
import GrowthSeoHub from '~/components/seo/GrowthSeoHub.vue'
import { growthPageGroups } from '~/data/growthSeoPages'
import { breadcrumbSchema, schemaGraph, serviceItemListSchema, webPageSchema } from '~/utils/schema'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Barcelona Chauffeur Service Locations',
  description:
    'Local STW Movers chauffeur service pages for Barcelona airport, Eixample, Sants-Montjuic, Fira Barcelona, cruise port, Sitges, and nearby routes.',
  path: '/locations',
})

useJsonLdSchema(
  'locations-hub-ai-entity',
  schemaGraph([
    webPageSchema({
      id: 'webpage',
      path: '/locations',
      name: 'Barcelona Chauffeur Service Locations',
      description:
        'Local route hub for Barcelona airport, cruise port, city centre, Eixample, Fira Barcelona, Girona, Tarragona, Sitges, and Costa Brava private transfer searches.',
      type: 'CollectionPage',
      about: [
        'Barcelona airport to city centre private transfer',
        'Barcelona airport to cruise port private transfer',
        'Barcelona airport chauffeur service',
        'Barcelona cruise port chauffeur service',
        'Barcelona to Girona private transfer',
        'Barcelona to Tarragona private transfer',
      ],
    }),
    serviceItemListSchema(
      growthPageGroups.location.map((page) => ({
        name: page.title,
        path: page.path,
        description: page.description,
      })),
      'STW Movers Barcelona local chauffeur and transfer pages',
    ),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Locations', path: '/locations' },
    ]),
  ]),
)
</script>

<template>
  <GrowthSeoHub
    title="Barcelona chauffeur service locations"
    eyebrow="Local service areas"
    description="Explore private chauffeur and transfer pages by pickup area, destination, airport, port, venue, and nearby city."
    :pages="growthPageGroups.location"
    kind="location"
  />
</template>

<script setup lang="ts">
import '~/assets/styles/css/home.css'
import '~/assets/styles/css/growth-seo.css'
import GrowthSeoHub from '~/components/seo/GrowthSeoHub.vue'
import { growthPageGroups } from '~/data/growthSeoPages'
import { breadcrumbSchema, schemaGraph, serviceItemListSchema, webPageSchema } from '~/utils/schema'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Barcelona Chauffeur and Airport Transfer Answers',
  description:
    'Concise answers about Barcelona airport transfers, chauffeur service, private drivers, luggage, business travel, family transfers, and booking details.',
  path: '/answers',
})

useJsonLdSchema(
  'answers-hub-ai-entity',
  schemaGraph([
    webPageSchema({
      id: 'webpage',
      path: '/answers',
      name: 'Barcelona Chauffeur and Airport Transfer Answers',
      description:
        'Answer hub for Barcelona taxi, cab, airport transfer, private driver, and chauffeur questions written for travellers and AI answer engines.',
      type: 'CollectionPage',
      about: [
        'Barcelona airport taxi cost',
        'Barcelona taxi app or private transfer',
        'Cab service vs chauffeur',
        'Private driver vs taxi Barcelona',
        'Barcelona airport transfer cost',
      ],
    }),
    serviceItemListSchema(
      growthPageGroups.answer.map((page) => ({
        name: page.title,
        path: page.path,
        description: page.description,
      })),
      'STW Movers Barcelona transfer answer pages',
    ),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Answers', path: '/answers' },
    ]),
  ]),
)
</script>

<template>
  <GrowthSeoHub
    title="Barcelona chauffeur and airport transfer answers"
    eyebrow="AEO answer hub"
    description="Short, direct answers for common Barcelona private driver, airport transfer, and chauffeur booking questions."
    :pages="growthPageGroups.answer"
    kind="answer"
  />
</template>

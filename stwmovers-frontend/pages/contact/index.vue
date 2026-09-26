<script setup lang="ts">
import '~/assets/styles/css/contact.css'
import { routes } from '~/constants/routes'
import { contactFaqItems } from '~/data/contactContent'
import {
  breadcrumbSchema,
  contactPointSchema,
  faqPageSchema,
  schemaGraph,
  webPageSchema,
} from '~/utils/schema'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Contact STW Movers Barcelona Chauffeur Desk',
  description:
    'Contact STW Movers for Barcelona airport transfer, private driver, taxi alternative, cab alternative, hourly chauffeur, cruise port transfer, and executive travel quotes.',
  path: '/contact',
})

useJsonLdSchema(
  'contact-page-ai-entity',
  schemaGraph([
    webPageSchema({
      id: 'webpage',
      path: routes.contact,
      name: 'Contact STW Movers Barcelona Chauffeur Desk',
      description:
        'Contact STW Movers for Barcelona airport transfer, private driver, taxi alternative, cab alternative, hourly chauffeur, cruise port transfer, and executive travel quotes.',
      type: 'ContactPage',
      about: [
        'Barcelona chauffeur quote',
        'Barcelona airport transfer quote',
        'Private driver Barcelona quote',
        'Barcelona taxi alternative quote',
      ],
    }),
    {
      ...contactPointSchema('booking desk'),
      name: 'STW Movers Barcelona chauffeur desk',
    },
    faqPageSchema(
      'Contact STW Movers quote FAQ',
      contactFaqItems.map((item) => ({ question: item.question, answer: item.answer })),
    ),
    breadcrumbSchema([
      { name: 'Home', path: routes.home },
      { name: 'Contact', path: routes.contact },
    ]),
  ]),
)
</script>

<template>
  <div class="home-page contact-page">
    <ContactHero />

    <ContactChannels />

    <ContactAreas />

    <ContactFaq />

    <ContactPromise />
  </div>
</template>

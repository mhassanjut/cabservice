<script setup lang="ts">
import '~/assets/styles/css/faq.css'

import { siteConfig } from '~/config/site'
import { seoDefaults, seoSections } from '~/config/seo'
import { routes } from '~/constants/routes'
import { faqCategories } from '~/data/faqContent'

definePageMeta({ layout: 'home' })

const faq = seoSections.faq

usePageSeo({
  title: faq.pageTitle,
  description: faq.metaDescription,
  path: routes.faq,
})

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || siteConfig.siteUrl).replace(/\/$/, '')

const allItems = faq.categories.flatMap((category) => [...category.items])

useHead({
  script: [
    {
      key: 'ld-json-faq',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: `${faq.pageTitle} | ${seoDefaults.brandName}`,
        description: faq.metaDescription,
        url: `${siteUrl}${routes.faq}`,
        isPartOf: { '@type': 'WebSite', name: seoDefaults.brandName, url: siteUrl },
        mainEntity: allItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div class="home-page faq-page">
    <FaqHero />

    <FaqJumpNav />

    <FaqCategorySection
      v-for="category in faqCategories"
      :key="category.id"
      :category="category"
    />

    <FaqFinalCta />
  </div>
</template>

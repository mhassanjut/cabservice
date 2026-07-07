<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { seoDefaults, seoSections } from '~/config/seo'
import { homeAnchors, routes } from '~/constants/routes'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const faq = seoSections.faq

usePageSeo({
  title: faq.pageTitle,
  description: faq.metaDescription,
  path: routes.faq,
})

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || siteConfig.siteUrl).replace(/\/$/, '')

const allItems = faq.categories.flatMap((category) => [...category.items])

const whatsappUrl = computed(() =>
  buildWhatsappUrl({
    phone: siteConfig.whatsappNumber,
    text: 'Hello STW Movers, I have a question about booking a Barcelona transfer.',
  }),
)

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
  <div class="faq-page">
    <section class="faq-page__hero hero reveal-stagger" aria-labelledby="faq-hero-title">
      <div class="hero__bg" aria-hidden="true" />
      <div class="faq-page__hero-inner">
        <p class="eyebrow">Help centre · Barcelona transfers</p>
        <h1 id="faq-hero-title" class="hero__title font-serif">{{ faq.h1 }}</h1>
        <p class="hero__lead faq-page__lead">{{ faq.lead }}</p>
        <div class="hero__pills">
          <span class="pill pill--gold">BCN airport</span>
          <span class="pill">Fixed pricing</span>
          <span class="pill">Meet &amp; greet</span>
          <span class="pill">Mercedes fleet</span>
        </div>
        <div class="hero__actions">
          <a class="btn btn--solid-gold" :href="homeAnchors.booking">Book a transfer</a>
          <a class="btn secondary" :href="whatsappUrl" rel="noopener noreferrer" target="_blank">
            <i class="fa-brands fa-whatsapp" aria-hidden="true" />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>

    <nav class="faq-page__jump reveal" aria-label="FAQ categories">
      <a v-for="category in faq.categories" :key="category.id" class="faq-page__jump-link" :href="`#${category.id}`">
        {{ category.title }}
      </a>
    </nav>

    <section
      v-for="category in faq.categories"
      :id="category.id"
      :key="category.id"
      class="faq-page__section reveal"
      :aria-labelledby="`${category.id}-heading`"
    >
      <header class="faq-page__section-head">
        <h2 :id="`${category.id}-heading`" class="faq-page__section-title font-serif">
          {{ category.title }}
        </h2>
        <div class="section-heading__rule" aria-hidden="true" />
      </header>
      <div class="site-faq">
        <details v-for="item in category.items" :key="item.q" class="site-faq__item card card--elevated reveal">
          <summary class="site-faq__question font-serif">{{ item.q }}</summary>
          <p class="site-faq__answer">{{ item.a }}</p>
        </details>
      </div>
    </section>

    <section class="faq-page__cta card card--elevated reveal" aria-labelledby="faq-cta-title">
      <div>
        <p class="eyebrow" style="margin: 0">Ready to travel?</p>
        <h2 id="faq-cta-title" class="font-serif faq-page__cta-title">Still have questions about your Barcelona transfer?</h2>
        <p class="faq-page__cta-lead">
          Our concierge desk confirms every trip on WhatsApp before payment — or start with an instant quote online.
        </p>
      </div>
      <div class="faq-page__cta-actions">
        <a class="btn btn--solid-gold" :href="homeAnchors.booking">Get instant quote</a>
        <NuxtLink class="btn secondary" :to="routes.home">Back to home</NuxtLink>
      </div>
    </section>
  </div>
</template>

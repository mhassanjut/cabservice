<script setup lang="ts">
import '~/assets/styles/css/legal.css'
import type { LegalPage } from '~/data/legalPages'

defineProps<{
  page: LegalPage
}>()

const quickLinks = [
  { label: 'Request quote', href: '/journey#book-journey' },
  { label: 'Contact desk', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Service areas', href: '/locations' },
]
</script>

<template>
  <article class="legal-page">
    <header class="legal-hero" aria-labelledby="legal-title">
      <div class="legal-container legal-hero__inner">
        <p class="legal-eyebrow">{{ page.eyebrow }}</p>
        <h1 id="legal-title">{{ page.title }}</h1>
        <p>{{ page.intro }}</p>
        <div class="legal-meta">
          <span>Last updated: {{ page.updated }}</span>
          <span>STW Movers Barcelona</span>
        </div>
      </div>
    </header>

    <section class="legal-band" aria-label="Useful trust links">
      <div class="legal-container legal-band__inner">
        <NuxtLink v-for="link in quickLinks" :key="link.href" :to="link.href">
          {{ link.label }}
        </NuxtLink>
      </div>
    </section>

    <section class="legal-body" aria-labelledby="legal-body-heading">
      <div class="legal-container legal-body__grid">
        <aside class="legal-side" aria-label="Page summary">
          <p class="legal-eyebrow">Quick summary</p>
          <h2 id="legal-body-heading">Clear terms for private Barcelona chauffeur journeys.</h2>
          <p>
            These pages support travellers comparing airport transfer, taxi, cab, private driver, and chauffeur
            services before they request a quote.
          </p>
        </aside>

        <div class="legal-sections">
          <section v-for="section in page.sections" :key="section.heading" class="legal-section">
            <h2>{{ section.heading }}</h2>
            <p>{{ section.body }}</p>
            <ul v-if="section.bullets?.length">
              <li v-for="bullet in section.bullets" :key="bullet">
                {{ bullet }}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>

    <section class="legal-cta" aria-labelledby="legal-cta-heading">
      <div class="legal-container legal-cta__inner">
        <div>
          <p class="legal-eyebrow">Need trip help?</p>
          <h2 id="legal-cta-heading">Send the journey details and the STW Movers desk will guide the next step.</h2>
        </div>
        <NuxtLink to="/journey#book-journey">
          Request private quote
        </NuxtLink>
      </div>
    </section>
  </article>
</template>

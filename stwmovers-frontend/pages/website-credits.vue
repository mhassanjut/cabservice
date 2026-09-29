<script setup lang="ts">
import '~/assets/styles/css/legal.css'
import { siteConfig } from '~/config/site'
import { breadcrumbSchema, schemaGraph, webPageSchema } from '~/utils/schema'

definePageMeta({ layout: 'home' })

const partner = siteConfig.digitalPartner
const pageTitle = 'Website Credits'
const pageDescription =
  'Website credits for STW Movers, including digital strategy, website experience, SEO, AI visibility, and conversion support.'

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  path: '/website-credits',
})

useJsonLdSchema(
  'website-credits',
  schemaGraph([
    webPageSchema({
      id: 'webpage',
      path: '/website-credits',
      name: pageTitle,
      description: pageDescription,
      type: 'AboutPage',
      about: [
        'STW Movers website credits',
        'Digital strategy',
        'Website experience',
        'SEO and AI visibility',
      ],
    }),
    {
      '@type': 'Organization',
      '@id': `${partner.url}/#organization`,
      name: partner.name,
      url: partner.url,
    },
    {
      '@type': 'CreativeWork',
      '@id': `${siteConfig.siteUrl}/website-credits#website-experience`,
      name: 'STW Movers website experience',
      description:
        'Digital strategy, website experience, SEO, AI visibility, and conversion support for STW Movers.',
      creator: {
        '@id': `${partner.url}/#organization`,
      },
      about: {
        '@id': `${siteConfig.siteUrl}/#website`,
      },
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Website Credits', path: '/website-credits' },
    ]),
  ]),
)
</script>

<template>
  <article class="legal-page">
    <header class="legal-hero" aria-labelledby="credits-title">
      <div class="legal-container legal-hero__inner">
        <p class="legal-eyebrow">Website credits</p>
        <h1 id="credits-title">Digital strategy and website experience.</h1>
        <p>
          The STW Movers digital presence is designed to support luxury chauffeur positioning, local SEO,
          AI visibility, and easy lead conversion for Barcelona travellers.
        </p>
        <div class="legal-meta">
          <span>STW Movers Barcelona</span>
          <span>Digital partner credit</span>
        </div>
      </div>
    </header>

    <section class="legal-band" aria-label="Related trust links">
      <div class="legal-container legal-band__inner">
        <NuxtLink to="/about-us">About STW Movers</NuxtLink>
        <NuxtLink to="/services">Services</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
        <a :href="partner.url" target="_blank" rel="noopener noreferrer">{{ partner.name }}</a>
      </div>
    </section>

    <section class="legal-body" aria-labelledby="credits-body-heading">
      <div class="legal-container legal-body__grid">
        <aside class="legal-side">
          <p class="legal-eyebrow">Digital partner</p>
          <h2 id="credits-body-heading">{{ partner.creditLine }}.</h2>
          <p>
            This credit identifies the strategy and website-experience partner behind the local SEO,
            answer-engine visibility, and conversion-focused website work.
          </p>
        </aside>

        <div class="legal-sections">
          <section class="legal-section">
            <h2>Credits</h2>
            <p>
              Digital strategy, website experience, SEO planning, AI visibility support, and conversion
              experience direction for STW Movers are credited to
              <a :href="partner.url" target="_blank" rel="noopener noreferrer">{{ partner.name }}</a>.
            </p>
          </section>

          <section class="legal-section">
            <h2>Scope of work</h2>
            <p>
              The website experience is structured around Barcelona chauffeur, airport transfer, private driver,
              taxi alternative, cab alternative, service-area, route, and Insights content designed for useful
              traveller decisions and quote-ready leads.
            </p>
            <ul>
              <li>Luxury website experience and conversion flow direction</li>
              <li>Local-first SEO, answer-engine optimization, and AI visibility planning</li>
              <li>Service, route, location, and Insight content architecture</li>
              <li>Google Ads landing-page strategy and lead-path support</li>
            </ul>
          </section>
        </div>
      </div>
    </section>

    <section class="legal-cta" aria-labelledby="credits-cta-heading">
      <div class="legal-container legal-cta__inner">
        <div>
          <p class="legal-eyebrow">Partner reference</p>
          <h2 id="credits-cta-heading">View the digital partner behind the STW Movers website experience.</h2>
        </div>
        <a :href="partner.url" target="_blank" rel="noopener noreferrer">
          Visit {{ partner.name }}
        </a>
      </div>
    </section>
  </article>
</template>

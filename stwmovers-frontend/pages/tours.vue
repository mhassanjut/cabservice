<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { seoDefaults, seoSections } from '~/config/seo'
import { homeAnchors, routes } from '~/constants/routes'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const tours = seoSections.tours

usePageSeo({
  title: tours.pageTitle,
  description: tours.metaDescription,
  path: routes.tours,
})

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || siteConfig.siteUrl).replace(/\/$/, '')

const notifyUrl = computed(() =>
  buildWhatsappUrl({
    phone: siteConfig.whatsappNumber,
    text: siteConfig.toursWhatsappMessage,
  }),
)

const mailtoInterest = computed(() => {
  const subject = encodeURIComponent('Private Barcelona tours — early interest')
  const body = encodeURIComponent(
    'Hello STW Movers,\n\nPlease notify me when private Barcelona tours and chauffeur sightseeing bookings open.\n\nPreferred dates:\nParty size:\nInterests (Gaudí, Montserrat, Costa Brava, etc.):\n',
  )
  return `mailto:concierge@stwmovers.com?subject=${subject}&body=${body}`
})

useHead({
  script: [
    {
      key: 'ld-json-tours-coming-soon',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${tours.pageTitle} | ${seoDefaults.brandName}`,
        description: tours.metaDescription,
        url: `${siteUrl}${routes.tours}`,
        isPartOf: { '@type': 'WebSite', name: seoDefaults.brandName, url: siteUrl },
        about: {
          '@type': 'TouristTrip',
          name: tours.primaryTopic,
          touristType: 'Private chauffeur sightseeing',
          itinerary: tours.experiences.map((item) => ({
            '@type': 'TouristDestination',
            name: item.title,
            description: item.summary,
          })),
        },
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
  <div class="tours-page">
    <section class="tours-hero hero reveal-stagger" aria-labelledby="tours-hero-title">
      <div class="hero__bg" aria-hidden="true" />
      <div class="tours-hero__layout">
        <div class="tours-hero__copy">
          <p class="tours-hero__status" role="status">
            <span class="tours-hero__status-dot" aria-hidden="true" />
            Coming soon · Private tours Barcelona
          </p>
          <p class="eyebrow">Barcelona · Gaudí · Montserrat · Costa Brava</p>
          <h1 id="tours-hero-title" class="hero__title font-serif">
            {{ tours.h1 }}
          </h1>
          <p class="hero__lead tours-hero__lead">
            {{ tours.lead }}
          </p>
          <div class="hero__pills">
            <span class="pill pill--gold">100% private</span>
            <span class="pill">Mercedes chauffeur fleet</span>
            <span class="pill">Hotel &amp; port pickup</span>
            <span class="pill">English-speaking drivers</span>
          </div>
          <div class="hero__actions">
            <a class="btn btn--solid-gold" :href="notifyUrl" rel="noopener noreferrer" target="_blank">
              <i class="fa-brands fa-whatsapp" aria-hidden="true" />
              Get launch updates
            </a>
            <NuxtLink class="btn secondary" :to="routes.home">
              Book a transfer now
            </NuxtLink>
          </div>
        </div>

        <aside class="tours-hero__panel card card--elevated reveal" aria-labelledby="tours-panel-title">
          <p class="eyebrow" style="margin: 0">Early access</p>
          <h2 id="tours-panel-title" class="font-serif tours-hero__panel-title">
            Be first to book private Barcelona tours
          </h2>
          <p class="tours-hero__panel-lead">
            We are finalising tailor-made sightseeing routes and Catalonia day trips with the same chauffeur desk
            that handles our airport transfers.
          </p>
          <ul class="tours-hero__checklist">
            <li><i class="fa-solid fa-check" aria-hidden="true" /> Custom Gaudí &amp; Gothic Quarter routes</li>
            <li><i class="fa-solid fa-check" aria-hidden="true" /> Montserrat &amp; Girona private day trips</li>
            <li><i class="fa-solid fa-check" aria-hidden="true" /> No shared groups — your vehicle only</li>
          </ul>
          <a class="btn btn--solid-gold" :href="mailtoInterest" style="width: 100%; margin-top: 1.25rem">
            <i class="fa-solid fa-envelope" aria-hidden="true" />
            Register interest
          </a>
          <p class="help" style="margin-top: 0.875rem">
            Prefer WhatsApp?
            <a :href="notifyUrl" rel="noopener noreferrer" target="_blank">Message the concierge desk</a>
          </p>
        </aside>
      </div>
    </section>

    <section
      class="reveal tours-section"
      style="padding: var(--space-section) 0 0"
      aria-labelledby="tours-experiences-heading"
    >
      <SectionHeading
        title-id="tours-experiences-heading"
        eyebrow="Planned experiences"
        title="Private tours &amp; day trips we are building for Barcelona"
        lead="Keyword-led itineraries travellers search for most — delivered as luxury private chauffeur experiences, not crowded group buses."
      />
      <div class="grid cols-3 tours-experience-grid">
        <article
          v-for="item in tours.experiences"
          :key="item.title"
          class="card card--elevated tours-experience-card reveal"
        >
          <div class="service-card__icon" aria-hidden="true">
            <i :class="['fa-solid', item.icon]" />
          </div>
          <h3>{{ item.title }}</h3>
          <p class="service-card__intro">{{ item.summary }}</p>
          <div class="tours-experience-card__tags">
            <span v-for="tag in item.tags" :key="tag" class="pill">{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <section
      class="reveal tours-section"
      style="padding: var(--space-section) 0 0"
      aria-labelledby="tours-why-heading"
    >
      <div class="tours-compare card card--elevated">
        <div class="tours-compare__copy">
          <SectionHeading
            title-id="tours-why-heading"
            eyebrow="Why STW Movers"
            title="Built for travellers searching private Barcelona tours — not generic hop-on buses"
            lead="Competitors often sell hourly chauffeur blocks or shared excursions. We are launching a tour desk aligned with how our transfer clients already travel: private, punctual, and premium."
            title-level="h2"
          />
          <ul class="tours-compare__list">
            <li>
              <strong>Same Mercedes fleet</strong> — sedans, V Class and Vito vans used for BCN airport transfers.
            </li>
            <li>
              <strong>Chauffeur-first</strong> — English-speaking drivers who know Barcelona timing, traffic, and
              landmark access windows.
            </li>
            <li>
              <strong>Truly private</strong> — no 30-seat minibuses; your group, your itinerary, your pace.
            </li>
            <li>
              <strong>WhatsApp concierge</strong> — the same confirmation flow as our executive transfer bookings.
            </li>
          </ul>
        </div>
        <div class="tours-compare__aside">
          <p class="eyebrow" style="margin: 0 0 0.75rem">Need transport today?</p>
          <p class="tours-compare__aside-title font-serif">Airport &amp; city transfers are live</p>
          <p class="tours-compare__aside-lead">
            Fixed-price Barcelona airport transfers and city-to-city chauffeur routes are available now while tours
            are in development.
          </p>
          <a class="btn btn--solid-gold" :href="homeAnchors.booking" style="width: 100%">
            Get an instant quote
          </a>
        </div>
      </div>
    </section>

    <section
      class="reveal tours-section"
      style="padding: var(--space-section) 0"
      aria-labelledby="tours-faq-heading"
    >
      <SectionHeading
        title-id="tours-faq-heading"
        eyebrow="FAQ"
        title="Private Barcelona tour questions"
        lead="Clear answers for visitors comparing chauffeur tours, day trips, and luxury sightseeing in Barcelona."
      />
      <div class="tours-faq">
        <details v-for="item in tours.faqs" :key="item.q" class="tours-faq__item card card--elevated reveal">
          <summary class="tours-faq__question font-serif">{{ item.q }}</summary>
          <p class="tours-faq__answer">{{ item.a }}</p>
        </details>
      </div>
    </section>
  </div>
</template>

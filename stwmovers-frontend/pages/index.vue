<script setup lang="ts">
import { homeAnchors } from '~/constants/routes'
import { seoDefaults, seoSections } from '~/config/seo'

usePageSeo({
  title: seoDefaults.defaultTitle,
  description: seoDefaults.defaultDescription,
  path: '/',
})
</script>

<template>
  <div>
    <HeroHome>
      <template #booking>
        <BookingForm />
        <p class="hero__booking-note">
          Fixed fares for Barcelona airport transfers and city-to-city routes. Confirmation via WhatsApp before payment.
        </p>
      </template>
    </HeroHome>

    <section
      class="reveal"
      style="padding: var(--space-section) 0 var(--space-block)"
      aria-labelledby="services-heading"
    >
      <SectionHeading
        title-id="services-heading"
        eyebrow="Executive chauffeur"
        title="Private transfer services across Barcelona and Spain"
        lead="Door-to-door airport transfers, in-city executive chauffeur service, and intercity routes — delivered with discretion and fixed pricing."
      />
      <div class="grid cols-3">
        <article class="card card--elevated card--interactive service-card reveal">
          <div class="service-card__icon" aria-hidden="true">
            <i class="fa-solid fa-plane-arrival" />
          </div>
          <h3>Barcelona airport transfers (BCN)</h3>
          <p class="service-card__intro">
            Private El Prat airport transfer with flight tracking, arrivals-hall meet &amp; greet, and direct
            door-to-door service.
          </p>
          <ul>
            <li>BCN to Barcelona city &amp; port</li>
            <li>BCN to business districts &amp; hotels</li>
            <li>English-speaking chauffeurs</li>
          </ul>
        </article>
        <article class="card card--elevated card--interactive service-card reveal">
          <div class="service-card__icon" aria-hidden="true">
            <i class="fa-solid fa-road" />
          </div>
          <h3>City-to-city chauffeur routes</h3>
          <p class="service-card__intro">
            Executive car service from Barcelona to Catalonia's most requested destinations — one vehicle,
            one fixed price.
          </p>
          <ul>
            <li>Barcelona to Sitges</li>
            <li>Barcelona to Girona &amp; Costa Brava</li>
            <li>Barcelona to Tarragona &amp; Costa Dorada</li>
          </ul>
        </article>
        <article class="card card--elevated card--interactive service-card reveal">
          <div class="service-card__icon" aria-hidden="true">
            <i class="fa-solid fa-gem" />
          </div>
          <h3>Executive &amp; on-demand chauffeur</h3>
          <p class="service-card__intro">
            Black-car service for corporate travel, events, and pre-booked hourly chauffeur hire across Barcelona
            and Spain.
          </p>
          <ul>
            <li>Mercedes E Class &amp; S Class sedans</li>
            <li>Mercedes V Class &amp; Vito vans</li>
            <li>Same-day executive dispatch</li>
          </ul>
        </article>
      </div>
    </section>

    <section
      id="routes-section"
      class="reveal routes-section"
      style="padding: 0 0 var(--space-section)"
      aria-labelledby="routes-heading"
    >
      <SectionHeading
        title-id="routes-heading"
        eyebrow="Popular routes"
        title="Fixed-price chauffeur routes from Barcelona"
        lead="Transparent pricing for the routes travellers book most — airport arrivals, coastal escapes, and business travel across Catalonia."
      />
      <div class="grid cols-2 routes-grid">
        <article
          v-for="route in seoSections.home.routes"
          :key="route.slug"
          class="card card--elevated route-card reveal"
        >
          <h3 class="route-card__title font-serif">{{ route.name }}</h3>
          <p class="route-card__note">{{ route.note }}</p>
          <a class="route-card__link" :href="homeAnchors.booking">
            Check availability
            <i class="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </article>
      </div>
    </section>

    <section id="contact" class="reveal" style="padding: 0 0 var(--space-section)" aria-labelledby="contact-title">
      <SectionHeading
        title-id="contact-title"
        eyebrow="Concierge"
        title="Contact our Barcelona chauffeur desk"
        lead="For bespoke routing, corporate accounts, or multi-day executive chauffeur hire — reach the desk directly."
      />
      <ContactSection />
    </section>
  </div>
</template>

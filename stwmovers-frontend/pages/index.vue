<script setup lang="ts">
import { seoDefaults } from '~/config/seo'

usePageSeo({
  title: seoDefaults.defaultTitle,
  description: seoDefaults.defaultDescription,
  path: '/',
})
</script>

<template>
  <div>
    <HeroHome />

    <section
      class="reveal"
      style="padding: var(--space-section) 0 var(--space-block)"
      aria-labelledby="services-heading"
    >
      <SectionHeading
        title-id="services-heading"
        eyebrow="Capabilities"
        title="Transfer services in Barcelona and Spain"
        lead="Curated routing for airport arrivals, inner-city movement, and intercity journeys — executed with the same attention to timing and discretion."
      />
      <div class="grid cols-3">
        <article class="card card--elevated card--interactive service-card reveal">
          <div class="service-card__icon" aria-hidden="true">
            <i class="fa-solid fa-plane-arrival" />
          </div>
          <h3>Barcelona airport</h3>
          <ul>
            <li>BCN to city &amp; business districts</li>
            <li>BCN to Girona, Tarragona, Costa Brava</li>
          </ul>
        </article>
        <article class="card card--elevated card--interactive service-card reveal">
          <div class="service-card__icon" aria-hidden="true">
            <i class="fa-solid fa-city" />
          </div>
          <h3>City transfers</h3>
          <ul>
            <li>Within Barcelona &amp; metropolitan area</li>
            <li>Barcelona to Madrid &amp; major hubs</li>
          </ul>
        </article>
        <article class="card card--elevated card--interactive service-card reveal">
          <div class="service-card__icon" aria-hidden="true">
            <i class="fa-solid fa-road" />
          </div>
          <h3>On-demand</h3>
          <ul>
            <li>Same-day black car</li>
            <li>Pre-booked meet &amp; greet</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="reveal" style="padding: 0 0 var(--space-section)" aria-labelledby="fleet-heading">
      <SectionHeading
        title-id="fleet-heading"
        eyebrow="Fleet"
        title="Curated vehicles"
        lead="Each class is maintained for comfort and luggage capacity — tap a filter to focus the gallery."
      />
      <FleetGallery />
    </section>

    <section
      id="booking-section"
      class="reveal"
      style="padding: 0 0 var(--space-section)"
      aria-labelledby="booking-heading"
    >
      <SectionHeading
        title-id="booking-heading"
        eyebrow="Itinerary"
        title="Reserve your transfer"
        lead="Enter your route and time — fares are calculated instantly for our premium fleet."
      />
      <BookingForm />
      <p class="help reveal" style="margin-top: 14px; max-width: 62ch">
        By continuing, you confirm details with our desk over WhatsApp before payment is accepted.
      </p>
    </section>

    <section id="contact" class="reveal" style="padding: 0 0 var(--space-section)" aria-labelledby="contact-title">
      <SectionHeading
        title-id="contact-title"
        eyebrow="Concierge"
        title="Contact and briefings"
        lead="For bespoke routing, corporate accounts, or multi-day chauffeuring — reach the desk directly."
      />
      <ContactSection />
    </section>
  </div>
</template>

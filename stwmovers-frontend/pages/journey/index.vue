<script setup lang="ts">
import '~/assets/styles/css/contact.css'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Request a Chauffeur Quote in Barcelona',
  description:
    'Request a personalised STW Movers chauffeur quote for Barcelona airport transfers, executive travel, hourly private driver hire, and city-to-city journeys across Catalonia.',
  path: '/journey',
})
</script>

<template>
  <div class="home-page contact-page journey-page">
    <header class="contact-container journey-intro">
      <p class="contact-eyebrow">Book your journey</p>
      <h1>Request a Chauffeur Quote in Barcelona</h1>
      <p class="contact-lead">Private airport transfers, executive travel and journeys across Catalonia.</p>
    </header>

    <ContactBooking journey />

    <ContactFaq />

    <ContactPromise />

  </div>
</template>

<style scoped>
.journey-intro { padding-top: 112px; padding-bottom: 20px; }
.journey-intro h1 { max-width: 850px; margin: 12px 0; font-size: 40px; font-weight: 300; line-height: 1.15; letter-spacing: 0; }
.journey-intro .contact-lead { margin: 0; }
.journey-page :deep(.contact-section--journey) { padding-top: 20px; scroll-margin-top: 90px; }
@media (max-width: 999px) {
  .journey-page :deep(.contact-form-card) { order: -1; }
}
@media (max-width: 767px) {
  .journey-intro { padding-top: 96px; }
  .journey-intro h1 { font-size: 28px; }
}
</style>

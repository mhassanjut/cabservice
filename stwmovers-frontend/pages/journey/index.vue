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
  <div class="home-page contact-page">
    <ContactHero />

    <ContactBooking />

    <ContactChannels />

    <ContactAreas />

    <ContactFaq />

    <ContactPromise />

  </div>
</template>

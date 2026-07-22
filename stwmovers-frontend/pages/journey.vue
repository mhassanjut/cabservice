<script setup lang="ts">
import '~/assets/styles/css/contact.css'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Journey',
  description:
    'Plan your journey with STW Movers. Request a personalised chauffeur quote, reach our 24/7 dispatch teams by phone, email, or WhatsApp, and plan executive travel across Barcelona and Spain.',
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

    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
import '~/assets/styles/css/contact.css'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Contact Us',
  description:
    'Contact STW Movers for executive chauffeur bookings, corporate accounts, and travel support. Reach our 24/7 dispatch team by phone, email, or WhatsApp across Barcelona and Spain.',
  path: '/contact',
})
</script>

<template>
  <div class="home-page contact-page">
    <ContactHero />

    <ContactChannels />

    <ContactAreas />

    <ContactFaq />

    <ContactPromise />
  </div>
</template>

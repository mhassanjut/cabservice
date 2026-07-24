<script setup lang="ts">
import '~/assets/styles/css/about.css'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'About Us',
  description:
    'More than a chauffeur service — discover the people, philosophy, and promise behind STW Movers. Executive chauffeurs in Barcelona and across Spain, driven by hospitality and attention to detail.',
  path: '/about-us',
})
</script>

<template>
  <div class="home-page about-page">
    <AboutHero />

    <AboutPhilosophy />

    <AboutPeople />

    <AboutHighlights />

    <AboutGallery />

    <AboutPromise />

    <AboutTestimonial />

    <AboutFinalCta />

  </div>
</template>

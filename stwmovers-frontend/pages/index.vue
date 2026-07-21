<script setup lang="ts">
import { seoDefaults, seoSections } from '~/config/seo'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: seoDefaults.defaultTitle,
  description: seoDefaults.defaultDescription,
  path: '/',
})
</script>

<template>
  <div class="home-page">
    <HomeHero />

    <HomeExperience />

    <HomeJourneys />

    <HomeValues />

    <HomeFleet />

    <HomeLocations />

    <HomeCorporateBanner />

    <HomeBookingSteps />

    <HomeCtaBanner />

    <HomeTestimonials />

    <HomeFaq />

    <section id="contact" class="home-section home-contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading" class="home-display home-display--md" style="margin: 0 0 1rem">
        Contact our Barcelona chauffeur desk
      </h2>
      <p class="home-lead home-lead--sm" style="margin: 0 0 3rem">
        For bespoke routing, corporate accounts, or multi-day executive chauffeur hire — reach the desk directly.
      </p>
      <ContactSection />
    </section>

    <HomeFooter />

    <!-- Crawlable SEO keywords — visually hidden -->
    <p class="visually-hidden">
      {{ seoSections.home.keywords.join(', ') }}.
      {{ seoSections.home.serviceGroups.join('. ') }}.
    </p>
  </div>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

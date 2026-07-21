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

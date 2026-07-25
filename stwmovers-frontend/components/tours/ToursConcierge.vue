<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const conciergeLink = computed(() =>
  buildWhatsappUrl({ phone: siteConfig.whatsappNumber, text: siteConfig.toursWhatsappMessage }),
)
</script>

<template>
  <section class="home-section tp-unique" aria-labelledby="tp-unique-heading">
    <div class="container tp-unique__inner">
      <h2 id="tp-unique-heading" class="home-display tp-unique__title">Looking For Something Unique?</h2>
      <p class="home-lead tp-unique__lead">
        Our concierge team can create a fully personalized itinerary based on your interests, schedule, and
        travel style.
      </p>
      <div class="tp-unique__actions">
        <a class="home-btn" :href="conciergeLink" rel="noopener noreferrer" target="_blank">Build My Tour</a>
        <a class="home-btn home-btn--outline" :href="conciergeLink" rel="noopener noreferrer" target="_blank">
          Speak With Concierge
        </a>
      </div>
    </div>
  </section>
</template>

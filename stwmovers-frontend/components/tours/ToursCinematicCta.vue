<script setup lang="ts">
import cinematicCtaUrl from '~/assets/images/tour-page/cinematic-cta.png?url'
import { siteConfig } from '~/config/site'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const planTourLink = computed(() =>
  buildWhatsappUrl({ phone: siteConfig.whatsappNumber, text: siteConfig.toursWhatsappMessage }),
)
</script>

<template>
  <section class="tp-cta" aria-labelledby="tp-cta-heading">
    <div class="container">
      <div class="tp-cta__inner">
        <div class="tp-cta__media" aria-hidden="true">
          <img :src="cinematicCtaUrl" alt="" loading="lazy" decoding="async" width="1440" height="520" />
          <div class="tp-cta__overlay" />
        </div>
        <div class="tp-cta__content">
          <h2 id="tp-cta-heading">Ready To Explore Spain?</h2>
          <p>Choose one of our signature experiences or let us design a private journey created exclusively for you.</p>
          <div class="tp-cta__actions">
            <a class="home-btn home-btn--white" href="#tours-listing">Browse Tours</a>
            <a class="home-btn home-btn--outline-light" :href="planTourLink" rel="noopener noreferrer" target="_blank">
              Plan Tour
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

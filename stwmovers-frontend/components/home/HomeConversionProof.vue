<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const proofItems = [
  {
    value: '24/7',
    label: 'Quote and trip support',
  },
  {
    value: 'BCN',
    label: 'Airport, cruise port, and hotel routes',
  },
  {
    value: 'Private',
    label: 'Chauffeur service, never shared shuttle',
  },
  {
    value: '08015',
    label: 'Local Barcelona base in Eixample',
  },
]

const whatsappHref = buildWhatsappUrl({
  phone: siteConfig.whatsappNumber,
  text: 'Hello STW Movers, I want a private chauffeur quote in Barcelona.',
})
</script>

<template>
  <section class="home-proof" aria-labelledby="home-proof-heading">
    <div class="container home-proof__inner">
      <div class="home-proof__copy">
        <p class="home-eyebrow">Built for confident booking</p>
        <h2 id="home-proof-heading">A luxury Barcelona transfer desk for visitors ready to move.</h2>
        <p>
          Send the trip details once. STW Movers plans the vehicle fit, route, timing, luggage, and chauffeur handoff
          before pickup, so you can arrive knowing your private journey is arranged.
        </p>
      </div>

      <div class="home-proof__panel" aria-label="STW Movers booking proof">
        <div class="home-proof__stats">
          <div v-for="item in proofItems" :key="item.label" class="home-proof__stat">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>

        <div class="home-proof__actions">
          <NuxtLink class="home-proof__btn home-proof__btn--gold" to="/journey#book-journey">
            Request Quote
          </NuxtLink>
          <a class="home-proof__btn home-proof__btn--ghost" :href="whatsappHref" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

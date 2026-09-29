<script setup lang="ts">
const trustLinks = [
  { label: 'Terms & Conditions', href: '/terms-and-conditions', note: 'Booking terms for private chauffeur journeys' },
  { label: 'Privacy Policy', href: '/privacy-policy', note: 'How quote and trip details are handled' },
  { label: 'Cancellation Policy', href: '/cancellation-policy', note: 'Change, cancellation, and waiting guidance' },
  { label: 'FAQ', href: '/faq', note: 'Airport transfer, cab, taxi, luggage, and route answers' },
  { label: 'Service Areas', href: '/locations', note: 'Barcelona Airport, Eixample, Fira, cruise port, and beyond' },
  { label: 'Contact', href: '/contact', note: 'Speak with the STW Movers desk before booking' },
]
</script>

<template>
  <section class="about-section about-trust" aria-labelledby="about-trust-heading">
    <div class="about-container">
      <div class="about-trust__head">
        <p class="about-eyebrow">Trust and booking clarity</p>
        <h2 id="about-trust-heading" class="about-heading about-heading--sm">
          Everything a traveller needs before choosing a private Barcelona chauffeur.
        </h2>
      </div>
      <div class="about-trust__grid">
        <NuxtLink v-for="link in trustLinks" :key="link.href" :to="link.href" class="about-trust__card">
          <span>{{ link.label }}</span>
          <small>{{ link.note }}</small>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

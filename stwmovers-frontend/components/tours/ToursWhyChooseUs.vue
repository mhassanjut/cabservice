<script setup lang="ts">
const highlights = [
  'Private Chauffeur',
  'Luxury Mercedes Fleet',
  'Hotel Pickup',
  'Local Knowledge',
  'Custom Itineraries',
]
</script>

<template>
  <section class="home-section home-section--white tp-why" aria-labelledby="tp-why-heading">
    <div class="container tp-why__inner">
      <div class="tp-why__media">
        <NuxtImg
          src="/img/about/chauffeur-1.png"
          alt="Chauffeur welcoming guests to a private tour vehicle"
          loading="lazy"
          decoding="async"
          width="640"
          height="480"
          sizes="xs:100vw sm:100vw md:50vw"
        />
      </div>
      <div class="tp-why__copy">
        <h2 id="tp-why-heading" class="visually-hidden">Why choose our private tours</h2>
        <p class="tp-why__lead">
          Every experience combines luxury transportation, local expertise, flexible itineraries, and
          exceptional hospitality, allowing you to enjoy every destination without worrying about the journey.
        </p>
        <ul class="tp-checklist">
          <li v-for="item in highlights" :key="item">
            <i class="fa-solid fa-check" aria-hidden="true" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
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

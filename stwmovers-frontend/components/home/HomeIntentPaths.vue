<script setup lang="ts">
const intentPaths = [
  {
    icon: 'fa-plane-arrival',
    title: 'Barcelona Airport Transfer',
    body: 'Pre-booked BCN airport pickup for arrivals, departures, hotels, cruise port links, families, and luggage-heavy journeys.',
    href: '/airport-transfer-barcelona',
  },
  {
    icon: 'fa-user-tie',
    title: 'Private Driver Barcelona',
    body: 'A dedicated private driver for meetings, dinners, shopping, sightseeing, business guests, and flexible city movement.',
    href: '/private-driver-barcelona',
  },
  {
    icon: 'fa-taxi',
    title: 'Taxi & Cab Alternative',
    body: 'For travellers searching Barcelona taxi, airport cab, or cab service who want a more planned private chauffeur experience.',
    href: '/barcelona-taxi-alternative',
  },
  {
    icon: 'fa-clock',
    title: 'Hourly Chauffeur',
    body: 'Book by the hour when you need waiting time, multiple stops, event transport, or a vehicle that stays with you.',
    href: '/services/hourly-chauffeur-barcelona',
  },
]
</script>

<template>
  <section class="home-section home-intent" aria-labelledby="home-intent-heading">
    <div class="container">
      <div class="home-intent__head">
        <p class="home-eyebrow">Choose your route</p>
        <h2 id="home-intent-heading" class="home-display home-display--md">
          Barcelona airport transfers and private chauffeur services.
        </h2>
      </div>
      <div class="home-intent__grid">
        <NuxtLink v-for="path in intentPaths" :key="path.href" :to="path.href" class="home-intent__card">
          <span class="home-intent__icon">
            <i class="fa-solid" :class="path.icon" aria-hidden="true" />
          </span>
          <span class="home-intent__title">{{ path.title }}</span>
          <span class="home-intent__body">{{ path.body }}</span>
          <span class="home-intent__link">Explore service</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

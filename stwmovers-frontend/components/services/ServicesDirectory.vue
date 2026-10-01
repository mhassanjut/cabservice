<script setup lang="ts">
const groups = [
  { title: 'Transfers', description: 'A smooth arrival and a direct journey onward.', items: [
    { title: 'Airport transfers', body: 'Private pickups and departures at Barcelona El Prat.', image: '/img/home/generated/luxury-service-background-v1.webp', href: '/services/barcelona-airport-transfer' },
    { title: 'Cruise port transfers', body: 'Connect your cruise terminal, hotel and airport.', image: '/img/home/generated/hero-cruise-port-v2.webp', href: '/services/barcelona-cruise-port-transfer' },
    { title: 'City-to-city transfers', body: 'Travel directly to Sitges, Girona and the Costa Brava.', image: '/img/home/generated/chauffeur-arrival-detail-v1.webp', href: '/services/city-to-city-transfers-barcelona' },
  ] },
  { title: 'Chauffeur', description: 'A private driver, with the time and attention your day deserves.', items: [
    { title: 'Private driver', body: 'Point-to-point journeys, dinners and city appointments.', image: '/img/home/generated/chauffeur-arrival-detail-v1.webp', href: '/services/private-driver-barcelona' },
    { title: 'Hourly chauffeur', body: 'One driver for multiple stops and flexible schedules.', image: '/img/home/generated/chauffeur-arrival-detail-v1.webp', href: '/services/hourly-chauffeur-barcelona' },
    { title: 'Executive travel', body: 'Professional transport for meetings, events and guests.', image: '/img/home/generated/executive-corporate-transfer-v1.webp', href: '/services/executive-chauffeur-barcelona' },
  ] },
  { title: 'Group travel', description: 'Space for the people and luggage travelling with you.', items: [
    { title: 'Van & group transfers', body: 'Share your passenger and luggage count for the right vehicle.', image: '/img/home/fleet-section/mercedes-v-class.webp', href: '/services/barcelona-van-transfer' },
    { title: 'Family transfers', body: 'Plan airport travel around your family and luggage needs.', image: '/img/home/generated/luxury-service-background-v1.webp', href: '/services/family-airport-transfer-barcelona' },
    { title: 'Private tours', body: 'Explore Barcelona with an itinerary shaped around you.', image: '/img/tours/hero.webp', href: '/tours' },
  ] },
]
</script>
<template>
  <section class="service-directory services-container" aria-labelledby="service-directory-title">
    <p class="services-eyebrow">Choose your journey</p><h2 id="service-directory-title">The right service for your plans.</h2>
    <div v-for="group in groups" :key="group.title" class="service-directory__group">
      <div class="service-directory__heading"><h3>{{ group.title }}</h3><p>{{ group.description }}</p></div>
      <div class="service-directory__grid">
        <NuxtLink v-for="item in group.items" :key="item.href" :to="item.href" class="service-directory__card">
          <NuxtImg :src="item.image" :alt="item.title + ' in Barcelona'" width="600" height="375" sizes="sm:100vw md:50vw lg:33vw" loading="lazy" />
          <div><h4>{{ item.title }}</h4><p>{{ item.body }}</p><span>Explore service <i class="fa-solid fa-arrow-right" aria-hidden="true" /></span></div>
        </NuxtLink>
      </div>
    </div>
    <div class="service-directory__vehicle"><div><h3>Choose comfort that fits your group.</h3><p>Compare our vehicles, then share your passengers and luggage so we can confirm the right fit.</p></div><NuxtLink class="services-btn services-btn--gold" to="/#fleet">Explore the fleet</NuxtLink></div>
  </section>
</template>
<style scoped>
.service-directory { padding-block: 48px; }
.service-directory h2 { font-size: 36px; font-weight: 300; line-height: 1.2; letter-spacing: 0; margin: 12px 0 36px; }
.service-directory__group { margin-bottom: 40px; }
.service-directory__heading { display: flex; align-items: baseline; gap: 24px; margin-bottom: 18px; }
.service-directory h3 { font-size: 24px; font-weight: 300; margin: 0; letter-spacing: 0; }
.service-directory p { color: rgba(var(--theme-ink-rgb), 1); font-size: 15px; line-height: 1.6; }
.service-directory__grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 22px; }
.service-directory__card { border: 1px solid rgba(var(--theme-ink-rgb), 0.125); border-radius: 8px; overflow: hidden; color: rgba(var(--theme-ink-rgb), 1); background: rgba(var(--theme-shade-rgb), 1); text-decoration: none; }
.service-directory__card img { display: block; width: 100%; height: auto; aspect-ratio: 8 / 5; object-fit: cover; }
.service-directory__card > div { padding: 22px; }
.service-directory h4 { font-size: 22px; font-weight: 300; margin: 0; letter-spacing: 0; }
.service-directory__card span { color: #e5c36c; font-size: 13px; }
.service-directory__card i { margin-left: 8px; }
.service-directory__vehicle { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding-top: 28px; border-top: 1px solid rgba(var(--theme-ink-rgb), 0.141); }
@media(max-width:767px) {
 .service-directory h2 { font-size: 28px; }
 .service-directory__heading, .service-directory__vehicle { display: block; }
 .service-directory__grid { grid-template-columns: 1fr; }
 .service-directory__heading p { margin-top: 8px; }
}
</style>

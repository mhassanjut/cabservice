<script setup lang="ts">
import { siteConfig } from '~/config/site'

definePageMeta({ layout: 'home' })

usePageSeo({
  title: 'Chauffeur Service in Barcelona 08015',
  description:
    'Private chauffeur service for Barcelona 08015: BCN airport transfers, early departures, executive travel, hourly hire, Mercedes vehicles, and WhatsApp booking support.',
  path: '/chauffeur-service-barcelona-08015',
})

useServicePageSchema(
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteConfig.siteUrl}/chauffeur-service-barcelona-08015#service`,
    name: 'Chauffeur Service in Barcelona 08015',
    serviceType: 'Chauffeur Service',
    description:
      'Private chauffeur service for Barcelona 08015, including BCN airport transfers, executive transport, hourly private driver hire, and fixed-quote journeys across Barcelona.',
    provider: {
      '@type': 'Organization',
      '@id': `${siteConfig.siteUrl}/#organization`,
      name: 'STW Movers',
      url: `${siteConfig.siteUrl}/`,
    },
    areaServed: [
      { '@type': 'PostalAddress', postalCode: '08015', addressLocality: 'Barcelona', addressCountry: 'ES' },
      { '@type': 'City', name: 'Barcelona' },
    ],
    availableLanguage: ['English', 'Spanish'],
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.siteUrl}/journey`,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  },
  'chauffeur-service-barcelona-08015',
)

const faqs = [
  {
    question: 'Can I book a chauffeur from Barcelona 08015 to BCN Airport?',
    answer:
      'Yes. STW Movers provides private transfers from Barcelona 08015 to Barcelona-El Prat Airport with route planning, vehicle selection, and WhatsApp confirmation before travel.',
  },
  {
    question: 'Do you handle early airport departures?',
    answer:
      'Yes. Early morning transfers can be requested when booking. Share your pickup time, terminal, passengers, luggage, and flight details so the dispatch team can confirm availability.',
  },
  {
    question: 'What happens if my flight is delayed?',
    answer:
      'For airport arrivals, share your flight number so the team can monitor arrival time and coordinate the chauffeur pickup around reasonable delays.',
  },
  {
    question: 'Which vehicle should I choose for luggage?',
    answer:
      'Sedans are best for smaller parties with standard luggage. Mercedes V Class, Vito, and larger vans are better for families, groups, or extra bags.',
  },
  {
    question: 'Can I request child seats?',
    answer:
      'Child seats are available on request. Add the ages and seat requirements when you enquire so the correct setup can be confirmed before pickup.',
  },
]
</script>

<template>
  <div class="home-page local-service-page">
    <section class="local-service-hero" aria-labelledby="local-service-heading">
      <div class="container local-service-hero__inner">
        <p class="home-eyebrow">08015 Barcelona</p>
        <h1 id="local-service-heading" class="home-display home-display--lg">
          Chauffeur Service in Barcelona 08015
        </h1>
        <p class="home-lead">
          Private driver hire, BCN airport transfers, and executive transport for pickups around
          Barcelona 08015 and central Barcelona.
        </p>
        <div class="local-service-hero__actions">
          <NuxtLink class="home-btn" to="/journey#book-journey">Request a fixed quote</NuxtLink>
          <NuxtLink class="local-service-hero__link" to="/airport-transfer">View airport transfers</NuxtLink>
        </div>
      </div>
    </section>

    <section class="home-section" aria-labelledby="local-service-details-heading">
      <div class="container local-service-grid">
        <div class="local-service-copy">
          <h2 id="local-service-details-heading" class="home-display home-display--md">
            Useful chauffeur coverage for 08015, Eixample, and central Barcelona
          </h2>
          <p>
            STW Movers is a chauffeur and airport-transfer service. The team supports private
            journeys from Barcelona 08015 to BCN Airport, hotels, offices, event venues, cruise
            terminals, and selected city-to-city destinations across Catalonia.
          </p>
          <p>
            This page is intentionally specific: it helps travellers in and around 08015 understand
            the booking process, vehicle fit, airport timing, and support options without turning the
            postcode into a doorway page.
          </p>
        </div>

        <div class="local-service-panel" aria-label="Popular requests">
          <h2>Popular 08015 chauffeur requests</h2>
          <ul>
            <li>Early BCN airport departures</li>
            <li>Meet &amp; greet airport arrivals</li>
            <li>Hourly chauffeur hire for meetings</li>
            <li>Mercedes sedan or van selection</li>
            <li>Private transfers to Sitges, Girona, and Tarragona</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="home-section local-service-answers" aria-labelledby="local-service-answers-heading">
      <div class="container">
        <header class="local-service-section-head">
          <p class="home-eyebrow">Answers before booking</p>
          <h2 id="local-service-answers-heading" class="home-display home-display--md">
            08015 airport transfer and chauffeur questions
          </h2>
        </header>

        <div class="local-service-faqs">
          <article v-for="item in faqs" :key="item.question" class="local-service-faq">
            <h3>{{ item.question }}</h3>
            <p>{{ item.answer }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="home-section" aria-labelledby="local-service-links-heading">
      <div class="container local-service-links">
        <h2 id="local-service-links-heading" class="home-display home-display--md">Plan the right journey</h2>
        <NuxtLink to="/airport-transfer">Barcelona Airport Transfer</NuxtLink>
        <NuxtLink to="/chauffeur-service">Private Chauffeur Barcelona</NuxtLink>
        <NuxtLink to="/executive-business-travel">Executive Business Travel</NuxtLink>
        <NuxtLink to="/#fleet">Mercedes Fleet</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.local-service-hero {
  display: grid;
  align-items: end;
  min-height: min(680px, 92vh);
  padding-block: clamp(8rem, 14vw, 11rem) clamp(3rem, 6vw, 5rem);
  color: rgba(var(--theme-ink-rgb), 1);
  background:
    linear-gradient(90deg, rgba(var(--theme-shade-rgb), 0.9), rgba(var(--theme-shade-rgb), 0.5)),
    url('/img/home/_original/journey-montjuic.jpg') center / cover;
}

.local-service-hero__inner {
  display: grid;
  gap: 1rem;
  max-width: 48rem;
}

.local-service-hero__inner > * {
  margin: 0;
}

.local-service-hero .home-lead,
.local-service-hero .home-eyebrow {
  color: rgba(var(--theme-ink-rgb), 0.82);
}

.local-service-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.local-service-hero__link {
  color: rgba(var(--theme-ink-rgb), 1);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

.local-service-grid {
  display: grid;
  gap: clamp(2rem, 5vw, 4rem);
}

.local-service-copy {
  display: grid;
  gap: 1rem;
}

.local-service-copy > * {
  margin: 0;
}

.local-service-copy p,
.local-service-faq p {
  color: rgba(var(--theme-ink-rgb), 0.72);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
}

.local-service-panel {
  align-self: start;
  padding: clamp(1.5rem, 3vw, 2rem);
  border: 1px solid rgba(var(--theme-ink-rgb), 0.12);
  border-radius: 8px;
  background: rgba(var(--theme-surface-rgb), 1);
}

.local-service-panel h2 {
  margin: 0 0 1rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.125rem;
}

.local-service-panel ul {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.local-service-panel li {
  color: rgba(var(--theme-ink-rgb), 0.78);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.5;
}

.local-service-panel li::before {
  content: "✓";
  margin-right: 0.5rem;
  color: #b98f44;
  font-weight: 700;
}

.local-service-answers {
  background: rgba(var(--theme-surface-rgb), 1);
}

.local-service-section-head {
  display: grid;
  gap: 0.75rem;
  margin-bottom: clamp(1.5rem, 4vw, 3rem);
}

.local-service-section-head > * {
  margin: 0;
}

.local-service-faqs {
  display: grid;
  gap: 1rem;
}

.local-service-faq {
  padding-block: 1.25rem;
  border-top: 1px solid rgba(var(--theme-ink-rgb), 0.14);
}

.local-service-faq h3 {
  margin: 0 0 0.5rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1.0625rem;
  line-height: 1.35;
}

.local-service-faq p {
  margin: 0;
}

.local-service-links {
  display: grid;
  gap: 0.875rem;
}

.local-service-links h2 {
  margin: 0 0 0.75rem;
}

.local-service-links a {
  display: flex;
  justify-content: space-between;
  padding-block: 0.875rem;
  border-bottom: 1px solid rgba(var(--theme-ink-rgb), 0.14);
  color: rgba(var(--theme-ink-rgb), 1);
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
  text-decoration: none;
}

.local-service-links a::after {
  content: "→";
  color: #b98f44;
}

@media (min-width: 860px) {
  .local-service-grid {
    grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
  }

  .local-service-faqs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 2rem;
  }
}
</style>

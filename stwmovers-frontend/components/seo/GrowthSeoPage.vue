<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { growthBookingSteps, type GrowthPage } from '~/data/growthSeoPages'
import { trackMarketingEvent } from '~/utils/marketingEvents'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const props = defineProps<{ page: GrowthPage }>()

const whatsappHref = buildWhatsappUrl({
  phone: siteConfig.whatsappNumber,
  text: `Hello STW Movers, I want a private chauffeur quote for ${props.page.title}.`,
})

const marketIntent = computed(() => {
  if (props.page.kind === 'answer') {
    return {
      heading: 'For taxi, cab, and private driver searches',
      body:
        'Many travellers compare Barcelona taxi, cab, and private driver options before booking. STW Movers is positioned for travellers who want the directness of a taxi with a more planned, private chauffeur experience.',
    }
  }

  if (props.page.kind === 'location') {
    return {
      heading: 'Private taxi and cab alternative for this route',
      body:
        'This page supports common local searches such as Barcelona taxi service, private cab, airport cab, and chauffeur near this pickup area, while keeping the offer clearly premium and pre-booked.',
    }
  }

  return {
    heading: 'Private taxi and cab alternative in Barcelona',
    body:
      'For travellers searching taxi, cab, airport taxi, or private driver in Barcelona, STW Movers offers a pre-booked chauffeur option with clearer timing, vehicle planning, and direct support.',
  }
})

const searchIntentChips = [
  'Barcelona taxi',
  'Barcelona cab',
  'Airport taxi BCN',
  'Private cab Barcelona',
  'Private driver',
  'Chauffeur service',
]

const heroTrustLinks = computed(() => [
  {
    label: 'Barcelona based',
    href: '/locations',
    action: 'service_area_link',
  },
  {
    label: 'Airport and cruise port',
    href: '/services/barcelona-airport-transfer',
    action: 'airport_service_link',
  },
  {
    label: 'Executive vehicles',
    href: '/services/executive-chauffeur-barcelona',
    action: 'executive_service_link',
  },
  {
    label: 'WhatsApp support',
    href: whatsappHref,
    action: 'whatsapp',
    external: true,
  },
])
const bookingSteps = computed(() => growthBookingSteps(props.page))

const trackGrowthHeroAction = (action: string, label: string, location = 'hero') => {
  trackMarketingEvent('growth_page_hero_action_clicked', {
    action,
    label,
    location,
    page_slug: props.page.slug,
    page_path: props.page.path,
    page_kind: props.page.kind,
  })
}

const updatedLabel = computed(() => {
  if (!props.page.lastUpdated) return 'September 21, 2026'

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${props.page.lastUpdated}T00:00:00Z`))
})

const comparisonRows = computed(() => {
  const pageSpecific =
    props.page.kind === 'answer'
      ? 'Useful when you want a planned answer for route, luggage, waiting, or schedule questions before booking.'
      : props.page.kind === 'location'
        ? 'Useful when pickup access, local meeting point, luggage, or airport timing should be planned before arrival.'
        : 'Useful when vehicle fit, route timing, and pickup details should be agreed before the journey.'

  return [
    {
      factor: 'Best fit',
      stw: pageSpecific,
      taxi: 'Useful for simple on-demand city rides when immediate availability is the main priority.',
    },
    {
      factor: 'Booking style',
      stw: 'Pre-booked private quote with pickup, destination, passengers, luggage, and timing reviewed in advance.',
      taxi: 'Usually chosen at the moment of travel, with less planning around luggage, stops, or hosting needs.',
    },
    {
      factor: 'Experience',
      stw: 'Private chauffeur vehicle, direct support, airport and cruise port planning, and premium presentation.',
      taxi: 'Standard cab experience that can work well for short routes but may vary by queue, vehicle, and timing.',
    },
  ]
})

const proofItems = [
  {
    label: 'Fixed private quote',
    detail: 'Know the transfer plan before pickup, with route, vehicle, and timing agreed in advance.',
  },
  {
    label: 'Airport ready',
    detail: 'Flight-aware pickup planning for BCN arrivals, hotel transfers, cruise port trips, and return journeys.',
  },
  {
    label: 'Premium cab alternative',
    detail: 'The convenience people search for in a taxi or cab, with the comfort of a private chauffeur.',
  },
]

const quoteChecklist = computed(() => {
  if (props.page.slug.includes('airport')) {
    return ['Flight number', 'Terminal if known', 'Destination address', 'Passengers and luggage']
  }

  if (props.page.slug.includes('hourly') || props.page.slug.includes('private-driver')) {
    return ['Start time', 'Pickup location', 'Approximate duration', 'Key stops']
  }

  if (props.page.slug.includes('cruise') || props.page.slug.includes('port')) {
    return ['Ship or terminal', 'Pickup time', 'Passenger count', 'Luggage count']
  }

  return ['Pickup and drop-off', 'Date and time', 'Passengers', 'Luggage or special requests']
})

const assuranceItems = [
  {
    title: 'Luxury without friction',
    body:
      'The page keeps the quote path visible for paid traffic while still answering the detailed questions organic and AI visitors need.',
  },
  {
    title: 'Search language covered',
    body:
      'Taxi, cab, private driver, chauffeur, and airport transfer wording is included naturally so the page matches how travellers search.',
  },
  {
    title: 'Decision support',
    body:
      'Comparison tables, FAQs, and booking steps reduce hesitation before a visitor sends trip details.',
  },
]
</script>

<template>
  <article class="growth-page home-page">
    <section class="growth-hero">
      <div class="growth-hero__media" aria-hidden="true">
        <NuxtImg
          :src="page.image"
          :alt="page.title"
          sizes="100vw sm:100vw md:100vw lg:100vw"
          densities="x1 x2"
          format="webp"
          loading="eager"
          preload
        />
      </div>
      <div class="growth-hero__overlay" />
      <div class="growth-container growth-hero__inner">
        <div class="growth-hero__copy">
          <p class="growth-eyebrow">{{ page.eyebrow }}</p>
          <h1>{{ page.title }}</h1>
          <p class="growth-hero__summary">{{ page.summary }}</p>
          <p class="growth-freshness">
            Last updated {{ updatedLabel }}. Reviewed by {{ page.reviewedBy || 'STW Movers' }}.
          </p>
          <div class="growth-actions">
            <NuxtLink
              v-if="page.primaryCta"
              class="growth-btn growth-btn--primary"
              :to="page.primaryCta.href"
              @click="trackGrowthHeroAction('quote_form', page.primaryCta.label)"
            >
              {{ page.primaryCta.label }}
            </NuxtLink>
            <a
              class="growth-btn growth-btn--light"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              @click="trackGrowthHeroAction('whatsapp', 'WhatsApp trip details')"
            >
              WhatsApp trip details
            </a>
          </div>
          <ul class="growth-trust-row" aria-label="Service highlights">
            <li v-for="item in heroTrustLinks" :key="item.label">
              <a
                v-if="item.external"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                @click="trackGrowthHeroAction(item.action, item.label, 'hero_trust_pill')"
              >
                {{ item.label }}
              </a>
              <NuxtLink
                v-else
                :to="item.href"
                @click="trackGrowthHeroAction(item.action, item.label, 'hero_trust_pill')"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <aside class="growth-quote-card" aria-label="Fast quote">
          <p class="growth-quote-card__eyebrow">Fast private quote</p>
          <h2>Get a private transfer quote before you travel.</h2>
          <p>
            Send pickup, drop-off, date, time, passengers, and luggage. We will match the right chauffeur vehicle.
          </p>
          <div class="growth-quote-card__actions">
            <NuxtLink class="growth-btn growth-btn--primary" to="/journey#book-journey">
              Get private quote
            </NuxtLink>
            <a class="growth-btn growth-btn--outline-dark" :href="`tel:${siteConfig.contactPhone}`">
              Call STW Movers
            </a>
          </div>
        </aside>
      </div>
    </section>

    <section class="growth-intent-strip" aria-label="Popular transfer searches">
      <div class="growth-container growth-intent-strip__inner">
        <div>
          <p class="growth-kicker">Popular transfer searches</p>
          <h2>{{ marketIntent.heading }}</h2>
          <p>{{ marketIntent.body }}</p>
        </div>
        <div class="growth-intent-chips">
          <span v-for="chip in searchIntentChips" :key="chip">{{ chip }}</span>
        </div>
      </div>
    </section>

    <section class="growth-proof-band" aria-label="Why travellers pre-book STW Movers">
      <div class="growth-container growth-proof-band__inner">
        <section v-for="item in proofItems" :key="item.label" class="growth-proof-item">
          <span>{{ item.label }}</span>
          <p>{{ item.detail }}</p>
        </section>
      </div>
    </section>

    <section class="growth-conversion-band" aria-labelledby="growth-conversion-heading">
      <div class="growth-container growth-conversion-band__inner">
        <div>
          <p class="growth-kicker">Conversion ready</p>
          <h2 id="growth-conversion-heading">Built for Google Ads, organic search, and AI answer traffic</h2>
          <p>
            This page gives high-intent visitors a fast quote path, a premium taxi and cab alternative message, and
            enough detail to decide whether STW Movers fits the trip.
          </p>
        </div>
        <aside class="growth-mini-checklist" aria-label="Quote checklist">
          <p class="growth-kicker">Quote checklist</p>
          <ul>
            <li v-for="item in quoteChecklist" :key="item">{{ item }}</li>
          </ul>
        </aside>
      </div>
      <div class="growth-container growth-assurance-grid">
        <section v-for="item in assuranceItems" :key="item.title" class="growth-assurance-card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </section>
      </div>
    </section>

    <section v-if="page.directAnswer" class="growth-band growth-band--answer">
      <div class="growth-container growth-answer">
        <p class="growth-kicker">Direct answer</p>
        <p>{{ page.directAnswer }}</p>
      </div>
    </section>

    <section v-if="page.sources?.length" class="growth-band growth-band--sources">
      <div class="growth-container growth-sources">
        <div>
          <p class="growth-kicker">Official references</p>
          <h2>Sources used for this guide</h2>
        </div>
        <div class="growth-sources__links">
          <a v-for="source in page.sources" :key="source.href" :href="source.href" target="_blank" rel="noopener noreferrer">
            {{ source.label }}
          </a>
        </div>
      </div>
    </section>

    <section class="growth-band">
      <div class="growth-container growth-content-grid">
        <div class="growth-main">
          <section v-for="section in page.sections" :key="section.heading" class="growth-section">
            <h2>{{ section.heading }}</h2>
            <p>{{ section.body }}</p>
            <ul v-if="section.bullets?.length" class="growth-checklist">
              <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </section>
        </div>

        <aside class="growth-aside" aria-label="Booking summary">
          <p class="growth-kicker">Best for</p>
          <p>{{ page.summary }}</p>
          <UiButton variant="secondary" to="/journey#book-journey">
            Get private quote
          </UiButton>
          <a class="growth-aside__phone" :href="whatsappHref" target="_blank" rel="noopener noreferrer">
            Prefer WhatsApp? Send trip details
          </a>
        </aside>
      </div>
    </section>

    <section class="growth-band growth-band--muted">
      <div class="growth-container growth-split">
        <div>
          <p class="growth-kicker">Private transfer vs taxi</p>
          <h2>When STW Movers is the better fit</h2>
          <p>
            Travellers often search for Barcelona taxi, cab, airport taxi, or private driver when they need the same
            basic result: a reliable ride. STW Movers is strongest when the journey benefits from planning, privacy,
            luggage fit, or a premium arrival experience.
          </p>
        </div>
        <div class="growth-comparison" aria-label="Private chauffeur and taxi comparison">
          <table>
            <thead>
              <tr>
                <th>Factor</th>
                <th>STW Movers</th>
                <th>Taxi or cab</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in comparisonRows" :key="row.factor">
                <th scope="row">{{ row.factor }}</th>
                <td>{{ row.stw }}</td>
                <td>{{ row.taxi }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="growth-band">
      <div class="growth-container growth-split growth-split--steps">
        <div>
          <p class="growth-kicker">Booking steps</p>
          <h2>How to request a private quote</h2>
          <p>
            The fastest path to a useful quote is clear trip information. These details help the team confirm the
            correct chauffeur vehicle and timing before you travel.
          </p>
        </div>
        <div class="growth-steps" role="list">
          <div v-for="(step, index) in bookingSteps" :key="step" class="growth-steps__item" role="listitem">
            <span aria-hidden="true">{{ index + 1 }}</span>
            <p>{{ step }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="growth-band growth-band--muted">
      <div class="growth-container">
        <div class="growth-section-head">
          <p class="growth-kicker">Common questions</p>
          <h2>Answers before you book</h2>
        </div>
        <div class="growth-faq-grid">
          <section v-for="faq in page.faqs" :key="faq.question" class="growth-card">
            <h3>{{ faq.question }}</h3>
            <p>{{ faq.answer }}</p>
          </section>
        </div>
      </div>
    </section>

    <section class="growth-band">
      <div class="growth-container growth-related">
        <div>
          <p class="growth-kicker">Related pages</p>
          <h2>Continue with the closest match</h2>
        </div>
        <div class="growth-related__links">
          <NuxtLink v-for="link in page.related" :key="link.href" :to="link.href">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <nav class="growth-mobile-cta" aria-label="Mobile conversion actions">
      <a :href="`tel:${siteConfig.contactPhone}`">
        <i class="fa-solid fa-phone" aria-hidden="true" />
        Call
      </a>
      <a :href="whatsappHref" target="_blank" rel="noopener noreferrer">
        <i class="fa-brands fa-whatsapp" aria-hidden="true" />
        WhatsApp
      </a>
      <NuxtLink to="/journey#book-journey">
        <i class="fa-solid fa-car" aria-hidden="true" />
        Quote
      </NuxtLink>
    </nav>
  </article>
</template>

<script setup lang="ts">
import type { GrowthPage, GrowthPageKind } from '~/data/growthSeoPages'

const props = defineProps<{
  title: string
  eyebrow: string
  description: string
  pages: readonly GrowthPage[]
  kind: GrowthPageKind
}>()

const prioritySlugs: Record<GrowthPageKind, string[]> = {
  service: [
    'barcelona-airport-taxi-alternative',
    'cab-service-barcelona',
    'barcelona-airport-transfer',
    'barcelona-van-transfer',
    'family-airport-transfer-barcelona',
    'private-driver-barcelona',
  ],
  location: [
    'barcelona-airport-to-city-centre-private-transfer',
    'barcelona-airport-to-cruise-port-private-transfer',
    'barcelona-airport-chauffeur-service',
    'barcelona-cruise-port-chauffeur-service',
    'barcelona-to-girona-private-transfer',
    'barcelona-to-tarragona-private-transfer',
  ],
  answer: [
    'barcelona-airport-taxi-cost-2026',
    'barcelona-taxi-app-or-private-transfer',
    'barcelona-cab-service-vs-chauffeur',
    'private-driver-vs-taxi-barcelona',
    'barcelona-airport-transfer-cost',
    'best-way-from-bcn-airport-to-barcelona',
  ],
}

const priorityPages = computed<GrowthPage[]>(() => {
  const slugs = prioritySlugs[props.kind]
  return slugs
    .map((slug) => props.pages.find((page) => page.slug === slug))
    .filter((page): page is GrowthPage => Boolean(page))
})

const standardPages = computed<GrowthPage[]>(() => {
  const featured = new Set(priorityPages.value.map((page: GrowthPage) => page.path))
  return props.pages.filter((page: GrowthPage) => !featured.has(page.path))
})

const pageSignal = (page: GrowthPage) => `${page.slug} ${page.title} ${page.eyebrow}`

const hubClusters = computed<Array<{ label: string, pages: readonly GrowthPage[] }>>(() => {
  if (props.kind === 'answer') {
    return [
      {
        label: 'Taxi and cab answers',
        pages: props.pages.filter((page: GrowthPage) => /taxi|cab/i.test(pageSignal(page))),
      },
      {
        label: 'Airport transfer answers',
        pages: props.pages.filter((page: GrowthPage) => /airport|BCN|flight|meet/i.test(pageSignal(page))),
      },
      {
        label: 'Private driver and chauffeur answers',
        pages: props.pages.filter((page: GrowthPage) => /driver|chauffeur|business|hourly|family/i.test(pageSignal(page))),
      },
    ]
  }

  if (props.kind === 'location') {
    return [
      {
        label: 'Airport and port routes',
        pages: props.pages.filter((page: GrowthPage) => /airport|cruise|port/i.test(pageSignal(page))),
      },
      {
        label: 'Barcelona pickup areas',
        pages: props.pages.filter((page: GrowthPage) => /Eixample|Sants|Fira|Passeig|Gothic/i.test(page.title)),
      },
      {
        label: 'City-to-city transfer routes',
        pages: props.pages.filter((page: GrowthPage) => /Sitges|Costa Brava|Girona|Tarragona/i.test(page.title)),
      },
    ]
  }

  return [
      {
        label: 'Airport, taxi, and cab intent',
      pages: props.pages.filter((page: GrowthPage) => /airport|taxi|cab|family|van/i.test(pageSignal(page))),
    },
    {
      label: 'Private driver and chauffeur services',
      pages: props.pages.filter((page: GrowthPage) => /driver|chauffeur|hourly|executive|mercedes/i.test(pageSignal(page))),
    },
    {
      label: 'Port, event, and city-to-city services',
      pages: props.pages.filter((page: GrowthPage) => /cruise|event|city-to-city/i.test(pageSignal(page))),
    },
  ]
})

const hubSupport = computed(() => {
  if (props.kind === 'answer') {
    return {
      kicker: 'Answer engine visibility',
      heading: 'Short answers for ChatGPT-style discovery',
      body:
        'These pages are structured for direct questions about Barcelona airport transfers, taxi and cab alternatives, private drivers, luggage, flight delays, business travel, and booking steps.',
      chips: ['AEO answers', 'Taxi comparisons', 'Airport questions', 'Private driver intent'],
    }
  }

  if (props.kind === 'location') {
    return {
      kicker: 'Local visibility',
      heading: 'Service-area pages for high-intent local searches',
      body:
        'These pages connect STW Movers to local pickup areas, terminals, venues, ports, hotels, and nearby destinations where travellers search for taxi, cab, chauffeur, and private transfer options.',
      chips: ['Barcelona airport', 'Eixample', 'Fira Barcelona', 'Cruise port', 'Sitges', 'Costa Brava'],
    }
  }

  return {
    kicker: 'Service visibility',
    heading: 'Core chauffeur and transfer services',
    body:
      'These pages map the main commercial search intents: Barcelona airport transfer, private driver, executive chauffeur, hourly chauffeur, cruise port transfer, event chauffeur, and city-to-city transfer.',
    chips: ['Airport transfer', 'Private driver', 'Executive chauffeur', 'Hourly service'],
  }
})
</script>

<template>
  <main class="growth-page growth-hub home-page">
    <section class="growth-hub-hero">
      <div class="growth-container">
        <p class="growth-eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
    </section>

    <section class="growth-band">
      <div class="growth-container">
        <div class="growth-section-head">
          <p class="growth-kicker">Priority paths</p>
          <h2>
            {{
              kind === 'answer'
                ? 'Pages most likely to answer AI and comparison queries'
                : kind === 'location'
                  ? 'Routes travellers search before they book'
                  : 'Commercial pages for taxi, cab, and chauffeur intent'
            }}
          </h2>
        </div>
        <div class="growth-priority-grid">
          <NuxtLink
            v-for="page in priorityPages"
            :key="page.path"
            class="growth-list-card growth-list-card--priority"
            :to="page.path"
          >
            <span>{{ page.eyebrow }}</span>
            <h2>{{ page.title }}</h2>
            <p>{{ page.summary }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="growth-intent-strip" aria-label="Hub search intent">
      <div class="growth-container growth-intent-strip__inner">
        <div>
          <p class="growth-kicker">{{ hubSupport.kicker }}</p>
          <h2>{{ hubSupport.heading }}</h2>
          <p>{{ hubSupport.body }}</p>
        </div>
        <div class="growth-intent-chips">
          <span v-for="chip in hubSupport.chips" :key="chip">{{ chip }}</span>
        </div>
      </div>
    </section>

    <section class="growth-band">
      <div class="growth-container growth-hub-clusters">
        <section v-for="cluster in hubClusters" :key="cluster.label" class="growth-hub-cluster">
          <div class="growth-section-head">
            <p class="growth-kicker">{{ cluster.label }}</p>
          </div>
          <div class="growth-list-grid growth-list-grid--compact">
            <NuxtLink v-for="page in cluster.pages" :key="page.path" class="growth-list-card" :to="page.path">
              <span>{{ page.eyebrow }}</span>
              <h2>{{ page.title }}</h2>
              <p>{{ page.description }}</p>
            </NuxtLink>
          </div>
        </section>
      </div>
    </section>

    <section v-if="standardPages.length" class="growth-band growth-band--muted">
      <div class="growth-container">
        <div class="growth-section-head">
          <p class="growth-kicker">Full index</p>
          <h2>All related pages in this cluster</h2>
        </div>
        <div class="growth-list-grid">
          <NuxtLink v-for="page in standardPages" :key="page.path" class="growth-list-card" :to="page.path">
            <span>{{ page.eyebrow }}</span>
            <h2>{{ page.title }}</h2>
            <p>{{ page.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="growth-band growth-band--muted">
      <div class="growth-container growth-related">
        <div>
          <p class="growth-kicker">Quote path</p>
          <h2>
            {{
              kind === 'answer'
                ? 'Found the right answer? Turn the trip details into a quote.'
                : 'Move from research to a private chauffeur quote.'
            }}
          </h2>
          <p>
            Share pickup, destination, date, time, passengers, and luggage. STW Movers can then match the right
            vehicle and confirm whether a private chauffeur is the better fit than a taxi or cab.
          </p>
        </div>
        <NuxtLink class="growth-btn growth-btn--dark" to="/journey#book-journey">
          Request a quote
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

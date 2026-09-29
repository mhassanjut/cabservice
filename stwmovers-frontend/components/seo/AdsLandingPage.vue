<script setup lang="ts">
import { siteConfig } from '~/config/site'
import type { AdsLandingPage } from '~/data/adsLandingPages'
import { trackMarketingEvent } from '~/utils/marketingEvents'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const props = defineProps<{ page: AdsLandingPage }>()

const whatsappHref = buildWhatsappUrl({
  phone: siteConfig.whatsappNumber,
  text: `Hello STW Movers, I want a private quote for ${props.page.title}.`,
})

const searchIntentChips = computed(() =>
  props.page.primaryIntent
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
)

const quoteFields = computed(() => [
  {
    label: 'Pickup',
    value: props.page.slug.includes('airport') ? 'BCN airport, hotel, port' : 'Airport, hotel, venue',
    icon: 'fa-solid fa-location-dot',
  },
  {
    label: 'Route',
    value: props.page.slug.includes('van') ? 'Group and luggage fit' : 'Door-to-door private transfer',
    icon: 'fa-solid fa-flag-checkered',
  },
  {
    label: 'Timing',
    value: props.page.slug.includes('chauffeur') ? 'Hourly or fixed pickup' : 'Date, time, flight details',
    icon: 'fa-regular fa-clock',
  },
])

const trackAdsAction = (action: string, location: string, label: string) => {
  trackMarketingEvent('ads_landing_action_clicked', {
    action,
    location,
    label,
    page_slug: props.page.slug,
    page_path: props.page.path,
    primary_intent: props.page.primaryIntent,
  })
}
</script>

<template>
  <article class="ads-page home-page">
    <section class="ads-hero">
      <div class="ads-hero__media" aria-hidden="true">
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
      <div class="ads-hero__overlay" />
      <div class="ads-container ads-hero__inner">
        <div class="ads-hero__copy">
          <p class="ads-eyebrow">{{ page.eyebrow }}</p>
          <h1>{{ page.title }}</h1>
          <p>{{ page.description }}</p>
          <div class="ads-actions">
            <NuxtLink
              class="ads-btn ads-btn--gold"
              to="/journey#book-journey"
              @click="trackAdsAction('quote_form', 'hero', 'Request private quote')"
            >
              Request private quote
            </NuxtLink>
            <a
              class="ads-btn ads-btn--glass"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              @click="trackAdsAction('whatsapp', 'hero', 'WhatsApp trip details')"
            >
              WhatsApp trip details
            </a>
          </div>
          <ul class="ads-proof-row" aria-label="Trust signals">
            <li v-for="item in page.proof" :key="item">{{ item }}</li>
          </ul>
        </div>

        <aside class="ads-quote-panel ads-quote-panel--form" aria-label="Quick quote details">
          <p class="ads-eyebrow">Quote-ready</p>
          <h2>Check availability before pickup.</h2>
          <div class="ads-mini-form" aria-label="Quote form preview">
            <div v-for="field in quoteFields" :key="field.label" class="ads-mini-field">
              <i :class="field.icon" aria-hidden="true" />
              <span>
                <small>{{ field.label }}</small>
                <strong>{{ field.value }}</strong>
              </span>
            </div>
          </div>
          <NuxtLink
            class="ads-btn ads-btn--gold ads-btn--wide"
            to="/journey#book-journey"
            @click="trackAdsAction('quote_form', 'hero_quote_panel', 'Open quote form')"
          >
            Open quote form
          </NuxtLink>
          <div class="ads-quote-panel__contact">
            <a
              class="ads-phone"
              :href="`tel:${siteConfig.contactPhone}`"
              @click="trackAdsAction('phone', 'hero_quote_panel', siteConfig.contactPhoneDisplay)"
            >
              {{ siteConfig.contactPhoneDisplay }}
            </a>
            <a
              class="ads-phone"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              @click="trackAdsAction('whatsapp', 'hero_quote_panel', 'WhatsApp')"
            >
              WhatsApp
            </a>
          </div>
          <p class="ads-quote-panel__note">No payment here. Send trip details first.</p>
        </aside>
      </div>
    </section>

    <section class="ads-trust-strip" aria-label="Conversion trust signals">
      <div class="ads-container ads-trust-strip__inner">
        <span>Private quote before pickup</span>
        <span>Airport, hotel, port, and city routes</span>
        <span>Phone and WhatsApp lead path</span>
        <span>Built for Google Ads intent</span>
      </div>
    </section>

    <section class="ads-search-band" aria-label="Search intent">
      <div class="ads-container ads-search-band__inner">
        <div>
          <p class="ads-eyebrow">Search intent match</p>
          <h2>{{ page.primaryIntent }}</h2>
          <div class="ads-message-chips" aria-label="Matched search terms">
            <span v-for="chip in searchIntentChips" :key="chip">{{ chip }}</span>
          </div>
        </div>
        <p>{{ page.audience }}</p>
      </div>
    </section>

    <section class="ads-section">
      <div class="ads-container">
        <div class="ads-section-head">
          <p class="ads-eyebrow">Why book STW Movers</p>
          <h2>A luxury private transfer path for ready-to-book visitors</h2>
        </div>
        <div class="ads-benefit-grid">
          <section v-for="benefit in page.benefits" :key="benefit.title" class="ads-card">
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.body }}</p>
          </section>
        </div>
      </div>
    </section>

    <section class="ads-section ads-section--muted">
      <div class="ads-container ads-split">
        <div>
          <p class="ads-eyebrow">Taxi and cab comparison</p>
          <h2>When a private chauffeur is the stronger choice</h2>
          <p>
            Taxi and cab searches often mean the visitor is close to booking. This page gives that intent a more premium
            option with clearer pickup planning and stronger conversion actions.
          </p>
        </div>
        <div class="ads-table" aria-label="Private chauffeur comparison">
          <table>
            <thead>
              <tr>
                <th>Factor</th>
                <th>STW Movers</th>
                <th>Taxi or cab</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in page.comparison" :key="row.factor">
                <th scope="row">{{ row.factor }}</th>
                <td>{{ row.stw }}</td>
                <td>{{ row.alternative }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="ads-section">
      <div class="ads-container ads-faq-layout">
        <div>
          <p class="ads-eyebrow">Before booking</p>
          <h2>Quick answers for high-intent traffic</h2>
        </div>
        <div class="ads-faq-grid">
          <section v-for="faq in page.faqs" :key="faq.question" class="ads-card">
            <h3>{{ faq.question }}</h3>
            <p>{{ faq.answer }}</p>
          </section>
        </div>
      </div>
    </section>

    <section class="ads-final" aria-labelledby="ads-final-heading">
      <div class="ads-container ads-final__inner">
        <div>
          <p class="ads-eyebrow">Ready to move</p>
          <h2 id="ads-final-heading">Get a private chauffeur quote for your Barcelona trip.</h2>
          <p>
            Use the quote form, WhatsApp, or phone. STW Movers will help match the right service, route, and vehicle.
          </p>
        </div>
        <div class="ads-final__actions">
          <NuxtLink
            class="ads-btn ads-btn--gold"
            to="/journey#book-journey"
            @click="trackAdsAction('quote_form', 'final_cta', 'Request private quote')"
          >
            Request private quote
          </NuxtLink>
          <a
            class="ads-btn ads-btn--dark"
            :href="whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackAdsAction('whatsapp', 'final_cta', 'WhatsApp STW Movers')"
          >
            WhatsApp STW Movers
          </a>
        </div>
      </div>
    </section>

    <section class="ads-section ads-section--compact">
      <div class="ads-container ads-related">
        <p class="ads-eyebrow">Related pages</p>
        <div class="ads-related__links">
          <NuxtLink v-for="link in page.related" :key="link.href" :to="link.href">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <nav class="ads-mobile-cta" aria-label="Mobile landing page actions">
      <NuxtLink to="/journey#book-journey" @click="trackAdsAction('quote_form', 'mobile_sticky', 'Quote')">
        Quote
      </NuxtLink>
      <a :href="`tel:${siteConfig.contactPhone}`" @click="trackAdsAction('phone', 'mobile_sticky', 'Call')">
        Call
      </a>
      <a
        :href="whatsappHref"
        target="_blank"
        rel="noopener noreferrer"
        @click="trackAdsAction('whatsapp', 'mobile_sticky', 'WhatsApp')"
      >
        WhatsApp
      </a>
    </nav>
  </article>
</template>

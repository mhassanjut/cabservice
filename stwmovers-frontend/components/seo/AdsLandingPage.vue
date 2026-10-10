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
          alt=""
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
            <a
              class="ads-btn ads-btn--gold"
              href="#ads-booking"
              @click="trackAdsAction('booking_form', 'hero', 'View vehicles and prices')"
            >
              View vehicles &amp; prices
            </a>
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

        <aside class="ads-quote-panel ads-quote-panel--form" aria-label="Plan your transfer">
          <p class="ads-eyebrow">A considered journey</p>
          <h2>See the right vehicle and price for your trip.</h2>
          <ul class="ads-trip-points">
            <li><i class="fa-solid fa-location-dot" aria-hidden="true" /> Pickup and destination</li>
            <li><i class="fa-regular fa-calendar" aria-hidden="true" /> Travel date and time</li>
            <li><i class="fa-solid fa-users" aria-hidden="true" /> Passenger requirements</li>
          </ul>
          <a
            class="ads-btn ads-btn--gold ads-btn--wide"
            href="#ads-booking"
            @click="trackAdsAction('booking_form', 'hero_trip_panel', 'View vehicles and prices')"
          >
            Plan your journey
          </a>
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
          <p class="ads-quote-panel__note">Add your trip details to compare available vehicles and prices.</p>
        </aside>
      </div>
    </section>

    <section id="ads-booking" class="ads-booking-section" aria-labelledby="ads-booking-heading">
      <div class="ads-container">
        <div class="ads-booking-section__heading">
          <p class="ads-eyebrow">Plan your transfer</p>
          <h2 id="ads-booking-heading">A vehicle and fare for the journey ahead.</h2>
          <p>{{ page.audience }}. Enter your route and travel time to see available options.</p>
        </div>
        <BookingForm class="ads-booking-form" variant="card" />
      </div>
    </section>

    <section class="ads-trust-strip" aria-label="Service details">
      <div class="ads-container ads-trust-strip__inner">
        <span>Private journeys arranged in advance</span>
        <span>Airport and cruise-port transfers</span>
        <span>Vehicle options and prices before booking</span>
        <span>Phone and WhatsApp support</span>
      </div>
    </section>

    <section class="ads-section">
      <div class="ads-container">
        <div class="ads-section-head">
          <p class="ads-eyebrow">Why book STW Movers</p>
          <h2>Thoughtful travel, from pickup to arrival.</h2>
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
          <h2>Choose the option that suits your journey.</h2>
          <p>
            A taxi can suit an immediate point-to-point ride. A pre-booked private transfer is useful when you want to
            arrange your timing, destination, and vehicle before travelling.
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
          <h2>Common questions before booking</h2>
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
          <h2 id="ads-final-heading">Plan your Barcelona transfer.</h2>
          <p>
            Enter your route to compare available vehicles and prices, or contact the team if you would like help first.
          </p>
        </div>
        <div class="ads-final__actions">
          <a
            class="ads-btn ads-btn--gold"
            href="#ads-booking"
            @click="trackAdsAction('booking_form', 'final_cta', 'View vehicles and prices')"
          >
            View vehicles &amp; prices
          </a>
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
      <a href="#ads-booking" @click="trackAdsAction('booking_form', 'mobile_sticky', 'View vehicles and prices')">
        View prices
      </a>
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

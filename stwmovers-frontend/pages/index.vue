<script setup lang="ts">
import { seoDefaults } from '~/config/seo'

usePageSeo({
  title: seoDefaults.defaultTitle,
  description: seoDefaults.defaultDescription,
  path: '/',
})
</script>

<template>
  <div class="grid cols-2" style="align-items:start;">
    <section aria-labelledby="home-hero-title">
      <div class="card" style="padding: 18px;">
        <div class="pill">Barcelona • Airport • City • Spain</div>
        <h1 id="home-hero-title" style="margin: 12px 0 8px; font-size: 30px; letter-spacing: -0.02em;">
          Barcelona Transfers & Cab Booking — Fast, Reliable, Clear Pricing
        </h1>
        <p style="margin:0; color: var(--muted); font-size: 16px;">
          Book airport transfers, city transfers, or on-demand cab rides in Barcelona and across Spain.
          Choose a car in seconds and confirm via WhatsApp.
        </p>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top: 14px;">
          <span class="pill">24/7 support</span>
          <span class="pill">Meet & greet options</span>
          <span class="pill">Spain-wide transfers</span>
        </div>
      </div>

      <section aria-labelledby="home-services-title" style="margin-top: 16px;">
        <div class="card" style="padding: 16px;">
          <h2 id="home-services-title" style="margin:0 0 10px; font-size: 18px;">
            Transfer services in Barcelona & Spain
          </h2>

          <!-- SEO-critical: modular service group blocks for future keyword clustering and extraction into dedicated landing pages. -->
          <div class="grid cols-3">
            <div class="card" style="padding: 14px; background: rgba(0,0,0,0.16); box-shadow:none;">
              <h3 style="margin:0 0 6px; font-size: 15px;">Barcelona Airport Transfers</h3>
              <ul style="margin:0; padding-left: 18px; color: var(--muted);">
                <li>Airport to Barcelona City</li>
                <li>Airport to other cities</li>
              </ul>
            </div>
            <div class="card" style="padding: 14px; background: rgba(0,0,0,0.16); box-shadow:none;">
              <h3 style="margin:0 0 6px; font-size: 15px;">City Transfers</h3>
              <ul style="margin:0; padding-left: 18px; color: var(--muted);">
                <li>Within Barcelona</li>
                <li>Barcelona to other cities</li>
              </ul>
            </div>
            <div class="card" style="padding: 14px; background: rgba(0,0,0,0.16); box-shadow:none;">
              <h3 style="margin:0 0 6px; font-size: 15px;">General Cab Booking</h3>
              <ul style="margin:0; padding-left: 18px; color: var(--muted);">
                <li>On-demand rides</li>
                <li>Pre-booked pickup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </section>

    <section aria-labelledby="booking-form-title">
      <h2 id="booking-form-title" class="sr-only">Booking Form</h2>
      <BookingForm />
      <div class="help" style="margin-top: 10px;">
        By continuing, you agree to confirm details via WhatsApp before payment.
      </div>
    </section>
  </div>
</template>


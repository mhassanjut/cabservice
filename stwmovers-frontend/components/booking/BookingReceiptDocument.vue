<script setup lang="ts">
import { siteConfig } from '~/config/site'
import type { BookingDto } from '~/types/api'
import {
  formatReceiptDate,
  formatReceiptDistance,
  formatReceiptFare,
  formatReceiptShortDate,
  getReceiptRideTypeLabel,
  getReceiptStatusLabel,
  getReceiptVehicleLabel,
} from '~/utils/bookingReceipt'

defineProps<{
  booking: BookingDto
}>()

const issuedAt = formatReceiptShortDate(new Date().toISOString())
</script>

<template>
  <article class="booking-receipt-doc">
    <header class="booking-receipt-doc__header">
      <img
        class="booking-receipt-doc__logo"
        src="/Logo.svg"
        alt="STW Movers"
        width="146"
        height="40"
      >
      <p class="booking-receipt-doc__tagline">Executive Chauffeur Service · Barcelona</p>
    </header>

    <div class="booking-receipt-doc__accent" aria-hidden="true" />

    <div class="booking-receipt-doc__hero">
      <div class="booking-receipt-doc__hero-copy">
        <p class="booking-receipt-doc__eyebrow">Booking receipt</p>
        <h1 class="booking-receipt-doc__title">Payment confirmation</h1>
        <p class="booking-receipt-doc__subtitle">
          Thank you for choosing STW Movers. This receipt confirms your booking and payment.
        </p>
      </div>
      <div class="booking-receipt-doc__ref-block">
        <span class="booking-receipt-doc__ref-label">Reference</span>
        <strong class="booking-receipt-doc__ref">{{ booking.bookingReference }}</strong>
        <span class="booking-receipt-doc__status">{{ getReceiptStatusLabel(booking.status) }}</span>
      </div>
    </div>

    <section class="booking-receipt-doc__grid">
      <div class="booking-receipt-doc__card">
        <h2 class="booking-receipt-doc__card-title">Passenger</h2>
        <dl class="booking-receipt-doc__dl">
          <div><dt>Name</dt><dd>{{ booking.guestName || '—' }}</dd></div>
          <div><dt>Email</dt><dd>{{ booking.guestEmail || '—' }}</dd></div>
          <div><dt>Phone</dt><dd>{{ booking.guestPhone || '—' }}</dd></div>
          <div v-if="booking.passengerCount">
            <dt>Passengers</dt><dd>{{ booking.passengerCount }}</dd>
          </div>
        </dl>
      </div>

      <div class="booking-receipt-doc__card">
        <h2 class="booking-receipt-doc__card-title">Booking</h2>
        <dl class="booking-receipt-doc__dl">
          <div><dt>Service</dt><dd>{{ getReceiptRideTypeLabel(booking.rideType) }}</dd></div>
          <div><dt>Vehicle</dt><dd>{{ getReceiptVehicleLabel(booking) }}</dd></div>
          <div><dt>Distance</dt><dd>{{ formatReceiptDistance(booking.distanceKm) }}</dd></div>
          <div><dt>Issued</dt><dd>{{ issuedAt }}</dd></div>
        </dl>
      </div>
    </section>

    <section class="booking-receipt-doc__journey">
      <h2 class="booking-receipt-doc__section-title">Journey details</h2>
      <div class="booking-receipt-doc__route">
        <div class="booking-receipt-doc__route-point">
          <span class="booking-receipt-doc__route-label">Pickup</span>
          <p class="booking-receipt-doc__route-value">{{ booking.pickupAddress }}</p>
        </div>
        <div class="booking-receipt-doc__route-line" aria-hidden="true" />
        <div class="booking-receipt-doc__route-point">
          <span class="booking-receipt-doc__route-label">Drop-off</span>
          <p class="booking-receipt-doc__route-value">{{ booking.dropoffAddress }}</p>
        </div>
      </div>
      <p class="booking-receipt-doc__schedule">
        <span>Scheduled</span>
        <strong>{{ formatReceiptDate(booking.scheduledAt) }}</strong>
      </p>
      <p v-if="booking.notes" class="booking-receipt-doc__notes">
        <span>Notes</span>
        <strong>{{ booking.notes }}</strong>
      </p>
    </section>

    <section class="booking-receipt-doc__total">
      <div class="booking-receipt-doc__total-row">
        <span>Transfer fare</span>
        <span>{{ formatReceiptFare(booking.calculatedFare) }}</span>
      </div>
      <div class="booking-receipt-doc__total-row booking-receipt-doc__total-row--muted">
        <span>Payment method</span>
        <span>Card (Stripe)</span>
      </div>
      <div class="booking-receipt-doc__total-row booking-receipt-doc__total-row--grand">
        <span>Total paid</span>
        <strong>{{ formatReceiptFare(booking.calculatedFare) }}</strong>
      </div>
    </section>

    <footer class="booking-receipt-doc__footer">
      <div>
        <p class="booking-receipt-doc__footer-brand">STW Movers</p>
        <p>{{ siteConfig.contactAddressDisplay }}</p>
      </div>
      <div class="booking-receipt-doc__footer-contact">
        <p>{{ siteConfig.contactPhoneDisplay }}</p>
        <p>{{ siteConfig.contactEmail }}</p>
        <p>{{ siteConfig.siteUrl.replace('https://', '') }}</p>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.booking-receipt-doc {
  box-sizing: border-box;
  width: 595px;
  padding: 0;
  background: #fafaf8;
  color: #1a1a1a;
  font-family: Inter, system-ui, sans-serif;
  font-size: 12px;
  line-height: 1.5;
}

.booking-receipt-doc__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 32px 24px;
  background: #090909;
}

.booking-receipt-doc__logo {
  display: block;
  width: 130px;
  height: auto;
}

.booking-receipt-doc__tagline {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(250, 250, 248, 0.62);
}

.booking-receipt-doc__accent {
  height: 3px;
  background: linear-gradient(90deg, #d8b24c 0%, #c39c36 100%);
}

.booking-receipt-doc__hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px 24px;
}

.booking-receipt-doc__eyebrow {
  margin: 0 0 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c39c36;
}

.booking-receipt-doc__title {
  margin: 0 0 8px;
  font-family: 'Instrument Sans', Inter, system-ui, sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.15;
  color: #1a1a1a;
}

.booking-receipt-doc__subtitle {
  margin: 0;
  max-width: 280px;
  color: #6b7280;
}

.booking-receipt-doc__ref-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 180px;
  padding: 16px 18px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.04);
}

.booking-receipt-doc__ref-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7280;
}

.booking-receipt-doc__ref {
  font-family: 'Instrument Sans', Inter, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #1a1a1a;
}

.booking-receipt-doc__status {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.1);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #10b981;
}

.booking-receipt-doc__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 0 32px 20px;
}

.booking-receipt-doc__card {
  padding: 18px 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  background: #fff;
}

.booking-receipt-doc__card-title,
.booking-receipt-doc__section-title {
  margin: 0 0 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7280;
}

.booking-receipt-doc__dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.booking-receipt-doc__dl div {
  display: grid;
  gap: 2px;
}

.booking-receipt-doc__dl dt {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a7a7a7;
}

.booking-receipt-doc__dl dd {
  margin: 0;
  font-size: 12px;
  color: #1a1a1a;
}

.booking-receipt-doc__journey {
  margin: 0 32px 20px;
  padding: 20px 22px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  background: #fff;
}

.booking-receipt-doc__route {
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
}

.booking-receipt-doc__route-point {
  display: grid;
  gap: 4px;
}

.booking-receipt-doc__route-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c39c36;
}

.booking-receipt-doc__route-value {
  margin: 0;
  font-size: 12px;
  color: #1a1a1a;
}

.booking-receipt-doc__route-line {
  width: 2px;
  height: 18px;
  margin-left: 3px;
  border-radius: 999px;
  background: linear-gradient(180deg, #d8b24c 0%, rgba(216, 178, 76, 0.2) 100%);
}

.booking-receipt-doc__schedule,
.booking-receipt-doc__notes {
  display: grid;
  gap: 4px;
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid #e5e5e5;
}

.booking-receipt-doc__schedule span,
.booking-receipt-doc__notes span {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #a7a7a7;
}

.booking-receipt-doc__schedule strong,
.booking-receipt-doc__notes strong {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
}

.booking-receipt-doc__notes {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 0;
}

.booking-receipt-doc__total {
  margin: 0 32px 24px;
  padding: 18px 20px;
  border-radius: 16px;
  background: #090909;
  color: #fafaf8;
}

.booking-receipt-doc__total-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 0;
  font-size: 12px;
}

.booking-receipt-doc__total-row--muted {
  color: rgba(250, 250, 248, 0.62);
  font-size: 11px;
}

.booking-receipt-doc__total-row--grand {
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid rgba(250, 250, 248, 0.12);
  font-size: 14px;
}

.booking-receipt-doc__total-row--grand strong {
  font-family: 'Instrument Sans', Inter, system-ui, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #d8b24c;
}

.booking-receipt-doc__footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 32px 28px;
  border-top: 1px solid #e5e5e5;
  color: #6b7280;
  font-size: 10px;
}

.booking-receipt-doc__footer p {
  margin: 0 0 4px;
}

.booking-receipt-doc__footer-brand {
  margin-bottom: 6px !important;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1a1a1a;
}

.booking-receipt-doc__footer-contact {
  text-align: right;
}
</style>

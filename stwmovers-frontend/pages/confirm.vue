<script setup lang="ts">
import { routes } from '~/constants/routes'
import { buildWhatsappUrl } from '~/utils/whatsapp'

usePageSeo({
  title: 'Confirm & pay via WhatsApp',
  description: 'Confirm your selected car and proceed to payment via WhatsApp.',
  path: '/confirm',
})

const booking = useBookingStore()
const router = useRouter()
const config = useRuntimeConfig()

onMounted(async () => {
  if (!booking.isReadyForConfirm) await router.replace(routes.home)
})

const message = computed(() => {
  const v = booking.vehicle
  const d = booking.draft
  return [
    'Booking request (STW Movers):',
    v ? `Car: ${v.name}` : '',
    v ? `Price: €${v.priceEur}` : '',
    `Pickup: ${d.pickupLocation}`,
    `Drop-off: ${d.dropoffLocation}`,
    `Date: ${d.pickupDate}`,
    `Time: ${d.pickupTime}`,
  ]
    .filter(Boolean)
    .join('\n')
})

const whatsappHref = computed(() =>
  buildWhatsappUrl({
    phone: config.public.whatsappNumber,
    text: message.value,
  }),
)
</script>

<template>
  <section aria-labelledby="confirm-title">
    <div class="card" style="padding: 16px;">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <h1 id="confirm-title" style="margin:0; font-size: 22px;">Confirmation</h1>
          <p class="help" style="margin: 6px 0 0;">
            Your trip details and selected car are ready. Continue to WhatsApp to make payment.
          </p>
        </div>
        <NuxtLink class="pill" :to="routes.cars">Change car</NuxtLink>
      </div>

      <div class="grid cols-2" style="margin-top: 12px;">
        <div class="card" style="padding: 12px; background: rgba(0,0,0,0.16); box-shadow:none;">
          <h2 style="margin:0 0 10px; font-size: 16px;">Trip details</h2>
          <div class="grid" style="gap: 10px;">
            <div>
              <div class="label">Pickup</div>
              <div>{{ booking.draft.pickupLocation }}</div>
            </div>
            <div>
              <div class="label">Drop-off</div>
              <div>{{ booking.draft.dropoffLocation }}</div>
            </div>
            <div class="grid cols-3" style="gap: 10px;">
              <div>
                <div class="label">Date</div>
                <div>{{ booking.draft.pickupDate }}</div>
              </div>
              <div>
                <div class="label">Time</div>
                <div>{{ booking.draft.pickupTime }}</div>
              </div>
              <div>
                <div class="label">Payment</div>
                <div>WhatsApp</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="padding: 12px; background: rgba(0,0,0,0.16); box-shadow:none;">
          <h2 style="margin:0 0 10px; font-size: 16px;">Selected car</h2>
          <div v-if="booking.vehicle" style="display:flex; gap:12px; align-items:flex-start;">
            <img
              :src="booking.vehicle.imagePath"
              :alt="booking.vehicle.name"
              width="56"
              height="56"
              loading="lazy"
              style="border-radius: 14px; border: 1px solid var(--border); background: rgba(0,0,0,0.18); padding: 8px;"
            />
            <div style="flex:1;">
              <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
                <div>
                  <div style="font-weight: 800;">{{ booking.vehicle.name }}</div>
                  <div class="help" style="margin-top: 4px;">{{ booking.vehicle.description }}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-weight: 900; font-size: 18px;">€{{ booking.vehicle.priceEur }}</div>
                  <div class="help">starting price</div>
                </div>
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top: 10px;">
                <span class="pill">{{ booking.vehicle.seats }} seats</span>
                <span class="pill">{{ booking.vehicle.bags }} bags</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 12px; padding: 12px; background: rgba(0,0,0,0.16); box-shadow:none;">
        <h2 style="margin:0 0 8px; font-size: 16px;">WhatsApp message preview</h2>
        <pre
          style="margin:0; white-space:pre-wrap; color: var(--muted); background: rgba(0,0,0,0.18); border: 1px solid var(--border); border-radius: 12px; padding: 12px;"
        >{{ message }}</pre>
      </div>

      <div style="margin-top: 14px; display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end;">
        <button class="btn secondary" type="button" @click="booking.clear()">
          Clear booking
        </button>
        <a class="btn" :href="whatsappHref" target="_blank" rel="noopener noreferrer">
          Make Payment
        </a>
      </div>
    </div>
  </section>
</template>


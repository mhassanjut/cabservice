<script setup lang="ts">
import { homeAnchors } from '~/constants/routes'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const appConfig = useAppConfig()

const whatsappHref = computed(() =>
  buildWhatsappUrl({
    phone: appConfig.whatsappNumber,
    text: 'Hello STW Movers, I need help choosing a vehicle for my transfer.',
  }),
)
</script>

<template>
  <section class="booking-help booking-card">
    <div class="booking-help__info">
      <h2 class="booking-help__title">Need Help Choosing?</h2>
      <p class="booking-help__lead">
        Tell us about your journey and event needs, and our bespoke logistics team will recommend
        the ideal vehicle arrangement.
      </p>
    </div>

    <div class="booking-help__actions">
      <a
        class="booking-help__btn"
        :href="whatsappHref"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="fa-brands fa-whatsapp" aria-hidden="true" />
        WhatsApp Chat
      </a>
      <NuxtLink
        class="booking-help__btn booking-help__btn--gold"
        :to="homeAnchors.contact"
        :prefetch="false"
      >
        <i class="fa-regular fa-user" aria-hidden="true" />
        Contact Concierge
      </NuxtLink>
    </div>
  </section>
</template>

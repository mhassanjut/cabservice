<script setup lang="ts">
import { MEASUREMENT_CONSENT_KEY, saveMeasurementConsent, type MeasurementConsent } from '~/utils/measurementConsent'

const config = useRuntimeConfig()
const route = useRoute()
const enabled = computed(() => Boolean(
  config.public.googleAnalyticsId || config.public.googleAdsConversionId || config.public.microsoftClarityId,
))
const visible = ref(false)

const open = () => {
  if (enabled.value) visible.value = true
}

const choose = (choice: MeasurementConsent) => {
  saveMeasurementConsent(choice)
  visible.value = false
}

onMounted(() => {
  try {
    visible.value = enabled.value && !localStorage.getItem(MEASUREMENT_CONSENT_KEY)
  } catch {
    visible.value = enabled.value
  }
  window.addEventListener('stw:open-measurement-settings', open)
})

onBeforeUnmount(() => window.removeEventListener('stw:open-measurement-settings', open))

watch(() => route.query.manageCookies, (value) => {
  if (value === '1') open()
}, { immediate: true })
</script>

<template>
  <ClientOnly>
    <section v-if="visible" class="measurement-consent" aria-labelledby="measurement-consent-title" role="dialog" aria-modal="false">
      <div class="measurement-consent__copy">
        <h2 id="measurement-consent-title">Your privacy choices</h2>
        <p>Optional analytics and advertising measurement help us understand which journeys lead to bookings. You can continue without them.</p>
        <NuxtLink to="/cookie-policy">Cookie details</NuxtLink>
      </div>
      <div class="measurement-consent__actions">
        <button class="measurement-consent__button measurement-consent__button--quiet" type="button" @click="choose('denied')">Reject optional</button>
        <button class="measurement-consent__button" type="button" @click="choose('granted')">Accept optional</button>
      </div>
    </section>
  </ClientOnly>
</template>

<style scoped>
.measurement-consent {
  position: fixed;
  z-index: 1200;
  inset: auto 16px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 960px;
  margin-inline: auto;
  padding: 20px 22px;
  color: #f7f5ef;
  background: rgba(25, 31, 35, 0.97);
  border: 1px solid rgba(215, 180, 82, 0.65);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(16px);
}

.measurement-consent__copy { max-width: 590px; }
.measurement-consent h2 { margin: 0 0 5px; font-size: 16px; font-weight: 600; }
.measurement-consent p { margin: 0 0 5px; color: #d0d3d3; font-size: 13px; line-height: 1.5; }
.measurement-consent a { color: #f1d47d; font-size: 12px; text-underline-offset: 3px; }
.measurement-consent__actions { display: flex; flex: 0 0 auto; gap: 8px; }
.measurement-consent__button { min-height: 42px; padding: 0 15px; color: #17191a; font: inherit; font-size: 13px; font-weight: 600; background: #e1bd55; border: 1px solid #e1bd55; border-radius: 7px; cursor: pointer; }
.measurement-consent__button--quiet { color: #f7f5ef; background: transparent; border-color: #74797b; }
.measurement-consent__button:hover { filter: brightness(1.08); }
.measurement-consent__button:focus-visible { outline: 3px solid #f1d47d; outline-offset: 3px; }

@media (max-width: 640px) {
  .measurement-consent { inset-inline: 10px; bottom: 10px; align-items: stretch; flex-direction: column; gap: 14px; padding: 16px; }
  .measurement-consent__actions { display: grid; grid-template-columns: 1fr 1fr; }
  .measurement-consent__button { min-width: 0; padding-inline: 8px; }
}
</style>

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
        <p>Allow optional analytics and advertising measurement? You can continue without them.</p>
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
  right: 16px;
  bottom: 16px;
  width: min(350px, calc(100vw - 32px));
  padding: 16px;
  color: #f7f5ef;
  background: rgba(25, 31, 35, 0.97);
  border: 1px solid rgba(215, 180, 82, 0.65);
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(16px);
}

.measurement-consent h2 { margin: 0 0 5px; font-size: 15px; font-weight: 600; }
.measurement-consent p { margin: 0 0 5px; color: #d0d3d3; font-size: 12px; line-height: 1.45; }
.measurement-consent a { color: #f1d47d; font-size: 12px; text-underline-offset: 3px; }
.measurement-consent__actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.measurement-consent__button { min-height: 40px; min-width: 0; padding: 0 6px; color: #17191a; font: inherit; font-size: 12px; font-weight: 600; background: #e1bd55; border: 1px solid #e1bd55; border-radius: 6px; cursor: pointer; }
.measurement-consent__button--quiet { color: #f7f5ef; background: transparent; border-color: #74797b; }
.measurement-consent__button:hover { filter: brightness(1.08); }
.measurement-consent__button:focus-visible { outline: 3px solid #f1d47d; outline-offset: 3px; }

@media (max-width: 640px) {
  .measurement-consent {
    right: 10px;
    bottom: calc(var(--mobile-nav-h, 72px) + env(safe-area-inset-bottom) + 10px);
    width: min(320px, calc(100vw - 20px));
  }
}
</style>

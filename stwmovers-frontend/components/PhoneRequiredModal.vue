<script setup lang="ts">
import { isValidPhone, normalizePhone } from '~/utils/phone'

const props = defineProps<{
  show: boolean
  loading: boolean
  error: string
  initialPhone?: string
}>()

const emit = defineEmits<{
  save: [phone: string]
  close: []
}>()

const phone = ref('')
const localError = ref('')

watch(
  () => props.show,
  (open: boolean) => {
    if (open) {
      phone.value = props.initialPhone ?? ''
      localError.value = ''
    }
  },
)

watch(
  () => props.initialPhone,
  (value: string | undefined) => {
    if (props.show && !phone.value) phone.value = value ?? ''
  },
)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && !props.loading) emit('close')
}

watch(
  () => props.show,
  (open: boolean) => {
    if (!import.meta.client) return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

const submit = () => {
  localError.value = ''
  const value = normalizePhone(phone.value)
  if (!isValidPhone(value)) {
    localError.value = 'Enter a valid mobile number, including country code if applicable.'
    return
  }
  emit('save', value)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="sign-in-modal phone-required-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-required-title"
      @click.self="!loading && emit('close')"
    >
      <div class="sign-in-modal__dialog phone-required-modal__dialog">
        <button
          type="button"
          class="sign-in-modal__close"
          aria-label="Close"
          :disabled="loading"
          @click="emit('close')"
        >
          <i class="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <article class="card card--elevated phone-required-modal__panel">
          <div class="booking-panel__icon booking-panel__icon--gold" aria-hidden="true">
            <i class="fa-solid fa-phone" />
          </div>
          <h2 id="phone-required-title" class="booking-panel__title font-serif">Contact number required</h2>
          <p class="booking-panel__lead">
            We need a reachable mobile number to complete your booking. Your chauffeur and dispatch team use it for
            pickup coordination, arrival updates, and urgent trip changes.
          </p>
          <ul class="phone-required-modal__points">
            <li><i class="fa-solid fa-check" aria-hidden="true" /> Driver contact at pickup</li>
            <li><i class="fa-solid fa-check" aria-hidden="true" /> Live trip updates when needed</li>
            <li><i class="fa-solid fa-check" aria-hidden="true" /> Saved to your account for future rides</li>
          </ul>

          <form class="phone-required-modal__form" @submit.prevent="submit">
            <div class="field">
              <label class="label" for="checkout-phone">Mobile number</label>
              <input
                id="checkout-phone"
                v-model="phone"
                class="input"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                placeholder="+34 600 000 000"
                required
                :disabled="loading"
              />
              <p class="help">Include your country code for international numbers.</p>
            </div>

            <p v-if="localError || error" class="err" role="alert">{{ localError || error }}</p>

            <button class="btn btn--solid-gold booking-panel__cta" type="submit" :disabled="loading">
              <span v-if="loading">Saving…</span>
              <template v-else>
                Save &amp; continue to payment
                <i class="fa-solid fa-arrow-right" aria-hidden="true" />
              </template>
            </button>
            <button
              class="btn secondary booking-panel__cta"
              type="button"
              :disabled="loading"
              @click="emit('close')"
            >
              Cancel
            </button>
          </form>
        </article>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.phone-required-modal {
  z-index: 520;
  align-items: end;
  padding: clamp(12px, 4vw, 24px);
  padding-bottom: calc(clamp(12px, 4vw, 24px) + env(safe-area-inset-bottom));
}

@media (min-width: 560px) {
  .phone-required-modal {
    align-items: center;
  }
}

.phone-required-modal__dialog {
  width: min(100%, 480px);
}

.phone-required-modal__panel {
  padding: clamp(1.35rem, 4vw, 1.75rem);
  padding-top: clamp(1.5rem, 4vw, 2rem);
}

.phone-required-modal__points {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  display: grid;
  gap: 10px;
}

.phone-required-modal__points li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.875rem;
  color: var(--color-text);
  line-height: 1.45;
}

.phone-required-modal__points i {
  flex-shrink: 0;
  margin-top: 3px;
  color: var(--color-gold-bright);
  font-size: 0.75rem;
}

.phone-required-modal__form {
  display: grid;
  gap: 0.25rem;
}

.phone-required-modal__form .booking-panel__cta {
  margin-top: 0.75rem;
}
</style>

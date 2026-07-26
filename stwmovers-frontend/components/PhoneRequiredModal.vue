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
const phoneValid = ref(false)
const shouldAutofocus = ref(false)

const benefits = [
  'Driver contact at pickup',
  'Live trip updates when needed',
  'Saved to your account for future rides',
]

watch(
  () => props.show,
  async (open: boolean) => {
    if (open) {
      phone.value = props.initialPhone ?? ''
      localError.value = ''
      phoneValid.value = false
      shouldAutofocus.value = true
    } else {
      shouldAutofocus.value = false
    }
  },
)

watch(
  () => props.initialPhone,
  (value: string | undefined) => {
    if (props.show && !phone.value) phone.value = value ?? ''
  },
)

watch(phone, () => {
  if (localError.value) localError.value = ''
})

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

  if (!phoneValid.value || !isValidPhone(value)) {
    localError.value = 'Enter a valid mobile number for the selected country.'
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

        <article class="sign-in-panel phone-required-panel">
          <div class="phone-required-panel__icon" aria-hidden="true">
            <i class="fa-solid fa-phone" />
          </div>

          <h2 id="phone-required-title" class="phone-required-panel__title">Contact number required</h2>
          <p class="phone-required-panel__lead">
            We need a reachable mobile number to complete your booking. Your chauffeur and dispatch team use it for
            pickup coordination, arrival updates, and urgent trip changes.
          </p>

          <ul class="sign-in-panel__benefits phone-required-panel__benefits" aria-label="Why we need your number">
            <li v-for="benefit in benefits" :key="benefit">
              <i class="fa-solid fa-check" aria-hidden="true" />
              <span>{{ benefit }}</span>
            </li>
          </ul>

          <form class="phone-required-panel__form" @submit.prevent="submit">
            <div class="phone-required-panel__field">
              <label class="phone-required-panel__label" for="checkout-phone">Mobile number</label>
              <PhoneInput
                id="checkout-phone"
                v-model="phone"
                :disabled="loading"
                :autofocus="shouldAutofocus"
                :invalid="Boolean(localError || error)"
                @validate="phoneValid = $event"
              />
            </div>

            <p v-if="localError || error" class="err" role="alert">{{ localError || error }}</p>

            <button type="submit" class="phone-required-panel__submit" :disabled="loading">
              <span v-if="loading">Saving…</span>
              <template v-else>
                Save &amp; continue to payment
                <i class="fa-solid fa-arrow-right" aria-hidden="true" />
              </template>
            </button>

            <button
              type="button"
              class="phone-required-panel__cancel"
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

.phone-required-panel {
  width: 100%;
  max-width: 480px;
  padding: clamp(1.5rem, 4vw, 2rem);
  text-align: left;
  overflow: visible;
}

.phone-required-panel__icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-bottom: 1.25rem;
  background: rgba(216, 178, 76, 0.14);
  color: #d8b24c;
  font-size: 1.25rem;
}

.phone-required-panel__title {
  margin: 0 0 10px;
  font-family: var(--font-sans);
  font-size: clamp(1.35rem, 3vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #111827;
}

.phone-required-panel__lead {
  margin: 0 0 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #6b7280;
  max-width: none;
}

.phone-required-panel__benefits {
  margin-bottom: 1.25rem;
}

.phone-required-panel__form {
  display: grid;
  gap: 0;
  overflow: visible;
}

.phone-required-panel__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: visible;
}

.phone-required-panel__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6b7280;
}

.phone-required-panel__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 52px;
  margin-top: 1rem;
  border: 0;
  border-radius: 100px;
  background: #d8b24c;
  font-family: var(--font-eyebrow);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease, filter 0.2s ease;
}

.phone-required-panel__submit:hover:not(:disabled) {
  filter: brightness(1.05);
}

.phone-required-panel__submit:disabled {
  background: #d4d4d4;
  cursor: not-allowed;
}

.phone-required-panel__cancel {
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  border: 0;
  background: transparent;
  font-family: var(--font-eyebrow);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.15s ease;
}

.phone-required-panel__cancel:hover:not(:disabled) {
  color: #6b7280;
}

.phone-required-panel__cancel:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 399px) {
  .phone-required-panel {
    padding-top: clamp(1.75rem, 5vw, 2rem);
  }

  .sign-in-modal__close {
    top: 10px;
    right: 10px;
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  email: string
  loading: boolean
  error: string
  resendIn: number
}>()

const emit = defineEmits<{
  verify: [otp: string]
  resend: []
}>()

const otp = ref('')
const otpKey = ref(0)

watch(
  () => props.show,
  (open) => {
    if (open) {
      otp.value = ''
      otpKey.value += 1
    }
  },
)

watch(
  () => props.error,
  (message) => {
    if (message) {
      otp.value = ''
      otpKey.value += 1
    }
  },
)

const submit = () => {
  if (otp.value.length < 6 || props.loading) return
  emit('verify', otp.value)
}
</script>

<template>
  <div
    v-if="show"
    class="loading-overlay otp-verify-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="otp-verify-title"
  >
    <article class="card card--elevated booking-panel__card otp-verify-modal__panel">
      <div class="booking-panel__icon booking-panel__icon--green" aria-hidden="true">
        <i class="fa-solid fa-envelope-circle-check" />
      </div>
      <h2 id="otp-verify-title" class="booking-panel__title font-serif">Verify your email</h2>
      <p class="booking-panel__lead">
        Enter the 6-digit code sent to
        <strong class="booking-panel__email">{{ email }}</strong>
      </p>

      <OtpInput :key="otpKey" v-model="otp" class="booking-otp" />

      <p v-if="error" class="err" role="alert">{{ error }}</p>

      <button
        class="btn btn--solid-gold booking-panel__cta"
        type="button"
        :disabled="loading || otp.length < 6"
        @click="submit"
      >
        <span v-if="loading">Verifying…</span>
        <template v-else>
          Verify &amp; continue
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </template>
      </button>

      <button
        class="btn secondary booking-panel__cta"
        type="button"
        :disabled="loading || resendIn > 0"
        @click="emit('resend')"
      >
        Resend code<span v-if="resendIn > 0"> ({{ resendIn }}s)</span>
      </button>
    </article>
  </div>
</template>

<style scoped>
.otp-verify-modal {
  z-index: 450;
  padding: var(--space-block, 1.25rem);
}

.otp-verify-modal__panel {
  width: min(100%, 520px);
  margin: 0 auto;
}
</style>

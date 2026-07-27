<script setup lang="ts">
import { PICKUP_CITY_DETAILS } from '~/utils/cities'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  'choose-pickup': []
}>()

const dialogRef = ref<HTMLElement | null>(null)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.show,
  async (open: boolean) => {
    if (!import.meta.client) return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      dialogRef.value?.focus()
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
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="sign-in-modal pickup-validation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pickup-validation-title"
      aria-describedby="pickup-validation-desc"
      @click.self="emit('close')"
    >
      <div ref="dialogRef" class="sign-in-modal__dialog pickup-validation-modal__dialog" tabindex="-1">
        <button type="button" class="sign-in-modal__close" aria-label="Close" @click="emit('close')">
          <i class="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <article class="sign-in-panel pickup-validation-panel">
          <div class="sign-in-panel__icon pickup-validation-panel__icon" aria-hidden="true">
            <i class="fa-solid fa-map-location-dot" />
          </div>

          <p class="pickup-validation-panel__eyebrow">Service area</p>
          <h2 id="pickup-validation-title" class="sign-in-panel__title pickup-validation-panel__title">
            This pickup isn't in our service area yet
          </h2>
          <p id="pickup-validation-desc" class="sign-in-panel__lead pickup-validation-panel__lead">
            We currently offer transfers starting from the cities below. Pick one of these as your pickup point and
            we'll take care of the rest.
          </p>

          <ul class="pickup-validation-panel__cities" aria-label="Supported pickup cities">
            <li v-for="city in PICKUP_CITY_DETAILS" :key="city.name">
              <span class="pickup-validation-panel__city-icon" aria-hidden="true">
                <i class="fa-solid fa-location-dot" />
              </span>
              <span class="pickup-validation-panel__city-copy">
                <strong>{{ city.name }}</strong>
                <span v-if="city.hint" class="pickup-validation-panel__city-hint">{{ city.hint }}</span>
              </span>
            </li>
          </ul>

          <div class="pickup-validation-panel__actions">
            <button type="button" class="pickup-validation-panel__btn pickup-validation-panel__btn--primary" @click="emit('choose-pickup')">
              Choose a supported pickup
            </button>
            <button type="button" class="pickup-validation-panel__btn pickup-validation-panel__btn--secondary" @click="emit('close')">
              Dismiss
            </button>
          </div>
        </article>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.pickup-validation-modal {
  z-index: 520;
  padding: clamp(12px, 4vw, 24px);
  padding-bottom: calc(clamp(12px, 4vw, 24px) + env(safe-area-inset-bottom));
}

.pickup-validation-modal__dialog {
  width: min(100%, 480px);
  outline: none;
}

.pickup-validation-panel {
  width: 100%;
  max-width: 480px;
  padding: clamp(1.35rem, 4vw, 2rem);
  text-align: left;
}

.pickup-validation-panel__icon {
  margin-left: 0;
  margin-right: auto;
  color: #d8b24c;
  font-size: 1.35rem;
}

.pickup-validation-panel__eyebrow {
  margin: 0 0 8px;
  font-family: var(--font-eyebrow);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.55);
}

.pickup-validation-panel__title {
  max-width: none;
  text-align: left;
}

.pickup-validation-panel__lead {
  margin-left: 0;
  margin-right: 0;
  max-width: none;
  text-align: left;
}

.pickup-validation-panel__cities {
  list-style: none;
  margin: 0 0 clamp(1.1rem, 3vw, 1.35rem);
  padding: 0;
  display: grid;
  gap: clamp(8px, 2vw, 10px);
}

.pickup-validation-panel__cities li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: clamp(12px, 3vw, 14px) clamp(14px, 3vw, 16px);
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fafaf8;
}

.pickup-validation-panel__city-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(216, 178, 76, 0.14);
  color: #d8b24c;
  font-size: 0.875rem;
}

.pickup-validation-panel__city-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.pickup-validation-panel__city-copy strong {
  font-size: clamp(0.9rem, 2.5vw, 0.95rem);
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.35;
}

.pickup-validation-panel__city-hint {
  font-size: clamp(0.8125rem, 2.2vw, 0.875rem);
  line-height: 1.45;
  color: #6b7280;
}

.pickup-validation-panel__actions {
  display: grid;
  gap: 10px;
}

.pickup-validation-panel__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  padding: 14px 20px;
  border-radius: 100px;
  font-family: var(--font-eyebrow);
  font-size: clamp(0.75rem, 2.2vw, 0.8125rem);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.pickup-validation-panel__btn--primary {
  border: 0;
  background: #d8b24c;
  color: #1a1a1a;
}

.pickup-validation-panel__btn--primary:hover {
  filter: brightness(1.05);
}

.pickup-validation-panel__btn--secondary {
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #374151;
}

.pickup-validation-panel__btn--secondary:hover {
  border-color: #cdcdcd;
  background: #fafaf8;
}

@media (max-width: 399px) {
  .pickup-validation-panel {
    padding-top: clamp(1.5rem, 5vw, 1.75rem);
  }

  .sign-in-modal__close {
    top: 10px;
    right: 10px;
  }
}
</style>

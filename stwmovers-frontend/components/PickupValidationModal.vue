<script setup lang="ts">
import { PICKUP_CITY_DETAILS } from '~/utils/cities'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
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
    <Transition name="pickup-modal">
      <div
        v-if="show"
        class="sign-in-modal pickup-validation-modal"
        role="presentation"
        @click.self="emit('close')"
      >
        <div
          ref="dialogRef"
          class="sign-in-modal__dialog pickup-validation-modal__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pickup-validation-title"
          aria-describedby="pickup-validation-desc"
          tabindex="-1"
        >
          <button type="button" class="sign-in-modal__close" aria-label="Close" @click="emit('close')">
            <i class="fa-solid fa-xmark" aria-hidden="true" />
          </button>

          <article class="card card--elevated pickup-validation-modal__panel">
            <div class="booking-panel__icon booking-panel__icon--gold" aria-hidden="true">
              <i class="fa-solid fa-map-location-dot" />
            </div>

            <p class="pickup-validation-modal__eyebrow eyebrow">Service area</p>
            <h2 id="pickup-validation-title" class="booking-panel__title font-serif">
              This pickup isn't in our service area yet
            </h2>
            <p id="pickup-validation-desc" class="booking-panel__lead">
              We currently offer transfers starting from the cities below. Pick one of these as your pickup point and
              we'll take care of the rest.
            </p>

            <ul class="pickup-validation-modal__cities">
              <li v-for="city in PICKUP_CITY_DETAILS" :key="city.name">
                <div class="pickup-validation-modal__city-icon" aria-hidden="true">
                  <i class="fa-solid fa-location-dot" />
                </div>
                <div class="pickup-validation-modal__city-copy">
                  <strong>{{ city.name }}</strong>
                  <span v-if="city.hint" class="help">{{ city.hint }}</span>
                </div>
              </li>
            </ul>

            <div class="pickup-validation-modal__actions">
              <button type="button" class="btn btn--solid-gold booking-panel__cta" @click="emit('close')">
                Choose a supported pickup
              </button>
              <button type="button" class="btn secondary booking-panel__cta" @click="emit('close')">
                Dismiss
              </button>
            </div>
          </article>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pickup-validation-modal {
  z-index: 520;
  align-items: end;
  padding: clamp(12px, 4vw, 24px);
  padding-bottom: calc(clamp(12px, 4vw, 24px) + env(safe-area-inset-bottom));
}

@media (min-width: 560px) {
  .pickup-validation-modal {
    align-items: center;
  }
}

.pickup-validation-modal__dialog {
  width: min(100%, 500px);
  outline: none;
}

.pickup-validation-modal__panel {
  padding: clamp(1.35rem, 4vw, 1.85rem);
  padding-top: clamp(1.5rem, 4vw, 2rem);
  text-align: left;
}

.pickup-validation-modal__eyebrow {
  margin: 0 0 8px;
}

.pickup-validation-modal__cities {
  list-style: none;
  margin: 0 0 1.35rem;
  padding: 0;
  display: grid;
  gap: 10px;
}

.pickup-validation-modal__cities li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.03);
}

.pickup-validation-modal__city-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(201, 162, 39, 0.12);
  color: var(--color-gold-bright);
  font-size: 0.9rem;
}

.pickup-validation-modal__city-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.pickup-validation-modal__city-copy strong {
  font-size: 0.95rem;
}

.pickup-validation-modal__city-copy .help {
  margin: 0;
  line-height: 1.45;
}

.pickup-validation-modal__actions {
  display: grid;
  gap: 10px;
}

.pickup-validation-modal__actions .booking-panel__cta {
  margin-top: 0;
  width: 100%;
}

.pickup-modal-enter-active,
.pickup-modal-leave-active {
  transition: opacity 0.2s ease;
}

.pickup-modal-enter-active .pickup-validation-modal__dialog,
.pickup-modal-leave-active .pickup-validation-modal__dialog {
  transition: transform 0.28s ease, opacity 0.2s ease;
}

.pickup-modal-enter-from,
.pickup-modal-leave-to {
  opacity: 0;
}

.pickup-modal-enter-from .pickup-validation-modal__dialog,
.pickup-modal-leave-to .pickup-validation-modal__dialog {
  transform: translateY(16px);
  opacity: 0;
}

@media (min-width: 560px) {
  .pickup-modal-enter-from .pickup-validation-modal__dialog,
  .pickup-modal-leave-to .pickup-validation-modal__dialog {
    transform: translateY(8px) scale(0.98);
  }
}
</style>

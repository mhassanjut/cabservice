<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'list'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <article
    class="dashboard-booking-card dashboard-skeleton-booking"
    :class="{ 'dashboard-skeleton-booking--list': variant === 'list' }"
    aria-hidden="true"
  >
    <header class="dashboard-skeleton-booking__header">
      <div class="dashboard-skeleton-booking__titles">
        <div class="dashboard-skeleton__bone dashboard-skeleton-booking__eyebrow" />
        <div class="dashboard-skeleton__bone dashboard-skeleton-booking__ref" />
      </div>
      <div class="dashboard-skeleton-booking__header-end">
        <div class="dashboard-skeleton__bone dashboard-skeleton-booking__badge" />
        <div v-if="variant === 'list'" class="dashboard-skeleton__bone dashboard-skeleton-booking__price" />
      </div>
    </header>

    <hr class="dashboard-booking-card__divider" />

    <template v-if="variant === 'list'">
      <div class="dashboard-skeleton-booking__list-route">
        <div v-for="n in 2" :key="n" class="dashboard-skeleton-booking__list-stop">
          <div class="dashboard-skeleton__bone dashboard-skeleton-booking__pin" />
          <div class="dashboard-skeleton-booking__stop-lines">
            <div class="dashboard-skeleton__bone dashboard-skeleton-booking__stop-label" />
            <div class="dashboard-skeleton__bone dashboard-skeleton-booking__stop-value" />
          </div>
        </div>
      </div>

      <hr class="dashboard-booking-card__divider" />

      <footer class="dashboard-skeleton-booking__footer">
        <div class="dashboard-skeleton-booking__meta-row">
          <div class="dashboard-skeleton__bone dashboard-skeleton-booking__meta-line" />
          <div class="dashboard-skeleton__bone dashboard-skeleton-booking__meta-line" />
        </div>
        <div class="dashboard-skeleton__bone dashboard-skeleton-booking__action" />
      </footer>
    </template>

    <template v-else>
      <div class="dashboard-skeleton-booking__route">
        <div class="dashboard-skeleton__bone dashboard-skeleton-booking__track" />
        <div class="dashboard-skeleton-booking__stops">
          <div v-for="n in 2" :key="n" class="dashboard-skeleton-booking__stop-block">
            <div class="dashboard-skeleton__bone dashboard-skeleton-booking__stop-label" />
            <div class="dashboard-skeleton__bone dashboard-skeleton-booking__stop-value" />
          </div>
        </div>
      </div>

      <hr class="dashboard-booking-card__divider" />

      <footer class="dashboard-skeleton-booking__footer">
        <div class="dashboard-skeleton-booking__meta-row">
          <div class="dashboard-skeleton__bone dashboard-skeleton-booking__meta-line" />
          <div class="dashboard-skeleton__bone dashboard-skeleton-booking__meta-line" />
        </div>
        <div class="dashboard-skeleton__bone dashboard-skeleton-booking__action" />
      </footer>
    </template>
  </article>
</template>

<template>
  <div class="guest-booking-skeleton" aria-hidden="true">
    <header class="vehicle-page__header">
      <p class="vehicle-page__eyebrow">Guest booking</p>
      <div class="dashboard-skeleton__bone guest-booking-skeleton__title" />
      <div class="dashboard-skeleton__bone guest-booking-skeleton__badge" />
      <div class="dashboard-skeleton__bone guest-booking-skeleton__lead" />
    </header>

    <div class="confirm-page__stack">
      <div class="confirm-grid">
        <article class="confirm-details booking-card guest-booking-skeleton__card">
          <header class="confirm-details__head">
            <div class="dashboard-skeleton__bone guest-booking-skeleton__card-eyebrow" />
            <div class="dashboard-skeleton__bone guest-booking-skeleton__card-title" />
          </header>

          <hr class="booking-card__divider confirm-details__divider" />

          <ul class="guest-booking-skeleton__rows">
            <li v-for="n in 5" :key="n" class="guest-booking-skeleton__row">
              <div class="dashboard-skeleton__bone guest-booking-skeleton__icon" />
              <div class="guest-booking-skeleton__row-text">
                <div class="dashboard-skeleton__bone guest-booking-skeleton__row-label" />
                <div class="dashboard-skeleton__bone guest-booking-skeleton__row-value" />
              </div>
            </li>
          </ul>

          <hr class="booking-card__divider confirm-details__divider" />

          <footer class="confirm-details__fare-row">
            <div class="dashboard-skeleton__bone guest-booking-skeleton__fare-label" />
            <div class="dashboard-skeleton__bone guest-booking-skeleton__fare-value" />
          </footer>
        </article>

        <aside class="confirm-aside">
          <article class="confirm-status booking-card guest-booking-skeleton__card">
            <header class="confirm-status__head">
              <div class="dashboard-skeleton__bone guest-booking-skeleton__status-title" />
              <div class="dashboard-skeleton__bone guest-booking-skeleton__status-lead" />
            </header>
            <hr class="booking-card__divider confirm-status__divider" />
            <div class="guest-booking-skeleton__timeline">
              <div v-for="n in 4" :key="n" class="guest-booking-skeleton__timeline-item">
                <div class="dashboard-skeleton__bone guest-booking-skeleton__timeline-dot" />
                <div class="dashboard-skeleton__bone guest-booking-skeleton__timeline-label" />
              </div>
            </div>
          </article>

          <article class="booking-card confirm-upsell guest-booking-skeleton__card">
            <div class="dashboard-skeleton__bone guest-booking-skeleton__upsell-icon" />
            <div class="dashboard-skeleton__bone guest-booking-skeleton__upsell-title" />
            <div class="dashboard-skeleton__bone guest-booking-skeleton__upsell-lead" />
            <div class="dashboard-skeleton__bone guest-booking-skeleton__upsell-btn" />
          </article>
        </aside>
      </div>
    </div>
  </div>
</template>

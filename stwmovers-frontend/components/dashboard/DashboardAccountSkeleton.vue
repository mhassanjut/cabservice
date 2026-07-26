<template>
  <div class="dashboard-account dashboard-skeleton-account-wrap" aria-hidden="true">
    <article class="dashboard-account-card dashboard-skeleton-account">
      <div class="dashboard-skeleton-account__header">
        <div class="dashboard-skeleton__bone dashboard-skeleton-account__eyebrow" />
        <div class="dashboard-skeleton__bone dashboard-skeleton-account__title" />
      </div>
      <div class="dashboard-skeleton-account__profile">
        <div class="dashboard-skeleton__bone dashboard-skeleton-account__avatar" />
        <div class="dashboard-skeleton-account__identity">
          <div class="dashboard-skeleton__bone dashboard-skeleton-account__email" />
          <div class="dashboard-skeleton__bone dashboard-skeleton-account__help" />
        </div>
      </div>
      <div class="dashboard-skeleton-account__form">
        <div v-for="n in 2" :key="n" class="dashboard-skeleton-account__field">
          <div class="dashboard-skeleton__bone dashboard-skeleton-account__label" />
          <div class="dashboard-skeleton__bone dashboard-skeleton-account__input" />
        </div>
        <div class="dashboard-skeleton__bone dashboard-skeleton-account__submit" />
      </div>
    </article>
    <article class="dashboard-account-card dashboard-skeleton-account dashboard-skeleton-account--session">
      <div class="dashboard-skeleton__bone dashboard-skeleton-account__session-title" />
      <div class="dashboard-skeleton__bone dashboard-skeleton-account__session-desc" />
      <div class="dashboard-skeleton__bone dashboard-skeleton-account__logout" />
    </article>
  </div>
</template>

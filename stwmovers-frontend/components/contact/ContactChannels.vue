<script setup lang="ts">
import { contactCards, contactChannelsSection } from '~/data/contactContent'
</script>

<template>
  <section class="contact-section contact-channels-section" aria-labelledby="contact-channels-heading">
    <div class="contact-container">
      <div class="contact-channels-section__header">
        <p class="contact-eyebrow">{{ contactChannelsSection.eyebrow }}</p>
        <h2 id="contact-channels-heading" class="contact-heading contact-heading--sm">
          {{ contactChannelsSection.heading }}
        </h2>
      </div>

      <ul class="contact-cards">
        <li v-for="card in contactCards" :key="card.title" class="contact-card">
          <span class="contact-card__icon" aria-hidden="true">
            <i :class="card.icon" />
          </span>
          <div>
            <h3 class="contact-card__title">{{ card.title }}</h3>
            <a
              class="contact-card__value"
              :href="card.href"
              v-bind="card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
            >
              {{ card.value }}
            </a>
          </div>
          <p class="contact-card__desc">{{ card.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

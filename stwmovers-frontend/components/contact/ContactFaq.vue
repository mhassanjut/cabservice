<script setup lang="ts">
import { contactFaq, contactFaqItems } from '~/data/contactContent'

const openIndex = ref<number | null>(0)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="contact-section" aria-labelledby="contact-faq-heading">
    <div class="contact-container">
      <div class="contact-faq__header">
        <p class="contact-eyebrow">{{ contactFaq.eyebrow }}</p>
        <h2 id="contact-faq-heading" class="contact-heading contact-heading--sm">
          {{ contactFaq.heading }}
        </h2>
      </div>

      <div class="contact-faq__list">
        <div
          v-for="(item, index) in contactFaqItems"
          :key="item.question"
          class="contact-faq__item"
          :class="{ 'is-open': openIndex === index }"
        >
          <button
            type="button"
            class="contact-faq__trigger"
            :aria-expanded="openIndex === index"
            :aria-controls="`contact-faq-panel-${index}`"
            @click="toggle(index)"
          >
            {{ item.question }}
            <span class="contact-faq__icon" aria-hidden="true">
              <i class="fa-solid fa-plus" />
            </span>
          </button>
          <div v-show="openIndex === index" :id="`contact-faq-panel-${index}`" class="contact-faq__panel">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

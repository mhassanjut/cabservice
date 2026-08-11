<script setup lang="ts">
import type { FaqCategory } from '~/data/faqContent'

defineProps<{ category: FaqCategory }>()

const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section
    :id="category.id"
    class="faq-section faq-category"
    :aria-labelledby="`${category.id}-heading`"
  >
    <div class="faq-container">
      <header class="faq-category__head">
        <h2 :id="`${category.id}-heading`" class="faq-heading faq-heading--sm">
          {{ category.title }}
        </h2>
      </header>

      <div class="faq-accordion">
        <div
          v-for="(item, index) in category.items"
          :key="item.q"
          class="faq-accordion__item"
          :class="{ 'is-open': openIndex === index }"
        >
          <button
            type="button"
            class="faq-accordion__trigger"
            :aria-expanded="openIndex === index"
            :aria-controls="`${category.id}-panel-${index}`"
            @click="toggle(index)"
          >
            {{ item.q }}
            <span class="faq-accordion__icon" aria-hidden="true">
              <i class="fa-solid fa-plus" />
            </span>
          </button>
          <div
            v-show="openIndex === index"
            :id="`${category.id}-panel-${index}`"
            class="faq-accordion__panel"
          >
            {{ item.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

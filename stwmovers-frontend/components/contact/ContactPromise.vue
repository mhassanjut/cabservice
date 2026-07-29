<script setup lang="ts">
import { contactPromise } from '~/data/contactContent'
</script>

<template>
  <section class="contact-promise" aria-labelledby="contact-promise-heading">
    <div class="contact-promise__media" aria-hidden="true">
      <NuxtImg
        :src="contactPromise.image"
        alt=""
        width="1440"
        height="520"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="contact-promise__overlay" aria-hidden="true" />
    <div class="contact-promise__content">
      <h2 id="contact-promise-heading" class="contact-promise__heading">
        {{ contactPromise.heading }}
      </h2>
      <p class="contact-promise__body">{{ contactPromise.body }}</p>
      <NuxtLink :to="contactPromise.cta.href" :prefetch="false" class="contact-btn contact-btn--gold">
        {{ contactPromise.cta.label }}
      </NuxtLink>
    </div>
  </section>
</template>

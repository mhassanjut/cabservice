<script setup lang="ts">
definePageMeta({ layout: false })
if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Not found' })
useHead({ title: 'Control preview', meta: [{ name: 'robots', content: 'noindex,nofollow' }] })
const email = ref('')
const phone = ref('')
</script>

<template>
  <main class="control-preview">
    <h1>Shared control preview</h1>
    <section v-for="theme in ['public', 'booking']" :key="theme" :class="{ 'site-root--booking': theme === 'booking' }">
      <h2>{{ theme }}</h2>
      <div class="control-preview__buttons">
        <UiButton>Primary</UiButton>
        <UiButton variant="secondary" to="/locations">Service areas</UiButton>
        <UiButton variant="outline">Outline</UiButton>
        <UiButton disabled>Continue</UiButton>
        <UiButton loading>Saving</UiButton>
      </div>
      <UiTextField :id="`${theme}-email`" v-model="email" label="Email" type="email" autocomplete="email" />
      <UiTextField :id="`${theme}-error`" label="Required name" error="Please enter your name." />
      <label :for="`${theme}-phone`">Phone</label>
      <PhoneInput :id="`${theme}-phone`" v-model="phone" />
    </section>
  </main>
</template>

<style scoped>
.control-preview { padding: 24px; font-family: var(--font-sans, sans-serif); }
.control-preview h1 { font-size: 24px; }
.control-preview section { display: grid; gap: 16px; padding: 24px; margin-block: 24px; background: var(--ui-field-bg); color: var(--ui-field-text); }
.control-preview h2 { margin: 0; color: inherit; font-size: 20px; }
.control-preview__buttons { display: flex; flex-wrap: wrap; gap: 12px; }
</style>

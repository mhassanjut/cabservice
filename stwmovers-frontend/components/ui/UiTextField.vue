<script setup lang="ts">
defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{ id: string; label: string; error?: string }>(), { error: '' })
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="ui-field">
    <label :for="id" class="ui-field__label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      v-model="model"
      class="ui-field__input"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="[typeof $attrs['aria-describedby'] === 'string' ? $attrs['aria-describedby'] : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined"
    >
    <p v-if="error" :id="`${id}-error`" class="ui-field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.ui-field { display: grid; gap: var(--ui-space); min-width: 0; }
.ui-field__label { color: var(--ui-field-muted); font: 600 0.875rem/1.5 var(--font-sans, sans-serif); }
.ui-field__input { box-sizing: border-box; width: 100%; min-height: var(--ui-control-height); padding: 12px 16px; border: 1px solid var(--ui-field-border); border-radius: var(--ui-radius); background: var(--ui-field-bg); color: var(--ui-field-text); font: 400 1rem/1.5 var(--font-sans, sans-serif); }
.ui-field__input::placeholder { color: var(--ui-field-muted); opacity: 1; }
.ui-field__input[aria-invalid] { border-color: var(--ui-error); }
.ui-field__input:focus-visible { outline: 2px solid var(--ui-focus); outline-offset: 2px; }
.ui-field__input:disabled { background: var(--ui-disabled-bg); color: var(--ui-disabled-text); cursor: not-allowed; }
.ui-field__error { margin: 0; color: var(--ui-error); font-size: 0.875rem; }
</style>

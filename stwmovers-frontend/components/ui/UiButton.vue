<script setup lang="ts">
import { computed, resolveComponent } from 'vue'

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  variant?: 'primary' | 'secondary' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}>(), {
  to: undefined,
  href: undefined,
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
})

const unavailable = computed(() => props.disabled || props.loading)
// Disabled links become real disabled buttons: no mouse or keyboard navigation.
const element = computed(() => unavailable.value ? 'button' : props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button')
const destination = computed(() => unavailable.value ? {} : props.to ? { to: props.to } : props.href ? { href: props.href } : {})
</script>

<template>
  <component
    :is="element"
    class="ui-button"
    :class="`ui-button--${variant}`"
    v-bind="destination"
    :type="element === 'button' ? type : undefined"
    :disabled="element === 'button' ? unavailable : undefined"
    :aria-busy="loading || undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ui-space);
  min-height: var(--ui-control-height);
  padding: 12px 24px;
  border: 1px solid transparent;
  border-radius: 999px;
  font: 600 0.9375rem/1.4 var(--font-sans, sans-serif);
  text-align: center;
  text-decoration: none;
  overflow-wrap: anywhere;
  cursor: pointer;
  transition: background-color var(--ui-motion), color var(--ui-motion), border-color var(--ui-motion);
}
.ui-button--primary { background: var(--ui-action-bg); color: var(--ui-action-text); }
.ui-button--secondary { background: var(--ui-secondary-bg); color: var(--ui-secondary-text); }
.ui-button--outline { background: transparent; color: var(--ui-field-text); border-color: var(--ui-field-border); }
@media (hover: hover) {
  .ui-button:not(:disabled):hover { background: var(--ui-action-hover); color: var(--ui-action-text); border-color: var(--ui-action-hover); }
}
.ui-button:disabled { background: var(--ui-disabled-bg); color: var(--ui-disabled-text); border-color: var(--ui-field-border); cursor: not-allowed; }
.ui-button:focus-visible { outline: 2px solid var(--ui-focus); outline-offset: 3px; }
</style>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    size?: 'xs' | 'sm' | 'md' | 'lg'
    compact?: boolean
  }>(),
  {
    label: 'Please wait…',
    size: 'md',
    compact: false,
  },
)
</script>

<template>
  <div class="app-loader" :class="[`app-loader--${size}`, { 'app-loader--compact': compact }]">
    <div class="app-loader__mark" aria-hidden="true">
      <span class="app-loader__ring" />
      <span class="app-loader__ring app-loader__ring--reverse" />
      <img src="/Logo.svg" alt="" class="app-loader__logo" width="146" height="40" />
    </div>

    <p v-if="label && !compact" class="app-loader__label">{{ label }}</p>

    <div v-if="!compact" class="app-loader__dots" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  </div>
</template>

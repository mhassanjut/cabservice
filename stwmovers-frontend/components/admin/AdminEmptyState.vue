<script setup lang="ts">
defineProps<{
  title: string
  message: string
  icon?: string
}>()
</script>

<template>
  <div class="admin-empty card card--elevated">
    <i class="fa-solid admin-empty__icon" :class="icon || 'fa-inbox'" aria-hidden="true" />
    <h3 class="font-serif">{{ title }}</h3>
    <p>{{ message }}</p>
    <div v-if="$slots.action" class="admin-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

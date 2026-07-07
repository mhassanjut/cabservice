<script setup lang="ts">
import type { AdminBadgeTone } from '~/utils/adminStatus'

defineProps<{
  tone?: AdminBadgeTone
}>()
</script>

<template>
  <span class="admin-badge" :class="tone ? `admin-badge--${tone}` : 'admin-badge--muted'">
    <slot />
  </span>
</template>

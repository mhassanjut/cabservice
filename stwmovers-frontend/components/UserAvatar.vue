<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string | null
    name?: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'dashboard'
  }>(),
  { size: 'md', variant: 'default' },
)

const auth = useAuthStore()

const resolvedSrc = computed(() => (props.src ?? auth.profilePictureUrl ?? '').trim())
const photoVisible = ref(Boolean(resolvedSrc.value))

const showPhoto = computed(() => props.variant !== 'dashboard' && photoVisible.value)

const initials = computed(() => {
  const label = (props.name ?? auth.fullName ?? auth.email ?? 'U').trim()
  const parts = label.split(/\s+/).filter(Boolean)
  if (!parts.length) return 'U'
  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ''
  return (first + last).toUpperCase() || 'U'
})

watch(resolvedSrc, (url: string) => {
  photoVisible.value = Boolean(url)
})

const onError = () => {
  photoVisible.value = false
}
</script>

<template>
  <span
    class="user-avatar"
    :class="[
      `user-avatar--${size}`,
      `user-avatar--${variant}`,
      { 'user-avatar--photo': showPhoto },
    ]"
    role="img"
    :aria-label="name || auth.fullName || 'Profile photo'"
  >
    <img
      v-if="showPhoto"
      :src="resolvedSrc"
      alt=""
      class="user-avatar__img"
      referrerpolicy="no-referrer"
      @error="onError"
    />
    <span v-else class="user-avatar__initial">{{ initials }}</span>
  </span>
</template>

<style scoped>
.user-avatar {
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--color-gold-subtle);
  color: var(--color-gold-bright);
  font-weight: 700;
}

.user-avatar--dashboard {
  border: 1px solid var(--bk-gold, #d8b24c);
  background: var(--bk-gold-soft, #f7f1e5);
  color: var(--bk-gold, #d8b24c);
  font-family: var(--bk-font-display, inherit);
  font-weight: 600;
}

.user-avatar--sm {
  width: 28px;
  height: 28px;
  font-size: 0.8125rem;
}

.user-avatar--md {
  width: 52px;
  height: 52px;
  font-size: 1.125rem;
}

.user-avatar--lg {
  width: 56px;
  height: 56px;
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
}

.user-avatar--lg.user-avatar--dashboard {
  font-size: 1.125rem;
  font-weight: 700;
}

.user-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.user-avatar__initial {
  line-height: 1;
}
</style>

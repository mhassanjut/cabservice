<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string | null
    name?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const auth = useAuthStore()

const resolvedSrc = computed(() => (props.src ?? auth.profilePictureUrl ?? '').trim())
const showPhoto = ref(Boolean(resolvedSrc.value))

const initial = computed(() => {
  const label = (props.name ?? auth.fullName ?? auth.email ?? 'U').trim()
  return label.charAt(0).toUpperCase() || 'U'
})

watch(resolvedSrc, (url: string) => {
  showPhoto.value = Boolean(url)
})

const onError = () => {
  showPhoto.value = false
}
</script>

<template>
  <span
    class="user-avatar"
    :class="[`user-avatar--${size}`, { 'user-avatar--photo': showPhoto }]"
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
    <span v-else class="user-avatar__initial">{{ initial }}</span>
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
  font-size: 1.125rem;
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

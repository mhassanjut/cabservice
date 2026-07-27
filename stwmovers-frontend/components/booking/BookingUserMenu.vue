<script setup lang="ts">
import { routes } from '~/constants/routes'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const displayName = computed(
  () => auth.fullName || auth.email || 'Guest',
)

const initials = computed(() => {
  const parts = displayName.value.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'G'
  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ''
  return (first + last).toUpperCase()
})

const menuItems = [
  { label: 'Home', to: routes.home },
  { label: 'Bookings', to: routes.dashboardBookings },
  { label: 'Profile', to: routes.dashboardAccount },
] as const

const toggle = (event: MouseEvent) => {
  event.stopPropagation()
  open.value = !open.value
}

const close = () => {
  open.value = false
}

const go = async (path: string) => {
  close()
  await router.push(path)
}

const handleLogout = async () => {
  close()
  await auth.logout()
  await router.push(routes.home)
}

const onDocumentClick = (event: MouseEvent) => {
  if (!open.value) return
  const root = rootRef.value
  if (root && !root.contains(event.target as Node)) close()
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})

watch(() => route.fullPath, close)

watch(
  () => auth.isLoggedIn,
  (loggedIn: boolean) => {
    if (!loggedIn) close()
  },
)
</script>

<template>
  <div ref="rootRef" class="booking-user-menu">
    <button
      type="button"
      class="booking-user-menu__trigger"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="toggle($event)"
    >
      <span class="booking-user-menu__avatar" aria-hidden="true">{{ initials }}</span>
      <span class="booking-user-menu__name">{{ displayName }}</span>
    </button>

    <div v-if="open" class="booking-user-menu__panel" role="menu">
      <button
        v-for="item in menuItems"
        :key="item.to"
        type="button"
        class="booking-user-menu__item"
        role="menuitem"
        @click="go(item.to)"
      >
        {{ item.label }}
      </button>
      <hr class="booking-user-menu__divider" />
      <button
        type="button"
        class="booking-user-menu__item booking-user-menu__item--danger"
        role="menuitem"
        @click="handleLogout"
      >
        Log out
      </button>
    </div>
  </div>
</template>

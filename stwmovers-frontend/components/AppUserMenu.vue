<script setup lang="ts">
import { routes } from '~/constants/routes'

const props = defineProps<{ mobileSheet?: boolean }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { open: openSignIn } = useCustomerSignIn()
const open = ref(false)

const isCustomer = computed(() => auth.isLoggedIn && auth.role === 'CUSTOMER')
const isGuest = computed(() => auth.isGuestSession && !auth.isLoggedIn)

const toggle = () => {
  open.value = !open.value
}

const close = () => {
  open.value = false
  emit('close')
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

const exitGuest = async () => {
  close()
  auth.clearGuestSession()
  await router.push(routes.home)
}

onMounted(() => auth.listenForAuthChanges(() => {
  if (!auth.isLoggedIn && !auth.isGuestSession) close()
}))

watch(() => route.fullPath, close)
</script>

<template>
  <div class="user-menu" :class="{ 'user-menu--sheet': mobileSheet }">
    <button
      v-if="isCustomer"
      type="button"
      class="user-menu__trigger"
      :aria-expanded="open"
      @click="toggle"
    >
      <UserAvatar size="sm" :name="auth.fullName" />
      <span class="user-menu__name">{{ auth.firstName }}</span>
      <i class="fa-solid fa-chevron-down" aria-hidden="true" />
    </button>

    <button
      v-else-if="isGuest"
      type="button"
      class="user-menu__trigger user-menu__trigger--guest"
      :aria-expanded="open"
      @click="toggle"
    >
      <span class="user-menu__avatar user-menu__avatar--guest">{{ auth.avatarInitial }}</span>
      <span class="user-menu__name">Guest</span>
      <i class="fa-solid fa-chevron-down" aria-hidden="true" />
    </button>

    <button v-else type="button" class="btn user-menu__login app-nav__action-btn" @click="openSignIn()">Login</button>

    <div v-if="open && isCustomer" class="user-menu__panel" :class="{ 'user-menu__panel--sheet': mobileSheet }">
      <div v-if="mobileSheet" class="user-menu__handle" aria-hidden="true" />
      <p class="user-menu__panel-head">{{ auth.fullName }}</p>
      <button type="button" class="user-menu__item" @click="go(routes.dashboard)">Dashboard</button>
      <button type="button" class="user-menu__item" @click="go(routes.dashboardBookings)">My Bookings</button>
      <button type="button" class="user-menu__item" @click="go(routes.dashboardAccount)">Account Settings</button>
      <button type="button" class="user-menu__item user-menu__item--danger" @click="handleLogout">Logout</button>
    </div>

    <div v-else-if="open && isGuest" class="user-menu__panel" :class="{ 'user-menu__panel--sheet': mobileSheet }">
      <div v-if="mobileSheet" class="user-menu__handle" aria-hidden="true" />
      <p class="user-menu__panel-head">{{ auth.guestSession?.fullName }}</p>
      <button
        v-if="auth.guestSession?.bookingReference"
        type="button"
        class="user-menu__item"
        @click="go(routes.guestBooking)"
      >
        Your booking
      </button>
      <button type="button" class="user-menu__item" @click="go(routes.booking)">Complete as member</button>
      <button type="button" class="user-menu__item user-menu__item--danger" @click="exitGuest">Exit guest session</button>
    </div>

    <div v-if="open && mobileSheet" class="user-menu__backdrop" @click="close" />
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
}

.user-menu__trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.user-menu__trigger--guest {
  border-color: rgba(201, 162, 39, 0.35);
}

.user-menu__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--color-gold-subtle);
  color: var(--color-gold-bright);
  font-size: 0.8125rem;
  font-weight: 600;
  overflow: hidden;
}

.user-menu__avatar--photo {
  object-fit: cover;
}

.user-menu__avatar--guest {
  background: rgba(91, 155, 213, 0.2);
  color: #7eb8e8;
}

.user-menu__name {
  font-size: 0.875rem;
  max-width: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 859px) {
  .user-menu__name {
    display: none;
  }

  .user-menu__trigger {
    padding: 6px;
  }

  .user-menu__panel {
    position: fixed;
    inset: auto 0 0 0;
    top: auto;
    min-width: 0;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    padding: 12px 16px calc(16px + var(--mobile-nav-h));
    animation: sheet-up 0.28s ease;
  }
}

.user-menu__panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  padding: 8px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius);
  background: var(--color-bg-card);
  box-shadow: var(--shadow-lg);
  z-index: 500;
}

.user-menu__panel--sheet {
  position: fixed;
  inset: auto 0 0 0;
  top: auto;
  min-width: 0;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 12px 16px calc(16px + var(--mobile-nav-h));
  animation: sheet-up 0.28s ease;
}

.user-menu__handle {
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: var(--color-gold);
  margin: 0 auto 12px;
}

.user-menu__panel-head {
  margin: 0 0 8px;
  padding: 4px 8px;
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.user-menu__item {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.user-menu__item:hover {
  background: var(--color-bg-elevated);
}

.user-menu__item--danger {
  color: var(--color-danger);
}

.user-menu__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.72);
  z-index: 450;
}

@keyframes sheet-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>

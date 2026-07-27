<script setup lang="ts">
import { routes } from '~/constants/routes'

const auth = useAuthStore()
const { items, groups, isActive, current } = useAdminNav()
const drawerOpen = ref(false)
const ready = ref(false)

onMounted(() => {
  auth.hydrate()
  ready.value = true
})

const logout = async () => {
  await auth.logout()
  await navigateTo(routes.adminLogin)
}

const closeDrawer = () => {
  drawerOpen.value = false
}
</script>

<template>
  <div v-if="!ready" class="admin-boot" aria-live="polite">
    <AppLoader label="Loading console…" size="md" />
  </div>
  <div v-else class="admin-app">
    <aside class="admin-sidebar card card--elevated" aria-label="Admin navigation">
      <div class="admin-sidebar__brand">
        <p class="eyebrow">STW Movers</p>
        <p class="admin-sidebar__title font-serif">Admin console</p>
      </div>

      <nav class="admin-sidebar__nav">
        <template v-for="group in groups" :key="group.id">
          <p class="admin-sidebar__group">{{ group.title }}</p>
          <NuxtLink
            v-for="item in items.filter((entry) => entry.group === group.id)"
            :key="item.to"
            :to="item.to"
            class="admin-sidebar__link"
            :class="{ 'is-active': isActive(item.to) }"
          >
            <i class="fa-solid" :class="item.icon" aria-hidden="true" />
            <span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.description }}</small>
            </span>
          </NuxtLink>
        </template>
      </nav>
    </aside>

    <div class="admin-main">
      <header class="admin-header card card--elevated">
        <div class="admin-header__left">
          <button
            type="button"
            class="admin-header__menu"
            aria-label="Open admin menu"
            @click="drawerOpen = true"
          >
            <i class="fa-solid fa-bars" aria-hidden="true" />
          </button>
          <div>
            <p class="eyebrow admin-header__eyebrow">Admin</p>
            <h1 class="admin-header__title font-serif">{{ current.label }}</h1>
          </div>
        </div>
        <div class="admin-header__user">
          <UserAvatar :name="auth.fullName || auth.email" :src="auth.avatarUrl" size="sm" />
          <div class="admin-header__meta">
            <span class="admin-header__name">{{ auth.fullName || auth.email }}</span>
            <span class="admin-header__role">Administrator</span>
          </div>
          <button type="button" class="btn secondary admin-header__logout" @click="logout">Logout</button>
        </div>
      </header>

      <div class="admin-content">
        <slot />
      </div>
    </div>

    <div class="admin-drawer" :class="{ 'is-open': drawerOpen }" aria-hidden="true">
      <div class="admin-drawer__backdrop" @click="closeDrawer" />
      <aside class="admin-drawer__panel card card--elevated">
        <div class="admin-drawer__head">
          <p class="font-serif">Admin menu</p>
          <button type="button" class="admin-drawer__close" aria-label="Close menu" @click="closeDrawer">
            <i class="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <nav class="admin-sidebar__nav">
          <template v-for="group in groups" :key="`${group.id}-drawer`">
            <p class="admin-sidebar__group">{{ group.title }}</p>
            <NuxtLink
              v-for="item in items.filter((entry) => entry.group === group.id)"
              :key="`${item.to}-drawer`"
              :to="item.to"
              class="admin-sidebar__link"
              :class="{ 'is-active': isActive(item.to) }"
              @click="closeDrawer"
            >
              <i class="fa-solid" :class="item.icon" aria-hidden="true" />
              <span>
                <strong>{{ item.label }}</strong>
                <small>{{ item.description }}</small>
              </span>
            </NuxtLink>
          </template>
        </nav>
      </aside>
    </div>
  </div>
</template>

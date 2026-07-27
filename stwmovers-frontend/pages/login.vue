<script setup lang="ts">
import { routes } from '~/constants/routes'

const auth = useAuthStore()
const route = useRoute()

const redirect = computed(() => (route.query.redirect as string) || undefined)

onMounted(() => {
  auth.hydrate()
  if (auth.isLoggedIn) {
    navigateTo(redirect.value ?? routes.home)
  }
})

usePageSeo({ title: 'Sign in', path: '/login' })
</script>

<template>
  <section class="sign-in-page">
    <CustomerSignInPanel :redirect="redirect" />
  </section>
</template>

<style scoped>
.sign-in-page {
  display: grid;
  place-items: center;
  min-height: min(70vh, 640px);
  padding: var(--space-block) 0;
}
</style>

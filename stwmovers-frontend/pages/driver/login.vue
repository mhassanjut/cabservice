<script setup lang="ts">
import { authService } from '~/services/api/auth.service'
import { routes } from '~/constants/routes'

const auth = useAuthStore()
const email = ref('')
const password = ref('')

const submit = async () => {
  const res = await authService.login(email.value, password.value)
  if (res.role !== 'DRIVER') return useToastStore().show('Driver account required', 'error')
  auth.setSession(res)
  await navigateTo(routes.driverHome)
}
</script>

<template>
  <section class="card card--elevated auth-box">
    <h1 class="font-serif">Driver login</h1>
    <input v-model="email" class="input" type="email" />
    <input v-model="password" class="input" type="password" />
    <button class="btn btn--solid-gold" @click="submit">Sign in</button>
  </section>
</template>

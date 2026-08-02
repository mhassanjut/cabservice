<script setup lang="ts">

definePageMeta({

  layout: 'customer',

  middleware: ['customer', 'no-guest-dashboard'],

  ssr: false,

})



import { userService } from '~/services/api/user.service'
import { isValidPhone, normalizePhone } from '~/utils/phone'
import googleGUrl from '~/assets/icons/google-g.svg?url'



usePageSeo({ title: 'Account', path: '/dashboard/account' })



const auth = useAuthStore()

const toast = useToastStore()

const router = useRouter()

const profile = ref<Awaited<ReturnType<typeof userService.profile>> | null>(null)

const fullName = ref('')

const phone = ref('')

const phoneValid = ref(false)

const phoneError = ref('')

const loading = ref(true)

const saving = ref(false)



onMounted(async () => {

  auth.hydrate()

  if (!auth.isLoggedIn) {

    loading.value = false

    return

  }

  try {

    profile.value = await userService.profile()
    if (!profile.value) return

    fullName.value = profile.value.fullName

    phone.value = profile.value.phone ?? ''

    if (profile.value.profilePictureUrl) {

      auth.applyAuthPayload({ profilePictureUrl: profile.value.profilePictureUrl })

    }

  } catch {

    /* api client handles user-facing errors */

  } finally {

    loading.value = false

  }

})



watch(phone, () => {

  if (phoneError.value) phoneError.value = ''

})



const canSave = computed(() => {

  const trimmedPhone = phone.value.trim()

  if (!fullName.value.trim()) return false

  if (!trimmedPhone) return true

  return phoneValid.value && isValidPhone(normalizePhone(trimmedPhone))

})



const save = async () => {

  phoneError.value = ''

  const trimmedPhone = phone.value.trim()

  if (trimmedPhone) {

    const normalizedPhone = normalizePhone(trimmedPhone)

    if (!phoneValid.value || !isValidPhone(normalizedPhone)) {

      phoneError.value = 'Enter a valid mobile number for the selected country.'

      return

    }

    phone.value = normalizedPhone

  }

  saving.value = true

  try {

    profile.value = await userService.updateProfile(

      fullName.value.trim(),

      trimmedPhone ? normalizePhone(trimmedPhone) : undefined,

    )

    phone.value = profile.value.phone ?? ''

    auth.applyAuthPayload({ fullName: profile.value.fullName })

    toast.show('Profile updated.', 'success')

  } catch {

    toast.show('Could not update profile.', 'error')

  } finally {

    saving.value = false

  }

}



const logout = async () => {

  await auth.logout()

  await router.push('/')

}

</script>



<template>

  <section class="dashboard-account" :aria-busy="loading">

    <DashboardAccountSkeleton v-if="loading" />

    <template v-else>

      <article class="dashboard-account-card">

        <header class="dashboard-account-card__header">

          <p class="dashboard-eyebrow">Your profile</p>

          <h1 class="dashboard-account-card__title">Account Settings</h1>

        </header>



        <div class="dashboard-account-card__profile">

          <UserAvatar size="lg" variant="dashboard" :name="auth.fullName" />

          <div class="dashboard-account-card__identity">

            <p class="dashboard-account-card__email">{{ auth.email }}</p>

            <p v-if="profile?.googleId" class="dashboard-account-card__google">

              <img :src="googleGUrl" alt="" width="14" height="14" />

              Connected with Google

            </p>

          </div>

        </div>



        <form class="dashboard-account-card__form" @submit.prevent="save">

          <div class="dashboard-account-card__field">

            <label class="dashboard-account-card__label" for="full-name">Full name</label>

            <input id="full-name" v-model="fullName" class="dashboard-account-card__input" required />

          </div>

          <div class="dashboard-account-card__field">

            <label class="dashboard-account-card__label" for="phone">Phone</label>

            <PhoneInput

              id="phone"

              v-model="phone"

              :disabled="saving"

              :invalid="Boolean(phoneError)"

              @validate="phoneValid = $event"

            />

            <p v-if="phoneError" class="err" role="alert">{{ phoneError }}</p>

          </div>

          <button

            class="dashboard-btn dashboard-btn--primary dashboard-account-card__submit"

            type="submit"

            :disabled="saving || !canSave"

          >

            Save changes

          </button>

        </form>

      </article>



      <article class="dashboard-account-card dashboard-account-card--session">

        <h2 class="dashboard-account-card__session-title">Session</h2>

        <p class="dashboard-account-card__session-desc">Manage your current session on this device</p>

        <button class="dashboard-btn dashboard-btn--secondary" type="button" @click="logout">Logout</button>

      </article>

    </template>

  </section>

</template>



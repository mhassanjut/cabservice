<script setup lang="ts">
import type { AdminDriverDto } from '~/types/api'
import { adminService } from '~/services/api/admin.service'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const toast = useToastStore()
const drivers = ref<AdminDriverDto[]>([])
const loading = ref(true)
const error = ref(false)
const showForm = ref(false)
const saving = ref(false)
const formError = ref('')
const editing = ref<AdminDriverDto | null>(null)
const form = reactive({
  email: '',
  password: '',
  fullName: '',
  phone: '',
  licenseNumber: '',
  active: true,
})

const load = async () => {
  loading.value = true
  error.value = false
  try {
    drivers.value = await adminService.drivers()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

const resetForm = () => {
  editing.value = null
  form.email = ''
  form.password = ''
  form.fullName = ''
  form.phone = ''
  form.licenseNumber = ''
  form.active = true
}

const openCreate = () => {
  resetForm()
  formError.value = ''
  showForm.value = true
}

const openEdit = (driver: AdminDriverDto) => {
  editing.value = driver
  form.fullName = driver.fullName
  form.phone = driver.phone || ''
  form.licenseNumber = driver.licenseNumber
  form.active = driver.active
  formError.value = ''
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  formError.value = ''
  resetForm()
}

watch(showForm, (open: boolean) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

const submit = async () => {
  saving.value = true
  formError.value = ''
  try {
    if (editing.value) {
      await adminService.updateDriver(editing.value.id, {
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        licenseNumber: form.licenseNumber.trim(),
        active: form.active,
      })
      toast.show('Driver updated.', 'success')
    } else {
      await adminService.createDriver({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        licenseNumber: form.licenseNumber.trim(),
      })
      toast.show('Driver created.', 'success')
    }
    closeForm()
    await load()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    formError.value = err.data?.message ?? err.message ?? 'Could not save driver. Please try again.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AdminShell>
    <AdminSectionHead title="Drivers" description="Add and manage chauffeurs assigned to rides." />
    <div class="admin-toolbar">
      <button type="button" class="btn btn--solid-gold" @click="openCreate">Add driver</button>
    </div>

    <AdminSkeleton v-if="loading" :rows="5" />
    <AdminEmptyState
      v-else-if="!drivers.length"
      title="No drivers yet"
      message="Create your first chauffeur account to start assigning rides."
      icon="fa-id-card"
    >
      <template #action>
        <button type="button" class="btn btn--solid-gold" @click="openCreate">Add driver</button>
      </template>
    </AdminEmptyState>
    <section v-else class="admin-card card card--elevated">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Active rides</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="driver in drivers" :key="driver.id">
              <td>{{ driver.fullName }}</td>
              <td>{{ driver.phone || '—' }}</td>
              <td>{{ driver.email }}</td>
              <td>
                <AdminBadge :tone="driver.active ? 'success' : 'muted'">
                  {{ driver.onRide ? 'On ride' : driver.active ? 'Active' : 'Inactive' }}
                </AdminBadge>
              </td>
              <td>{{ driver.activeRidesCount ?? 0 }}</td>
              <td><button type="button" class="btn secondary" @click="openEdit(driver)">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="showForm" class="admin-panel is-open">
      <div class="admin-panel__backdrop" @click="closeForm" />
      <aside
        class="admin-panel__sheet"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="editing ? 'edit-driver-title' : 'add-driver-title'"
      >
        <header class="admin-panel__head">
          <div>
            <p class="eyebrow admin-panel__eyebrow">Chauffeurs</p>
            <h2 :id="editing ? 'edit-driver-title' : 'add-driver-title'" class="admin-panel__title font-serif">
              {{ editing ? 'Edit driver' : 'Add driver' }}
            </h2>
          </div>
          <button type="button" class="admin-panel__close" aria-label="Close" @click="closeForm">
            <i class="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>

        <div class="admin-panel__body">
          <form class="admin-form-grid" @submit.prevent="submit">
            <p v-if="!editing" class="admin-panel__note">
              Create a chauffeur login. They will use these credentials in the driver app.
            </p>

            <div v-if="!editing" class="field">
              <label class="label" for="driver-email">Email</label>
              <input id="driver-email" v-model="form.email" class="input" type="email" autocomplete="off" required />
            </div>
            <div v-if="!editing" class="field">
              <label class="label" for="driver-password">Password</label>
              <input
                id="driver-password"
                v-model="form.password"
                class="input"
                type="password"
                autocomplete="new-password"
                minlength="8"
                required
              />
              <p class="help">Minimum 8 characters.</p>
            </div>
            <div class="field">
              <label class="label" for="driver-name">Full name</label>
              <input id="driver-name" v-model="form.fullName" class="input" autocomplete="name" required />
            </div>
            <div class="field">
              <label class="label" for="driver-phone">Phone</label>
              <input id="driver-phone" v-model="form.phone" class="input" type="tel" autocomplete="tel" inputmode="tel" />
            </div>
            <div class="field">
              <label class="label" for="driver-license">License number</label>
              <input id="driver-license" v-model="form.licenseNumber" class="input" required />
            </div>
            <label v-if="editing" class="admin-panel__checkbox">
              <input v-model="form.active" type="checkbox" />
              <span>Active chauffeur</span>
            </label>

            <p v-if="formError" class="err" role="alert">{{ formError }}</p>

            <div class="admin-form-actions">
              <button type="submit" class="btn btn--solid-gold" :disabled="saving">
                {{ saving ? 'Saving…' : 'Save driver' }}
              </button>
              <button type="button" class="btn secondary" :disabled="saving" @click="closeForm">Cancel</button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  </AdminShell>
</template>

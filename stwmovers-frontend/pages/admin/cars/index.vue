<script setup lang="ts">
import type { AdminCarDto } from '~/types/api'
import { adminService } from '~/services/api/admin.service'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const toast = useToastStore()
const cars = ref<AdminCarDto[]>([])
const loading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const uploadingImage = ref(false)
const formError = ref('')
const editing = ref<AdminCarDto | null>(null)

const defaultForm = () => ({
  name: '',
  carType: 'SEDAN' as const,
  bodyType: 'SEDAN' as const,
  category: 'STANDARD' as const,
  passengerCapacity: 4,
  baseFare: 50,
  electric: false,
  available: true,
  active: true,
  supportsInCity: true,
  supportsCityToCity: true,
  imageUrl: '',
  description: '',
  displayPriority: 0,
})

const form = reactive(defaultForm())

const load = async () => {
  loading.value = true
  try {
    cars.value = await adminService.cars()
  } catch {
    toast.show('Could not load vehicles.', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const resetForm = () => {
  editing.value = null
  Object.assign(form, defaultForm())
}

const openEdit = (car: AdminCarDto) => {
  editing.value = car
  Object.assign(form, {
    name: car.name,
    carType: car.carType,
    bodyType: car.bodyType,
    category: car.category,
    passengerCapacity: car.passengerCapacity,
    baseFare: car.baseFare,
    electric: car.electric,
    available: car.available,
    active: car.active,
    supportsInCity: car.supportsInCity,
    supportsCityToCity: car.supportsCityToCity,
    imageUrl: car.imageUrl ?? '',
    description: car.description ?? '',
    displayPriority: car.displayPriority,
  })
  formError.value = ''
  showForm.value = true
}

const openCreate = () => {
  resetForm()
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

const imageInputRef = ref<HTMLInputElement | null>(null)

const triggerImageUpload = () => {
  imageInputRef.value?.click()
}

const buildPayload = () => ({
  name: form.name.trim(),
  carType: form.carType,
  bodyType: form.bodyType,
  category: form.category,
  passengerCapacity: form.passengerCapacity,
  baseFare: form.baseFare,
  electric: form.electric,
  available: form.available,
  active: form.active,
  supportsInCity: form.supportsInCity,
  supportsCityToCity: form.supportsCityToCity,
  imageUrl: form.imageUrl.trim(),
  description: form.description.trim() || undefined,
  displayPriority: form.displayPriority,
})

const syncCarInList = (updated: AdminCarDto) => {
  const index = cars.value.findIndex((car: AdminCarDto) => car.id === updated.id)
  if (index >= 0) cars.value[index] = updated
}

const onImageSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  uploadingImage.value = true
  try {
    if (editing.value) {
      const updated = await adminService.uploadCarImage(editing.value.id, file)
      form.imageUrl = updated.imageUrl ?? ''
      editing.value = updated
      syncCarInList(updated)
      toast.show('Image uploaded.', 'success')
      return
    }
    form.imageUrl = await adminService.uploadCarImageDraft(file)
    toast.show('Image uploaded. Save the vehicle to keep it.', 'success')
  } catch {
    /* toast handled in service */
  } finally {
    uploadingImage.value = false
  }
}

const submit = async () => {
  saving.value = true
  formError.value = ''
  try {
    const payload = buildPayload()
    if (editing.value) {
      const updated = await adminService.updateCar(editing.value.id, payload)
      syncCarInList(updated)
      toast.show('Vehicle updated.', 'success')
    } else {
      await adminService.createCar(payload)
      toast.show('Vehicle added.', 'success')
    }
    closeForm()
    await load()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    formError.value = err.data?.message ?? err.message ?? 'Could not save vehicle. Please try again.'
  } finally {
    saving.value = false
  }
}

const toggleField = async (car: AdminCarDto, field: 'available' | 'active') => {
  try {
    await adminService.updateCar(car.id, { ...car, [field]: !car[field] })
    await load()
  } catch {
    toast.show('Could not update vehicle.', 'error')
  }
}
</script>

<template>
  <AdminShell>
    <AdminSectionHead title="Cars" description="Manage the vehicle catalog and availability." />
    <div class="admin-toolbar">
      <button type="button" class="btn btn--solid-gold" @click="openCreate">Add car</button>
    </div>

    <AdminSkeleton v-if="loading" :rows="5" />
    <section v-else class="admin-card card card--elevated">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Base fare</th>
              <th>Available</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in cars" :key="car.id">
              <td>{{ car.name }}</td>
              <td>{{ car.carType }}</td>
              <td>{{ car.passengerCapacity }}</td>
              <td>€{{ car.baseFare }}</td>
              <td>
                <button type="button" class="btn secondary" @click="toggleField(car, 'available')">
                  {{ car.available ? 'Yes' : 'No' }}
                </button>
              </td>
              <td>
                <button type="button" class="btn secondary" @click="toggleField(car, 'active')">
                  {{ car.active ? 'Yes' : 'No' }}
                </button>
              </td>
              <td><button type="button" class="btn secondary" @click="openEdit(car)">Edit</button></td>
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
        :aria-labelledby="editing ? 'edit-car-title' : 'add-car-title'"
      >
        <header class="admin-panel__head">
          <div>
            <p class="eyebrow admin-panel__eyebrow">Fleet</p>
            <h2 :id="editing ? 'edit-car-title' : 'add-car-title'" class="admin-panel__title font-serif">
              {{ editing ? 'Edit vehicle' : 'Add vehicle' }}
            </h2>
          </div>
          <button type="button" class="admin-panel__close" aria-label="Close" @click="closeForm">
            <i class="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>

        <div class="admin-panel__body">
          <form class="admin-form-grid" @submit.prevent="submit">
            <div class="field">
              <label class="label" for="car-name">Name</label>
              <input id="car-name" v-model="form.name" class="input" required />
            </div>
            <div class="field">
              <label class="label" for="car-type">Car type</label>
              <select id="car-type" v-model="form.carType" class="input input--select">
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="VAN">Van</option>
              </select>
            </div>
            <div class="field">
              <label class="label" for="car-category">Category</label>
              <select id="car-category" v-model="form.category" class="input input--select">
                <option value="STANDARD">Standard</option>
                <option value="LUXURY">Luxury</option>
              </select>
            </div>
            <div class="field">
              <label class="label" for="car-fare">Base fare (EUR)</label>
              <input id="car-fare" v-model.number="form.baseFare" class="input" type="number" min="0" step="0.01" required />
            </div>
            <div class="field">
              <label class="label" for="car-capacity">Passenger capacity</label>
              <input id="car-capacity" v-model.number="form.passengerCapacity" class="input" type="number" min="1" required />
            </div>
            <div class="field">
              <label class="label" for="car-priority">Display priority</label>
              <input id="car-priority" v-model.number="form.displayPriority" class="input" type="number" min="0" />
            </div>
            <div class="field admin-car-image-field">
              <span class="label">Vehicle image</span>
              <div class="admin-car-image">
                <div class="admin-car-image__preview">
                  <FleetVehicleImage
                    v-if="form.imageUrl"
                    :src="form.imageUrl"
                    :alt="form.name || 'Vehicle preview'"
                  />
                  <span v-else class="help">No image uploaded</span>
                </div>
                <div class="admin-car-image__actions">
                  <input
                    ref="imageInputRef"
                    type="file"
                    class="admin-car-image__input"
                    accept="image/*,.svg,image/svg+xml"
                    @change="onImageSelected"
                  />
                  <button
                    type="button"
                    class="btn secondary"
                    :disabled="uploadingImage || saving"
                    @click="triggerImageUpload"
                  >
                    {{ uploadingImage ? 'Uploading…' : 'Upload' }}
                  </button>
                  <button
                    v-if="form.imageUrl"
                    type="button"
                    class="btn secondary"
                    :disabled="uploadingImage || saving"
                    @click="form.imageUrl = ''"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="label" for="car-description">Description</label>
              <textarea id="car-description" v-model="form.description" class="input" rows="3" />
            </div>

            <div class="admin-panel__checkbox-grid">
              <label class="admin-panel__checkbox">
                <input v-model="form.available" type="checkbox" />
                <span>Available to book</span>
              </label>
              <label class="admin-panel__checkbox">
                <input v-model="form.active" type="checkbox" />
                <span>Active in catalog</span>
              </label>
              <label class="admin-panel__checkbox">
                <input v-model="form.electric" type="checkbox" />
                <span>Electric</span>
              </label>
              <label class="admin-panel__checkbox">
                <input v-model="form.supportsInCity" type="checkbox" />
                <span>In-city routes</span>
              </label>
              <label class="admin-panel__checkbox">
                <input v-model="form.supportsCityToCity" type="checkbox" />
                <span>City-to-city routes</span>
              </label>
            </div>

            <p v-if="formError" class="err" role="alert">{{ formError }}</p>

            <div class="admin-form-actions">
              <button type="submit" class="btn btn--solid-gold" :disabled="saving">
                {{ saving ? 'Saving…' : 'Save vehicle' }}
              </button>
              <button type="button" class="btn secondary" :disabled="saving" @click="closeForm">Cancel</button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  </AdminShell>
</template>

<style scoped>
.admin-car-image {
  display: grid;
  gap: 12px;
}

.admin-car-image__preview {
  min-height: 140px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.02);
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 12px;
}

.admin-car-image__preview :deep(img) {
  width: 100%;
  max-height: 180px;
  object-fit: contain;
}

.admin-car-image__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.admin-car-image__input {
  display: none;
}
</style>

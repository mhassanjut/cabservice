<script setup lang="ts">
import type { AdminCarDto, AdminTourDto } from '~/types/api'
import { adminService } from '~/services/api/admin.service'
import { resolveVehicleImageUrl } from '~/utils/vehicleImage'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const toast = useToastStore()
const tours = ref<AdminTourDto[]>([])
const cars = ref<AdminCarDto[]>([])
const loading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const uploadingImage = ref(false)
const formError = ref('')
const editing = ref<AdminTourDto | null>(null)

type ItineraryStep = { time: string; activity: string }
type ItineraryDay = { dayNumber: number; steps: ItineraryStep[] }

type TourForm = {
  title: string
  location: string
  durationLabel: string
  durationHours: number | null
  guestMin: number | null
  guestMax: number | null
  category: string
  displayPriority: number
  imageUrl: string
  shortDescription: string
  aboutDescription: string
  active: boolean
  highlights: string[]
  included: string[]
  excluded: string[]
}

const defaultForm = (): TourForm => ({
  title: '',
  location: '',
  durationLabel: '',
  durationHours: null,
  guestMin: null,
  guestMax: null,
  category: '',
  displayPriority: 0,
  imageUrl: '',
  shortDescription: '',
  aboutDescription: '',
  active: true,
  highlights: [] as string[],
  included: [] as string[],
  excluded: [] as string[],
})

const form = reactive(defaultForm()) as TourForm
const itineraryDays = ref<ItineraryDay[]>([{ dayNumber: 1, steps: [] }])
const activeDayIndex = ref(0)
const carPrices = ref<Record<string, string>>({})
const pricingActive = ref(true)

const roundPrice = (value: number) => Math.round(value * 100) / 100
const formatPrice = (value: number | string) => roundPrice(Number(value)).toFixed(2)
const parsePrice = (value: string) => roundPrice(Number.parseFloat(value) || 0)

const activeDay = computed(() => itineraryDays.value[activeDayIndex.value] ?? null)

const resetItineraryDays = () => {
  itineraryDays.value = [{ dayNumber: 1, steps: [] }]
  activeDayIndex.value = 0
}

const groupItineraryByDay = (items: AdminTourDto['itinerary']) => {
  const grouped = new Map<number, ItineraryStep[]>()
  for (const item of items ?? []) {
    const dayNumber = item.dayNumber || 1
    const steps = grouped.get(dayNumber) ?? []
    steps.push({ time: item.time ?? '', activity: item.activity })
    grouped.set(dayNumber, steps)
  }
  if (!grouped.size) {
    return [{ dayNumber: 1, steps: [] }]
  }
  return [...grouped.entries()]
    .sort(([a], [b]) => a - b)
    .map(([dayNumber, steps]) => ({ dayNumber, steps }))
}

const flattenItinerary = () =>
  itineraryDays.value.flatMap((day: ItineraryDay) =>
    day.steps
      .filter((step: ItineraryStep) => step.activity.trim())
      .map((step: ItineraryStep) => ({
        dayNumber: day.dayNumber,
        time: step.time.trim() || undefined,
        activity: step.activity.trim(),
      })),
  )

const activeCars = computed(() => cars.value.filter((car: AdminCarDto) => car.active))

const loadTourCarPrices = async (tourId: string) => {
  try {
    const existing = await adminService.tourPricing(tourId)
    const next: Record<string, string> = {}
    for (const car of activeCars.value) {
      const match = existing.find((row) => row.carId === car.id)
      next[car.id] = match ? formatPrice(match.price) : ''
    }
    if (existing.length) {
      pricingActive.value = existing[0]?.active ?? true
    }
    carPrices.value = next
  } catch {
    toast.show('Could not load tour vehicle prices.', 'error')
  }
}

const resetCarPrices = () => {
  carPrices.value = Object.fromEntries(activeCars.value.map((car: AdminCarDto) => [car.id, '']))
  pricingActive.value = true
}

const load = async () => {
  loading.value = true
  try {
    const [tourList, carList] = await Promise.all([adminService.tours(), adminService.cars()])
    tours.value = tourList
    cars.value = carList
  } catch {
    toast.show('Could not load tours.', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const resetForm = () => {
  editing.value = null
  Object.assign(form, defaultForm())
  resetItineraryDays()
  resetCarPrices()
}

const openEdit = async (tour: AdminTourDto) => {
  editing.value = tour
  Object.assign(form, {
    title: tour.title,
    location: tour.location ?? '',
    durationLabel: tour.durationLabel ?? '',
    durationHours: tour.durationHours ?? null,
    guestMin: tour.guestMin ?? null,
    guestMax: tour.guestMax ?? null,
    category: tour.category ?? '',
    displayPriority: tour.displayPriority,
    imageUrl: tour.imageUrl ?? '',
    shortDescription: tour.shortDescription ?? '',
    aboutDescription: tour.aboutDescription ?? '',
    active: tour.active,
    highlights: [...(tour.highlights ?? [])],
    included: [...(tour.included ?? [])],
    excluded: [...(tour.excluded ?? [])],
  })
  itineraryDays.value = groupItineraryByDay(tour.itinerary)
  activeDayIndex.value = 0
  formError.value = ''
  showForm.value = true
  await loadTourCarPrices(tour.id)
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

const addHighlight = () => form.highlights.push('')
const removeHighlight = (index: number) => form.highlights.splice(index, 1)

const addIncluded = () => form.included.push('')
const removeIncluded = (index: number) => form.included.splice(index, 1)

const addExcluded = () => form.excluded.push('')
const removeExcluded = (index: number) => form.excluded.splice(index, 1)

const addItineraryDay = () => {
  const nextDay = itineraryDays.value.length
    ? Math.max(...itineraryDays.value.map((day: ItineraryDay) => day.dayNumber)) + 1
    : 1
  itineraryDays.value.push({ dayNumber: nextDay, steps: [] })
  activeDayIndex.value = itineraryDays.value.length - 1
}

const removeItineraryDay = (index: number) => {
  if (itineraryDays.value.length <= 1) return
  itineraryDays.value.splice(index, 1)
  itineraryDays.value = itineraryDays.value.map((day: ItineraryDay, dayIndex: number) => ({
    ...day,
    dayNumber: dayIndex + 1,
  }))
  activeDayIndex.value = Math.min(activeDayIndex.value, itineraryDays.value.length - 1)
}

const addItineraryStep = () => {
  const day = activeDay.value
  if (!day) return
  day.steps.push({ time: '', activity: '' })
}

const removeItineraryStep = (stepIndex: number) => {
  const day = activeDay.value
  if (!day) return
  day.steps.splice(stepIndex, 1)
}

const buildPayload = () => ({
  title: form.title.trim(),
  location: form.location.trim() || undefined,
  durationLabel: form.durationLabel.trim() || undefined,
  durationHours: form.durationHours ?? undefined,
  guestMin: form.guestMin ?? undefined,
  guestMax: form.guestMax ?? undefined,
  category: form.category.trim() || undefined,
  displayPriority: form.displayPriority,
  imageUrl: form.imageUrl.trim() || undefined,
  shortDescription: form.shortDescription.trim() || undefined,
  aboutDescription: form.aboutDescription.trim() || undefined,
  active: form.active,
  highlights: form.highlights.map((v: string) => v.trim()).filter(Boolean),
  included: form.included.map((v: string) => v.trim()).filter(Boolean),
  excluded: form.excluded.map((v: string) => v.trim()).filter(Boolean),
  itinerary: flattenItinerary(),
})

const syncTourInList = (updated: AdminTourDto) => {
  const index = tours.value.findIndex((tour: AdminTourDto) => tour.id === updated.id)
  if (index >= 0) tours.value[index] = updated
}

const onImageSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  uploadingImage.value = true
  try {
    if (editing.value) {
      const updated = await adminService.uploadTourImage(editing.value.id, file)
      form.imageUrl = updated.imageUrl ?? ''
      editing.value = updated
      syncTourInList(updated)
      toast.show('Image uploaded.', 'success')
      return
    }
    form.imageUrl = await adminService.uploadTourImageDraft(file)
    toast.show('Image uploaded. Save the tour to keep it.', 'success')
  } catch {
    /* toast handled in service */
  } finally {
    uploadingImage.value = false
  }
}

const saveTourPricing = async (tourId: string) => {
  const missing = activeCars.value.filter((car: AdminCarDto) => parsePrice(carPrices.value[car.id] ?? '') <= 0)
  if (missing.length) {
    formError.value = `Enter a price for every vehicle (${missing.map((c: AdminCarDto) => c.name).join(', ')}).`
    return false
  }

  await adminService.saveTourPricingBatch(tourId, {
    active: pricingActive.value,
    carPrices: activeCars.value.map((car: AdminCarDto) => ({
      carId: car.id,
      price: parsePrice(carPrices.value[car.id] ?? ''),
    })),
  })
  return true
}

const submit = async () => {
  saving.value = true
  formError.value = ''
  try {
    const payload = buildPayload()
    let tourId = editing.value?.id

    if (editing.value) {
      const updated = await adminService.updateTour(editing.value.id, payload)
      tourId = updated.id
    } else {
      const created = await adminService.createTour(payload)
      tourId = created.id
    }

    if (!tourId) {
      formError.value = 'Could not save tour. Please try again.'
      return
    }

    const pricingSaved = await saveTourPricing(tourId)
    if (!pricingSaved) return

    toast.show(editing.value ? 'Tour updated.' : 'Tour added.', 'success')
    closeForm()
    await load()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    formError.value = err.data?.message ?? err.message ?? 'Could not save tour. Please try again.'
  } finally {
    saving.value = false
  }
}

const toggleActive = async (tour: AdminTourDto) => {
  try {
    await adminService.updateTour(tour.id, { ...tour, active: !tour.active })
    await load()
  } catch {
    toast.show('Could not update tour.', 'error')
  }
}

const removeTour = async (tour: AdminTourDto) => {
  if (!confirm(`Remove "${tour.title}" permanently? This cannot be undone.`)) return
  try {
    await adminService.deleteTour(tour.id)
    tours.value = tours.value.filter((row: AdminTourDto) => row.id !== tour.id)
    if (editing.value?.id === tour.id) closeForm()
    toast.show('Tour removed.', 'success')
  } catch {
    toast.show('Could not remove tour.', 'error')
  }
}
</script>

<template>
  <AdminShell>
    <AdminSectionHead title="Tours" description="Manage private tour experiences shown to travellers." />
    <div class="admin-toolbar">
      <button type="button" class="btn btn--solid-gold" @click="openCreate">Add tour</button>
    </div>

    <AdminSkeleton v-if="loading" :rows="5" />
    <section v-else class="admin-card card card--elevated">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Starting from</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="tour in tours" :key="tour.id">
              <td>{{ tour.title }}</td>
              <td>{{ tour.category || '—' }}</td>
              <td>{{ tour.location || '—' }}</td>
              <td>{{ tour.startingPrice != null ? `€${tour.startingPrice}` : '—' }}</td>
              <td>
                <button type="button" class="btn secondary" @click="toggleActive(tour)">
                  {{ tour.active ? 'Yes' : 'No' }}
                </button>
              </td>
              <td class="admin-tour-actions">
                <button type="button" class="btn secondary" @click="openEdit(tour)">Edit</button>
                <button type="button" class="btn secondary" @click="removeTour(tour)">Remove</button>
              </td>
            </tr>
            <tr v-if="!tours.length">
              <td colspan="6" class="help">No tours yet. Click "Add tour" to create your first experience.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="showForm" class="admin-panel is-open">
      <div class="admin-panel__backdrop" @click="closeForm" />
      <aside
        class="admin-panel__sheet admin-panel__sheet--wide"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="editing ? 'edit-tour-title' : 'add-tour-title'"
      >
        <header class="admin-panel__head">
          <div>
            <p class="eyebrow admin-panel__eyebrow">Tours</p>
            <h2 :id="editing ? 'edit-tour-title' : 'add-tour-title'" class="admin-panel__title font-serif">
              {{ editing ? 'Edit tour' : 'Add tour' }}
            </h2>
          </div>
          <button type="button" class="admin-panel__close" aria-label="Close" @click="closeForm">
            <i class="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>

        <div class="admin-panel__body">
          <form class="admin-form-grid" @submit.prevent="submit">
            <div class="field">
              <label class="label" for="tour-title">Title</label>
              <input id="tour-title" v-model="form.title" class="input" required />
            </div>
            <div class="field">
              <label class="label" for="tour-category">Category tag</label>
              <input
                id="tour-category"
                v-model="form.category"
                class="input"
                placeholder="e.g. Private Experience"
              />
            </div>
            <div class="field">
              <label class="label" for="tour-location">Location</label>
              <input id="tour-location" v-model="form.location" class="input" placeholder="e.g. Barcelona" />
            </div>
            <div class="field">
              <label class="label" for="tour-duration">Duration type</label>
              <input
                id="tour-duration"
                v-model="form.durationLabel"
                class="input"
                placeholder="e.g. Full Day"
              />
              <p class="help">Shown next to the location (e.g. Barcelona · Full Day).</p>
            </div>
            <div class="field">
              <label class="label" for="tour-hours">Duration (hours)</label>
              <input
                id="tour-hours"
                v-model.number="form.durationHours"
                class="input"
                type="number"
                min="1"
                step="1"
                placeholder="8"
              />
              <p class="help">Frontend displays this as “8 Hours”.</p>
            </div>
            <div class="admin-tour-guests">
              <div class="field">
                <label class="label" for="tour-guest-min">Minimum guests</label>
                <input
                  id="tour-guest-min"
                  v-model.number="form.guestMin"
                  class="input"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                />
              </div>
              <div class="field">
                <label class="label" for="tour-guest-max">Maximum guests</label>
                <input
                  id="tour-guest-max"
                  v-model.number="form.guestMax"
                  class="input"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="6"
                />
              </div>
            </div>
            <p class="help admin-tour-guests__hint">Frontend displays the range as “1–6 Guests”.</p>
            <div class="field">
              <label class="label" for="tour-priority">Display priority</label>
              <input id="tour-priority" v-model.number="form.displayPriority" class="input" type="number" min="0" />
            </div>

            <div v-if="activeCars.length" class="admin-list-section">
              <div class="admin-list-section__head">
                <span class="label">Vehicle prices</span>
                <label class="admin-panel__checkbox">
                  <input v-model="pricingActive" type="checkbox">
                  <span>Pricing active</span>
                </label>
              </div>
              <p class="help">Set a fixed price for every active vehicle. The lowest price is shown as "Starting from" on the tours page.</p>
              <div class="admin-car-price-grid">
                <div v-for="car in activeCars" :key="car.id" class="admin-car-price-row">
                  <div class="admin-car-price-row__meta">
                    <strong>{{ car.name }}</strong>
                    <span class="help">{{ car.carType }} · {{ car.passengerCapacity }} seats</span>
                  </div>
                  <label class="admin-car-price-row__price">
                    <span class="admin-car-price-row__currency">€</span>
                    <input
                      v-model="carPrices[car.id]"
                      class="input"
                      type="number"
                      min="0.01"
                      step="0.01"
                      :placeholder="formatPrice(0)"
                      required
                    >
                  </label>
                </div>
              </div>
            </div>
            <p v-else class="help">Add active vehicles in the Cars section before setting tour prices.</p>

            <div class="field admin-car-image-field">
              <span class="label">Tour image</span>
              <div class="admin-car-image">
                <div class="admin-car-image__preview">
                  <img
                    v-if="form.imageUrl"
                    :src="resolveVehicleImageUrl(form.imageUrl)"
                    :alt="form.title || 'Tour preview'"
                  >
                  <span v-else class="help">No image uploaded</span>
                </div>
                <div class="admin-car-image__actions">
                  <input
                    ref="imageInputRef"
                    type="file"
                    class="admin-car-image__input"
                    accept="image/*"
                    @change="onImageSelected"
                  >
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
              <label class="label" for="tour-short-desc">Card description</label>
              <textarea
                id="tour-short-desc"
                v-model="form.shortDescription"
                class="input"
                rows="2"
                placeholder="Short summary shown on the tour card"
              />
            </div>
            <div class="field">
              <label class="label" for="tour-about-desc">About this experience</label>
              <textarea
                id="tour-about-desc"
                v-model="form.aboutDescription"
                class="input"
                rows="4"
                placeholder="Full description shown in the tour details modal"
              />
            </div>

            <div class="admin-list-section">
              <div class="admin-list-section__head">
                <span class="label">Tour highlights</span>
                <button type="button" class="btn secondary btn--sm" @click="addHighlight">
                  <i class="fa-solid fa-plus" aria-hidden="true" /> Add highlight
                </button>
              </div>
              <div v-for="(_, index) in form.highlights" :key="`highlight-${index}`" class="admin-list-row">
                <input v-model="form.highlights[index]" class="input" placeholder="e.g. Professional Chauffeur" >
                <button type="button" class="admin-list-row__remove" aria-label="Remove highlight" @click="removeHighlight(index)">
                  <i class="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              </div>
              <p v-if="!form.highlights.length" class="help">No highlights added yet.</p>
            </div>

            <div class="admin-list-section">
              <div class="admin-list-section__head">
                <span class="label">Included</span>
                <button type="button" class="btn secondary btn--sm" @click="addIncluded">
                  <i class="fa-solid fa-plus" aria-hidden="true" /> Add included item
                </button>
              </div>
              <div v-for="(_, index) in form.included" :key="`included-${index}`" class="admin-list-row">
                <input v-model="form.included[index]" class="input" placeholder="e.g. Private Chauffeur" >
                <button type="button" class="admin-list-row__remove" aria-label="Remove included item" @click="removeIncluded(index)">
                  <i class="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              </div>
              <p v-if="!form.included.length" class="help">No included items added yet.</p>
            </div>

            <div class="admin-list-section">
              <div class="admin-list-section__head">
                <span class="label">Not included</span>
                <button type="button" class="btn secondary btn--sm" @click="addExcluded">
                  <i class="fa-solid fa-plus" aria-hidden="true" /> Add excluded item
                </button>
              </div>
              <div v-for="(_, index) in form.excluded" :key="`excluded-${index}`" class="admin-list-row">
                <input v-model="form.excluded[index]" class="input" placeholder="e.g. Lunch" >
                <button type="button" class="admin-list-row__remove" aria-label="Remove excluded item" @click="removeExcluded(index)">
                  <i class="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              </div>
              <p v-if="!form.excluded.length" class="help">No excluded items added yet.</p>
            </div>

            <div class="admin-list-section">
              <div class="admin-list-section__head">
                <span class="label">Tour plan preview</span>
                <div class="admin-tour-plan__actions">
                  <button type="button" class="btn secondary btn--sm" @click="addItineraryDay">
                    <i class="fa-solid fa-plus" aria-hidden="true" /> Add day
                  </button>
                  <button
                    type="button"
                    class="btn secondary btn--sm"
                    :disabled="!activeDay"
                    @click="addItineraryStep"
                  >
                    <i class="fa-solid fa-plus" aria-hidden="true" /> Add step
                  </button>
                </div>
              </div>
              <p class="help">Define each day separately. Each step needs a time and activity for the timeline.</p>

              <div class="admin-tour-plan__tabs" role="tablist" aria-label="Tour days">
                <button
                  v-for="(day, index) in itineraryDays"
                  :key="`day-tab-${day.dayNumber}`"
                  type="button"
                  class="admin-tour-plan__tab"
                  :class="{ 'is-active': activeDayIndex === index }"
                  role="tab"
                  :aria-selected="activeDayIndex === index"
                  @click="activeDayIndex = index"
                >
                  Day {{ String(day.dayNumber).padStart(2, '0') }}
                </button>
              </div>

              <div v-if="activeDay" class="admin-tour-plan__panel">
                <div class="admin-tour-plan__panel-head">
                  <strong>Day {{ String(activeDay.dayNumber).padStart(2, '0') }} schedule</strong>
                  <button
                    v-if="itineraryDays.length > 1"
                    type="button"
                    class="btn secondary btn--sm"
                    @click="removeItineraryDay(activeDayIndex)"
                  >
                    Remove day
                  </button>
                </div>

                <div
                  v-for="(step, stepIndex) in activeDay.steps"
                  :key="`day-${activeDay.dayNumber}-step-${stepIndex}`"
                  class="admin-itinerary-row"
                >
                  <input
                    v-model="step.time"
                    class="input admin-itinerary-row__time"
                    type="time"
                    aria-label="Time"
                    title="Time"
                  >
                  <input
                    v-model="step.activity"
                    class="input admin-itinerary-row__activity"
                    placeholder="e.g. Hotel Pickup"
                    aria-label="Activity"
                    title="Activity"
                  >
                  <button
                    type="button"
                    class="admin-list-row__remove admin-itinerary-row__remove"
                    aria-label="Remove itinerary step"
                    @click="removeItineraryStep(stepIndex)"
                  >
                    <i class="fa-solid fa-xmark" aria-hidden="true" />
                  </button>
                </div>

                <p v-if="!activeDay.steps.length" class="help">No steps for this day yet. Click “Add step”.</p>
              </div>
            </div>

            <div class="admin-panel__checkbox-grid">
              <label class="admin-panel__checkbox">
                <input v-model="form.active" type="checkbox">
                <span>Active / visible to travellers</span>
              </label>
            </div>

            <p v-if="formError" class="err" role="alert">{{ formError }}</p>

            <div class="admin-form-actions">
              <button type="submit" class="btn btn--solid-gold" :disabled="saving">
                {{ saving ? 'Saving…' : 'Save tour' }}
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

.admin-car-image__preview img {
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

.admin-panel__sheet--wide {
  width: min(100%, 640px);
}

.admin-tour-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-list-section {
  display: grid;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
}

.admin-list-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.btn--sm {
  padding: 6px 12px;
  font-size: 0.8125rem;
}

.admin-list-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-list-row .input {
  flex: 1;
}

.admin-list-row__remove {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted, inherit);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.admin-list-row__remove:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border-color: #dc2626;
}

.admin-tour-guests {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.admin-tour-guests__hint {
  margin-top: -4px;
}

.admin-tour-plan__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.admin-tour-plan__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.admin-tour-plan__tab {
  border: 1px solid var(--color-border);
  background: transparent;
  color: inherit;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.875rem;
  cursor: pointer;
}

.admin-tour-plan__tab.is-active {
  border-color: var(--color-gold, #d8b24c);
  background: rgba(216, 178, 76, 0.12);
  color: var(--color-gold, #d8b24c);
}

.admin-tour-plan__panel {
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.admin-tour-plan__panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.admin-itinerary-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.admin-itinerary-row__time {
  flex: 0 0 140px;
}

.admin-itinerary-row__remove {
  flex: 0 0 auto;
}

.admin-itinerary-row__activity {
  flex: 1 1 180px;
}

@media (max-width: 639px) {
  .admin-tour-guests {
    grid-template-columns: 1fr;
  }

  .admin-itinerary-row__time,
  .admin-itinerary-row__activity {
    flex: 1 1 100%;
  }
}
</style>

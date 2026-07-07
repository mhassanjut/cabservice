<script setup lang="ts">
import type { AdminCarDto, DestinationCityDto, PickupCityDto, RoutePricingDto } from '~/types/api'
import { adminService } from '~/services/api/admin.service'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const toast = useToastStore()
const maps = useGoogleMaps()
const config = useRuntimeConfig()

const routes = ref<RoutePricingDto[]>([])
const pickupCities = ref<PickupCityDto[]>([])
const destinationCities = ref<DestinationCityDto[]>([])
const cars = ref<AdminCarDto[]>([])
const loading = ref(true)
const saving = ref(false)
const formError = ref('')
const newDestination = ref('')
const newPickupCity = ref('')

const form = reactive({
  fromCity: '',
  toCity: '',
  active: true,
})

const carPrices = ref<Record<string, string>>({})

const roundPrice = (value: number) => Math.round(value * 100) / 100

const formatPrice = (value: number | string) => roundPrice(Number(value)).toFixed(2)

const parsePrice = (value: string) => roundPrice(Number.parseFloat(value) || 0)

const destinationRef = ref<HTMLInputElement | null>(null)
const pickupCityRef = ref<HTMLInputElement | null>(null)

const activePickupCities = computed(() => pickupCities.value.filter((c) => c.active))
const activeDestinationCities = computed(() => destinationCities.value.filter((c) => c.active))
const activeCars = computed(() => cars.value.filter((c) => c.active))

const routeGroups = computed(() => {
  const groups = new Map<string, { fromCity: string; toCity: string; rows: RoutePricingDto[] }>()
  for (const row of routes.value) {
    const key = `${row.fromCity}::${row.toCity}`
    const existing = groups.get(key)
    if (existing) {
      existing.rows.push(row)
    } else {
      groups.set(key, { fromCity: row.fromCity, toCity: row.toCity, rows: [row] })
    }
  }
  return [...groups.values()].sort((a, b) =>
    a.fromCity.localeCompare(b.fromCity) || a.toCity.localeCompare(b.toCity),
  )
})

const loadRoutePrices = async () => {
  if (!form.fromCity || !form.toCity) {
    carPrices.value = {}
    return
  }
  try {
    const existing = await adminService.routePricingForRoute(form.fromCity, form.toCity)
    const next: Record<string, string> = {}
    for (const car of activeCars.value) {
      const match = existing.find((row) => row.carId === car.id)
      next[car.id] = match ? formatPrice(match.price) : ''
    }
    if (existing.length) {
      form.active = existing[0]?.active ?? true
    }
    carPrices.value = next
  } catch {
    toast.show('Could not load route prices.', 'error')
  }
}

const load = async () => {
  loading.value = true
  const [pricing, pickups, destinations, fleet] = await Promise.allSettled([
    adminService.routePricing(),
    adminService.allPickupCities(),
    adminService.destinationCities(),
    adminService.cars(),
  ])

  if (pricing.status === 'fulfilled') routes.value = pricing.value
  if (pickups.status === 'fulfilled') {
    pickupCities.value = pickups.value
  } else {
    try {
      pickupCities.value = await adminService.pickupCities()
    } catch {
      toast.show('Could not load pickup cities.', 'error')
    }
  }
  if (destinations.status === 'fulfilled') destinationCities.value = destinations.value
  else toast.show('Could not load destination cities.', 'error')
  if (fleet.status === 'fulfilled') cars.value = fleet.value

  if (!form.fromCity) {
    form.fromCity = activePickupCities.value[0]?.name ?? ''
  }
  loading.value = false
}

const setupAutocomplete = () => {
  if (!config.public.googleMapsApiKey || !maps.ready.value) return
  if (destinationRef.value) {
    maps.cityAutocomplete(destinationRef.value, (city) => {
      newDestination.value = city
    })
  }
  if (pickupCityRef.value) {
    maps.cityAutocomplete(pickupCityRef.value, (city) => {
      newPickupCity.value = city
    })
  }
}

onMounted(async () => {
  await load()
  if (!config.public.googleMapsApiKey) return
  await maps.load()
  setupAutocomplete()
})

watch([() => form.fromCity, () => form.toCity], () => {
  loadRoutePrices()
})

watch(activePickupCities, (list) => {
  if (!form.fromCity && list.length) {
    form.fromCity = list[0].name
  }
})

const saveRoute = async () => {
  formError.value = ''
  if (!form.fromCity || !form.toCity) {
    formError.value = 'Pickup city and destination are required.'
    return
  }
  if (!activeCars.value.length) {
    formError.value = 'No active vehicles configured.'
    return
  }

  const missing = activeCars.value.filter((car) => parsePrice(carPrices.value[car.id] ?? '') <= 0)
  if (missing.length) {
    formError.value = `Enter a price for every vehicle (${missing.map((c) => c.name).join(', ')}).`
    return
  }

  saving.value = true
  try {
    await adminService.saveRoutePricingBatch({
      fromCity: form.fromCity,
      toCity: form.toCity,
      active: form.active,
      carPrices: activeCars.value.map((car) => ({
        carId: car.id,
        price: parsePrice(carPrices.value[car.id] ?? ''),
      })),
    })
    toast.show('Route pricing saved.', 'success')
    await load()
    await loadRoutePrices()
  } catch {
    /* API shows validation toasts */
  } finally {
    saving.value = false
  }
}

const editRouteGroup = (fromCity: string, toCity: string) => {
  form.fromCity = fromCity
  form.toCity = toCity
  formError.value = ''
}

const removeRouteGroup = async (fromCity: string, toCity: string) => {
  if (!confirm(`Delete all pricing for ${fromCity} → ${toCity}?`)) return
  try {
    const rows = routes.value.filter((r) => r.fromCity === fromCity && r.toCity === toCity)
    await Promise.all(rows.map((row) => adminService.deleteRoutePricing(row.id)))
    toast.show('Route pricing deleted.', 'success')
    if (form.fromCity === fromCity && form.toCity === toCity) {
      carPrices.value = {}
    }
    await load()
    await loadRoutePrices()
  } catch {
    toast.show('Could not delete route pricing.', 'error')
  }
}

const addDestination = async () => {
  const name = newDestination.value.trim()
  if (!name) return
  try {
    await adminService.addDestinationCity(name)
    newDestination.value = ''
    if (destinationRef.value) destinationRef.value.value = ''
    toast.show('Destination city added.', 'success')
    await load()
  } catch {
    toast.show('Could not add destination city.', 'error')
  }
}

const removeDestination = async (city: DestinationCityDto) => {
  if (!confirm(`Remove ${city.name} from destination cities?`)) return
  try {
    await adminService.deleteDestinationCity(city.id)
    toast.show('Destination city removed.', 'success')
    if (form.toCity === city.name) {
      form.toCity = ''
      carPrices.value = {}
    }
    await load()
  } catch {
    toast.show('Could not remove destination city.', 'error')
  }
}

const addPickupCity = async () => {
  const name = newPickupCity.value.trim()
  if (!name) return
  try {
    await adminService.addPickupCity(name)
    newPickupCity.value = ''
    if (pickupCityRef.value) pickupCityRef.value.value = ''
    toast.show('Pickup city added (inactive until enabled).', 'success')
    await load()
  } catch {
    toast.show('Could not add pickup city.', 'error')
  }
}

const togglePickupCity = async (city: PickupCityDto) => {
  try {
    await adminService.updatePickupCity(city.id, !city.active)
    toast.show(city.active ? 'Pickup city deactivated.' : 'Pickup city activated.', 'success')
    await load()
  } catch {
    toast.show('Could not update pickup city.', 'error')
  }
}

const removePickupCity = async (city: PickupCityDto) => {
  if (!confirm(`Remove ${city.name} from pickup cities?`)) return
  try {
    await adminService.deletePickupCity(city.id)
    toast.show('Pickup city removed.', 'success')
    if (form.fromCity === city.name) {
      form.fromCity = activePickupCities.value[0]?.name ?? ''
    }
    await load()
  } catch {
    toast.show('Could not remove pickup city.', 'error')
  }
}
</script>

<template>
  <AdminShell>
    <div class="admin-stack">
      <AdminSectionHead
        title="Routes & pricing"
        description="Set fixed route prices per vehicle. When no route price matches, fares use base price + €1 per km beyond 27 km."
      />

      <article class="card card--elevated admin-pricing-form" style="padding: 24px; margin-bottom: 24px">
        <h3 class="font-serif" style="margin: 0 0 8px">Pricing priority</h3>
        <p class="help" style="margin: 0 0 16px">
          <strong>Route price</strong> (pickup city, destination city, and vehicle) →
          <strong>Distance formula</strong> (base fare up to 27 km, then +€1/km).
        </p>

        <h3 class="font-serif" style="margin: 0 0 12px">Pickup cities</h3>
        <p class="help" style="margin-bottom: 16px">
          Only active pickup cities are available for bookings. Barcelona, Tarragona, and Girona are active by default.
        </p>
        <form class="admin-toolbar" style="margin-bottom: 16px" @submit.prevent="addPickupCity">
          <input
            ref="pickupCityRef"
            v-model="newPickupCity"
            class="input"
            placeholder="Search city to add (Google Maps)"
            required
          />
          <button type="submit" class="btn btn--solid-gold">Add pickup city</button>
        </form>
        <div class="admin-toolbar" style="margin-bottom: 24px">
          <AdminBadge v-for="city in pickupCities" :key="city.id" :class="{ 'is-muted': !city.active }">
            {{ city.name }}
            <span v-if="!city.active" class="help"> (inactive)</span>
            <button type="button" class="admin-badge__action" @click="togglePickupCity(city)">
              {{ city.active ? 'Disable' : 'Enable' }}
            </button>
            <button type="button" class="admin-badge__remove" aria-label="Remove" @click="removePickupCity(city)">×</button>
          </AdminBadge>
          <span v-if="!pickupCities.length" class="help">No pickup cities yet.</span>
        </div>

        <h3 class="font-serif" style="margin: 0 0 12px">Destination cities</h3>
        <p class="help" style="margin-bottom: 16px">Search and add cities customers can travel to.</p>
        <form class="admin-toolbar" style="margin-bottom: 16px" @submit.prevent="addDestination">
          <input
            ref="destinationRef"
            v-model="newDestination"
            class="input"
            placeholder="Search destination city (Google Maps)"
            required
          />
          <button type="submit" class="btn btn--solid-gold">Add city</button>
        </form>
        <div class="admin-toolbar">
          <AdminBadge v-for="city in destinationCities" :key="city.id" :class="{ 'is-muted': !city.active }">
            {{ city.name }}
            <span v-if="!city.active" class="help"> (inactive)</span>
            <button type="button" class="admin-badge__remove" aria-label="Remove" @click="removeDestination(city)">×</button>
          </AdminBadge>
          <span v-if="!destinationCities.length" class="help">No destination cities yet.</span>
        </div>
      </article>

      <AdminSectionHead
        title="Route pricing"
        description="Select a route and enter a fixed price for every active vehicle."
      />

      <form class="card card--elevated admin-pricing-form" @submit.prevent="saveRoute">
        <div class="admin-pricing-form__route">
          <label class="admin-field">
            <span class="admin-field__label">From city</span>
            <select v-model="form.fromCity" class="input input--select" required>
              <option disabled value="">Select pickup city</option>
              <option v-for="city in activePickupCities" :key="city.id" :value="city.name">{{ city.name }}</option>
            </select>
          </label>
          <label class="admin-field">
            <span class="admin-field__label">To city</span>
            <select v-if="activeDestinationCities.length" v-model="form.toCity" class="input input--select" required>
              <option disabled value="">Select destination</option>
              <option v-for="city in activeDestinationCities" :key="city.id" :value="city.name">{{ city.name }}</option>
            </select>
            <input
              v-else
              class="input"
              placeholder="Add destination cities first"
              disabled
            />
          </label>
        </div>

        <div v-if="form.fromCity && form.toCity && activeCars.length" class="admin-car-price-grid">
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
                inputmode="decimal"
                :placeholder="`Price for ${car.name}`"
                required
              />
            </label>
          </div>
        </div>
        <p v-else-if="form.fromCity && form.toCity" class="help admin-pricing-form__empty">No active vehicles configured.</p>

        <p v-if="formError" class="err" role="alert">{{ formError }}</p>

        <div class="admin-pricing-form__actions">
          <label class="admin-panel__checkbox">
            <input v-model="form.active" type="checkbox" />
            <span>Active route</span>
          </label>
          <button
            type="submit"
            class="btn btn--solid-gold"
            :disabled="saving || !activeDestinationCities.length || !activePickupCities.length || !activeCars.length"
          >
            {{ saving ? 'Saving…' : 'Save route prices' }}
          </button>
        </div>
      </form>

      <AdminSkeleton v-if="loading" :rows="5" />
      <section v-else class="card card--elevated" style="padding: 24px">
        <div v-if="!routeGroups.length" class="help">No route pricing configured. Distance-based fares apply for all trips.</div>
        <div v-for="group in routeGroups" :key="`${group.fromCity}-${group.toCity}`" style="margin-bottom: 20px">
          <div class="admin-toolbar" style="margin-bottom: 8px">
            <strong>{{ group.fromCity }} → {{ group.toCity }}</strong>
            <div class="admin-toolbar">
              <button type="button" class="btn secondary" @click="editRouteGroup(group.fromCity, group.toCity)">Edit</button>
              <button type="button" class="btn secondary" @click="removeRouteGroup(group.fromCity, group.toCity)">Delete</button>
            </div>
          </div>
          <ul class="admin-route-prices">
            <li v-for="row in group.rows" :key="row.id">
              <span>{{ row.carName }}</span>
              <strong>€{{ formatPrice(row.price) }}</strong>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </AdminShell>
</template>

<style scoped>
.admin-badge__remove,
.admin-badge__action {
  margin-left: 8px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0;
  text-decoration: underline;
}

.admin-badge__remove {
  font-size: 1rem;
  text-decoration: none;
}
</style>

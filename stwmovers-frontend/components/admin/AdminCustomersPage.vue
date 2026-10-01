<script setup lang="ts">
import type { GuestContactAdminDto, RegisteredCustomerAdminDto } from '~/types/api'
import { routes } from '~/constants/routes'
import { adminService } from '~/services/api/admin.service'

type CustomerTab = 'google' | 'guests'

const route = useRoute()
const router = useRouter()

const activeTab = computed<CustomerTab>(() =>
  route.query.tab === 'guests' ? 'guests' : 'google',
)

const search = ref('')
const page = ref(0)
const totalPages = ref(0)
const loading = ref(true)
const error = ref(false)

const googleCustomers = ref<RegisteredCustomerAdminDto[]>([])
const guestContacts = ref<GuestContactAdminDto[]>([])

const setTab = async (tab: CustomerTab) => {
  if (activeTab.value === tab) return
  await router.replace({ query: { tab } })
  page.value = 0
  search.value = ''
  await load()
}

const load = async () => {
  loading.value = true
  error.value = false
  try {
    if (activeTab.value === 'google') {
      const res = await adminService.googleCustomers(page.value, 20, search.value || undefined)
      googleCustomers.value = res.content
      totalPages.value = res.totalPages
    } else {
      const res = await adminService.guestContacts(page.value, 20, search.value || undefined)
      guestContacts.value = res.content
      totalPages.value = res.totalPages
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const applySearch = async () => {
  page.value = 0
  await load()
}

const clearSearch = async () => {
  search.value = ''
  page.value = 0
  await load()
}

const viewBookings = (email: string) =>
  navigateTo({ path: routes.adminRides, query: { search: email } })

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString() : '—'

watch(
  () => route.query.tab,
  () => {
    page.value = 0
    load()
  },
)

onMounted(load)
</script>

<template>
  <AdminShell>
    <AdminSectionHead
      title="Customers"
      description="Registered Google accounts and guest bookers who have not created an account."
    />

    <div class="admin-tabs" role="tablist" aria-label="Customer lists">
      <button
        type="button"
        role="tab"
        class="admin-tabs__btn"
        :class="{ 'is-active': activeTab === 'google' }"
        :aria-selected="activeTab === 'google'"
        @click="setTab('google')"
      >
        Google sign-ins
      </button>
      <button
        type="button"
        role="tab"
        class="admin-tabs__btn"
        :class="{ 'is-active': activeTab === 'guests' }"
        :aria-selected="activeTab === 'guests'"
        @click="setTab('guests')"
      >
        Guest bookers
      </button>
    </div>

    <div class="admin-toolbar admin-toolbar--filters">
      <input
        v-model="search"
        class="input admin-toolbar__grow"
        type="search"
        :placeholder="activeTab === 'google' ? 'Search name or email' : 'Search guest name or email'"
        @keydown.enter.prevent="applySearch"
      >
      <button type="button" class="btn secondary" @click="applySearch">Search</button>
      <button type="button" class="btn secondary" @click="clearSearch">Clear</button>
    </div>

    <AdminSkeleton v-if="loading" :rows="8" />
    <div v-else-if="error" class="admin-empty card card--elevated">
      <p>Failed to load customers.</p>
      <button type="button" class="btn btn--solid-gold" @click="load">Retry</button>
    </div>

    <template v-else-if="activeTab === 'google'">
      <AdminEmptyState
        v-if="!googleCustomers.length"
        title="No Google sign-ins yet"
        message="Customers who register with Google will appear here."
        icon="fa-brands fa-google"
      />
      <section v-else class="admin-card card card--elevated">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Bookings</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in googleCustomers" :key="row.userId">
                <td>
                  <div class="admin-customers__identity">
                    <UserAvatar :name="row.fullName" :src="row.profilePictureUrl" size="sm" />
                    <span>{{ row.fullName }}</span>
                  </div>
                </td>
                <td>{{ row.email }}</td>
                <td>{{ formatDate(row.createdAt) }}</td>
                <td>{{ row.bookingCount }}</td>
                <td>
                  <button type="button" class="btn secondary" @click="viewBookings(row.email)">
                    View bookings
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <nav class="admin-pagination" aria-label="Google customers pagination">
          <button
            type="button"
            class="btn secondary admin-pagination__nav"
            :disabled="page <= 0"
            @click="page--; load()"
          >
            Previous
          </button>
          <p class="admin-pagination__status">
            Page <strong>{{ page + 1 }}</strong> of <strong>{{ Math.max(totalPages, 1) }}</strong>
          </p>
          <button
            type="button"
            class="btn secondary admin-pagination__nav"
            :disabled="page + 1 >= totalPages"
            @click="page++; load()"
          >
            Next
          </button>
        </nav>
      </section>
    </template>

    <template v-else>
      <AdminEmptyState
        v-if="!guestContacts.length"
        title="No guest bookers yet"
        message="Guests who book without signing in will appear here."
        icon="fa-user-clock"
      />
      <section v-else class="admin-card card card--elevated">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Bookings</th>
                <th>Last booking</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in guestContacts" :key="row.email">
                <td>{{ row.guestName || '—' }}</td>
                <td>{{ row.email }}</td>
                <td>{{ row.guestPhone || '—' }}</td>
                <td>{{ row.bookingCount }}</td>
                <td>{{ formatDate(row.lastBookingAt) }}</td>
                <td>
                  <button type="button" class="btn secondary" @click="viewBookings(row.email)">
                    View bookings
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <nav class="admin-pagination" aria-label="Guest bookers pagination">
          <button
            type="button"
            class="btn secondary admin-pagination__nav"
            :disabled="page <= 0"
            @click="page--; load()"
          >
            Previous
          </button>
          <p class="admin-pagination__status">
            Page <strong>{{ page + 1 }}</strong> of <strong>{{ Math.max(totalPages, 1) }}</strong>
          </p>
          <button
            type="button"
            class="btn secondary admin-pagination__nav"
            :disabled="page + 1 >= totalPages"
            @click="page++; load()"
          >
            Next
          </button>
        </nav>
      </section>
    </template>
  </AdminShell>
</template>

<style scoped>
.admin-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.admin-tabs__btn {
  border: 1px solid var(--border-subtle, rgba(var(--theme-ink-rgb), 0.12));
  background: transparent;
  color: inherit;
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
  font: inherit;
}

.admin-tabs__btn.is-active {
  background: var(--gold, #d8b24c);
  border-color: var(--gold, #d8b24c);
  color: #17130d;
}

.admin-customers__identity {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>

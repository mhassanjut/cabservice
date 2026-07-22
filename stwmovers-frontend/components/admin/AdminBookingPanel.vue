<script setup lang="ts">
import type { AdminBookingDetailDto, AdminDriverDto } from '~/types/api'
import { adminService } from '~/services/api/admin.service'
import { bookingStatusTone, formatStatusLabel } from '~/utils/adminStatus'

const props = defineProps<{
  open: boolean
  bookingId: string | null
}>()

const emit = defineEmits<{ close: [] }>()

const toast = useToastStore()
const detail = ref<AdminBookingDetailDto | null>(null)
const drivers = ref<AdminDriverDto[]>([])
const loading = ref(false)
const error = ref(false)
const selectedDriver = ref('')
const selectedStatus = ref('')
const cancelReason = ref('')
const customFare = ref('')
const assignForce = ref(false)

const load = async () => {
  if (!props.bookingId) return
  loading.value = true
  error.value = false
  try {
    const [booking, driverList] = await Promise.all([
      adminService.booking(props.bookingId),
      adminService.drivers(),
    ])
    detail.value = booking
    drivers.value = driverList.filter((d) => d.active)
    selectedStatus.value = booking.allowedNextStatuses[0] ?? ''
    customFare.value = booking.booking.calculatedFare != null ? String(booking.booking.calculatedFare) : ''
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.open, props.bookingId] as const,
  ([open]: readonly [boolean, string | null]) => {
    if (open) {
      if (import.meta.client) document.body.style.overflow = 'hidden'
      load()
    } else {
      detail.value = null
      selectedDriver.value = ''
      assignForce.value = false
      if (import.meta.client) document.body.style.overflow = ''
    }
  },
)

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

const refresh = () => load()

const onAssign = async () => {
  if (!props.bookingId || !selectedDriver.value) return
  try {
    await adminService.assignDriver(props.bookingId, selectedDriver.value, assignForce.value)
    toast.show('Driver assigned', 'success')
    await refresh()
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } }).data?.message
    if (msg?.includes('active ride')) assignForce.value = true
  }
}

const onStatus = async () => {
  if (!props.bookingId || !selectedStatus.value) return
  await adminService.updateBookingStatus(props.bookingId, selectedStatus.value)
  toast.show('Status updated', 'success')
  await refresh()
}

const reactivateBooking = async () => {
  if (!props.bookingId) return
  await adminService.updateBookingStatus(props.bookingId, 'CONFIRMED')
  toast.show('Booking reactivated as confirmed.', 'success')
  await refresh()
}

const onCancel = async () => {
  if (!props.bookingId) return
  await adminService.cancelBooking(props.bookingId, cancelReason.value)
  toast.show('Booking cancelled', 'success')
  await refresh()
}

const onCustomFare = async () => {
  if (!props.bookingId || !customFare.value) return
  await adminService.setCustomFare(props.bookingId, Number(customFare.value))
  toast.show('Custom fare saved', 'success')
  await refresh()
}
</script>

<template>
  <div class="admin-panel" :class="{ 'is-open': open }">
    <div class="admin-panel__backdrop" @click="emit('close')" />
    <aside class="admin-panel__sheet" role="dialog" aria-modal="true" aria-labelledby="booking-panel-title">
      <header class="admin-panel__head">
        <div>
          <p class="eyebrow admin-panel__eyebrow">Booking</p>
          <h2 id="booking-panel-title" class="admin-panel__title font-serif">Detail &amp; actions</h2>
        </div>
        <button type="button" class="admin-panel__close" aria-label="Close" @click="emit('close')">
          <i class="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </header>

      <div class="admin-panel__body">
        <AdminSkeleton v-if="loading" :rows="6" />
        <div v-else-if="error" class="admin-panel__empty">
          <p>Could not load booking.</p>
          <button type="button" class="btn btn--solid-gold" @click="refresh">Retry</button>
        </div>
        <div v-else-if="detail" class="admin-panel__sections">
          <div class="admin-panel__hero">
            <AdminBadge :tone="bookingStatusTone(detail.booking.status)">
              {{ formatStatusLabel(detail.booking.status) }}
            </AdminBadge>
            <p class="admin-panel__ref font-serif">{{ detail.booking.bookingReference }}</p>
          </div>

          <section class="admin-panel__block">
            <h3 class="admin-panel__block-title font-serif">Trip</h3>
            <dl class="admin-detail-list">
              <div><dt>Pickup</dt><dd>{{ detail.booking.pickupAddress }}</dd></div>
              <div><dt>Dropoff</dt><dd>{{ detail.booking.dropoffAddress }}</dd></div>
              <div><dt>Type</dt><dd>{{ detail.booking.rideType }}</dd></div>
              <div><dt>Fare</dt><dd>€{{ detail.booking.calculatedFare ?? '—' }}</dd></div>
              <div><dt>Scheduled</dt><dd>{{ new Date(detail.booking.scheduledAt).toLocaleString() }}</dd></div>
            </dl>
          </section>

          <section class="admin-panel__block">
            <h3 class="admin-panel__block-title font-serif">Customer</h3>
            <dl class="admin-detail-list">
              <div><dt>Name</dt><dd>{{ detail.customerName || '—' }}</dd></div>
              <div><dt>Email</dt><dd>{{ detail.customerEmail || '—' }}</dd></div>
              <div><dt>Phone</dt><dd>{{ detail.customerPhone || '—' }}</dd></div>
            </dl>
          </section>

          <section class="admin-panel__block">
            <h3 class="admin-panel__block-title font-serif">Payment</h3>
            <dl class="admin-detail-list">
              <div><dt>Status</dt><dd>{{ detail.paymentStatus || 'None' }}</dd></div>
              <div v-if="detail.paymentAmount"><dt>Amount</dt><dd>€{{ detail.paymentAmount }}</dd></div>
              <div v-if="detail.stripeSessionId" class="admin-detail-list__wide">
                <dt>Stripe session</dt>
                <dd>{{ detail.stripeSessionId }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="detail.booking.customRequest" class="admin-panel__block">
            <h3 class="admin-panel__block-title font-serif">Custom fare</h3>
            <div class="field">
              <label class="label" for="custom-fare">Set fare (EUR)</label>
              <input id="custom-fare" v-model="customFare" class="input" type="number" min="0" step="0.01" />
            </div>
            <button type="button" class="btn btn--solid-gold admin-panel__action" @click="onCustomFare">
              Save fare
            </button>
          </section>

          <section v-if="detail.booking.status !== 'CANCELLED'" class="admin-panel__block">
            <h3 class="admin-panel__block-title font-serif">Assign driver</h3>
            <p v-if="detail.driverName" class="admin-panel__note">
              Current driver: <strong>{{ detail.driverName }}</strong>
            </p>
            <div class="field">
              <label class="label" for="assign-driver">Select driver</label>
              <select id="assign-driver" v-model="selectedDriver" class="input input--select">
                <option value="">Choose driver</option>
                <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                  {{ driver.fullName }}{{ driver.onRide ? ' (on ride)' : '' }}
                </option>
              </select>
            </div>
            <p v-if="assignForce" class="admin-panel__warn">
              Driver may already be on a ride. Tap assign again to confirm.
            </p>
            <button type="button" class="btn btn--solid-gold admin-panel__action" @click="onAssign">
              Assign driver
            </button>
          </section>

          <section v-if="detail.booking.status === 'CANCELLED'" class="admin-panel__block">
            <h3 class="admin-panel__block-title font-serif">Reactivate booking</h3>
            <p class="admin-panel__note">
              This booking was cancelled. Restore it to active dispatch so a chauffeur can be assigned again.
            </p>
            <button type="button" class="btn btn--solid-gold admin-panel__action" @click="reactivateBooking">
              Reactivate as confirmed
            </button>
          </section>

          <section v-if="detail.allowedNextStatuses.length && detail.booking.status !== 'CANCELLED'" class="admin-panel__block">
            <h3 class="admin-panel__block-title font-serif">Change status</h3>
            <p class="admin-panel__note">
              Set any operational status from confirmed through completed (including refunded).
            </p>
            <div class="field">
              <label class="label" for="booking-status">Next status</label>
              <select id="booking-status" v-model="selectedStatus" class="input input--select">
                <option v-for="status in detail.allowedNextStatuses" :key="status" :value="status">
                  {{ formatStatusLabel(status) }}
                </option>
              </select>
            </div>
            <button type="button" class="btn secondary admin-panel__action" @click="onStatus">
              Update status
            </button>
          </section>

          <section v-if="detail.booking.status !== 'CANCELLED'" class="admin-panel__block admin-panel__block--danger">
            <h3 class="admin-panel__block-title font-serif">Cancel booking</h3>
            <div class="field">
              <label class="label" for="cancel-reason">Reason (optional)</label>
              <textarea id="cancel-reason" v-model="cancelReason" class="input" rows="3" />
            </div>
            <button type="button" class="btn secondary admin-panel__action" @click="onCancel">
              Cancel booking
            </button>
          </section>
        </div>
      </div>
    </aside>
  </div>
</template>

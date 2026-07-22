<script setup lang="ts">
import { contactBooking, contactChannels } from '~/data/contactContent'

const form = reactive({
  pickup: '',
  destination: '',
  date: '',
  time: '',
  notes: '',
})

const submitted = ref(false)

const onSubmit = () => {
  const subject = encodeURIComponent('STW Movers — journey request')
  const body = encodeURIComponent(
    [
      `Pickup Location: ${form.pickup}`,
      `Destination: ${form.destination}`,
      `Travel Date: ${form.date}`,
      `Pickup Time: ${form.time}`,
      '',
      `Additional Notes: ${form.notes}`,
    ].join('\n'),
  )
  window.location.href = `mailto:concierge@stwmovers.com?subject=${subject}&body=${body}`
  submitted.value = true
}
</script>

<template>
  <section id="book-journey" class="contact-section" aria-labelledby="contact-booking-heading">
    <div class="contact-container contact-booking__grid">
      <div class="contact-booking__info">
        <h2 id="contact-booking-heading" class="contact-heading contact-heading--sm">
          {{ contactBooking.heading }}
        </h2>
        <p class="contact-lead contact-booking__lead">{{ contactBooking.lead }}</p>

        <ul class="contact-channels">
          <li v-for="channel in contactChannels" :key="channel.label" class="contact-channel">
            <i :class="['contact-channel__icon', channel.icon]" aria-hidden="true" />
            <div>
              <p class="contact-channel__label">{{ channel.label }}</p>
              <a
                class="contact-channel__value"
                :href="channel.href"
                v-bind="channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
              >
                {{ channel.value }}
              </a>
            </div>
          </li>
        </ul>
      </div>

      <form class="contact-form-card" novalidate @submit.prevent="onSubmit">
        <div class="contact-form__grid">
          <div class="contact-field">
            <label class="contact-label" for="contact-pickup">Pickup Location</label>
            <input
              id="contact-pickup"
              v-model="form.pickup"
              class="contact-input"
              type="text"
              autocomplete="off"
              placeholder="e.g. Mandarin Oriental, Barcelona"
              required
            />
          </div>
          <div class="contact-field">
            <label class="contact-label" for="contact-destination">Destination</label>
            <input
              id="contact-destination"
              v-model="form.destination"
              class="contact-input"
              type="text"
              autocomplete="off"
              placeholder="e.g. Barcelona-El Prat Airport"
              required
            />
          </div>
          <div class="contact-field">
            <label class="contact-label" for="contact-date">Travel Date</label>
            <input id="contact-date" v-model="form.date" class="contact-input" type="date" required />
          </div>
          <div class="contact-field">
            <label class="contact-label" for="contact-time">Pickup Time</label>
            <input id="contact-time" v-model="form.time" class="contact-input" type="time" required />
          </div>
          <div class="contact-field contact-field--full">
            <label class="contact-label" for="contact-notes">Additional Notes or Requests</label>
            <textarea
              id="contact-notes"
              v-model="form.notes"
              class="contact-textarea"
              placeholder="e.g. child seats required, flight number, extra luggage room"
            />
          </div>
        </div>

        <button type="submit" class="contact-btn contact-btn--gold contact-btn--block contact-form__submit">
          {{ contactBooking.submitLabel }}
        </button>

        <p v-if="submitted" class="contact-form__note">
          Your mail client should open with these details pre-filled. If nothing opens, email us
          directly at concierge@stwmovers.com.
        </p>
      </form>
    </div>
  </section>
</template>

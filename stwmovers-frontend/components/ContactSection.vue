<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  message: '',
})

const submitted = ref(false)

const onSubmit = () => {
  const subject = encodeURIComponent('STW Movers — inquiry')
  const body = encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
  )
  window.location.href = `mailto:concierge@stwmovers.com?subject=${subject}&body=${body}`
  submitted.value = true
}
</script>

<template>
  <div class="contact-split">
    <div class="reveal">
      <div class="contact-detail">
        <i class="fa-solid fa-phone" aria-hidden="true" />
        <div>
          <div class="contact-detail__label">Phone</div>
          <a class="contact-detail__value" href="tel:+34632047888">+34 632 047 888</a>
        </div>
      </div>
      <div class="contact-detail">
        <i class="fa-solid fa-envelope" aria-hidden="true" />
        <div>
          <div class="contact-detail__label">Email</div>
          <a class="contact-detail__value" href="mailto:concierge@stwmovers.com">concierge@stwmovers.com</a>
        </div>
      </div>
      <div class="contact-detail">
        <i class="fa-solid fa-location-dot" aria-hidden="true" />
        <div>
          <div class="contact-detail__label">Office</div>
          <div class="contact-detail__value">Passeig de Gràcia 21, 08007 Barcelona</div>
        </div>
      </div>
      <div class="contact-detail">
        <i class="fa-regular fa-clock" aria-hidden="true" />
        <div>
          <div class="contact-detail__label">Hours</div>
          <div class="contact-detail__value">Daily 06:00 — 23:00 CET · 24h airport desk</div>
        </div>
      </div>
    </div>

    <form class="card card--elevated reveal" style="padding: clamp(1.25rem, 3vw, 2rem)" @submit.prevent="onSubmit">
      <p class="eyebrow" style="margin: 0 0 0.75rem">Message</p>
      <h3 class="font-serif" style="margin: 0 0 1.25rem; font-size: 1.35rem">Send a brief</h3>
      <div class="field">
        <label class="label" for="contact-name">Full name</label>
        <input id="contact-name" v-model="form.name" class="input" type="text" autocomplete="name" required />
      </div>
      <div class="field" style="margin-top: 1rem">
        <label class="label" for="contact-email">Email</label>
        <input
          id="contact-email"
          v-model="form.email"
          class="input"
          type="email"
          autocomplete="email"
          required
        />
      </div>
      <div class="field" style="margin-top: 1rem">
        <label class="label" for="contact-message">How can we help?</label>
        <textarea
          id="contact-message"
          v-model="form.message"
          class="input"
          rows="5"
          required
          placeholder="Pickup, date, party size, special requests…"
        />
      </div>
      <button class="btn btn--solid-gold" type="submit" style="width: 100%; margin-top: 1.25rem">
        Open email to send
      </button>
      <p v-if="submitted" class="help" style="margin-top: 0.75rem">
        Your mail client should open with this message pre-filled. If nothing opens, email us
        directly.
      </p>
    </form>
  </div>
</template>

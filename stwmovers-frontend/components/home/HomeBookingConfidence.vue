<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { journeyWithRoute } from '~/constants/routes'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const paths = [
  {
    icon: 'fa-solid fa-plane-arrival',
    label: 'BCN airport arrival',
    title: 'Flight lands, chauffeur waits.',
    text: 'Share your flight, luggage, and hotel. We plan the pickup point and vehicle before you arrive.',
    to: journeyWithRoute({ pickup: 'Barcelona Airport', destination: 'Barcelona hotel' }),
  },
  {
    icon: 'fa-solid fa-briefcase',
    label: 'Business schedule',
    title: 'Executive routes stay calm.',
    text: 'For meetings, Fira Barcelona, roadshows, and client arrivals where timing and presentation matter.',
    to: journeyWithRoute({ pickup: 'Barcelona', destination: 'Business destination' }),
  },
  {
    icon: 'fa-solid fa-ship',
    label: 'Cruise port transfer',
    title: 'Port handoffs without rush.',
    text: 'Private pickup between BCN airport, Barcelona cruise port, hotels, and family luggage routes.',
    to: journeyWithRoute({ pickup: 'Barcelona Cruise Port', destination: 'Barcelona Airport' }),
  },
  {
    icon: 'fa-solid fa-van-shuttle',
    label: 'Groups and luggage',
    title: 'The right vehicle first time.',
    text: 'Sedans, vans, and group transfer planning for passengers, bags, child seats, and longer routes.',
    to: journeyWithRoute({ pickup: 'Barcelona', destination: 'Group transfer destination' }),
  },
] as const

const whatsappHref = buildWhatsappUrl({
  phone: siteConfig.whatsappNumber,
  text: 'Hello STW Movers, I want help choosing the right Barcelona transfer option.',
})
</script>

<template>
  <section class="home-confidence" aria-labelledby="home-confidence-heading">
    <div class="container container--wide home-confidence__inner">
      <div class="home-confidence__intro">
        <p class="home-eyebrow">Choose faster</p>
        <h2 id="home-confidence-heading">Start with the journey you need.</h2>
        <p>
          Plan an airport arrival, business journey, cruise connection, or group transfer around your schedule and luggage.
        </p>
      </div>

      <div class="home-confidence__grid">
        <NuxtLink
          v-for="path in paths"
          :key="path.label"
          class="home-confidence__card"
          :to="path.to"
        >
          <span class="home-confidence__icon" aria-hidden="true">
            <i :class="path.icon" />
          </span>
          <span class="home-confidence__label">{{ path.label }}</span>
          <strong>{{ path.title }}</strong>
          <span>{{ path.text }}</span>
        </NuxtLink>
      </div>

      <div class="home-confidence__actions" aria-label="Fast booking options">
        <a class="home-confidence__action home-confidence__action--primary" href="#booking-section">
          Get a private quote
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </a>
        <a class="home-confidence__action home-confidence__action--ghost" :href="whatsappHref" target="_blank" rel="noopener noreferrer">
          Continue on WhatsApp
          <i class="fa-brands fa-whatsapp" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
</template>

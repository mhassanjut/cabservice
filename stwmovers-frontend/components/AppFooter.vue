<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { homeAnchors, routes } from '~/constants/routes'
import { buildWhatsappUrl } from '~/utils/whatsapp'

const whatsappHref = buildWhatsappUrl({
  phone: siteConfig.whatsappNumber,
  text: siteConfig.whatsappDefaultMessage,
})
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <div class="site-footer__grid">
      <div>
        <p class="site-footer__brand">STW Movers</p>
        <p class="site-footer__desc">
          Executive airport transfers, city-to-city chauffeuring, and discreet on-demand transport
          across Barcelona and Spain.
        </p>
        <div class="site-footer__social">
          <a :href="whatsappHref" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp">
            <i class="fa-brands fa-whatsapp" aria-hidden="true" />
          </a>
          <a :href="`mailto:${siteConfig.contactEmail}`" aria-label="Email">
            <i class="fa-solid fa-envelope" aria-hidden="true" />
          </a>
        </div>
      </div>
      <div>
        <p class="site-footer__col-title">Services</p>
        <ul class="site-footer__list">
          <li><NuxtLink :to="routes.airportTransfer">Airport transfers</NuxtLink></li>
          <li><NuxtLink :to="routes.chauffeurService">Private chauffeur</NuxtLink></li>
          <li><NuxtLink :to="routes.executiveBusinessTravel">Executive travel</NuxtLink></li>
          <li><NuxtLink :to="routes.barcelonaAirportTransferService">BCN airport transfer</NuxtLink></li>
          <li><NuxtLink :to="routes.chauffeurService08015">08015 chauffeur service</NuxtLink></li>
        </ul>
      </div>
      <div>
        <p class="site-footer__col-title">Company</p>
        <ul class="site-footer__list">
          <li><NuxtLink :to="routes.aboutUs">About STW Movers</NuxtLink></li>
          <li><NuxtLink :to="routes.contact">Contact</NuxtLink></li>
          <li><NuxtLink :to="routes.tours">Private Barcelona tours</NuxtLink></li>
          <li><NuxtLink :to="routes.locations">Service areas</NuxtLink></li>
          <li><NuxtLink :to="routes.websiteCredits">Website credits</NuxtLink></li>
        </ul>
      </div>
      <div>
        <p class="site-footer__col-title">Book</p>
        <ul class="site-footer__list">
          <li><NuxtLink :to="routes.journey">Request a quote</NuxtLink></li>
          <li><a :href="homeAnchors.booking">Quick booking form</a></li>
          <li><NuxtLink :to="routes.answers">Transfer answers</NuxtLink></li>
          <li><a :href="whatsappHref" rel="noopener noreferrer" target="_blank">WhatsApp support</a></li>
        </ul>
      </div>
    </div>
    <div class="site-footer__rule" aria-hidden="true" />
    <div class="site-footer__legal">
      <span>© {{ new Date().getFullYear() }} STW Movers. All rights reserved.</span>
      <span>{{ siteConfig.contactAddressDisplay }}</span>
    </div>
    <p class="site-footer__credit">
      <a :href="siteConfig.digitalPartner.url" target="_blank" rel="noopener noreferrer">
        {{ siteConfig.digitalPartner.creditLine }}
      </a>
    </p>
  </footer>
</template>

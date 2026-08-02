<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { homeAnchors, routes } from '~/constants/routes'
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
          <a href="https://wa.me/34632047888" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp">
            <i class="fa-brands fa-whatsapp" aria-hidden="true" />
          </a>
          <a :href="`mailto:${siteConfig.contactEmail}`" aria-label="Email">
            <i class="fa-solid fa-envelope" aria-hidden="true" />
          </a>
          <a href="https://instagram.com" rel="noopener noreferrer" target="_blank" aria-label="Instagram">
            <i class="fa-brands fa-instagram" aria-hidden="true" />
          </a>
        </div>
      </div>
      <div>
        <p class="site-footer__col-title">Services</p>
        <ul class="site-footer__list">
          <li><NuxtLink :to="routes.airportTransfer">Airport transfers</NuxtLink></li>
          <li><NuxtLink :to="routes.home">City transfers</NuxtLink></li>
          <li><a :href="homeAnchors.booking">Book a transfer</a></li>
        </ul>
      </div>
      <div>
        <p class="site-footer__col-title">Company</p>
        <ul class="site-footer__list">
          <li><a :href="homeAnchors.contact">Contact</a></li>
          <li><NuxtLink :to="routes.confirm">Confirmation</NuxtLink></li>
          <li><NuxtLink :to="routes.tours">Private Barcelona tours</NuxtLink></li>
        </ul>
      </div>
      <div>
        <p class="site-footer__col-title">Legal</p>
        <ul class="site-footer__list">
          <li><a href="#">Privacy policy</a></li>
          <li><a href="#">Terms of service</a></li>
          <li><a href="#">Licensing</a></li>
        </ul>
      </div>
    </div>
    <div class="site-footer__rule" aria-hidden="true" />
    <div class="site-footer__legal">
      <span>© {{ new Date().getFullYear() }} STW Movers. All rights reserved.</span>
      <span>Barcelona, Spain · VAT ES-B00000000</span>
    </div>
  </footer>
</template>

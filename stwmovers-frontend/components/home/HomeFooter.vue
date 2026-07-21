<script setup lang="ts">
import { homeAnchors, routes } from '~/constants/routes'
import logoUrl from '~/assets/icons/Logo.svg?url'
</script>

<template>
  <footer class="home-footer" role="contentinfo">
    <div class="container">
      <div class="home-footer__grid">
        <div class="home-footer__brand">
          <img :src="logoUrl" alt="STW Movers" width="145" height="40" loading="lazy" />
          <p class="home-footer__desc">
            Executive airport transfers, city-to-city chauffeuring, and discreet on-demand transport across
            Barcelona and Spain.
          </p>
        </div>
        <div>
          <p class="home-footer__col-title">Navigation</p>
          <ul class="home-footer__list">
            <li><a :href="homeAnchors.experience">Service</a></li>
            <li><a :href="homeAnchors.values">Mission</a></li>
            <li><a :href="homeAnchors.fleet">Fleet</a></li>
            <li><a :href="homeAnchors.contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <p class="home-footer__col-title">Services</p>
          <ul class="home-footer__list">
            <li><NuxtLink :to="routes.home">Airport transfers</NuxtLink></li>
            <li><NuxtLink :to="routes.home">City transfers</NuxtLink></li>
            <li><a :href="homeAnchors.booking">Book a transfer</a></li>
          </ul>
        </div>
        <div>
          <p class="home-footer__col-title">Company</p>
          <ul class="home-footer__list">
            <li><a :href="homeAnchors.contact">Contact</a></li>
            <li><NuxtLink :to="routes.confirm">Confirmation</NuxtLink></li>
            <li><NuxtLink :to="routes.tours">Private Barcelona tours</NuxtLink></li>
            <li><NuxtLink :to="routes.faq">FAQ</NuxtLink></li>
          </ul>
        </div>
        <div>
          <p class="home-footer__col-title">Legal</p>
          <ul class="home-footer__list">
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Terms of service</a></li>
            <li><a href="#">Licensing</a></li>
          </ul>
        </div>
      </div>
      <div class="home-footer__bar">
        <p style="margin: 0">Barcelona, Spain · VAT ES-B00000000</p>
        <p style="margin: 0">2026 STW Movers. All rights reserved.</p>
        <a class="home-footer__back" href="#main-content">
          Back to top
          <span class="home-icon-wrap">
            <img class="home-icon" src="/img/home/icons/arrow-up.svg" alt="" width="30" height="30" />
          </span>
        </a>
      </div>
    </div>
  </footer>
</template>

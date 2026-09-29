<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { buildWhatsappUrl } from '~/utils/whatsapp'
const expanded = ref<string[]>([])
const toggle = (title: string) => { expanded.value = expanded.value.includes(title) ? expanded.value.filter((item: string) => item !== title) : [...expanded.value, title] }
const whatsappHref = buildWhatsappUrl({ phone: siteConfig.whatsappNumber, text: siteConfig.whatsappDefaultMessage })
const groups = [
 { title: 'Services', links: [
 ['Airport transfers', '/services/barcelona-airport-transfer'], ['Private driver', '/services/private-driver-barcelona'], ['Hourly chauffeur', '/services/hourly-chauffeur-barcelona'], ['Group transfers', '/services/barcelona-van-transfer'], ['All services', '/services'],
 ] },
 { title: 'Explore', links: [
 ['Our fleet', '/#fleet'], ['Service areas', '/locations'], ['Private tours', '/tours'], ['Insights', '/blogs'], ['Transfer answers', '/answers'],
 ] },
 { title: 'Company', links: [
 ['About STW Movers', '/about-us'], ['Contact', '/contact'], ['Booking FAQs', '/faq'], ['Website credits', '/website-credits'], ['Accessibility', '/accessibility-statement'],
 ] },
]
</script>
<template>
 <footer class="refined-footer">
  <div class="container">
   <div class="refined-footer__top">
    <div><NuxtImg src="/Logo.svg" alt="STW Movers" width="170" height="48" loading="lazy" /><p>Private airport transfers and chauffeur journeys in Barcelona and beyond.</p></div>
    <div class="refined-footer__actions"><NuxtLink to="/journey#book-journey">Get a private quote <i class="fa-solid fa-arrow-right" aria-hidden="true" /></NuxtLink><a :href="whatsappHref" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp</a></div>
   </div>
   <div class="refined-footer__grid">
    <section v-for="group in groups" :key="group.title" class="refined-footer__group" :class="{ 'is-expanded': expanded.includes(group.title) }">
     <h2>{{ group.title }}</h2>
     <button type="button" :aria-expanded="expanded.includes(group.title)" :aria-controls="'footer-' + group.title" @click="toggle(group.title)">{{ group.title }}<i class="fa-solid fa-chevron-down" aria-hidden="true" /></button>
     <ul :id="'footer-' + group.title"><li v-for="[label, href] in group.links" :key="href"><NuxtLink :to="href">{{ label }}</NuxtLink></li></ul>
    </section>
    <section class="refined-footer__contact"><h2>Barcelona</h2><address>{{ siteConfig.contactAddressDisplay }}</address><a :href="'tel:' + siteConfig.contactPhone">{{ siteConfig.contactPhoneDisplay }}</a><a :href="'mailto:' + siteConfig.contactEmail">{{ siteConfig.contactEmail }}</a></section>
   </div>
   <div class="refined-footer__legal"><span>© {{ new Date().getFullYear() }} STW Movers</span><nav aria-label="Legal"><NuxtLink to="/terms-and-conditions">Terms</NuxtLink><NuxtLink to="/privacy-policy">Privacy</NuxtLink><NuxtLink to="/cancellation-policy">Cancellation</NuxtLink><NuxtLink to="/cookie-policy">Cookies</NuxtLink><NuxtLink to="/legal-notice">Legal notice</NuxtLink><NuxtLink to="/website-credits">Credits</NuxtLink></nav><a href="#main-content" aria-label="Back to top" title="Back to top"><i class="fa-solid fa-arrow-up" aria-hidden="true" /></a></div>
   <p class="refined-footer__credit">
    <a :href="siteConfig.digitalPartner.url" target="_blank" rel="noopener noreferrer">
     {{ siteConfig.digitalPartner.creditLine }}
    </a>
   </p>
  </div>
 </footer>
</template>
<style scoped>
.refined-footer { background: #101010; color: #ddd; padding: 48px 0 24px; border-top: 1px solid #ffffff1f; }
.refined-footer__top { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding-bottom: 32px; border-bottom: 1px solid #ffffff1f; }
.refined-footer__top p { max-width: 360px; font-size: 14px; line-height: 1.7; color: #bcbcbc; }
.refined-footer__actions { display: flex; gap: 16px; flex-wrap: wrap; }
.refined-footer__actions a { display: inline-flex; align-items: center; gap: 12px; min-height: 48px; padding: 12px 18px; border: 1px solid #8d7946; border-radius: 4px; color: #e5c36c; }
.refined-footer__grid { display: grid; grid-template-columns: repeat(3,1fr) 1.4fr; gap: 32px; padding: 32px 0; }
.refined-footer h2 { font-size: 15px; font-weight: 400; color: #e5c36c; margin: 0 0 16px; letter-spacing: 0; }
.refined-footer a { text-decoration: none; color: inherit; font-size: 13px; }
.refined-footer a:hover { color: #e5c36c; }
.refined-footer ul { list-style: none; padding: 0; margin: 0; }
.refined-footer li a { display: inline-flex; align-items: center; min-height: 36px; }
.refined-footer__group > button { display: none; }
.refined-footer__contact address { font-style: normal; font-size: 13px; line-height: 1.7; margin-bottom: 12px; }
.refined-footer__contact > a { display: block; min-height: 36px; overflow-wrap: anywhere; }
.refined-footer__legal { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; padding-top: 20px; border-top: 1px solid #ffffff1f; font-size: 12px; }
.refined-footer__legal nav { display: flex; flex-wrap: wrap; gap: 8px 18px; }
.refined-footer__legal a { display: inline-flex; align-items: center; min-height: 44px; }
.refined-footer__credit { margin: 12px 0 0; color: #85807a; font-size: 11px; letter-spacing: 0.04em; text-align: right; }
.refined-footer__credit a { color: inherit; text-decoration: none; }
.refined-footer__credit a:hover { color: #e5c36c; }
@media(max-width:767px) {
 .refined-footer { padding-bottom: calc(110px + env(safe-area-inset-bottom)); }
 .refined-footer__top { align-items: start; flex-direction: column; gap: 12px; }
 .refined-footer__grid { grid-template-columns: 1fr; gap: 0; }
 .refined-footer__group { border-bottom: 1px solid #ffffff1f; }
 .refined-footer__group h2 { display: none; }
 .refined-footer__group > button { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 56px; border: 0; background: transparent; color: #e5c36c; font: inherit; font-size: 15px; cursor: pointer; }
 .refined-footer__group ul { display: none; padding-bottom: 12px; }
 .refined-footer__group.is-expanded ul { display: block; }
 .refined-footer li a { min-height: 44px; }
 .refined-footer__contact { padding-top: 24px; }
 .refined-footer__credit { text-align: left; }
}
</style>

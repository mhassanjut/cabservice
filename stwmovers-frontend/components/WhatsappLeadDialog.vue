<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { buildWhatsappLeadUrl } from '~/utils/whatsapp'
import { trackMarketingEvent } from '~/utils/marketingEvents'

const route = useRoute()
const dialog = ref<HTMLDialogElement>()
const pickupInput = ref<HTMLInputElement>()
const pickup = ref('')
const destination = ref('')
const originalMessage = ref('')
const businessPhone = siteConfig.whatsappNumber.replace(/\D/g, '')
let trigger: HTMLElement | null = null
let previousOverflow = ''

const clean = (value: string) => value.replace(/\s+/g, ' ').trim()
const ready = computed(() => clean(pickup.value).length > 1 && clean(destination.value).length > 1)
const messageHref = computed(() => buildWhatsappLeadUrl({
  phone: businessPhone,
  message: originalMessage.value,
  pickup: pickup.value,
  destination: destination.value,
  pagePath: route.path,
}))

const restorePage = () => {
  document.body.style.overflow = previousOverflow
  trigger?.focus({ preventScroll: true })
  trigger = null
  pickup.value = ''
  destination.value = ''
}
const close = () => dialog.value?.close()

// Capture business WhatsApp links once so every public CTA uses the same flow.
const interceptWhatsapp = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  if (!(event.target instanceof Element)) return
  const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor || dialog.value?.contains(anchor)) return
  const url = new URL(anchor.href, window.location.href)
  const phone = url.hostname === 'wa.me'
    ? url.pathname.replace(/\D/g, '')
    : ['api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)
      ? (url.searchParams.get('phone') || '').replace(/\D/g, '') : ''
  if (phone !== businessPhone || !dialog.value) return
  event.preventDefault()
  trigger = anchor
  originalMessage.value = url.searchParams.get('text') || ''
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
  nextTick(() => pickupInput.value?.focus())
  trackMarketingEvent('whatsapp_lead_opened', { page_path: route.path })
}

const continueToWhatsapp = () => {
  if (!ready.value) return
  // Track the handoff only; route details never enter analytics or browser storage.
  trackMarketingEvent('whatsapp_lead_handoff', { page_path: route.path })
  window.open(messageHref.value, '_blank', 'noopener,noreferrer')
  close()
}
const dismissBackdrop = (event: MouseEvent) => {
  if (event.target !== dialog.value) return
  const bounds = dialog.value.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close()
}

onMounted(() => document.addEventListener('click', interceptWhatsapp, true))
onBeforeUnmount(() => {
  document.removeEventListener('click', interceptWhatsapp, true)
  if (dialog.value?.open) restorePage()
})
watch(() => route.fullPath, close)
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="whatsapp-lead" aria-labelledby="whatsapp-lead-title" aria-describedby="whatsapp-lead-description" @close="restorePage" @click="dismissBackdrop">
      <button class="whatsapp-lead__close" type="button" aria-label="Close trip details" title="Close" @click="close">
        <i class="fa-solid fa-xmark" aria-hidden="true" />
      </button>
      <span class="whatsapp-lead__eyebrow">Your private journey</span>
      <h2 id="whatsapp-lead-title">Where are we taking you?</h2>
      <p id="whatsapp-lead-description">Share your route for a personal quote.</p>
      <form @submit.prevent="continueToWhatsapp">
        <label for="whatsapp-pickup">Pickup location</label>
        <input id="whatsapp-pickup" ref="pickupInput" v-model="pickup" name="pickup" type="text" placeholder="Airport, hotel or address" required minlength="2" maxlength="180" autocomplete="off" enterkeyhint="next">
        <label for="whatsapp-destination">Destination</label>
        <input id="whatsapp-destination" v-model="destination" name="destination" type="text" placeholder="Where would you like to go?" required minlength="2" maxlength="180" autocomplete="off" enterkeyhint="go">
        <button class="whatsapp-lead__submit" type="submit" :disabled="!ready">
          <i class="fa-brands fa-whatsapp" aria-hidden="true" />
          Continue to WhatsApp
          <i class="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
      </form>
      <p class="whatsapp-lead__privacy">Your route is added to a message you can review and send in WhatsApp. <NuxtLink to="/privacy-policy" @click="close">Privacy</NuxtLink></p>
    </dialog>
  </Teleport>
</template>

<style scoped>
.whatsapp-lead { box-sizing: border-box; width: min(460px, calc(100% - 32px)); max-height: calc(100dvh - 32px); margin: auto; padding: 32px; overflow-y: auto; color: #f6f6f6; background: #151515; border: 1px solid #625334; border-radius: 8px; box-shadow: 0 24px 80px #0008; font-family: 'Inter', sans-serif; }
.whatsapp-lead::backdrop { background: #000a; backdrop-filter: blur(5px); }
.whatsapp-lead__close { position: absolute; top: 8px; right: 8px; width: 44px; height: 44px; border: 0; background: transparent; color: #eee; cursor: pointer; }
.whatsapp-lead__eyebrow { display: block; margin-bottom: 12px; color: #edcf80; font-size: 12px; }
.whatsapp-lead h2 { margin: 0; padding-right: 12px; font-size: 26px; font-weight: 300; line-height: 1.2; letter-spacing: 0; }
.whatsapp-lead p { font-size: 14px; line-height: 1.6; color: #c9c9c9; }
.whatsapp-lead form { display: grid; gap: 8px; margin-top: 24px; }
.whatsapp-lead label { font-size: 13px; }
.whatsapp-lead input { box-sizing: border-box; width: 100%; min-height: 52px; padding: 12px 14px; margin-bottom: 12px; border: 1px solid #686868; border-radius: 4px; color: #fff; background: #222; font: inherit; font-size: 16px; }
.whatsapp-lead input::placeholder { color: #b8b8b8; }
.whatsapp-lead__submit { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 52px; margin-top: 4px; padding: 12px; border: 1px solid #e5c36c; border-radius: 4px; background: #e5c36c; color: #111; font: inherit; font-size: 14px; cursor: pointer; transition: background 0.18s ease; }
.whatsapp-lead__submit:hover:not(:disabled) { background: #f3d998; }
.whatsapp-lead__submit:disabled { opacity: 0.45; cursor: not-allowed; }
.whatsapp-lead :focus-visible { outline: 2px solid #edcf80; outline-offset: 3px; }
.whatsapp-lead .whatsapp-lead__privacy { margin: 18px 0 0; font-size: 12px; }
.whatsapp-lead__privacy a { color: #edcf80; text-underline-offset: 3px; }
@media (max-width: 600px) {
  .whatsapp-lead { width: 100%; max-width: none; max-height: calc(100dvh - 16px); margin: auto 0 0; padding: 28px 22px max(24px, env(safe-area-inset-bottom)); border-radius: 8px 8px 0 0; }
}
</style>

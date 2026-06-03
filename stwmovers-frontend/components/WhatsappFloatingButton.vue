<script setup lang="ts">
import { buildWhatsappUrl } from '~/utils/whatsapp'

const appConfig = useAppConfig()
const href = computed(() =>
  buildWhatsappUrl({
    phone: appConfig.whatsappNumber,
    text: appConfig.whatsappDefaultMessage,
  }),
)
</script>

<template>
  <a
    class="wa-float"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
  >
    <span class="sr-only">WhatsApp</span>
    <i class="fa-brands fa-whatsapp" aria-hidden="true" style="font-size: 1.45rem; color: #25d366" />
  </a>
</template>


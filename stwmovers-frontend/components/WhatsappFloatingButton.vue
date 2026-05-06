<script setup lang="ts">
import { buildWhatsappUrl } from '~/utils/whatsapp'

const config = useRuntimeConfig()
const href = computed(() =>
  buildWhatsappUrl({
    phone: config.public.whatsappNumber,
    text: config.public.whatsappDefaultMessage,
  }),
)
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    style="
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: 56px;
      height: 56px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      box-shadow: 0 20px 55px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.12);
      z-index: 50;
    "
  >
    <span class="sr-only">WhatsApp</span>
    <svg aria-hidden="true" viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
      <path
        d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.54 1.75 6.52L3 29l6.7-1.74A12.9 12.9 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Zm0 23.6c-2.03 0-4-.55-5.7-1.58l-.41-.24-3.98 1.04 1.06-3.88-.27-.44A10.58 10.58 0 0 1 5.4 16C5.4 10.15 10.15 5.4 16 5.4S26.6 10.15 26.6 16 21.85 26.6 16 26.6Zm6.16-7.93c-.33-.16-1.96-.97-2.26-1.08-.3-.11-.52-.16-.74.16-.22.33-.85 1.08-1.04 1.3-.19.22-.38.25-.71.08-.33-.16-1.39-.51-2.64-1.63-.98-.87-1.64-1.94-1.83-2.27-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.26-.62-.52-.54-.74-.55h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.71 0 1.6 1.17 3.15 1.33 3.37.16.22 2.31 3.53 5.6 4.95.78.34 1.39.54 1.87.69.79.25 1.51.22 2.08.13.63-.09 1.96-.8 2.24-1.57.28-.77.28-1.43.19-1.57-.08-.14-.3-.22-.63-.38Z"
      />
    </svg>
  </a>
</template>


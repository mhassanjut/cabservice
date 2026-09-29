<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <WhatsappLeadDialog />
  </ClientOnly>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const gaId = String(config.public.googleAnalyticsId || '').trim()
const gaIdSafe = /^G-[A-Z0-9]+$/.test(gaId) ? gaId : ''

if (gaIdSafe) {
  useHead({
    link: [
      { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
      { rel: 'preconnect', href: 'https://www.google-analytics.com' },
    ],
    script: [
      {
        key: 'gtag-init',
        innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaIdSafe}', { send_page_view: true });`,
      },
      {
        key: 'gtag-js',
        src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaIdSafe)}`,
        async: true,
      },
    ],
  })
}
</script>

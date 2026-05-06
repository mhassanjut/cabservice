<script setup lang="ts">
import { externalLinks } from '~/constants/externalLinks'
</script>

<template>
  <div>
    <header class="container" style="padding: 18px 16px 10px;">
      <div
        class="card"
        style="padding: 14px 14px; display:flex; align-items:center; justify-content:space-between; gap:12px;"
      >
        <NuxtLink to="/" style="display:flex; align-items:center; gap:10px;">
          <span
            aria-hidden="true"
            style="width:34px; height:34px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; background:rgba(11,95,255,.18); border:1px solid rgba(11,95,255,.25);"
            >STW</span
          >
          <div style="display:flex; flex-direction:column; line-height:1.1;">
            <strong>STW Movers</strong>
            <span style="font-size:12px; color: var(--muted);">Barcelona • Spain</span>
          </div>
        </NuxtLink>

        <nav aria-label="Primary" style="display:flex; align-items:center; gap:10px;">
          <NuxtLink class="pill" to="/cars">View cars</NuxtLink>
          <a class="pill" :href="externalLinks.tourCta" rel="noopener noreferrer" target="_blank">
            Do you want a tour?
          </a>
        </nav>
      </div>
    </header>

    <main class="container" style="padding: 10px 16px 70px;">
      <slot />
    </main>

    <footer class="container" style="padding: 0 16px 24px;">
      <div class="card" style="padding: 16px;">
        <div class="grid cols-2" style="align-items:start;">
          <div>
            <strong>STW Movers</strong>
            <div style="color: var(--muted); margin-top: 6px;">
              Airport transfers, city transfers, and on-demand cab booking across Barcelona and Spain.
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; flex-wrap:wrap;">
            <NuxtLink class="pill" to="/">Home</NuxtLink>
            <NuxtLink class="pill" to="/cars">Cars</NuxtLink>
            <NuxtLink class="pill" to="/confirm">Confirm</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <WhatsappFloatingButton />
  </div>
</template>


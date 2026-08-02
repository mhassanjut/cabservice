<script setup lang="ts">
import { homeExperienceTiles } from '~/data/homeContent'

const line1Ref = ref<HTMLElement | null>(null)
const line2Ref = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

const marqueeTiles = computed(() => [...homeExperienceTiles, ...homeExperienceTiles])

let headingResizeObserver: ResizeObserver | null = null
let marqueeAnim: Animation | null = null
let rateRaf = 0

const RATE_EASE_MS = 650

function syncHeadingLine2Width() {
  const line1 = line1Ref.value
  const line2 = line2Ref.value
  if (!line1 || !line2) return

  if (window.matchMedia('(max-width: 767px)').matches) {
    line2.style.width = ''
    return
  }

  line2.style.width = `${line1.getBoundingClientRect().width}px`
}

function easeMarquee(targetRate: number) {
  if (!marqueeAnim) return
  cancelAnimationFrame(rateRaf)

  const start = performance.now()
  const from = marqueeAnim.playbackRate

  const tick = (now: number) => {
    if (!marqueeAnim) return
    const t = Math.min(1, (now - start) / RATE_EASE_MS)
    const eased = targetRate < from ? 1 - (1 - t) * (1 - t) : t * t
    marqueeAnim.playbackRate = from + (targetRate - from) * eased
    if (t < 1) rateRaf = requestAnimationFrame(tick)
  }

  rateRaf = requestAnimationFrame(tick)
}

function bindMarqueeAnimation() {
  const el = trackRef.value
  if (!el) return
  marqueeAnim =
    el.getAnimations().find((a: Animation) => (a as CSSAnimation).animationName === 'home-experience-marquee') ??
    null
}

onMounted(() => {
  nextTick(() => {
    syncHeadingLine2Width()
    headingResizeObserver = new ResizeObserver(syncHeadingLine2Width)
    if (line1Ref.value) headingResizeObserver.observe(line1Ref.value)
    window.addEventListener('resize', syncHeadingLine2Width, { passive: true })
    document.fonts?.ready.then(syncHeadingLine2Width)
    bindMarqueeAnimation()
  })
})

onUnmounted(() => {
  cancelAnimationFrame(rateRaf)
  marqueeAnim = null
  headingResizeObserver?.disconnect()
  window.removeEventListener('resize', syncHeadingLine2Width)
})
</script>

<template>
  <section id="experience" class="home-section home-experience" aria-labelledby="experience-heading">
    <div class="container">
      <div class="home-experience__inner">
        <div class="home-experience__header">
          <div class="home-experience__header-copy">
            <h2 id="experience-heading" class="home-experience__heading">
              <span ref="line1Ref" class="home-experience__heading-line1">From Arrival To Destination, Every</span>
              <span ref="line2Ref" class="home-experience__heading-line2">Detail Is Taken Care Of.</span>
            </h2>
            <p class="home-experience__lead">
              Whether you're arriving for business, celebrating a special occasion, or discovering a new city, your
              journey is handled with professionalism, discretion, and genuine hospitality from start to finish.
            </p>
          </div>
        </div>
        <div
          class="home-experience__carousel-viewport"
          role="region"
          aria-label="Experience services"
          @pointerenter="easeMarquee(0)"
          @pointerleave="easeMarquee(1)"
        >
          <div ref="trackRef" class="home-experience__marquee-track">
            <template v-for="(tile, index) in marqueeTiles" :key="`${tile.title}-${index}`">
              <NuxtLink
                v-if="index < homeExperienceTiles.length"
                :to="tile.href"
                class="home-experience__tile home-experience__tile--link"
                :style="{ '--tile-height': `${tile.height}px` }"
                :aria-label="`${index + 1} of ${homeExperienceTiles.length}: ${tile.title}`"
              >
                <!-- Bundled (?url) asset — keep as <img>; @nuxt/image IPX can't process build-asset URLs -->
                <img
                  :src="tile.image"
                  :alt="`${tile.title} — STW Movers Barcelona chauffeur service`"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  width="628"
                  :height="tile.height"
                />
                <div class="home-experience__tile-overlay" aria-hidden="true" />
                <div class="home-experience__tile-copy">
                  <h3>{{ tile.title }}</h3>
                  <p>{{ tile.subtitle }}</p>
                </div>
              </NuxtLink>
              <div
                v-else
                class="home-experience__tile"
                :style="{ '--tile-height': `${tile.height}px` }"
                aria-hidden="true"
              >
                <img
                  :src="tile.image"
                  :alt="`${tile.title} — STW Movers Barcelona chauffeur service`"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  width="628"
                  :height="tile.height"
                />
                <div class="home-experience__tile-overlay" aria-hidden="true" />
                <div class="home-experience__tile-copy">
                  <h3>{{ tile.title }}</h3>
                  <p>{{ tile.subtitle }}</p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

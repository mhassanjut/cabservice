<script setup lang="ts">
import { homeExperienceTiles } from '~/data/homeContent'

const AUTOPLAY_SPEED = 1
const RESUME_DELAY_MS = 2000

const trackRef = ref<HTMLElement | null>(null)
const line1Ref = ref<HTMLElement | null>(null)
const line2Ref = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const isHovered = ref(false)
const isAutoplayActive = ref(false)
const dragStartX = ref(0)
const dragStartScroll = ref(0)

const loopTiles = computed(() =>
  [...homeExperienceTiles, ...homeExperienceTiles].map((tile, index) => ({
    ...tile,
    loopKey: `${tile.title}-${index}`,
  })),
)

let animationFrameId = 0
let resumeTimeoutId = 0
let headingResizeObserver: ResizeObserver | null = null

function syncHeadingLine2Width() {
  const line1 = line1Ref.value
  const line2 = line2Ref.value
  if (!line1 || !line2) return

  line2.style.width = `${line1.getBoundingClientRect().width}px`
}

function getLoopSetWidth(track: HTMLElement) {
  return track.scrollWidth / 2
}

function canScroll(track: HTMLElement) {
  return track.scrollWidth > track.clientWidth + 1
}

function normalizeScrollPosition() {
  const track = trackRef.value
  if (!track) return

  const setWidth = getLoopSetWidth(track)
  if (setWidth <= 0) return

  while (track.scrollLeft >= setWidth) {
    track.scrollLeft -= setWidth
  }

  while (track.scrollLeft < 0) {
    track.scrollLeft += setWidth
  }
}

function tickAutoplay() {
  const track = trackRef.value

  if (track && isAutoplayActive.value && !isDragging.value && !isHovered.value && canScroll(track)) {
    track.scrollLeft += AUTOPLAY_SPEED
    normalizeScrollPosition()
  }

  animationFrameId = requestAnimationFrame(tickAutoplay)
}

function startAutoplay() {
  isAutoplayActive.value = true
}

function pauseAutoplay() {
  isAutoplayActive.value = false
}

function clearResumeTimeout() {
  if (resumeTimeoutId) {
    clearTimeout(resumeTimeoutId)
    resumeTimeoutId = 0
  }
}

function scheduleAutoplayResume() {
  clearResumeTimeout()
  resumeTimeoutId = window.setTimeout(() => {
    if (!isHovered.value && !isDragging.value) {
      startAutoplay()
    }
  }, RESUME_DELAY_MS)
}

function waitForScrollableTrack(startLoop: () => void, attempts = 0) {
  const track = trackRef.value
  if (track && canScroll(track)) {
    track.scrollLeft = 0
    startLoop()
    return
  }

  if (attempts > 120) return

  requestAnimationFrame(() => waitForScrollableTrack(startLoop, attempts + 1))
}

function onPointerDown(event: PointerEvent) {
  const track = trackRef.value
  if (!track || event.button !== 0) return

  pauseAutoplay()
  clearResumeTimeout()
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartScroll.value = track.scrollLeft
  track.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  const track = trackRef.value
  if (!track || !isDragging.value) return

  event.preventDefault()
  track.scrollLeft = dragStartScroll.value - (event.clientX - dragStartX.value)
  normalizeScrollPosition()
}

function endDrag(event: PointerEvent) {
  const track = trackRef.value
  if (!track || !isDragging.value) return

  isDragging.value = false
  if (track.hasPointerCapture(event.pointerId)) {
    track.releasePointerCapture(event.pointerId)
  }

  normalizeScrollPosition()
  scheduleAutoplayResume()
}

function onMouseEnter() {
  isHovered.value = true
  pauseAutoplay()
  clearResumeTimeout()
}

function onMouseLeave() {
  isHovered.value = false
  scheduleAutoplayResume()
}

onMounted(() => {
  nextTick(() => {
    syncHeadingLine2Width()
    headingResizeObserver = new ResizeObserver(syncHeadingLine2Width)
    if (line1Ref.value) headingResizeObserver.observe(line1Ref.value)
    window.addEventListener('resize', syncHeadingLine2Width, { passive: true })
    document.fonts?.ready.then(syncHeadingLine2Width)

    waitForScrollableTrack(() => {
      startAutoplay()
      animationFrameId = requestAnimationFrame(tickAutoplay)
    })
  })
})

onUnmounted(() => {
  headingResizeObserver?.disconnect()
  window.removeEventListener('resize', syncHeadingLine2Width)
  pauseAutoplay()
  clearResumeTimeout()
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <section id="experience" class="home-section home-experience" aria-labelledby="experience-heading">
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
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <div
          ref="trackRef"
          class="home-experience__carousel"
          :class="{
            'is-dragging': isDragging,
            'is-autoplaying': isAutoplayActive && !isHovered && !isDragging,
          }"
          role="region"
          aria-roledescription="carousel"
          aria-label="Experience services"
          tabindex="0"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="endDrag"
          @pointercancel="endDrag"
        >
          <article
            v-for="(tile, index) in loopTiles"
            :key="tile.loopKey"
            class="home-experience__tile"
            :style="{ '--tile-height': `${tile.height}px` }"
            role="group"
            :aria-hidden="index >= homeExperienceTiles.length ? 'true' : undefined"
            :aria-label="`${(index % homeExperienceTiles.length) + 1} of ${homeExperienceTiles.length}: ${tile.title}`"
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
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

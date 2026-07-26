<script setup lang="ts">
import type { TourDto } from '~/types/api'
import { formatTourDuration, formatTourGuests, formatTourMeta, formatTourPrice } from '~/utils/tourFormat'
import { siteConfig } from '~/config/site'
import { buildWhatsappUrl } from '~/utils/whatsapp'
import closeBtnUrl from '~/assets/images/tour-page/modal-icons/close-btn.svg?url'
import clockUrl from '~/assets/images/tour-page/modal-icons/clock.svg?url'
import clockWhiteUrl from '~/assets/images/tour-page/modal-icons/clock-white.svg?url'
import usersUrl from '~/assets/images/tour-page/modal-icons/users.svg?url'
import checkYellowUrl from '~/assets/images/tour-page/modal-icons/check-circle-yellow.svg?url'
import checkGreenUrl from '~/assets/images/tour-page/modal-icons/check-circle-green.svg?url'
import circleXUrl from '~/assets/images/tour-page/modal-icons/circle-x.svg?url'
import nodeUrl from '~/assets/images/tour-page/modal-icons/node.svg?url'

const props = defineProps<{ tour: TourDto }>()
const emit = defineEmits<{ close: [] }>()

const metaLine = computed(() => formatTourMeta(props.tour))
const durationTag = computed(() => formatTourDuration(props.tour))
const guestsTag = computed(() => formatTourGuests(props.tour))

type DayGroup = { dayNumber: number; items: { time?: string; activity: string }[] }

const dayGroups = computed<DayGroup[]>(() => {
  const map = new Map<number, DayGroup>()
  for (const item of props.tour.itinerary || []) {
    const dayNumber = item.dayNumber ?? 1
    if (!map.has(dayNumber)) map.set(dayNumber, { dayNumber, items: [] })
    map.get(dayNumber)!.items.push({ time: item.time, activity: item.activity })
  }
  return [...map.values()].sort((a, b) => a.dayNumber - b.dayNumber)
})

const activeDay = ref(dayGroups.value[0]?.dayNumber ?? 1)
watch(
  dayGroups,
  (groups: DayGroup[]) => {
    if (!groups.some((g: DayGroup) => g.dayNumber === activeDay.value)) {
      activeDay.value = groups[0]?.dayNumber ?? 1
    }
  },
  { immediate: true },
)

const activeDayItems = computed(
  () => dayGroups.value.find((g: DayGroup) => g.dayNumber === activeDay.value)?.items ?? [],
)

const proceedLink = computed(() =>
  buildWhatsappUrl({
    phone: siteConfig.whatsappNumber,
    text: `Hello STW Movers, I would like to book the "${props.tour.title}" private tour. Could you share availability?`,
  }),
)

const close = () => emit('close')

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

const lockScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
}

const unlockScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

onMounted(() => {
  lockScroll()
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  unlockScroll()
})
</script>

<template>
  <div class="tdm-overlay" @mousedown.self="close">
    <div class="tdm-panel" role="dialog" aria-modal="true" :aria-label="tour.title">
      <div class="tdm-hero">
        <TourImage
          :src="tour.imageUrl"
          :alt="tour.title"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        <div class="tdm-hero__overlay" aria-hidden="true" />

        <button type="button" class="tdm-close" aria-label="Close" @click="close">
          <img :src="closeBtnUrl" alt="" width="36" height="36" />
        </button>

        <div class="tdm-hero__caption">
          <div class="tdm-hero__caption-inner">
            <div class="tdm-hero__caption-text">
              <h2 class="tdm-hero__title">{{ tour.title }}</h2>
              <p v-if="metaLine" class="tdm-hero__meta">{{ metaLine }}</p>
            </div>

            <div v-if="durationTag || guestsTag" class="tdm-hero__tags">
              <span v-if="durationTag" class="tdm-pill">
                <img :src="clockUrl" alt="" width="14" height="14" />
                {{ durationTag }}
              </span>
              <span v-if="guestsTag" class="tdm-pill">
                <img :src="usersUrl" alt="" width="14" height="14" />
                {{ guestsTag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="tdm-body">
        <section v-if="tour.aboutDescription" class="tdm-section">
          <h2 class="tdm-section__title">About This Experience</h2>
          <p class="tdm-about">{{ tour.aboutDescription }}</p>
        </section>

        <section v-if="tour.highlights?.length" class="tdm-section">
          <h2 class="tdm-section__title">Tour Highlights</h2>
          <ul class="tdm-highlights">
            <li v-for="(highlight, index) in tour.highlights" :key="`highlight-${index}`">
              <img :src="checkYellowUrl" alt="" width="20" height="20" />
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </section>

        <section v-if="dayGroups.length" class="tdm-section">
          <div class="tdm-plan__head">
            <h2 class="tdm-section__title">Tour Plan Preview</h2>
            <div class="tdm-day-tabs">
              <button
                v-for="group in dayGroups"
                :key="group.dayNumber"
                type="button"
                class="tdm-day-tab"
                :class="{ 'tdm-day-tab--active': group.dayNumber === activeDay }"
                @click="activeDay = group.dayNumber"
              >
                <img
                  :src="group.dayNumber === activeDay ? clockWhiteUrl : clockUrl"
                  alt=""
                  width="16"
                  height="16"
                />
                Day {{ String(group.dayNumber).padStart(2, '0') }}
              </button>
            </div>
          </div>

          <ol class="tdm-timeline">
            <li v-for="(item, index) in activeDayItems" :key="`item-${activeDay}-${index}`">
              <div class="tdm-timeline__rail" aria-hidden="true">
                <span class="tdm-timeline__node">
                  <img :src="nodeUrl" alt="" width="20" height="20" />
                </span>
                <span v-if="index < activeDayItems.length - 1" class="tdm-timeline__connector" />
              </div>
              <div class="tdm-timeline__content">
                <span v-if="item.time" class="tdm-timeline__time">{{ item.time }}</span>
                <span class="tdm-timeline__activity">{{ item.activity }}</span>
              </div>
            </li>
          </ol>
        </section>

        <section v-if="tour.included?.length || tour.excluded?.length" class="tdm-section tdm-section--split">
          <div v-if="tour.included?.length" class="tdm-list-card">
            <h3 class="tdm-list-card__title">Included</h3>
            <ul>
              <li v-for="(entry, index) in tour.included" :key="`included-${index}`">
                <img :src="checkGreenUrl" alt="" width="16" height="16" />
                <span>{{ entry }}</span>
              </li>
            </ul>
          </div>
          <div v-if="tour.excluded?.length" class="tdm-list-card">
            <h3 class="tdm-list-card__title">Not Included</h3>
            <ul>
              <li v-for="(entry, index) in tour.excluded" :key="`excluded-${index}`">
                <img :src="circleXUrl" alt="" width="16" height="16" />
                <span>{{ entry }}</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div class="tdm-footer">
        <div class="tdm-footer__price">
          <span class="tdm-footer__label">Starting From</span>
          <span class="tdm-footer__value">{{ formatTourPrice(tour.startingPrice) }}</span>
        </div>
        <a class="tdm-footer__cta" :href="proceedLink" rel="noopener noreferrer" target="_blank">
          Proceed with This Tour
        </a>
      </div>
    </div>
  </div>
</template>

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

const activeDay = ref(0)
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

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="tdm-overlay" @mousedown.self="close">
    <div class="tdm-panel" role="dialog" aria-modal="true" :aria-label="tour.title">
      <div class="tdm-media">
        <TourImage :src="tour.imageUrl" :alt="tour.title" />
        <div class="tdm-media__overlay" />

        <button type="button" class="tdm-close" aria-label="Close" @click="close">
          <img :src="closeBtnUrl" alt="" />
        </button>

        <div class="tdm-media__caption">
          <div class="tdm-media__caption-inner">
            <div class="tdm-media__caption-text">
              <h2 class="tdm-media__title">{{ tour.title }}</h2>
              <p v-if="metaLine" class="tdm-media__meta">{{ metaLine }}</p>
            </div>

            <div v-if="durationTag || guestsTag" class="tdm-media__tags">
              <span v-if="durationTag" class="tdm-pill">
                <img :src="clockUrl" alt="" />
                {{ durationTag }}
              </span>
              <span v-if="guestsTag" class="tdm-pill">
                <img :src="usersUrl" alt="" />
                {{ guestsTag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="tdm-body">
        <section v-if="tour.aboutDescription" class="tdm-section">
          <h3 class="tdm-section__title">About This Experience</h3>
          <p class="tdm-about">{{ tour.aboutDescription }}</p>
        </section>

        <section v-if="tour.highlights?.length" class="tdm-section">
          <h3 class="tdm-section__title">Tour Highlights</h3>
          <ul class="tdm-highlights">
            <li v-for="(highlight, index) in tour.highlights" :key="`highlight-${index}`">
              <img :src="checkYellowUrl" alt="" />
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </section>

        <section v-if="dayGroups.length" class="tdm-section">
          <div class="tdm-plan__head">
            <h3 class="tdm-section__title">Tour Plan Preview</h3>
            <div v-if="dayGroups.length > 1" class="tdm-day-tabs">
              <button
                v-for="group in dayGroups"
                :key="group.dayNumber"
                type="button"
                class="tdm-day-tab"
                :class="{ 'tdm-day-tab--active': group.dayNumber === activeDay }"
                @click="activeDay = group.dayNumber"
              >
                <img :src="group.dayNumber === activeDay ? clockWhiteUrl : clockUrl" alt="" />
                Day {{ String(group.dayNumber).padStart(2, '0') }}
              </button>
            </div>
            <span v-else class="tdm-day-tab tdm-day-tab--active tdm-day-tab--static">
              <img :src="clockWhiteUrl" alt="" />
              Day 01
            </span>
          </div>

          <ol class="tdm-timeline">
            <li v-for="(item, index) in activeDayItems" :key="`item-${activeDay}-${index}`">
              <span class="tdm-timeline__marker">
                <img :src="nodeUrl" alt="" />
              </span>
              <span v-if="item.time" class="tdm-timeline__time">{{ item.time }}</span>
              <span class="tdm-timeline__activity">{{ item.activity }}</span>
            </li>
          </ol>
        </section>

        <section v-if="tour.included?.length || tour.excluded?.length" class="tdm-section tdm-section--split">
          <div v-if="tour.included?.length" class="tdm-list-card">
            <h4 class="tdm-list-card__title">Included</h4>
            <ul>
              <li v-for="(entry, index) in tour.included" :key="`included-${index}`">
                <img :src="checkGreenUrl" alt="" />
                <span>{{ entry }}</span>
              </li>
            </ul>
          </div>
          <div v-if="tour.excluded?.length" class="tdm-list-card">
            <h4 class="tdm-list-card__title">Not Included</h4>
            <ul>
              <li v-for="(entry, index) in tour.excluded" :key="`excluded-${index}`">
                <img :src="circleXUrl" alt="" />
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
          Proceed With This Tour
        </a>
      </div>
    </div>
  </div>
</template>

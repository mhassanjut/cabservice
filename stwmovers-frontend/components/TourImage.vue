<script setup lang="ts">
import { TOUR_IMAGE_PLACEHOLDER, isSvgTourImageUrl, resolveTourImageUrl } from '~/utils/tourImage'

const props = defineProps<{
  src?: string | null
  alt: string
}>()

const displaySrc = ref(resolveTourImageUrl(props.src))

const isSvg = computed(() => isSvgTourImageUrl(props.src) || isSvgTourImageUrl(displaySrc.value))

watch(
  () => props.src,
  (value: string | null | undefined) => {
    displaySrc.value = resolveTourImageUrl(value)
  },
)

const onError = () => {
  if (displaySrc.value !== TOUR_IMAGE_PLACEHOLDER) {
    displaySrc.value = TOUR_IMAGE_PLACEHOLDER
  }
}
</script>

<template>
  <img
    :src="displaySrc"
    :alt="alt"
    loading="lazy"
    :class="{ 'tour-image--svg': isSvg }"
    v-bind="$attrs"
    @error="onError"
  />
</template>

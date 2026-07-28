<script setup lang="ts">
import { TOUR_IMAGE_PLACEHOLDER, isSvgTourImageUrl, resolveTourImageUrl } from '~/utils/tourImage'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt: string
    width?: number
    height?: number
    sizes?: string
    loading?: 'lazy' | 'eager'
    fetchpriority?: 'high' | 'low' | 'auto'
    preload?: boolean
  }>(),
  {
    width: 900,
    height: 600,
    sizes: 'xs:100vw sm:100vw md:50vw lg:50vw xl:50vw',
    loading: 'lazy',
    fetchpriority: 'auto',
    preload: false,
  },
)

const attrs = useAttrs()

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
  <NuxtImg
    v-if="!isSvg"
    :src="displaySrc"
    :alt="alt"
    preset="card"
    :width="width"
    :height="height"
    :sizes="sizes"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :preload="preload"
    fit="cover"
    decoding="async"
    v-bind="attrs"
    @error="onError"
  />
  <img
    v-else
    :src="displaySrc"
    :alt="alt"
    :loading="loading"
    decoding="async"
    class="tour-image--svg"
    v-bind="attrs"
    @error="onError"
  />
</template>

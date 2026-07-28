<script setup lang="ts">
import { VEHICLE_IMAGE_PLACEHOLDER } from '~/types/booking'
import { isSvgImageUrl, resolveVehicleImageUrl } from '~/utils/vehicleImage'

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
  }>(),
  {
    width: 800,
    height: 500,
    sizes: 'xs:100vw sm:90vw md:400px lg:400px xl:400px',
    loading: 'lazy',
    fetchpriority: 'auto',
  },
)

const attrs = useAttrs()

const displaySrc = ref(resolveVehicleImageUrl(props.src))

const isSvg = computed(() => isSvgImageUrl(props.src) || isSvgImageUrl(displaySrc.value))

watch(
  () => props.src,
  (value: string | null | undefined) => {
    displaySrc.value = resolveVehicleImageUrl(value)
  },
)

const onError = () => {
  if (displaySrc.value !== VEHICLE_IMAGE_PLACEHOLDER) {
    displaySrc.value = VEHICLE_IMAGE_PLACEHOLDER
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
    fit="contain"
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
    class="fleet-vehicle-image--svg"
    v-bind="attrs"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { VEHICLE_IMAGE_PLACEHOLDER } from '~/types/booking'
import { isSvgImageUrl, resolveVehicleImageUrl } from '~/utils/vehicleImage'

const props = defineProps<{
  src?: string | null
  alt: string
}>()

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
  <img
    :src="displaySrc"
    :alt="alt"
    loading="lazy"
    :class="{ 'fleet-vehicle-image--svg': isSvg }"
    v-bind="$attrs"
    @error="onError"
  />
</template>

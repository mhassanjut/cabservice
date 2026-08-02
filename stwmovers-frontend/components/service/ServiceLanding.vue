<script setup lang="ts">
import type { ServiceLandingPageId } from '~/data/serviceLandingPages'
import { serviceLandingPages } from '~/data/serviceLandingPages'

const props = defineProps<{ pageId: ServiceLandingPageId }>()

const page = serviceLandingPages[props.pageId]
</script>

<template>
  <div class="home-page services-page">
    <ServiceLandingHero :page="page" />
    <ServicesSplit :section="page.section" />
    <ServicesWhyChoose />
    <ServicesFinalCta />
  </div>
</template>

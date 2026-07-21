<script setup lang="ts">
import { homeFleetTabs } from '~/data/homeContent'
import { vehicles } from '~/data/vehicles'
import FleetVehicleImage from '~/components/FleetVehicleImage.vue'

type FleetTabId = (typeof homeFleetTabs)[number]['id']

const activeTab = ref<FleetTabId>('all')

const filtered = computed(() => {
  if (activeTab.value === 'all') return vehicles
  if (activeTab.value === 'van') return vehicles.filter((v) => v.bodyType === 'van')
  if (activeTab.value === 'sedan') return vehicles.filter((v) => v.bodyType === 'sedan')
  if (activeTab.value === 'luxury') return vehicles.filter((v) => v.category === 'luxury')
  return vehicles
})
</script>

<template>
  <section id="fleet" class="home-section" aria-labelledby="fleet-heading">
    <h2 id="fleet-heading" class="home-display home-display--lg" style="margin: 0 0 1rem">
      Travel In Exceptional Comfort.
    </h2>
    <p class="home-lead home-lead--sm" style="margin: 0 0 3rem">
      A carefully selected fleet of luxury sedans, executive SUVs, and spacious vans—maintained to the highest
      standards for every journey.
    </p>
    <div class="home-fleet__header">
      <div class="home-fleet__tabs" role="tablist" aria-label="Filter fleet">
      <button
        v-for="tab in homeFleetTabs"
        :key="tab.id"
        type="button"
        class="home-fleet__tab"
        :class="{ 'is-active': activeTab === tab.id }"
        role="tab"
        :aria-selected="activeTab === tab.id"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
      </div>
      <div class="home-fleet__nav" aria-hidden="true">
        <button type="button" class="home-fleet__nav-btn" tabindex="-1">
          <span class="home-icon-wrap" style="width: 1.075rem; height: 1.075rem">
            <img class="home-icon" src="/img/home/icons/arrow-back.svg" alt="" width="17" height="17" />
          </span>
        </button>
        <button type="button" class="home-fleet__nav-btn" tabindex="-1">
          <span class="home-icon-wrap" style="width: 1.075rem; height: 1.075rem">
            <img class="home-icon" src="/img/home/icons/arrow-forward.svg" alt="" width="17" height="17" />
          </span>
        </button>
      </div>
    </div>
    <div class="home-fleet__carousel" role="list">
      <article v-for="vehicle in filtered" :key="vehicle.backendId" class="home-fleet__card" role="listitem">
        <FleetVehicleImage
          :src="vehicle.imagePath"
          :alt="`${vehicle.name} — executive chauffeur vehicle Barcelona`"
        />
        <div class="home-fleet__card-body">
          <h3>{{ vehicle.name }}</h3>
          <p class="home-fleet__card-meta">
            <span class="home-fleet__meta-item">
              <span class="home-icon-wrap home-fleet__meta-icon">
                <img class="home-icon" src="/img/home/icons/person.svg" alt="" width="20" height="20" />
              </span>
              {{ vehicle.seats }}
            </span>
            <span class="home-fleet__meta-item">
              <span class="home-icon-wrap home-fleet__meta-icon">
                <img class="home-icon" src="/img/home/icons/work.svg" alt="" width="17" height="17" />
              </span>
              {{ vehicle.bags }}
            </span>
            · from €{{ vehicle.priceEur }}
            <span v-if="vehicle.category === 'luxury'"> · Luxury</span>
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

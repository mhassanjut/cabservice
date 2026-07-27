<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminBookingsPage
    title="Tour bookings"
    description="Private tour bookings with vehicle and tour pricing."
    fixed-ride-type="TOUR"
    hide-ride-type-filter
  />
</template>

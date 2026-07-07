<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminBookingsPage
    title="Custom requests"
    description="Bookings where the customer selected a custom vehicle — set fare, assign driver, confirm or reject."
    :default-custom-request="true"
  />
</template>

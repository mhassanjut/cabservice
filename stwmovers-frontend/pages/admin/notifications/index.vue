<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminShell>
    <AdminSectionHead
      title="Notifications"
      description="View system notifications sent to customers and drivers."
    />
    <AdminEmptyState
      title="Notification history coming soon"
      message="The backend does not store notification logs yet. OTP and confirmation emails are sent at booking time but are not persisted for admin review."
      icon="fa-bell"
    />
  </AdminShell>
</template>

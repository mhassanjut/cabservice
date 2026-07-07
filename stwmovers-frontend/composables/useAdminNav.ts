import { routes } from '~/constants/routes'

export type AdminNavItem = {
  label: string
  description: string
  to: string
  icon: string
  group: 'main' | 'operations' | 'system'
}

export function useAdminNav() {
  const route = useRoute()

  const items: AdminNavItem[] = [
    {
      label: 'Overview',
      description: 'Dashboard metrics and recent activity',
      to: routes.adminHome,
      icon: 'fa-gauge-high',
      group: 'main',
    },
    {
      label: 'Rides',
      description: 'All customer bookings',
      to: routes.adminRides,
      icon: 'fa-route',
      group: 'main',
    },
    {
      label: 'Custom requests',
      description: 'Custom vehicle bookings',
      to: routes.adminCustomRequests,
      icon: 'fa-car-side',
      group: 'main',
    },
    {
      label: 'Drivers',
      description: 'Chauffeur roster and assignments',
      to: routes.adminDrivers,
      icon: 'fa-id-card',
      group: 'operations',
    },
    {
      label: 'Cars',
      description: 'Vehicle catalog and availability',
      to: routes.adminCars,
      icon: 'fa-van-shuttle',
      group: 'operations',
    },
    {
      label: 'Routes & pricing',
      description: 'City routes and fares',
      to: routes.adminPricing,
      icon: 'fa-map-location-dot',
      group: 'operations',
    },
    {
      label: 'Payments',
      description: 'Stripe payment monitoring',
      to: routes.adminPayments,
      icon: 'fa-credit-card',
      group: 'system',
    },
    {
      label: 'Notifications',
      description: 'Customer communication logs',
      to: routes.adminNotifications,
      icon: 'fa-bell',
      group: 'system',
    },
    {
      label: 'Settings',
      description: 'Fare rules and admin account',
      to: routes.adminSettings,
      icon: 'fa-gear',
      group: 'system',
    },
  ]

  const isActive = (path: string) => {
    if (path === routes.adminHome) return route.path === routes.adminHome
    return route.path === path || route.path.startsWith(`${path}/`)
  }

  const current = computed(() => items.find((item) => isActive(item.to)) ?? items[0])

  const groups = [
    { id: 'main' as const, title: 'Dashboard' },
    { id: 'operations' as const, title: 'Fleet & routes' },
    { id: 'system' as const, title: 'System' },
  ]

  return { items, groups, isActive, current }
}

<script setup lang="ts">
import { routes, PRIMARY_NAV_PATHS } from '~/constants/routes'
import logoUrl from '~/assets/icons/Logo.svg?url'

const auth = useAuthStore()
const route = useRoute()
const menuOpen = ref(false)
const menuToggle = ref<HTMLButtonElement>()
const drawerPanel = ref<HTMLElement>()
const scrolled = ref(false)
const isMobile = useIsMobile()
const { open: openSignIn } = useCustomerSignIn()

const hasHeroBackdrop = computed(() => {
  const heroPrefixes = ['/services/', '/locations', '/answers', '/blogs', '/landing']
  return (PRIMARY_NAV_PATHS as readonly string[]).includes(route.path)
    || heroPrefixes.some((prefix) => route.path === prefix || route.path.startsWith(prefix))
})

const isServicesActive = computed(() =>
  route.path === routes.services
  || route.path.startsWith('/services/')
  || route.path.startsWith('/locations')
  || route.path.startsWith('/answers'),
)

const isInsightsActive = computed(() => route.path === routes.blogs || route.path.startsWith('/blogs/'))
const isCompanyActive = computed(() =>
  route.path === routes.aboutUs
  || route.path === routes.contact
  || route.path === routes.faq
  || route.path.includes('policy')
  || route.path.includes('terms')
  || route.path.includes('legal')
  || route.path.includes('accessibility'),
)

const desktopMenus = [
  {
    label: 'Services', href: '/services', wide: true,
    links: [
      { label: 'Airport transfers', href: '/services/barcelona-airport-transfer' },
      { label: 'Cruise port transfers', href: '/services/barcelona-cruise-port-transfer' },
      { label: 'Private driver', href: '/services/private-driver-barcelona' },
      { label: 'Hourly chauffeur', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Executive travel', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Van & group transfers', href: routes.barcelonaVanTransferService },
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
      { label: 'Service areas', href: '/locations' },
      { label: 'Private tours', href: '/tours' },
    ],
    footer: 'View all services',
  },
  {
    label: 'Insights', href: '/blogs', wide: false,
    links: [
      { label: 'All articles', href: '/blogs' },
      { label: 'Airport transfer guide', href: '/blogs/barcelona-airport-transfer-vs-taxi' },
      { label: 'Private driver guide', href: '/blogs/private-driver-barcelona-cost-booking-use-cases' },
      { label: 'Transfer answers', href: '/answers' },
    ],
    footer: 'Explore Insights',
  },
  {
    label: 'About Us', href: '/about-us', wide: false,
    links: [
      { label: 'Our company', href: '/about-us' },
      { label: 'Contact', href: '/contact' },
      { label: 'Frequently asked questions', href: '/faq' },
      { label: 'Booking terms', href: '/terms-and-conditions' },
      { label: 'Cancellation policy', href: '/cancellation-policy' },
    ],
    footer: 'About STW Movers',
  },
]

const menuPresentation: Record<string, { title: string; description: string }> = {
  Services: { title: 'A journey for every occasion', description: 'Private transfers and chauffeur services, tailored to your plans.' },
  Insights: { title: 'Travel with a little more insight', description: 'Local knowledge for a smoother Barcelona arrival.' },
  'About Us': { title: 'The people behind your journey', description: 'Our service, your questions, and the details before you book.' },
}
const menuDetails: Record<string, [string, string]> = {
  'Airport transfers': ['fa-plane-arrival', 'BCN arrivals and departures'],
  'Cruise port transfers': ['fa-ship', 'From your terminal to your next stop'],
  'Private driver': ['fa-user-tie', 'A dedicated driver for your itinerary'],
  'Hourly chauffeur': ['fa-clock', 'Flexible time, waiting and multiple stops'],
  'Executive travel': ['fa-briefcase', 'Meetings, events and business guests'],
  'Van & group transfers': ['fa-van-shuttle', 'Space for your group and luggage'],
  'City-to-city transfers': ['fa-route', 'Direct journeys beyond Barcelona'],
  'Service areas': ['fa-location-dot', 'Explore Barcelona and coastal routes'],
  'Private tours': ['fa-compass', 'A Barcelona itinerary shaped around you'],
  'All articles': ['fa-book-open', 'Explore our Barcelona travel journal'],
  'Airport transfer guide': ['fa-plane', 'Compare your arrival options'],
  'Private driver guide': ['fa-car', 'Plan the right service for your day'],
  'Transfer answers': ['fa-circle-question', 'Helpful answers before you travel'],
  'Our company': ['fa-users', 'Discover the STW Movers approach'],
  Contact: ['fa-comments', 'Speak with our Barcelona team'],
  'Frequently asked questions': ['fa-circle-question', 'Pickup, luggage and booking guidance'],
  'Booking terms': ['fa-file-lines', 'The details of your reservation'],
  'Cancellation policy': ['fa-calendar-check', 'Know your options when plans change'],
}

const mobileMenuGroups = [
  { label: 'Main', links: [
    { label: 'Home', href: routes.home },
    { label: 'Our fleet', href: '/#fleet' },
    { label: 'Service areas', href: '/locations' },
    { label: 'Tours', href: routes.tours },
    { label: 'Contact', href: routes.contact },
  ] },
  ...desktopMenus.map((menu) => ({
    label: menu.label,
    links: [...menu.links, { label: menu.footer, href: menu.href }],
  })),
]
const openMobileGroups = reactive<Record<string, boolean>>({})
const toggleMobileGroup = (label: string) => {
  const shouldOpen = !openMobileGroups[label]
  Object.keys(openMobileGroups).forEach((key) => { openMobileGroups[key] = false })
  openMobileGroups[label] = shouldOpen
}

const desktopMenu = ref('')
let menuTimer: ReturnType<typeof setTimeout> | undefined
const openDesktopMenu = (label: string) => {
  clearTimeout(menuTimer)
  desktopMenu.value = label
}
const closeDesktopMenu = () => {
  clearTimeout(menuTimer)
  desktopMenu.value = ''
}
const scheduleMenuClose = () => {
  clearTimeout(menuTimer)
  menuTimer = setTimeout(closeDesktopMenu, 180)
}
const leaveMenuFocus = (event: FocusEvent) => {
  const container = event.currentTarget as HTMLElement
  if (!container.contains(event.relatedTarget as Node | null)) closeDesktopMenu()
}
const dismissOutsideMenu = (event: MouseEvent) => {
  if (!(event.target instanceof Element) || !event.target.closest('.app-nav__menu')) closeDesktopMenu()
}

const syncNavScroll = () => {
  if (!import.meta.client) return
  scrolled.value = hasHeroBackdrop.value ? window.scrollY > 24 : true
}

onMounted(() => {
  auth.hydrate()
  syncNavScroll()
  window.addEventListener('scroll', syncNavScroll, { passive: true })
  document.addEventListener('click', dismissOutsideMenu)
  auth.listenForAuthChanges(() => {
    if (!auth.isLoggedIn && !auth.isGuestSession) menuOpen.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', syncNavScroll)
  document.removeEventListener('click', dismissOutsideMenu)
  clearTimeout(menuTimer)
})

watch(() => route.path, () => {
  closeDesktopMenu()
  menuOpen.value = false
  nextTick(syncNavScroll)
})

watch(menuOpen, (open: boolean) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
  nextTick(() => {
    if (open) drawerPanel.value?.querySelector<HTMLButtonElement>('button')?.focus()
    else menuToggle.value?.focus({ preventScroll: true })
  })
})

const trapDrawerFocus = (event: KeyboardEvent) => {
  const panel = drawerPanel.value
  if (!panel) return
  const elements: HTMLElement[] = []
  panel.querySelectorAll('a[href], button:not(:disabled)').forEach((element: Element) => {
    if (element instanceof HTMLElement && element.getClientRects().length > 0) elements.push(element)
  })
  const first = elements[0]
  const last = elements[elements.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
}

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <header
    class="app-nav app-nav--home"
    :class="{ 'is-scrolled': scrolled }"
    role="banner"
  >
    <div
      v-if="hasHeroBackdrop && !scrolled"
      class="app-nav__scrim"
      aria-hidden="true"
    />

    <div class="app-nav__inner">
      <NuxtLink to="/" class="app-nav__brand" @click="closeMenu">
        <img
          class="app-nav__logo"
          :src="logoUrl"
          alt="STW Movers"
          width="146"
          height="40"
          decoding="async"
        >
      </NuxtLink>

      <div class="app-nav__cluster">
        <nav class="app-nav__links" aria-label="Primary">
          <template v-for="menu in desktopMenus" :key="menu.label">
          <div
            class="app-nav__menu"
            :class="{ 'is-open': desktopMenu === menu.label, 'is-active': menu.label === 'Services' ? isServicesActive : menu.label === 'Insights' ? isInsightsActive : isCompanyActive }"
            @mouseenter="openDesktopMenu(menu.label)"
            @mouseleave="scheduleMenuClose"
            @focusout="leaveMenuFocus"
            @keydown.esc.stop.prevent="closeDesktopMenu"
          >
            <button
              class="app-nav__link app-nav__link--menu" type="button"
              :aria-expanded="desktopMenu === menu.label"
              :aria-controls="'nav-' + menu.href.slice(1)"
              @click="openDesktopMenu(menu.label)"
            >
              {{ menu.label }}
              <i class="fa-solid fa-chevron-down" aria-hidden="true" />
            </button>
            <div
              v-show="desktopMenu === menu.label"
              :id="'nav-' + menu.href.slice(1)"
              class="app-nav__mega" :class="{ 'app-nav__mega--wide': menu.wide }"
              :aria-label="menu.label + ' links'"
            >
              <div class="app-nav__mega-heading">
                <span>{{ menu.label }}</span>
                <h2>{{ menuPresentation[menu.label]?.title }}</h2>
                <p>{{ menuPresentation[menu.label]?.description }}</p>
              </div>
              <div class="app-nav__mega-links">
                <NuxtLink
                  v-for="link in menu.links" :key="link.href" :to="link.href"
                  class="app-nav__mega-link" @click="closeDesktopMenu">
                  <i class="fa-solid app-nav__mega-icon" :class="menuDetails[link.label]?.[0]" aria-hidden="true" />
                  <span class="app-nav__mega-copy">
                    <span>{{ link.label }}</span>
                    <small>{{ menuDetails[link.label]?.[1] }}</small>
                  </span>
                </NuxtLink>
              </div>
              <NuxtLink class="app-nav__mega-footer" :to="menu.href" @click="closeDesktopMenu">
                {{ menu.footer }} <i class="fa-solid fa-arrow-right" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>
          <template v-if="menu.label === 'Services'">
            <NuxtLink class="app-nav__link" to="/#fleet">Fleet</NuxtLink>
            <NuxtLink class="app-nav__link" to="/locations">Service Areas</NuxtLink>
          </template>
          </template>
          <NuxtLink class="app-nav__link" to="/contact">Contact</NuxtLink>
        </nav>

        <div class="app-nav__actions">
          <AppUserMenu :mobile-sheet="isMobile" login-variant="outline" />
          <NuxtLink class="app-nav__journey-cta app-nav__action-btn" :to="routes.journey">
            Book Your Journey
          </NuxtLink>
          <button
            ref="menuToggle"
            type="button"
            class="app-nav__burger"
            :aria-expanded="menuOpen"
            aria-controls="mobile-nav-drawer"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            @click="menuOpen = !menuOpen"
          >
            <i class="fa-solid fa-bars" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <div
      id="mobile-nav-drawer"
      class="app-nav__drawer"
      :class="{ 'is-open': menuOpen }"
      :aria-hidden="!menuOpen"
      :inert="!menuOpen"
      :role="menuOpen ? 'dialog' : undefined"
      :aria-modal="menuOpen ? true : undefined"
      aria-label="Navigation menu"
      @keydown.esc.stop.prevent="closeMenu"
      @keydown.tab="trapDrawerFocus"
    >
      <div class="app-nav__backdrop" @click="closeMenu" />
      <nav ref="drawerPanel" class="app-nav__panel app-nav__panel--home" aria-label="Mobile">
        <div class="app-nav__drawer-head">
          <p class="app-nav__drawer-eyebrow">Menu</p>
          <button
            type="button"
            class="app-nav__drawer-close"
            aria-label="Close menu"
            @click="closeMenu"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div class="app-nav__drawer-body">
          <section v-for="group in mobileMenuGroups" :key="group.label" class="app-nav__drawer-group">
            <button
              type="button"
              class="app-nav__drawer-group-title app-nav__drawer-group-toggle"
              :aria-expanded="Boolean(openMobileGroups[group.label])"
              @click="toggleMobileGroup(group.label)"
            >
              <span>{{ group.label }}</span>
              <i class="fa-solid fa-chevron-down" aria-hidden="true" />
            </button>
            <div v-show="openMobileGroups[group.label]" class="app-nav__drawer-links">
              <NuxtLink
                v-for="link in group.links"
                :key="link.href"
                class="app-nav__drawer-link"
                :to="link.href"
                @click="closeMenu"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </section>
        </div>

        <div class="app-nav__drawer-foot">
          <div
            v-if="!(auth.isLoggedIn && auth.role === 'CUSTOMER') && !auth.isGuestSession"
            class="user-menu app-nav__drawer-login"
          >
            <button
              type="button"
              class="btn user-menu__login app-nav__action-btn user-menu__login--outline"
              @click="closeMenu(); openSignIn()"
            >
              Login
            </button>
          </div>
          <NuxtLink
            v-else-if="auth.isGuestSession"
            class="app-nav__drawer-link app-nav__drawer-link--guest"
            :to="routes.guestBooking"
            @click="closeMenu"
          >
            Your booking
          </NuxtLink>
          <NuxtLink
            class="app-nav__drawer-cta app-nav__drawer-cta--gold"
            :to="routes.journey"
            @click="closeMenu"
          >
            Book Your Journey
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-nav__logo {
  display: block;
  width: auto;
  height: 40px;
  max-width: min(146px, 40vw);
}

.app-nav__cluster {
  display: flex;
  align-items: center;
  min-width: 0;
}

.app-nav__actions {
  display: flex;
  align-items: center;
}

.app-nav__menu { position: relative; }
.app-nav__menu::after { content: ''; position: absolute; top: 100%; left: 0; right: 0; height: 12px; }
.app-nav__link--menu { gap: 0.45rem; cursor: pointer; border-top: 0; border-left: 0; border-right: 0; }
.app-nav__link--menu i { font-size: 0.62rem; transition: transform 0.18s ease; }
.app-nav__menu.is-open .app-nav__link--menu i { transform: rotate(180deg); }
.app-nav__mega {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 260;
  width: 380px;
  max-height: calc(100dvh - 100px);
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #514835;
  border-radius: 8px;
  background: #151515;
  box-shadow: 0 18px 48px #0006;
  animation: nav-reveal 0.18s ease;
}
.app-nav__mega--wide { width: 680px; }
.app-nav__mega-heading { padding: 4px 12px 18px; margin-bottom: 10px; border-bottom: 1px solid #ffffff14; }
.app-nav__mega-heading > span { color: #e5c36c; font-size: 11px; text-transform: uppercase; letter-spacing: 0; }
.app-nav__mega-heading h2 { margin: 8px 0; color: #f5f5f5; font-size: 22px; font-weight: 300; line-height: 1.25; letter-spacing: 0; }
.app-nav__mega-heading p { margin: 0; color: #b8b8b8; font-size: 12px; line-height: 1.5; }
.app-nav__mega-links { display: grid; gap: 4px; }
.app-nav__mega-icon { flex: 0 0 22px; color: #d8b96a; font-size: 17px; text-align: center; }
.app-nav__mega-copy { display: grid; gap: 5px; }
.app-nav__mega-copy small { color: #b8b8b8; font-size: 12px; line-height: 1.45; font-weight: 300; }
.app-nav__mega--wide .app-nav__mega-links { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 12px; }
.app-nav__mega-link {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 66px;
  padding: 12px;
  border-radius: 4px;
  color: #f5f5f5;
  font-size: 14px;
  line-height: 1.4;
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease;
}
.app-nav__mega-link:hover, .app-nav__mega-link:focus-visible { background: #ffffff0d; color: #f0d587; }
.app-nav__mega-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  margin-top: 8px;
  padding: 12px;
  border-top: 1px solid #ffffff1f;
  color: #f0d587;
  font-size: 13px;
  text-decoration: none;
}
.app-nav__mega-footer i { transition: transform 0.18s ease; }
.app-nav__mega-footer:hover i { transform: translateX(3px); }
.app-nav__mega a:focus-visible, .app-nav__link--menu:focus-visible { outline: 2px solid #f0d587; outline-offset: -2px; }
.app-nav.is-scrolled { background: rgba(16,16,18,0.88) !important; backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: blur(20px) saturate(140%); border-bottom: 1px solid #ffffff24; box-shadow: 0 4px 20px #0002; }
.app-nav.is-scrolled .app-nav__scrim { display: none; }
.app-nav__drawer-group-title { color: #e5c36c; font-size: 13px; letter-spacing: 0; }
@keyframes nav-reveal { from { transform: translateY(5px); } to { transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .app-nav__mega { animation: none; } }
@media (min-width: 860px) and (max-width: 1120px) {
  .app-nav__mega--wide { width: 590px; }
  .app-nav__mega:not(.app-nav__mega--wide) { left: auto; right: 0; width: 350px; }
}

.app-nav__journey-cta {
  display: none;
}

.app-nav__drawer-group {
  display: grid;
  gap: 0.4rem;
  padding: 0.35rem 0 0.85rem;
}

.app-nav__drawer-group + .app-nav__drawer-group {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1rem;
}

.app-nav__drawer-group-title {
  padding-inline: 0.6rem;
}

.app-nav__drawer-group-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding-block: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.app-nav__drawer-group-toggle i {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.72rem;
  transition: transform 0.2s ease;
}

.app-nav__drawer-group-toggle[aria-expanded="true"] i {
  transform: rotate(180deg);
}

.app-nav__drawer-login {
  width: 100%;
  margin-bottom: 0;
}

.app-nav__drawer-login :deep(.user-menu__login) {
  display: inline-flex;
  width: 100%;
  justify-content: center;
}

@media (min-width: 1200px) {
  .app-nav__journey-cta {
    display: inline-flex;
  }
}

@media (max-width: 1199px) {
  .app-nav .app-nav__links, .app-nav .app-nav__journey-cta { display: none; }
  .app-nav .app-nav__burger { display: inline-flex; }
  .app-nav__mega {
    display: none;
  }
}
@supports not (backdrop-filter: blur(1px)) { .app-nav.is-scrolled { background: #151515 !important; } }
@media(max-width:767px) { .app-nav.is-scrolled { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); } }
</style>

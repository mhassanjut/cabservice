import type { Ref } from 'vue'

const groups = [
  '.home-proof__stat', '.home-confidence__card', '.home-intent__card',
  '.home-fleet__card', '.home-location-card', '.home-value',
  '.home-steps__item', '.home-insights__grid > article', '.home-faq__item',
  '.home-service-clarity__links > li', '.home-experience__carousel-viewport',
  '.home-proof__actions', '.home-confidence__actions', '.home-fleet__controls',
  '.home-cta__btn',
].join(', ')

export function useHomeReveal(root: Ref<HTMLElement | undefined>) {
  let entrance: IntersectionObserver | undefined
  let mutations: MutationObserver | undefined
  let preference: MediaQueryList | undefined
  const targets = new Set<HTMLElement>()
  const animations = new Map<HTMLElement, Animation>()

  function show(element: HTMLElement) {
    animations.get(element)?.cancel()
    animations.delete(element)
    element.removeAttribute('data-reveal-pending')
  }

  function focus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return
    const target = event.target.closest<HTMLElement>('[data-home-reveal]')
    if (target) show(target)
  }

  function stop() {
    entrance?.disconnect()
    mutations?.disconnect()
    targets.forEach(show)
  }

  function bind() {
    stop()
    targets.forEach(element => element.removeAttribute('data-home-reveal'))
    targets.clear()
    if (!root.value || preference?.matches || !('IntersectionObserver' in window)) return

    const mobile = window.matchMedia('(max-width: 767px)').matches
    entrance = new IntersectionObserver(entries => {
      let order = 0
      for (const entry of entries) {
        const element = entry.target as HTMLElement
        if (!entry.isIntersecting || !element.hasAttribute('data-reveal-pending')) continue
        show(element)
        entrance?.unobserve(element)
        if (element.contains(document.activeElement)) continue
        const animation = element.animate([
          { opacity: 0.7, translate: `0 ${mobile ? 8 : 12}px` },
          { opacity: 1, translate: '0 0' },
        ], {
          duration: mobile ? 220 : 260,
          delay: Math.min(order++ * 30, 60),
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards',
        })
        animations.set(element, animation)
        animation.onfinish = () => animations.delete(element)
      }
    }, { threshold: 0, rootMargin: mobile ? '0px 0px -60px 0px' : '0px 0px -80px 0px' })

    const discover = () => {
      root.value?.querySelectorAll<HTMLElement>('section :is(h2, p), section ' + groups.split(', ').join(', section ')).forEach(element => {
        if (targets.has(element) || element.closest('[aria-hidden="true"]')) return
        // A card owns its content reveal; never animate nested text twice.
        if (element.parentElement?.closest(groups)) return
        targets.add(element)
        element.setAttribute('data-home-reveal', '')
        const rect = element.getBoundingClientRect()
        if (rect.top >= window.innerHeight || rect.bottom <= 0 || rect.left >= window.innerWidth || rect.right <= 0) {
          element.setAttribute('data-reveal-pending', '')
        }
        entrance?.observe(element)
      })
      targets.forEach(element => {
        if (element.isConnected) return
        show(element)
        entrance?.unobserve(element)
        targets.delete(element)
      })
    }
    discover()
    mutations = new MutationObserver(discover)
    mutations.observe(root.value, { childList: true, subtree: true })
  }

  onMounted(() => {
    preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    preference.addEventListener('change', bind)
    root.value?.addEventListener('focusin', focus)
    bind()
  })

  onBeforeUnmount(() => {
    stop()
    preference?.removeEventListener('change', bind)
    root.value?.removeEventListener('focusin', focus)
  })
}

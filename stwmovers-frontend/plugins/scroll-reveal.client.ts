import { nextTick } from 'vue'

function bindReveal() {
  if (!import.meta.client) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const nodes = document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger')
  if (reduce) {
    nodes.forEach((el) => el.classList.add('is-visible'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  )
  nodes.forEach((el) => {
    if (!el.classList.contains('is-visible')) io.observe(el)
  })
}

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const router = useRouter()
  const schedule = () => nextTick(bindReveal)

  router.isReady().then(() => {
    schedule()
    router.afterEach(() => schedule())
  })
})

/**
 * Load Font Awesome without blocking first paint.
 * CSS is injected after hydration; noscript fallback remains in nuxt.config head.
 */
const FA_HREF =
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  if (document.querySelector(`link[data-fa-async="1"]`)) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = FA_HREF
  link.crossOrigin = 'anonymous'
  link.referrerPolicy = 'no-referrer'
  link.media = 'print'
  link.dataset.faAsync = '1'
  link.onload = () => {
    link.media = 'all'
  }
  document.head.appendChild(link)
})

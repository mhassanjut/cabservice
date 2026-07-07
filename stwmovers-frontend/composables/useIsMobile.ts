export function useIsMobile(breakpoint = 860) {
  const isMobile = ref(false)
  let mq: MediaQueryList | null = null
  let handler: (() => void) | null = null

  onMounted(() => {
    mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    handler = () => {
      isMobile.value = mq!.matches
    }
    handler()
    mq.addEventListener('change', handler)
  })

  onUnmounted(() => {
    if (mq && handler) mq.removeEventListener('change', handler)
  })

  return isMobile
}

export function useCustomerSignIn() {
  const isOpen = useState('customer-sign-in-open', () => false)
  const redirectTo = useState<string | null>('customer-sign-in-redirect', () => null)

  const open = (redirect?: string | null) => {
    redirectTo.value = redirect ?? null
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    redirectTo.value = null
  }

  return { isOpen, redirectTo, open, close }
}

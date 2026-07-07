export function normalizePhone(phone: string): string {
  return phone.trim()
}

export function isValidPhone(phone: string | null | undefined): boolean {
  const value = normalizePhone(phone ?? '')
  if (value.length < 8) return false
  const digits = value.replace(/[\s\-().]/g, '')
  return /^\+?\d{8,15}$/.test(digits)
}

export function buildWhatsappUrl(input: { phone: string; text: string }) {
  const phone = (input.phone || '').replace(/[^\d]/g, '')
  const text = encodeURIComponent(input.text || '')
  return `https://wa.me/${phone}?text=${text}`
}


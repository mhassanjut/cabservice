export function buildWhatsappUrl(input: { phone: string; text: string }) {
  const phone = (input.phone || '').replace(/[^\d]/g, '')
  const text = encodeURIComponent(input.text || '')
  return `https://wa.me/${phone}?text=${text}`
}

export function buildWhatsappLeadUrl(input: {
  phone: string
  message: string
  pickup: string
  destination: string
  pagePath: string
}) {
  const clean = (value: string) => value.replace(/\s+/g, ' ').trim()
  return buildWhatsappUrl({
    phone: input.phone,
    text: [
      input.message || 'Hello STW Movers, I would like a private transfer quote.',
      '',
      `Pickup: ${clean(input.pickup)}`,
      `Destination: ${clean(input.destination)}`,
      `Page: ${input.pagePath.split(/[?#]/)[0]}`,
    ].join('\n'),
  })
}

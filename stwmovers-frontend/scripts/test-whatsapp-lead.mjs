import assert from 'node:assert/strict'
import { buildWhatsappLeadUrl } from '../utils/whatsapp.ts'

const url = new URL(buildWhatsappLeadUrl({
  phone: '+34 627 408 522',
  message: 'Hello STW Movers, airport quote please.',
  pickup: '  Barcelona Airport\nT1  ',
  destination: 'Hotel & Spa / Passeig de Gràcia #2',
  pagePath: '/services/barcelona-airport-transfer?utm_source=test#quote',
}))
assert.equal(url.origin, 'https://wa.me')
assert.equal(url.pathname, '/34627408522')
assert.equal(url.searchParams.size, 1)
assert.equal(url.searchParams.get('text'), [
  'Hello STW Movers, airport quote please.',
  '',
  'Pickup: Barcelona Airport T1',
  'Destination: Hotel & Spa / Passeig de Gràcia #2',
  'Page: /services/barcelona-airport-transfer',
].join('\n'))
assert.match(new URL(buildWhatsappLeadUrl({ phone: '123', message: '', pickup: 'BCN', destination: 'Hotel', pagePath: '/' })).searchParams.get('text'), /private transfer quote/)
console.log('WhatsApp lead URL checks passed.')

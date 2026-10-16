import { describe, expect, it } from 'vitest'
import { isBroadBookingPlace } from '../utils/bookingPlace'

describe('booking destination specificity', () => {
  it('rejects region and country selections', () => {
    expect(isBroadBookingPlace({ types: ['administrative_area_level_1', 'political'] })).toBe(true)
    expect(isBroadBookingPlace({ types: ['country', 'political'] })).toBe(true)
  })

  it('accepts towns, hotels, airports and street addresses', () => {
    for (const type of ['locality', 'premise', 'establishment', 'airport', 'street_address']) {
      expect(isBroadBookingPlace({ types: [type] })).toBe(false)
    }
  })

  it('uses address components when place types are absent', () => {
    expect(isBroadBookingPlace({ address_components: [{ types: ['country'] }] })).toBe(true)
    expect(isBroadBookingPlace({ address_components: [{ types: ['locality'] }, { types: ['country'] }] })).toBe(false)
    expect(isBroadBookingPlace({})).toBe(false)
  })
})

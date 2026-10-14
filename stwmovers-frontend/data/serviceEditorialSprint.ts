import type { GrowthSection, GrowthRelatedLink } from './growthSeoPages'

export const serviceEditorial: Record<string, { sections: GrowthSection[]; related: GrowthRelatedLink[] }> = {
  'barcelona-airport-transfer': {
    sections: [
      { heading: 'Agree the arrival plan before departure', body: 'Provide your flight number, arrival date, terminal if known and exact destination. Confirm the meeting instructions and contact procedure before travelling. Landing, baggage collection and reaching the vehicle are separate stages; ask how your booking accounts for them.', bullets: ['Confirm the total price and waiting conditions', 'Report a terminal change or baggage delay', 'Save the booking contact and instructions offline'] },
      { heading: 'Plan the departure transfer separately', body: 'For a return airport journey, provide the flight time, departure terminal and airline check-in requirements. Agree collection using the actual hotel entrance and any additional stops. Arrival journey duration is not a guarantee for the return trip.' },
    ],
    related: [{ label: 'Airport pickup guide', href: '/blogs/barcelona-airport-pickup-guide' }, { label: 'Compare airport transfer costs', href: '/blogs/how-much-is-a-barcelona-airport-transfer' }],
  },
  'private-driver-barcelona': {
    sections: [
      { heading: 'Choose a transfer or reserved availability', body: 'One fixed journey may suit a point-to-point booking. Several stops with waiting may suit hourly availability. Provide the addresses, expected stop durations and final destination, then compare complete quotes for the same itinerary.' },
      { heading: 'Confirm how changes are handled', body: 'Ask what waiting, distance and time are included, how additional stops are approved and whether the vehicle can remain available beyond the booked finish. Confirm a revised itinerary before assuming an extension is possible.' },
    ],
    related: [{ label: 'Private driver cost and booking guide', href: '/blogs/private-driver-barcelona-cost-booking-use-cases' }],
  },
  'executive-chauffeur-barcelona': {
    sections: [
      { heading: 'Give business guests one clear transport plan', body: 'Nominate a booking coordinator and provide each arrival flight, hotel address and meeting deadline. Confirm who receives pickup instructions and how guests should report changes. Different flight arrivals may require separate collections.' },
      { heading: 'Specify the venue and billing requirements', body: 'Use the event organiser\'s exact venue address and entrance instructions, particularly for Fira visits. Confirm required arrival time, vehicle configuration and invoice details before booking. Avoid requesting transport using only a broad event or venue name.' },
    ],
    related: [{ label: 'Business travel: cab or chauffeur?', href: '/blogs/barcelona-cab-vs-chauffeur-business-travel' }, { label: 'Fira Barcelona service area', href: '/locations/fira-barcelona-chauffeur-service' }],
  },
  'barcelona-cruise-port-transfer': {
    sections: [
      { heading: 'Use the assigned cruise terminal', body: 'Provide the ship, sailing date and terminal confirmed by your cruise line. Plan around the latest boarding deadline rather than only the sailing time. Include airport exit, road travel and cruise check-in in the connection; a vehicle reservation does not guarantee boarding after a flight delay.' },
      { heading: 'Arrange collection after disembarkation', body: 'Docking time does not establish when you can leave the terminal. Use cruise-line disembarkation instructions to agree a collection window. Confirm how baggage delays and pickup changes will be communicated, especially when connecting to a flight.' },
    ],
    related: [{ label: 'Airport-to-cruise planning guide', href: '/blogs/barcelona-airport-to-cruise-port-transfer-guide' }, { label: 'Cruise port to airport route', href: '/locations/barcelona-cruise-port-to-airport-private-transfer' }],
  },
  'barcelona-van-transfer': {
    sections: [
      { heading: 'Confirm passengers and luggage together', body: 'Send the passenger count alongside large suitcases, cabin bags, strollers and other equipment. Ask for confirmation of the available configuration. A seat count or fleet photograph does not establish that your bags fit safely.' },
      { heading: 'Confirm essential equipment explicitly', body: 'Child seats and accessibility requirements need separate operator confirmation. Describe relevant equipment and whether it folds. For guests arriving on different flights, compare one shared pickup and its waiting requirements with separate collections.' },
    ],
    related: [{ label: 'Group and luggage planning guide', href: '/blogs/taxi-van-barcelona-groups-luggage-airport' }],
  },
}

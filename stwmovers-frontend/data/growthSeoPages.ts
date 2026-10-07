import { siteConfig } from '~/config/site'

export type GrowthPageKind = 'service' | 'location' | 'answer'

export type GrowthSection = {
  heading: string
  body: string
  bullets?: string[]
}

export type GrowthFaq = {
  question: string
  answer: string
}

export type GrowthRelatedLink = {
  label: string
  href: string
}

export type GrowthSource = {
  label: string
  href: string
}

export type GrowthPage = {
  kind: GrowthPageKind
  slug: string
  path: string
  eyebrow: string
  title: string
  seoTitle: string
  description: string
  summary: string
  directAnswer?: string
  image: string
  sections: GrowthSection[]
  faqs: GrowthFaq[]
  related: GrowthRelatedLink[]
  primaryCta?: GrowthRelatedLink
  secondaryCta?: GrowthRelatedLink
  sources?: GrowthSource[]
  lastUpdated?: string
  reviewedBy?: string
}

const bookCta = { label: 'Get private quote', href: '/journey#book-journey' }
const contactCta = { label: 'Contact STW Movers', href: '/contact' }
const growthLastUpdated = '2026-09-21'
const officialAirportSource = {
  label: 'Aena Barcelona-El Prat airport taxi and transport information',
  href: 'https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/taxi.html',
}
const officialVtcSource = {
  label: 'Aena Barcelona-El Prat vehicles for hire information',
  href: 'https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/vehicles-for-hire.html',
}
const officialTaxiFareSource = {
  label: 'AMB official metropolitan taxi fares',
  href: 'https://taxi.amb.cat/en/usuaris/tarifes-del-taxi',
}
const stwServiceCatalogSource = {
  label: 'STW Movers machine-readable service catalog',
  href: `${siteConfig.siteUrl}/services.md`,
}
const stwPricingSource = {
  label: 'STW Movers quote and pricing guide',
  href: `${siteConfig.siteUrl}/pricing.md`,
}

const servicePages: GrowthPage[] = [
  {
    kind: 'service',
    slug: 'barcelona-airport-transfer',
    lastUpdated: '2026-10-07',
    directAnswer: 'Request a Barcelona airport transfer with your flight number, arrival date, destination, passenger count and luggage details. Confirm the terminal, meeting instructions, waiting allowance and total price before booking. A private transfer is arranged in advance; it is not a pickup from the airport taxi rank.',
    path: '/services/barcelona-airport-transfer',
    eyebrow: 'Airport transfer Barcelona',
    title: 'Barcelona Airport Transfer Service',
    seoTitle: 'Barcelona Airport Transfer Service | Private BCN Transfers',
    description:
      'Private Barcelona airport transfer service for BCN arrivals and departures with meet-and-greet support, planned pickup timing, and executive vehicles.',
    summary:
      'STW Movers plans private transfers between Barcelona-El Prat Airport and hotels, apartments, offices, cruise terminals, and nearby cities.',
    image: '/img/services/airport.png',
    sections: [
      {
        heading: 'Built for BCN arrivals and departures',
        body:
          'Airport journeys need more than a car at the curb. We plan pickup time around flight status, terminal access, luggage needs, and the next step of your itinerary.',
        bullets: ['BCN Terminal 1 and Terminal 2 pickup', 'Hotel, office, port, and private-address drop-offs', 'Return transfers with sensible buffer time'],
      },
      {
        heading: 'Where should I meet the driver at T1 or T2?',
        body: 'Use the meeting instructions supplied for your booking rather than assuming the taxi rank is the meeting point. Aena lists taxi and vehicles-for-hire arrangements separately. Share your flight number and check the terminal again if your airline changes it.',
        bullets: ['Ask for the exact meeting point and contact number', 'Confirm when the waiting allowance starts and any extra charge', 'Contact the team if your flight or baggage collection is delayed'],
      },
      {
        heading: 'Who this service fits',
        body:
          'Use this page when the journey starts or ends at Barcelona-El Prat Airport and you want a private, pre-booked transfer instead of waiting for a taxi queue.',
        bullets: ['Business travellers on fixed schedules', 'Families travelling with luggage', 'Guests arriving for events, cruises, and private stays'],
      },
    ],
    faqs: [
      {
        question: 'Does STW Movers cover both BCN airport terminals?',
        answer: 'Yes. STW Movers can plan pickups and drop-offs for Barcelona-El Prat Airport Terminal 1 and Terminal 2.',
      },
      {
        question: 'Can I book a return airport transfer?',
        answer: 'Yes. You can request arrival and departure transfers together so timing, pickup address, and luggage needs are planned in one itinerary.',
      },
    ],
    related: [
      { label: 'Airport transfer overview', href: '/airport-transfer' },
      { label: 'Barcelona airport chauffeur', href: '/locations/barcelona-airport-chauffeur-service' },
      { label: 'Flight delay transfer answer', href: '/answers/flight-delay-airport-transfer-barcelona' },
    ],
    sources: [officialAirportSource, officialVtcSource, officialTaxiFareSource, stwServiceCatalogSource, stwPricingSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'private-driver-barcelona',
    lastUpdated: '2026-10-07',
    directAnswer: 'Choose a point-to-point private driver for a defined pickup and destination, or request hourly service for a schedule with several stops. Share the itinerary and expected duration before booking. Ask which waiting time, distance and extra stops the quote covers; an hourly request is not unlimited travel.',
    path: '/services/private-driver-barcelona',
    eyebrow: 'Private driver Barcelona',
    title: 'Private Driver in Barcelona',
    seoTitle: 'Private Driver Barcelona | Hourly and Point-to-Point Service',
    description:
      'Book a private driver in Barcelona for airport transfers, meetings, dinners, events, shopping, and flexible hourly chauffeur support.',
    summary:
      'Private driver service gives you a planned vehicle and driver for direct transfers or flexible movement across Barcelona.',
    image: '/img/services/hero.png',
    sections: [
      {
        heading: 'A calm way to move across the city',
        body:
          'Barcelona traffic, hotel access, and event timing can change quickly. A private driver helps keep the day predictable without switching between taxis and ride apps.',
        bullets: ['Point-to-point transfers', 'Hourly availability for multiple stops', 'Pickup planning for hotels, offices, venues, and homes'],
      },
      {
        heading: 'Ideal private driver use cases',
        body:
          'This service is useful when the trip includes waiting time, luggage, several passengers, or a schedule that should not depend on street availability.',
        bullets: ['Dinner and evening transport', 'Shopping or sightseeing with stops', 'Client and family transport'],
      },
      {
        heading: 'What should an hourly quote include?',
        body: 'Ask for the booked duration, start and finish locations, included distance if applicable, and the cost of overtime or additional stops. Send appointment times as well as addresses so travel and waiting can be considered separately.',
        bullets: ['Confirm whether the vehicle waits between appointments', 'Request changes before extending the itinerary', 'Check cancellation conditions before accepting the quote'],
      },
    ],
    faqs: [
      {
        question: 'Can I book a private driver for multiple stops?',
        answer: 'Yes. Share the stops and preferred timing when requesting a quote so the itinerary can be planned correctly.',
      },
      {
        question: 'Is private driver service different from an airport transfer?',
        answer: 'Yes. Airport transfers are usually direct journeys, while private driver service can include hourly time, waiting, and several stops.',
      },
    ],
    related: [
      { label: 'Private chauffeur overview', href: '/chauffeur-service' },
      { label: 'Hourly chauffeur service', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Private driver vs taxi', href: '/answers/private-driver-vs-taxi-barcelona' },
    ],
    sources: [officialVtcSource, stwServiceCatalogSource, stwPricingSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'executive-chauffeur-barcelona',
    lastUpdated: '2026-10-07',
    directAnswer: 'For business travel in Barcelona, request a chauffeur itinerary with meeting addresses, appointment times, airport details and a day-of contact. Confirm vehicle availability, waiting terms and invoice requirements before booking. Share access instructions for offices or venues rather than relying on a venue name alone.',
    path: '/services/executive-chauffeur-barcelona',
    eyebrow: 'Executive chauffeur Barcelona',
    title: 'Executive Chauffeur Service in Barcelona',
    seoTitle: 'Executive Chauffeur Barcelona | Business Travel Driver Service',
    description:
      'Executive chauffeur service in Barcelona for meetings, airport arrivals, board travel, client hosting, and discreet business itineraries.',
    summary:
      'STW Movers supports business travellers who need punctual chauffeur service, clean vehicles, and planned timing across Barcelona.',
    image: '/img/services/business.png',
    sections: [
      {
        heading: 'Designed around business schedules',
        body:
          'Executive travel depends on timing, discretion, and clear pickup instructions. We plan the route around meeting locations, airport arrivals, venues, and buffer time.',
        bullets: ['Airport-to-meeting transfers', 'Board and client transport', 'Event and conference movement'],
      },
      {
        heading: 'Professional details that matter',
        body:
          'Provide the building entrance, meeting schedule and a contact who can coordinate changes. For conferences, include the venue and entrance shown on your event invitation. Confirm whether waiting between appointments is part of the quote.',
        bullets: ['Pickup instructions for each stop', 'Passenger and luggage requirements', 'Invoice details and any purchase-order requirement'],
      },
      {
        heading: 'What if the meeting runs late?',
        body: 'Discuss the waiting allowance and overtime rate before booking. If a meeting changes, contact the team rather than assuming the driver can extend the service. Additional time and itinerary changes depend on availability and the agreed booking conditions.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers handle executive airport arrivals?',
        answer: 'Yes. Executive airport arrivals can be planned with terminal pickup, destination details, and timing around the traveller schedule.',
      },
      {
        question: 'Can I arrange transport for clients or guests?',
        answer: 'Yes. Share the guest count, pickup points, destinations, and preferred vehicle style when requesting the quote.',
      },
    ],
    related: [
      { label: 'Executive business travel', href: '/executive-business-travel' },
      { label: 'Fira Barcelona chauffeur', href: '/locations/fira-barcelona-chauffeur-service' },
      { label: 'Business chauffeur answer', href: '/answers/chauffeur-for-business-travel-barcelona' },
    ],
    sources: [officialVtcSource, stwServiceCatalogSource, stwPricingSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'hourly-chauffeur-barcelona',
    path: '/services/hourly-chauffeur-barcelona',
    eyebrow: 'Hourly chauffeur Barcelona',
    title: 'Hourly Chauffeur Service in Barcelona',
    seoTitle: 'Hourly Chauffeur Barcelona | Private Driver by the Hour',
    description:
      'Hourly chauffeur service in Barcelona for meetings, shopping, sightseeing, events, and flexible multi-stop private driver bookings.',
    summary:
      'Hourly chauffeur service is best when you need a driver to remain available instead of completing a single transfer.',
    image: '/img/services/hourly.png',
    sections: [
      {
        heading: 'Best for flexible city movement',
        body:
          'Book hourly time when your day may include route changes, waiting, short meetings, restaurant stops, or sightseeing without fixed pickup windows between each trip.',
        bullets: ['Multi-stop city itineraries', 'Waiting time between appointments', 'Flexible hotel and venue pickup'],
      },
      {
        heading: 'Planning an hourly booking',
        body:
          'Share the approximate start time, pickup location, expected duration, and any must-reach stops. That gives the team enough context to quote accurately.',
        bullets: ['Start and finish points', 'Estimated number of passengers', 'Luggage or special access notes'],
      },
    ],
    faqs: [
      {
        question: 'When should I book hourly chauffeur service?',
        answer: 'Choose hourly chauffeur service when the vehicle should stay available for waiting time, schedule changes, or more than one stop.',
      },
      {
        question: 'Can hourly service include airport pickup?',
        answer: 'Yes. Airport pickup can be part of an hourly booking when the rest of the itinerary continues after the airport transfer.',
      },
    ],
    related: [
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
      { label: 'Hourly driver answer', href: '/answers/hourly-private-driver-barcelona' },
      { label: 'Contact for quote', href: '/contact' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'barcelona-cruise-port-transfer',
    lastUpdated: '2026-10-07',
    directAnswer: 'For a Barcelona cruise transfer, provide the ship name, sailing date, terminal if known, luggage count and destination. Plan around the expected time you can leave the ship, not only the docking time. Confirm the meeting point and allow for disembarkation before agreeing an onward airport pickup.',
    path: '/services/barcelona-cruise-port-transfer',
    eyebrow: 'Cruise port transfer',
    title: 'Barcelona Cruise Port Transfer',
    seoTitle: 'Barcelona Cruise Port Transfer | Private Port Chauffeur',
    description:
      'Private Barcelona cruise port transfers between the terminal, airport, hotels, Eixample, Gothic Quarter, Sitges, and nearby destinations.',
    summary:
      'STW Movers helps cruise guests move between Barcelona cruise terminals, BCN airport, hotels, and private addresses with luggage-aware planning.',
    image: '/img/home/optimized/location-costa-brava.webp',
    sections: [
      {
        heading: 'Port transfers with luggage in mind',
        body:
          'Cruise travel often includes larger luggage and strict embarkation or disembarkation windows. We plan pickup timing and vehicle fit around those details.',
        bullets: ['Cruise terminal to BCN airport', 'Cruise terminal to hotels and apartments', 'Private transfers after disembarkation'],
      },
      {
        heading: 'Add a stop before or after the cruise',
        body:
          'When timing allows, the journey can include a hotel stop, restaurant drop-off, or onward transfer to Sitges, Costa Brava, or another nearby destination.',
        bullets: ['Hotel check-in transfers', 'City stop before airport departure', 'Onward private transfers outside Barcelona'],
      },
      {
        heading: 'Can I connect from the ship to a flight?',
        body: 'Share the flight departure time and the disembarkation information from your cruise line. Road travel is only part of the connection: leaving the ship, collecting bags and airline check-in also take time. Ask the team to review the itinerary; a transfer booking does not guarantee a tight connection.',
        bullets: ['Reconfirm the terminal with your cruise line', 'Tell the team about changes to disembarkation', 'Check the waiting and cancellation terms for your booking'],
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers pick up at the Barcelona cruise port?',
        answer: 'Yes. Share the ship, terminal details if known, passenger count, luggage, and destination so the pickup can be planned.',
      },
      {
        question: 'Can a port transfer go directly to Barcelona airport?',
        answer: 'Yes. Barcelona cruise port to BCN airport is a common private transfer route.',
      },
    ],
    related: [
      { label: 'Cruise port location page', href: '/locations/barcelona-cruise-port-chauffeur-service' },
      { label: 'Airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Family luggage transfer answer', href: '/answers/family-airport-transfer-barcelona-luggage' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'event-chauffeur-barcelona',
    path: '/services/event-chauffeur-barcelona',
    eyebrow: 'Event chauffeur Barcelona',
    title: 'Event Chauffeur Service in Barcelona',
    seoTitle: 'Event Chauffeur Barcelona | Private Driver for Venues and Guests',
    description:
      'Event chauffeur service in Barcelona for conferences, weddings, dinners, launches, venue transfers, and guest transport planning.',
    summary:
      'Event chauffeur support keeps guests moving between hotels, venues, airports, dinners, and after-event destinations with clear timing.',
    image: '/img/services/events.png',
    sections: [
      {
        heading: 'Guest transport for planned moments',
        body:
          'Event transport works best when pickup lists, vehicle needs, and time windows are clear before the day begins. STW Movers supports private and corporate event movement.',
        bullets: ['Conference and dinner transfers', 'Wedding guest movement', 'Airport, hotel, and venue connections'],
      },
      {
        heading: 'Useful for small groups and VIPs',
        body:
          'This service is especially useful when guests require a private arrival experience or when the event schedule needs dependable pickup coordination.',
        bullets: ['VIP arrivals', 'Speaker and executive movement', 'Evening returns from venues'],
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers help with event guest transfers?',
        answer: 'Yes. Share the event schedule, pickup points, passenger count, and vehicle needs to plan guest transfers.',
      },
      {
        question: 'Does event chauffeur service include late-night returns?',
        answer: 'Late-night returns can be requested with the booking details so availability and timing can be confirmed.',
      },
    ],
    related: [
      { label: 'Fira Barcelona chauffeur', href: '/locations/fira-barcelona-chauffeur-service' },
      { label: 'Executive chauffeur Barcelona', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'city-to-city-transfers-barcelona',
    path: '/services/city-to-city-transfers-barcelona',
    eyebrow: 'City-to-city transfers',
    title: 'City-to-City Private Transfers from Barcelona',
    seoTitle: 'City-to-City Transfers Barcelona | Private Driver Across Spain',
    description:
      'Private city-to-city transfers from Barcelona to Sitges, Costa Brava, Girona, Tarragona, resorts, ports, airports, and custom destinations.',
    summary:
      'City-to-city transfers are private long-distance journeys from Barcelona to nearby towns, coastal areas, resorts, airports, or private addresses.',
    image: '/img/home/optimized/location-begur.webp',
    sections: [
      {
        heading: 'Longer journeys without station changes',
        body:
          'Private intercity travel is useful when luggage, family needs, meeting schedules, or door-to-door comfort matter more than changing trains or taxis.',
        bullets: ['Barcelona to Sitges and coastal towns', 'Barcelona to Costa Brava', 'Barcelona to Girona or Tarragona area'],
      },
      {
        heading: 'Plan the route around the real trip',
        body:
          'Share the pickup address, destination, passengers, luggage, and any desired stop. That helps the team quote the transfer accurately.',
        bullets: ['Hotel and villa pickups', 'Airport-to-resort journeys', 'Cruise port onward transfers'],
      },
    ],
    faqs: [
      {
        question: 'Can I book a private transfer outside Barcelona?',
        answer: 'Yes. STW Movers can quote city-to-city transfers from Barcelona to nearby destinations and custom routes.',
      },
      {
        question: 'Can we stop during a city-to-city transfer?',
        answer: 'Stops can be requested in advance so timing and pricing can be planned properly.',
      },
    ],
    related: [
      { label: 'Sitges private transfer', href: '/locations/sitges-private-transfer' },
      { label: 'Costa Brava private transfer', href: '/locations/costa-brava-private-transfer' },
      { label: 'Private Barcelona tours', href: '/tours' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'mercedes-chauffeur-barcelona',
    path: '/services/mercedes-chauffeur-barcelona',
    eyebrow: 'Mercedes chauffeur Barcelona',
    title: 'Mercedes Chauffeur Service in Barcelona',
    seoTitle: 'Mercedes Chauffeur Barcelona | Executive Vehicle Service',
    description:
      'Mercedes chauffeur service in Barcelona for executive transfers, airport arrivals, business travel, families, and private itineraries.',
    summary:
      'Mercedes-class chauffeur service focuses on comfort, presentation, luggage fit, and a polished private vehicle experience.',
    image: '/img/home/fleet-section/mercedes-s-class.webp',
    sections: [
      {
        heading: 'For travellers who care about vehicle fit',
        body:
          'Vehicle choice matters for business travel, luggage, families, and VIP hosting. Use this page when the vehicle experience is part of the request.',
        bullets: ['Executive sedans where available', 'V-Class style comfort for groups', 'Clean, private, professional presentation'],
      },
      {
        heading: 'Match the booking to the itinerary',
        body:
          'Share the route, passenger count, luggage, and preferred vehicle class so STW Movers can confirm the right option for the journey.',
        bullets: ['Airport and hotel transfers', 'Corporate and event travel', 'Hourly chauffeur requests'],
      },
    ],
    faqs: [
      {
        question: 'Can I request a Mercedes vehicle?',
        answer: 'You can request a Mercedes-class option when asking for a quote. Availability depends on the date, route, and passenger needs.',
      },
      {
        question: 'Is a Mercedes chauffeur suitable for families?',
        answer: 'Yes, depending on passenger and luggage count. Share those details so the right vehicle type can be quoted.',
      },
    ],
    related: [
      { label: 'Fleet', href: '/cars' },
      { label: 'Executive chauffeur Barcelona', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
]

const locationPages: GrowthPage[] = [
  {
    kind: 'location',
    slug: 'eixample-chauffeur-service',
    path: '/locations/eixample-chauffeur-service',
    eyebrow: 'Eixample chauffeur service',
    title: 'Chauffeur Service in Eixample, Barcelona',
    seoTitle: 'Eixample Chauffeur Service | Private Driver Barcelona',
    description:
      'Private chauffeur service in Eixample for hotels, homes, offices, airport transfers, dinners, and executive travel across Barcelona.',
    summary:
      'Eixample is a key pickup area for STW Movers, including hotel transfers, private addresses, airport journeys, and business travel.',
    image: '/img/about/hero.png',
    sections: [
      {
        heading: 'Local pickups around central Barcelona',
        body:
          'Eixample includes hotels, residences, restaurants, clinics, offices, and transport connections. Private chauffeur planning helps make pickups clearer in busy streets.',
        bullets: ['Airport transfers from Eixample', 'Dinner and business pickups', 'Private-address transfers'],
      },
      {
        heading: 'When to use this page',
        body:
          'Use this service area page when your pickup or destination is in Eixample and you want a private vehicle planned in advance.',
      },
    ],
    faqs: [
      {
        question: 'Does STW Movers pick up in Eixample?',
        answer: 'Yes. STW Movers can plan private chauffeur pickups and drop-offs in Eixample.',
      },
      {
        question: 'Can I book from Eixample to Barcelona Airport?',
        answer: 'Yes. Eixample to BCN airport is a common private transfer route.',
      },
    ],
    related: [
      { label: '08015 chauffeur page', href: '/chauffeur-service-barcelona-08015' },
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
      { label: 'Barcelona airport transfer', href: '/services/barcelona-airport-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'sants-montjuic-chauffeur-service',
    path: '/locations/sants-montjuic-chauffeur-service',
    eyebrow: 'Sants-Montjuic chauffeur service',
    title: 'Chauffeur Service in Sants-Montjuic',
    seoTitle: 'Sants-Montjuic Chauffeur Service | Barcelona Private Driver',
    description:
      'Private chauffeur service in Sants-Montjuic for hotels, venues, Montjuic visits, airport transfers, station pickups, and event travel.',
    summary:
      'Sants-Montjuic connects venues, hotels, station access, Montjuic attractions, and airport routes, making it a strong private-driver pickup area.',
    image: '/img/home/optimized/journey-montjuic.webp',
    sections: [
      {
        heading: 'Useful for venues, stations, and hills',
        body:
          'The area can involve busy roads, event traffic, station pickup complexity, and steep Montjuic routes. A planned private pickup keeps the journey simpler.',
        bullets: ['Montjuic and venue transfers', 'Sants area pickups', 'Airport and hotel routes'],
      },
      {
        heading: 'Plan around the destination',
        body:
          'Share the exact pickup point, passenger count, luggage, and event timing if applicable. That makes the transfer easier to coordinate.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers cover Sants-Montjuic pickups?',
        answer: 'Yes. STW Movers can arrange private chauffeur pickups across Sants-Montjuic.',
      },
      {
        question: 'Is this service suitable for Montjuic visits?',
        answer: 'Yes. Montjuic transfers and private sightseeing stops can be requested in advance.',
      },
    ],
    related: [
      { label: 'Montjuic chauffeur service', href: '/locations/montjuic-chauffeur-service' },
      { label: 'Hourly chauffeur Barcelona', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Private Barcelona tours', href: '/tours' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-airport-chauffeur-service',
    path: '/locations/barcelona-airport-chauffeur-service',
    eyebrow: 'Barcelona airport chauffeur',
    title: 'Barcelona Airport Chauffeur Service',
    seoTitle: 'Barcelona Airport Chauffeur Service | BCN Private Driver',
    description:
      'Barcelona airport chauffeur service for BCN arrivals, departures, executive guests, families, hotels, cruise port transfers, and business travel.',
    summary:
      'This location page targets BCN airport chauffeur intent: private pickup, planned vehicle fit, and onward travel across Barcelona.',
    image: '/img/services/airport.png',
    sections: [
      {
        heading: 'Private pickup from BCN',
        body:
          'Airport chauffeur service is for travellers who want a planned, private arrival or departure rather than making transport decisions after landing.',
        bullets: ['BCN Terminal 1 and Terminal 2', 'Hotel and office transfers', 'Cruise port and city-to-city onward routes'],
      },
      {
        heading: 'Arrival details to share',
        body:
          'For accurate planning, share flight number, date, pickup terminal if known, drop-off address, passenger count, and luggage.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers monitor a flight for airport pickup?',
        answer: 'Flight details can be shared with the booking so arrival timing can be planned around the flight information.',
      },
      {
        question: 'Can airport chauffeur service include a child seat?',
        answer: 'Special requests should be added to the quote request so the team can confirm availability.',
      },
    ],
    related: [
      { label: 'Barcelona airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Airport transfer cost answer', href: '/answers/barcelona-airport-transfer-cost' },
      { label: 'Meet and greet answer', href: '/answers/barcelona-airport-meet-and-greet' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'fira-barcelona-chauffeur-service',
    path: '/locations/fira-barcelona-chauffeur-service',
    eyebrow: 'Fira Barcelona chauffeur',
    title: 'Fira Barcelona Chauffeur Service',
    seoTitle: 'Fira Barcelona Chauffeur Service | Executive Event Transfers',
    description:
      'Private chauffeur service for Fira Barcelona events, trade shows, hotels, airports, dinners, and executive schedules.',
    summary:
      'Fira Barcelona transport often involves fixed meeting times, hotel pickups, airport arrivals, and evening event movement.',
    image: '/img/services/events.png',
    sections: [
      {
        heading: 'Event-day transport planning',
        body:
          'Trade show days can create traffic and pickup pressure. Pre-booked chauffeur service helps executives, speakers, and guests move with fewer unknowns.',
        bullets: ['Hotel to Fira transfers', 'Airport to Fira arrivals', 'Dinner and event returns'],
      },
      {
        heading: 'Good fit for business guests',
        body:
          'Use this page when the transport request is tied to a Fira event, conference schedule, client visit, or hospitality itinerary.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers provide chauffeur service for Fira Barcelona events?',
        answer: 'Yes. Share the event venue, pickup points, dates, and guest count so transfers can be planned.',
      },
      {
        question: 'Can this include airport arrivals for event guests?',
        answer: 'Yes. Airport arrivals can be combined with event, hotel, and dinner transfers.',
      },
    ],
    related: [
      { label: 'Event chauffeur Barcelona', href: '/services/event-chauffeur-barcelona' },
      { label: 'Executive chauffeur Barcelona', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Business travel chauffeur answer', href: '/answers/chauffeur-for-business-travel-barcelona' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'passeig-de-gracia-chauffeur-service',
    path: '/locations/passeig-de-gracia-chauffeur-service',
    eyebrow: 'Passeig de Gracia chauffeur',
    title: 'Passeig de Gracia Chauffeur Service',
    seoTitle: 'Passeig de Gracia Chauffeur Service | Barcelona Private Driver',
    description:
      'Private chauffeur service around Passeig de Gracia for hotels, luxury shopping, restaurants, business meetings, and airport transfers.',
    summary:
      'Passeig de Gracia is a high-demand pickup area for hotels, retail visits, restaurants, and executive travel in central Barcelona.',
    image: '/img/home/optimized/journey-casa-batllo.webp',
    sections: [
      {
        heading: 'Central pickups with clear timing',
        body:
          'The area is busy with visitors, hotels, shops, and restaurants. A pre-arranged chauffeur keeps the pickup instructions and timing clear.',
        bullets: ['Hotel and retail pickups', 'Airport transfers', 'Dinner and meeting transport'],
      },
      {
        heading: 'Useful for luxury and executive itineraries',
        body:
          'Book this service when the transport request starts near Passeig de Gracia and includes fixed timing, multiple stops, or presentation-sensitive guests.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers pick up near Passeig de Gracia?',
        answer: 'Yes. Share the hotel, restaurant, store, or nearby address for pickup planning.',
      },
      {
        question: 'Can I book multiple stops from Passeig de Gracia?',
        answer: 'Yes. Multiple stops can be handled as private driver or hourly chauffeur service.',
      },
    ],
    related: [
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
      { label: 'Hourly chauffeur Barcelona', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Mercedes chauffeur Barcelona', href: '/services/mercedes-chauffeur-barcelona' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'gothic-quarter-chauffeur-service',
    path: '/locations/gothic-quarter-chauffeur-service',
    eyebrow: 'Gothic Quarter chauffeur',
    title: 'Gothic Quarter Chauffeur Service',
    seoTitle: 'Gothic Quarter Chauffeur Service | Barcelona Private Driver',
    description:
      'Private chauffeur service for the Gothic Quarter, Barcelona hotels, restaurants, sightseeing stops, airport transfers, and cruise port movement.',
    summary:
      'Gothic Quarter transport needs careful pickup planning because pedestrian streets and hotel access can affect the best meeting point.',
    image: '/img/home/optimized/journey-gothic.webp',
    sections: [
      {
        heading: 'Pickup planning for old-city access',
        body:
          'Some streets in the Gothic Quarter are narrow, pedestrianized, or restricted. A planned chauffeur pickup can use the most practical nearby meeting point.',
        bullets: ['Hotel and restaurant pickups', 'Airport and port transfers', 'Sightseeing and dinner transport'],
      },
      {
        heading: 'Best when timing matters',
        body:
          'Use this service when you want a private transfer from the old city without guessing where a driver can reach you at the last minute.',
      },
    ],
    faqs: [
      {
        question: 'Can a chauffeur pick up inside the Gothic Quarter?',
        answer: 'Pickup depends on street access. STW Movers can help plan a practical nearby pickup point when direct access is restricted.',
      },
      {
        question: 'Can Gothic Quarter transfers go to the cruise port?',
        answer: 'Yes. Gothic Quarter to Barcelona cruise port is a common private transfer request.',
      },
    ],
    related: [
      { label: 'Cruise port transfer', href: '/services/barcelona-cruise-port-transfer' },
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
      { label: 'Hourly chauffeur Barcelona', href: '/services/hourly-chauffeur-barcelona' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-cruise-port-chauffeur-service',
    path: '/locations/barcelona-cruise-port-chauffeur-service',
    eyebrow: 'Barcelona cruise port chauffeur',
    title: 'Barcelona Cruise Port Chauffeur Service',
    seoTitle: 'Barcelona Cruise Port Chauffeur Service | Private Port Transfers',
    description:
      'Private chauffeur service at Barcelona cruise port for airport transfers, hotel arrivals, families, luggage, and onward trips outside the city.',
    summary:
      'Barcelona cruise port chauffeur service helps guests move from terminal to airport, hotel, private address, or onward destination.',
    image: '/img/contact/destination-sunset.png',
    sections: [
      {
        heading: 'A practical option after disembarkation',
        body:
          'Port days often involve luggage, waiting areas, and fixed flight times. A private chauffeur transfer gives guests a planned onward route.',
        bullets: ['Port to BCN airport', 'Port to Barcelona hotels', 'Port to Sitges or Costa Brava'],
      },
      {
        heading: 'Useful details for the quote',
        body:
          'Share the ship, date, pickup time, passengers, luggage, and destination. If the terminal is not confirmed yet, include the cruise line or ship name.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers pick up cruise passengers with luggage?',
        answer: 'Yes. Include passenger and luggage count so a suitable vehicle can be planned.',
      },
      {
        question: 'Can the transfer go outside Barcelona?',
        answer: 'Yes. Private onward transfers to Sitges, Costa Brava, and other destinations can be quoted.',
      },
    ],
    related: [
      { label: 'Barcelona cruise port transfer', href: '/services/barcelona-cruise-port-transfer' },
      { label: 'Sitges private transfer', href: '/locations/sitges-private-transfer' },
      { label: 'Costa Brava private transfer', href: '/locations/costa-brava-private-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'sitges-private-transfer',
    path: '/locations/sitges-private-transfer',
    eyebrow: 'Sitges private transfer',
    title: 'Private Transfer from Barcelona to Sitges',
    seoTitle: 'Barcelona to Sitges Private Transfer | STW Movers',
    description:
      'Private transfers between Barcelona, BCN airport, Barcelona cruise port, and Sitges with planned pickup, luggage-aware vehicles, and direct routing.',
    summary:
      'Barcelona to Sitges private transfers are useful for airport arrivals, cruise guests, hotel stays, weddings, and coastal trips.',
    image: '/img/home/optimized/location-vilanova.webp',
    sections: [
      {
        heading: 'Direct route to Sitges',
        body:
          'A private transfer avoids station changes and taxi uncertainty, especially with luggage, family groups, late arrivals, or event schedules.',
        bullets: ['BCN airport to Sitges', 'Barcelona hotel to Sitges', 'Cruise port to Sitges'],
      },
      {
        heading: 'Plan return transfers too',
        body:
          'Return journeys can be arranged in the same request when you already know the airport departure, cruise schedule, or hotel checkout time.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers quote Barcelona to Sitges?',
        answer: 'Yes. Share pickup, destination, passenger count, luggage, and travel date for a private Sitges transfer quote.',
      },
      {
        question: 'Can Sitges transfers start at BCN airport?',
        answer: 'Yes. BCN airport to Sitges is a common private transfer route.',
      },
    ],
    related: [
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
      { label: 'Airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Cruise port chauffeur', href: '/locations/barcelona-cruise-port-chauffeur-service' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'costa-brava-private-transfer',
    path: '/locations/costa-brava-private-transfer',
    eyebrow: 'Costa Brava private transfer',
    title: 'Private Transfer from Barcelona to Costa Brava',
    seoTitle: 'Barcelona to Costa Brava Private Transfer | STW Movers',
    description:
      'Private transfers between Barcelona, BCN airport, cruise port, and Costa Brava destinations with direct routing, luggage planning, and flexible pickup.',
    summary:
      'Costa Brava private transfers are useful for hotels, villas, coastal towns, family trips, airport arrivals, and cruise port onward journeys.',
    image: '/img/home/optimized/location-costa-brava.webp',
    sections: [
      {
        heading: 'Door-to-door coastal transfers',
        body:
          'Private transfer is a practical option when the destination is a hotel, villa, marina, or coastal town that is less convenient by public transport.',
        bullets: ['BCN airport to Costa Brava', 'Barcelona hotel to Costa Brava', 'Cruise port to coastal destinations'],
      },
      {
        heading: 'Useful planning details',
        body:
          'Share the exact destination, pickup point, passenger count, luggage, and whether the transfer should include a stop on the way.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers quote Barcelona to Costa Brava?',
        answer: 'Yes. Share route, date, passengers, luggage, and destination town for a private Costa Brava transfer quote.',
      },
      {
        question: 'Can Costa Brava transfers start at the cruise port?',
        answer: 'Yes. Cruise port to Costa Brava transfers can be requested in advance.',
      },
    ],
    related: [
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
      { label: 'Barcelona cruise port chauffeur', href: '/locations/barcelona-cruise-port-chauffeur-service' },
      { label: 'Sitges private transfer', href: '/locations/sitges-private-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
]

const answerPages: GrowthPage[] = [
  {
    kind: 'answer',
    slug: 'barcelona-airport-transfer-cost',
    path: '/answers/barcelona-airport-transfer-cost',
    eyebrow: 'Answer',
    title: 'How much does a Barcelona airport transfer cost?',
    seoTitle: 'Barcelona Airport Transfer Cost | Private Transfer Pricing Factors',
    description:
      'Learn what affects Barcelona airport transfer cost, including route, vehicle, time, luggage, waiting, passenger count, and private chauffeur requirements.',
    summary:
      'Airport transfer pricing depends on route distance, vehicle type, passenger count, luggage, pickup timing, waiting needs, and any extra stops.',
    directAnswer:
      'A Barcelona airport transfer cost is usually based on the pickup and drop-off locations, vehicle type, passengers, luggage, date, time, waiting needs, and any extra stops. For an accurate private transfer price, request a quote with the flight number, destination, passengers, and luggage.',
    image: '/img/services/airport.png',
    sections: [
      {
        heading: 'Main price factors',
        body:
          'A short airport-to-Eixample transfer is different from a late-night airport-to-coast route or a family booking with extra luggage. The quote should match the real journey.',
        bullets: ['Distance and route', 'Vehicle class and capacity', 'Flight timing, waiting, and stops'],
      },
      {
        heading: 'What to include in your request',
        body:
          'Share the flight number, pickup date, destination address, passenger count, luggage, and any special requests. That is enough to create a useful quote.',
      },
    ],
    faqs: [
      {
        question: 'Is private transfer pricing fixed?',
        answer: 'Pricing can be quoted in advance when the route, timing, passenger count, and luggage needs are clear.',
      },
      {
        question: 'Does luggage affect the transfer cost?',
        answer: 'Luggage can affect vehicle selection, which may affect the quoted price.',
      },
    ],
    related: [
      { label: 'Barcelona airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Airport chauffeur location', href: '/locations/barcelona-airport-chauffeur-service' },
      { label: 'Book a transfer', href: '/journey#book-journey' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'best-way-from-bcn-airport-to-barcelona',
    path: '/answers/best-way-from-bcn-airport-to-barcelona',
    eyebrow: 'Answer',
    title: 'What is the best way from BCN Airport to Barcelona?',
    seoTitle: 'Best Way from BCN Airport to Barcelona | Private Transfer Guide',
    description:
      'Compare private transfer, taxi, train, and bus options from Barcelona-El Prat Airport to Barcelona for business, families, luggage, and late arrivals.',
    summary:
      'The best option depends on budget, luggage, arrival time, hotel location, and whether you want direct door-to-door travel.',
    directAnswer:
      'The best way from BCN Airport to Barcelona depends on your needs. A private transfer is best for door-to-door comfort, luggage, families, late arrivals, and fixed schedules. Train or bus may be cheaper for light luggage and flexible timing; taxis can work when queues are short.',
    image: '/img/home/hero-7.webp',
    sections: [
      {
        heading: 'When private transfer is the best fit',
        body:
          'Choose a private transfer when you want a vehicle planned before landing, direct routing to your address, and enough luggage space.',
        bullets: ['Family or group travel', 'Business schedules', 'Late arrivals or early departures'],
      },
      {
        heading: 'When public transport may work',
        body:
          'Public transport can be practical for light luggage, central destinations, and travellers who are comfortable changing lines or walking from the stop.',
      },
    ],
    faqs: [
      {
        question: 'Is a private transfer faster than the train?',
        answer: 'It depends on destination and traffic, but private transfer is door-to-door and avoids station changes.',
      },
      {
        question: 'Is taxi better than pre-booked transfer?',
        answer: 'A taxi can be convenient, but a pre-booked transfer is planned around luggage, passenger count, and destination before you land.',
      },
    ],
    related: [
      { label: 'Airport transfer service', href: '/services/barcelona-airport-transfer' },
      { label: 'Private driver vs taxi', href: '/answers/private-driver-vs-taxi-barcelona' },
      { label: 'Airport meet and greet', href: '/answers/barcelona-airport-meet-and-greet' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'private-driver-vs-taxi-barcelona',
    path: '/answers/private-driver-vs-taxi-barcelona',
    eyebrow: 'Answer',
    title: 'Private driver vs taxi in Barcelona: which should you choose?',
    seoTitle: 'Private Driver vs Taxi Barcelona | Which Option Fits Your Trip?',
    description:
      'Compare private driver and taxi options in Barcelona for airport transfers, business travel, events, hourly service, luggage, and multi-stop trips.',
    summary:
      'Private drivers are best for planned, multi-stop, luggage-heavy, or presentation-sensitive journeys; taxis suit simple on-demand city rides.',
    directAnswer:
      'Choose a private driver in Barcelona when you need a planned pickup, luggage capacity, multiple stops, hourly availability, business presentation, or airport timing. Choose a taxi for simple short city rides when immediate street availability matters more than advance planning.',
    image: '/img/services/hero.png',
    sections: [
      {
        heading: 'Private driver advantages',
        body:
          'A private driver is planned around the itinerary before the journey starts. That makes it stronger for business, airport arrivals, event timing, and families.',
        bullets: ['Advance pickup details', 'Vehicle fit for passengers and luggage', 'Hourly or multi-stop service'],
      },
      {
        heading: 'Taxi advantages',
        body:
          'Taxis are useful for spontaneous short trips when the route is simple, luggage is limited, and you do not need a specific vehicle or waiting time.',
      },
    ],
    faqs: [
      {
        question: 'Is a private driver always better than a taxi?',
        answer: 'No. A taxi can be better for simple spontaneous rides. A private driver is better when the journey needs planning.',
      },
      {
        question: 'Can a private driver wait between stops?',
        answer: 'Yes, waiting can be planned through hourly chauffeur service or a multi-stop booking.',
      },
    ],
    related: [
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
      { label: 'Hourly chauffeur Barcelona', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Chauffeur vs airport transfer', href: '/answers/chauffeur-service-vs-airport-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'book-chauffeur-barcelona-airport',
    path: '/answers/book-chauffeur-barcelona-airport',
    eyebrow: 'Answer',
    title: 'How do I book a chauffeur from Barcelona Airport?',
    seoTitle: 'How to Book a Chauffeur from Barcelona Airport | BCN Guide',
    description:
      'Step-by-step guide to booking a chauffeur from Barcelona Airport with flight details, pickup terminal, destination, passenger count, and luggage.',
    summary:
      'To book a chauffeur from Barcelona Airport, provide the flight number, date, arrival time, destination, passengers, luggage, and any special requests.',
    directAnswer:
      'To book a chauffeur from Barcelona Airport, request a quote with your flight number, date, arrival time, terminal if known, drop-off address, passenger count, luggage, and any child seat or vehicle preferences. STW Movers can then confirm availability and the right private transfer option.',
    image: '/img/contact/hero.png',
    sections: [
      {
        heading: 'Booking details to prepare',
        body:
          'The better the trip details, the better the quote. Flight number and destination are the most important details for airport chauffeur planning.',
        bullets: ['Flight number and arrival date', 'Drop-off address', 'Passenger and luggage count'],
      },
      {
        heading: 'After the quote request',
        body:
          'The team can confirm the route, vehicle fit, pickup timing, and next steps before the travel date.',
      },
    ],
    faqs: [
      {
        question: 'Do I need to know the terminal?',
        answer: 'Terminal details help, but flight number is often enough to plan the airport pickup.',
      },
      {
        question: 'Can I request a return chauffeur booking?',
        answer: 'Yes. Add the return date, pickup address, flight time, passengers, and luggage to the same request.',
      },
    ],
    related: [
      { label: 'Barcelona airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Airport chauffeur location', href: '/locations/barcelona-airport-chauffeur-service' },
      { label: 'Request a quote', href: '/journey#book-journey' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'barcelona-airport-meet-and-greet',
    path: '/answers/barcelona-airport-meet-and-greet',
    eyebrow: 'Answer',
    title: 'What is Barcelona airport meet-and-greet chauffeur service?',
    seoTitle: 'Barcelona Airport Meet and Greet Chauffeur Service',
    description:
      'Understand meet-and-greet chauffeur service at Barcelona Airport, including pickup planning, flight details, luggage, and private transfer handoff.',
    summary:
      'Meet-and-greet airport chauffeur service is designed to make arrivals clearer, especially for guests, families, and business travellers.',
    directAnswer:
      'Barcelona airport meet-and-greet chauffeur service means the arrival is planned before landing, with flight details, pickup instructions, passenger count, luggage, and destination confirmed in advance. It is useful for guests who want a smoother handoff into a private transfer.',
    image: '/img/services/quote.png',
    sections: [
      {
        heading: 'Who benefits most',
        body:
          'Meet-and-greet style planning is useful when travellers are unfamiliar with BCN, travelling with luggage, arriving for business, or being hosted by someone else.',
        bullets: ['First-time visitors', 'Executives and guests', 'Families and groups'],
      },
      {
        heading: 'What to confirm',
        body:
          'Confirm the flight details, destination, phone contact, passenger count, luggage, and any accessibility or child-seat requests before travel.',
      },
    ],
    faqs: [
      {
        question: 'Is meet-and-greet useful for business guests?',
        answer: 'Yes. It gives guests a more planned airport arrival and helps hosts avoid unclear pickup instructions.',
      },
      {
        question: 'Can meet-and-greet include hotel transfer?',
        answer: 'Yes. The service can be planned as an airport-to-hotel private transfer.',
      },
    ],
    related: [
      { label: 'Airport transfer service', href: '/services/barcelona-airport-transfer' },
      { label: 'Executive chauffeur', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Book airport chauffeur', href: '/answers/book-chauffeur-barcelona-airport' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'flight-delay-airport-transfer-barcelona',
    path: '/answers/flight-delay-airport-transfer-barcelona',
    eyebrow: 'Answer',
    title: 'What happens if my flight is delayed for a Barcelona airport transfer?',
    seoTitle: 'Flight Delay Barcelona Airport Transfer | What to Share',
    description:
      'Learn how flight delays affect Barcelona airport transfer planning and what information to share with a private chauffeur service.',
    summary:
      'Flight delays are easier to handle when your transfer request includes flight number, contact details, and clear destination information.',
    directAnswer:
      'If your flight is delayed, the most important detail is the flight number. A private airport transfer can be planned around updated arrival information when the booking includes flight details, passenger contact, destination, luggage, and any timing constraints after landing.',
    image: '/img/home/hero-6.webp',
    sections: [
      {
        heading: 'Why flight number matters',
        body:
          'The flight number connects the booking to the real arrival. It is the simplest detail for adjusting pickup planning when arrival time changes.',
        bullets: ['Arrival updates', 'Terminal context', 'More accurate pickup timing'],
      },
      {
        heading: 'What to do if your itinerary changes',
        body:
          'Contact the team as early as possible with updated flight details, passenger contact, and destination if the route changes.',
      },
    ],
    faqs: [
      {
        question: 'Should I share my flight number when booking?',
        answer: 'Yes. Flight number is one of the most useful details for airport transfer planning.',
      },
      {
        question: 'Can delays affect pickup timing?',
        answer: 'Yes. Arrival changes can affect pickup timing, waiting, and onward schedule planning.',
      },
    ],
    related: [
      { label: 'Airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Book chauffeur from BCN', href: '/answers/book-chauffeur-barcelona-airport' },
      { label: 'Airport transfer cost', href: '/answers/barcelona-airport-transfer-cost' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'chauffeur-for-business-travel-barcelona',
    path: '/answers/chauffeur-for-business-travel-barcelona',
    eyebrow: 'Answer',
    title: 'Why book a chauffeur for business travel in Barcelona?',
    seoTitle: 'Chauffeur for Business Travel Barcelona | Executive Transport Guide',
    description:
      'Learn when business travellers should book a chauffeur in Barcelona for airport arrivals, meetings, conferences, client visits, and events.',
    summary:
      'A business chauffeur supports punctuality, discretion, airport timing, meeting-to-meeting movement, and a better guest experience.',
    directAnswer:
      'Book a chauffeur for business travel in Barcelona when the itinerary includes fixed meetings, airport arrivals, client hosting, Fira events, multiple stops, or presentation-sensitive guests. A private chauffeur gives the schedule more control than relying on on-demand transport.',
    image: '/img/services/business.png',
    sections: [
      {
        heading: 'Best business use cases',
        body:
          'Business chauffeur service is strongest when the vehicle and timing are part of the professional experience.',
        bullets: ['Airport to meeting transfers', 'Client and board transport', 'Conference and dinner movement'],
      },
      {
        heading: 'What to share when booking',
        body:
          'Include flight details, meeting addresses, hotel locations, passenger names if useful, and any waiting time or multi-stop requirements.',
      },
    ],
    faqs: [
      {
        question: 'Can a chauffeur support multiple business meetings?',
        answer: 'Yes. Multi-stop business travel can be handled as hourly chauffeur service.',
      },
      {
        question: 'Can STW Movers transport business guests?',
        answer: 'Yes. Share guest count, pickup details, and itinerary notes for the quote.',
      },
    ],
    related: [
      { label: 'Executive chauffeur Barcelona', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Fira Barcelona chauffeur', href: '/locations/fira-barcelona-chauffeur-service' },
      { label: 'Executive business travel', href: '/executive-business-travel' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'family-airport-transfer-barcelona-luggage',
    path: '/answers/family-airport-transfer-barcelona-luggage',
    eyebrow: 'Answer',
    title: 'What is the best Barcelona airport transfer for families with luggage?',
    seoTitle: 'Barcelona Airport Transfer for Families with Luggage',
    description:
      'Guide to choosing a Barcelona airport transfer for families, luggage, child-seat requests, larger vehicles, hotel pickups, and private addresses.',
    summary:
      'Families should choose a transfer option that fits passengers, luggage, child-seat needs, arrival time, and the exact hotel or apartment address.',
    directAnswer:
      'The best Barcelona airport transfer for families with luggage is usually a pre-booked private transfer with the passenger count, luggage count, child-seat needs, and destination shared before travel. That helps match the vehicle to the family instead of guessing after landing.',
    image: '/img/home/fleet-section/mercedes-v-class.webp',
    sections: [
      {
        heading: 'Why vehicle fit matters',
        body:
          'Families often travel with suitcases, strollers, car seats, and tired passengers. Planning the vehicle before arrival avoids last-minute capacity problems.',
        bullets: ['Passenger count', 'Suitcases and stroller space', 'Child-seat requests when available'],
      },
      {
        heading: 'Good routes for families',
        body:
          'Private transfers are useful from BCN airport to hotels, apartments, cruise port, Sitges, Costa Brava, and resorts outside Barcelona.',
      },
    ],
    faqs: [
      {
        question: 'Should I mention stroller or bulky luggage?',
        answer: 'Yes. Bulky luggage can affect vehicle selection.',
      },
      {
        question: 'Can family transfers go outside Barcelona?',
        answer: 'Yes. Family transfers can be quoted for Barcelona and nearby destinations.',
      },
    ],
    related: [
      { label: 'Airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Mercedes chauffeur', href: '/services/mercedes-chauffeur-barcelona' },
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'hourly-private-driver-barcelona',
    path: '/answers/hourly-private-driver-barcelona',
    eyebrow: 'Answer',
    title: 'When should I book an hourly private driver in Barcelona?',
    seoTitle: 'Hourly Private Driver Barcelona | When to Book by the Hour',
    description:
      'Learn when hourly private driver service in Barcelona is better than single transfers for meetings, shopping, sightseeing, events, and multi-stop days.',
    summary:
      'Hourly private driver service is best when the car should stay available for waiting time, several stops, or flexible schedule changes.',
    directAnswer:
      'Book an hourly private driver in Barcelona when you need the vehicle to stay available between stops, meetings, shopping, sightseeing, dinners, or events. It is better than booking separate transfers when timing may change or when waiting time is part of the itinerary.',
    image: '/img/services/hourly.png',
    sections: [
      {
        heading: 'Hourly service use cases',
        body:
          'Hourly service fits journeys that are not a simple A-to-B transfer. It gives the day a single transport plan.',
        bullets: ['Meetings in different areas', 'Shopping and restaurant stops', 'Sightseeing with flexible timing'],
      },
      {
        heading: 'Information needed for a quote',
        body:
          'Share start time, pickup location, approximate duration, passenger count, and key stops. Exact minute-by-minute timing is not always needed.',
      },
    ],
    faqs: [
      {
        question: 'Is hourly chauffeur service available for sightseeing?',
        answer: 'Yes. Hourly service can support private sightseeing routes and flexible stops.',
      },
      {
        question: 'Is hourly service better than multiple transfers?',
        answer: 'It often is when there is waiting time, uncertainty, or several stops close together.',
      },
    ],
    related: [
      { label: 'Hourly chauffeur Barcelona', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
      { label: 'Private tours', href: '/tours' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'chauffeur-service-vs-airport-transfer',
    path: '/answers/chauffeur-service-vs-airport-transfer',
    eyebrow: 'Answer',
    title: 'What is the difference between chauffeur service and airport transfer?',
    seoTitle: 'Chauffeur Service vs Airport Transfer | Barcelona Guide',
    description:
      'Clear explanation of chauffeur service vs airport transfer in Barcelona, including hourly service, direct airport rides, waiting, and multi-stop bookings.',
    summary:
      'An airport transfer is usually a direct airport journey. Chauffeur service can include hourly availability, waiting, multiple stops, and broader itinerary support.',
    directAnswer:
      'An airport transfer is normally a direct journey to or from the airport. Chauffeur service is broader and can include hourly availability, waiting time, multiple stops, business travel, events, and private itinerary support. The right choice depends on whether the trip is simple or flexible.',
    image: '/img/services/intro.png',
    sections: [
      {
        heading: 'Choose airport transfer for simple airport routes',
        body:
          'If the trip is BCN airport to hotel, hotel to airport, or airport to cruise port, an airport transfer page usually matches the intent.',
      },
      {
        heading: 'Choose chauffeur service for broader support',
        body:
          'If the vehicle should wait, continue to meetings, handle multiple stops, or support a full day, chauffeur service is the better fit.',
        bullets: ['Hourly service', 'Business travel', 'Events and guest transport'],
      },
    ],
    faqs: [
      {
        question: 'Can a chauffeur service start at the airport?',
        answer: 'Yes. A chauffeur booking can start with an airport pickup and continue into hourly or multi-stop service.',
      },
      {
        question: 'Is airport transfer cheaper than chauffeur service?',
        answer: 'A direct transfer may cost less than hourly chauffeur service because it involves less waiting and fewer stops.',
      },
    ],
    related: [
      { label: 'Airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Private driver', href: '/services/private-driver-barcelona' },
      { label: 'Private driver vs taxi', href: '/answers/private-driver-vs-taxi-barcelona' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
]

const competitorServicePages: GrowthPage[] = [
  {
    kind: 'service',
    slug: 'cab-service-barcelona',
    path: '/services/cab-service-barcelona',
    eyebrow: 'Cab service Barcelona',
    title: 'Cab Service Barcelona Alternative',
    seoTitle: 'Cab Service Barcelona Alternative | Private Chauffeur Transfer',
    description:
      'Private chauffeur alternative for travellers searching cab service Barcelona, airport cab, private cab, taxi, or private driver options.',
    summary:
      'STW Movers matches cab-service intent with a pre-booked private chauffeur experience for airport, hotel, business, family, and event travel.',
    directAnswer:
      'STW Movers is a cab service alternative in Barcelona for travellers who want a private chauffeur planned before pickup. It is useful for airport cab searches, hotel transfers, business guests, cruise port trips, and families with luggage who want a more polished option than an on-demand cab.',
    image: '/img/services/hourly.png',
    sections: [
      {
        heading: 'Use cab language without weakening the premium offer',
        body:
          'Barcelona visitors often use cab and taxi wording for the same need: a reliable ride. STW should capture that language while making the distinction clear: this is a pre-booked private chauffeur and transfer service.',
        bullets: ['Cab service Barcelona', 'Airport cab BCN', 'Private cab Barcelona'],
      },
      {
        heading: 'Best cab alternative use cases',
        body:
          'The service is strongest when travellers need route planning, luggage fit, fixed pickup details, or a better arrival impression than a standard cab ride.',
        bullets: ['BCN airport to hotel', 'Cruise port transfers', 'Business and family transport'],
      },
    ],
    faqs: [
      {
        question: 'Is STW Movers a regular cab company?',
        answer:
          'No. STW Movers is a pre-booked private chauffeur and transfer service for travellers comparing cab, taxi, airport transfer, and private driver options.',
      },
      {
        question: 'Why target cab service Barcelona?',
        answer:
          'Many English-speaking travellers use cab wording in search. Targeting it helps STW appear for the same transport intent while offering a premium private option.',
      },
      {
        question: 'Can I request a cab-style point-to-point ride?',
        answer:
          'Yes. Request a private quote with pickup, destination, date, time, passengers, and luggage so the route can be planned.',
      },
    ],
    related: [
      { label: 'Cab landing page', href: '/cab-service-barcelona' },
      { label: 'Cab vs chauffeur answer', href: '/answers/barcelona-cab-service-vs-chauffeur' },
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
    ],
    sources: [officialVtcSource, stwServiceCatalogSource, stwPricingSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'barcelona-airport-taxi-alternative',
    path: '/services/barcelona-airport-taxi-alternative',
    eyebrow: 'Airport taxi alternative',
    title: 'Barcelona Airport Taxi Alternative',
    seoTitle: 'Barcelona Airport Taxi Alternative | Private BCN Chauffeur',
    description:
      'Premium Barcelona airport taxi alternative for travellers comparing BCN airport taxi, airport cab, private driver, and chauffeur transfer options.',
    summary:
      'STW Movers is strongest when an airport journey needs advance planning, luggage-aware vehicle fit, clear pickup details, and a more polished arrival than a taxi queue.',
    directAnswer:
      'STW Movers is a Barcelona airport taxi alternative for travellers who want a pre-booked private chauffeur instead of deciding transport after landing. It fits BCN airport arrivals, hotel transfers, cruise port connections, families with luggage, business guests, and travellers who want pickup details confirmed before travel.',
    image: '/img/services/airport.png',
    sections: [
      {
        heading: 'Built for airport taxi and cab searches',
        body:
          'Many visitors search for airport taxi Barcelona, BCN airport cab, or Barcelona airport transfer because they want a direct ride after landing. This page answers that intent while positioning STW Movers as the premium pre-booked option.',
        bullets: ['BCN Terminal 1 and Terminal 2', 'Airport to hotel, office, apartment, or cruise port', 'Private quote before travel'],
      },
      {
        heading: 'When to choose STW Movers over the airport rank',
        body:
          'A standard taxi can work for simple trips. A private chauffeur is stronger when the journey includes luggage, hosted guests, fixed timing, vehicle preference, or a premium first impression.',
        bullets: ['Business arrivals and VIP guests', 'Families with suitcases or strollers', 'Late arrivals, early departures, and cruise connections'],
      },
      {
        heading: 'What to send for the fastest quote',
        body:
          'Send flight number, arrival date, destination, passengers, luggage, and any child-seat or extra-stop needs. That lets the team quote the trip around the real itinerary rather than a generic route.',
      },
    ],
    faqs: [
      {
        question: 'Is STW Movers the same as an official Barcelona airport taxi?',
        answer:
          'No. STW Movers is a pre-booked private chauffeur and transfer service. It is relevant for travellers searching airport taxi or airport cab who want a more planned private transfer.',
      },
      {
        question: 'Can I use this instead of waiting at the BCN airport taxi queue?',
        answer:
          'Yes. Request a private quote before travel so pickup details, destination, passenger count, and luggage needs can be reviewed in advance.',
      },
      {
        question: 'Does this page cover both airport taxi and cab wording?',
        answer:
          'Yes. Barcelona travellers use airport taxi, airport cab, private cab, private driver, and airport transfer language for similar intent.',
      },
    ],
    related: [
      { label: 'Barcelona airport transfer', href: '/services/barcelona-airport-transfer' },
      { label: 'Airport taxi cost answer', href: '/answers/barcelona-airport-taxi-cost-2026' },
      { label: 'Taxi vs private transfer', href: '/answers/private-driver-vs-taxi-barcelona' },
    ],
    sources: [officialAirportSource, officialTaxiFareSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'barcelona-van-transfer',
    lastUpdated: '2026-10-07',
    path: '/services/barcelona-van-transfer',
    eyebrow: 'Barcelona van transfer',
    title: 'Barcelona Van Transfer for Groups and Luggage',
    seoTitle: 'Barcelona Van Transfer | Private Group Airport Transfer',
    description:
      'Private Barcelona van transfer for airport arrivals, groups, families, cruise passengers, luggage, events, and city-to-city routes.',
    summary:
      'Barcelona van transfer service is for travellers who need more luggage room, group seating, or a single private vehicle instead of splitting into multiple taxis.',
    directAnswer:
      'A Barcelona van transfer is best for families, groups, cruise guests, and airport arrivals with luggage. STW Movers can quote a private chauffeur transfer around passengers, suitcases, pickup point, destination, and timing so travellers do not need to split into separate taxis or cabs.',
    image: '/img/home/fleet-section/mercedes-v-class.webp',
    sections: [
      {
        heading: 'Match the vehicle to passengers and luggage',
        body:
          'A seat count alone does not establish luggage capacity. Send the number of adults and children, large suitcases, cabin bags, pushchairs and any bulky equipment. Ask for confirmation that the available vehicle fits the whole group before accepting a quote.',
        bullets: ['Group airport transfers', 'Cruise port luggage transfers', 'Family hotel and resort routes'],
      },
      {
        heading: 'One vehicle plan instead of two uncertain rides',
        body:
          'Groups often compare vans because luggage and passenger count decide the trip. Pre-booking allows vehicle fit to be discussed before the travel day.',
      },
      {
        heading: 'Child seats and accessibility requests',
        body: 'Mention child-seat and accessibility needs when requesting the quote. Provide the relevant seat requirements and whether mobility equipment must remain occupied during travel. Do not assume a larger vehicle is wheelchair accessible; request explicit confirmation of suitability and availability.',
      },
    ],
    faqs: [
      {
        question: 'Can I request a larger private vehicle in Barcelona?',
        answer:
          'Yes. Share passenger and luggage count so STW Movers can quote the right available vehicle class for the route.',
      },
      {
        question: 'Is a van transfer better than two taxis?',
        answer:
          'For families or groups with luggage, one planned vehicle can be simpler than splitting passengers, luggage, and timing across two separate taxis.',
      },
      {
        question: 'Can van transfers go outside Barcelona?',
        answer:
          'Yes. Van-style private transfers can be quoted for Sitges, Costa Brava, Girona, Tarragona, and other city-to-city routes when available.',
      },
    ],
    related: [
      { label: 'Family airport transfer answer', href: '/answers/family-airport-transfer-barcelona-luggage' },
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
      { label: 'Barcelona airport transfer', href: '/services/barcelona-airport-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'service',
    slug: 'family-airport-transfer-barcelona',
    path: '/services/family-airport-transfer-barcelona',
    eyebrow: 'Family airport transfer',
    title: 'Family Airport Transfer in Barcelona',
    seoTitle: 'Family Airport Transfer Barcelona | Private Transfer with Luggage',
    description:
      'Private family airport transfer in Barcelona for parents, children, luggage, strollers, child-seat requests, hotels, cruise port, and coastal routes.',
    summary:
      'Family airport transfer is for travellers who want passenger count, luggage, stroller space, and timing planned before landing at BCN.',
    directAnswer:
      'A family airport transfer in Barcelona should be booked with passenger count, child ages if relevant, luggage, stroller space, flight number, and destination. STW Movers can quote a private transfer option so the family has a planned pickup rather than waiting to see which taxi or cab is available.',
    image: '/img/home/fleet-section/mercedes-v-class.webp',
    sections: [
      {
        heading: 'Family details change the vehicle decision',
        body:
          'Suitcases, stroller space, child-seat requests, and tired travellers make the transfer different from a short city taxi ride.',
        bullets: ['BCN airport to family hotel', 'Airport to apartment or villa', 'Cruise port and return airport transfers'],
      },
      {
        heading: 'Ask before travel, not after landing',
        body:
          'The quote request should include the number of adults, children, suitcases, strollers, and the destination address. That is the information a transfer team needs to plan vehicle fit.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers handle family luggage?',
        answer:
          'Family luggage can be planned when passenger and suitcase count are included in the quote request.',
      },
      {
        question: 'Should I mention child-seat needs?',
        answer:
          'Yes. Child-seat or booster requests should be added before booking so availability can be confirmed.',
      },
      {
        question: 'Is this useful for airport to cruise port?',
        answer:
          'Yes. Family airport-to-cruise and cruise-to-airport routes are strong use cases because luggage and timing matter.',
      },
    ],
    related: [
      { label: 'Family luggage answer', href: '/answers/family-airport-transfer-barcelona-luggage' },
      { label: 'Barcelona van transfer', href: '/services/barcelona-van-transfer' },
      { label: 'Airport transfer service', href: '/services/barcelona-airport-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
]

const competitorLocationPages: GrowthPage[] = [
  {
    kind: 'location',
    slug: 'barcelona-airport-to-city-centre-private-transfer',
    path: '/locations/barcelona-airport-to-city-centre-private-transfer',
    eyebrow: 'Airport to city centre',
    title: 'Barcelona Airport to City Centre Private Transfer',
    seoTitle: 'Barcelona Airport to City Centre Transfer | Private Chauffeur',
    description:
      'Private transfer from Barcelona Airport to the city centre, hotels, Eixample, Gothic Quarter, Sants, and business districts.',
    summary:
      'This route page targets BCN airport to Barcelona city centre searches, including airport taxi, cab, private transfer, and hotel arrival intent.',
    directAnswer:
      'Barcelona Airport to the city centre can be handled by taxi, public transport, app ride, or pre-booked private transfer. STW Movers is the premium option when travellers want direct hotel drop-off, luggage planning, private chauffeur presentation, and pickup details reviewed before arrival.',
    image: '/img/services/airport.png',
    sections: [
      {
        heading: 'Useful city-centre drop-offs',
        body:
          'Common arrival areas include Eixample, Gothic Quarter, Passeig de Gracia, Sants, Barceloneta, Poblenou, and business hotels.',
        bullets: ['Airport to hotel', 'Airport to apartment', 'Airport to meeting or event venue'],
      },
      {
        heading: 'Why this deserves its own page',
        body:
          'Competitors win many airport routes by giving each destination a clear page. This page gives STW a dedicated answer for the highest-volume city-centre route.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers take travellers from BCN Airport to central Barcelona?',
        answer:
          'Yes. Share terminal or flight details, destination address, passengers, and luggage to request a private transfer quote.',
      },
      {
        question: 'Is this different from an airport taxi?',
        answer:
          'Yes. STW Movers is pre-booked and planned before travel; an airport taxi is usually chosen at the rank after arrival.',
      },
    ],
    related: [
      { label: 'Best way from BCN Airport', href: '/answers/best-way-from-bcn-airport-to-barcelona' },
      { label: 'Airport transfer service', href: '/services/barcelona-airport-transfer' },
      { label: 'Eixample chauffeur service', href: '/locations/eixample-chauffeur-service' },
    ],
    sources: [officialAirportSource, officialVtcSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-airport-to-cruise-port-private-transfer',
    path: '/locations/barcelona-airport-to-cruise-port-private-transfer',
    eyebrow: 'Airport to cruise port',
    title: 'Barcelona Airport to Cruise Port Private Transfer',
    seoTitle: 'Barcelona Airport to Cruise Port Transfer | Private Chauffeur',
    description:
      'Private transfer from Barcelona Airport to the cruise port for guests with luggage, families, groups, and fixed embarkation schedules.',
    summary:
      'Barcelona airport to cruise port transfer is a high-intent route where luggage, timing, terminal information, and vehicle fit matter.',
    directAnswer:
      'A Barcelona Airport to cruise port private transfer is best when travellers have luggage, a ship boarding window, family or group needs, and want the route planned before landing. STW Movers can quote the transfer with flight number, cruise details, passengers, luggage, and timing.',
    image: '/img/contact/destination-sunset.png',
    sections: [
      {
        heading: 'Two timing systems in one trip',
        body:
          'Airport-to-cruise travel depends on flight arrival and ship boarding. A planned transfer helps align both parts of the day.',
        bullets: ['BCN airport to Moll Adossat area', 'Family and group cruise arrivals', 'Airport arrival with luggage'],
      },
      {
        heading: 'Details that improve the quote',
        body:
          'Send flight number, ship name, cruise terminal if known, passenger count, luggage count, and preferred pickup timing.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers transfer from BCN airport to the cruise port?',
        answer:
          'Yes. Airport-to-cruise transfer can be quoted when flight and ship details are shared in advance.',
      },
      {
        question: 'Can this work for groups with cruise luggage?',
        answer:
          'Yes. Share passenger and suitcase count so vehicle fit can be planned before travel.',
      },
    ],
    related: [
      { label: 'Cruise port transfer service', href: '/services/barcelona-cruise-port-transfer' },
      { label: 'Barcelona van transfer', href: '/services/barcelona-van-transfer' },
      { label: 'Cruise port chauffeur', href: '/locations/barcelona-cruise-port-chauffeur-service' },
    ],
    sources: [officialAirportSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-to-girona-private-transfer',
    path: '/locations/barcelona-to-girona-private-transfer',
    eyebrow: 'Barcelona to Girona',
    title: 'Barcelona to Girona Private Transfer',
    seoTitle: 'Barcelona to Girona Private Transfer | Chauffeur Route',
    description:
      'Private transfer between Barcelona, BCN Airport, cruise port, and Girona for hotels, events, families, business travel, and luggage.',
    summary:
      'Barcelona to Girona private transfer targets long-distance taxi and private driver searches where travellers want door-to-door comfort.',
    image: '/img/home/optimized/location-begur.webp',
    sections: [
      {
        heading: 'Door-to-door route planning',
        body:
          'Girona routes are a strong fit for private transfer because luggage, station changes, and exact destination access can complicate public transport.',
        bullets: ['Barcelona hotel to Girona', 'BCN airport to Girona', 'Cruise port to Girona'],
      },
      {
        heading: 'Quote details',
        body:
          'Share full pickup and destination addresses, passengers, luggage, date, time, and whether the trip should include a stop.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers quote Barcelona to Girona?',
        answer:
          'Yes. Barcelona to Girona can be quoted as a private city-to-city chauffeur transfer.',
      },
      {
        question: 'Can this route start at BCN Airport?',
        answer:
          'Yes. BCN Airport to Girona is a relevant private transfer route when flight and luggage details are shared.',
      },
    ],
    related: [
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
      { label: 'Barcelona to Costa Brava', href: '/locations/costa-brava-private-transfer' },
      { label: 'Airport transfer', href: '/services/barcelona-airport-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-to-tarragona-private-transfer',
    path: '/locations/barcelona-to-tarragona-private-transfer',
    eyebrow: 'Barcelona to Tarragona',
    title: 'Barcelona to Tarragona Private Transfer',
    seoTitle: 'Barcelona to Tarragona Private Transfer | STW Movers',
    description:
      'Private transfer from Barcelona to Tarragona, Salou, Costa Dorada, hotels, cruise links, resorts, and city-to-city routes.',
    summary:
      'Barcelona to Tarragona private transfer is for travellers comparing taxi, cab, train, and chauffeur options for a planned long-distance route.',
    image: '/img/home/optimized/location-costa-brava.webp',
    sections: [
      {
        heading: 'Useful for Costa Dorada routes',
        body:
          'Tarragona and nearby resort journeys often involve luggage, families, and exact hotel or villa addresses. A private quote can plan the vehicle and route before travel.',
        bullets: ['Barcelona to Tarragona', 'BCN airport to Tarragona', 'Barcelona to Salou and Costa Dorada'],
      },
      {
        heading: 'A long-distance taxi alternative',
        body:
          'Travellers may search taxi Barcelona Tarragona, private cab, or airport transfer. STW Movers should answer that route as a pre-booked private chauffeur option.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers quote Barcelona to Tarragona?',
        answer:
          'Yes. Share the pickup point, destination, travel date, passengers, and luggage for a route quote.',
      },
      {
        question: 'Can this route include Salou or Costa Dorada?',
        answer:
          'Yes. Nearby Costa Dorada destinations can be included in a custom private transfer request.',
      },
    ],
    related: [
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
      { label: 'Family airport transfer', href: '/services/family-airport-transfer-barcelona' },
      { label: 'Barcelona van transfer', href: '/services/barcelona-van-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
]

const phaseThreeRouteLocationPages: GrowthPage[] = [
  {
    kind: 'location',
    slug: 'barcelona-airport-to-eixample-private-transfer',
    path: '/locations/barcelona-airport-to-eixample-private-transfer',
    eyebrow: 'Airport to Eixample',
    title: 'Barcelona Airport to Eixample Private Transfer',
    seoTitle: 'Barcelona Airport to Eixample Transfer | Private Chauffeur',
    description:
      'Private transfer from Barcelona Airport to Eixample hotels, apartments, clinics, offices, and 08015 addresses with luggage-aware planning.',
    summary:
      'This route page targets BCN airport to Eixample searches for travellers comparing airport taxi, airport cab, and private chauffeur options.',
    directAnswer:
      'A Barcelona Airport to Eixample private transfer is best when travellers want direct hotel or apartment drop-off, luggage planning, and pickup details confirmed before landing. STW Movers can quote the route with flight number, destination address, passengers, luggage, and timing.',
    image: '/img/about/hero.png',
    sections: [
      {
        heading: 'A high-intent airport-to-hotel route',
        body:
          'Eixample is one of Barcelona’s strongest arrival zones for hotels, serviced apartments, clinics, restaurants, and offices. A private transfer is useful when the final address and luggage matter.',
        bullets: ['BCN airport to Eixample hotels', 'Airport to 08015 and central addresses', 'Family, business, and luggage-heavy arrivals'],
      },
      {
        heading: 'What to send for the quote',
        body:
          'Share flight number, terminal if known, destination address, passenger count, suitcase count, and any child-seat or waiting needs.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers take travellers from BCN Airport to Eixample?',
        answer:
          'Yes. STW Movers can quote private transfers from Barcelona Airport to Eixample hotels, apartments, offices, and private addresses.',
      },
      {
        question: 'Is this route a good airport taxi alternative?',
        answer:
          'Yes. It is a good alternative when travellers want planned pickup, luggage fit, and direct support before landing.',
      },
    ],
    related: [
      { label: 'Eixample chauffeur service', href: '/locations/eixample-chauffeur-service' },
      { label: '08015 chauffeur page', href: '/chauffeur-service-barcelona-08015' },
      { label: 'Airport taxi alternative', href: '/services/barcelona-airport-taxi-alternative' },
    ],
    sources: [officialAirportSource, officialVtcSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-airport-to-gothic-quarter-private-transfer',
    path: '/locations/barcelona-airport-to-gothic-quarter-private-transfer',
    eyebrow: 'Airport to Gothic Quarter',
    title: 'Barcelona Airport to Gothic Quarter Private Transfer',
    seoTitle: 'Barcelona Airport to Gothic Quarter Transfer | STW Movers',
    description:
      'Private transfer from BCN Airport to the Gothic Quarter with access-aware pickup planning for old-city hotels, apartments, luggage, and families.',
    summary:
      'Airport to Gothic Quarter transfers need clear final-address planning because pedestrian streets and access rules can affect the best drop-off point.',
    directAnswer:
      'A Barcelona Airport to Gothic Quarter private transfer is useful when travellers want the drop-off point planned before arrival. Some old-city streets are narrow or restricted, so STW Movers can quote the trip around the hotel or apartment address, luggage, passengers, and practical meeting point.',
    image: '/img/home/optimized/journey-gothic.webp',
    sections: [
      {
        heading: 'Old-city access needs planning',
        body:
          'The Gothic Quarter is central and historic, but some addresses require a nearby meeting or drop-off point. Planning this before landing reduces friction after a long flight.',
        bullets: ['Airport to old-city hotels', 'Apartment and restaurant drop-offs', 'Luggage-aware arrival planning'],
      },
      {
        heading: 'When private transfer beats improvising',
        body:
          'Choose private transfer when you have luggage, children, late arrival timing, business guests, or a hotel entrance that should be understood before pickup.',
      },
    ],
    faqs: [
      {
        question: 'Can the chauffeur drop off inside the Gothic Quarter?',
        answer:
          'Access depends on the exact street. STW Movers can help plan a practical nearby drop-off point when direct access is restricted.',
      },
      {
        question: 'Should I send the hotel name or full address?',
        answer:
          'Send both when possible. The full address helps the team review access and pickup or drop-off instructions.',
      },
    ],
    related: [
      { label: 'Gothic Quarter chauffeur service', href: '/locations/gothic-quarter-chauffeur-service' },
      { label: 'Best way from BCN Airport', href: '/answers/best-way-from-bcn-airport-to-barcelona' },
      { label: 'Airport transfer service', href: '/services/barcelona-airport-transfer' },
    ],
    sources: [officialAirportSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-airport-to-fira-private-transfer',
    path: '/locations/barcelona-airport-to-fira-private-transfer',
    eyebrow: 'Airport to Fira',
    title: 'Barcelona Airport to Fira Private Transfer',
    seoTitle: 'Barcelona Airport to Fira Transfer | Executive Chauffeur',
    description:
      'Private executive transfer from Barcelona Airport to Fira Barcelona venues, hotels, meetings, trade shows, and conference schedules.',
    summary:
      'Airport to Fira transfer pages support business visitors searching for taxi, cab, airport transfer, and executive chauffeur options.',
    directAnswer:
      'A Barcelona Airport to Fira private transfer is best for exhibitors, speakers, executives, and hosted guests who need airport timing connected to an event schedule. STW Movers can quote the route with flight details, venue or hotel address, passenger count, luggage, and meeting time.',
    image: '/img/services/events.png',
    sections: [
      {
        heading: 'Built for event-day pressure',
        body:
          'Fira travel is often time-sensitive. The route may include airport arrival, hotel check-in, badge pickup, meetings, dinner, or return transfers after the event.',
        bullets: ['BCN airport to Fira Gran Via', 'Airport to Fira Montjuic hotels', 'Executive guest and speaker transfers'],
      },
      {
        heading: 'A business-grade taxi alternative',
        body:
          'A standard cab can work, but private chauffeur planning is stronger when punctuality, guest presentation, and itinerary continuity matter.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers support Fira Barcelona event arrivals?',
        answer:
          'Yes. Airport-to-Fira and hotel-to-Fira transfers can be quoted for executives, teams, exhibitors, and guests.',
      },
      {
        question: 'Can this route continue to dinner or another meeting?',
        answer:
          'Yes. Add extra stops or waiting needs to the request so the trip can be quoted as transfer or hourly chauffeur service.',
      },
    ],
    related: [
      { label: 'Fira Barcelona chauffeur', href: '/locations/fira-barcelona-chauffeur-service' },
      { label: 'Executive chauffeur Barcelona', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Business chauffeur answer', href: '/answers/chauffeur-for-business-travel-barcelona' },
    ],
    sources: [officialAirportSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-cruise-port-to-airport-private-transfer',
    path: '/locations/barcelona-cruise-port-to-airport-private-transfer',
    eyebrow: 'Cruise port to airport',
    title: 'Barcelona Cruise Port to Airport Private Transfer',
    seoTitle: 'Barcelona Cruise Port to Airport Transfer | Private Chauffeur',
    description:
      'Private transfer from Barcelona cruise port to BCN Airport for disembarkation, luggage, family groups, flight timing, and return travel.',
    summary:
      'Cruise port to airport transfer targets guests who need luggage-aware timing from ship disembarkation to BCN departure.',
    directAnswer:
      'A Barcelona cruise port to airport private transfer is useful when guests have luggage, family or group needs, and a flight time after disembarkation. STW Movers can quote the route with ship details, pickup time, passengers, luggage, flight number, and terminal if known.',
    image: '/img/contact/destination-sunset.png',
    sections: [
      {
        heading: 'Plan the handoff after disembarkation',
        body:
          'Cruise departures can create timing pressure because guests move from ship, luggage area, vehicle pickup, and airport check-in in the same morning.',
        bullets: ['Cruise terminal to BCN Terminal 1 or 2', 'Family and group luggage support', 'Return airport transfer planning'],
      },
      {
        heading: 'Avoid splitting luggage across vehicles',
        body:
          'Families and groups often need one planned vehicle rather than trying to solve passenger and suitcase capacity at the port.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers pick up from Barcelona cruise terminals?',
        answer:
          'Yes. Share ship, terminal if known, pickup time, passengers, luggage, and flight details for the quote.',
      },
      {
        question: 'Can this work for early flights?',
        answer:
          'Early flights should be discussed in advance so pickup timing and route buffer can be planned realistically.',
      },
    ],
    related: [
      { label: 'Cruise port chauffeur', href: '/locations/barcelona-cruise-port-chauffeur-service' },
      { label: 'Airport to cruise port route', href: '/locations/barcelona-airport-to-cruise-port-private-transfer' },
      { label: 'Barcelona van transfer', href: '/services/barcelona-van-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-to-salou-private-transfer',
    path: '/locations/barcelona-to-salou-private-transfer',
    eyebrow: 'Barcelona to Salou',
    title: 'Barcelona to Salou Private Transfer',
    seoTitle: 'Barcelona to Salou Private Transfer | Chauffeur Route',
    description:
      'Private transfer from Barcelona, BCN Airport, or cruise port to Salou and Costa Dorada hotels, resorts, villas, and family destinations.',
    summary:
      'Barcelona to Salou is a family and resort route where travellers often compare taxi, cab, train, van transfer, and private chauffeur options.',
    directAnswer:
      'A Barcelona to Salou private transfer is useful for families, resort guests, airport arrivals, cruise passengers, and travellers with luggage who want door-to-door transport. STW Movers can quote the route from Barcelona city, BCN Airport, or cruise port with passenger and luggage details.',
    image: '/img/home/optimized/location-costa-brava.webp',
    sections: [
      {
        heading: 'A Costa Dorada route for families and resorts',
        body:
          'Salou trips often involve suitcases, children, hotel check-in timing, and a longer road journey. Pre-booking helps match the right vehicle and route.',
        bullets: ['Barcelona city to Salou', 'BCN airport to Salou', 'Cruise port to Costa Dorada resorts'],
      },
      {
        heading: 'Quote the real route',
        body:
          'Send the exact resort, hotel, or villa address plus date, time, passengers, luggage, and any child-seat or stop requests.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers quote Barcelona to Salou?',
        answer:
          'Yes. Barcelona to Salou can be quoted as a private city-to-city chauffeur transfer.',
      },
      {
        question: 'Can this route start at BCN Airport?',
        answer:
          'Yes. BCN Airport to Salou is a relevant private transfer request for families and resort guests.',
      },
    ],
    related: [
      { label: 'Barcelona to Tarragona', href: '/locations/barcelona-to-tarragona-private-transfer' },
      { label: 'Family airport transfer', href: '/services/family-airport-transfer-barcelona' },
      { label: 'Barcelona van transfer', href: '/services/barcelona-van-transfer' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'location',
    slug: 'barcelona-airport-to-sants-station-private-transfer',
    path: '/locations/barcelona-airport-to-sants-station-private-transfer',
    eyebrow: 'Airport to Sants Station',
    title: 'Barcelona Airport to Sants Station Private Transfer',
    seoTitle: 'Barcelona Airport to Sants Station Transfer | STW Movers',
    description:
      'Private transfer from BCN Airport to Barcelona Sants Station with luggage planning, timing buffer, and onward train connection support.',
    summary:
      'Airport to Sants Station supports travellers connecting between flights, hotels, trains, luggage, and city routes.',
    directAnswer:
      'A Barcelona Airport to Sants Station private transfer is useful when travellers have luggage, a train connection, family needs, or a schedule that should not depend on airport taxi queues. STW Movers can quote the route with flight number, train timing, passengers, and luggage.',
    image: '/img/home/optimized/journey-montjuic.webp',
    sections: [
      {
        heading: 'Useful for flight-to-train connections',
        body:
          'Sants Station journeys often require timing buffer. A private transfer can account for arrival time, luggage, and onward train departure pressure.',
        bullets: ['BCN Airport to Barcelona Sants', 'Sants Station to airport return', 'Hotel, train, and airport combinations'],
      },
      {
        heading: 'What improves the transfer plan',
        body:
          'Include flight number, pickup time, train departure if relevant, passengers, suitcases, and whether the route includes a hotel stop.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers transfer from BCN Airport to Sants Station?',
        answer:
          'Yes. Airport-to-Sants transfers can be quoted with flight, luggage, and train timing details.',
      },
      {
        question: 'Is this better than taking public transport?',
        answer:
          'Public transport can work with light luggage and flexible timing. Private transfer is stronger when luggage, family travel, or a connection schedule matters.',
      },
    ],
    related: [
      { label: 'Sants-Montjuic chauffeur service', href: '/locations/sants-montjuic-chauffeur-service' },
      { label: 'Airport transfer service', href: '/services/barcelona-airport-transfer' },
      { label: 'Best way from BCN Airport', href: '/answers/best-way-from-bcn-airport-to-barcelona' },
    ],
    sources: [officialAirportSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
]

const competitorAnswerPages: GrowthPage[] = [
  {
    kind: 'answer',
    slug: 'barcelona-airport-taxi-cost-2026',
    path: '/answers/barcelona-airport-taxi-cost-2026',
    eyebrow: 'Answer',
    title: 'How much is a Barcelona airport taxi in 2026?',
    seoTitle: 'Barcelona Airport Taxi Cost 2026 | Taxi vs Private Transfer',
    description:
      'Understand Barcelona airport taxi cost in 2026, official taxi fare context, airport supplements, and when a private transfer quote is better.',
    summary:
      'Official Barcelona taxis use regulated fares and airport supplements; private chauffeur transfers are quoted separately from taxi-meter pricing.',
    directAnswer:
      'Barcelona airport taxi pricing is regulated through metropolitan taxi tariffs, including base fares, per-kilometre rates, supplements, and airport minimums. STW Movers does not use a taxi meter; it provides private chauffeur quotes based on route, vehicle fit, timing, passengers, luggage, waiting, and extra stops.',
    image: '/img/services/airport.png',
    sections: [
      {
        heading: 'Use official fare data for taxi questions',
        body:
          'For taxi-meter pricing, travellers should check official AMB tariff information. STW Movers should cite official taxi rules rather than inventing taxi prices.',
        bullets: ['Taxi meter fares are regulated', 'Airport trips can include supplements or minimums', 'Private chauffeur quotes are separate from taxi-meter pricing'],
      },
      {
        heading: 'When a private quote is more useful',
        body:
          'A private quote is more relevant when passengers want a planned vehicle, luggage fit, airport-to-cruise timing, business presentation, family travel, or a city-to-city route.',
      },
    ],
    faqs: [
      {
        question: 'Does STW Movers charge the official taxi fare?',
        answer:
          'No. STW Movers is a private chauffeur and transfer service, so pricing is quoted from the route and service details rather than a taxi meter.',
      },
      {
        question: 'Should I compare taxi fare and private transfer quote?',
        answer:
          'Yes. Compare both when the trip involves airport timing, luggage, family needs, business presentation, or a route outside central Barcelona.',
      },
      {
        question: 'Where should travellers verify official taxi tariffs?',
        answer:
          'Travellers should use AMB official taxi tariff information for regulated Barcelona taxi-meter fares.',
      },
    ],
    related: [
      { label: 'Airport taxi alternative', href: '/services/barcelona-airport-taxi-alternative' },
      { label: 'Airport transfer cost guide', href: '/answers/barcelona-airport-transfer-cost' },
      { label: 'Private driver vs taxi', href: '/answers/private-driver-vs-taxi-barcelona' },
    ],
    sources: [officialTaxiFareSource, officialAirportSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'barcelona-taxi-app-or-private-transfer',
    path: '/answers/barcelona-taxi-app-or-private-transfer',
    eyebrow: 'Answer',
    title: 'Should I use a Barcelona taxi app or book a private transfer?',
    seoTitle: 'Barcelona Taxi App or Private Transfer | Which to Choose?',
    description:
      'Compare Barcelona taxi apps, official taxis, airport cabs, private transfers, and chauffeur service for airport, hotel, business, and family trips.',
    summary:
      'Taxi apps are useful for on-demand city rides; private transfers are stronger when the journey needs planning before pickup.',
    directAnswer:
      'Use a Barcelona taxi app or official taxi for simple on-demand city rides. Book a private transfer when the trip involves airport timing, luggage, children, business guests, cruise port connections, a larger vehicle, multiple stops, or a premium arrival experience that should be planned before travel.',
    image: '/img/services/hero.png',
    sections: [
      {
        heading: 'Good fit for taxi apps',
        body:
          'Taxi apps and official city taxis can be practical for short city rides when immediate availability and regulated taxi service are the priority.',
        bullets: ['Simple city rides', 'Light luggage', 'Flexible timing'],
      },
      {
        heading: 'Good fit for private transfer',
        body:
          'Private transfer is the stronger answer when the journey should be planned before pickup and the vehicle experience matters.',
        bullets: ['Airport and cruise routes', 'Business guests', 'Families, groups, and luggage'],
      },
    ],
    faqs: [
      {
        question: 'Are taxi apps available at Barcelona Airport?',
        answer:
          'Aena lists designated airport information for vehicles for hire and transport options. Travellers can compare that with a pre-booked private transfer.',
      },
      {
        question: 'Is STW Movers an app taxi service?',
        answer:
          'No. STW Movers is a private chauffeur and transfer service booked by quote form, phone, or WhatsApp.',
      },
      {
        question: 'When should business travellers choose private transfer?',
        answer:
          'Business travellers should choose private transfer when punctuality, presentation, luggage, hosting, or multiple stops matter.',
      },
    ],
    related: [
      { label: 'Private driver vs taxi', href: '/answers/private-driver-vs-taxi-barcelona' },
      { label: 'Barcelona taxi alternative', href: '/barcelona-taxi-alternative' },
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
    ],
    sources: [officialVtcSource, officialAirportSource],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
  {
    kind: 'answer',
    slug: 'barcelona-cab-service-vs-chauffeur',
    path: '/answers/barcelona-cab-service-vs-chauffeur',
    eyebrow: 'Answer',
    title: 'Barcelona cab service vs chauffeur: what is the difference?',
    seoTitle: 'Barcelona Cab Service vs Chauffeur | STW Movers Guide',
    description:
      'Compare Barcelona cab service, private cab searches, official taxi rides, and private chauffeur service for premium airport and city transfers.',
    summary:
      'Cab service language usually means a direct ride; chauffeur service adds pre-booking, vehicle planning, presentation, and route support.',
    directAnswer:
      'A Barcelona cab service is usually searched when travellers need a direct ride. A chauffeur service is better when the ride should be pre-booked with pickup details, passenger and luggage planning, vehicle fit, airport or cruise timing, multiple stops, and a more premium private arrival experience.',
    image: '/img/services/business.png',
    sections: [
      {
        heading: 'Why cab wording matters',
        body:
          'In this market, visitors use taxi and cab interchangeably. STW needs to answer both terms while clearly explaining that the service is private chauffeur, not street hail.',
        bullets: ['Cab service Barcelona', 'Private cab Barcelona', 'Airport cab BCN'],
      },
      {
        heading: 'How STW should be positioned',
        body:
          'The right message is cab convenience with chauffeur standards: route reviewed before travel, premium vehicle experience, and quote support.',
      },
    ],
    faqs: [
      {
        question: 'Can I call STW Movers a cab service?',
        answer:
          'STW Movers should be described as a private chauffeur and transfer service for travellers comparing cab, taxi, private driver, and airport transfer options.',
      },
      {
        question: 'Is chauffeur service better for Google Ads traffic?',
        answer:
          'It can convert better for high-value trips when the page still matches cab and taxi intent but presents a premium private transfer offer.',
      },
    ],
    related: [
      { label: 'Cab service Barcelona landing page', href: '/cab-service-barcelona' },
      { label: 'Barcelona cab service page', href: '/services/cab-service-barcelona' },
      { label: 'Executive chauffeur Barcelona', href: '/services/executive-chauffeur-barcelona' },
    ],
    primaryCta: bookCta,
    secondaryCta: contactCta,
  },
]

function marketIntentFaq(page: GrowthPage): GrowthFaq {
  return {
    question:
      page.kind === 'answer'
        ? 'Is STW Movers a taxi or cab company?'
        : 'Can I use STW Movers instead of a taxi or cab in Barcelona?',
    answer:
      'STW Movers is a pre-booked private chauffeur and transfer service. Travellers may search for taxi, cab, airport taxi, or private cab, but the STW offer is a more planned private-driver alternative.',
  }
}

function directAnswerForPage(page: GrowthPage) {
  if (page.directAnswer) return page.directAnswer

  if (page.kind === 'location') {
    return `${page.title} is a pre-booked private chauffeur and transfer option for travellers who want planned pickup timing, vehicle fit, luggage support, and direct contact before travel. It is useful for airport, cruise port, hotel, business, family, and premium taxi or cab alternative searches in Barcelona.`
  }

  if (page.kind === 'service') {
    return `${page.title} from STW Movers is a pre-booked private transfer service in Barcelona for travellers who want a planned chauffeur, clear pickup details, and a vehicle matched to the route, passengers, and luggage. It is a premium alternative to searching for a taxi, cab, or airport taxi on arrival.`
  }

  return page.summary
}

export function growthBookingSteps(page: GrowthPage) {
  const routeDetail =
    page.kind === 'answer'
      ? 'the travel situation you are comparing'
      : page.kind === 'location'
        ? 'the exact pickup area, destination, and access notes'
        : 'the pickup point, drop-off point, and service type'

  return [
    `Share ${routeDetail}, travel date, pickup time, passenger count, and luggage.`,
    'Use the quote form or WhatsApp so STW Movers can confirm availability, timing, and the right chauffeur vehicle.',
    'Review the private quote with route details, pickup instructions, vehicle fit, and any waiting or extra-stop notes.',
    'Confirm the booking before travel and keep the contact details ready for day-of coordination.',
  ]
}

function withMarketIntent(page: GrowthPage): GrowthPage {
  return {
    ...page,
    directAnswer: directAnswerForPage(page),
    faqs: [...page.faqs, marketIntentFaq(page)],
    lastUpdated: page.lastUpdated || growthLastUpdated,
  }
}

const enrichedServicePages = [...servicePages, ...competitorServicePages].map(withMarketIntent)
const enrichedLocationPages = [...locationPages, ...competitorLocationPages, ...phaseThreeRouteLocationPages].map(withMarketIntent)
const enrichedAnswerPages = [...answerPages, ...competitorAnswerPages].map(withMarketIntent)

export const growthPageGroups = {
  service: enrichedServicePages,
  location: enrichedLocationPages,
  answer: enrichedAnswerPages,
} as const

export const growthPages = [...enrichedServicePages, ...enrichedLocationPages, ...enrichedAnswerPages]

export const growthPageRoutes = growthPages.map((page) => page.path)

export function findGrowthPage(kind: GrowthPageKind, slug: string) {
  return growthPageGroups[kind].find((page) => page.slug === slug)
}

function absolute(path: string) {
  return `${siteConfig.siteUrl.replace(/\/$/, '')}${path}`
}

function breadcrumbForPage(page: GrowthPage) {
  const parentName = page.kind === 'answer' ? 'Answers' : page.kind === 'location' ? 'Locations' : 'Services'
  const parentPath = page.kind === 'answer' ? '/answers' : page.kind === 'location' ? '/locations' : '/services'

  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absolute('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: parentName,
        item: absolute(parentPath),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.title,
        item: absolute(page.path),
      },
    ],
  }
}

function faqSchemaForPage(page: GrowthPage) {
  return {
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

function webPageSchemaForPage(page: GrowthPage) {
  return {
    '@type': 'WebPage',
    '@id': `${absolute(page.path)}#webpage`,
    url: absolute(page.path),
    name: page.seoTitle,
    headline: page.title,
    description: page.description,
    dateModified: page.lastUpdated,
    inLanguage: 'en',
    isPartOf: {
      '@id': `${siteConfig.siteUrl}/#website`,
    },
    about: {
      '@id': `${absolute(page.path)}#primary`,
    },
    reviewedBy: page.reviewedBy ? {
      '@type': 'Organization',
      name: page.reviewedBy,
    } : undefined,
  }
}

function howToSchemaForPage(page: GrowthPage) {
  return {
    '@type': 'HowTo',
    name: `How to book ${page.title}`,
    description: `Booking steps for ${page.title} with STW Movers.`,
    step: growthBookingSteps(page).map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step,
    })),
  }
}

function primaryEntityForPage(page: GrowthPage) {
  if (page.kind === 'answer') {
    return {
      '@type': 'Article',
      '@id': `${absolute(page.path)}#primary`,
      headline: page.title,
      description: page.description,
      image: absolute(page.image),
      mainEntityOfPage: absolute(page.path),
      datePublished: page.lastUpdated,
      dateModified: page.lastUpdated,
      inLanguage: 'en',
      author: {
        '@type': 'Organization',
        name: 'STW Movers',
        url: siteConfig.siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'STW Movers',
        url: siteConfig.siteUrl,
      },
      citation: page.sources?.map((source) => source.href),
    }
  }

  return {
    '@type': 'Service',
    '@id': `${absolute(page.path)}#primary`,
    name: page.title,
    description: page.description,
    dateModified: page.lastUpdated,
    areaServed: {
      '@type': 'City',
      name: 'Barcelona',
      addressCountry: 'ES',
    },
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${siteConfig.siteUrl}/#localbusiness`,
      name: 'STW Movers',
      url: siteConfig.siteUrl,
      telephone: siteConfig.contactPhone,
      email: siteConfig.contactEmail,
      address: {
        '@type': 'PostalAddress',
        ...siteConfig.contactAddressPostal,
      },
    },
    serviceType: page.kind === 'location' ? 'Private chauffeur service' : page.title,
    url: absolute(page.path),
    potentialAction: {
      '@type': 'ReserveAction',
      target: absolute('/journey#book-journey'),
      name: 'Request a private chauffeur quote',
    },
    citation: page.sources?.map((source) => source.href),
  }
}

function itemListForPage(page: GrowthPage) {
  return {
    '@type': 'ItemList',
    '@id': `${absolute(page.path)}#comparison-points`,
    name: `${page.title} comparison points`,
    itemListElement: [
      'Pre-booked private chauffeur',
      'Barcelona taxi and cab alternative intent',
      'Airport, cruise port, hotel, business, family, and city-to-city use cases',
      'Quote based on route, passengers, luggage, timing, and vehicle fit',
    ].map((name, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
    })),
  }
}

export function growthPageSchema(page: GrowthPage) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageSchemaForPage(page),
      primaryEntityForPage(page),
      breadcrumbForPage(page),
      faqSchemaForPage(page),
      howToSchemaForPage(page),
      itemListForPage(page),
    ],
  }
}

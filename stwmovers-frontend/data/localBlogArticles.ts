import { siteConfig } from '~/config/site'
import type { ParsedSeo } from '~/types/blog'
import type { WpPost } from '~/types/wordpress'

export type LocalBlogArticle = {
  slug: string
  title: string
  excerpt: string
  date: string
  image: string
  imageAlt: string
  directAnswer: string
  sections: Array<{
    heading: string
    body: string
    bullets?: string[]
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  related: Array<{
    label: string
    href: string
  }>
}

const articleDate = '2026-09-21T00:00:00.000Z'
const officialAirportSource = {
  label: 'Aena Barcelona-El Prat airport taxi and transport information',
  href: 'https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/taxi.html',
  note: 'Airport taxi ranks, terminals, and official airport transport context.',
}
const officialVtcSource = {
  label: 'Aena Barcelona-El Prat vehicles for hire information',
  href: 'https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/vehicles-for-hire.html',
  note: 'Airport private-hire/VTC context for travellers comparing pre-booked vehicle options.',
}
const officialTaxiFareSource = {
  label: 'AMB official metropolitan taxi fares',
  href: 'https://taxi.amb.cat/en/usuaris/tarifes-del-taxi',
  note: 'Official taxi-tariff reference for Barcelona taxi and airport-fare comparisons.',
}
const stwServiceCatalogSource = {
  label: 'STW Movers service catalog',
  href: `${siteConfig.siteUrl}/services.md`,
  note: 'Machine-readable STW Movers service positioning, priority pages, and local transfer clusters.',
}
const stwPricingSource = {
  label: 'STW Movers quote and pricing guide',
  href: `${siteConfig.siteUrl}/pricing.md`,
  note: 'Quote inputs used by STW Movers: pickup, destination, timing, passengers, luggage, vehicle fit, and waiting needs.',
}

function articleTakeaways(article: LocalBlogArticle) {
  if (article.slug.includes('airport')) {
    return [
      'Private airport transfer is strongest when luggage, flight timing, family travel, or a premium arrival matters.',
      'Taxi or cab can work for simple airport rides, but pickup, vehicle fit, and waiting experience are less controlled.',
      'The most useful quote includes flight number, terminal, destination, passengers, luggage, and timing notes.',
    ]
  }

  if (article.slug.includes('cab') || article.slug.includes('taxi')) {
    return [
      'Cab and taxi searches usually mean the traveller wants movement now; chauffeur service adds planning and presentation.',
      'Business guests benefit from a single accountable transport layer for airport, meetings, dinner, and hotel routes.',
      'The better choice depends on stakes: simple short rides suit taxis, while scheduled premium journeys suit chauffeurs.',
    ]
  }

  if (article.slug.includes('hourly')) {
    return [
      'Hourly chauffeur service is useful when the vehicle should remain available between multiple stops.',
      'Separate taxis can work for flexible short rides, but they create repeated pickup and availability decisions.',
      'Send start time, duration, stops, passenger count, and luggage to build a realistic quote.',
    ]
  }

  return [
    'Private driver pricing depends on route, time, waiting, vehicle class, passengers, and luggage.',
    'The best use cases are trips where comfort, presentation, timing, or flexibility matter.',
    'A complete request creates a better quote than a short message with only pickup and destination.',
  ]
}

function articleDecisionRows(article: LocalBlogArticle) {
  if (article.slug.includes('airport')) {
    return [
      ['Best premium choice', 'Pre-booked airport transfer', 'Planned pickup, luggage fit, flight details, and direct hotel or port route.'],
      ['Simple budget choice', 'Taxi, cab, train, or bus', 'Works when luggage is light, timing is flexible, and waiting is acceptable.'],
      ['Quote detail to send', 'Flight number and destination', 'These two details make airport arrival planning much more accurate.'],
    ]
  }

  if (article.slug.includes('cab') || article.slug.includes('taxi')) {
    return [
      ['Best for business', 'Executive chauffeur', 'Better for airport arrivals, meetings, guest presentation, and multi-stop days.'],
      ['Best for quick city rides', 'Taxi or cab', 'Useful when the ride is short, simple, and immediate availability is enough.'],
      ['Quote detail to send', 'Schedule and guest context', 'Meeting time, venue, hotel, and guest count shape the transport plan.'],
    ]
  }

  if (article.slug.includes('hourly')) {
    return [
      ['Best for flexibility', 'Hourly chauffeur', 'One vehicle remains available for waiting, route changes, and multiple stops.'],
      ['Best for single rides', 'Point-to-point transfer', 'Better when pickup and drop-off are fixed and no waiting is required.'],
      ['Quote detail to send', 'Duration and stop list', 'Start time, route, and expected waiting time help prevent underquoting.'],
    ]
  }

  return [
    ['Best premium choice', 'Private driver', 'Useful when timing, comfort, discretion, or vehicle fit matters.'],
    ['Best simple choice', 'Taxi or cab', 'Useful for short spontaneous trips where presentation is less important.'],
    ['Quote detail to send', 'Full itinerary', 'Pickup, destination, passengers, luggage, time, and waiting needs shape the quote.'],
  ]
}

function articleChecklist(article: LocalBlogArticle) {
  const base = ['Pickup address or terminal', 'Destination address', 'Travel date and pickup time', 'Passengers and luggage']

  if (article.slug.includes('airport')) {
    return [...base, 'Flight number', 'Terminal if known', 'Child seats or meet-and-greet notes']
  }

  if (article.slug.includes('hourly')) {
    return [...base, 'Expected duration', 'Main stops', 'Waiting time and schedule flexibility']
  }

  if (article.slug.includes('cab') || article.slug.includes('taxi')) {
    return [...base, 'Business or guest context', 'Meeting or event timing', 'Vehicle presentation needs']
  }

  return [...base, 'Extra stops', 'Preferred vehicle style', 'Waiting or hourly needs']
}

function articleExpertNote(article: LocalBlogArticle) {
  if (article.slug.includes('airport')) {
    return 'Airport transfer decisions are usually won or lost before landing. Flight number, luggage count, and final address give the dispatch desk enough context to plan a calmer arrival than a queue-based taxi or cab pickup.'
  }

  if (article.slug.includes('cab') || article.slug.includes('taxi')) {
    return 'For business travel, the transport choice is also a presentation choice. A chauffeur is less about distance and more about control: timing, handoff, vehicle fit, and how the guest arrives.'
  }

  if (article.slug.includes('hourly')) {
    return 'Hourly chauffeur service is most valuable when the itinerary has uncertainty. Paying for availability can be more efficient than repeatedly solving pickup, waiting, and vehicle-fit decisions throughout the day.'
  }

  return 'Private driver quotes become more accurate when the request describes the real journey, not just two addresses. Timing, waiting, luggage, and passenger context are what turn a ride request into a planned transfer.'
}

function articleSources(article: LocalBlogArticle) {
  const slug = article.slug.toLowerCase()
  const sources = [stwServiceCatalogSource, stwPricingSource]

  if (slug.includes('airport') || slug.includes('taxi')) {
    sources.unshift(officialAirportSource, officialTaxiFareSource)
  }

  if (slug.includes('cab') || slug.includes('chauffeur') || slug.includes('private-driver') || slug.includes('transfer')) {
    sources.unshift(officialVtcSource)
  }

  return sources.filter((source, index, list) => list.findIndex((item) => item.href === source.href) === index)
}

export const localBlogArticles: LocalBlogArticle[] = [
  {
    slug: 'barcelona-airport-transfer-vs-taxi',
    title: 'Barcelona Airport Transfer vs Taxi: What Should You Choose?',
    excerpt:
      'A practical comparison of BCN airport transfer, airport taxi, cab, and private chauffeur options for travellers arriving in Barcelona.',
    date: articleDate,
    image: '/img/services/airport.png',
    imageAlt: 'Private airport transfer vehicle ready for Barcelona arrival',
    directAnswer:
      'Choose a Barcelona airport transfer when you want the pickup, luggage fit, passenger count, flight details, and destination planned before landing. Choose a taxi or cab when the trip is simple, luggage is light, and waiting in the airport taxi queue is acceptable.',
    sections: [
      {
        heading: 'The simple decision rule',
        body:
          'A taxi or cab can be enough for a short city ride. A pre-booked airport transfer is stronger when the arrival includes luggage, children, late timing, business guests, cruise connections, or a hotel pickup that needs clear instructions.',
        bullets: ['Private transfer: planned before arrival', 'Taxi or cab: useful for simple on-demand rides', 'Chauffeur service: best when comfort and timing matter'],
      },
      {
        heading: 'When STW Movers is the better fit',
        body:
          'STW Movers is built for travellers who want a premium taxi alternative rather than a street-hail experience. The quote is based on real trip details: flight number, pickup point, destination, passengers, luggage, and any extra stop.',
        bullets: ['BCN Terminal 1 and Terminal 2 arrivals', 'Airport to hotel, apartment, cruise port, or business meeting', 'Families, executives, groups, and luggage-heavy trips'],
      },
      {
        heading: 'What to send for a useful quote',
        body:
          'The fastest quote starts with the details that affect vehicle fit and timing. Send date, flight number, pickup terminal if known, destination address, passenger count, luggage count, and whether you need child seats or additional stops.',
      },
    ],
    faqs: [
      {
        question: 'Is a Barcelona airport transfer better than a taxi?',
        answer:
          'It is better when the journey needs planning: luggage, family travel, business timing, late arrivals, cruise connections, or a premium arrival experience.',
      },
      {
        question: 'Is STW Movers a taxi company?',
        answer:
          'STW Movers is a pre-booked private chauffeur and transfer service. Travellers may search taxi or cab, but the service is a planned private-driver alternative.',
      },
    ],
    related: [
      { label: 'Barcelona airport transfer service', href: '/services/barcelona-airport-transfer' },
      { label: 'Airport transfer cost answer', href: '/answers/barcelona-airport-transfer-cost' },
      { label: 'Private quote', href: '/journey#book-journey' },
    ],
  },
  {
    slug: 'private-driver-barcelona-cost-booking-use-cases',
    title: 'Private Driver in Barcelona: Cost, Booking, and Best Use Cases',
    excerpt:
      'How private driver pricing works in Barcelona and when hourly chauffeur service is better than a taxi, cab, or single transfer.',
    date: articleDate,
    image: '/img/services/hero.png',
    imageAlt: 'Private driver service in Barcelona with luxury chauffeur vehicle',
    directAnswer:
      'Private driver cost in Barcelona depends on route, vehicle class, time, passengers, luggage, waiting time, and number of stops. It is best for airport arrivals, meetings, dinners, shopping, sightseeing, events, and flexible multi-stop days.',
    sections: [
      {
        heading: 'What affects private driver cost',
        body:
          'Private driver pricing is not only distance. A useful quote considers whether the chauffeur should wait, how many passengers are travelling, how much luggage is involved, and whether the itinerary is point-to-point or hourly.',
        bullets: ['Route and travel time', 'Vehicle class and passenger capacity', 'Waiting time, extra stops, and late-night timing'],
      },
      {
        heading: 'Best use cases',
        body:
          'A private driver is most valuable when the trip is bigger than one simple ride. Business travellers, families, hosted guests, and visitors with several stops benefit from having the vehicle planned in advance.',
        bullets: ['Airport to meeting transfer', 'Dinner and evening transport', 'Shopping, sightseeing, and flexible city movement'],
      },
      {
        heading: 'How to book efficiently',
        body:
          'Share pickup, destination, date, time, passengers, luggage, and whether the driver should remain available. That lets STW Movers quote the right vehicle and schedule instead of guessing from a short message.',
      },
    ],
    faqs: [
      {
        question: 'Can I book a private driver by the hour?',
        answer:
          'Yes. Hourly private driver service is useful when the chauffeur should stay available between meetings, restaurants, shops, or sightseeing stops.',
      },
      {
        question: 'Is a private driver different from a taxi?',
        answer:
          'Yes. A taxi is usually on-demand. A private driver is pre-booked around a planned itinerary, vehicle fit, timing, and support before travel.',
      },
    ],
    related: [
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
      { label: 'Hourly chauffeur Barcelona', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Private driver vs taxi', href: '/answers/private-driver-vs-taxi-barcelona' },
    ],
  },
  {
    slug: 'barcelona-cab-vs-chauffeur-business-travel',
    title: 'Barcelona Cab vs Chauffeur Service for Business Travelers',
    excerpt:
      'A business travel guide comparing Barcelona cab, taxi, private driver, and executive chauffeur options for meetings and client transport.',
    date: articleDate,
    image: '/img/services/business.png',
    imageAlt: 'Executive chauffeur service for business travel in Barcelona',
    directAnswer:
      'For business travel in Barcelona, choose a chauffeur when timing, discretion, guest presentation, luggage, airport arrivals, or multiple meetings matter. Choose a cab or taxi for simple short city rides where immediate availability is the priority.',
    sections: [
      {
        heading: 'Business travel needs more control',
        body:
          'Executives and hosted guests need a transport plan that survives airport delays, traffic pressure, meeting changes, and unfamiliar pickup points. A chauffeur gives the itinerary a single accountable transport layer.',
        bullets: ['Airport-to-meeting arrivals', 'Client and board transport', 'Fira Barcelona and conference movement'],
      },
      {
        heading: 'Where a cab still works',
        body:
          'A Barcelona cab can work for spontaneous, low-stakes trips inside the city. The limitation is predictability: vehicle presentation, waiting time, queue availability, and pickup clarity can vary.',
      },
      {
        heading: 'The premium alternative',
        body:
          'STW Movers gives business travellers a pre-booked private driver with clear pickup notes, route planning, WhatsApp support, and a more polished arrival experience than a typical cab search.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers handle several business stops?',
        answer:
          'Yes. Multi-stop business days can be quoted as hourly chauffeur service or as a planned sequence of transfers.',
      },
      {
        question: 'Is chauffeur service useful for Fira Barcelona events?',
        answer:
          'Yes. Fira event days often involve airport arrivals, hotel pickups, dinner transfers, and fixed meeting times.',
      },
    ],
    related: [
      { label: 'Executive chauffeur Barcelona', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Fira Barcelona chauffeur service', href: '/locations/fira-barcelona-chauffeur-service' },
      { label: 'Business travel answer', href: '/answers/chauffeur-for-business-travel-barcelona' },
    ],
  },
  {
    slug: 'how-much-is-a-barcelona-airport-transfer',
    title: 'How Much Is a Barcelona Airport Transfer?',
    excerpt:
      'The pricing factors behind private Barcelona airport transfers, including route, vehicle class, luggage, timing, and waiting needs.',
    date: articleDate,
    image: '/img/services/quote.png',
    imageAlt: 'Luxury quote planning for Barcelona airport transfer',
    directAnswer:
      'A Barcelona airport transfer price depends on the pickup and drop-off locations, vehicle type, passengers, luggage, date, time, flight details, waiting needs, and extra stops. The accurate way to price it is to request a private quote with full trip details.',
    sections: [
      {
        heading: 'Why prices vary',
        body:
          'Airport transfer prices vary because two airport trips can require different vehicles, timing, route distance, waiting time, and luggage capacity. BCN to Eixample is not the same as BCN to Sitges, Costa Brava, or a cruise port connection.',
        bullets: ['Route and destination distance', 'Vehicle class and capacity', 'Arrival time, waiting, and extra-stop requirements'],
      },
      {
        heading: 'What makes a quote accurate',
        body:
          'The more complete the request, the more useful the quote. Flight number, destination, passenger count, and luggage are the main details that affect planning.',
      },
      {
        heading: 'Private transfer vs airport taxi pricing',
        body:
          'Travellers comparing airport taxi, cab, and private transfer pricing should also compare what is included. A private transfer is planned before travel and can account for presentation, luggage, family needs, and onward timing.',
      },
    ],
    faqs: [
      {
        question: 'Can I get a fixed quote before landing?',
        answer:
          'Yes. STW Movers can provide a private quote when the route, timing, passengers, luggage, and flight details are clear.',
      },
      {
        question: 'Does luggage change the price?',
        answer:
          'Luggage can affect vehicle selection, which can affect the quote. Always include suitcases, strollers, golf bags, or bulky items.',
      },
    ],
    related: [
      { label: 'Airport transfer cost answer', href: '/answers/barcelona-airport-transfer-cost' },
      { label: 'BCN airport transfer service', href: '/services/barcelona-airport-transfer' },
      { label: 'Family luggage transfer', href: '/answers/family-airport-transfer-barcelona-luggage' },
    ],
  },
  {
    slug: 'best-way-from-barcelona-airport-to-city-centre',
    title: 'Best Way to Travel from Barcelona Airport to City Centre',
    excerpt:
      'Compare private transfer, taxi, cab, train, and bus options from BCN Airport to central Barcelona hotels and apartments.',
    date: articleDate,
    image: '/img/home/hero-7.webp',
    imageAlt: 'Barcelona airport to city centre private transfer route',
    directAnswer:
      'The best way from Barcelona Airport to the city centre depends on luggage, arrival time, destination, budget, and comfort. Private transfer is best for door-to-door planning; taxi or cab can work for simple rides; train and bus can suit light luggage and flexible schedules.',
    sections: [
      {
        heading: 'Choose by travel situation',
        body:
          'No single option is best for every traveller. A solo traveller with a backpack may choose public transport. A family with luggage, a business guest, or a late arrival will usually benefit from a planned private transfer.',
        bullets: ['Private transfer: comfort and door-to-door clarity', 'Taxi or cab: simple on-demand city ride', 'Train or bus: lower-cost public option'],
      },
      {
        heading: 'Why central Barcelona still needs planning',
        body:
          'City-centre hotels, apartment addresses, pedestrian streets, and luggage can make the final minutes of the journey less simple than the map suggests. A chauffeur transfer can plan the exact drop-off point.',
      },
      {
        heading: 'When STW Movers makes sense',
        body:
          'Use STW Movers when you want the arrival handled before the plane lands: vehicle fit, flight details, passenger count, luggage, and destination all reviewed in advance.',
      },
    ],
    faqs: [
      {
        question: 'Is private transfer faster than public transport?',
        answer:
          'It depends on traffic and destination, but private transfer is door-to-door and avoids station changes, walking with luggage, and ticket decisions after landing.',
      },
      {
        question: 'Can a private transfer go to apartments, not just hotels?',
        answer:
          'Yes. Share the full address so the best pickup or drop-off point can be planned.',
      },
    ],
    related: [
      { label: 'Best way from BCN answer', href: '/answers/best-way-from-bcn-airport-to-barcelona' },
      { label: 'Airport chauffeur location', href: '/locations/barcelona-airport-chauffeur-service' },
      { label: 'Book airport transfer', href: '/journey#book-journey' },
    ],
  },
  {
    slug: 'hourly-chauffeur-barcelona-when-it-makes-sense',
    title: 'Hourly Chauffeur in Barcelona: When It Makes Sense',
    excerpt:
      'When hourly chauffeur service is better than booking separate taxi, cab, or private driver rides across Barcelona.',
    date: articleDate,
    image: '/img/services/hourly.png',
    imageAlt: 'Hourly chauffeur vehicle waiting for private driver itinerary in Barcelona',
    directAnswer:
      'Hourly chauffeur service in Barcelona makes sense when the vehicle should stay available for multiple stops, meetings, shopping, sightseeing, restaurants, event movement, or schedule changes. It is stronger than separate taxis when waiting time and flexibility matter.',
    sections: [
      {
        heading: 'The hourly chauffeur use case',
        body:
          'Hourly service gives the day one transport plan. Instead of booking separate rides, the chauffeur remains available for waiting, route changes, and short stops.',
        bullets: ['Meetings in different areas', 'Shopping and dining stops', 'Private sightseeing and event movement'],
      },
      {
        heading: 'When separate taxis are enough',
        body:
          'Separate taxis can be enough if every ride is simple, short, and flexible. They are less ideal when timing, presentation, luggage, or passenger continuity matter.',
      },
      {
        heading: 'How to request hourly service',
        body:
          'Send start time, pickup location, approximate duration, passenger count, luggage, and key stops. STW Movers can then quote the right chauffeur vehicle and schedule.',
      },
    ],
    faqs: [
      {
        question: 'Is hourly chauffeur service only for business travel?',
        answer:
          'No. It is also useful for families, shopping, sightseeing, restaurants, weddings, events, and VIP guest movement.',
      },
      {
        question: 'Can hourly service start at the airport?',
        answer:
          'Yes. The booking can start with a BCN airport pickup and continue into an hourly itinerary if requested in advance.',
      },
    ],
    related: [
      { label: 'Hourly chauffeur service', href: '/services/hourly-chauffeur-barcelona' },
      { label: 'Hourly private driver answer', href: '/answers/hourly-private-driver-barcelona' },
      { label: 'Private driver Barcelona', href: '/services/private-driver-barcelona' },
    ],
  },
  {
    slug: 'airport-taxi-barcelona-private-transfer-guide',
    title: 'Airport Taxi Barcelona vs Private Transfer: 2026 Booking Guide',
    excerpt:
      'A detailed guide for travellers comparing Barcelona airport taxi, airport cab, private transfer, and chauffeur options before arriving at BCN.',
    date: articleDate,
    image: '/img/services/airport.png',
    imageAlt: 'Private chauffeur vehicle for Barcelona airport taxi alternative',
    directAnswer:
      'Use a Barcelona airport taxi when the trip is simple, luggage is light, and waiting at the airport rank is acceptable. Use a private transfer when you want pickup details, luggage fit, passenger count, flight timing, and destination planned before landing.',
    sections: [
      {
        heading: 'What airport taxi searchers really need',
        body:
          'Most airport taxi searches are not only about the word taxi. The traveller wants a dependable ride from BCN Airport to a hotel, apartment, cruise terminal, meeting, or resort without confusion after landing.',
        bullets: ['Airport taxi Barcelona', 'BCN airport cab', 'Barcelona airport private transfer'],
      },
      {
        heading: 'Where private transfer has the advantage',
        body:
          'Private transfer is strongest when the route includes luggage, children, a late arrival, an early return, a cruise boarding time, a business guest, or a destination outside central Barcelona.',
      },
      {
        heading: 'How to compare value, not just fare',
        body:
          'Taxi-meter pricing and private-transfer quote pricing are different. Compare what is included: waiting expectations, vehicle fit, route support, pickup clarity, and whether the trip is planned before the aircraft lands.',
      },
    ],
    faqs: [
      {
        question: 'Is STW Movers an official Barcelona airport taxi?',
        answer:
          'No. STW Movers is a pre-booked private chauffeur and transfer service for travellers comparing airport taxi, cab, and premium private transfer options.',
      },
      {
        question: 'What details make a private airport quote accurate?',
        answer:
          'Flight number, date, pickup time, destination address, passengers, luggage, child-seat needs, and extra stops are the most useful details.',
      },
    ],
    related: [
      { label: 'Airport taxi alternative service', href: '/services/barcelona-airport-taxi-alternative' },
      { label: 'Airport taxi landing page', href: '/landing/airport-taxi-barcelona' },
      { label: 'Airport taxi cost answer', href: '/answers/barcelona-airport-taxi-cost-2026' },
    ],
  },
  {
    slug: 'cab-service-barcelona-private-chauffeur-guide',
    title: 'Cab Service Barcelona: When to Choose a Private Chauffeur Instead',
    excerpt:
      'A practical article for visitors searching cab service Barcelona, private cab, airport cab, or chauffeur service.',
    date: articleDate,
    image: '/img/services/hourly.png',
    imageAlt: 'Premium cab service alternative in Barcelona',
    directAnswer:
      'Choose a Barcelona cab for a short on-demand ride. Choose a private chauffeur when the trip should be pre-booked with pickup details, luggage planning, route context, passenger count, and a premium arrival experience.',
    sections: [
      {
        heading: 'Cab language matters in Barcelona search',
        body:
          'English-speaking travellers often use cab, taxi, private cab, and airport cab for the same intent: they need movement from one place to another. STW Movers should match that language while clearly positioning the service as private chauffeur, not street hail.',
        bullets: ['Cab service Barcelona', 'Private cab Barcelona', 'Airport cab BCN'],
      },
      {
        heading: 'The luxury difference',
        body:
          'A chauffeur booking adds pre-trip coordination, route planning, clearer vehicle expectations, direct support, and a more polished handoff for business, family, airport, and cruise journeys.',
      },
      {
        heading: 'When cab service is enough',
        body:
          'A standard cab can still be the right choice for short, low-stakes city movement with minimal luggage and flexible timing. The private chauffeur path is for trips where the arrival matters.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers be booked like a cab?',
        answer:
          'STW Movers can be requested quickly by form, phone, or WhatsApp, but it is a pre-booked private chauffeur service rather than an on-demand street-hail cab.',
      },
      {
        question: 'Is cab service Barcelona a good Google Ads keyword?',
        answer:
          'Yes, when the landing page clearly matches cab intent and then explains the premium private transfer alternative without pretending to be a street taxi.',
      },
    ],
    related: [
      { label: 'Cab service page', href: '/services/cab-service-barcelona' },
      { label: 'Cab Barcelona landing page', href: '/landing/cab-barcelona' },
      { label: 'Cab vs chauffeur answer', href: '/answers/barcelona-cab-service-vs-chauffeur' },
    ],
  },
  {
    slug: 'private-transfer-barcelona-airport-port-hotels',
    title: 'Private Transfer Barcelona: Airport, Cruise Port, Hotels, and City Routes',
    excerpt:
      'A comprehensive private transfer Barcelona guide covering airport, cruise port, hotel, city-to-city, family, and executive routes.',
    date: articleDate,
    image: '/img/contact/destination-sunset.png',
    imageAlt: 'Private transfer in Barcelona for airport and cruise routes',
    directAnswer:
      'A private transfer in Barcelona is a pre-booked point-to-point journey planned around pickup, destination, date, time, passengers, luggage, and route needs. It is best for airport arrivals, cruise port trips, hotels, business travel, families, and city-to-city routes.',
    sections: [
      {
        heading: 'What private transfer means',
        body:
          'Private transfer is not the same as hoping the right vehicle is available at the curb. It is a planned journey where the route and vehicle fit are discussed before travel.',
        bullets: ['BCN airport transfers', 'Cruise port transfers', 'Hotel, apartment, business, and resort routes'],
      },
      {
        heading: 'Best private transfer use cases',
        body:
          'Private transfer is strongest when there is a reason to reduce uncertainty: luggage, guests, children, timing, a port connection, a long-distance route, or a luxury arrival standard.',
      },
      {
        heading: 'How to request it efficiently',
        body:
          'Send pickup, destination, date, time, passenger count, luggage count, and any flight, cruise, child-seat, waiting, or stop details. That allows a realistic quote instead of a generic estimate.',
      },
    ],
    faqs: [
      {
        question: 'Is private transfer better than taxi in Barcelona?',
        answer:
          'It is better when the journey needs advance planning, luggage capacity, route support, or a premium experience. A taxi can be fine for simple short rides.',
      },
      {
        question: 'Can private transfers go outside Barcelona?',
        answer:
          'Yes. City-to-city private transfers can be quoted for Sitges, Costa Brava, Girona, Tarragona, Salou, and other routes.',
      },
    ],
    related: [
      { label: 'Private transfer landing page', href: '/landing/private-transfer-barcelona' },
      { label: 'City-to-city transfers', href: '/services/city-to-city-transfers-barcelona' },
      { label: 'Barcelona cruise port transfer', href: '/services/barcelona-cruise-port-transfer' },
    ],
  },
  {
    slug: 'taxi-van-barcelona-groups-luggage-airport',
    title: 'Taxi Van Barcelona: Group Airport Transfers and Luggage Planning',
    excerpt:
      'A group travel guide for taxi van Barcelona, airport van transfer, family luggage transfer, and private chauffeur van searches.',
    date: articleDate,
    image: '/img/home/fleet-section/mercedes-v-class.webp',
    imageAlt: 'Private van transfer in Barcelona for groups and luggage',
    directAnswer:
      'A taxi van or private van transfer in Barcelona is useful when passengers and luggage may not fit comfortably in a standard car. For airport, cruise, family, and group trips, pre-booking helps match the vehicle before travel instead of splitting into multiple taxis.',
    sections: [
      {
        heading: 'Why groups search taxi van',
        body:
          'Taxi van searches usually come from families, cruise passengers, groups of friends, event guests, or travellers with bulky luggage who need one vehicle plan.',
        bullets: ['Airport van transfer', '7-seat or 8-seat taxi intent', 'Family and cruise luggage transfer'],
      },
      {
        heading: 'One planned vehicle vs multiple rides',
        body:
          'Splitting into two taxis can create coordination issues, separate luggage handling, and uneven arrival timing. A private van-style transfer can be quoted around the group as one trip when vehicle availability fits.',
      },
      {
        heading: 'What to send before booking',
        body:
          'Send adults, children, suitcase count, stroller or bulky items, pickup point, destination, date, time, and flight or cruise details if relevant.',
      },
    ],
    faqs: [
      {
        question: 'Can STW Movers quote a larger vehicle?',
        answer:
          'Yes. Larger vehicle requests can be reviewed when passenger count, luggage count, route, and date are provided.',
      },
      {
        question: 'Is taxi van Barcelona the same as private van transfer?',
        answer:
          'Searchers may use similar language, but STW Movers offers pre-booked private chauffeur transfer service rather than street-hail taxi van service.',
      },
    ],
    related: [
      { label: 'Barcelona van transfer service', href: '/services/barcelona-van-transfer' },
      { label: 'Taxi van landing page', href: '/landing/taxi-van-barcelona' },
      { label: 'Family airport transfer', href: '/services/family-airport-transfer-barcelona' },
    ],
  },
  {
    slug: 'chauffeur-barcelona-luxury-airport-business-guide',
    title: 'Chauffeur Barcelona: Luxury Airport, Business, and Private Driver Guide',
    excerpt:
      'A complete Barcelona chauffeur guide for airport arrivals, executive travel, hourly private driver service, events, and premium transfers.',
    date: articleDate,
    image: '/img/services/business.png',
    imageAlt: 'Luxury chauffeur service in Barcelona for business and airport travel',
    directAnswer:
      'A chauffeur in Barcelona is best for travellers who want a private, pre-booked vehicle with planned pickup, polished presentation, luggage fit, and support for airport, business, event, hourly, or city-to-city travel.',
    sections: [
      {
        heading: 'What chauffeur service adds',
        body:
          'Chauffeur service is more than transport. It adds timing discipline, presentation, private vehicle standards, itinerary awareness, and a smoother handoff for guests.',
        bullets: ['Airport chauffeur service', 'Executive business travel', 'Hourly private driver in Barcelona'],
      },
      {
        heading: 'Who should book a chauffeur',
        body:
          'The best fit is a traveller, host, family, or business team that wants less uncertainty than a taxi queue and a more refined experience than a standard cab ride.',
      },
      {
        heading: 'How to choose between transfer and hourly',
        body:
          'Choose transfer for a single route. Choose hourly chauffeur when the driver should wait, continue between stops, or support a flexible schedule.',
      },
    ],
    faqs: [
      {
        question: 'Is a chauffeur different from a private driver?',
        answer:
          'The terms overlap, but chauffeur service usually implies a more polished, pre-arranged, hospitality-focused private driver experience.',
      },
      {
        question: 'Can chauffeur service start at Barcelona Airport?',
        answer:
          'Yes. A chauffeur booking can start at BCN Airport and continue as a direct transfer or hourly itinerary.',
      },
    ],
    related: [
      { label: 'Chauffeur Barcelona landing page', href: '/landing/chauffeur-barcelona' },
      { label: 'Executive chauffeur service', href: '/services/executive-chauffeur-barcelona' },
      { label: 'Hourly chauffeur service', href: '/services/hourly-chauffeur-barcelona' },
    ],
  },
]

function articleHtml(article: LocalBlogArticle) {
  const takeaways = articleTakeaways(article)
  const decisionRows = articleDecisionRows(article)
  const checklist = articleChecklist(article)
  const sources = articleSources(article)

  const sectionHtml = article.sections
    .map(
      (section) => `
        <section>
          <h2>${section.heading}</h2>
          <p>${section.body}</p>
          ${
            section.bullets?.length
              ? `<ul>${section.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}</ul>`
              : ''
          }
        </section>
      `,
    )
    .join('')

  const faqHtml = article.faqs
    .map(
      (faq) => `
        <section>
          <h3>${faq.question}</h3>
          <p>${faq.answer}</p>
        </section>
      `,
    )
    .join('')

  return `
    <aside class="article-answer-card">
      <p>Direct answer</p>
      <strong>${article.directAnswer}</strong>
    </aside>
    <section class="article-aeo-grid" aria-label="Fast decision summary">
      <div class="article-aeo-card">
        <p class="article-aeo-card__eyebrow">Key takeaways</p>
        <h2>What to know before choosing</h2>
        <ul>
          ${takeaways.map((takeaway) => `<li>${takeaway}</li>`).join('')}
        </ul>
      </div>
      <aside class="article-aeo-card article-aeo-card--dark">
        <p class="article-aeo-card__eyebrow">Dispatch note</p>
        <h2>How STW Movers evaluates the request</h2>
        <p>${articleExpertNote(article)}</p>
      </aside>
    </section>
    <section class="article-decision-matrix">
      <p class="article-aeo-card__eyebrow">Decision matrix</p>
      <h2>Which option fits this situation?</h2>
      <div class="article-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Best fit</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            ${decisionRows
              .map(
                ([point, fit, reason]) => `
                  <tr>
                    <td>${point}</td>
                    <td>${fit}</td>
                    <td>${reason}</td>
                  </tr>
                `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
    ${sectionHtml}
    <section class="article-booking-checklist">
      <p class="article-aeo-card__eyebrow">Quote checklist</p>
      <h2>Details to send before you book</h2>
      <ul>
        ${checklist.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </section>
    <section class="article-evidence-panel" aria-label="Evidence and business facts">
      <p class="article-aeo-card__eyebrow">Evidence and business facts</p>
      <h2>Sources behind this guide</h2>
      <ul>
        ${sources
          .map(
            (source) => `
              <li>
                <a href="${source.href}" target="_blank" rel="noopener noreferrer">${source.label}</a>
                <span>${source.note}</span>
              </li>
            `,
          )
          .join('')}
      </ul>
    </section>
    <section class="article-faq-block">
      <h2>Common questions</h2>
      ${faqHtml}
    </section>
  `
}

export function localArticleToWpPost(article: LocalBlogArticle): WpPost {
  return {
    id: Math.abs(
      article.slug.split('').reduce((total, char) => total + char.charCodeAt(0), 0),
    ),
    date: article.date,
    modified: article.date,
    slug: article.slug,
    link: `${siteConfig.siteUrl}/blogs/${article.slug}`,
    status: 'publish',
    title: { rendered: article.title },
    excerpt: { rendered: article.excerpt },
    content: { rendered: articleHtml(article) },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: article.image,
          alt_text: article.imageAlt,
        },
      ],
      author: [{ name: 'STW Movers Barcelona dispatch team' }],
    },
  }
}

export const localBlogPosts = localBlogArticles.map(localArticleToWpPost)

export function findLocalBlogArticle(slug: string) {
  return localBlogArticles.find((article) => article.slug === slug)
}

export function localBlogSeo(article: LocalBlogArticle): ParsedSeo {
  const canonical = `${siteConfig.siteUrl}/blogs/${article.slug}`

  return {
    title: `${article.title} | STW Movers Insights`,
    canonical,
    meta: {
      description: article.excerpt,
      robots: 'index,follow',
    },
    og: {
      title: article.title,
      description: article.excerpt,
      url: canonical,
      image: `${siteConfig.siteUrl}${article.image}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      image: `${siteConfig.siteUrl}${article.image}`,
    },
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        image: `${siteConfig.siteUrl}${article.image}`,
        url: canonical,
        datePublished: article.date,
        dateModified: article.date,
        author: {
          '@type': 'Organization',
          name: 'STW Movers Barcelona dispatch team',
          url: siteConfig.siteUrl,
        },
        reviewedBy: {
          '@type': 'Organization',
          name: 'STW Movers',
          url: siteConfig.siteUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'STW Movers',
          url: siteConfig.siteUrl,
        },
        citation: articleSources(article).map((source) => source.href),
        articleSection: 'Barcelona chauffeur and private transfer planning',
        keywords: [
          'Barcelona airport transfer',
          'Barcelona taxi alternative',
          'Barcelona cab alternative',
          'private driver Barcelona',
          'executive chauffeur Barcelona',
        ],
        mainEntityOfPage: canonical,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to request a quote for ${article.title}`,
        description:
          'Quote-ready booking details STW Movers uses to plan a private Barcelona transfer or chauffeur request.',
        step: articleChecklist(article).map((item, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: item,
          text: `Include ${item.toLowerCase()} in the transfer request.`,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  }
}

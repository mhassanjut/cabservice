export type LegalPageSection = {
  heading: string
  body: string
  bullets?: string[]
}

export type LegalPage = {
  slug: string
  title: string
  navLabel: string
  description: string
  eyebrow: string
  intro: string
  updated: string
  sections: LegalPageSection[]
}

export const legalPages: LegalPage[] = [
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    navLabel: 'Terms & Conditions',
    description:
      'STW Movers terms and conditions for private chauffeur, airport transfer, cab alternative, and private driver bookings in Barcelona.',
    eyebrow: 'Booking terms',
    intro:
      'These terms explain how STW Movers handles private chauffeur, airport transfer, hourly driver, cab alternative, and city-to-city transfer requests in Barcelona and nearby destinations.',
    updated: '21 September 2026',
    sections: [
      {
        heading: 'Private pre-booked transport',
        body:
          'STW Movers provides pre-booked private chauffeur and transfer services. Travellers may find us while searching for taxi or cab services, but bookings are planned private journeys rather than street-hailed taxi rides.',
      },
      {
        heading: 'Quote and booking details',
        body:
          'A quote depends on the pickup point, destination, date, time, passenger count, luggage, vehicle fit, waiting time, airport or cruise details, and any extra stops.',
        bullets: ['Flight number for BCN airport pickups', 'Cruise terminal or ship details for port transfers', 'Passenger and luggage count', 'Child-seat or accessibility requests'],
      },
      {
        heading: 'Customer responsibility',
        body:
          'Guests should provide accurate travel information and remain reachable on the contact channel used for confirmation. Incorrect or late information may affect availability, timing, or quote accuracy.',
      },
      {
        heading: 'Service changes',
        body:
          'Pickup time, route, passenger count, luggage, or vehicle changes are handled subject to availability. The STW Movers desk will confirm any impact before the journey is finalized.',
      },
    ],
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    navLabel: 'Privacy Policy',
    description:
      'How STW Movers handles quote, contact, booking, and trip information for Barcelona chauffeur and airport transfer customers.',
    eyebrow: 'Guest privacy',
    intro:
      'STW Movers collects only the information needed to answer inquiries, prepare private quotes, coordinate booked journeys, and support guests before and after travel.',
    updated: '21 September 2026',
    sections: [
      {
        heading: 'Information we use',
        body:
          'Typical booking information includes name, phone number, email, pickup and destination addresses, flight or cruise details, date and time, passenger count, luggage, and trip notes.',
      },
      {
        heading: 'Why we use it',
        body:
          'The information is used to prepare quotes, confirm availability, match the right vehicle, coordinate the chauffeur, answer support questions, and maintain booking records.',
      },
      {
        heading: 'Contact channels',
        body:
          'If you contact STW Movers by form, phone, email, or WhatsApp, your message may be used to respond to the request and coordinate the relevant Barcelona transfer or chauffeur service.',
      },
      {
        heading: 'Data care',
        body:
          'Trip details are treated as private operational information. They are shared only where needed to provide the service, process the booking, or comply with applicable obligations.',
      },
    ],
  },
  {
    slug: 'cancellation-policy',
    title: 'Cancellation Policy',
    navLabel: 'Cancellation Policy',
    description:
      'STW Movers cancellation, change, waiting, and timing guidance for Barcelona airport transfer and private chauffeur bookings.',
    eyebrow: 'Changes and cancellations',
    intro:
      'Private chauffeur journeys depend on vehicle, chauffeur, timing, and route availability. This policy explains how STW Movers handles changes and cancellations.',
    updated: '21 September 2026',
    sections: [
      {
        heading: 'Change requests',
        body:
          'Please contact the STW Movers desk as early as possible if your pickup time, destination, passenger count, luggage, or flight details change.',
      },
      {
        heading: 'Airport and cruise delays',
        body:
          'Flight number and cruise details help the team monitor timing and plan the pickup. Reasonable timing adjustments can often be handled when accurate travel details are shared in advance.',
      },
      {
        heading: 'Late cancellations',
        body:
          'Late cancellations may be limited by chauffeur dispatch, vehicle reservation, and scheduling commitments. The desk will confirm the applicable terms during booking or quote confirmation.',
      },
      {
        heading: 'No-show situations',
        body:
          'A no-show may occur when the passenger cannot be reached or does not arrive at the agreed meeting point within the confirmed waiting window. Contact support immediately if your arrival point changes.',
      },
    ],
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    navLabel: 'Cookie Policy',
    description:
      'Cookie information for the STW Movers website, including essential functionality, analytics, and conversion measurement.',
    eyebrow: 'Website cookies',
    intro:
      'Cookies and similar technologies help the STW Movers website function, improve the user experience, and understand how visitors find chauffeur and transfer pages.',
    updated: '21 September 2026',
    sections: [
      {
        heading: 'Essential cookies',
        body:
          'Essential cookies may support navigation, session behavior, forms, security, booking flow continuity, and basic website functionality.',
      },
      {
        heading: 'Analytics and measurement',
        body:
          'Optional analytics tools may help STW Movers understand which pages are useful, how visitors move through service pages, and where quote requests begin. These tools are enabled only after you accept optional measurement.',
      },
      {
        heading: 'Advertising measurement',
        body:
          'If configured, Google Ads measurement may use advertising identifiers and tags to attribute a completed booking to an advertisement. Optional advertising measurement is enabled only after you accept it.',
      },
      {
        heading: 'Managing cookies',
        body:
          'You can accept or reject optional measurement using the website prompt. You can reopen this choice from this page at any time. Browser settings can also block or delete cookies. Essential booking functionality remains available when optional measurement is declined.',
      },
    ],
  },
  {
    slug: 'legal-notice',
    title: 'Legal Notice',
    navLabel: 'Legal Notice',
    description:
      'Legal notice for the STW Movers website and Barcelona private chauffeur, airport transfer, and transfer-planning service pages.',
    eyebrow: 'Website notice',
    intro:
      'This notice identifies the purpose of the STW Movers website and the information presented across chauffeur, airport transfer, private driver, taxi alternative, and cab service pages.',
    updated: '21 September 2026',
    sections: [
      {
        heading: 'Website purpose',
        body:
          'The website provides information about STW Movers private chauffeur and transfer services in Barcelona and related destinations, including airport, cruise port, business, hourly, and city-to-city travel.',
      },
      {
        heading: 'Information accuracy',
        body:
          'Service information, route examples, and booking guidance are provided to help visitors understand available transfer options. Final availability and quote details are confirmed by the STW Movers desk.',
      },
      {
        heading: 'Intellectual property',
        body:
          'Website text, design, images, brand presentation, and page structure are intended for STW Movers use and should not be copied without permission.',
      },
      {
        heading: 'Contact',
        body:
          'Questions about the website, booking information, or company details can be sent through the contact page or quote form.',
      },
    ],
  },
  {
    slug: 'accessibility-statement',
    title: 'Accessibility Statement',
    navLabel: 'Accessibility Statement',
    description:
      'Accessibility statement for STW Movers website visitors researching Barcelona airport transfer, private driver, and chauffeur services.',
    eyebrow: 'Accessibility',
    intro:
      'STW Movers aims to make its website usable for visitors comparing Barcelona airport transfers, private drivers, chauffeur service, taxi alternatives, and cab service options.',
    updated: '21 September 2026',
    sections: [
      {
        heading: 'Website experience',
        body:
          'The website is designed with clear navigation, readable content, descriptive links, keyboard-accessible menus, and structured pages that support both visitors and assistive technologies.',
      },
      {
        heading: 'Booking support',
        body:
          'Guests who need help with a quote, journey details, luggage, child seats, or accessibility-related travel needs can contact the STW Movers desk before booking.',
      },
      {
        heading: 'Ongoing improvements',
        body:
          'Accessibility is treated as an ongoing improvement area. Navigation, contrast, page structure, and form clarity should continue to improve as the site expands.',
      },
      {
        heading: 'Feedback',
        body:
          'If a visitor experiences difficulty using the website, they can contact STW Movers so the team can review the issue and improve the experience.',
      },
    ],
  },
]

export const legalPageMap = Object.fromEntries(legalPages.map((page) => [page.slug, page])) as Record<string, LegalPage>

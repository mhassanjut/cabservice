import type { LocalBlogArticle } from './localBlogArticles'

type ArticleExpansion = Pick<LocalBlogArticle, 'sections' | 'faqs'>

export const articleExpansions: Record<string, ArticleExpansion> = {
  'barcelona-airport-to-eixample-private-transfer-guide': {
    sections: [
      { heading: 'Confirm the entrance, not just the hotel name', body: 'Send the street address, building number and entrance instructions. A property name can refer to several buildings, while an apartment listing may use a nearby landmark. Ask the host where a vehicle can legally stop and whether reception is staffed at your arrival time. Pass any instructions to the operator before travel.' },
      { heading: 'Coordinate apartment check-in with airport arrival', body: 'Your landing time is not your apartment arrival time. Baggage collection, airport exit and road conditions affect the handoff. If someone is meeting you with keys, give them an updated estimate after collecting luggage. Keep the host and transfer contacts separately so a flight delay can be communicated to both.' },
      { heading: 'A family arrival with a stroller', body: 'For a hypothetical family travelling to an Eixample apartment, list adults, children, suitcases and the folded stroller. Request explicit confirmation of required child-seat equipment and vehicle fit. Ask the host about stairs or lift access; a car reservation does not establish assistance inside the building. Keep an essentials bag accessible at drop-off.' },
    ],
    faqs: [
      { question: 'Should I send my apartment entrance instructions?', answer: 'Yes. Send the exact address and any relevant legal stopping or entrance instructions. Keep private access codes out of a public enquiry and share them only when necessary with the appropriate person.' },
      { question: 'Can a delayed flight affect apartment check-in?', answer: 'Yes. Notify both the host and transfer operator. Confirm revised key collection and pickup arrangements rather than assuming one provider has informed the other.' },
      { question: 'Is every Eixample address equally convenient for public transport?', answer: 'No. Compare the full route to the actual address, including the final walk and any connections, before selecting transport.' },
    ],
  },
  'barcelona-to-sitges-private-transfer-guide': {
    sections: [
      { heading: 'Airport pickup and city pickup are different itineraries', body: 'Specify whether collection is at BCN Airport, a Barcelona hotel or the cruise port. For an airport arrival, include the flight number and terminal; for a hotel pickup, include the entrance and preferred collection time. Ask for a quote for the actual starting point instead of applying a city-centre quote to an airport journey.' },
      { heading: 'Plan villa and event arrivals with the host', body: 'Provide the exact villa or venue address and any access instructions. Confirm gates, parking and the person coordinating arrival. For wedding guests, list the ceremony deadline separately from the desired pickup time. If several guests arrive on different flights, compare separate collections with the waiting required for one shared vehicle.' },
      { heading: 'Book the return journey with its own details', body: 'A return transfer needs a separate date, time and destination. For a flight, supply the departure terminal and airline check-in requirement; for a city hotel, supply the full address. Agree what happens if an event ends later than expected and who can approve additional waiting or a revised pickup.' },
    ],
    faqs: [
      { question: 'Can I use the same pickup time for an event and the return trip?', answer: 'Plan each leg independently. Include the venue deadline for the outward trip and a realistic collection time for the return, with agreed change conditions.' },
      { question: 'What should I send for a Sitges villa transfer?', answer: 'Send the complete address, access and parking instructions, host contact arrangements, passengers, luggage and pickup details.' },
      { question: 'Does a Barcelona-to-Sitges quote also cover airport pickup?', answer: 'Do not assume that it does. Confirm the precise starting point, route and pickup arrangement in the quote.' },
    ],
  },
  'private-driver-barcelona-cost-booking-use-cases': {
    sections: [
      { heading: 'Separate transport from reserved availability', body: 'A point-to-point quote covers a defined journey. An hourly request asks the operator to reserve availability across a period, potentially including waiting between stops. Compare the same itinerary under both arrangements. Two meetings many hours apart may suit separate rides, while a tightly connected schedule can benefit from one available vehicle.' },
      { heading: 'Request a clear written scope', body: 'Record the start and finish locations, duration, stops and passenger needs. Ask what distance, waiting and parking are included, whether extra time requires approval and how changes affect the total. Confirm payment currency and invoice requirements before accepting the booking. A complete scope makes two operator quotes more comparable.' },
      { heading: 'A hypothetical business-day comparison', body: 'Consider a hotel pickup, two meetings and an evening return. If the vehicle must remain available during both meetings, request an hourly quote. If passengers are free for several hours and do not need a waiting car, request separate transfers too. Compare total cost and flexibility without assuming either arrangement is automatically cheaper.' },
    ],
    faqs: [
      { question: 'Is hourly private-driver service always cheaper?', answer: 'No. Compare complete quotes for your itinerary, including waiting, distance and additional time. Separate transfers can suit widely spaced journeys.' },
      { question: 'Can I change the itinerary during the booking?', answer: 'Ask what changes are permitted and how extra distance or time is approved and charged. Confirm the revised arrangement with the operator.' },
      { question: 'What invoice information should I provide?', answer: 'Ask the operator what billing details are required and whether the proposed service meets your company invoice requirements before booking.' },
    ],
  },
  'hourly-chauffeur-barcelona-when-it-makes-sense': {
    sections: [
      { heading: 'Agree when the hire clock starts and ends', body: 'Confirm whether booked time begins at the passenger pickup or another agreed point, and where it ends. Include the return destination in the itinerary. Ask how overtime is measured, who approves it and whether the vehicle can remain available beyond the booked period. Availability after the original finish must be confirmed.' },
      { heading: 'Make waiting periods explicit', body: 'A meeting lasting ninety minutes and a quick drop-off have different availability requirements. Mark each stop as a drop-off, waiting stop or later collection. Explain whether passengers will leave belongings in the vehicle and agree the appropriate arrangement with the operator. Reserve enough time for the full itinerary rather than only the driving legs.' },
      { heading: 'Keep a workable plan when a meeting runs late', body: 'Nominate one person to coordinate schedule changes. Contact the operator before the booked finish when an extension is needed, and confirm both availability and additional cost. If the vehicle cannot extend, agree the next collection instead of assuming the driver will continue indefinitely.' },
    ],
    faqs: [
      { question: 'Is waiting counted as part of an hourly hire?', answer: 'Ask the operator to specify this in the booking scope. Agree the included period, stops and any additional charges before travel.' },
      { question: 'Can I extend my hourly booking on the day?', answer: 'An extension depends on availability and agreed charges. Request confirmation before the original booking ends.' },
      { question: 'Should I list every planned stop?', answer: 'Yes. Include addresses, expected arrival times and whether the vehicle must wait. That helps the operator assess the required duration.' },
    ],
  },
  'barcelona-cab-vs-chauffeur-business-travel': {
    sections: [
      { heading: 'Confirm the Fira venue and entrance', body: 'Use the venue and entrance shown in your event documents. A broad request for Fira Barcelona is not enough to identify the final meeting point. Send the event date, venue address, entrance or hall where relevant, and the time passengers need to be inside. Check the organiser\'s access instructions before requesting collection.' },
      { heading: 'Plan one schedule for several guests', body: 'Identify the person coordinating the booking, then list guest arrivals, hotel addresses and meeting deadlines. Guests on separate flights may need separate pickups. Confirm who receives driver contact details and how changes will be communicated. Avoid giving a driver several conflicting instructions from different passengers.' },
      { heading: 'Compare presentation and practical requirements fairly', body: 'An ordinary taxi can be suitable for a short, immediate city ride. A booked chauffeur can suit arranged guest arrivals and schedules needing confirmed vehicle requirements. Compare the actual pickup procedure, vehicle configuration, payment and invoice terms. Treat executive presentation as a preference, not evidence that a taxi is unreliable.' },
    ],
    faqs: [
      { question: 'What details are needed for a Fira Barcelona transfer?', answer: 'Provide the exact venue address, event date, entrance or hall instructions, passenger count and required arrival time from the organiser\'s documents.' },
      { question: 'Should each business guest contact the driver separately?', answer: 'A designated coordinator can help keep instructions consistent. Agree who receives contact details and how guests should report changes.' },
      { question: 'Is a chauffeur necessary for every business journey?', answer: 'No. A taxi can meet the need for a simple spontaneous ride. Pre-booking is useful when guest coordination, reserved availability or confirmed vehicle requirements matter.' },
    ],
  },
  'how-much-is-a-barcelona-airport-transfer': {
    sections: [
      { heading: 'What should the quoted total include?', body: 'Request a total for the actual journey, not just a starting fare. Confirm the vehicle, pickup arrangement, destination and payment currency. Ask whether airport parking, waiting, extra stops and any requested child seat are included. A quote is easier to compare when its assumptions are written down.', bullets: ['Confirm the total for the whole group, rather than a per-person figure', 'Ask when waiting starts and how additional waiting is charged', 'Check the change and cancellation conditions before paying'] },
      { heading: 'How do official taxi fares differ from private quotes?', body: 'Barcelona metropolitan taxi tariffs are published by AMB. A private chauffeur quote follows the operator\'s agreed booking terms instead of automatically following the taxi meter. Use the current official tariff source for taxi comparisons and request a dated private quote for your route. Do not treat a website starting price as a confirmed airport fare.' },
      { heading: 'A family arrival and a business arrival need different quotes', body: 'Consider two hypothetical trips to the same hotel. Two adults with cabin bags may request a sedan; a family with suitcases, a stroller and a child-seat request may need another configuration. The destination is identical but the vehicle requirements differ. Describe both passengers and equipment before comparing totals.' },
      { heading: 'When a cheaper alternative may be the right choice', body: 'For a traveller with light luggage and a flexible schedule, public transport may meet the need at a lower cost. An official taxi can suit a spontaneous direct trip. A booked transfer is useful when advance pickup instructions and a suitable vehicle matter. Choose based on the complete journey, including the final walk and transfers, rather than assuming the premium option is always necessary.' },
    ],
    faqs: [
      { question: 'Is the transfer price per person or per vehicle?', answer: 'Ask the operator to specify this in writing. For comparison, calculate the total for your full group, including required vehicles and any extras.' },
      { question: 'Are airport parking and waiting included?', answer: 'They depend on the booking terms. Ask for the included allowance, when it starts and the rate or approval process for additional waiting.' },
      { question: 'Can an extra stop change the quote?', answer: 'Yes. An additional stop can add distance, time or parking. Supply its address and expected duration before accepting the quote.' },
      { question: 'Can I use an official taxi tariff to calculate a chauffeur fare?', answer: 'No. Official taxi tariffs and private chauffeur booking prices are different pricing arrangements. Compare the current taxi rules with the complete private quote.' },
    ],
  },
  'best-way-from-barcelona-airport-to-city-centre': {
    sections: [
      { heading: 'Compare the complete journey to your address', body: 'A station or central bus stop is not necessarily close to your accommodation. Check the arrival stop, walking distance, onward connections and building entrance. With luggage or reduced mobility, the final part of the route can matter as much as the airport leg. For a booked vehicle, provide the street address and ask where it can legally stop.' },
      { heading: 'Terminal, timetable and ticket checks', body: 'Use Aena\'s airport transport pages and the transport operator\'s current timetable before travel. Confirm which terminal your flight uses, where the selected service departs and whether your ticket covers the airport journey. If a terminal change is necessary, include that connection in your plan rather than counting only the main ride.' },
      { heading: 'Arriving late with luggage', body: 'For a late arrival, check actual service hours for your travel date and how you will reach the hotel after leaving the airport. Keep an alternative if baggage collection runs late. A transfer can provide advance arrangements, but its pickup time, contact procedure and waiting conditions still need confirmation.' },
      { heading: 'Three realistic traveller scenarios', body: 'A solo guest with a backpack and a hotel near a suitable stop may choose public transport. Two adults going to a straightforward address may use the official taxi rank. A family carrying a stroller and several suitcases may prefer to reserve a confirmed vehicle configuration. These are planning examples, not guarantees of availability or journey time.' },
    ],
    faqs: [
      { question: 'Which transport option is best with several suitcases?', answer: 'Compare luggage handling across the entire route. A suitable taxi or booked vehicle avoids station changes, but confirm capacity for your passenger and bag combination.' },
      { question: 'Should I book based on my flight landing time?', answer: 'Provide the flight number and scheduled arrival, then agree how the operator handles airport exit time and delays. Landing and reaching the pickup point are different events.' },
      { question: 'Can a car stop directly outside every city-centre hotel?', answer: 'Not always. Traffic restrictions, pedestrian streets or the entrance location may require a nearby legal stopping point. Confirm this with the hotel and operator.' },
      { question: 'Is public transport always slower than a transfer?', answer: 'No. Traffic, departure intervals, terminal connections and the final address affect the comparison. Check the full itinerary rather than assuming a vehicle is always faster.' },
    ],
  },
  'barcelona-airport-to-cruise-port-transfer-guide': {
    sections: [
      { heading: 'What if the flight or baggage is delayed?', body: 'Contact the transfer operator and cruise line as soon as the connection becomes uncertain. Give the updated arrival estimate and latest boarding deadline. Road transport cannot recover time lost to a major flight delay. Ask the cruise line about your options instead of relying on a driver to guarantee boarding.' },
      { heading: 'Plan the return journey separately', body: 'Docking time is not the same as being ready for collection. Disembarkation arrangements, baggage retrieval and passenger clearance can affect when you reach the meeting point. Agree a pickup window and contact procedure using your cruise documents. For an onward flight, use the airline\'s check-in requirement and allow for the port exit and road journey.' },
      { heading: 'A hypothetical airport-to-ship checklist', body: 'Before travelling, one group member can keep the flight booking, cruise terminal confirmation, boarding deadline and transfer contact together. Each passenger should know the meeting instructions. If your party arrives on different flights, tell the operator: the earliest arrival may have a substantial wait and a single pickup may not suit everyone.', bullets: ['Confirm ship name, sailing date and assigned terminal', 'List each arrival flight if the group is split', 'Keep cruise-line and transfer contacts available offline'] },
    ],
    faqs: [
      { question: 'Is the port address enough to book a transfer?', answer: 'No. Provide the ship, sailing date and terminal confirmed by your cruise line. A generic port address may lead to the wrong passenger terminal.' },
      { question: 'Does a private transfer guarantee I will board my cruise?', answer: 'No. Flight delays, airport procedures, road conditions and cruise-line deadlines can affect the connection. Confirm contingency arrangements with the cruise line.' },
      { question: 'Should my return pickup use the ship docking time?', answer: 'Use the expected time you can leave the terminal, based on disembarkation instructions. Confirm how changes will be communicated to the operator.' },
    ],
  },
  'taxi-van-barcelona-groups-luggage-airport': {
    sections: [
      { heading: 'A practical luggage inventory', body: 'List cabin bags, checked suitcases and additional equipment separately. Describe a folded stroller, golf bag or mobility aid by size where possible. The same vehicle can have different usable luggage space depending on seating configuration. Ask for confirmation of your exact combination, rather than interpreting a seat count as a bag allowance.' },
      { heading: 'One van or two vehicles?', body: 'Compare complete quotes and coordination requirements. One confirmed vehicle keeps the group together; two vehicles may suit passengers with different destinations or arrival times. If using multiple vehicles, assign passengers and luggage before pickup, provide contact details for each group and confirm whether every vehicle has the correct destination.' },
      { heading: 'Child seats and accessibility are separate requirements', body: 'A larger vehicle does not establish that it has a suitable child seat or wheelchair access. Give the operator the relevant passenger needs and ask for written confirmation of the proposed equipment. Explain whether mobility equipment can be folded and whether the traveller needs to remain in their wheelchair. Do not infer accessibility from a photograph.' },
      { heading: 'Worked example: six guests with mixed luggage', body: 'For a hypothetical party of six, send the six passenger places plus a count of large suitcases, cabin bags and other equipment. Ask the operator to confirm an available configuration. If the bags do not fit safely, compare a different vehicle or two vehicles. This example illustrates the request process and does not state a particular model\'s capacity.' },
    ],
    faqs: [
      { question: 'Does a seven-seat vehicle fit seven large suitcases?', answer: 'Not necessarily. Seating and luggage space depend on the specific model and configuration. Request confirmation for your actual bag sizes and passenger count.' },
      { question: 'Should I include a stroller in the luggage count?', answer: 'Yes. List it separately and provide its folded size if available. It can affect the vehicle configuration even when the passenger count is unchanged.' },
      { question: 'Can a group arriving on different flights share one pickup?', answer: 'Possibly, but give all flight numbers and agree the waiting arrangement. Separate pickups may be more practical when arrival times differ substantially.' },
      { question: 'Are larger vehicles automatically wheelchair accessible?', answer: 'No. Accessibility must be explicitly confirmed for the traveller\'s needs and equipment; vehicle size alone is not evidence of suitability.' },
    ],
  },
  'barcelona-airport-transfer-vs-taxi': {
    sections: [
      { heading: 'Where do you meet the vehicle?', body: 'Aena identifies official airport taxi ranks at T1 and T2. For a booked private transfer, follow the operator\'s confirmed meeting instructions instead of assuming the taxi rank is your pickup location. Keep the terminal, meeting point and contact details available before departure.' },
      { heading: 'Compare waiting and cancellation conditions', body: 'For a booked transfer, ask when waiting begins, what happens after the allowance and how to report delays. Check the cancellation deadline and what happens if a flight changes. These details can be more important than a small difference in the quoted total. Do not assume that flight tracking means unlimited waiting.' },
      { heading: 'When the official taxi rank is sufficient', body: 'A taxi can suit travellers who prefer to arrange transport after arrival, have a straightforward destination and can use a vehicle available at the rank. Check the current fare rules and whether the offered vehicle fits the party. A private transfer is useful when advance vehicle confirmation and pickup arrangements are priorities.' },
      { heading: 'A fair comparison for the same trip', body: 'Use one destination address, passenger count and luggage inventory for both options. Compare the total cost, pickup process, payment method and relevant conditions. Avoid comparisons between a basic taxi ride and a chauffeur quote that includes additional waiting or stops: first make the journey assumptions match.' },
    ],
    faqs: [
      { question: 'Are Barcelona airport taxis black and yellow?', answer: 'Aena identifies official Barcelona taxis as black and yellow. Follow the airport signs to the official rank when choosing that service.' },
      { question: 'Does flight tracking mean unlimited waiting?', answer: 'No. Ask the operator to confirm how tracking affects pickup time and what waiting allowance and additional charges apply.' },
      { question: 'Should I walk to the taxi rank for a booked chauffeur?', answer: 'Follow your booking\'s meeting instructions. A booked private-hire pickup and an official taxi-rank pickup can have different arrangements.' },
      { question: 'Which option is better for a spontaneous journey?', answer: 'An official taxi rank may suit a trip arranged on arrival. A booked transfer suits a journey where you want the arrangements confirmed in advance.' },
    ],
  },
}

export const airportPickupArticle: LocalBlogArticle = {
  slug: 'barcelona-airport-pickup-guide',
  title: 'Barcelona Airport Pickup Guide: T1, T2, Meeting Points, Delays and Luggage',
  excerpt: 'Plan a calmer BCN arrival: terminal confirmation, taxi and private-transfer pickup arrangements, baggage delays, driver contact and a practical travel checklist.',
  date: '2026-10-14T00:00:00.000Z',
  image: '/img/blogs/barcelona-airport-eixample-transfer.webp',
  imageAlt: 'Illustrative chauffeur arrival scene for a Barcelona airport pickup guide',
  directAnswer: 'For a Barcelona Airport pickup, confirm your terminal, flight number, destination and meeting instructions before flying. After landing, collect your luggage and contact the operator as agreed. Use the official rank for a taxi; use the confirmed booking instructions for a private transfer. Report delays or terminal changes promptly.',
  sections: [
    { heading: 'What should I confirm before flying?', body: 'A reliable pickup starts with a complete itinerary. Send the flight number and travel date, scheduled arrival, final destination and a contact number that will work in Spain. Ask the operator to confirm the terminal and meeting procedure, including how you will identify the driver. Keep the booking confirmation offline so it is available if roaming or airport Wi-Fi is slow.', bullets: ['Flight number and arrival date', 'Terminal and exact meeting instructions', 'Working contact number and backup contact', 'Destination address, passengers and luggage'] },
    { heading: 'How do T1 and T2 affect my pickup?', body: 'T1 and T2 are distinct airport terminals. Check your flight information and use the terminal confirmed for your arrival. If it changes, inform the operator before heading to the meeting point. Do not travel between terminals merely because a map shows a different car park. Ask for updated instructions first, especially if another member of your group has already contacted the driver.' },
    { heading: 'Is a taxi rank the same as a private-transfer meeting point?', body: 'No. Aena publishes official taxi-rank information for the airport. A pre-booked private transfer follows the operator\'s meeting arrangements, which should specify where to go and whom to contact. Instructions for a particular app or operator are not universal instructions for every chauffeur service. Save the confirmation for your own booking.' },
    { heading: 'When should I tell the driver I have arrived?', body: 'Follow the agreed contact procedure. Landing does not mean you are ready to leave: passengers may still need to exit the aircraft, complete arrival procedures and retrieve luggage. If the booking asks you to message after collecting bags, do that before walking to the pickup area. Tell the operator about a substantial baggage delay rather than silently missing the agreed window.' },
    { heading: 'What happens if my flight is delayed?', body: 'Share the updated flight information as soon as practical and request confirmation of the revised pickup arrangement. Check the booking terms for waiting, rescheduling and missed pickups. Flight-aware planning does not by itself establish unlimited waiting or a free change. If the delay affects a cruise, meeting or onward train, inform that provider too: the road transfer is only one part of the connection.' },
    { heading: 'What if I cannot find my driver?', body: 'Stay at a safe, identifiable location and contact the number in your confirmation. State your terminal and the nearby sign, exit or meeting-area reference. Check whether you are following the current instructions rather than an old screenshot. Ask the operator to confirm the driver or vehicle before joining a car. Avoid repeatedly changing location without telling the person coordinating the pickup.' },
    { heading: 'How can I prepare for poor phone connectivity?', body: 'Save the contact number with its international prefix and keep a screenshot or offline copy of the meeting instructions. Check whether your mobile plan works abroad before travel. A second traveller can retain the confirmation as backup. If contact fails, use an available phone or airport help point to seek assistance and communicate your location; do not assume a message has been received simply because it was typed.' },
    { heading: 'How much luggage should I mention?', body: 'Count each category: large suitcases, cabin bags, backpacks and additional equipment. A stroller or mobility aid deserves a separate description. Give dimensions for unusually bulky items when possible. Ask the operator to confirm the available vehicle configuration for passengers and luggage together. A fleet photograph or seat count cannot answer that question on its own.' },
    { heading: 'What should families and travellers with accessibility needs confirm?', body: 'Supply relevant child-seat or mobility requirements before accepting the booking. Ask for explicit equipment and vehicle confirmation. Explain whether mobility equipment folds and whether assistance is needed at pickup. A request sent in a note is not the same as confirmed provision. If an essential requirement cannot be met, resolve it before departure rather than at the airport curb.' },
    { heading: 'Can the driver stop at my exact hotel entrance?', body: 'Give the full address and entrance details, not only the property name. Pedestrian streets, access restrictions or a different reception entrance can affect the legal stopping point. Ask the property and operator to agree the final handoff where necessary. For an apartment, include your check-in arrangements so an airport delay does not create a second problem on arrival.' },
    { heading: 'How should I arrange the return airport journey?', body: 'Treat departure as a separate itinerary. Confirm your departure terminal, flight time and the airline\'s check-in advice. Agree a collection time that accounts for the road journey and any stops, rather than reusing the arrival journey\'s duration as a guarantee. Reconfirm the address and contact procedure if you move accommodation during your stay.' },
    { heading: 'A ready-to-send pickup request', body: 'Use this checklist to prepare a concise request. Replace each item with your details, then ask the operator to confirm the meeting point, vehicle configuration, total price and booking conditions. Avoid sending passport or payment information in an initial travel enquiry.', bullets: ['Arrival date and flight number:', 'Scheduled arrival and terminal if known:', 'Destination and entrance details:', 'Adults, children and required equipment:', 'Large suitcases, cabin bags and bulky items:', 'Contact number and preferred contact method:', 'Any onward deadline or additional stop:'] },
  ],
  faqs: [
    { question: 'Where do I meet my private driver at Barcelona Airport?', answer: 'Use the meeting point in your operator\'s confirmed booking instructions. It depends on the terminal and service arrangement; there is no single meeting point for every private driver.' },
    { question: 'What if my arrival terminal changes?', answer: 'Tell the operator and ask for revised instructions before going to the pickup area. Include the flight number and your current terminal.' },
    { question: 'Should I book pickup for the landing time?', answer: 'Provide the scheduled landing time and flight number, then agree how the operator allows for airport exit procedures and baggage collection.' },
    { question: 'What if my suitcase is delayed?', answer: 'Contact the operator and describe the expected delay. Ask how the booking\'s waiting rules apply and confirm any revised collection arrangement.' },
    { question: 'Can I request a vehicle for a stroller and several bags?', answer: 'Yes, include the complete inventory in your enquiry. Accept the booking only after the operator confirms the proposed configuration fits your group and equipment.' },
    { question: 'Does a private pickup use the official taxi rank?', answer: 'Follow your booking instructions. Official taxi ranks and booked private-transfer meeting arrangements are different services.' },
    { question: 'What should I do if the driver cannot reach me?', answer: 'Use the contact in your confirmation, state your terminal and precise meeting-area reference, and agree a location before moving again.' },
    { question: 'Can I arrange an airport pickup and cruise-port drop-off?', answer: 'Include the ship, cruise terminal and latest boarding deadline with the flight details. Confirm the connection with the cruise line; a transfer does not guarantee boarding after a delay.' },
  ],
  related: [
    { label: 'Barcelona airport transfer service', href: '/services/barcelona-airport-transfer' },
    { label: 'Airport meet-and-greet answer', href: '/answers/barcelona-airport-meet-and-greet' },
    { label: 'Flight-delay planning', href: '/answers/flight-delay-airport-transfer-barcelona' },
    { label: 'Family and luggage planning', href: '/answers/family-airport-transfer-barcelona-luggage' },
  ],
}

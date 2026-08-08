package com.stwmovers.taxi.infrastructure.email;

import java.time.Instant;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.util.BookingEmailSupport;

@Component
public class BookingReceiptHtmlBuilder {

    private final AppProperties.Site site;
    private final BrandLogoProvider brandLogoProvider;

    public BookingReceiptHtmlBuilder(AppProperties appProperties, BrandLogoProvider brandLogoProvider) {
        this.site = appProperties.getSite();
        this.brandLogoProvider = brandLogoProvider;
    }

    public String build(Booking booking) {
        String reference = BookingEmailSupport.escape(booking.getBookingReference());
        String guestName = BookingEmailSupport.escape(BookingEmailSupport.resolveGuestName(booking));
        String guestEmail = BookingEmailSupport.escape(BookingEmailSupport.resolveGuestEmail(booking));
        String guestPhone = BookingEmailSupport.escape(BookingEmailSupport.resolveGuestPhone(booking));
        String pickup = BookingEmailSupport.escape(booking.getPickupAddress());
        String dropoff = BookingEmailSupport.escape(booking.getDropoffAddress());
        String scheduled = BookingEmailSupport.escape(BookingEmailSupport.formatScheduledAt(booking.getScheduledAt()));
        String vehicle = BookingEmailSupport.escape(BookingEmailSupport.vehicleLabel(booking));
        String service = BookingEmailSupport.escape(BookingEmailSupport.rideTypeLabel(booking.getRideType()));
        String distance = BookingEmailSupport.escape(BookingEmailSupport.formatDistance(booking.getDistanceKm()));
        String fare = BookingEmailSupport.escape(BookingEmailSupport.formatFare(booking.getCalculatedFare()));
        String issuedAt = BookingEmailSupport.escape(BookingEmailSupport.formatIssuedDate(Instant.now()));
        String address = BookingEmailSupport.escape(site.getContactAddress());
        String phone = BookingEmailSupport.escape(site.getContactPhoneDisplay());
        String email = BookingEmailSupport.escape(site.getContactEmail());
        String siteHost = BookingEmailSupport.escape(site.getPublicUrl().replaceAll("^https?://", "").replaceAll("/$", ""));
        String logoDataUri = brandLogoProvider.dataUri();

        String passengerCountRow = "";
        if (booking.getPassengerCount() != null) {
            passengerCountRow = """
                    <div class="row"><dt>Passengers</dt><dd>%s</dd></div>
                    """.formatted(booking.getPassengerCount());
        }

        String notesBlock = "";
        if (booking.getNotes() != null && !booking.getNotes().isBlank()) {
            notesBlock = """
                    <p class="notes"><span>Notes</span><strong>%s</strong></p>
                    """.formatted(BookingEmailSupport.escape(booking.getNotes()));
        }

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8" />
                  <style>
                    @page { size: A4; margin: 0; }
                    * { box-sizing: border-box; }
                    body {
                      margin: 0;
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 12px;
                      line-height: 1.5;
                      color: #1a1a1a;
                      background: #fafaf8;
                    }
                    .doc { width: 100%%; }
                    .header {
                      background: #090909;
                      color: #fafaf8;
                      padding: 28px 32px 22px;
                    }
                    .brand-logo {
                      display: block;
                      width: 130px;
                      height: auto;
                    }
                    .brand {
                      margin: 0;
                      font-size: 24px;
                      font-weight: 700;
                      letter-spacing: 0.08em;
                      text-transform: uppercase;
                    }
                    .tagline {
                      margin: 8px 0 0;
                      font-size: 10px;
                      letter-spacing: 0.12em;
                      text-transform: uppercase;
                      color: rgba(250,250,248,0.62);
                    }
                    .accent { height: 3px; background: #d8b24c; }
                    .hero {
                      display: table;
                      width: 100%%;
                      padding: 24px 32px 18px;
                    }
                    .hero-copy, .ref-block { display: table-cell; vertical-align: top; }
                    .ref-block {
                      width: 190px;
                      padding: 14px 16px;
                      border: 1px solid rgba(0,0,0,0.08);
                      border-radius: 14px;
                      background: #fff;
                      text-align: right;
                    }
                    .eyebrow {
                      margin: 0 0 6px;
                      font-size: 10px;
                      font-weight: 700;
                      letter-spacing: 0.14em;
                      text-transform: uppercase;
                      color: #c39c36;
                    }
                    .title {
                      margin: 0 0 8px;
                      font-size: 26px;
                      font-weight: 600;
                      color: #1a1a1a;
                    }
                    .subtitle {
                      margin: 0;
                      max-width: 280px;
                      color: #6b7280;
                    }
                    .ref-label {
                      display: block;
                      font-size: 9px;
                      font-weight: 700;
                      letter-spacing: 0.12em;
                      text-transform: uppercase;
                      color: #6b7280;
                    }
                    .ref {
                      display: block;
                      margin: 4px 0 8px;
                      font-size: 16px;
                      font-weight: 600;
                      color: #1a1a1a;
                    }
                    .status {
                      display: inline-block;
                      padding: 4px 10px;
                      border-radius: 999px;
                      background: rgba(16,185,129,0.1);
                      font-size: 9px;
                      font-weight: 700;
                      letter-spacing: 0.08em;
                      text-transform: uppercase;
                      color: #10b981;
                    }
                    .grid {
                      display: table;
                      width: 100%%;
                      padding: 0 32px 16px;
                      border-spacing: 16px 0;
                    }
                    .card {
                      display: table-cell;
                      width: 50%%;
                      padding: 16px 18px;
                      border: 1px solid rgba(0,0,0,0.08);
                      border-radius: 14px;
                      background: #fff;
                      vertical-align: top;
                    }
                    .card-title {
                      margin: 0 0 10px;
                      font-size: 10px;
                      font-weight: 700;
                      letter-spacing: 0.12em;
                      text-transform: uppercase;
                      color: #6b7280;
                    }
                    .row { margin-bottom: 8px; }
                    dt {
                      margin: 0;
                      font-size: 9px;
                      font-weight: 600;
                      letter-spacing: 0.06em;
                      text-transform: uppercase;
                      color: #a7a7a7;
                    }
                    dd {
                      margin: 2px 0 0;
                      font-size: 12px;
                      color: #1a1a1a;
                    }
                    .journey {
                      margin: 0 32px 16px;
                      padding: 18px 20px;
                      border: 1px solid rgba(0,0,0,0.08);
                      border-radius: 14px;
                      background: #fff;
                    }
                    .section-title {
                      margin: 0 0 12px;
                      font-size: 10px;
                      font-weight: 700;
                      letter-spacing: 0.12em;
                      text-transform: uppercase;
                      color: #6b7280;
                    }
                    .route-label {
                      display: block;
                      font-size: 9px;
                      font-weight: 700;
                      letter-spacing: 0.1em;
                      text-transform: uppercase;
                      color: #c39c36;
                    }
                    .route-value {
                      margin: 4px 0 10px;
                      font-size: 12px;
                      color: #1a1a1a;
                    }
                    .route-line {
                      width: 2px;
                      height: 16px;
                      margin: 0 0 10px 3px;
                      background: #d8b24c;
                    }
                    .schedule, .notes {
                      margin: 14px 0 0;
                      padding-top: 12px;
                      border-top: 1px solid #e5e5e5;
                    }
                    .schedule span, .notes span {
                      display: block;
                      font-size: 9px;
                      font-weight: 700;
                      letter-spacing: 0.1em;
                      text-transform: uppercase;
                      color: #a7a7a7;
                    }
                    .schedule strong, .notes strong {
                      display: block;
                      margin-top: 4px;
                      font-size: 12px;
                      font-weight: 600;
                      color: #1a1a1a;
                    }
                    .total {
                      margin: 0 32px 18px;
                      padding: 16px 18px;
                      border-radius: 14px;
                      background: #090909;
                      color: #fafaf8;
                    }
                    .total-row {
                      display: table;
                      width: 100%%;
                      margin: 4px 0;
                    }
                    .total-row span {
                      display: table-cell;
                      font-size: 12px;
                    }
                    .total-row span:last-child { text-align: right; }
                    .total-row.muted { color: rgba(250,250,248,0.62); font-size: 11px; }
                    .total-row.grand {
                      margin-top: 8px;
                      padding-top: 12px;
                      border-top: 1px solid rgba(250,250,248,0.12);
                    }
                    .total-row.grand strong {
                      font-size: 22px;
                      font-weight: 600;
                      color: #d8b24c;
                    }
                    .footer {
                      display: table;
                      width: 100%%;
                      padding: 16px 32px 24px;
                      border-top: 1px solid #e5e5e5;
                      color: #6b7280;
                      font-size: 10px;
                    }
                    .footer > div { display: table-cell; vertical-align: top; }
                    .footer-contact { text-align: right; }
                    .footer-brand {
                      margin: 0 0 6px;
                      font-size: 11px;
                      font-weight: 700;
                      letter-spacing: 0.08em;
                      text-transform: uppercase;
                      color: #1a1a1a;
                    }
                  </style>
                </head>
                <body>
                  <article class="doc">
                    <header class="header">
                      <img class="brand-logo" src="%s" alt="STW Movers" />
                      <p class="tagline">Executive Chauffeur Service · Barcelona</p>
                    </header>
                    <div class="accent"></div>
                    <div class="hero">
                      <div class="hero-copy">
                        <p class="eyebrow">Booking receipt</p>
                        <h1 class="title">Payment confirmation</h1>
                        <p class="subtitle">Thank you for choosing STW Movers. This receipt confirms your booking and payment.</p>
                      </div>
                      <div class="ref-block">
                        <span class="ref-label">Reference</span>
                        <strong class="ref">%s</strong>
                        <span class="status">Confirmed</span>
                      </div>
                    </div>
                    <div class="grid">
                      <div class="card">
                        <h2 class="card-title">Passenger</h2>
                        <div class="row"><dt>Name</dt><dd>%s</dd></div>
                        <div class="row"><dt>Email</dt><dd>%s</dd></div>
                        <div class="row"><dt>Phone</dt><dd>%s</dd></div>
                        %s
                      </div>
                      <div class="card">
                        <h2 class="card-title">Booking</h2>
                        <div class="row"><dt>Service</dt><dd>%s</dd></div>
                        <div class="row"><dt>Vehicle</dt><dd>%s</dd></div>
                        <div class="row"><dt>Distance</dt><dd>%s</dd></div>
                        <div class="row"><dt>Issued</dt><dd>%s</dd></div>
                      </div>
                    </div>
                    <section class="journey">
                      <h2 class="section-title">Journey details</h2>
                      <span class="route-label">Pickup</span>
                      <p class="route-value">%s</p>
                      <div class="route-line"></div>
                      <span class="route-label">Drop-off</span>
                      <p class="route-value">%s</p>
                      <p class="schedule"><span>Scheduled</span><strong>%s</strong></p>
                      %s
                    </section>
                    <section class="total">
                      <div class="total-row"><span>Transfer fare</span><span>%s</span></div>
                      <div class="total-row muted"><span>Payment method</span><span>Card (Stripe)</span></div>
                      <div class="total-row grand"><span>Total paid</span><span><strong>%s</strong></span></div>
                    </section>
                    <footer class="footer">
                      <div>
                        <p class="footer-brand">STW Movers</p>
                        <p>%s</p>
                      </div>
                      <div class="footer-contact">
                        <p>%s</p>
                        <p>%s</p>
                        <p>%s</p>
                      </div>
                    </footer>
                  </article>
                </body>
                </html>
                """.formatted(
                logoDataUri,
                reference,
                guestName == null || guestName.isBlank() ? "—" : guestName,
                guestEmail == null || guestEmail.isBlank() ? "—" : guestEmail,
                guestPhone,
                passengerCountRow,
                service,
                vehicle,
                distance,
                issuedAt,
                pickup,
                dropoff,
                scheduled,
                notesBlock,
                fare,
                fare,
                address,
                phone,
                email,
                siteHost);
    }
}

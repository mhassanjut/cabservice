package com.stwmovers.taxi.infrastructure.email;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.util.BookingEmailSupport;

@Component
public class BookingConfirmationEmailBuilder {

    private final AppProperties.Site site;
    private final BrandLogoProvider brandLogoProvider;

    public BookingConfirmationEmailBuilder(AppProperties appProperties, BrandLogoProvider brandLogoProvider) {
        this.site = appProperties.getSite();
        this.brandLogoProvider = brandLogoProvider;
    }

    public String subject(Booking booking) {
        return "Your transfer is confirmed — " + booking.getBookingReference();
    }

    public String buildText(Booking booking) {
        String firstName = BookingEmailSupport.guestFirstName(booking);
        String confirmUrl = BookingEmailSupport.confirmUrl(site.getPublicUrl(), booking.getBookingReference());

        return """
                Hello %s,

                Thank you for booking with STW Movers — your chauffeur transfer is confirmed and paid.

                Booking reference: %s

                Trip details
                ------------
                Pickup:     %s
                Drop-off:   %s
                Date/time:  %s
                Vehicle:    %s
                Service:    %s
                Total paid: %s

                What happens next
                -----------------
                We will keep you updated by email and WhatsApp. Your chauffeur details will be shared closer to pickup.

                Your receipt is attached to this email as a PDF. You can also view your booking online:
                %s

                Need help?
                Phone / WhatsApp: %s
                Email: %s

                With kind regards,
                STW Movers
                Executive Chauffeur Service · Barcelona
                %s
                """.formatted(
                firstName,
                booking.getBookingReference(),
                booking.getPickupAddress(),
                booking.getDropoffAddress(),
                BookingEmailSupport.formatScheduledAt(booking.getScheduledAt()),
                BookingEmailSupport.vehicleLabel(booking),
                BookingEmailSupport.rideTypeLabel(booking.getRideType()),
                BookingEmailSupport.formatFare(booking.getCalculatedFare()),
                confirmUrl,
                site.getContactPhoneDisplay(),
                site.getContactEmail(),
                site.getContactAddress());
    }

    public String buildHtml(Booking booking) {
        String firstName = BookingEmailSupport.escape(BookingEmailSupport.guestFirstName(booking));
        String reference = BookingEmailSupport.escape(booking.getBookingReference());
        String pickup = BookingEmailSupport.escape(booking.getPickupAddress());
        String dropoff = BookingEmailSupport.escape(booking.getDropoffAddress());
        String scheduled = BookingEmailSupport.escape(BookingEmailSupport.formatScheduledAt(booking.getScheduledAt()));
        String vehicle = BookingEmailSupport.escape(BookingEmailSupport.vehicleLabel(booking));
        String service = BookingEmailSupport.escape(BookingEmailSupport.rideTypeLabel(booking.getRideType()));
        String fare = BookingEmailSupport.escape(BookingEmailSupport.formatFare(booking.getCalculatedFare()));
        String confirmUrl = BookingEmailSupport.escape(
                BookingEmailSupport.confirmUrl(site.getPublicUrl(), booking.getBookingReference()));
        String logoUrl = brandLogoProvider.emailCidReference();
        String phone = BookingEmailSupport.escape(site.getContactPhoneDisplay());
        String email = BookingEmailSupport.escape(site.getContactEmail());
        String address = BookingEmailSupport.escape(site.getContactAddress());
        String whatsappUrl = BookingEmailSupport.escape(BookingEmailSupport.whatsappUrl(site.getWhatsappNumber()));

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Booking confirmed</title>
                </head>
                <body style="margin:0;padding:0;background:#fafaf8;color:#1a1a1a;font-family:Inter,Arial,sans-serif;">
                  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#fafaf8;padding:24px 12px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e5e5;border-radius:24px;overflow:hidden;">
                          <tr>
                            <td style="background:#090909;padding:28px 32px;">
                              <img src="%s" alt="STW Movers" width="130" style="display:block;border:0;max-width:130px;height:auto;">
                              <p style="margin:10px 0 0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,250,248,0.62);">Executive Chauffeur Service · Barcelona</p>
                            </td>
                          </tr>
                          <tr><td style="height:3px;background:#d8b24c;font-size:0;line-height:0;">&nbsp;</td></tr>
                          <tr>
                            <td style="padding:32px;">
                              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#c39c36;">Confirmation</p>
                              <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;font-weight:600;color:#1a1a1a;">Hello %s, you&apos;re all set</h1>
                              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#6b7280;">Thank you for choosing STW Movers. Your chauffeur transfer is confirmed and paid — we look forward to serving you.</p>

                              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#fafaf8;border:1px solid #e5e5e5;border-radius:16px;">
                                <tr>
                                  <td style="padding:20px 22px;">
                                    <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Booking reference</p>
                                    <p style="margin:0;font-size:22px;font-weight:600;color:#1a1a1a;">%s</p>
                                  </td>
                                </tr>
                              </table>

                              <h2 style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Trip details</h2>
                              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border-top:1px solid #e5e5e5;">
                                <tr><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;width:110px;vertical-align:top;">Pickup</td><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Drop-off</td><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Date &amp; time</td><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Vehicle</td><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Service</td><td style="padding:12px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:12px 0;font-size:13px;color:#6b7280;vertical-align:top;">Total paid</td><td style="padding:12px 0;font-size:18px;font-weight:600;color:#c39c36;">%s</td></tr>
                              </table>

                              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#fafaf8;border-radius:16px;">
                                <tr>
                                  <td style="padding:18px 20px;">
                                    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1a1a1a;">What happens next</p>
                                    <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">We&apos;ll keep you updated by email and WhatsApp. Your chauffeur details will be shared closer to pickup. Your receipt is attached as a PDF.</p>
                                  </td>
                                </tr>
                              </table>

                              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                                <tr>
                                  <td style="border-radius:999px;background:#d8b24c;">
                                    <a href="%s" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#ffffff;text-decoration:none;">View booking</a>
                                  </td>
                                </tr>
                              </table>

                              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Need help?</p>
                              <p style="margin:0;font-size:14px;line-height:1.7;color:#6b7280;">
                                Phone / WhatsApp: <a href="tel:+34627408522" style="color:#1a1a1a;text-decoration:none;">%s</a><br>
                                WhatsApp: <a href="%s" style="color:#c39c36;text-decoration:none;">Message us</a><br>
                                Email: <a href="mailto:%s" style="color:#1a1a1a;text-decoration:none;">%s</a>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:20px 32px 28px;border-top:1px solid #e5e5e5;background:#fafaf8;">
                              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#1a1a1a;">STW Movers</p>
                              <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">%s</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(
                logoUrl,
                firstName,
                reference,
                pickup,
                dropoff,
                scheduled,
                vehicle,
                service,
                fare,
                confirmUrl,
                phone,
                whatsappUrl,
                email,
                email,
                address);
    }
}

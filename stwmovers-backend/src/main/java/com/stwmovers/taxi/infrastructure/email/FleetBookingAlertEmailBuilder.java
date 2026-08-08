package com.stwmovers.taxi.infrastructure.email;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.domain.entity.Booking;
import com.stwmovers.taxi.util.BookingEmailSupport;

@Component
public class FleetBookingAlertEmailBuilder {

    private final AppProperties.Site site;

    public FleetBookingAlertEmailBuilder(AppProperties appProperties) {
        this.site = appProperties.getSite();
    }

    public String fleetAlertEmail() {
        if (site.getFleetAlertEmail() != null && !site.getFleetAlertEmail().isBlank()) {
            return site.getFleetAlertEmail().trim();
        }
        return site.getContactEmail();
    }

    public String subject(Booking booking) {
        return "New paid booking — " + booking.getBookingReference();
    }

    public String buildText(Booking booking) {
        return """
                New paid booking received

                Booking reference: %s
                Status:          %s
                Payment:         Paid online (Stripe)

                Passenger
                ---------
                Name:            %s
                Email:           %s
                Phone:           %s
                Passengers:      %s

                Trip
                ----
                Service:         %s
                Vehicle:         %s
                Custom request:  %s
                Pickup:          %s
                Coordinates:     %s
                Drop-off:        %s
                Coordinates:     %s
                Destination:     %s
                Distance:        %s
                Scheduled:       %s
                Total paid:      %s

                Notes
                -----
                %s

                Booked at:       %s
                """.formatted(
                booking.getBookingReference(),
                BookingEmailSupport.bookingStatusLabel(booking.getStatus()),
                BookingEmailSupport.displayValue(BookingEmailSupport.resolveGuestName(booking)),
                BookingEmailSupport.displayValue(BookingEmailSupport.resolveGuestEmail(booking)),
                BookingEmailSupport.resolveGuestPhone(booking),
                BookingEmailSupport.formatPassengerCount(booking.getPassengerCount()),
                BookingEmailSupport.rideTypeLabel(booking.getRideType()),
                BookingEmailSupport.vehicleLabel(booking),
                BookingEmailSupport.formatYesNo(Boolean.TRUE.equals(booking.getCustomRequest())),
                booking.getPickupAddress(),
                BookingEmailSupport.formatCoordinates(booking.getPickupLat(), booking.getPickupLng()),
                booking.getDropoffAddress(),
                BookingEmailSupport.formatCoordinates(booking.getDropoffLat(), booking.getDropoffLng()),
                BookingEmailSupport.displayValue(booking.getDestinationCity()),
                BookingEmailSupport.formatDistance(booking.getDistanceKm()),
                BookingEmailSupport.formatScheduledAt(booking.getScheduledAt()),
                BookingEmailSupport.formatFare(booking.getCalculatedFare()),
                BookingEmailSupport.displayValue(booking.getNotes()),
                BookingEmailSupport.formatScheduledAt(booking.getCreatedAt()));
    }

    public String buildHtml(Booking booking) {
        String reference = BookingEmailSupport.escape(booking.getBookingReference());
        String status = BookingEmailSupport.escape(BookingEmailSupport.bookingStatusLabel(booking.getStatus()));
        String guestName = BookingEmailSupport.escape(
                BookingEmailSupport.displayValue(BookingEmailSupport.resolveGuestName(booking)));
        String guestEmail = BookingEmailSupport.escape(
                BookingEmailSupport.displayValue(BookingEmailSupport.resolveGuestEmail(booking)));
        String guestPhone = BookingEmailSupport.escape(BookingEmailSupport.resolveGuestPhone(booking));
        String passengers = BookingEmailSupport.escape(BookingEmailSupport.formatPassengerCount(booking.getPassengerCount()));
        String service = BookingEmailSupport.escape(BookingEmailSupport.rideTypeLabel(booking.getRideType()));
        String vehicle = BookingEmailSupport.escape(BookingEmailSupport.vehicleLabel(booking));
        String customRequest = BookingEmailSupport.escape(
                BookingEmailSupport.formatYesNo(Boolean.TRUE.equals(booking.getCustomRequest())));
        String pickup = BookingEmailSupport.escape(booking.getPickupAddress());
        String pickupCoords = BookingEmailSupport.escape(
                BookingEmailSupport.formatCoordinates(booking.getPickupLat(), booking.getPickupLng()));
        String dropoff = BookingEmailSupport.escape(booking.getDropoffAddress());
        String dropoffCoords = BookingEmailSupport.escape(
                BookingEmailSupport.formatCoordinates(booking.getDropoffLat(), booking.getDropoffLng()));
        String destinationCity = BookingEmailSupport.escape(BookingEmailSupport.displayValue(booking.getDestinationCity()));
        String distance = BookingEmailSupport.escape(BookingEmailSupport.formatDistance(booking.getDistanceKm()));
        String scheduled = BookingEmailSupport.escape(BookingEmailSupport.formatScheduledAt(booking.getScheduledAt()));
        String fare = BookingEmailSupport.escape(BookingEmailSupport.formatFare(booking.getCalculatedFare()));
        String notes = BookingEmailSupport.escape(BookingEmailSupport.displayValue(booking.getNotes()));
        String bookedAt = BookingEmailSupport.escape(BookingEmailSupport.formatScheduledAt(booking.getCreatedAt()));

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>New paid booking</title>
                </head>
                <body style="margin:0;padding:0;background:#fafaf8;color:#1a1a1a;font-family:Inter,Arial,sans-serif;">
                  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#fafaf8;padding:24px 12px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e5e5;border-radius:24px;overflow:hidden;">
                          <tr>
                            <td style="background:#090909;padding:24px 28px;">
                              <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,250,248,0.62);">Fleet alert</p>
                              <h1 style="margin:0;font-size:24px;line-height:1.2;font-weight:600;color:#fafaf8;">New paid booking</h1>
                            </td>
                          </tr>
                          <tr><td style="height:3px;background:#d8b24c;font-size:0;line-height:0;">&nbsp;</td></tr>
                          <tr>
                            <td style="padding:28px;">
                              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;background:#fafaf8;border:1px solid #e5e5e5;border-radius:16px;">
                                <tr>
                                  <td style="padding:18px 20px;">
                                    <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Booking reference</p>
                                    <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1a1a1a;">%s</p>
                                    <p style="margin:0;font-size:14px;color:#6b7280;">Status: <strong style="color:#10b981;">%s</strong> · Payment: <strong style="color:#1a1a1a;">Paid online (Stripe)</strong></p>
                                  </td>
                                </tr>
                              </table>

                              <h2 style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Passenger</h2>
                              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;border-top:1px solid #e5e5e5;">
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;width:130px;vertical-align:top;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;font-size:13px;color:#6b7280;vertical-align:top;">Passengers</td><td style="padding:10px 0;font-size:14px;color:#1a1a1a;">%s</td></tr>
                              </table>

                              <h2 style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Trip details</h2>
                              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;border-top:1px solid #e5e5e5;">
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;width:130px;vertical-align:top;">Service</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Vehicle</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Custom request</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Pickup</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s<br><span style="font-size:12px;color:#6b7280;">%s</span></td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Drop-off</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s<br><span style="font-size:12px;color:#6b7280;">%s</span></td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Destination</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Distance</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#6b7280;vertical-align:top;">Scheduled</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#1a1a1a;">%s</td></tr>
                                <tr><td style="padding:10px 0;font-size:13px;color:#6b7280;vertical-align:top;">Total paid</td><td style="padding:10px 0;font-size:18px;font-weight:600;color:#c39c36;">%s</td></tr>
                              </table>

                              <h2 style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Notes</h2>
                              <p style="margin:0 0 20px;padding:14px 16px;background:#fafaf8;border:1px solid #e5e5e5;border-radius:12px;font-size:14px;line-height:1.6;color:#1a1a1a;">%s</p>

                              <p style="margin:0;font-size:12px;color:#6b7280;">Booked at: %s</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(
                reference,
                status,
                guestName,
                guestEmail,
                guestPhone,
                passengers,
                service,
                vehicle,
                customRequest,
                pickup,
                pickupCoords,
                dropoff,
                dropoffCoords,
                destinationCity,
                distance,
                scheduled,
                fare,
                notes,
                bookedAt);
    }
}

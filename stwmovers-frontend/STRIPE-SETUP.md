# Stripe Setup

Stripe Checkout is enabled for **guest** and **logged-in** bookings.

## Flow

1. Guest or logged-in user completes booking details → booking status `PAYMENT_PENDING`
2. Payment page calls `POST /api/v1/payments/session` → Stripe Checkout URL
3. User pays on Stripe (test card below)
4. Stripe redirects to `/confirm?session_id=…&ref=…`
5. Frontend calls `POST /api/v1/payments/session/complete` to confirm the booking
6. Optional: Stripe webhook `checkout.session.completed` also confirms (recommended for production)

## Where to enter keys

### Backend (required)

File: **`stwmovers-backend/.env`**

```env
STRIPE_API_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx
```

| Variable | Where to get it |
|----------|-----------------|
| `STRIPE_API_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) → **Secret key** (`sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or Dashboard → Webhooks → signing secret (`whsec_…`) |

Also in `application.yml` (defaults, override via env):

- `STRIPE_SUCCESS_URL` → `http://localhost:3000/confirm`
- `STRIPE_CANCEL_URL` → `http://localhost:3000/payment?cancelled=1`

Restart the **backend** after changing `.env`.

### Frontend (optional for Checkout redirect)

File: **`stwmovers-frontend/.env`**

```env
NUXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxx
```

Hosted Stripe Checkout does **not** require the publishable key in the browser. This is only needed if you add Stripe.js Elements later.

Restart the **frontend** after changing `.env`.

## Local webhook (optional but recommended)

Install [Stripe CLI](https://stripe.com/docs/stripe-cli), then:

```bash
stripe listen --forward-to localhost:8080/api/v1/payments/webhook
```

Copy the `whsec_…` secret into `STRIPE_WEBHOOK_SECRET`.

Without webhooks, the **success redirect + `/session/complete`** endpoint still confirms bookings for testing.

## Test card

| Field | Value |
|-------|--------|
| Number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |

## Guest vs logged-in

| Flow | Path to payment |
|------|-----------------|
| Logged in | Booking → Continue to payment → Pay now → Stripe |
| Guest | Booking → OTP verify → Pay now → Stripe |

Both use the same payment page and Stripe session API (`auth: false` — no JWT required at payment step).

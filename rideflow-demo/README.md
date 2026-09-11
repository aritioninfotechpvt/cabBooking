# RideFlow frontend demo

An interactive frontend-only demonstration for a local mobility platform: cab, auto, bike, rental and outstation bookings.

## Included demo screens

- **Admin:** operations dashboard, real-time dispatch map, bookings, customer onboarding, driver KYC, fleets, vehicles, fares/zones, payments/payouts, commission rules, coupons, notification campaigns, SOS, support, reports and roles/settings. Every menu item renders a dedicated mock-data frontend view.
- **Customer:** map-based booking flow, fare cards and booking interaction.
- **Driver:** availability switch, trip request, accept/decline actions and earnings summary.

All data is intentionally mocked in `src/main.jsx`. Buttons show demo feedback rather than sending API requests.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Laravel integration plan

1. Create Laravel API endpoints under `/api/v1` for auth, bookings, drivers, fare estimate, payments and tracking.
2. Move the sample `rides` array into `src/services/bookingService.ts` (or a React Query hook).
3. Configure Axios base URL and Laravel Sanctum authentication.
4. Replace mock live locations with Laravel Reverb/Pusher events and Google Maps tracking.
5. Add separate mobile applications when the API is ready; this interface already demonstrates their key states.

## Suggested first backend endpoints

```text
POST /auth/request-otp
POST /auth/verify-otp
GET  /admin/dashboard
GET  /admin/bookings
POST /bookings/estimate
POST /bookings
PATCH /bookings/{id}/status
POST /drivers/availability
POST /bookings/{id}/accept
POST /bookings/{id}/location
```

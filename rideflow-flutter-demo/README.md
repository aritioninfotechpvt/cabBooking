# RideFlow Flutter apps (frontend demo)

Three runnable Flutter entry points are included in one workspace:

```bash
flutter pub get
flutter run -t lib/main_customer.dart
flutter run -t lib/main_driver.dart
flutter run -t lib/main_vendor.dart
```

All information is mock data. `lib/mock_data.dart` is the only location to replace when Laravel API repositories are added.

## Included frontend flows

- Customer: local/outstation booking, ride category selection, coupon, payment, ride tracking, SOS, history and wallet.
- Driver: online status, ride acceptance, active-trip actions, earnings, wallet/payout and documents.
- Vendor: fleet overview, driver/vehicle lists, trip/earnings reports, document alerts and payouts.

## Laravel handoff

Create a repository layer for authentication, fare estimate, bookings, driver location, payouts and reports. Replace the calls to `MockRideData` and notify relevant screens through state management (Riverpod/Bloc are suitable for phase two).

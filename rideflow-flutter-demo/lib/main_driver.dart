import 'package:flutter/material.dart';
import 'app_shell.dart';
import 'mock_data.dart';
import 'feature_screens.dart';

void main() => runApp(const DriverApp());

class DriverApp extends StatelessWidget {
  const DriverApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: rideTheme(),
        home: const DriverOnboarding(),
      );
}

class DriverHome extends StatefulWidget {
  const DriverHome({super.key});
  @override
  State<DriverHome> createState() => _DriverHomeState();
}

class _DriverHomeState extends State<DriverHome> {
  int index = 0;
  @override
  Widget build(BuildContext c) {
    final pages = [
      const DriverDashboard(),
      const DriverEarnings(),
      const DriverTrips(),
      const DriverProfile()
    ];
    return Scaffold(
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (i) => setState(() => index = i),
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.home_outlined), label: 'Home'),
          NavigationDestination(
              icon: Icon(Icons.bar_chart_outlined), label: 'Earnings'),
          NavigationDestination(icon: Icon(Icons.receipt_long), label: 'Trips'),
          NavigationDestination(
              icon: Icon(Icons.person_outline), label: 'Profile')
        ],
      ),
    );
  }
}

class DriverDashboard extends StatefulWidget {
  const DriverDashboard({super.key});
  @override
  State<DriverDashboard> createState() => _DriverDashboardState();
}

class _DriverDashboardState extends State<DriverDashboard> {
  bool online = true;
  bool accepted = false;

  @override
  Widget build(BuildContext c) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Wednesday, 11 September',
                          style: TextStyle(
                              fontSize: 12, color: Colors.blueGrey)),
                      Text('Hello, Rakesh',
                          style: TextStyle(
                              fontSize: 22, fontWeight: FontWeight.w800))
                    ]),
                const Spacer(),
                Switch(
                    value: online,
                    onChanged: (v) => setState(() => online = v),
                    activeColor: green),
                Text(online ? 'Online' : 'Offline',
                    style: TextStyle(
                        color: online ? green : Colors.grey,
                        fontWeight: FontWeight.w700))
              ]),
              const SizedBox(height: 16),
              Container(
                height: 235,
                width: double.infinity,
                decoration: BoxDecoration(
                    color: const Color(0xFFDDEFE4),
                    borderRadius: BorderRadius.circular(18)),
                child: const Stack(alignment: Alignment.center, children: [
                  Icon(Icons.local_taxi, color: green, size: 47),
                  Positioned(
                      bottom: 13,
                      child: Chip(
                          avatar: Icon(Icons.bolt, color: Colors.orange),
                          label: Text('High-demand area')))
                ]),
              ),
              const SizedBox(height: 16),
              const Row(children: [
                StatTile(
                    label: 'Today’s earnings',
                    value: '₹1,860',
                    icon: Icons.account_balance_wallet_outlined),
                SizedBox(width: 10),
                StatTile(
                    label: 'Completed trips',
                    value: '08',
                    icon: Icons.route_outlined,
                    tint: Color(0xFF8063DF)),
                SizedBox(width: 10),
                StatTile(
                    label: 'Rating',
                    value: '4.9 ★',
                    icon: Icons.star_outline,
                    tint: Color(0xFFFFA34C))
              ]),
              const SizedBox(height: 18),
              if (online)
                SectionCard(
                  child: accepted
                      ? ActiveTrip()
                      : RideRequest(
                          onAccept: () => setState(() => accepted = true)),
                )
            ],
          ),
        ),
      );
}

class RideRequest extends StatelessWidget {
  const RideRequest({super.key, required this.onAccept});
  final VoidCallback onAccept;

  @override
  Widget build(BuildContext c) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            const Text('New ride request',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
            const Spacer(),
            Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                    color: const Color(0xFFFFEEEE),
                    borderRadius: BorderRadius.circular(6)),
                child: const Text('00:18',
                    style: TextStyle(
                        color: Colors.red, fontWeight: FontWeight.bold)))
          ]),
          const SizedBox(height: 12),
          const Text('Sector 17 → Mohali Airport',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          const Padding(
              padding: EdgeInsets.only(top: 5),
              child: Text('3.8 km pickup · 14.2 km trip',
                  style: TextStyle(color: Colors.blueGrey, fontSize: 12))),
          const Divider(height: 24),
          const Row(children: [
            Text('₹342',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 21)),
            SizedBox(width: 8),
            Text('Estimated earning',
                style: TextStyle(color: Colors.blueGrey, fontSize: 12)),
            Spacer(),
            Chip(label: Text('Prime Sedan'))
          ]),
          Row(children: [
            Expanded(
                child: OutlinedButton(
                    onPressed: () => toast(c, 'Ride request declined'),
                    child: const Text('Decline'))),
            const SizedBox(width: 10),
            Expanded(
                child: FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: green),
                    onPressed: onAccept,
                    child: const Text('Accept ride')))
          ])
        ],
      );
}

class ActiveTrip extends StatelessWidget {
  const ActiveTrip({super.key});

  @override
  Widget build(BuildContext c) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Active trip',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          const SizedBox(height: 10),
          const ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(child: Icon(Icons.person)),
              title: Text('Aarav Sharma'),
              subtitle: Text('Pickup: Sector 17, Chandigarh'),
              trailing: Text('₹342',
                  style: TextStyle(fontWeight: FontWeight.w800))),
          Row(children: [
            Expanded(
                child: OutlinedButton.icon(
                    onPressed: () => toast(c, 'Navigation started'),
                    icon: const Icon(Icons.navigation_outlined),
                    label: const Text('Navigate'))),
            const SizedBox(width: 8),
            Expanded(
                child: FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: green),
                    onPressed: () =>
                        toast(c, 'Arrival marked. Ask customer for trip OTP.'),
                    child: const Text('I’ve arrived')))
          ]),
          const SizedBox(height: 8),
          TextButton.icon(
              onPressed: () => toast(c, 'SOS request sent to safety team'),
              icon: const Icon(Icons.sos, color: Colors.red),
              label: const Text('Emergency SOS',
                  style: TextStyle(color: Colors.red)))
        ],
      );
}

class DriverEarnings extends StatelessWidget {
  const DriverEarnings({super.key});
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: const AppBarTitle('Earnings'),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                    color: navy, borderRadius: BorderRadius.circular(17)),
                child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Available to withdraw',
                          style: TextStyle(color: Colors.white70)),
                      SizedBox(height: 6),
                      Text('₹5,480',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 30,
                              fontWeight: FontWeight.w800)),
                      SizedBox(height: 14),
                      Text('Next payout: Friday, 13 September',
                          style:
                              TextStyle(color: Colors.white70, fontSize: 12))
                    ])),
            const SizedBox(height: 15),
            const Row(children: [
              StatTile(
                  label: 'This week',
                  value: '₹9,840',
                  icon: Icons.calendar_today_outlined),
              SizedBox(width: 10),
              StatTile(
                  label: 'Incentives',
                  value: '₹620',
                  icon: Icons.emoji_events_outlined,
                  tint: Color(0xFFFFA34C))
            ]),
            const SizedBox(height: 15),
            SectionCard(
                child: ListTile(
                    leading: const Icon(Icons.payments_outlined, color: green),
                    title: const Text('Request payout'),
                    subtitle: const Text('Transfer earnings to your bank'),
                    trailing: FilledButton(
                        onPressed: () => toast(c, 'Payout request created'),
                        child: const Text('Request'))))
          ],
        ),
      );
}

class DriverTrips extends StatelessWidget {
  const DriverTrips({super.key});
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: const AppBarTitle('Your trips'),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: MockRideData.rides
              .map((r) => SectionCard(
                      child: ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading:
                              const CircleAvatar(child: Icon(Icons.route)),
                          title: Text(r.route,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w700)),
                          subtitle: Text('${r.time} · ${r.id}'),
                          trailing: Text(r.fare,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w800)))))
              .toList(),
        ),
      );
}

class DriverProfile extends StatelessWidget {
  const DriverProfile({super.key});
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: const AppBarTitle('Driver profile'),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const SectionCard(
                child: ListTile(
                    leading:
                        CircleAvatar(radius: 25, child: Icon(Icons.person)),
                    title: Text('Rakesh Kumar',
                        style: TextStyle(fontWeight: FontWeight.w800)),
                    subtitle: Text('4.9 ★ · Prime Sedan'))),
            ...[
              'Vehicle details',
              'KYC & documents',
              'Bank account & payouts',
              'Incentives & bonuses',
              'Safety centre',
              'Help & support',
              'App settings'
            ].map((x) => SectionCard(
                    child: ListTile(
                        title: Text(x),
                        subtitle: x == 'KYC & documents'
                            ? const Text('Licence, RC, insurance and PUC')
                            : null,
                        trailing:
                            const Icon(Icons.arrow_forward_ios, size: 14),
                        onTap: () => Navigator.push(
                            c,
                            MaterialPageRoute(
                                builder: (_) => FeatureScreen(
                                    title: x,
                                    icon: x.contains('KYC')
                                        ? Icons.badge_outlined
                                        : x.contains('Bank')
                                            ? Icons.account_balance_outlined
                                            : x.contains('Safety')
                                                ? Icons.sos
                                                : Icons.directions_car_outlined,
                                    items: x == 'KYC & documents'
                                        ? [
                                            'Driving licence · Verified',
                                            'Vehicle RC · Verified',
                                            'Insurance · Expires in 42 days',
                                            'PUC · Upload renewal'
                                          ]
                                        : x == 'Bank account & payouts'
                                            ? [
                                                'HDFC Bank ending 2241',
                                                'Available payout ₹5,480',
                                                'Payout history',
                                                'Settlement statement'
                                              ]
                                            : [
                                                'Trip navigation',
                                                'Arrival / trip OTP',
                                                'Cancellation reasons',
                                                'Contact support'
                                              ],
                                    action: x.contains('KYC')
                                        ? 'Upload document'
                                        : null))))))
          ],
        ),
      );
}

class DriverOnboarding extends StatefulWidget {
  const DriverOnboarding({super.key});
  @override
  State<DriverOnboarding> createState() => _DriverOnboardingState();
}

class _DriverOnboardingState extends State<DriverOnboarding> {
  int s = 0;
  final a = [
    'Mobile & OTP verification',
    'Personal details and selfie',
    'Driving licence and vehicle RC',
    'Insurance, PUC, PAN and bank account',
    'KYC review and account activation'
  ];
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: const AppBarTitle('Become a RideFlow driver'),
        body: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Driver onboarding',
                  style:
                      TextStyle(fontSize: 25, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              const Text(
                  'Complete your profile. Our team reviews all documents before you can accept rides.'),
              const SizedBox(height: 25),
              ...List.generate(
                  a.length,
                  (i) => ListTile(
                      leading: CircleAvatar(
                          backgroundColor:
                              i <= s ? green : Colors.grey.shade200,
                          child: Text('${i + 1}',
                              style: TextStyle(
                                  color: i <= s ? Colors.white : Colors.grey))),
                      title: Text(a[i]),
                      subtitle: Text(i < s
                          ? 'Completed'
                          : i == s
                              ? 'Current step'
                              : 'Upcoming'))),
              const Spacer(),
              FilledButton(
                style: FilledButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    backgroundColor: green),
                onPressed: () => s == 4
                    ? Navigator.pushReplacement(c,
                        MaterialPageRoute(builder: (_) => const DriverHome()))
                    : setState(() => s++),
                child: Text(s == 4 ? 'View driver dashboard' : 'Continue'),
              )
            ],
          ),
        ),
      );
}


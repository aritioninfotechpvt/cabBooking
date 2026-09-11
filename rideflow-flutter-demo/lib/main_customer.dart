import 'package:flutter/material.dart';
import 'app_shell.dart';
import 'mock_data.dart';
import 'feature_screens.dart';

void main() => runApp(const CustomerApp());

class CustomerApp extends StatelessWidget {
  const CustomerApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: rideTheme(),
        home: const CustomerOnboarding(),
      );
}

class CustomerHome extends StatefulWidget {
  const CustomerHome({super.key});
  @override
  State<CustomerHome> createState() => _CustomerHomeState();
}

class _CustomerHomeState extends State<CustomerHome> {
  int index = 0;
  @override
  Widget build(BuildContext context) {
    final pages = [
      const BookRide(),
      const RideHistory(),
      const CustomerWallet(),
      const CustomerProfile()
    ];
    return Scaffold(
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (v) => setState(() => index = v),
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.local_taxi_outlined),
              selectedIcon: Icon(Icons.local_taxi),
              label: 'Book'),
          NavigationDestination(
              icon: Icon(Icons.receipt_long_outlined), label: 'Activity'),
          NavigationDestination(
              icon: Icon(Icons.account_balance_wallet_outlined),
              label: 'Wallet'),
          NavigationDestination(
              icon: Icon(Icons.person_outline), label: 'Profile')
        ],
      ),
    );
  }
}

class BookRide extends StatefulWidget {
  const BookRide({super.key});
  @override
  State<BookRide> createState() => _BookRideState();
}

class _BookRideState extends State<BookRide> {
  String service = 'Cab';
  bool outstation = false;

  @override
  Widget build(BuildContext context) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                const CircleAvatar(
                    backgroundColor: Color(0xFFFFD6AE),
                    child: Text('VK',
                        style: TextStyle(fontSize: 11, color: Colors.brown))),
                const SizedBox(width: 10),
                const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Good morning',
                          style: TextStyle(fontSize: 12, color: Colors.blueGrey)),
                      Text('Vishal Kumar',
                          style: TextStyle(
                              fontSize: 17, fontWeight: FontWeight.w800))
                    ]),
                const Spacer(),
                IconButton(
                    onPressed: () => toast(context, 'No new notifications'),
                    icon: const Icon(Icons.notifications_none))
              ]),
              const SizedBox(height: 18),
              Container(
                height: 205,
                decoration: BoxDecoration(
                    color: const Color(0xFFDFF0E7),
                    borderRadius: BorderRadius.circular(18)),
                child: Stack(children: [
                  Positioned.fill(child: CustomPaint(painter: MapPainter())),
                  const Positioned(
                      top: 74,
                      left: 74,
                      child: Icon(Icons.location_on, color: green, size: 36)),
                  const Positioned(
                      right: 73,
                      bottom: 46,
                      child: Icon(Icons.location_pin,
                          color: Colors.red, size: 38)),
                  const Positioned(
                      bottom: 12,
                      left: 14,
                      child: Chip(
                          label: Text('GPS location active'),
                          avatar:
                              Icon(Icons.my_location, size: 15, color: green)))
                ]),
              ),
              const SizedBox(height: 18),
              Text('Where are you going?',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              SectionCard(
                child: Column(children: [
                  ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.my_location, color: green),
                      title: const Text('Pickup location'),
                      subtitle: const Text('Sector 17, Chandigarh'),
                      trailing: const Icon(Icons.edit_outlined),
                      onTap: () => toast(context, 'Pickup location editor opened')),
                  const Divider(),
                  ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.location_on,
                          color: Colors.redAccent),
                      title: const Text('Where to?'),
                      subtitle: const Text('Search destination'),
                      trailing: const Icon(Icons.search),
                      onTap: () => toast(context, 'Destination search opened'))
                ]),
              ),
              const SizedBox(height: 16),
              Row(children: [
                ChoiceChip(
                    label: const Text('Local ride'),
                    selected: !outstation,
                    onSelected: (_) => setState(() => outstation = false)),
                const SizedBox(width: 8),
                ChoiceChip(
                    label: const Text('Outstation'),
                    selected: outstation,
                    onSelected: (_) => setState(() => outstation = true))
              ]),
              const SizedBox(height: 16),
              Text(
                  outstation ? 'Choose an outstation car' : 'Choose your ride',
                  style: const TextStyle(
                      fontSize: 16, fontWeight: FontWeight.w800)),
              const SizedBox(height: 10),
              SizedBox(
                height: 112,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: ['Cab', 'Auto', 'Bike', 'Rental']
                      .map((x) => Padding(
                            padding: const EdgeInsets.only(right: 9),
                            child: InkWell(
                              onTap: () => setState(() => service = x),
                              child: Container(
                                width: 92,
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: service == x
                                      ? const Color(0xFFE8F7EF)
                                      : Colors.white,
                                  border: Border.all(
                                      color: service == x
                                          ? green
                                          : const Color(0xFFE4E8EE)),
                                  borderRadius: BorderRadius.circular(13),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                        x == 'Cab'
                                            ? '🚕'
                                            : x == 'Auto'
                                                ? '🛺'
                                                : x == 'Bike'
                                                    ? '🏍️'
                                                    : '🚙',
                                        style: const TextStyle(fontSize: 27)),
                                    Text(x,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.bold)),
                                    Text(
                                        x == 'Rental'
                                            ? 'From ₹499'
                                            : '₹${x == 'Cab' ? '124' : x == 'Auto' ? '78' : '62'}',
                                        style: const TextStyle(
                                            fontSize: 11,
                                            color: Colors.blueGrey))
                                  ],
                                ),
                              ),
                            ),
                          ))
                      .toList(),
                ),
              ),
              const SizedBox(height: 10),
              SectionCard(
                child: Row(children: [
                  const Icon(Icons.local_offer_outlined, color: green),
                  const SizedBox(width: 10),
                  const Expanded(
                      child: Text('Apply a coupon',
                          style: TextStyle(fontWeight: FontWeight.w700))),
                  TextButton(
                      onPressed: () =>
                          toast(context, 'WELCOME50 coupon applied'),
                      child: const Text('VIEW'))
                ]),
              ),
              const SizedBox(height: 10),
              FilledButton(
                style: FilledButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    backgroundColor: green),
                onPressed: () => showModalBottomSheet(
                    context: context,
                    showDragHandle: true,
                    builder: (_) => ConfirmRide(service: service)),
                child: Text('Book $service'),
              )
            ],
          ),
        ),
      );
}

class ConfirmRide extends StatelessWidget {
  const ConfirmRide({super.key, required this.service});
  final String service;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Confirm $service ride',
                style:
                    const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const SizedBox(height: 15),
            const ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text('Sector 17 → Mohali Airport'),
                subtitle: Text('14.2 km · 32 minutes'),
                trailing: Text('₹342',
                    style:
                        TextStyle(fontWeight: FontWeight.w800, fontSize: 18))),
            const ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.account_balance_wallet_outlined),
                title: Text('Cash payment · Change'),
                trailing: Icon(Icons.chevron_right)),
            const ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.local_offer_outlined),
                title: Text('WELCOME50 applied'),
                trailing: Text('−₹50', style: TextStyle(color: green))),
            FilledButton(
              style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  backgroundColor: green),
              onPressed: () {
                Navigator.pop(context);
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const CustomerTracking()));
              },
              child: const Text('Confirm booking'),
            )
          ],
        ),
      );
}

class RideHistory extends StatelessWidget {
  const RideHistory({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: const AppBarTitle('Your rides'),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: MockRideData.rides
              .map((r) => SectionCard(
                    child: ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: CircleAvatar(
                        backgroundColor: const Color(0xFFE9F7EF),
                        child: Text(r.service == 'Auto' ? '🛺' : '🚕'),
                      ),
                      title: Text(r.route,
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                      subtitle: Text('${r.id} · ${r.time}'),
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(r.fare,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w800)),
                          Text(r.status,
                              style: TextStyle(
                                  fontSize: 11,
                                  color: r.status == 'Cancelled'
                                      ? Colors.red
                                      : green))
                        ],
                      ),
                    ),
                  ))
              .toList(),
        ),
      );
}

class CustomerWallet extends StatelessWidget {
  const CustomerWallet({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: const AppBarTitle('RideFlow Wallet'),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                  gradient: const LinearGradient(
                      colors: [green, Color(0xFF57B98A)]),
                  borderRadius: BorderRadius.circular(18)),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Available balance',
                      style: TextStyle(color: Colors.white70)),
                  SizedBox(height: 7),
                  Text('₹420.00',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 30,
                          fontWeight: FontWeight.w800)),
                  SizedBox(height: 18),
                  Text('Add money · View transactions',
                      style: TextStyle(color: Colors.white))
                ],
              ),
            ),
            const SizedBox(height: 18),
            const SectionCard(
              child: ListTile(
                leading: Icon(Icons.card_giftcard, color: green),
                title: Text('Referral rewards'),
                subtitle:
                    Text('Invite friends and earn ₹75 per completed ride'),
                trailing: Icon(Icons.chevron_right),
              ),
            )
          ]),
        ),
      );
}

class CustomerProfile extends StatelessWidget {
  const CustomerProfile({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: const AppBarTitle('Profile'),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const SectionCard(
              child: ListTile(
                leading: CircleAvatar(
                    radius: 25,
                    backgroundColor: Color(0xFFFFD6AE),
                    child: Text('VK')),
                title: Text('Vishal Kumar',
                    style: TextStyle(fontWeight: FontWeight.w800)),
                subtitle: Text('+91 98765 43210'),
              ),
            ),
            ...[
              'Saved places',
              'Safety centre & SOS',
              'Payment methods',
              'Help & support',
              'Notifications & referrals',
              'Settings'
            ].map((x) => SectionCard(
                  child: ListTile(
                    leading: const Icon(Icons.chevron_right),
                    title: Text(x),
                    trailing:
                        const Icon(Icons.arrow_forward_ios, size: 14),
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => FeatureScreen(
                          title: x,
                          icon: x.contains('Safety')
                              ? Icons.sos
                              : x.contains('Payment')
                                  ? Icons.payments_outlined
                                  : Icons.location_on_outlined,
                          items: x == 'Saved places'
                              ? [
                                  'Home · Sector 17',
                                  'Work · IT Park',
                                  'Add new favourite place'
                                ]
                              : x == 'Payment methods'
                                  ? ['Cash', 'UPI', 'Card', 'RideFlow wallet']
                                  : [
                                      'Recent requests',
                                      'Manage preferences',
                                      'Contact support'
                                    ],
                          action: x == 'Safety centre & SOS'
                              ? 'Add emergency contact'
                              : null,
                        ),
                      ),
                    ),
                  ),
                ))
          ],
        ),
      );
}

class MapPainter extends CustomPainter {
  @override
  void paint(Canvas c, Size s) {
    final p = Paint()
      ..color = Colors.white
      ..strokeWidth = 16
      ..style = PaintingStyle.stroke;
    c.drawLine(Offset(-20, s.height * .68), Offset(s.width + 10, 30), p);
    c.drawLine(Offset(s.width * .2, -10), Offset(s.width * .7, s.height + 10), p);
  }

  @override
  bool shouldRepaint(covariant CustomPainter o) => false;
}

class CustomerOnboarding extends StatefulWidget {
  const CustomerOnboarding({super.key});
  @override
  State<CustomerOnboarding> createState() => _CustomerOnboardingState();
}

class _CustomerOnboardingState extends State<CustomerOnboarding> {
  int step = 0;
  final pages = [
    [
      'Ride when you need it',
      'Cab, Auto, Bike, Rental and Outstation rides in one safe app.',
      '🚕'
    ],
    [
      'Your safety comes first',
      'Share live trip, use SOS and see verified driver details.',
      '🛡️'
    ],
    [
      'Simple payments',
      'Cash, UPI, card, wallet, coupons and ride invoices.',
      '₹'
    ]
  ];

  @override
  Widget build(BuildContext c) {
    final p = pages[step];
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(26),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Align(
                alignment: Alignment.topRight,
                child: TextButton(
                  onPressed: () => Navigator.pushReplacement(
                      c, MaterialPageRoute(builder: (_) => const CustomerHome())),
                  child: const Text('Skip'),
                ),
              ),
              const Spacer(),
              Center(child: Text(p[2], style: const TextStyle(fontSize: 95))),
              const SizedBox(height: 35),
              Text(p[0],
                  style: const TextStyle(
                      fontSize: 28, fontWeight: FontWeight.w800, color: navy)),
              const SizedBox(height: 12),
              Text(p[1],
                  style: const TextStyle(
                      fontSize: 15, color: Colors.blueGrey, height: 1.5)),
              const Spacer(),
              Row(
                children: [
                  ...List.generate(
                    3,
                    (i) => Container(
                      width: i == step ? 28 : 8,
                      height: 8,
                      margin: const EdgeInsets.only(right: 7),
                      decoration: BoxDecoration(
                        color: i == step ? green : Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                  const Spacer(),
                  FilledButton(
                    style: FilledButton.styleFrom(
                        minimumSize: const Size.fromHeight(54),
                        backgroundColor: green),
                    onPressed: () => step == 2
                        ? Navigator.pushReplacement(
                            c,
                            MaterialPageRoute(
                                builder: (_) => const CustomerHome()))
                        : setState(() => step++),
                    child: Text(step == 2 ? 'Get started' : 'Continue'),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}

class CustomerTracking extends StatelessWidget {
  const CustomerTracking({super.key});
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: const AppBarTitle('Your driver is arriving'),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Container(
                height: 280,
                width: double.infinity,
                decoration: BoxDecoration(
                    color: const Color(0xFFDDEFE4),
                    borderRadius: BorderRadius.circular(18)),
                child: const Stack(children: [
                  Positioned(
                      left: 90,
                      top: 140,
                      child: Icon(Icons.local_taxi, color: green, size: 45)),
                  Positioned(
                      right: 78,
                      top: 66,
                      child: Icon(Icons.location_pin,
                          color: Colors.red, size: 40)),
                  Positioned(
                      bottom: 15,
                      left: 15,
                      child: Chip(label: Text('Driver GPS live · ETA 4 min')))
                ]),
              ),
              const SizedBox(height: 14),
              const SectionCard(
                child: ListTile(
                  leading: CircleAvatar(radius: 24, child: Icon(Icons.person)),
                  title: Text('Rakesh Kumar · 4.9 ★',
                      style: TextStyle(fontWeight: FontWeight.w800)),
                  subtitle: Text(
                      'Maruti Dzire · PB 65 AB 2183\nOTP starts after arrival'),
                  isThreeLine: true,
                  trailing: Icon(Icons.call_outlined, color: green),
                ),
              ),
              const SizedBox(height: 9),
              Row(children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => toast(c, 'Live trip link shared'),
                    icon: const Icon(Icons.share_location_outlined),
                    label: const Text('Share trip'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => toast(c, 'Safety team notified'),
                    icon: const Icon(Icons.sos, color: Colors.red),
                    label: const Text('SOS'),
                  ),
                )
              ]),
              const Spacer(),
              FilledButton(
                style: FilledButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    backgroundColor: green),
                onPressed: () => toast(c, 'Trip OTP: 2748'),
                child: const Text('Driver has arrived · Show trip OTP'),
              )
            ],
          ),
        ),
      );
}


import 'package:flutter/material.dart';
import 'app_shell.dart';
import 'mock_data.dart';
import 'feature_screens.dart';

void main() => runApp(const VendorApp());

class VendorApp extends StatelessWidget {
  const VendorApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: rideTheme(),
        home: const VendorOnboarding(),
      );
}

class VendorHome extends StatefulWidget {
  const VendorHome({super.key});
  @override
  State<VendorHome> createState() => _VendorHomeState();
}

class _VendorHomeState extends State<VendorHome> {
  int index = 0;
  @override
  Widget build(BuildContext c) {
    final pages = [
      const FleetDashboard(),
      const FleetDrivers(),
      const FleetVehicles(),
      const VendorProfile()
    ];
    return Scaffold(
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (v) => setState(() => index = v),
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.dashboard_outlined), label: 'Overview'),
          NavigationDestination(
              icon: Icon(Icons.groups_outlined), label: 'Drivers'),
          NavigationDestination(
              icon: Icon(Icons.local_taxi_outlined), label: 'Vehicles'),
          NavigationDestination(
              icon: Icon(Icons.account_circle_outlined), label: 'Profile')
        ],
      ),
    );
  }
}

class FleetDashboard extends StatelessWidget {
  const FleetDashboard({super.key});
  @override
  Widget build(BuildContext c) => SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            const Text('Fleet overview',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: navy)),
            const SizedBox(height: 4),
            const Text('Maple Mobility Fleet · Chandigarh',
                style: TextStyle(color: Colors.blueGrey)),
            const SizedBox(height: 18),
            const Row(children: [
              StatTile(
                  label: 'Active drivers',
                  value: '18',
                  icon: Icons.groups_outlined),
              SizedBox(width: 10),
              StatTile(
                  label: 'Vehicles active',
                  value: '22',
                  icon: Icons.local_taxi_outlined,
                  tint: Color(0xFF8063DF))
            ]),
            const SizedBox(height: 10),
            const Row(children: [
              StatTile(
                  label: 'Today’s trips',
                  value: '46',
                  icon: Icons.route_outlined,
                  tint: Color(0xFFFFA34C)),
              SizedBox(width: 10),
              StatTile(
                  label: 'Net earnings',
                  value: '₹12,840',
                  icon: Icons.currency_rupee,
                  tint: Color(0xFF2F94C6))
            ]),
            const SizedBox(height: 18),
            SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Earnings performance',
                      style: TextStyle(
                          fontWeight: FontWeight.w800, fontSize: 16)),
                  const SizedBox(height: 6),
                  const Text('Last 7 days',
                      style: TextStyle(fontSize: 12, color: Colors.blueGrey)),
                  const SizedBox(height: 15),
                  SizedBox(
                    height: 120,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [45, 72, 50, 85, 67, 98, 77]
                          .map((v) => Container(
                              width: 24,
                              height: v.toDouble(),
                              decoration: BoxDecoration(
                                  color: green,
                                  borderRadius: BorderRadius.circular(5))))
                          .toList(),
                    ),
                  ),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Text('Mon'),
                      Text('Tue'),
                      Text('Wed'),
                      Text('Thu'),
                      Text('Fri'),
                      Text('Sat'),
                      Text('Sun')
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: 14),
            SectionCard(
              child: ListTile(
                leading: const CircleAvatar(
                    backgroundColor: Color(0xFFFFF1DF),
                    child: Icon(Icons.warning_amber_rounded,
                        color: Colors.orange)),
                title: const Text('2 document alerts'),
                subtitle: const Text(
                    'Vehicle insurance and driver licence require attention'),
                trailing: TextButton(
                    onPressed: () => toast(c, 'Document alerts opened'),
                    child: const Text('VIEW')),
              ),
            ),
            const SizedBox(height: 8),
            SectionCard(
              child: ListTile(
                leading: const CircleAvatar(
                    backgroundColor: Color(0xFFE9F7EF),
                    child: Icon(Icons.account_balance_wallet_outlined,
                        color: green)),
                title: const Text('Available payout ₹28,450'),
                subtitle: const Text('Next settlement on Friday'),
                trailing: FilledButton(
                    onPressed: () => toast(c, 'Payout request created'),
                    child: const Text('Request')),
              ),
            )
          ],
        ),
      );
}

class FleetDrivers extends StatelessWidget {
  const FleetDrivers({super.key});
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: AppBarTitle('Drivers',
            action: IconButton(
                onPressed: () => toast(c, 'Add driver form opened'),
                icon: const Icon(Icons.person_add_alt_1))),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            ...MockRideData.drivers.map((x) {
              final p = x.split(' · ');
              return SectionCard(
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const CircleAvatar(child: Icon(Icons.person)),
                  title: Text(p.first,
                      style: const TextStyle(fontWeight: FontWeight.w700)),
                  subtitle: Text('${p[1]}\n${p[2]}'),
                  isThreeLine: true,
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => toast(c, 'Driver profile opened'),
                ),
              );
            }),
            const SizedBox(height: 4),
            OutlinedButton.icon(
                onPressed: () => toast(c, 'Add driver form opened'),
                icon: const Icon(Icons.add),
                label: const Text('Add a driver'))
          ],
        ),
      );
}

class FleetVehicles extends StatelessWidget {
  const FleetVehicles({super.key});
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: AppBarTitle('Vehicles',
            action: IconButton(
                onPressed: () => toast(c, 'Add vehicle form opened'),
                icon: const Icon(Icons.add_circle_outline))),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: MockRideData.vehicles.map((x) {
            final p = x.split(' · ');
            final alert = x.contains('expires');
            return SectionCard(
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                    backgroundColor: alert
                        ? const Color(0xFFFFF1DF)
                        : const Color(0xFFE9F7EF),
                    child: Icon(Icons.local_taxi,
                        color: alert ? Colors.orange : green)),
                title: Text(p.first,
                    style: const TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Text('${p[1]}\n${p[2]}'),
                isThreeLine: true,
                trailing: const Icon(Icons.chevron_right),
                onTap: () => toast(c, 'Vehicle details opened'),
              ),
            );
          }).toList(),
        ),
      );
}

class VendorProfile extends StatelessWidget {
  const VendorProfile({super.key});
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: const AppBarTitle('Fleet profile'),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const SectionCard(
              child: ListTile(
                leading: CircleAvatar(
                    radius: 25,
                    backgroundColor: Color(0xFFE9F7EF),
                    child: Icon(Icons.business, color: green)),
                title: Text('Maple Mobility Fleet',
                    style: TextStyle(fontWeight: FontWeight.w800)),
                subtitle: Text('Vendor ID: VND-1024 · Approved'),
              ),
            ),
            ...[
              'Business & KYC documents',
              'Commission statement',
              'Bank & payout details',
              'Fleet reports',
              'Support centre',
              'Settings'
            ].map((x) => SectionCard(
                  child: ListTile(
                    title: Text(x),
                    trailing:
                        const Icon(Icons.arrow_forward_ios, size: 14),
                    onTap: () => Navigator.push(
                      c,
                      MaterialPageRoute(
                        builder: (_) => FeatureScreen(
                          title: x,
                          icon: x.contains('Bank')
                              ? Icons.account_balance_outlined
                              : x.contains('report')
                                  ? Icons.bar_chart_outlined
                                  : Icons.business_outlined,
                          items: x == 'Business & KYC documents'
                              ? [
                                  'GST certificate',
                                  'PAN card',
                                  'Bank verification',
                                  'Business address proof'
                                ]
                              : x == 'Fleet reports'
                                  ? [
                                      'Trips by driver',
                                      'Vehicle utilisation',
                                      'Daily earnings',
                                      'Commission deductions'
                                    ]
                                  : [
                                      'Settlement ₹28,450',
                                      'Payout schedule',
                                      'Raise support ticket',
                                      'Manage account'
                                    ],
                          action: x == 'Fleet reports'
                              ? 'Download report'
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

class VendorOnboarding extends StatefulWidget {
  const VendorOnboarding({super.key});
  @override
  State<VendorOnboarding> createState() => _VendorOnboardingState();
}

class _VendorOnboardingState extends State<VendorOnboarding> {
  int s = 0;
  final a = [
    'Business profile and contact details',
    'GST, PAN and proprietor KYC',
    'Bank account for settlements',
    'Add fleet vehicles and drivers',
    'Admin review and vendor activation'
  ];
  @override
  Widget build(BuildContext c) => Scaffold(
        appBar: const AppBarTitle('Register your fleet'),
        body: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Fleet onboarding',
                  style:
                      TextStyle(fontSize: 25, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              const Text(
                  'Set up your company, documents, fleet and payout information.'),
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
                          : 'Upcoming'),
                ),
              ),
              const Spacer(),
              FilledButton(
                style: FilledButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    backgroundColor: green),
                onPressed: () => s == 4
                    ? Navigator.pushReplacement(
                        c, MaterialPageRoute(builder: (_) => const VendorHome()))
                    : setState(() => s++),
                child: Text(s == 4 ? 'Open fleet dashboard' : 'Continue'),
              )
            ],
          ),
        ),
      );
}


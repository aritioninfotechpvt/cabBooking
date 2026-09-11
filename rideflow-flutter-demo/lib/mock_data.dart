class Ride {
  const Ride({required this.id, required this.route, required this.fare, required this.status, required this.time, required this.service});
  final String id, route, fare, status, time, service;
}
class MockRideData {
  static const rides = [
    Ride(id: 'RF-10842', route: 'Sector 17 → Mohali Airport', fare: '₹342', status: 'Completed', time: 'Today, 9:42 AM', service: 'Prime Sedan'),
    Ride(id: 'RF-10796', route: 'Elante Mall → Zirakpur', fare: '₹186', status: 'Completed', time: 'Yesterday, 7:20 PM', service: 'Auto'),
    Ride(id: 'RF-10770', route: 'Sector 35 → Phase 7', fare: '₹94', status: 'Cancelled', time: '08 Sep, 10:14 AM', service: 'Bike'),
  ];
  static const drivers = ['Rakesh Kumar · PB 65 AB 2183 · Online', 'Gurpreet Singh · PB 65 CF 8294 · On trip', 'Aman Verma · PB 65 EX 9091 · Offline'];
  static const vehicles = ['Maruti Dzire · PB 65 AB 2183 · Active', 'Hyundai Aura · PB 65 CF 8294 · Active', 'Honda Activa · PB 65 EX 9091 · Insurance expires in 9 days'];
}

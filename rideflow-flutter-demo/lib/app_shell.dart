import 'package:flutter/material.dart';

const green = Color(0xFF218D63);
const navy = Color(0xFF17233A);
ThemeData rideTheme() => ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor: green, brightness: Brightness.light), scaffoldBackgroundColor: const Color(0xFFF6F8FC), fontFamily: 'Roboto', appBarTheme: const AppBarTheme(elevation:0,scrolledUnderElevation:0,backgroundColor:Colors.white,surfaceTintColor:Colors.white), navigationBarTheme: NavigationBarThemeData(backgroundColor:Colors.white,indicatorColor:const Color(0xFFE3F5EB),labelTextStyle:WidgetStateProperty.resolveWith((s)=>TextStyle(fontSize:11,fontWeight:s.contains(WidgetState.selected)?FontWeight.w800:FontWeight.w500,color:navy)),iconTheme:WidgetStateProperty.resolveWith((s)=>IconThemeData(color:s.contains(WidgetState.selected)?green:const Color(0xFF6E7B90))),height:68), filledButtonTheme: FilledButtonThemeData(style:FilledButton.styleFrom(shape:RoundedRectangleBorder(borderRadius:BorderRadius.circular(10)),textStyle:const TextStyle(fontWeight:FontWeight.w800))), inputDecorationTheme: InputDecorationTheme(filled:true,fillColor:Colors.white,border:OutlineInputBorder(borderRadius:BorderRadius.circular(10),borderSide:const BorderSide(color:Color(0xFFE0E6ED))),enabledBorder:OutlineInputBorder(borderRadius:BorderRadius.circular(10),borderSide:const BorderSide(color:Color(0xFFE0E6ED)))));
void toast(BuildContext context, String message) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message), behavior: SnackBarBehavior.floating));
class AppBarTitle extends StatelessWidget implements PreferredSizeWidget {
  const AppBarTitle(this.title, {super.key, this.action}); final String title; final Widget? action;
  @override Size get preferredSize => const Size.fromHeight(64);
  @override Widget build(BuildContext context) => AppBar(title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800, color: navy)), backgroundColor: Colors.white, surfaceTintColor: Colors.white, actions: action == null ? null : [action!]);
}
class SectionCard extends StatelessWidget { const SectionCard({super.key, required this.child, this.padding = const EdgeInsets.all(16)}); final Widget child; final EdgeInsets padding;
 @override Widget build(BuildContext context) => Card(elevation: 0, color: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: Color(0xFFE7EBF0))), child: Padding(padding: padding, child: child)); }

class StatTile extends StatelessWidget { const StatTile({super.key, required this.label, required this.value, required this.icon, this.tint = green}); final String label,value; final IconData icon; final Color tint;
 @override Widget build(BuildContext context) => Expanded(child: SectionCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children:[CircleAvatar(backgroundColor:tint.withValues(alpha: .13), child:Icon(icon,color:tint)),const SizedBox(height:12),Text(value,style:const TextStyle(fontSize:20,fontWeight:FontWeight.w800,color:navy)),Text(label,style:const TextStyle(fontSize:11,color:Colors.blueGrey))]))); }


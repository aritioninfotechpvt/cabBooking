import 'package:flutter/material.dart';
import 'app_shell.dart';

class FeatureScreen extends StatefulWidget {
  const FeatureScreen({super.key, required this.title, required this.icon, required this.items, this.action});
  final String title; final IconData icon; final List<String> items; final String? action;
  @override State<FeatureScreen> createState()=>_FeatureScreenState();
}
class _FeatureScreenState extends State<FeatureScreen>{
  int selected=0;
  @override Widget build(BuildContext context)=>Scaffold(
    appBar:AppBarTitle(widget.title),
    body:LayoutBuilder(builder:(context,box){
      final wide=box.maxWidth>700;
      final details=Column(crossAxisAlignment:CrossAxisAlignment.start,children:[
        Icon(widget.icon,size:32,color:green),
        const SizedBox(height:10),
        Text(widget.items[selected],style:const TextStyle(fontSize:21,fontWeight:FontWeight.w800,color:navy)),
        const SizedBox(height:8),
        const Text('This screen is ready for live API data. Status, history, attachment and approval actions will appear here.',style:TextStyle(color:Colors.blueGrey,height:1.45)),
        const SizedBox(height:18),
        Wrap(spacing:8,runSpacing:8,children:[
          const Chip(label:Text('Secure')),
          const Chip(label:Text('Activity history')),
          const Chip(label:Text('Notifications')),
        ]),
        const Spacer(),
        if(widget.action!=null)FilledButton(style:FilledButton.styleFrom(backgroundColor:green,minimumSize:const Size.fromHeight(50)),onPressed:()=>toast(context,'${widget.action} submitted'),child:Text(widget.action!))
      ]);
      final list=ListView(padding:const EdgeInsets.all(16),children:[
        SectionCard(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(widget.title,style:const TextStyle(fontSize:20,fontWeight:FontWeight.w800)),const SizedBox(height:4),const Text('Manage this area',style:TextStyle(fontSize:12,color:Colors.blueGrey))])),
        ...widget.items.asMap().entries.map((e)=>SectionCard(child:ListTile(selected:e.key==selected,selectedTileColor:const Color(0xFFE8F6EE),shape:RoundedRectangleBorder(borderRadius:BorderRadius.circular(10)),leading:CircleAvatar(backgroundColor:e.key==selected?green:const Color(0xFFEAF1F6),child:Text('${e.key+1}',style:TextStyle(color:e.key==selected?Colors.white:navy))),title:Text(e.value,style:const TextStyle(fontWeight:FontWeight.w700)),subtitle:const Text('Tap to view details'),trailing:const Icon(Icons.arrow_forward_ios,size:14),onTap:()=>setState(()=>selected=e.key))))
      ]);
      if(!wide)return list;
      return Row(children:[SizedBox(width:370,child:list),Expanded(child:Padding(padding:const EdgeInsets.fromLTRB(0,16,16,16),child:SectionCard(child:Padding(padding:const EdgeInsets.all(20),child:details))))]);
    })
  );
}

class AppStatePreview extends StatelessWidget {
  const AppStatePreview({super.key, required this.state}); final String state;
  @override Widget build(BuildContext context){
    final data={'Loading':['Loading your ride','Please wait while we refresh the latest details.',Icons.hourglass_top_outlined],'Empty':['Nothing here yet','Your completed trips and notifications will appear here.',Icons.inbox_outlined],'Offline':['You are offline','Check your mobile data or Wi-Fi and try again.',Icons.wifi_off_outlined],'Permission':['Permission needed','Enable location and notifications from Settings to continue.',Icons.location_off_outlined],'Error':['Something went wrong','We could not load this information. Please retry.',Icons.error_outline]}[state]!;
    return Scaffold(appBar:AppBarTitle(state),body:Center(child:Padding(padding:const EdgeInsets.all(28),child:Column(mainAxisSize:MainAxisSize.min,children:[Icon(data[2] as IconData,size:62,color:green),const SizedBox(height:16),Text(data[0] as String,style:const TextStyle(fontSize:20,fontWeight:FontWeight.w800)),const SizedBox(height:8),Text(data[1] as String,textAlign:TextAlign.center,style:const TextStyle(color:Colors.blueGrey)),const SizedBox(height:20),FilledButton(style:FilledButton.styleFrom(backgroundColor:green),onPressed:()=>Navigator.pop(context),child:const Text('Try again'))]))));
  }
}

class RideFlowScreen extends StatelessWidget {
  const RideFlowScreen({super.key,required this.title,required this.steps,required this.icon});
  final String title;final List<String> steps;final IconData icon;
  @override Widget build(BuildContext c)=>Scaffold(
    appBar:AppBarTitle(title),
    body:ListView(padding:const EdgeInsets.all(16),children:[
      SectionCard(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Icon(icon,size:34,color:green),const SizedBox(height:10),Text(title,style:const TextStyle(fontSize:21,fontWeight:FontWeight.w800)),const Text('Complete frontend workflow with mock data',style:TextStyle(fontSize:12,color:Colors.blueGrey))])),
      ...steps.asMap().entries.map((e)=>SectionCard(child:ListTile(leading:CircleAvatar(backgroundColor:const Color(0xFFE8F6EE),child:Text('${e.key+1}',style:const TextStyle(color:green))),title:Text(e.value),subtitle:const Text('Tap to simulate this step'),trailing:const Icon(Icons.chevron_right),onTap:()=>toast(c,'${e.value} opened')))),
      const SizedBox(height:8),
      FilledButton(style:FilledButton.styleFrom(backgroundColor:green,minimumSize:const Size.fromHeight(50)),onPressed:()=>toast(c,'Workflow submitted'),child:const Text('Continue'))
    ])
  );
}


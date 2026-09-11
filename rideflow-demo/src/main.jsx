import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './pro-admin.css';
import { ProAdmin } from './pro-admin';

const initialRides = [
  { id: 'RF-10842', customer: 'Aarav Sharma', service: 'Prime Sedan', driver: 'Rakesh Kumar', pickup: 'Sector 17, Chandigarh', drop: 'Airport Road, Mohali', fare: '₹342', status: 'In progress', time: '09:42 AM' },
  { id: 'RF-10841', customer: 'Simran Kaur', service: 'Auto', driver: 'Gurpreet Singh', pickup: 'Zirakpur Bus Stand', drop: 'Elante Mall', fare: '₹186', status: 'Completed', time: '09:22 AM' },
  { id: 'RF-10840', customer: 'Karan Mehta', service: 'Bike', driver: 'Aman Verma', pickup: 'Phase 7, Mohali', drop: 'Sector 35, Chandigarh', fare: '₹94', status: 'Driver arriving', time: '09:18 AM' },
  { id: 'RF-10839', customer: 'Neha Gupta', service: 'Outstation SUV', driver: '—', pickup: 'Chandigarh', drop: 'Manali', fare: '₹4,850', status: 'Searching', time: '09:08 AM' },
];

const nav = ['Overview','Live rides','Bookings','Customer onboarding','Drivers & KYC','Vendors & fleet','Vehicles','Service catalogue','Cities & geo fences','Fares & zones','Payments & payouts','Wallet & ledger','Commissions','Coupons & referrals','Notifications','Safety & SOS','Support','Reports','Audit logs','Roles & settings','Integrations & compliance'];
const icons = ['▦','◉','▤','♙','♧','▣','▱','◫','⌖','◇','₹','▤','%','◇','♧','!','?','↗','☷','⚙','⌁'];

const pageLabels = {
 'Customer onboarding':['Invite customer','Review onboarding queue'],
 'Drivers & KYC':['Add driver','Approve KYC and documents'],
 'Vendors & fleet':['Add vendor','Manage fleet contracts and KYC'],
 'Vehicles':['Add vehicle','Manage vehicle compliance'],
 'Payments & payouts':['Create payout','Approve refunds and settlements'],
 'Commissions':['Create rule','Set commission and incentive rules'],
 'Coupons':['Create coupon','Promotions and referral discounts'],
 'Notifications':['Create campaign','Push, SMS and email delivery'],
 'Safety & SOS':['Open safety case','Live safety incidents and disputes'],
 'Support':['Create ticket','Support conversations and escalation'],
 'Reports':['Build report','Performance and finance exports'],
 'Roles & settings':['Add admin role','Role, permissions and integrations'],
 'Service catalogue':['Add service','Manage cab, auto, bike, rental and outstation categories'],
 'Cities & geo fences':['Add city','Set serviceable polygons, airport and restricted zones'],
 'Wallet & ledger':['Adjust wallet','Review credits, debits and referral rewards'],
 'Coupons & referrals':['Create promotion','Manage customer and driver referrals'],
 'Audit logs':['Export audit log','Track every sensitive admin action'],
 'Integrations & compliance':['Configure integration','Maps, payments, OTP, WhatsApp, GST and policy controls'],
 'Overview':['Manual booking','Monitor operations, financial health and urgent actions'],
 'Live rides':['Manual booking','Real-time trip dispatch, location tracking and safety monitoring'],
 'Fares & zones':['Add city zone','Configure city coverage, fare cards, rental/outstation rules and surge pricing']
};

function Stat({label, value, change, icon, tone}) { return <div className="stat"><div><p>{label}</p><h2>{value}</h2><span className={change?.startsWith('+') ? 'up':'muted'}>{change}</span></div><div className={'statIcon '+tone}>{icon}</div></div> }
function Status({children}) { return <span className={'status '+(String(children||'').toLowerCase().replaceAll(' ','-'))}>{children}</span> }

function App(){
 const [page,setPage]=useState('Overview');
 const [panel,setPanel]=useState('Admin');
 const [modal,setModal]=useState(false);
 const [notice,setNotice]=useState('');
 const [darkMode,setDarkMode]=useState(false);
 const [ridesList,setRidesList]=useState(initialRides);

 useEffect(()=>{
  if(darkMode){
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
 },[darkMode]);

 const addBooking = (newRide) => {
   setRidesList(prev => [newRide, ...prev]);
   setNotice(`Booking ${newRide.id} created successfully`);
   setTimeout(() => setNotice(''), 2600);
 };

 const action=(m)=>{setNotice(m);setTimeout(()=>setNotice(''),2600)};
 const [btnLabel, subtitle] = pageLabels[page] || ['', ''];

 return <div className="app">
  <aside><div className="brand"><div className="brandMark">R</div><div>Ride<span>Flow</span><small>Mobility platform</small></div></div>
  <div className="switcher"><button className={panel==='Admin'?'chosen':''} onClick={()=>setPanel('Admin')}>Admin</button><button className={panel==='Customer'?'chosen':''} onClick={()=>setPanel('Customer')}>Customer</button><button className={panel==='Driver'?'chosen':''} onClick={()=>setPanel('Driver')}>Driver</button></div>
  <nav>{nav.map((n,i)=><button key={n} className={page===n?'active':''} onClick={()=>setPage(n)}><i>{icons[i]}</i>{n}{n==='Support'&&<b>8</b>}</button>)}</nav>
  <div className="sideBottom"><div className="help">✦ <span><strong>Need help?</strong><br/>View knowledge base</span></div><div className="avatar">VK</div><div className="user"><strong>Vishal Kumar</strong><small>Super admin</small></div><span>⌄</span></div></aside>
  <main>
    <header>
      <div>
        <p className="crumb">RideFlow / {panel} / {page}</p>
        <h1>{page}</h1>
        {subtitle && <p className="headerSubtitle">{subtitle}</p>}
      </div>
      <div className="topActions">
        {btnLabel && btnLabel !== 'Manual booking' && <button className="outline" onClick={()=>action(btnLabel+' requested')}>+ {btnLabel}</button>}
        <button className="iconBtn" onClick={()=>setDarkMode(!darkMode)} title="Toggle Dark/Light Mode">{darkMode ? '☀️' : '🌙'}</button>
        <button className="iconBtn bell">♧<em>3</em></button>
        <button className="primary" onClick={()=>setModal(true)}>+ New booking</button>
      </div>
    </header>
    {notice&&<div className="toast">✓ {notice}</div>}
    {panel==='Customer'?<CustomerDemo action={action}/>:panel==='Driver'?<DriverDemo action={action}/>:<ProAdmin page={page} action={action} ridesList={ridesList} setRidesList={setRidesList}/>} 
  </main>
  {modal&&<BookingModal close={()=>setModal(false)} onAddBooking={addBooking}/>} 
 </div>
}

function CustomerDemo({action}){const [service,setService]=useState('Cab');return <section className="mobileWrap"><div className="phone"><div className="phoneTop"><span>9:41</span><b>● ● ●</b></div><div className="customerHead"><div className="avatar">VK</div><div><small>Good morning</small><strong>Vishal 👋</strong></div><span>♧</span></div><div className="map"><div className="mapRoad r1"/><div className="mapRoad r2"/><div className="pin p1">●</div><div className="pin p2">⌖</div><span className="mapLabel">Your location</span></div><div className="rideSheet"><h2>Where are you going?</h2><button className="location" onClick={()=>action('Location search opened')}><i>●</i><span>Pickup location<small>Sector 17, Chandigarh</small></span><b>⌕</b></button><button className="location"><i className="red">●</i><span>Where to?<small>Search destination</small></span><b>›</b></button><h3>Choose your ride</h3><div className="serviceChoices">{['Cab','Auto','Bike','Rental'].map(x=><button className={service===x?'sel':''} key={x} onClick={()=>setService(x)}><strong>{x==='Cab'?'🚕':x==='Auto'?'🛺':x==='Bike'?'🏍️':'🚙'}</strong>{x}<small>{x==='Cab'?'₹124':x==='Auto'?'₹78':x==='Bike'?'₹62':'From ₹499'}</small></button>)}</div><button className="bookBtn" onClick={()=>action(service+' booking requested')}>Book {service}</button></div></div><div className="demoNote"><h2>Customer booking demo</h2><p>Tap a ride type and book it. This demonstrates the customer app flow using mock data.</p><div><span>✓ GPS pickup</span><span>✓ Fare estimate</span><span>✓ Coupons & wallet</span><span>✓ Live trip tracking</span></div></div></section>}
function DriverDemo({action}){const [online,setOnline]=useState(true);return <section className="mobileWrap"><div className="phone driverPhone"><div className="phoneTop"><span>9:41</span><b>● ● ●</b></div><div className="driverHead"><div><small>Wednesday, 11 September</small><h2>Hello, Rakesh</h2></div><button onClick={()=>setOnline(!online)} className={online?'online':'offline'}><i/> {online?'Online':'Offline'}</button></div><div className="driverMap"><div className="vehicle">🚕</div><p>You're in a high-demand area</p></div><div className="earn"><span>Today’s earnings<strong>₹1,860</strong></span><span>Trips<strong>08</strong></span><span>Rating<strong>4.9 ★</strong></span></div><div className="request"><div className="requestTop"><span>New ride request</span><b>00:18</b></div><h3>Sector 17 → Mohali Airport</h3><p>3.8 km pickup · 14.2 km trip</p><div className="fareRow"><strong>₹342</strong><span>Estimated earning</span><b>Prime Sedan</b></div><div className="requestBtns"><button onClick={()=>action('Ride request declined')}>Decline</button><button onClick={()=>action('Ride accepted — navigation started')}>Accept ride</button></div></div></div><div className="demoNote"><h2>Driver partner demo</h2><p>Driver can switch availability, accept requests, start trip with OTP, view earnings and request payouts.</p></div></section>}
function BookingModal({close,onAddBooking}){
  const [step,setStep]=useState(1);
  const [mobile,setMobile]=useState('98765 43210');
  const [pickup,setPickup]=useState('Sector 17, Chandigarh');
  const [drop,setDrop]=useState('Mohali Airport');
  const [service,setService]=useState('Prime Sedan');
  const [fare,setFare]=useState('₹342');

  const handleConfirm = () => {
    const id = 'RF-' + Math.floor(10000 + Math.random() * 90000);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onAddBooking({
      id,
      customer: 'Aarav Sharma',
      service,
      driver: 'Assigning...',
      pickup,
      drop,
      fare,
      status: 'In progress',
      time
    });
    close();
  };

  return <div className="modalBack"><div className="modal"><button className="close" onClick={close}>×</button><span className="step">NEW BOOKING · STEP {step} OF 2</span><h2>{step===1?'Create a ride booking':'Confirm booking details'}</h2>{step===1?<><label>Customer mobile number<input value={mobile} onChange={e=>setMobile(e.target.value)}/></label><label>Pickup location<input value={pickup} onChange={e=>setPickup(e.target.value)}/></label><label>Destination<input value={drop} onChange={e=>setDrop(e.target.value)}/></label><label>Service category<select value={service} onChange={e=>setService(e.target.value)}><option>Prime Sedan</option><option>Auto</option><option>Bike</option><option>Outstation SUV</option></select></label><div className="modalActions"><button onClick={close}>Cancel</button><button className="primary" onClick={()=>setStep(2)}>Continue</button></div></>:<><div className="confirm"><p><span>Service</span><b>{service}</b></p><p><span>Pickup</span><b>{pickup}</b></p><p><span>Drop</span><b>{drop}</b></p><p><span>Estimated fare</span><b>{fare}</b></p><p><span>Payment</span><b>Cash / UPI</b></p></div><div className="modalActions"><button onClick={()=>setStep(1)}>Back</button><button className="primary" onClick={handleConfirm}>Confirm booking</button></div></>}</div></div>
}

createRoot(document.getElementById('root')).render(<App/>);

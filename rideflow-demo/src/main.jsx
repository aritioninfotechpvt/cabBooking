import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './pro-admin.css';
import { ProAdmin, SaasSuperAdminView } from './pro-admin';

const initialRides = [
  { id: 'RF-10842', customer: 'Aarav Sharma', service: 'Prime Sedan', driver: 'Rakesh Kumar', pickup: 'Sector 17, Chandigarh', drop: 'Airport Road, Mohali', fare: '₹342', status: 'In progress', time: '09:42 AM' },
  { id: 'RF-10841', customer: 'Simran Kaur', service: 'Auto', driver: 'Gurpreet Singh', pickup: 'Zirakpur Bus Stand', drop: 'Elante Mall', fare: '₹186', status: 'Completed', time: '09:22 AM' },
  { id: 'RF-10840', customer: 'Karan Mehta', service: 'Bike', driver: 'Aman Verma', pickup: 'Phase 7, Mohali', drop: 'Sector 35, Chandigarh', fare: '₹94', status: 'Driver arriving', time: '09:18 AM' },
  { id: 'RF-10839', customer: 'Neha Gupta', service: 'Outstation SUV', driver: '—', pickup: 'Chandigarh', drop: 'Manali', fare: '₹4,850', status: 'Searching', time: '09:08 AM' },
];

const nav = ['Overview','Live rides','Bookings','Customer onboarding','Drivers & KYC','Vendors & fleet','Vehicles','Service catalogue','Cities & geo fences','Fares & zones','Payments & payouts','Wallet & ledger','Commissions','Coupons & referrals','Notifications','Safety & SOS','Support','Reports','Audit logs','Roles & settings','Integrations & compliance'];
const icons = ['▦','◉','▤','♙','♧','▣','▱','◫','⌖','◇','₹','▤','%','◇','♧','!','?','↗','☷','⚙','⌁'];

const saasNav = ['SaaS Tenants', 'Subscriptions & MRR', 'Global Features', 'Platform Health', 'SaaS Settings'];
const saasIcons = ['🌐', '💰', '⚡', '🖥️', '⚙'];

const customerNav = ['Book a Ride', 'Active Trips', 'Ride History', 'Wallet & Offers', 'Saved Places', 'Help & Safety'];
const customerIcons = ['🚕', '📍', '▤', '💰', '⭐', '❓'];

const driverNav = ['Duty Console', 'Ride Requests', 'Daily Earnings', 'Trip History', 'My Documents', 'Vehicle Inspection'];
const driverIcons = ['🛺', '🔔', '💵', '▤', '📄', '🔧'];

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
 'Fares & zones':['Add city zone','Configure city coverage, fare cards, rental/outstation rules and surge pricing'],
 'SaaS Tenants': ['Provision tenant', 'Manage onboarded cab operator instances & client subscriptions'],
 'Subscriptions & MRR': ['Export MRR', 'Monthly recurring revenue, plan breakdown & client invoices'],
 'Global Features': ['Add feature flag', 'Enable or disable enterprise modules per tenant'],
 'Platform Health': ['System audit', 'Monitor server uptime, API latency and WebSocket connections'],
 'SaaS Settings': ['Update platform keys', 'Configure global white-label branding and cloud infrastructure'],
 'Book a Ride': ['Book now', 'Interactive GPS ride booking & fare estimator'],
 'Active Trips': ['Track driver', 'Live trip status & driver arrival updates'],
 'Ride History': ['Download receipt', 'Past trip invoices & payment summaries'],
 'Wallet & Offers': ['Add funds', 'Customer wallet balance & promotional coupons'],
 'Saved Places': ['Add place', 'Home, Office and frequent destinations'],
 'Help & Safety': ['Trigger SOS', 'In-app emergency assistance & 24/7 support'],
 'Duty Console': ['Toggle duty', 'Driver availability, high-demand areas & earnings ticker'],
 'Ride Requests': ['View requests', 'Live trip dispatch queue & pickup navigation'],
 'Daily Earnings': ['Request payout', 'Daily earnings ledger, incentive bonuses & bank payouts'],
 'Trip History': ['View ratings', 'Completed trips, customer ratings and feedback'],
 'My Documents': ['Upload document', 'Driving Licence, RC, Insurance & PAN verification'],
 'Vehicle Inspection': ['Report issue', 'Vehicle maintenance checklist & fuel records']
};

function App(){
 const [page,setPage]=useState('SaaS Tenants');
 const [panel,setPanel]=useState('SaaS Owner');
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
 const activeNav = panel === 'SaaS Owner' ? saasNav : panel === 'Customer' ? customerNav : panel === 'Driver' ? driverNav : nav;
 const activeIcons = panel === 'SaaS Owner' ? saasIcons : panel === 'Customer' ? customerIcons : panel === 'Driver' ? driverIcons : icons;

 return <div className="app">
  <aside>
   <div className="brand"><div className="brandMark">R</div><div>Ride<span>Flow</span><small>Mobility platform</small></div></div>
   <div className="switcher">
    <button className={panel==='SaaS Owner'?'chosen':''} onClick={()=>{setPanel('SaaS Owner');setPage('SaaS Tenants');}}>SaaS Owner</button>
    <button className={panel==='Admin'?'chosen':''} onClick={()=>{setPanel('Admin');setPage('Overview');}}>Tenant Admin</button>
    <button className={panel==='Customer'?'chosen':''} onClick={()=>{setPanel('Customer');setPage('Book a Ride');}}>Customer</button>
    <button className={panel==='Driver'?'chosen':''} onClick={()=>{setPanel('Driver');setPage('Duty Console');}}>Driver</button>
   </div>
   <nav>{activeNav.map((n,i)=><button key={n} className={page===n?'active':''} onClick={()=>setPage(n)}><i>{activeIcons[i]}</i>{n}{n==='Support'&&<b>8</b>}</button>)}</nav>
   <div className="sideBottom"><div className="help">✦ <span><strong>Need help?</strong><br/>View knowledge base</span></div><div className="userProfile"><div className="avatar">VK</div><div className="user"><strong>Vishal Kumar</strong><small>{panel === 'SaaS Owner' ? 'SaaS Owner' : panel === 'Customer' ? 'Customer App' : panel === 'Driver' ? 'Driver Partner' : 'Cab Operator Admin'}</small></div><span>⌄</span></div></div>
  </aside>
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
    {panel==='SaaS Owner'?<SaasSuperAdminView page={page} action={action}/>:panel==='Customer'?<CustomerPanelView page={page} action={action}/>:panel==='Driver'?<DriverPanelView page={page} action={action}/>:<ProAdmin page={page} action={action} ridesList={ridesList} setRidesList={setRidesList}/>} 
  </main>
  {modal&&<BookingModal close={()=>setModal(false)} onAddBooking={addBooking}/>} 
 </div>
}

function CustomerPanelView({ page, action }) {
  const [service, setService] = useState('Cab');

  if (page === 'Book a Ride') {
    return (
      <section className="mobileWrap">
        <div className="phone">
          <div className="phoneTop"><span>9:41</span><b>● ● ●</b></div>
          <div className="customerHead">
            <div className="avatar">VK</div>
            <div><small>Good morning</small><strong>Vishal 👋</strong></div>
            <span>♧</span>
          </div>
          <div className="map">
            <div className="mapRoad r1"/><div className="mapRoad r2"/>
            <div className="pin p1">●</div><div className="pin p2">⌖</div>
            <span className="mapLabel">Sector 17, Chandigarh</span>
          </div>
          <div className="rideSheet">
            <h2>Where are you going?</h2>
            <button className="location" onClick={() => action('Pickup search opened')}>
              <i>●</i><span>Pickup location<small>Sector 17, Chandigarh</small></span><b>⌕</b>
            </button>
            <button className="location" onClick={() => action('Destination search opened')}>
              <i className="red">●</i><span>Where to?<small>Search destination</small></span><b>›</b>
            </button>
            <h3>Choose your ride</h3>
            <div className="serviceChoices">
              {['Cab','Auto','Bike','Rental'].map(x => (
                <button className={service===x?'sel':''} key={x} onClick={() => setService(x)}>
                  <strong>{x==='Cab'?'🚕':x==='Auto'?'🛺':x==='Bike'?'🏍️':'🚙'}</strong>
                  {x}<small>{x==='Cab'?'₹124':x==='Auto'?'₹78':x==='Bike'?'₹62':'From ₹499'}</small>
                </button>
              ))}
            </div>
            <button className="bookBtn" onClick={() => action(service+' booking requested')}>Book {service}</button>
          </div>
        </div>
        <div className="demoNote">
          <h2>Customer Rider Experience</h2>
          <p>Real-time booking interface with GPS pickup, vehicle choice, fare estimate, and live driver dispatch tracking.</p>
          <div><span>✓ Instant Dispatch</span><span>✓ Clear Upfront Fares</span><span>✓ Safety SOS</span></div>
        </div>
      </section>
    );
  }

  if (page === 'Active Trips') {
    return (
      <div className="pCards" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <section className="pPanel">
          <h3>Active Trip RF-10842</h3>
          <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '14px' }}>Driver is en route to pickup point.</p>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '9px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <div className="avatar" style={{ width: '40px', height: '40px' }}>RK</div>
              <div>
                <strong style={{ display: 'block' }}>Rakesh Kumar (4.9 ★)</strong>
                <small style={{ color: '#64748b' }}>Prime Sedan · PB 65 AB 2183</small>
              </div>
            </div>
            <p><strong>Pickup:</strong> Sector 17, Chandigarh</p>
            <p><strong>Drop:</strong> Airport Road, Mohali</p>
            <p><strong>Estimated Fare:</strong> ₹342 (Cash / UPI)</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button className="outline" onClick={() => action('Calling driver Rakesh Kumar...')}>Call Driver</button>
            <button className="primary" onClick={() => action('SOS Alert triggered for trip RF-10842')}>Trigger Emergency SOS</button>
          </div>
        </section>
      </div>
    );
  }

  if (page === 'Ride History') {
    return (
      <section className="pPanel">
        <h3>Customer Trip Receipts & Invoices</h3>
        <div className="pTableWrap" style={{ marginTop: '14px' }}>
          <table>
            <thead>
              <tr><th>Booking ID</th><th>Date</th><th>Service</th><th>Route</th><th>Fare</th><th>Payment</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>RF-10841</strong></td><td>Today, 09:22 AM</td><td>Auto</td><td>Zirakpur → Elante Mall</td><td>₹186</td><td>UPI</td><td><span className="status completed">Completed</span></td></tr>
              <tr><td><strong>RF-10810</strong></td><td>Yesterday</td><td>Prime Sedan</td><td>Phase 7 → Sector 35</td><td>₹210</td><td>Wallet</td><td><span className="status completed">Completed</span></td></tr>
              <tr><td><strong>RF-10795</strong></td><td>09 Sep 2026</td><td>Bike</td><td>Mohali → Airport</td><td>₹94</td><td>Cash</td><td><span className="status completed">Completed</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (page === 'Wallet & Offers') {
    return (
      <div className="pCards" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        <section className="pPanel">
          <h3>Customer RideFlow Wallet</h3>
          <b>Available Balance: ₹450</b>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '8px 0 16px' }}>Use wallet credit for instant 1-click booking without Cash or OTP delay.</p>
          <button className="primary" onClick={() => action('Add ₹500 money modal opened')}>+ Add Money to Wallet</button>
        </section>
        <section className="pPanel">
          <h3>Active Promo Coupons</h3>
          <div style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
            <div style={{ background: '#eaf8f0', padding: '10px', borderRadius: '7px', color: '#166534' }}>
              <b>WELCOME50</b> — Get ₹50 off on first 3 rides
            </div>
            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '7px', color: '#1e40af' }}>
              <b>AIRPORT20</b> — 20% discount on Mohali Airport trips
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className="pPanel">
      <h3>Customer Portal — {page}</h3>
      <p style={{ color: '#64748b' }}>Manage your rider profile, saved places, and customer preferences.</p>
      <button className="primary" onClick={() => action(`Action submitted on ${page}`)}>Save Preferences</button>
    </section>
  );
}

function DriverPanelView({ page, action }) {
  const [online, setOnline] = useState(true);

  if (page === 'Duty Console') {
    return (
      <section className="mobileWrap">
        <div className="phone driverPhone">
          <div className="phoneTop"><span>9:41</span><b>● ● ●</b></div>
          <div className="driverHead">
            <div><small>Wednesday, 11 September</small><h2>Hello, Rakesh 👋</h2></div>
            <button onClick={() => setOnline(!online)} className={online ? 'online' : 'offline'}>
              <i/> {online ? 'Online' : 'Offline'}
            </button>
          </div>
          <div className="driverMap">
            <div className="vehicle">🚕</div>
            <p>High Demand Area · Sector 17</p>
          </div>
          <div className="earn">
            <span>Today’s earnings<strong>₹1,860</strong></span>
            <span>Trips<strong>08</strong></span>
            <span>Rating<strong>4.9 ★</strong></span>
          </div>
          <div className="request">
            <div className="requestTop"><span>New ride request</span><b>00:18</b></div>
            <h3>Sector 17 → Mohali Airport</h3>
            <p>3.8 km pickup · 14.2 km trip</p>
            <div className="fareRow"><strong>₹342</strong><span>Estimated earning</span><b>Prime Sedan</b></div>
            <div className="requestBtns">
              <button onClick={() => action('Ride request declined')}>Decline</button>
              <button onClick={() => action('Ride accepted — navigation started')}>Accept ride</button>
            </div>
          </div>
        </div>
        <div className="demoNote">
          <h2>Driver Partner Duty Console</h2>
          <p>Toggle availability, view high-demand heatmaps, accept ride dispatch requests, and track daily earnings.</p>
          <div><span>✓ Instant Payouts</span><span>✓ Trip Navigation</span><span>✓ 24/7 Driver Support</span></div>
        </div>
      </section>
    );
  }

  if (page === 'Ride Requests') {
    return (
      <section className="pPanel">
        <h3>Live Driver Dispatch Queue</h3>
        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '14px' }}>Nearby ride requests available in Chandigarh Metro region.</p>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '9px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <b>Sector 17 → Mohali Airport (14.2 km)</b>
              <span style={{ display: 'block', color: '#64748b', fontSize: '11px' }}>Customer: Aarav Sharma · Prime Sedan · 3.8 km pickup away</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <b style={{ color: '#16a34a', display: 'block', fontSize: '14px' }}>₹342</b>
              <button className="primary" onClick={() => action('Accepted request for Mohali Airport')}>Accept Request</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (page === 'Daily Earnings') {
    return (
      <div className="pCards" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        <section className="pPanel">
          <h3>Today's Driver Earnings</h3>
          <b>₹1,860</b>
          <span style={{ display: 'block', color: '#16a34a', fontSize: '12px', margin: '4px 0 14px' }}>8 Completed Trips Today</span>
          <button className="primary" onClick={() => action('Payout request for ₹1,860 sent to bank')}>Request Instant Bank Payout</button>
        </section>
        <section className="pPanel">
          <h3>Daily Incentive Bonus Progress</h3>
          <b>6 / 8 Trips Completed</b>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '6px 0 10px' }}>Complete 2 more trips today to earn ₹350 bonus!</p>
          <div style={{ background: '#e2e8f0', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
            <div style={{ background: '#218d63', width: '75%', height: '100%' }} />
          </div>
        </section>
      </div>
    );
  }

  if (page === 'My Documents') {
    return (
      <section className="pPanel">
        <h3>Driver Partner Verification & Compliance</h3>
        <div className="pTableWrap" style={{ marginTop: '14px' }}>
          <table>
            <thead>
              <tr><th>Document</th><th>Submitted Value</th><th>Expiry Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td>Driving Licence</td><td>DL-042018009412</td><td>14 Aug 2031</td><td><span className="status completed">Verified ✅</span></td><td><button className="pView" onClick={() => action('DL preview opened')}>View</button></td></tr>
              <tr><td>Vehicle RC</td><td>PB 65 AB 2183</td><td>20 Mar 2029</td><td><span className="status completed">Verified ✅</span></td><td><button className="pView" onClick={() => action('RC preview opened')}>View</button></td></tr>
              <tr><td>Vehicle Insurance</td><td>INS-908412-M</td><td>28 Sep 2026 (17 days)</td><td><span className="status driver-arriving">Expiring Soon ⚠️</span></td><td><button className="pView" onClick={() => action('Insurance renewal upload opened')}>Renew</button></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <section className="pPanel">
      <h3>Driver Console — {page}</h3>
      <p style={{ color: '#64748b' }}>Manage driver profile, vehicle maintenance checklist and duty settings.</p>
      <button className="primary" onClick={() => action(`Action updated on ${page}`)}>Save Driver Settings</button>
    </section>
  );
}

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

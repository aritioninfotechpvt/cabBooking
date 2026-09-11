import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle } from 'react-leaflet';

const initialRows = {
 'Bookings': [['RF-10842','Aarav Sharma','Prime Sedan','Rakesh Kumar','₹342','In progress'],['RF-10841','Simran Kaur','Auto','Gurpreet Singh','₹186','Completed'],['RF-10840','Karan Mehta','Bike','Aman Verma','₹94','Driver arriving']],
 'Customer onboarding': [['Priya Malhotra','98144 20220','OTP verified','80%','Pending'],['Rohan Bansal','98712 33004','OTP verified','100%','Active']],
 'Drivers & KYC': [['Rakesh Kumar','DL verified','RC + insurance verified','Bank verified','Approved'],['Aman Verma','DL pending','RC verified','Bank verified','Under review'],['Rajesh Saini','DL verified','RC expired','Bank pending','Action needed']],
 'Vendors & fleet': [['Maple Mobility Fleet','18','22','₹28,450','Approved'],['CityLink Cabs','12','15','₹14,820','Approved']],
 'Vehicles': [['PB 65 AB 2183','Prime Sedan','Rakesh Kumar','Verified','Active'],['PB 65 EX 9091','Bike','Aman Verma','Insurance expiring','Review']],
 'Payments & payouts': [['PAY-88142','Ride payment','Aarav Sharma','₹342','UPI','Success'],['PYO-1472','Driver payout','Rakesh Kumar','₹5,480','Bank','Pending'],['REF-1277','Refund','Karan Mehta','₹94','Wallet','Processed']],
 'Commissions': [['Chandigarh standard','Independent drivers','Cab','18%','Active'],['Maple fleet agreement','Maple Fleet','All','12%','Active'],['Bike launch incentive','Zirakpur drivers','Bike','10%','Scheduled']],
 'Accounting & GST': [
  ['INV-9082','Customer Tax Invoice (5% GST)','Aarav Sharma (Rider)','₹290.00','₹14.50 (5% GST)','Filed (GSTR-1)'],
  ['INV-9081','Cab Operator Commission (18% GST)','Maple Cabs (Vendor)','₹1,450.00','₹261.00 (18% GST)','Generated'],
  ['TDS-4012','Driver TDS Settlement (1% 194C)','Rakesh Kumar (Driver)','₹12,400.00','₹124.00 (1% TDS)','Remitted'],
  ['INV-9080','Customer Tax Invoice (5% GST)','Simran Kaur (Rider)','₹158.00','₹7.90 (5% GST)','Filed (GSTR-1)'],
  ['INV-9079','Customer Tax Invoice (5% GST)','Karan Mehta (Rider)','₹89.50','₹4.48 (5% GST)','Filed (GSTR-1)']
 ],
 'Coupons': [['WELCOME50','₹50 off','First ride','482 / 1000','Active'],['AIRPORT20','20% off','Airport','134 / 500','Active']],
 'Notifications': [['Weekend airport offer','8,420 customers','Push + SMS','Sat, 9 AM','Scheduled'],['KYC reminder','14 drivers','Push + SMS','Today, 11 AM','Sent']],
 'Safety & SOS': [['SOS-071','RF-10812','Customer','Sector 22','High','Resolved'],['DIS-244','RF-10806','Driver','Mohali Airport','Medium','Open']],
 'Support': [['SUP-2094','Aarav Sharma','Driver arrived late','Medium','Open'],['SUP-2090','Rakesh Kumar','Payout not received','High','In progress']],
 'Reports': [['Revenue by city','September 2026','CSV / PDF','Today','Ready'],['Driver payout summary','Week 37','XLSX','Today','Ready']],
 'Roles & settings': [['Super Admin','All permissions','Vishal Kumar','Active'],['Operations Manager','Rides, drivers, SOS','2 members','Active'],['Finance Executive','Payments, payouts','1 member','Active']],
 'Service catalogue': [['Prime Sedan','Cab','4 seats','Base ₹55 | ₹14/km','Enabled'],['Auto Rickshaw','Auto','3 seats','Base ₹30 | ₹10/km','Enabled'],['E-Rickshaw (Electric)','E-Rickshaw','4 seats','Base ₹20 | ₹7/km','Enabled'],['Bike Taxi','Bike','1 rider','Base ₹25 | ₹6/km','Enabled'],['Outstation SUV','Outstation','6 seats','Base ₹250 | ₹18/km','Enabled'],['Rental Hatchback','Rental','4 seats','Base ₹499 | 8 hrs','Enabled']],
 'Cities & geo fences': [['Chandigarh','3 service zones','Airport zone','Active'],['Mohali','2 service zones','Railway station','Active'],['Zirakpur','1 service zone','No restricted zone','Active']],
 'Wallet & ledger': [['WLT-8121','Customer credit','Aarav Sharma','+ ₹120','Completed'],['WLT-8119','Driver deduction','Rakesh Kumar','− ₹42','Completed'],['WLT-8117','Referral reward','Simran Kaur','+ ₹75','Pending']],
 'Coupons & referrals': [['WELCOME50','Coupon','₹50 off','30-Sep-2026','482 / 1000 uses','Active'],['REF-VISHAL','Customer referral','₹75 credit','31-Dec-2026','28 conversions','Active'],['DRV-RAKESH','Driver referral','₹500 reward','31-Dec-2026','4 conversions','Active']],
 'Audit logs': [['AUD-8042','Vishal Kumar','Approved driver KYC','Rakesh Kumar','Today, 09:42'],['AUD-8038','Finance Team','Released payout','PYO-1472','Today, 08:14'],['AUD-8030','Operations','Updated fare rule','Chandigarh sedan','Yesterday']],
 'Integrations & compliance': [['Google Maps','Maps / routes / places','Connected','Active'],['Razorpay','Payments & refunds','Sandbox','Active'],['SMS / WhatsApp','OTP & notifications','Configure keys','Review'],['GST & tax','Invoice settings','18% GST','Active']],
};

const cols = {
 'Bookings':['Booking','Customer','Service','Driver','Fare','Status'],
 'Customer onboarding':['Customer','Mobile','Verification','Profile','Status'],
 'Drivers & KYC':['Driver','Driving licence','Vehicle documents','Bank KYC','Application'],
 'Vendors & fleet':['Fleet','Drivers','Vehicles','Payout','Status'],
 'Vehicles':['Vehicle','Category','Driver','Documents','Status'],
 'Payments & payouts':['Reference','Type','User','Amount','Method','Status'],
 'Commissions':['Rule','Applies to','Service','Commission','Status'],
 'Accounting & GST':['Invoice / Ref ID','Invoice Type','Billed To / Entity','Taxable Value','GST / TDS Tax','Filing Status'],
 'Coupons':['Coupon','Offer','Eligibility','Usage','Status'],
 'Notifications':['Campaign','Audience','Channel','Schedule','Status'],
 'Safety & SOS':['Alert','Ride','Raised by','Location','Priority','Status'],
 'Support':['Ticket','Raised by','Subject','Priority','Status'],
 'Reports':['Report','Period','Format','Updated','Status'],
 'Roles & settings':['Role','Permissions','Members','Status'],
 'Service catalogue':['Service Name','Category','Capacity','Pricing Structure','Status'],
 'Cities & geo fences':['City','Coverage','Special zone','Status'],
 'Wallet & ledger':['Reference','Type','Account','Amount','Status'],
 'Coupons & referrals':['Code / Promo','Type','Reward / Offer','Expiration Date','Usage Tracker','Status'],
 'Audit logs':['Log ID','Actor','Action','Target','Timestamp'],
 'Integrations & compliance':['Service','Use','Configuration','Status']
};

const labels = {
 'Customer onboarding':['Invite customer','Review onboarding queue'],
 'Drivers & KYC':['Add driver','Approve KYC and documents'],
 'Vendors & fleet':['Add vendor','Manage fleet contracts and KYC'],
 'Vehicles':['Add vehicle','Manage vehicle compliance'],
 'Payments & payouts':['Create payout','Approve refunds and settlements'],
 'Commissions':['Create rule','Set commission and incentive rules'],
 'Accounting & GST':['Generate invoice','Tax compliance, customer ride GST invoices, driver TDS 194C & GSTR export'],
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
 'Integrations & compliance':['Configure integration','Maps, payments, OTP, WhatsApp, GST and policy controls']
};

const selectStyle = {
 control: (b) => ({ ...b, minHeight: 40, borderColor: '#dfe5ec', borderRadius: 8, boxShadow: 'none' }),
 menu: (b) => ({ ...b, zIndex: 30 })
};

const ask = async (title, text = 'Action submitted in RideFlow system.') => {
 const a = await Swal.fire({ title, text, icon: 'question', showCancelButton: true, confirmButtonColor: '#218d63', confirmButtonText: 'Continue' });
 if (a.isConfirmed) Swal.fire({ title: 'Saved', text: 'Workflow update confirmed.', icon: 'success', confirmButtonColor: '#218d63' });
};

function Badge({ children }) {
 const val = String(children || '').toLowerCase().replaceAll(' ', '-');
 return <span className={'pBadge ' + val}>{children}</span>;
}

function ModuleHeader() {
 return null;
}

function Mini({ label, value, note, icon }) {
 return (
  <div className="pMini">
   <span className="pMiniIcon">{icon}</span>
   <p>{label}<b>{value}</b><small>{note}</small></p>
  </div>
 );
}

// Custom Leaflet Icons
const createDivIcon = (emoji, bg = '#218d63') => {
 return L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background:${bg};color:#fff;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:14px;box-shadow:0 4px 10px rgba(0,0,0,0.3);border:2px solid #fff;">${emoji}</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17]
 });
};

const iconCab = createDivIcon('🚕', '#218d63');
const iconAuto = createDivIcon('🛺', '#e67e22');
const iconBike = createDivIcon('🏍️', '#8e44ad');
const iconPickup = createDivIcon('📍', '#27ae60');
const iconDrop = createDivIcon('🏁', '#c0392b');

function LeafletLiveMap() {
 const position = [30.7100, 76.7600]; // Chandigarh Metro Center
 const routePolyline = [
  [30.7415, 76.7791], // Pickup: Sector 17
  [30.7250, 76.7650],
  [30.6950, 76.7500],
  [30.6698, 76.7865]  // Drop: Airport Road
 ];

 return (
  <div className="liveMap">
   <MapContainer center={position} zoom={12} scrollWheelZoom={false}>
    <TileLayer
     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[30.7415, 76.7791]} icon={iconPickup}>
     <Popup><b>Pickup:</b> Sector 17, Chandigarh</Popup>
    </Marker>
    <Marker position={[30.6698, 76.7865]} icon={iconDrop}>
     <Popup><b>Destination:</b> Airport Road, Mohali</Popup>
    </Marker>
    <Marker position={[30.7300, 76.7700]} icon={iconCab}>
     <Popup><b>Cab (Rakesh Kumar)</b><br />Active Trip RF-10842</Popup>
    </Marker>
    <Marker position={[30.7046, 76.7179]} icon={iconAuto}>
     <Popup><b>Auto (Gurpreet Singh)</b><br />Completed Trip RF-10841</Popup>
    </Marker>
    <Marker position={[30.6425, 76.8173]} icon={iconBike}>
     <Popup><b>Bike (Aman Verma)</b><br />Driver Arriving</Popup>
    </Marker>
    <Polyline positions={routePolyline} color="#218d63" weight={5} opacity={0.85} dashArray="8, 8" />
   </MapContainer>
   <div className="mapLegend">
    <b>48 active rides</b>
    <span>186 drivers online · Leaflet GPS live</span>
   </div>
  </div>
 );
}

function LeafletZoneMap({ rainSurge = 0, airportRush = false }) {
 const position = [30.6900, 76.7600];
 const chdPolygon = [[30.7600, 76.7500], [30.7600, 76.8100], [30.7100, 76.8100], [30.7100, 76.7500]];
 const mhlPolygon = [[30.7100, 76.6800], [30.7100, 76.7500], [30.6500, 76.7500], [30.6500, 76.6800]];
 const zrkPolygon = [[30.6600, 76.7800], [30.6600, 76.8500], [30.6100, 76.8500], [30.6100, 76.7800]];

 const sec17Surge = (2.2 + rainSurge).toFixed(1);
 const airportSurge = (airportRush ? 2.8 : 2.5 + rainSurge).toFixed(1);
 const mohaliSurge = (1.8 + rainSurge).toFixed(1);

 return (
  <div className="zoneMap" style={{ height: '360px', borderRadius: '13px', overflow: 'hidden', position: 'relative' }}>
   <MapContainer center={position} zoom={11} scrollWheelZoom={false}>
    <TileLayer
     attribution='&copy; OpenStreetMap'
     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Polygon positions={chdPolygon} pathOptions={{ color: '#218d63', fillColor: '#218d63', fillOpacity: 0.2 }}>
     <Popup><b>Chandigarh Zone</b><br />3 active fare zones</Popup>
    </Polygon>
    <Polygon positions={mhlPolygon} pathOptions={{ color: '#8e44ad', fillColor: '#8e44ad', fillOpacity: 0.2 }}>
     <Popup><b>Mohali Zone</b><br />2 active fare zones</Popup>
    </Polygon>
    <Polygon positions={zrkPolygon} pathOptions={{ color: '#e67e22', fillColor: '#e67e22', fillOpacity: 0.2 }}>
     <Popup><b>Zirakpur Zone</b><br />1 active fare zone</Popup>
    </Polygon>

    {/* AI Demand Heatmap Rings */}
    <Circle center={[30.7415, 76.7791]} radius={1300} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.45 }}>
     <Popup>🔥 <b>Sector 17 Demand Heatmap</b><br />Surge: <strong>{sec17Surge}x</strong><br />Requests: 48 / 8 cabs</Popup>
    </Circle>
    <Circle center={[30.6698, 76.7865]} radius={1500} pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.5 }}>
     <Popup>✈️ <b>Airport T3 Rush Cluster</b><br />Surge: <strong>{airportSurge}x</strong><br />Requests: 64 / 10 cabs</Popup>
    </Circle>
    <Circle center={[30.7100, 76.7100]} radius={1100} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.4 }}>
     <Popup>⚡ <b>Mohali Tech Hub Heatmap</b><br />Surge: <strong>{mohaliSurge}x</strong><br />Requests: 32 / 12 cabs</Popup>
    </Circle>
   </MapContainer>
   <div className="mapLegend" style={{ background: 'rgba(15, 23, 42, 0.88)', color: '#fff', padding: '8px 12px', borderRadius: '8px', position: 'absolute', bottom: '10px', right: '10px', zIndex: 1000, fontSize: '11px' }}>
    <b>🔥 AI Demand Heatmap Layer</b><br />
    <span>🔴 High Surge (&gt;2.0x) &nbsp; 🟠 Moderate (1.5x)</span>
   </div>
  </div>
 );
}

// KYC Modal Component
function KycModal({ close, onDecision }) {
 return (
  <div className="modalBack">
   <div className="modal" style={{ width: '560px' }}>
    <button className="close" onClick={close}>×</button>
    <span className="step">DRIVER KYC INSPECTION</span>
    <h2>Document Review — Aman Verma</h2>
    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
     <p style={{ margin: 0, fontSize: '12px' }}><strong>Vehicle:</strong> Honda Activa · PB 65 EX 9091</p>
     <p style={{ margin: '4px 0 0', fontSize: '12px' }}><strong>Submitted:</strong> Today, 10:14 AM</p>
    </div>
    <div style={{ display: 'grid', gap: '10px' }}>
     <div className="docRow" style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <span><strong>Driving Licence:</strong> DL-14202688941 <Badge>Pending Verification</Badge></span>
     </div>
     <div className="docRow" style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <span><strong>Vehicle RC:</strong> Verified (Matches PB 65 EX 9091) <Badge>Approved</Badge></span>
     </div>
     <div className="docRow" style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <span><strong>Insurance Policy:</strong> ICICI Lombard (Active) <Badge>Approved</Badge></span>
     </div>
    </div>
    <div className="modalActions" style={{ marginTop: '20px' }}>
     <button onClick={() => onDecision('Rejected')} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>Reject Application</button>
     <button className="primary" onClick={() => onDecision('Approved')}>Approve & Activate Driver</button>
    </div>
   </div>
  </div>
 );
}

// Fare Rules Editor Modal Component
function FareEditorModal({ close, currentRules, onSave }) {
 const [base, setBase] = useState(currentRules.base || '55');
 const [perKm, setPerKm] = useState(currentRules.perKm || '14');
 const [perMin, setPerMin] = useState(currentRules.perMin || '2');
 const [minFare, setMinFare] = useState(currentRules.minFare || '99');
 const [nightAllowance, setNightAllowance] = useState(currentRules.nightAllowance || '25% Night Allowance (10 PM - 5 AM)');
 const [waitingCharge, setWaitingCharge] = useState(currentRules.waitingCharge || '₹2.50 / min after 5 min');
 const [airportSurcharge, setAirportSurcharge] = useState(currentRules.airportSurcharge || '₹80 Airport Surcharge');
 const [surge, setSurge] = useState(currentRules.surge || '1.5x (High Peak)');

 return (
  <div className="modalBack">
   <div className="modal" style={{ width: '540px' }}>
    <button className="close" onClick={close}>×</button>
    <span className="step">FARES & BREAKUP CONFIGURATION</span>
    <h2>Edit Detailed Fare Breakup Rules</h2>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
     <label>Base Fare (₹)<input value={base} onChange={e => setBase(e.target.value)} /></label>
     <label>Per Kilometer Rate (₹)<input value={perKm} onChange={e => setPerKm(e.target.value)} /></label>
     <label>Per Minute Ride Charge (₹)<input value={perMin} onChange={e => setPerMin(e.target.value)} /></label>
     <label>Minimum Trip Fare (₹)<input value={minFare} onChange={e => setMinFare(e.target.value)} /></label>
    </div>

    <label>Night Shift Allowance (10 PM – 5 AM)
     <input value={nightAllowance} onChange={e => setNightAllowance(e.target.value)} placeholder="e.g. 25% Surcharge or ₹150 Flat" />
    </label>

    <label>Driver Waiting / Idle Charge
     <input value={waitingCharge} onChange={e => setWaitingCharge(e.target.value)} placeholder="e.g. ₹2.50 / min after 5 min" />
    </label>

    <label>Airport / Toll Surcharge
     <input value={airportSurcharge} onChange={e => setAirportSurcharge(e.target.value)} placeholder="e.g. ₹80 Airport Fee" />
    </label>

    <label>Peak Demand Surge Multiplier
     <select value={surge} onChange={e => setSurge(e.target.value)}>
      <option>1.0x (Normal)</option>
      <option>1.25x (Moderate)</option>
      <option>1.5x (High Peak)</option>
      <option>2.0x (Extreme Surge)</option>
     </select>
    </label>

    <div className="modalActions">
     <button onClick={close}>Cancel</button>
     <button className="primary" onClick={() => { onSave({ base, perKm, perMin, minFare, nightAllowance, waitingCharge, airportSurcharge, surge }); close(); }}>Save Complete Fare Breakup</button>
    </div>
   </div>
  </div>
 );
}

function DetailExtras({ page }) {
 if (page === 'Bookings') return (
  <>
   <section className="bookingRoute">
    <h3>Live route & tracking</h3>
    <div>
     <span className="carTrack">🚕</span>
     <b>Driver GPS online · 4 min away</b>
     <small>ETA 09:56 AM · Geofence: Pickup zone entered</small>
    </div>
    <button onClick={() => ask('Open route playback')}>Route playback</button>
   </section>
   <section className="fareBreak">
    <h3>Itemized Fare Breakup</h3>
    <p>Base fare <b>₹55.00</b></p>
    <p>Distance charge (14.2 km @ ₹14/km) <b>₹198.80</b></p>
    <p>Ride time charge (24 min @ ₹2/min) <b>₹48.00</b></p>
    <p>Night shift allowance (25%) <b>₹75.45</b></p>
    <p>Waiting / driver idle charge (6 min) <b>₹15.00</b></p>
    <p>Airport pickup surcharge <b>₹80.00</b></p>
    <p>Taxes & GST (5%) <b>₹23.60</b></p>
    <p style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '6px' }}><strong>Total Trip Fare</strong> <b style={{ fontSize: '14px', color: '#16a34a' }}>₹495.85</b></p>
   </section>
   <div className="drawerActions">
    <button onClick={() => ask('Cancel booking', 'Cancellation fee and refund options will be shown.')}>Cancel / refund</button>
    <button className="primary" onClick={() => ask('Reassign driver')}>Assign / reassign driver</button>
   </div>
  </>
 );
 if (['Customer onboarding', 'Drivers & KYC', 'Vendors & fleet', 'Vehicles'].includes(page)) return (
  <section className="profileTabs">
   <h3>Profile activity</h3>
   <div><b>Trips</b><b>Wallet</b><b>Documents</b><b>Support</b></div>
   <p>Recent activity, payouts, saved locations, uploaded documents and support cases are available in these profile tabs.</p>
   <button onClick={() => ask('Open full profile')}>Open full profile</button>
  </section>
 );
 if (page === 'Payments & payouts') return (
  <section className="ledger">
   <h3>Wallet ledger & invoice</h3>
   <p>Ride collection <b>+ ₹342</b></p>
   <p>Platform commission <b>− ₹61.56</b></p>
   <p>Driver payable <b>₹280.44</b></p>
   <button onClick={() => ask('Generate GST invoice')}>GST invoice PDF</button>
   <button onClick={() => ask('Open settlement statement')}>Settlement statement</button>
  </section>
 );
 if (page === 'Safety & SOS') return (
  <section className="sosDetail">
   <h3>Emergency contacts & closure</h3>
   <p><b>Customer:</b> Aarav Sharma · +91 98765 43210 <button onClick={() => ask('Call customer')}>Call</button></p>
   <p><b>Driver:</b> Rakesh Kumar · +91 98111 33221 <button onClick={() => ask('Call driver')}>Call</button></p>
   <textarea placeholder="Incident notes and closure report" />
   <button className="primary" onClick={() => ask('Close safety incident')}>Close incident</button>
  </section>
 );
 if (page === 'Support') return (
  <section className="ticketChat">
   <h3>Support conversation · SLA 01:42:18</h3>
   <p className="userMsg">Customer: Driver arrived late and I missed my flight.</p>
   <p className="adminMsg">Support: We are reviewing the trip timeline.</p>
   <input placeholder="Write internal note or reply" />
   <button onClick={() => ask('Attach file')}>Attach</button>
   <button className="primary" onClick={() => ask('Send reply')}>Send reply</button>
  </section>
 );
 return null;
}

function DetailDrawer({ page, row, close }) {
 const fields = cols[page] || [];
 return (
  <div className="drawerBack" onMouseDown={close}>
   <aside className="detailDrawer" onMouseDown={e => e.stopPropagation()}>
    <button className="drawerClose" onClick={close}>×</button>
    <span className="drawerType">{page}</span>
    <h2>{row[0]}</h2>
    <Badge>{row[row.length - 1]}</Badge>
    <div className="drawerTabs"><b>Overview</b><span>Timeline</span><span>Notes</span><span>Audit</span></div>
    <section>{fields.map((x, i) => <p key={x}><span>{x}</span><strong>{row[i] || '—'}</strong></p>)}</section>
    <DetailExtras page={page} />
    <section className="detailTimeline">
     <h3>Activity timeline & audit log</h3>
     <p><i />Created by Operations Team · Today, 9:14 AM</p>
     <p><i />Updated by Vishal Kumar · Today, 9:42 AM</p>
     <p><i />Notification event logged successfully.</p>
    </section>
    <div className="drawerActions">
     <button onClick={() => ask('Request change')}>Request change</button>
     <button className="primary" onClick={() => ask('Save record changes')}>Save changes</button>
    </div>
   </aside>
  </div>
 );
}

function DataTable({ page, rowsData, action }) {
 const [search, setSearch] = useState('');
 const [statusFilter, setStatusFilter] = useState('all');
 const [detail, setDetail] = useState(null);

 const list = rowsData[page] || [];
 const data = useMemo(() => {
  return list.filter(r => {
   const matchesSearch = r.join(' ').toLowerCase().includes(search.toLowerCase());
   const statusVal = String(r[r.length - 1] || '').toLowerCase();
   const matchesStatus = statusFilter === 'all' || statusVal.includes(statusFilter.toLowerCase());
   return matchesSearch && matchesStatus;
  });
 }, [list, search, statusFilter]);

 return (
  <>
   <section className="pPanel">
    <div className="pTableTop">
     <div>
      <h3>{page} directory</h3>
      <p>Filter records, monitor status and view complete item details.</p>
     </div>
     <div className="bulk">
      <button onClick={() => action('Bulk actions opened')}>Bulk actions</button>
      <button className="textBtn" onClick={() => action('Export ' + page)}>⇩ Export</button>
     </div>
    </div>
    <div className="pFilters">
     <input value={search} onChange={e => setSearch(e.target.value)} placeholder={'Search ' + page.toLowerCase()} />
     <Select
      styles={selectStyle}
      defaultValue={{ label: 'All statuses', value: 'all' }}
      onChange={(opt) => setStatusFilter(opt.value)}
      options={[
       { label: 'All statuses', value: 'all' },
       { label: 'Active / Approved', value: 'active' },
       { label: 'Pending / Review', value: 'pending' },
       { label: 'Completed / Success', value: 'completed' }
      ]}
     />
     <button className="filter" onClick={() => action('Advanced filters')}>☷ Filters</button>
    </div>
    <div className="pTableWrap">
     <table>
      <thead>
       <tr>
        <th><input type="checkbox" /></th>
        {(cols[page] || []).map(x => <th key={x}>{x}</th>)}
        <th>Action</th>
       </tr>
      </thead>
      <tbody>
       {data.map((r, i) => (
        <tr key={i}>
         <td><input type="checkbox" /></td>
         {r.map((x, j) => <td key={j}>{j === 0 ? <strong>{x}</strong> : j === r.length - 1 ? <Badge>{x}</Badge> : x}</td>)}
         <td><button className="pView" onClick={() => setDetail(r)}>View →</button></td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
   </section>
   {detail && <DetailDrawer page={page} row={detail} close={() => setDetail(null)} />}
  </>
 );
}

function Workflow({ title, items }) {
 return (
  <section className="pPanel pWorkflow">
   <h3>{title}</h3>
   <div>
    {items.map((x, i) => (
     <React.Fragment key={x}>
      <span className="stepDot">{i + 1}</span>
      <p><b>{x}</b><small>{i === items.length - 1 ? 'Complete and notify user' : 'Required review step'}</small></p>
      {i < items.length - 1 && <i />}
     </React.Fragment>
    ))}
   </div>
  </section>
 );
}

function KycPage({ page, rowsData, action, onOpenKycModal }) {
 return (
  <>
   <ModuleHeader title={page} subtitle={labels[page][1]} button={labels[page][0]} action={action} />
   <div className="pCards">
    <Mini label="Awaiting review" value="14" note="8 driver applications" icon="✓" />
    <Mini label="Document expiring" value="6" note="Next 30 days" icon="!" />
    <Mini label="Approval time" value="18 min" note="Average today" icon="◷" />
   </div>
   <div className="pSplit">
    <Workflow title="Driver approval workflow" items={['Mobile OTP & profile', 'Driving licence validation', 'RC, insurance & PUC', 'Bank / PAN verification', 'Admin approval and activation']} />
    <section className="pPanel pReview">
     <h3>Document review — Aman Verma</h3>
     <p>Application submitted 12 minutes ago</p>
     <div className="docRow"><span>Driving licence</span><Badge>Pending</Badge><button onClick={onOpenKycModal}>Inspect DL</button></div>
     <div className="docRow"><span>Vehicle RC</span><Badge>Verified</Badge><button onClick={onOpenKycModal}>Inspect RC</button></div>
     <div className="docActions">
      <button onClick={onOpenKycModal} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>Reject</button>
      <button className="primary" onClick={onOpenKycModal}>Inspect & Approve</button>
     </div>
    </section>
   </div>
   <DataTable page={page} rowsData={rowsData} action={action} />
  </>
 );
}

function Live({ action, ridesList }) {
 return (
  <>
   <ModuleHeader title="Live rides" subtitle="Real-time trip dispatch, location tracking and safety monitoring." button="+ Manual booking" action={action} />
   <div className="pSplit live">
    <LeafletLiveMap />
    <section className="pPanel pQueue">
     <h3>Dispatch queue <Badge>{ridesList.length}</Badge></h3>
     {ridesList.slice(0, 3).map((r) => (
      <div key={r.id}>
       <span>⌖</span>
       <p><b>{r.id} · {r.service}</b><small>{r.pickup} → {r.drop}</small></p>
       <button onClick={() => action('Driver assigned to ' + r.id)}>Assign</button>
      </div>
     ))}
     <button className="outline pFull" onClick={() => action('All active trips opened')}>View all active trips</button>
    </section>
   </div>
   <section className="pAlert">
    <span>SOS</span>
    <div>
     <b>Safety command centre</b>
     <p>No unresolved SOS alert. Escalation rules are active across Chandigarh & Mohali.</p>
    </div>
    <button onClick={() => action('SOS console opened')}>Open console</button>
   </section>
  </>
 );
}

function Fare({ action, fareRules, onOpenFareEditor }) {
 const [selectedCity, setSelectedCity] = useState('Chandigarh');
 const [selectedCategory, setSelectedCategory] = useState('Prime Sedan');
 const [rainSurge, setRainSurge] = useState(0);
 const [airportRush, setAirportRush] = useState(false);
 const [surgeCap, setSurgeCap] = useState('3.0x');
 const [aiAutoSurge, setAiAutoSurge] = useState(true);

 const cityData = {
  'Chandigarh': {
   tier: 'UT Capital Metro',
   zones: '3 Service Zones (Sector 17, Airport, IT Park)',
   rates: {
    'E-Rickshaw': { icon: '🛺⚡', base: '20', perKm: '7', perMin: '1', minFare: '30', nightAllowance: '15% Surcharge', waitingCharge: '₹1.50/min', airportSurcharge: '₹0', surge: '1.1x' },
    'Auto Rickshaw': { icon: '🛺', base: '30', perKm: '10', perMin: '1.5', minFare: '45', nightAllowance: '20% Surcharge', waitingCharge: '₹2.00/min', airportSurcharge: '₹30', surge: '1.2x' },
    'Bike Taxi': { icon: '🏍️', base: '25', perKm: '6', perMin: '1', minFare: '35', nightAllowance: '15% Surcharge', waitingCharge: '₹1.00/min', airportSurcharge: '₹20', surge: '1.3x' },
    'Prime Sedan': { icon: '🚕', base: fareRules.base || '55', perKm: fareRules.perKm || '14', perMin: fareRules.perMin || '2', minFare: fareRules.minFare || '99', nightAllowance: fareRules.nightAllowance || '25% Surcharge', waitingCharge: fareRules.waitingCharge || '₹2.50/min', airportSurcharge: fareRules.airportSurcharge || '₹80', surge: (parseFloat(fareRules.surge || '1.5') + rainSurge + (airportRush ? 0.8 : 0)).toFixed(1) + 'x' },
    'Outstation SUV': { icon: '🚙', base: '250', perKm: '18', perMin: '3', minFare: '500', nightAllowance: '₹250 / Night', waitingCharge: '₹3.50/min', airportSurcharge: 'State Toll Extra', surge: '1.2x' }
   }
  },
  'Mohali': {
   tier: 'Tech Hub Zone',
   zones: '2 Service Zones (Phase 7, Industrial Area)',
   rates: {
    'E-Rickshaw': { icon: '🛺⚡', base: '18', perKm: '6.5', perMin: '1', minFare: '25', nightAllowance: '15% Surcharge', waitingCharge: '₹1.20/min', airportSurcharge: '₹0', surge: '1.0x' },
    'Auto Rickshaw': { icon: '🛺', base: '28', perKm: '9.5', perMin: '1.5', minFare: '40', nightAllowance: '18% Surcharge', waitingCharge: '₹1.80/min', airportSurcharge: '₹25', surge: '1.1x' },
    'Bike Taxi': { icon: '🏍️', base: '22', perKm: '5.5', perMin: '1', minFare: '30', nightAllowance: '12% Surcharge', waitingCharge: '₹1.00/min', airportSurcharge: '₹15', surge: '1.2x' },
    'Prime Sedan': { icon: '🚕', base: '50', perKm: '13', perMin: '2', minFare: '89', nightAllowance: '20% Surcharge', waitingCharge: '₹2.20/min', airportSurcharge: '₹50', surge: '1.3x' },
    'Outstation SUV': { icon: '🚙', base: '240', perKm: '17', perMin: '3', minFare: '480', nightAllowance: '₹220 / Night', waitingCharge: '₹3.20/min', airportSurcharge: 'State Toll Extra', surge: '1.1x' }
   }
  },
  'Zirakpur': {
   tier: 'Highway Corridor',
   zones: '1 Service Zone (VIP Road & Highway Hub)',
   rates: {
    'E-Rickshaw': { icon: '🛺⚡', base: '15', perKm: '6', perMin: '1', minFare: '20', nightAllowance: '10% Surcharge', waitingCharge: '₹1.00/min', airportSurcharge: '₹0', surge: '1.0x' },
    'Auto Rickshaw': { icon: '🛺', base: '25', perKm: '9', perMin: '1.2', minFare: '35', nightAllowance: '15% Surcharge', waitingCharge: '₹1.50/min', airportSurcharge: '₹20', surge: '1.1x' },
    'Bike Taxi': { icon: '🏍️', base: '20', perKm: '5', perMin: '1', minFare: '25', nightAllowance: '10% Surcharge', waitingCharge: '₹1.00/min', airportSurcharge: '₹10', surge: '1.1x' },
    'Prime Sedan': { icon: '🚕', base: '45', perKm: '12', perMin: '1.8', minFare: '79', nightAllowance: '15% Surcharge', waitingCharge: '₹2.00/min', airportSurcharge: '₹40', surge: '1.2x' },
    'Outstation SUV': { icon: '🚙', base: '220', perKm: '16', perMin: '2.5', minFare: '450', nightAllowance: '₹200 / Night', waitingCharge: '₹3.00/min', airportSurcharge: 'State Toll Extra', surge: '1.1x' }
   }
  },
  'Delhi NCR': {
   tier: 'Mega Metropolis',
   zones: '8 Service Zones (Central, Gurgaon, Noida, Airport T3)',
   rates: {
    'E-Rickshaw': { icon: '🛺⚡', base: '25', perKm: '8', perMin: '1.2', minFare: '35', nightAllowance: '20% Surcharge', waitingCharge: '₹2.00/min', airportSurcharge: '₹0', surge: '1.3x' },
    'Auto Rickshaw': { icon: '🛺', base: '35', perKm: '12', perMin: '2', minFare: '55', nightAllowance: '25% Surcharge', waitingCharge: '₹2.50/min', airportSurcharge: '₹50', surge: '1.4x' },
    'Bike Taxi': { icon: '🏍️', base: '30', perKm: '7.5', perMin: '1.5', minFare: '40', nightAllowance: '20% Surcharge', waitingCharge: '₹1.50/min', airportSurcharge: '₹30', surge: '1.5x' },
    'Prime Sedan': { icon: '🚕', base: '70', perKm: '16', perMin: '2.5', minFare: '120', nightAllowance: '30% Surcharge', waitingCharge: '₹3.00/min', airportSurcharge: '₹100 (Toll + MCD)', surge: '1.8x' },
    'Outstation SUV': { icon: '🚙', base: '300', perKm: '20', perMin: '4', minFare: '600', nightAllowance: '₹300 / Night', waitingCharge: '₹4.00/min', airportSurcharge: 'MCD Toll Extra', surge: '1.5x' }
   }
  },
  'Shimla': {
   tier: 'Hill Station & Mountain Route',
   zones: '2 Service Zones (Mall Road & Ridge Slope)',
   rates: {
    'E-Rickshaw': { icon: '🛺⚡', base: '30', perKm: '10', perMin: '2', minFare: '50', nightAllowance: '25% Surcharge', waitingCharge: '₹2.00/min', airportSurcharge: '₹0', surge: '1.2x' },
    'Auto Rickshaw': { icon: '🛺', base: '45', perKm: '14', perMin: '2.5', minFare: '70', nightAllowance: '30% Surcharge', waitingCharge: '₹3.00/min', airportSurcharge: '₹0', surge: '1.3x' },
    'Bike Taxi': { icon: '🏍️', base: '35', perKm: '9', perMin: '1.5', minFare: '50', nightAllowance: '25% Surcharge', waitingCharge: '₹2.00/min', airportSurcharge: '₹0', surge: '1.4x' },
    'Prime Sedan': { icon: '🚕', base: '90', perKm: '19', perMin: '3', minFare: '150', nightAllowance: '35% Hill Surcharge', waitingCharge: '₹4.00/min', airportSurcharge: 'Green Tax Extra', surge: '1.6x' },
    'Outstation SUV': { icon: '🚙', base: '350', perKm: '24', perMin: '5', minFare: '800', nightAllowance: '₹350 Driver Night Fee', waitingCharge: '₹5.00/min', airportSurcharge: 'Green Tax Included', surge: '1.5x' }
   }
  }
 };

 const activeCity = cityData[selectedCity] || cityData['Chandigarh'];
 const activeFare = activeCity.rates[selectedCategory] || activeCity.rates['Prime Sedan'];

 return (
  <>
   <ModuleHeader title="Fares & zones" subtitle="Configure city-wise rate cards, location zone pricing, night allowance and surge rules." button="+ Add city zone" action={action} />

   {/* AI Surge Heatmap & Dynamic Zone Pricing Control Panel */}
   <section className="pPanel" style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
     <div>
      <h3 style={{ margin: 0 }}>🔥 AI Dynamic Surge Heatmap & Zone Engine</h3>
      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Real-time demand heat ring calculator with automated surge multipliers and scenario simulation tools.</p>
     </div>
     <button
      onClick={() => {
       const next = !aiAutoSurge;
       setAiAutoSurge(next);
       Swal.fire({
        title: `AI Auto-Surge ${next ? 'Activated' : 'Disabled'}`,
        text: next ? 'AI engine will dynamically calculate surge based on demand heatmaps.' : 'Automated surge paused. Manual rates active.',
        icon: next ? 'success' : 'warning',
        confirmButtonColor: '#218d63'
       });
       action(`AI Auto-Surge Engine ${next ? 'enabled' : 'disabled'}`);
      }}
      style={{
       padding: '6px 14px',
       borderRadius: '20px',
       border: '0',
       fontWeight: 'bold',
       fontSize: '11px',
       cursor: 'pointer',
       background: aiAutoSurge ? '#e5f7ed' : '#fee2e2',
       color: aiAutoSurge ? '#16a34a' : '#dc2626'
      }}
     >
      {aiAutoSurge ? '● AI Auto-Surge Active' : '○ Manual Override Mode'}
     </button>
    </div>

    {/* Scenario Simulation Quick Action Buttons */}
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
     <button
      className="primary"
      onClick={() => {
       setRainSurge(0.5);
       Swal.fire({
        title: '🌧️ Heavy Rain Surge Activated',
        text: 'Added +0.5x surge multiplier across all geofenced city zones due to monsoon rain.',
        icon: 'info',
        confirmButtonColor: '#0284c7'
       });
       action('Simulated Heavy Rain Surge (+0.5x multiplier)');
      }}
      style={{ background: '#0284c7', borderColor: '#0284c7', fontSize: '11px', padding: '6px 12px' }}
     >
      🌧️ Simulate Rain Surge (+0.5x)
     </button>

     <button
      className="primary"
      onClick={() => {
       setAirportRush(true);
       Swal.fire({
        title: '✈️ Airport Peak Arrival Surge',
        text: 'Airport T3 hub surge set to 2.8x due to 4 flight landings in 30 minutes.',
        icon: 'warning',
        confirmButtonColor: '#ea580c'
       });
       action('Simulated Airport Flight Arrival Rush (2.8x)');
      }}
      style={{ background: '#ea580c', borderColor: '#ea580c', fontSize: '11px', padding: '6px 12px' }}
     >
      ✈️ Simulate Airport Flight Rush (2.8x)
     </button>

     <button
      className="primary"
      onClick={() => {
       setRainSurge(0);
       setAirportRush(false);
       Swal.fire({
        title: '🔄 Surge Rates Reset',
        text: 'All demand surge rates returned to standard 1.0x baseline.',
        icon: 'success',
        confirmButtonColor: '#16a34a'
       });
       action('Reset surge heatmap to standard 1.0x baseline');
      }}
      style={{ background: '#475569', borderColor: '#475569', fontSize: '11px', padding: '6px 12px' }}
     >
      🔄 Reset Heatmap Surcharges
     </button>
    </div>

    {/* Surge Control Fields */}
    <div className="controlFields" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
     <label>Maximum Surge Cap
      <select value={surgeCap} onChange={e => {
       setSurgeCap(e.target.value);
       action(`Global Surge Cap updated to ${e.target.value}`);
      }}>
       <option>2.0x Surcharge Limit</option>
       <option>2.5x Surcharge Limit</option>
       <option>3.0x Surcharge Limit</option>
       <option>3.5x Enterprise Max</option>
      </select>
     </label>
     <label>Unfulfilled Demand Sensitivity
      <input defaultValue="15 pending requests / zone" />
     </label>
     <label>Night Shift Auto-Surge Trigger
      <input defaultValue="10:00 PM - 05:00 AM (+20%)" />
     </label>
    </div>
   </section>

   {/* City / Location Selector Header Bar */}
   <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} className="dark-theme-panel">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
     <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Select City / Operational Location:</span>
     <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>● Active Location: <strong>{selectedCity}</strong> ({activeCity.tier})</span>
    </div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
     {Object.keys(cityData).map(city => (
      <button
       key={city}
       onClick={() => setSelectedCity(city)}
       style={{
        border: '1.5px solid',
        borderColor: selectedCity === city ? '#218d63' : '#cbd5e1',
        background: selectedCity === city ? '#218d63' : '#f8fafc',
        color: selectedCity === city ? '#ffffff' : '#334155',
        padding: '7px 14px',
        borderRadius: '8px',
        font: '600 12px Inter, sans-serif',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
       }}
      >
       📍 {city}
      </button>
     ))}
    </div>
   </div>

   {/* Service Category Pills */}
   <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
    {Object.keys(activeCity.rates).map(cat => (
     <button
      key={cat}
      onClick={() => setSelectedCategory(cat)}
      style={{
       border: '1px solid',
       borderColor: selectedCategory === cat ? '#218d63' : '#e2e8f0',
       background: selectedCategory === cat ? '#eaf8f0' : '#ffffff',
       color: selectedCategory === cat ? '#177a53' : '#475569',
       padding: '8px 14px',
       borderRadius: '8px',
       font: '600 12px Inter, sans-serif',
       cursor: 'pointer',
       display: 'flex',
       alignItems: 'center',
       gap: '6px'
      }}
     >
      <span>{activeCity.rates[cat].icon}</span> {cat}
     </button>
    ))}
   </div>

   <div className="pSplit">
    <LeafletZoneMap rainSurge={rainSurge} airportRush={airportRush} />
    <section className="pPanel pRule">
     <h3>{activeFare.icon} {selectedCategory} · {selectedCity} Rate Card</h3>
     <p>{activeCity.zones}</p>
     <div key="city"><span>Location / Region <b>{selectedCity} ({activeCity.tier})</b></span></div>
     <div key="base"><span>Base Fare <b>₹{activeFare.base}</b></span></div>
     <div key="km"><span>Per Km Rate <b>₹{activeFare.perKm} / km</b></span></div>
     <div key="min"><span>Per Minute Ride Charge <b>₹{activeFare.perMin} / min</b></span></div>
     <div key="night"><span>Night Shift Allowance <b>{activeFare.nightAllowance}</b></span></div>
     <div key="wait"><span>Driver Waiting Charge <b>{activeFare.waitingCharge}</b></span></div>
     <div key="airport"><span>Location Surcharge / Toll <b>{activeFare.airportSurcharge}</b></span></div>
     <div key="minfare"><span>Minimum Trip Fare <b>₹{activeFare.minFare}</b></span></div>
     <div key="surge"><span>Location Surge Multiplier <b>{activeFare.surge}</b></span></div>
     <button className="primary pFull" onClick={onOpenFareEditor}>Edit {selectedCity} ({selectedCategory}) Fare Card</button>
    </section>
   </div>
   <div className="pCards">
    <Mini label="City Selected" value={selectedCity} note={activeCity.tier} icon="📍" />
    <Mini label="Location Service Zones" value={activeCity.zones.split(' (')[0]} note="GPS geofenced" icon="◇" />
    <Mini label="Location Base Rate" value={`₹${activeFare.base} base | ₹${activeFare.perKm}/km`} note={`${selectedCategory} in ${selectedCity}`} icon="₹" />
   </div>
  </>
 );
}

function Reports({ action, rowsData }) {
 return (
  <>
   <ModuleHeader title="Reports" subtitle="Build decision-ready reports with filtering and export controls." button="+ Build report" action={action} />
   <div className="pReport">
    <div>
     <h3>Revenue overview</h3>
     <b>₹8,64,200</b>
     <span>+12.5% versus previous period</span>
     <div className="pBars">{[44, 62, 51, 83, 69, 92, 74].map((x, i) => <i style={{ height: x + '%' }} key={i} />)}</div>
     <small>Mon &nbsp; Tue &nbsp; Wed &nbsp; Thu &nbsp; Fri &nbsp; Sat &nbsp; Sun</small>
    </div>
    <div>
     <h3>Generate report</h3>
     <label>Report type
      <Select styles={selectStyle} defaultValue={{ label: 'Revenue by city', value: 'city' }} options={[{ label: 'Revenue by city', value: 'city' }, { label: 'Driver earnings', value: 'drivers' }, { label: 'Cancellations', value: 'cancel' }]} />
     </label>
     <label>Format
      <Select styles={selectStyle} defaultValue={{ label: 'PDF', value: 'pdf' }} options={[{ label: 'PDF', value: 'pdf' }, { label: 'CSV', value: 'csv' }, { label: 'XLSX', value: 'xlsx' }]} />
     </label>
     <button className="primary pFull" onClick={() => action('Report generation job queued')}>Generate export</button>
    </div>
   </div>
   <DataTable page="Reports" rowsData={rowsData} action={action} />
  </>
 );
}

function CommissionsPage({ action, rowsData }) {
 const [commType, setCommType] = useState('Percentage');
 const [baseRate, setBaseRate] = useState(18);
 const [flatFee, setFlatFee] = useState(15);
 const [sampleFare, setSampleFare] = useState(350);

 const operatorCommission = commType === 'Percentage' 
   ? (sampleFare * (baseRate / 100))
   : flatFee;

 const driverPayout = sampleFare - operatorCommission;
 const saasPlatformFee = sampleFare * 0.035;

 return (
  <div className="adminModule">
   <div className="moduleHeadInline">
    <div>
     <h2>Per-Ride Commission Strategy & Rule Engine</h2>
     <p>Configure percentage or flat commission rates per completed ride across vehicle categories.</p>
    </div>
    <button className="primary" onClick={() => action('New Commission Rule published')}>+ Create Commission Rule</button>
   </div>

   <div className="moduleStats">
    <Mini label="Default Ride Rate" value={commType === 'Percentage' ? `${baseRate}%` : `₹${flatFee}/ride`} note="Applies to standard rides" icon="₹" />
    <Mini label="Average Driver Take-Home" value={`${Math.max(0, Math.round((driverPayout / sampleFare) * 100))}%`} note={`₹${driverPayout.toFixed(2)} payout on ₹${sampleFare} ride`} icon="↗" />
    <Mini label="SaaS Platform Revenue Share" value="3.5%" note={`₹${saasPlatformFee.toFixed(2)} / ride to SaaS Owner`} icon="👑" />
   </div>

   <section className="pPanel" style={{ marginBottom: '20px' }}>
    <h3>Per-Ride Commission Calculator & Settings</h3>
    <p style={{ fontSize: '12px', color: '#78849a', marginBottom: '16px' }}>Adjust global parameters to calculate real-time per-ride earnings distribution</p>

    <div className="controlFields" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
     <label>Commission Mode
      <select value={commType} onChange={e => setCommType(e.target.value)}>
       <option>Percentage (%)</option>
       <option>Flat Fee (₹ / ride)</option>
       <option>Hybrid Tiered Rate</option>
      </select>
     </label>

     {commType === 'Percentage' ? (
      <label>Commission Percentage (%)
       <input type="number" value={baseRate} onChange={e => setBaseRate(Number(e.target.value))} />
      </label>
     ) : (
      <label>Flat Fee Amount (₹ / ride)
       <input type="number" value={flatFee} onChange={e => setFlatFee(Number(e.target.value))} />
      </label>
     )}

     <label>Sample Ride Fare for Live Simulation (₹)
      <input type="number" value={sampleFare} onChange={e => setSampleFare(Number(e.target.value))} />
     </label>
    </div>

    <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
     <strong style={{ fontSize: '13px', display: 'block', marginBottom: '10px' }}>📊 Live Per-Ride Financial Breakdown:</strong>
     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
      <div><span style={{ color: '#64748b' }}>Total Ride Fare</span><br /><b style={{ fontSize: '14px' }}>₹{sampleFare}</b></div>
      <div><span style={{ color: '#16a34a' }}>Cab Operator Commission</span><br /><b style={{ fontSize: '14px', color: '#16a34a' }}>₹{operatorCommission.toFixed(2)}</b></div>
      <div><span style={{ color: '#2563eb' }}>Driver Net Payout</span><br /><b style={{ fontSize: '14px', color: '#2563eb' }}>₹{driverPayout.toFixed(2)}</b></div>
      <div><span style={{ color: '#9333ea' }}>SaaS Owner Share (3.5%)</span><br /><b style={{ fontSize: '14px', color: '#9333ea' }}>₹{saasPlatformFee.toFixed(2)}</b></div>
     </div>
    </div>

    <div className="controlActions" style={{ marginTop: '16px' }}>
     <button className="primary" onClick={() => action(`Updated default per-ride commission to ${commType === 'Percentage' ? baseRate + '%' : '₹' + flatFee}`)}>Save Per-Ride Commission Policy</button>
    </div>
   </section>

   <DataTable page="Commissions" rowsData={rowsData} action={action} />
  </div>
 );
}

function ControlPanel({ page, action }) {
 if (!['Payments & payouts', 'Commissions', 'Notifications', 'Safety & SOS', 'Support', 'Roles & settings'].includes(page)) return null;
 const content = {
  'Payments & payouts': ['Payout & refund review', ['Payout reference', 'PYO-1472'], ['Net amount', '₹5,480'], ['Refund approval', 'Request supporting note']],
  'Commissions': ['Commission rule builder', ['Rule name', 'Chandigarh standard'], ['Commission type', 'Percentage'], ['Value', '18%']],
  'Notifications': ['Campaign composer', ['Campaign name', 'Weekend airport offer'], ['Audience', 'Chandigarh customers'], ['Message', 'Save 20% on your airport ride this weekend.']],
  'Safety & SOS': ['Incident command centre', ['Incident ID', 'SOS-071'], ['Emergency contact', 'Call primary contact'], ['Resolution notes', 'Record incident outcome']],
  'Support': ['Ticket response & SLA', ['Ticket', 'SUP-2094'], ['Assign to', 'Support Team'], ['Internal note', 'Visible to team only']],
  'Roles & settings': ['Admin access & integration', ['Role name', 'Operations Manager'], ['Permission set', 'Rides, drivers, safety'], ['Audit log', 'All sensitive changes enabled']]
 }[page];
 return (
  <section className="pPanel controlPanel">
   <div>
    <h3>{content[0]}</h3>
    <p>Use this interface for workflow approvals and system configurations.</p>
   </div>
   <div className="controlFields">{content.slice(1).map(x => <label key={x[0]}>{x[0]}<input defaultValue={x[1]} /></label>)}</div>
   <div className="controlActions">
    <button onClick={() => action('Saved as draft')}>Save draft</button>
    <button className="primary" onClick={() => action('Submitted ' + page + ' workflow')}>Submit for approval</button>
   </div>
  </section>
 );
}

function AccountingPage({ action, rowsData, onOpenGenericModal }) {
 return (
  <div className="adminModule">
   <div className="moduleHeadInline" style={{ marginBottom: '16px' }}>
    <div>
     <h2>Accounting, Invoicing & GST Tax Compliance</h2>
     <p>Customer ride tax invoices (5% GST), platform commission invoices (18% GST), driver TDS (Sec 194C @ 1%) & GSTR filing exports.</p>
    </div>
    <button className="primary" onClick={() => onOpenGenericModal('Accounting & GST')}>+ Generate invoice</button>
   </div>

   <div className="pCards">
    <Mini label="Net Taxable Turnover" value="₹8,64,200" note="+14.2% YoY growth" icon="💰" />
    <Mini label="Total GST Collected" value="₹1,12,450" note="5% Ride + 18% SaaS" icon="🧾" />
    <Mini label="Driver TDS Remitted" value="₹14,820" note="Sec 194C @ 1%" icon="📄" />
    <Mini label="Net Payable Liability" value="₹97,630" note="Due 20th Oct 2026" icon="⚖️" />
   </div>

   <section className="pPanel" style={{ marginBottom: '20px' }}>
    <h3>🏛️ GSTR Tax Filing & Audit Command Centre</h3>
    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Export 1-click compliant GST tax ledgers, GSTR-1 sales returns, and driver TDS returns for CA audit.</p>
    
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
     <button className="primary" onClick={() => {
      Swal.fire({
       title: '📊 GSTR-1 Tax Return Exported',
       text: 'Compliant B2C sales return ledger downloaded in JSON & Excel format for CA filing.',
       icon: 'success',
       confirmButtonColor: '#218d63'
      });
      action('Exported GSTR-1 sales return in JSON & Excel format');
     }} style={{ padding: '8px 16px', fontSize: '12px' }}>
      📊 Export GSTR-1 (JSON / Excel)
     </button>
     <button className="primary" onClick={() => {
      Swal.fire({
       title: '📈 GSTR-3B Tax Summary Ready',
       text: 'Monthly tax liability breakdown summary generated (Output Tax: ₹1,12,450).',
       icon: 'success',
       confirmButtonColor: '#0284c7'
      });
      action('Generated GSTR-3B monthly tax summary report');
     }} style={{ background: '#0284c7', borderColor: '#0284c7', padding: '8px 16px', fontSize: '12px' }}>
      📈 Export GSTR-3B Summary
     </button>
     <button className="primary" onClick={() => {
      Swal.fire({
       title: '📑 Form 26Q TDS Return Generated',
       text: 'Quarterly driver Section 194C withholding tax statement ready for Income Tax portal.',
       icon: 'success',
       confirmButtonColor: '#7c3aed'
      });
      action('Downloaded Form 26Q quarterly driver TDS return');
     }} style={{ background: '#7c3aed', borderColor: '#7c3aed', padding: '8px 16px', fontSize: '12px' }}>
      📑 Form 26Q TDS Return
     </button>
     <button className="primary" onClick={() => {
      Swal.fire({
       title: '📦 CA Audit Package Downloaded',
       text: 'Full ZIP archive containing customer ride tax invoices, SaaS GST, and driver TDS ledgers.',
       icon: 'success',
       confirmButtonColor: '#475569'
      });
      action('Downloaded complete GST & TDS audit zip package');
     }} style={{ background: '#475569', borderColor: '#475569', padding: '8px 16px', fontSize: '12px' }}>
      📦 Download Audit Package (.ZIP)
     </button>
    </div>
   </section>

   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
    <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }} className="dark-theme-panel">
     <b style={{ fontSize: '13px', display: 'block', color: '#16a34a' }}>🚕 Passenger Transport Tax</b>
     <span style={{ fontSize: '11px', color: '#64748b', display: 'block', margin: '4px 0 8px' }}>SAC Code: 996412</span>
     <div style={{ fontSize: '12px', fontWeight: 'bold' }}>5% GST (CGST 2.5% + SGST 2.5%)</div>
     <small style={{ fontSize: '11px', color: '#94a3b8' }}>B2C e-Commerce operator liability without ITC claim</small>
    </div>

    <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }} className="dark-theme-panel">
     <b style={{ fontSize: '13px', display: 'block', color: '#2563eb' }}>⚡ Platform SaaS Commission</b>
     <span style={{ fontSize: '11px', color: '#64748b', display: 'block', margin: '4px 0 8px' }}>SAC Code: 998313</span>
     <div style={{ fontSize: '12px', fontWeight: 'bold' }}>18% GST (CGST 9% + SGST 9%)</div>
     <small style={{ fontSize: '11px', color: '#94a3b8' }}>Platform fee levied on cab operators with full ITC eligibility</small>
    </div>

    <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }} className="dark-theme-panel">
     <b style={{ fontSize: '13px', display: 'block', color: '#9333ea' }}>📄 Driver Tax Deducted at Source</b>
     <span style={{ fontSize: '11px', color: '#64748b', display: 'block', margin: '4px 0 8px' }}>Income Tax Sec 194C</span>
     <div style={{ fontSize: '12px', fontWeight: 'bold' }}>1% TDS on Gross Driver Payout</div>
     <small style={{ fontSize: '11px', color: '#94a3b8' }}>Applicable when driver annual earnings exceed ₹30,000 threshold</small>
    </div>
   </div>

   <DataTable page="Accounting & GST" rowsData={rowsData} action={action} />
  </div>
 );
}

function Standard({ page, rowsData, action, ridesList, fareRules, onOpenFareEditor, onOpenKycModal, onOpenVehicleModal, onOpenGenericModal }) {
 if (page === 'Drivers & KYC' || page === 'Customer onboarding') return <KycPage page={page} rowsData={rowsData} action={action} onOpenKycModal={onOpenKycModal} />;
 if (page === 'Live rides') return <Live action={action} ridesList={ridesList} />;
 if (page === 'Fares & zones') return <Fare action={action} fareRules={fareRules} onOpenFareEditor={onOpenFareEditor} />;
 if (page === 'Reports') return <Reports action={action} rowsData={rowsData} />;
 if (page === 'Commissions') return <CommissionsPage action={action} rowsData={rowsData} />;
 if (page === 'Accounting & GST') return <AccountingPage action={action} rowsData={rowsData} onOpenGenericModal={onOpenGenericModal} />;
 const [button, subtitle] = labels[page] || ['+ New item', 'Manage this area'];
 return (
  <>
   <div className="moduleHeadInline" style={{ marginBottom: '16px' }}>
    <div>
     <h2>{page} Directory</h2>
     <p>{subtitle}</p>
    </div>
    {page === 'Vehicles' ? (
     <button className="primary" onClick={onOpenVehicleModal}>+ Add Vehicle to Fleet</button>
    ) : (
     <button className="primary" onClick={() => onOpenGenericModal(page)}>+ {button}</button>
    )}
   </div>
   <div className="pCards">
    <Mini label="Total records" value={page === 'Payments & payouts' ? '₹2.84L' : page === 'Notifications' ? '11' : String(rowsData[page]?.length || 48)} note="Updated today" icon="▦" />
    <Mini label="Active" value={page === 'Safety & SOS' ? '0 alerts' : '36'} note="Current status" icon="◉" />
    <Mini label="Needs action" value={page === 'Commissions' ? '3 rules' : '6'} note="Review required" icon="!" />
   </div>
   {page === 'Notifications' && <Workflow title="Campaign flow" items={['Select audience segment', 'Choose Push, SMS or Email', 'Review scheduled delivery', 'View delivery and click metrics']} />}
   {page === 'Payments & payouts' && <Workflow title="Payout protection flow" items={['Validate earning ledger', 'Verify bank account', 'Finance approval', 'Release and notify recipient']} />}
   {page === 'Safety & SOS' && <Workflow title="Emergency response flow" items={['SOS received', 'Call rider and driver', 'Track trip and contact emergency number', 'Create incident outcome']} />}
   <ControlPanel page={page} action={action} />
   <DataTable page={page} rowsData={rowsData} action={action} />
  </>
 );
}

export function ProAdmin({ page, action, ridesList, setRidesList, actionTrigger }) {
 const [rowsData, setRowsData] = useState(initialRows);
 const [showKycModal, setShowKycModal] = useState(false);
 const [showFareModal, setShowFareModal] = useState(false);
 const [showVehicleModal, setShowVehicleModal] = useState(false);
 const [activeGenericModalPage, setActiveGenericModalPage] = useState(null);
 const [fareRules, setFareRules] = useState({
  base: '55',
  perKm: '14',
  perMin: '2',
  minFare: '99',
  surge: '1.5x (High Peak)'
 });

 React.useEffect(() => {
  if (!actionTrigger) return;
  if (actionTrigger.includes('vehicle') || actionTrigger === 'Add vehicle') {
   setShowVehicleModal(true);
  } else if (actionTrigger.includes('driver') || actionTrigger === 'Add driver') {
   setShowKycModal(true);
  } else if (actionTrigger.includes('zone') || actionTrigger.includes('pricing') || actionTrigger === 'Edit fare') {
   setShowFareModal(true);
  } else {
   setActiveGenericModalPage(page);
  }
 }, [actionTrigger, page]);

 const handleAddVehicle = (newVeh) => {
  const row = [newVeh.plate, newVeh.category, newVeh.driver, newVeh.compliance, newVeh.status];
  setRowsData(prev => ({
   ...prev,
   'Vehicles': [row, ...(prev['Vehicles'] || [])]
  }));
  setShowVehicleModal(false);
  action(`Vehicle ${newVeh.plate} (${newVeh.category}) added to fleet successfully`);
 };

 const handleAddGenericItem = (rowValues) => {
  setRowsData(prev => ({
   ...prev,
   [activeGenericModalPage]: [rowValues, ...(prev[activeGenericModalPage] || [])]
  }));
  action(`New record added to ${activeGenericModalPage} successfully`);
  setActiveGenericModalPage(null);
 };

 const handleKycDecision = (decision) => {
  setRowsData(prev => {
   const updatedDrivers = prev['Drivers & KYC'].map(r => {
    if (r[0] === 'Aman Verma') {
     return [r[0], 'DL verified', 'RC + insurance verified', 'Bank verified', decision === 'Approved' ? 'Approved' : 'Suspended'];
    }
    return r;
   });
   return { ...prev, 'Drivers & KYC': updatedDrivers };
  });
  setShowKycModal(false);
  action(`Driver Aman Verma status updated to ${decision}`);
 };

 return (
  <div className="proAdmin">
   {page === 'Overview' ? (
    <Overview action={action} rowsData={rowsData} ridesList={ridesList} />
   ) : (
    <Standard
     page={page}
     rowsData={rowsData}
     action={action}
     ridesList={ridesList}
     fareRules={fareRules}
     onOpenFareEditor={() => setShowFareModal(true)}
     onOpenKycModal={() => setShowKycModal(true)}
     onOpenVehicleModal={() => setShowVehicleModal(true)}
     onOpenGenericModal={(p) => setActiveGenericModalPage(p)}
    />
   )}
   {showKycModal && <KycModal close={() => setShowKycModal(false)} onDecision={handleKycDecision} />}
   {showFareModal && <FareEditorModal close={() => setShowFareModal(false)} currentRules={fareRules} onSave={(updated) => { setFareRules(updated); action('Fare rules and surge rates updated successfully'); }} />}
   {showVehicleModal && <VehicleModal close={() => setShowVehicleModal(false)} onAddVehicle={handleAddVehicle} />}
   {activeGenericModalPage && <GenericItemModal page={activeGenericModalPage} close={() => setActiveGenericModalPage(null)} onAddItem={handleAddGenericItem} />}
  </div>
 );
}

function Overview({ action, rowsData, ridesList }) {
 return (
  <>
   <ModuleHeader title="Overview" subtitle="Monitor operations, financial health and urgent actions." button="+ Manual booking" action={action} />
   <div className="pCards">
    <Mini label="Total bookings" value={String(1284 + ridesList.length - 4)} note="+12.5% this week" icon="▤" />
    <Mini label="Active rides" value={String(ridesList.filter(r => r.status === 'In progress').length + 44)} note="Drivers arriving" icon="⌖" />
    <Mini label="Today’s revenue" value="₹86,420" note="+8.2% yesterday" icon="₹" />
    <Mini label="Online drivers" value="186" note="72% approved drivers" icon="♙" />
   </div>
   <div className="pAlert">
    <span>!</span>
    <div>
     <b>6 admin actions require attention</b>
     <p>3 driver documents, 2 payout requests and 1 high-priority ticket are waiting.</p>
    </div>
    <button onClick={() => action('Action centre opened')}>Review</button>
   </div>
   <Reports action={action} rowsData={rowsData} />
  </>
 );
}

const initialTenants = [
 { id: 'TNT-101', name: 'MetroCabs Chandigarh', slug: 'chandigarh.rideflow.io', plan: 'Enterprise ($799/mo)', fee: '$799', drivers: '340', rides: '4,820/day', status: 'Active' },
 { id: 'TNT-102', name: 'UberLocal Mohali', slug: 'mohali.rideflow.io', plan: 'Growth ($299/mo)', fee: '$299', drivers: '185', rides: '2,140/day', status: 'Active' },
 { id: 'TNT-103', name: 'CityFleet Delhi NCR', slug: 'delhi.rideflow.io', plan: 'Enterprise ($799/mo)', fee: '$799', drivers: '620', rides: '7,910/day', status: 'Active' },
 { id: 'TNT-104', name: 'Royal Ride Zirakpur', slug: 'zirakpur.rideflow.io', plan: 'Starter ($99/mo)', fee: '$99', drivers: '45', rides: '380/day', status: 'Trialing' },
 { id: 'TNT-105', name: 'Highland Cabs Shimla', slug: 'shimla.rideflow.io', plan: 'Starter ($99/mo)', fee: '$99', drivers: '28', rides: '190/day', status: 'Maintenance' },
];

export function SaasSuperAdminView({ page, action, actionTrigger }) {
 const [tenants, setTenants] = useState(initialTenants);
 const [showTenantModal, setShowTenantModal] = useState(false);

 React.useEffect(() => {
  if (!actionTrigger) return;
  if (actionTrigger.includes('tenant') || actionTrigger === 'Provision tenant') {
   setShowTenantModal(true);
  } else {
   action(actionTrigger + ' requested');
  }
 }, [actionTrigger]);
 const [featureFlags, setFeatureFlags] = useState([
  { key: 'whatsapp', name: 'WhatsApp OTP & SMS Gateway', desc: 'Automated 2FA and ride updates via WhatsApp Business API', active: true, plan: 'All Tenants' },
  { key: 'whitelabel', name: 'Custom Subdomain & White-Label Domain Routing', desc: 'Allows cab operators to connect custom domain (e.g. cabs.client.com)', active: true, plan: 'Enterprise' },
  { key: 'geofencing', name: 'Interactive Leaflet Polygon Geofencing Engine', desc: 'Custom service area polygons and surge zone boundary calculator', active: true, plan: 'All Tenants' },
  { key: 'payouts', name: 'Automated RazorpayX Driver Payout Settlement', desc: 'Direct bank transfers for driver earnings on trip completion', active: true, plan: 'Growth & Enterprise' },
  { key: 'sos', name: 'Real-Time SOS Command Centre & Incident Escalation', desc: '24/7 emergency dispatch alert matrix', active: true, plan: 'All Tenants' },
  { key: 'aisurge', name: 'AI Surge Pricing & Demand Heatmap Predictor', desc: 'Machine learning surge rates based on historical trip demand', active: false, plan: 'Enterprise (Beta)' },
 ]);

 const handleAddTenant = (newTenant) => {
  setTenants(prev => [newTenant, ...prev]);
  setShowTenantModal(false);
  action(`SaaS Tenant ${newTenant.name} provisioned successfully on ${newTenant.slug}`);
 };

 const toggleStatus = (id) => {
  setTenants(prev => prev.map(t => {
   if (t.id === id) {
    const nextStatus = t.status === 'Active' ? 'Suspended' : 'Active';
    action(`Tenant ${t.name} instance set to ${nextStatus}`);
    return { ...t, status: nextStatus };
   }
   return t;
  }));
 };

 const toggleFeature = (key) => {
  setFeatureFlags(prev => prev.map(f => {
   if (f.key === key) {
    const next = !f.active;
    action(`Global Feature "${f.name}" ${next ? 'enabled' : 'disabled'}`);
    return { ...f, active: next };
   }
   return f;
  }));
 };

 const totalMrr = tenants.reduce((acc, t) => acc + parseInt(t.fee.replace('$', '')), 0) + 42000;

 return (
  <div className="proAdmin">
   {page === 'SaaS Tenants' && (
    <>
     <div className="pCards">
      <Mini label="SaaS Monthly MRR" value={`$${totalMrr.toLocaleString()}/mo`} note="+14.8% growth" icon="💰" />
      <Mini label="Onboarded Tenants" value={String(tenants.length)} note={`${tenants.filter(t => t.status === 'Active').length} active cab operators`} icon="🌐" />
      <Mini label="Global Driver Pool" value="2,480" note="Across all instances" icon="♙" />
      <Mini label="Platform Rides Today" value="28,450" note="Peak throughput" icon="⌖" />
     </div>

     <section className="pPanel">
      <div className="pTableTop" style={{ alignItems: 'center', marginBottom: '8px' }}>
       <h3>SaaS Client Tenants Directory</h3>
       <button className="primary" onClick={() => setShowTenantModal(true)}>+ Provision SaaS Tenant</button>
      </div>
      <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '12px' }}>Monitor independent client instances, manage billing tiers, and control platform access.</p>
      <div className="pTableWrap">
       <table>
        <thead>
         <tr>
          <th>Tenant ID</th>
          <th>Cab Company</th>
          <th>Subdomain</th>
          <th>Subscription Tier</th>
          <th>Monthly Fee</th>
          <th>Drivers</th>
          <th>Daily Rides</th>
          <th>Status</th>
          <th>Actions</th>
         </tr>
        </thead>
        <tbody>
         {tenants.map(t => (
          <tr key={t.id}>
           <td><strong>{t.id}</strong></td>
           <td><strong>{t.name}</strong></td>
           <td><code style={{ background: '#eef2f6', padding: '3px 6px', borderRadius: '4px', fontSize: '11px' }}>{t.slug}</code></td>
           <td>{t.plan}</td>
           <td><strong>{t.fee}/mo</strong></td>
           <td>{t.drivers}</td>
           <td>{t.rides}</td>
           <td><Badge>{t.status}</Badge></td>
           <td>
            <div style={{ display: 'flex', gap: '6px' }}>
             <button className="pView" onClick={() => action(`Switched context to tenant ${t.name}`)}>Manage →</button>
             <button className="pView" onClick={() => toggleStatus(t.id)} style={{ color: t.status === 'Active' ? '#dc2626' : '#16a34a' }}>
              {t.status === 'Active' ? 'Suspend' : 'Activate'}
             </button>
            </div>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </section>
    </>
   )}

   {page === 'Subscriptions & MRR' && (
    <>
     <div className="pCards">
      <Mini label="Total ARR" value={`$${(totalMrr * 12).toLocaleString()}/yr`} note="Annualized revenue" icon="💰" />
      <Mini label="Avg Revenue / Tenant" value={`$${Math.round(totalMrr / tenants.length)}/mo`} note="ARPU metric" icon="↗" />
      <Mini label="Enterprise Tier" value="6 Tenants" note="$799/mo rate" icon="▣" />
      <Mini label="Growth Tier" value="8 Tenants" note="$299/mo rate" icon="◇" />
     </div>

     <div className="pReport">
      <div>
       <h3>SaaS Recurring Revenue Growth</h3>
       <b>${totalMrr.toLocaleString()}/mo</b>
       <span>+18.4% MRR vs previous month</span>
       <div className="pBars">{[50, 65, 72, 80, 88, 95, 100].map((x, i) => <i style={{ height: x + '%' }} key={i} />)}</div>
       <small>Mar &nbsp; Apr &nbsp; May &nbsp; Jun &nbsp; Jul &nbsp; Aug &nbsp; Sep</small>
      </div>
      <div>
       <h3>Plan Breakdown</h3>
       <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
         <b style={{ display: 'block', fontSize: '13px' }}>Enterprise Tier ($799/mo)</b>
         <span style={{ fontSize: '11px', color: '#64748b' }}>Custom domain, unlimited drivers, priority SOS dispatch</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
         <b style={{ display: 'block', fontSize: '13px' }}>Growth Tier ($299/mo)</b>
         <span style={{ fontSize: '11px', color: '#64748b' }}>Up to 200 drivers, Razorpay payouts, multi-zone fare editor</span>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
         <b style={{ display: 'block', fontSize: '13px' }}>Starter Tier ($99/mo)</b>
         <span style={{ fontSize: '11px', color: '#64748b' }}>Up to 50 drivers, core dispatch, basic reporting</span>
        </div>
       </div>
      </div>
     </div>
    </>
   )}

   {page === 'Global Features' && (
    <section className="pPanel">
     <h3>Global SaaS Feature Flags & Module Matrix</h3>
     <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '12px' }}>Enable or disable high-value SaaS features across all client instances or per plan tier.</p>
     <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
      {featureFlags.map(f => (
       <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '9px', border: '1px solid #e2e8f0' }}>
        <div>
         <b style={{ fontSize: '13px', display: 'block' }}>{f.name} <Badge>{f.plan}</Badge></b>
         <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>{f.desc}</span>
        </div>
        <button
         onClick={() => toggleFeature(f.key)}
         style={{
          padding: '8px 16px',
          borderRadius: '20px',
          border: '0',
          fontWeight: 'bold',
          fontSize: '11px',
          cursor: 'pointer',
          background: f.active ? '#e5f7ed' : '#fee2e2',
          color: f.active ? '#16a34a' : '#dc2626'
         }}
        >
         {f.active ? '● Enabled' : '○ Disabled'}
        </button>
       </div>
      ))}
     </div>
    </section>
   )}

   {page === 'Platform Health' && (
    <>
     <div className="pCards">
      <Mini label="API Gateway Latency" value="18 ms" note="Healthy 🟢" icon="⚡" />
      <Mini label="Request Throughput" value="4,820 req/s" note="Optimal capacity" icon="↗" />
      <Mini label="Database Cluster" value="99.99%" note="Multi-region PostgreSQL" icon="🖥️" />
      <Mini label="Active WebSockets" value="3,410" note="Live trip tracking" icon="⌖" />
     </div>

     <section className="pPanel">
      <h3>Live Cloud Infrastructure Audit Log</h3>
      <div style={{ background: '#0f172a', color: '#38bdf8', padding: '14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.7', marginTop: '12px' }}>
       <div>[SYSTEM 09:54:02] Cloudflare Edge Routing: All 18 tenant subdomains SSL certificate verified.</div>
       <div>[DATABASE 09:54:08] Multi-Tenant PostgreSQL Connection Pool: Active connections 42 / Max 500.</div>
       <div>[WEBSOCKET 09:54:14] Socket.io Cluster: 3,410 drivers & customers connected. 0 dropped packets.</div>
       <div>[REDIS 09:54:20] Geofence Cache: Chandigarh, Mohali & Zirakpur polygons loaded in 1.2ms.</div>
       <div>[PAYMENTS 09:54:28] Razorpay Webhook Worker: 124 transactions processed cleanly.</div>
      </div>
     </section>
    </>
   )}

   {page === 'SaaS Settings' && (
    <section className="pPanel controlPanel">
     <div>
      <h3>SaaS Platform Global Configuration & Commission Policies</h3>
      <p>Configure global API keys, white-label branding, and SaaS owner platform commission share per ride.</p>
     </div>
     <div className="controlFields" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <label>Platform Name<input defaultValue="RideFlow SaaS" /></label>
      <label>SuperAdmin Email<input defaultValue="superadmin@rideflow.io" /></label>
      <label>Default Currency<input defaultValue="USD ($) / INR (₹)" /></label>
      <label>SaaS Take-Rate Per Ride (%)<input defaultValue="3.5%" /></label>
      <label>Minimum SaaS Fee Per Ride (₹)<input defaultValue="₹5.00 / ride" /></label>
      <label>SaaS Settlement Schedule<input defaultValue="Daily Auto-Sweep" /></label>
     </div>
     <div className="controlActions">
      <button className="primary" onClick={() => action('Global SaaS per-ride commission policy updated successfully')}>Save Global Settings & Commission Policy</button>
     </div>
    </section>
   )}

   {showTenantModal && <TenantModal close={() => setShowTenantModal(false)} onAddTenant={handleAddTenant} />}
  </div>
 );
}

function TenantModal({ close, onAddTenant }) {
 const [name, setName] = useState('CityCabs Gurgaon');
 const [slug, setSlug] = useState('gurgaon.rideflow.io');
 const [plan, setPlan] = useState('Growth ($299/mo)');
 const [fee, setFee] = useState('$299');
 const [drivers, setDrivers] = useState('120');

 const handleConfirm = () => {
  const id = 'TNT-' + Math.floor(100 + Math.random() * 900);
  onAddTenant({
   id,
   name,
   slug,
   plan,
   fee,
   drivers,
   rides: '1,250/day',
   status: 'Active'
  });
 };

 return (
  <div className="modalBack">
   <div className="modal" style={{ width: '520px' }}>
    <button className="close" onClick={close}>×</button>
    <span className="step">SAAS PROVISIONING · STEP 1 OF 1</span>
    <h2>Provision New SaaS Client Tenant</h2>
    <label>Cab Operator / Company Name
     <input value={name} onChange={e => setName(e.target.value)} />
    </label>
    <label>Subdomain Routing Slug
     <input value={slug} onChange={e => setSlug(e.target.value)} />
    </label>
    <label>Subscription Tier & Pricing Plan
     <select value={plan} onChange={e => {
      setPlan(e.target.value);
      setFee(e.target.value.includes('799') ? '$799' : e.target.value.includes('299') ? '$299' : '$99');
     }}>
      <option>Starter ($99/mo)</option>
      <option>Growth ($299/mo)</option>
      <option>Enterprise ($799/mo)</option>
     </select>
    </label>
    <label>Initial Driver Fleet Limit
     <input value={drivers} onChange={e => setDrivers(e.target.value)} />
    </label>
    <div className="modalActions">
     <button onClick={close}>Cancel</button>
     <button className="primary" onClick={handleConfirm}>Provision Instance</button>
    </div>
   </div>
  </div>
 );
}

function VehicleModal({ close, onAddVehicle }) {
 const [plate, setPlate] = useState('PB 65 AB ' + Math.floor(1000 + Math.random() * 9000));
 const [category, setCategory] = useState('E-Rickshaw (Electric)');
 const [driver, setDriver] = useState('Gurpreet Singh');
 const [compliance, setCompliance] = useState('Verified');
 const [status, setStatus] = useState('Active');

 const handleConfirm = () => {
  if (!plate.trim()) return;
  onAddVehicle({
   plate,
   category,
   driver,
   compliance,
   status
  });
 };

 return (
  <div className="modalBack">
   <div className="modal" style={{ width: '520px' }}>
    <button className="close" onClick={close}>×</button>
    <span className="step">VEHICLE FLEET ONBOARDING</span>
    <h2>Add New Vehicle to Fleet</h2>

    <label>Registration Plate Number
     <input value={plate} onChange={e => setPlate(e.target.value)} placeholder="e.g. PB 65 AB 2183" />
    </label>

    <label>Vehicle Service Category
     <select value={category} onChange={e => setCategory(e.target.value)}>
      <option>E-Rickshaw (Electric)</option>
      <option>Auto Rickshaw</option>
      <option>Bike Taxi</option>
      <option>Prime Sedan</option>
      <option>Outstation SUV</option>
      <option>Rental Hatchback</option>
     </select>
    </label>

    <label>Assigned Fleet Driver
     <select value={driver} onChange={e => setDriver(e.target.value)}>
      <option>Gurpreet Singh</option>
      <option>Rakesh Kumar</option>
      <option>Aman Verma</option>
      <option>Unassigned</option>
     </select>
    </label>

    <label>RC & Compliance Status
     <select value={compliance} onChange={e => setCompliance(e.target.value)}>
      <option>Verified</option>
      <option>Insurance Expiring Soon</option>
      <option>Pending PUC</option>
      <option>Action Needed</option>
     </select>
    </label>

    <label>Operational Status
     <select value={status} onChange={e => setStatus(e.target.value)}>
      <option>Active</option>
      <option>In Maintenance</option>
      <option>Suspended</option>
     </select>
    </label>

    <div className="modalActions">
     <button onClick={close}>Cancel</button>
     <button className="primary" onClick={handleConfirm}>Add Vehicle to Fleet</button>
    </div>
   </div>
  </div>
 );
}

function GenericItemModal({ page, close, onAddItem }) {
 const [fieldValues, setFieldValues] = useState({});

 const fieldDefs = {
  'Cities & geo fences': [
   { key: 'city', label: 'City / Region Name', placeholder: 'e.g. Ludhiana', default: 'Ludhiana' },
   { key: 'coverage', label: 'Coverage Zones', placeholder: 'e.g. 4 service zones', default: '4 service zones' },
   { key: 'specialZone', label: 'Airport / Special Zone', placeholder: 'e.g. Sahnewal Airport', default: 'Sahnewal Airport' },
   { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Pending Launch', 'Maintenance'] }
  ],
  'Service catalogue': [
   { key: 'service', label: 'Service Category Name', placeholder: 'e.g. Cargo E-Rickshaw', default: 'Cargo E-Rickshaw' },
   { key: 'type', label: 'Service Type', type: 'select', options: ['E-Rickshaw', 'Auto', 'Bike', 'Cab', 'Outstation', 'Rental'] },
   { key: 'capacity', label: 'Seating / Capacity', placeholder: 'e.g. 4 seats', default: '4 seats' },
   { key: 'pricing', label: 'Pricing Rate Card', placeholder: 'e.g. Base ₹25 | ₹8/km', default: 'Base ₹25 | ₹8/km' },
   { key: 'status', label: 'Status', type: 'select', options: ['Enabled', 'Disabled'] }
  ],
  'Vendors & fleet': [
   { key: 'fleet', label: 'Fleet / Vendor Name', placeholder: 'e.g. Speedo Cabs Pvt Ltd', default: 'Speedo Cabs' },
   { key: 'drivers', label: 'Driver Count', placeholder: 'e.g. 24', default: '24' },
   { key: 'vehicles', label: 'Vehicle Count', placeholder: 'e.g. 30', default: '30' },
   { key: 'payout', label: 'Weekly Payout Balance', placeholder: 'e.g. ₹42,500', default: '₹42,500' },
   { key: 'status', label: 'Compliance Status', type: 'select', options: ['Approved', 'Under Review', 'Suspended'] }
  ],
  'Coupons & referrals': [
   { key: 'code', label: 'Promo / Coupon Code', placeholder: 'e.g. FESTIVE30', default: 'FESTIVE30' },
   { key: 'type', label: 'Promotion Type', type: 'select', options: ['Coupon', 'Customer Referral', 'Driver Referral'] },
   { key: 'reward', label: 'Discount / Reward Amount', placeholder: 'e.g. 30% off (up to ₹100)', default: '30% off' },
   { key: 'expiry', label: 'Expiration Date (Valid Until)', placeholder: 'e.g. 31-Dec-2026', default: '31-Dec-2026' },
   { key: 'usage', label: 'Usage Tracker & Redemption Cap', placeholder: 'e.g. 0 / 500 uses', default: '0 / 500 uses' },
   { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Scheduled', 'Expired'] }
  ],
  'Notifications': [
   { key: 'campaign', label: 'Campaign Title', placeholder: 'e.g. Rain Surge Discount', default: 'Rain Surge Discount' },
   { key: 'audience', label: 'Target Audience', placeholder: 'e.g. Chandigarh Riders', default: 'All Customers' },
   { key: 'channel', label: 'Delivery Channel', type: 'select', options: ['Push + SMS', 'Push Only', 'SMS Only', 'WhatsApp'] },
   { key: 'schedule', label: 'Schedule Time', placeholder: 'e.g. Today, 5:00 PM', default: 'Today, 5:00 PM' },
   { key: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'Sent', 'Draft'] }
  ],
  'Safety & SOS': [
   { key: 'alert', label: 'Incident Reference ID', placeholder: 'e.g. SOS-084', default: 'SOS-' + Math.floor(100 + Math.random() * 900) },
   { key: 'ride', label: 'Ride ID', placeholder: 'e.g. RF-10842', default: 'RF-10842' },
   { key: 'raisedBy', label: 'Raised By', type: 'select', options: ['Customer', 'Driver', 'System Monitor'] },
   { key: 'location', label: 'Incident Location', placeholder: 'e.g. Sector 17, Chandigarh', default: 'Sector 17, Chandigarh' },
   { key: 'priority', label: 'Priority Level', type: 'select', options: ['High', 'Medium', 'Critical'] },
   { key: 'status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Resolved'] }
  ],
  'Support': [
   { key: 'ticket', label: 'Ticket ID', placeholder: 'e.g. SUP-3012', default: 'SUP-' + Math.floor(1000 + Math.random() * 9000) },
   { key: 'raisedBy', label: 'Customer / Driver Name', placeholder: 'e.g. Aarav Sharma', default: 'Aarav Sharma' },
   { key: 'subject', label: 'Issue Description', placeholder: 'e.g. Refund requested for cancelled trip', default: 'Fare discrepancy issue' },
   { key: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
   { key: 'status', label: 'Status', type: 'select', options: ['Open', 'In progress', 'Resolved'] }
  ],
  'Roles & settings': [
   { key: 'role', label: 'Role Name', placeholder: 'e.g. Fleet Supervisor', default: 'Fleet Supervisor' },
   { key: 'permissions', label: 'Permission Scope', placeholder: 'e.g. Vehicles, Drivers & Dispatch', default: 'Vehicles & Drivers' },
   { key: 'members', label: 'Assigned Staff', placeholder: 'e.g. 2 members', default: '1 member' },
   { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft'] }
  ],
  'Accounting & GST': [
   { key: 'invId', label: 'Invoice / Ref ID', placeholder: 'e.g. INV-9085', default: 'INV-' + Math.floor(9000 + Math.random() * 900) },
   { key: 'type', label: 'Invoice Category', type: 'select', options: ['Customer Tax Invoice (5% GST)', 'Cab Operator Commission (18% GST)', 'Driver TDS Settlement (1% 194C)'] },
   { key: 'entity', label: 'Billed To / Entity Name', placeholder: 'e.g. Aarav Sharma', default: 'Aarav Sharma' },
   { key: 'taxable', label: 'Taxable Amount (₹)', placeholder: 'e.g. ₹342.00', default: '₹342.00' },
   { key: 'tax', label: 'GST / TDS Tax Value', placeholder: 'e.g. ₹17.10 (5% GST)', default: '₹17.10 (5% GST)' },
   { key: 'status', label: 'Filing Status', type: 'select', options: ['Generated', 'Filed (GSTR-1)', 'Remitted (TDS)', 'Pending'] }
  ]
 };

 const currentFields = fieldDefs[page] || [
  { key: 'title', label: 'Item Title', placeholder: 'Enter title', default: 'New ' + page + ' Item' },
  { key: 'desc', label: 'Description', placeholder: 'Enter details', default: 'Configured by Admin' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Pending'] }
 ];

 const getValue = (f) => fieldValues[f.key] !== undefined ? fieldValues[f.key] : f.default;

 const handleConfirm = () => {
  const rowValues = currentFields.map(f => getValue(f));
  onAddItem(rowValues);
 };

 return (
  <div className="modalBack">
   <div className="modal" style={{ width: '520px' }}>
    <button className="close" onClick={close}>×</button>
    <span className="step">MANAGEMENT ENGINE · {page.toUpperCase()}</span>
    <h2>Add New Entry to {page}</h2>

    {currentFields.map(f => (
     <label key={f.key}>{f.label}
      {f.type === 'select' ? (
       <select value={getValue(f)} onChange={e => setFieldValues({ ...fieldValues, [f.key]: e.target.value })}>
        {f.options.map(opt => <option key={opt}>{opt}</option>)}
       </select>
      ) : (
       <input value={getValue(f)} onChange={e => setFieldValues({ ...fieldValues, [f.key]: e.target.value })} placeholder={f.placeholder} />
      )}
     </label>
    ))}

    <div className="modalActions">
     <button onClick={close}>Cancel</button>
     <button className="primary" onClick={handleConfirm}>Save {page} Entry</button>
    </div>
   </div>
  </div>
 );
}



import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';

const initialRows = {
 'Bookings': [['RF-10842','Aarav Sharma','Prime Sedan','Rakesh Kumar','₹342','In progress'],['RF-10841','Simran Kaur','Auto','Gurpreet Singh','₹186','Completed'],['RF-10840','Karan Mehta','Bike','Aman Verma','₹94','Driver arriving']],
 'Customer onboarding': [['Priya Malhotra','98144 20220','OTP verified','80%','Pending'],['Rohan Bansal','98712 33004','OTP verified','100%','Active']],
 'Drivers & KYC': [['Rakesh Kumar','DL verified','RC + insurance verified','Bank verified','Approved'],['Aman Verma','DL pending','RC verified','Bank verified','Under review'],['Rajesh Saini','DL verified','RC expired','Bank pending','Action needed']],
 'Vendors & fleet': [['Maple Mobility Fleet','18','22','₹28,450','Approved'],['CityLink Cabs','12','15','₹14,820','Approved']],
 'Vehicles': [['PB 65 AB 2183','Prime Sedan','Rakesh Kumar','Verified','Active'],['PB 65 EX 9091','Bike','Aman Verma','Insurance expiring','Review']],
 'Payments & payouts': [['PAY-88142','Ride payment','Aarav Sharma','₹342','UPI','Success'],['PYO-1472','Driver payout','Rakesh Kumar','₹5,480','Bank','Pending'],['REF-1277','Refund','Karan Mehta','₹94','Wallet','Processed']],
 'Commissions': [['Chandigarh standard','Independent drivers','Cab','18%','Active'],['Maple fleet agreement','Maple Fleet','All','12%','Active'],['Bike launch incentive','Zirakpur drivers','Bike','10%','Scheduled']],
 'Coupons': [['WELCOME50','₹50 off','First ride','482 / 1000','Active'],['AIRPORT20','20% off','Airport','134 / 500','Active']],
 'Notifications': [['Weekend airport offer','8,420 customers','Push + SMS','Sat, 9 AM','Scheduled'],['KYC reminder','14 drivers','Push + SMS','Today, 11 AM','Sent']],
 'Safety & SOS': [['SOS-071','RF-10812','Customer','Sector 22','High','Resolved'],['DIS-244','RF-10806','Driver','Mohali Airport','Medium','Open']],
 'Support': [['SUP-2094','Aarav Sharma','Driver arrived late','Medium','Open'],['SUP-2090','Rakesh Kumar','Payout not received','High','In progress']],
 'Reports': [['Revenue by city','September 2026','CSV / PDF','Today','Ready'],['Driver payout summary','Week 37','XLSX','Today','Ready']],
 'Roles & settings': [['Super Admin','All permissions','Vishal Kumar','Active'],['Operations Manager','Rides, drivers, SOS','2 members','Active'],['Finance Executive','Payments, payouts','1 member','Active']],
 'Service catalogue': [['Prime Sedan','Cab','4 seats','Enabled'],['Auto','Auto','3 seats','Enabled'],['Bike','Bike','1 rider','Enabled'],['Outstation SUV','Outstation','6 seats','Enabled']],
 'Cities & geo fences': [['Chandigarh','3 service zones','Airport zone','Active'],['Mohali','2 service zones','Railway station','Active'],['Zirakpur','1 service zone','No restricted zone','Active']],
 'Wallet & ledger': [['WLT-8121','Customer credit','Aarav Sharma','+ ₹120','Completed'],['WLT-8119','Driver deduction','Rakesh Kumar','− ₹42','Completed'],['WLT-8117','Referral reward','Simran Kaur','+ ₹75','Pending']],
 'Coupons & referrals': [['WELCOME50','Coupon','First ride','482 uses','Active'],['REF-VISHAL','Customer referral','₹75 credit','28 conversions','Active'],['DRV-RAKESH','Driver referral','₹500 reward','4 conversions','Active']],
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
 'Coupons':['Coupon','Offer','Eligibility','Usage','Status'],
 'Notifications':['Campaign','Audience','Channel','Schedule','Status'],
 'Safety & SOS':['Alert','Ride','Raised by','Location','Priority','Status'],
 'Support':['Ticket','Raised by','Subject','Priority','Status'],
 'Reports':['Report','Period','Format','Updated','Status'],
 'Roles & settings':['Role','Permissions','Members','Status'],
 'Service catalogue':['Service','Type','Capacity','Status'],
 'Cities & geo fences':['City','Coverage','Special zone','Status'],
 'Wallet & ledger':['Reference','Type','Account','Amount','Status'],
 'Coupons & referrals':['Code','Type','Reward','Performance','Status'],
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

function LeafletZoneMap() {
 const position = [30.6900, 76.7600];
 const chdPolygon = [[30.7600, 76.7500], [30.7600, 76.8100], [30.7100, 76.8100], [30.7100, 76.7500]];
 const mhlPolygon = [[30.7100, 76.6800], [30.7100, 76.7500], [30.6500, 76.7500], [30.6500, 76.6800]];
 const zrkPolygon = [[30.6600, 76.7800], [30.6600, 76.8500], [30.6100, 76.8500], [30.6100, 76.7800]];

 return (
  <div className="zoneMap" style={{ height: '330px', borderRadius: '13px', overflow: 'hidden' }}>
   <MapContainer center={position} zoom={11} scrollWheelZoom={false}>
    <TileLayer
     attribution='&copy; OpenStreetMap'
     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Polygon positions={chdPolygon} pathOptions={{ color: '#218d63', fillColor: '#218d63', fillOpacity: 0.35 }}>
     <Popup><b>Chandigarh Zone</b><br />3 active fare zones</Popup>
    </Polygon>
    <Polygon positions={mhlPolygon} pathOptions={{ color: '#8e44ad', fillColor: '#8e44ad', fillOpacity: 0.35 }}>
     <Popup><b>Mohali Zone</b><br />2 active fare zones</Popup>
    </Polygon>
    <Polygon positions={zrkPolygon} pathOptions={{ color: '#e67e22', fillColor: '#e67e22', fillOpacity: 0.35 }}>
     <Popup><b>Zirakpur Zone</b><br />1 active fare zone</Popup>
    </Polygon>
   </MapContainer>
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
 const [base, setBase] = useState(currentRules.base);
 const [perKm, setPerKm] = useState(currentRules.perKm);
 const [perMin, setPerMin] = useState(currentRules.perMin);
 const [minFare, setMinFare] = useState(currentRules.minFare);
 const [surge, setSurge] = useState(currentRules.surge);

 return (
  <div className="modalBack">
   <div className="modal" style={{ width: '480px' }}>
    <button className="close" onClick={close}>×</button>
    <span className="step">FARES & SURGE CONFIGURATION</span>
    <h2>Edit Fare Rules · Chandigarh Sedan</h2>
    <label>Base Fare (₹)<input value={base} onChange={e => setBase(e.target.value)} /></label>
    <label>Per Kilometer Rate (₹)<input value={perKm} onChange={e => setPerKm(e.target.value)} /></label>
    <label>Per Minute Rate (₹)<input value={perMin} onChange={e => setPerMin(e.target.value)} /></label>
    <label>Minimum Trip Fare (₹)<input value={minFare} onChange={e => setMinFare(e.target.value)} /></label>
    <label>Peak Demand Surge Multiplier<select value={surge} onChange={e => setSurge(e.target.value)}><option>1.0x (Normal)</option><option>1.25x (Moderate)</option><option>1.5x (High Peak)</option><option>2.0x (Extreme Surge)</option></select></label>
    <div className="modalActions">
     <button onClick={close}>Cancel</button>
     <button className="primary" onClick={() => { onSave({ base, perKm, perMin, minFare, surge }); close(); }}>Save Fare Rules</button>
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
    <h3>Fare breakup</h3>
    <p>Base fare <b>₹55</b></p>
    <p>Distance 14.2 km <b>₹198</b></p>
    <p>Time charge <b>₹48</b></p>
    <p>Tax <b>₹41</b></p>
    <p>Total <b>₹342</b></p>
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
 return (
  <>
   <ModuleHeader title="Fares & zones" subtitle="Configure city coverage, fare cards, rental/outstation rules and surge pricing." button="+ Add city zone" action={action} />
   <div className="pSplit">
    <LeafletZoneMap />
    <section className="pPanel pRule">
     <h3>Prime Sedan · Chandigarh</h3>
     <p>Local fare card configuration</p>
     <div key="base"><span>Base fare <b>₹{fareRules.base}</b></span></div>
     <div key="km"><span>Per km <b>₹{fareRules.perKm}</b></span></div>
     <div key="min"><span>Per minute <b>₹{fareRules.perMin}</b></span></div>
     <div key="minfare"><span>Minimum fare <b>₹{fareRules.minFare}</b></span></div>
     <div key="surge"><span>Peak demand surge <b>{fareRules.surge}</b></span></div>
     <button className="primary pFull" onClick={onOpenFareEditor}>Edit fare and surge rules</button>
    </section>
   </div>
   <div className="pCards">
    <Mini label="Cities live" value="3" note="All serviceable" icon="⌖" />
    <Mini label="Service zones" value="6" note="Map polygon zones" icon="◇" />
    <Mini label="Surge rules" value="4" note="Demand based" icon="↗" />
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

function Standard({ page, rowsData, action, ridesList, fareRules, onOpenFareEditor, onOpenKycModal }) {
 if (page === 'Drivers & KYC' || page === 'Customer onboarding') return <KycPage page={page} rowsData={rowsData} action={action} onOpenKycModal={onOpenKycModal} />;
 if (page === 'Live rides') return <Live action={action} ridesList={ridesList} />;
 if (page === 'Fares & zones') return <Fare action={action} fareRules={fareRules} onOpenFareEditor={onOpenFareEditor} />;
 if (page === 'Reports') return <Reports action={action} rowsData={rowsData} />;
 const [button, subtitle] = labels[page] || ['+ New item', 'Manage this area'];
 return (
  <>
   <ModuleHeader title={page} subtitle={subtitle} button={button} action={action} />
   <div className="pCards">
    <Mini label="Total records" value={page === 'Payments & payouts' ? '₹2.84L' : page === 'Notifications' ? '11' : '48'} note="Updated today" icon="▦" />
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

export function ProAdmin({ page, action, ridesList, setRidesList }) {
 const [rowsData, setRowsData] = useState(initialRows);
 const [showKycModal, setShowKycModal] = useState(false);
 const [showFareModal, setShowFareModal] = useState(false);
 const [fareRules, setFareRules] = useState({
  base: '55',
  perKm: '14',
  perMin: '2',
  minFare: '99',
  surge: '1.5x (High Peak)'
 });

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
   {page === 'Overview' ? <Overview action={action} rowsData={rowsData} ridesList={ridesList} /> : <Standard page={page} rowsData={rowsData} action={action} ridesList={ridesList} fareRules={fareRules} onOpenFareEditor={() => setShowFareModal(true)} onOpenKycModal={() => setShowKycModal(true)} />}
   {showKycModal && <KycModal close={() => setShowKycModal(false)} onDecision={handleKycDecision} />}
   {showFareModal && <FareEditorModal close={() => setShowFareModal(false)} currentRules={fareRules} onSave={(updated) => { setFareRules(updated); action('Fare rules and surge rates updated successfully'); }} />}
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

// ═══════════════════════════════════
// WORKER DATA & STATE
// ═══════════════════════════════════
const AVAIL_TASKS = [
  {id:1,co:"Consolidated Bank Ghana",init:"CB",task:"Office Cleaning — 2 Floors",type:"Facility & Cleaning",pay:85,loc:"Adabraka, Accra",dur:"6 hours",
   emp:{name:"Mr. Kofi Boateng",title:"Facilities Manager",phone:"0244-123-456",addr:"18 Independence Avenue, Adabraka, Accra",instr:"Report to the main reception at 8:00am. Ask for Mr. Boateng. All cleaning supplies will be provided on site. You will clean the ground floor and first floor."}},
  {id:2,co:"Korle Bu Teaching Hospital",init:"KB",task:"Hospital Ward Cleaning",type:"Facility & Cleaning",pay:100,loc:"Korle Bu, Accra",dur:"7 hours",
   emp:{name:"Admin Office",title:"Hospital Administration",phone:"0302-674-252",addr:"Korle Bu Teaching Hospital, Accra",instr:"Arrive at the main gate at 7:30am. Collect your visitor badge from security. You will be escorted to the ward. Wear the protective gear that will be provided to you."}},
  {id:3,co:"GhanaShip Logistics Ltd.",init:"GL",task:"Warehouse Stock Sorting",type:"Logistics & Delivery",pay:120,loc:"Tema Industrial Area",dur:"8 hours",
   emp:{name:"Mrs. Akua Asante",title:"Warehouse Supervisor",phone:"0244-567-890",addr:"Plot 47, Tema Industrial Area, Tema",instr:"Report to the warehouse entrance and ask for Mrs. Asante. She will brief you on the day's sorting tasks. Heavy lifting is required. Closed-toe shoes are mandatory."}},
  {id:4,co:"Trasacco Valley Estates",init:"TV",task:"Grass Cutting — Estate Complex",type:"Agriculture & Environment",pay:95,loc:"East Legon Hills, Accra",dur:"5 hours",
   emp:{name:"Estate Manager",title:"Property Management",phone:"0302-789-123",addr:"Trasacco Valley Estate, East Legon Hills, Accra",instr:"Enter through the service gate on the left side of the estate. Cutting equipment is in the groundskeeper shed. Work starts at 7:00am to avoid afternoon heat. You will be shown the areas to cut."}},
  {id:5,co:"Achimota Primary School",init:"AP",task:"School Painting — 4 Classrooms",type:"Community Services",pay:90,loc:"Achimota, Accra",dur:"7 hours",
   emp:{name:"Mr. Asare",title:"Headmaster",phone:"0244-321-654",addr:"Achimota Primary School, Achimota Road, Accra",instr:"Report to the main school office and ask for Mr. Asare. Paint and brushes are provided. You will be painting 4 classrooms on the ground floor. Work carefully and neatly."}}
];

const WS = { status:'idle', task:null, done:14, earned:840 };
let declined = new Set();

function renderWorker() {
  const m = document.getElementById('workerMain');
  if (!m) return;
  if (WS.status === 'idle') m.innerHTML = renderIdle();
  else if (WS.status === 'accepted') m.innerHTML = renderAccepted();
  else if (WS.status === 'active') m.innerHTML = renderActive();
  else if (WS.status === 'done') m.innerHTML = renderDone();
  window.scrollTo({top:0,behavior:'smooth'});
}

function S(s){return`<span style="${s}">`}
function btn(onclick, style, label){return`<button onclick="${onclick}" style="padding:11px 20px;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;${style}">${label}</button>`}

function renderIdle() {
  const tasks = AVAIL_TASKS.filter(t => !declined.has(t.id));
  const cards = tasks.map(t => `
    <div style="background:#fff;border:1.5px solid var(--bd);border-radius:14px;padding:20px;margin-bottom:12px;">
      <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;">
        <div style="width:50px;height:50px;border-radius:12px;background:var(--g1);border:1.5px solid var(--bd);display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-size:17px;font-weight:800;color:var(--g7);flex-shrink:0;">${t.init}</div>
        <div style="flex:1;">
          <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:800;color:var(--g9);margin-bottom:3px;">${t.co}</div>
          <div style="font-size:13px;color:#3a5a45;margin-bottom:8px;">${t.task}</div>
          <div style="display:flex;gap:16px;flex-wrap:wrap;">
            <span style="font-size:12px;color:var(--mu);">${t.loc}</span>
            <span style="font-size:12px;color:var(--mu);">${t.dur}</span>
            <span style="font-family:'Inter',sans-serif;font-size:14px;font-weight:800;color:var(--g7);">GH₵ ${t.pay}</span>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:10px;">
        <button onclick="declineTask(${t.id})" style="flex:1;padding:10px;background:transparent;color:var(--mu);border:1.5px solid var(--bd);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;">Decline</button>
        <button onclick="acceptTask(${t.id})" style="flex:2;padding:10px;background:var(--g7);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">Accept Task</button>
      </div>
    </div>`).join('');

  const empty = `<div style="text-align:center;padding:48px 20px;color:var(--mu);">
    <div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:600;color:var(--g9);margin-bottom:8px;">No tasks available right now</div>
    <div style="font-size:13px;line-height:1.65;">Your coordinator will notify you when new tasks are assigned.</div>
    <button onclick="declined.clear();renderWorker();" style="margin-top:16px;padding:9px 20px;background:var(--g0);color:var(--g7);border:1.5px solid var(--bd);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;">Show All Tasks</button>
  </div>`;

  return `<div style="max-width:620px;margin:0 auto;padding:28px 24px 80px;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px;">
      <div style="background:var(--g0);border:1.5px solid var(--bd);border-radius:10px;padding:14px;text-align:center;"><div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:var(--g8);">${WS.done}</div><div style="font-size:11px;color:var(--mu);margin-top:3px;">Tasks Done</div></div>
      <div style="background:var(--g0);border:1.5px solid var(--bd);border-radius:10px;padding:14px;text-align:center;"><div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800;color:var(--g8);">GH₵ ${WS.earned}</div><div style="font-size:11px;color:var(--mu);margin-top:3px;">Total Earned</div></div>
      <div style="background:var(--g0);border:1.5px solid var(--bd);border-radius:10px;padding:14px;text-align:center;"><div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:var(--g8);">4.9 ★</div><div style="font-size:11px;color:var(--mu);margin-top:3px;">Your Rating</div></div>
    </div>
    <div style="margin-bottom:16px;">
      <div style="font-family:'Inter',sans-serif;font-size:18px;font-weight:800;color:var(--g9);margin-bottom:4px;">Tasks Available For You</div>
      <div style="font-size:13px;color:var(--mu);">Accept a task to see the employer's full contact details. You can only work one task at a time.</div>
    </div>
    ${tasks.length ? cards : empty}
  </div>`;
}

function renderAccepted() {
  const t = WS.task;
  return `<div style="max-width:620px;margin:0 auto;padding:28px 24px 80px;">
    <div style="background:var(--g1);border:1.5px solid var(--g4);border-radius:12px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
      <div style="width:10px;height:10px;border-radius:50%;background:var(--g5);flex-shrink:0;"></div>
      <div><div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:var(--g8);">Task Accepted</div><div style="font-size:12px;color:var(--g7);margin-top:2px;">Read the instructions below carefully, then press Go when you are ready to start.</div></div>
    </div>
    <div style="background:#fff;border:1.5px solid var(--bd);border-radius:14px;padding:22px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--bd);">
        <div style="width:54px;height:54px;border-radius:12px;background:var(--g1);border:1.5px solid var(--bd);display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-size:19px;font-weight:800;color:var(--g7);flex-shrink:0;">${t.init}</div>
        <div style="flex:1;">
          <div style="font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:var(--g9);">${t.co}</div>
          <div style="font-size:13px;color:#3a5a45;margin-top:2px;">${t.task}</div>
        </div>
        <div style="text-align:right;"><div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:900;color:var(--g7);">GH₵ ${t.pay}</div><div style="font-size:11px;color:var(--mu);">${t.dur}</div></div>
      </div>
      <div style="display:flex;gap:22px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--bd);">
        <div><div style="font-size:11px;color:var(--mu);margin-bottom:3px;">Location</div><div style="font-size:13px;font-weight:600;color:var(--g9);">${t.loc}</div></div>
        <div><div style="font-size:11px;color:var(--mu);margin-bottom:3px;">Duration</div><div style="font-size:13px;font-weight:600;color:var(--g9);">${t.dur}</div></div>
        <div><div style="font-size:11px;color:var(--mu);margin-bottom:3px;">Category</div><div style="font-size:13px;font-weight:600;color:var(--g9);">${t.type}</div></div>
      </div>
      <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--bd);">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.8px;color:var(--mu);text-transform:uppercase;margin-bottom:10px;">Employer Contact Details</div>
        <div style="background:var(--g0);border-radius:10px;padding:14px;">
          <div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:var(--g9);margin-bottom:2px;">${t.emp.name}</div>
          <div style="font-size:12px;color:var(--mu);margin-bottom:8px;">${t.emp.title}</div>
          <div style="font-size:13px;color:var(--g8);font-weight:600;margin-bottom:4px;">Phone: ${t.emp.phone}</div>
          <div style="font-size:12.5px;color:var(--mu);">${t.emp.addr}</div>
        </div>
      </div>
      <div>
        <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.8px;color:var(--mu);text-transform:uppercase;margin-bottom:8px;">Your Instructions</div>
        <div style="font-size:13px;color:#3a5a45;line-height:1.75;background:var(--g0);border-radius:10px;padding:14px;">${t.emp.instr}</div>
      </div>
    </div>
    <button onclick="startTask()" style="width:100%;padding:16px;background:var(--g7);color:#fff;border:none;border-radius:12px;font-family:'Inter',sans-serif;font-size:17px;font-weight:800;cursor:pointer;letter-spacing:-.3px;transition:background .15s;" onmouseover="this.style.background='var(--g6)'" onmouseout="this.style.background='var(--g7)'">Go — Start This Task</button>
    <p style="text-align:center;font-size:12px;color:var(--mu);margin-top:10px;">GPS tracking activates when you press Go</p>
  </div>`;
}

function renderActive() {
  const t = WS.task;
  return `<div style="max-width:620px;margin:0 auto;padding:28px 24px 80px;">
    <div style="background:var(--g8);border-radius:12px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
      <div style="width:10px;height:10px;border-radius:50%;background:var(--g4);animation:pulse 2s infinite;flex-shrink:0;"></div>
      <div style="flex:1;"><div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:#fff;">Task In Progress</div><div style="font-size:12px;color:rgba(255,255,255,.6);margin-top:2px;">GPS is active. Do your best work and press Done when you are finished.</div></div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:rgba(255,255,255,.4);">GPS LIVE</div>
    </div>
    <div style="background:#fff;border:2px solid var(--g4);border-radius:14px;padding:22px;margin-bottom:18px;">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--bd);">
        <div style="width:54px;height:54px;border-radius:12px;background:var(--g1);display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-size:19px;font-weight:800;color:var(--g7);flex-shrink:0;">${t.init}</div>
        <div style="flex:1;"><div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:800;color:var(--g9);">${t.co}</div><div style="font-size:13px;color:#3a5a45;margin-top:2px;">${t.task}</div></div>
        <div style="text-align:right;"><div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:900;color:var(--g7);">GH₵ ${t.pay}</div></div>
      </div>
      <div style="display:flex;gap:22px;">
        <div><div style="font-size:11px;color:var(--mu);margin-bottom:3px;">Location</div><div style="font-size:13px;font-weight:600;color:var(--g9);">${t.loc}</div></div>
        <div><div style="font-size:11px;color:var(--mu);margin-bottom:3px;">Duration</div><div style="font-size:13px;font-weight:600;color:var(--g9);">${t.dur}</div></div>
      </div>
    </div>
    <div style="background:var(--g0);border:1.5px solid var(--bd);border-radius:12px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
      <div><div style="font-size:12px;color:var(--mu);margin-bottom:2px;">On-site contact</div><div style="font-size:14px;font-weight:700;color:var(--g9);">${t.emp.name}</div><div style="font-size:13px;color:var(--g7);">${t.emp.phone}</div></div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--g6);">CALL IF NEEDED</div>
    </div>
    <button onclick="completeTask()" style="width:100%;padding:18px;background:var(--gold);color:#000;border:none;border-radius:12px;font-family:'Inter',sans-serif;font-size:17px;font-weight:800;cursor:pointer;letter-spacing:-.3px;transition:filter .15s;" onmouseover="this.style.filter='brightness(1.08)'" onmouseout="this.style.filter='brightness(1)'">Done — I Have Completed This Task</button>
    <p style="text-align:center;font-size:12px;color:var(--mu);margin-top:10px;">Only press Done when you have fully finished the task</p>
    <div style="text-align:center;margin-top:18px;"><button onclick="toast('Coordinator notified. Abena Mensah will call you shortly.')" style="background:none;border:none;color:var(--g6);font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:underline;">Need help? Contact your coordinator</button></div>
  </div>`;
}

function renderDone() {
  const t = WS.task;
  return `<div style="max-width:580px;margin:0 auto;padding:40px 24px 80px;text-align:center;">
    <div style="width:80px;height:80px;border-radius:50%;background:var(--g1);border:2px solid var(--g4);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:32px;color:var(--g6);">✓</div>
    <div style="font-family:'Inter',sans-serif;font-size:26px;font-weight:900;color:var(--g9);letter-spacing:-.8px;margin-bottom:8px;">Task Completed!</div>
    <div style="font-size:14px;color:var(--mu);margin-bottom:28px;line-height:1.65;">Well done. Your payment will be processed within 48 hours via MTN Mobile Money.</div>
    <div style="background:#fff;border:1.5px solid var(--bd);border-radius:14px;padding:22px;text-align:left;margin-bottom:20px;">
      <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.8px;color:var(--mu);text-transform:uppercase;margin-bottom:14px;">Completed Task</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--g1);display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-size:17px;font-weight:800;color:var(--g7);">${t.init}</div>
        <div><div style="font-weight:700;color:var(--g9);font-size:14px;">${t.co}</div><div style="font-size:12px;color:var(--mu);">${t.task}</div></div>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid var(--bd);"><span style="font-size:13px;color:var(--mu);">Amount earned</span><span style="font-family:'Inter',sans-serif;font-size:16px;font-weight:900;color:var(--g7);">GH₵ ${t.pay}</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid var(--bd);"><span style="font-size:13px;color:var(--mu);">Payment status</span><span style="font-family:'IBM Plex Mono',monospace;font-size:10px;padding:3px 9px;background:#fef6e0;color:#9a6f00;border-radius:4px;font-weight:600;">Pending · 48 hrs</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid var(--bd);"><span style="font-size:13px;color:var(--mu);">Total tasks completed</span><span style="font-weight:700;color:var(--g9);">${WS.done} tasks</span></div>
    </div>
    <button onclick="WS.status='idle';WS.task=null;declined.clear();renderWorker();" style="width:100%;padding:14px;background:var(--g7);color:#fff;border:none;border-radius:12px;font-family:'Inter',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:background .15s;" onmouseover="this.style.background='var(--g6)'" onmouseout="this.style.background='var(--g7)'">Back to Dashboard</button>
  </div>`;
}

function acceptTask(id) {
  WS.task = AVAIL_TASKS.find(t => t.id === id);
  WS.status = 'accepted';
  renderWorker();
}
function declineTask(id) { declined.add(id); renderWorker(); }
function startTask() { WS.status = 'active'; renderWorker(); }
function completeTask() { WS.done++; WS.earned += WS.task.pay; WS.status = 'done'; renderWorker(); }

// ═══════════════════════════════════
// EMPLOYER DASHBOARD DATA
// ═══════════════════════════════════
const CATALOG={
  "Facility & Cleaning":["Office cleaning","School compound sweeping","Hospital ward cleaning","Market stall cleaning","Hotel room housekeeping","Drain clearing","Gutter cleaning","Road sweeping"],
  "Logistics & Delivery":["Warehouse stock sorting","Goods offloading at Tema Port","Supermarket shelf stocking","Laundry pickup and delivery","Market porter","Furniture moving","Water sachet delivery"],
  "Maintenance & Repairs":["Painting and touch-up work","Tiling assistance","Plumbing support","Fence and gate repair","Car wash attendant","Building site labourer"],
  "Event & Hospitality":["Chair and table setup","Event breakdown and pack-up","Catering assistant","Food serving at events","Crowd control assistant","Venue decoration setup","Dishwashing"],
  "Agriculture & Environment":["Farm weeding and harvesting","Tree planting","Grass cutting","Landscaping for estates","Compost collection","Community garden maintenance"],
  "Retail & Trade":["Shop attendant","Market stall assistant","Supermarket trolley collection","Packing and bagging","Loading and offloading trucks","Cold store assistant"],
  "Community Services":["Community toilet cleaning","School painting","Neighbourhood waste collection","Street drain maintenance","Public park upkeep","Signage installation"]
};
const ECATS=[
  {name:"Facility & Cleaning",desc:"Cleaning and sanitation for offices, hospitals, schools, and public spaces.",samples:["Office cleaning","Hospital ward cleaning","Gutter clearing","Road sweeping"]},
  {name:"Logistics & Delivery",desc:"Warehouse support, port operations, delivery, and physical goods handling.",samples:["Warehouse sorting","Port offloading","Market porter","Furniture moving"]},
  {name:"Maintenance & Repairs",desc:"Painting, plumbing, tiling, and building site support services.",samples:["Painting","Plumbing support","Building labour","Car wash"]},
  {name:"Event & Hospitality",desc:"Setup, service, and breakdown support for events.",samples:["Chair & table setup","Catering assistant","Food serving","Dishwashing"]},
  {name:"Agriculture & Environment",desc:"Farming, landscaping, and environmental upkeep.",samples:["Farm weeding","Grass cutting","Tree planting","Landscaping"]},
  {name:"Retail & Trade",desc:"Shop floor, stock, and trade assistance.",samples:["Shop attendant","Packing & bagging","Shelf stocking","Loading trucks"]},
  {name:"Community Services",desc:"Public space maintenance and community projects.",samples:["Waste collection","Drain maintenance","Park upkeep","School painting"]}
];
const EWORKERS=[
  {id:"BX-00142",name:"Kofi Asante",seed:"kofi44",gender:"m",cats:["Facility & Cleaning","Logistics & Delivery","Community Services"],tasks:14,months:3,rating:4.9,offense:"minor",offenseLabel:"Minor Offense",charge:85,bio:"Reliable and detail-oriented facility worker with an excellent attendance record. Trusted by corporate clients. Perfect GPS check-in record.",skills:["Office Cleaning","Gutter Clearing","Road Sweeping","Waste Disposal"],released:"Jan 2026"},
  {id:"BX-00205",name:"Kwame Boateng",seed:"kwame77",gender:"m",cats:["Facility & Cleaning","Community Services"],tasks:8,months:2,rating:4.6,offense:"none",offenseLabel:"Clean Record",charge:75,bio:"Punctual and thorough. Specialises in school compound and hospital ward environments. Clean GPS record across all assignments.",skills:["School Cleaning","Hospital Wards","Drain Clearing","Public Toilets"],released:"Feb 2026"},
  {id:"BX-00318",name:"Akua Mensah",seed:"akua22",gender:"f",cats:["Facility & Cleaning","Event & Hospitality"],tasks:11,months:3,rating:4.8,offense:"none",offenseLabel:"Clean Record",charge:80,bio:"Professional and thorough. Has worked in hotel housekeeping and corporate offices with consistently high ratings.",skills:["Hotel Housekeeping","Office Deep Clean","Event Setup","Market Stalls"],released:"Jan 2026"},
  {id:"BX-00211",name:"James Osei",seed:"james88",gender:"m",cats:["Logistics & Delivery","Facility & Cleaning"],tasks:22,months:4,rating:4.8,offense:"minor",offenseLabel:"Minor Offense",charge:120,bio:"Highly experienced logistics worker with a warehousing background. Top-rated worker with 22 completed tasks.",skills:["Warehouse Sorting","Port Offloading","Furniture Moving","Shelf Stocking"],released:"Dec 2025"},
  {id:"BX-00287",name:"Fiifi Darko",seed:"fiifi55",gender:"m",cats:["Logistics & Delivery","Retail & Trade"],tasks:6,months:2,rating:4.5,offense:"none",offenseLabel:"Clean Record",charge:95,bio:"Fast and reliable delivery assistant. Familiar with Accra road networks and market logistics.",skills:["Delivery Runs","Loading & Offloading","Market Porter","Shelf Stocking"],released:"Feb 2026"},
  {id:"BX-00156",name:"Yaw Asante",seed:"yaw33",gender:"m",cats:["Maintenance & Repairs","Community Services"],tasks:17,months:4,rating:4.7,offense:"major",offenseLabel:"⚠️ Major Offense",charge:140,bio:"Skilled in painting, plumbing, and site labour. Strong pre-conviction construction background. Excellent recent employer references.",skills:["Painting & Touch-Up","Plumbing Support","Building Labour","Fence Repair"],released:"Dec 2025"},
  {id:"BX-00089",name:"Ama Sarpong",seed:"ama99",gender:"f",cats:["Event & Hospitality","Facility & Cleaning"],tasks:9,months:3,rating:4.7,offense:"minor",offenseLabel:"Minor Offense",charge:110,bio:"Professional event support worker. Comfortable at large-scale corporate events. Friendly, well-presented, and reliable.",skills:["Chair & Table Setup","Catering Assistant","Dishwashing","Venue Decoration"],released:"Jan 2026"},
  {id:"BX-00334",name:"Efua Boahen",seed:"efua44",gender:"f",cats:["Event & Hospitality","Retail & Trade"],tasks:5,months:2,rating:4.6,offense:"none",offenseLabel:"Clean Record",charge:100,bio:"Energetic and customer-focused. Works well in high-pressure event environments.",skills:["Food Serving","Crowd Control","Event Breakdown","Catering Support"],released:"Feb 2026"},
  {id:"BX-00412",name:"Kofi Amoah",seed:"amoah77",gender:"m",cats:["Agriculture & Environment","Community Services"],tasks:10,months:3,rating:4.5,offense:"minor",offenseLabel:"Minor Offense",charge:90,bio:"Experienced farm hand and landscaping worker. Works well outdoors in all conditions.",skills:["Farm Weeding","Grass Cutting","Tree Planting","Landscaping"],released:"Jan 2026"},
  {id:"BX-00256",name:"Abena Owusu",seed:"abena55",gender:"f",cats:["Retail & Trade","Logistics & Delivery"],tasks:7,months:2,rating:4.7,offense:"none",offenseLabel:"Clean Record",charge:80,bio:"Attentive and well-organised. Praised for professionalism and friendly manner in retail settings.",skills:["Shop Attendant","Packing & Bagging","Supermarket Trolleys","Cold Store"],released:"Jan 2026"},
  {id:"BX-00178",name:"Nii Commey",seed:"nii11",gender:"m",cats:["Community Services","Facility & Cleaning"],tasks:19,months:4,rating:4.6,offense:"minor",offenseLabel:"Minor Offense",charge:70,bio:"Dedicated community services worker. Has completed multiple AMA contracts with consistently positive feedback.",skills:["Waste Collection","Park Upkeep","Drain Maintenance","School Painting"],released:"Dec 2025"}
];

function wAvatar(w,sz){
  sz=sz||80;
  const pals=[['#1a4d30','#40b86e'],['#1f6138','#72d49a'],['#0d3320','#2d9356'],['#257a45','#b8dfc9'],['#1f3d5a','#3a7a9a'],['#4a2d0d','#9a6a30']];
  const pi=(w.name.charCodeAt(0)+(w.name.charCodeAt(4)||0))%pals.length;
  const[dark,light]=pals[pi];const h=sz/2;const uid='av'+w.id.replace(/\W/g,'');
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${sz} ${sz}'><defs><radialGradient id='${uid}' cx='38%' cy='28%' r='75%'><stop offset='0%' stop-color='${light}'/><stop offset='100%' stop-color='${dark}'/></radialGradient></defs><circle cx='${h}' cy='${h}' r='${h}' fill='url(#${uid})'/><circle cx='${h}' cy='${sz*.36}' r='${sz*.2}' fill='rgba(255,255,255,0.9)'/><path d='M${sz*.06},${sz} Q${sz*.06},${sz*.58} ${h},${sz*.58} Q${sz*.94},${sz*.58} ${sz*.94},${sz}Z' fill='rgba(255,255,255,0.9)'/></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

const EMP={view:'categories',cat:null,worker:null,days:1,payMethod:'mtn'};
function empGo(v){EMP.view=v;renderEmp();}
function renderEmp(){
  const m=document.getElementById('empMain');if(!m)return;
  if(EMP.view==='categories')m.innerHTML=renderECats();
  else if(EMP.view==='workers')m.innerHTML=renderEWorkers();
  else if(EMP.view==='profile')m.innerHTML=renderEProfile();
  else if(EMP.view==='confirm')m.innerHTML=renderEConfirm();
  else if(EMP.view==='payment')m.innerHTML=renderEPayment();
  else if(EMP.view==='success')m.innerHTML=renderESuccess();
}
function renderECats(){
  const top=ECATS.slice(0,4).map((c,i)=>eCatCard(c,i)).join('');
  const bot=ECATS.slice(4).map((c,i)=>eCatCard(c,i+4)).join('');
  return`<div class="ebody"><div class="ehero"><h2>Find the right worker.</h2><p>Select a service category to see verified workers available in Accra. Click a worker's profile to view their experience, ratings, and offense classification.</p></div><div class="ecat-g">${top}</div><div class="ecat-g3">${bot}</div></div>`;
}
function eCatCard(c,i){
  const n=EWORKERS.filter(w=>w.cats.includes(c.name)).length;
  return`<div class="ecat" onclick="EMP.cat=ECATS[${i}];empGo('workers')"><div class="ecat-i"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--g6)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div><div class="ecat-n">${c.name}</div><div class="ecat-c">${n} workers available</div><div class="ecat-t">${c.samples.slice(0,3).join(' · ')}</div></div>`;
}
function renderEWorkers(){
  const ws=EWORKERS.filter(w=>w.cats.includes(EMP.cat.name));
  const cards=ws.map(w=>{
    const i=EWORKERS.indexOf(w);
    const ob=w.offense==='none'?`<span class="on on-n">Clean Record</span>`:w.offense==='minor'?`<span class="on on-m">Minor Offense</span>`:`<span class="on on-x">${w.offenseLabel}</span>`;
    const st='★'.repeat(Math.floor(w.rating))+'☆'.repeat(5-Math.floor(w.rating));
    return`<div class="ewc"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;"><div class="wph"><img src="${wAvatar(w,68)}" alt="${w.name}"/></div><div><div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:700;color:var(--g9);margin-bottom:3px;">${w.name}</div><div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--mu);">${w.id}</div></div></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;"><span class="stars">${st}</span><span style="font-size:13px;color:var(--mu);">${w.rating}</span></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">${ob}<div style="font-family:'Inter',sans-serif;font-size:14px;font-weight:800;color:var(--g7);">GH₵ ${w.charge}<span style="font-size:11px;font-weight:400;color:var(--mu);">/day</span></div></div><div style="font-size:12px;color:var(--mu);margin-bottom:12px;">${w.tasks} tasks · ${w.months} months</div><button class="wvb" onclick="EMP.worker=EWORKERS[${i}];empGo('profile')">View Profile →</button></div>`;
  }).join('');
  return`<div class="ebody"><div class="ebc"><span class="ebcl" onclick="empGo('categories')">All Categories</span><span style="opacity:.4;">›</span><span style="color:var(--g9);font-weight:600;">${EMP.cat.name}</span></div><div class="ehero"><h2>${EMP.cat.name}</h2><p>${EMP.cat.desc} &nbsp;·&nbsp; <strong>${ws.length} workers available now</strong></p></div><div class="ewg">${cards}</div></div>`;
}
function renderEProfile(){
  const w=EMP.worker;
  const st='★'.repeat(Math.floor(w.rating))+'☆'.repeat(5-Math.floor(w.rating));
  const ob=w.offense==='none'?`<span class="on on-n" style="font-size:12px;padding:4px 10px;">Clean Record</span>`:w.offense==='minor'?`<span class="on on-m" style="font-size:12px;padding:4px 10px;">Minor Offense</span>`:`<span class="on on-x" style="font-size:12px;padding:4px 10px;">${w.offenseLabel}</span>`;
  const disc=w.offense==='major'?`<div style="background:#fde8e8;border:1.5px solid #f5c6c6;border-radius:10px;padding:12px;margin-top:10px;font-size:12.5px;color:#b91c1c;line-height:1.65;"><strong>⚠️ Major Offense Disclosure:</strong> Full details are available from your BeyondX coordinator. This worker has been assessed as fit for reintegration. The hiring decision remains entirely with you.</div>`:'';
  return`<div class="ebody"><div class="ebc"><span class="ebcl" onclick="empGo('categories')">Categories</span><span style="opacity:.4;">›</span><span class="ebcl" onclick="empGo('workers')">${EMP.cat?EMP.cat.name:'Workers'}</span><span style="opacity:.4;">›</span><span style="color:var(--g9);font-weight:600;">${w.name}</span></div>
  <div class="epl">
    <div class="eleft">
      <div class="epbig"><img src="${wAvatar(w,110)}" alt="${w.name}"/></div>
      <div class="epn">${w.name}</div><div class="epid">${w.id} · Released ${w.released}</div>
      <div style="font-size:15px;margin-bottom:10px;">${st} <span style="font-size:12px;color:var(--mu);">(${w.tasks})</span></div>
      ${ob}${disc}
      <div class="chbox"><div class="chlbl">Day Rate</div><div class="chval">GH₵ ${w.charge}<span class="chunit"> / day</span></div><div style="font-size:11px;color:var(--mu);margin-top:3px;">+15% platform fee applies</div></div>
      <div style="margin-bottom:10px;"><span style="display:inline-flex;align-items:center;gap:5px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--g6);font-weight:600;background:var(--g0);border:1px solid var(--g1);padding:3px 10px;border-radius:20px;"><span style="width:6px;height:6px;border-radius:50%;background:var(--g4);display:inline-block;"></span>GPS Cleared &amp; Verified</span></div>
      <button class="btndisp" onclick="EMP.days=1;empGo('confirm')">Dispatch This Worker →</button>
    </div>
    <div class="er">
      <div class="esec"><div class="esec-t">About</div><p style="font-size:13.5px;color:var(--mu);line-height:1.78;">${w.bio}</p></div>
      <div class="esec"><div class="esec-t">Experience &amp; Stats</div><div class="schips"><div class="schip"><div class="schip-v">${w.tasks}</div><div class="schip-l">Tasks Done</div></div><div class="schip"><div class="schip-v">${w.months}</div><div class="schip-l">Months Active</div></div><div class="schip"><div class="schip-v">${w.rating}</div><div class="schip-l">Avg Rating</div></div><div class="schip"><div class="schip-v">100%</div><div class="schip-l">GPS Record</div></div></div></div>
      <div class="esec"><div class="esec-t">Skills &amp; Certifications</div><div style="display:flex;flex-wrap:wrap;gap:8px;">${w.skills.map(s=>`<span class="stag2">${s}</span>`).join('')}</div></div>
      <div class="esec"><div class="esec-t">Offense Classification</div>${w.offense==='none'?`<div style="display:flex;align-items:center;gap:10px;"><span class="on on-n" style="padding:4px 12px;">Clean Record</span><span style="font-size:13px;color:var(--mu);">No prior convictions.</span></div>`:w.offense==='minor'?`<div style="display:flex;align-items:center;gap:10px;"><span class="on on-m" style="padding:4px 12px;">Minor Offense</span><span style="font-size:13px;color:var(--mu);">Sentence fully served.</span></div>`:`<div style="display:flex;align-items:center;gap:10px;"><span class="on on-x" style="padding:4px 12px;">⚠️ Major Offense</span><span style="font-size:13px;color:var(--mu);">See disclosure above.</span></div>`}</div>
    </div>
  </div></div>`;
}
function renderEConfirm(){
  const w=EMP.worker;const fee=Math.round(w.charge*EMP.days*0.15);const total=w.charge*EMP.days+fee;
  const opts=(CATALOG[EMP.cat?EMP.cat.name:'Facility & Cleaning']||[]).map(t=>`<option>${t}</option>`).join('');
  return`<div class="ebody"><div class="conf-wrap">
    <div class="ebc"><span class="ebcl" onclick="empGo('profile')">← Back to Profile</span></div>
    <div class="ehero" style="margin-bottom:18px;"><h2>Confirm your dispatch.</h2><p>Review the details and pricing before proceeding to payment.</p></div>
    <div class="conf-wr"><div class="wph" style="width:50px;height:50px;flex-shrink:0;"><img src="${wAvatar(w,50)}" alt="${w.name}"/></div><div><div style="font-family:'Inter',sans-serif;font-size:15px;font-weight:700;color:var(--g9);">${w.name}</div><div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--mu);">${w.id} · GH₵ ${w.charge}/day</div></div><div style="margin-left:auto;"><span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--g6);font-weight:600;">GPS Cleared</span></div></div>
    <div class="fld"><label>Task Type</label><select>${opts}</select></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div class="fld"><label>Start Date</label><input type="date" value="${new Date().toISOString().slice(0,10)}"/></div><div class="fld"><label>Duration</label><select onchange="EMP.days=+this.value;empGo('confirm')"><option value="1">1 Day</option><option value="0.5">Half Day</option><option value="2">2 Days</option><option value="3">3 Days</option></select></div></div>
    <div class="fld"><label>Location / Organisation</label><input type="text" placeholder="e.g. Accra Business Hub, Osu"/></div>
    <div class="pbox"><div class="pr"><span class="pkey">Worker rate (${EMP.days} day${EMP.days>1?'s':''})</span><span class="pval">GH₵ ${w.charge*EMP.days}</span></div><div class="pr"><span class="pkey">Platform fee (15%)</span><span class="pval">GH₵ ${fee}</span></div><div class="pr"><span class="pkey">Total due today</span><span class="pval">GH₵ ${total}</span></div></div>
    <button class="btnpro" onclick="empGo('payment')">Proceed to Payment →</button>
  </div></div>`;
}
function renderEPayment(){
  const w=EMP.worker;const fee=Math.round(w.charge*EMP.days*0.15);const total=w.charge*EMP.days+fee;
  const methods=[{id:'mtn',name:'MTN Mobile Money',desc:'Pay via MTN MoMo',color:'#FFCC00',text:'#000',abbr:'MTN'},{id:'voda',name:'Vodafone Cash',desc:'Pay via Vodafone Cash',color:'#E60000',text:'#fff',abbr:'VOD'},{id:'airtel',name:'AirtelTigo Money',desc:'Pay via AirtelTigo',color:'#FF2E00',text:'#fff',abbr:'ATM'},{id:'bank',name:'Bank Transfer',desc:'Direct bank payment',color:'#1a4d30',text:'#fff',abbr:'BNK'}];
  const ms=methods.map(m=>`<div class="paym${EMP.payMethod===m.id?' sel':''}" onclick="EMP.payMethod='${m.id}';empGo('payment')"><div class="paym-lg" style="background:${m.color};color:${m.text};">${m.abbr}</div><div class="paym-n">${m.name}</div><div class="paym-d">${m.desc}</div></div>`).join('');
  const inp=EMP.payMethod==='bank'?`<div class="fld"><label>Account Name</label><input type="text" placeholder="e.g. Accra Business Hub Ltd."/></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;"><div class="fld"><label>Bank</label><select><option>GCB Bank</option><option>Ecobank</option><option>Absa Ghana</option><option>Stanbic Bank</option></select></div><div class="fld"><label>Account Number</label><input type="text" placeholder="0000000000"/></div></div>`:
  `<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.8px;color:var(--mu);text-transform:uppercase;margin-bottom:8px;">${EMP.payMethod==='mtn'?'MTN MoMo Number':EMP.payMethod==='voda'?'Vodafone Cash Number':'AirtelTigo Money Number'}</div><div style="display:flex;gap:8px;"><span class="pfx">+233</span><input type="tel" placeholder="XX XXX XXXX" style="flex:1;padding:8px 10px;border:1.5px solid var(--bd);border-radius:7px;font-size:14px;font-family:'IBM Plex Mono',monospace;background:var(--off);outline:none;"/></div>`;
  return`<div class="ebody"><div class="pay-wrap">
    <div class="ebc"><span class="ebcl" onclick="empGo('confirm')">← Back to Confirm</span></div>
    <div class="paysum"><div><div class="psl">Dispatching</div><div class="psn">${w.name} · ${EMP.days} day${EMP.days>1?'s':''}</div></div><div><div class="psl">Total</div><div class="psa">GH₵ ${total}</div></div></div>
    <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.8px;color:var(--mu);text-transform:uppercase;margin-bottom:10px;">Select Payment Method</div>
    <div class="payms">${ms}</div>
    <div class="pinput">${inp}</div>
    <button class="paybtn" onclick="empGo('success')">Pay GH₵ ${total}</button>
    <p style="text-align:center;font-size:12px;color:var(--mu);margin-top:10px;">Secured by BeyondX · All transactions recorded</p>
  </div></div>`;
}
function renderESuccess(){
  const w=EMP.worker;
  return`<div class="ebody"><div class="esuc">
    <div class="esuc-c">✓</div>
    <div class="esuc-t">Worker Dispatched!</div>
    <p class="esuc-s">Payment confirmed. <strong>${w.name}</strong> has been notified and will check in via GPS at the agreed location. You will receive a confirmation SMS within 30 minutes.</p>
    <div style="background:var(--g0);border:1.5px solid var(--bd);border-radius:12px;padding:16px;max-width:340px;margin:0 auto 24px;text-align:left;">
      <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.8px;color:var(--mu);text-transform:uppercase;margin-bottom:10px;">Dispatch Summary</div>
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px solid var(--bd);"><span style="color:var(--mu);">Worker</span><span style="font-weight:600;color:var(--g9);">${w.name}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px solid var(--bd);"><span style="color:var(--mu);">Duration</span><span style="font-weight:600;color:var(--g9);">${EMP.days} day${EMP.days>1?'s':''}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;"><span style="color:var(--mu);">Reference</span><span style="font-weight:600;color:var(--g9);font-family:'IBM Plex Mono',monospace;font-size:11px;">BX-${Date.now().toString().slice(-6)}</span></div>
    </div>
    <button class="bp" style="padding:12px 28px;" onclick="EMP.view='categories';empGo('categories')">Back to Dashboard</button>
  </div></div>`;
}

// ═══════════════════════════════════
// AUTH & NAVIGATION
// ═══════════════════════════════════
let isEmpLoggedIn=false, loginRedirect=null;

function dismissWelcome(){
  const w=document.getElementById('welcome');
  if(w){w.style.opacity='0';w.style.transition='opacity .4s';setTimeout(()=>w.style.display='none',400);}
}
function switchView(v){
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  const vEl=document.getElementById('view-'+v);
  if(vEl)vEl.classList.add('active');
  document.querySelectorAll('.ntab').forEach(t=>t.classList.toggle('active',t.dataset&&t.dataset.view===v));
  const nav=document.getElementById('mainNav');
  if(nav)nav.style.display=v==='worker'?'none':'flex';
  if(v==='dispatch')renderEmp();
  if(v==='worker')renderWorker();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.getElementById('navTabs').addEventListener('click',function(e){
  const tab=e.target.closest('[data-view]');if(!tab)return;
  if(tab.dataset.view==='dispatch'){if(!isEmpLoggedIn){loginRedirect='dispatch';openEmployerLogin();return;}}
  switchView(tab.dataset.view);
});
function findWorkerGate(){
  if(isEmpLoggedIn)switchView('dispatch');
  else{loginRedirect='dispatch';openEmployerLogin();}
}
function updateFindBtn(){
  const b=document.getElementById('findWorkerBtn');if(!b)return;
  if(isEmpLoggedIn){b.className='hb hb-p';b.textContent='Find a Worker';}
  else{b.className='hb hb-lk';b.textContent='Find a Worker  ·  Login Required';}
}
function openEmployerLogin(r){if(r)loginRedirect=r;document.getElementById('empLoginModal').classList.add('open');}
function closeEmpLogin(){document.getElementById('empLoginModal').classList.remove('open');}
function openWorkerLogin(){document.getElementById('wrkLoginModal').classList.add('open');}
function closeWrkLogin(){document.getElementById('wrkLoginModal').classList.remove('open');}
['empLoginModal','wrkLoginModal','empAckModal','wrkAckModal','stmtModal'].forEach(id=>{
  document.getElementById(id).addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');});
});
function handleEmpLogin(){
  const em=document.getElementById('eEm').value.trim();
  const pw=document.getElementById('ePw').value;
  if(!em||!pw){toast('Please enter your email and password.');return;}
  if(em!=='employer@beyondx.gh'||pw!=='Test1234'){toast('Incorrect credentials. Use the test login shown above.');return;}
  closeEmpLogin();
  document.getElementById('eAck').checked=false;
  document.getElementById('eAckBtn').disabled=true;
  document.getElementById('empAckModal').classList.add('open');
}
function completeEmpLogin(){
  document.getElementById('empAckModal').classList.remove('open');
  isEmpLoggedIn=true;updateFindBtn();
  toast('Welcome back. Loading your dashboard…');
  const d=loginRedirect||'dispatch';loginRedirect=null;
  setTimeout(()=>switchView(d),900);
}
function employerLogout(){isEmpLoggedIn=false;updateFindBtn();switchView('home');toast('You have been logged out.');}
function handleWrkLogin(){
  const id=document.getElementById('wID').value.trim();
  const pin=document.getElementById('wPN').value;
  if(!id||!pin){toast('Please enter your Worker ID and PIN.');return;}
  if(id!=='BX-00142'||pin!=='1234'){toast('Incorrect credentials. Use the test login shown above.');return;}
  closeWrkLogin();
  document.getElementById('wAck').checked=false;
  document.getElementById('wAckBtn').disabled=true;
  document.getElementById('wrkAckModal').classList.add('open');
}
function completeWrkLogin(){
  document.getElementById('wrkAckModal').classList.remove('open');
  toast('Welcome back, Kofi. Loading your dashboard…');
  setTimeout(()=>switchView('worker'),800);
}

// ═══════════════════════════════════
// STATEMENTS & TOAST
// ═══════════════════════════════════
const STMTS={
  employer:{eyebrow:"For Employers",title:"Important Notice Regarding Our Talent Pool",
    body:`<p>All individuals listed on this platform are verified participants in Ghana's national reintegration programme. Prior to listing, each candidate has undergone background screening conducted in partnership with the Ghana Prisons Service.</p><h4>Regarding Criminal History</h4><p>Candidates on this platform have served their sentences in full and are legally recognised as having fulfilled their debt to society. Criminal history is disclosed transparently on each profile. Where an individual has been convicted of a more serious offence, their profile will carry a clearly visible ⚠️ Major Offense Tag so you can make a fully informed decision.</p><h4>What This Means For You As An Employer</h4><ul><li>You are hiring a vetted, work-ready individual who has completed their legal sentence</li><li>All candidates have been assessed as fit for reintegration into the workforce</li><li>Profiles tagged ⚠️ are not automatically disqualified — they are disclosed in the interest of full transparency</li><li>Hiring through this platform may qualify your business for government tax incentives under Ghana's Second Chance Employment Initiative</li><li>All job completions are tracked and recorded through the platform</li></ul><h4>Your Role As An Employer</h4><p>We ask that all employers engage every candidate with fairness and human dignity. A criminal record does not define a person's capacity to work, contribute, and reform. By using this platform, you agree to evaluate candidates based on their skills, conduct, and verified work history — not on judgment alone.</p>`},
  worker:{eyebrow:"For Workers",title:"Welcome. You Belong Here.",
    body:`<p>This platform was built for you — not as a favour, but because your skills, your time, and your willingness to work have value.</p><h4>What You Should Know</h4><p>You have completed your sentence. That chapter is behind you. This platform exists to help you write the next one — through honest work, fair pay, and a community that believes in second chances.</p><h4>Your Rights On This Platform</h4><ul><li>You have the right to fair pay for every completed job</li><li>You have the right to report any employer who treats you with disrespect or unfairness</li><li>No employer on this platform is permitted to harass, exploit, or demean you</li><li>More completed jobs means a stronger profile and access to better opportunities</li></ul><h4>One Thing We Ask Of You</h4><p>Show up. Do the work. Treat every job — no matter how small — as a chance to prove what you are capable of. Your reputation here is yours to build, and no one can take it from you.</p>`}
};
function openStmt(type){
  const s=STMTS[type];
  document.getElementById('smH').innerHTML=`<div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:1.2px;color:var(--g6);text-transform:uppercase;margin-bottom:5px;">${s.eyebrow}</div><div class="mt" style="font-size:15px;">${s.title}</div>`;
  document.getElementById('smB').innerHTML=s.body;
  document.getElementById('stmtModal').classList.add('open');
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}

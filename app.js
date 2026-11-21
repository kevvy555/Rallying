/* Rallying — intentionally dependency-free. Add new systems to CATEGORIES,
   then register procedures under PROCEDURES. Works on GitHub Pages. */
const ROOT = '#/cars/205-gti';
const CATEGORIES = [
  {slug:'brakes',name:'Braking system',symbol:'◎',desc:'Servo, hydraulics, pads, discs and balance',count:1},
  {slug:'engine',name:'Engine & fuel',symbol:'⚡',desc:'Injection, ignition, cooling and emissions',count:1},
  {slug:'drivetrain',name:'Transmission & drivetrain',symbol:'⚙',desc:'Gearbox, differential, shafts and joints',count:3},
  {slug:'suspension',name:'Suspension & steering',symbol:'⌁',desc:'Dampers, alignment, joints and steering',count:0},
  {slug:'electrical',name:'Electrical',symbol:'⌘',desc:'Charging, starting, wiring and instruments',count:1},
  {slug:'chassis',name:'Chassis & safety',symbol:'▣',desc:'Shell, cage, seats, belts and fire equipment',count:0}
];
const PROCEDURES = [
  {slug:'coolant-temperature-sensor-ecu-test',category:'engine',name:'Coolant temperature sensor & ECU wiring test',desc:'Cold and warm sensor resistance test via LE2-Jetronic ECU pins 10 and 13. Cold 3.9 kΩ recorded; warm check outstanding.',duration:'Cold check and follow-up after warm-up',equipment:'Digital multimeter and insulated probes',status:'Cold test recorded; warm test pending'},
  {slug:'brake-servo-vacuum',category:'brakes',name:'Brake servo & vacuum circuit',desc:'Check assistance, vacuum retention, the one-way valve and intake leaks.',duration:'20–40 MIN',equipment:'Vacuum pump recommended',status:'Documented'},
  {slug:'driveshaft-removal-refit',category:'drivetrain',name:'Driveshaft removal & refitting',desc:'Peugeot 205 GTi rally-car driveshaft procedure, including intermediate bearing, seals, torque checks and collar modification.',duration:'Workshop job',equipment:'Axle stands, torque wrenches, 11 mm deep and 16 mm sockets',status:'Documented'},
  {slug:'gearbox-oil-refill',category:'drivetrain',name:'Gearbox oil refill',desc:'Refill using a 17 mm stubby spanner and slim 30 cm funnel, keeping the battery and oil catch can fitted.',duration:'Workshop job',equipment:'17 mm stubby spanner, slim 30 cm funnel, correct gearbox oil',status:'Documented'},
  {slug:'plated-lsd-breakaway-test',category:'drivetrain',name:'Plated LSD breakaway torque test',desc:'In-car static resistance check, recorded 28 Nm result, and bench-test follow-up for the 205 GTi rally car.',duration:'Stationary diagnostic',equipment:'Jack, axle stand, wheel chocks, torque wrench and suitable hub socket',status:'Documented'},
  {slug:'battery-voltage-starting-test',category:'electrical',name:'Battery voltage & starting test',desc:'Record resting and starting voltage, investigate an intermittent single-click no-crank symptom and check alternator charging.',duration:'10–20 MIN',equipment:'Digital multimeter with minimum-voltage function (helpful)',status:'Documented'}
];

const HISTORICAL_TESTS = [
  {id:'coolant-temp-2026-11-21',category:'engine',procedure:'coolant-temperature-sensor-ecu-test',date:'2026-11-21',time:null,outcome:'Cold circuit check consistent; hot test pending',
   results:[['ECU','Bosch LE2-Jetronic, 0 280 000 359'],['Cold blue coolant sensor measured directly','Approximately 3.9–4.0 kΩ'],['Sensor loom continuity','Continuity confirmed from blue sensor wiring connector to ECU plug pin 10'],['Cold resistance measured at ECU wiring plug pins 10 and 13','3.9 kΩ'],['Coolant temperature during cold test','Not recorded'],['Warm ECU plug resistance','Not yet tested']],
   notes:'The ECU-plug reading agrees with the direct sensor reading when cold and is compatible with continuity at the time tested. No warm result has been recorded; the test will be repeated after a drive. This does not prove normal sensor behaviour across temperatures or identify the cause of rich running.'},
  {id:'battery-2026-11-21',category:'electrical',procedure:'battery-voltage-starting-test',date:'2026-11-21',time:null,outcome:'In progress',
   results:[['Battery voltage (engine off)','12.33 V'],['Starting symptom','One click and no cranking on an earlier attempt; engine subsequently started normally'],['Latest starting attempt','Engine started normally at normal cranking speed (21 November 2026; exact time not recorded)'],['Lowest voltage during START','Not yet recorded'],['Alternator charging voltage','Not yet recorded']],
   notes:'Intermittent single-click no-crank fault: a later successful start means the fault is not currently present, but does not rule out low battery charge, high-resistance terminal or engine earth, starter solenoid or starter motor. Battery state of health and charging system remain untested. Rest period before 12.33 V was unknown. If it recurs, record voltage directly across the battery posts during START; inspect and test positive and earth connections before replacing parts.'},
  {id:'lsd-2026-11-21',category:'drivetrain',procedure:'plated-lsd-breakaway-test',date:'2026-11-21',time:null,outcome:'Further investigation',
   results:[['In-car breakaway reading','Approximately 28 Nm (repeated)'],['Owner-reported target','Approximately 95 Nm (not a confirmed factory specification)'],['Bench preload measurement','Not yet recorded']],
   notes:'The in-car check is not a direct bench preload measurement. Identify the differential and bench-test before making a rebuild decision.'}
];

const CAR_PROBLEMS = [
  {
    id:'intermittent-starting-click',category:'electrical',
    title:'Intermittent single-click no-crank',
    opened:'2026-11-21',time:null,status:'Open — intermittent',resolved:null,
    summary:'One starting attempt produced a single click and no cranking. A later attempt cranked at normal speed and the engine started normally.',
    observations:[
      ['Earlier attempt','Engine initially turned over, then just one click and no cranking'],
      ['Later attempt','Engine started normally at normal cranking speed'],
      ['Battery reading','12.33 V with engine off (rest period unknown)']
    ],
    assessment:'Cause unconfirmed. Possibilities include battery state, battery/starter terminals, engine earth, starter solenoid or starter motor. A successful start does not resolve an intermittent fault.',
    actions:[
      'Inspect battery terminal clamps, starter cable and engine earth strap for looseness and corrosion with the engine off.',
      'If it happens again, measure battery-post voltage during a brief key-start attempt and check positive and earth voltage drops.',
      'Check battery charge/health and alternator output, and investigate the starter only once power and earth connections have been checked.'
    ],
    procedure:'battery-voltage-starting-test',
    testCategory:'electrical'
  }
];
const CAR_PROBLEMS_ROOT='/cars/205-gti/car-problems';
const HIST_ROOT='/cars/205-gti/historical-tests';
const historyDate = iso => {const [year,month,day]=iso.split('-');return Number(day)+' '+['January','February','March','April','May','June','July','August','September','October','November','December'][Number(month)-1]+' '+year};

const url = path => `#${path}`;
const pathNow = () => (window.location.hash || '#/home').slice(1).replace(/\/$/,'') || '/home';
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (href,label,cls='') => `<a class="${cls}" href="${url(href)}">${label}</a>`;
const buttonLink = (href,label,primary=false) => link(href,`${label}<span class="arrow" aria-hidden="true">→</span>`,`btn ${primary?'primary':''}`);
const card = (href,kicker,title,desc) => `<a href="${url(href)}" class="wide-card"><span><span class="card-meta">${kicker}</span><h3>${title}</h3><p>${desc}</p></span><span class="arrow" aria-hidden="true">↗</span></a>`;
const header = (eyebrow,title,lead) => `<div class="page-head"><div class="eyebrow">${eyebrow}</div><h1 class="headline">${title}</h1>${lead?`<p class="lead">${lead}</p>`:''}</div>`;
function home(){return `<section class="hero" aria-label="Peugeot 205 rally car photograph"><div class="hero-content"><div class="hero-kicker">A LIFE ON THE STAGES <span aria-hidden="true">—</span> THE PERSONAL ARCHIVE</div><h1 class="headline">THE<br>RALLY<br><em>ARCHIVE.</em></h1><p class="hero-desc">The cars, the events, the mechanical battles and everything learned along the way. One place for the full rallying story.</p><div class="buttons">${buttonLink('/cars/205-gti','Explore the 205 GTi',true)}${buttonLink('/cars/205-gti/testing','Workshop procedures')}</div></div></section><section class="home-lower"><div class="container"><div class="eyebrow">INSIDE THE ARCHIVE</div><h2 class="section-title">MORE THAN JUST THE RESULT.</h2><div class="feature-grid"><a class="feature-card" href="#/cars/205-gti"><span class="number">01 / THE MACHINES</span><h3>Rally cars</h3><p>The cars, their stories and the work that keeps them on stage.</p><span class="mini-arrow" aria-hidden="true">↗</span></a><a class="feature-card" href="#/cars/205-gti/testing"><span class="number">02 / THE WORKSHOP</span><h3>Testing & setup</h3><p>Repeatable diagnostic procedures organised by vehicle system.</p><span class="mini-arrow" aria-hidden="true">↗</span></a><a class="feature-card" href="#/cars/205-gti/events"><span class="number">03 / THE STAGES</span><h3>Events</h3><p>A home for results, routes, photographs and event reports.</p><span class="mini-arrow" aria-hidden="true">↗</span></a></div></div></section>`}
function cars(){return `<div class="container">${header('THE GARAGE / RALLY CARS','THE <em>GARAGE.</em>','Every car has a story. Start with the Peugeot 205 GTi and grow this archive as the collection evolves.')}<div class="car-feature"><img src="assets/peugeot-205-rally.webp" alt="Black number 64 Peugeot 205 rally car on a trailer" loading="lazy"><div class="car-feature-content"><span class="pill">RALLY CAR 001</span><h2 class="section-title">PEUGEOT<br>205 GTi 1.9</h2><p>History, event memories, mechanical work and repeatable workshop tests, all together in one car record.</p>${buttonLink('/cars/205-gti','Open car record',true)}</div></div></div>`}
function carOverview(){return `<div class="container">${header('THE GARAGE / CAR 001','PEUGEOT <em>205 GTi.</em>','The hub for the 1.9 GTi rally car — its story, event archive and the procedures used to keep it working.')}<div class="car-feature"><img src="assets/peugeot-205-rally.webp" alt="Black number 64 Peugeot 205 GTi rally car on a trailer"><div class="car-feature-content"><span class="pill">CAR 001 / NUMBER 64</span><h2 class="section-title">BUILT FOR<br>THE STAGES.</h2><p>Everything about this car, from its history to the smallest workshop check.</p></div></div><div class="info-grid"><div class="info-item"><small>Make / model</small><strong>Peugeot 205 GTi</strong></div><div class="info-item"><small>Engine</small><strong>1.9 litre</strong></div><div class="info-item"><small>Gearbox</small><strong>BE3</strong></div></div><div class="card-list">${card('/cars/205-gti/history','01 / THE STORY','Car history','Ownership, modifications and notable mechanical milestones.')}${card('/cars/205-gti/testing','02 / THE WORKSHOP','Testing & procedures','Diagnostics organised by braking, engine, drivetrain and other systems.')}${card('/cars/205-gti/historical-tests','03 / THE LOGBOOK','Historical Tests','Dated records of car tests, results and outcomes by vehicle system.')}${card('/cars/205-gti/car-problems','04 / FAULT LOG','Car Problems','Open faults, symptoms, diagnostic progress, repairs and resolutions.')}${card('/cars/205-gti/tools','05 / SPECIALIST TOOLS','Specialist tools','Custom workshop aids and 3D-print specifications.')}${card('/cars/205-gti/events','06 / THE COMPETITION','Event log','A place to record every rally, result and event report.')}</div></div>`}
function history(){return `<div class="container">${link('/cars/205-gti','← Back to the 205 GTi','back-link')}${header('PEUGEOT 205 GTi / HISTORY','THE CAR <em>STORY.</em>','A growing record of the 205: what has changed, what has broken and what has been learned.')}<div class="timeline"><div class="timeline-item"><div class="card-meta">CAR SPECIFICATION</div><h3>Peugeot 205 GTi 1.9</h3><p>Rally-prepared 205 GTi, pictured carrying competition number 64. BE3 gearbox fitted.</p></div><div class="timeline-item"><div class="card-meta">DRIVETRAIN NOTES</div><h3>Limited-slip differential</h3><p>A Gripper-type LSD is suspected, but the exact unit, ramp angles and preload have not yet been verified.</p></div><div class="timeline-item"><div class="card-meta">REPAIR HISTORY</div><h3>Driveshaft failures</h3><p>Both sides have suffered driveshaft failures on separate events. The driver-side shaft snapped at the splined portion near the inner CV joint. Exact dates and repair details can be added later.</p></div></div><p class="muted-note">Entries without dates are workshop notes, not a complete chronological history.</p></div>`}
function testing(){return `<div class="container">${link('/cars/205-gti','← Back to the 205 GTi','back-link')}${header('PEUGEOT 205 GTi / WORKSHOP','TESTING <em>LIBRARY.</em>','A structured home for practical checks, fault-finding and setup notes. Choose the car system first, then the specific procedure.')}<div class="eyebrow">CHOOSE A SYSTEM</div><div class="category-grid">${CATEGORIES.map(c=>`<a class="category-card" href="${url('/cars/205-gti/testing/'+c.slug)}"><span class="category-icon" aria-hidden="true">${c.symbol}</span><span><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></span><span class="card-arrow" aria-hidden="true">↗</span></a>`).join('')}</div><h2 class="subhead">Recently documented</h2><div class="card-list">${card('/cars/205-gti/testing/brakes/brake-servo-vacuum','BRAKING SYSTEM / PROCEDURE 001','Brake servo & vacuum circuit','Pedal checks, one-way valve testing and inlet manifold leak isolation.')}${card('/cars/205-gti/testing/electrical/battery-voltage-starting-test','ELECTRICAL / PROCEDURE 001','Battery voltage & starting test','12.33 V recorded and a single-click starting fault to diagnose.')}</div></div>`}
function categoryPage(cat){const procedures=PROCEDURES.filter(p=>p.category===cat.slug);return `<div class="container">${link('/cars/205-gti/testing','← All testing categories','back-link')}${header('WORKSHOP / '+esc(cat.name),esc(cat.name).toUpperCase().replace(' SYSTEM',' <em>SYSTEM.</em>'),esc(cat.desc))}<div class="eyebrow">${procedures.length} DOCUMENTED ${procedures.length===1?'PROCEDURE':'PROCEDURES'}</div>${procedures.length?`<div class="card-list">${procedures.map(p=>card(`/cars/205-gti/testing/${p.category}/${p.slug}`,`${p.status.toUpperCase()} / ${p.duration}`,esc(p.name),esc(p.desc))).join('')}</div>`:`<div class="empty-panel"><h2>Ready for the next procedure.</h2><p>This system has its own section. Add the first diagnostic or setup procedure here when it is ready.</p>${buttonLink('/cars/205-gti/testing','Back to all systems')}</div>`}</div>`}

function historicalTests(){
  return `<div class="container">${link('/cars/205-gti','← Back to the 205 GTi','back-link')}
    ${header('PEUGEOT 205 GTi / WORKSHOP LOG','HISTORICAL <em>TESTS.</em>','Dated results of actual tests on the car, organised into the same six categories as Testing &amp; Procedures.')}
    <div class="eyebrow">CHOOSE A VEHICLE SYSTEM</div>
    <div class="category-grid">${CATEGORIES.map(c=>`<a class="category-card" href="${url(HIST_ROOT+'/'+c.slug)}"><span class="category-icon" aria-hidden="true">${c.symbol}</span><span><h3>${esc(c.name)}</h3><p>${HISTORICAL_TESTS.filter(t=>t.category===c.slug).length} recorded test(s) · ${esc(c.desc)}</p></span><span class="card-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
    <h2 class="subhead">Recently recorded</h2>
    <div class="card-list">${[...HISTORICAL_TESTS].sort((a,b)=>b.date.localeCompare(a.date)).map(t=>{const p=PROCEDURES.find(p=>p.category===t.category&&p.slug===t.procedure);return card(HIST_ROOT+'/'+t.category,historyDate(t.date)+' / '+esc(t.outcome.toUpperCase()),esc(p?p.name:t.id),esc(t.results[0][1]));}).join('')}</div>
    <p class="muted-note">Unknown test times are shown as not recorded; unconfirmed diagnoses are not marked as failures.</p>
  </div>`;
}
function historicalCategory(c){
  const tests=HISTORICAL_TESTS.filter(t=>t.category===c.slug).sort((a,b)=>b.date.localeCompare(a.date));
  return `<div class="container">${link(HIST_ROOT,'← All historical tests','back-link')}
    ${header('HISTORICAL TESTS / '+esc(c.name),esc(c.name).toUpperCase(),'Individual test sessions, with date and time, procedure reference, readings and outcome.')}
    ${tests.length?tests.map(t=>{const p=PROCEDURES.find(p=>p.slug===t.procedure&&p.category===t.category);return `<div class="procedure-heading"><div class="procedure-header"><div class="eyebrow">${historyDate(t.date)} / ${t.time?esc(t.time):'TIME NOT RECORDED'}</div><span class="pill">${esc(t.outcome)}</span></div><h1>${esc(p?p.name:t.id)}</h1><div class="tag-row"><span class="tag">DATE: ${historyDate(t.date)}</span><span class="tag">TIME: ${t.time?esc(t.time):'Not recorded'}</span><span class="tag">OUTCOME: ${esc(t.outcome)}</span></div>
      <p><strong>Procedure:</strong> ${p?link('/cars/205-gti/testing/'+t.category+'/'+p.slug,esc(p.name)):'Not linked'}</p></div>
      <section class="procedure-section"><h2>Recorded results</h2><table class="results-table"><thead><tr><th>Check</th><th>Result</th></tr></thead><tbody>${t.results.map(([check,value])=>`<tr><td>${esc(check)}</td><td>${esc(value)}</td></tr>`).join('')}</tbody></table><p><strong>Assessment:</strong> ${esc(t.notes)}</p></section><div class="card-meta">TEST RECORD / ${esc(t.id)}</div><hr style="border:0;border-top:1px solid var(--line);margin:34px 0">`}).join(''):`<div class="empty-panel"><h2>No tests recorded yet</h2><p>Results will be listed here when this system is tested.</p></div>`}
    <p class="muted-note">See ${link('/cars/205-gti/testing/'+c.slug,'the matching Testing &amp; Procedures category')} for how to perform these checks.</p>
  </div>`;
}


function carProblems(){
  return `<div class="container">
    ${link('/cars/205-gti','← Back to the 205 GTi','back-link')}
    ${header('PEUGEOT 205 GTi / FAULT LOG','CAR <em>PROBLEMS.</em>','Track symptoms, investigations and repairs separately from test procedures and historical results.')}
    <div class="eyebrow">CHOOSE A SYSTEM — SAME CATEGORIES AS TESTING &amp; PROCEDURES</div>
    <div class="category-grid">${CATEGORIES.map(c=>`<a class="category-card" href="${url(CAR_PROBLEMS_ROOT+'/'+c.slug)}"><span class="category-icon" aria-hidden="true">${c.symbol}</span><span><h3>${esc(c.name)}</h3><p>${CAR_PROBLEMS.filter(p=>p.category===c.slug).length} recorded problem(s) · ${esc(c.desc)}</p></span><span class="card-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
    <h2 class="subhead">Current problems</h2>
    <div class="card-list">${CAR_PROBLEMS.filter(p=>!p.resolved).map(p=>card(CAR_PROBLEMS_ROOT+'/'+p.category+'/'+p.id,historyDate(p.opened)+' / '+esc(p.status.toUpperCase()),esc(p.title),esc(p.summary))).join('')}</div>
    <p class="muted-note">A problem stays open until its cause and resolution have been established. Successful operation on one attempt does not resolve an intermittent fault.</p>
  </div>`;
}
function carProblemCategory(c){
 const ps=CAR_PROBLEMS.filter(p=>p.category===c.slug).sort((a,b)=>b.opened.localeCompare(a.opened));
 return `<div class="container">
  ${link(CAR_PROBLEMS_ROOT,'← All problem categories','back-link')}
  ${header('CAR PROBLEMS / '+esc(c.name),esc(c.name).toUpperCase(),'Fault reports, their diagnostic status and eventual repairs.')}
  <div class="eyebrow">${ps.length} RECORDED ${ps.length===1?'PROBLEM':'PROBLEMS'}</div>
  ${ps.length?`<div class="card-list">${ps.map(p=>card(CAR_PROBLEMS_ROOT+'/'+c.slug+'/'+p.id,historyDate(p.opened)+' / '+esc(p.status.toUpperCase()),esc(p.title),esc(p.summary))).join('')}</div>`:`<div class="empty-panel"><h2>No problems recorded</h2><p>This section is ready when a fault is reported.</p></div>`}
  <p class="muted-note">See the related ${link(HIST_ROOT+'/'+c.slug,'Historical Tests')} and ${link('/cars/205-gti/testing/'+c.slug,'Testing &amp; Procedures')}.</p>
 </div>`;
}
function carProblemDetail(p){
 const c=CATEGORIES.find(c=>c.slug===p.category);
 const test=PROCEDURES.find(x=>x.category===p.category&&x.slug===p.procedure);
 return `<div class="container">
  ${link(CAR_PROBLEMS_ROOT+'/'+p.category,'← '+esc(c.name)+' problems','back-link')}
  <div class="procedure-heading"><div class="procedure-header"><div class="eyebrow">CAR PROBLEMS / ${esc(c.name)} / ${historyDate(p.opened)}</div><span class="pill">${esc(p.status)}</span></div>
    <h1>${esc(p.title)}</h1><p>${esc(p.summary)}</p>
    <div class="tag-row"><span class="tag">Reported ${historyDate(p.opened)}</span><span class="tag">Time: ${p.time?esc(p.time):'Not recorded'}</span><span class="tag">${esc(p.status)}</span></div>
  </div>
  <div class="procedure-layout"><article>
    <section class="procedure-section" id="observations"><h2>01 / Observations</h2><table class="results-table"><thead><tr><th>Test / symptom</th><th>Finding</th></tr></thead><tbody>${p.observations.map(([label,value])=>`<tr><td>${esc(label)}</td><td>${esc(value)}</td></tr>`).join('')}</tbody></table></section>
    <section class="procedure-section" id="assessment"><h2>02 / Current diagnosis</h2><p>${esc(p.assessment)}</p></section>
    <section class="procedure-section" id="actions"><h2>03 / Next checks</h2><ol class="step-list">${p.actions.map(a=>`<li>${esc(a)}</li>`).join('')}</ol></section>
    <section class="procedure-section" id="related"><h2>04 / Linked records</h2>
      <p><strong>Testing procedure:</strong> ${test?link('/cars/205-gti/testing/'+p.category+'/'+p.procedure,esc(test.name)):'Not linked'}</p>
      <p><strong>Historical test log:</strong> ${link(HIST_ROOT+'/'+p.testCategory,'View test results for '+esc(c.name))}</p></section>
    <section class="procedure-section" id="resolution"><h2>05 / Repair &amp; resolution</h2>
      <p>${p.resolved?'Resolved '+historyDate(p.resolved):'<strong>Open:</strong> Cause and repair not yet confirmed. No resolution date recorded.'}</p></section>
   </article><aside class="aside-box"><h3>On this page</h3>
    <a href="#observations" data-anchor="observations">Observations</a>
    <a href="#assessment" data-anchor="assessment">Diagnosis</a>
    <a href="#actions" data-anchor="actions">Next checks</a>
    <a href="#related" data-anchor="related">Linked tests</a>
    <a href="#resolution" data-anchor="resolution">Resolution</a>
    <p class="fine">Unconfirmed possible causes are not recorded as established defects.</p></aside></div></div>`;
}

function specialistTools(){
  return `<div class="container">
    ${link('/cars/205-gti','← Peugeot 205 GTi','back-link')}
    ${header('PEUGEOT 205 GTi / WORKSHOP','SPECIALIST <em>TOOLS.</em>','Custom tools and 3D-printable workshop aids for this rally car. Dimensions are recorded as supplied; draft designs are not yet validated for manufacture.')}
    <div class="card-list">
      ${card('/cars/205-gti/tools/gearbox-refill-funnel','3D PRINT DESIGN / DIMENSIONS IN PROGRESS','Gearbox oil refill funnel','Custom slim funnel for oil refilling with the battery and oil catch can left fitted.')}
    </div>
  </div>`;
}

function gearboxFunnelTool(){
  return `<div class="container">
    <div class="procedure-heading">
      ${link('/cars/205-gti/tools','← Specialist tools','back-link')}
      <div class="procedure-header"><div class="eyebrow">PEUGEOT 205 GTi 1.9 / SPECIALIST TOOLS / 001</div><span class="pill">DESIGN DIMENSIONS</span></div>
      <h1>GEARBOX REFILL <span style="color:var(--accent)">FUNNEL</span></h1>
      <p>3D-print design brief for a slim oil funnel that can be used without removing the battery or oil catch can. Measurements below are the owner's stated design requirements, not a finished model.</p>
      <div class="tag-row"><span class="tag">Custom 3D-print tool</span><span class="tag">Dimension review needed</span></div>
    </div>
    <div class="procedure-layout"><article>
      <section class="procedure-section" id="dimensions"><h2>01 / Recorded measurements</h2>
        <table class="results-table"><thead><tr><th>Feature</th><th>Required dimension</th></tr></thead><tbody>
          <tr><td>Main long filler tube</td><td><strong>230 mm length</strong>, including the final 20 mm straight tip</td></tr>
          <tr><td>Upper wide funnel</td><td><strong>80 mm height</strong></td></tr>
          <tr><td>Upper funnel opening</td><td><strong>100 mm width</strong> at the top (assumed circular only for illustration; not confirmed)</td></tr>
          <tr><td>Lower insertion tip</td><td><strong>20 mm outside diameter</strong></td></tr>
          <tr><td>Straight tip insertion section</td><td><strong>20 mm length</strong>, included in the 230 mm tube</td></tr>
          <tr><td>Section above straight tip</td><td><strong>30 mm</strong> above the 20 mm straight tip, joining <strong>directly to the bottom of the wide upper funnel</strong> (owner confirmed); this placement still needs reconciliation with the stated 230 mm tube length</td></tr>
        </tbody></table>
      </section>
      <section class="procedure-section" id="unresolved"><h2>02 / Before modelling or printing</h2>
        <p><strong>Geometry to reconcile:</strong> the owner confirmed that the 30 mm section immediately above the 20 mm straight tip connects directly to the wide funnel. Those two consecutive sections account for only 50 mm below the funnel, whereas the main filler tube was specified as 230 mm including the tip. The location or interpretation of the remaining 180 mm is unresolved; do not shorten the 230 mm requirement or generate a print-ready model until this is clarified.</p>
        <p><strong>Still unspecified:</strong> wall thickness, tube internal bore, upper funnel taper/profile, print material, and actual gearbox opening clearance. The stated 20 mm measurement is the <strong>outside diameter</strong> of the insertion tip. Choose oil-compatible materials and confirm the printed part fits without forcing before use.</p>
      </section>
      <section class="procedure-section" id="use"><h2>03 / Related workshop procedure</h2>
        <p>See the ${link('/cars/205-gti/testing/drivetrain/gearbox-oil-refill','gearbox oil refill procedure')} for use of the 17 mm stubby spanner and funnel with the battery and oil catch can left fitted.</p>
      </section>
    </article><aside class="aside-box"><h3>On this page</h3>
      <a href="#dimensions" data-anchor="dimensions">Dimensions</a>
      <a href="#unresolved" data-anchor="unresolved">Design details to confirm</a>
      <a href="#use" data-anchor="use">Related procedure</a>
      <p class="fine">Design specification only. No validated CAD or STL has been produced.</p>
    </aside></div>
  </div>`;
}

function events(){return `<div class="container">${link('/cars/205-gti','← Back to the 205 GTi','back-link')}${header('PEUGEOT 205 GTi / COMPETITION','EVENT <em>LOG.</em>','Every entry, every stage and every lesson — this is where event-by-event reports will live.')}<div class="empty-panel"><div class="eyebrow">THE LOGBOOK STARTS HERE</div><h2>Event reports to follow.</h2><p>No dates, results or event names have been entered yet. This page is ready for future rally reports, photographs, surfaces, results and mechanical notes.</p>${buttonLink('/cars/205-gti','Return to the 205')}</div></div>`}
function servo(){return `<div class="container"><div class="procedure-heading">${link('/cars/205-gti/testing/brakes','← Braking system procedures','back-link')}<div class="procedure-header"><div class="eyebrow">PEUGEOT 205 GTi 1.9 / BRAKING SYSTEM / 001</div><span class="pill">WORKSHOP GUIDE</span></div><h1>BRAKE SERVO & <span style="color:var(--accent)">VACUUM CIRCUIT</span></h1><p>Check whether the brake servo provides assistance, holds vacuum and introduces unwanted air into the inlet manifold. Covers the servo-mounted non-return valve, hose and sealing grommet.</p><div class="tag-row"><span class="tag">Approx. 20–40 min</span><span class="tag">Stationary testing only</span><span class="tag">Hand vacuum pump recommended</span></div></div><div class="callout"><strong>Safety first.</strong> Park on level ground, gearbox in neutral, handbrake applied and wheels chocked. Never drive with the servo disconnected, the manifold blanked or uncertain brake assistance. If the brake pedal feels unsafe, stop and investigate before road use.</div><div class="procedure-layout"><article><section class="procedure-section" id="understand"><h2>01 / What you are testing</h2><p>The inlet manifold creates vacuum in the servo through a hose and a one-way (non-return) valve. On many 205s this valve is part of the fitting pushed into a rubber grommet in the servo housing, not a separate in-line component.</p><p>A servo can still provide some assistance while leaking vacuum. Test both assistance and airtightness.</p></section><section class="procedure-section" id="assist"><h2>02 / Assistance test</h2><ol class="step-list"><li>Switch the engine off.</li><li>Press and release the brake pedal five or six times to exhaust any stored vacuum. The pedal should become firm.</li><li>Hold steady foot pressure on the brake pedal.</li><li>Start the engine while continuing to hold the pedal.</li></ol><div class="result"><strong>Pass:</strong> Pedal moves down slightly as assistance becomes available.</div><div class="fail"><strong>Investigate:</strong> No movement could mean insufficient vacuum, a blocked/disconnected line, a failed check valve or a servo fault.</div></section><section class="procedure-section" id="retention"><h2>03 / Vacuum retention</h2><ol class="step-list"><li>Run the engine at idle for about a minute.</li><li>Apply steady foot pressure to the brake pedal.</li><li>Keep pressure applied and switch the engine off.</li><li>Hold the pedal for about 30 seconds and observe its position.</li></ol><div class="result"><strong>Pass:</strong> The pedal remains approximately steady.</div><div class="fail"><strong>Investigate:</strong> A pedal rising against your foot can indicate lost vacuum assistance. A pedal sinking towards the floor may indicate a hydraulic fault such as master-cylinder internal leakage; do not assume every change is a servo problem.</div><p><strong>Reserve check:</strong> Run the engine for a minute, switch it off without pressing the brake, then make several brake applications. The first application(s) should have some assistance; the pedal becomes firmer as the reserve is exhausted.</p></section><section class="procedure-section" id="valve"><h2>04 / Non-return valve: direction test</h2><p>First identify the valve at the servo end of the vacuum line. A plastic elbow seated in a rubber grommet can contain the valve, even if no separate valve is visible along the hose.</p><ol class="step-list"><li>Engine off: pump the brake pedal repeatedly until the stored vacuum is gone.</li><li>Carefully remove the servo valve and connected hose for bench testing, supporting the brittle plastic and checking the grommet for damage. Note its original orientation.</li><li>Using a clean hand-operated pump or airflow tester, check air passage <strong>from the servo end towards the manifold end</strong>.</li><li>Reverse the test: air <strong>from the manifold end towards the servo end</strong> should be blocked.</li><li>Inspect hose ends, any clamps, the rubber grommet and the elbow for cracks, distortion or loose fit.</li></ol><table class="results-table"><thead><tr><th>Result</th><th>Interpretation</th></tr></thead><tbody><tr><td>Air passes servo → manifold, but not reverse</td><td>Valve passes basic directional test</td></tr><tr><td>Air passes both ways</td><td>Valve is leaking / not sealing</td></tr><tr><td>Air passes neither way</td><td>Valve may be obstructed</td></tr><tr><td>Valve direction correct, vacuum still lost</td><td>Check hose, grommet and servo for leaks</td></tr></tbody></table><p class="muted-note">A directional test does not prove that a valve or its surrounding fittings are completely airtight under vacuum.</p></section><section class="procedure-section" id="isolate"><h2>05 / Test for an intake manifold air leak</h2><ol class="step-list"><li>With the system connected, warm the engine and note idle speed and smoothness.</li><li>Switch the engine off.</li><li>Disconnect the servo vacuum hose <strong>at the inlet manifold</strong>, and securely blank the manifold take-off using a vacuum-rated cap.</li><li>With the car stationary, restart the engine and compare its idle with the earlier observation.</li><li>Switch off, remove the cap, securely reconnect the hose and verify brake assistance before using the car.</li></ol><div class="result"><strong>Finding:</strong> A significant change in idle with the servo circuit isolated suggests an air leak somewhere in that circuit, but does not identify which component.</div><p>With everything reconnected, also note whether pressing and holding the brake changes the idle substantially or produces sustained hissing. A brief change in engine note during a brake application can be normal.</p></section><section class="procedure-section" id="pump"><h2>06 / Vacuum pump and internal servo check</h2><ol class="step-list"><li>Use a hand-operated vacuum pump with a gauge and an airtight adapter appropriate for the servo vacuum port.</li><li>With the engine off and vacuum exhausted, test the hose and valve assembly independently for leakage.</li><li>Carefully remove the check valve, connect the vacuum pump directly to the servo port and draw a moderate vacuum within the pump/servo test equipment's safe range.</li><li>Observe whether the vacuum remains steady over several minutes. Check the adapter for leakage before condemning the servo.</li><li>Repeat observations as appropriate with the pedal held under steady pressure, remembering the servo control valve intentionally admits air during pedal movement.</li></ol><div class="result"><strong>Pass:</strong> Vacuum is retained in the static test, without unexpected air loss.</div><div class="fail"><strong>Investigate:</strong> Vacuum decays with a confirmed airtight adapter: suspect an internal seal, diaphragm or servo casing. A leak occurring only when operated may involve the servo control mechanism.</div></section><section class="procedure-section" id="other"><h2>07 / Additional checks</h2><p>Inspect the servo housing for damage or corrosion and look for brake fluid between the master cylinder and servo. Fluid entering the booster may indicate a failed master-cylinder rear seal.</p><p>A servo leak is a possible source of unmetered intake air on the 205's airflow-metered injection system. By itself, such a leak generally tends to lean the mixture, so it is <strong>not a convincing primary explanation for very high CO emissions</strong>. Diagnose the fuel and injection system separately if CO remains high.</p><div class="callout"><strong>Final check:</strong> Refit the valve in its original direction, securely seat the grommet and hose, then repeat the pedal assistance test. Any unexplained loss of assistance or suspect brake hydraulics requires repair before driving.</div></section></article><aside class="aside-box"><h3>On this page</h3><a href="#understand" data-anchor="understand">What you're testing</a><a href="#assist" data-anchor="assist">Assistance test</a><a href="#retention" data-anchor="retention">Vacuum retention</a><a href="#valve" data-anchor="valve">Non-return valve</a><a href="#isolate" data-anchor="isolate">Intake leak isolation</a><a href="#pump" data-anchor="pump">Vacuum pump testing</a><a href="#other" data-anchor="other">Additional checks</a><p class="fine">Diagnostic guide for a stationary vehicle. Check service information for the fitted servo and braking components before repair.</p></aside></div></div>`}

function driveshaft(){
  return `<div class="container">
    <div class="procedure-heading">
      ${link('/cars/205-gti/testing/drivetrain','← Transmission & drivetrain','back-link')}
      <div class="procedure-header"><div class="eyebrow">PEUGEOT 205 GTi 1.9 / DRIVETRAIN / 001</div><span class="pill">WORKSHOP LOG</span></div>
      <h1>DRIVESHAFT <span style="color:var(--accent)">REMOVAL & REFITTING</span></h1>
      <p>Workshop sequence recorded during a replacement driveshaft job on the rally-prepared Peugeot 205 GTi. Covers both sides, with the extra intermediate-bearing operations on the driver's (right-hand/offside) shaft.</p>
      <div class="tag-row"><span class="tag">Peugeot 205 GTi 1.9</span><span class="tag">Rally-car notes</span><span class="tag">Drivetrain</span></div>
    </div>
    <div class="callout"><strong>Safety & applicability.</strong> Park on level ground, chock wheels and use correctly positioned axle stands — never rely on a jack alone. Disconnect or support components without loading brake hoses or CV joints. Torque values below apply to standard manual-transmission GTi hardware; confirm modified rally components against their manufacturer's specifications. Do not drive until all safety-critical fasteners and hub-nut locking are confirmed.</div>
    <div class="procedure-layout"><article>
      <section class="procedure-section" id="tools"><h2>01 / Equipment &amp; parts</h2>
        <p>Jack and axle stands; wheel chocks; hub-nut socket and high-range torque wrench; <strong>16 mm socket</strong> for both the lower ball-joint pinch bolt and track-rod end nut; <strong>11 mm long-reach socket</strong> for the two intermediate-bearing retainer nuts; ball-joint separator; suitable clamp-slot spreading tool; <strong>hammer and punch</strong> for staking the hub nut (where fitted); <strong>17 mm stubby spanner</strong> for the plastic gearbox oil filler plug on this car; <strong>welding equipment and appropriate welding PPE/heat and spatter shielding</strong> for the rally-specific intermediate-bearing collar modification only; clean drain tray; replacement driveshaft; <strong>new gearbox oil seal and new hub nut</strong>; correct gearbox oil; a small quantity of moly grease for the hub splines.</p>
        <p class="muted-note">Record the exact shaft and nut design fitted, especially on modified rally cars. Replace any damaged fasteners or seals rather than reusing them.</p>
      </section>
      <section class="procedure-section" id="remove"><h2>02 / Removal</h2>
        <ol class="step-list">
          <li>With the car safely stationary on the ground, release the hub-nut lock (stake or locking collar/R-clip as fitted). Slacken the hub nut and wheel bolts. Use a suitable hub reaction method; do not rely on the brake disc retaining screws to resist hub-nut torque.</li>
          <li>Chock and raise the car, support securely on <strong>axle stands</strong>, then remove the wheel and hub nut.</li>
          <li>Undo the lower ball-joint pinch-bolt nut (<strong>16 mm</strong>) and remove the pinch bolt completely. Split the lower joint from the hub carrier. If needed, gently spread the carrier's clamp slot and move the lower arm down; avoid levering against the rubber boot or damaging the carrier.</li>
          <li>Remove the track-rod end retaining nut (<strong>16 mm</strong>) and separate the tapered joint from the steering arm, using a proper splitter if necessary.</li>
          <li><strong>Driver's/offside only:</strong> Loosen the two <strong>11 mm</strong> intermediate-bearing retaining nuts and rotate the retaining bolt heads clear of the bearing. Support the shaft so the CV joint is not pulled apart.</li>
          <li>Put a clean drain tray beneath the gearbox outlet to catch any escaping oil. Withdraw the driveshaft carefully, supporting the shaft and keeping it clear of the gearbox seal and its running surface.</li>
        </ol>
        <p class="muted-note"><strong>Workshop observation:</strong> Approximately <strong>250 mL of gearbox oil</strong> was lost when the driveshaft was removed on this car. The quantity can vary with the oil level and vehicle angle; catch the oil and check/top up the gearbox to the specified level during refitting rather than assuming a fixed loss.</p>
      </section>
      <section class="procedure-section" id="prepare"><h2>03 / Replacement-shaft preparation</h2>
        <ol class="step-list">
          <li>Compare the old and new shafts: overall length, gearbox and hub spline types, CV joints, seals and — on the driver's side — intermediate-bearing position.</li>
          <li>Inspect the shaft's seal-running surface and bearing; ensure there are no burrs, grit or weld deposits.</li>
          <li><strong>Rally-specific collar modification (not a standard Peugeot step):</strong> this car's replacement shaft had a retaining collar secured with a weld immediately behind the intermediate bearing. The workshop notes record masking the bearing and covering the smooth differential-end shaft surface to keep weld spatter off them.</li>
        </ol>
        <div class="callout"><strong>Welding warning:</strong> masking tape protects only against some surface debris, <strong>not welding heat or spatter</strong>. A bearing, seal or hardened shaft can be damaged by welding. Have any such modification assessed and performed by a competent specialist to a proven design, with proper heat/spatter shielding and post-weld inspection. Do not generalise this step to a standard replacement shaft.</div>
        <p class="muted-note">Workshop photos taken during the collar preparation are recorded in the conversation log; they are not yet stored as website assets.</p>
      </section>
      <section class="procedure-section" id="refit"><h2>04 / Refitting</h2>
        <ol class="step-list">
          <li>Clean the gearbox seal housing. Install a <strong>new gearbox oil seal</strong> squarely at its correct depth and lightly lubricate the lip with gearbox oil.</li>
          <li>Apply a light film of gearbox oil to the inner differential-end splines, align the shaft and slide it into the gearbox without forcing or nicking the seal. Support the CV joints.</li>
          <li><strong>Driver's/offside only:</strong> seat the intermediate bearing fully in its support. Turn both retaining bolt heads into their retaining position and tighten the <strong>11 mm nuts with a long-reach socket</strong>. The recorded torque for standard fixings was <strong>18 Nm</strong>; another community reference gives 20 Nm, so verify the specification for the actual retainers fitted.</li>
          <li>Apply a <strong>thin smear of molybdenum disulphide (moly) grease</strong> to either the driveshaft's outer hub splines or the mating splines inside the wheel hub, then guide the shaft into the hub. Keep hub-nut threads and seating surfaces clean and dry unless the supplied hardware specifies otherwise.</li>
          <li>Fully seat the <strong>lower ball joint</strong> in the carrier. Install its pinch bolt correctly and <strong>torque the 16 mm fixing to 35 Nm</strong>. Do this now, not as an unspecified later step.</li>
          <li>Reconnect the <strong>track-rod end</strong>, fully seat its taper and <strong>torque the 16 mm nut to 35 Nm</strong>. Check the joint is secure.</li>
          <li>Fit a <strong>new hub nut</strong> and start by hand. Refit the wheel and snug the wheel bolts, but do not apply their final torque yet.</li>
          <li>With the vehicle lowered and the hub safely restrained, <strong>torque the standard GTi hub nut to 260 Nm</strong>. Lock it using the design actually fitted: <strong>stake/peen the new nut flange into the shaft groove</strong>, or <strong>install the locking collar and R-clip</strong>. Do not mix locking methods.</li>
          <li>Check or refill the gearbox with the specified oil to the correct level, following the dedicated ${link('/cars/205-gti/testing/drivetrain/gearbox-oil-refill','gearbox oil refill procedure')}. Inspect the gearbox seal for leaks.</li>
          <li><strong>Torque the wheel bolts</strong>. The Haynes figure for standard Peugeot 205 wheel bolts is <strong>85 Nm</strong>; verify any aftermarket rally wheel, bolt or stud hardware separately.</li>
        </ol>
      </section>
      <section class="procedure-section" id="check"><h2>05 / Final checks</h2>
        <p>Confirm the bottom joint and steering joint are fully seated and torqued, both intermediate retainers capture the bearing (if fitted), the hub nut is correctly locked, the wheel fixings are torqued, the brake hose and CV boots are clear, the gearbox oil is correct, and there are no leaks. Check steering operation and front toe/alignment after disturbing steering components. Inspect again after a short, cautious test according to your rally-car maintenance practice.</p>
      </section>
      <section class="procedure-section" id="torque"><h2>06 / Torque and tool reference</h2>
        <table class="results-table"><thead><tr><th>Fixing</th><th>Specification</th></tr></thead><tbody>
          <tr><td>Lower ball-joint pinch bolt</td><td><strong>35 Nm</strong> · 16 mm socket</td></tr>
          <tr><td>Track-rod end nut</td><td><strong>35 Nm</strong> · 16 mm socket</td></tr>
          <tr><td>Intermediate bearing retaining nuts (offside)</td><td><strong>18 Nm recorded</strong> · 11 mm long-reach socket · verify fitted hardware</td></tr>
          <tr><td>Driveshaft/hub nut (standard GTi)</td><td><strong>260 Nm</strong> · new nut · stake or locking collar/R-clip</td></tr>
          <tr><td>Roadwheel bolts (standard type)</td><td><strong>85 Nm</strong> · verify modified wheel hardware</td></tr>
        </tbody></table>
        <p class="muted-note">References: <a href="https://www.peugeot205.pl/pdf/p205haynes.pdf" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Haynes Peugeot 205 workshop manual</a>, Chapter 10, p. 10•2 (hub nut, ball joint, track rod, wheel bolts); <a href="https://www.205gtidrivers.com/forums/topic/89729-torque-wrench-settings-for-suspension/" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">205GTIDrivers torque discussion</a> (intermediate retainer). Values reflect standard vehicle components unless noted.</p>
      </section>
    </article><aside class="aside-box"><h3>On this page</h3>
      <a href="#tools" data-anchor="tools">Tools &amp; parts</a>
      <a href="#remove" data-anchor="remove">Removal</a>
      <a href="#prepare" data-anchor="prepare">Rally shaft preparation</a>
      <a href="#refit" data-anchor="refit">Refitting</a>
      <a href="#check" data-anchor="check">Final checks</a>
      <a href="#torque" data-anchor="torque">Torque reference</a>
      <p class="fine">Personal workshop log — modifications and fitted hardware may differ from stock Peugeot specifications.</p>
    </aside></div>
  </div>`;
}


function gearboxOilRefill(){
  return `<div class="container">
    <div class="procedure-heading">
      ${link('/cars/205-gti/testing/drivetrain','← Transmission & drivetrain','back-link')}
      <div class="procedure-header"><div class="eyebrow">PEUGEOT 205 GTi 1.9 / DRIVETRAIN / 003</div><span class="pill">WORKSHOP LOG</span></div>
      <h1>GEARBOX OIL <span style="color:var(--accent)">REFILL</span></h1>
      <p>Workshop method for topping up the gearbox on this rally-prepared 205 GTi using a slim funnel, <strong>without removing the battery or oil catch can</strong>.</p>
      <div class="tag-row"><span class="tag">Peugeot 205 GTi 1.9</span><span class="tag">Gearbox oil</span><span class="tag">Battery and catch can remain fitted</span></div>
    </div>
    <div class="callout"><strong>Safety and applicability.</strong> Switch off the engine and park on level ground. If the vehicle must be raised, support it securely on appropriate axle stands, not just a jack, and keep it level for a valid oil-level check. The filler plug and access method are recorded for this modified rally car; confirm the correct oil grade, level-check method and plug requirements for the gearbox actually fitted. Do not assume the amount lost is the correct quantity to add.</div>
    <div class="procedure-layout"><article>
      <section class="procedure-section" id="equipment"><h2>01 / Equipment</h2>
        <p><strong>17 mm stubby spanner</strong> for the car's plastic gearbox oil filler plug; a <strong>custom slim gearbox funnel</strong> (see ${link('/cars/205-gti/tools/gearbox-refill-funnel','3D-print specifications')}); gearbox oil of the correct specification; clean rag and a suitable tray for any spill.</p>
      </section>
      <section class="procedure-section" id="refilling"><h2>02 / Refilling procedure</h2>
        <ol class="step-list">
          <li>With the engine off and vehicle securely positioned, locate the <strong>plastic gearbox oil filler plug</strong> and clean around it to prevent dirt entering the gearbox.</li>
          <li>Carefully loosen and remove the plug with the <strong>17 mm stubby spanner</strong>. Avoid damaging the plastic fitting.</li>
          <li>Position the <strong>slim custom funnel</strong> so oil can be added with <strong>both the battery and oil catch can left in place</strong>. Keep the funnel clear of wiring, hoses and other components.</li>
          <li>Add the specified gearbox oil slowly, checking against the <strong>correct level and filling procedure for the fitted gearbox</strong>. Do not use a fixed top-up volume based solely on an earlier oil loss.</li>
          <li>Remove the funnel, refit the plastic filler plug and secure it according to its applicable specification. <strong>Do not overtighten the plastic plug.</strong> Wipe away any spilled oil and inspect for leaks.</li>
        </ol>
      </section>
      <section class="procedure-section" id="observations"><h2>03 / Related workshop observation</h2>
        <p>During the recorded ${link('/cars/205-gti/testing/drivetrain/driveshaft-removal-refit','driveshaft removal and refitting procedure')}, approximately <strong>250 mL of gearbox oil</strong> escaped when the shaft was withdrawn. That is an observation from one job, <strong>not a prescribed refill amount</strong>; verify the actual gearbox level.</p>
      </section>
    </article><aside class="aside-box"><h3>On this page</h3>
      <a href="#equipment" data-anchor="equipment">Equipment</a>
      <a href="#refilling" data-anchor="refilling">Refilling</a>
      <a href="#observations" data-anchor="observations">Workshop observation</a>
      <p class="fine">Personal workshop notes for this modified Peugeot 205 GTi. Confirm gearbox specifications before servicing.</p>
    </aside></div>
  </div>`;
}


function lsdBreakawayTest(){
  return `<div class="container">
    <div class="procedure-heading">
      ${link('/cars/205-gti/testing/drivetrain','← Transmission & drivetrain','back-link')}
      <div class="procedure-header"><div class="eyebrow">PEUGEOT 205 GTi 1.9 / DRIVETRAIN / 002</div><span class="pill">WORKSHOP TEST</span></div>
      <h1>PLATED LSD <span style="color:var(--accent)">BREAKAWAY TORQUE</span></h1>
      <p>Static in-car check of limited-slip differential resistance, followed by the more direct bench-test method. Recorded for the Peugeot 205 GTi rally car on 21 November 2026. Differential manufacturer and exact build specification have not yet been confirmed.</p>
      <div class="tag-row"><span class="tag">In-car screening test</span><span class="tag">Approx. 28 Nm observed</span><span class="tag">Approx. 95 Nm stated target</span></div>
    </div>
    <div class="callout"><strong>Safety:</strong> Stationary test only. Use level ground, rear wheel chocks, correct jacking points and a rated axle stand. Never rely on a jack alone or work beneath a car supported only by a jack. Keep clear of the rotating wheel, steering and driveline. Work with the engine off and gearbox in neutral; do not run the engine during the test. Use the actual differential maker's testing procedure where available.</div>
    <div class="procedure-layout"><article>
      <section class="procedure-section" id="record"><h2>01 / Recorded result</h2>
        <table class="results-table"><thead><tr><th>Item</th><th>Observation</th></tr></thead><tbody>
          <tr><td>Vehicle</td><td>Peugeot 205 GTi 1.9 rally car, plated LSD</td></tr>
          <tr><td>Expected preload</td><td><strong>About 95 Nm</strong>, owner-reported; original build/test method not yet verified</td></tr>
          <tr><td>Measured in-car breakaway</td><td><strong>About 28 Nm</strong>, similar on two further checks</td></tr>
          <tr><td>Test configuration</td><td>One driven front wheel raised, other driven wheel on ground, gearbox in neutral</td></tr>
          <tr><td>Interpretation</td><td>Lower than the stated target, but <strong>not a direct measurement of the differential alone</strong></td></tr>
          <tr><td>Follow-up</td><td>Bench-test differential after removal if an accurate assessment is required</td></tr>
        </tbody></table>
        <p class="muted-note">Do not describe the difference as a precise percentage of plate wear: 95 Nm and 28 Nm may have been measured by different methods, and the in-car result includes additional drivetrain drag.</p>
      </section>
      <section class="procedure-section" id="tools"><h2>02 / Equipment</h2>
        <p>Wheel chocks; jack and rated axle stand; correctly sized hub-nut socket; a calibrated torque wrench with an appropriate lower measurement range (or torque gauge) and suitable drive adapter; means of recording readings. For a bench test, suitable differential-output spline adapters and a secure fixture are required.</p>
      </section>
      <section class="procedure-section" id="oncar"><h2>03 / Static in-car check</h2>
        <ol class="step-list">
          <li>Park on firm, level ground, switch the engine off, select <strong>neutral</strong>, apply the handbrake and chock the rear wheels. Ensure there is no risk of vehicle movement.</li>
          <li>Raise <strong>one front driven wheel</strong> and support the vehicle securely on an axle stand. Leave the <strong>opposite front wheel on the ground</strong> so that differential output is held against rotation.</li>
          <li>With the wheel and hub assembly safe to turn, attach a properly fitting socket and calibrated torque wrench or suitable torque gauge to the raised wheel's hub. Apply torque <strong>only in the direction that tightens the hub nut</strong>, without disturbing its locking method or exceeding any fastening specification. If that cannot be done safely, use a suitable hub fixture instead.</li>
          <li>Apply torque smoothly and progressively. For a click-type wrench, begin with a low setting: if it clicks while the wheel stays still, increase the setting in small increments. Note the point where the wheel starts to rotate <strong>before the wrench clicks</strong>. A beam/digital indicating gauge can show the onset of rotation more directly.</li>
          <li>Repeat the check with the same setup and direction. Record all readings, how rotation was detected, which wheel was lifted, gearbox temperature if relevant, and any obvious brake drag or CV-joint resistance.</li>
        </ol>
        <div class="callout"><strong>What this means:</strong> The measured resistance includes hub bearings, driveshaft/CV joints, possible brake drag and the plated differential. It is useful for repeatable <em>in-car comparisons</em>, but is not equivalent to a bench preload specification. Breakaway measures static clutch resistance, not the LSD's torque-dependent ramp locking under engine load.</div>
      </section>
      <section class="procedure-section" id="bench"><h2>04 / Differential bench test (follow-up)</h2>
        <ol class="step-list">
          <li>Remove and support the gearbox/differential using the correct workshop procedure. Follow the differential manufacturer's instructions for oil condition, assembly and test setup.</li>
          <li>With the differential accessible, use correctly fitting output-drive fixtures. Secure <strong>one differential output</strong> against rotation while allowing the differential body and opposite output to be supported as specified.</li>
          <li>Apply torque to the <strong>other differential output</strong> with an appropriate calibrated tool. Increase smoothly and record the torque at the start of relative movement, repeating to establish a consistent reading.</li>
          <li>Compare the bench result with the <strong>verified build specification measured using the same method</strong>. If it is below specification, investigate clutch plate condition, spring/Belleville washers and clutch-stack settings with the differential manufacturer or specialist before adjusting or rebuilding.</li>
        </ol>
        <p class="muted-note">This is an outline of the measurement, not a gearbox strip-down or LSD rebuild procedure. Fixture arrangements and target torque vary by differential design.</p>
      </section>
      <section class="procedure-section" id="decision"><h2>05 / Assessment and next action</h2>
        <p>The repeated <strong>approximately 28 Nm</strong> in-car reading suggests substantially less resistance than the <strong>roughly 95 Nm</strong> stated target, but it does <strong>not</strong> establish the exact internal preload. In-car drag tends to contaminate the reading. Confirm the LSD make/model and original measurement method, then bench-test before choosing a rebuild or preload adjustment. Avoid attributing the result solely to worn plates without inspection.</p>
        <p><strong>Archive references:</strong> <a href="https://pinderwagen.com/build-topics/gripper-plate-differential-strip-adjust-breakaway-torque-rebuild/" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Illustrated example of an LSD bench breakaway test</a>; <a href="https://gripperlsd.com/technical-zone/" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Gripper manufacturer technical information</a>. These references illustrate methods; the LSD fitted to this car is not yet confirmed as a Gripper.</p>
      </section>
    </article><aside class="aside-box"><h3>On this page</h3>
      <a href="#record" data-anchor="record">Recorded reading</a>
      <a href="#tools" data-anchor="tools">Tools</a>
      <a href="#oncar" data-anchor="oncar">In-car test</a>
      <a href="#bench" data-anchor="bench">Bench test</a>
      <a href="#decision" data-anchor="decision">Assessment</a>
      <p class="fine">Personal workshop record. No diagnosis or rebuild decision is confirmed from the in-car reading alone.</p>
    </aside></div>
  </div>`;
}

function nav(current){
 const items=[['/home','⌂','Home'],['/cars','▣','Rally cars']];
 const problems=current.startsWith(CAR_PROBLEMS_ROOT),hist=current.startsWith(HIST_ROOT),testing=current.startsWith('/cars/205-gti/testing');
 const base=problems?CAR_PROBLEMS_ROOT:hist?HIST_ROOT:'/cars/205-gti/testing';
 return `${items.map(([path,icon,label])=>`<a class="nav-link ${current===path?'active':''}" href="${url(path)}"><span class="nav-symbol" aria-hidden="true">${icon}</span>${label}</a>`).join('')}<div class="nav-section">PEUGEOT 205 GTi</div><div class="nav-group">${[['/cars/205-gti','Overview'],['/cars/205-gti/history','History'],['/cars/205-gti/testing','Testing & procedures'],[HIST_ROOT,'Historical Tests'],[CAR_PROBLEMS_ROOT,'Car Problems'],['/cars/205-gti/tools','Specialist tools'],['/cars/205-gti/events','Events']].map(([p,l])=>`<a class="nav-link ${current===p||((p==='/cars/205-gti/testing'||p===HIST_ROOT||p===CAR_PROBLEMS_ROOT)&&current.startsWith(p+'/'))?'active':''}" href="${url(p)}">${l}</a>`).join('')}</div>${(hist||testing||problems)?`<div class="nav-section">${problems?'CAR PROBLEM SYSTEMS':hist?'HISTORICAL TEST SYSTEMS':'WORKSHOP SYSTEMS'}</div><div class="nav-group">${CATEGORIES.map(c=>`<a class="nav-link ${current===base+'/'+c.slug?'active':''}" href="${url(base+'/'+c.slug)}">${esc(c.name)}</a>`).join('')}</div>`:''}`;
}
function batteryStartingTest(){
  return `<div class="container">
    <div class="procedure-heading">
      ${link('/cars/205-gti/testing/electrical','← Electrical procedures','back-link')}
      <div class="procedure-header"><div class="eyebrow">PEUGEOT 205 GTi 1.9 / ELECTRICAL / 001</div><span class="pill">WORKSHOP TEST</span></div>
      <h1>BATTERY VOLTAGE &amp; <span style="color:var(--accent)">STARTING TEST</span></h1>
      <p>Use a digital multimeter to check a 12 V battery's resting voltage, the voltage while trying to start, and alternator charging once the engine runs. Includes a current workshop no-start observation; no component has yet been confirmed faulty.</p>
      <div class="tag-row"><span class="tag">Recorded 12.33 V engine off</span><span class="tag">Single click when starting</span><span class="tag">Further testing required</span></div>
    </div>
    <div class="callout"><strong>Safety first.</strong> Park securely with handbrake on, gearbox in neutral and wheels chocked. Work in a ventilated area; keep clear of belts, the cooling fan and other moving parts. Check for damaged, hot, leaking or swollen batteries before testing. Set the meter to <strong>DC volts</strong>, not amps: never put a meter in current mode across the battery posts. Do not bridge the terminals, disconnect the battery while the engine is running or keep cranking a clicking starter repeatedly. Stop if wires or terminals get hot.</div>
    <div class="procedure-layout"><article>
      <section class="procedure-section" id="equipment"><h2>01 / Equipment and preparation</h2>
        <p>Digital multimeter (a minimum-voltage capture function helps), charged meter battery, good lighting and optionally a dedicated battery load or conductance tester. Identify the positive (+) and negative (−) <strong>battery posts</strong>, then inspect the posts, terminal clamps, main positive starter cable and engine-to-body earth strap for looseness, corrosion or obvious damage.</p>
      </section>
      <section class="procedure-section" id="resting"><h2>02 / Resting battery voltage (engine off)</h2>
        <ol class="step-list"><li>Switch off the engine and all electrical loads. For a meaningful resting measurement, let the battery settle for several hours after charging or driving.</li><li>Set the multimeter to DC volts (20 V range if manually ranged).</li><li>Touch the <strong>red probe to the positive battery post</strong> and <strong>black probe to the negative battery post</strong>. Note the voltage.</li></ol>
        <table class="results-table"><thead><tr><th>Approximate resting voltage</th><th>General interpretation at room temperature</th></tr></thead><tbody>
          <tr><td>12.6–12.8 V</td><td>Near fully charged</td></tr>
          <tr><td>About 12.4 V</td><td>Partly discharged</td></tr>
          <tr><td>12.2 V or below</td><td>Low state of charge; recharge and recheck</td></tr>
        </tbody></table>
        <p class="muted-note">Values are approximate for a conventional 12 V lead-acid battery. Temperature, battery construction and surface charge affect readings. Resting voltage alone does not prove the battery can deliver starter current.</p>
      </section>
      <section class="procedure-section" id="cranking"><h2>03 / Voltage during starting attempt</h2>
        <ol class="step-list"><li>Leave the voltage probes securely on the <strong>battery posts themselves</strong>, clear of moving parts. Have an assistant operate the key, or use the meter's minimum-reading feature.</li><li>Attempt to start the engine <strong>briefly</strong> and record the lowest voltage across the posts while the key is held at START. Stop after a click/no-crank; avoid repeated attempts.</li><li>Compare the reading with the resting measurement. Around <strong>9.6 V</strong> is a common room-temperature guideline for a cranking battery; it is not a universal pass/fail criterion and must be interpreted with battery temperature and actual starter load.</li></ol>
        <div class="fail"><strong>If battery-post voltage collapses:</strong> Recharge the battery and retest; a battery load or conductance test can establish its health. Excess starter current is another possibility.</div>
        <div class="result"><strong>If battery-post voltage remains relatively high but only one click occurs:</strong> Do not assume the battery is good. Investigate high-resistance positive/earth connections, the starter solenoid and starter motor, including voltage-drop checks by a competent person.</div>
      </section>
      <section class="procedure-section" id="charging"><h2>04 / Charging voltage (only once the engine runs)</h2>
        <ol class="step-list"><li>Start the engine safely and measure DC voltage across the same battery posts.</li><li>Check at idle and, if necessary, a modestly raised idle. A typical conventional charging reading is roughly <strong>13.7–14.7 V</strong>, but depends on operating conditions and the charging system.</li><li>Switch on headlights and cabin fan, then note whether charging voltage remains appropriately above a non-charging reading. Do not infer failure solely from one low-idle reading.</li></ol>
        <p class="muted-note">If voltage stays around the engine-off value, investigate charging output, belts, connections and earths. A substantially excessive charging voltage needs attention to avoid battery damage. Do not remove a battery terminal to test the alternator.</p>
      </section>
      <section class="procedure-section" id="log"><h2>05 / Peugeot 205 GTi workshop observations — 21 November 2026</h2>
        <table class="results-table"><thead><tr><th>Item</th><th>Recorded finding</th></tr></thead><tbody>
          <tr><td>Resting voltage</td><td><strong>12.33 V</strong> with engine off (rest period not confirmed)</td></tr>
          <tr><td>Starting attempts</td><td>Engine initially turned over; a subsequent attempt produced <strong>one click and no cranking</strong>; later the engine <strong>started normally at normal cranking speed</strong> (exact time not recorded).</td></tr>
          <tr><td>Minimum voltage during START</td><td><strong>Not yet recorded</strong></td></tr>
          <tr><td>Charging voltage</td><td><strong>Not yet recorded</strong>; no voltage reading reported after the successful start</td></tr>
          <tr><td>Diagnosis</td><td><strong>Intermittent single-click no-crank</strong>. Battery charge/health, loose or corroded high-current connections/earth, starter solenoid and starter motor remain possible causes — <strong>not confirmed</strong>. Successful starting does not rule them out.</td></tr>
        </tbody></table>
        <p><strong>Update:</strong> A later start was normal. If the no-crank fault returns, note the minimum voltage <strong>directly across the battery posts</strong> during START. Check the positive terminal, engine earth strap and starter connections for poor contact (engine off); a qualified technician can check voltage drop across these cables during cranking. Recharge and load-test the battery if required. Do not replace the battery or starter based on the click alone.</p>
      </section>
    </article><aside class="aside-box"><h3>On this page</h3>
      <a href="#equipment" data-anchor="equipment">Tools &amp; preparation</a>
      <a href="#resting" data-anchor="resting">Resting voltage</a>
      <a href="#cranking" data-anchor="cranking">Starting voltage</a>
      <a href="#charging" data-anchor="charging">Alternator charging</a>
      <a href="#log" data-anchor="log">Vehicle test record</a>
      <p class="fine">Vehicle-specific observation and general diagnostic guidance; not a confirmed Peugeot factory electrical specification or a definitive component diagnosis.</p>
    </aside></div>
  </div>`;
}


function coolantTemperatureEcuTest(){
 return `<div class="container">
   <div class="procedure-heading">
     ${link('/cars/205-gti/testing/engine','← Engine &amp; fuel procedures','back-link')}
     <div class="procedure-header"><div class="eyebrow">PEUGEOT 205 GTi 1.9 / ENGINE &amp; FUEL / 001</div><span class="pill">WORKSHOP TEST</span></div>
     <h1>COOLANT SENSOR &amp; <span style="color:var(--accent)">ECU WIRING TEST</span></h1>
     <p>Cold and warm resistance checks of the <strong>blue two-pin injection coolant temperature sensor</strong> and its wiring, using the Bosch LE2-Jetronic ECU connector. This is not the dashboard gauge temperature sender.</p>
     <div class="tag-row"><span class="tag">Cold: 3.9 kΩ at ECU plug</span><span class="tag">Pin 10 continuity confirmed</span><span class="tag">Warm reading still to do</span></div>
   </div>
   <div class="callout"><strong>Safety:</strong> Perform resistance and continuity measurements with the <strong>engine stopped, ignition off, battery negative disconnected and ECU unplugged</strong>. Probe the <strong>ECU wiring plug only</strong>, never the ECU's metal pins. Do not connect an ohmmeter to a powered circuit or bridge adjacent terminals. Reconnect the ECU and battery before starting the engine. For the warm test, avoid hot coolant parts, burns and the electric cooling fan.</div>
   <div class="procedure-layout"><article>
     <section class="procedure-section" id="identification"><h2>01 / Identification and equipment</h2>
       <p><strong>ECU:</strong> Bosch LE2-Jetronic, part number <strong>0 280 000 359</strong>. <strong>ECU connector pin 10:</strong> coolant temperature sensor signal; <strong>pin 13:</strong> earth. The 25-way connector has unpopulated positions, and on this car the moulded pin numbers were not visible. Verify pin positions from the correct pinout and continuity, not by guessing the viewing direction. Use a multimeter with resistance (Ω / kΩ) and continuity settings plus suitable slim insulated probes.</p>
     </section>
     <section class="procedure-section" id="sensor"><h2>02 / Cold resistance directly at the sensor</h2>
       <ol class="step-list">
         <li>Start with a completely cold engine. Turn ignition off, disconnect the negative battery terminal, and locate the <strong>blue two-pin sensor</strong> below the distributor.</li>
         <li>Unplug the blue sensor connector. Select <strong>20 kΩ</strong> on the multimeter (or auto-ranging resistance).</li>
         <li>Measure <strong>between the two pins on the sensor itself</strong>, not the wiring connector. Record resistance and coolant temperature if known.</li>
         <li>Reconnect the sensor's blue plug before proceeding to the ECU-end resistance check.</li>
       </ol>
       <p class="result"><strong>Recorded cold result:</strong> approximately <strong>3.9–4.0 kΩ</strong>. Coolant temperature was not measured, so the exact expected resistance at that moment cannot be determined.</p>
     </section>
     <section class="procedure-section" id="continuity"><h2>03 / Verify coolant sensor wire to ECU plug pin 10</h2>
       <ol class="step-list">
         <li>With ignition off and battery negative still disconnected, unplug the <strong>ECU</strong> and unplug the <strong>blue sensor connector</strong> again.</li>
         <li>Switch the multimeter to <strong>continuity / beep</strong>. Touch one probe to the sensor's <strong>wiring-side connector</strong> and check the identified contacts on the disconnected <strong>ECU wiring plug</strong>, without forcing or shorting pins.</li>
         <li>Verify that the sensor signal wire has continuity to <strong>ECU plug pin 10</strong>, then reconnect the blue sensor plug.</li>
       </ol>
       <p class="result"><strong>Recorded finding:</strong> continuity to <strong>pin 10</strong> was confirmed. This establishes continuity at the time of the test, not an intermittent-fault-free loom.</p>
     </section>
     <section class="procedure-section" id="cold-ecu"><h2>04 / Cold resistance from the ECU end</h2>
       <ol class="step-list">
         <li>Leave <strong>blue sensor connected</strong>, <strong>ECU disconnected</strong>, battery negative disconnected and ignition off.</li>
         <li>Set the meter to <strong>20 kΩ</strong> and measure <strong>between pins 10 and 13 of the disconnected ECU WIRING PLUG</strong>, not on the ECU unit.</li>
         <li>Compare the reading with the direct sensor measurement at roughly the same coolant temperature. Major disagreement suggests a wiring, connector or earth issue.</li>
       </ol>
       <p class="result"><strong>Recorded finding:</strong> <strong>3.9 kΩ</strong> across pins <strong>10 and 13</strong>, matching the approximately 3.9–4.0 kΩ cold sensor reading. The circuit appears continuous and consistent at the temperature tested.</p>
     </section>
     <section class="procedure-section" id="warm"><h2>05 / Warm-engine resistance check — PENDING</h2>
       <ol class="step-list">
         <li>With meter probes removed, <strong>reconnect the ECU and battery</strong> so the vehicle can be run safely. Confirm the blue sensor is still connected.</li>
         <li>After the intended drive or controlled warm-up, bring the engine to normal operating temperature. If possible note actual coolant temperature; the reference below assumes about <strong>80 °C</strong>.</li>
         <li><strong>Stop the engine and turn ignition OFF.</strong> Disconnect the negative battery terminal, ensure fan and moving parts have stopped, and unplug the ECU when safe to access. Avoid burns from hot components.</li>
         <li>With the <strong>blue sensor still connected</strong>, set the multimeter to <strong>2 kΩ</strong> (or auto-ranging resistance). Quickly measure between <strong>pins 10 and 13 at the ECU wiring plug</strong> while the engine is warm.</li>
         <li>Record the temperature and resistance. Resistance should be <strong>significantly lower than the cold 3.9 kΩ</strong>. At an actual coolant temperature near <strong>80 °C</strong>, the published LE2-Jetronic range is <strong>290–370 Ω</strong>.</li>
         <li>If a result is implausible, repeat directly at the sensor (with power off, battery disconnected, ECU unplugged and blue sensor connector unplugged) to distinguish the sensor from its wiring and earth. Refit connectors before driving.</li>
       </ol>
       <table class="results-table"><thead><tr><th>Coolant temperature</th><th>LE2-Jetronic reference resistance</th></tr></thead><tbody>
         <tr><td>−10 °C</td><td>8,200–11,000 Ω</td></tr>
         <tr><td>20 °C</td><td>2,280–2,720 Ω</td></tr>
         <tr><td><strong>80 °C</strong></td><td><strong>290–370 Ω</strong></td></tr>
       </tbody></table>
       <p class="muted-note">The sensor is an NTC thermistor: resistance falls as temperature rises. These reference figures apply only at the specified temperature and with the appropriate sensor. A merely warm engine cannot be assessed against the 80 °C reference as an exact pass/fail check.</p>
       <p><strong>Status:</strong> The warm test has <strong>not yet been performed</strong>. Do not enter a result until measured.</p>
     </section>
     <section class="procedure-section" id="record"><h2>06 / Workshop log — 21 November 2026</h2>
       <table class="results-table"><thead><tr><th>Item</th><th>Recorded measurement</th></tr></thead><tbody>
         <tr><td>Sensor directly, cold</td><td><strong>Approx. 3.9–4.0 kΩ</strong></td></tr>
         <tr><td>Sensor signal to ECU pin 10</td><td><strong>Continuity found</strong></td></tr>
         <tr><td>ECU plug pins 10 to 13, cold</td><td><strong>3.9 kΩ</strong></td></tr>
         <tr><td>ECU plug pins 10 to 13, warm</td><td><strong>Pending</strong></td></tr>
         <tr><td>Conclusion so far</td><td>Cold resistance reaches the ECU wiring connector as expected. Sensor operation when hot and cause of the rich-running fault remain unconfirmed.</td></tr>
       </tbody></table>
       <p><strong>Diagnostic context:</strong> This is part of the ongoing Peugeot 205 GTi investigation into very rich running and black spark plugs. A matching cold reading does not rule out problems when hot or faults elsewhere in the injection system.</p>
       <p class="muted-note"><strong>Reference material:</strong> <a href="https://www.205gtidrivers.com/forums/topic/95807-205-gti-16-ecu-pinout/" target="_blank" rel="noopener noreferrer">205 GTi LE2 pinout</a>; <a href="https://www.205gtidrivers.com/forums/topic/99870-bosch-ecu/" target="_blank" rel="noopener noreferrer">205 GTi hot and cold sensor measurements</a>; <a href="https://fr.scribd.com/document/470547459/L-injection-LE2-LU2-JETRONIC-Complet-V1" target="_blank" rel="noopener noreferrer">LE2/LU2 technical reference</a>. Use vehicle-specific technical guidance when confirming the fitted sensor type and pin positions.</p>
     </section>
   </article><aside class="aside-box"><h3>On this page</h3>
     <a href="#identification" data-anchor="identification">ECU &amp; meter</a>
     <a href="#sensor" data-anchor="sensor">Cold sensor test</a>
     <a href="#continuity" data-anchor="continuity">Pin 10 continuity</a>
     <a href="#cold-ecu" data-anchor="cold-ecu">Cold ECU-end test</a>
     <a href="#warm" data-anchor="warm">Warm test (pending)</a>
     <a href="#record" data-anchor="record">Recorded results</a>
     <p class="fine">Workshop notes and published reference values, not a confirmed fault diagnosis.</p>
   </aside></div>
 </div>`;
}

function getPage(path){if(path==='/home'||path==='/')return ['HOME',home()];if(path==='/cars')return ['RALLY CARS',cars()];if(path==='/cars/205-gti')return ['PEUGEOT 205 GTi',carOverview()];if(path==='/cars/205-gti/history')return ['205 GTi / HISTORY',history()];if(path==='/cars/205-gti/testing')return ['205 GTi / WORKSHOP',testing()];if(path===CAR_PROBLEMS_ROOT)return ['205 GTi / CAR PROBLEMS',carProblems()];if(path.startsWith(CAR_PROBLEMS_ROOT+'/')){const parts=path.slice(CAR_PROBLEMS_ROOT.length+1).split('/');if(parts.length<=2){const c=CATEGORIES.find(c=>c.slug===parts[0]);if(c){if(parts.length===1)return ['CAR PROBLEMS / '+c.name.toUpperCase(),carProblemCategory(c)];const p=CAR_PROBLEMS.find(p=>p.category===c.slug&&p.id===parts[1]);if(p)return ['CAR PROBLEM / '+c.name.toUpperCase(),carProblemDetail(p)];}}}if(path===HIST_ROOT)return ['205 GTi / HISTORICAL TESTS',historicalTests()];if(path.startsWith(HIST_ROOT+'/')){const parts=path.slice(HIST_ROOT.length+1).split('/');if(parts.length===1){const cat=CATEGORIES.find(c=>c.slug===parts[0]);if(cat)return ['HISTORICAL TESTS / '+cat.name.toUpperCase(),historicalCategory(cat)];}}if(path==='/cars/205-gti/events')return ['205 GTi / EVENTS',events()];if(path==='/cars/205-gti/tools')return ['205 GTi / SPECIALIST TOOLS',specialistTools()];if(path==='/cars/205-gti/tools/gearbox-refill-funnel')return ['SPECIALIST TOOLS / GEARBOX FUNNEL',gearboxFunnelTool()];const m=path.match(/^\/cars\/205-gti\/testing\/([a-z-]+)(?:\/([a-z-]+))?$/);if(m){const c=CATEGORIES.find(x=>x.slug===m[1]);if(c){if(!m[2])return [c.name.toUpperCase(),categoryPage(c)];if(m[2]==='brake-servo-vacuum'&&c.slug==='brakes')return ['BRAKES / SERVO',servo()];if(m[2]==='driveshaft-removal-refit'&&c.slug==='drivetrain')return ['DRIVETRAIN / DRIVESHAFT',driveshaft()];if(m[2]==='gearbox-oil-refill'&&c.slug==='drivetrain')return ['DRIVETRAIN / GEARBOX OIL',gearboxOilRefill()];if(m[2]==='plated-lsd-breakaway-test'&&c.slug==='drivetrain')return ['DRIVETRAIN / LSD TEST',lsdBreakawayTest()];if(m[2]==='battery-voltage-starting-test'&&c.slug==='electrical')return ['ELECTRICAL / BATTERY TEST',batteryStartingTest()];if(m[2]==='coolant-temperature-sensor-ecu-test'&&c.slug==='engine')return ['ENGINE / COOLANT SENSOR',coolantTemperatureEcuTest()]}}return ['NOT FOUND',`<div class="container">${header('ARCHIVE / 404','WRONG <em>TURN.</em>','That page is not in the rally archive.')} ${buttonLink('/home','Back home',true)}</div>`]}
function render(){const path=pathNow(),[breadcrumb,markup]=getPage(path);document.getElementById('app').innerHTML=markup;document.getElementById('breadcrumb').textContent=breadcrumb;document.getElementById('primary-nav').innerHTML=nav(path);document.title=`${breadcrumb} | Rallying`;document.querySelector('.site-shell').classList.remove('nav-open');document.getElementById('menu-toggle').setAttribute('aria-expanded','false');document.querySelectorAll('a[data-anchor]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.dataset.anchor)?.scrollIntoView({behavior:'smooth',block:'start'})}));window.scrollTo(0,0)}
window.addEventListener('hashchange',render);document.addEventListener('DOMContentLoaded',()=>{render();document.getElementById('menu-toggle').addEventListener('click',()=>{const shell=document.querySelector('.site-shell'),open=shell.classList.toggle('nav-open');document.getElementById('menu-toggle').setAttribute('aria-expanded',String(open))});document.getElementById('sidebar-scrim').addEventListener('click',()=>{document.querySelector('.site-shell').classList.remove('nav-open');document.getElementById('menu-toggle').setAttribute('aria-expanded','false')})});
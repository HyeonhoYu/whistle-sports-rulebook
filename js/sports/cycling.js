/* Cycling (road and track). Rules follow the UCI. */
(function(){

const INK = "#18221D", WOOD = "#D7B98C";
/* A 250 m velodrome seen from above. Riders go counterclockwise. */
function veloSVG(){
  const st = (r) => `M300 ${200 + r}H600A${r} ${r} 0 0 0 600 ${200 - r}H300A${r} ${r} 0 0 0 300 ${200 + r}Z`;
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="80 0 740 400" role="img" aria-label="A velodrome seen from above"><rect x="80" width="740" height="400" fill="#2B3831"/>
    <path d="${st(180)}" fill="${WOOD}"/><path d="${st(110)}" fill="#3C8DC4"/><path d="${st(100)}" fill="#2F7546"/>
    <path d="${st(114)}" fill="none" stroke="#111" stroke-width="3"/><path d="${st(124)}" fill="none" stroke="#D9342B" stroke-width="3"/><path d="${st(134)}" fill="none" stroke="#2F6FD6" stroke-width="3"/>
    <line x1="560" y1="310" x2="560" y2="380" stroke="#111" stroke-width="6"/><line x1="560" y1="310" x2="560" y2="380" stroke="#fff" stroke-width="2"/>
    <line x1="350" y1="310" x2="350" y2="380" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/><line x1="450" y1="20" x2="450" y2="90" stroke="#D9342B" stroke-width="3"/><line x1="450" y1="310" x2="450" y2="380" stroke="#D9342B" stroke-width="3"/>
    <text x="450" y="210" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="22" fill="#fff">Infield</text>
    <path class="hz" data-zone="infield" d="${st(98)}"/><path class="hz hzs" data-zone="azure" d="${st(105)}" style="stroke-width:10"/>
    <path class="hz hzs" data-zone="black" d="${st(114)}" style="stroke-width:8"/><path class="hz hzs" data-zone="red" d="${st(124)}" style="stroke-width:8"/><path class="hz hzs" data-zone="blue" d="${st(134)}" style="stroke-width:8"/>
    <path class="hz hzs" data-zone="banking" d="${st(162)}" style="stroke-width:30"/>
    ${r("finish",552,308,16,74)}${r("pursuit",444,18,12,74)}${r("pursuit",444,308,12,74)}${r("twohundred",344,308,12,74)}</svg>`;
}
const ZONES = {
  banking:{title:"Banked track", text:"A 250 m oval of wooden boards, banked as steep as about 42 degrees in the turns, so riders can corner at over 60 km/h (40 mph)."},
  azure:{title:"Côte d'azur", chip:"Blue band", text:"The flat blue band on the inside edge. It's not part of the racing surface, and riding on it to gain an advantage is an offense."},
  black:{title:"Measurement line", text:"The black line near the inside. The 250 m lap is measured along it, so it's the shortest way around."},
  red:{title:"Sprinter's line", text:"The red line. In sprints, a rider who's below it in the final stretch may not be squeezed off, and passing must happen above."},
  blue:{title:"Stayer's line", text:"The blue line about a third of the way up. In some races, slower riders stay above it so faster riders can pass below."},
  finish:{title:"Finish line", text:"A black line on a white band. Photo-finish cameras decide close sprints."},
  pursuit:{title:"Pursuit lines", text:"Red lines in the middle of each straight, half a lap apart. In pursuit races, two riders or teams start opposite each other here and chase."},
  twohundred:{title:"200 m line", text:"Marks 200 m before the finish. In the sprint, only the time over the last 200 m is taken."},
  infield:{title:"Infield", text:"The middle of the velodrome, where riders warm up and wait."}
};
const ZONE_ORDER = ["banking","azure","black","red","blue","finish","pursuit","twohundred","infield"];

/* Stage race: overall leader is the lowest total time. */
const RIDERS = [{n:"Sprinter",flat:1,mtn:.2,tt:.5},{n:"Climber",flat:.4,mtn:1,tt:.4},{n:"Time trialist",flat:.5,mtn:.5,tt:1},{n:"All-rounder",flat:.6,mtn:.85,tt:.85}];
const STAGES = [["Flat stage","flat"],["Mountain stage","mtn"],["Time trial","tt"]];
function stageRace(){
  const $ = id => document.getElementById(id); let S;
  const reset = () => { S = {k:0, tot:RIDERS.map(() => 0), wins:RIDERS.map(() => 0), rows:[]}; $("crMsg").textContent = "Three stages. The race is won by the lowest total time, not by stage wins."; draw(); };
  function ride(){
    if(S.k >= 3) return; const [name, key] = STAGES[S.k];
    const times = RIDERS.map(r => key === "flat" ? (r[key] === 1 ? 0 : (Math.random() < .8 ? 0 : 20)) : Math.round((1 - r[key])*(key === "mtn" ? 300 : 120) + Math.random()*25));
    const best = Math.min(...times), w = times.indexOf(best);
    const winner = key === "flat" ? 0 : w; S.wins[winner]++;
    times.forEach((t,i) => S.tot[i] += t - best);
    S.rows.push({name, times: times.map(t => t - best), winner}); S.k++;
    const lead = S.tot.indexOf(Math.min(...S.tot));
    let msg = `${name}: the ${RIDERS[winner].n.toLowerCase()} wins it. ${key === "flat" ? "Everyone in the main group crossed together, so they all get the same time." : ""}`;
    msg += ` Overall leader after ${S.k} stage${S.k > 1 ? "s" : ""}: the ${RIDERS[lead].n.toLowerCase()}, who wears the leader's jersey.`;
    if(S.k === 3) msg += S.wins[lead] ? " Final: the overall winner also won a stage." : " Final: the overall winner didn't win a single stage, but had the lowest total time. That's how stage races work.";
    $("crMsg").textContent = msg; draw();
  }
  const fmt = s => s ? `+${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}` : "same time";
  function draw(){
    const order = RIDERS.map((r,i) => i).sort((a,b) => S.tot[a] - S.tot[b]);
    $("crTable").innerHTML = `<table class="rctab"><thead><tr><th>Rider</th>${STAGES.map(([n],i) => `<th>${i < S.k ? n : ""}</th>`).join("")}<th>Overall</th></tr></thead><tbody>${order.map((i,pos) => `<tr class="${pos === 0 && S.k ? "hl" : ""}"><td>${pos === 0 && S.k ? '<i class="srv" style="background:#F2C230"></i>' : ""}${RIDERS[i].n}</td>${STAGES.map((_,k) => `<td>${S.rows[k] ? (S.rows[k].winner === i ? "Won" : fmt(S.rows[k].times[i])) : ""}</td>`).join("")}<td>${S.k ? fmt(S.tot[i] - S.tot[order[0]]) : ""}</td></tr>`).join("")}</tbody></table>`;
    $("crGo").hidden = S.k >= 3; $("crNew").hidden = S.k < 3; if(S.k < 3) $("crGo").textContent = `Ride stage ${S.k + 1}: ${STAGES[S.k][0]}`;
  }
  $("crGo").addEventListener("click", ride); $("crNew").addEventListener("click", reset); reset();
}

/* Drafting */
function drafting(){
  const $ = id => document.getElementById(id);
  function draw(){
    const d = +$("dfR").value, save = Math.round(32*Math.exp(-(d - .2)/1.4));
    $("dfRider").setAttribute("transform", `translate(${120 - d*60} 0)`);
    $("dfSave").textContent = `about ${save}%`; $("dfMsg").textContent = d < .6 ? "Right on the wheel: the rider in front punches a hole in the air, and you ride in the calm behind." : d < 1.6 ? "Still in the slipstream, but the benefit is fading." : "Too far back: you're facing nearly all the wind yourself.";
  }
  $("dfR").addEventListener("input", draw); draw();
}
const bike = (x, c) => `<g transform="translate(${x} 0)"><circle cx="0" cy="70" r="18" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="52" cy="70" r="18" fill="none" stroke="${INK}" stroke-width="4"/><path d="M0 70L20 40H46L52 70M20 40L26 70H52" fill="none" stroke="${c}" stroke-width="4"/><circle cx="30" cy="22" r="9" fill="${c}"/><path d="M30 30L22 42M30 30L44 40" stroke="${c}" stroke-width="5"/></g>`;

const EVENTS = [
  {name:"Road race", text:"A mass start over 200 km or more. First across the line wins. Teams protect their leader and shelter them from the wind."},
  {name:"Time trial", text:"Riders start alone, one at a time, against the clock. No drafting allowed."},
  {name:"Stage race", text:"Many days of racing, like the Tour de France. The overall winner has the lowest total time across all stages."},
  {name:"Track sprint", text:"Two or three riders, three laps. It often starts slowly, with riders jockeying, before an explosive final 200 m."},
  {name:"Keirin", text:"Six riders follow a pacing motorbike that gradually speeds up, then pulls off with about three laps to go, starting the sprint."},
  {name:"Team pursuit", text:"Teams of four start on opposite sides of the track and race 4 km, taking turns at the front. The time is taken on the third rider."}
];
const CLOCK = [
  {k:"neutral", cls:"half", t:"Start", s:"Neutral", info:["Neutral start","Road races begin with a slow neutral zone behind an official car, before the flag drops and racing begins."]},
  {k:"race", cls:"q", t:"Race", s:"Hours", info:["The race","Breakaways try to escape the peloton, the main group, which usually chases them down before the finish."]},
  {k:"final", cls:"q", t:"Finale", s:"Last km", info:["The finale","Sprinters' teams line up in a lead-out train to deliver their sprinter to the final 200 m at top speed."]},
  {k:"three", cls:"ot", t:"3 km rule", s:"Safety", info:["The 3 km rule","In road stages, a rider who crashes or punctures inside the last 3 km gets the same time as the group they were in."]}
];
const TRICKY = [
  ["Why do riders ride so close together?","Drafting. The rider behind uses much less energy, so groups move faster than solo riders and teammates take turns at the front."],
  ["How can someone win the Tour without winning a stage?","The overall classification adds up times across all stages. Steady, strong riding in the mountains and time trials can beat flashy stage wins."],
  ["Why do they give the same time to a whole group?","In road stages, riders who finish together in one group get the same time, even if the group is long. It avoids dangerous jostling."],
  ["What do the jerseys mean?","In the Tour de France: yellow for the overall leader, green for the points leader, polka dots for the best climber, and white for the best young rider."],
  ["Can riders get help from their team car?","Yes. Team cars follow the race with spare bikes and wheels, and riders can take food and water from them, within the rules."],
  ["Why don't track bikes have brakes?","Track bikes have a fixed gear and no brakes. Riders slow down by resisting the pedals, and everyone moves in the same direction."]
];
const WORDS = [["Peloton","The main group of riders."],["Breakaway","A small group that escapes ahead of the peloton."],["Drafting","Riding in another rider's slipstream to save energy."],["Domestique","A team rider who works for the leader."],["GC","General classification: the overall standings by total time."],["Echelon","A diagonal line of riders sheltering from a crosswind."],["Lead-out","Teammates who pull their sprinter to top speed before the finish."],["Bonk","Running out of energy, also called hitting the wall."]];
const QUIZ = [
  {q:"In a stage race, who wins overall?", o:["The rider with the most stage wins","The rider with the lowest total time","The fastest sprinter","The rider who leads the most days"], a:1, why:"Lowest total time across all stages."},
  {q:"Why do riders ride close behind each other?", o:["It's required","To save energy by drafting","To block the wind for spectators","To see the road"], a:1, why:"Drafting saves a lot of effort."},
  {q:"In which event is drafting not allowed?", o:["Road race","Individual time trial","Keirin","Team pursuit"], a:1, why:"Time trial riders start alone and must ride alone."},
  {q:"What does the yellow jersey mean in the Tour de France?", o:["Best climber","Points leader","Overall leader","Best young rider"], a:2, why:"Yellow is the overall leader."},
  {q:"How long is a standard velodrome lap?", o:["100 m","250 m","400 m","1 km"], a:1, why:"Most Olympic velodromes are 250 m."},
  {q:"What paces the riders at the start of a keirin?", o:["A pacing motorbike","A car","A flag","A whistle"], a:0, why:"A motorbike leads, then pulls off for the sprint."},
  {q:"What's the peloton?", o:["The lead rider","The main group","The finish line","The team car"], a:1, why:"The peloton is the main pack."},
  {q:"A rider crashes 2 km from the finish of a flat stage. What happens to their time?", o:["They lose minutes","They get the same time as their group","They're disqualified","The stage is canceled"], a:1, why:"The 3 km rule gives them their group's time."},
  {q:"How do track cyclists slow down?", o:["Hand brakes","By resisting the fixed-gear pedals","A parachute","By touching the blue band"], a:1, why:"Track bikes have no brakes."},
  {q:"In the track sprint, which part of the race is timed?", o:["The first lap","The whole race","The last 200 m","Nothing is timed"], a:2, why:"Only the final 200 m is timed."}
];

function render(app){
  app.innerHTML = sportHero({id:"cycling", name:"Cycling", alt:"The tabby cat in a cycling helmet riding a road bike",
      lede:"Cycling is a family of races. On the road, riders race for hours in a pack, saving energy by drafting before a final sprint or mountain climb. On the track, they race on a steeply banked oval in short, explosive events. The rule that ties them together: the fastest to the line, or the lowest total time, wins.",
      facts:[["250","meters: a velodrome lap"],["21","stages in the Tour de France"],["3","km rule protects riders in crashes"],["0","brakes on a track bike"]]})
    + jumpNav([["cy-velo","The velodrome"],["cy-events","Events"],["cy-draft","Drafting"],["cy-stage","Stage race"],["cy-clock","A road race"],["cy-tricky","Tricky rules"],["cy-words","Words you'll hear"],["cy-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("cy-velo","The velodrome","Tap any part of the track to see what it does.",`<div class="fieldbox" id="cyVelo">${veloSVG()}</div><div class="fieldrow"><div class="zonechips" id="cyChips"></div><div class="infopanel" id="cyInfo" aria-live="polite"></div></div>`)
    + section("cy-events","Events","A few of the races you'll see on TV and at the Olympics.",`<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${EVENTS.map(d => `<div class="score"><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("cy-draft","Drafting","Slide the second rider closer to the first and see roughly how much effort the slipstream saves.",
        `<div class="oslab"><div class="fieldbox"><svg viewBox="0 0 320 110" aria-hidden="true"><rect width="320" height="110" fill="#E9F1F7"/><rect y="88" width="320" height="22" fill="#7A8C81"/>
          ${[20,40,60].map(y => `<path d="M310 ${y}h-60" stroke="#9CC7EE" stroke-width="3" stroke-dasharray="10 8"/>`).join("")}${bike(200,"#2F6FD6")}<g id="dfRider">${bike(0,"#D9342B")}</g></svg></div>
          <div class="osside"><div class="osverdict"><span class="verdict on" id="dfSave"></span><span style="color:#A9B8AE">less effort</span></div>
            <label class="slider">Gap to the wheel in front (meters)<input id="dfR" type="range" min="0.2" max="3" step="0.1" value="0.5"></label>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="dfMsg"></p></div><p class="note">Rough figures for illustration. Deep inside a big peloton the savings are even larger.</p></div></div>`)
    + section("cy-stage","Win a stage race","Four riders, three stages. Watch how the overall leader is decided.",
        `<div class="sim"><div id="crTable"></div><div class="controls"><button class="btn primary" id="crGo" type="button"></button><button class="btn primary" id="crNew" type="button" hidden>New race</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="crMsg"></p></div></div></div>`)
    + section("cy-clock","A road race","Tap a part of the race to learn more.",`<div class="timeline" id="cyTimeline"></div><div class="infopanel" id="cyClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("cy-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="cyFlips"></div>`)
    + section("cy-words","Words you'll hear","",`<dl class="gloss" id="cyGloss"></dl>`)
    + section("cy-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="cyQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the UCI for road and track cycling. BMX and mountain biking are separate Olympic disciplines with their own rules.</footer></div>`;
  setupZones(document.getElementById("cyVelo"), document.getElementById("cyChips"), document.getElementById("cyInfo"), ZONES, ZONE_ORDER, "banking");
  drafting(); stageRace();
  setupTimeline(document.getElementById("cyTimeline"), document.getElementById("cyClockInfo"), CLOCK, "A big road stage can take four to six hours.");
  flipCards(document.getElementById("cyFlips"), TRICKY); glossary(document.getElementById("cyGloss"), WORDS);
  makeQuiz(document.getElementById("cyQuiz"), QUIZ, ["Yellow jersey! Watch a stage and spot the breakaway.","A strong ride. Run another stage race and watch the overall leader change.","Look over the events and drafting again, then come back.","No worries. Start with the events and the stage race, then try again."]);
}
SPORT_PAGES["cycling"] = {render};
})();

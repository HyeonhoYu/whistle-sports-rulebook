/* Long track speed skating. Rules follow the ISU. Short track is noted separately. */
(function(){

const INK = "#18221D", ICE = "#EEF4F8";
/* 400 m oval. Straights from x=300 to 600; bends centered at x=300 and x=600, cy=200. Inner lane radius ~ 130, outer ~ 150. */
const CY = 200, XL = 300, XR = 600, RI = 128, RO = 152;
const oval = r => `M${XL} ${CY + r}H${XR}A${r} ${r} 0 0 0 ${XR} ${CY - r}H${XL}A${r} ${r} 0 0 0 ${XL} ${CY + r}Z`;
function ovalBase(){
  return `<rect x="100" y="0" width="700" height="400" fill="#2B3831"/><path d="${oval(186)}" fill="${ICE}"/><path d="${oval(116)}" fill="#C9D8E4"/>
    <path d="${oval(140)}" fill="none" stroke="#2F6FD6" stroke-width="2"/><path d="${oval(164)}" fill="none" stroke="#D9342B" stroke-width="2" stroke-dasharray="8 6"/>
    <path d="${oval(116)}" fill="none" stroke="#9AA" stroke-width="2"/><path d="${oval(176)}" fill="none" stroke="#9AA" stroke-width="1"/>
    <rect x="300" y="44" width="300" height="34" fill="#F2C230" opacity=".25"/>
    <line x1="560" y1="316" x2="560" y2="364" stroke="${INK}" stroke-width="4"/><line x1="380" y1="316" x2="380" y2="364" stroke="#D9342B" stroke-width="3"/>
    <text x="450" y="64" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="16" fill="${INK}">Crossing straight</text>
    <text x="560" y="384" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#fff">Finish</text>`;
}
function ovalSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="100 0 700 400" role="img" aria-label="Speed skating oval seen from above">${ovalBase()}
    <path class="hz" data-zone="infield" d="${oval(112)}"/><path class="hz hzs" data-zone="inner" d="${oval(128)}" style="stroke-width:22"/><path class="hz hzs" data-zone="outer" d="${oval(152)}" style="stroke-width:22"/>
    <path class="hz hzs" data-zone="warm" d="${oval(176)}" style="stroke-width:16"/>${r("cross",300,40,300,42)}${r("finish",552,312,16,56)}${r("start",372,312,16,56)}</svg>`;
}
const ZONES = {
  inner:{title:"Inner lane", text:"The shorter lane around the bends. Each skater spends half of every lap in it."},
  outer:{title:"Outer lane", text:"The longer lane. The start positions are staggered, and skaters swap lanes every lap, so both cover exactly the same distance."},
  cross:{title:"Crossing straight", text:"The back straight, where the two skaters switch lanes every lap. Rules decide who must give way so they don't collide."},
  warm:{title:"Warm-up lane", text:"The outer lane where other skaters warm up during races."},
  finish:{title:"Finish line", text:"Time is taken when the skate blade crosses the line. That's why skaters kick one leg forward at the finish."},
  start:{title:"Start lines", text:"Each distance has its own start line, placed so the race ends at the finish line."},
  infield:{title:"Infield", text:"The middle of the oval, used for warming up and by coaches."}
};
const ZONE_ORDER = ["inner","outer","cross","finish","start","warm","infield"];

/* Lane-change animation: two skaters, two laps. */
function posAt(t, lane){ /* t in [0,1) lap fraction measured from start of home straight (bottom, going right). lane 0 inner, 1 outer, may be fractional */
  const r = RI + (RO - RI)*lane, L = [300, Math.PI*r, 300, Math.PI*r], tot = L.reduce((a,b)=>a+b,0); let d = ((t%1)+1)%1*tot;
  if(d < L[0]) return [XL + d, CY + r]; d -= L[0];
  if(d < L[1]){ const a = d/r; return [XR + r*Math.sin(a), CY + r*Math.cos(a)]; } d -= L[1];
  if(d < L[2]) return [XR - d, CY - r]; d -= L[2];
  const a = d/r; return [XL - r*Math.sin(a), CY - r*Math.cos(a)];
}
function laneDemo(){
  const $ = id => document.getElementById(id); let raf = null;
  function laneAt(start, t){ /* lap progress t; lane switches on crossing straight (t from .5 to ~.6 roughly) */
    const lap = Math.floor(t), f = t - lap; let L = (start + lap) % 2;
    const a = .52, b = .68; /* crossing segment of the lap */
    if(f > a && f < b) return L + ((1 - 2*L)*(f - a)/(b - a));
    return f >= b ? 1 - L : L;
  }
  function place(t){
    const p1 = posAt(t, laneAt(0, t)), p2 = posAt(t + .03, laneAt(1, t + .03));
    $("lsA").setAttribute("transform", `translate(${p1[0]} ${p1[1]})`); $("lsB").setAttribute("transform", `translate(${p2[0]} ${p2[1]})`);
  }
  $("lsGo").addEventListener("click", () => {
    cancelAnimationFrame(raf); const t0 = performance.now(), dur = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 8000;
    $("lsMsg").textContent = "Skater A starts in the inner lane, skater B in the outer lane, a little ahead. Watch them swap on the crossing straight.";
    (function step(now){ const k = Math.min(1, (now - t0)/dur), t = k*2; place(t); $("lsLap").textContent = `Lap ${Math.min(2, Math.floor(t) + 1)} of 2`;
      if(k < 1) raf = requestAnimationFrame(step); else $("lsMsg").textContent = "Two laps done. Each skater spent one bend-pair in each lane, so they covered exactly the same distance. That's why skaters race the clock, not just each other."; })(t0);
  });
  place(0);
}

const DIST = [["500 m","Sprint","About 34 seconds for the best men: one lap and a bit, all-out from the start."],["1000 m","Sprint","Two and a half laps."],["1500 m","Middle","Three and three-quarter laps; often called the toughest race."],["5000 m","Long","12.5 laps of rhythm and pacing."],["10,000 m","Long","25 laps, the men's longest race. Women's long distances are 3000 m and 5000 m."],["Mass start","Pack","16 laps with everyone at once, and points for intermediate sprints and the finish."]];
const CLOCK = [
  {k:"draw", cls:"half", t:"Pairs", s:"Draw", info:["The pairing","Skaters race two at a time, in pairs drawn by ranking, with the strongest skaters usually in the last pairs."]},
  {k:"start", cls:"half", t:"Start", s:"Ready, gun", info:["The start","Skaters hold still in the 'ready' position before the gun. False starts are strictly limited, and breaking the rule means disqualification."]},
  {k:"race", cls:"q", t:"Race", s:"Lane changes", info:["The race","Skaters swap lanes every lap on the crossing straight. Their split times show how they're doing against the leader."]},
  {k:"results", cls:"ot", t:"Results", s:"Fastest time", info:["Results","After all pairs have raced, the fastest time wins. A skater can lose their pair's race and still win the medal."]}
];
const TRICKY = [
  ["Why do skaters race in pairs if it's against the clock?","The pair races for safety and pacing. Results depend only on time, so the winner might have skated in a completely different pair."],
  ["What's a clap skate?","A skate whose blade is hinged at the toe. It stays on the ice longer during each push, and claps back into place, hence the name."],
  ["Why do skaters swing one arm?","Swinging the arms adds power on the straights. On long races, skaters keep both arms behind their back to save energy."],
  ["Why do they kick a leg at the finish?","Time stops when the blade crosses the line, so stretching a skate forward can save hundredths."],
  ["What's short track?","A different sport on a small 111 m oval inside a hockey rink, where 4 to 6 skaters race in a pack and the first across the line wins."],
  ["What's team pursuit?","Two teams of three start on opposite sides of the oval and race several laps, drafting and taking turns at the front. The time stops when the third skater finishes."]
];
const WORDS = [["Pair","Two skaters racing at the same time."],["Crossing straight","Where skaters swap lanes."],["Clap skate","A skate with a hinged blade."],["Opener","The first 100 m of a sprint."],["Split","The time at each lap, compared to the leader."],["Lap time","The time for one 400 m lap."],["Track record","The fastest time ever on a particular oval."],["Long track","Olympic speed skating on a 400 m oval."]];
const QUIZ = [
  {q:"How long is a long track speed skating lap?", o:["111 m","250 m","400 m","500 m"], a:2, why:"A standard oval is 400 m."},
  {q:"How many skaters race at the same time in most long track events?", o:["1","2","4","8"], a:1, why:"Two, in pairs."},
  {q:"Why do skaters switch lanes every lap?", o:["To rest","So both cover the same distance","It's random","To pass slower skaters"], a:1, why:"Swapping lanes evens out the distance."},
  {q:"Where do skaters switch lanes?", o:["On the finish straight","On the crossing straight","On the bends","Anywhere"], a:1, why:"On the back straight, called the crossing straight."},
  {q:"How is the winner decided in a 1000 m race?", o:["Winning your pair","The fastest time overall","Judges' scores","The most laps"], a:1, why:"The fastest time across all pairs."},
  {q:"What's special about a clap skate?", o:["It's heated","Its blade is hinged at the toe","It has two blades","It's made of wood"], a:1, why:"The hinge keeps the blade on the ice longer."},
  {q:"When does the clock stop at the finish?", o:["When the skater's hand crosses","When the blade crosses the line","When the head crosses","When the judge waves"], a:1, why:"The skate blade decides, so skaters kick a leg forward."},
  {q:"In the mass start, how is it scored?", o:["By time","By points for sprints and the finish","By judges","By laps led"], a:1, why:"Points for intermediate sprints and finishing order."},
  {q:"What's short track?", o:["A 500 m race","Pack racing on a small 111 m oval","A youth event","Racing on a frozen lake"], a:1, why:"A separate sport in a hockey-rink-sized oval."},
  {q:"How many laps is the men's 10,000 m?", o:["10","20","25","40"], a:2, why:"Twenty-five laps of 400 m."}
];

function render(app){
  app.innerHTML = sportHero({id:"speed-skating", name:"Speed skating", alt:"The tabby cat in a blue skin suit, crouched low on long-blade skates",
      lede:"Skaters race around a 400 m ice oval on long, thin blades, two at a time. They swap lanes every lap so both skate the same distance, and the fastest time over all the pairs wins. It's a race against the clock as much as against your partner.",
      facts:[["400","meters per lap"],["2","skaters race at a time"],["2","lanes, swapped every lap"],["60+","km/h at top speed in sprints"]]})
    + jumpNav([["ss-oval","The oval"],["ss-lanes","Lane changes"],["ss-dist","Distances"],["ss-clock","A race"],["ss-tricky","Tricky rules"],["ss-words","Words you'll hear"],["ss-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("ss-oval","The oval","Tap any part of the oval to see what it does.",`<div class="fieldbox" id="ssOval">${ovalSVG()}</div><div class="fieldrow"><div class="zonechips" id="ssChips"></div><div class="infopanel" id="ssInfo" aria-live="polite"></div></div>`)
    + section("ss-lanes","Watch the lane change","Start two laps and watch the skaters swap lanes on the crossing straight.",
        `<div class="oslab"><div class="fieldbox"><svg viewBox="100 0 700 400" role="img" aria-label="Two skaters changing lanes">${ovalBase()}<g id="lsA"><circle r="11" fill="#2F6FD6" stroke="${INK}" stroke-width="2.5"/><text y="4" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="12" fill="#fff">A</text></g><g id="lsB"><circle r="11" fill="#D9342B" stroke="${INK}" stroke-width="2.5"/><text y="4" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="12" fill="#fff">B</text></g></svg></div>
          <div class="osside"><div class="osverdict"><span class="verdict on" id="lsLap">Ready</span></div><div class="narrator"><img src="${img("head.webp")}" alt=""><p id="lsMsg">Blue line: inner lane. Red dashes: outer lane.</p></div><div class="controls"><button class="btn primary" id="lsGo" type="button">Skate two laps</button></div></div></div>`)
    + section("ss-dist","Distances","",`<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${DIST.map(([n,k,t]) => `<div class="score"><div class="pts" style="font-size:1.8rem">${n}</div><h3>${k}</h3><p>${t}</p></div>`).join("")}</div>`)
    + section("ss-clock","A race","Tap a part of the race to learn more.",`<div class="timeline" id="ssTimeline"></div><div class="infopanel" id="ssClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("ss-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="ssFlips"></div>`)
    + section("ss-words","Words you'll hear","",`<dl class="gloss" id="ssGloss"></dl>`)
    + section("ss-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="ssQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the ISU for long track speed skating. Short track speed skating is a separate discipline with pack racing and different rules.</footer></div>`;
  setupZones(document.getElementById("ssOval"), document.getElementById("ssChips"), document.getElementById("ssInfo"), ZONES, ZONE_ORDER, "cross");
  laneDemo();
  setupTimeline(document.getElementById("ssTimeline"), document.getElementById("ssClockInfo"), CLOCK, "Ice temperature and air pressure matter: high-altitude ovals produce the fastest times.");
  flipCards(document.getElementById("ssFlips"), TRICKY); glossary(document.getElementById("ssGloss"), WORDS);
  makeQuiz(document.getElementById("ssQuiz"), QUIZ, ["Track record! Watch a race and spot the lane changes.","Fast lap. Watch the lane-change animation again to lock it in.","Look over the oval and distances again, then come back.","No worries. Start with the oval diagram, then try again."]);
}
SPORT_PAGES["speed-skating"] = {render};
})();

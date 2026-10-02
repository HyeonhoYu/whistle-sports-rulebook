/* Swimming. Rules follow World Aquatics (formerly FINA) competition rules for pool swimming. */
(function(){

const W = "#F4F6F1", INK = "#18221D", WATER = "#3C8DC4", WATER2 = "#4A99CF";
/* 50 m pool, 8 lanes, 16 units per meter: 800 x 400. Start end on the left. */
function poolLines(){
  let s = `<rect x="-60" y="-50" width="920" height="500" fill="#D9DED6"/><rect width="800" height="400" fill="${WATER}"/>`;
  for(let i=0;i<8;i++){ const y = i*50 + 25;
    s += `<rect y="${i*50}" width="800" height="50" fill="${i%2 ? WATER2 : WATER}"/>`;
    s += `<path d="M32 ${y}H768M32 ${y-8}v16M768 ${y-8}v16" stroke="#1E4E73" stroke-width="5"/>`; }
  for(let i=1;i<8;i++){ const y = i*50;
    s += `<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="#fff" stroke-width="6" stroke-dasharray="6 6"/>`;
    s += `<line x1="0" y1="${y}" x2="80" y2="${y}" stroke="#D9342B" stroke-width="6" stroke-dasharray="6 6"/><line x1="720" y1="${y}" x2="800" y2="${y}" stroke="#D9342B" stroke-width="6" stroke-dasharray="6 6"/>`;
    s += `<circle cx="240" cy="${y}" r="5" fill="#F2C230"/><circle cx="560" cy="${y}" r="5" fill="#F2C230"/>`; }
  s += `<line x1="80" y1="-12" x2="80" y2="412" stroke="#F2C230" stroke-width="2"/><line x1="720" y1="-12" x2="720" y2="412" stroke="#F2C230" stroke-width="2"/>`;
  [80,720].forEach(x => { for(let k=0;k<20;k++) s += `<path d="M${x-6+0} ${-12+k*22}l6 10 6 -10z" fill="${k%2 ? "#fff" : "#D9342B"}"/>`; });
  s += `<rect x="-6" y="0" width="6" height="400" fill="#F2C230"/><rect x="800" y="0" width="6" height="400" fill="#F2C230"/>`;
  for(let i=0;i<8;i++) s += `<rect x="-40" y="${i*50+10}" width="34" height="30" rx="4" fill="#5E6B64"/><text x="-23" y="${i*50+31}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="18" fill="#fff">${i+1}</text>`;
  return s;
}
function poolSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-60 -50 920 500" role="img" aria-label="Competition pool seen from above">${poolLines()}
    <line x1="240" y1="-30" x2="240" y2="430" stroke="${INK}" stroke-width="2" stroke-dasharray="10 6" opacity=".6"/>
    <text x="240" y="-34" text-anchor="middle" font-family="Barlow,sans-serif" font-size="14" fill="${INK}">15 m</text><text x="80" y="-34" text-anchor="middle" font-family="Barlow,sans-serif" font-size="14" fill="${INK}">5 m</text>
    ${r("lanes",90,155,140,90)}${r("lines",250,10,300,30)}${r("ropes",250,44,300,12)}${r("ropes",250,94,300,12)}
    ${r("center",250,150,300,100)}${r("fifteen",228,-30,24,460)}${r("fifteen",548,-12,24,424)}
    ${r("flags",70,-14,20,428)}${r("flags",710,-14,20,428)}${r("pads",-8,0,14,400)}${r("pads",794,0,14,400)}${r("blocks",-44,0,40,400)}</svg>`;
}
const ZONES = {
  blocks:{title:"Starting blocks", text:"Swimmers dive from these at the start of freestyle, breaststroke, and butterfly races. Backstrokers start in the water, holding grips on the block."},
  pads:{title:"Touchpads", text:"Pressure-sensitive pads on the end walls stop each swimmer's clock when they touch, timing to a hundredth of a second. They also check relay takeoffs."},
  flags:{title:"Backstroke flags", text:"A line of flags 5 m from each wall. Backstrokers can't see the wall, so they count strokes from the flags to time their turn and finish."},
  fifteen:{title:"15-meter marks", text:"After the start and each turn, swimmers may stay underwater for at most 15 m in freestyle, backstroke, and butterfly; the head must break the surface by then. It's also where the false-start rope hangs in some pools."},
  ropes:{title:"Lane ropes", text:"Floating ropes that separate lanes and calm the waves. They change color near the walls. Pulling on a lane rope to gain speed is a disqualification."},
  lines:{title:"Lane lines on the bottom", text:"The dark line in the middle of each lane, ending in a T near each wall, helps swimmers stay straight and judge when the wall is coming."},
  center:{title:"Center lanes", text:"In heats and finals, the fastest qualifier swims in lane 4, then lane 5, 3, 6, 2, 7, 1, and 8. The middle lanes get the calmest water and the best view of rivals."},
  lanes:{title:"The pool", text:"Olympic pools are 50 m long, called long course. Short-course pools are 25 m. Records are kept separately for each, since more turns make 25 m pools faster."}
};
const ZONE_ORDER = ["blocks","pads","flags","fifteen","ropes","lines","center","lanes"];

/* Race simulator: 100 m = two lengths. */
const EVENTS = {
  free:{name:"100 m freestyle", base:47.4, dq:["Lane 7 is disqualified: the swimmer stayed underwater past the 15 m mark after the turn.","Lane 2 is disqualified: the swimmer missed touching the wall on the turn."]},
  back:{name:"100 m backstroke", base:52.1, dq:["Lane 6 is disqualified: the swimmer rolled past vertical onto the stomach before touching the finish wall.","Lane 1 is disqualified: the swimmer surfaced past the 15 m mark after the start."]},
  breast:{name:"100 m breaststroke", base:57.9, dq:["Lane 3 is disqualified: the swimmer touched the wall at the turn with only one hand.","Lane 8 is disqualified: the swimmer used a flutter kick instead of the breaststroke kick."]},
  fly:{name:"100 m butterfly", base:50.3, dq:["Lane 5 is disqualified: the swimmer touched the finish with one hand instead of two at the same time.","Lane 2 is disqualified: the swimmer's arms didn't move together over the water."]}
};
const SEED_ORDER = [4,5,3,6,2,7,1,8];
function raceSim(){
  const $ = id => document.getElementById(id); let ev = "free", raf = null;
  const pick = k => { ev = k; document.querySelectorAll("[data-ev]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ev === k)); };
  function lanesSVG(){
    return `<svg viewBox="-60 -50 920 500" role="img" aria-label="Race in progress">${poolLines()}
      ${Array.from({length:8}, (_,i) => `<g class="swimmer" id="sw${i+1}"><circle r="12" fill="${i === 3 ? "#F2C230" : "#fff"}" stroke="${INK}" stroke-width="2.5"/><text y="5" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="14" fill="${INK}">${i+1}</text></g>`).join("")}</svg>`;
  }
  $("rcPool").innerHTML = lanesSVG();
  const place = (lane, x) => { $(`sw${lane}`).setAttribute("transform", `translate(${x} ${(lane-1)*50+25})`); };
  for(let l=1;l<=8;l++) place(l, -4);
  function run(){
    cancelAnimationFrame(raf);
    const E = EVENTS[ev];
    const seeds = SEED_ORDER.map((lane,k) => ({lane, seed: E.base + k*.18 + Math.random()*.1}));
    const fs = Math.random() < .15 ? seeds[4 + Math.floor(Math.random()*4)].lane : 0;
    const res = seeds.filter(s => s.lane !== fs).map(s => ({lane:s.lane, t: Math.round((s.seed + (Math.random() - .5)*1.6)*100)/100}));
    const dqLine = Math.random() < .3 ? pickOne(E.dq) : "";
    const dqLane = dqLine ? +dqLine.match(/Lane (\d)/)[1] : 0;
    for(let l=1;l<=8;l++){ place(l, -4); $(`sw${l}`).style.opacity = l === fs ? .25 : 1; }
    $("rcBtn").disabled = true;
    $("rcMsg").textContent = fs ? `Lane ${fs} moved before the start signal. One-start rule: that swimmer is disqualified, and the race goes on without them.` : (ev === "back" ? "Backstrokers start in the water, holding the block. Take your marks..." : "Take your marks... beep!");
    const slow = Math.max(...res.map(r => r.t)), dur = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 7000, t0 = performance.now();
    (function step(now){
      const k = Math.min(1, (now - t0)/dur), raceT = k * slow;
      res.forEach(r => { const f = Math.min(1, raceT / r.t); const d = f * 2; place(r.lane, d <= 1 ? d*800 : (2 - d)*800); });
      if(k < 1){ raf = requestAnimationFrame(step); return; }
      const sorted = res.slice().sort((a,b) => a.t - b.t), valid = sorted.filter(r => r.lane !== dqLane);
      let pl = 0;
      const rows = valid.map((r,i) => { if(!i || r.t !== valid[i-1].t) pl = i + 1; return `<tr><td>${pl}</td><td>Lane ${r.lane}</td><td>${r.t.toFixed(2)}</td></tr>`; });
      const dqRows = [fs ? `<tr class="dq"><td>DQ</td><td>Lane ${fs}</td><td>False start</td></tr>` : "", dqLane ? `<tr class="dq"><td>DQ</td><td>Lane ${dqLane}</td><td>Stroke or turn violation</td></tr>` : ""].join("");
      $("rcTable").innerHTML = `<table class="rctab"><thead><tr><th>Place</th><th>Lane</th><th>Time</th></tr></thead><tbody>${rows.join("")}${dqRows}</tbody></table>`;
      const win = valid[0];
      let msg = `Lane ${win.lane} wins in ${win.t.toFixed(2)} seconds.` + (win.lane === 4 ? " The top seed in lane 4 held on." : fs === 4 || dqLane === 4 ? "" : " An upset: the top seed in lane 4 didn't win.");
      const tie = valid.some((r,i) => i && valid[i-1].t === r.t);
      if(tie) msg += " Two swimmers touched at exactly the same hundredth, so they share the place.";
      if(dqLine) msg += ` ${dqLine}`;
      $("rcMsg").textContent = msg; $("rcBtn").disabled = false;
      for(let l=1;l<=8;l++) if(l === dqLane) $(`sw${l}`).style.opacity = .25;
    })(t0);
  }
  document.querySelectorAll("[data-ev]").forEach(b => b.addEventListener("click", () => pick(b.dataset.ev)));
  $("rcBtn").addEventListener("click", run);
  pick("free");
}

/* Stroke cards with a side-view swimmer sketch */
const sv = body => `<svg viewBox="0 0 200 100" aria-hidden="true"><rect width="200" height="100" fill="${WATER}"/><path d="M0 40q12 -6 25 0t25 0t25 0t25 0t25 0t25 0t25 0t25 0V0H0z" fill="#D9E9F4"/>${body}</svg>`;
const swimmer = (x, y, back, arm) => `<g transform="translate(${x} ${y})${back ? " scale(1 -1)" : ""}" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"><ellipse cx="0" cy="0" rx="34" ry="8" fill="#F7A23B"/><circle cx="40" cy="${back ? 0 : -2}" r="8" fill="#F7A23B"/>${arm}</g>`;
const STROKES = [
  {name:"Freestyle", text:"Any stroke is allowed; almost everyone uses the front crawl. Some part of the swimmer must touch the wall at each turn and the finish.", art: sv(swimmer(100,44,false,'<path d="M20 -6q20 -30 46 -8"/><path d="M-30 4l-14 6"/>'))},
  {name:"Backstroke", text:"Swum on the back, starting in the water. At a turn, a swimmer may roll onto the front for one continuous turning action, but must be on the back again when leaving the wall.", art: sv(swimmer(100,44,false,'<path d="M24 -6q-6 -34 -44 -16"/><path d="M36 -2l4 -4M44 -2l-4 -4" stroke-width="2"/>'))},
  {name:"Breaststroke", text:"Arms move together, underwater, and legs do a frog-like whip kick together. The head must break the surface every cycle. Turns and finishes need a two-hand touch.", art: sv(swimmer(100,48,false,'<path d="M30 4q16 10 34 0M30 6q16 -6 34 -4"/><path d="M-34 0q-14 -10 -20 4M-34 0q-14 10 -20 -4"/>'))},
  {name:"Butterfly", text:"Both arms swing over the water together, with a dolphin kick, both legs moving together. Turns and finishes need a two-hand touch.", art: sv(swimmer(100,46,false,'<path d="M10 -6q20 -40 54 -10M10 -2q24 -30 54 -4"/><path d="M-34 0q-12 -10 -24 -2"/>'))}
];
const ORDERS = [
  {name:"Individual medley", order:["Butterfly","Backstroke","Breaststroke","Freestyle"], text:"One swimmer swims all four strokes, in this order. Freestyle here means any stroke other than the first three."},
  {name:"Medley relay", order:["Backstroke","Breaststroke","Butterfly","Freestyle"], text:"Four swimmers, one stroke each. Backstroke goes first because it's the only stroke that starts in the water."}
];
const DQS = [
  {name:"False start", text:"Moving before the start signal. One false start and you're out; there's no second chance."},
  {name:"One-hand touch", text:"In breaststroke and butterfly, both hands must touch the wall at the same time at every turn and the finish."},
  {name:"Too far underwater", text:"Staying submerged past 15 m after the start or a turn in freestyle, backstroke, or butterfly."},
  {name:"Wrong kick", text:"A flutter or dolphin kick in breaststroke, except the single dolphin kick allowed after the start and each turn."},
  {name:"Early relay takeoff", text:"A relay swimmer's feet leave the block before the teammate touches the wall. Touchpads catch takeoffs more than 0.03 seconds early."},
  {name:"Using the pool to help", text:"Pulling on a lane rope, or walking on the bottom. Standing in freestyle is allowed; walking is not."}
];

const CLOCK = [
  {k:"heats", cls:"q", t:"Heats", s:"Everyone", info:["Heats","Every entrant swims in a heat. Swimmers are seeded by entry time, and only the fastest times overall move on, no matter which heat they swam in."]},
  {k:"semis", cls:"q", t:"Semis", s:"Top 16", info:["Semifinals","For races up to 200 m at major meets, the 16 fastest swim two semifinals. Longer races go straight from heats to the final."]},
  {k:"final", cls:"ot", t:"Final", s:"Top 8", info:["Final","The eight fastest swim the final, with the top qualifier in lane 4. Medals go to the first three touches."]},
  {k:"swim", cls:"half", t:"Swim-off", s:"If tied", info:["Swim-off","If two swimmers tie for the last spot in a semifinal or final, they race again head to head to decide who advances."]}
];
const TRICKY = [
  ["Why is lane 4 the best lane?","The fastest qualifier is placed in lane 4 so they can see the rivals on both sides. Middle lanes are also away from waves bouncing off the side walls."],
  ["Can swimmers tie?","Yes. Times are official only to the hundredth of a second. At the 2016 Olympics, two swimmers tied for gold in the women's 100 m freestyle."],
  ["Why is there a 15-meter limit?","Swimming underwater with a dolphin kick can be faster than swimming on the surface. The limit keeps races about swimming and limits risky breath-holding."],
  ["Can you stand up in a race?","In freestyle, standing on the bottom doesn't disqualify you, but walking or pushing off the bottom does. In the other strokes, standing breaks the stroke rules."],
  ["Why do backstrokers start in the water?","You can't dive in on your back. So they start in the water, feet on the wall, hands on the block, and push off backward."],
  ["What's a world record in a short pool?","Short-course (25 m) and long-course (50 m) records are kept separately. Short-course times are faster because there are twice as many turns and push-offs."]
];
const WORDS = [
  ["Length","One trip from one end of the pool to the other. A lap often means the same thing, though some use it for there and back."],
  ["Split","The time at a checkpoint during a race, like the first 50 m of a 100 m race."],
  ["Heat","A preliminary race. Places in the next round go to the fastest times across all heats."],
  ["Seed","A swimmer's ranking going into a round, which decides their lane."],
  ["Flip turn","A somersault at the wall used in freestyle and backstroke turns."],
  ["Streamline","The tight, arrow-like body position used off every start and turn."],
  ["Pull-out","The underwater arm pull and kick a breaststroker takes after the start and each turn."],
  ["Anchor","The last swimmer in a relay."],
  ["Touch out","Winning by touching the wall first in a very close finish."],
  ["Long course","A 50 m pool. Short course means a 25 m pool."]
];

const flagsMini = () => `<svg viewBox="560 -30 260 200" style="width:240px;border-radius:8px" aria-hidden="true"><rect x="560" y="-30" width="260" height="200" fill="#D9DED6"/><rect x="560" y="0" width="240" height="170" fill="${WATER}"/>
  <line x1="720" y1="-12" x2="720" y2="170" stroke="#F2C230" stroke-width="2"/>${Array.from({length:9},(_,k) => `<path d="M714 ${-12+k*22}l6 10 6 -10z" fill="${k%2 ? "#fff" : "#D9342B"}"/>`).join("")}<rect x="800" y="0" width="6" height="170" fill="#F2C230"/></svg>`;
const QUIZ = [
  {q:"How long is an Olympic swimming pool?", o:["25 m","50 m","100 m","33 m"], a:1, why:"50 meters, called long course."},
  {q:"A swimmer moves before the start signal. What happens?", o:["Everyone restarts","A warning","Disqualification","A 1-second penalty"], a:2, why:"Under the one-start rule, any false start disqualifies that swimmer."},
  {q:"Which lane does the fastest qualifier swim in?", o:["Lane 1","Lane 4","Lane 8","A random lane"], a:1, why:"Lane 4, then 5, 3, 6, and outward."},
  {q:"What's the order of strokes in the individual medley?", o:["Butterfly, backstroke, breaststroke, freestyle","Freestyle, backstroke, breaststroke, butterfly","Backstroke, breaststroke, butterfly, freestyle","Breaststroke, butterfly, backstroke, freestyle"], a:0, why:"Fly, back, breast, free. The medley relay is different: it starts with backstroke."},
  {q:"Which stroke does the first swimmer in a medley relay swim?", o:["Butterfly","Freestyle","Breaststroke","Backstroke"], a:3, why:"Backstroke, because it starts in the water."},
  {q:"A breaststroker touches the wall at a turn with only one hand. What's the call?", o:["Disqualification","It's legal","A time penalty","A warning"], a:0, why:"Breaststroke and butterfly require a two-hand touch at every turn and the finish."},
  {q:"How far can a freestyler travel underwater after the start?", o:["5 m","10 m","15 m","25 m"], a:2, why:"The head must break the surface by 15 m."},
  {q:"Which stroke starts in the water instead of from a dive?", o:["Freestyle","Backstroke","Butterfly","Breaststroke"], a:1, why:"Backstroke. Swimmers push off the wall on their backs."},
  {q:"What are these flags across the pool for?", visual: flagsMini, o:["Marking the finish line","Showing lane numbers","Warning backstrokers that the wall is close","Marking the false-start rope"], a:2, why:"Backstroke flags hang 5 m from the wall so backstrokers can count strokes to the wall."},
  {q:"A relay swimmer dives in before their teammate touches the wall. What happens?", o:["A time penalty","The swimmer must restart","The team is disqualified","Nothing, it's allowed"], a:2, why:"An early takeoff disqualifies the whole relay team."}
];

function render(app){
  app.innerHTML = sportHero({id:"swimming", name:"Swimming", alt:"The tabby cat in goggles and swim trunks, diving forward",
      lede:"Swimmers race each other in separate lanes over a set distance, using one of four strokes: freestyle, backstroke, breaststroke, or butterfly. The first to touch the wall wins, and judges watch closely to make sure every stroke, turn, and start follows the rules.",
      facts:[["50","meters in an Olympic pool"],["4","strokes"],["8","lanes in a final"],["0.01","seconds: how races are timed"]]})
    + jumpNav([["sw-pool","The pool"],["sw-race","Race"],["sw-strokes","Strokes"],["sw-medley","Medley order"],["sw-dq","Disqualifications"],["sw-clock","Rounds"],["sw-tricky","Tricky rules"],["sw-words","Words you'll hear"],["sw-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("sw-pool","The pool","Tap any part of the pool to see what it does.",
        `<div class="fieldbox" id="swPool">${poolSVG()}</div><div class="fieldrow"><div class="zonechips" id="swChips"></div><div class="infopanel" id="swInfo" aria-live="polite"></div></div>`)
    + section("sw-race","Watch a final","Pick an event and start the final. Lane 4 (yellow) is the top seed. Watch for false starts and disqualifications.",
        `<div class="sim"><div class="controls"><span class="chips">${Object.entries(EVENTS).map(([k,e]) => `<button class="chip" type="button" data-ev="${k}">${e.name}</button>`).join("")}</span></div>
          <div class="fieldbox" id="rcPool"></div>
          <div class="oslab"><div class="osside"><div class="controls"><button class="btn primary" id="rcBtn" type="button">Start the final</button></div>
              <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="rcMsg">Two lengths: down the pool, turn, and back to the start wall.</p></div></div>
            <div id="rcTable"></div></div></div>`)
    + section("sw-strokes","The four strokes","Each stroke has its own rules for arms, legs, turns, and finishes.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr))">${STROKES.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("sw-medley","Medley order","Medley events use all four strokes, but in two different orders.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">${ORDERS.map(o => `<div class="score"><h3>${o.name}</h3><ol class="medley">${o.order.map(x => `<li>${x}</li>`).join("")}</ol><p>${o.text}</p></div>`).join("")}</div>`)
    + section("sw-dq","Disqualifications","Swimming has no penalties: break a rule and you're disqualified. Judges walk the deck to watch strokes and turns.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${DQS.map(d => `<div class="score"><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("sw-clock","Rounds","Big meets narrow the field round by round. Tap a round to learn more.",
        `<div class="timeline" id="swTimeline"></div><div class="infopanel" id="swClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("sw-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="swFlips"></div>`)
    + section("sw-words","Words you'll hear","",`<dl class="gloss" id="swGloss"></dl>`)
    + section("sw-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="swQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow World Aquatics (formerly FINA) pool swimming rules, used at the Olympics. US high school and college meets are similar but often swim in yards.</footer></div>`;

  setupZones(document.getElementById("swPool"), document.getElementById("swChips"), document.getElementById("swInfo"), ZONES, ZONE_ORDER, "center");
  raceSim();
  setupTimeline(document.getElementById("swTimeline"), document.getElementById("swClockInfo"), CLOCK,
    "A 100 m race lasts under a minute for the world's best, so a whole Olympic final can be over before you finish reading the lineup.");
  flipCards(document.getElementById("swFlips"), TRICKY);
  glossary(document.getElementById("swGloss"), WORDS);
  makeQuiz(document.getElementById("swQuiz"), QUIZ, [
    "Gold medal! Watch a final and spot the backstroke flags and 15 m marks.",
    "A strong swim. Watch another race in the simulator to lock in the rules.",
    "Look over the strokes and disqualifications again, then come back for another try.",
    "No worries. Start with the pool diagram and the four strokes, then try again."]);
}

SPORT_PAGES["swimming"] = {render};
})();

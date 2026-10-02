/* Sprinting (100 m, 200 m, 400 m). Rules follow World Athletics. */
(function(){

const W = "#F4F6F1", INK = "#18221D", TRACK = "#C4553F", GRASS = "#2F7546";
/* 400 m track at 6 units per meter. Straights 84.39 m, inner radius 36.5 m, 8 lanes of 1.22 m.
   Runners go counterclockwise: right along the bottom (home) straight to the finish line at its right end. */
const K = 6, S = 84.39*K, CX = 600, CY = 320, CL = CX - S/2, CR = CX + S/2, R0 = 36.5*K, LW = 1.22*K;
const rad = k => R0 + k*LW;
const stadium = r => `M${CL} ${CY+r}L${CR} ${CY+r}A${r} ${r} 0 0 0 ${CR} ${CY-r}L${CL} ${CY-r}A${r} ${r} 0 0 0 ${CL} ${CY+r}Z`;
/* Point on lane n (1-8) measuring line, d meters ahead of the finish line along the running direction. */
function pt(n, d){
  const R = (36.5 + .3 + 1.22*(n-1))*K, L = 2*Math.PI*R/K + 2*84.39; d = ((d % L) + L) % L; const m = d*K, bend = Math.PI*R;
  if(m < bend){ const t = m/R; return [CR + R*Math.sin(t), CY + R*Math.cos(t)]; }
  if(m < bend + S) return [CR - (m - bend), CY - R];
  if(m < 2*bend + S){ const u = (m - bend - S)/R; return [CL - R*Math.sin(u), CY - R*Math.cos(u)]; }
  return [CL + (m - 2*bend - S), CY + R];
}
const laneLen = n => 2*Math.PI*(36.5 + .3 + 1.22*(n-1)) + 2*84.39;
function trackBase(){
  let s = `<rect x="40" y="20" width="1120" height="600" fill="#1C4D2C"/>
    <rect x="${CX - S/2 - 360}" y="${CY + rad(0)}" width="360" height="${8*LW}" fill="${TRACK}"/>
    <path d="${stadium(rad(8))}" fill="${TRACK}"/><path d="${stadium(rad(0))}" fill="${GRASS}"/>`;
  for(let k=0;k<=8;k++) s += `<path d="${stadium(rad(k))}" fill="none" stroke="${W}" stroke-width="1.6"/>`;
  for(let k=0;k<=8;k++) s += `<line x1="${CX - S/2 - 360}" y1="${CY + rad(k)}" x2="${CL}" y2="${CY + rad(k)}" stroke="${W}" stroke-width="1.6"/>`;
  s += `<line x1="${CR}" y1="${CY + rad(0)}" x2="${CR}" y2="${CY + rad(8)}" stroke="${W}" stroke-width="5"/>
    <line x1="${CR - 600}" y1="${CY + rad(0)}" x2="${CR - 600}" y2="${CY + rad(8)}" stroke="#F2C230" stroke-width="4"/>
    <text x="${CR}" y="${CY + rad(8) + 22}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="18" fill="${W}">Finish</text>
    <text x="${CR - 600}" y="${CY + rad(8) + 22}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="18" fill="#F2C230">100 m start</text>
    <rect x="${CR + 30}" y="${CY + rad(8) + 8}" width="34" height="22" rx="4" fill="#2B3831"/><circle cx="${CR + 47}" cy="${CY + rad(8) + 19}" r="6" fill="#9CC7EE"/>`;
  for(let n=1;n<=8;n++) s += `<text x="${CR - 14}" y="${CY + rad(n-1) + LW*.75}" text-anchor="end" font-family="Barlow,sans-serif" font-size="7" fill="${W}">${n}</text>`;
  return s;
}
function trackSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const ring = (z, side) => { const ro = rad(8), ri = rad(0), c = side ? CR : CL, sg = side ? 1 : -1;
    return `<path class="hz" data-zone="${z}" d="M${c} ${CY+ro}A${ro} ${ro} 0 0 ${side ? 0 : 1} ${c} ${CY-ro}L${c} ${CY-ri}A${ri} ${ri} 0 0 ${side ? 1 : 0} ${c} ${CY+ri}Z"/>`; };
  return `<svg viewBox="40 20 1120 600" role="img" aria-label="A 400 m running track seen from above">${trackBase()}
    ${r("infield",CL,CY-rad(0)+10,S,2*rad(0)-20)}${ring("bend",true)}${ring("bend",false)}
    ${r("back",CL,CY-rad(8),S,8*LW)}${r("home",CL,CY+rad(0),S-14,8*LW)}${r("ext",CL-360,CY+rad(0),360,8*LW)}
    ${r("finish",CR-8,CY+rad(0),16,8*LW)}${r("start100",CR-608,CY+rad(0),16,8*LW)}${r("camera",CR+26,CY+rad(8)+4,42,30)}</svg>`;
}
const ZONES = {
  finish:{title:"Finish line", text:"Every sprint ends here, at the end of the home straight. A runner finishes when the torso, not the head, arms, or feet, reaches the near edge of the line."},
  start100:{title:"100 m start", text:"The 100 m is run on one straight line, so all eight runners start side by side, with no stagger."},
  home:{title:"Home straight", text:"The final straight before the finish. Every sprint, from 100 m to 400 m, ends here."},
  ext:{title:"Straight extension", text:"Most tracks extend the home straight past the bend so the 100 m (and the 110 m hurdles) can be run without any curve."},
  bend:{title:"Bends", text:"Runners in the 200 m and 400 m run around curves. Inner lanes have tighter curves, which are harder to run fast. Stepping on or over the line to your left on a bend can get you disqualified."},
  back:{title:"Back straight", text:"The far straight. 400 m runners pass through it at full speed while still running in their own lanes."},
  infield:{title:"Infield", text:"The grass area inside the track, used for throwing events and as a warm-up area for officials and athletes."},
  camera:{title:"Photo-finish camera", text:"A camera in line with the finish takes thousands of images per second. Officials read times from it to a thousandth of a second, then round up to the hundredth."}
};
const ZONE_ORDER = ["finish","start100","home","ext","bend","back","infield","camera"];

/* Stagger explorer */
function staggerSVG(){
  return `<svg viewBox="40 20 1120 600" role="img" aria-label="Start positions by lane">${trackBase()}<g id="stMarks"></g><path id="stPath" fill="none" stroke="#F2C230" stroke-width="4" stroke-dasharray="10 8"/></svg>`;
}
function staggerDemo(){
  const $ = id => document.getElementById(id);
  const MSG = {
    100:"100 m: one straight line, so everyone starts level. No stagger needed.",
    200:"200 m: around one bend, then the home straight. Outer lanes start ahead so every runner covers exactly 200 m. Lane 8 starts about 25 m ahead of lane 1.",
    400:"400 m: one full lap. Outer lanes start much farther ahead, almost 50 m in lane 8, because their lap is longer. It's a fair race; it just looks unfair at the start."
  };
  function draw(dist){
    let marks = "";
    for(let n=1;n<=8;n++){
      let x, y;
      if(dist === 100){ x = CR - 600; y = CY + rad(n-1) + LW/2; }
      else { [x,y] = pt(n, laneLen(n) - dist); }
      marks += `<circle cx="${x}" cy="${y}" r="7" fill="${n === 4 ? "#F2C230" : "#fff"}" stroke="${INK}" stroke-width="2"/><text x="${x}" y="${y + 3}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="9" fill="${INK}">${n}</text>`;
    }
    $("stMarks").innerHTML = marks;
    let d = "";
    if(dist === 100) d = `M${CR - 600} ${CY + rad(3) + LW/2}L${CR} ${CY + rad(3) + LW/2}`;
    else { const steps = 80, from = laneLen(4) - dist; for(let i=0;i<=steps;i++){ const [x,y] = pt(4, from + dist*i/steps); d += `${i ? "L" : "M"}${x} ${y}`; } }
    $("stPath").setAttribute("d", d);
    $("stMsg").textContent = MSG[dist];
    document.querySelectorAll("[data-st]").forEach(b => b.setAttribute("aria-pressed", +b.dataset.st === dist));
  }
  document.querySelectorAll("[data-st]").forEach(b => b.addEventListener("click", () => draw(+b.dataset.st)));
  draw(400);
}

/* Reaction-time start */
function startGame(){
  const $ = id => document.getElementById(id); let phase = "idle", t0 = 0, timers = [], best = null;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const say = (big, cls, msg) => { $("rtBig").textContent = big; $("rtBig").className = `rtbig ${cls||""}`; if(msg !== undefined) $("rtMsg").textContent = msg; };
  function begin(){
    clear(); phase = "marks"; $("rtGo").disabled = false; $("rtBegin").disabled = true;
    say("On your marks", "", "Get into the blocks. Don't move until the gun.");
    timers.push(setTimeout(() => { phase = "set"; say("Set", "", "Hips up, perfectly still..."); 
      timers.push(setTimeout(() => { phase = "gun"; t0 = performance.now(); say("BANG!", "gun");
        timers.push(setTimeout(() => { if(phase === "gun"){ phase = "idle"; say("Too slow", "off", "More than a second and a half. Real sprinters react in under 0.2 seconds."); end(); } }, 1500)); }, 1200 + Math.random()*1800)); }, 1600));
  }
  function end(){ $("rtGo").disabled = true; $("rtBegin").disabled = false; }
  function go(){
    if(phase === "marks" || phase === "set"){ clear(); phase = "idle"; say("False start", "off", "You moved before the gun. Under World Athletics rules, that's an instant disqualification: there's no second chance."); return end(); }
    if(phase !== "gun") return;
    const rt = (performance.now() - t0)/1000; phase = "idle"; clear();
    if(rt < .1){ say("False start", "off", `Reaction time ${rt.toFixed(3)} s. Anything under 0.100 s counts as a guess, because the rules treat it as faster than a human can react. Disqualified.`); return end(); }
    best = best === null ? rt : Math.min(best, rt);
    say(`${rt.toFixed(3)} s`, "on", `${rt < .15 ? "Olympic-final quick!" : rt < .2 ? "Fast. Elite sprinters usually react in 0.12 to 0.18 seconds." : rt < .3 ? "Solid, though the pros would be a stride ahead already." : "A slow getaway. Sprinters train their starts for years."} Best so far: ${best.toFixed(3)} s.`);
    end();
  }
  $("rtBegin").addEventListener("click", begin);
  $("rtGo").addEventListener("click", go);
  if(window.__rtKey) document.removeEventListener("keydown", window.__rtKey);
  window.__rtKey = e => { const b = document.getElementById("rtGo"); if(e.code === "Space" && b && !b.disabled){ e.preventDefault(); go(); } };
  document.addEventListener("keydown", window.__rtKey);
}

/* Photo finish: the torso decides. */
function runner(x, y, headAhead, footAhead, color, label){
  /* x is the front edge of the torso. */
  const sx = x - 8, hipx = x - 30, hx = x + headAhead;
  return `<g stroke-linecap="round" fill="none">
    <path d="M${hipx} ${y + 46}L${x + footAhead} ${y + 84}M${hipx} ${y + 46}L${hipx - 30} ${y + 72}L${hipx - 46} ${y + 64}" stroke="#3A3F3C" stroke-width="7"/>
    <path d="M${sx} ${y + 8}L${sx - 24} ${y + 30}L${sx - 40} ${y + 18}" stroke="#3A3F3C" stroke-width="6"/>
    <path d="M${sx} ${y + 6}L${hipx} ${y + 46}" stroke="${color}" stroke-width="16"/>
    <path d="M${sx} ${y + 6}L${hx - 6} ${y}" stroke="#C9A27A" stroke-width="7"/><circle cx="${hx}" cy="${y - 6}" r="10" fill="#C9A27A" stroke="#3A3F3C" stroke-width="2"/></g>
    <text x="28" y="${y + 40}" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="28" fill="#18221D">${label}</text>`;
}
function photoSVG(runs, reveal){
  const LINE = 300;
  return `<svg viewBox="0 0 460 330" style="width:100%;max-width:520px;border-radius:8px" aria-label="Photo finish">
    <rect width="460" height="330" fill="#E9E4D8"/>${[1,2].map(i => `<line x1="0" y1="${i*110}" x2="460" y2="${i*110}" stroke="#18221D" stroke-width="1" opacity=".25"/>`).join("")}
    <line x1="${LINE}" y1="0" x2="${LINE}" y2="330" stroke="#D9342B" stroke-width="2.5"/>
    ${runs.map((r,i) => runner(LINE + r.t, 22 + i*110, r.h, r.f, ["#2F6FD6","#E08A1E","#7A4FB5"][i], "ABC"[i])).join("")}
    ${reveal ? runs.map((r,i) => `<line x1="${LINE + r.t}" y1="${16 + i*110}" x2="${LINE + r.t}" y2="${84 + i*110}" stroke="#1F8A4C" stroke-width="3" stroke-dasharray="5 3"/>`).join("") : ""}</svg>`;
}
function photoGame(){
  const $ = id => document.getElementById(id); let runs;
  function fresh(){
    const ts = [-14, -6, 2].sort(() => Math.random() - .5);
    runs = ts.map(t => ({t, h: 6 + Math.random()*26, f: Math.random()*40 - 6}));
    $("pfPic").innerHTML = photoSVG(runs, false); $("pfMsg").textContent = "Who crossed the line first? Pick a runner.";
    document.querySelectorAll("[data-pf]").forEach(b => b.disabled = false);
  }
  function pick(i){
    const win = runs.reduce((b,r,k) => r.t > runs[b].t ? k : b, 0);
    $("pfPic").innerHTML = photoSVG(runs, true);
    const lead = runs.reduce((b,r,k) => (r.h + r.t) > (runs[b].h + runs[b].t) ? k : b, 0);
    $("pfMsg").textContent = (i === win ? "Correct! " : "Not quite. ") + `Runner ${"ABC"[win]} wins: the green dashes mark the front of each torso, and that's all that counts.` + (lead !== win ? ` Runner ${"ABC"[lead]}'s head got there first, but heads, arms, and feet don't count.` : "");
    document.querySelectorAll("[data-pf]").forEach(b => b.disabled = true);
  }
  document.querySelectorAll("[data-pf]").forEach(b => b.addEventListener("click", () => pick(+b.dataset.pf)));
  $("pfNew").addEventListener("click", fresh);
  fresh();
}

const RULES = [
  {name:"One false start", text:"Moving before the gun, or reacting faster than 0.100 seconds after it, disqualifies the athlete. Sensors in the blocks measure every reaction."},
  {name:"Stay in your lane", text:"In the 100 m, 200 m, and 400 m, runners must stay in their own lane for the whole race. Stepping on or over the line to the left on a bend can mean disqualification."},
  {name:"Starting blocks", text:"Required for sprints up to 400 m. Runners must have both hands and one knee touching the ground at 'On your marks,' and both feet in the blocks."},
  {name:"Torso finish", text:"The finish is judged by the torso. Sprinters dip their chest at the line to get it across a few hundredths sooner."},
  {name:"Wind gauge", text:"For the 100 m and 200 m, wind is measured. A tailwind above 2.0 meters per second doesn't change the result, but the time can't count as a record."},
  {name:"Relay baton", text:"In the 4 x 100 m relay, the baton must change hands inside a 30 m exchange zone. Dropping it isn't a disqualification if the runner who dropped it picks it up without getting in anyone's way."}
];
const CLOCK = [
  {k:"marks", cls:"half", t:"Marks", s:"Get ready", info:["On your marks","Runners step forward and settle into their blocks, hands behind the line."]},
  {k:"set", cls:"half", t:"Set", s:"Hold still", info:["Set","Runners raise their hips and hold perfectly still. Any movement now can be called a false start."]},
  {k:"gun", cls:"half", t:"Gun", s:"Go", info:["The gun","The starter fires. The clock starts, and sensors in the blocks check that nobody reacted in under 0.100 seconds."]},
  {k:"race", cls:"q", t:"The race", s:"10 to 45 s", info:["The race","About 10 seconds for the 100 m, 20 for the 200 m, and 45 for the 400 m at the top level."]},
  {k:"photo", cls:"ot", t:"Photo", s:"Results", info:["Photo finish","Officials read the photo-finish image to place every runner by torso, then post official times to the hundredth."]}
];
const TRICKY = [
  ["Why do outer lanes start ahead in the 200 m and 400 m?","Outer lanes go around a wider curve, so they're longer. The staggered start makes sure everyone runs exactly the same distance."],
  ["Why 0.100 seconds?","Studies of reaction time led the rules to treat anything faster than a tenth of a second as anticipating the gun, not reacting to it."],
  ["Why don't some fast times count as records?","If the tailwind is stronger than 2.0 m/s in the 100 m or 200 m, the wind helped too much. The result stands, but the time can't be a record."],
  ["What if two runners tie?","Photo-finish images are read to the thousandth of a second, so ties are rare. If two are truly tied for a qualifying spot, both may advance, or it's decided by drawing lots."],
  ["Which lanes are best?","In finals the fastest qualifiers get the middle lanes, usually 3 through 6. Lane 1 has the tightest curve, and lane 8 can't see anyone behind them."],
  ["Can you win by leaning?","Yes, in a sense. The dip at the line pushes the torso forward without breaking stride, and in a close race it can decide the medals."]
];
const WORDS = [
  ["Blocks","The adjustable footrests sprinters push off at the start."],
  ["Reaction time","The time between the gun and the runner's first push against the blocks."],
  ["Drive phase","The first 20 to 30 meters, when sprinters stay low and push hard to accelerate."],
  ["Top speed","Reached around 60 meters into a 100 m race. The best men run over 40 km/h (25 mph)."],
  ["Dip","Leaning the chest forward at the finish line."],
  ["Stagger","The different starting spots for each lane in races with bends."],
  ["Photo finish","The finish-line camera image used to place runners and set times."],
  ["Tailwind","Wind blowing in the runners' direction. Measured in meters per second."],
  ["PB","Personal best: an athlete's fastest-ever time."],
  ["Anchor","The last runner in a relay."]
];
const QUIZ = [
  {q:"How many false starts can a sprinter make before being disqualified?", o:["One warning, then out","None: the first false start disqualifies","Two","There's no limit"], a:1, why:"One false start and you're out, under World Athletics rules."},
  {q:"A sprinter reacts 0.08 seconds after the gun. What's the call?", o:["A great start","A time penalty","A false start","A restart with a warning"], a:2, why:"Reactions under 0.100 s are treated as anticipating the gun, so it's a false start."},
  {q:"What part of the body decides the finish?", o:["The torso","The head","The foot","An outstretched hand"], a:0, why:"Only the torso counts. Heads, arms, legs, and feet don't."},
  {q:"Which runner wins this photo finish?", visual:() => photoSVG([{t:-10,h:30,f:20},{t:2,h:6,f:-4},{t:-4,h:14,f:36}], false), o:["A","B","C","It's a tie"], a:1, why:"B's torso is farthest across the line. A's head and C's foot are ahead, but they don't count."},
  {q:"Why do runners in outer lanes start ahead in the 400 m?", o:["To give the fastest runners an edge","So everyone runs the same distance","Lanes are assigned by lottery","Only to avoid collisions"], a:1, why:"Outer lanes are longer around the bends, so the stagger evens out the distance."},
  {q:"A 100 m race is run with a +2.6 m/s tailwind. What happens to the times?", o:["The race is rerun","The times don't count at all","The results stand, but no records","The times are adjusted"], a:2, why:"Above +2.0 m/s, results stand but times aren't eligible for records."},
  {q:"What are the starter's commands, in order?", o:["Ready, set, go","On your marks, set, then the gun","Set, on your marks, go","The gun, set, go"], a:1, why:"On your marks, set, and then the gun fires."},
  {q:"A 200 m runner steps over the line to their left on the bend. What can happen?", o:["They can be disqualified","Nothing, it's allowed","A time penalty","They must restart"], a:0, why:"Running on or over the inside line on a bend can lead to disqualification."},
  {q:"In a final, where do the fastest qualifiers usually run?", o:["Lanes 1 and 2","The middle lanes","Lanes 7 and 8","Lanes are drawn at random"], a:1, why:"The top qualifiers are placed in the middle lanes, usually 3 to 6."},
  {q:"In the 4 x 100 m relay, where must the baton change hands?", o:["Anywhere on the track","Only on the final straight","Inside the 30 m exchange zone","Within 10 m of the finish"], a:2, why:"The baton must be passed within the 30 m exchange zone."}
];

function render(app){
  app.innerHTML = sportHero({id:"sprinting", name:"Sprinting", alt:"The tabby cat crouched in starting blocks on a red running track",
      lede:"The shortest, fastest races in track and field: 100 m, 200 m, and 400 m. Runners start from blocks, each in their own lane, and race all-out to the finish line. The rules are few but strict, starting with the false start.",
      facts:[["1","false start and you're out"],["0.100","seconds: the fastest legal reaction"],["8","lanes in a final"],["2.0","m/s: the wind limit for records"]]})
    + jumpNav([["sp-track","The track"],["sp-start","React to the gun"],["sp-stagger","Staggered starts"],["sp-photo","Photo finish"],["sp-rules","Key rules"],["sp-clock","The race"],["sp-tricky","Tricky rules"],["sp-words","Words you'll hear"],["sp-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("sp-track","The track","Tap any part of the track to see what it does. Runners go counterclockwise.",
        `<div class="fieldbox" id="spTrack">${trackSVG()}</div><div class="fieldrow"><div class="zonechips" id="spChips"></div><div class="infopanel" id="spInfo" aria-live="polite"></div></div>`)
    + section("sp-start","React to the gun","Press start, wait for the commands, and hit Go (or the space bar) the moment the gun fires. Too early, and you're out.",
        `<div class="rtpanel"><div class="rtbig" id="rtBig">Ready?</div>
          <div class="controls" style="justify-content:center"><button class="btn" id="rtBegin" type="button">Start</button><button class="btn primary rtgo" id="rtGo" type="button" disabled>Go!</button></div></div>
        <div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="rtMsg">Elite sprinters react in about 0.12 to 0.18 seconds.</p></div>`)
    + section("sp-stagger","Staggered starts","Pick a race to see where each lane starts. The yellow dashes follow lane 4 to the finish.",
        `<div class="fieldbox">${staggerSVG()}</div>
        <div class="controls" style="margin-top:12px"><span class="chips"><button class="chip" type="button" data-st="100">100 m</button><button class="chip" type="button" data-st="200">200 m</button><button class="chip" type="button" data-st="400">400 m</button></span></div>
        <div class="result narrator" style="margin-top:12px"><img src="${img("head.webp")}" alt=""><p id="stMsg"></p></div>`)
    + section("sp-photo","Read the photo finish","The red line is the finish. Who won?",
        `<div class="oslab"><div id="pfPic"></div>
          <div class="osside"><div class="controls"><button class="btn" data-pf="0" type="button">Runner A</button><button class="btn" data-pf="1" type="button">Runner B</button><button class="btn" data-pf="2" type="button">Runner C</button></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="pfMsg"></p></div>
            <div class="controls"><button class="btn primary" id="pfNew" type="button">New photo</button></div></div></div>`)
    + section("sp-rules","Key rules","Sprint rules are few, but they're enforced with sensors and cameras.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${RULES.map(d => `<div class="score"><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("sp-clock","The race","Tap a moment to learn what happens.",
        `<div class="timeline" id="spTimeline"></div><div class="infopanel" id="spClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("sp-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="spFlips"></div>`)
    + section("sp-words","Words you'll hear","",`<dl class="gloss" id="spGloss"></dl>`)
    + section("sp-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="spQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow World Athletics, used at the Olympics and World Championships. School and youth meets sometimes allow one false start per race before disqualifying.</footer></div>`;

  setupZones(document.getElementById("spTrack"), document.getElementById("spChips"), document.getElementById("spInfo"), ZONES, ZONE_ORDER, "finish");
  startGame(); staggerDemo(); photoGame();
  setupTimeline(document.getElementById("spTimeline"), document.getElementById("spClockInfo"), CLOCK,
    "Big championships run heats, semifinals, and a final, often over two or three days.");
  flipCards(document.getElementById("spFlips"), TRICKY);
  glossary(document.getElementById("spGloss"), WORDS);
  makeQuiz(document.getElementById("spQuiz"), QUIZ, [
    "Gold! Watch a 100 m final and see if you can spot the dip at the line.",
    "Fast time. Try the reaction game again and see if you can beat 0.150 s.",
    "Look over the key rules and the photo finish again, then come back for another try.",
    "No worries. Start with the track diagram and the reaction game, then try again."]);
}

SPORT_PAGES["sprinting"] = {render};
})();

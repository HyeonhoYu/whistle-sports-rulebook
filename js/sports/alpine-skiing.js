/* Alpine skiing. Rules follow FIS International Ski Competition Rules (World Cup and Olympics). */
(function(){

const SNOW = "#F3F7FA", INK = "#18221D", RED = "#D9342B", BLUE = "#2F6FD6";
/* Course builder: the course runs left (start) to right (finish), gates alternate sides. */
const DISC = {
  dh:{name:"Downhill", gates:8, amp:46, runs:"One run", speed:"Fastest: over 130 km/h (80 mph)", turns:"Few, wide, sweeping turns and big jumps", extra:"Skiers get official training runs on the course in the days before the race.", tech:false},
  sg:{name:"Super-G", gates:14, amp:80, runs:"One run", speed:"Very fast, but slower than downhill", turns:"More turns than downhill, set wider than giant slalom", extra:"No training runs: skiers only inspect the course on foot, then race it once.", tech:false},
  gs:{name:"Giant slalom", gates:22, amp:105, runs:"Two runs on different courses, times added", speed:"Medium speed, long carved turns", turns:"Many round turns through wide gates", extra:"The second run is set fresh the same day, and the top 30 start in reverse order.", tech:true},
  sl:{name:"Slalom", gates:40, amp:62, runs:"Two runs on different courses, times added", speed:"Slowest, but the quickest turns", turns:"Tight, rapid turns through single poles", extra:"Skiers knock the poles aside with shin guards and pole guards as they pass. Straddling a pole is a disqualification.", tech:true}
};
function courseSVG(){
  return `<svg viewBox="0 0 1000 380" role="img" aria-label="Course layout" id="csSvg"><rect width="1000" height="380" fill="${SNOW}"/>
    ${Array.from({length:22},(_,i) => `<path d="M${20 + i*46} ${18 + (i%3)*4}l8 -16 8 16z" fill="#2F7546"/><path d="M${20 + i*46} ${358 - (i%3)*4}l8 -16 8 16z" fill="#2F7546"/>`).join("")}
    <rect x="18" y="140" width="34" height="100" rx="6" fill="#2B3831"/><text x="35" y="196" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="16" fill="#fff" transform="rotate(-90 35 190)">START</text>
    <rect x="950" y="110" width="12" height="160" fill="${RED}"/><text x="944" y="100" text-anchor="end" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="18" fill="${INK}">FINISH</text>
    <path id="csLine" fill="none" stroke="#7A8C81" stroke-width="3" stroke-dasharray="8 6"/><g id="csGates"></g></svg>`;
}
function courseDemo(){
  const $ = id => document.getElementById(id);
  function draw(k){
    const D = DISC[k], n = D.gates, x0 = 80, x1 = 920;
    let gates = "";
    const pts = Array.from({length:n}, (_,i) => { const x = x0 + (x1 - x0)*(i + .5)/n, side = i%2 ? 1 : -1; return [x, 190 + side*D.amp, side]; });
    pts.forEach(([x,y,side],i) => {
      const c = (k === "sl" || k === "gs") ? (i%2 ? BLUE : RED) : RED;
      if(k === "sl") gates += `<line x1="${x}" y1="${y - 13}" x2="${x}" y2="${y + 13}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
      else gates += `<rect x="${x - 5}" y="${y - 40}" width="10" height="18" rx="2" fill="${c}"/><rect x="${x - 5}" y="${y + 22}" width="10" height="18" rx="2" fill="${c}"/><line x1="${x}" y1="${y - 22}" x2="${x}" y2="${y + 22}" stroke="${c}" stroke-width="1" stroke-dasharray="3 4" opacity=".5"/>`;
    });
    const line = [[52,190], ...pts.map(([x,y,side]) => [x, k === "sl" ? y + side*20 : y]), [950,190]];
    let path = `M${line[0][0]} ${line[0][1]}`;
    for(let i=0;i<line.length-1;i++){
      const p0 = line[Math.max(0,i-1)], p1 = line[i], p2 = line[i+1], p3 = line[Math.min(line.length-1,i+2)];
      path += `C${p1[0] + (p2[0]-p0[0])/6} ${p1[1] + (p2[1]-p0[1])/6} ${p2[0] - (p3[0]-p1[0])/6} ${p2[1] - (p3[1]-p1[1])/6} ${p2[0]} ${p2[1]}`;
    }
    $("csGates").innerHTML = gates; $("csLine").setAttribute("d", path);
    $("csInfo").innerHTML = `<h3>${D.name}</h3><dl class="csstats"><div><dt>Runs</dt><dd>${D.runs}</dd></div><div><dt>Speed</dt><dd>${D.speed}</dd></div><div><dt>Turns</dt><dd>${D.turns}</dd></div></dl><p>${D.extra}</p>`;
    document.querySelectorAll("[data-cs]").forEach(b => b.setAttribute("aria-pressed", b.dataset.cs === k));
  }
  document.querySelectorAll("[data-cs]").forEach(b => b.addEventListener("click", () => draw(b.dataset.cs)));
  draw("gs");
}

/* Two-run race: giant slalom with 10 skiers. */
function raceSim(){
  const $ = id => document.getElementById(id); const N = 10;
  let S;
  const fmt = t => t == null ? "" : t === "DNF" ? "DNF" : `${Math.floor(t/60)}:${(t%60).toFixed(2).padStart(5,"0")}`;
  function reset(){
    const skill = Array.from({length:N}, (_,i) => i*.12 + Math.random()*.9);
    S = {phase:"ready", sk: skill.map((s,i) => ({bib:i+1, s, r1:null, r2:null})), order:[], i:0};
    $("asMsg").textContent = "Ten skiers, giant slalom. Start run 1 to see everyone's first time.";
    draw();
  }
  function run1(){
    S.sk.forEach(k => { k.r1 = Math.random() < .12 ? "DNF" : Math.round((72 + k.s + Math.random()*.8)*100)/100; });
    const ok = S.sk.filter(k => k.r1 !== "DNF").sort((a,b) => a.r1 - b.r1);
    S.order = ok.slice().reverse(); S.phase = "run2"; S.i = 0;
    const dnf = S.sk.filter(k => k.r1 === "DNF").length;
    $("asMsg").textContent = `Run 1 done. Bib ${ok[0].bib} leads.${dnf ? ` ${dnf} skier${dnf > 1 ? "s" : ""} didn't finish and ${dnf > 1 ? "are" : "is"} out.` : ""} In run 2, the qualifiers start in reverse order, so the leader goes last.`;
    draw();
  }
  const total = k => k.r1 === "DNF" || k.r2 === "DNF" || k.r2 == null ? null : Math.round((k.r1 + k.r2)*100)/100;
  function next(){
    const k = S.order[S.i]; if(!k) return;
    k.r2 = Math.random() < .08 ? "DNF" : Math.round((71.5 + k.s + Math.random()*.9)*100)/100;
    const done = S.sk.filter(x => total(x) != null && x !== k).sort((a,b) => total(a) - total(b));
    const lead = done[0], t = total(k);
    let msg;
    if(k.r2 === "DNF") msg = `Bib ${k.bib} skis out of the course in run 2. DNF: the run 1 time no longer counts.`;
    else if(!lead || t < total(lead)) msg = `Bib ${k.bib} goes into the lead with a combined ${fmt(t)}${lead ? `, ${(total(lead) - t).toFixed(2)} ahead of bib ${lead.bib}` : ""}. Green light!`;
    else msg = `Bib ${k.bib} finishes ${(t - total(lead)).toFixed(2)} behind the leader, bib ${lead.bib}.`;
    S.i++;
    if(S.i >= S.order.length){ S.phase = "done"; const pod = S.sk.filter(x => total(x) != null).sort((a,b) => total(a) - total(b)).slice(0,3);
      msg += ` That's the race. Podium: ${pod.map((p,j) => `${["gold","silver","bronze"][j]}, bib ${p.bib}`).join("; ")}.`; }
    $("asMsg").textContent = msg; draw(k.bib);
  }
  function draw(hl){
    const rows = S.sk.slice().sort((a,b) => {
      const ta = total(a), tb = total(b);
      if(ta != null && tb != null) return ta - tb; if(ta != null) return -1; if(tb != null) return 1;
      const ra = a.r1 === "DNF" ? 1e9 : a.r1 ?? 1e8, rb = b.r1 === "DNF" ? 1e9 : b.r1 ?? 1e8; return ra - rb; });
    let pos = 0;
    $("asBoard").innerHTML = `<table class="rctab"><thead><tr><th>Pos</th><th>Bib</th><th>Run 1</th><th>Run 2</th><th>Total</th></tr></thead><tbody>${rows.map(k => {
      const t = total(k), out = k.r1 === "DNF" || k.r2 === "DNF";
      if(t != null) pos++;
      return `<tr class="${out ? "dq" : ""} ${hl === k.bib ? "hl" : ""}"><td>${t != null ? pos : ""}</td><td>${k.bib}</td><td>${fmt(k.r1)}</td><td>${fmt(k.r2)}</td><td>${t != null ? fmt(t) : out ? "Out" : ""}</td></tr>`; }).join("")}</tbody></table>`;
    $("asRun1").hidden = S.phase !== "ready"; $("asNext").hidden = S.phase !== "run2"; $("asNew").hidden = S.phase !== "done";
    if(S.phase === "run2") $("asNext").textContent = `Next skier in run 2 (bib ${S.order[S.i].bib})`;
  }
  $("asRun1").addEventListener("click", run1); $("asNext").addEventListener("click", next); $("asNew").addEventListener("click", reset);
  reset();
}

/* Gate pictures, seen from above */
const gp = body => `<svg viewBox="0 0 200 120" aria-hidden="true"><rect width="200" height="120" fill="${SNOW}"/>${body}</svg>`;
const pole = (x,y,c=RED) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`;
const skis = d => `<path d="${d}" fill="none" stroke="#2B3831" stroke-width="3"/><path d="${d}" fill="none" stroke="#2B3831" stroke-width="3" transform="translate(0 8)"/>`;
const mark = (ok,x,y) => ok ? `<path d="M${x-10} ${y}l7 8 13 -16" fill="none" stroke="#1F8A4C" stroke-width="5" stroke-linecap="round"/>` : `<path d="M${x-9} ${y-9}l18 18M${x+9} ${y-9}l-18 18" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>`;
const GATES = [
  {name:"Clean pass", text:"Both ski tips and both feet must cross the line between the gate's poles. Brushing or knocking the poles is fine.", art: gp(pole(100,30) + pole(100,90) + skis("M10 50Q100 40 190 60") + mark(true,170,24))},
  {name:"Missed gate", text:"Going around the wrong side of a gate is a disqualification, unless the skier climbs back up and passes it correctly.", art: gp(pole(100,40) + pole(100,90) + skis("M10 20Q100 0 190 30") + mark(false,170,90))},
  {name:"Straddle", text:"In slalom, letting the pole pass between the skis, one ski on each side, means a disqualification. It's the most common way to go out in slalom.", art: gp(pole(100,56,BLUE) + `<path d="M10 40Q100 40 190 50" fill="none" stroke="#2B3831" stroke-width="3"/><path d="M10 70Q100 72 190 74" fill="none" stroke="#2B3831" stroke-width="3"/>` + mark(false,170,24))},
  {name:"Hiking back", text:"A skier who misses a gate may stop, climb back up, and go through it. It's legal, but it costs so much time that it rarely changes the result.", art: gp(pole(100,40) + pole(100,90) + skis("M10 20Q100 0 140 24") + `<path d="M140 24Q120 50 104 62" fill="none" stroke="#F2A93B" stroke-width="3" stroke-dasharray="5 4"/>` + mark(true,170,90))},
  {name:"Start and finish timing", text:"The clock starts when the skier's leg pushes open the start wand and stops when they break the finish beam. Times are to the hundredth of a second.", art: gp(`<rect x="20" y="30" width="10" height="60" fill="#2B3831"/><line x1="30" y1="60" x2="70" y2="60" stroke="${RED}" stroke-width="4"/><line x1="170" y1="20" x2="170" y2="100" stroke="${RED}" stroke-width="2" stroke-dasharray="4 3"/>` + skis("M40 56L190 56"))},
  {name:"DNF, DSQ, DNS", text:"Results show DNF (did not finish, often a fall), DSQ (disqualified, such as a missed gate), and DNS (did not start).", art: gp(`<text x="100" y="72" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="40" fill="${INK}">DNF DSQ</text>`)}
];

const CLOCK = [
  {k:"insp", cls:"half", t:"Inspect", s:"On foot", info:["Course inspection","Before every run, skiers side-slip down the course, memorizing the line through each gate. They can't ski it at race speed."]},
  {k:"r1", cls:"q", t:"Run 1", s:"All skiers", info:["Run 1","In the World Cup, the best-ranked skiers draw the early bibs, getting the smoothest snow. In giant slalom and slalom, only the top 30 after run 1 race again."]},
  {k:"gap", cls:"half", t:"Break", s:"New course", info:["Between runs","A new course is set on the same slope, and skiers inspect it again."]},
  {k:"r2", cls:"q", t:"Run 2", s:"Top 30", info:["Run 2","The top 30 start in reverse order: 30th place goes first and the run 1 leader goes last, which builds drama toward the end."]},
  {k:"res", cls:"ot", t:"Result", s:"Times added", info:["Results","Run 1 and run 2 times are added together. Lowest total wins. A fall or DSQ in either run means no result."]}
];
const TRICKY = [
  ["Why do downhillers get training runs?","At over 130 km/h with big jumps, skiers need to learn the course at speed. Super-G has no training runs, which makes reading the course on inspection crucial."],
  ["Why does the leader go last in run 2?","The top 30 start in reverse order of their run 1 results. The leader knows exactly what time to beat, and fans get the closest finishes at the end."],
  ["Can two skiers tie?","Yes. Times are official to the hundredth of a second, and tied skiers share the place. Olympic golds have been shared this way."],
  ["What's the green light?","On TV, the split and finish times are shown in green if the skier is ahead of the leader and red if behind."],
  ["Why do slalom skiers hit the poles?","Slalom poles are hinged and spring back. Skiers take the shortest line by clearing them out of the way with padded shins and pole guards."],
  ["What's a combined event?","An event that adds a speed run (downhill) and a slalom run. At the 2026 Olympics, it became a team event: one skier does the downhill and a teammate does the slalom."]
];
const WORDS = [
  ["Gate","A pair of poles, or a single pole in slalom, that skiers must pass through."],
  ["Bib","The numbered vest worn over the race suit, showing start order."],
  ["Split","An intermediate time partway down the course, compared to the leader."],
  ["Line","The path a skier chooses through the gates. The best line is fast but risky."],
  ["Tuck","The crouched, aerodynamic position used on fast straight sections."],
  ["Carving","Turning on the edges of the skis without skidding, the fastest way to turn."],
  ["Straddle","Letting a slalom pole pass between the skis. A disqualification."],
  ["Course setter","The coach chosen to place the gates for a run."],
  ["Speed events","Downhill and super-G."],
  ["Technical events","Giant slalom and slalom."]
];
const straddleMini = () => gp(pole(100,56,BLUE) + `<path d="M10 40Q100 40 190 50" fill="none" stroke="#2B3831" stroke-width="3"/><path d="M10 70Q100 72 190 74" fill="none" stroke="#2B3831" stroke-width="3"/>`).replace('aria-hidden="true"', 'aria-hidden="true" style="width:220px;border-radius:8px"');
const QUIZ = [
  {q:"Which alpine event is the fastest?", o:["Slalom","Giant slalom","Super-G","Downhill"], a:3, why:"Downhill, with speeds over 130 km/h."},
  {q:"How is a slalom race decided?", o:["One run","Two runs, times added","Three runs, best one counts","Two runs, best one counts"], a:1, why:"Slalom and giant slalom add the times from two runs."},
  {q:"A skier goes around the wrong side of a gate. What happens?", o:["Disqualified, unless they climb back and pass it","A 2-second penalty","Nothing, it's allowed","They restart the run"], a:0, why:"A missed gate is a disqualification unless corrected by hiking back."},
  {q:"In slalom, the pole passes between the skier's skis like this. What's the call?", visual: straddleMini, o:["A clean pass","Straddle: disqualified","A time penalty","They must hike back"], a:1, why:"That's a straddle, and it's a disqualification."},
  {q:"In run 2 of a slalom, who starts last?", o:["The run 1 leader goes first","It's a random draw","The run 1 leader goes last","Same order as run 1"], a:2, why:"The top 30 go in reverse order, so the leader starts last."},
  {q:"Which event gives skiers official training runs before the race?", o:["Slalom","Downhill","Giant slalom","Super-G"], a:1, why:"Downhill. Super-G has no training runs."},
  {q:"How many runs are in a super-G?", o:["One run, with no training runs","Two runs","Three runs","Best of two"], a:0, why:"One run, raced after inspecting the course on foot."},
  {q:"How precisely are alpine races timed?", o:["Tenths of a second","Hundredths of a second","Thousandths of a second","Whole seconds"], a:1, why:"To the hundredth. Ties share the place."},
  {q:"Two skiers finish with exactly the same total time. What happens?", o:["A ski-off","The judges decide","They share the place","The earlier bib wins"], a:2, why:"Tied skiers share the placing, even for medals."},
  {q:"What does DNF mean in the results?", o:["Did not finish","Disqualified","Did not start","Did not fall"], a:0, why:"Did not finish, usually because of a fall or skiing out of the course."}
];

function render(app){
  app.innerHTML = sportHero({id:"alpine-skiing", name:"Alpine skiing", alt:"The tabby cat skiing downhill in an orange jacket, poles in hand",
      lede:"Skiers race down a mountain one at a time, against the clock, through a course marked by gates. Miss a gate and you're out. There are four main events, from the high-speed downhill to the twisting slalom, and the lowest time wins.",
      facts:[["4","main events"],["1","run in speed events"],["2","runs in technical events"],["0.01","seconds can decide a medal"]]})
    + jumpNav([["as-course","The events"],["as-race","Run a race"],["as-gates","Gates and timing"],["as-clock","Race day"],["as-tricky","Tricky rules"],["as-words","Words you'll hear"],["as-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("as-course","The four events","Pick an event to see how its course is set. Speed events have few, wide turns; technical events have many tight ones.",
        `<div class="controls"><span class="chips">${Object.entries(DISC).map(([k,d]) => `<button class="chip" type="button" data-cs="${k}">${d.name}</button>`).join("")}</span></div>
        <div class="fieldbox" style="margin-top:12px">${courseSVG()}</div><div class="infopanel" id="csInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("as-race","Run a two-run race","A giant slalom with ten skiers. Run 1 sets the order; in run 2 the skiers go in reverse, and the times are added.",
        `<div class="oslab"><div id="asBoard"></div>
          <div class="osside"><div class="controls"><button class="btn primary" id="asRun1" type="button">Ski run 1</button><button class="btn primary" id="asNext" type="button" hidden>Next skier</button><button class="btn primary" id="asNew" type="button" hidden>New race</button></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="asMsg"></p></div></div></div>`)
    + section("as-gates","Gates and timing","The few rules of alpine racing are all about the gates and the clock.",
        `<div class="scoring restarts">${GATES.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("as-clock","Race day","A giant slalom or slalom race day. Tap a step to learn more.",
        `<div class="timeline" id="asTimeline"></div><div class="infopanel" id="asClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("as-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="asFlips"></div>`)
    + section("as-words","Words you'll hear","",`<dl class="gloss" id="asGloss"></dl>`)
    + section("as-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="asQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the FIS International Ski Competition Rules used in the World Cup and at the Olympics. Start-order details vary slightly between competitions.</footer></div>`;

  courseDemo(); raceSim();
  setupTimeline(document.getElementById("asTimeline"), document.getElementById("asClockInfo"), CLOCK,
    "A downhill run lasts about two minutes, a slalom run about 50 seconds. Two-run races spread across a morning and an afternoon.");
  flipCards(document.getElementById("asFlips"), TRICKY);
  glossary(document.getElementById("asGloss"), WORDS);
  makeQuiz(document.getElementById("asQuiz"), QUIZ, [
    "Green light all the way! Watch a race and try to call DSQs before the results come up.",
    "A fast run. Try another two-run race and watch how the reverse order builds drama.",
    "Look over the four events and the gate rules again, then come back for another run.",
    "No worries. Start with the four events and the gate pictures, then try again."]);
}

SPORT_PAGES["alpine-skiing"] = {render};
})();

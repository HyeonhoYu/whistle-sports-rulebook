/* Judo. Rules follow the IJF Sport and Refereeing Rules for 2025-2028 (yuko returned in 2025). */
(function(){

const W = "#F4F6F1", INK = "#18221D", BLUEGI = "#2F6FD6", MAT1 = "#E8C35A", MAT2 = "#3E7CB8";
function matSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-110 -40 820 700" role="img" aria-label="Judo mat seen from above">
    <rect x="-110" y="-40" width="820" height="700" fill="#1C4D2C"/>
    <rect width="600" height="600" fill="${MAT2}"/>${Array.from({length:12},(_,i) => `<line x1="${i*50}" y1="0" x2="${i*50}" y2="600" stroke="#346DA4" stroke-width="2"/><line x1="0" y1="${i*50}" x2="600" y2="${i*50}" stroke="#346DA4" stroke-width="2"/>`).join("")}
    <rect x="100" y="100" width="400" height="400" fill="${MAT1}"/>${Array.from({length:8},(_,i) => `<line x1="${100+i*50}" y1="100" x2="${100+i*50}" y2="500" stroke="#D9B44C" stroke-width="2"/><line x1="100" y1="${100+i*50}" x2="500" y2="${100+i*50}" stroke="#D9B44C" stroke-width="2"/>`).join("")}
    <rect x="236" y="285" width="8" height="30" fill="#fff" stroke="${INK}" stroke-width="1.5"/><rect x="356" y="285" width="8" height="30" fill="${BLUEGI}" stroke="${INK}" stroke-width="1.5"/>
    <circle cx="300" cy="230" r="16" fill="#18221D"/><text x="300" y="236" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="16" fill="#fff">R</text>
    <rect x="200" y="620" width="200" height="30" rx="5" fill="#2B3831"/><text x="300" y="641" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="17" fill="#EEF3EC">Table and video judges</text>
    ${r("safety",0,0,600,100)}${r("safety",0,500,600,100)}${r("safety",0,100,100,400)}${r("safety",500,100,100,400)}
    ${r("contest",100,100,400,400)}${r("white",224,275,32,50)}${r("blue",344,275,32,50)}
    <circle class="hz" data-zone="referee" cx="300" cy="230" r="24"/>${r("table",195,612,210,44)}</svg>`;
}
const ZONES = {
  contest:{title:"Contest area", text:"The inner square, 8 to 10 meters on each side. Throws only score if they start while at least one athlete is inside it. Stepping out on purpose to avoid an attack is penalized."},
  safety:{title:"Safety area", text:"The border of different-colored mats, at least 3 meters wide, so athletes thrown near the edge still land on a soft surface."},
  white:{title:"White start mark", text:"Where the athlete in the white judogi stands to bow and begin. The first athlete called wears white."},
  blue:{title:"Blue start mark", text:"Where the athlete in the blue judogi stands. Two colors make it easy for referees and fans to tell who scored."},
  referee:{title:"Referee", text:"One referee on the mat runs the contest, calling out and signaling every score and penalty in Japanese terms."},
  table:{title:"Table and video judges", text:"Judges at the table watch on video. They can review and correct the referee's calls through an earpiece, so the score you see can change after a replay."}
};
const ZONE_ORDER = ["contest","safety","white","blue","referee","table"];

/* Scoreboard lab */
function scoreLab(){
  const $ = id => document.getElementById(id); const N = ["White","Blue"];
  let S, timer = null;
  const reset = () => { clearInterval(timer); timer = null; S = {w:[0,0], y:[0,0], s:[0,0], ippon:[0,0], t:240, gs:false, over:false}; $("jdMsg").textContent = "Four minutes on the clock. Press start, then award scores and penalties."; draw(); };
  const fmt = t => `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,"0")}`;
  function draw(){
    [0,1].forEach(i => {
      $(`jd${i}`).innerHTML = `<span class="jname">${N[i]}</span><span class="jsc"><small>Ippon</small><b>${S.ippon[i]}</b></span><span class="jsc"><small>Waza-ari</small><b>${S.w[i]}</b></span><span class="jsc"><small>Yuko</small><b>${S.y[i]}</b></span><span class="jsh">${Array.from({length:S.s[i]}, (_,k) => `<i class="${k === 2 ? "red" : ""}"></i>`).join("")}</span>`;
    });
    $("jdClock").textContent = (S.gs ? "GS " : "") + fmt(S.t);
    $("jdStart").textContent = timer ? "Pause" : S.gs ? "Continue golden score" : "Start the clock";
    document.querySelectorAll("[data-jd]").forEach(b => b.disabled = S.over); $("jdStart").disabled = S.over;
  }
  function win(a, msg){ S.over = true; clearInterval(timer); timer = null; $("jdMsg").textContent = `${msg} ${N[a]} wins.`; draw(); }
  function award(a, type){
    if(S.over) return; const o = 1 - a;
    if(type === "ippon"){ S.ippon[a] = 1; return win(a, "Ippon! A perfect throw, a 20-second hold-down, or a submission ends the match immediately."); }
    if(type === "waza"){ S.w[a]++; if(S.w[a] === 2){ S.ippon[a] = 1; return win(a, "A second waza-ari: waza-ari-awasete-ippon. Two waza-ari add up to ippon, and the match is over."); }
      if(S.gs) return win(a, "In golden score, the first score wins.");
      $("jdMsg").textContent = `Waza-ari for ${N[a]}. One more and it becomes ippon.`; }
    if(type === "yuko"){ S.y[a]++; if(S.gs) return win(a, "In golden score, the first score wins, even a yuko.");
      $("jdMsg").textContent = `Yuko for ${N[a]}. Yuko are counted, but any number of them never adds up to a waza-ari.`; }
    if(type === "shido"){ S.s[a]++; if(S.s[a] === 3) return win(o, `Third shido for ${N[a]}: hansoku-make, a loss by penalties.`);
      $("jdMsg").textContent = `Shido ${S.s[a]} for ${N[a]}. Penalties don't give the opponent points, but a third one loses the match.`; }
    draw();
  }
  function timeUp(){
    clearInterval(timer); timer = null;
    const cmp = (k) => S[k][0] > S[k][1] ? 0 : S[k][1] > S[k][0] ? 1 : -1;
    const bw = cmp("w"), by = cmp("y");
    if(bw !== -1) return win(bw, "Time! More waza-ari wins the match, no matter how many yuko the other athlete has.");
    if(by !== -1) return win(by, "Time! Waza-ari are even, so the athlete with more yuko wins.");
    S.gs = true; S.t = 0; $("jdMsg").textContent = "Time, and the scores are level. Golden score: the clock runs with no limit, and the first score wins."; draw();
  }
  $("jdStart").addEventListener("click", () => {
    if(S.over) return;
    if(timer){ clearInterval(timer); timer = null; draw(); return; }
    timer = setInterval(() => { if(S.gs) S.t++; else { S.t = Math.max(0, S.t - 1); if(S.t === 0) return timeUp(); } draw(); }, 125);
    draw();
  });
  document.querySelectorAll("[data-jd]").forEach(b => b.addEventListener("click", () => award(+b.dataset.who, b.dataset.jd)));
  $("jdReset").addEventListener("click", reset);
  reset();
}

/* Hold-down timer */
function holdDemo(){
  const $ = id => document.getElementById(id); let t = 0, timer = null;
  const show = () => { $("hdNum").textContent = t.toFixed(1); $("hdFill").style.width = `${Math.min(100, t/20*100)}%`; };
  const result = () => t >= 20 ? "Ippon: a full 20-second hold-down wins the match." : t >= 10 ? `Waza-ari: held for ${Math.floor(t)} seconds (10 to 19).` : t >= 5 ? `Yuko: held for ${Math.floor(t)} seconds (5 to 9).` : `No score: the hold lasted only ${t.toFixed(1)} seconds, under 5.`;
  $("hdStart").addEventListener("click", () => { clearInterval(timer); t = 0; show(); $("hdMsg").textContent = "Osaekomi! The referee calls the hold-down and the clock starts. Try to escape before time runs out.";
    timer = setInterval(() => { t = Math.round((t + .1)*10)/10; show(); if(t >= 20){ clearInterval(timer); timer = null; $("hdMsg").textContent = result(); } }, 100); });
  $("hdEsc").addEventListener("click", () => { if(!timer) return; clearInterval(timer); timer = null; $("hdMsg").textContent = `Toketa! The hold is broken. ${result()}`; });
  show();
}

/* Landing art: the thrown athlete's torso seen from the feet. The red edge is the back. */
const land = (deg, label, dx=0) => `<svg viewBox="0 0 200 120" aria-hidden="true"><rect width="200" height="120" fill="#1C4D2C"/><rect y="96" width="200" height="24" fill="${MAT1}"/>
  <g transform="translate(${70 + dx} ${deg ? 101 : 96}) rotate(${-deg})"><rect x="0" y="-34" width="70" height="34" rx="12" fill="#fff" stroke="${INK}" stroke-width="2.5"/><rect x="7" y="-7" width="56" height="7" rx="3" fill="#D9342B"/></g>
  <text x="100" y="22" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="19" fill="#F2C230">${label}</text>
  <text x="196" y="114" text-anchor="end" font-family="Barlow,sans-serif" font-size="9" fill="#5A4A10">red edge = back</text></svg>`;
const SCORES = [
  {name:"Ippon", pts:"Win", text:"A throw that lands the opponent largely on the back with force, speed, and control. Also a 20-second hold-down, or a submission when the opponent taps out. The match ends right away.", art: land(0, "Flat on the back")},
  {name:"Waza-ari", pts:"Big", text:"A throw that's close to ippon but missing something, such as landing partly on the back. Also a hold-down of 10 to 19 seconds. Two waza-ari make ippon.", art: land(35, "Partly on the back", 0)},
  {name:"Yuko", pts:"Small", text:"A throw that lands the opponent on the side, the upper back or neck, or at least one buttock. Also a hold-down of 5 to 9 seconds. Yuko never add up to a waza-ari.", art: land(90, "On the side", 46)}
];
const CALLS = [
  {name:"Ippon", what:"One arm raised straight up above the head, palm forward.", cost:"The match is over.", arms:'<path d="M56 38l4-40"/><path d="M44 38l-6 30"/>'},
  {name:"Waza-ari", what:"One arm raised to the side at shoulder height, palm down.", cost:"A big score. Two make ippon.", arms:'<path d="M56 38h34"/><path d="M44 38l-6 30"/>'},
  {name:"Yuko", what:"One arm stretched out and down at about 45 degrees to the side, palm down.", cost:"A small score, counted separately.", arms:'<path d="M56 38l26 24"/><path d="M44 38l-6 30"/>'},
  {name:"Osaekomi", what:"An arm pointed down at the athletes while the referee leans over them.", cost:"Hold-down on: the clock is running.", arms:'<path d="M56 38l32 16"/><path d="M84 52l8 4" stroke-width="5"/><path d="M44 38l-6 30"/>'},
  {name:"Mate", what:"A hand raised at shoulder height, palm facing out, to stop the action.", cost:"Stop. The athletes return to their marks or regrip.", arms:'<path d="M56 38h26v-14"/><path d="M76 20h12" stroke-width="3"/><path d="M44 38l-6 30"/>'},
  {name:"Shido", what:"An index finger pointed at the athlete being penalized.", cost:"A penalty. The third one loses the match.", arms:'<path d="M56 38l30 4"/><path d="M86 42l8 0" stroke-width="2.5"/><circle cx="84" cy="42" r="4" fill="currentColor"/><path d="M44 38l-6 30"/>'}
];
const CLOCK = [
  {k:"rei", cls:"half", t:"Rei", s:"Bow", info:["Rei","Athletes bow when they step on the mat and again at their marks. Judo begins and ends with respect."]},
  {k:"hajime", cls:"half", t:"Hajime", s:"Begin", info:["Hajime","The referee says hajime, meaning begin, and the clock starts. It stops every time the referee calls mate."]},
  {k:"reg", cls:"q", t:"4:00", s:"Regular time", info:["Regular time","Senior matches last four minutes of actual fighting. An ippon at any moment ends the match on the spot."]},
  {k:"gs", cls:"ot", t:"GS", s:"Golden score", info:["Golden score","If scores are level when time runs out, the match goes on with no time limit. The first score wins it."]},
  {k:"end", cls:"half", t:"End", s:"Bow out", info:["Sore-made","The referee calls sore-made, the end, points to the winner, and both athletes bow before leaving the mat."]}
];
const TRICKY = [
  ["Why does one athlete wear blue?","Two colors make it easy to see who did what. The first athlete called wears the white judogi; the second wears blue."],
  ["Can three yuko beat a waza-ari?","No. Scores are compared from the top down: ippon, then waza-ari, then yuko. One waza-ari beats any number of yuko."],
  ["Do penalties give points?","No. A shido doesn't add a score for the opponent. Penalties only decide a match when someone gets a third shido, which is hansoku-make."],
  ["Can you grab the legs?","Directly grabbing the opponent's legs with the hands or arms during standing judo is penalized. Legs can still be swept, hooked, or reaped with the legs."],
  ["What's a submission?","On the ground, a choke or an armlock on the elbow makes the opponent tap twice or say maitta, I give up. That's ippon. Locks on any other joint are not allowed."],
  ["Why do scores sometimes change after a throw?","Video judges can review any call. A waza-ari can become ippon, a yuko, or nothing after a replay."]
];
const WORDS = [
  ["Hajime","Begin. Starts or restarts the fighting."],
  ["Mate","Stop. Pauses the action and the clock."],
  ["Osaekomi","Hold-down. The clock for the pin is running."],
  ["Toketa","Hold broken. The pinned athlete escaped."],
  ["Sono-mama","Freeze. Both athletes stop exactly where they are."],
  ["Tori and uke","Tori performs the technique; uke receives it."],
  ["Kumi-kata","Gripping. Fights over grips decide who can throw."],
  ["Tachi-waza","Standing techniques, mostly throws."],
  ["Ne-waza","Ground techniques: hold-downs, chokes, and armlocks."],
  ["Hansoku-make","Disqualification, after a third shido or one serious foul."]
];
const QUIZ = [
  {q:"Which score ends a judo match immediately?", o:["Waza-ari","Yuko","Ippon","Shido"], a:2, why:"Ippon wins the match on the spot."},
  {q:"An athlete scores a second waza-ari. What happens?", o:["It's a tie","Ippon: the match ends","They get two points","Nothing special"], a:1, why:"Two waza-ari add up to ippon, called waza-ari-awasete-ippon."},
  {q:"Do three yuko beat one waza-ari?", o:["No, one waza-ari wins","Yes","Only in golden score","It's a draw"], a:0, why:"Yuko never add up to waza-ari. The athlete with more waza-ari wins."},
  {q:"An athlete holds the opponent down for a full 20 seconds. What's the score?", o:["Yuko","Waza-ari","Ippon","Shido"], a:2, why:"A 20-second hold-down is ippon."},
  {q:"A hold-down lasts 12 seconds before the opponent escapes. What's the score?", o:["Waza-ari","Nothing","Yuko","Ippon"], a:0, why:"10 to 19 seconds earns waza-ari. 5 to 9 is yuko."},
  {q:"An athlete gets a third shido. What happens?", o:["Just a warning","They lose the match","The opponent gets a point","The match restarts"], a:1, why:"A third shido is hansoku-make: the athlete loses."},
  {q:"The referee makes this signal. What's the call?", visual:() => fig(CALLS[0].arms), o:["Waza-ari","Ippon","Shido","Mate"], a:1, why:"An arm raised straight up means ippon."},
  {q:"Scores are tied when the 4 minutes run out. What happens?", o:["A draw","The judges decide","Golden score: the first score wins","A rematch later"], a:2, why:"The match goes to golden score, with no time limit."},
  {q:"What does the referee mean by mate?", o:["Begin","Stop","Hold-down","Keep going"], a:1, why:"Mate means stop. Hajime means begin."},
  {q:"How long is a regular senior judo match?", o:["3 minutes","5 minutes","10 minutes","4 minutes"], a:3, why:"Four minutes of fighting time, with the clock stopped at every mate."}
];

function render(app){
  app.innerHTML = sportHero({id:"judo", name:"Judo", alt:"The tabby cat in a white judogi with a black belt, in a ready stance",
      lede:"Two athletes in jackets called judogi grip each other and try to throw their opponent onto their back, or control them on the ground with a hold-down, choke, or armlock. One perfect technique, an ippon, wins instantly. Otherwise, the better scores after four minutes win.",
      facts:[["4","minutes of fighting time"],["1","ippon ends it instantly"],["20","seconds of hold-down for ippon"],["3","shidos and you lose"]]})
    + jumpNav([["jd-mat","The mat"],["jd-scores","Scores"],["jd-board","Scoreboard"],["jd-hold","Hold-down"],["jd-calls","Referee calls"],["jd-clock","The match"],["jd-tricky","Tricky rules"],["jd-words","Words you'll hear"],["jd-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("jd-mat","The mat","Tap any part of the mat to see what it does.",
        `<div class="fieldbox" id="jdMat" style="max-width:700px">${matSVG()}</div><div class="fieldrow"><div class="zonechips" id="jdChips"></div><div class="infopanel" id="jdInfo" aria-live="polite"></div></div>`)
    + section("jd-scores","Scores","Throws are judged mostly by how the opponent lands. Each picture shows the thrown athlete\'s body from the feet, with the back in red.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${SCORES.map(s => `<div class="score">${s.art}<div class="pts">${s.name}</div><p>${s.text}</p></div>`).join("")}</div>`)
    + section("jd-board","Run the scoreboard","Start the clock (it runs four times faster than real time), then award scores and penalties to see how a match is decided.",
        `<div class="sim"><div class="jboard"><div class="jrow white" id="jd0"></div><div class="jrow blue" id="jd1"></div><div class="jclock" id="jdClock">4:00</div></div>
          <div class="jbtns">
            <div class="controls"><b class="jlab">White</b><button class="btn" data-jd="yuko" data-who="0" type="button">Yuko</button><button class="btn" data-jd="waza" data-who="0" type="button">Waza-ari</button><button class="btn" data-jd="ippon" data-who="0" type="button">Ippon</button><button class="btn" data-jd="shido" data-who="0" type="button">Shido</button></div>
            <div class="controls"><b class="jlab">Blue</b><button class="btn" data-jd="yuko" data-who="1" type="button">Yuko</button><button class="btn" data-jd="waza" data-who="1" type="button">Waza-ari</button><button class="btn" data-jd="ippon" data-who="1" type="button">Ippon</button><button class="btn" data-jd="shido" data-who="1" type="button">Shido</button></div>
            <div class="controls"><button class="btn primary" id="jdStart" type="button">Start the clock</button><button class="btn" id="jdReset" type="button">Reset</button></div></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="jdMsg"></p></div></div></div>`)
    + section("jd-hold","Hold-down timer","Start a hold-down, then escape whenever you like. How long the hold lasts decides the score.",
        `<div class="shotclock"><div class="scface"><small>Osaekomi</small><b id="hdNum">0.0</b></div>
          <div class="osside"><div class="hdbar"><div id="hdFill"></div><span style="left:25%">5s yuko</span><span style="left:50%">10s waza-ari</span><span style="left:100%">20s ippon</span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="hdMsg">A hold-down must pin the opponent's back to the mat with control.</p></div>
            <div class="controls"><button class="btn primary" id="hdStart" type="button">Osaekomi!</button><button class="btn" id="hdEsc" type="button">Toketa (escape)</button></div></div></div>`)
    + section("jd-calls","Referee calls","The referee calls every score aloud in Japanese and signals it with the arms.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("jd-clock","The match","Tap a part of the match to learn what happens there.",
        `<div class="timeline" id="jdTimeline"></div><div class="infopanel" id="jdClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("jd-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="jdFlips"></div>`)
    + section("jd-words","Words you'll hear","Judo keeps its Japanese terms worldwide.",`<dl class="gloss" id="jdGloss"></dl>`)
    + section("jd-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="jdQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the IJF Sport and Refereeing Rules for 2025 to 2028, which brought back the yuko score. Youth and club events often add safety limits, such as banning chokes and armlocks for young athletes.</footer></div>`;

  setupZones(document.getElementById("jdMat"), document.getElementById("jdChips"), document.getElementById("jdInfo"), ZONES, ZONE_ORDER, "contest");
  scoreLab(); holdDemo();
  setupTimeline(document.getElementById("jdTimeline"), document.getElementById("jdClockInfo"), CLOCK,
    "Because the clock stops at every mate, a four-minute match usually takes six or seven minutes, more with golden score.");
  flipCards(document.getElementById("jdFlips"), TRICKY);
  glossary(document.getElementById("jdGloss"), WORDS);
  makeQuiz(document.getElementById("jdQuiz"), QUIZ, [
    "Ippon! Watch a match and call each score before the referee signals it.",
    "Waza-ari. One more look at the scoreboard lab and you'll have it.",
    "Try the hold-down timer and the scoreboard again, then come back for another round.",
    "No worries. Start with the three scores and the scoreboard lab, then try again."]);
}

SPORT_PAGES["judo"] = {render};
})();

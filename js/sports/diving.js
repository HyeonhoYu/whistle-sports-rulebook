/* Diving. Rules follow World Aquatics diving rules. */
(function(){

const INK = "#18221D", WATER = "#3C8DC4";
/* Side view: 20 units per meter. Water surface y=330. */
function towerSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const plat = (y, w, l) => `<rect x="60" y="${y}" width="${w}" height="10" fill="#C9CED2" stroke="${INK}" stroke-width="2"/><text x="56" y="${y + 9}" text-anchor="end" font-family="Barlow,sans-serif" font-size="13" fill="#EEF3EC">${l}</text>`;
  return `<svg viewBox="0 0 640 440" role="img" aria-label="Diving tower and springboards from the side"><rect width="640" height="440" fill="#2B3831"/>
    <rect x="40" y="120" width="30" height="210" fill="#5E6B64"/>${plat(130,140,"10 m")}${plat(180,120,"7.5 m")}${plat(230,110,"5 m")}
    <rect x="300" y="268" width="14" height="62" fill="#5E6B64"/><rect x="300" y="268" width="120" height="6" fill="#E8873A"/><text x="296" y="275" text-anchor="end" font-family="Barlow,sans-serif" font-size="13" fill="#EEF3EC">3 m</text>
    <rect x="460" y="306" width="14" height="24" fill="#5E6B64"/><rect x="460" y="306" width="110" height="6" fill="#E8873A"/><text x="456" y="313" text-anchor="end" font-family="Barlow,sans-serif" font-size="13" fill="#EEF3EC">1 m</text>
    <rect x="0" y="330" width="640" height="110" fill="${WATER}"/><path d="M0 330q20 -6 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" fill="none" stroke="#9CC7EE" stroke-width="2"/>
    <text x="320" y="420" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#EEF3EC">at least 5 m deep under the platform</text>
    ${r("ten",58,124,146,22)}${r("lower",58,174,126,66)}${r("three",298,262,126,18)}${r("one",458,300,116,18)}${r("water",0,332,640,108)}${r("tower",36,120,38,210)}</svg>`;
}
const ZONES = {
  ten:{title:"10 m platform", text:"The highest Olympic level, about the height of a three-story building. Divers hit the water at around 50 km/h (30 mph)."},
  lower:{title:"7.5 m and 5 m platforms", text:"Lower platforms used in training and some competitions."},
  three:{title:"3 m springboard", text:"A flexible board that bounces the diver up. Olympic springboard events are from 3 m."},
  one:{title:"1 m springboard", text:"Used at World Championships, not the Olympics."},
  tower:{title:"The tower", text:"Platforms are rigid; springboards flex. Divers time their jump with the board's bounce."},
  water:{title:"The pool", text:"At least 5 m deep below the platforms. Bubblers can churn the surface so divers can see it from above and to soften landings in training."}
};
const ZONE_ORDER = ["ten","lower","three","one","tower","water"];

const DIVES = [
  {code:"105B", name:"Forward 2.5 somersaults, pike", dd:2.4},
  {code:"205B", name:"Back 2.5 somersaults, pike", dd:3.0},
  {code:"107B", name:"Forward 3.5 somersaults, pike", dd:3.1},
  {code:"307C", name:"Reverse 3.5 somersaults, tuck", dd:3.5}
];
function judgeDive(){
  const $ = id => document.getElementById(id);
  $("dvSel").innerHTML = DIVES.map((d,i) => `<option value="${i}">${d.code}: ${d.name} (DD ${d.dd.toFixed(1)})</option>`).join("");
  function run(){
    const d = DIVES[+$("dvSel").value], q = +$("dvQ").value, fail = $("dvFail").checked;
    let marks = Array.from({length:7}, () => fail ? 0 : Math.max(0, Math.min(10, Math.round((q + (Math.random()*1.4 - .7))*2)/2)));
    const sorted = marks.map((m,i) => [m,i]).sort((a,b) => a[0] - b[0]), drop = new Set([sorted[0][1], sorted[1][1], sorted[5][1], sorted[6][1]]);
    const mid = sorted.slice(2,5).reduce((a,[m]) => a + m, 0), score = Math.round(mid*d.dd*100)/100;
    $("dvOut").innerHTML = `<div class="scorebar"><div><small>Seven judges' marks (top 2 and bottom 2 dropped)</small><span class="marks">${marks.map((m,i) => `<i class="${drop.has(i) ? "x" : ""}">${m.toFixed(1)}</i>`).join("")}</span></div></div>
      <div class="scorebar"><div><small>Middle three added</small><b>${mid.toFixed(1)}</b></div><span>x</span><div><small>Degree of difficulty</small><b>${d.dd.toFixed(1)}</b></div><span>=</span><div class="tot"><small>Dive score</small><b>${score.toFixed(2)}</b></div></div>`;
    $("dvMsg").textContent = fail ? "A failed dive: the diver did a different dive from the one announced, so every judge gives 0." :
      q >= 9 ? "A near-perfect rip entry with almost no splash. Marks in the 9s." : q >= 7 ? "A good dive with a small splash or a slightly short entry." : q >= 5 ? "Noticeable errors: a bent position, a slow twist, or a big splash." : "A poor dive: lost position, short of vertical, or a crash landing.";
  }
  $("dvGo").addEventListener("click", run); $("dvQ").addEventListener("input", () => $("dvQv").textContent = (+$("dvQ").value).toFixed(1)); run();
}
const POS = [["A","Straight","Body fully extended, no bend at hips or knees."],["B","Pike","Bent at the hips, legs straight."],["C","Tuck","Knees pulled tight to the chest, the most compact position."],["D","Free","Any position, used in some twisting dives."]];
const GROUPS = [["1","Forward","Facing the water, rotating forward."],["2","Back","Back to the water, rotating backward."],["3","Reverse","Facing the water, rotating back toward the board."],["4","Inward","Back to the water, rotating toward the board."],["5","Twisting","Any dive with twists added."],["6","Armstand","Starting from a handstand on the platform edge."]];
const CLOCK = [
  {k:"pre", cls:"q", t:"Prelims", s:"All divers", info:["Preliminaries","Each diver performs their full list of dives. The top 18 go to the semifinal."]},
  {k:"semi", cls:"q", t:"Semi", s:"Top 18", info:["Semifinal","Scores start fresh. The top 12 advance."]},
  {k:"final", cls:"ot", t:"Final", s:"Top 12", info:["Final","Women perform five dives and men six, each from a different group. The highest total wins."]},
  {k:"syn", cls:"half", t:"Synchro", s:"Pairs", info:["Synchronized diving","Two divers dive at the same time. More judges score both execution and how perfectly the pair matches."]}
];
const TRICKY = [
  ["Why does a perfect dive not score 10 x 3?","Only the middle three marks count, and each dive's total is multiplied by its degree of difficulty. A 10, 10, 10 on a 3.5 dive scores 105."],
  ["What's a rip entry?","Entering the water nearly vertical, hands flat, with almost no splash. It sounds like tearing paper, hence the name."],
  ["What do the dive numbers mean?","The first digit is the group, the last digit counts half-somersaults, and the letter is the position. 107B is forward, 3.5 somersaults, pike."],
  ["What's a failed dive?","Doing a different dive than announced, or a balk (starting and stopping), earns 0 or a big penalty."],
  ["Why is the water bubbling?","Bubblers break the surface so divers can judge where the water is from the platform, and can soften landings in practice."],
  ["Why do divers shower between dives?","To keep muscles warm and loose. The pool area is cooler than their bodies after a dive."]
];
const WORDS = [["DD","Degree of difficulty, the multiplier for each dive."],["Rip","A clean entry with no splash."],["Hurdle","The jump onto the end of the springboard before takeoff."],["Pike","Bent at the hips, legs straight."],["Tuck","Curled into a tight ball."],["Twister","A dive with twists."],["Balk","Starting a dive and stopping."],["Synchro","Two divers diving together."]];
const marksMini = () => `<div class="pbmini"><span class="marks">${[8.0,8.5,7.5,8.5,9.0,8.0,7.0].map(m => `<i>${m.toFixed(1)}</i>`).join("")}</span></div>`;
const QUIZ = [
  {q:"How many judges score an individual dive?", o:["3","5","7","9"], a:2, why:"Seven judges."},
  {q:"Which marks are dropped?", o:["None","The highest and lowest","The two highest and two lowest","Only the lowest"], a:2, why:"The top two and bottom two are dropped."},
  {q:"What do you do with the middle three marks?", o:["Average them","Add them and multiply by the degree of difficulty","Take the highest","Add them only"], a:1, why:"Sum times DD."},
  {q:"These are the seven marks for a dive with DD 3.0. What's the score?", visual: marksMini, o:["72.0","73.5","75.0","24.5"], a:1, why:"Drop 9.0, 8.5 (top two) and 7.0, 7.5 (bottom two). The middle three, 8.0 + 8.0 + 8.5, add to 24.5. Times 3.0 is 73.5."},
  {q:"What does the letter C in a dive number mean?", o:["Straight","Pike","Tuck","Free"], a:2, why:"C is tuck."},
  {q:"How high is the Olympic platform?", o:["3 m","5 m","10 m","15 m"], a:2, why:"Ten meters."},
  {q:"What's a rip entry?", o:["A dive with a twist","An entry with almost no splash","A failed dive","A backward dive"], a:1, why:"A near-splashless entry."},
  {q:"A diver performs a different dive than the one announced. What happens?", o:["Nothing","A failed dive: 0 points","Extra points","A redo"], a:1, why:"It's a failed dive."},
  {q:"Which group starts from a handstand?", o:["Forward","Inward","Armstand","Reverse"], a:2, why:"Armstand dives, only from the platform."},
  {q:"From which springboard height are Olympic springboard events?", o:["1 m","3 m","5 m","7.5 m"], a:1, why:"Three meters."}
];

function render(app){
  app.innerHTML = sportHero({id:"diving", name:"Diving", alt:"The tabby cat flying off a diving board in a pike position",
      lede:"Divers jump from a springboard or a platform, flip and twist through the air, and enter the water as cleanly as possible. Judges score every dive from 0 to 10, and harder dives are multiplied by a bigger degree of difficulty.",
      facts:[["10","meter platform"],["7","judges per dive"],["3","middle marks count"],["50","km/h at entry from the platform"]]})
    + jumpNav([["dv-tower","The tower"],["dv-judge","Score a dive"],["dv-pos","Positions"],["dv-groups","Dive groups"],["dv-clock","Competition"],["dv-tricky","Tricky rules"],["dv-words","Words you'll hear"],["dv-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("dv-tower","The tower and boards","Tap any part to see what it does.",`<div class="fieldbox" id="dvTower" style="max-width:640px">${towerSVG()}</div><div class="fieldrow"><div class="zonechips" id="dvChips"></div><div class="infopanel" id="dvInfo" aria-live="polite"></div></div>`)
    + section("dv-judge","Score a dive","Pick a dive and how well it's performed, then see how seven judges' marks become a score.",
        `<div class="pbform"><label>Dive <select id="dvSel"></select></label><label>Quality of the dive: <span id="dvQv">8.0</span><input id="dvQ" type="range" min="2" max="10" step="0.5" value="8"></label><label class="check" style="align-self:end"><input type="checkbox" id="dvFail"> Failed dive</label></div>
        <div class="controls" style="margin-top:12px"><button class="btn primary" id="dvGo" type="button">Dive!</button></div>
        <div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="dvMsg"></p></div><div id="dvOut"></div>`)
    + section("dv-pos","Positions","The letter at the end of a dive number.",`<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">${POS.map(([l,n,t]) => `<div class="score"><div class="pts">${l}</div><h3>${n}</h3><p>${t}</p></div>`).join("")}</div>`)
    + section("dv-groups","Dive groups","The first digit of a dive number.",`<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${GROUPS.map(([l,n,t]) => `<div class="score"><div class="pts">${l}</div><h3>${n}</h3><p>${t}</p></div>`).join("")}</div>`)
    + section("dv-clock","Competition","Tap a round to learn more.",`<div class="timeline" id="dvTimeline"></div><div class="infopanel" id="dvClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("dv-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="dvFlips"></div>`)
    + section("dv-words","Words you'll hear","",`<dl class="gloss" id="dvGloss"></dl>`)
    + section("dv-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="dvQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow World Aquatics diving rules, used at the Olympics. Degrees of difficulty shown are examples from the 3 m springboard table and vary by board height.</footer></div>`;
  setupZones(document.getElementById("dvTower"), document.getElementById("dvChips"), document.getElementById("dvInfo"), ZONES, ZONE_ORDER, "ten");
  judgeDive();
  setupTimeline(document.getElementById("dvTimeline"), document.getElementById("dvClockInfo"), CLOCK, "A platform dive lasts under two seconds from takeoff to entry.");
  flipCards(document.getElementById("dvFlips"), TRICKY); glossary(document.getElementById("dvGloss"), WORDS);
  makeQuiz(document.getElementById("dvQuiz"), QUIZ, ["A rip entry! Watch a final and try to read the dive numbers.","A clean dive. Score a few more dives to master the math.","Look over the scoring steps again, then come back.","No worries. Start with the score-a-dive tool, then try again."]);
}
SPORT_PAGES["diving"] = {render};
})();

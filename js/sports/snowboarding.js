/* Snowboarding. Rules follow FIS snowboard competition rules (Olympic events). */
(function(){

const INK = "#18221D", SNOW = "#F3F7FA";
/* Halfpipe cross-section. */
function pipeSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="0 0 700 320" role="img" aria-label="Cross-section of a snowboard halfpipe"><rect width="700" height="320" fill="#9CC7EE"/>
    <path d="M0 80H120Q120 260 260 270H440Q580 260 580 80H700V320H0Z" fill="${SNOW}" stroke="#C9D8E4" stroke-width="3"/>
    <path d="M120 80Q120 260 260 270H440Q580 260 580 80" fill="none" stroke="#7A8C81" stroke-width="2" stroke-dasharray="6 5"/>
    <path d="M590 70Q620 0 650 40" fill="none" stroke="#D9342B" stroke-width="3" stroke-dasharray="7 5"/><circle cx="620" cy="22" r="10" fill="#D9342B"/>
    <text x="350" y="300" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="${INK}">walls about 7 m (22 ft) high</text>
    <path class="hz" data-zone="wall" d="M120 80Q120 200 170 240L200 220Q150 180 146 80Z"/><path class="hz" data-zone="wall" d="M580 80Q580 200 530 240L500 220Q550 180 554 80Z"/>
    ${r("flat",250,250,200,30)}${r("trans",170,225,80,50)}${r("trans",450,225,80,50)}${r("deck",0,62,118,26)}${r("deck",582,62,118,26)}${r("lip",108,70,20,22)}${r("lip",572,70,20,22)}${r("air",590,0,90,62)}</svg>`;
}
const ZONES = {
  wall:{title:"Walls", text:"Nearly vertical at the top. Riders race up one wall, launch into the air, and come down the same wall to ride to the other side."},
  lip:{title:"Lip", text:"The top edge of the wall, where riders take off. Height above the lip, called amplitude, is a big part of the score."},
  trans:{title:"Transitions", text:"The curved section joining the walls to the flat bottom. Riders pump through it to build speed."},
  flat:{title:"Flat bottom", text:"The floor of the pipe between the walls."},
  deck:{title:"Deck", text:"The flat top beside the pipe. Landing on it after a trick is a big mistake."},
  air:{title:"Amplitude", text:"How high a rider flies above the lip. Elite riders go 5 to 7 m above the wall."}
};
const ZONE_ORDER = ["wall","lip","air","trans","flat","deck"];

/* Halfpipe final: three runs, best one counts. You pick how much risk to take. */
const RIVALS = ["Kai","Mara","Jun"];
function finalSim(){
  const $ = id => document.getElementById(id); let S;
  const reset = () => { S = {run:0, best:[0,0,0,0], last:[null,null,null,null], over:false}; $("hpMsg").textContent = "Three runs each. Only your best run counts. Pick how hard to go."; draw(); };
  const attempt = (risk) => { const fall = Math.random() < [.08,.25,.45][risk]; return fall ? Math.round(15 + Math.random()*20) : Math.round([70,82,92][risk] + Math.random()*7 - 3); };
  function go(risk){
    if(S.over) return; S.run++;
    const mine = attempt(risk); S.last[0] = mine; S.best[0] = Math.max(S.best[0], mine);
    RIVALS.forEach((_,i) => { const r = S.run === 3 ? 2 : Math.random() < .5 ? 1 : 2, s = attempt(r); S.last[i+1] = s; S.best[i+1] = Math.max(S.best[i+1], s); });
    let msg = mine < 40 ? `Run ${S.run}: you fell, scoring ${mine}. ` : `Run ${S.run}: you score ${mine}. `;
    msg += S.best[0] === mine && mine >= 40 ? "That's your best so far, and it's what counts." : `Your best is still ${S.best[0]}.`;
    if(S.run === 3){ S.over = true; const order = [0,1,2,3].sort((a,b) => S.best[b] - S.best[a]), pl = order.indexOf(0) + 1;
      msg += ` Final: you finish ${["1st","2nd","3rd","4th"][pl-1]}. ${pl === 1 ? "Gold!" : "Only best runs counted, so one great run is all it takes."}`; }
    $("hpMsg").textContent = msg; draw();
  }
  function draw(){
    const names = ["You", ...RIVALS], order = [0,1,2,3].sort((a,b) => S.best[b] - S.best[a]);
    $("hpTable").innerHTML = `<table class="rctab"><thead><tr><th>Rider</th><th>Last run</th><th>Best run</th></tr></thead><tbody>${order.map((i,k) => `<tr class="${i === 0 ? "hl" : ""}"><td>${S.run ? k + 1 + ". " : ""}${names[i]}</td><td>${S.last[i] ?? ""}</td><td>${S.run ? S.best[i] : ""}</td></tr>`).join("")}</tbody></table>`;
    $("hpRun").textContent = S.over ? "Final" : `Run ${S.run + 1} of 3`;
    document.querySelectorAll("[data-hp]").forEach(b => b.hidden = S.over); $("hpNew").hidden = !S.over;
  }
  document.querySelectorAll("[data-hp]").forEach(b => b.addEventListener("click", () => go(+b.dataset.hp)));
  $("hpNew").addEventListener("click", reset); reset();
}

const EVENTS = [
  {name:"Halfpipe", kind:"Judged", text:"Riders perform a series of tricks from wall to wall in a U-shaped pipe. In the final, each rider gets three runs and the best one counts."},
  {name:"Slopestyle", kind:"Judged", text:"A course of rails, boxes, and big jumps. Judges score the whole run, rewarding variety across the features."},
  {name:"Big air", kind:"Judged", text:"One huge jump, one trick at a time. Riders combine their best scores from different tricks."},
  {name:"Snowboard cross", kind:"Race", text:"Four riders race down a course of jumps, rollers, and banked turns at the same time. The top two in each heat advance."},
  {name:"Parallel giant slalom", kind:"Race", text:"Two riders race side by side on parallel courses through gates. The winner of each head-to-head moves on."}
];
const CRIT = [["Amplitude","How high above the lip or jump."],["Difficulty","How many spins and flips, and how hard the takeoff and landing."],["Execution","Control, style, and a clean landing."],["Variety","Different directions of spin and different grabs."],["Progression","New tricks or combinations that push the sport forward."]];
const CLOCK = [
  {k:"q", cls:"q", t:"Qualifying", s:"2 runs", info:["Qualification","Riders get two runs, and their best score decides who reaches the final."]},
  {k:"f", cls:"q", t:"Final", s:"3 runs", info:["Final","Twelve riders, three runs each in halfpipe. Riders often play safe first, then go for a harder run once they have a score."]},
  {k:"last", cls:"ot", t:"Last run", s:"All in", info:["The last run","With nothing to lose, riders try their hardest tricks. Medals often change on the final run."]}
];
const TRICKY = [
  ["How do judges score a run?","A panel scores each run from 0 to 100 on an overall impression of amplitude, difficulty, execution, variety, and progression."],
  ["What does 1440 mean?","Degrees of rotation. A 1440 is four full spins (4 x 360). A double cork 1440 adds two off-axis flips."],
  ["What's regular or goofy?","Regular riders lead with the left foot, goofy riders with the right. Riding with the other foot forward is called switch."],
  ["Why does only the best run count?","It rewards going for it. A safe first run gives a score to fall back on, and later runs can be all-out."],
  ["Can riders touch each other in snowboard cross?","Contact happens, but deliberately pushing or blocking a rival leads to disqualification."],
  ["What's a grab?","Holding the board with a hand during a trick. Different grabs have names, like indy and melon, and add style."]
];
const WORDS = [["Amplitude","Height above the lip."],["Cork","An off-axis spin, part flip and part spin."],["Switch","Riding with the opposite foot forward."],["Frontside","Spinning toward the direction your chest faces."],["Backside","Spinning the other way, toward your back."],["Rail","A metal bar riders slide along in slopestyle."],["Heat","A group of riders racing together in snowboard cross."],["Run","One trip down the course or pipe."]];
const QUIZ = [
  {q:"In a halfpipe final, which run counts?", o:["All three added","The last one","The best one","The first one"], a:2, why:"Only the best run counts."},
  {q:"How are halfpipe runs scored?", o:["By time","By judges, out of 100","By distance","By the crowd"], a:1, why:"A panel of judges scores from 0 to 100."},
  {q:"How many full spins is a 1440?", o:["2","3","4","5"], a:2, why:"1440 / 360 = 4."},
  {q:"In snowboard cross, how many riders usually advance from each heat of four?", o:["1","2","3","All"], a:1, why:"The top two move on."},
  {q:"What's amplitude?", o:["Speed at the bottom","Height above the lip","The number of tricks","The length of a run"], a:1, why:"Height in the air."},
  {q:"A rider leads with the right foot. What's their stance?", o:["Regular","Goofy","Switch","Backside"], a:1, why:"Right foot forward is goofy."},
  {q:"Which event is a race rather than judged?", o:["Halfpipe","Slopestyle","Big air","Snowboard cross"], a:3, why:"Snowboard cross and parallel giant slalom are races."},
  {q:"What does a slopestyle course have?", o:["Only one jump","Rails, boxes, and jumps","Gates","A halfpipe"], a:1, why:"A mix of rails and jumps."},
  {q:"What's a grab?", o:["Holding the board during a trick","Pushing another rider","A type of fall","A false start"], a:0, why:"Grabbing the board adds style."},
  {q:"Why do riders often play safe on their first run?", o:["It's required","To get a score to fall back on","The first run counts double","To save time"], a:1, why:"With a score banked, they can risk more later."}
];

function render(app){
  app.innerHTML = sportHero({id:"snowboarding", name:"Snowboarding", alt:"The tabby cat riding a snowboard in a red jacket, helmet, and goggles",
      lede:"Snowboarding has two kinds of events. In halfpipe, slopestyle, and big air, riders perform spins, flips, and grabs, and judges score each run. In snowboard cross and parallel slalom, riders race head to head down the mountain.",
      facts:[["100","points: the top judged score"],["3","runs in a halfpipe final"],["1","best run counts"],["4","riders per snowboard cross heat"]]})
    + jumpNav([["sb-pipe","The halfpipe"],["sb-events","Events"],["sb-final","Ride a final"],["sb-crit","What judges look for"],["sb-clock","Competition"],["sb-tricky","Tricky rules"],["sb-words","Words you'll hear"],["sb-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("sb-pipe","The halfpipe","Tap any part of the pipe to see what it does.",`<div class="fieldbox" id="sbPipe">${pipeSVG()}</div><div class="fieldrow"><div class="zonechips" id="sbChips"></div><div class="infopanel" id="sbInfo" aria-live="polite"></div></div>`)
    + section("sb-events","Events","",`<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">${EVENTS.map(d => `<div class="score"><div class="pts" style="font-size:1.4rem">${d.kind}</div><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("sb-final","Ride a halfpipe final","Three runs against three rivals. For each run, choose how risky to go. Harder runs score more, if you land them. Only your best run counts.",
        `<div class="oslab"><div id="hpTable"></div><div class="osside"><div class="osverdict"><span class="verdict on" id="hpRun"></span></div>
          <div class="controls"><button class="btn" data-hp="0" type="button">Safe run</button><button class="btn" data-hp="1" type="button">Strong run</button><button class="btn" data-hp="2" type="button">All-out run</button><button class="btn primary" id="hpNew" type="button" hidden>New final</button></div>
          <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="hpMsg"></p></div></div></div>`)
    + section("sb-crit","What judges look for","",`<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${CRIT.map(([n,t]) => `<div class="score"><h3>${n}</h3><p>${t}</p></div>`).join("")}</div>`)
    + section("sb-clock","Competition","Tap a round to learn more.",`<div class="timeline" id="sbTimeline"></div><div class="infopanel" id="sbClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("sb-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="sbFlips"></div>`)
    + section("sb-words","Words you'll hear","",`<dl class="gloss" id="sbGloss"></dl>`)
    + section("sb-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="sbQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow FIS snowboard competition rules for Olympic events. Run formats and judging details vary between events and seasons.</footer></div>`;
  setupZones(document.getElementById("sbPipe"), document.getElementById("sbChips"), document.getElementById("sbInfo"), ZONES, ZONE_ORDER, "wall");
  finalSim();
  setupTimeline(document.getElementById("sbTimeline"), document.getElementById("sbClockInfo"), CLOCK, "A halfpipe run lasts under a minute, with five or six hits from wall to wall.");
  flipCards(document.getElementById("sbFlips"), TRICKY); glossary(document.getElementById("sbGloss"), WORDS);
  makeQuiz(document.getElementById("sbQuiz"), QUIZ, ["Stomped it! Watch a final and guess the scores before they're posted.","A strong run. Ride another final and test your risk strategy.","Look over the events and judging again, then come back.","No worries. Start with the halfpipe and events cards, then try again."]);
}
SPORT_PAGES["snowboarding"] = {render};
})();

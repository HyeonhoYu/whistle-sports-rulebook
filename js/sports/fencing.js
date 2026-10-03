/* Fencing. Rules follow the FIE (International Fencing Federation). */
(function(){

const INK = "#18221D", RED = "#D9342B", GRN = "#2F9E5A";
/* Piste, 14 m long, 50 units per meter. */
function pisteSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-40 -40 780 200" role="img" aria-label="Fencing piste seen from above"><rect x="-40" y="-40" width="780" height="200" fill="#2B3831"/>
    <rect x="0" y="20" width="700" height="80" fill="#B8C2C8"/><rect x="0" y="20" width="100" height="80" fill="#E3A25A"/><rect x="600" y="20" width="100" height="80" fill="#E3A25A"/>
    <g stroke="${INK}" stroke-width="3"><line x1="350" y1="20" x2="350" y2="100"/><line x1="250" y1="20" x2="250" y2="100"/><line x1="450" y1="20" x2="450" y2="100"/><line x1="0" y1="20" x2="0" y2="100"/><line x1="700" y1="20" x2="700" y2="100"/></g>
    <circle cx="250" cy="60" r="10" fill="${RED}"/><circle cx="450" cy="60" r="10" fill="${GRN}"/>
    <rect x="320" y="-30" width="60" height="30" rx="5" fill="#111"/><circle cx="335" cy="-15" r="8" fill="${RED}"/><circle cx="365" cy="-15" r="8" fill="${GRN}"/>
    ${r("piste",104,22,142,76)}${r("piste",454,22,142,76)}${r("center",340,22,20,76)}${r("guard",240,22,20,76)}${r("guard",440,22,20,76)}${r("warn",0,22,100,76)}${r("warn",600,22,100,76)}
    ${r("end",-36,22,36,76)}${r("end",700,22,36,76)}${r("box",318,-34,64,36)}${r("sides",0,0,700,20)}${r("sides",0,100,700,20)}</svg>`;
}
const ZONES = {
  piste:{title:"The piste", text:"A strip 14 m long and 1.5 to 2 m wide. Fencers move only forward and backward, which makes footwork everything."},
  center:{title:"Center line", text:"Marks the middle of the piste."},
  guard:{title:"En garde lines", text:"Fencers start each bout, and restart after every touch, on these lines 2 m either side of the center."},
  warn:{title:"Warning zones", text:"The last 2 m at each end, colored differently. They warn a fencer that the end of the piste is close."},
  end:{title:"Rear limit", text:"A fencer who retreats with both feet over the end of the piste concedes a touch."},
  sides:{title:"Side lines", text:"Stepping off the side with both feet stops the bout, and the fencer loses a meter of ground as a penalty."},
  box:{title:"Scoring box", text:"Weapons are wired to an electronic box. A red or green light means a valid touch; a white light in foil means a touch landed off target."}
};
const ZONE_ORDER = ["piste","guard","center","warn","end","sides","box"];

/* Target areas per weapon on a simple silhouette. */
const WEAP = {
  foil:{name:"Foil", target:"torso", pts:"Point only", row:"Yes", text:"A light, flexible weapon. Touches score only with the point, on the torso, including the back and groin but not the arms or head. Right of way decides double hits."},
  epee:{name:"Épée", target:"all", pts:"Point only", row:"No", text:"The heaviest weapon. The whole body is target, from head to toe. There's no right of way: if both fencers hit within a split second of each other, both score."},
  sabre:{name:"Sabre", target:"upper", pts:"Point and edge", row:"Yes", text:"Touches score with the point or the edge of the blade, anywhere above the waist, including head and arms. The fastest weapon, with right of way."}
};
function silo(t){
  const on = "#F2C230", off = "#C9CED2";
  const c = part => t === "all" ? on : t === "upper" ? (part !== "legs" ? on : off) : (part === "torso" ? on : off);
  return `<svg viewBox="0 0 200 260" aria-hidden="true" style="width:200px"><rect width="200" height="260" fill="#2B3831" rx="10"/>
    <circle cx="100" cy="40" r="22" fill="${c("head")}" stroke="${INK}" stroke-width="2"/><rect x="66" y="66" width="68" height="90" rx="14" fill="${c("torso")}" stroke="${INK}" stroke-width="2"/>
    <rect x="34" y="70" width="28" height="80" rx="12" fill="${c("arms")}" stroke="${INK}" stroke-width="2"/><rect x="138" y="70" width="28" height="80" rx="12" fill="${c("arms")}" stroke="${INK}" stroke-width="2"/>
    <rect x="70" y="160" width="26" height="90" rx="10" fill="${c("legs")}" stroke="${INK}" stroke-width="2"/><rect x="104" y="160" width="26" height="90" rx="10" fill="${c("legs")}" stroke="${INK}" stroke-width="2"/></svg>`;
}
function weaponExplorer(){
  const $ = id => document.getElementById(id);
  function show(k){ const w = WEAP[k];
    $("fwPanel").innerHTML = `<div class="jxgrid"><div>${silo(w.target)}<p class="note">Yellow areas are valid target.</p></div><div><h3>${w.name}</h3><dl class="csstats"><div><dt>Scores with</dt><dd>${w.pts}</dd></div><div><dt>Right of way</dt><dd>${w.row}</dd></div></dl><p>${w.text}</p></div></div>`;
    document.querySelectorAll("[data-fw]").forEach(b => b.setAttribute("aria-pressed", b.dataset.fw === k)); }
  document.querySelectorAll("[data-fw]").forEach(b => b.addEventListener("click", () => show(b.dataset.fw))); show("foil");
}

/* Right-of-way referee: decide who scores when both lights go on. */
const PLAYS = [
  {text:"Red extends and attacks. Green, instead of defending, lunges at the same moment. Both lights go on.", ans:{foil:"red", sabre:"red", epee:"both"}, why:{foil:"Red's attack started first, so Red has right of way. Green's counterattack doesn't count.", sabre:"Same in sabre: the attacker has priority over a simultaneous counterattack.", epee:"Épée has no right of way. Both touched within the time window, so both score."}},
  {text:"Red attacks. Green blocks Red's blade with a parry, then hits back with a riposte. Red's remount also lands. Both lights.", ans:{foil:"green", sabre:"green", epee:"first"}, why:{foil:"Green's parry took the right of way, so Green's riposte scores.", sabre:"The parry-riposte wins: Green scores.", epee:"No right of way in épée, so only timing matters: whoever's touch lands first scores, and if both land in the window, both score."}},
  {text:"Both fencers start their attacks at exactly the same moment. Both lights go on.", ans:{foil:"none", sabre:"none", epee:"both"}, why:{foil:"Simultaneous attacks: the referee can't give priority, so no touch is awarded.", sabre:"No touch for simultaneous attacks.", epee:"Both score. Épée is simple that way."}},
  {text:"Red attacks and Green hits Red's arm first with a counterattack, then Red's attack lands on Green's chest.", ans:{foil:"red", sabre:"red", epee:"green"}, why:{foil:"In foil the arm is off target, so Green's hit only shows a white light. Red had right of way and landed on target, so Red scores.", sabre:"In sabre the arm is target, but Red still had right of way, so Red scores.", epee:"In épée, Green's touch to the arm landed first and counts. Green scores."}}
];
function rowRef(){
  const $ = id => document.getElementById(id); let w = "foil", i = 0;
  const OPT = [["red","Red scores"],["green","Green scores"],["both","Both score"],["none","No touch"],["first","Whoever hit first"]];
  function show(){
    const P = PLAYS[i]; $("rwText").textContent = P.text; $("rwMsg").textContent = `You're refereeing ${WEAP[w].name.toLowerCase()}. Who gets the touch?`;
    $("rwBtns").innerHTML = OPT.filter(o => w === "epee" ? o[0] !== "none" : o[0] !== "first").map(([k,l]) => `<button class="btn" type="button" data-rw="${k}">${l}</button>`).join("");
    $("rwBtns").querySelectorAll("[data-rw]").forEach(b => b.addEventListener("click", () => { const ok = b.dataset.rw === P.ans[w]; $("rwMsg").textContent = (ok ? "Correct! " : "Not quite. ") + P.why[w]; }));
    document.querySelectorAll("[data-rww]").forEach(b => b.setAttribute("aria-pressed", b.dataset.rww === w));
  }
  document.querySelectorAll("[data-rww]").forEach(b => b.addEventListener("click", () => { w = b.dataset.rww; show(); }));
  $("rwNext").addEventListener("click", () => { i = (i + 1) % PLAYS.length; show(); }); show();
}

const CARDS = [
  {color:"#F2C230", name:"Yellow card", text:"A warning for a first minor offense, like covering target with the free hand or a delay."},
  {color:RED, name:"Red card", text:"A penalty touch for the opponent. Given for repeated or more serious offenses."},
  {color:"#111", name:"Black card", text:"Exclusion from the competition for serious misconduct."}
];
const CLOCK = [
  {k:"pool", cls:"q", t:"Pools", s:"5 touches", info:["Pool rounds","Fencers are grouped in pools and fence everyone in the group: first to 5 touches, or 3 minutes."]},
  {k:"de", cls:"q", t:"Elimination", s:"15 touches", info:["Direct elimination","Knockout bouts to 15 touches, or three periods of 3 minutes with a 1-minute break."]},
  {k:"pri", cls:"ot", t:"Priority", s:"If tied", info:["Priority minute","If the score is tied at the end of time, one fencer is given priority by lot. One extra minute is fenced; if no touch is scored, the fencer with priority wins."]},
  {k:"team", cls:"q", t:"Teams", s:"To 45", info:["Team events","Three fencers per team fence a relay of nine bouts, adding up to 45 touches."]}
];
const TRICKY = [
  ["What is right of way?","In foil and sabre, when both fencers hit, the touch goes to whoever had priority: usually the one who started the attack first, or who parried and then hit back."],
  ["Why do fencers shout after a touch?","Partly celebration, partly persuasion. In foil and sabre, the referee decides priority, so fencers make their case."],
  ["Why are the weapons wired?","Sensors in the blade tip and conductive jackets register touches too fast for the eye. The lights show who hit, and the referee decides who scores."],
  ["What's a white light?","In foil, a touch that lands off target. It doesn't score, but it stops the action, so a touch that lands after it doesn't count."],
  ["Why do fencers wear masks with mesh?","For safety, with see-through mesh. In sabre the mask is part of the target and conducts electricity."],
  ["How fast is fencing?","A sabre touch can be over in a fraction of a second. That's why slow-motion replays are used for close calls."]
];
const WORDS = [["Touch","A valid hit that scores."],["Lunge","The classic attack: a long step forward while extending the arm."],["Parry","Blocking the opponent's blade."],["Riposte","The counterattack right after a parry."],["Fleche","A running attack, used in foil and épée."],["Priority","Right of way in foil and sabre."],["Bout","A single fencing match."],["Piste","The fencing strip."]];
const QUIZ = [
  {q:"How many weapons are used in Olympic fencing?", o:["1","2","3","4"], a:2, why:"Three: foil, épée, and sabre."},
  {q:"In which weapon is the whole body valid target?", o:["Foil","Épée","Sabre","All of them"], a:1, why:"Épée. Foil targets the torso; sabre, everything above the waist."},
  {q:"Which weapon can score with the edge of the blade?", o:["Foil","Épée","Sabre","None"], a:2, why:"Sabre scores with point or edge."},
  {q:"In épée, both fencers hit at the same moment. What happens?", o:["Nobody scores","Both score","The attacker scores","The bout restarts"], a:1, why:"Épée has no right of way; a double touch scores for both."},
  {q:"In foil, Red attacks and Green counterattacks at the same time. Who scores?", o:["Red","Green","Both","Nobody"], a:0, why:"Red had right of way as the attacker."},
  {q:"How many touches win a direct elimination bout?", o:["5","10","15","45"], a:2, why:"Fifteen touches."},
  {q:"What does a red card give?", o:["A warning","A touch to the opponent","Exclusion","A free attack"], a:1, why:"A red card awards a penalty touch to the opponent."},
  {q:"A fencer retreats with both feet over the end of the piste. What happens?", o:["Nothing","They concede a touch","They lose 1 meter","The bout restarts at center"], a:1, why:"Crossing the rear limit costs a touch."},
  {q:"What is a riposte?", o:["A running attack","A counterattack after a parry","A penalty","A type of mask"], a:1, why:"A riposte follows a successful parry."},
  {q:"What does a white light mean in foil?", o:["A valid touch","An off-target touch that stops the action","A penalty","Time is up"], a:1, why:"White means off target: no point, but the phrase is over."}
];

function render(app){
  app.innerHTML = sportHero({id:"fencing", name:"Fencing", alt:"The tabby cat in a white fencing suit and mask, lunging with a foil",
      lede:"Two fencers face off on a narrow strip, each trying to touch the other with a blade before being touched. Electronic sensors register every hit. There are three weapons, each with its own target and rules about who gets the point when both fencers hit.",
      facts:[["3","weapons"],["14","meters of piste"],["15","touches win a knockout bout"],["1/25","second: about the épée double-touch window"]]})
    + jumpNav([["fe-piste","The piste"],["fe-weap","Three weapons"],["fe-row","Right of way"],["fe-cards","Cards"],["fe-clock","Bouts"],["fe-tricky","Tricky rules"],["fe-words","Words you'll hear"],["fe-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("fe-piste","The piste","Tap any part of the piste to see what it does.",`<div class="fieldbox" id="fePiste">${pisteSVG()}</div><div class="fieldrow"><div class="zonechips" id="feChips"></div><div class="infopanel" id="feInfo" aria-live="polite"></div></div>`)
    + section("fe-weap","Three weapons","Pick a weapon to see its target area and rules.",
        `<div class="controls"><span class="chips">${Object.entries(WEAP).map(([k,w]) => `<button class="chip" type="button" data-fw="${k}">${w.name}</button>`).join("")}</span></div><div class="infopanel" id="fwPanel" style="margin-top:14px"></div>`)
    + section("fe-row","Be the referee: right of way","Both lights went on. Read the action and decide who scores. Switch weapons to see how the same action changes.",
        `<div class="controls"><span class="chips">${Object.entries(WEAP).map(([k,w]) => `<button class="chip" type="button" data-rww="${k}">${w.name}</button>`).join("")}</span></div>
        <div class="rtpanel" style="text-align:left;margin-top:12px"><p id="rwText" style="color:#EEF3EC;font-size:1.2rem;font-weight:600;margin:0 0 14px"></p><div class="controls" id="rwBtns"></div></div>
        <div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="rwMsg"></p></div>
        <div class="controls" style="margin-top:10px"><button class="btn primary" id="rwNext" type="button">Next action</button></div>`)
    + section("fe-cards","Cards","",`<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">${CARDS.map(p => `<div class="score"><div class="pcard" style="background:${p.color}"></div><h3>${p.name}</h3><p>${p.text}</p></div>`).join("")}</div>`)
    + section("fe-clock","Bouts","Tap a stage to learn more.",`<div class="timeline" id="feTimeline"></div><div class="infopanel" id="feClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("fe-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="feFlips"></div>`)
    + section("fe-words","Words you'll hear","",`<dl class="gloss" id="feGloss"></dl>`)
    + section("fe-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="feQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the FIE, used at the Olympics and World Championships.</footer></div>`;
  setupZones(document.getElementById("fePiste"), document.getElementById("feChips"), document.getElementById("feInfo"), ZONES, ZONE_ORDER, "guard");
  weaponExplorer(); rowRef();
  setupTimeline(document.getElementById("feTimeline"), document.getElementById("feClockInfo"), CLOCK, "Bouts are short, but a full day of competition can have a dozen of them.");
  flipCards(document.getElementById("feFlips"), TRICKY); glossary(document.getElementById("feGloss"), WORDS);
  makeQuiz(document.getElementById("feQuiz"), QUIZ, ["Touché! Watch a bout and call right of way before the referee.","Nicely parried. Try the right-of-way referee again with a different weapon.","Look over the three weapons again, then come back for another bout.","No worries. Start with the weapons explorer, then try again."]);
}
SPORT_PAGES["fencing"] = {render};
})();

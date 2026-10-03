/* Taekwondo (Olympic sparring, kyorugi). Rules follow World Taekwondo competition rules with the best-of-three-rounds format. */
(function(){

const INK = "#18221D", RED = "#D9342B", BLUE = "#2F6FD6";
function matSVG(){
  const oct = r => Array.from({length:8}, (_,i) => { const a = Math.PI/8 + i*Math.PI/4; return `${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`; }).join(" ");
  return `<svg viewBox="-250 -250 500 500" role="img" aria-label="Taekwondo competition area seen from above"><rect x="-250" y="-250" width="500" height="500" fill="#1C4D2C"/>
    <rect x="-230" y="-230" width="460" height="460" fill="#3E7CB8"/><polygon points="${oct(190)}" fill="#E8873A"/><polygon points="${oct(190)}" fill="none" stroke="#fff" stroke-width="5"/>
    <line x1="-60" y1="0" x2="-30" y2="0" stroke="${RED}" stroke-width="6"/><line x1="30" y1="0" x2="60" y2="0" stroke="${BLUE}" stroke-width="6"/>
    <circle cx="0" cy="-60" r="10" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <polygon class="hz" data-zone="area" points="${oct(186)}"/><polygon class="hz hzs" data-zone="boundary" points="${oct(190)}" style="stroke-width:18"/>
    <rect class="hz" data-zone="marks" x="-70" y="-14" width="50" height="28"/><rect class="hz" data-zone="marks" x="20" y="-14" width="50" height="28"/>
    <circle class="hz" data-zone="referee" cx="0" cy="-60" r="18"/><rect class="hz" data-zone="outside" x="-250" y="-250" width="500" height="40"/></svg>`;
}
const ZONES = {
  area:{title:"Competition area", text:"An octagon about 8 m across. The athletes in red (hong) and blue (chung) spar inside it."},
  boundary:{title:"Boundary line", text:"Stepping out of the octagon with both feet is a penalty (gam-jeom), giving the opponent a point."},
  marks:{title:"Start marks", text:"The red and blue athletes start each round on their marks, facing each other."},
  referee:{title:"Referee", text:"Controls the match, gives penalties, and calls start (shi-jak) and stop (kal-yeo). Electronic sensors score most kicks."},
  outside:{title:"Safety area", text:"The surrounding area, where coaches sit and can use a video replay challenge."}
};
const ZONE_ORDER = ["area","boundary","marks","referee","outside"];

const PTS = [["Punch to the body",1],["Kick to the body",2],["Kick to the head",3],["Spinning kick to the body",4],["Spinning kick to the head",5]];
function matchSim(){
  const $ = id => document.getElementById(id); const N = ["Red","Blue"]; let S;
  const reset = () => { S = {round:1, p:[0,0], rw:[0,0], pen:[0,0], over:false}; $("tkMsg").textContent = "Best of three rounds, 2 minutes each. Win two rounds to win the match."; draw(); };
  function endRound(w, why){
    S.rw[w]++; let msg = `${why} ${N[w]} wins round ${S.round}.`;
    if(S.rw[w] === 2){ S.over = true; msg += ` That's two rounds: ${N[w]} wins the match.`; }
    else { S.round++; S.p = [0,0]; S.pen = [0,0]; msg += " Scores reset to zero for the next round."; }
    $("tkMsg").textContent = msg; draw();
  }
  function score(w, v, label){
    if(S.over) return; S.p[w] += v; let msg = `${label}: ${N[w]} +${v}.`;
    if(S.p[w] - S.p[1-w] >= 12) return endRound(w, `${msg} A 12-point gap ends the round early.`);
    $("tkMsg").textContent = msg; draw();
  }
  function pen(w){ if(S.over) return; S.pen[w]++; S.p[1-w]++; let msg = `Gam-jeom (penalty) on ${N[w]} for stepping out, falling, or grabbing. ${N[1-w]} gets 1 point.`;
    if(S.pen[w] >= 5) return endRound(1-w, `${msg} Five penalties in a round lose the round.`);
    if(S.p[1-w] - S.p[w] >= 12) return endRound(1-w, `${msg} A 12-point gap ends the round.`);
    $("tkMsg").textContent = msg; draw(); }
  function time(){
    if(S.over) return; const [a,b] = S.p;
    if(a === b){ const w = Math.random() < .5 ? 0 : 1; return endRound(w, `Time, tied ${a}-${b}. A tiebreak decides it, looking first at the higher-value techniques like spinning kicks and head kicks.`); }
    endRound(a > b ? 0 : 1, `Time: ${Math.max(a,b)}-${Math.min(a,b)}.`);
  }
  function draw(){
    $("tkP0").textContent = S.p[0]; $("tkP1").textContent = S.p[1]; $("tkR").textContent = S.over ? "Final" : `Round ${S.round}`;
    $("tkRW").textContent = `${S.rw[0]} - ${S.rw[1]}`;
    document.querySelectorAll("[data-tk]").forEach(b => b.disabled = S.over); $("tkTime").disabled = S.over; $("tkNew").hidden = !S.over;
  }
  document.querySelectorAll("[data-tk]").forEach(b => b.addEventListener("click", () => { const [w,i] = b.dataset.tk.split(":"); i === "pen" ? pen(+w) : score(+w, PTS[+i][1], PTS[+i][0]); }));
  $("tkTime").addEventListener("click", time); $("tkNew").addEventListener("click", reset); reset();
}

const CALLS = [
  {name:"Gam-jeom", text:"The one penalty in taekwondo: 1 point to the opponent. Given for stepping out of the area, falling, grabbing or pushing, kicking below the waist, or attacking after the stop call."},
  {name:"Electronic scoring", text:"Sensor socks and a sensor body protector register kicks automatically, with the force needed depending on weight class. Headgear sensors score head kicks."},
  {name:"Judges for punches", text:"Punches to the body and extra points for spinning kicks are scored by judges pressing buttons."},
  {name:"Video replay", text:"Coaches can challenge a call with a replay. Win the challenge and you keep your challenge card."}
];
const CLOCK = [
  {k:"r1", cls:"q", t:"Round 1", s:"2 min", info:["Round 1","Two minutes. The score starts at 0-0 every round."]},
  {k:"rest", cls:"half", t:"Rest", s:"1 min", info:["Rest","One minute between rounds, with coaching."]},
  {k:"r2", cls:"q", t:"Round 2", s:"2 min", info:["Round 2","If one athlete has won both rounds, the match ends here."]},
  {k:"r3", cls:"ot", t:"Round 3", s:"If 1-1", info:["Round 3","Played only if each athlete has won a round."]}
];
const TRICKY = [
  ["Why do scores reset every round?","In the best-of-three format, each round is its own mini-match. Winning a round 20-2 counts the same as winning it 5-4."],
  ["Why are spinning kicks worth more?","They're harder and riskier, so turning kicks earn extra points from the judges: 4 to the body and 5 to the head."],
  ["Can you kick the legs?","No. Kicks must land on the body protector or the head. Kicking below the waist is a penalty."],
  ["Why don't punches to the head count?","Punches are allowed only to the body. Punching the head is a foul."],
  ["What does the force threshold mean?","The body sensor must feel a hard enough kick to score. The level is set higher for heavier weight classes."],
  ["What are hong and chung?","Korean for red and blue, the two athletes' colors."]
];
const WORDS = [["Kyorugi","Sparring, the Olympic event."],["Hong and chung","Red and blue."],["Gam-jeom","A penalty, worth 1 point to the opponent."],["Shi-jak","Start."],["Kal-yeo","Stop."],["Dollyo chagi","Roundhouse kick, the most common scoring kick."],["Dwi chagi","Back kick, a spinning technique."],["Dobok","The white taekwondo uniform."]];
const QUIZ = [
  {q:"How many points is a kick to the head?", o:["1","2","3","5"], a:2, why:"A head kick is 3; a spinning head kick, 5."},
  {q:"How many points is a punch to the body?", o:["1","2","3","4"], a:0, why:"One point, scored by the judges."},
  {q:"How many rounds must you win to win the match?", o:["1","2","3","4"], a:1, why:"Two out of three rounds."},
  {q:"What happens to the score at the start of each round?", o:["It carries over","It resets to 0-0","The leader keeps 1 point","It doubles"], a:1, why:"Every round starts from zero."},
  {q:"An athlete steps out of the area with both feet. What happens?", o:["Nothing","Gam-jeom: 1 point to the opponent","Disqualification","The round ends"], a:1, why:"Stepping out is a gam-jeom."},
  {q:"What point gap ends a round early?", o:["5","8","10","12"], a:3, why:"A 12-point gap."},
  {q:"Which kick scores the most?", o:["Kick to the body","Spinning kick to the head","Punch","Kick to the legs"], a:1, why:"A spinning kick to the head is worth 5."},
  {q:"How are most kicks scored?", o:["By the referee's eye","By electronic sensors","By the crowd","By the coaches"], a:1, why:"Sensors in the socks, body protector, and headgear."},
  {q:"Can you kick your opponent's legs?", o:["Yes, for 1 point","No, it's a penalty","Only in round 3","Only with a spinning kick"], a:1, why:"Kicks below the waist are fouls."},
  {q:"How long is each round?", o:["1 minute","2 minutes","3 minutes","5 minutes"], a:1, why:"Two minutes."}
];

function render(app){
  app.innerHTML = sportHero({id:"taekwondo", name:"Taekwondo", alt:"The tabby cat in a white dobok and black belt, throwing a high kick",
      lede:"Two athletes in red and blue body protectors spar with kicks and punches. Electronic sensors register kicks to the body and head, with harder kicks worth more points. Each round is a separate contest, and winning two rounds wins the match.",
      facts:[["3","rounds at most, best of three"],["2","minutes per round"],["5","points for a spinning head kick"],["12","point gap ends a round"]]})
    + jumpNav([["tk-area","The area"],["tk-pts","Points"],["tk-sim","Score a match"],["tk-calls","Penalties and scoring"],["tk-clock","Rounds"],["tk-tricky","Tricky rules"],["tk-words","Words you'll hear"],["tk-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("tk-area","The competition area","Tap any part of the area to see what it does.",`<div class="fieldbox" id="tkMat" style="max-width:500px">${matSVG()}</div><div class="fieldrow"><div class="zonechips" id="tkChips"></div><div class="infopanel" id="tkInfo" aria-live="polite"></div></div>`)
    + section("tk-pts","Points","Harder techniques score more.",`<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${PTS.map(([n,v]) => `<div class="score"><div class="pts">${v}</div><h3>${n}</h3></div>`).join("")}</div>`)
    + section("tk-sim","Score a match","Award techniques and penalties, then end each round.",
        `<div class="sim"><div class="board" style="grid-template-columns:1fr 1fr 1fr 1fr"><div><small>Red</small><b id="tkP0">0</b></div><div class="dd"><small>Round</small><b id="tkR" style="font-size:1.7rem"></b></div><div><small>Rounds won</small><b id="tkRW"></b></div><div><small>Blue</small><b id="tkP1">0</b></div></div>
          ${[0,1].map(w => `<div class="controls"><b class="jlab" style="color:${w ? BLUE : RED}">${w ? "Blue" : "Red"}</b>${PTS.map(([n,v],i) => `<button class="btn" type="button" data-tk="${w}:${i}">${n.replace("Spinning kick","Spin").replace("Kick to the","Kick").replace("Punch to the body","Punch")} +${v}</button>`).join("")}<button class="btn" type="button" data-tk="${w}:pen">Gam-jeom</button></div>`).join("")}
          <div class="controls"><button class="btn primary" id="tkTime" type="button">End the round</button><button class="btn primary" id="tkNew" type="button" hidden>New match</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="tkMsg"></p></div></div></div>`)
    + section("tk-calls","Penalties and scoring","",`<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${CALLS.map(d => `<div class="score"><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("tk-clock","Rounds","Tap a round to learn more.",`<div class="timeline" id="tkTimeline"></div><div class="infopanel" id="tkClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("tk-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="tkFlips"></div>`)
    + section("tk-words","Words you'll hear","Taekwondo uses Korean terms worldwide.",`<dl class="gloss" id="tkGloss"></dl>`)
    + section("tk-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="tkQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow World Taekwondo competition rules for Olympic sparring. Details like tiebreak order are updated often.</footer></div>`;
  setupZones(document.getElementById("tkMat"), document.getElementById("tkChips"), document.getElementById("tkInfo"), ZONES, ZONE_ORDER, "area");
  matchSim();
  setupTimeline(document.getElementById("tkTimeline"), document.getElementById("tkClockInfo"), CLOCK, "A match lasts at most about 8 minutes, rests included.");
  flipCards(document.getElementById("tkFlips"), TRICKY); glossary(document.getElementById("tkGloss"), WORDS);
  makeQuiz(document.getElementById("tkQuiz"), QUIZ, ["Perfect kick! Watch a match and call the points as the sensors light up.","Strong round. Score another match to lock in the point values.","Look over the points again, then come back for another round.","No worries. Start with the points cards, then try again."]);
}
SPORT_PAGES["taekwondo"] = {render};
})();

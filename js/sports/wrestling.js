/* Wrestling (freestyle, with Greco-Roman differences). Rules follow United World Wrestling (UWW). */
(function(){

const INK = "#18221D", BLUE = "#2F6FD6", RED = "#D9342B", MAT = "#2F6FD6", ZONE = "#E8873A";
function matSVG(){
  return `<svg viewBox="-260 -260 520 520" role="img" aria-label="Wrestling mat seen from above">
    <rect x="-260" y="-260" width="520" height="520" fill="#1C4D2C"/><rect x="-240" y="-240" width="480" height="480" fill="#3B5E8C"/>
    <circle r="180" fill="${ZONE}"/><circle r="140" fill="#F2C230"/><circle r="20" fill="none" stroke="#fff" stroke-width="4"/>
    <path d="M-230 -230l40 0 -40 40z" fill="${RED}"/><path d="M230 230l-40 0 40 -40z" fill="${BLUE}"/>
    <circle class="hz" data-zone="protection" r="250" style="fill-opacity:0"/>
    <circle class="hz hzs" data-zone="passivity" r="160" style="stroke-width:40"/>
    <circle class="hz" data-zone="central" r="138"/><circle class="hz" data-zone="circle" r="24"/>
    <path class="hz" data-zone="corners" d="M-235 -235h50l-50 50z"/><path class="hz" data-zone="corners" d="M235 235h-50l50 -50z"/></svg>`;
}
const ZONES = {
  central:{title:"Central wrestling area", text:"The 7-meter circle where the action happens. Moves score fully here."},
  passivity:{title:"Protection zone edge", chip:"Orange band", text:"The 1-meter orange band at the edge of the circle. Wrestling continues on it, but a wrestler who puts a foot outside it gives up a point."},
  circle:{title:"Center circle", text:"Bouts start and restart here, with the wrestlers facing each other."},
  corners:{title:"Red and blue corners", text:"Each wrestler is assigned a color, shown by their singlet and corner. Coaches sit nearby and can challenge a call with a video review."},
  protection:{title:"Protection area", text:"The padded border outside the circle, so wrestlers who tumble out land safely."}
};
const ZONE_ORDER = ["central","passivity","circle","corners","protection"];

function boutSim(){
  const $ = id => document.getElementById(id); const N = ["Red","Blue"]; let S;
  const reset = () => { S = {p:[0,0], log:[[],[]], over:false}; $("wrMsg").textContent = "Two periods of 3 minutes. Award points and watch for a fall or a 10-point lead."; draw(); };
  const MOVES = {td:[2,"Takedown: brought the opponent down and got behind in control."], exp:[2,"Exposure: turned the opponent's back toward the mat."], out:[1,"Step out: the opponent put a foot outside the circle."], big:[4,"Big throw: lifted the opponent through the air."], grand:[5,"Grand amplitude throw: a huge lift that lands the opponent directly in danger."], pass:[1,"Passivity: the opponent was put on the activity clock and still didn't score in 30 seconds."]};
  function award(w, k){
    if(S.over) return; const [v, txt] = MOVES[k]; S.p[w] += v; S.log[w].push(v);
    let msg = `${N[w]} +${v}. ${txt}`;
    const lead = S.p[w] - S.p[1-w];
    if(lead >= 10){ S.over = true; msg += ` That's a 10-point lead: technical superiority, and the bout ends early. ${N[w]} wins.`; }
    $("wrMsg").textContent = msg; draw();
  }
  function fall(w){ if(S.over) return; S.over = true; $("wrMsg").textContent = `Fall! ${N[w]} pinned both of the opponent's shoulders to the mat. The bout ends immediately, whatever the score.`; draw(); }
  function time(){
    if(S.over) return; S.over = true; const [a,b] = S.p;
    let msg;
    if(a !== b) msg = `Time! ${N[a > b ? 0 : 1]} wins on points, ${Math.max(a,b)}-${Math.min(a,b)}.`;
    else { const hi = [0,1].map(i => Math.max(0, ...S.log[i])); const w = hi[0] !== hi[1] ? (hi[0] > hi[1] ? 0 : 1) : (S.log[0].length > S.log[1].length ? 0 : 1);
      msg = `Time, and it's tied ${a}-${b}. Tiebreak criteria decide: the higher-value move${hi[0] !== hi[1] ? ` (${Math.max(...hi)} points)` : ", then fewer cautions, then the last point scored"}. ${N[w]} wins.`; }
    $("wrMsg").textContent = msg; draw();
  }
  function draw(){ $("wrP0").textContent = S.p[0]; $("wrP1").textContent = S.p[1]; document.querySelectorAll("[data-wr]").forEach(b => b.disabled = S.over); $("wrNew").hidden = !S.over; }
  document.querySelectorAll("[data-wr]").forEach(b => b.addEventListener("click", () => { const [w,k] = b.dataset.wr.split(":"); k === "fall" ? fall(+w) : award(+w, k); }));
  $("wrTime").addEventListener("click", time); $("wrNew").addEventListener("click", reset); reset();
}

const STYLES = [
  {name:"Freestyle", text:"Attack anywhere on the body, including the legs. Wrestlers can trip and use their legs to score. Technical superiority comes at a 10-point lead."},
  {name:"Greco-Roman", text:"No holds below the waist and no using the legs to trip or lift. It's all upper-body throws and clinches. Technical superiority comes at 8 points."},
  {name:"Women's wrestling", text:"Women compete in freestyle at the Olympics and World Championships."}
];
const WINS = [
  {name:"Fall (pin)", text:"Hold both of the opponent's shoulders on the mat. It ends the bout instantly."},
  {name:"Technical superiority", text:"Build a 10-point lead in freestyle (8 in Greco-Roman), and the bout stops."},
  {name:"Points decision", text:"Lead on points after six minutes."},
  {name:"Criteria", text:"If tied, the wrestler with the highest-scoring single move wins, then the one with fewer cautions, then whoever scored last."},
  {name:"Injury or disqualification", text:"A wrestler who can't continue, or who is disqualified for serious fouls, loses the bout."}
];
const CLOCK = [
  {k:"p1", cls:"q", t:"Period 1", s:"3 min", info:["1st period","Three minutes. Wrestlers start standing, hunting for takedowns."]},
  {k:"brk", cls:"half", t:"Break", s:"30 s", info:["Break","Thirty seconds of rest."]},
  {k:"p2", cls:"q", t:"Period 2", s:"3 min", info:["2nd period","Three more minutes. A wrestler behind on points must attack, which often opens up the bout."]},
  {k:"end", cls:"ot", t:"Result", s:"Points", info:["Result","If no fall or technical superiority, the higher score wins, with criteria breaking ties."]}
];
const TRICKY = [
  ["What counts as a fall?","Both shoulder blades held on the mat at the same time, under control, long enough for the referee to see it clearly."],
  ["What's passivity?","A wrestler who isn't attacking can be put on a 30-second activity clock. If neither wrestler scores in that time, the other wrestler gets a point."],
  ["Why do coaches throw a foam brick?","To challenge a call. If the video review goes against them, the other wrestler gets a point."],
  ["Can you lose a point for stepping out?","Yes. Putting a foot outside the circle gives the opponent 1 point. Pushing someone out is a legitimate tactic."],
  ["Why do wrestlers weigh in?","Wrestlers compete in weight classes, so they weigh in on the morning of competition and must make their weight."],
  ["What's the difference from folkstyle?","US high school and college wrestling (folkstyle) uses different scoring, control-based points, and riding time. Olympic wrestling follows UWW rules."]
];
const WORDS = [["Takedown","Taking the opponent to the mat and controlling them."],["Exposure","Turning the opponent's back toward the mat, also called a gut wrench."],["Fall","A pin: both shoulders on the mat."],["Par terre","Ground wrestling, with one wrestler on hands and knees."],["Singlet","The one-piece red or blue uniform."],["Caution","A penalty for fouls or fleeing, giving points to the opponent."],["Tech fall","Short for technical superiority."],["Shot","A quick dive for the opponent's legs."]];
const QUIZ = [
  {q:"What ends a wrestling bout immediately?", o:["A takedown","A fall (pin)","A step out","A caution"], a:1, why:"Pinning both shoulders ends it at once."},
  {q:"How many points is a takedown?", o:["1","2","3","5"], a:1, why:"Two points."},
  {q:"A wrestler steps outside the circle. What happens?", o:["The opponent gets 1 point","Nothing","The bout restarts with no points","Disqualification"], a:0, why:"Stepping out gives the opponent a point."},
  {q:"In freestyle, what lead ends the bout early?", o:["5 points","8 points","10 points","15 points"], a:2, why:"Ten points is technical superiority in freestyle."},
  {q:"What's different about Greco-Roman wrestling?", o:["No holds below the waist","It's on the ground only","Kicks are allowed","There's no pinning"], a:0, why:"Greco-Roman allows no holds below the waist and no use of legs to attack."},
  {q:"How long is a senior bout?", o:["Two 2-minute periods","Two 3-minute periods","Three 3-minute periods","One 5-minute period"], a:1, why:"Two periods of three minutes."},
  {q:"The score is tied at the end. One wrestler scored a 4-point throw; the other only 2-point moves. Who wins?", o:["The one with the 4-point throw","The one with more moves","Whoever scored first","It's a draw"], a:0, why:"Criteria favor the higher-value move."},
  {q:"A coach throws a foam brick onto the mat. What does it mean?", o:["A protest about the opponent's weight","A video challenge","The wrestler gives up","A timeout"], a:1, why:"It's a challenge for a video review."},
  {q:"What's passivity?", o:["A rest break","A wrestler not attacking, who can be put on a 30-second activity clock","An injury timeout","A type of throw"], a:1, why:"The inactive wrestler is warned, and the opponent can earn a point."},
  {q:"How many points is a grand amplitude throw that lands the opponent in danger?", o:["2","3","4","5"], a:3, why:"Five, the highest-value move."}
];

function render(app){
  app.innerHTML = sportHero({id:"wrestling", name:"Wrestling", alt:"The tabby cat in a blue singlet, crouched in a wrestling stance",
      lede:"Two wrestlers of the same weight try to take each other down and pin both shoulders to the mat. Points come from takedowns, exposures, throws, and pushing the opponent out. A pin, or a 10-point lead, ends the bout instantly.",
      facts:[["6","minutes: two periods of 3"],["2","points for a takedown"],["10","point lead ends it (freestyle)"],["1","pin wins outright"]]})
    + jumpNav([["wr-mat","The mat"],["wr-sim","Score a bout"],["wr-styles","Styles"],["wr-wins","Ways to win"],["wr-clock","The bout"],["wr-tricky","Tricky rules"],["wr-words","Words you'll hear"],["wr-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("wr-mat","The mat","Tap any part of the mat to see what it does.",
        `<div class="fieldbox" id="wrMat" style="max-width:520px">${matSVG()}</div><div class="fieldrow"><div class="zonechips" id="wrChips"></div><div class="infopanel" id="wrInfo" aria-live="polite"></div></div>`)
    + section("wr-sim","Score a bout","Award moves to Red or Blue and see how a freestyle bout is won.",
        `<div class="sim"><div class="board" style="grid-template-columns:1fr 1fr"><div><small>Red</small><b id="wrP0">0</b></div><div><small>Blue</small><b id="wrP1">0</b></div></div>
          ${[0,1].map(w => `<div class="controls"><b class="jlab" style="color:${w ? BLUE : RED}">${w ? "Blue" : "Red"}</b>${[["td","Takedown +2"],["exp","Exposure +2"],["out","Opponent steps out +1"],["big","Big throw +4"],["grand","Grand throw +5"],["pass","Passivity +1"],["fall","Fall (pin)"]].map(([k,l]) => `<button class="btn" type="button" data-wr="${w}:${k}">${l}</button>`).join("")}</div>`).join("")}
          <div class="controls"><button class="btn primary" id="wrTime" type="button">Time runs out</button><button class="btn primary" id="wrNew" type="button" hidden>New bout</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="wrMsg"></p></div></div></div>`)
    + section("wr-styles","Styles","Two styles are wrestled at the Olympics.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${STYLES.map(d => `<div class="score"><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("wr-wins","Ways to win","",`<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${WINS.map(d => `<div class="score"><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("wr-clock","The bout","Tap a part of the bout to learn more.",`<div class="timeline" id="wrTimeline"></div><div class="infopanel" id="wrClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("wr-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="wrFlips"></div>`)
    + section("wr-words","Words you'll hear","",`<dl class="gloss" id="wrGloss"></dl>`)
    + section("wr-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="wrQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow United World Wrestling, used at the Olympics. US high school and college wrestling (folkstyle) has its own scoring.</footer></div>`;
  setupZones(document.getElementById("wrMat"), document.getElementById("wrChips"), document.getElementById("wrInfo"), ZONES, ZONE_ORDER, "central");
  boutSim();
  setupTimeline(document.getElementById("wrTimeline"), document.getElementById("wrClockInfo"), CLOCK, "Wrestlers may compete several bouts in one day, from early rounds to the medal matches.");
  flipCards(document.getElementById("wrFlips"), TRICKY); glossary(document.getElementById("wrGloss"), WORDS);
  makeQuiz(document.getElementById("wrQuiz"), QUIZ, ["Pinned it! Watch a bout and count the points as they come.","A solid win on points. Score another bout to lock it in.","Look over the ways to win again, then come back for another round.","No worries. Start with the mat and the scoring buttons, then try again."]);
}
SPORT_PAGES["wrestling"] = {render};
})();

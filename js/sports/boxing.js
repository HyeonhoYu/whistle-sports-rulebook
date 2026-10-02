/* Boxing. Rules follow common professional practice in the US (state commissions and the Unified Rules);
   Olympic boxing differences are noted. Rules vary by commission, so wording stays general where they differ. */
(function(){

const W = "#F4F6F1", INK = "#18221D", RED = "#C8482F", BLUE = "#2F6FD6", CANVAS = "#E9E4D8";
/* Ring seen from above: ropes square from 0 to 400. */
function ringSVG(){
  const post = (x,y,c) => `<rect x="${x-14}" y="${y-14}" width="28" height="28" rx="5" fill="${c}" stroke="${INK}" stroke-width="3"/>`;
  const judge = (x,y,l) => `<rect x="${x-26}" y="${y-14}" width="52" height="28" rx="5" fill="#2B3831"/><text x="${x}" y="${y+6}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="17" fill="#EEF3EC">${l}</text>`;
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-120 -100 640 600" role="img" aria-label="Boxing ring seen from above">
    <rect x="-120" y="-100" width="640" height="600" fill="#1C4D2C"/><rect x="-40" y="-40" width="480" height="480" fill="#5E6B64"/>
    <rect width="400" height="400" fill="${CANVAS}"/><circle cx="200" cy="200" r="60" fill="none" stroke="#C9C2B2" stroke-width="3"/>
    ${[0,6,12,18].map(o => `<rect x="${-o}" y="${-o}" width="${400+2*o}" height="${400+2*o}" fill="none" stroke="${o === 0 ? RED : o === 18 ? BLUE : W}" stroke-width="3" opacity=".9"/>`).join("")}
    ${post(-9,-9,RED)}${post(409,409,BLUE)}${post(409,-9,"#fff")}${post(-9,409,"#fff")}
    ${judge(200,-75,"Judge 1")}${judge(-85,200,"Judge 2")}${judge(485,200,"Judge 3")}
    <text x="200" y="478" text-anchor="middle" font-family="Barlow,sans-serif" font-size="16" fill="#A9B8AE">Ringside: doctor, timekeeper, commission</text>
    <circle cx="230" cy="170" r="15" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M220 166h20M220 174h20" stroke="${INK}" stroke-width="2.5"/>
    ${r("apron",-40,-40,480,22)}${r("apron",-40,418,480,22)}${r("apron",-40,-18,22,436)}${r("apron",418,-18,22,436)}
    ${r("canvas",30,30,340,340)}${r("ropes",-20,-20,440,46)}${r("ropes",-20,374,440,46)}${r("ropes",-20,26,46,348)}${r("ropes",374,26,46,348)}
    <circle class="hz" data-zone="referee" cx="230" cy="170" r="22"/>
    ${r("judges",160,-95,80,40)}${r("judges",-115,180,60,40)}${r("judges",455,180,60,40)}
    ${r("red",-30,-30,60,60)}${r("blue",370,370,60,60)}${r("neutral",370,-30,60,60)}${r("neutral",-30,370,60,60)}</svg>`;
}
const ZONES = {
  canvas:{title:"Canvas", text:"The padded floor of the ring. In professional boxing the ring is usually 16 to 24 feet square inside the ropes. Bigger rings favor movers; smaller ones favor pressure fighters."},
  ropes:{title:"Ropes", text:"Four ropes surround the ring. A fighter who is helpless on the ropes can be ruled knocked down even without touching the canvas, and the referee may start a count."},
  red:{title:"Red corner", text:"Each fighter is assigned a corner where they rest with their team between rounds. The red corner usually goes to the champion or the favored fighter."},
  blue:{title:"Blue corner", text:"The other fighter's corner. Between rounds, cornermen give water, advice, and care for cuts during the one-minute rest."},
  neutral:{title:"Neutral corners", text:"The two white corners belong to neither fighter. When one fighter is knocked down, the other must go to the farthest neutral corner and wait there during the count."},
  referee:{title:"Referee", text:"The only official in the ring. The referee enforces the rules, separates clinches, counts knockdowns, warns or deducts points for fouls, and can stop the fight to protect a fighter."},
  judges:{title:"Judges", text:"Three judges sit on different sides of the ring and score each round on their own. The referee doesn't score in most professional fights."},
  apron:{title:"Apron", text:"The ledge outside the ropes. Cornermen step up here between rounds but must leave the ring before the bell."}
};
const ZONE_ORDER = ["canvas","ropes","red","blue","neutral","referee","judges","apron"];

/* Legal and illegal target areas: front and back silhouettes. */
function bodySVG(){
  const fig = (cx, back) => `<g fill="#CFC8B8" stroke="${INK}" stroke-width="3">
    <circle cx="${cx}" cy="50" r="30"/><rect x="${cx-14}" y="78" width="28" height="14"/>
    <rect x="${cx-48}" y="90" width="96" height="120" rx="20"/><rect x="${cx-46}" y="206" width="92" height="40" rx="8" fill="#2B3831"/>
    <rect x="${cx-42}" y="244" width="38" height="110" rx="12"/><rect x="${cx+4}" y="244" width="38" height="110" rx="12"/>
    <rect x="${cx-74}" y="96" width="24" height="96" rx="12"/><rect x="${cx+50}" y="96" width="24" height="96" rx="12"/>
    <circle cx="${cx-62}" cy="200" r="16" fill="${RED}"/><circle cx="${cx+62}" cy="200" r="16" fill="${RED}"/></g>
    <line x1="${cx-52}" y1="206" x2="${cx+52}" y2="206" stroke="#F2C230" stroke-width="4" stroke-dasharray="8 5"/>
    <text x="${cx}" y="390" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="24" fill="#EEF3EC">${back ? "Back" : "Front"}</text>`;
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>`;
  return `<svg viewBox="0 0 480 410" role="img" aria-label="Legal and illegal target areas on a boxer">
    <rect width="480" height="410" fill="#1C4D2C"/>${fig(120, false)}${fig(360, true)}
    <g pointer-events="none"><circle cx="120" cy="50" r="30" fill="#7FD39A" opacity=".45"/><rect x="72" y="90" width="96" height="116" rx="20" fill="#7FD39A" opacity=".45"/>
      <rect x="74" y="206" width="92" height="148" rx="10" fill="#FF4D3D" opacity=".35"/><rect x="314" y="206" width="92" height="148" rx="10" fill="#FF4D3D" opacity=".35"/>
      <circle cx="360" cy="50" r="30" fill="#FF4D3D" opacity=".35"/><rect x="312" y="90" width="96" height="116" rx="20" fill="#FF4D3D" opacity=".35"/></g>
    <circle class="hz" data-zone="head" cx="120" cy="50" r="32"/>${r("body",72,92,96,114)}${r("low",72,206,96,150)}${r("arms",44,94,28,90)}${r("arms",168,94,28,90)}
    <circle class="hz" data-zone="backhead" cx="360" cy="50" r="32"/>${r("back",312,92,96,114)}${r("low",312,206,96,150)}${r("arms",284,94,28,90)}${r("arms",408,94,28,90)}</svg>`;
}
const TARGETS = {
  head:{title:"Front and sides of the head", chip:"Head", text:"Legal. Punches must land with the knuckle part of a closed glove. Clean shots to the head often win rounds on the judges' cards."},
  body:{title:"Body above the belt", chip:"Body", text:"Legal, front and sides. Body punches add up over a fight, slowing an opponent down even when they don't look dramatic."},
  low:{title:"Below the belt", chip:"Below the belt", text:"Foul. The belt line, shown in yellow, is the lower limit. A low blow can bring a warning, a point deduction, or disqualification, and the fouled fighter may get up to five minutes to recover."},
  arms:{title:"Arms and gloves", chip:"Arms", text:"Not a foul, but punches that land on the arms or gloves are blocked and don't score with the judges."},
  backhead:{title:"Back of the head and neck", chip:"Back of the head", text:"Foul. Hitting behind the head, called a rabbit punch, is especially dangerous and strictly penalized."},
  back:{title:"Back and kidneys", chip:"Back", text:"Foul. Punches to the back, including the kidney area, are illegal. The sides of the body are fine; the back is not."}
};
const TARGET_ORDER = ["head","body","arms","low","backhead","back"];

/* Scorecard simulator: you score each round alongside three judges. */
function cardSim(){
  const $ = id => document.getElementById(id); const NAME = ["Red","Blue"], ROUNDS = 12;
  let S;
  const reset = () => { S = {r:0, J:[[],[],[]], U:[], ev:null, over:false, result:""}; next(); };
  function makeEvent(){
    const s = Math.random() < .5 ? 0 : 1, o = 1 - s, k = Math.random();
    if(k < .45) return {type:"close", s, text:`A close round. ${NAME[s]} throws more punches, but ${NAME[o]} lands a few hard counters.`};
    if(k < .75) return {type:"clear", s, text:`${NAME[s]} controls the round, landing the cleaner, harder punches and pushing ${NAME[o]} back.`};
    if(k < .9) return {type:"kd", s, text:`${NAME[s]} drops ${NAME[o]} with a right hand! ${NAME[o]} beats the count and survives the round.`};
    return {type:"foul", s, f:o, text:`An even, scrappy round. The referee deducts a point from ${NAME[o]} after repeated low blows.`};
  }
  function next(){ S.ev = makeEvent(); $("bxEvent").textContent = `Round ${S.r + 1} of ${ROUNDS}. ${S.ev.text}`; draw(); }
  function judgeScore(ev){
    let w = ev.s;
    if(ev.type === "close"){ const q = Math.random(); w = q < .62 ? ev.s : q < .95 ? 1 - ev.s : -1; }
    if(ev.type === "clear" && Math.random() < .05) w = 1 - ev.s;
    if(ev.type === "foul"){ const q = Math.random(); w = q < .4 ? 0 : q < .8 ? 1 : -1; }
    let sc = w === -1 ? [10,10] : w === 0 ? [10,9] : [9,10];
    if(ev.type === "kd"){ sc = ev.s === 0 ? [10,8] : [8,10]; }
    if(ev.type === "foul") sc[ev.f]--;
    return sc;
  }
  function userScore(pick, ev){
    let sc = pick === "even" ? [10,10] : pick === "red" ? [10,9] : [9,10];
    if(ev.type === "kd"){ const kdBy = ev.s === 0 ? "red" : "blue"; sc = ev.s === 0 ? [10,8] : [8,10]; if(pick !== kdBy && pick !== "even") sc = ev.s === 0 ? [10,9] : [9,10]; }
    if(ev.type === "foul") sc[ev.f]--;
    return sc;
  }
  const tot = card => card.reduce((a,c) => [a[0]+c[0], a[1]+c[1]], [0,0]);
  function decision(){
    const w = S.J.map(c => { const [a,b] = tot(c); return a > b ? 0 : b > a ? 1 : -1; });
    const red = w.filter(x => x === 0).length, blue = w.filter(x => x === 1).length, draw = w.filter(x => x === -1).length;
    if(red === 3 || blue === 3) return `Unanimous decision for ${red === 3 ? "Red" : "Blue"}: all three judges scored it the same way.`;
    if(red === 2 && blue === 1 || blue === 2 && red === 1) return `Split decision for ${red === 2 ? "Red" : "Blue"}: two judges for the winner, one for the loser.`;
    if(red === 2 || blue === 2) return `Majority decision for ${red === 2 ? "Red" : "Blue"}: two judges for the winner, one scored it a draw.`;
    if(draw === 3) return "Unanimous draw: all three judges scored it even.";
    if(draw === 2) return "Majority draw: two judges scored it even, so the fight is a draw.";
    return "Split draw: one judge for each fighter and one even. The fight is a draw.";
  }
  function score(pick){
    if(S.over) return; const ev = S.ev;
    S.J.forEach(c => c.push(judgeScore(ev))); S.U.push(userScore(pick, ev));
    S.r++;
    const agree = S.J.filter(c => { const [a,b] = c[c.length-1], [x,y] = S.U[S.U.length-1]; return (a > b) === (x > y) && (a < b) === (x < y); }).length;
    let msg = ev.type === "kd" ? `A knockdown round is scored 10-8 for the fighter who scored it.` : ev.type === "foul" ? `The deducted point comes off that fighter's score on every judge's card.` : ev.type === "close" ? `Close rounds split judges. That's normal.` : `A clear round is 10-9 for the winner.`;
    msg += ` ${agree} of 3 judges agreed with you.`;
    if(ev.type === "kd" && S.r >= 4 && Math.random() < .25){
      S.over = true; S.result = `Fight over in round ${S.r}! The referee waves it off after the knockdown: TKO for ${NAME[ev.s]}. The scorecards no longer matter.`;
    } else if(S.r === ROUNDS){ S.over = true; S.result = `That's 12 rounds. The scorecards decide it. ${decision()}`; }
    $("bxMsg").textContent = S.over ? S.result : msg;
    if(!S.over) next(); else draw();
  }
  function draw(){
    const cell = c => c ? `${c[0]}-${c[1]}` : "";
    const row = (name, card, cls="") => { const [a,b] = tot(card); return `<tr class="${cls}"><th>${name}</th>${Array.from({length:ROUNDS}, (_,i) => `<td>${cell(card[i])}</td>`).join("")}<td class="tot">${card.length ? `${a}-${b}` : ""}</td></tr>`; };
    $("bxCards").innerHTML = `<table class="bxcard"><thead><tr><th></th>${Array.from({length:ROUNDS}, (_,i) => `<th class="${i === S.r && !S.over ? "now" : ""}">R${i+1}</th>`).join("")}<th>Total<br><small>Red-Blue</small></th></tr></thead>
      <tbody>${row("Judge 1",S.J[0])}${row("Judge 2",S.J[1])}${row("Judge 3",S.J[2])}${row("Your card",S.U,"you")}</tbody></table>`;
    document.querySelectorAll("[data-pick]").forEach(b => b.hidden = S.over); $("bxNew").hidden = !S.over;
    if(S.over) $("bxEvent").textContent = "The fight is over.";
  }
  document.querySelectorAll("[data-pick]").forEach(b => b.addEventListener("click", () => score(b.dataset.pick)));
  $("bxNew").addEventListener("click", () => { reset(); $("bxMsg").textContent = "New fight. Read the round, then score it."; });
  reset();
}

/* Knockdown count */
function countDemo(){
  const $ = id => document.getElementById(id); let n = 0, timer = null, up = false;
  const show = (msg) => { $("kdNum").textContent = n || "-"; if(msg) $("kdMsg").textContent = msg; };
  const stop = () => { clearInterval(timer); timer = null; };
  $("kdStart").addEventListener("click", () => {
    stop(); n = 0; up = false; show("Knockdown! The other fighter goes to the farthest neutral corner, and the referee starts counting.");
    timer = setInterval(() => { n++;
      if(up && n >= 8){ stop(); show("Eight. The referee checks the fighter's eyes and asks them to walk forward. They look ready, so the fight continues."); return; }
      if(n >= 10){ stop(); show("Ten! The fighter didn't beat the count. That's a knockout."); return; }
      show(); }, 900);
  });
  $("kdUp").addEventListener("click", () => {
    if(!timer) return; up = true;
    if(n < 8) show(`The fighter is up at ${n}, but the referee keeps counting to 8 anyway. That's the mandatory eight count, a chance to check if they can continue.`);
    else { stop(); show(`Up at ${n}. The referee checks the fighter and lets the fight continue.`); }
  });
  show();
}

const silo = hi => `<svg viewBox="0 0 120 150" aria-hidden="true"><rect width="120" height="150" fill="#1C4D2C"/>
  <g fill="#CFC8B8" stroke="${INK}" stroke-width="2"><circle cx="60" cy="26" r="16"/><rect x="34" y="44" width="52" height="58" rx="10"/><rect x="36" y="100" width="48" height="16" rx="4" fill="#2B3831"/><rect x="38" y="114" width="20" height="34" rx="6"/><rect x="62" y="114" width="20" height="34" rx="6"/></g>${hi}</svg>`;
const ring = (cx,cy,rr) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="#FF4D3D" stroke-width="4"/>`;
const FOULS = [
  {name:"Low blow", text:"Any punch below the belt line. The fouled fighter can get up to five minutes to recover.", art: silo(ring(60,118,22))},
  {name:"Rabbit punch", text:"Hitting the back of the head or neck. One of the most dangerous fouls.", art: silo(`<path d="M60 10a16 16 0 0 1 14 22" fill="none" stroke="#FF4D3D" stroke-width="5"/>`)},
  {name:"Headbutt", text:"Leading with the head into an opponent. If an accidental clash causes a cut, the fight may go to the scorecards early.", art: silo(`<circle cx="98" cy="26" r="16" fill="#CFC8B8" stroke="${INK}" stroke-width="2"/>` + ring(80,26,14))},
  {name:"Holding", text:"Grabbing and holding instead of punching. Some clinching is normal, but holding and hitting is a foul, and the referee breaks it up.", art: silo(`<path d="M20 60q40 30 80 0" fill="none" stroke="#FF4D3D" stroke-width="5"/>`)},
  {name:"After the bell", text:"Punching after the bell ends the round, or hitting an opponent who is down.", art: silo(`<circle cx="98" cy="20" r="12" fill="#F2C230" stroke="${INK}" stroke-width="2"/><path d="M92 34h12" stroke="${INK}" stroke-width="3"/>` + ring(98,22,18))},
  {name:"Kidney punch", text:"Hitting the lower back. The sides of the body are fair, but the back is not.", art: silo(ring(60,86,20))}
];
const WAYS = [
  {name:"Knockout (KO)", text:"A fighter is knocked down and can't get up and show they're ready before the referee counts to 10."},
  {name:"Technical knockout (TKO)", text:"The referee, the ringside doctor, or the fighter's own corner stops the fight because a fighter can't safely continue."},
  {name:"Decision", text:"If the fight goes the distance, the judges' scorecards decide it: unanimous, split, or majority."},
  {name:"Disqualification (DQ)", text:"A fighter loses for serious or repeated fouls, after warnings and point deductions."},
  {name:"Technical decision", text:"An accidental foul, like a head clash cut, stops the fight after enough rounds; the cards decide it. Too early, and it's a draw or no contest."},
  {name:"Draw", text:"The scorecards come out even. Titles usually stay with the champion after a draw."}
];

const CLOCK = [
  {k:"r1", cls:"q", t:"R1 to R4", s:"3 min each", info:["Early rounds","Professional rounds last 3 minutes with 1 minute of rest between them. Fighters often feel each other out early."]},
  {k:"rest", cls:"half", t:"Rest", s:"1 min", info:["Between rounds","One minute in the corner for water, advice, and treating cuts. The fight resumes at the bell."]},
  {k:"r5", cls:"q", t:"R5 to R8", s:"3 min each", info:["Middle rounds","Body punches thrown earlier start to pay off. If an accidental foul stops a fight from here on, the scorecards usually decide it."]},
  {k:"r9", cls:"q", t:"R9 to R12", s:"Championship", info:["Championship rounds","World title fights are scheduled for 12 rounds. Non-title bouts are usually 4 to 10 rounds."]},
  {k:"cards", cls:"ot", t:"Cards", s:"If it goes the distance", info:["The scorecards","If no one is stopped, the three judges' totals are read out and the decision is announced."]}
];
const TRICKY = [
  ["What's the 10-point must system?","Each judge must give 10 points to the round's winner and 9 or fewer to the loser. A knockdown usually makes it 10-8. Truly even rounds are 10-10."],
  ["Does the referee score the fight?","Not in most professional fights. Three judges score it. The referee's job is to enforce the rules and keep fighters safe."],
  ["Can the bell save a fighter?","It depends on where the fight is held. In many professional fights, the count continues even if the round ends. Commissions set their own rules."],
  ["Why is a slip not a knockdown?","A knockdown needs a legal punch. If a fighter falls from a trip, a push, or slipping on the canvas, the referee rules it a slip with no count and no point lost."],
  ["What's the difference between KO and TKO?","A knockout means the fighter couldn't beat the 10 count. A TKO means the fight was stopped for another reason, like a referee stoppage while the fighter is still standing."],
  ["How is Olympic boxing different?","Olympic bouts are three rounds of three minutes, scored on the same 10-point must system by five judges, and fighters wear vests in their corner color."]
];
const WORDS = [
  ["Jab","A quick, straight punch with the lead hand, used to measure distance and set up combinations."],
  ["Cross","A straight power punch with the rear hand."],
  ["Hook","A curved punch thrown from the side."],
  ["Uppercut","An upward punch thrown from below."],
  ["Clinch","Tying up the opponent's arms at close range to stop punches."],
  ["Southpaw","A left-handed stance, with the right hand and foot forward."],
  ["Counterpunch","A punch thrown right after the opponent's punch, when they're open."],
  ["Standing eight count","A count given to a fighter who's in trouble but still standing. Used in some jurisdictions, not all."],
  ["Weight class","Fighters compete against others within a weight range, from strawweight to heavyweight."],
  ["Going the distance","Lasting all the scheduled rounds without a stoppage."]
];

const lowMini = () => silo(`<circle cx="60" cy="120" r="7" fill="#F2C230" stroke="${INK}" stroke-width="2"/>`).replace('aria-hidden="true"', 'aria-hidden="true" style="width:140px;border-radius:8px"');
const QUIZ = [
  {q:"How long is a round in professional boxing?", o:["2 minutes","3 minutes","5 minutes","10 minutes"], a:1, why:"Three minutes, with a one-minute rest between rounds."},
  {q:"A fighter wins a round with no knockdowns. How do judges usually score it?", o:["10-9","10-8","1-0","10-0"], a:0, why:"The 10-point must system: 10 for the winner, 9 for the loser."},
  {q:"A fighter scores one knockdown in a round. What's the usual score?", o:["10-9","10-8","10-7","10-10"], a:1, why:"A knockdown typically costs an extra point, making it 10-8."},
  {q:"Two judges score the fight for Red and one for Blue. What's the result?", o:["Unanimous decision","Majority decision","Split decision","Draw"], a:2, why:"Two judges for one fighter and one for the other is a split decision."},
  {q:"Two judges score it for Red and the third scores it even. What's the result?", o:["Split decision","Majority decision for Red","Draw","No contest"], a:1, why:"Two for the winner and one draw is a majority decision."},
  {q:"A punch lands at the marked spot. What's the call?", visual: lowMini, o:["A legal body shot","Foul: a low blow","A knockdown","A clinch"], a:1, why:"That's below the belt line, so it's a low blow."},
  {q:"A fighter goes down and doesn't get up before the referee counts to 10. What's the result?", o:["Knockout","Technical knockout","Decision","Draw"], a:0, why:"Failing to beat the 10 count is a knockout."},
  {q:"The referee stops the fight because a fighter is taking punishment and can't defend themselves. What's the result?", o:["KO","Disqualification","TKO","Split decision"], a:2, why:"A stoppage without a 10 count is a technical knockout."},
  {q:"After a knockdown, where must the other fighter go?", o:["Their own corner","The farthest neutral corner","The center of the ring","Outside the ropes"], a:1, why:"To the farthest neutral corner, until the referee says to continue."},
  {q:"How many rounds is a professional world title fight?", o:["8","10","15","12"], a:3, why:"Twelve rounds. Title fights were 15 rounds until the 1980s."}
];

function render(app){
  app.innerHTML = sportHero({id:"boxing", name:"Boxing", alt:"The tabby cat wearing black boxing gloves, in a fighting stance",
      lede:"Two fighters in the same weight class trade punches inside a roped ring, using only their gloved fists on legal targets above the belt. A fight ends early with a knockout or a stoppage. Otherwise, three judges score every round and decide the winner.",
      facts:[["3","minutes per round"],["12","rounds in a title fight"],["10","the count for a knockout"],["3","judges scoring each round"]]})
    + jumpNav([["bx-ring","The ring"],["bx-targets","Legal targets"],["bx-cards","Score a fight"],["bx-count","The count"],["bx-fouls","Fouls"],["bx-ways","Ways to win"],["bx-clock","Rounds"],["bx-tricky","Tricky rules"],["bx-words","Words you'll hear"],["bx-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("bx-ring","The ring","Tap any part of the ring to see what it does. It's called a ring, but it's square.",
        `<div class="fieldbox" id="bxRing" style="max-width:640px">${ringSVG()}</div><div class="fieldrow"><div class="zonechips" id="bxChips"></div><div class="infopanel" id="bxInfo" aria-live="polite"></div></div>`)
    + section("bx-targets","Legal targets","Green areas are legal targets; red areas are fouls. Tap a part of the body to learn more. The yellow dashes mark the belt line.",
        `<div class="fieldbox" id="bxBody" style="max-width:560px">${bodySVG()}</div><div class="fieldrow"><div class="zonechips" id="bxTChips"></div><div class="infopanel" id="bxTInfo" aria-live="polite"></div></div>`)
    + section("bx-cards","Score a fight","You're the fourth judge for a 12-round fight between Red and Blue. Read what happened in each round, score it, and compare your card with the three official judges.",
        `<div class="sim"><div class="result narrator"><img src="${img("head.webp")}" alt=""><div><p id="bxEvent" style="font-weight:600"></p><p class="hint" id="bxMsg">Pick who won the round. Knockdowns and deductions are applied for you.</p></div></div>
          <div class="controls"><button class="btn" data-pick="red" type="button" style="border-color:${RED}">Red won the round</button><button class="btn" data-pick="even" type="button">Even round</button><button class="btn" data-pick="blue" type="button" style="border-color:${BLUE}">Blue won the round</button><button class="btn primary" id="bxNew" type="button" hidden>Score a new fight</button></div>
          <div class="cardwrap" id="bxCards"></div></div>`)
    + section("bx-count","The count","Start a knockdown, then decide when the fighter gets up.",
        `<div class="shotclock"><div class="scface"><small>Referee's count</small><b id="kdNum">-</b></div>
          <div class="osside"><div class="narrator"><img src="${img("head.webp")}" alt=""><p id="kdMsg">When a fighter goes down, the referee counts out loud, one number per second.</p></div>
            <div class="controls"><button class="btn primary" id="kdStart" type="button">Knockdown!</button><button class="btn" id="kdUp" type="button">Fighter gets up</button></div></div></div>`)
    + section("bx-fouls","Fouls","The referee can warn, deduct a point, or disqualify. Red circles show where each foul happens.",
        `<div class="scoring restarts">${FOULS.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("bx-ways","Ways to win","Most fights end in one of these six ways.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${WAYS.map(w => `<div class="score"><h3>${w.name}</h3><p>${w.text}</p></div>`).join("")}</div>`)
    + section("bx-clock","Rounds","Tap a part of a 12-round title fight.",
        `<div class="timeline" id="bxTimeline"></div><div class="infopanel" id="bxClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("bx-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="bxFlips"></div>`)
    + section("bx-words","Words you'll hear","",`<dl class="gloss" id="bxGloss"></dl>`)
    + section("bx-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="bxQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page reflect common professional practice in the United States. Each state commission and country sets its own details, such as the standing eight count and whether the bell can end a count. Olympic boxing differences are noted.</footer></div>`;

  setupZones(document.getElementById("bxRing"), document.getElementById("bxChips"), document.getElementById("bxInfo"), ZONES, ZONE_ORDER, "neutral");
  setupZones(document.getElementById("bxBody"), document.getElementById("bxTChips"), document.getElementById("bxTInfo"), TARGETS, TARGET_ORDER, "low");
  cardSim(); countDemo();
  setupTimeline(document.getElementById("bxTimeline"), document.getElementById("bxClockInfo"), CLOCK,
    "A 12-round fight that goes the distance lasts 47 minutes from the first bell to the last, rests included.");
  flipCards(document.getElementById("bxFlips"), TRICKY);
  glossary(document.getElementById("bxGloss"), WORDS);
  makeQuiz(document.getElementById("bxQuiz"), QUIZ, [
    "Unanimous decision! Score a real fight round by round and compare your card with the judges'.",
    "Strong card. Score another fight in the simulator and the 10-point must system will feel natural.",
    "Look over the ways to win and the legal targets again, then come back for another round.",
    "No worries. Start with the legal targets and score a few rounds in the simulator, then try again."]);
}

SPORT_PAGES["boxing"] = {render};
})();

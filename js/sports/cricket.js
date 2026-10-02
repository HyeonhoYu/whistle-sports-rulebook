/* Cricket. Rules follow the MCC Laws of Cricket and ICC playing conditions, with a focus on T20. */
(function(){

const W = "#F4F6F1", INK = "#18221D", G1 = "#2F7546", G2 = "#2A6B3F", PITCH = "#D9C28A";
/* Ground seen from above: oval boundary, 30-yard circle, pitch in the middle (drawn larger than scale). */
function groundBase(){
  return `<rect x="-310" y="-270" width="620" height="540" fill="#1C4D2C"/>
    <ellipse cx="0" cy="0" rx="285" ry="245" fill="${G1}"/>${[230,190,150].map((r,i) => `<ellipse cx="0" cy="0" rx="${r + 30}" ry="${r}" fill="none" stroke="${G2}" stroke-width="18" opacity=".6"/>`).join("")}
    <ellipse cx="0" cy="0" rx="285" ry="245" fill="none" stroke="#fff" stroke-width="5"/>
    <path d="M-110 -70A110 110 0 0 1 110 -70V70A110 110 0 0 1 -110 70Z" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="8 7"/>
    <rect x="-14" y="-74" width="28" height="148" fill="${PITCH}"/>
    ${[-62,62].map(y => `<line x1="-16" y1="${y}" x2="16" y2="${y}" stroke="#fff" stroke-width="2"/><line x1="-16" y1="${y + (y < 0 ? -8 : 8)}" x2="16" y2="${y + (y < 0 ? -8 : 8)}" stroke="#fff" stroke-width="1.5"/>
      <g fill="#7A4521">${[-4,0,4].map(x => `<circle cx="${x}" cy="${y + (y < 0 ? -8 : 8)}" r="2"/>`).join("")}</g>`).join("")}
    ${[[-60,-120],[80,-120],[150,-20],[120,90],[-120,60],[-60,140],[30,190],[-200,-60],[200,150]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#2F6FD6" stroke="${INK}" stroke-width="1.5"/>`).join("")}
    <circle cx="0" cy="94" r="7" fill="#2F6FD6" stroke="${INK}" stroke-width="1.5"/><circle cx="0" cy="-96" r="7" fill="#2F6FD6" stroke="${INK}" stroke-width="1.5"/><circle cx="0" cy="50" r="7" fill="#C8482F" stroke="${INK}" stroke-width="1.5"/><circle cx="16" cy="-60" r="7" fill="#C8482F" stroke="${INK}" stroke-width="1.5"/>`;
}
function groundSVG(){
  return `<svg viewBox="-310 -270 620 540" role="img" aria-label="Cricket ground seen from above">${groundBase()}
    <ellipse class="hz" data-zone="outfield" cx="0" cy="0" rx="280" ry="240"/>
    <path class="hz" data-zone="circle" d="M-110 -70A110 110 0 0 1 110 -70V70A110 110 0 0 1 -110 70Z"/>
    <rect class="hz" data-zone="pitch" x="-14" y="-52" width="28" height="104"/>
    <rect class="hz" data-zone="crease" x="-20" y="-68" width="40" height="12"/><rect class="hz" data-zone="crease" x="-20" y="56" width="40" height="12"/>
    <rect class="hz" data-zone="stumps" x="-12" y="-78" width="24" height="10"/><rect class="hz" data-zone="stumps" x="-12" y="66" width="24" height="10"/>
    <ellipse class="hz hzs" data-zone="boundary" cx="0" cy="0" rx="285" ry="245" style="stroke-width:16"/>
    <circle class="hz" data-zone="keeper" cx="0" cy="94" r="12"/><circle class="hz" data-zone="bowler" cx="0" cy="-96" r="12"/><circle class="hz" data-zone="batters" cx="0" cy="50" r="11"/><circle class="hz" data-zone="batters" cx="16" cy="-60" r="11"/></svg>`;
}
const ZONES = {
  pitch:{title:"The pitch", text:"The 22-yard (20 m) strip in the middle where the bowler bowls and the batters run. Its surface, hard or soft, dry or green, changes how the ball bounces and spins."},
  stumps:{title:"The wicket", text:"Three wooden stumps topped with two small bails, at each end of the pitch. If the ball knocks a bail off, the batter can be out."},
  crease:{title:"The popping crease", text:"The line 4 feet in front of each wicket. A batter is safe when their bat or body is grounded behind it. The bowler's front foot must land with some part behind it, or it's a no-ball."},
  batters:{title:"The batters", text:"Two batters are in at a time (red dots): the striker facing the bowler, and the non-striker at the bowler's end. They score runs by running to swap ends, or by hitting the ball to the boundary."},
  bowler:{title:"The bowler", text:"Runs in from behind the far wicket and bowls with a straight arm, usually bouncing the ball on the pitch. The bowler and wicketkeeper make 11 fielders with the nine in the outfield."},
  keeper:{title:"Wicketkeeper", text:"The fielder crouching behind the batter's stumps, wearing gloves. The only fielder allowed to wear gloves and pads."},
  circle:{title:"The 30-yard circle", text:"Marks the inner ring. During the powerplay (the first 6 overs of a T20 innings), only two fielders may be outside it, so batters attack."},
  outfield:{title:"The outfield", text:"The big grass area where nine fielders (blue dots) try to stop the ball and catch it. Fielding positions have names like slip, point, cover, and long-on."},
  boundary:{title:"The boundary", text:"The rope around the edge. A ball that rolls or bounces over it scores 4 runs. A ball that flies over it without touching the ground scores 6."}
};
const ZONE_ORDER = ["pitch","stumps","crease","batters","bowler","keeper","circle","outfield","boundary"];

/* Chase simulator: the last 3 overs of a T20 chase. */
function chaseSim(){
  const $ = id => document.getElementById(id); let S;
  function reset(){
    const need = 22 + Math.floor(Math.random()*11);
    S = {target: 160 + Math.floor(Math.random()*20), balls:102, wk:6, over:[], free:false, done:false};
    S.runs = S.target - need;
    $("ckMsg").textContent = `T20 chase: the target is ${S.target}. Three overs (18 balls) left, and you need ${need} runs with 4 wickets in hand.`;
    draw();
  }
  const ov = b => `${Math.floor(b/6)}.${b%6}`;
  const WK = [["Bowled! The ball crashes into the stumps.","bowled"],["Caught! A fielder takes it before it bounces.","caught"],["LBW! The ball would have hit the stumps, but it struck the pad first.","lbw"],["Run out! A direct hit beats the batter to the crease.","run out"],["Stumped! The batter stepped out and missed, and the keeper whipped off the bails.","stumped"]];
  function ball(){
    if(S.done) return;
    const k = Math.random(); let chip, msg, legal = true, runs = 0, out = false;
    if(k < .04){ legal = false; runs = 1; chip = "Wd"; msg = "Wide! The ball was out of the batter's reach. 1 extra run, and the ball must be bowled again."; }
    else if(k < .065){ legal = false; runs = 1; chip = "Nb"; msg = "No-ball! The bowler overstepped the crease. 1 extra run, the ball is bowled again, and the next ball is a free hit."; }
    else if(k < .15){
      const w = pickOne(WK);
      if(S.free && w[1] !== "run out"){ chip = "0"; msg = `${w[0].split("!")[0]}! But it's a free hit, so the batter can't be out that way. No run.`; }
      else { out = true; chip = "W"; msg = `${w[0]} That's a wicket.`; }
    }
    else { const r = [0,0,0,0,0,1,1,1,1,1,1,2,2,4,4,4,6,6][Math.floor(Math.random()*18)];
      runs = r; chip = String(r || "0");
      msg = r === 6 ? "SIX! Over the rope without touching the ground." : r === 4 ? "FOUR! It races along the grass into the boundary rope." : r ? `${r} run${r > 1 ? "s" : ""}, running between the wickets.` : "Dot ball: no run."; }
    S.runs += runs; if(out) S.wk++;
    if(legal){ S.balls++; S.free = false; } else if(chip === "Nb") S.free = true;
    S.over.push(chip);
    const need = S.target - S.runs, left = 120 - S.balls;
    if(need <= 0){ S.done = true; msg += ` They've done it! Won by ${10 - S.wk} wicket${10 - S.wk === 1 ? "" : "s"} with ${left} ball${left === 1 ? "" : "s"} to spare.`; }
    else if(S.wk >= 10){ S.done = true; msg += ` All out. The fielding side wins by ${need - 1} run${need - 1 === 1 ? "" : "s"}.`; }
    else if(left === 0){ S.done = true; msg += need === 1 ? " The scores are level: a tie! In a T20 knockout, it goes to a Super Over, one over each." : ` Out of balls. The fielding side wins by ${need - 1} run${need - 1 === 1 ? "" : "s"}.`; }
    else { msg += ` Need ${need} off ${left}.`; if(legal && S.balls % 6 === 0){ msg += " End of the over: a new bowler takes over from the other end."; } }
    $("ckMsg").textContent = msg; draw(legal && S.balls % 6 === 0 && !S.done);
  }
  function draw(overEnded){
    $("ckScore").textContent = `${S.runs}/${S.wk}`; $("ckOvers").textContent = ov(S.balls);
    const need = S.target - S.runs, left = 120 - S.balls;
    $("ckNeed").textContent = S.done ? "Match over" : `${need} off ${left}`;
    $("ckOver").innerHTML = S.over.map(c => `<span class="ball b${c === "W" ? "w" : c === "4" || c === "6" ? "b" : c === "Wd" || c === "Nb" ? "x" : ""}">${c}</span>`).join("") + (S.free && !S.done ? `<span class="ball fh">Free hit next</span>` : "");
    if(overEnded) S.over = [];
    $("ckBall").hidden = S.done; $("ckNew").hidden = !S.done;
  }
  $("ckBall").addEventListener("click", ball); $("ckNew").addEventListener("click", reset); reset();
}

const pitchArt = body => `<svg viewBox="0 0 200 120" aria-hidden="true"><rect width="200" height="120" fill="${G1}"/><rect x="20" y="44" width="160" height="32" fill="${PITCH}"/>
  <line x1="40" y1="40" x2="40" y2="80" stroke="#fff" stroke-width="2"/><line x1="160" y1="40" x2="160" y2="80" stroke="#fff" stroke-width="2"/>
  <g fill="#7A4521">${[52,60,68].map(y => `<rect x="168" y="${y - 2}" width="6" height="4"/>`).join("")}</g>${body}</svg>`;
const sideArt = body => `<svg viewBox="0 0 200 120" aria-hidden="true"><rect width="200" height="120" fill="#E9F1F7"/><rect y="100" width="200" height="20" fill="${PITCH}"/>
  <g stroke="#7A4521" stroke-width="4"><line x1="160" y1="100" x2="160" y2="62"/><line x1="166" y1="100" x2="166" y2="62"/><line x1="172" y1="100" x2="172" y2="62"/></g><line x1="158" y1="60" x2="174" y2="60" stroke="#7A4521" stroke-width="3"/>${body}</svg>`;
const ball = (x,y) => `<circle cx="${x}" cy="${y}" r="5" fill="#C8482F" stroke="${INK}" stroke-width="1.5"/>`;
const tr = d => `<path d="${d}" fill="none" stroke="#18221D" stroke-width="2" stroke-dasharray="5 4"/>`;
const OUTS = [
  {name:"Bowled", text:"The bowler hits the stumps and knocks off a bail. The simplest way out.", art: sideArt(tr("M10 40Q80 30 110 100L164 76") + ball(164,76) + `<path d="M162 56l-8 -10M170 56l8 -12" stroke="#7A4521" stroke-width="3"/>`)},
  {name:"Caught", text:"A fielder catches the ball after the batter hits it, before it touches the ground. The most common dismissal.", art: sideArt(`<circle cx="60" cy="30" r="8" fill="#2F6FD6" stroke="${INK}" stroke-width="2"/>` + tr("M140 80Q100 0 64 30") + ball(66,32))},
  {name:"LBW", text:"Leg before wicket: the ball hits the batter's leg or pad when it would otherwise have hit the stumps. There are extra conditions about where it bounced.", art: sideArt(`<rect x="146" y="64" width="10" height="36" rx="4" fill="#fff" stroke="${INK}" stroke-width="2"/>` + tr("M10 40Q80 30 110 100L148 80") + `<path d="M150 80L168 76" stroke="#D9342B" stroke-width="2" stroke-dasharray="3 3"/>` + ball(146,80))},
  {name:"Run out", text:"While the batters run, a fielder breaks the wicket with the ball before the batter is safely behind the crease.", art: pitchArt(`<circle cx="148" cy="60" r="7" fill="#C8482F" stroke="${INK}" stroke-width="1.5"/>` + tr("M190 10L172 58") + ball(174,56) + `<path d="M140 60h-30" stroke="#C8482F" stroke-width="2"/>`)},
  {name:"Stumped", text:"The batter steps out of the crease to hit, misses, and the wicketkeeper breaks the wicket before they get back.", art: pitchArt(`<circle cx="148" cy="60" r="7" fill="#C8482F" stroke="${INK}" stroke-width="1.5"/><circle cx="184" cy="60" r="7" fill="#2F6FD6" stroke="${INK}" stroke-width="1.5"/>` + ball(178,60))},
  {name:"Hit wicket", text:"The batter knocks the stumps with their own bat or body while playing a shot or setting off for a run.", art: sideArt(`<path d="M120 100L140 60L168 64" stroke="#C9A27A" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M162 56l-8 -10" stroke="#7A4521" stroke-width="3"/>`)}
];
const CALLS = [
  {name:"Out", what:"One index finger raised above the head.", cost:"The batter is dismissed.", arms:'<path d="M56 38l4-34"/><path d="M60 4v-6" stroke-width="3"/><path d="M44 38l-6 30"/>'},
  {name:"Four", what:"An arm waved back and forth across the chest.", cost:"4 runs: the ball reached the boundary along the ground.", arms:'<path d="M56 38l-4 16h-24"/><path d="M20 50l-6 4 6 4M58 50l6 4-6 4" stroke-width="2.5"/><path d="M44 38l-6 30"/>'},
  {name:"Six", what:"Both arms raised straight above the head.", cost:"6 runs: the ball cleared the boundary in the air.", arms:'<path d="M44 38L38 2"/><path d="M56 38l6-36"/>'},
  {name:"Wide", what:"Both arms stretched out level to the sides.", cost:"1 extra run, and the ball is bowled again.", arms:'<path d="M44 38H8"/><path d="M56 38h36"/>'},
  {name:"No-ball", what:"One arm held out level to the side.", cost:"1 extra run, the ball is bowled again, and in limited-overs cricket the next ball is a free hit.", arms:'<path d="M56 38h34"/><path d="M44 38l-6 30"/>'},
  {name:"Bye", what:"An open hand raised above the head.", cost:"Runs scored without the bat touching the ball. They count for the team, not the batter.", arms:'<path d="M56 38l6-34"/><path d="M56 2l6 -6 6 6" stroke-width="2.5"/><path d="M44 38l-6 30"/>'}
];
const FORMATS = [
  {name:"T20", n:"20", text:"Twenty overs per side, about three and a half hours. Fast, high-scoring, and the format chosen for the 2028 Olympics."},
  {name:"One-Day (ODI)", n:"50", text:"Fifty overs per side, finished in a day. The format of the Cricket World Cup."},
  {name:"Test match", n:"5", text:"Up to five days, two innings per team, no over limit. If time runs out before a result, it's a draw."}
];
const CLOCK = [
  {k:"toss", cls:"half", t:"Toss", s:"Choose", info:["The toss","The captain who wins the coin toss chooses whether to bat or bowl first."]},
  {k:"i1", cls:"q", t:"Innings 1", s:"20 overs", info:["First innings","One team bats until it uses its 20 overs or loses 10 wickets. The first 6 overs are the powerplay, with fielders kept close."]},
  {k:"brk", cls:"half", t:"Break", s:"Swap", info:["Innings break","The teams swap. The second team's target is one run more than the first team's total."]},
  {k:"i2", cls:"q", t:"Innings 2", s:"The chase", info:["The chase","The second team bats until it passes the target, uses its overs, or is all out. A team that wins while batting second wins 'by wickets'; a team that defends its total wins 'by runs'."]},
  {k:"so", cls:"ot", t:"Super Over", s:"If tied", info:["Super Over","If the scores are tied, each team bats for one more over with three batters. Higher score wins; if still tied, more Super Overs are played."]}
];
const TRICKY = [
  ["How does LBW work?","The batter is out if the ball hits their leg or pad when it would otherwise have hit the stumps. It can't count if the ball bounced outside the line of leg stump, and there are other fine points that umpires and ball-tracking replays check."],
  ["Why can't bowlers bend their arm?","Bowlers must not throw. The elbow can't straighten by more than 15 degrees during delivery. That's why bowling looks like a windmill rather than a pitch."],
  ["What's a free hit?","After a no-ball in limited-overs cricket, the next ball is a free hit. The batter can't be out bowled, caught, LBW, or stumped, so they swing hard."],
  ["Why do they swap ends after every over?","After six balls, a different bowler must bowl the next over from the other end. No bowler may bowl two overs in a row."],
  ["What's DRS?","The Decision Review System. Each team has a limited number of challenges to ask the TV umpire to check a decision with replays, sound sensors, and ball-tracking."],
  ["How do you read a cricket score?","158/6 means 158 runs for 6 wickets lost. Overs are written like 17.4: 17 complete overs and 4 more balls. Some countries, like Australia, write wickets first."]
];
const WORDS = [
  ["Over","Six legal balls bowled by one bowler from one end."],
  ["Innings","A team's turn to bat. Also used for one batter's time at the crease."],
  ["Wicket","The stumps and bails, a dismissal, or the pitch itself, depending on context."],
  ["Run rate","Runs scored per over."],
  ["Dot ball","A ball with no run scored, shown as a dot in the scorebook."],
  ["Extras","Runs not scored off the bat: wides, no-balls, byes, and leg byes."],
  ["Yorker","A ball that lands right at the batter's feet, very hard to hit."],
  ["Bouncer","A short ball that rises toward the batter's head."],
  ["Spinner","A slower bowler who makes the ball turn sharply off the pitch."],
  ["Century","A batter scoring 100 runs in one innings."]
];
const QUIZ = [
  {q:"How many balls are in an over?", o:["4","6","8","10"], a:1, why:"Six legal balls. Wides and no-balls don't count and are bowled again."},
  {q:"The ball rolls along the ground and over the boundary rope. How many runs?", o:["2","6","4","1"], a:2, why:"A boundary along the ground is 4 runs."},
  {q:"The ball flies over the boundary rope without touching the ground. How many runs?", o:["6","4","5","8"], a:0, why:"Clearing the rope on the full is a six."},
  {q:"The bowler sends down a wide. What happens?", o:["The batter is out","1 extra run, and the ball is bowled again","Nothing happens","Only a free hit"], a:1, why:"A wide adds one run to the total and doesn't count as one of the over's six balls."},
  {q:"How many wickets must fall for a team to be all out?", o:["11","9","12","10"], a:3, why:"Ten. Batters bat in pairs, so the last one is left 'not out'."},
  {q:"The umpire makes this signal. What does it mean?", visual:() => fig(CALLS[2].arms), o:["Out","Four","Six","Wide"], a:2, why:"Both arms straight up means six runs."},
  {q:"What follows a no-ball in T20 cricket?", o:["A wide","A free hit","Six runs","A wicket"], a:1, why:"The next delivery is a free hit: the batter can't be out bowled, caught, LBW, or stumped."},
  {q:"How many overs does each team get in a T20 match?", o:["50","10","20","Unlimited"], a:2, why:"Twenty overs per side, hence the name."},
  {q:"A T20 knockout match ends in a tie. What happens next?", o:["A Super Over","A coin toss","The draw stands","A replay the next day"], a:0, why:"Each team bats for one more over. Higher score wins."},
  {q:"The batter steps out to hit, misses, and the wicketkeeper breaks the stumps. What's the dismissal?", o:["Run out","Stumped","Bowled","LBW"], a:1, why:"That's stumped: the keeper breaks the wicket while the batter is out of the crease and not running."}
];

function render(app){
  app.innerHTML = sportHero({id:"cricket", name:"Cricket", alt:"The tabby cat in cricket whites, holding a cricket bat",
      lede:"Two teams of eleven take turns batting and bowling. The bowler tries to hit the stumps behind the batter; the batter defends them and hits the ball to score runs. Each dismissal is a wicket. The team with more runs wins.",
      facts:[["11","players per side"],["6","balls in an over"],["20","overs per side in T20"],["10","wickets and you're all out"]]})
    + jumpNav([["ck-ground","The ground"],["ck-score","Scoring runs"],["ck-chase","Chase the target"],["ck-outs","Getting out"],["ck-calls","Umpire signals"],["ck-formats","Formats"],["ck-clock","A T20 match"],["ck-tricky","Tricky rules"],["ck-words","Words you'll hear"],["ck-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("ck-ground","The ground","Tap any part of the ground to see what it does. The pitch is drawn larger than real life so you can see it.",
        `<div class="fieldbox" id="ckGround" style="max-width:680px">${groundSVG()}</div><div class="fieldrow"><div class="zonechips" id="ckChips"></div><div class="infopanel" id="ckInfo" aria-live="polite"></div></div>`)
    + section("ck-score","Scoring runs","Every run counts the same. Here's how they come.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
          <div class="score"><div class="pts">1-3</div><h3>Running</h3><p>After hitting, both batters run to the other end. Each time they both make it safely, that's a run.</p></div>
          <div class="score"><div class="pts">4</div><h3>Four</h3><p>The ball reaches the boundary rope after touching the ground. No running needed.</p></div>
          <div class="score"><div class="pts">6</div><h3>Six</h3><p>The ball clears the boundary without bouncing. The biggest single score.</p></div>
          <div class="score"><div class="pts">+1</div><h3>Extras</h3><p>Wides and no-balls add a run and must be bowled again. Byes and leg byes are runs taken when the bat doesn't touch the ball.</p></div></div>`)
    + section("ck-chase","Chase the target","The last three overs of a T20 chase. Bowl one ball at a time and see if your team gets there.",
        `<div class="sim"><div class="board" style="grid-template-columns:1fr 1fr 1fr"><div><small>Score</small><b id="ckScore"></b></div><div><small>Overs</small><b id="ckOvers"></b></div><div class="dd"><small>Need</small><b id="ckNeed"></b></div></div>
          <div class="overrow"><small>This over</small><div id="ckOver"></div></div>
          <div class="controls"><button class="btn primary" id="ckBall" type="button">Next ball</button><button class="btn primary" id="ckNew" type="button" hidden>New chase</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="ckMsg"></p></div></div></div>`)
    + section("ck-outs","Getting out","Ten ways to be out exist, but these six cover almost all of them.",
        `<div class="scoring restarts">${OUTS.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("ck-calls","Umpire signals","Two umpires stand on the field. Their signals tell the scorers, and the crowd, what just happened.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("ck-formats","Formats","Cricket comes in three main lengths.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">${FORMATS.map(f => `<div class="score"><div class="pts">${f.n}<small>${f.name === "Test match" ? "days" : "overs"}</small></div><h3>${f.name}</h3><p>${f.text}</p></div>`).join("")}</div>`)
    + section("ck-clock","A T20 match","Tap a part of the match to learn what happens there.",
        `<div class="timeline" id="ckTimeline"></div><div class="infopanel" id="ckClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("ck-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="ckFlips"></div>`)
    + section("ck-words","Words you'll hear","",`<dl class="gloss" id="ckGloss"></dl>`)
    + section("ck-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="ckQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the MCC Laws of Cricket and ICC playing conditions, with a focus on T20. Test and one-day cricket share the same basic laws with different time limits.</footer></div>`;

  setupZones(document.getElementById("ckGround"), document.getElementById("ckChips"), document.getElementById("ckInfo"), ZONES, ZONE_ORDER, "pitch");
  chaseSim();
  setupTimeline(document.getElementById("ckTimeline"), document.getElementById("ckClockInfo"), CLOCK,
    "In T20, each bowler may bowl at most 4 of the 20 overs, so a team needs at least five bowlers.");
  flipCards(document.getElementById("ckFlips"), TRICKY);
  glossary(document.getElementById("ckGloss"), WORDS);
  makeQuiz(document.getElementById("ckQuiz"), QUIZ, [
    "A century! Watch a T20 match and try to call every umpire signal.",
    "Good knock. Play another chase and the scoring will become second nature.",
    "Look over the ways of getting out and the signals again, then come back to bat.",
    "No worries. Start with the ground diagram and the scoring cards, then try again."]);
}

SPORT_PAGES["cricket"] = {render};
})();

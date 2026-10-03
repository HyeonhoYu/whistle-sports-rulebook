/* Handball. Rules follow the IHF Rules of the Game for indoor handball. */
(function(){

const W = "#F4F6F1", INK = "#18221D", FLOOR = "#3E7CB8", AREA = "#E8A33D", BLUE = "#2F6FD6", RED = "#C8482F";
/* Court 40 x 20 m at 20 units per meter. Goals on the short ends; posts at y=170 and y=230. */
function courtBase(){
  const area = (x, d) => `M${x} 50A120 120 0 0 ${d} ${x + (d ? 120 : -120)} 170L${x + (d ? 120 : -120)} 230A120 120 0 0 ${d} ${x} 350Z`;
  const nine = (x, d) => `M${x + (d ? 59 : -59)} 0A180 180 0 0 ${d} ${x + (d ? 180 : -180)} 170L${x + (d ? 180 : -180)} 230A180 180 0 0 ${d} ${x + (d ? 59 : -59)} 400`;
  return `<rect x="-50" y="-40" width="900" height="480" fill="#1C4D2C"/><rect width="800" height="400" fill="${FLOOR}"/>
    <path d="${area(0,1)}" fill="${AREA}"/><path d="${area(800,0)}" fill="${AREA}"/>
    <g fill="none" stroke="${W}" stroke-width="4"><rect width="800" height="400"/><line x1="400" y1="0" x2="400" y2="400"/><path d="${area(0,1)}"/><path d="${area(800,0)}"/></g>
    <g fill="none" stroke="${W}" stroke-width="3" stroke-dasharray="14 12"><path d="${nine(0,1)}"/><path d="${nine(800,0)}"/></g>
    <g stroke="${W}" stroke-width="4"><line x1="140" y1="190" x2="140" y2="210"/><line x1="660" y1="190" x2="660" y2="210"/><line x1="80" y1="196" x2="80" y2="204"/><line x1="720" y1="196" x2="720" y2="204"/>
      <line x1="310" y1="-10" x2="310" y2="8"/><line x1="490" y1="-10" x2="490" y2="8"/></g>
    <circle cx="400" cy="200" r="40" fill="none" stroke="${W}" stroke-width="2"/>
    <rect x="-20" y="170" width="20" height="60" fill="#fff" opacity=".85" stroke="${RED}" stroke-width="3"/><rect x="800" y="170" width="20" height="60" fill="#fff" opacity=".85" stroke="${RED}" stroke-width="3"/>`;
}
function courtSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-50 -40 900 480" role="img" aria-label="A handball court seen from above">${courtBase()}
    ${r("court",200,10,390,380)}
    <path class="hz" data-zone="free" d="M0 0H59A180 180 0 0 1 180 170V230A180 180 0 0 1 59 400H0Z"/><path class="hz" data-zone="free" d="M800 0H741A180 180 0 0 0 620 170V230A180 180 0 0 0 741 400H800Z"/>
    <path class="hz" data-zone="area" d="M0 50A120 120 0 0 1 120 170L120 230A120 120 0 0 1 0 350Z"/><path class="hz" data-zone="area" d="M800 50A120 120 0 0 0 680 170L680 230A120 120 0 0 0 800 350Z"/>
    ${r("seven",130,180,20,40)}${r("seven",650,180,20,40)}${r("keeper",72,186,16,28)}${r("keeper",712,186,16,28)}
    ${r("goal",-24,164,26,72)}${r("goal",798,164,26,72)}${r("center",392,0,16,400)}
    <circle class="hz" data-zone="throwoff" cx="400" cy="200" r="40"/>${r("subs",300,-36,200,44)}</svg>`;
}
const ZONES = {
  area:{title:"Goal area (6-meter line)", text:"Only the goalkeeper may stand here. Attackers can jump into the air above it to shoot, as long as they release the ball before landing inside."},
  free:{title:"Free-throw line (9-meter line)", text:"The dashed line 9 m from goal. Free throws for fouls between the 6 and 9 m lines are taken from here, and defenders must stand at least 3 m away."},
  seven:{title:"7-meter line", text:"Where penalty throws are taken, one shooter against the goalkeeper. Awarded when a clear scoring chance is illegally destroyed."},
  keeper:{title:"Goalkeeper restraining line", text:"A short mark 4 m from goal. During a 7-meter throw, the goalkeeper may not come past it."},
  goal:{title:"Goal", text:"3 m wide and 2 m high. A goal counts when the whole ball crosses the goal line between the posts."},
  center:{title:"Center line", text:"Splits the court. Each team defends one half and attacks the other, switching at half-time."},
  throwoff:{title:"Throw-off area", text:"After every goal, the team that conceded restarts from this circle right away. That's why handball scores climb so fast."},
  subs:{title:"Substitution area", text:"Players swap on the fly through a zone in front of each bench, as often as they like. A wrong substitution earns a 2-minute suspension."},
  court:{title:"The court", text:"40 m by 20 m, about the size of a basketball court and a half. Teams have six court players and a goalkeeper."}
};
const ZONE_ORDER = ["area","free","seven","keeper","goal","center","throwoff","subs","court"];

/* Jump-shot lab: side view toward the goal on the left. 50 units per meter. */
function jumpSVG(){
  return `<svg viewBox="0 0 560 240" role="img" aria-label="Jump shot over the goal area"><rect width="560" height="240" fill="#E9F1F7"/>
    <rect y="200" width="560" height="40" fill="${FLOOR}"/><rect x="20" y="200" width="300" height="10" fill="${AREA}"/>
    <rect x="16" y="100" width="8" height="100" fill="#fff" stroke="${RED}" stroke-width="3"/><line x1="16" y1="100" x2="60" y2="100" stroke="${RED}" stroke-width="5"/>
    <line x1="320" y1="200" x2="320" y2="214" stroke="#fff" stroke-width="4"/><text x="320" y="232" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#fff">6 m line</text>
    <path id="jsArc" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="6 5"/>
    <circle id="jsTake" r="7" fill="${BLUE}"/><circle id="jsLand" r="7" fill="none" stroke="${BLUE}" stroke-width="3"/>
    <circle id="jsRel" r="6" fill="#F2C230" stroke="${INK}" stroke-width="1.5"/><path id="jsShot" fill="none" stroke="#F2C230" stroke-width="3"/></svg>`;
}
function jumpLab(){
  const $ = id => document.getElementById(id);
  function draw(){
    const take = +$("jsR").value, rel = $("jsRel1").checked, tx = 20 + take*50, lx = tx - 90;
    $("jsTake").setAttribute("cx", tx); $("jsTake").setAttribute("cy", 200);
    $("jsLand").setAttribute("cx", lx); $("jsLand").setAttribute("cy", 200);
    $("jsArc").setAttribute("d", `M${tx} 200Q${tx - 45} 60 ${lx} 200`);
    const rx = rel ? tx - 45 : lx + 4, ry = rel ? 130 : 196;
    $("jsRel").setAttribute("cx", rx); $("jsRel").setAttribute("cy", ry);
    $("jsShot").setAttribute("d", `M${rx} ${ry}L40 150`);
    let ok, msg;
    if(take <= 6.02){ ok = false; msg = `Taking off at ${take.toFixed(1)} m means stepping on or inside the 6-meter line. No goal: the goalkeeper restarts with a throw.`; }
    else if(!rel){ ok = false; msg = "The shooter landed inside the goal area while still holding the ball. No goal: goalkeeper throw."; }
    else { ok = true; msg = `Legal! The shooter took off outside the line at ${take.toFixed(1)} m and released the ball in the air. Landing in the goal area afterward is fine.`; }
    $("jsVerdict").textContent = ok ? "Goal counts" : "No goal"; $("jsVerdict").className = ok ? "verdict on" : "verdict off"; $("jsMsg").textContent = msg;
  }
  $("jsR").addEventListener("input", draw); $("jsRel1").addEventListener("change", draw); draw();
}

/* Passive play counter */
function passive(){
  const $ = id => document.getElementById(id); let n = -1;
  const show = (m) => { $("ppCount").textContent = n < 0 ? "-" : 4 - n; if(m) $("ppMsg").textContent = m; };
  $("ppWarn").addEventListener("click", () => { n = 0; show("The referee raises an arm: passive play warning. The attack now gets at most four more passes before it must shoot."); });
  $("ppPass").addEventListener("click", () => {
    if(n < 0) return show("No warning yet. Teams can pass freely, but stalling will draw a warning.");
    n++;
    if(n > 4){ n = -1; return show("A fifth pass after the warning! Passive play: the ball goes to the other team with a free throw."); }
    show(n === 4 ? "That's the fourth pass. The next action must be a shot." : `Pass ${n} of 4.`);
  });
  $("ppShoot").addEventListener("click", () => { if(n < 0) return show("A shot! With no warning up, the attack can take as long as it shows clear intent to score."); n = -1; show("They shoot before running out of passes. The warning is cleared."); });
  show();
}

/* Match simulator: five-minute blocks */
function matchSim(){
  const $ = id => document.getElementById(id); const N = ["Blue","Red"]; let S;
  const reset = () => { S = {min:0, g:[0,0], susp:[0,0]}; $("hbMsg").textContent = "Throw-off! Sixty minutes, two halves of 30."; draw(); };
  const pois = l => { let k = 0, p = Math.exp(-l), s = p, u = Math.random(); while(u > s){ k++; p *= l/k; s += p; } return k; };
  function block(){
    if(S.min >= 60) return; S.min += 5; const msgs = [];
    const short = S.susp.map(v => v > 0);
    S.susp = S.susp.map(v => Math.max(0, v - 5));
    const goals = [0,1].map(i => pois(2.4 + (short[1-i] ? .6 : 0) - (short[i] ? .5 : 0)));
    goals.forEach((n,i) => { S.g[i] += n; });
    msgs.push(`${N[0]} ${goals[0]}, ${N[1]} ${goals[1]} in these five minutes.`);
    if(Math.random() < .55){ const t = Math.random() < .5 ? 0 : 1; S.susp[t] = 2; msgs.push(`2-minute suspension for a ${N[t]} player after a hard foul. ${N[t]} plays with five court players until it ends.`); }
    if(Math.random() < .4){ const t = Math.random() < .5 ? 0 : 1; if(Math.random() < .75){ S.g[t]++; msgs.push(`7-meter throw for ${N[t]}, and it's converted.`); } else msgs.push(`7-meter throw for ${N[t]}, but the goalkeeper saves it!`); }
    if(S.min === 30) msgs.push("Half-time. Teams switch sides.");
    if(S.min === 60){ const [a,b] = S.g; msgs.push(a === b ? `Full time: ${a}-${b}. In a league that's a draw; in a knockout, extra time follows.` : `Full time: ${N[a > b ? 0 : 1]} wins ${Math.max(a,b)}-${Math.min(a,b)}.`); }
    $("hbMsg").textContent = msgs.join(" "); draw();
  }
  function draw(){
    $("hbClock").textContent = `${S.min}'`; $("hbG0").textContent = S.g[0]; $("hbG1").textContent = S.g[1];
    $("hbGo").hidden = S.min >= 60; $("hbNew").hidden = S.min < 60;
  }
  $("hbGo").addEventListener("click", block); $("hbNew").addEventListener("click", reset); reset();
}

const RULES = [
  {n:"3", name:"Three steps", text:"A player may take up to three steps while holding the ball. A fourth step is a violation."},
  {n:"3", name:"Three seconds", text:"A player may hold the ball for up to three seconds before passing, shooting, or dribbling."},
  {n:"1", name:"One dribble sequence", text:"Bounce the ball as long as you like, but once you catch it, you can't start dribbling again."},
  {n:"0", name:"No feet", text:"Court players may not touch the ball with the leg below the knee on purpose. Only the goalkeeper may, inside the goal area."},
  {n:"6", name:"The goal area", text:"Court players can't touch the floor inside the 6-meter line. A defender who steps in to block gives away a 7-meter throw if it stops a clear chance."},
  {n:"4", name:"Passive play", text:"After the referee's warning, the attack has at most four more passes to take a shot."}
];
const PUN = [
  {color:"#F2C230", name:"Yellow card", text:"A warning for unsporting behavior or rough play."},
  {color:"#fff", name:"2-minute suspension", text:"The player leaves the court and the team plays one short for two minutes, even if the other team scores."},
  {color:RED, name:"Red card", text:"Disqualification. The player is out for the rest of the game, and the team plays short for two minutes."},
  {color:BLUE, name:"Blue card", text:"Shown after a red card for a serious offense, meaning a written report and a possible further ban."}
];
const CALLS = [
  {name:"Steps", what:"Fists rolled around each other in front of the body.", cost:"Free throw to the other team.", arms:'<path d="M44 38l-8 12h26"/><path d="M56 38l8 18H38"/><path d="M74 44a10 10 0 1 1-4-8" stroke-width="2.5"/>'},
  {name:"Double dribble", what:"Both hands make a bouncing motion up and down.", cost:"Free throw to the other team.", arms:'<path d="M44 38l-10 18 4 8"/><path d="M56 38l10 14-4 8"/><path d="M28 80v-10M72 70v10" stroke-width="2.5"/>'},
  {name:"Passive play warning", what:"One arm raised high and held up while the attack continues.", cost:"Four more passes at most.", arms:'<path d="M56 38l10-34"/><path d="M44 38l-6 30"/>'},
  {name:"2-minute suspension", what:"One hand raised with two fingers extended.", cost:"The player sits out for two minutes.", arms:'<path d="M56 38l6-30"/><path d="M62 8l-3-9M62 8l4-9" stroke-width="3"/><path d="M44 38l-6 30"/>'},
  {name:"Free throw", what:"An arm pointed in the direction the free throw goes.", cost:"The other team takes possession.", arms:'<path d="M56 38l34-6"/><path d="M44 38l-6 30"/>'},
  {name:"Timeout", what:"The hands form a T, then the referee blows the whistle to stop the clock.", cost:"Play and the clock stop.", arms:'<path d="M56 38l28-12V-4"/><path d="M44 38l22-8 4-34h28"/>'}
];
const CLOCK = [
  {k:"h1", cls:"q", t:"1st half", s:"30 min", info:["1st half","Thirty minutes. The clock stops for team timeouts, injuries, and when the referees call for it."]},
  {k:"ht", cls:"half", t:"Half", s:"15 min", info:["Half-time","Fifteen minutes. Teams switch sides."]},
  {k:"h2", cls:"q", t:"2nd half", s:"30 min", info:["2nd half","Teams can call one-minute team timeouts, three per match in total. Late timeouts are often used to plan the last attack."]},
  {k:"et", cls:"ot", t:"Extra", s:"Knockouts", info:["Extra time and shootout","If a knockout match is tied, two halves of 5 minutes follow, and if needed another two. Still tied? A 7-meter shootout, five shots each."]}
];
const TRICKY = [
  ["Why can attackers fly into the goal area?","The rule is about the floor, not the air. Take off outside the 6 m line, release the ball in the air, and you can land inside. It's how the spectacular diving shots happen."],
  ["What's the seventh court player?","A team can swap its goalkeeper for a seventh outfield player to attack 7 against 6. It leaves the goal empty, so long shots from the other end become a risk."],
  ["Why are scores so high?","Teams can restart instantly after a goal, possessions are short, and shooting is encouraged. Scores in the 30s are normal."],
  ["What's a fast break?","After a save or turnover, attackers sprint the length of the court before the defense sets up, often for an easy goal."],
  ["Can defenders block with their bodies?","Yes, facing the attacker with arms bent. Pushing, holding, hitting the arm, or running into an opponent is a foul."],
  ["Why do players use resin?","A sticky resin on the hands helps grip and spin the ball. Some arenas ban it because it's hard to clean off the floor."]
];
const WORDS = [
  ["Back court","The players who shoot from distance: left back, center back, and right back."],
  ["Pivot","The player who battles among the defenders along the 6 m line."],
  ["Wing","Players on the far sides who shoot from tight angles."],
  ["Fast break","A quick attack after winning the ball."],
  ["7-meter throw","A penalty shot from 7 meters."],
  ["Throw-off","The restart after a goal, from the center."],
  ["Kempa","A trick play: a pass lobbed above the goal area for a teammate to catch and shoot in mid-air."],
  ["Spin shot","A shot that bounces and spins past the goalkeeper."],
  ["6-0 defense","All six defenders lined up along the goal-area line."],
  ["Timeout","A one-minute team break, three per match."]
];
const jumpMini = () => `<svg viewBox="0 0 560 240" style="width:260px;border-radius:8px" aria-hidden="true"><rect width="560" height="240" fill="#E9F1F7"/><rect y="200" width="560" height="40" fill="${FLOOR}"/><rect x="20" y="200" width="300" height="10" fill="${AREA}"/>
  <rect x="16" y="100" width="8" height="100" fill="#fff" stroke="${RED}" stroke-width="3"/><line x1="320" y1="200" x2="320" y2="214" stroke="#fff" stroke-width="4"/>
  <circle cx="380" cy="200" r="7" fill="${BLUE}"/><path d="M380 200Q335 60 290 200" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="6 5"/><circle cx="290" cy="200" r="7" fill="none" stroke="${BLUE}" stroke-width="3"/>
  <circle cx="335" cy="130" r="6" fill="#F2C230" stroke="${INK}" stroke-width="1.5"/><path d="M335 130L40 150" stroke="#F2C230" stroke-width="3"/></svg>`;
const QUIZ = [
  {q:"How many players does each team have on the court?", o:["5","6","7","11"], a:2, why:"Seven: six court players and a goalkeeper."},
  {q:"How many steps can a player take while holding the ball?", o:["3","2","1","Unlimited"], a:0, why:"Up to three steps."},
  {q:"How long can a player hold the ball without passing, shooting, or dribbling?", o:["5 seconds","3 seconds","10 seconds","No limit"], a:1, why:"Three seconds."},
  {q:"Who may stand inside the goal area?", o:["Anyone","Only the goalkeeper","Only defenders","Only attackers"], a:1, why:"Only the goalkeeper. Others can only fly over it."},
  {q:"A player gets a 2-minute suspension. What happens?", o:["They sit out 2 minutes and the team plays one short","The other team gets a penalty shot","Only a yellow card is shown","The game restarts from the center"], a:0, why:"The team plays shorthanded for two minutes."},
  {q:"The shooter takes off outside the line, shoots in the air, and lands inside, like this. What's the call?", visual: jumpMini, o:["No goal: goal-area violation","A 7-meter throw","The goal counts","A free throw"], a:2, why:"Taking off outside the 6 m line and releasing before landing is legal."},
  {q:"After a passive play warning, how many more passes can the attack make?", o:["None: shoot immediately","10 seconds' worth","At most four","Nothing changes"], a:2, why:"Four passes at most, then they must shoot."},
  {q:"When is a 7-meter throw awarded?", o:["For any foul","When a clear scoring chance is illegally destroyed","When the ball goes out","After a timeout"], a:1, why:"A 7-meter throw replaces a clear chance that a foul took away."},
  {q:"How long is a senior handball match?", o:["2 x 30 minutes","2 x 20 minutes","4 x 15 minutes","2 x 45 minutes"], a:0, why:"Two halves of 30 minutes."},
  {q:"The referee makes this signal. What does it mean?", visual:() => fig(CALLS[3].arms), o:["Two goals","2-minute suspension","A timeout","A free throw"], a:1, why:"Two fingers raised means a 2-minute suspension."}
];

function render(app){
  app.innerHTML = sportHero({id:"handball", name:"Handball", alt:"The tabby cat in a red jersey, leaping to throw a small ball",
      lede:"Two teams of seven pass a small ball with their hands and shoot it into the other team's goal. Players can take three steps with the ball, then must pass, shoot, or dribble. The area in front of each goal belongs to the goalkeeper alone. It's fast, physical, and high-scoring.",
      facts:[["7","players per side"],["60","minutes in two halves"],["3","steps or seconds with the ball"],["6","meters: the goal-area line"]]})
    + jumpNav([["hb-court","The court"],["hb-rules","Ball rules"],["hb-jump","Jump shots"],["hb-passive","Passive play"],["hb-sim","Play a match"],["hb-pun","Punishments"],["hb-calls","Referee signals"],["hb-clock","The clock"],["hb-tricky","Tricky rules"],["hb-words","Words you'll hear"],["hb-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("hb-court","The court","Tap any part of the court to see what it does.",
        `<div class="fieldbox" id="hbCourt">${courtSVG()}</div><div class="fieldrow"><div class="zonechips" id="hbChips"></div><div class="infopanel" id="hbInfo" aria-live="polite"></div></div>`)
    + section("hb-rules","Ball rules","Handball's basic rules come in small numbers.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${RULES.map(d => `<div class="score"><div class="pts">${d.n}</div><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("hb-jump","Jump shots over the goal area","Set where the shooter takes off and whether the ball is released in the air. The goal is on the left.",
        `<div class="oslab"><div class="fieldbox">${jumpSVG()}</div>
          <div class="osside"><div class="osverdict"><span id="jsVerdict" class="verdict on">Goal counts</span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="jsMsg"></p></div>
            <label class="slider">Takeoff distance from the goal<input id="jsR" type="range" min="5" max="9" step="0.1" value="7.2"></label>
            <label class="check"><input type="checkbox" id="jsRel1" checked> Ball released before landing</label></div></div>`)
    + section("hb-passive","Passive play","Teams can't stall. When the referee sees an attack with no intent to score, a warning starts a four-pass countdown.",
        `<div class="shotclock"><div class="scface"><small>Passes left</small><b id="ppCount">-</b></div>
          <div class="osside"><div class="narrator"><img src="${img("head.webp")}" alt=""><p id="ppMsg">Start the warning, then pass or shoot.</p></div>
            <div class="controls"><button class="btn primary" id="ppWarn" type="button">Referee warns</button><button class="btn" id="ppPass" type="button">Pass</button><button class="btn" id="ppShoot" type="button">Shoot</button></div></div></div>`)
    + section("hb-sim","Play a match","Play five minutes at a time. Watch the goals pile up, along with suspensions and 7-meter throws.",
        `<div class="sim"><div class="board" style="grid-template-columns:1fr 1fr 1fr"><div><small>Blue</small><b id="hbG0">0</b></div><div class="dd"><small>Clock</small><b id="hbClock">0'</b></div><div><small>Red</small><b id="hbG1">0</b></div></div>
          <div class="controls"><button class="btn primary" id="hbGo" type="button">Play 5 minutes</button><button class="btn primary" id="hbNew" type="button" hidden>New match</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="hbMsg"></p></div></div></div>`)
    + section("hb-pun","Punishments","Handball's penalties escalate quickly.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${PUN.map(p => `<div class="score"><div class="pcard" style="background:${p.color}"></div><h3>${p.name}</h3><p>${p.text}</p></div>`).join("")}</div>`)
    + section("hb-calls","Referee signals","Two referees share the court, one near each goal.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("hb-clock","The clock","Tap a part of the match to learn what happens there.",
        `<div class="timeline" id="hbTimeline"></div><div class="infopanel" id="hbClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("hb-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="hbFlips"></div>`)
    + section("hb-words","Words you'll hear","",`<dl class="gloss" id="hbGloss"></dl>`)
    + section("hb-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="hbQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the IHF Rules of the Game for indoor handball, used at the Olympics and World Championships. Beach handball is a separate game with its own scoring.</footer></div>`;

  setupZones(document.getElementById("hbCourt"), document.getElementById("hbChips"), document.getElementById("hbInfo"), ZONES, ZONE_ORDER, "area");
  jumpLab(); passive(); matchSim();
  setupTimeline(document.getElementById("hbTimeline"), document.getElementById("hbClockInfo"), CLOCK,
    "A senior match takes about an hour and a half with half-time and timeouts.");
  flipCards(document.getElementById("hbFlips"), TRICKY);
  glossary(document.getElementById("hbGloss"), WORDS);
  makeQuiz(document.getElementById("hbQuiz"), QUIZ, [
    "Top corner! Watch a match and try calling the goal-area violations.",
    "A strong attack. Try the jump-shot lab again and you'll have the trickiest rule down.",
    "Look over the ball rules and punishments again, then come back for another shot.",
    "No worries. Start with the court and the ball rules, then try again."]);
}

SPORT_PAGES["handball"] = {render};
})();

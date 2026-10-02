/* Rugby union. Rules follow World Rugby's Laws of the Game. */
(function(){

const W = "#F4F6F1", INK = "#18221D", G1 = "#2F7546", G2 = "#2A6B3F", BLUE = "#2F6FD6", RED = "#C8482F";
/* Field: 7 units per meter. Dead-ball lines x=0/840, try lines x=70/770, 22s x=224/616, halfway x=420. Width 70 m: y 0 to 490. */
function fieldBase(){
  let s = `<rect x="-40" y="-40" width="920" height="570" fill="#1C4D2C"/><rect width="840" height="490" fill="${G1}"/>`;
  for(let i=0;i<10;i++) if(i%2) s += `<rect x="${70 + i*70}" y="0" width="70" height="490" fill="${G2}"/>`;
  s += `<rect width="70" height="490" fill="#25603A"/><rect x="770" width="70" height="490" fill="#25603A"/>
    <g stroke="${W}" stroke-width="3" fill="none"><rect width="840" height="490"/><line x1="70" y1="0" x2="70" y2="490"/><line x1="770" y1="0" x2="770" y2="490"/>
    <line x1="224" y1="0" x2="224" y2="490"/><line x1="616" y1="0" x2="616" y2="490"/><line x1="420" y1="0" x2="420" y2="490"/></g>
    <g stroke="${W}" stroke-width="3" stroke-dasharray="14 12"><line x1="350" y1="0" x2="350" y2="490"/><line x1="490" y1="0" x2="490" y2="490"/>
    <line x1="105" y1="0" x2="105" y2="490"/><line x1="735" y1="0" x2="735" y2="490"/></g>
    <g stroke="${W}" stroke-width="3">${[35,105,385,455].map(y => [140,280,420,560,700].map(x => `<line x1="${x-10}" y1="${y}" x2="${x+10}" y2="${y}"/>`).join("")).join("")}</g>
    ${[70,770].map(x => `<line x1="${x}" y1="225" x2="${x}" y2="265" stroke="#fff" stroke-width="7"/><circle cx="${x}" cy="225" r="6" fill="#fff"/><circle cx="${x}" cy="265" r="6" fill="#fff"/>`).join("")}`;
  return s;
}
function fieldSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-40 -40 920 570" role="img" aria-label="A rugby union field seen from above">${fieldBase()}
    ${r("field",76,10,688,470)}${r("ingoal",6,10,58,470)}${r("ingoal",776,10,58,470)}
    ${r("ten",340,10,20,470)}${r("ten",480,10,20,470)}${r("twentytwo",214,10,20,470)}${r("twentytwo",606,10,20,470)}${r("half",410,10,20,470)}
    ${r("five",95,10,20,470)}${r("five",725,10,20,470)}${r("lineout",76,28,688,14)}${r("lineout",76,98,688,14)}${r("lineout",76,378,688,14)}${r("lineout",76,448,688,14)}
    ${r("tryline",62,10,16,470)}${r("tryline",762,10,16,470)}${r("posts",58,212,24,66)}${r("posts",758,212,24,66)}
    ${r("touch",-40,-40,920,46)}${r("touch",-40,484,920,46)}${r("dead",-40,6,46,478)}${r("dead",834,6,46,478)}</svg>`;
}
const ZONES = {
  tryline:{title:"Try line", text:"The goal line. Ground the ball on or over it, pressing down with hands, arms, or the front of the body, and you score a try."},
  ingoal:{title:"In-goal area", text:"The end zone behind the try line, up to 22 m deep. Tries are scored here; the ball must be pressed down, not just carried in."},
  posts:{title:"Goalposts", text:"H-shaped posts on the try line, with a crossbar 3 m up. Conversions, penalty goals, and drop goals must go over the crossbar and between the posts."},
  twentytwo:{title:"22-meter lines", text:"Lines 22 m from each try line. Inside your own 22, you can kick straight into touch and the lineout happens where it went out. Kicking from your own half so the ball bounces into touch in the opponent's 22 (the 50:22) gives your team the throw."},
  half:{title:"Halfway line", text:"Kick-offs are taken from the middle of this line. After any score, the team that conceded the points kicks off."},
  ten:{title:"10-meter lines", text:"Dashed lines 10 m from halfway. A kick-off must reach at least this far, and the receiving team must stand behind it."},
  five:{title:"5-meter lines", text:"Dashed lines 5 m from each try line. Scrums can't be set closer to the try line than this."},
  lineout:{title:"5-meter and 15-meter marks", chip:"Lineout marks", text:"The short dashes near each touchline mark the lineout zone. Players line up between the 5 m and 15 m marks when the ball is thrown back in."},
  touch:{title:"Touchlines", text:"The sidelines. If the ball or the player carrying it touches or crosses them, the ball is in touch and play restarts with a lineout."},
  dead:{title:"Dead-ball lines", text:"The back of the in-goal areas. Beyond them, the ball is dead and play restarts with a drop-out or scrum, depending on who touched it last."},
  field:{title:"Field of play", text:"Up to 100 m between the try lines and up to 70 m wide. There's no set offense or defense: possession changes in a moment."}
};
const ZONE_ORDER = ["tryline","ingoal","posts","twentytwo","half","ten","five","lineout","touch","dead","field"];

/* Forward pass lab: attack goes right. */
function passSVG(){
  return `<svg viewBox="140 60 420 280" role="img" aria-label="Forward pass diagram"><rect x="140" y="60" width="420" height="280" fill="${G1}"/>
    ${[200,270,340,410,480].map(x => `<line x1="${x}" y1="60" x2="${x}" y2="340" stroke="#fff" stroke-width="1" opacity=".25"/>`).join("")}
    <path d="M520 90h30M540 82l10 8-10 8" stroke="#fff" stroke-width="3" fill="none"/><text x="535" y="80" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#fff">attack</text>
    <line id="fpLine" x1="300" y1="60" x2="300" y2="340" stroke="#F2C230" stroke-width="2" stroke-dasharray="8 6"/>
    <g id="fpPasser" transform="translate(300 140)"><circle r="16" fill="${BLUE}" stroke="${INK}" stroke-width="3"/><text y="5" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="14" fill="#fff">9</text></g>
    <path id="fpPath" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="7 6"/>
    <g id="fpRecv"><circle r="16" fill="${BLUE}" stroke="${INK}" stroke-width="3"/><text y="5" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="14" fill="#fff">10</text></g>
    <ellipse id="fpBall" rx="9" ry="6" fill="#7A4521" stroke="${INK}" stroke-width="2"/></svg>`;
}
function passLab(){
  const $ = id => document.getElementById(id);
  function draw(){
    const x = +$("fpR").value, y = 270;
    $("fpRecv").setAttribute("transform", `translate(${x} ${y})`);
    $("fpPath").setAttribute("d", `M300 156Q${(300 + x)/2 + 20} ${(140 + y)/2} ${x} ${y - 16}`);
    $("fpBall").setAttribute("cx", (300 + x)/2 + 10); $("fpBall").setAttribute("cy", (140 + y)/2);
    const fwd = x > 304;
    $("fpVerdict").textContent = fwd ? "Forward pass" : "Good pass"; $("fpVerdict").className = fwd ? "verdict off" : "verdict on";
    $("fpMsg").textContent = fwd ? "Forward pass! The ball went toward the opponent's try line. The other team gets a scrum." : x > 296 ? "A flat pass, level with the passer. That's legal." : "Backward pass. That's the only way to pass in rugby, so attackers run in staggered lines behind the ball carrier.";
  }
  $("fpR").addEventListener("input", draw); draw();
}

/* Match simulator: ten-minute blocks. */
function matchSim(){
  const $ = id => document.getElementById(id); const N = ["Blue","Red"]; let S;
  const reset = () => { S = {min:0, pts:[0,0], tries:[0,0], sin:[0,0], log:[]}; $("rbMsg").textContent = "Kick-off! 80 minutes, two halves of 40."; draw(); };
  function block(){
    if(S.min >= 80) return; S.min += 10; const msgs = [];
    S.sin = S.sin.map(v => Math.max(0, v - 10));
    const n = Math.random() < .25 ? 0 : Math.random() < .7 ? 1 : 2;
    for(let i=0;i<n;i++){
      const t = Math.random() < (S.sin[1] && !S.sin[0] ? .7 : S.sin[0] && !S.sin[1] ? .3 : .5) ? 0 : 1, k = Math.random();
      if(k < .5){ S.pts[t] += 5; S.tries[t]++; let m = `Try for ${N[t]}! 5 points.`; if(Math.random() < .7){ S.pts[t] += 2; m += " The conversion sails over: 2 more."; } else m += " The conversion is missed."; msgs.push(m); }
      else if(k < .8){ if(Math.random() < .78){ S.pts[t] += 3; msgs.push(`${N[t]} kicks a penalty goal: 3 points.`); } else msgs.push(`${N[t]}'s penalty kick at goal drifts wide.`); }
      else if(k < .86){ S.pts[t] += 3; msgs.push(`Drop goal by ${N[t]}! Kicked on the half-volley during open play: 3 points.`); }
      else if(k < .95){ const o = 1 - t; S.sin[o] = 10; msgs.push(`Yellow card for ${N[o]} after a high tackle. Ten minutes in the sin bin, playing a player short.`); }
      else { S.pts[t] += 7; S.tries[t]++; msgs.push(`Penalty try for ${N[t]}: foul play stopped a probable try. 7 points, no conversion needed.`); }
    }
    if(!msgs.length) msgs.push("Ten minutes of hard tackling and kicking for territory, but no points.");
    if(S.min === 40) msgs.push("Half-time. Teams switch ends.");
    if(S.min === 80){
      const [a,b] = S.pts, w = a > b ? 0 : b > a ? 1 : -1;
      msgs.push(w < 0 ? `Full time: a ${a}-${b} draw.` : `Full time: ${N[w]} wins ${Math.max(a,b)}-${Math.min(a,b)}.`);
      const lp = [0,1].map(i => (w === i ? 4 : w < 0 ? 2 : 0) + (S.tries[i] >= 4 ? 1 : 0) + (w === 1 - i && Math.abs(a - b) <= 7 ? 1 : 0));
      msgs.push(`In a typical league table: ${N[0]} ${lp[0]} point${lp[0] === 1 ? "" : "s"}, ${N[1]} ${lp[1]} point${lp[1] === 1 ? "" : "s"} (4 for a win, 2 for a draw, plus bonus points for scoring 4 tries or losing by 7 or fewer).`);
    }
    $("rbMsg").textContent = msgs.join(" "); draw();
  }
  function draw(){
    $("rbClock").textContent = `${S.min}'`;
    [0,1].forEach(i => { $(`rbP${i}`).textContent = S.pts[i]; $(`rbT${i}`).textContent = `${S.tries[i]} tr${S.tries[i] === 1 ? "y" : "ies"}${S.sin[i] ? ", 14 players" : ""}`; });
    $("rbGo").hidden = S.min >= 80; $("rbNew").hidden = S.min < 80;
  }
  $("rbGo").addEventListener("click", block); $("rbNew").addEventListener("click", reset); reset();
}

const SCORES = [
  {pts:5, name:"Try", text:"Grounding the ball in the opponent's in-goal area. The big prize in rugby."},
  {pts:2, name:"Conversion", text:"A kick at goal after a try, taken anywhere on a line straight back from where the try was scored. Tries near the posts are easier to convert."},
  {pts:3, name:"Penalty goal", text:"After a penalty, a team may kick at goal from where the offense happened."},
  {pts:3, name:"Drop goal", text:"Dropping the ball and kicking it on the half-volley over the crossbar during open play."},
  {pts:7, name:"Penalty try", text:"Awarded when foul play stops a probable try. Worth 7, with no conversion."}
];
const dot = (x,y,c) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`;
const ovl = (x,y) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4" fill="#7A4521" stroke="${INK}" stroke-width="1.5"/>`;
const pitch = (body, vb="0 0 200 120") => `<svg viewBox="${vb}" aria-hidden="true"><rect x="-50" y="-50" width="300" height="220" fill="${G1}"/>${body}</svg>`;
const PHASES = [
  {name:"Scrum", text:"After a knock-on or forward pass. Eight forwards from each team bind together and push; the scrum-half feeds the ball in, and hookers try to heel it back.", art: pitch([[80,48],[80,60],[80,72],[66,42],[66,54],[66,66],[66,78],[52,60]].map(([x,y]) => dot(x,y,BLUE)).join("") + [[94,48],[94,60],[94,72],[108,42],[108,54],[108,66],[108,78],[122,60]].map(([x,y]) => dot(x,y,RED)).join("") + ovl(87,96) + dot(87,108,BLUE), "12 26 150 90")},
  {name:"Lineout", text:"After the ball goes into touch. Two lines of players stand a meter apart; the ball is thrown in straight down the middle, and teammates lift a jumper to catch it.", art: pitch(`<line x1="0" y1="12" x2="200" y2="12" stroke="#fff" stroke-width="3"/>` + [30,46,62,78,94].map(y => dot(94,y,BLUE) + dot(108,y,RED)).join("") + dot(101,4,BLUE) + `<path d="M101 10V60" stroke="#F2C230" stroke-width="2" stroke-dasharray="4 3"/>`)},
  {name:"Ruck", text:"After a tackle, the ball is on the ground and players from both teams, on their feet, push over it. No hands allowed: the ball must be won with the feet.", art: pitch(ovl(100,60) + dot(86,52,BLUE) + dot(86,68,BLUE) + dot(114,52,RED) + dot(114,68,RED) + dot(72,60,BLUE) + `<path d="M80 60h40" stroke="#fff" stroke-width="1" opacity=".5"/>`, "55 30 90 54")},
  {name:"Maul", text:"The ball carrier is held up by an opponent while teammates bind on behind. The whole group can drive forward, and it's often unstoppable near the try line.", art: pitch(dot(100,60,BLUE) + ovl(92,60) + dot(114,60,RED) + dot(86,48,BLUE) + dot(86,72,BLUE) + dot(72,60,BLUE) + `<path d="M66 84h50M108 78l10 6-10 6" stroke="#F2C230" stroke-width="3" fill="none"/>`, "52 32 100 60")},
  {name:"Kick-off", text:"Starts each half and restarts play after a score, from the middle of the halfway line. The ball must travel 10 m.", art: pitch(`<line x1="100" y1="0" x2="100" y2="120" stroke="#fff" stroke-width="2"/><line x1="150" y1="0" x2="150" y2="120" stroke="#fff" stroke-width="2" stroke-dasharray="6 5"/>` + dot(92,60,BLUE) + `<path d="M100 60Q140 0 170 50" stroke="#F2C230" stroke-width="2" stroke-dasharray="5 4" fill="none"/>` + ovl(170,52))},
  {name:"Penalty options", text:"A penalty gives a choice: kick at goal for 3, kick to touch for a lineout with the throw, tap and run, or take a scrum.", art: pitch(dot(60,70,BLUE) + ovl(66,72) + `<path d="M66 70L180 20M66 70L190 110M66 70L130 70" stroke="#F2C230" stroke-width="2" stroke-dasharray="5 4" fill="none"/>`)}
];
const CALLS = [
  {name:"Try", what:"Arm raised straight up, with the referee's back to the dead-ball line.", cost:"5 points.", arms:'<path d="M56 38l4-40"/><path d="M44 38l-6 30"/>'},
  {name:"Penalty kick", what:"Arm angled up and out toward the team that was fouled.", cost:"The team chooses: kick at goal, kick to touch, tap, or scrum.", arms:'<path d="M56 38l28-28"/><path d="M44 38l-6 30"/>'},
  {name:"Free kick", what:"Upper arm level and pointing at the fouled team, forearm bent straight up.", cost:"For lesser offenses. You can't kick at goal from it.", arms:'<path d="M56 38h22v-24"/><path d="M44 38l-6 30"/>'},
  {name:"Advantage", what:"Arm held out at waist height toward the team that was fouled.", cost:"Play continues if it helps the fouled team. If nothing comes of it, the penalty comes back.", arms:'<path d="M56 38l30 20"/><path d="M44 38l-6 30"/>'},
  {name:"Forward pass", what:"Both hands make a passing motion, as if throwing the ball forward.", cost:"Scrum to the other team.", arms:'<path d="M44 38l-6 18 26 8"/><path d="M56 38l10 16 22 6"/><path d="M90 62l8 0M94 58l4 4-4 4" stroke-width="2.5"/>'},
  {name:"Scrum", what:"Arm held level, pointing toward the team that will feed the ball in.", cost:"Restart for a knock-on, forward pass, or stoppage.", arms:'<path d="M56 38h34"/><path d="M44 38l-6 30"/>'}
];
const CLOCK = [
  {k:"h1", cls:"q", t:"1st half", s:"40 min", info:["1st half","Forty minutes. The clock runs continuously, but the referee can stop it for injuries and reviews. The half ends only when the ball next goes dead after time is up."]},
  {k:"ht", cls:"half", t:"Half", s:"Up to 15", info:["Half-time","Up to 15 minutes. Teams switch ends."]},
  {k:"h2", cls:"q", t:"2nd half", s:"40 min", info:["2nd half","Teams can make substitutions, usually bringing on fresh forwards around the 50th to 60th minute."]},
  {k:"et", cls:"ot", t:"Extra", s:"Knockouts", info:["Extra time","In knockout matches, a draw leads to extra time, and in some tournaments to a sudden-death period or a kicking competition. League matches can end level."]}
];
const TRICKY = [
  ["Why can't you pass forward?","It's the founding rule of rugby: the ball can only be passed backward or level. To gain ground, players run with it or kick it."],
  ["What's a knock-on?","Losing the ball forward off your hands or arms so it hits the ground or another player. The other team gets a scrum."],
  ["Why doesn't the clock stop at 80?","When time is up, the game ends at the next stoppage, so a team can keep attacking for minutes after the hooter while they hold the ball."],
  ["What's offside in rugby?","In open play, a player in front of a teammate who has the ball, or who last played it, can't take part until put back onside."],
  ["Who's the TMO?","The Television Match Official reviews video to help the referee with tries and foul play."],
  ["What's rugby sevens?","The Olympic version: seven players a side and seven-minute halves, on the same full-size field. It's fast, with lots of tries."]
];
const WORDS = [
  ["Try","Grounding the ball over the opponent's try line: 5 points."],
  ["Forwards","Players 1 to 8, the bigger players who contest scrums, lineouts, and rucks."],
  ["Backs","Players 9 to 15, the faster runners and kickers."],
  ["Scrum-half","Number 9, who feeds scrums and passes from the base of rucks."],
  ["Fly-half","Number 10, the playmaker who kicks and directs the attack."],
  ["Knock-on","Losing the ball forward off the hands."],
  ["Sin bin","Ten minutes off the field after a yellow card."],
  ["Phase","Each passage of play between breakdowns."],
  ["Grubber","A low kick along the ground for a teammate to chase."],
  ["Garryowen","A high kick that gives chasers time to compete for the catch. Also called an up-and-under."]
];
const fwdMini = () => `<svg viewBox="140 60 420 280" style="width:240px;border-radius:8px" aria-hidden="true"><rect x="140" y="60" width="420" height="280" fill="${G1}"/>
  <path d="M520 90h30M540 82l10 8-10 8" stroke="#fff" stroke-width="3" fill="none"/><line x1="300" y1="60" x2="300" y2="340" stroke="#F2C230" stroke-width="2" stroke-dasharray="8 6"/>
  <circle cx="300" cy="140" r="16" fill="${BLUE}" stroke="${INK}" stroke-width="3"/><circle cx="400" cy="270" r="16" fill="${BLUE}" stroke="${INK}" stroke-width="3"/>
  <path d="M300 156Q370 205 400 254" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="7 6"/></svg>`;
const QUIZ = [
  {q:"How many points is a try worth?", o:["3","4","5","7"], a:2, why:"A try is worth 5 points."},
  {q:"How many points does a conversion add?", o:["1","2","3","5"], a:1, why:"The conversion kick after a try is worth 2."},
  {q:"In which direction may the ball be passed?", o:["Any direction","Forward only","Backward or level","Only sideways to the left"], a:2, why:"Passes must go backward or level, never forward."},
  {q:"A player knocks the ball forward and it hits the ground. What happens?", o:["A scrum to the other team","A lineout to the same team","A penalty try","Nothing, play on"], a:0, why:"A knock-on gives the other team a scrum."},
  {q:"The ball is carried over the touchline. How does play restart?", o:["Scrum","Lineout","Kick-off","Free kick"], a:1, why:"A lineout, with the ball thrown in down the middle of two lines of players."},
  {q:"How many points is a penalty goal?", o:["5","2","7","3"], a:3, why:"Penalty goals and drop goals are worth 3."},
  {q:"Blue is attacking to the right. Number 9 passes to number 10 like this. What's the call?", visual: fwdMini, o:["A legal pass","Forward pass: scrum to the other team","A try","A penalty try"], a:1, why:"The receiver is ahead of the passer, so the ball went forward."},
  {q:"A player gets a yellow card. What happens?", o:["Sent off for the rest of the game","The team loses 3 points","10 minutes in the sin bin","Only a warning"], a:2, why:"Ten minutes off the field, with the team playing a player short."},
  {q:"How long is a rugby union match?", o:["80 minutes","60 minutes","70 minutes","90 minutes"], a:0, why:"Two halves of 40 minutes."},
  {q:"Who kicks off after a try is scored?", o:["The team that scored","The team that conceded the points","A coin toss decides","The home team"], a:1, why:"The team that conceded kicks off to the scorers."}
];

function render(app){
  app.innerHTML = sportHero({id:"rugby", name:"Rugby", alt:"The tabby cat in a striped rugby jersey, holding an oval ball",
      lede:"Two teams of fifteen try to carry or kick an oval ball over the opponent's try line. You can run with the ball and kick it forward, but you can only pass it backward. Tackling is allowed, and play keeps flowing through rucks and mauls until someone scores.",
      facts:[["15","players per side"],["80","minutes in two halves"],["5","points for a try"],["0","forward passes allowed"]]})
    + jumpNav([["rg-field","The field"],["rg-pass","Passing"],["rg-score","Scoring"],["rg-sim","Play a match"],["rg-phases","Set pieces"],["rg-calls","Referee calls"],["rg-clock","The clock"],["rg-tricky","Tricky rules"],["rg-words","Words you'll hear"],["rg-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("rg-field","The field","Tap any part of the field to see what it does.",
        `<div class="fieldbox" id="rgField">${fieldSVG()}</div><div class="fieldrow"><div class="zonechips" id="rgChips"></div><div class="infopanel" id="rgInfo" aria-live="polite"></div></div>`)
    + section("rg-pass","Pass it back","Blue attacks to the right. Slide the receiver to see which passes are legal. The yellow line runs through the passer.",
        `<div class="oslab"><div class="fieldbox">${passSVG()}</div>
          <div class="osside"><div class="osverdict"><span id="fpVerdict" class="verdict on">Good pass</span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="fpMsg"></p></div>
            <label class="slider">Receiver's position<input id="fpR" type="range" min="190" max="420" step="2" value="250"></label>
            <p class="note">Referees judge the direction of the pass from the passer's hands. A ball thrown backward can still drift forward over the ground when the passer is running fast, and that's allowed.</p></div></div>`)
    + section("rg-score","Scoring","Five ways to score.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">${SCORES.map(s => `<div class="score"><div class="pts">${s.pts}<small>points</small></div><h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("rg-sim","Play a match","Play ten minutes at a time and watch how points pile up. At full time you'll see how league tables award bonus points.",
        `<div class="sim"><div class="board" style="grid-template-columns:1fr 1fr 1fr"><div><small>Blue</small><b id="rbP0">0</b><small id="rbT0"></small></div><div class="dd"><small>Clock</small><b id="rbClock">0'</b></div><div><small>Red</small><b id="rbP1">0</b><small id="rbT1"></small></div></div>
          <div class="controls"><button class="btn primary" id="rbGo" type="button">Play 10 minutes</button><button class="btn primary" id="rbNew" type="button" hidden>New match</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="rbMsg"></p></div></div></div>`)
    + section("rg-phases","Set pieces and the breakdown","How play restarts, and what happens when someone is tackled. Blue and red dots are players.",
        `<div class="scoring restarts">${PHASES.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("rg-calls","Referee calls","The referee wears a microphone at big matches, so you can often hear every decision explained.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("rg-clock","The clock","Tap a part of the match to learn what happens there.",
        `<div class="timeline" id="rgTimeline"></div><div class="infopanel" id="rgClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("rg-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="rgFlips"></div>`)
    + section("rg-words","Words you'll hear","",`<dl class="gloss" id="rgGloss"></dl>`)
    + section("rg-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="rgQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow World Rugby's Laws of the Game for rugby union. Rugby league is a different sport with 13 players, six tackles per possession, and different scoring.</footer></div>`;

  setupZones(document.getElementById("rgField"), document.getElementById("rgChips"), document.getElementById("rgInfo"), ZONES, ZONE_ORDER, "tryline");
  passLab(); matchSim();
  setupTimeline(document.getElementById("rgTimeline"), document.getElementById("rgClockInfo"), CLOCK,
    "Yellow cards send a player to the sin bin for 10 minutes. Red cards send a player off; some competitions now allow a replacement after 20 minutes.");
  flipCards(document.getElementById("rgFlips"), TRICKY);
  glossary(document.getElementById("rgGloss"), WORDS);
  makeQuiz(document.getElementById("rgQuiz"), QUIZ, [
    "Try time! Watch a match and spot the forward passes before the referee does.",
    "Converted. Play another match in the simulator and the scoring will stick.",
    "Look over the set pieces and passing lab again, then come back for another try.",
    "No worries. Start with the field and the passing lab, then try again."]);
}

SPORT_PAGES["rugby"] = {render};
})();

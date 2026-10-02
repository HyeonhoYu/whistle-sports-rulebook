/* Ice hockey. Rules follow the NHL. */
(function(){

const ICE = "#EEF4F8", RED = "#D9342B", BLUE = "#2F6FD6", INK = "#18221D";
/* Rink 200 x 85 ft at 5 units per foot. Goal lines x=55/945, blue lines x=375/625, red line x=500. */
function rinkLines(){
  const dot = (x,y,c=RED) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`;
  const circle = (x,y) => `<circle cx="${x}" cy="${y}" r="75" fill="none" stroke="${RED}" stroke-width="2.5"/>${dot(x,y)}`;
  let s = `<clipPath id="rinkClip"><rect x="0" y="0" width="1000" height="425" rx="140"/></clipPath>
    <rect x="0" y="0" width="1000" height="425" rx="140" fill="${ICE}"/><g clip-path="url(#rinkClip)">
    <line x1="55" y1="10" x2="55" y2="415" stroke="${RED}" stroke-width="2.5"/><line x1="945" y1="10" x2="945" y2="415" stroke="${RED}" stroke-width="2.5"/>
    <rect x="370" y="0" width="10" height="425" fill="${BLUE}"/><rect x="620" y="0" width="10" height="425" fill="${BLUE}"/>
    <rect x="497" y="0" width="6" height="425" fill="${RED}"/>
    <circle cx="500" cy="212.5" r="75" fill="none" stroke="${BLUE}" stroke-width="2.5"/>${dot(500,212.5,BLUE)}
    ${circle(155,102.5)}${circle(155,322.5)}${circle(845,102.5)}${circle(845,322.5)}
    ${dot(400,102.5)}${dot(400,322.5)}${dot(600,102.5)}${dot(600,322.5)}
    <path d="M55 157.5L0 142.5M55 267.5L0 282.5M945 157.5L1000 142.5M945 267.5L1000 282.5" stroke="${RED}" stroke-width="2"/>
    <path d="M55 182.5A30 30 0 0 1 55 242.5Z" fill="#9CC7EE" stroke="${RED}" stroke-width="2"/><path d="M945 182.5A30 30 0 0 0 945 242.5Z" fill="#9CC7EE" stroke="${RED}" stroke-width="2"/>
    <rect x="35" y="197.5" width="20" height="30" fill="#fff" stroke="${RED}" stroke-width="3"/><rect x="945" y="197.5" width="20" height="30" fill="#fff" stroke="${RED}" stroke-width="3"/></g>
    <rect x="0" y="0" width="1000" height="425" rx="140" fill="none" stroke="${INK}" stroke-width="8"/>`;
  return s;
}
function rinkSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const c = (z,x,y,rr) => `<circle class="hz" data-zone="${z}" cx="${x}" cy="${y}" r="${rr}"/>`;
  return `<svg viewBox="-30 -30 1060 485" role="img" aria-label="Diagram of an NHL hockey rink"><rect x="-30" y="-30" width="1060" height="485" fill="#1C4D2C"/>${rinkLines()}
    ${r("endzone",8,8,362,409)}${r("endzone",630,8,362,409)}${r("neutral",380,8,240,409)}
    <path class="hz" data-zone="trapezoid" d="M55 157.5L4 142.5V282.5L55 267.5Z"/><path class="hz" data-zone="trapezoid" d="M945 157.5L996 142.5V282.5L945 267.5Z"/>
    ${c("faceoff",155,102.5,75)}${c("faceoff",155,322.5,75)}${c("faceoff",845,102.5,75)}${c("faceoff",845,322.5,75)}${c("faceoff",500,212.5,75)}
    ${r("goalline",48,8,14,409)}${r("goalline",938,8,14,409)}${r("blue",364,0,22,425)}${r("blue",614,0,22,425)}${r("red",490,0,20,425)}
    <path class="hz" data-zone="crease" d="M55 178A34 34 0 0 1 55 247Z"/><path class="hz" data-zone="crease" d="M945 178A34 34 0 0 0 945 247Z"/>
    ${r("net",30,192,26,40)}${r("net",944,192,26,40)}
    <rect class="hz hzs" data-zone="boards" x="0" y="0" width="1000" height="425" rx="140"/></svg>`;
}
const ZONES = {
  net:{title:"Net", text:"6 feet wide and 4 feet tall. A goal counts only when the whole puck crosses the goal line between the posts and under the crossbar."},
  crease:{title:"Goal crease", text:"The light-blue area in front of the net belongs to the goalie. Attackers can skate through it, but a goal can be disallowed if one interferes with the goalie's ability to make a save."},
  goalline:{title:"Goal line", text:"The thin red line the net sits on. It also decides icing: a puck sent from your own half all the way across the opponent's goal line, untouched, is usually icing."},
  blue:{title:"Blue lines", text:"They split the rink into three zones and decide offside. Attackers can't enter the offensive zone before the puck does. The blue line belongs to the zone the puck is coming from."},
  red:{title:"Center red line", text:"Splits the rink in half. For icing, what matters is which side of this line the puck was shot from."},
  neutral:{title:"Neutral zone", text:"The middle area between the blue lines. Teams try to carry the puck through it with speed to enter the attacking zone onside."},
  endzone:{title:"End zones", text:"Each team defends the zone in front of its own net and attacks the other. A zone is offensive or defensive depending on which way your team is shooting, and teams switch ends each period."},
  faceoff:{title:"Faceoff circles and dots", text:"Every stoppage restarts with a faceoff at one of nine dots. The referee drops the puck between two centers, and everyone else must stay outside the circle until it lands."},
  trapezoid:{title:"Trapezoid", text:"The area behind each net where the goalie may play the puck. A goalie who handles it in the corners outside the trapezoid gets a two-minute penalty."},
  boards:{title:"Boards and glass", chip:"Boards", text:"The walls around the rink. The puck stays in play off the boards and glass. A defender who shoots it over the glass from their own zone gets a two-minute penalty for delay of game."}
};
const ZONE_ORDER = ["net","crease","goalline","blue","red","neutral","endzone","faceoff","trapezoid","boards"];

/* Offside lab: right part of the rink, attack to the right. Blue line far edge at x=630. */
const BL = 630;
function offsideSVG(){
  const sk = (id, color, ring) => `<g class="mv" id="${id}">${ring ? `<circle r="22" fill="none" stroke="#F2C230" stroke-width="4"/>` : ""}<circle r="15" fill="${color}" stroke="${INK}" stroke-width="3"/></g>`;
  return `<svg viewBox="440 -20 580 465" role="img" aria-label="Offside diagram at the blue line"><rect x="440" y="-20" width="580" height="465" fill="#1C4D2C"/>${rinkLines()}
    <rect id="hoZone" x="${BL}" y="4" width="320" height="417" fill="#C8482F" opacity="0" clip-path="url(#rinkClip)"/>
    <text x="${BL + 12}" y="30" font-family="Barlow Condensed,sans-serif" font-weight="600" font-size="20" fill="${BLUE}">Offensive zone</text>
    ${sk("hoMate", BLUE, true)}${sk("hoCarrier", BLUE)}${sk("hoD1", RED)}${sk("hoD2", RED)}
    <g class="mv" id="hoPuck"><ellipse rx="9" ry="6" fill="${INK}"/></g></svg>`;
}
function offsideLab(){
  const $ = id => document.getElementById(id); const S = {puck:560, mate:600};
  const put = (id,x,y) => $(id).style.transform = `translate(${x}px, ${y}px)`;
  function draw(){
    put("hoCarrier", S.puck - 22, 300); put("hoPuck", S.puck, 312); put("hoMate", S.mate, 140); put("hoD1", 800, 200); put("hoD2", 790, 320);
    const off = S.mate > BL + 2 && S.puck < BL + 4;
    $("hoZone").setAttribute("opacity", off ? .18 : 0);
    $("hoVerdict").textContent = off ? "Offside" : "Onside"; $("hoVerdict").className = off ? "verdict off" : "verdict on";
    $("hoMsg").textContent = off ? "Offside! The ringed teammate crossed the blue line into the offensive zone before the puck did. Play stops for a faceoff outside the zone."
      : S.puck >= BL + 4 ? "Onside. The puck crossed the blue line first, so attackers can follow it in."
      : S.mate >= BL - 8 ? "Onside. A skate still touching the blue line keeps the player onside." : "Onside. Nobody has entered the offensive zone ahead of the puck.";
  }
  $("hoPuckR").addEventListener("input", e => { S.puck = +e.target.value; draw(); });
  $("hoMateR").addEventListener("input", e => { S.mate = +e.target.value; draw(); });
  draw();
}

/* Icing lab: full rink. Your team defends the left net and shoots right. */
function icingSVG(){
  return `<svg viewBox="-30 -30 1060 485" role="img" aria-label="Icing diagram on the full rink"><rect x="-30" y="-30" width="1060" height="485" fill="#1C4D2C"/>${rinkLines()}
    <text x="250" y="400" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="600" font-size="22" fill="${BLUE}">Your half</text>
    <g class="mv" id="icShooter"><circle r="15" fill="${BLUE}" stroke="${INK}" stroke-width="3"/></g>
    <g class="mv slow" id="icPuck"><ellipse rx="9" ry="6" fill="${INK}"/></g></svg>`;
}
function icingLab(){
  const $ = id => document.getElementById(id); const S = {x:300, busy:false};
  const draw = () => { $("icShooter").style.transform = `translate(${S.x}px, 300px)`; $("icPuck").style.transform = `translate(${S.x + 20}px, 306px)`; };
  $("icR").addEventListener("input", e => { S.x = +e.target.value; draw(); $("icMsg").textContent = S.x < 500 ? "The shooter is in your own half, behind the center red line." : "The shooter is past the center red line, in the other team's half."; });
  $("icShoot").addEventListener("click", () => {
    if(S.busy) return; S.busy = true;
    $("icPuck").style.transform = `translate(985px, 110px)`;
    const sh = $("icShort").checked, behind = S.x < 500;
    setTimeout(() => {
      const icing = behind && !sh;
      $("icVerdict").textContent = icing ? "Icing" : "No icing"; $("icVerdict").className = icing ? "verdict off" : "verdict on";
      $("icMsg").textContent = icing ? "Icing! The puck went from your half all the way past the opponent's goal line untouched. The faceoff moves back to your defensive zone, and your tired players can't change."
        : sh ? "No icing. A team that's shorthanded on a penalty kill is allowed to fire the puck down the ice to kill time."
        : "No icing. The puck was shot from the other team's half of the rink, so it's fine to send it deep.";
      setTimeout(() => { S.busy = false; draw(); }, 900);
    }, 1000);
  });
  draw();
}

/* Power play board */
function powerPlay(){
  const $ = id => document.getElementById(id);
  const S = {blue:[], red:[], tick:null};
  const skaters = t => 5 - Math.min(S[t].length, 2);
  const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
  function draw(){
    ["blue","red"].forEach(t => {
      const n = skaters(t);
      $(`pp_${t}`).innerHTML = Array.from({length:5}, (_,i) => `<i class="${i < n ? "on-" + t : ""}"></i>`).join("") + `<i class="g">G</i>`;
      $(`pt_${t}`).textContent = S[t].length ? S[t].slice(0,2).map(p => fmt(p)).join("  ") + (S[t].length > 2 ? `  +${S[t].length - 2} waiting` : "") : "No penalties";
    });
    const b = skaters("blue"), r = skaters("red");
    $("ppState").textContent = b === r ? `Even strength, ${b} on ${r}` : b > r ? `Blue power play, ${b} on ${r}` : `Red power play, ${r} on ${b}`;
  }
  function run(){ if(S.tick) return; S.tick = setInterval(() => {
    ["blue","red"].forEach(t => { S[t] = S[t].map((p,i) => i < 2 ? p - 1 : p); const before = S[t].length; S[t] = S[t].filter(p => p > 0);
      if(S[t].length < before) $("ppMsg").textContent = `A ${t} penalty expired. The player leaves the penalty box and the teams are back closer to even.`; });
    if(!S.blue.length && !S.red.length){ clearInterval(S.tick); S.tick = null; }
    draw(); }, 100); }
  const pen = t => { S[t].push(120); const n = S[t].length;
    $("ppMsg").textContent = n > 2 ? `A third ${t} penalty. A team can't drop below three skaters, so this one waits until another penalty ends.` : `A ${t} player goes to the penalty box for two minutes. ${t === "blue" ? "Red" : "Blue"} goes on the power play.`;
    run(); draw(); };
  const goal = t => { const o = t === "blue" ? "red" : "blue";
    if(skaters(t) > skaters(o)){ S[o].shift(); $("ppMsg").textContent = `Power-play goal for ${t}! Scoring ends the oldest ${o} minor penalty early, and that player returns to the ice.`; }
    else if(skaters(t) < skaters(o)) $("ppMsg").textContent = `Shorthanded goal for ${t}! Scoring while down a player doesn't end your own penalty.`;
    else $("ppMsg").textContent = `Goal for ${t} at even strength. Nobody's penalty changes.`;
    draw(); };
  $("ppPenB").addEventListener("click", () => pen("blue")); $("ppPenR").addEventListener("click", () => pen("red"));
  $("ppGoalB").addEventListener("click", () => goal("blue")); $("ppGoalR").addEventListener("click", () => goal("red"));
  draw();
}

const mini = body => `<svg viewBox="560 30 470 365" aria-hidden="true"><rect x="560" y="30" width="470" height="365" fill="#1C4D2C"/>${rinkLines()}${body}</svg>`;
const pk = (x,y) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="${INK}"/>`;
const sk = (x,y,c) => `<circle cx="${x}" cy="${y}" r="14" fill="${c}" stroke="${INK}" stroke-width="3"/>`;
const tr = d => `<path d="${d}" fill="none" stroke="#F2C230" stroke-width="5" stroke-dasharray="12 9"/>`;
const SCORES = [
  {name:"Goal", text:"The whole puck crosses the goal line between the posts. Up to two teammates who touched it just before get assists.", art: mini(sk(800,150,BLUE) + tr("M805 160L950 210") + pk(952,212))},
  {name:"Power-play goal", text:"Scored while the other team is shorthanded. On a minor penalty, it sends the penalized player back onto the ice.", art: mini(sk(780,120,BLUE) + sk(760,300,BLUE) + sk(870,180,RED) + tr("M770 300L950 214") + pk(952,214))},
  {name:"Shorthanded goal", text:"Scored by the team that's down a player. A big momentum swing, since the penalty kill wasn't expected to attack.", art: mini(sk(700,212,BLUE) + sk(640,140,RED) + sk(640,290,RED) + tr("M710 212L950 212") + pk(952,212))},
  {name:"Empty-net goal", text:"When a trailing team pulls its goalie for an extra skater late in the game, the leading team can score into the open net.", art: mini(sk(640,300,BLUE) + tr("M650 300L950 212") + pk(952,212) + `<text x="900" y="150" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="30" fill="${RED}">No goalie</text>`)}
];

const CALLS = [
  {name:"Tripping", what:"Using the stick, leg, or body to knock an opponent's feet out from under them.", cost:"2-minute minor.", arms:'<path d="M56 38l14 24-12 32"/><path d="M44 38l-6 30"/><path d="M50 98l-6-4M50 104h-8" stroke-width="2.5"/>'},
  {name:"Hooking", what:"Using the blade of the stick to pull or hold back an opponent.", cost:"2-minute minor.", arms:'<path d="M44 38l-12 18 16 6"/><path d="M56 38l14 16-16 8"/><path d="M76 66l-14-2M62 64l4-5M62 64l4 5" stroke-width="2.5"/>'},
  {name:"Slashing", what:"Swinging the stick at an opponent's hands, arms, or body.", cost:"2-minute minor, or more if it injures.", arms:'<path d="M44 38l-6 16h28"/><path d="M56 38l22 -4-12 18"/>'},
  {name:"Holding", what:"Grabbing an opponent's body or stick with the hands to slow them down.", cost:"2-minute minor.", arms:'<path d="M56 38l14 14H44"/><path d="M44 38l-8 16 10 0"/><circle cx="46" cy="53" r="4"/>'},
  {name:"High-sticking", what:"Hitting an opponent with the stick above the shoulders.", cost:"2 minutes, or a double minor (4) if it draws blood.", arms:'<path d="M56 38l16-8-2-18"/><path d="M44 38l26-12"/><circle cx="70" cy="10" r="5" fill="currentColor"/><circle cx="70" cy="25" r="5" fill="currentColor"/>'},
  {name:"Interference", what:"Body-checking or blocking a player who doesn't have the puck.", cost:"2-minute minor.", arms:'<path d="M44 38l22 18"/><path d="M56 38L34 56"/>'}
];

const CLOCK = [
  {k:"p1", cls:"q", t:"1st", s:"20 min", info:["1st period","Three 20-minute periods of game clock. The clock stops whenever play stops: goals, penalties, offside, icing, the puck leaving the rink."]},
  {k:"i1", cls:"half", t:"Int.", s:"Break", info:["Intermission","About 18 minutes between periods. The ice is resurfaced so it's smooth again, and teams switch ends."]},
  {k:"p2", cls:"q", t:"2nd", s:"20 min", info:["2nd period","Teams defend the far end in the 2nd period, so their bench is farther from their own net. Line changes get harder, which is why it's called the long change."]},
  {k:"p3", cls:"q", t:"3rd", s:"20 min", info:["3rd period","A team that trails late often pulls its goalie for an extra skater in the final minute or two."]},
  {k:"ot", cls:"ot", t:"OT", s:"5 min", info:["Overtime","In the regular season: 5 minutes of 3-on-3, and the first goal wins. In the playoffs: full 20-minute periods at 5-on-5 until someone scores."]},
  {k:"so", cls:"ot", t:"SO", s:"Shootout", info:["Shootout","Regular season only. If overtime ends scoreless, each team sends three shooters one-on-one against the goalie, then goes to sudden death if still tied."]}
];

const TRICKY = [
  ["Why do teams pull the goalie?","A trailing team late in the game swaps its goalie for an extra skater to get six attackers against five. It risks an empty-net goal, but it's the best shot at tying the game."],
  ["Can you kick the puck into the net?","Not with a distinct kicking motion. A puck that deflects in off a skate without a kick counts. Video review often decides the difference."],
  ["What's a delayed penalty?","When the referee raises an arm, a penalty is coming, but play continues until the guilty team touches the puck. The other team often pulls its goalie for an extra attacker, since it can't lose possession."],
  ["What's too many men?","Having more than six players on the ice during a line change. The team gets a two-minute bench minor, and any player can serve it."],
  ["Why are fights not stopped right away?","Fighting is a five-minute major in the NHL, not an ejection. Officials usually wait until the players tire or fall before stepping in for safety."],
  ["What's tagging up?","After an offside call is delayed, attackers already in the zone can clear back out over the blue line to tag up. Once all are out, they can re-enter and play continues."]
];
const WORDS = [
  ["Faceoff","The puck drop that restarts play after every stoppage."],
  ["Power play","Playing with more skaters than the other team because of a penalty."],
  ["Penalty kill","The shorthanded team defending during the other team's power play."],
  ["Hat trick","Three goals by one player in a game. Fans often throw hats onto the ice."],
  ["Slap shot","A hard shot with a big wind-up, slapping the ice just behind the puck."],
  ["Deke","Faking out a defender or goalie with a quick move of the stick or body."],
  ["Five-hole","The gap between a goalie's legs."],
  ["Odd-man rush","An attack where the offense outnumbers the defenders, like a 2-on-1."],
  ["Check","Using the body to separate an opponent from the puck. Legal from the front or side."],
  ["Line change","Swapping groups of players on the fly, usually every 45 seconds or so."]
];

const offMini = () => `<svg viewBox="500 40 360 280" style="width:240px;border-radius:8px" aria-hidden="true"><rect x="500" y="40" width="360" height="280" fill="#1C4D2C"/>${rinkLines()}
  <circle cx="690" cy="120" r="21" fill="none" stroke="#F2C230" stroke-width="4"/><circle cx="690" cy="120" r="14" fill="${BLUE}" stroke="${INK}" stroke-width="3"/>
  <circle cx="565" cy="250" r="14" fill="${BLUE}" stroke="${INK}" stroke-width="3"/><ellipse cx="588" cy="258" rx="9" ry="6" fill="${INK}"/></svg>`;
const QUIZ = [
  {q:"How many players does each team normally have on the ice?", o:["5","6","7","11"], a:1, why:"Six: five skaters and a goalie."},
  {q:"How long is a minor penalty?", o:["2 minutes","5 minutes","10 minutes","Until a goal is scored"], a:0, why:"Two minutes in the penalty box. It can end early if the other team scores on the power play."},
  {q:"The ringed player crosses the blue line while the puck is still outside the zone. What's the call?", visual: offMini, o:["Onside","Offside","Icing","Too many men"], a:1, why:"An attacker can't enter the offensive zone before the puck. That's offside."},
  {q:"A team shoots the puck from its own half past the other team's goal line, untouched. They're not on a penalty kill. What's the call?", o:["Play continues","Icing: faceoff in the shooting team's zone","A 2-minute penalty","Offside"], a:1, why:"That's icing. The faceoff goes back to the offending team's end, and they can't change players."},
  {q:"The same thing happens, but the shooting team is shorthanded. What's the call?", o:["Icing","A penalty","It's allowed","A faceoff at center ice"], a:2, why:"Teams on the penalty kill are allowed to ice the puck to relieve pressure."},
  {q:"A team on a power play from a minor penalty scores. What happens?", o:["The penalty keeps running","The penalized player returns","Both teams lose a skater","The penalty doubles"], a:1, why:"A power-play goal ends a minor penalty early, and the player comes back on the ice."},
  {q:"How many periods are in an NHL game?", o:["2","4","3","5"], a:2, why:"Three 20-minute periods, then overtime if tied."},
  {q:"The referee makes this signal. What's the call?", visual:() => fig(CALLS[5].arms), o:["Interference","Hooking","Tripping","Slashing"], a:0, why:"Arms crossed and held still in front of the chest means interference."},
  {q:"When does a goal count?", o:["When the puck touches the goal line","When half the puck is over","When the whole puck is over the goal line","When the puck hits the post"], a:2, why:"The entire puck must cross the goal line between the posts."},
  {q:"Why does a trailing team pull its goalie late in a game?", o:["The goalie is tired","To add an extra skater","The rules require it","To stop the clock"], a:1, why:"Swapping the goalie for a skater gives six attackers against five, at the risk of an empty-net goal."}
];

function render(app){
  app.innerHTML = sportHero({id:"ice-hockey", name:"Ice hockey", alt:"The tabby cat in a hockey jersey, skating with a stick and puck",
      lede:"Two teams of six skate on ice, using sticks to shoot a hard rubber puck into the other team's net. Players change on the fly every minute or so, play is fast and physical, and the team with more goals after three periods wins.",
      facts:[["6","players per side, including the goalie"],["60","minutes in three periods"],["2","minutes in the box for a minor"],["200","feet of ice, end to end"]]})
    + jumpNav([["h-rink","The rink"],["h-offside","Offside"],["h-icing","Icing"],["h-score","Scoring"],["h-pp","Power play"],["h-calls","Penalties"],["h-clock","The clock"],["h-tricky","Tricky rules"],["h-words","Words you'll hear"],["h-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("h-rink","The rink","Tap any part of the rink to see what it does.",
        `<div class="fieldbox" id="hRink">${rinkSVG()}</div><div class="fieldrow"><div class="zonechips" id="hChips"></div><div class="infopanel" id="hInfo" aria-live="polite"></div></div>`)
    + section("h-offside","Offside at the blue line","Blue attacks to the right. Slide the puck carrier and the ringed teammate. The puck has to cross the blue line before any attacker does.",
        `<div class="oslab"><div class="fieldbox">${offsideSVG()}</div>
          <div class="osside"><div class="osverdict"><span id="hoVerdict" class="verdict on">Onside</span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="hoMsg"></p></div>
            <label class="slider">Puck carrier<input id="hoPuckR" type="range" min="500" max="780" step="2" value="560"></label>
            <label class="slider">Ringed teammate<input id="hoMateR" type="range" min="500" max="800" step="2" value="600"></label>
            <p class="note">Unlike soccer, hockey offside is all about the puck and the blue line, not the defenders.</p></div></div>`)
    + section("h-icing","Icing","Your team defends the left net. Pick where the shooter stands, then fire the puck down the ice.",
        `<div class="fieldbox">${icingSVG()}</div>
        <div class="oslab" style="margin-top:14px"><div class="osside">
            <label class="slider">Shooter's position<input id="icR" type="range" min="80" max="900" step="5" value="300"></label>
            <label class="check"><input type="checkbox" id="icShort"> Your team is shorthanded (on a penalty kill)</label>
            <div class="controls"><button class="btn primary" id="icShoot" type="button">Shoot the puck down the ice</button></div></div>
          <div class="osside"><div class="osverdict"><span id="icVerdict" class="verdict on">Ready</span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="icMsg">The shooter is in your own half, behind the center red line.</p></div></div></div>
        <p class="combo">The NHL uses hybrid icing: a linesman can wave it off if an attacker is winning the race to the puck, judged at the faceoff dots. It keeps players from crashing into the boards at full speed.</p>`)
    + section("h-score","Scoring","Every goal is worth one. How it's scored gets its own name.",
        `<div class="scoring restarts">${SCORES.map(s => `<div class="score">${s.art}<div class="pts">1<small>goal</small></div><h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("h-pp","Power play","Hand out penalties and score goals to see how the number of skaters changes. Time runs ten times faster than a real game.",
        `<div class="sim"><div class="board ppboard">
            <div><small>Blue skaters</small><span class="lights" id="pp_blue"></span><small id="pt_blue" style="margin-top:6px"></small></div>
            <div><small>Red skaters</small><span class="lights" id="pp_red"></span><small id="pt_red" style="margin-top:6px"></small></div>
            <div class="dd"><small>On the ice</small><b id="ppState" style="font-size:1.6rem">Even strength</b></div></div>
          <div class="controls"><button class="btn" id="ppPenB" type="button">Blue takes a minor</button><button class="btn" id="ppPenR" type="button">Red takes a minor</button><button class="btn primary" id="ppGoalB" type="button">Blue scores</button><button class="btn primary" id="ppGoalR" type="button">Red scores</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="ppMsg">Both teams have five skaters and a goalie. Give someone a penalty to start.</p></div></div></div>
        <p class="combo">Major penalties (5 minutes, often for fighting) are served in full even if the other team scores. A misconduct (10 minutes) sends the player off without leaving the team shorthanded.</p>`)
    + section("h-calls","Penalties","The referee's arm goes up when a penalty is called, then a signal like these explains it.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("h-clock","The clock","Tap a part of the game to learn what happens there.",
        `<div class="timeline" id="hTimeline"></div><div class="infopanel" id="hClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("h-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="hFlips"></div>`)
    + section("h-words","Words you'll hear","",`<dl class="gloss" id="hGloss"></dl>`)
    + section("h-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="hQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the NHL. International (IIHF) and college hockey use a wider rink and differ on icing, overtime, and fighting.</footer></div>`;

  setupZones(document.getElementById("hRink"), document.getElementById("hChips"), document.getElementById("hInfo"), ZONES, ZONE_ORDER, "blue");
  offsideLab(); icingLab(); powerPlay();
  setupTimeline(document.getElementById("hTimeline"), document.getElementById("hClockInfo"), CLOCK,
    "The clock stops at every whistle, so a 60-minute NHL game takes about two and a half hours.");
  flipCards(document.getElementById("hFlips"), TRICKY);
  glossary(document.getElementById("hGloss"), WORDS);
  makeQuiz(document.getElementById("hQuiz"), QUIZ, [
    "Top shelf! Watch a game and call icing and offside before the linesman does.",
    "Strong shift. Run the offside and icing labs once more and you'll have them for good.",
    "Try the power play board and the penalty signals again, then take another shot at the quiz.",
    "No worries. Start with the rink diagram, then the offside lab, and come back."]);
}

SPORT_PAGES["ice-hockey"] = {render};
})();

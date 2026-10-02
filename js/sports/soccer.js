/* Soccer (association football). Rules follow the IFAB Laws of the Game. */
(function(){

const W = "#F4F6F1";
/* Full pitch, 105 x 68 m drawn at 10 units per meter. Attack direction does not matter here. */
function pitchSVG(){
  let s = `<svg viewBox="-40 -40 1130 760" role="img" aria-label="Diagram of a soccer pitch">`;
  s += `<rect x="-40" y="-40" width="1130" height="760" fill="#1C4D2C"/><rect width="1050" height="680" fill="#2A6B3F"/>`;
  for(let i=0;i<10;i+=2) s += `<rect x="${i*105}" y="0" width="105" height="680" fill="#2F7546"/>`;
  const L = `fill="none" stroke="${W}" stroke-width="4"`;
  s += `<rect width="1050" height="680" ${L}/><line x1="525" y1="0" x2="525" y2="680" stroke="${W}" stroke-width="4"/>`;
  s += `<circle cx="525" cy="340" r="91.5" ${L}/><circle cx="525" cy="340" r="5" fill="${W}"/>`;
  s += `<rect x="0" y="138.5" width="165" height="403" ${L}/><rect x="885" y="138.5" width="165" height="403" ${L}/>`;
  s += `<rect x="0" y="248.4" width="55" height="183.2" ${L}/><rect x="995" y="248.4" width="55" height="183.2" ${L}/>`;
  s += `<circle cx="110" cy="340" r="5" fill="${W}"/><circle cx="940" cy="340" r="5" fill="${W}"/>`;
  s += `<path d="M165 266.9A91.5 91.5 0 0 1 165 413.1" ${L}/><path d="M885 266.9A91.5 91.5 0 0 0 885 413.1" ${L}/>`;
  s += `<path d="M0 10A10 10 0 0 0 10 0M1040 0A10 10 0 0 0 1050 10M1050 670A10 10 0 0 0 1040 680M10 680A10 10 0 0 0 0 670" ${L}/>`;
  s += `<rect x="-22" y="303.4" width="22" height="73.2" fill="#E9EEE8" opacity=".35" stroke="${W}" stroke-width="4"/><rect x="1050" y="303.4" width="22" height="73.2" fill="#E9EEE8" opacity=".35" stroke="${W}" stroke-width="4"/>`;
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const c = (z,cx,cy,rr) => `<circle class="hz" data-zone="${z}" cx="${cx}" cy="${cy}" r="${rr}"/>`;
  s += r("touchline",-40,-40,1130,48) + r("touchline",-40,672,1130,48)
     + r("goalline",-40,8,48,664) + r("goalline",1042,8,48,664)
     + r("penaltyarea",8,138.5,157,403) + r("penaltyarea",885,138.5,157,403)
     + `<path class="hz" data-zone="arc" d="M165 266.9A91.5 91.5 0 0 1 165 413.1Z"/><path class="hz" data-zone="arc" d="M885 266.9A91.5 91.5 0 0 0 885 413.1Z"/>`
     + r("goalarea",8,248.4,47,183.2) + r("goalarea",995,248.4,47,183.2)
     + c("spot",110,340,16) + c("spot",940,340,16)
     + c("circle",525,340,91.5) + r("halfway",517,8,16,664)
     + c("corner",0,0,26) + c("corner",1050,0,26) + c("corner",1050,680,26) + c("corner",0,680,26)
     + r("goal",-34,300,34,80) + r("goal",1050,300,34,80);
  return s + `</svg>`;
}
const ZONES = {
  goal:{title:"Goal", text:"7.32 m (8 yards) wide and 2.44 m (8 feet) high. A goal counts only when the whole ball crosses the line between the posts and under the crossbar. Most goals wins."},
  goalline:{title:"Goal line", text:"The short boundary at each end. If the whole ball crosses it outside the goal, play restarts with a goal kick when an attacker touched it last, or a corner kick when a defender did."},
  touchline:{title:"Touchline", text:"The long boundary on each side. When the whole ball goes over it, the team that didn't touch it last takes a throw-in. A ball on the line is still in play."},
  penaltyarea:{title:"Penalty area", text:"The big box. Inside their own penalty area, the goalkeeper may use their hands. If a defender commits a foul here that would normally give a direct free kick, the attackers get a penalty kick instead."},
  goalarea:{title:"Goal area", text:"The small box, often called the six-yard box. Goal kicks can be taken from anywhere inside it."},
  spot:{title:"Penalty mark", text:"11 m (12 yards) from the goal line. Penalty kicks are taken from this spot, with only the goalkeeper to beat."},
  arc:{title:"Penalty arc", text:"During a penalty kick, everyone except the kicker and the goalkeeper must stay outside the penalty area and this arc, so they're at least 9.15 m (10 yards) from the ball."},
  circle:{title:"Center circle", text:"Kickoffs are taken from the center spot. The other team must stay outside this circle, 9.15 m (10 yards) away, until the ball is kicked."},
  halfway:{title:"Halfway line", text:"Splits the pitch into two halves. Each team starts a kickoff in its own half, and a player can't be offside while in their own half."},
  corner:{title:"Corner arc", text:"Corner kicks are placed inside this small quarter circle. A goal can be scored straight from a corner kick."}
};
const ZONE_ORDER = ["goal","goalline","touchline","penaltyarea","goalarea","spot","arc","circle","halfway","corner"];

/* Offside lab: attacking half only, attack goes left to right. Units: meters from the halfway line x 10. */
const PASSER = 10, GK = 50;
function offsideSVG(){
  const L = `fill="none" stroke="${W}" stroke-width="4"`;
  const player = (id, color, label) => `<g class="mv" id="${id}"><circle r="15" fill="${color}" stroke="#0A110D" stroke-width="3"/><text y="5" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="16" fill="#fff">${label}</text></g>`;
  return `<svg viewBox="-110 105 680 470" role="img" aria-label="Offside diagram: attacking half of the pitch">
    <rect x="-110" y="105" width="680" height="470" fill="#1C4D2C"/>
    <rect x="-110" y="105" width="635" height="470" fill="#2A6B3F"/>
    <rect x="-110" y="105" width="110" height="470" fill="#245E37"/>
    <text x="-55" y="560" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="20" fill="${W}" opacity=".7">Own half</text>
    <line x1="0" y1="105" x2="0" y2="575" stroke="${W}" stroke-width="4"/>
    <path d="M0 248.5A91.5 91.5 0 0 1 0 431.5" ${L}/>
    <rect x="360" y="138.5" width="165" height="403" ${L}/><rect x="470" y="248.4" width="55" height="183.2" ${L}/>
    <circle cx="415" cy="340" r="5" fill="${W}"/><path d="M360 266.9A91.5 91.5 0 0 0 360 413.1" ${L}/>
    <line x1="525" y1="105" x2="525" y2="575" stroke="${W}" stroke-width="4"/>
    <rect x="525" y="303.4" width="22" height="73.2" fill="#E9EEE8" opacity=".35" stroke="${W}" stroke-width="4"/>
    <g class="mv" id="osZone"><rect id="osZoneRect" x="0" y="105" width="225" height="470" fill="#C8482F" opacity=".2"/>
      <line x1="0" y1="112" x2="0" y2="575" stroke="#F2C230" stroke-width="4" stroke-dasharray="12 8"/>
      <text x="8" y="132" font-family="Barlow Condensed,sans-serif" font-weight="600" font-size="20" fill="#F2C230">Offside line</text></g>
    ${player("osD1","#C8482F","D")}${player("osD2","#C8482F","D")}${player("osD3","#C8482F","D")}${player("osGK","#7A4FB5","GK")}
    ${player("osP","#2F6FD6","A")}
    <g class="mv" id="osR"><circle r="22" fill="none" stroke="#F2C230" stroke-width="4"/><circle r="15" fill="#2F6FD6" stroke="#0A110D" stroke-width="3"/><text y="5" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="16" fill="#fff">A</text></g>
    <line id="osPass" x1="0" y1="0" x2="0" y2="0" stroke="${W}" stroke-width="3" stroke-dasharray="8 7" opacity=".8"/>
    <g class="mv slow" id="osBall"><circle r="8" fill="#fff" stroke="#0A110D" stroke-width="2.5"/></g>
  </svg>`;
}
function offsideLab(){
  const $ = id => document.getElementById(id);
  const S = {r:34, line:30};
  const put = (id,x,y) => { $(id).style.transform = `translate(${x*10}px, ${y}px)`; };
  function verdict(){
    const {r, line} = S;
    if(r <= 0) return [false, "Onside. A player in their own half can't be offside."];
    if(r <= PASSER) return [false, "Onside. The receiver is behind the ball when it's passed."];
    if(Math.abs(r - line) <= .25) return [false, "Onside. Level with the second-to-last defender counts as onside."];
    if(r < line) return [false, "Onside. At least two opponents (the goalkeeper and a defender) are between the receiver and the goal line."];
    return [true, "Offside! When the pass was played, only the goalkeeper was between the receiver and the goal line. The defense gets an indirect free kick."];
  }
  function draw(){
    put("osD1", S.line, 225); put("osD2", S.line-2, 335); put("osD3", S.line-4, 445); put("osGK", GK, 340);
    put("osP", PASSER, 470); put("osR", S.r, 250);
    $("osZone").style.transform = `translateX(${S.line*10}px)`; $("osZoneRect").setAttribute("width", (52.5 - S.line)*10);
    const pl = $("osPass"); pl.setAttribute("x1", PASSER*10+10); pl.setAttribute("y1", 462); pl.setAttribute("x2", S.r*10); pl.setAttribute("y2", 250);
    const [off, msg] = verdict();
    $("osVerdict").textContent = off ? "Offside" : "Onside";
    $("osVerdict").className = off ? "verdict off" : "verdict on";
    $("osMsg").textContent = msg;
    $("osFlag").classList.toggle("up", off);
    $("osRval").textContent = S.r <= 0 ? "In own half" : `${Math.round(S.r)} m past halfway`;
    $("osLval").textContent = `${Math.round(S.line)} m past halfway`;
  }
  const resetBall = () => put("osBall", PASSER+1.6, 478);
  resetBall();
  $("osRange").addEventListener("input", e => { S.r = +e.target.value; draw(); });
  $("osLine").addEventListener("input", e => { S.line = +e.target.value; draw(); });
  document.querySelectorAll("[data-os]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.os;
    S.r = k==="level" ? S.line : k==="behind" ? 7 : k==="own" ? -5 : Math.min(S.line + 7, 48);
    $("osRange").value = S.r; draw();
  }));
  $("osPlay").addEventListener("click", () => { put("osBall", S.r, 250); setTimeout(resetBall, 1500); });
  draw();
}

/* Small pitch for restart cards. */
function miniPitch(body, vb="92 -8 116 146"){
  const L = `fill="none" stroke="${W}" stroke-width="1.6"`;
  return `<svg viewBox="${vb}" aria-hidden="true"><rect x="-8" y="-8" width="216" height="146" fill="#1C4D2C"/><rect width="200" height="130" fill="#2A6B3F"/>
    <rect width="200" height="130" ${L}/><line x1="100" y1="0" x2="100" y2="130" stroke="${W}" stroke-width="1.6"/><circle cx="100" cy="65" r="17" ${L}/>
    <rect x="168" y="27" width="32" height="76" ${L}/><rect x="190" y="47" width="10" height="36" ${L}/><rect x="0" y="27" width="32" height="76" ${L}/><rect x="0" y="47" width="10" height="36" ${L}/>
    <rect x="200" y="58" width="5" height="14" fill="#E9EEE8" opacity=".6"/>${body}</svg>`;
}
const dot = (x,y,c) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${c}" stroke="#0A110D" stroke-width="1.2"/>`;
const sball = (x,y) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#fff" stroke="#0A110D" stroke-width="1.2"/>`;
const path = d => `<path d="${d}" fill="none" stroke="#F2C230" stroke-width="2" stroke-dasharray="5 4"/>`;
const RESTARTS = [
  {name:"Kickoff", text:"Starts each half and restarts play after a goal. Taken from the center spot. The ball can go in any direction, and a goal can be scored straight from it.", art: miniPitch(dot(92,58,"#2F6FD6") + sball(100,65) + dot(122,40,"#C8482F") + dot(122,90,"#C8482F") + path("M100 65L80 72"), "42 -8 116 146")},
  {name:"Throw-in", text:"The ball went fully over a touchline. Thrown with both hands from behind and over the head, with both feet on or behind the line. No goal can come straight from it.", art: miniPitch(dot(130,-3,"#2F6FD6") + sball(130,3) + path("M130 3Q140 20 150 38") + dot(152,42,"#2F6FD6"))},
  {name:"Goal kick", text:"An attacker touched the ball last before it crossed the goal line. Taken from anywhere in the goal area by the defending team.", art: miniPitch(dot(196,64,"#7A4FB5") + sball(192,56) + path("M192 56Q150 30 118 40"))},
  {name:"Corner kick", text:"A defender touched the ball last before it crossed their own goal line. Kicked from the corner arc, and it can go straight in.", art: miniPitch(sball(199,128) + path("M199 128Q196 80 182 66") + dot(182,62,"#2F6FD6") + dot(188,72,"#C8482F"))},
  {name:"Free kick", text:"Awarded for fouls. Opponents must stand at least 9.15 m (10 yards) away, which is why defenders form a wall.", art: miniPitch(sball(140,72) + dot(157,62,"#C8482F") + dot(158,68,"#C8482F") + dot(159,74,"#C8482F") + path("M140 72Q170 52 200 62"))},
  {name:"Penalty kick", text:"A direct-free-kick foul by a defender inside their own penalty area. One shot from 11 m (12 yards), with only the goalkeeper to beat.", art: miniPitch(sball(179,65) + dot(173,65,"#2F6FD6") + dot(199,65,"#7A4FB5") + path("M179 65L200 60"))}
];

const card = color => `<path d="M56 38l8-26"/><rect x="58" y="-2" width="15" height="20" rx="2" fill="${color}" stroke="currentColor" stroke-width="2.5"/><path d="M44 38l-6 30"/>`;
const CALLS = [
  {name:"Yellow card", what:"A caution, or booking. For things like unsporting behavior, persistent fouling, arguing with the referee, delaying a restart, or a reckless challenge.", cost:"Two yellows in one match add up to a red.", arms: card("#F2C230")},
  {name:"Red card", what:"For serious foul play, violent conduct, spitting, offensive language, or a foul or handball that denies an obvious goal-scoring chance.", cost:"The player is sent off, and the team plays one short for the rest of the match.", arms: card("#D9342B")},
  {name:"Direct free kick", what:"For fouls like kicking, tripping, pushing, or holding an opponent, a careless or reckless challenge, or a handball offense.", cost:"A shot can go straight into the goal.", arms:'<path d="M56 38l34-6"/><path d="M44 38l-6 30"/>'},
  {name:"Indirect free kick", what:"For offside, dangerous play without contact, blocking an opponent's path, or a goalkeeper handling a back pass kicked by a teammate.", cost:"Another player must touch the ball before a goal can count. The referee keeps an arm raised.", arms:'<path d="M56 38l8-38"/><path d="M44 38l-6 30"/>'},
  {name:"Penalty kick", what:"A direct-free-kick foul committed by a defender inside their own penalty area.", cost:"The referee points to the penalty mark.", arms:'<path d="M56 38l28 34"/><path d="M44 38l-6 30"/><circle cx="90" cy="110" r="4" fill="currentColor"/>'},
  {name:"Advantage", what:"The referee sees a foul but lets play go on, because stopping would hurt the team that was fouled.", cost:"A card can still be shown at the next stoppage.", arms:'<path d="M44 38l-24 14"/><path d="M56 38l24 14"/><path d="M12 64q38 16 76 0" stroke-width="2.5" stroke-dasharray="4 4"/>'}
];

const CLOCK = [
  {k:"h1", cls:"q", t:"1st half", s:"45 min", mark:true, info:["1st half","The clock counts up from 0 and never stops. When 45 minutes are up, the referee adds time lost to injuries, substitutions, goal celebrations, and other delays."]},
  {k:"half", cls:"half", t:"Half", s:"15 min", info:["Halftime","A break of up to 15 minutes. Teams switch ends for the second half, and the team that didn't take the first kickoff takes this one."]},
  {k:"h2", cls:"q", t:"2nd half", s:"45 min", mark:true, info:["2nd half","Counts from 45 to 90, then more added time. Near the end, an official holds up a board showing the minimum number of minutes added."]},
  {k:"et", cls:"ot", t:"Extra", s:"2 x 15", info:["Extra time","Only in knockout matches that need a winner. If the score is level after 90 minutes, two 15-minute halves are played. In league matches, a tie simply stands."]},
  {k:"pk", cls:"ot", t:"Pens", s:"Shootout", info:["Penalty shootout","If it's still level after extra time, each team takes five penalty kicks in turn. Still tied? It goes to sudden death: one kick each until one team scores and the other misses."]}
];

const TRICKY = [
  ["Is every handball a foul?","No. It's an offense when a player deliberately handles the ball or makes their body unnaturally bigger with an arm. A goal scored straight off the scorer's own hand or arm is ruled out, even if it was an accident."],
  ["Why wasn't that offside on a throw-in?","You can't be offside directly from a throw-in, a goal kick, or a corner kick. Attackers often use those moments to stand behind the defense."],
  ["Is it offside just to stand there?","Being in an offside position isn't an offense by itself. It's only called when the player gets involved: playing the ball, blocking an opponent, or interfering with the goalkeeper's view."],
  ["Can you score straight from a throw-in?","No. If a throw goes straight into the opponent's goal, it's a goal kick. If it goes straight into the thrower's own goal, the other team gets a corner."],
  ["What does VAR check?","The Video Assistant Referee reviews four kinds of decisions: goals, penalties, direct red cards, and mistaken identity when the wrong player is carded. It steps in only for clear and obvious errors or serious missed incidents."],
  ["How do points work in a league?","Usually 3 points for a win, 1 point each for a draw, and none for a loss. The team with the most points at the end of the season wins the league."]
];
const WORDS = [
  ["Set piece","Any planned play from a restart: corners, free kicks, throw-ins, and penalties."],
  ["Wall","A line of defenders standing 9.15 m (10 yards) from a free kick to block the shot."],
  ["Added time","Minutes tacked onto each half for time lost to stoppages. Also called stoppage time or injury time."],
  ["Booking","Getting a yellow card. The referee writes the player's name down, so they're 'in the book.'"],
  ["Clean sheet","A match where a team or goalkeeper doesn't give up a goal."],
  ["Hat trick","Three goals by one player in a single match."],
  ["Through ball","A pass into the space behind the defense for a teammate to run onto."],
  ["Equalizer","A goal that ties the score."],
  ["Own goal","When a player accidentally puts the ball into their own net. It counts for the other team."],
  ["Header","Playing the ball with the head, common on crosses and corners."]
];

const offsideMini = () => `<svg viewBox="0 0 320 190" style="width:100%;max-width:340px;border-radius:8px" aria-hidden="true">
  <rect width="320" height="190" fill="#2A6B3F"/><line x1="300" y1="0" x2="300" y2="190" stroke="${W}" stroke-width="2"/>
  <rect x="246" y="30" width="54" height="130" fill="none" stroke="${W}" stroke-width="2"/>
  <line x1="214" y1="6" x2="214" y2="186" stroke="#F2C230" stroke-width="2" stroke-dasharray="7 5"/>
  ${[[214,60,"#C8482F"],[200,110,"#C8482F"],[192,150,"#C8482F"],[290,95,"#7A4FB5"],[110,140,"#2F6FD6"]].map(([x,y,c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="#0A110D" stroke-width="2"/>`).join("")}
  <circle cx="122" cy="146" r="5" fill="#fff" stroke="#0A110D" stroke-width="1.5"/>
  <circle cx="236" cy="70" r="13" fill="none" stroke="#F2C230" stroke-width="3"/><circle cx="236" cy="70" r="9" fill="#2F6FD6" stroke="#0A110D" stroke-width="2"/>
  <path d="M122 146L228 76" stroke="${W}" stroke-width="2" stroke-dasharray="6 5"/></svg>`;
const QUIZ = [
  {q:"How many players does each team have on the field?", o:["9","10","11","12"], a:2, why:"Eleven, including the goalkeeper. A team that gets a red card plays with one fewer."},
  {q:"Who may handle the ball, and where?", o:["Anyone, inside the penalty area","The goalkeeper, inside their own penalty area","The goalkeeper, anywhere on the field","Nobody, ever"], a:1, why:"Only the goalkeeper, and only inside their own penalty area. Outside it, a goalkeeper is treated like any other player."},
  {q:"The pass is played right now. Is the ringed attacker offside?", visual: offsideMini, o:["Yes, offside","No, onside","No, because the ball is ahead of them","No, because they're in the penalty area"], a:0, why:"The attacker is in the opponent's half, ahead of the ball, and past the second-to-last defender (the dashed line), so only the goalkeeper is closer to the goal line. That's offside."},
  {q:"A defender is last to touch the ball before it rolls over their own goal line, outside the goal. What's the restart?", o:["Corner kick","Goal kick","Throw-in","Penalty kick"], a:0, why:"Defenders touched it last, so the attackers get a corner kick. If an attacker had touched it last, it would be a goal kick."},
  {q:"How long is a regular match?", o:["60 minutes in four quarters","80 minutes in two halves","90 minutes on a clock that stops for fouls","90 minutes in two halves, plus added time"], a:3, why:"Two 45-minute halves on a running clock. The referee adds time at the end of each half for stoppages."},
  {q:"A player gets a second yellow card in the same match. What happens?", o:["They're sent off and can't be replaced","Nothing more happens","The other team gets a penalty","They sit out for 10 minutes"], a:0, why:"Two yellows make a red. The player leaves, and the team plays a player short for the rest of the match."},
  {q:"A defender trips an attacker inside the defender's own penalty area. What's awarded?", o:["An indirect free kick","A penalty kick","A corner kick","A goal kick"], a:1, why:"Tripping is a direct-free-kick foul. When a defender commits one inside their own penalty area, it becomes a penalty kick."},
  {q:"Can a player be offside in their own half?", o:["Yes, always","No, never","Only on corner kicks","Only during extra time"], a:1, why:"No. Offside only applies in the opponent's half of the pitch."},
  {q:"A throw-in sails straight into the opponent's goal without anyone touching it. What happens?", o:["The goal counts","A goal kick","The throw is retaken","A penalty kick"], a:1, why:"You can't score directly from a throw-in, so the defending team restarts with a goal kick."},
  {q:"The referee shows this. What does it mean?", visual:() => `<svg viewBox="0 0 120 120" style="width:96px" aria-hidden="true"><rect x="34" y="14" width="52" height="74" rx="6" fill="#F2C230" stroke="currentColor" stroke-width="4" transform="rotate(-8 60 51)"/><path d="M48 116v-22" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`, o:["The player is sent off","A goal is ruled out","A caution","A substitution is coming"], a:2, why:"A yellow card is a caution, also called a booking. A second one in the same match turns into a red card."}
];

function render(app){
  app.innerHTML = sportHero({id:"soccer", name:"Soccer", alt:"The tabby cat in a red number 10 shirt, dribbling a ball",
      lede:"Two teams of eleven try to get the ball into the other team's goal, using any part of the body except the hands and arms. Only the goalkeeper may handle the ball, and only inside their own penalty area. The team with more goals wins.",
      facts:[["11","players per side, including the goalkeeper"],["90","minutes in two halves, plus added time"],["1","point per goal, whatever the distance"],["17","Laws in the official rulebook"]]})
    + jumpNav([["s-pitch","The pitch"],["s-offside","Offside"],["s-calls","Fouls and cards"],["s-restarts","Restarts"],["s-clock","The clock"],["s-tricky","Tricky rules"],["s-words","Words you'll hear"],["s-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("s-pitch","The pitch","Tap any part of the pitch to see what it does.",
        `<div class="fieldbox" id="pitch">${pitchSVG()}</div><div class="fieldrow"><div class="zonechips" id="pitchChips"></div><div class="infopanel" id="pitchInfo" aria-live="polite"></div></div>`)
    + section("s-offside","Offside, made visible","The rule new fans find hardest. Blue attacks to the right. Slide the ringed attacker and the defensive line, then play the pass. What matters is where everyone is at the moment the ball is passed.",
        `<div class="oslab">
          <div class="fieldbox">${offsideSVG()}</div>
          <div class="osside">
            <div class="osverdict"><span id="osVerdict" class="verdict on">Onside</span><span id="osFlag" class="arflag" aria-hidden="true"><svg viewBox="0 0 40 48"><path d="M8 4v42" stroke="currentColor" stroke-width="3"/><path d="M9 5h24v16H9z" fill="#F2C230" stroke="currentColor" stroke-width="2"/><path d="M9 5h12v8H9zM21 13h12v8H21z" fill="#D9342B"/></svg></span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="osMsg"></p></div>
            <label class="slider">Ringed attacker <span id="osRval"></span><input id="osRange" type="range" min="-8" max="50" step="0.5" value="34"></label>
            <label class="slider">Defensive line <span id="osLval"></span><input id="osLine" type="range" min="15" max="45" step="0.5" value="30"></label>
            <div class="controls"><button class="btn primary" id="osPlay" type="button">Play the pass</button></div>
            <div class="zonechips"><button class="chip" type="button" data-os="level">Level with defender</button><button class="chip" type="button" data-os="behind">Behind the ball</button><button class="chip" type="button" data-os="own">In own half</button><button class="chip" type="button" data-os="past">Past the line</button></div>
          </div>
        </div>
        <p class="combo">The second-to-last defender usually sets the line, because the goalkeeper is normally the last one. Head, body, and feet count when judging position; hands and arms don't. And there's no offside straight from a throw-in, goal kick, or corner kick.</p>`)
    + section("s-calls","Fouls and cards","The referee's whistle stops play. These signals tell you what was called.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("s-restarts","Restarts","Every stoppage ends with one of these. Yellow dashes show where the ball goes.",
        `<div class="scoring restarts">${RESTARTS.map(r => `<div class="score">${r.art}<h3>${r.name}</h3><p>${r.text}</p></div>`).join("")}</div>`)
    + section("s-clock","The clock","Tap a part of the match to learn what happens there.",
        `<div class="timeline" id="sTimeline"></div><div class="legend"><i></i> Added time</div><div class="infopanel" id="sClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("s-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="sFlips"></div>`)
    + section("s-words","Words you'll hear","",`<dl class="gloss" id="sGloss"></dl>`)
    + section("s-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="sQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the IFAB Laws of the Game, used by FIFA and most leagues worldwide. Youth and recreational leagues often adjust things like match length and substitutions.</footer></div>`;

  setupZones(document.getElementById("pitch"), document.getElementById("pitchChips"), document.getElementById("pitchInfo"), ZONES, ZONE_ORDER, "penaltyarea");
  offsideLab();
  setupTimeline(document.getElementById("sTimeline"), document.getElementById("sClockInfo"), CLOCK,
    "Unlike most US sports, the clock doesn't stop when the ball goes out. The referee keeps the official time, so a match with halftime usually takes a little under two hours.");
  flipCards(document.getElementById("sFlips"), TRICKY);
  glossary(document.getElementById("sGloss"), WORDS);
  makeQuiz(document.getElementById("sQuiz"), QUIZ, [
    "You'd make a fine assistant referee. Catch a match and try calling offside before the flag goes up.",
    "You know the game. Spend another minute in the offside lab and you'll have the trickiest rule down.",
    "Try the offside lab and the restart cards once more, then take the quiz again.",
    "No worries. Start with the pitch diagram, then the offside lab, and come back for another try."]);
}

SPORT_PAGES["soccer"] = {render};
})();

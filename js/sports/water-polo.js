/* Water polo. Rules follow World Aquatics water polo rules. */
(function(){

const W = "#F4F6F1", INK = "#18221D", WATER = "#3C8DC4", WATER2 = "#4A99CF", BLUE = "#2F6FD6", RED = "#C8482F";
/* Field of play 30 x 20 m at 25 units per meter. Goal lines x=0 and x=750; goals 3 m wide, y 212.5 to 287.5. */
function poolBase(){
  const line = (x, c, dash) => `<line x1="${x}" y1="0" x2="${x}" y2="500" stroke="${c}" stroke-width="3" ${dash ? 'stroke-dasharray="12 10"' : ""}/>`;
  return `<rect x="-60" y="-50" width="870" height="600" fill="#D9DED6"/><rect x="-20" y="0" width="790" height="500" fill="${WATER}"/>
    ${Array.from({length:10},(_,i) => `<rect x="${i*75}" y="0" width="75" height="500" fill="${i%2 ? WATER2 : WATER}" opacity=".5"/>`).join("")}
    <rect x="-20" y="-6" width="790" height="6" fill="#fff"/><rect x="-20" y="500" width="790" height="6" fill="#fff"/>
    ${line(0,"#fff")}${line(750,"#fff")}${line(50,RED,true)}${line(700,RED,true)}${line(125,"#F2C230",true)}${line(625,"#F2C230",true)}${line(150,"#7FD39A",true)}${line(600,"#7FD39A",true)}${line(375,"#fff",true)}
    ${[[50,"2 m","middle"],[121,"5 m","end"],[154,"6 m","start"],[375,"Half","middle"],[596,"6 m","end"],[629,"5 m","start"],[700,"2 m","middle"]].map(([x,t,a]) => `<text x="${x}" y="-14" text-anchor="${a}" font-family="Barlow Condensed,sans-serif" font-weight="600" font-size="16" fill="${INK}">${t}</text>`).join("")}
    <rect x="-16" y="212.5" width="16" height="75" fill="#fff" opacity=".9" stroke="${RED}" stroke-width="3"/><rect x="750" y="212.5" width="16" height="75" fill="#fff" opacity=".9" stroke="${RED}" stroke-width="3"/>
    <rect x="-20" y="440" width="40" height="60" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 5"/><rect x="730" y="440" width="40" height="60" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 5"/>`;
}
function poolSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-60 -50 870 600" role="img" aria-label="Water polo field of play seen from above">${poolBase()}
    ${r("field",160,10,430,430)}${r("half",365,0,20,500)}${r("two",40,0,20,500)}${r("two",690,0,20,500)}${r("five",115,0,20,500)}${r("five",615,0,20,500)}
    ${r("six",142,0,16,500)}${r("six",592,0,16,500)}${r("goal",-20,205,30,90)}${r("goal",740,205,30,90)}${r("reentry",-20,440,44,60)}${r("reentry",726,440,44,60)}
    ${r("deep",-60,-50,870,44)}</svg>`;
}
const ZONES = {
  goal:{title:"Goal", text:"3 m wide and 0.9 m above the water. A goal counts when the whole ball crosses the goal line between the posts and under the crossbar."},
  two:{title:"2-meter line", text:"An attacker may not be inside the opponent's 2 m line unless they have the ball or are behind the line of the ball. Breaking this is offside."},
  five:{title:"5-meter line", text:"Penalty throws are taken from here, one shooter against the goalkeeper. A penalty is given for a foul inside the 6 m area that stops a probable goal."},
  six:{title:"6-meter line", text:"When an attacker is fouled outside this line, they may shoot straight at goal from the free throw. Inside it, they must pass or swim first."},
  half:{title:"Half-distance line", text:"Each period starts with a swim-off here: players line up on their goal lines and sprint for the ball dropped in the middle."},
  reentry:{title:"Re-entry area", text:"A corner near each goal line where excluded players wait out their 20 seconds before swimming back in."},
  deep:{title:"Deep water", text:"The pool is usually at least 2 m deep. Players tread water the whole game with an eggbeater kick and may not touch or push off the bottom."},
  field:{title:"Field of play", text:"Up to 30 m long for men and 25 m for women, and up to 20 m wide. Seven players per side are in the water at a time: six field players and a goalkeeper."}
};
const ZONE_ORDER = ["goal","two","five","six","half","reentry","deep","field"];

/* 2-meter offside lab: half pool, attack to the left. Meters from the goal line, 40 units per meter. */
function offsideSVG(){
  return `<svg viewBox="-30 -20 360 260" role="img" aria-label="Two-meter offside diagram"><rect x="-30" y="-20" width="360" height="260" fill="#D9DED6"/><rect x="-10" y="0" width="340" height="240" fill="${WATER}"/>
    <rect x="0" y="0" width="80" height="240" fill="${RED}" opacity=".12"/>
    <line x1="0" y1="0" x2="0" y2="240" stroke="#fff" stroke-width="3"/><line x1="80" y1="0" x2="80" y2="240" stroke="${RED}" stroke-width="3" stroke-dasharray="10 8"/>
    <text x="80" y="-6" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="600" font-size="14" fill="${INK}">2 m</text>
    <rect x="-10" y="90" width="10" height="60" fill="#fff" stroke="${RED}" stroke-width="2"/>
    <circle cx="16" cy="120" r="12" fill="#F2C230" stroke="${INK}" stroke-width="2"/>
    <g id="woBall"><circle r="12" fill="${BLUE}" stroke="${INK}" stroke-width="2"/><circle cx="14" cy="-10" r="6" fill="#F2C230" stroke="${INK}" stroke-width="1.5"/></g>
    <g id="woMate"><circle r="15" fill="none" stroke="#F2C230" stroke-width="3"/><circle r="12" fill="${BLUE}" stroke="${INK}" stroke-width="2"/></g>
    <line id="woLine" y1="0" y2="240" stroke="#fff" stroke-width="2" stroke-dasharray="4 5" opacity=".7"/></svg>`;
}
function offsideLab(){
  const $ = id => document.getElementById(id);
  function draw(){
    const b = +$("woB").value, a = +$("woA").value;
    $("woBall").setAttribute("transform", `translate(${b*40} 190)`); $("woMate").setAttribute("transform", `translate(${a*40} 60)`);
    $("woLine").setAttribute("x1", b*40); $("woLine").setAttribute("x2", b*40);
    const off = a < 2 && a < b - .05;
    $("woVerdict").textContent = off ? "Offside" : "Onside"; $("woVerdict").className = off ? "verdict off" : "verdict on";
    $("woMsg").textContent = off ? "Offside! The ringed attacker is inside the 2 m line and closer to the goal than the ball. The defense gets a free throw."
      : a >= 2 ? "Onside. The ringed attacker is outside the 2 m line." : "Onside. The attacker is inside 2 m, but level with or behind the ball, so it's allowed.";
  }
  $("woB").addEventListener("input", draw); $("woA").addEventListener("input", draw); draw();
}

/* Exclusion and shot clock lab */
function exclusionLab(){
  const $ = id => document.getElementById(id); let S, timer = null;
  const reset = () => { S = {clock:30, excl:0, live:false}; draw(); $("exMsg").textContent = "Start a possession. The attack has 30 seconds to shoot."; };
  function draw(){
    $("exClock").textContent = Math.ceil(S.clock); $("exClock").classList.toggle("low", S.clock <= 5);
    const def = S.excl > 0 ? 5 : 6;
    $("exMen").textContent = `6 on ${def}`; $("exExcl").textContent = S.excl > 0 ? `${Math.ceil(S.excl)} s` : "None";
  }
  function stop(){ clearInterval(timer); timer = null; S.live = false; }
  function start(){ if(timer) return; S.live = true; timer = setInterval(() => {
      S.clock = Math.max(0, S.clock - .1); if(S.excl > 0) S.excl = Math.max(0, S.excl - .1);
      if(S.excl === 0 && $("exExcl").textContent !== "None"){ $("exMsg").textContent = "The excluded defender's 20 seconds are up. They swim back in from the re-entry area: 6 on 6 again."; }
      if(S.clock === 0){ stop(); $("exMsg").textContent = "The shot clock hits zero! The attack didn't shoot in time, so the ball goes to the other team."; }
      draw(); }, 100); }
  $("exGo").addEventListener("click", () => { reset(); start(); $("exMsg").textContent = "Possession starts: 30 seconds on the shot clock."; });
  $("exFoul").addEventListener("click", () => { if(!S.live) return; S.excl = 20; S.clock = Math.max(S.clock, 20); $("exMsg").textContent = "Exclusion foul! The defender holding the attacker goes to the re-entry area for 20 seconds. The attack plays 6 on 5, and the shot clock goes back up to at least 20."; draw(); });
  $("exOrd").addEventListener("click", () => { if(!S.live) return; $("exMsg").textContent = "Ordinary foul: a quick free throw for the attack. Nobody leaves the water, and the shot clock keeps running."; });
  $("exGoal").addEventListener("click", () => { if(!S.live) return; stop(); $("exMsg").textContent = S.excl > 0 ? "Goal on the power play! A goal ends the exclusion early, so the defender returns right away." : "Goal! Play restarts from the center with the other team in possession."; S.excl = 0; draw(); });
  reset();
}

const FOULS = [
  {name:"Ordinary foul", text:"Minor fouls like impeding a player without the ball, pushing off an opponent, or touching the bottom. The other team gets a free throw.", tag:"Free throw"},
  {name:"Exclusion foul", text:"Holding, sinking, or pulling back a player who doesn't have the ball. The fouling player goes to the re-entry area for 20 seconds.", tag:"20 seconds out"},
  {name:"Penalty foul", text:"A foul inside the 6 m area that prevents a probable goal. The other team gets a penalty throw from 5 m.", tag:"5 m penalty"},
  {name:"Three personal fouls", text:"Exclusions and penalty fouls count as personal fouls. A player who gets three must leave the game, though a substitute can replace them.", tag:"Out for the game"},
  {name:"Misconduct", text:"Unsporting behavior or disrespect. The player is excluded for the rest of the game, and a substitute enters after 20 seconds.", tag:"Ejected"},
  {name:"Brutality", text:"Deliberately striking or kicking an opponent. The player is ejected, and the team plays a player short for 4 minutes.", tag:"4 minutes short"}
];
const RULES = [
  {n:"1", name:"One hand", text:"Field players may only touch the ball with one hand at a time. Only the goalkeeper may use two hands, near their own goal."},
  {n:"0", name:"No touching the bottom", text:"Standing on or pushing off the bottom is a foul. Everyone treads water for the whole game."},
  {n:"0", name:"No sinking the ball", text:"Holding the ball underwater when tackled is a foul."},
  {n:"30", name:"Shot clock", text:"A team has 30 seconds of possession to shoot. An exclusion or a corner throw resets it to at least 20."}
];
const CLOCK = [
  {k:"q1", cls:"q", t:"Q1", s:"8 min", info:["1st quarter","Each quarter is 8 minutes of stopped-clock time, so the clock stops whenever play stops. Each quarter starts with a swim-off for the ball."]},
  {k:"b1", cls:"half", t:"Break", s:"2 min", info:["Breaks","Two minutes between quarters, a little longer at half-time."]},
  {k:"q2", cls:"q", t:"Q2-Q3", s:"8 min each", info:["Middle quarters","Teams switch ends at half-time. Coaches use timeouts to set up power-play attacks."]},
  {k:"q4", cls:"q", t:"Q4", s:"8 min", info:["4th quarter","The last quarter. Exclusions late in a close game are often decisive."]},
  {k:"so", cls:"ot", t:"Shootout", s:"If tied", info:["Penalty shootout","When a match must have a winner and it's tied, it goes straight to a shootout: five penalty throws per team, then sudden death."]}
];
const TRICKY = [
  ["How do players stay up the whole game?","With the eggbeater kick, legs circling in opposite directions. It keeps them high in the water while their hands are free."],
  ["What happens underwater?","A lot of grabbing and kicking that referees can't always see. That's why referees watch closely for holding and sinking, and why exclusions are so common."],
  ["Why is the 6 on 5 so important?","An exclusion gives the attack a 20-second power play. Teams practice special set plays to score with the extra player."],
  ["Can the goalkeeper do anything different?","The goalkeeper may touch the ball with both hands and punch it, near their own goal. Many keepers can also launch the ball the length of the pool."],
  ["Why are swimsuits so tight?","To stop opponents from grabbing them. Players are checked before games, and loose suits aren't allowed."],
  ["Is there a corner kick?","A corner throw. If a defender last touched the ball before it crossed their own goal line, the attack restarts from the 2 m mark at the side."]
];
const WORDS = [
  ["Center","The attacker who sets up right in front of the goal, wrestling with the defender."],
  ["Driver","An attacker who swims hard toward goal to get open."],
  ["Swim-off","The sprint for the ball at the start of each quarter."],
  ["Exclusion","Twenty seconds in the re-entry area for a major foul."],
  ["Power play","Attacking 6 on 5 during an exclusion."],
  ["Eggbeater","The treading kick that keeps players high in the water."],
  ["Lob","A high, soft shot over the goalkeeper."],
  ["Skip shot","A shot bounced off the water to fool the goalkeeper."],
  ["Counterattack","A fast swim the other way after winning the ball."],
  ["Re-entry area","Where excluded players wait to return."]
];
const offMini = () => `<svg viewBox="-30 -20 360 260" style="width:240px;border-radius:8px" aria-hidden="true"><rect x="-30" y="-20" width="360" height="260" fill="#D9DED6"/><rect x="-10" y="0" width="340" height="240" fill="${WATER}"/>
  <rect x="0" y="0" width="80" height="240" fill="${RED}" opacity=".12"/><line x1="0" y1="0" x2="0" y2="240" stroke="#fff" stroke-width="3"/><line x1="80" y1="0" x2="80" y2="240" stroke="${RED}" stroke-width="3" stroke-dasharray="10 8"/>
  <rect x="-10" y="90" width="10" height="60" fill="#fff" stroke="${RED}" stroke-width="2"/><circle cx="16" cy="120" r="12" fill="#F2C230" stroke="${INK}" stroke-width="2"/>
  <circle cx="200" cy="190" r="12" fill="${BLUE}" stroke="${INK}" stroke-width="2"/><circle cx="214" cy="180" r="6" fill="#F2C230" stroke="${INK}" stroke-width="1.5"/>
  <circle cx="50" cy="60" r="15" fill="none" stroke="#F2C230" stroke-width="3"/><circle cx="50" cy="60" r="12" fill="${BLUE}" stroke="${INK}" stroke-width="2"/></svg>`;
const QUIZ = [
  {q:"How many players per team are in the water at once?", o:["5","6","7","11"], a:2, why:"Seven: six field players and a goalkeeper."},
  {q:"How long is each quarter?", o:["8 minutes","10 minutes","12 minutes","15 minutes"], a:0, why:"Eight minutes of stopped-clock time."},
  {q:"How long does an exclusion last?", o:["10 seconds","20 seconds","2 minutes","The whole game"], a:1, why:"Twenty seconds, or until a goal or change of possession."},
  {q:"How many hands can a field player use on the ball at once?", o:["Both","None","One","Only the left"], a:2, why:"One. Only the goalkeeper may use two hands."},
  {q:"From where is a penalty throw taken?", o:["The 5 m line","The 2 m line","The 10 m mark","The center"], a:0, why:"From the 5 m line, against the goalkeeper alone."},
  {q:"A player pushes off the bottom of the pool. What's the call?", o:["It's allowed","An ordinary foul","A goal","A timeout"], a:1, why:"Touching the bottom to gain an advantage is an ordinary foul."},
  {q:"How many personal fouls before a player must leave the game?", o:["2","4","3","5"], a:2, why:"Three exclusions or penalty fouls."},
  {q:"Blue attacks to the left. The ringed player is inside 2 m, ahead of the ball. What's the call?", visual: offMini, o:["A goal","Offside: free throw to the defense","A penalty throw","A corner throw"], a:1, why:"An attacker inside 2 m and ahead of the ball is offside."},
  {q:"A knockout match is tied at the end of the fourth quarter. What happens?", o:["A penalty shootout","Two overtime periods","The draw stands","A swim-off"], a:0, why:"It goes straight to a penalty shootout."},
  {q:"How long is the shot clock?", o:["20 seconds","25 seconds","30 seconds","35 seconds"], a:2, why:"Thirty seconds, reset to at least 20 after an exclusion or corner throw."}
];

function render(app){
  app.innerHTML = sportHero({id:"water-polo", name:"Water polo", alt:"The tabby cat in a water polo cap, holding a ball up out of the water",
      lede:"Two teams of seven swim, pass, and shoot a ball into the other team's goal, in water too deep to stand in. Field players handle the ball with one hand and tread water the whole game. Major fouls send a player out for 20 seconds, giving the other team a power play.",
      facts:[["7","players per side in the water"],["32","minutes: four quarters of 8"],["20","seconds out for an exclusion"],["30","seconds on the shot clock"]]})
    + jumpNav([["wp-pool","The pool"],["wp-rules","Basic rules"],["wp-ex","Exclusions"],["wp-off","2 m offside"],["wp-fouls","Fouls"],["wp-clock","The clock"],["wp-tricky","Tricky rules"],["wp-words","Words you'll hear"],["wp-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("wp-pool","The pool","Tap any part of the field of play to see what it does.",
        `<div class="fieldbox" id="wpPool">${poolSVG()}</div><div class="fieldrow"><div class="zonechips" id="wpChips"></div><div class="infopanel" id="wpInfo" aria-live="polite"></div></div>`)
    + section("wp-rules","Basic rules","Four rules every fan should know.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">${RULES.map(d => `<div class="score"><div class="pts">${d.n}</div><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("wp-ex","Exclusions and the shot clock","Start a possession, then call fouls and watch the shot clock and the numbers in the water.",
        `<div class="shotclock"><div class="scface"><small>Shot clock</small><b id="exClock">30</b></div>
          <div class="osside"><div class="board" style="grid-template-columns:1fr 1fr"><div><small>In the water</small><b id="exMen" style="font-size:1.8rem">6 on 6</b></div><div><small>Exclusion</small><b id="exExcl" style="font-size:1.8rem">None</b></div></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="exMsg"></p></div>
            <div class="controls"><button class="btn primary" id="exGo" type="button">Start possession</button><button class="btn" id="exFoul" type="button">Exclusion foul</button><button class="btn" id="exOrd" type="button">Ordinary foul</button><button class="btn" id="exGoal" type="button">Score a goal</button></div></div></div>`)
    + section("wp-off","Two-meter offside","Blue attacks the goal on the left. Move the ball and the ringed attacker. The white dashed line marks the ball's position.",
        `<div class="oslab"><div class="fieldbox">${offsideSVG()}</div>
          <div class="osside"><div class="osverdict"><span id="woVerdict" class="verdict on">Onside</span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="woMsg"></p></div>
            <label class="slider">Ball carrier's distance from goal<input id="woB" type="range" min="1" max="7.5" step="0.1" value="5"></label>
            <label class="slider">Ringed attacker's distance from goal<input id="woA" type="range" min="0.5" max="7.5" step="0.1" value="3"></label></div></div>`)
    + section("wp-fouls","Fouls","Water polo fouls come in levels, from a quick free throw to an ejection.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">${FOULS.map(f => `<div class="score"><div class="pts" style="font-size:1.5rem">${f.tag}</div><h3>${f.name}</h3><p>${f.text}</p></div>`).join("")}</div>`)
    + section("wp-clock","The clock","Tap a part of the game to learn what happens there.",
        `<div class="timeline" id="wpTimeline"></div><div class="infopanel" id="wpClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("wp-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="wpFlips"></div>`)
    + section("wp-words","Words you'll hear","",`<dl class="gloss" id="wpGloss"></dl>`)
    + section("wp-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="wpQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow World Aquatics water polo rules, used at the Olympics. Rule details change often in water polo, and US college and high school games use some different rules.</footer></div>`;

  setupZones(document.getElementById("wpPool"), document.getElementById("wpChips"), document.getElementById("wpInfo"), ZONES, ZONE_ORDER, "two");
  exclusionLab(); offsideLab();
  setupTimeline(document.getElementById("wpTimeline"), document.getElementById("wpClockInfo"), CLOCK,
    "Because the clock stops so often, a 32-minute game takes about an hour and a quarter.");
  flipCards(document.getElementById("wpFlips"), TRICKY);
  glossary(document.getElementById("wpGloss"), WORDS);
  makeQuiz(document.getElementById("wpQuiz"), QUIZ, [
    "Splash! Watch a game and count the power plays.",
    "A strong game. Try the exclusion lab again and the 6 on 5 will make sense instantly.",
    "Look over the fouls and the offside lab again, then come back for another try.",
    "No worries. Start with the pool diagram and the basic rules, then try again."]);
}

SPORT_PAGES["water-polo"] = {render};
})();

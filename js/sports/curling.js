/* Curling. Rules follow World Curling, used at the World Championships and the Olympics. */
(function(){

const ICE = "#EEF4F8", INK = "#18221D", BLUER = "#2F6FD6", REDR = "#D9342B", RED = "#D9342B", YEL = "#F2C230";
/* Playing end of the sheet, 20 units per foot. Tee line x=300, center line y=150, stones travel right to left. */
function rings(cx, cy){
  return `<circle cx="${cx}" cy="${cy}" r="120" fill="${BLUER}"/><circle cx="${cx}" cy="${cy}" r="80" fill="${ICE}"/><circle cx="${cx}" cy="${cy}" r="40" fill="${REDR}"/><circle cx="${cx}" cy="${cy}" r="10" fill="${ICE}"/>`;
}
function sheetSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="0 -30 960 360" role="img" aria-label="The playing end of a curling sheet">
    <rect x="0" y="-30" width="960" height="360" fill="#1C4D2C"/><rect x="0" y="0" width="960" height="300" fill="${ICE}"/>
    ${rings(300,150)}
    <line x1="0" y1="150" x2="960" y2="150" stroke="${INK}" stroke-width="2"/><line x1="300" y1="0" x2="300" y2="300" stroke="${INK}" stroke-width="2"/>
    <line x1="180" y1="0" x2="180" y2="300" stroke="${INK}" stroke-width="2"/><line x1="720" y1="0" x2="720" y2="300" stroke="${REDR}" stroke-width="8"/>
    <rect x="52" y="136" width="16" height="28" rx="3" fill="#2B3831"/>
    <rect x="0" y="0" width="960" height="300" fill="none" stroke="#5E6B64" stroke-width="6"/>
    <text x="930" y="-10" text-anchor="end" font-family="Barlow,sans-serif" font-size="13" fill="#EEF3EC">To the other end: about 93 ft (28 m) between hog lines</text><path d="M936 -14l10 4-10 4z" fill="#EEF3EC"/>
    ${r("ice",0,0,960,300)}<path class="hz" data-zone="fgz" d="M720 0H306V30A120 120 0 0 1 306 270V300H720Z"/>
    <circle class="hz" data-zone="house" cx="300" cy="150" r="120"/><circle class="hz" data-zone="button" cx="300" cy="150" r="14"/>
    ${r("tee",294,0,12,300)}${r("back",172,0,16,300)}${r("hog",710,0,20,300)}${r("center",320,143,390,14)}${r("hack",44,128,32,44)}${r("sides",0,-30,960,30)}</svg>`;
}
const ZONES = {
  house:{title:"The house", text:"The target: four rings 12 feet across in total. Only stones in the house, or touching its outer edge, can score."},
  button:{title:"The button", text:"The center of the house. The stone closest to the button decides which team scores in an end."},
  tee:{title:"Tee line", text:"The line across the middle of the house. Once a stone passes it, an opponent may also sweep it, and only one player per team may sweep there."},
  back:{title:"Back line", text:"The line behind the house. A stone that completely crosses it is out of play and removed."},
  hog:{title:"Hog lines", text:"Thick lines near each end. A delivered stone must be released before the near hog line and must fully cross the far hog line, or it's removed. Sensors in the stone's handle often check the release."},
  center:{title:"Center line", text:"Runs the length of the sheet, through the middle of the house. Skips use it to mark exactly where they want the stone to go."},
  fgz:{title:"Free guard zone", text:"The area between the hog line and the tee line, outside the house. Under the five-rock rule, opponents can't knock stones in this zone out of play until the sixth stone of the end."},
  hack:{title:"Hack", text:"The rubber foothold that players push off from when delivering a stone from the other end. On this end, it sits behind the house."},
  sides:{title:"Sidelines", text:"A stone that touches the side boards or crosses a sideline is out of play."},
  ice:{title:"Pebbled ice", text:"Curling ice is sprayed with fine water droplets called pebble. Stones ride on the pebble, which lets them curl, the gentle sideways drift that gives the sport its name."}
};
const ZONE_ORDER = ["house","button","tee","back","hog","center","fgz","hack","sides","ice"];

/* Score-the-end trainer. House in feet x 20, centered at (0,0). Stone radius about 0.48 ft. */
const SR = 10, HR = 120;
const stone = (x,y,c,label="") => `<g><circle cx="${x}" cy="${y}" r="${SR + 2}" fill="#5E6B64"/><circle cx="${x}" cy="${y}" r="${SR}" fill="${c}" stroke="${INK}" stroke-width="1.5"/><rect x="${x - 5}" y="${y - 2}" width="10" height="4" rx="2" fill="#2B3831"/>${label}</g>`;
function genEnd(){
  for(let tries=0; tries<200; tries++){
    const st = [], n = [2 + Math.floor(Math.random()*4), 2 + Math.floor(Math.random()*4)];
    let ok = true;
    for(const [team,count] of [[0,n[0]],[1,n[1]]]) for(let i=0;i<count;i++){
      let placed = false;
      for(let t=0;t<60 && !placed;t++){ const a = Math.random()*Math.PI*2, d = Math.sqrt(Math.random())*165, x = Math.cos(a)*d, y = Math.sin(a)*d*0.9 + 10;
        if(st.every(s => Math.hypot(s.x - x, s.y - y) > 2*SR + 4)){ st.push({x, y, team, d: Math.hypot(x,y)}); placed = true; } }
      if(!placed) ok = false;
    }
    if(ok) return st;
  }
  return [];
}
function scoreOf(st){
  const inHouse = s => s.d - SR <= HR;
  const sorted = st.slice().sort((a,b) => a.d - b.d);
  if(!sorted.length || !inHouse(sorted[0])) return {team:-1, n:0};
  const team = sorted[0].team, oppBest = sorted.find(s => s.team !== team);
  const n = sorted.filter(s => s.team === team && inHouse(s) && (!oppBest || s.d < oppBest.d)).length;
  return {team, n, oppBest};
}
function houseSVG(st, reveal){
  const sc = scoreOf(st);
  let marks = "";
  if(reveal){
    if(sc.oppBest) marks += `<circle cx="0" cy="0" r="${sc.oppBest.d}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 5"/>`;
    const counted = st.filter(s => s.team === sc.team && s.d - SR <= HR && (!sc.oppBest || s.d < sc.oppBest.d)).sort((a,b) => a.d - b.d);
    counted.forEach((s,i) => marks += `<circle cx="${s.x}" cy="${s.y}" r="${SR + 6}" fill="none" stroke="#7FD39A" stroke-width="3"/><text x="${s.x + 15}" y="${s.y - 12}" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="18" fill="#fff" stroke="#18221D" stroke-width="3" paint-order="stroke">${i+1}</text>`);
  }
  return `<svg viewBox="-190 -190 380 380" role="img" aria-label="The house with stones" style="max-width:420px;width:100%">
    <rect x="-190" y="-190" width="380" height="380" fill="${ICE}"/>${rings(0,0)}
    <line x1="-190" y1="0" x2="190" y2="0" stroke="${INK}" stroke-width="1.5"/><line x1="0" y1="-190" x2="0" y2="190" stroke="${INK}" stroke-width="1.5"/>
    <line x1="-190" y1="-120" x2="190" y2="-120" stroke="${INK}" stroke-width="1.5"/>
    ${st.map(s => stone(s.x, s.y, s.team ? YEL : RED)).join("")}${marks}</svg>`;
}
function endTrainer(){
  const $ = id => document.getElementById(id); let st, answered;
  const fresh = () => { st = genEnd(); answered = false; $("seHouse").innerHTML = houseSVG(st, false); $("seMsg").textContent = "All 16 stones have been thrown. Who scores, and how many?"; document.querySelectorAll("[data-se]").forEach(b => b.disabled = false); };
  function answer(v){
    if(answered) return; answered = true;
    const sc = scoreOf(st), right = sc.team === -1 ? "blank" : `${sc.team}-${Math.min(sc.n,4)}`;
    $("seHouse").innerHTML = houseSVG(st, true);
    const name = sc.team === 0 ? "Red" : "Yellow";
    $("seMsg").textContent = (v === right ? "Correct! " : "Not quite. ") + (sc.team === -1 ? "No stone is touching the house, so it's a blank end: nobody scores." :
      `${name} has the stone closest to the button, so only ${name} can score. ${sc.oppBest ? `Every ${name.toLowerCase()} stone inside the dashed circle, which runs through the other team's best stone, counts` : `The other team has nothing in play, so every ${name.toLowerCase()} stone in the house counts`}: ${sc.n} point${sc.n > 1 ? "s" : ""}.`);
    document.querySelectorAll("[data-se]").forEach(b => b.disabled = true);
  }
  document.querySelectorAll("[data-se]").forEach(b => b.addEventListener("click", () => answer(b.dataset.se)));
  $("seNew").addEventListener("click", fresh);
  fresh();
}

/* Hammer and the linescore */
function gameSim(){
  const $ = id => document.getElementById(id); const N = ["Red","Yellow"];
  let S;
  const reset = () => { S = {ends:[], hammer:1, over:false}; $("gmMsg").textContent = "Yellow won the pre-game draw to the button and starts with the hammer: the last stone of the end."; draw(); };
  function play(){
    if(S.over) return;
    const h = S.hammer, o = 1 - h, k = Math.random(); let pts = [0,0], msg;
    if(k < .33){ const n = Math.random() < .7 ? 2 : 3; pts[h] = n; msg = `${N[h]} uses the hammer to score ${n}. That's exactly what the hammer is for.`; }
    else if(k < .55){ pts[h] = 1; msg = `${N[h]} is held to a single point. Scoring one with the hammer is a small win for ${N[o]}, who gets the hammer back.`; }
    else if(k < .7){ msg = `Blank end: no stones in the house. ${N[h]} chose to clear the house rather than score one, so they keep the hammer.`; }
    else { const n = Math.random() < .8 ? 1 : 2; pts[o] = n; msg = `A steal! ${N[o]}, without the hammer, scores ${n}.`; }
    S.ends.push(pts);
    if(pts[0] || pts[1]) S.hammer = pts[0] ? 1 : 0;
    const tot = [0,1].map(i => S.ends.reduce((s,e) => s + e[i], 0));
    if(pts[0] || pts[1]) msg += ` ${N[S.hammer]} gets the hammer next end.`;
    const e = S.ends.length;
    if(e >= 10 && tot[0] !== tot[1]){ S.over = true; msg += ` Final: ${N[tot[0] > tot[1] ? 0 : 1]} wins ${Math.max(...tot)}-${Math.min(...tot)}.`; }
    else if(e >= 10) msg += " Tied after 10 ends: an extra end decides it.";
    $("gmMsg").textContent = msg; draw();
  }
  function draw(){
    const n = Math.max(10, S.ends.length);
    const tot = [0,1].map(i => S.ends.reduce((s,e) => s + e[i], 0));
    $("gmBoard").innerHTML = `<table class="bxcard"><thead><tr><th></th>${Array.from({length:n}, (_,i) => `<th>${i < 10 ? i+1 : "X"}</th>`).join("")}<th>Total</th></tr></thead><tbody>${[0,1].map(t => `<tr><th><i class="srv" style="background:${t ? YEL : RED};${S.hammer === t && !S.over ? "box-shadow:0 0 0 3px #fff" : ""}"></i>${N[t]}${S.hammer === t && !S.over ? " (hammer)" : ""}</th>${Array.from({length:n}, (_,i) => `<td>${S.ends[i] ? S.ends[i][t] : ""}</td>`).join("")}<td class="tot">${tot[t]}</td></tr>`).join("")}</tbody></table>`;
    $("gmPlay").hidden = S.over; $("gmNew").hidden = !S.over;
  }
  $("gmPlay").addEventListener("click", play); $("gmNew").addEventListener("click", reset);
  reset();
}

/* Shot cards: a corner of the house plus the guard area in front. */
const mh = body => `<svg viewBox="-150 -140 300 330" aria-hidden="true"><rect x="-150" y="-140" width="300" height="330" fill="${ICE}"/>${rings(0,0)}<line x1="-150" y1="0" x2="150" y2="0" stroke="${INK}" stroke-width="1.5"/>${body}</svg>`;
const bs = (x,y,c) => `<g><circle cx="${x}" cy="${y}" r="19" fill="#EEF3EC" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="14" fill="${c}" stroke="${INK}" stroke-width="1.5"/><rect x="${x-7}" y="${y-2.5}" width="14" height="5" rx="2.5" fill="#2B3831"/></g>`;
const mv = d => `<path d="${d}" fill="none" stroke="#18221D" stroke-width="3" stroke-dasharray="8 6"/>`;
const SHOTS = [
  {name:"Draw", text:"A stone thrown gently to stop in a chosen spot, often the button. The most common shot in the game.", art: mh(mv("M30 190Q40 80 4 6") + bs(4,4,RED))},
  {name:"Guard", text:"A stone left in front of the house to protect stones behind it or block the path to the button.", art: mh(bs(0,-10,RED) + bs(6,140,RED) + mv("M20 190Q14 160 6 142"))},
  {name:"Takeout", text:"A hard throw that knocks an opponent's stone out of play.", art: mh(mv("M-30 4L-80 -150") + bs(-28,14,YEL) + mv("M-12 190L-22 60") + bs(-22,52,RED))},
  {name:"Hit and roll", text:"A takeout where the thrower's stone rolls after the hit to a better spot, often behind cover.", art: mh(mv("M40 190L24 70") + bs(-10,-18,RED) + mv("M22 58L-6 -6"))},
  {name:"Freeze", text:"A draw that stops right against another stone, making it very hard to remove either one.", art: mh(bs(10,20,YEL) + bs(12,42,RED) + mv("M30 190Q20 110 13 54"))},
  {name:"Sweeping", text:"Brushing the ice in front of a moving stone warms it slightly, so the stone travels farther and curls less.", art: mh(bs(0,90,RED) + `<path d="M-30 70h22M-30 76h22M10 70h22M10 76h22" stroke="#2B3831" stroke-width="5" stroke-linecap="round"/>` + mv("M0 190V104"))}
];
const RULES = [
  {name:"Hog line violation", text:"A stone that isn't released before the near hog line, or doesn't fully cross the far hog line (unless it hits another stone), is removed."},
  {name:"Five-rock rule", text:"The first five stones of an end: if a team knocks an opponent's stone in the free guard zone out of play, the stones are put back and the thrown stone is removed."},
  {name:"Who can sweep", text:"A team may sweep its own stone anywhere up to the tee line. Past the tee line, one player from each team may sweep, so opponents can sweep your stone out the back."},
  {name:"Burned stone", text:"Touching a moving stone with a broom or body is called burning it. The other team chooses how to fix the result."},
  {name:"Out of play", text:"Stones that cross the back line, hit the side boards, or fail to reach the far hog line are taken off the ice right away."},
  {name:"Conceding", text:"A team that can't catch up may concede by shaking hands with the other team. It's a respected part of curling's tradition of sportsmanship."}
];
const CLOCK = [
  {k:"pre", cls:"half", t:"Draw", s:"Hammer", info:["Pre-game draw","Before the game, each team throws stones at the button. The team closer on average chooses who gets the hammer in the first end."]},
  {k:"e1", cls:"q", t:"Ends 1-5", s:"16 stones each", info:["An end","Both teams alternate throwing all 16 stones, 8 each. Each player throws two. Then the end is scored and the next one goes the other direction."]},
  {k:"break", cls:"half", t:"Break", s:"5 min", info:["Mid-game break","A short break after the fifth end."]},
  {k:"e6", cls:"q", t:"Ends 6-10", s:"Finish", info:["Second half","Teams manage the hammer carefully late in the game. Having it in the last end is a big advantage."]},
  {k:"x", cls:"ot", t:"Extra", s:"If tied", info:["Extra end","If the score is tied after 10 ends, extra ends are played until one team is ahead."]}
];
const TRICKY = [
  ["Why do teams blank an end on purpose?","With the hammer, scoring just one point means giving the hammer away. Clearing the house for a blank end keeps the hammer for a chance to score two or more later."],
  ["What's the hammer?","The last stone of the end. It's a big advantage because nobody can respond to it. After a team scores, the other team gets the hammer."],
  ["Why do they yell?","The sweepers can't see where the stone needs to go. The skip, standing at the house, calls out whether to sweep hard, sweep lightly, or stop."],
  ["Who measures close calls?","If it's too close to see, officials use a measuring device that pivots from the center of the button."],
  ["What does each player do?","The lead throws first, then the second, then the vice, and the skip throws last and calls the strategy. While one throws, two teammates sweep."],
  ["What's mixed doubles?","A faster version with one man and one woman per team, 8 ends, 5 stones each, and two stones placed on the ice before each end."]
];
const WORDS = [
  ["End","Like an inning: all 16 stones thrown and then scored."],
  ["Hammer","The last stone of an end."],
  ["Steal","Scoring without the hammer."],
  ["Blank end","An end where no one scores."],
  ["Skip","The team captain, who calls the shots and throws the last two stones."],
  ["Lead, second, vice","The other three positions, in throwing order. The vice (or third) holds the broom for the skip."],
  ["Shot rock","The stone currently closest to the button."],
  ["Curl","The sideways drift of a spinning stone, which gives the sport its name."],
  ["Weight","How hard a stone is thrown."],
  ["Biter","A stone barely touching the outer edge of the house. It still counts."]
];
const QUIZ = [
  {q:"How many stones does each team throw in an end?", o:["4","6","8","16"], a:2, why:"Eight per team, two by each of the four players. Sixteen in total."},
  {q:"How many teams can score in a single end?", o:["Both","Only one","Only the team with the hammer","Neither, ever"], a:1, why:"Only the team with the stone closest to the button scores."},
  {q:"Who scores in this end, and how many?", visual:() => houseSVG([{x:8,y:6,team:0,d:10},{x:-30,y:30,team:0,d:42.4},{x:60,y:-40,team:1,d:72.1},{x:-90,y:-60,team:0,d:108},{x:20,y:110,team:1,d:111.8}].map(s => ({...s, d: Math.hypot(s.x,s.y)})), false).replace('style="max-width:420px;width:100%"','style="width:220px"'), o:["Red scores 1","Red scores 2","Yellow scores 1","It's a blank end"], a:1, why:"Red's two stones closest to the button are both nearer than Yellow's best stone, so Red scores 2."},
  {q:"What is the hammer?", o:["The first stone","A penalty stone","The last stone of the end","The skip's broom"], a:2, why:"The hammer is the last stone of the end, a big advantage."},
  {q:"An end finishes with no stones in the house. What happens?", o:["The hammer switches","The same team keeps the hammer","The end is replayed","A coin toss"], a:1, why:"In a blank end nobody scores, and the hammer stays where it was."},
  {q:"A delivered stone stops before reaching the far hog line, without touching another stone. What happens?", o:["It's removed from play","It stays where it is","It's thrown again","The other team gets a point"], a:0, why:"A stone must fully cross the far hog line to stay in play."},
  {q:"How many ends are in a World Championship or Olympic team game?", o:["6","8","10","12"], a:2, why:"Ten ends. Mixed doubles plays eight."},
  {q:"Where may a team sweep the other team's stone?", o:["Anywhere on the ice","Only behind the tee line","Never","Only in the free guard zone"], a:1, why:"Opponents may sweep a stone only after it passes the tee line."},
  {q:"A stone is barely touching the outer edge of the house. Can it count?", o:["No, it must cover the button","Only for the team with the hammer","Yes, any part touching the house counts","Only in the last end"], a:2, why:"Any part of the stone touching the house is enough. That's called a biter."},
  {q:"What does it mean to steal?", o:["To score without the hammer","To take an opponent's stone","To sweep the opponent's stone","To throw out of turn"], a:0, why:"A steal is scoring when the other team has the hammer."}
];

function render(app){
  app.innerHTML = sportHero({id:"curling", name:"Curling", alt:"The tabby cat sweeping the ice with a broom beside a red curling stone",
      lede:"Two teams of four slide heavy granite stones down a sheet of ice toward a target called the house. Teammates sweep in front of the stone to guide it. After all the stones are thrown, only one team scores: one point for each stone closer to the center than the other team's best.",
      facts:[["4","players per team"],["8","stones per team each end"],["10","ends in a game"],["42","pounds: roughly what a stone weighs"]]})
    + jumpNav([["c-sheet","The sheet"],["c-score","Score the end"],["c-game","The hammer"],["c-shots","The shots"],["c-rules","Key rules"],["c-clock","A game"],["c-tricky","Tricky rules"],["c-words","Words you'll hear"],["c-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("c-sheet","The sheet","This is the target end of the sheet; stones arrive from the right. Tap any part to see what it does.",
        `<div class="fieldbox" id="cSheet">${sheetSVG()}</div><div class="fieldrow"><div class="zonechips" id="cChips"></div><div class="infopanel" id="cInfo" aria-live="polite"></div></div>`)
    + section("c-score","Score the end","All the stones are thrown. Decide who scores and how many, then see the measurement.",
        `<div class="oslab"><div class="fieldbox" id="seHouse" style="display:flex;justify-content:center"></div>
          <div class="osside">
            <div class="controls"><b class="jlab" style="color:${RED}">Red</b>${[1,2,3,4].map(n => `<button class="btn" data-se="0-${n}" type="button">${n}${n === 4 ? "+" : ""}</button>`).join("")}</div>
            <div class="controls"><b class="jlab" style="color:#B8901E">Yellow</b>${[1,2,3,4].map(n => `<button class="btn" data-se="1-${n}" type="button">${n}${n === 4 ? "+" : ""}</button>`).join("")}</div>
            <div class="controls"><button class="btn" data-se="blank" type="button">Blank end</button><button class="btn primary" id="seNew" type="button">New end</button></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="seMsg"></p></div></div></div>`)
    + section("c-game","The hammer","Play a 10-end game one end at a time and watch how the hammer moves.",
        `<div class="sim"><div class="cardwrap" id="gmBoard"></div>
          <div class="controls"><button class="btn primary" id="gmPlay" type="button">Play the next end</button><button class="btn primary" id="gmNew" type="button" hidden>New game</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="gmMsg"></p></div></div></div>`)
    + section("c-shots","The shots","Dashed lines show the stone's path.",
        `<div class="scoring restarts">${SHOTS.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("c-rules","Key rules","Curling has few officials on the ice. Players are expected to call their own fouls.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${RULES.map(d => `<div class="score"><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("c-clock","A game","Tap a part of the game to learn more.",
        `<div class="timeline" id="cTimeline"></div><div class="infopanel" id="cClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("c-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="cFlips"></div>`)
    + section("c-words","Words you'll hear","",`<dl class="gloss" id="cGloss"></dl>`)
    + section("c-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="cQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow World Curling, used at the World Championships and the Olympics. Club games are often shorter, usually 8 ends.</footer></div>`;

  setupZones(document.getElementById("cSheet"), document.getElementById("cChips"), document.getElementById("cInfo"), ZONES, ZONE_ORDER, "house");
  endTrainer(); gameSim();
  setupTimeline(document.getElementById("cTimeline"), document.getElementById("cClockInfo"), CLOCK,
    "Each team has a thinking-time clock that runs only while it's deciding and throwing. A 10-end game takes about two and a half to three hours.");
  flipCards(document.getElementById("cFlips"), TRICKY);
  glossary(document.getElementById("cGloss"), WORDS);
  makeQuiz(document.getElementById("cQuiz"), QUIZ, [
    "Shot rock! Watch an end and try to count the score before the stones are measured.",
    "Nice draw. Score a few more ends in the trainer and counting will be second nature.",
    "Look over the house and the hammer again, then come back for another try.",
    "No worries. Start with the sheet diagram and the score-the-end trainer, then try again."]);
}

SPORT_PAGES["curling"] = {render};
})();

/* Archery (Olympic recurve). Rules follow World Archery. */
(function(){

const INK = "#18221D", RING = ["#fff","#fff","#222","#222","#3C8DC4","#3C8DC4","#D9342B","#D9342B","#F2C230","#F2C230"];
const RW = 24.4; /* ring width in units; target radius 244 = 122 cm across */
function targetRings(){
  let s = ""; for(let i=0;i<10;i++){ const r = (10 - i)*RW; s += `<circle r="${r}" fill="${RING[i]}" stroke="${i === 2 || i === 3 ? "#fff" : INK}" stroke-width="1.2"/>`; }
  return s + `<circle r="${RW/2}" fill="none" stroke="${INK}" stroke-width="1"/><path d="M-4 0h8M0 -4v8" stroke="${INK}" stroke-width="1.2"/>`;
}
function rangeSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="0 0 900 300" role="img" aria-label="Archery field seen from above"><rect width="900" height="300" fill="#2F7546"/>
    <line x1="120" y1="20" x2="120" y2="280" stroke="#fff" stroke-width="4"/><line x1="60" y1="20" x2="60" y2="280" stroke="#fff" stroke-width="2" stroke-dasharray="8 6"/>
    ${[60,130,200,270].map(y => `<rect x="830" y="${y - 22}" width="12" height="44" fill="#F2C230" stroke="${INK}" stroke-width="2"/><circle cx="116" cy="${y}" r="7" fill="#2F6FD6" stroke="${INK}" stroke-width="1.5"/><path d="M123 ${y}H826" stroke="#fff" stroke-width="1" stroke-dasharray="2 10" opacity=".5"/>`).join("")}
    ${[300,500,700].map(x => `<line x1="${x}" y1="10" x2="${x}" y2="30" stroke="#ccc" stroke-width="2"/><path d="M${x} 12l18 4 -18 4z" fill="#F2C230"/>`).join("")}
    <rect x="20" y="120" width="26" height="60" rx="4" fill="#2B3831"/><circle cx="33" cy="135" r="6" fill="#D9342B"/><circle cx="33" cy="150" r="6" fill="#F2C230"/><circle cx="33" cy="165" r="6" fill="#7FD39A"/>
    <text x="470" y="292" text-anchor="middle" font-family="Barlow,sans-serif" font-size="14" fill="#fff">70 meters</text>
    ${r("shoot",110,20,20,260)}${r("wait",50,20,20,260)}${r("targets",820,20,30,260)}${r("wind",280,4,240,32)}${r("lights",16,114,34,72)}${r("field",140,40,660,220)}</svg>`;
}
const ZONES = {
  shoot:{title:"Shooting line", text:"Archers stand astride this line to shoot. Everyone shoots from the same line."},
  wait:{title:"Waiting line", text:"Archers wait behind this line when it isn't their turn, keeping the shooting line clear."},
  targets:{title:"Targets", text:"Olympic recurve targets are 122 cm (4 ft) across, set 70 m away. From the shooting line, the gold center looks about the size of a thumbtack held at arm's length."},
  wind:{title:"Wind flags", text:"Small flags along the range show the wind. Archers watch them and adjust their aim, or wait for a calmer moment."},
  lights:{title:"Timing lights", text:"Red means stop, green means shoot, and yellow warns that time is almost up. Arrows shot after time runs out don't count."},
  field:{title:"The range", text:"A flat field with nothing between the archers and the targets but air and wind."}
};
const ZONE_ORDER = ["shoot","wait","targets","wind","lights","field"];

/* Set-system match: click the target to shoot three arrows per set. */
const scoreAt = (x,y) => { const d = Math.hypot(x,y); if(d > 10*RW) return 0; return Math.min(10, 10 - Math.floor(d/RW)); };
function setMatch(){
  const $ = id => document.getElementById(id); const svg = $("arTarget"); let S;
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5)*2/1.5;
  function reset(){ S = {sp:[0,0], set:1, mine:[], opp:[], over:false, shootoff:false, wind:(Math.random() - .5)*30}; $("arArrows").innerHTML = ""; $("arMsg").textContent = "Set 1. Click the target to aim each arrow. Wind and nerves push arrows off a little."; draw(); }
  function draw(){
    $("arSP").textContent = `${S.sp[0]} - ${S.sp[1]}`; $("arSet").textContent = S.over ? "Final" : S.shootoff ? "Shoot-off" : `Set ${S.set}`;
    $("arMine").textContent = S.mine.length ? S.mine.join(" + ") + ` = ${S.mine.reduce((a,b)=>a+b,0)}` : "-";
    $("arOpp").textContent = S.opp.length ? S.opp.join(" + ") + ` = ${S.opp.reduce((a,b)=>a+b,0)}` : "-";
    $("arWind").textContent = S.wind > 4 ? "Wind pushing right" : S.wind < -4 ? "Wind pushing left" : "Calm"; $("arNew").hidden = !S.over;
  }
  function oppArrow(){ const x = gauss()*30 + S.wind*.6, y = gauss()*30; return {x, y, s: scoreAt(x,y)}; }
  svg.addEventListener("click", e => {
    if(S.over) return;
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse());
    const x = q.x + gauss()*22 + S.wind, y = q.y + gauss()*22, s = scoreAt(x,y);
    $("arArrows").insertAdjacentHTML("beforeend", `<g><circle cx="${x}" cy="${y}" r="5" fill="#2F6FD6" stroke="#fff" stroke-width="2"/></g>`);
    if(S.shootoff){
      const o = oppArrow(), dm = Math.hypot(x,y), dop = Math.hypot(o.x,o.y);
      $("arArrows").insertAdjacentHTML("beforeend", `<circle cx="${o.x}" cy="${o.y}" r="5" fill="#D9342B" stroke="#fff" stroke-width="2"/>`);
      S.over = true; const win = s > o.s || (s === o.s && dm < dop);
      $("arMsg").textContent = `Shoot-off: your ${s} against their ${o.s}. ${s === o.s ? "Same score, so the arrow closest to the center wins. " : ""}${win ? "You win the match!" : "They win the match."}`; return draw();
    }
    S.mine.push(s);
    if(S.mine.length < 3){ $("arMsg").textContent = `${s === 10 ? "A perfect 10!" : `You scored ${s}.`} ${3 - S.mine.length} arrow${S.mine.length === 2 ? "" : "s"} left in this set.`; return draw(); }
    S.opp = [oppArrow(), oppArrow(), oppArrow()].map(o => { $("arArrows").insertAdjacentHTML("beforeend", `<circle cx="${o.x}" cy="${o.y}" r="5" fill="#D9342B" stroke="#fff" stroke-width="2"/>`); return o.s; });
    const a = S.mine.reduce((x,y)=>x+y,0), b = S.opp.reduce((x,y)=>x+y,0);
    let msg; if(a > b){ S.sp[0] += 2; msg = `You win the set ${a}-${b}: 2 set points.`; } else if(b > a){ S.sp[1] += 2; msg = `They win the set ${b}-${a}: 2 set points to them.`; } else { S.sp[0]++; S.sp[1]++; msg = `Tied set at ${a}: 1 set point each.`; }
    if(S.sp[0] >= 6 || S.sp[1] >= 6){ S.over = true; msg += S.sp[0] > S.sp[1] ? " You reach 6 set points and win the match!" : " They reach 6 set points and win the match."; }
    else if(S.set === 5){ S.shootoff = true; msg += " Five sets and it's 5-5: a one-arrow shoot-off decides it. Closest to the center wins."; }
    if(!S.over && !S.shootoff){ S.set++; msg += ` Set ${S.set} next.`; }
    $("arMsg").textContent = msg; S.mine = []; setTimeout(() => { if(!S.over) { $("arArrows").innerHTML = ""; S.opp = []; S.wind = (Math.random() - .5)*30; draw(); } }, 1800); draw();
  });
  $("arNew").addEventListener("click", reset); reset();
}

const COLORS = [["Gold","9 and 10","The center rings. The very center, the X, breaks ties."],["Red","7 and 8","Still a good shot at Olympic level."],["Blue","5 and 6","A miss by elite standards."],["Black","3 and 4","Rare in top competition."],["White","1 and 2","The outer rings."],["Line cutter","Higher score","An arrow touching the line between two rings gets the higher score."]];
const CLOCK = [
  {k:"rank", cls:"q", t:"Ranking", s:"72 arrows", info:["Ranking round","Every archer shoots 72 arrows, adding up the score. The ranking sets the match brackets: 1st meets 64th, and so on."]},
  {k:"elim", cls:"q", t:"Matches", s:"Sets", info:["Elimination matches","Head-to-head matches with the set system: three arrows per set, 2 set points for winning a set, 1 for a tie. First to 6 set points wins."]},
  {k:"so", cls:"ot", t:"Shoot-off", s:"If 5-5", info:["Shoot-off","If a match is tied 5-5 after five sets, each archer shoots one arrow. The higher score wins, and if they're equal, the arrow closest to the center."]},
  {k:"team", cls:"q", t:"Teams", s:"Mixed and team", info:["Team events","Teams of three, and mixed pairs of one man and one woman, shoot alternating arrows within a time limit."]}
];
const TRICKY = [
  ["Why don't scores just add up in matches?","The set system resets every three arrows, so one bad arrow costs at most a set. It keeps matches close and exciting."],
  ["What's the X?","The innermost ring inside the 10. It's worth 10 too, but counting Xs breaks ties in the ranking round."],
  ["How long do archers have per arrow?","In individual matches, about 20 seconds per arrow, alternating with the opponent."],
  ["Why do bows have so many attachments?","Recurve bows carry a sight, stabilizer rods to steady the bow, and a clicker that tells the archer when the draw is exactly the same length every time."],
  ["What's the difference with compound bows?","Compound bows use pulleys and a magnifying sight. They shoot at 50 m with a smaller center and add up total scores instead of sets."],
  ["How are arrows scored?","Judges score by the arrow's position at the target. An arrow touching a line gets the higher value, so judges use magnifiers on close calls."]
];
const WORDS = [["End","A group of arrows shot before scoring them, usually 3 or 6."],["Set","Three arrows in a match, scored for set points."],["X","The innermost ring, used for tiebreaks."],["Recurve","The Olympic bow, with limbs that curve away from the archer."],["Anchor","The spot on the face where the drawing hand settles every time."],["Release","Letting the string go, smoothly, with no flinch."],["Clicker","A small blade that clicks when the arrow is drawn to the right length."],["Shoot-off","A one-arrow tiebreak."]];
const QUIZ = [
  {q:"How far is the target in Olympic recurve archery?", o:["30 m","50 m","70 m","90 m"], a:2, why:"Seventy meters."},
  {q:"How many points is the gold center ring?", o:["5","8","9","10"], a:3, why:"The inner gold is 10; the outer gold, 9."},
  {q:"An arrow touches the line between the 8 and the 9. What does it score?", o:["8","9","8.5","Zero"], a:1, why:"Line cutters get the higher value."},
  {q:"In the set system, what does winning a set earn?", o:["1 set point","2 set points","3 set points","The match"], a:1, why:"Two set points; a tied set gives 1 each."},
  {q:"How many set points win a match?", o:["4","5","6","10"], a:2, why:"First to 6."},
  {q:"How many arrows are in each set?", o:["1","3","6","12"], a:1, why:"Three arrows per archer."},
  {q:"The match is tied 5-5 after five sets. What happens?", o:["A draw","A one-arrow shoot-off","Another full set","The higher seed wins"], a:1, why:"One arrow each; closest to the center wins if scores match."},
  {q:"What does the X ring do?", o:["Scores 11","Breaks ties","Is a penalty","Marks a miss"], a:1, why:"It's worth 10 but counts for tiebreaks."},
  {q:"What does a yellow timing light mean?", o:["Start shooting","Time is almost up","Stop immediately","A false start"], a:1, why:"Yellow warns that time is running out."},
  {q:"How many arrows are in the ranking round?", o:["36","48","72","144"], a:2, why:"Seventy-two arrows."}
];

function render(app){
  app.innerHTML = sportHero({id:"archery", name:"Archery", alt:"The tabby cat drawing a recurve bow with an arrow",
      lede:"Archers shoot arrows at a target 70 meters away. The closer to the center, the more points: 10 for the gold bullseye, down to 1 for the outer white ring. In head-to-head matches, archers shoot three arrows per set, and the first to win enough sets wins.",
      facts:[["70","meters to the target"],["10","points for the center"],["122","cm: the target's width"],["6","set points win a match"]]})
    + jumpNav([["ar-range","The range"],["ar-target","The target"],["ar-match","Shoot a match"],["ar-clock","Competition"],["ar-tricky","Tricky rules"],["ar-words","Words you'll hear"],["ar-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("ar-range","The range","Tap any part of the range to see what it does.",`<div class="fieldbox" id="arRange">${rangeSVG()}</div><div class="fieldrow"><div class="zonechips" id="arChips"></div><div class="infopanel" id="arInfo" aria-live="polite"></div></div>`)
    + section("ar-target","The target","Ten scoring rings in five colors.",`<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${COLORS.map(([n,v,t]) => `<div class="score"><div class="pts" style="font-size:1.8rem">${v}</div><h3>${n}</h3><p>${t}</p></div>`).join("")}</div>`)
    + section("ar-match","Shoot a match","Click the target to shoot. Your arrows are blue, your opponent's red. Three arrows per set; first to 6 set points wins.",
        `<div class="oslab"><div class="fieldbox" style="display:flex;justify-content:center;background:#2F7546"><svg viewBox="-260 -260 520 520" id="arTarget" style="max-width:440px;width:100%;cursor:crosshair" role="img" aria-label="Archery target. Click to shoot.">${targetRings()}<g id="arArrows"></g></svg></div>
          <div class="osside"><div class="board" style="grid-template-columns:1fr 1fr"><div><small>Set points (you - them)</small><b id="arSP"></b></div><div class="dd"><small>Now</small><b id="arSet" style="font-size:1.7rem"></b></div></div>
            <dl class="csstats"><div><dt>Your arrows</dt><dd id="arMine"></dd></div><div><dt>Opponent</dt><dd id="arOpp"></dd></div><div><dt>Wind</dt><dd id="arWind"></dd></div></dl>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="arMsg"></p></div>
            <div class="controls"><button class="btn primary" id="arNew" type="button" hidden>New match</button></div></div></div>`)
    + section("ar-clock","Competition","Tap a stage to learn more.",`<div class="timeline" id="arTimeline"></div><div class="infopanel" id="arClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("ar-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="arFlips"></div>`)
    + section("ar-words","Words you'll hear","",`<dl class="gloss" id="arGloss"></dl>`)
    + section("ar-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="arQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow World Archery for Olympic recurve. Compound, field, and indoor archery use different distances and targets.</footer></div>`;
  setupZones(document.getElementById("arRange"), document.getElementById("arChips"), document.getElementById("arInfo"), ZONES, ZONE_ORDER, "targets");
  setMatch();
  setupTimeline(document.getElementById("arTimeline"), document.getElementById("arClockInfo"), CLOCK, "An arrow takes about a quarter of a second to fly 70 m.");
  flipCards(document.getElementById("arFlips"), TRICKY); glossary(document.getElementById("arGloss"), WORDS);
  makeQuiz(document.getElementById("arQuiz"), QUIZ, ["Bullseye! Watch a match and keep score of the set points.","Right in the gold. Shoot another match to lock in the set system.","Look over the target and the set system again, then come back.","No worries. Start with the target colors and shoot a match, then try again."]);
}
SPORT_PAGES["archery"] = {render};
})();

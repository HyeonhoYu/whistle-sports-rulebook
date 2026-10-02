/* Golf. Rules follow the Rules of Golf from the R&A and USGA. */
(function(){

const INK = "#18221D", ROUGH = "#4E8A3E", FAIR = "#7DB85A", GREEN = "#A6D97F", SAND = "#E9D8A6", WATER = "#3C8DC4";
/* A par-4 hole, tee on the left, green on the right. Fairway follows a cubic curve. */
const P = [[130,300],[520,360],[760,120],[880,170]];
const bez = t => { const u = 1 - t; const c = [u*u*u, 3*u*u*t, 3*u*t*t, t*t*t]; return [0,1].map(k => c.reduce((s,ci,i) => s + ci*P[i][k], 0)); };
function holeBase(){
  return `<rect width="1000" height="420" fill="${ROUGH}"/>
    <rect width="1000" height="44" fill="#3D6E31"/><line x1="0" y1="44" x2="1000" y2="44" stroke="#fff" stroke-width="3" stroke-dasharray="2 18"/>
    ${Array.from({length:20},(_,i) => `<circle cx="${25 + i*50}" cy="44" r="4" fill="#fff"/>`).join("")}
    ${[[60,120],[250,90],[330,180],[640,380],[980,300],[700,330],[960,60],[40,380]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="22" fill="#2E5E27"/>`).join("")}
    <path d="M${P[0]} C${P[1]} ${P[2]} ${P[3]}" fill="none" stroke="${FAIR}" stroke-width="96" stroke-linecap="round"/>
    <ellipse cx="560" cy="232" rx="72" ry="40" fill="${WATER}" stroke="#D9342B" stroke-width="3" stroke-dasharray="10 6"/>
    <ellipse cx="420" cy="368" rx="46" ry="18" fill="${SAND}"/><ellipse cx="830" cy="236" rx="38" ry="16" fill="${SAND}"/><ellipse cx="948" cy="118" rx="26" ry="14" fill="${SAND}"/>
    <circle cx="880" cy="170" r="66" fill="#94CC6C"/><circle cx="880" cy="170" r="56" fill="${GREEN}"/>
    <circle cx="896" cy="160" r="4" fill="${INK}"/><line x1="896" y1="160" x2="896" y2="112" stroke="${INK}" stroke-width="3"/><path d="M896 112l26 8 -26 8z" fill="#D9342B"/>
    <rect x="98" y="284" width="46" height="32" rx="6" fill="#94CC6C" stroke="#fff" stroke-width="2"/>`;
}
function holeSVG(){
  const e = (z,cx,cy,rx,ry) => `<ellipse class="hz" data-zone="${z}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
  return `<svg viewBox="0 0 1000 420" role="img" aria-label="A par-4 golf hole seen from above">${holeBase()}
    <rect class="hz" data-zone="rough" x="0" y="46" width="1000" height="374"/>
    <path class="hz hzs" data-zone="fairway" d="M${P[0]} C${P[1]} ${P[2]} ${P[3]}" style="stroke-width:90"/>
    ${e("water",560,232,74,42)}${e("bunker",420,368,48,20)}${e("bunker",830,236,40,18)}${e("bunker",948,118,28,16)}
    <circle class="hz hzs" data-zone="fringe" cx="880" cy="170" r="61" style="stroke-width:10"/><circle class="hz" data-zone="green" cx="880" cy="170" r="54"/>
    <circle class="hz" data-zone="flag" cx="900" cy="140" r="22"/><rect class="hz" data-zone="tee" x="94" y="280" width="54" height="40"/>
    <rect class="hz" data-zone="ob" x="0" y="0" width="1000" height="48"/></svg>`;
}
const ZONES = {
  tee:{title:"Teeing area", text:"Every hole starts here. The ball may be set on a tee peg, and it must be played from between the tee markers and up to two club-lengths behind them."},
  fairway:{title:"Fairway", text:"The closely mown strip leading to the green. It isn't a rule term at all, but it's where every player wants to be, because the lie is clean and easy to hit from."},
  rough:{title:"Rough", text:"Longer grass along the fairway. The ball sits down in it, making clean contact and spin harder. You play it as it lies, with no penalty."},
  bunker:{title:"Bunkers", text:"Sand-filled hollows. You can't touch the sand with your club right in front of or behind the ball before your stroke, including on a practice swing or the backswing."},
  water:{title:"Penalty area", text:"Water, marked with red or yellow stakes or lines. Play it as it lies for free, or take relief for one penalty stroke. Red areas also allow a drop within two club-lengths of where the ball last crossed the edge."},
  green:{title:"Putting green", text:"The smooth, short grass around the hole. Here you can mark and lift your ball, clean it, and repair damage like ball marks and spike marks."},
  fringe:{title:"Fringe", text:"The slightly longer collar of grass around the green. It counts as part of the general area, not the green, so you can't lift and clean your ball there."},
  flag:{title:"Hole and flagstick", text:"The hole is 4.25 inches (108 mm) wide. You may putt with the flagstick in or out; there's no penalty either way."},
  ob:{title:"Out of bounds", text:"Beyond the white stakes or white line. A ball out of bounds costs one penalty stroke, and you must play again from where you last hit."}
};
const ZONE_ORDER = ["tee","fairway","rough","bunker","water","fringe","green","flag","ob"];

/* Play a hole: a par 4 of 410 yards. Distances in yards, then feet on the green. */
const SCORE_NAME = d => d <= -3 ? "Albatross" : d === -2 ? "Eagle" : d === -1 ? "Birdie" : d === 0 ? "Par" : d === 1 ? "Bogey" : d === 2 ? "Double bogey" : d === 3 ? "Triple bogey" : `${d} over par`;
function playHole(){
  const $ = id => document.getElementById(id); let S;
  const r = (a,b) => a + Math.random()*(b - a);
  function reset(){ S = {dist:410, lie:"tee", strokes:0, pen:0, done:false, ball:[121,300], last:[121,300], lastLie:"tee", lastDist:410}; $("phMsg").textContent = "Par 4, 410 yards. Water guards the left side of the dogleg; the white stakes up top mark out of bounds."; draw(); }
  function placeBall(){
    if(S.lie === "green") { const a = r(0, Math.PI*2), d = Math.min(46, S.dist*1.1); return [896 + Math.cos(a)*d, 160 + Math.sin(a)*d]; }
    if(S.lie === "water") return [560 + r(-30,30), 232 + r(-12,12)];
    if(S.lie === "bunker") return S.dist > 60 ? [420 + r(-25,25), 368] : [830 + r(-18,18), 236];
    const t = Math.max(0, Math.min(1, 1 - S.dist/410)), [x,y] = bez(t);
    if(S.lie === "rough") return [x + r(-10,10), y + (t < .55 ? 62 : -62)];
    if(S.lie === "fringe") return [880 - 62, 175];
    return [x + r(-14,14), y + r(-14,14)];
  }
  function options(){
    if(S.done) return [];
    if(S.lie === "tee") return [["Driver","driver"],["Iron off the tee (safer)","teeiron"]];
    if(S.lie === "green") return [["Putt","putt"]];
    if(S.lie === "bunker") return [["Splash out of the bunker","sand"]];
    if(S.dist <= 30) return [["Chip onto the green","chip"],["Putt from off the green","texas"]];
    if(S.dist <= 150) return [["Wedge at the flag","wedge"]];
    return [["Long iron toward the green","iron"],["Lay up short of trouble","layup"]];
  }
  function land(dist, weights){ /* weights: [fairway, rough, bunker, water, ob] */
    const k = Math.random(), cum = []; weights.reduce((a,w,i) => cum[i] = a + w, 0);
    const lie = ["fairway","rough","bunker","water","ob"][cum.findIndex(c => k < c)];
    return lie;
  }
  function shot(kind){
    if(S.done) return;
    S.last = S.ball.slice(); S.lastLie = S.lie; S.lastDist = S.dist; S.strokes++;
    let msg = "", lie;
    const toGreen = feet => { S.lie = "green"; S.dist = Math.round(feet); };
    if(kind === "driver" || kind === "teeiron"){
      const carry = kind === "driver" ? r(235,290) : r(200,225);
      lie = land(0, kind === "driver" ? [.58,.25,.07,.06,.04] : [.75,.2,.03,.02,0]);
      if(lie === "ob"){ S.strokes++; S.pen++; msg = "Out of bounds over the white stakes! That's stroke and distance: one penalty stroke, and you play again from the tee. You're now hitting your third shot."; S.lie = "tee"; S.dist = 410; }
      else if(lie === "water"){ S.strokes++; S.pen++; S.lie = "rough"; S.dist = 175; msg = "Into the water. It's a red penalty area, so you take a drop within two club-lengths of where it crossed the edge, for one penalty stroke."; }
      else { S.lie = lie; S.dist = Math.round(410 - carry); msg = `${kind === "driver" ? "A big drive" : "A safe iron"}, ${Math.round(carry)} yards, into the ${lie}. ${S.dist} yards to go.`; }
    } else if(kind === "iron" || kind === "layup"){
      if(kind === "layup"){ S.dist = Math.round(r(90,115)); S.lie = Math.random() < .85 ? "fairway" : "rough"; msg = `A sensible layup to ${S.dist} yards, in the ${S.lie}.`; }
      else { lie = land(0,[.45,.25,.22,.08,0]);
        if(lie === "water"){ S.strokes++; S.pen++; S.lie = "rough"; S.dist = 160; msg = "It came up short and splashed into the water. One penalty stroke and a drop."; }
        else if(lie === "fairway"){ toGreen(r(20,60)); msg = `On the green! ${S.dist} feet from the hole.`; }
        else if(lie === "bunker"){ S.lie = "bunker"; S.dist = 20; msg = "Into the greenside bunker."; }
        else { S.lie = "rough"; S.dist = Math.round(r(12,28)); msg = `Just off the green in the rough, ${S.dist} yards away.`; } }
    } else if(kind === "wedge"){
      const k = Math.random();
      if(k < .68){ toGreen(r(5,32)); msg = `Nice wedge. On the green, ${S.dist} feet away.`; }
      else if(k < .85){ S.lie = "bunker"; S.dist = 18; msg = "Pulled it into the greenside bunker."; }
      else { S.lie = "fringe"; S.dist = Math.round(r(8,18)); msg = `On the fringe, ${S.dist} yards from the hole. The fringe isn't part of the green.`; }
    } else if(kind === "sand"){
      const k = Math.random();
      if(k < .75){ toGreen(r(5,24)); msg = `Out of the sand and onto the green, ${S.dist} feet away.`; }
      else if(k < .88){ msg = "It didn't get out. Still in the bunker."; }
      else { S.lie = "rough"; S.dist = Math.round(r(10,20)); msg = "Thin! It flew over the green into the rough."; }
    } else if(kind === "chip" || kind === "texas"){
      toGreen(kind === "chip" ? r(2,12) : r(4,16)); msg = `Rolled up to ${S.dist} feet.`;
    } else if(kind === "putt"){
      const f = S.dist, p = f < 3 ? .95 : f < 8 ? .55 : f < 20 ? .18 : .06;
      if(Math.random() < p){ S.done = true; msg = `It drops from ${f} feet!`; }
      else { S.dist = Math.max(1, Math.round(f*r(.08,.25))); msg = `Missed from ${f} feet. ${S.dist} feet left.`; }
    }
    if(S.done){ const d = S.strokes - 4; msg += ` You holed out in ${S.strokes}${S.pen ? ` (including ${S.pen} penalty stroke${S.pen > 1 ? "s" : ""})` : ""}: ${S.strokes === 1 ? "a hole in one!" : SCORE_NAME(d).toLowerCase()}${d ? ` (${d > 0 ? "+" : ""}${d})` : ""}.`; }
    $("phMsg").textContent = msg; draw();
  }
  function draw(){
    S.ball = S.lie === "tee" ? [121,300] : placeBall();
    $("phBall").setAttribute("transform", `translate(${S.ball[0]} ${S.ball[1]})`);
    $("phTrail").setAttribute("d", S.strokes ? `M${S.last[0]} ${S.last[1]}Q${(S.last[0] + S.ball[0])/2} ${Math.min(S.last[1], S.ball[1]) - 60} ${S.ball[0]} ${S.ball[1]}` : "");
    $("phStrokes").textContent = S.strokes; $("phLie").textContent = S.done ? "In the hole" : S.lie === "green" ? `Green, ${S.dist} ft` : `${S.lie[0].toUpperCase() + S.lie.slice(1)}, ${S.dist} yd`;
    $("phBtns").innerHTML = options().map(([l,k]) => `<button class="btn" type="button" data-shot="${k}">${l}</button>`).join("") + (S.done || S.strokes ? `<button class="btn primary" type="button" id="phNew">${S.done ? "Play again" : "Start over"}</button>` : "");
    $("phBtns").querySelectorAll("[data-shot]").forEach(b => b.addEventListener("click", () => shot(b.dataset.shot)));
    const nb = document.getElementById("phNew"); if(nb) nb.addEventListener("click", reset);
  }
  reset();
}

/* Match play board */
function matchPlay(){
  const $ = id => document.getElementById(id); let S;
  const reset = () => { S = {hole:0, lead:0, over:false, log:[]}; $("mpMsg").textContent = "Eighteen holes. Each hole is won, lost, or halved; the total number of strokes doesn't matter."; draw(); };
  const status = () => S.lead === 0 ? "All square" : `${S.lead > 0 ? "You" : "Opponent"} ${Math.abs(S.lead)} up`;
  function play(res){
    if(S.over) return; S.hole++; S.lead += res; S.log.push(res);
    const left = 18 - S.hole, lead = Math.abs(S.lead), who = S.lead > 0 ? "You win" : "Your opponent wins";
    let msg = `Hole ${S.hole}: ${res > 0 ? "you win it" : res < 0 ? "your opponent wins it" : "halved"}. ${status()}.`;
    if(lead > left){ S.over = true; msg = left ? `${who} the match ${lead} and ${left}: ${lead} holes up with only ${left} left to play, so it's over early.` : `${who} the match ${lead} up after 18 holes.`; }
    else if(left === 0){ S.over = true; msg = "All square after 18. In most events, the match goes to extra holes until someone wins one."; }
    else if(lead === left && lead > 0) msg += ` That's dormie: ${S.lead > 0 ? "you" : "your opponent"} can't lose in regulation, only tie.`;
    $("mpMsg").textContent = msg; draw();
  }
  function draw(){
    $("mpHoles").innerHTML = Array.from({length:18}, (_,i) => { const v = S.log[i]; return `<span class="${v === undefined ? "" : v > 0 ? "w" : v < 0 ? "l" : "h"}">${i+1}</span>`; }).join("");
    $("mpStatus").textContent = S.over ? "Match over" : status();
    document.querySelectorAll("[data-mp]").forEach(b => b.hidden = S.over); $("mpNew").hidden = !S.over;
  }
  document.querySelectorAll("[data-mp]").forEach(b => b.addEventListener("click", () => play(+b.dataset.mp)));
  $("mpNew").addEventListener("click", reset);
  reset();
}

const SCORES = [
  {n:"-3", name:"Albatross", text:"Three under par, like a 2 on a par 5. Rarer than a hole in one."},
  {n:"-2", name:"Eagle", text:"Two under par, like a 3 on a par 5."},
  {n:"-1", name:"Birdie", text:"One under par. A great hole."},
  {n:"0", name:"Par", text:"The number of strokes an expert is expected to need: usually 3, 4, or 5."},
  {n:"+1", name:"Bogey", text:"One over par."},
  {n:"+2", name:"Double bogey", text:"Two over par. It happens to the best players too."}
];
const RELIEF = [
  {name:"Out of bounds", cost:"1 stroke", text:"Stroke and distance: add a penalty stroke and play again from where you last hit. Many casual rounds use a local rule allowing a drop near where the ball went out, for two strokes."},
  {name:"Lost ball", cost:"1 stroke", text:"You have three minutes to search. If the ball isn't found, it's stroke and distance, just like out of bounds."},
  {name:"Penalty area", cost:"0 or 1 stroke", text:"Play it as it lies for free, or take relief for one stroke: back to your last spot, or back on a line from the flag. Red areas also allow a drop within two club-lengths of where the ball crossed in."},
  {name:"Unplayable ball", cost:"1 stroke", text:"Stuck in a bush or against a tree? Anywhere except a penalty area, you may declare it unplayable and drop it within two club-lengths, back on a line, or replay from your last spot."},
  {name:"Free relief", cost:"0 strokes", text:"For a cart path, puddles, ground under repair, or an animal hole, find the nearest spot without the problem and drop within one club-length, no closer to the hole."},
  {name:"Wrong scorecard", cost:"Disqualification", text:"In stroke play, signing for a lower score than you actually made on a hole disqualifies you. A higher score stands as written."}
];
const CLOCK = [
  {k:"r1", cls:"q", t:"Round 1", s:"18 holes", info:["Round 1","A round is 18 holes, usually par 70 to 72. Pros take four to five hours to play one."]},
  {k:"r2", cls:"q", t:"Round 2", s:"18 holes", info:["Round 2 and the cut","After 36 holes, most pro events make a cut: only the top players, around the top 65 and ties on the PGA Tour, play the weekend."]},
  {k:"r3", cls:"q", t:"Round 3", s:"Weekend", info:["Round 3","Called moving day, when players try to climb into contention for Sunday."]},
  {k:"r4", cls:"q", t:"Round 4", s:"Final", info:["Round 4","The lowest total for 72 holes wins. Leaders play last."]},
  {k:"po", cls:"ot", t:"Playoff", s:"If tied", info:["Playoff","A tie for first goes to a playoff, often sudden death: extra holes until one player wins a hole outright. Some majors use a short aggregate playoff first."]}
];
const TRICKY = [
  ["Can you putt with the flagstick in?","Yes. Since 2019 there's no penalty if your putt hits the flagstick while it's in the hole. Players choose whatever they prefer."],
  ["How many clubs can you carry?","Up to 14. Start a round with more and you'll be penalized for each hole where you broke the rule, up to a limit."],
  ["What if my ball moves on the green by accident?","No penalty. Just put it back where it was. The same goes if wind or gravity moves it after you've marked and replaced it."],
  ["What's the difference between stroke play and match play?","In stroke play, you count every shot over the round. In match play, each hole is a separate contest, and you count holes won."],
  ["What's a handicap?","A number showing how many strokes above par an amateur typically shoots. It lets players of different skill compete fairly."],
  ["Why do players mark their ball on the green?","Marking lets you lift and clean the ball, and keeps it out of other players' putting lines. You must replace it exactly where it was."]
];
const WORDS = [
  ["Par","The expected number of strokes for a hole or a round."],
  ["Drive","The first shot on a long hole, usually with the driver."],
  ["Approach","A shot aimed at the green."],
  ["Chip","A short, low shot from just off the green."],
  ["Putt","A rolling stroke on the green."],
  ["Lie","Where and how the ball is resting: in the fairway, buried in rough, and so on."],
  ["Dogleg","A hole that bends left or right."],
  ["Up and down","Getting the ball in the hole in two shots from off the green."],
  ["The cut","The score after two rounds that decides who plays the weekend."],
  ["Caddie","The person who carries the bag and helps the player choose shots and read greens."]
];
const waterMini = () => `<svg viewBox="460 170 200 120" style="width:220px;border-radius:8px" aria-hidden="true">${holeBase()}<circle cx="545" cy="230" r="6" fill="#fff" stroke="${INK}" stroke-width="2"/></svg>`;
const QUIZ = [
  {q:"What's a birdie?", o:["One over par","One under par","Two under par","Exactly par"], a:1, why:"A birdie is one stroke under par."},
  {q:"On a par-4 hole, how many strokes is a bogey?", o:["3","4","5","6"], a:2, why:"A bogey is one over par, so 5 on a par 4."},
  {q:"Your tee shot goes out of bounds. What's the penalty?", o:["No penalty","One stroke, and play again from where you hit","Two strokes, drop where it went out, always","You lose the hole"], a:1, why:"Out of bounds is stroke and distance: one penalty stroke and replay from the previous spot."},
  {q:"How many clubs can a player carry?", o:["10","12","14","No limit"], a:2, why:"The limit is 14 clubs."},
  {q:"Your ball lands here, in water with red stakes. What's the rule?", visual: waterMini, o:["A free drop","A 2-stroke penalty","A 1-stroke penalty, with relief options","Disqualification"], a:2, why:"That's a penalty area. Relief costs one stroke, and red areas allow a sideways drop."},
  {q:"Your ball comes to rest on a cart path. What happens?", o:["Free relief, no penalty","A 1-stroke penalty","You must play it as it lies","A 2-stroke penalty"], a:0, why:"Cart paths are immovable obstructions. You get free relief within one club-length."},
  {q:"In match play, what does '3 and 2' mean?", o:["Won by 3 strokes with 2 putts","3 holes up with only 2 holes left","Won 3 holes and lost 2","3 under par after 2 rounds"], a:1, why:"The winner was 3 holes up with 2 to play, so the match ended early."},
  {q:"A tournament ends with two players tied for first. What usually happens?", o:["They share the trophy","A playoff","The lower last round wins","A coin toss"], a:1, why:"A playoff, often sudden death, decides the winner."},
  {q:"A player putts with the flagstick still in the hole and hits it. What's the penalty?", o:["2 strokes","1 stroke","Only on par 3s","No penalty: it's allowed"], a:3, why:"Since 2019, putting with the flagstick in is allowed."},
  {q:"How long can you search for a lost ball?", o:["3 minutes","1 minute","5 minutes","As long as you like"], a:0, why:"Three minutes. After that, the ball is lost."}
];

function render(app){
  app.innerHTML = sportHero({id:"golf", name:"Golf", alt:"The tabby cat finishing a golf swing, ball on the grass",
      lede:"Players hit a small ball from the tee into a hole on the green, using as few strokes as possible. A round is 18 holes. In stroke play, the lowest total score wins; in match play, players compete hole by hole. Golfers usually call their own penalties.",
      facts:[["18","holes in a round"],["72","holes in a pro tournament"],["14","clubs at most"],["4.25","inches across the hole"]]})
    + jumpNav([["g-hole","The hole"],["g-play","Play a hole"],["g-score","Scores"],["g-relief","Penalties and relief"],["g-match","Match play"],["g-clock","A tournament"],["g-tricky","Tricky rules"],["g-words","Words you'll hear"],["g-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("g-hole","The hole","Tap any part of the hole to see what it does.",
        `<div class="fieldbox" id="gHole">${holeSVG()}</div><div class="fieldrow"><div class="zonechips" id="gChips"></div><div class="infopanel" id="gInfo" aria-live="polite"></div></div>`)
    + section("g-play","Play the hole","Choose your shots and get the ball in the hole. Watch out for the water and the out-of-bounds stakes.",
        `<div class="sim"><div class="board" style="grid-template-columns:1fr 1fr 1fr"><div><small>Par</small><b>4</b></div><div><small>Strokes</small><b id="phStrokes">0</b></div><div><small>Ball</small><b id="phLie" style="font-size:1.5rem">Tee</b></div></div>
          <div class="fieldbox"><svg viewBox="0 0 1000 420" role="img" aria-label="Your ball on the hole">${holeBase()}<path id="phTrail" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 6"/><g id="phBall"><circle r="9" fill="#fff" stroke="${INK}" stroke-width="2.5"/></g></svg></div>
          <div class="controls" id="phBtns"></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="phMsg"></p></div></div></div>`)
    + section("g-score","Scores","Every hole has a par. Scores get names based on how far above or below par you finish.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">${SCORES.map(s => `<div class="score"><div class="pts">${s.n}</div><h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>
        <p class="combo">A hole in one is a score of 1 on any hole, most often a par 3.</p>`)
    + section("g-relief","Penalties and relief","Most golf penalties are one stroke. Some situations give free relief.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${RELIEF.map(d => `<div class="score"><div class="pts" style="font-size:1.6rem">${d.cost}</div><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("g-match","Match play","In match play, you win holes, not strokes. Decide each hole and watch the match status.",
        `<div class="sim"><div class="board" style="grid-template-columns:1fr"><div><small>Match status</small><b id="mpStatus">All square</b></div></div>
          <div class="mpholes" id="mpHoles"></div>
          <div class="controls"><button class="btn" data-mp="1" type="button">You win the hole</button><button class="btn" data-mp="0" type="button">Halved</button><button class="btn" data-mp="-1" type="button">Opponent wins the hole</button><button class="btn primary" id="mpNew" type="button" hidden>New match</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="mpMsg"></p></div></div></div>`)
    + section("g-clock","A tournament","Most professional events are four rounds over four days. Tap a round to learn more.",
        `<div class="timeline" id="gTimeline"></div><div class="infopanel" id="gClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("g-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="gFlips"></div>`)
    + section("g-words","Words you'll hear","",`<dl class="gloss" id="gGloss"></dl>`)
    + section("g-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="gQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the Rules of Golf from the R&A and USGA. Courses and tournaments can add local rules, and casual rounds often bend a few of these.</footer></div>`;

  setupZones(document.getElementById("gHole"), document.getElementById("gChips"), document.getElementById("gInfo"), ZONES, ZONE_ORDER, "water");
  playHole(); matchPlay();
  setupTimeline(document.getElementById("gTimeline"), document.getElementById("gClockInfo"), CLOCK,
    "There's no game clock in golf, but there are pace-of-play rules, and players who take too long over a shot can be penalized.");
  flipCards(document.getElementById("gFlips"), TRICKY);
  glossary(document.getElementById("gGloss"), WORDS);
  makeQuiz(document.getElementById("gQuiz"), QUIZ, [
    "Hole in one! Watch a tournament and try to spot a player taking relief.",
    "Under par. Play the hole a few more times and the penalty rules will stick.",
    "Look over the penalties and relief cards again, then come back for another round.",
    "No worries. Start with the hole diagram and play the hole once or twice, then try again."]);
}

SPORT_PAGES["golf"] = {render};
})();

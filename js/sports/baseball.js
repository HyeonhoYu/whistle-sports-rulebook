/* Baseball. Rules follow MLB. */
(function(){

const W = "#F4F6F1", DIRT = "#C48A57", DIRT2 = "#B57A48", GRASS = "#2F7546", GRASS2 = "#2A6B3F";
/* Field with home plate at the bottom. 1.5 units per foot. Home (500,660), bases 90 ft apart. */
function fieldSVG(){
  const base = (x,y) => `<rect x="${x-7}" y="${y-7}" width="14" height="14" fill="#fff" stroke="#18221D" stroke-width="1.5" transform="rotate(45 ${x} ${y})"/>`;
  let s = `<svg viewBox="40 20 920 690" role="img" aria-label="Diagram of a baseball field">
    <rect x="40" y="20" width="920" height="690" fill="#1C4D2C"/>
    <path d="M500 660L150 310Q500 -190 850 310Z" fill="${GRASS}"/>`;
  for(let i=1;i<9;i+=2) s += `<path d="M500 660L${150+i*87.5} ${310 - Math.sin(Math.PI*i/8)*250}" stroke="${GRASS2}" stroke-width="40" opacity=".5"/>`;
  s += `<path d="M150 310Q500 -190 850 310" fill="none" stroke="#B8834F" stroke-width="26"/>
    <path d="M150 310Q500 -190 850 310" fill="none" stroke="#18221D" stroke-width="6" transform="translate(0 -14)" opacity=".7"/>
    <path d="M500 682L618 564Q500 330 382 564Z" fill="${DIRT}"/>
    <path d="M500 640L578 564L500 486L422 564Z" fill="${GRASS}"/>
    <circle cx="500" cy="569" r="16" fill="${DIRT2}"/><rect x="491" y="567" width="18" height="4" fill="#fff"/>
    <circle cx="500" cy="660" r="26" fill="${DIRT2}"/>
    <line x1="500" y1="660" x2="150" y2="310" stroke="${W}" stroke-width="3"/><line x1="500" y1="660" x2="850" y2="310" stroke="${W}" stroke-width="3"/>
    <line x1="150" y1="310" x2="150" y2="250" stroke="#F2C230" stroke-width="5"/><line x1="850" y1="310" x2="850" y2="250" stroke="#F2C230" stroke-width="5"/>
    <rect x="476" y="650" width="14" height="22" fill="none" stroke="${W}" stroke-width="2"/><rect x="510" y="650" width="14" height="22" fill="none" stroke="${W}" stroke-width="2"/>
    <path d="M494 655h12v5l-6 6-6-6z" fill="#fff" stroke="#18221D" stroke-width="1"/>
    ${base(595.5,564.5)}${base(500,469)}${base(404.5,564.5)}`;
  const hz = (z, d) => `<path class="hz" data-zone="${z}" d="${d}"/>`;
  s += `<rect class="hz" data-zone="foul" x="40" y="20" width="920" height="690"/>`
     + hz("outfield","M500 660L150 310Q500 -190 850 310Z")
     + hz("infield","M500 682L618 564Q500 330 382 564Z")
     + `<path class="hz hzs" data-zone="track" d="M150 310Q500 -190 850 310"/>`
     + `<path class="hz hzs" data-zone="lines" d="M500 660L150 310M500 660L850 310"/>`
     + `<circle class="hz" data-zone="poles" cx="150" cy="270" r="22"/><circle class="hz" data-zone="poles" cx="850" cy="270" r="22"/>`
     + `<circle class="hz" data-zone="bases" cx="595.5" cy="564.5" r="18"/><circle class="hz" data-zone="bases" cx="500" cy="469" r="18"/><circle class="hz" data-zone="bases" cx="404.5" cy="564.5" r="18"/>`
     + `<circle class="hz" data-zone="mound" cx="500" cy="569" r="20"/>`
     + `<rect class="hz" data-zone="box" x="470" y="645" width="24" height="32"/><rect class="hz" data-zone="box" x="506" y="645" width="24" height="32"/>`
     + `<circle class="hz" data-zone="plate" cx="500" cy="661" r="9"/>`;
  return s + `</svg>`;
}
const ZONES = {
  plate:{title:"Home plate", text:"A five-sided slab where every at-bat happens. A runner who makes it all the way around the bases and touches home plate scores a run."},
  box:{title:"Batter's boxes", text:"The batter stands in one of the two boxes beside home plate, depending on whether they hit right-handed or left-handed."},
  mound:{title:"Pitcher's mound", text:"A raised dirt circle in the middle of the infield. The pitcher throws from a rubber slab on top, 60 feet 6 inches from home plate."},
  bases:{title:"Bases", text:"First, second, and third base sit 90 feet apart. Runners go around them counterclockwise. A runner touching a base is generally safe from being tagged out."},
  infield:{title:"Infield", text:"The dirt and grass square around the bases, guarded by four infielders: the first baseman, second baseman, shortstop, and third baseman."},
  outfield:{title:"Outfield", text:"The big grass area beyond the infield, covered by the left, center, and right fielders. A fly ball caught here before it bounces is an out."},
  lines:{title:"Foul lines", text:"The two white lines from home plate to the outfield wall. The lines themselves count as fair territory, so a ball that lands on the line is fair."},
  foul:{title:"Foul territory", text:"Everything outside the foul lines. A batted ball that lands or rolls out here is a foul ball, which counts as a strike unless the batter already has two. A foul pop-up caught in the air is still an out."},
  poles:{title:"Foul poles", text:"Tall yellow poles that extend the foul lines up into the air. Despite the name, a fly ball that hits a foul pole is a home run."},
  track:{title:"Warning track and wall", chip:"Warning track", text:"A dirt strip just inside the outfield wall, so fielders can feel the wall coming. A fair ball that flies over the wall is a home run."}
};
const ZONE_ORDER = ["plate","box","mound","bases","infield","outfield","lines","foul","poles","track"];

/* Strike zone: 8 units per inch. Ground at y=600. Zone 18 to 42 inches high, plate 17 inches wide centered at x=260. */
const ZONE = {x0:192, x1:328, y0:264, y1:456}, BALL_R = 11.6;
function zoneSVG(){
  return `<svg viewBox="0 0 420 620" id="zoneSvg" role="img" aria-label="Strike zone. Click to throw a pitch." style="cursor:crosshair">
    <rect width="420" height="620" fill="#1C4D2C"/><rect y="600" width="420" height="20" fill="${DIRT}"/>
    <g fill="none" stroke="#EEF3EC" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".85">
      <circle cx="92" cy="72" r="34"/><path d="M92 106v174M92 280l-26 168-8 152M92 280l28 168 4 152M92 140l40 40 22-40M92 140l30 30 28-52"/>
      <path d="M150 116l50-80" stroke="#C48A57" stroke-width="10"/></g>
    <rect x="${ZONE.x0}" y="${ZONE.y0}" width="${ZONE.x1-ZONE.x0}" height="${ZONE.y1-ZONE.y0}" fill="#F2C230" fill-opacity=".12" stroke="#F2C230" stroke-width="3" stroke-dasharray="10 7"/>
    <line x1="${ZONE.x0}" y1="${ZONE.y0+64}" x2="${ZONE.x1}" y2="${ZONE.y0+64}" stroke="#F2C230" stroke-opacity=".3"/><line x1="${ZONE.x0}" y1="${ZONE.y0+128}" x2="${ZONE.x1}" y2="${ZONE.y0+128}" stroke="#F2C230" stroke-opacity=".3"/>
    <line x1="${ZONE.x0+45}" y1="${ZONE.y0}" x2="${ZONE.x0+45}" y2="${ZONE.y1}" stroke="#F2C230" stroke-opacity=".3"/><line x1="${ZONE.x0+91}" y1="${ZONE.y0}" x2="${ZONE.x0+91}" y2="${ZONE.y1}" stroke="#F2C230" stroke-opacity=".3"/>
    <text x="260" y="${ZONE.y0-10}" text-anchor="middle" font-family="Barlow,sans-serif" font-size="15" fill="#EEF3EC" opacity=".85">Top: middle of the torso</text>
    <text x="260" y="${ZONE.y1+22}" text-anchor="middle" font-family="Barlow,sans-serif" font-size="15" fill="#EEF3EC" opacity=".85">Bottom: just below the knee</text>
    <path d="M192 600h136l-4 -10h-128z" fill="#fff"/>
    <g id="zoneMarks"></g>
  </svg>`;
}
function strikeZone(){
  const svg = document.getElementById("zoneSvg"), $ = id => document.getElementById(id);
  const S = {k:0, b:0};
  svg.addEventListener("click", e => {
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse());
    if(q.y > 600) return;
    const cx = Math.max(ZONE.x0, Math.min(q.x, ZONE.x1)), cy = Math.max(ZONE.y0, Math.min(q.y, ZONE.y1));
    const dist = Math.hypot(q.x - cx, q.y - cy), strike = dist <= BALL_R, edge = strike && dist > 0;
    strike ? S.k++ : S.b++;
    $("zoneMarks").insertAdjacentHTML("beforeend", `<circle cx="${q.x}" cy="${q.y}" r="${BALL_R}" fill="${strike ? "#fff" : "rgba(255,255,255,.35)"}" stroke="${strike ? "#C8482F" : "#18221D"}" stroke-width="2.5"/>`);
    $("zoneCalled").textContent = strike ? "Strike!" : "Ball";
    $("zoneCalled").className = strike ? "verdict off" : "verdict on";
    $("zoneTally").textContent = `${S.k} strikes, ${S.b} balls`;
    $("zoneMsg").textContent = strike ? (edge ? "Strike, just barely. The ball only has to touch the edge of the zone." : "Right through the zone. If the batter doesn't swing, it's a called strike.")
      : "That missed the zone. If the batter doesn't swing, it's a ball. Four balls and the batter walks to first.";
  });
  $("zoneClear").addEventListener("click", () => { S.k = S.b = 0; $("zoneMarks").innerHTML = ""; $("zoneTally").textContent = "0 strikes, 0 balls"; $("zoneCalled").textContent = "Pitch"; $("zoneCalled").className = "verdict on"; $("zoneMsg").textContent = "Click anywhere to throw. Pitches that touch the dashed box are strikes."; });
}

/* Half-inning simulator */
function diamondSVG(){
  const b = (id,x,y) => `<rect id="${id}" x="${x-13}" y="${y-13}" width="26" height="26" rx="3" transform="rotate(45 ${x} ${y})" fill="none" stroke="#EEF3EC" stroke-width="3"/>`;
  return `<svg viewBox="0 0 120 110" aria-hidden="true" class="diamond">${b("bs2",60,24)}${b("bs3",22,62)}${b("bs1",98,62)}<path d="M52 92h16v7l-8 8-8-8z" fill="#EEF3EC"/></svg>`;
}
function inningSim(){
  const $ = id => document.getElementById(id);
  const S = {b:0, s:0, o:0, bases:[false,false,false], runs:0, over:false};
  const dots = (id, n, max, cls) => { $(id).innerHTML = Array.from({length:max}, (_,i) => `<i class="${i < n ? cls : ""}"></i>`).join(""); };
  function draw(){
    dots("cB", S.b, 3, "on-b"); dots("cS", S.s, 2, "on-s"); dots("cO", S.o, 2, "on-o");
    [0,1,2].forEach(i => $(`bs${i+1}`).setAttribute("fill", S.bases[i] ? "#F2C230" : "none"));
    $("cRuns").textContent = S.runs; $("pitchBtn").hidden = S.over; $("newInning").hidden = !S.over;
  }
  const log = t => { const li = document.createElement("li"); li.textContent = t; const ul = $("pLog"); ul.prepend(li); while(ul.children.length > 6) ul.lastChild.remove(); };
  function advance(n, batter){
    let scored = 0; const nb = [false,false,false];
    for(let i = 2; i >= 0; i--) if(S.bases[i]){ const to = i + n; if(to >= 3) scored++; else nb[to] = true; }
    if(batter){ if(n >= 4) scored++; else nb[n-1] = true; }
    S.bases = nb; S.runs += scored; return scored;
  }
  function walk(){ let scored = 0;
    if(S.bases[0]){ if(S.bases[1]){ if(S.bases[2]) scored = 1; S.bases[2] = true; } S.bases[1] = true; }
    S.bases[0] = true; S.runs += scored; return scored; }
  const runsText = n => n ? ` ${n} run${n > 1 ? "s" : ""} score${n > 1 ? "" : "s"}!` : "";
  function out(msg){ S.o++; S.b = S.s = 0; if(S.o >= 3){ S.over = true; msg += " That's three outs: the half-inning is over, and the teams switch sides."; } return msg; }
  function pitch(){
    if(S.over) return;
    const r = Math.random(); let msg = "", head = "";
    if(r < .35){ S.b++; head = "Ball";
      if(S.b === 4){ const n = walk(); S.b = S.s = 0; msg = "Ball four! The batter walks to first base, and any runners forced to move up do." + runsText(n); }
      else msg = `Ball ${S.b}. The pitch missed the strike zone and the batter didn't swing.`; }
    else if(r < .62){ const swing = r >= .52; S.s++; head = swing ? "Swinging strike" : "Called strike";
      if(S.s === 3) msg = out(swing ? "Strike three, swinging! The batter struck out." : "Strike three, looking! The pitch caught the zone and the batter is out.");
      else msg = `${swing ? "Swing and a miss" : "Called strike"}. That's strike ${S.s}.`; }
    else if(r < .79){ head = "Foul ball";
      if(S.s < 2){ S.s++; msg = `Foul ball, strike ${S.s}. A foul counts as a strike until the batter has two.`; }
      else msg = "Foul ball with two strikes. The count stays the same, and the batter lives to swing again."; }
    else { head = "In play"; const h = Math.random();
      if(h < .36){ S.b = S.s = 0;
        if(S.bases[0] && S.o < 2 && Math.random() < .35){ S.bases[0] = false; S.o++; msg = out("Ground ball, and they turn a double play! The runner from first is forced out at second, then the batter at first."); }
        else { if(S.bases[2] && S.o < 2 && Math.random() < .4){ S.bases[2] = false; S.runs++; msg = out("Ground ball to second, thrown to first for the out. The runner from third scores on the play."); } else msg = out("Ground ball to the shortstop, thrown to first in time. The batter is out."); } }
      else if(h < .68){ S.b = S.s = 0;
        if(S.bases[2] && S.o < 2 && Math.random() < .5){ S.bases[2] = false; S.runs++; msg = out("Deep fly ball, caught. The runner on third tags up and scores: a sacrifice fly."); }
        else msg = out("Fly ball to center field, caught before it lands. The batter is out."); }
      else { S.b = S.s = 0; const k = Math.random(); let n;
        if(k < .66){ n = advance(1, true); msg = "Single! The batter reaches first and runners move up." + runsText(n); }
        else if(k < .86){ n = advance(2, true); msg = "Double into the gap! The batter cruises into second." + runsText(n); }
        else if(k < .9){ n = advance(3, true); msg = "Triple! The batter races all the way to third." + runsText(n); }
        else { n = advance(4, true); msg = (n === 4 ? "Grand slam! A home run with the bases loaded brings in four runs." : "Home run! The ball clears the wall, and the batter and every runner score.") + runsText(n).replace("!", "."); } } }
    $("pMsg").textContent = msg; log(msg.split(/(?<=[.!]) /)[0]);
    $("pHint").textContent = S.over ? `Final for this half-inning: ${S.runs} run${S.runs === 1 ? "" : "s"}.` : S.b === 3 && S.s === 2 ? "Full count: 3 balls, 2 strikes. The next pitch decides a lot." : S.s === 2 ? "Two strikes. One more and the batter is out, but fouls won't finish them." : "Count: balls first, then strikes.";
    draw();
  }
  $("pitchBtn").addEventListener("click", pitch);
  $("newInning").addEventListener("click", () => { Object.assign(S,{b:0,s:0,o:0,bases:[false,false,false],runs:0,over:false}); $("pMsg").textContent = "New half-inning. Nobody on, nobody out."; $("pHint").textContent = "Count: balls first, then strikes."; $("pLog").innerHTML = ""; draw(); });
  draw();
}

/* Small diamond for scoring and out cards */
function miniDiamond(body){
  return `<svg viewBox="32 0 136 130" aria-hidden="true"><rect width="200" height="130" fill="#1C4D2C"/><path d="M100 125L15 40Q100 -20 185 40Z" fill="${GRASS}"/>
    <path d="M100 128L140 88Q100 30 60 88Z" fill="${DIRT}"/><path d="M100 116L128 88L100 60L72 88Z" fill="${GRASS}"/>
    ${[[128,88],[100,60],[72,88]].map(([x,y]) => `<rect x="${x-4}" y="${y-4}" width="8" height="8" fill="#fff" transform="rotate(45 ${x} ${y})"/>`).join("")}<path d="M96 113h8v4l-4 4-4-4z" fill="#fff"/>${body}</svg>`;
}
const run = (x,y) => `<circle cx="${x}" cy="${y}" r="5" fill="#2F6FD6" stroke="#0A110D" stroke-width="1.5"/>`;
const fld = (x,y) => `<circle cx="${x}" cy="${y}" r="5" fill="#C8482F" stroke="#0A110D" stroke-width="1.5"/>`;
const ball = (x,y) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" stroke="#0A110D" stroke-width="1"/>`;
const dash = (d,c="#F2C230") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="5 4"/>`;
const SCORES = [
  {pts:1, name:"Run", text:"A runner who touches first, second, third, and then home scores a run. Runs are the only points in baseball.", art: miniDiamond(dash("M72 88L100 116","#2F6FD6") + run(100,116))},
  {pts:"1-4", name:"Home run", text:"Hit the ball over the outfield wall in fair territory. The batter and every runner on base all score.", art: miniDiamond(dash("M100 118Q100 0 150 6") + ball(150,6))},
  {pts:4, name:"Grand slam", text:"A home run with runners on all three bases: four runs on one swing, the most possible.", art: miniDiamond(run(128,88) + run(100,60) + run(72,88) + dash("M100 118Q60 0 40 10") + ball(40,10))},
  {pts:1, name:"Sacrifice fly", text:"With a runner on third and fewer than two outs, a caught fly ball still lets that runner tag up and score.", art: miniDiamond(fld(100,24) + dash("M100 118Q100 0 100 24") + dash("M72 88L100 116","#2F6FD6") + run(84,100))}
];
const OUTS = [
  {name:"Strikeout", text:"Three strikes on the batter. Swinging and missing, a called strike in the zone, or a foul with fewer than two strikes all count.", art: miniDiamond(`<text x="100" y="70" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="48" fill="#fff">K</text>`)},
  {name:"Fly out", text:"A batted ball caught in the air before it touches the ground, fair or foul.", art: miniDiamond(fld(60,26) + dash("M100 118Q70 0 60 26") + ball(60,26))},
  {name:"Ground out", text:"A fielder grabs a ground ball and throws to first before the batter gets there.", art: miniDiamond(fld(86,74) + dash("M100 118L86 76") + dash("M88 74L126 86","#fff") + fld(128,88))},
  {name:"Force out", text:"When a runner must move up because the batter is running, a fielder just needs to touch the next base with the ball before the runner arrives.", art: miniDiamond(run(114,74) + dash("M128 88L102 62","#2F6FD6") + fld(100,60) + ball(104,58))},
  {name:"Tag out", text:"A runner who isn't forced, or who is off a base, is out when a fielder touches them with the ball.", art: miniDiamond(run(80,80) + fld(74,86) + ball(77,83))},
  {name:"Double play", text:"Two outs on one play, most often a ground ball thrown to second for one out, then on to first for another.", art: miniDiamond(dash("M100 118L90 72") + dash("M90 72L100 62L126 86","#fff") + fld(100,60) + fld(128,88))}
];
const CALLS = [
  {name:"Strike or out", what:"A raised fist, often with a hammering motion. Umpires add their own flair on strike three.", cost:"Used for called strikes and for outs on the bases.", arms:'<path d="M56 38l20-10-2-22"/><circle cx="74" cy="4" r="5" fill="currentColor"/><path d="M44 38l-6 30"/>'},
  {name:"Safe", what:"Both arms swept out flat to the sides.", cost:"The runner reached the base before the tag or throw.", arms:'<path d="M44 38H8"/><path d="M56 38h36"/>'},
  {name:"Ball", what:"Usually no signal at all. The plate umpire simply doesn't call a strike.", cost:"Four balls and the batter walks to first.", arms:'<path d="M44 38l-6 30"/><path d="M56 38l6 30"/>'},
  {name:"Fair ball", what:"The umpire points toward fair territory.", cost:"The ball is live, and runners may advance.", arms:'<path d="M56 38l32-14"/><path d="M44 38l-6 30"/>'},
  {name:"Foul ball", what:"Both arms thrown up to call the ball dead.", cost:"A strike, unless the batter already has two. Runners return to their bases.", arms:'<path d="M44 38L30 2"/><path d="M56 38l14-36"/>'},
  {name:"Home run", what:"An index finger raised and twirled in a circle above the head.", cost:"The batter and all runners may round the bases and score.", arms:'<path d="M56 38l6-36"/><path d="M50 -6a14 6 0 1 0 26 2" stroke-width="2.5"/><path d="M44 38l-6 30"/>'}
];

const CLOCK = [
  {k:"i1", cls:"q", t:"1st to 6th", s:"Innings", info:["Innings 1 to 6","Each inning has a top half, when the visiting team bats, and a bottom half for the home team. A half-inning ends after three outs, however long that takes. There's no game clock."]},
  {k:"i7", cls:"half", t:"7th", s:"Stretch", info:["7th inning","Between the halves of the 7th, fans stand and stretch, and many ballparks sing together. It's a tradition, not a rule."]},
  {k:"i8", cls:"half", t:"8th", s:"Bullpen", info:["8th inning","Teams lean on their best relief pitchers late in close games, often a setup pitcher in the 8th and a closer in the 9th."]},
  {k:"i9", cls:"half", t:"9th", s:"Last", info:["9th inning","If the home team is ahead after the top of the 9th, the game ends without a bottom half. If the home team takes the lead in the bottom of the 9th, the game ends right then: a walk-off."]},
  {k:"x", cls:"ot", t:"Extra", s:"If tied", info:["Extra innings","MLB games don't end in ties. Teams keep playing full innings until one leads at the end of one. In the regular season, each extra half-inning starts with a runner already on second base."]}
];
const TRICKY = [
  ["What's the infield fly rule?","With runners on first and second (or the bases loaded) and fewer than two outs, an easy pop-up over the infield is an automatic out. It stops fielders from dropping it on purpose to turn a double play."],
  ["Why isn't a foul ball ever strike three?","A foul counts as a strike only until the batter has two. After that, fouls don't change the count, so a batter can keep fouling off pitches. The exception: a foul bunt with two strikes is a strikeout."],
  ["What does tagging up mean?","On a fly ball, a runner must be touching their base when the ball is caught before running to the next one. Leave too early and the defense can throw back to that base for an out."],
  ["What's a balk?","An illegal motion by the pitcher with runners on base, like starting the delivery and then stopping. Every runner moves up one base."],
  ["Can a batter reach base after strike three?","Yes. If the catcher doesn't catch strike three cleanly and first base is open (or there are two outs), the batter can run. The defense then has to tag him or throw to first."],
  ["Does the tie go to the runner?","In effect, yes. A runner is out only if the ball beats them to the base, so if the umpire sees a true tie, the runner is safe. In practice, umpires almost always see one arriving first."]
];
const WORDS = [
  ["Count","Balls and strikes on the batter, always said balls first: 2 and 1 means two balls, one strike."],
  ["Full count","Three balls and two strikes. The next pitch can end the at-bat either way."],
  ["RBI","Run batted in. Credit to a batter whose hit, walk, or out drives in a run."],
  ["ERA","Earned run average: how many earned runs a pitcher allows per nine innings. Lower is better."],
  ["Bullpen","The area where relief pitchers warm up, and the group of relievers themselves."],
  ["Walk","Reaching first base after four balls. Also called a base on balls."],
  ["Stolen base","A runner takes the next base while the pitcher throws, without the ball being hit."],
  ["Bunt","Tapping the ball softly into the infield without a full swing, often to move a runner up."],
  ["Lineup","The batting order of nine players. It repeats from the top all game."],
  ["Walk-off","A hit in the bottom of the last inning that wins the game, so everyone walks off the field."]
];

const zoneMini = () => `<svg viewBox="150 230 220 260" style="width:170px;border-radius:8px" aria-hidden="true"><rect x="150" y="230" width="220" height="260" fill="#1C4D2C"/>
  <rect x="${ZONE.x0}" y="${ZONE.y0}" width="136" height="192" fill="#F2C230" fill-opacity=".12" stroke="#F2C230" stroke-width="3" stroke-dasharray="10 7"/>
  <circle cx="${ZONE.x1 + 8}" cy="${ZONE.y0 + 40}" r="${BALL_R}" fill="#fff" stroke="#C8482F" stroke-width="2.5"/></svg>`;
const QUIZ = [
  {q:"How many strikes for a strikeout?", o:["2","3","4","5"], a:1, why:"Three strikes and the batter is out."},
  {q:"How many balls for a walk?", o:["4","3","5","6"], a:0, why:"Four balls and the batter walks to first base."},
  {q:"The batter doesn't swing at this pitch. It just clips the edge of the zone. What's the call?", visual: zoneMini, o:["Ball","Foul ball","Strike","Hit by pitch"], a:2, why:"Any part of the ball touching the strike zone makes it a strike."},
  {q:"With two strikes, the batter hits a foul ball. What happens?", o:["Strike three","The count stays the same","The batter walks","A ball is added"], a:1, why:"Fouls don't count as strike three, so the count doesn't change."},
  {q:"A fly ball hits the foul pole. What's the call?", o:["Foul ball","Ground-rule double","Home run","Do-over"], a:2, why:"The foul pole is in fair territory, so a ball that hits it is a home run."},
  {q:"The umpire makes this signal at second base. What's the call?", visual:() => fig(CALLS[1].arms), o:["Out","Strike","Foul ball","Safe"], a:3, why:"Arms swept out flat to the sides means safe. The runner beat the tag."},
  {q:"How many outs end a half-inning?", o:["3","2","4","9"], a:0, why:"Three outs, then the teams switch between batting and fielding."},
  {q:"A batter hits a home run with the bases loaded. How many runs score?", o:["1","3","4","2"], a:2, why:"Three runners plus the batter: four runs, a grand slam."},
  {q:"The home team leads after the top of the 9th. What happens?", o:["They bat anyway","The game ends","An extra inning is played","The visitors bat again"], a:1, why:"The home team already has the win, so the bottom of the 9th isn't needed."},
  {q:"A batted ball is caught in the air by an outfielder before it bounces. What's the result?", o:["A single","A ground-rule double","The batter is out","A foul ball"], a:2, why:"A ball caught on the fly is an out, whether it's fair or foul."}
];

function render(app){
  app.innerHTML = sportHero({id:"baseball", name:"Baseball", alt:"The tabby cat in a white baseball uniform, swinging a bat",
      lede:"Two teams take turns batting and fielding. The batter tries to hit the pitcher's throw and run around four bases to score. The fielding team tries to get three outs to end the inning. After nine innings, the team with more runs wins.",
      facts:[["9","players in the field"],["9","innings in a game"],["3","outs per half-inning"],["90","feet between bases"]]})
    + jumpNav([["bb-field","The field"],["bb-zone","Strike zone"],["bb-inning","Play an inning"],["bb-score","Scoring"],["bb-outs","Making outs"],["bb-calls","Umpire calls"],["bb-clock","Innings"],["bb-tricky","Tricky rules"],["bb-words","Words you'll hear"],["bb-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("bb-field","The field","Tap any part of the field to see what it does.",
        `<div class="fieldbox" id="bbField">${fieldSVG()}</div><div class="fieldrow"><div class="zonechips" id="bbChips"></div><div class="infopanel" id="bbInfo" aria-live="polite"></div></div>`)
    + section("bb-zone","Call the pitch","You're the umpire. Click to throw pitches at the batter. The strike zone runs from just below the knee to the middle of the torso, over the 17-inch-wide plate.",
        `<div class="oslab"><div class="fieldbox">${zoneSVG()}</div>
          <div class="osside"><div class="osverdict"><span id="zoneCalled" class="verdict on">Pitch</span><span id="zoneTally" style="color:#A9B8AE">0 strikes, 0 balls</span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="zoneMsg">Click anywhere to throw. Pitches that touch the dashed box are strikes.</p></div>
            <div class="controls"><button class="btn" id="zoneClear" type="button">Clear pitches</button></div>
            <p class="note">The zone moves with each batter's height and stance, which is why taller players have bigger zones.</p></div></div>`)
    + section("bb-inning","Play a half-inning","You're watching from the stands. Throw pitches one at a time and follow the count, the outs, and the runners until the side is retired.",
        `<div class="sim"><div class="board bboard">
            <div class="count"><small>Balls</small><span id="cB" class="lights"></span></div>
            <div class="count"><small>Strikes</small><span id="cS" class="lights"></span></div>
            <div class="count"><small>Outs</small><span id="cO" class="lights"></span></div>
            <div><small>Bases</small>${diamondSVG()}</div>
            <div><small>Runs</small><b id="cRuns">0</b></div></div>
          <div class="controls"><button class="btn primary" id="pitchBtn" type="button">Throw the next pitch</button><button class="btn primary" id="newInning" type="button" hidden>Start a new half-inning</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="pMsg">Nobody on, nobody out. Throw the first pitch.</p><p class="hint" id="pHint">Count: balls first, then strikes.</p></div></div>
          <ul class="log" id="pLog"></ul></div>`)
    + section("bb-score","Scoring","Only one thing scores in baseball: a runner crossing home plate.",
        `<div class="scoring">${SCORES.map(s => `<div class="score">${s.art}<div class="pts">${s.pts}<small>${s.pts===1?"run":"runs"}</small></div><h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("bb-outs","Making outs","The fielding team needs three outs to end each half-inning. Blue is a runner, red is a fielder.",
        `<div class="scoring restarts">${OUTS.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("bb-calls","Umpire calls","The umpires use these signals so the whole ballpark knows the call.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("bb-clock","Innings","Baseball has no game clock. Tap a part of the game to learn what happens there.",
        `<div class="timeline" id="bbTimeline"></div><div class="infopanel" id="bbClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("bb-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="bbFlips"></div>`)
    + section("bb-words","Words you'll hear","",`<dl class="gloss" id="bbGloss"></dl>`)
    + section("bb-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="bbQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow Major League Baseball. Youth, college, and softball games differ in field size, game length, and some rules.</footer></div>`;

  setupZones(document.getElementById("bbField"), document.getElementById("bbChips"), document.getElementById("bbInfo"), ZONES, ZONE_ORDER, "bases");
  strikeZone();
  inningSim();
  setupTimeline(document.getElementById("bbTimeline"), document.getElementById("bbClockInfo"), CLOCK,
    "Since 2023, MLB uses a pitch clock: the pitcher has 15 seconds to start a pitch with the bases empty and 18 seconds with runners on. Most games now finish in a little under three hours.");
  flipCards(document.getElementById("bbFlips"), TRICKY);
  glossary(document.getElementById("bbGloss"), WORDS);
  makeQuiz(document.getElementById("bbQuiz"), QUIZ, [
    "You'd make a great umpire. Watch a game and try calling balls and strikes before the umpire does.",
    "Solid at-bat. Play another half-inning in the simulator and you'll have the count down cold.",
    "Try the strike zone and the outs cards again, then take another swing at the quiz.",
    "No worries. Start with the field diagram and the half-inning simulator, then come back."]);
}

SPORT_PAGES["baseball"] = {render};
})();

/* Tennis. Rules follow the ITF Rules of Tennis used on the ATP and WTA tours. */
(function(){

const W = "#F4F6F1", COURT = "#3A6EA5", OUT = "#2A6B3F", INK = "#18221D", BALL = "#D7E84A";
/* Court 78 x 36 ft at 10 units per foot. Net x=390, service lines x=180/600, singles sidelines y=45/315, center service line y=180. */
function courtLines(){
  return `<rect x="-70" y="-50" width="920" height="460" fill="${OUT}"/><rect width="780" height="360" fill="${COURT}"/>
    <g stroke="${W}" stroke-width="4" fill="none"><rect width="780" height="360"/><line x1="0" y1="45" x2="780" y2="45"/><line x1="0" y1="315" x2="780" y2="315"/>
    <line x1="180" y1="45" x2="180" y2="315"/><line x1="600" y1="45" x2="600" y2="315"/><line x1="180" y1="180" x2="600" y2="180"/>
    <line x1="0" y1="180" x2="12" y2="180"/><line x1="768" y1="180" x2="780" y2="180"/></g>
    <line x1="390" y1="-30" x2="390" y2="390" stroke="${INK}" stroke-width="7"/><line x1="390" y1="-30" x2="390" y2="390" stroke="${W}" stroke-width="2"/>
    <circle cx="390" cy="-30" r="7" fill="${INK}"/><circle cx="390" cy="390" r="7" fill="${INK}"/>`;
}
function courtSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-70 -50 920 460" role="img" aria-label="Top-down diagram of a tennis court">${courtLines()}
    ${r("back",6,51,174,258)}${r("back",600,51,174,258)}
    ${r("deuce",180,180,210,135)}${r("ad",180,45,210,135)}${r("deuce",390,45,210,135)}${r("ad",390,180,210,135)}
    ${r("alley",0,0,780,45)}${r("alley",0,315,780,45)}
    ${r("baseline",-8,0,16,360)}${r("baseline",772,0,16,360)}${r("sideline",0,39,780,12)}${r("sideline",0,309,780,12)}
    ${r("serviceline",174,45,12,270)}${r("serviceline",594,45,12,270)}${r("centerline",180,174,420,12)}
    <circle class="hz" data-zone="mark" cx="4" cy="180" r="16"/><circle class="hz" data-zone="mark" cx="776" cy="180" r="16"/>
    ${r("net",382,-40,16,440)}</svg>`;
}
const ZONES = {
  net:{title:"Net", text:"3 feet high at the center and 3.5 feet at the posts. Every shot must clear it. A player who touches the net while the ball is in play loses the point."},
  baseline:{title:"Baseline", text:"The back line. Servers stand behind it, and many rallies are played from just behind it. Stepping on it while serving is a foot fault."},
  mark:{title:"Center mark", text:"A short dash in the middle of each baseline. The server stands on one side of it: the right side for the deuce court, the left for the ad court."},
  sideline:{title:"Singles sidelines", text:"The inner side lines mark the court for singles. A ball touching any part of the line is in."},
  alley:{title:"Doubles alleys", text:"The strips between the singles and doubles sidelines. They're in play only in doubles, which uses a court 9 feet wider."},
  deuce:{title:"Deuce service boxes", text:"Each point starts with a serve that must land in the box diagonally across the net. When the points played in a game are even (0-0, 15-15, deuce), the server stands on the right and aims here."},
  ad:{title:"Ad service boxes", text:"When an odd number of points have been played in the game (15-0, 30-15, advantage), the server moves to the left side and serves diagonally into this box."},
  serviceline:{title:"Service lines", text:"The back edge of the service boxes, 21 feet from the net. A serve that lands past it is a fault."},
  centerline:{title:"Center service line", text:"Splits the two service boxes on each side. It's only used for serving; during a rally, the whole singles court is in."},
  back:{title:"Backcourt", text:"The area between the service line and the baseline, where most rallies are played after the serve."}
};
const ZONE_ORDER = ["net","baseline","mark","sideline","alley","deuce","ad","serviceline","centerline","back"];

/* Scoreboard simulator with serve positions. Player 0 is "You" (left end), player 1 is "Them" (right end). */
const NAMES = ["You","Them"], SUBJ = ["You","They"], CALL = ["love","15","30","40"];
function simCourtSVG(){
  return `<svg viewBox="-70 -50 920 460" role="img" aria-label="Who serves and where">${courtLines()}
    <rect id="tTarget" width="210" height="135" fill="#F2C230" opacity=".35"/>
    <g class="mv" id="tServer"><circle r="18" fill="#2F6FD6" stroke="${INK}" stroke-width="3"/></g>
    <text id="tSide" x="390" y="400" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="24" fill="${W}"></text></svg>`;
}
function scoreSim(){
  const $ = id => document.getElementById(id);
  const S = {p:[0,0], g:[0,0], sets:[], won:[0,0], server:0, tb:false, tbFirst:0, over:false};
  const total = () => S.p[0] + S.p[1];
  function call(){
    const [a,b] = S.p, s = S.server, r = 1 - s;
    if(S.tb) return `Tiebreak ${S.p[s]}-${S.p[r]}`;
    if(a >= 3 && b >= 3) return a === b ? "Deuce" : `Advantage ${NAMES[a > b ? 0 : 1]}`;
    return S.p[s] === S.p[r] ? `${CALL[S.p[s]]}-all` : `${CALL[S.p[s]]}-${CALL[S.p[r]]}`;
  }
  function draw(){
    const rows = [0,1].map(i => `<tr><th>${S.server === i && !S.over ? '<i class="srv"></i>' : ""}${NAMES[i]}</th>${S.sets.map(st => `<td class="${st[i] > st[1-i] ? "w" : ""}">${st[i]}${st.tb ? `<sup>${st.tb[i]}</sup>` : ""}</td>`).join("")}<td class="cur">${S.over ? "" : S.g[i]}</td><td class="pts">${S.over ? "" : S.tb ? S.p[i] : (S.p[0] >= 3 && S.p[1] >= 3 ? (S.p[i] > S.p[1-i] ? "AD" : "40") : CALL[S.p[i]] === "love" ? "0" : CALL[S.p[i]])}</td></tr>`).join("");
    $("tBoard").innerHTML = `<table class="tscore"><thead><tr><th></th>${S.sets.map((_,k) => `<th>Set ${k+1}</th>`).join("")}<th>${S.over ? "" : "Games"}</th><th>${S.over ? "" : "Points"}</th></tr></thead><tbody>${rows}</tbody></table>`;
    $("tCall").textContent = S.over ? `Game, set, and match: ${NAMES[S.won[0] === 2 ? 0 : 1]}` : call();
    const deuceSide = total() % 2 === 0, you = S.server === 0;
    const sy = you ? (deuceSide ? 250 : 110) : (deuceSide ? 110 : 250);
    $("tServer").style.transform = `translate(${you ? -30 : 810}px, ${sy}px)`;
    const tx = you ? 390 : 180, ty = you ? (deuceSide ? 45 : 180) : (deuceSide ? 180 : 45);
    $("tTarget").setAttribute("x", tx); $("tTarget").setAttribute("y", ty); $("tTarget").style.display = $("tServer").style.display = S.over ? "none" : "";
    $("tSide").textContent = S.over ? "" : `${NAMES[S.server]} serving from the ${deuceSide ? "deuce (right)" : "ad (left)"} side`;
    ["tWinY","tWinT","tRand"].forEach(id => $(id).hidden = S.over); $("tNew").hidden = !S.over;
  }
  function endSet(w, tbScores){
    const st = [S.g[0], S.g[1]]; if(tbScores) st.tb = tbScores; S.sets.push(st); S.won[w]++;
    S.g = [0,0]; S.p = [0,0]; S.tb = false;
    if(S.won[w] === 2){ S.over = true; return ` That's the match: ${SUBJ[w]} win in ${S.sets.length} sets.`; }
    return ` ${SUBJ[w]} take the set ${st[w]}-${st[1-w]}.`;
  }
  function point(w){
    if(S.over) return;
    const l = 1 - w, srv = S.server; let msg = "";
    S.p[w]++;
    if(S.tb){
      if(S.p[w] >= 7 && S.p[w] - S.p[l] >= 2){
        S.g[w]++; const tb = [S.p[0], S.p[1]]; msg = `${SUBJ[w]} win the tiebreak ${S.p[w]}-${S.p[l]}, so the set goes 7-6.`;
        S.server = 1 - S.tbFirst; msg += endSet(w, tb);
      } else {
        if(total() % 2 === 1) S.server = 1 - S.server;
        msg = `Tiebreak point to ${NAMES[w]}. First to 7, win by 2. The serve switches after the first point, then every two points.`;
      }
    } else if(S.p[w] >= 4 && S.p[w] - S.p[l] >= 2){
      S.g[w]++; S.p = [0,0];
      msg = w === srv ? `Game, ${NAMES[w]}. The server held serve.` : `Game, ${NAMES[w]}. That's a break of serve: the receiver won the game.`;
      S.server = 1 - srv;
      const [a,b] = [S.g[w], S.g[l]];
      if(a >= 6 && a - b >= 2) msg += endSet(w);
      else if(S.g[0] === 6 && S.g[1] === 6){ S.tb = true; S.tbFirst = S.server; msg += " Six games all: time for a tiebreak."; }
      else msg += ` ${SUBJ[S.server]} serve the next game.`;
    } else {
      const c = call();
      msg = c === "Deuce" ? "Deuce: 40-all. Someone now needs two points in a row to win the game."
        : c.startsWith("Advantage") ? `${c}. Win the next point to take the game; lose it and it's back to deuce.`
        : `${c}. The server's score is always called first.${S.p[0] + S.p[1] === 1 ? " Zero is called love." : ""}`;
    }
    $("tMsg").textContent = msg; draw();
  }
  $("tWinY").addEventListener("click", () => point(0));
  $("tWinT").addEventListener("click", () => point(1));
  $("tRand").addEventListener("click", () => point(Math.random() < .62 ? S.server : 1 - S.server));
  $("tNew").addEventListener("click", () => { Object.assign(S, {p:[0,0], g:[0,0], sets:[], won:[0,0], server:0, tb:false, over:false}); $("tMsg").textContent = "New match, best of three sets. You serve first."; draw(); });
  draw();
}

/* Points ladder with the deuce loop */
const ladder = () => `<svg viewBox="0 0 760 236" class="ladder" role="img" aria-label="Tennis points: love, 15, 30, 40, game, with deuce and advantage">
  <rect width="760" height="236" rx="10" fill="#14201A"/>
  ${[["0","Love",60],["15","Fifteen",190],["30","Thirty",320],["40","Forty",450]].map(([n,l,x]) => `<rect x="${x-50}" y="30" width="100" height="70" rx="8" fill="#203229" stroke="#3B5045"/><text x="${x}" y="72" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="36" fill="#F2C230">${n}</text><text x="${x}" y="122" text-anchor="middle" font-family="Barlow,sans-serif" font-size="15" fill="#A9B8AE">${l}</text>`).join("")}
  ${[110,240,370].map(x => `<path d="M${x+2} 65h26" stroke="#EEF3EC" stroke-width="3"/><path d="M${x+22} 58l8 7-8 7" fill="none" stroke="#EEF3EC" stroke-width="3"/>`).join("")}
  <path d="M502 65h96" stroke="#EEF3EC" stroke-width="3"/><path d="M590 58l8 7-8 7" fill="none" stroke="#EEF3EC" stroke-width="3"/>
  <rect x="610" y="30" width="120" height="70" rx="8" fill="#2A6B3F"/><text x="670" y="74" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="32" fill="#fff">Game</text>
  <text x="550" y="54" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#A9B8AE">win next point</text>
  <path d="M450 132v20h-40" stroke="#EEF3EC" stroke-width="2.5" stroke-dasharray="6 5" fill="none"/>
  <rect x="290" y="128" width="120" height="50" rx="8" fill="#203229" stroke="#F2C230"/><text x="350" y="160" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="26" fill="#F2C230">Deuce</text>
  <text x="225" y="158" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#A9B8AE">if both reach 40</text>
  <path d="M410 153h80" stroke="#EEF3EC" stroke-width="3"/><path d="M482 146l8 7-8 7" fill="none" stroke="#EEF3EC" stroke-width="3"/>
  <rect x="495" y="128" width="130" height="50" rx="8" fill="#203229" stroke="#3B5045"/><text x="560" y="160" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="24" fill="#EEF3EC">Advantage</text>
  <path d="M625 150h20q25 0 25 -25v-20" stroke="#EEF3EC" stroke-width="3" fill="none"/><path d="M663 112l7-8 7 8" fill="none" stroke="#EEF3EC" stroke-width="3"/>
  <path d="M560 180q0 22 -100 22t-110 -22" stroke="#C8482F" stroke-width="2.5" fill="none" stroke-dasharray="6 5"/>
  <text x="455" y="224" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#E89A8C">lose it: back to deuce</text></svg>`;

/* Half-court art for the calls cards: receiver's half, net on the left. */
const half = body => `<svg viewBox="360 -20 450 400" aria-hidden="true"><rect x="360" y="-20" width="450" height="400" fill="${OUT}"/><rect x="390" width="390" height="360" fill="${COURT}"/>
  <g stroke="${W}" stroke-width="4" fill="none"><rect x="390" width="390" height="360"/><line x1="390" y1="45" x2="780" y2="45"/><line x1="390" y1="315" x2="780" y2="315"/><line x1="600" y1="45" x2="600" y2="315"/><line x1="390" y1="180" x2="600" y2="180"/></g>
  <line x1="390" y1="-20" x2="390" y2="380" stroke="${INK}" stroke-width="8"/>${body}</svg>`;
const tb = (x,y) => `<circle cx="${x}" cy="${y}" r="13" fill="${BALL}" stroke="${INK}" stroke-width="2.5"/>`;
const xm = (x,y) => `<path d="M${x-16} ${y-16}l32 32M${x+16} ${y-16}l-32 32" stroke="#FF4D3D" stroke-width="7" stroke-linecap="round"/>`;
const tr = d => `<path d="${d}" fill="none" stroke="#F2C230" stroke-width="5" stroke-dasharray="12 9"/>`;
const CALLS = [
  {name:"Fault", text:"A serve that misses the service box or hits the net and falls back. The server gets a second try.", art: half(`<rect x="390" y="45" width="210" height="135" fill="#F2C230" opacity=".25"/>` + tr("M370 300L640 120") + tb(645,118) + xm(645,118))},
  {name:"Double fault", text:"Missing both serves. The point goes to the receiver.", art: half(`<rect x="390" y="45" width="210" height="135" fill="#F2C230" opacity=".25"/>` + xm(650,110) + xm(560,20))},
  {name:"Let", text:"A serve that clips the top of the net and still lands in the right box. It's replayed, with no penalty.", art: half(`<rect x="390" y="45" width="210" height="135" fill="#F2C230" opacity=".25"/>` + tr("M370 200Q392 150 400 170L520 110") + tb(520,110) + tb(392,152))},
  {name:"Foot fault", text:"The server steps on the baseline or into the court before hitting the ball. It counts as a fault.", art: `<svg viewBox="-60 40 315 280" aria-hidden="true"><rect x="-60" y="40" width="315" height="280" fill="${OUT}"/><rect x="0" y="40" width="255" height="280" fill="${COURT}"/><line x1="0" y1="40" x2="0" y2="320" stroke="${W}" stroke-width="8"/><line x1="0" y1="180" x2="20" y2="180" stroke="${W}" stroke-width="6"/>
    <ellipse cx="2" cy="230" rx="26" ry="12" fill="#18221D"/><ellipse cx="-34" cy="270" rx="26" ry="12" fill="#18221D" opacity=".6"/>${xm(2,230)}</svg>`},
  {name:"Out", text:"A ball that lands completely outside the lines. If any part of it touches a line, it's in.", art: half(tb(780,200) + `<text x="700" y="190" text-anchor="end" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="34" fill="#fff">In</text>` + tb(797,90) + `<text x="700" y="100" text-anchor="end" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="34" fill="#FF4D3D">Out</text>`)},
  {name:"Double bounce", text:"A player must hit the ball before it bounces twice on their side. A second bounce ends the point.", art: half(tr("M400 260Q480 120 560 260Q610 170 660 260") + tb(560,260) + tb(660,260) + `<text x="560" y="300" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="28" fill="#fff">1</text><text x="660" y="300" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="28" fill="#FF4D3D">2</text>`)}
];

const CLOCK = [
  {k:"s1", cls:"q", t:"Set 1", s:"6 games", info:["Set 1","The first player to win 6 games, by at least 2, wins the set: 6-4 or 7-5. At 6-6, a tiebreak decides it, and the set ends 7-6."]},
  {k:"s2", cls:"q", t:"Set 2", s:"6 games", info:["Set 2","Most tour matches are best of three sets, so winning the first two ends the match."]},
  {k:"s3", cls:"q", t:"Set 3", s:"Decider", info:["Set 3","The deciding set in a best-of-three match. At the Grand Slams, a final set that reaches 6-6 is decided by a first-to-10 tiebreak, win by 2."]},
  {k:"s4", cls:"ot", t:"Set 4", s:"Slams", info:["Set 4","Men's singles at the four Grand Slams (Australian Open, French Open, Wimbledon, US Open) is best of five sets, so a fourth and fifth set may be needed."]},
  {k:"s5", cls:"ot", t:"Set 5", s:"Slams", info:["Set 5","The final set of a best-of-five match. Matches like this can run four or five hours."]}
];

const TRICKY = [
  ["Why is zero called love?","Nobody knows for sure. Popular theories trace it to the French word for egg, l'oeuf, for its shape, or to the idea of playing for love rather than money."],
  ["Why does scoring go 15, 30, 40?","Another mystery. One theory points to a clock face with quarters at 15, 30, and 45, with 45 shortened to 40 over time."],
  ["Can a let happen forever?","Yes. There's no limit on lets: the server keeps serving again as long as the serve clips the net and lands in. Some college and lower-level events play 'no-let,' where it stays in play."],
  ["What if the ball hits a player?","If the ball touches a player or their clothing before it bounces, that player loses the point, even if they were standing outside the court."],
  ["Can you hit the ball before it bounces?","Yes, that's a volley, and it's legal anywhere except when returning a serve, which must bounce first."],
  ["What's a challenge?","At events using camera line calling, players can challenge a line call they think is wrong. Many big tournaments now use fully electronic line calling, so every call comes from cameras."]
];
const WORDS = [
  ["Ace","A serve the receiver doesn't touch at all."],
  ["Break","Winning a game while the other player is serving."],
  ["Break point","A point that would give the receiver a break if they win it."],
  ["Hold","Winning a game on your own serve."],
  ["Rally","The back-and-forth of shots after the serve."],
  ["Volley","Hitting the ball before it bounces, usually near the net."],
  ["Drop shot","A soft shot that barely clears the net and dies quickly."],
  ["Lob","A high shot over an opponent who's close to the net."],
  ["Unforced error","A missed shot that wasn't caused by a tough shot from the opponent."],
  ["Grand Slam","The four biggest tournaments: the Australian Open, French Open, Wimbledon, and US Open."]
];

const lineMini = () => `<svg viewBox="560 120 260 170" style="width:220px;border-radius:8px" aria-hidden="true"><rect x="560" y="120" width="260" height="170" fill="${OUT}"/><rect x="560" y="120" width="220" height="170" fill="${COURT}"/>
  <line x1="780" y1="120" x2="780" y2="290" stroke="${W}" stroke-width="8"/><circle cx="790" cy="205" r="13" fill="${BALL}" stroke="${INK}" stroke-width="2.5"/></svg>`;
const serveMini = () => `<svg viewBox="-60 -30 900 420" style="width:280px;border-radius:8px" aria-hidden="true">${courtLines()}
  <circle cx="-30" cy="250" r="20" fill="#2F6FD6" stroke="${INK}" stroke-width="3"/>
  ${[["A",285,112],["B",285,248],["C",495,112],["D",495,248]].map(([l,x,y]) => `<text x="${x}" y="${y+18}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="56" fill="#fff">${l}</text>`).join("")}</svg>`;
const QUIZ = [
  {q:"The server wins the first point of a game. What's the score?", o:["1-0","15-love","10-0","Love-15"], a:1, why:"Points go love, 15, 30, 40, and the server's score is called first."},
  {q:"Both players reach 40. What's it called?", o:["Tiebreak","Advantage server","Deuce","Game over"], a:2, why:"40-all is deuce. Now someone has to win two points in a row."},
  {q:"From deuce, the receiver wins the next point. What's the call?", o:["Game","Advantage receiver","Back to 30","Deuce again"], a:1, why:"Winning a point from deuce gives you the advantage. Win the next one too and it's your game."},
  {q:"The ball lands like this, just touching the line. What's the call?", visual: lineMini, o:["In","Out","Let","Fault"], a:0, why:"Lines are in. Any part of the ball touching the line counts."},
  {q:"A serve clips the top of the net and lands in the correct service box. What happens?", o:["It's a fault","Point to the receiver","It's a let: serve again","It's an ace"], a:2, why:"That's a let. The serve is replayed with no penalty."},
  {q:"The server misses the first serve and the second serve too. What happens?", o:["They get a third try","Point to the receiver","It's a let","The other player serves"], a:1, why:"That's a double fault, and the receiver wins the point."},
  {q:"How many games do you need to win a set?", o:["4","6, by at least 2","8","10"], a:1, why:"Six games, with a two-game lead. At 6-6, a tiebreak usually decides the set."},
  {q:"A set reaches 6 games all. What usually happens?", o:["A coin toss","The set is replayed","Play continues to 8-6","A tiebreak"], a:3, why:"A tiebreak: first to 7 points, win by 2. The winner takes the set 7-6."},
  {q:"A ball hits a player standing outside the court before it bounces. Who wins the point?", o:["The player who hit the shot","The player who was hit","Nobody: it's a let","The point is replayed"], a:0, why:"A player touched by the ball before it bounces loses the point, wherever they're standing."},
  {q:"It's 15-love, and the blue player is serving. Which box must the serve land in?", visual: serveMini, o:["A","B","C","D"], a:3, why:"One point has been played, an odd number, so the server is on the ad (left) side and serves diagonally into box D."}
];

function render(app){
  app.innerHTML = sportHero({id:"tennis", name:"Tennis", alt:"The tabby cat swinging a tennis racket",
      lede:"Two players (or two pairs in doubles) hit a ball back and forth over a net. A point ends when someone can't return the ball into the other side of the court before it bounces twice. Points build into games, games into sets, and sets into a match.",
      facts:[["4","points to win a game, by 2"],["6","games to win a set, by 2"],["2","serves to get one in"],["3","feet high at the center of the net"]]})
    + jumpNav([["t-court","The court"],["t-points","How scoring works"],["t-sim","Keep score"],["t-calls","Calls"],["t-clock","Match format"],["t-tricky","Tricky rules"],["t-words","Words you'll hear"],["t-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("t-court","The court","Tap any part of the court to see what it does.",
        `<div class="fieldbox" id="tCourt">${courtSVG()}</div><div class="fieldrow"><div class="zonechips" id="tChips"></div><div class="infopanel" id="tInfo" aria-live="polite"></div></div>`)
    + section("t-points","How scoring works","Tennis scoring has three layers: points make games, games make sets, and sets make the match. Points use their own odd numbers.",
        `<div class="fieldbox" style="background:none;padding:0">${ladder()}</div>
        <div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
          <div class="score"><div class="pts">Game</div><p>Win 4 points with a 2-point lead. One player serves the whole game, then the serve switches.</p></div>
          <div class="score"><div class="pts">Set</div><p>Win 6 games with a 2-game lead. At 6-6, a tiebreak to 7 points decides it.</p></div>
          <div class="score"><div class="pts">Match</div><p>Usually best of three sets. Men's Grand Slam singles is best of five.</p></div></div>`)
    + section("t-sim","Keep score","Award points and watch the scoreboard, the umpire's call, and where the server stands. Use the random button to let the server win about 6 points in 10, like on tour.",
        `<div class="sim"><div class="tboardwrap"><div id="tBoard"></div><div class="tcall"><small>Umpire's call</small><b id="tCall">love-all</b></div></div>
          <div class="fieldbox">${simCourtSVG()}</div>
          <div class="controls"><button class="btn" id="tWinY" type="button">Point to You</button><button class="btn" id="tWinT" type="button">Point to Them</button><button class="btn primary" id="tRand" type="button">Play a point</button><button class="btn primary" id="tNew" type="button" hidden>Start a new match</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="tMsg">Best of three sets. You serve first, from the right side, into the yellow box.</p><p class="hint">In a real match players also switch ends every two games. Here everyone stays put so it's easier to follow.</p></div></div></div>`)
    + section("t-calls","Calls","What the umpire and line calls mean. Yellow marks the target service box.",
        `<div class="scoring restarts">${CALLS.map(c => `<div class="score">${c.art}<h3>${c.name}</h3><p>${c.text}</p></div>`).join("")}</div>`)
    + section("t-clock","Match format","Tennis has no game clock. A match lasts until someone wins enough sets. Tap a set to learn more.",
        `<div class="timeline" id="tTimeline"></div><div class="infopanel" id="tClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("t-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="tFlips"></div>`)
    + section("t-words","Words you'll hear","",`<dl class="gloss" id="tGloss"></dl>`)
    + section("t-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="tQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the ITF Rules of Tennis used on the ATP and WTA tours. College and recreational events sometimes use shortcuts like no-ad scoring and no-let serves.</footer></div>`;

  setupZones(document.getElementById("tCourt"), document.getElementById("tChips"), document.getElementById("tInfo"), ZONES, ZONE_ORDER, "deuce");
  scoreSim();
  setupTimeline(document.getElementById("tTimeline"), document.getElementById("tClockInfo"), CLOCK,
    "Players get 25 seconds between points and switch ends after the first game of each set, then every two games, with a 90-second break on most changeovers.");
  flipCards(document.getElementById("tFlips"), TRICKY);
  glossary(document.getElementById("tGloss"), WORDS);
  makeQuiz(document.getElementById("tQuiz"), QUIZ, [
    "Game, set, and match! Watch a match and try calling the score before the umpire does.",
    "Strong serve. Play a few more games on the scoreboard and deuce will feel natural.",
    "Look at the scoring ladder and the calls again, then come back for another try.",
    "No worries. Start with the scoring ladder, then keep score of a game or two, and try again."]);
}

SPORT_PAGES["tennis"] = {render};
})();

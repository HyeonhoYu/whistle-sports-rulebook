/* Badminton. Rules follow the BWF Laws of Badminton. */
(function(){

const W = "#F4F6F1", COURT = "#2F7546", OUT = "#1C4D2C", INK = "#18221D";
/* Court 13.4 x 6.1 m at 50 units per meter. Net x=335. Short service lines x=236/434. Doubles long service lines x=38/632.
   Singles sidelines y=23/282. Center line y=152.5. */
function courtLines(){
  return `<rect x="-60" y="-50" width="790" height="405" fill="${OUT}"/><rect width="670" height="305" fill="${COURT}"/>
    <g stroke="${W}" stroke-width="3" fill="none"><rect width="670" height="305"/><line x1="0" y1="23" x2="670" y2="23"/><line x1="0" y1="282" x2="670" y2="282"/>
    <line x1="236" y1="0" x2="236" y2="305"/><line x1="434" y1="0" x2="434" y2="305"/><line x1="38" y1="0" x2="38" y2="305"/><line x1="632" y1="0" x2="632" y2="305"/>
    <line x1="0" y1="152.5" x2="236" y2="152.5"/><line x1="434" y1="152.5" x2="670" y2="152.5"/></g>
    <line x1="335" y1="-24" x2="335" y2="329" stroke="${INK}" stroke-width="6"/><line x1="335" y1="-24" x2="335" y2="329" stroke="${W}" stroke-width="1.5"/>
    <circle cx="335" cy="-24" r="6" fill="${INK}"/><circle cx="335" cy="329" r="6" fill="${INK}"/>`;
}
function courtSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-60 -50 790 405" role="img" aria-label="Top-down diagram of a badminton court">${courtLines()}
    ${r("court",44,29,186,117)}${r("court",44,159,186,117)}${r("court",440,29,186,117)}${r("court",440,159,186,117)}
    ${r("front",242,29,87,247)}${r("front",341,29,87,247)}
    ${r("sidealley",0,0,670,20)}${r("sidealley",0,285,670,20)}
    ${r("backalley",5,29,30,247)}${r("backalley",635,29,30,247)}
    ${r("shortline",230,0,12,305)}${r("shortline",428,0,12,305)}${r("center",5,147,225,11)}${r("center",440,147,225,11)}
    ${r("dlong",32,0,12,305)}${r("dlong",626,0,12,305)}${r("back",-8,0,13,305)}${r("back",665,0,13,305)}
    ${r("net",327,-34,16,373)}</svg>`;
}
const ZONES = {
  net:{title:"Net", text:"1.55 m (5 ft 1 in) high at the posts and 1.524 m (5 ft) at the center. Touching it with your racket, body, or clothes during a rally is a fault."},
  shortline:{title:"Short service line", text:"1.98 m (6.5 ft) from the net. A serve must reach past it. Serves that fall short are faults, which is why low serves just clear it."},
  front:{title:"Front court", text:"The area between the net and the short service line. Serves can't land here, but in a rally it's prime territory for tight net shots and drops."},
  court:{title:"Service courts", text:"Each half is split into a right and left service court. The server stands in one and serves diagonally into the opposite one, choosing the side by their own score: even on the right, odd on the left."},
  center:{title:"Center line", text:"Divides the right and left service courts. It only matters on the serve; once the rally starts, the whole court is in play."},
  sidealley:{title:"Side alleys", text:"The strips between the inner (singles) and outer (doubles) sidelines. In singles, they're out of bounds the whole time. In doubles, they're in play."},
  backalley:{title:"Back alley", text:"The strip behind the doubles long service line. In doubles, a serve landing here is out, but it's in play during the rally. In singles, it's in play for everything."},
  dlong:{title:"Doubles long service line", text:"The back limit for a doubles serve only. Doubles serves are short and wide; singles serves are long and narrow."},
  back:{title:"Back boundary line", text:"The end of the court for every shot in both singles and doubles. A shuttle landing on the line is in."}
};
const ZONE_ORDER = ["net","shortline","front","court","center","sidealley","backalley","dlong","back"];

/* Service area for a server on the left end ("you") or right end ("them"), by score parity and format. */
function serveBoxes(side, even, doubles){
  const yTop = doubles ? 0 : 23, yBot = doubles ? 305 : 282, back = doubles ? 38 : 0, backR = doubles ? 632 : 670;
  if(side === 0){
    const stand = even ? [back, 152.5, 236 - back, yBot - 152.5] : [back, yTop, 236 - back, 152.5 - yTop];
    const target = even ? [434, yTop, backR - 434, 152.5 - yTop] : [434, 152.5, backR - 434, yBot - 152.5];
    return {stand, target};
  }
  const stand = even ? [434, yTop, backR - 434, 152.5 - yTop] : [434, 152.5, backR - 434, yBot - 152.5];
  const target = even ? [back, 152.5, 236 - back, yBot - 152.5] : [back, yTop, 236 - back, 152.5 - yTop];
  return {stand, target};
}
const setRect = (el, [x,y,w,h]) => { el.setAttribute("x", x); el.setAttribute("y", y); el.setAttribute("width", w); el.setAttribute("height", h); };
function serveSVG(prefix){
  return `<svg viewBox="-60 -50 790 405" role="img" aria-label="Where the server stands and where the serve must land">${courtLines()}
    <rect id="${prefix}Stand" fill="#2F6FD6" opacity=".35"/><rect id="${prefix}Target" fill="#F2C230" opacity=".45"/>
    <g class="mv" id="${prefix}Server"><circle r="15" fill="#2F6FD6" stroke="${INK}" stroke-width="3"/></g></svg>`;
}
function placeServe(prefix, side, even, doubles){
  const {stand, target} = serveBoxes(side, even, doubles);
  setRect(document.getElementById(`${prefix}Stand`), stand); setRect(document.getElementById(`${prefix}Target`), target);
  const cx = side === 0 ? 205 : 465, cy = stand[1] + stand[3]/2;
  document.getElementById(`${prefix}Server`).style.transform = `translate(${cx}px, ${cy}px)`;
}
function serveExplorer(){
  const $ = id => document.getElementById(id); const S = {doubles:false, even:true};
  const draw = () => {
    placeServe("se", 0, S.even, S.doubles);
    const on = {singles: !S.doubles, doubles: S.doubles, even: S.even, odd: !S.even};
    document.querySelectorAll("[data-se]").forEach(b => b.setAttribute("aria-pressed", on[b.dataset.se]));
    $("seMsg").textContent = `${S.doubles ? "Doubles" : "Singles"}, server's score ${S.even ? "even (0, 2, 4...)" : "odd (1, 3, 5...)"}: serve from the ${S.even ? "right" : "left"} service court, diagonally into the yellow box. ${S.doubles ? "Doubles serves are short and wide: the outer sideline counts, but not the back alley." : "Singles serves are long and narrow: the back alley counts, but not the side alley."}`;
  };
  document.querySelectorAll("[data-se]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.se; if(k === "singles" || k === "doubles") S.doubles = k === "doubles"; else S.even = k === "even"; draw(); }));
  draw();
}

/* Singles game simulator */
function gameSim(){
  const $ = id => document.getElementById(id); const N = ["You","Them"], SUB = ["You","They"];
  const S = {p:[0,0], games:[], won:[0,0], server:0, over:false, ends:false};
  const WIN = ["smash it into the floor","win it with a tight net shot","play a clever drop shot that dies just over the net","drive it past the opponent"];
  const LOSE = ["hit the shuttle into the net","send a clear long, past the back boundary line","touch the net with the racket. Fault","hit it wide of the singles sideline"];
  function draw(){
    $("bdBoard").innerHTML = `<table class="tscore"><thead><tr><th></th>${S.games.map((_,k) => `<th>Game ${k+1}</th>`).join("")}<th>${S.over ? "" : "Points"}</th></tr></thead><tbody>${[0,1].map(i => `<tr><th>${S.server === i && !S.over ? '<i class="srv"></i>' : ""}${N[i]}</th>${S.games.map(g => `<td class="${g[i] > g[1-i] ? "w" : ""}">${g[i]}</td>`).join("")}<td class="pts">${S.over ? "" : S.p[i]}</td></tr>`).join("")}</tbody></table>`;
    const even = S.p[S.server] % 2 === 0;
    $("bdCall").textContent = S.over ? `Match: ${N[S.won[0] === 2 ? 0 : 1]}` : `${S.p[S.server]}-${S.p[1-S.server]}`;
    placeServe("gs", S.server, even, false);
    ["gsStand","gsTarget","gsServer"].forEach(id => $(id).style.display = S.over ? "none" : "");
    ["bdY","bdT","bdR"].forEach(id => $(id).hidden = S.over); $("bdNew").hidden = !S.over;
  }
  function point(w){
    if(S.over) return; const l = 1 - w; let msg = "";
    S.p[w]++; const kept = w === S.server; S.server = w;
    const [a,b] = [S.p[w], S.p[l]];
    if((a >= 21 && a - b >= 2) || a === 30){
      S.games.push([S.p[0], S.p[1]]); S.won[w]++;
      msg = `Game to ${N[w]}, ${a}-${b}.` + (a === 30 ? " At 29-all the next point wins, so the game is capped at 30." : "");
      if(S.won[w] === 2){ S.over = true; msg += ` ${SUB[w]} win the match in ${S.games.length} games.`; }
      else { S.p = [0,0]; S.ends = false; msg += ` Players switch ends, and the winner of the game serves first in the next one.`; }
    } else {
      msg = kept ? `${SUB[w]} win the rally and keep serving. ` : `${SUB[w]} win the rally and take over the serve. `;
      msg += `${SUB[S.server]} now serve from the ${S.p[S.server] % 2 === 0 ? "right" : "left"} court, because ${S.p[S.server]} is ${S.p[S.server] % 2 === 0 ? "even" : "odd"}.`;
      if(a === 11 && b < 11) msg += " Interval: when a leader first reaches 11, players get a 60-second break.";
      if(a >= 20 && b >= 20) msg += a === b ? " Tied at 20 or more: someone has to win by two, up to 30." : ` Game point for ${N[w]}.`;
      if(S.games.length === 2 && a === 11 && b < 11) msg += " In the deciding game, players also switch ends now.";
    }
    $("bdMsg").textContent = msg; draw();
  }
  function rally(){
    const w = Math.random() < .5 ? 0 : 1;
    const how = Math.random() < .5 ? `${SUB[w]} ${pickOne(WIN)}.` : `${SUB[1-w]} ${pickOne(LOSE)}.`;
    point(w);
    $("bdMsg").textContent = `${how} ${$("bdMsg").textContent}`;
  }
  $("bdY").addEventListener("click", () => point(0)); $("bdT").addEventListener("click", () => point(1)); $("bdR").addEventListener("click", rally);
  $("bdNew").addEventListener("click", () => { Object.assign(S, {p:[0,0], games:[], won:[0,0], server:0, over:false}); $("bdMsg").textContent = "New match, best of three games to 21. You serve first."; draw(); });
  draw();
}

/* Side view for shots and faults. Floor y=110, net at x=100 (top y=62). */
const shuttle = (x,y,deg=0) => `<g transform="translate(${x} ${y}) rotate(${deg})"><path d="M0 0l12 -6v12z" fill="#fff" stroke="${INK}" stroke-width="1.2"/><circle r="3.2" fill="#F2C230" stroke="${INK}" stroke-width="1"/></g>`;
const side = body => `<svg viewBox="0 0 200 120" aria-hidden="true"><rect width="200" height="120" fill="${OUT}"/><rect y="110" width="200" height="10" fill="${COURT}"/>
  <line x1="100" y1="62" x2="100" y2="110" stroke="${W}" stroke-width="1.5" stroke-dasharray="3 3"/><rect x="98" y="60" width="4" height="10" fill="#fff"/>${body}</svg>`;
const ply = (x, up) => `<g stroke="#2F6FD6" stroke-width="3" stroke-linecap="round" fill="none"><circle cx="${x}" cy="${up ? 72 : 78}" r="5" fill="#2F6FD6"/><path d="M${x} ${up ? 77 : 83}V${up ? 96 : 98}M${x} ${up ? 96 : 98}l-5 12M${x} ${up ? 96 : 98}l5 12"/></g>`;
const path = d => `<path d="${d}" fill="none" stroke="#F2C230" stroke-width="2" stroke-dasharray="5 4"/>`;
const xm = (x,y) => `<path d="M${x-7} ${y-7}l14 14M${x+7} ${y-7}l-14 14" stroke="#FF4D3D" stroke-width="3.5" stroke-linecap="round"/>`;
const SHOTS = [
  {name:"Serve", text:"Hit underarm, with the whole shuttle below 1.15 m (3 ft 9 in) from the floor at contact. Low serves just skim the net; high serves go deep.", art: side(ply(30) + path("M38 92Q100 30 170 108") + shuttle(38,92,-30))},
  {name:"Clear", text:"A high, deep shot to the back of the other court. It buys time and pushes the opponent back.", art: side(ply(40, true) + path("M46 70Q110 -30 186 108") + shuttle(46,70,-40))},
  {name:"Smash", text:"A steep, powerful downward hit, the main way to win points. Top smashes travel well over 400 km/h (250 mph) off the racket.", art: side(ply(76, true) + path("M80 64L150 110") + shuttle(80,64,35))},
  {name:"Drop shot", text:"A soft shot from the back that falls just over the net, forcing the opponent to rush forward.", art: side(ply(30, true) + path("M36 66Q92 40 112 108") + shuttle(36,66,-20))},
  {name:"Net shot", text:"A delicate tap from near the net that tumbles over and drops close to it on the other side.", art: side(ply(88) + path("M92 80Q100 50 108 108") + shuttle(92,80,-60))},
  {name:"Drive", text:"A fast, flat shot that travels just above net height, common in doubles.", art: side(ply(50) + path("M56 78L196 66") + shuttle(56,78,0))}
];
const FAULTS = [
  {name:"Out", text:"The shuttle lands outside the boundary lines. If it touches a line, it's in.", art: side(ply(40, true) + path("M46 70Q130 -10 204 112") + xm(196,104))},
  {name:"Into the net", text:"The shuttle fails to pass over the net, or passes through or under it.", art: side(ply(40) + path("M46 84Q76 50 98 68") + shuttle(96,70,30) + xm(96,92))},
  {name:"Touching the net", text:"Touching the net or its posts with the racket, body, or clothing while the shuttle is in play.", art: side(ply(92, true) + `<path d="M96 70l8 -8" stroke="#EEF3EC" stroke-width="3"/><ellipse cx="106" cy="60" rx="4" ry="6" fill="none" stroke="#EEF3EC" stroke-width="2"/>` + xm(104,58))},
  {name:"Reaching over", text:"Hitting the shuttle before it crosses to your side. A follow-through over the net is fine if contact was on your side.", art: side(ply(92, true) + `<path d="M96 70l14 -12" stroke="#EEF3EC" stroke-width="3"/>` + shuttle(114,56,200) + xm(114,40))},
  {name:"Body hit", text:"The shuttle touches a player's body or clothes. That player loses the rally.", art: side(ply(150) + path("M30 60L148 82") + shuttle(146,82,190) + xm(150,64))},
  {name:"High serve", text:"Serving with the shuttle above 1.15 m at contact, or not underarm, is a service fault.", art: side(`<line x1="14" y1="64" x2="80" y2="64" stroke="#FF4D3D" stroke-width="1.5" stroke-dasharray="4 3"/><text x="14" y="58" font-family="Barlow,sans-serif" font-size="10" fill="#FF8A7A">1.15 m</text>` + ply(30, true) + shuttle(42,56,-30) + xm(56,48))}
];

const CLOCK = [
  {k:"g1", cls:"q", t:"Game 1", s:"to 21", info:["Game 1","Every rally scores a point. First to 21 wins, but you need a 2-point lead. At 29-all, the next point wins, so a game never goes past 30."]},
  {k:"i1", cls:"half", t:"11", s:"Interval", info:["Interval at 11","When the leading player first reaches 11 points, both get a 60-second break to rest and talk to coaches."]},
  {k:"b", cls:"half", t:"Break", s:"2 min", info:["Between games","A 2-minute break, and players switch ends."]},
  {k:"g2", cls:"q", t:"Game 2", s:"to 21", info:["Game 2","Win the first two games and the match is over."]},
  {k:"g3", cls:"ot", t:"Game 3", s:"Decider", info:["Deciding game","Played if it's one game each. Players switch ends again when the leader reaches 11, so neither side keeps an advantage like lighting or air drafts."]}
];
const TRICKY = [
  ["Is a serve that clips the net a let?","No. Unlike tennis, a serve that touches the net and still lands in the correct service court is good. Play continues."],
  ["Why does the server move sides?","The server's own score decides it: even score, serve from the right; odd score, serve from the left. So you always know where to stand by looking at the scoreboard."],
  ["Can the server score a point?","Either player can. Badminton uses rally scoring: whoever wins the rally scores, and the winner of the rally serves next."],
  ["What's the 1.15 m rule?","At the moment of the serve, the whole shuttle must be below 1.15 m from the floor. Before 2018 the limit was the server's waist, which varied with height."],
  ["What's a let in badminton?","A replay with no point. It happens if the receiver wasn't ready, if the shuttle gets caught on top of the net after the serve, or if something interferes, like a shuttle from another court."],
  ["How does doubles serving work?","Each side has one server at a time. Win the rally and the same player serves again from the other court. Lose it and the serve passes to the other side."]
];
const WORDS = [
  ["Shuttlecock","The feathered projectile, also called a shuttle or birdie. Top-level ones use 16 goose feathers."],
  ["Rally","The exchange of shots after the serve. Every rally scores a point."],
  ["Clear","A high, deep shot to the back of the court."],
  ["Smash","A steep, hard downward shot."],
  ["Drop shot","A soft shot that falls just past the net."],
  ["Lift","An underarm shot from near the net that sends the shuttle high and deep."],
  ["Net kill","A quick downward tap of a shuttle that's just above the net."],
  ["Service court","The area a serve must land in, diagonally across from the server."],
  ["Interval","The 60-second break when the leader reaches 11 points."],
  ["Let","A rally that's replayed without a point."]
];

const lineMini = () => `<svg viewBox="420 -20 270 180" style="width:220px;border-radius:8px" aria-hidden="true"><rect x="420" y="-20" width="270" height="180" fill="${OUT}"/><rect x="420" width="250" height="160" fill="${COURT}"/>
  <line x1="670" y1="-20" x2="670" y2="160" stroke="${W}" stroke-width="6"/>${shuttle(673,80,180)}</svg>`;
const areaMini = () => `<svg viewBox="-60 -50 790 405" style="width:280px;border-radius:8px" aria-hidden="true">${courtLines()}
  <rect x="434" y="0" width="198" height="152.5" fill="#F2C230" opacity=".5"/><rect x="434" y="152.5" width="236" height="129.5" fill="#2F6FD6" opacity=".6"/>
  <text x="533" y="95" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="58" fill="#fff">A</text>
  <text x="552" y="240" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="58" fill="#fff">B</text></svg>`;
const QUIZ = [
  {q:"How many points win a game?", o:["11","15","21","25"], a:2, why:"21 points, with a 2-point lead, capped at 30."},
  {q:"The score is 29-29. What happens?", o:["Play continues to 31","The next point wins the game","A tiebreak","The game is replayed"], a:1, why:"At 29-all, the next point wins. Games are capped at 30."},
  {q:"The shuttle lands like this, touching the back line. What's the call?", visual: lineMini, o:["Let","Fault","In","Out"], a:2, why:"Lines are in. A shuttle touching the line counts."},
  {q:"The server has 6 points. Which service court do they serve from?", o:["Left","Right","Either one","The center"], a:1, why:"An even score means serving from the right service court."},
  {q:"How high can the shuttle be when it's served?", o:["Any height","Shoulder height","Waist height","Below 1.15 m from the floor"], a:3, why:"The whole shuttle must be below 1.15 m at contact."},
  {q:"A serve clips the top of the net and lands in the correct service court. What happens?", o:["It's a let","It's a fault","Play continues","Point to the receiver"], a:2, why:"Badminton has no net-cord let on serves. It's a good serve."},
  {q:"A player's racket touches the net during a rally. What's the call?", o:["It's allowed","Fault: they lose the rally","A let","A warning"], a:1, why:"Touching the net while the shuttle is in play is a fault."},
  {q:"Who can score a point?", o:["Whoever wins the rally","Only the server","Only the receiver","Only after a let"], a:0, why:"Rally scoring: every rally gives a point to whoever wins it."},
  {q:"How many games are in a match?", o:["One game","Best of five","Best of three","Best of seven"], a:2, why:"Matches are best of three games to 21."},
  {q:"Serving in singles from the right court, which shaded area is the legal target?", visual: areaMini, o:["A","B","Either one","Neither"], a:1, why:"Singles serves are long and narrow: the inner sideline and the back boundary line. A is the doubles service court, and it's on the wrong side too."}
];

function render(app){
  app.innerHTML = sportHero({id:"badminton", name:"Badminton", alt:"The tabby cat reaching up with a racket toward a shuttlecock",
      lede:"Two players (or two pairs) hit a feathered shuttlecock back and forth over a high net, trying to make it land on the other side. The shuttle can't bounce: it's hit in the air every time. Every rally scores a point, and the first to 21 wins the game.",
      facts:[["21","points to win a game"],["30","points at most, ever"],["3","games at most"],["1.15","meters: the highest a serve can be hit"]]})
    + jumpNav([["bd-court","The court"],["bd-serve","Where to serve"],["bd-sim","Play a match"],["bd-shots","The shots"],["bd-faults","Faults"],["bd-clock","Games"],["bd-tricky","Tricky rules"],["bd-words","Words you'll hear"],["bd-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("bd-court","The court","Tap any part of the court to see what it does. Singles and doubles share the court but use different lines.",
        `<div class="fieldbox" id="bdCourt">${courtSVG()}</div><div class="fieldrow"><div class="zonechips" id="bdChips"></div><div class="infopanel" id="bdInfo" aria-live="polite"></div></div>`)
    + section("bd-serve","Where to serve","Pick singles or doubles and whether the server's score is even or odd. Blue shows where the server stands; yellow shows where the serve must land.",
        `<div class="fieldbox">${serveSVG("se")}</div>
        <div class="controls" style="margin-top:12px"><span class="chips"><button class="chip" type="button" data-se="singles">Singles</button><button class="chip" type="button" data-se="doubles">Doubles</button></span>
          <span class="chips"><button class="chip" type="button" data-se="even">Score even</button><button class="chip" type="button" data-se="odd">Score odd</button></span></div>
        <div class="result narrator" style="margin-top:12px"><img src="${img("head.webp")}" alt=""><p id="seMsg"></p></div>`)
    + section("bd-sim","Play a singles match","Award rallies and watch the score, the serve, and the service courts change. Best of three games.",
        `<div class="sim"><div class="tboardwrap"><div id="bdBoard"></div><div class="tcall"><small>Score, server first</small><b id="bdCall">0-0</b></div></div>
          <div class="fieldbox">${serveSVG("gs")}</div>
          <div class="controls"><button class="btn" id="bdY" type="button">Rally to You</button><button class="btn" id="bdT" type="button">Rally to Them</button><button class="btn primary" id="bdR" type="button">Play a rally</button><button class="btn primary" id="bdNew" type="button" hidden>Start a new match</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="bdMsg">You serve first from the right court, because your score of 0 is even.</p></div></div></div>`)
    + section("bd-shots","The shots","Blue is the player, yellow dashes show the shuttle's flight. The net is in the middle.",
        `<div class="scoring restarts">${SHOTS.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("bd-faults","Faults","A fault ends the rally, and the other side scores a point.",
        `<div class="scoring restarts">${FAULTS.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("bd-clock","Games","Badminton has no game clock. Tap a part of the match to learn more.",
        `<div class="timeline" id="bdTimeline"></div><div class="infopanel" id="bdClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("bd-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="bdFlips"></div>`)
    + section("bd-words","Words you'll hear","",`<dl class="gloss" id="bdGloss"></dl>`)
    + section("bd-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="bdQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the BWF Laws of Badminton, used in international play. Recreational games often skip the 1.15 m serve rule and play shorter games.</footer></div>`;

  setupZones(document.getElementById("bdCourt"), document.getElementById("bdChips"), document.getElementById("bdInfo"), ZONES, ZONE_ORDER, "court");
  serveExplorer(); gameSim();
  setupTimeline(document.getElementById("bdTimeline"), document.getElementById("bdClockInfo"), CLOCK,
    "Most top-level matches last 45 minutes to an hour and a half.");
  flipCards(document.getElementById("bdFlips"), TRICKY);
  glossary(document.getElementById("bdGloss"), WORDS);
  makeQuiz(document.getElementById("bdQuiz"), QUIZ, [
    "Smashing! Watch a match and try calling which court the server will stand in before each point.",
    "Nice rally. Spend another minute on the service courts and you'll have every serve down.",
    "Look over the serve diagram and the faults again, then come back for another try.",
    "No worries. Start with the court diagram and the serve explorer, then try again."]);
}

SPORT_PAGES["badminton"] = {render};
})();

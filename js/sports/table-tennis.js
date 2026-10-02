/* Table tennis. Rules follow the ITTF Laws of Table Tennis. */
(function(){

const W = "#F4F6F1", TOP = "#1F4F8A", FLOOR = "#1C4D2C", INK = "#18221D", BALL = "#F7A23B";
/* Table 274 x 152.5 cm at 3 units per cm, seen from above. Net x=411. */
function tableTop(){
  return `<rect x="-80" y="-80" width="982" height="618" fill="${FLOOR}"/><rect width="822" height="457.5" fill="${TOP}"/>
    <rect width="822" height="457.5" fill="none" stroke="${W}" stroke-width="6"/><line x1="0" y1="228.75" x2="822" y2="228.75" stroke="${W}" stroke-width="3"/>
    <line x1="411" y1="-46" x2="411" y2="503.5" stroke="${INK}" stroke-width="8"/><line x1="411" y1="-46" x2="411" y2="503.5" stroke="${W}" stroke-width="2"/>
    <rect x="401" y="-60" width="20" height="16" rx="3" fill="${INK}"/><rect x="401" y="501" width="20" height="16" rx="3" fill="${INK}"/>`;
}
function tableSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-80 -80 982 618" role="img" aria-label="Table tennis table seen from above">${tableTop()}
    ${r("surface",10,10,393,437)}${r("surface",419,10,393,437)}${r("endline",-10,0,20,457.5)}${r("endline",812,0,20,457.5)}
    ${r("edge",0,-10,822,20)}${r("edge",0,447.5,822,20)}${r("center",10,221,393,16)}${r("center",419,221,393,16)}
    ${r("net",401,-46,20,549)}${r("posts",396,-66,30,28)}${r("posts",396,496,30,28)}</svg>`;
}
const ZONES = {
  surface:{title:"Playing surface", text:"The table is 2.74 m long and 1.525 m wide (9 by 5 feet), 76 cm off the floor. In a rally, the ball must land on the opponent's half after crossing the net."},
  net:{title:"Net", text:"15.25 cm (6 inches) high across the whole width. A rally ball that touches the net and still lands on the other side is good. A serve that touches it is a let and is served again."},
  posts:{title:"Net posts", text:"The net sticks out 15.25 cm past each side of the table. A ball doesn't have to go over the net: in a rally it can travel around the post, even below the net's height, and still count."},
  endline:{title:"End lines", text:"The white lines at each end. The server must hit the ball from behind this line, and above the level of the table."},
  edge:{title:"Side lines and edges", text:"The white lines along the long sides. A ball that clips the top edge of the table is good, called an edge ball. A ball that hits the vertical side of the table is out."},
  center:{title:"Center line", text:"Only used for doubles serves, which must go diagonally from the server's right half to the receiver's right half. In singles it's ignored."}
};
const ZONE_ORDER = ["surface","net","posts","endline","edge","center"];

/* Serve lab: side view. Table surface y=200, from x=60 to x=608. Net at x=334, top y=170. 2 units per cm. */
function serveSVG(){
  return `<svg viewBox="-70 40 750 330" role="img" aria-label="Side view of a serve" id="slSvg">
    <rect x="-70" y="40" width="750" height="330" fill="${FLOOR}"/><rect x="-70" y="352" width="750" height="18" fill="#174028"/>
    <rect x="60" y="196" width="548" height="10" fill="${TOP}" stroke="${W}" stroke-width="2"/><path d="M90 206V352M578 206V352" stroke="#9AA" stroke-width="8"/>
    <rect x="331" y="170" width="6" height="26" fill="${W}"/>
    <line x1="20" y1="200" x2="58" y2="200" stroke="#F2C230" stroke-width="1.5" stroke-dasharray="4 3"/>
    <line id="slH" x1="20" y1="168" x2="58" y2="168" stroke="#F2C230" stroke-width="2"/><text id="slHt" x="62" y="162" font-family="Barlow,sans-serif" font-size="14" fill="#F2C230">16 cm</text>
    <g id="slBody"><circle cx="-30" cy="150" r="16" fill="#2F6FD6" opacity=".9"/><path d="M-30 166v120M-30 286l-14 66M-30 286l14 66M-30 184l60 18" stroke="#2F6FD6" stroke-width="12" stroke-linecap="round"/></g>
    <rect id="slHide" x="26" y="130" width="40" height="100" rx="12" fill="#2F6FD6" opacity="0"/>
    <path id="slPath" d="" fill="none" stroke="#F2C230" stroke-width="2.5" stroke-dasharray="7 6"/>
    <circle id="slBall" r="7" fill="${BALL}" stroke="${INK}" stroke-width="2"/></svg>`;
}
function serveLab(){
  const $ = id => document.getElementById(id); const S = {h:20, hide:false, front:false, net:false, busy:false};
  function geom(){
    const sx = S.front ? 110 : 44, top = 200 - S.h*2, hit = 192;
    const over = S.net ? 170 : 150;
    return {sx, top, hit, d:`M${sx} 200L${sx} ${top}L${sx} ${hit}Q${(sx+190)/2} ${hit-30} 190 200Q262 ${over-38} 334 ${over}Q400 ${over-20} 470 200Q560 120 650 150`};
  }
  function draw(){
    const g = geom();
    $("slPath").setAttribute("d", g.d);
    $("slH").setAttribute("y1", g.top); $("slH").setAttribute("y2", g.top); $("slHt").setAttribute("y", g.top - 6); $("slHt").textContent = `${S.h} cm toss`;
    $("slBall").setAttribute("cx", g.sx); $("slBall").setAttribute("cy", 200);
    $("slHide").setAttribute("opacity", S.hide ? .95 : 0);
    $("slBody").setAttribute("transform", S.front ? "translate(66 0)" : ""); $("slHide").setAttribute("x", S.front ? 92 : 26);
    $("slHval").textContent = `${S.h} cm`;
  }
  function verdict(){
    if(S.h < 16) return ["Fault", "off", "The toss must go up at least 16 cm (about 6 inches), nearly straight up, so the server can't spin it from the hand."];
    if(S.hide) return ["Fault", "off", "The receiver must be able to see the ball the whole time during the serve. Hiding it with the body or free arm is illegal."];
    if(S.front) return ["Fault", "off", "The ball must be struck from behind the end line. This server hit it over the table."];
    if(S.net) return ["Let", "on", "The serve clipped the net and landed on the right side, so it's a let: no point, and the server serves again. Lets have no limit."];
    return ["Good serve", "on", "Open palm, a toss of at least 16 cm, struck behind the end line and above the table, visible to the receiver. It bounces once on each side."];
  }
  function serve(){
    if(S.busy) return; S.busy = true;
    const p = $("slPath"), len = p.getTotalLength(), ball = $("slBall"), t0 = performance.now(), dur = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 1600;
    (function step(t){ const k = Math.min(1, (t - t0)/dur), pt = p.getPointAtLength(len*k); ball.setAttribute("cx", pt.x); ball.setAttribute("cy", pt.y);
      if(k < 1) return requestAnimationFrame(step);
      const [v, cls, msg] = verdict(); $("slVerdict").textContent = v; $("slVerdict").className = `verdict ${cls}`; $("slMsg").textContent = msg; S.busy = false; })(t0);
  }
  $("slHR").addEventListener("input", e => { S.h = +e.target.value; draw(); });
  ["hide","front","net"].forEach(k => $(`sl_${k}`).addEventListener("change", e => { S[k] = e.target.checked; draw(); }));
  $("slGo").addEventListener("click", serve);
  draw();
}

/* Game simulator */
function tableMini(){
  return `<svg viewBox="-80 -80 982 618" role="img" aria-label="Who is serving" style="max-height:340px;width:auto;max-width:100%;min-width:0;margin:0 auto">${tableTop()}
    <g class="mv" id="ttServer"><circle r="30" fill="#2F6FD6" stroke="${INK}" stroke-width="4"/></g>
    <text x="205" y="-30" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="34" fill="${W}" id="ttLeft"></text>
    <text x="617" y="-30" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="34" fill="${W}" id="ttRight"></text></svg>`;
}
function gameSim(){
  const $ = id => document.getElementById(id); const N = ["You","Them"], SUB = ["You","They"];
  const S = {p:[0,0], games:[], won:[0,0], first:0, swapped:false, midSwap:false, over:false};
  const WIN = ["loop a heavy topspin shot past the backhand","smash a high ball for a clean winner","land a serve the receiver can't return","catch the edge of the table, and it's good"];
  const LOSE = ["push the ball into the net","hit a loop just long, past the end line","hit the side of the table, which is out","put a free hand on the table during the rally"];
  const totalPts = () => S.p[0] + S.p[1];
  function server(){ const t = totalPts(); const deuce = S.p[0] >= 10 && S.p[1] >= 10;
    const turns = deuce ? 10 + (t - 20) : Math.floor(t / 2); return (S.first + turns) % 2; }
  function servesLeft(){ const t = totalPts(); return (S.p[0] >= 10 && S.p[1] >= 10) ? 1 : 2 - (t % 2); }
  function draw(){
    const srv = server();
    $("ttBoard").innerHTML = `<table class="tscore"><thead><tr><th></th>${S.games.map((_,k) => `<th>G${k+1}</th>`).join("")}<th>${S.over ? "" : "Points"}</th></tr></thead><tbody>${[0,1].map(i => `<tr><th>${srv === i && !S.over ? '<i class="srv" style="background:#F7A23B"></i>' : ""}${N[i]}</th>${S.games.map(g => `<td class="${g[i] > g[1-i] ? "w" : ""}">${g[i]}</td>`).join("")}<td class="pts">${S.over ? "" : S.p[i]}</td></tr>`).join("")}</tbody></table>`;
    $("ttCall").textContent = S.over ? `Match: ${N[S.won[0] === 3 ? 0 : 1]}` : `${N[srv]} serving, ${servesLeft()} left`;
    const leftIsYou = !(S.swapped !== S.midSwap);
    $("ttLeft").textContent = leftIsYou ? "You" : "Them"; $("ttRight").textContent = leftIsYou ? "Them" : "You";
    const atLeft = (srv === 0) === leftIsYou;
    $("ttServer").style.transform = `translate(${atLeft ? -45 : 867}px, 300px)`; $("ttServer").style.display = S.over ? "none" : "";
    ["ttY","ttT","ttR"].forEach(id => $(id).hidden = S.over); $("ttNew").hidden = !S.over;
  }
  function point(w){
    if(S.over) return; const l = 1 - w, before = server(); let msg = "";
    S.p[w]++; const [a,b] = [S.p[w], S.p[l]];
    if(a >= 11 && a - b >= 2){
      S.games.push([S.p[0], S.p[1]]); S.won[w]++;
      msg = `Game to ${N[w]}, ${a}-${b}.`;
      if(S.won[w] === 3){ S.over = true; msg += ` ${SUB[w]} win the match ${S.won[w]}-${S.won[l]}.`; }
      else { S.p = [0,0]; S.first = 1 - S.first; S.swapped = !S.swapped; S.midSwap = false;
        msg += " Players switch ends, and whoever received first last game serves first now." + (S.won[0] === 2 && S.won[1] === 2 ? " This is the deciding game." : ""); }
    } else {
      const after = server();
      msg = `Point to ${N[w] === "You" ? "you" : "them"}. You ${S.p[0]}, Them ${S.p[1]}.`;
      if(a === 10 && b === 10) msg += " Ten-all, deuce: now the serve switches after every point, and someone must win by two.";
      else if(after !== before) msg += ` That's two serves, so the serve passes to ${N[after] === "You" ? "you" : "them"}.`;
      if(S.won[0] === 2 && S.won[1] === 2 && a === 5 && b < 5 && !S.midSwap){ S.midSwap = true; msg += " In the deciding game, players switch ends when someone reaches 5."; }
    }
    $("ttMsg").textContent = msg; draw();
  }
  $("ttY").addEventListener("click", () => point(0)); $("ttT").addEventListener("click", () => point(1));
  $("ttR").addEventListener("click", () => { const w = Math.random() < .5 ? 0 : 1, how = Math.random() < .5 ? `${SUB[w]} ${pickOne(WIN)}.` : `${SUB[1-w]} ${pickOne(LOSE)}.`; point(w); $("ttMsg").textContent = `${how} ${$("ttMsg").textContent}`; });
  $("ttNew").addEventListener("click", () => { Object.assign(S, {p:[0,0], games:[], won:[0,0], first:0, swapped:false, midSwap:false, over:false}); $("ttMsg").textContent = "New match, best of five games to 11. You serve first."; draw(); });
  draw();
}

/* Side-view rule cards */
const side = body => `<svg viewBox="20 120 640 150" aria-hidden="true"><rect x="20" y="120" width="640" height="150" fill="${FLOOR}"/>
  <rect x="60" y="196" width="548" height="10" fill="${TOP}" stroke="${W}" stroke-width="2"/><rect x="331" y="170" width="6" height="26" fill="${W}"/><path d="M90 206V270M578 206V270" stroke="#9AA" stroke-width="8"/>${body}</svg>`;
const bl = (x,y) => `<circle cx="${x}" cy="${y}" r="9" fill="${BALL}" stroke="${INK}" stroke-width="2"/>`;
const pth = d => `<path d="${d}" fill="none" stroke="#F2C230" stroke-width="3.5" stroke-dasharray="9 7"/>`;
const xm = (x,y) => `<path d="M${x-12} ${y-12}l24 24M${x+12} ${y-12}l-24 24" stroke="#FF4D3D" stroke-width="6" stroke-linecap="round"/>`;
const ok = (x,y) => `<path d="M${x-12} ${y}l9 10 16-20" fill="none" stroke="#7FD39A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
const RULES = [
  {name:"Edge ball", text:"A ball that clips the top edge of the table is good, even though it bounces off at a strange angle. Players often raise a hand to apologize for the luck.", art: side(pth("M200 150Q420 80 604 196L640 250") + bl(604,196) + ok(560,160))},
  {name:"Side of the table", text:"A ball that hits the vertical side of the table, below the top edge, is out.", art: side(pth("M200 150Q470 90 610 206") + bl(610,206) + xm(620,170))},
  {name:"Volley", text:"Hitting the ball before it bounces on your side, while it's above or over the table, loses the point.", art: side(pth("M120 150Q300 110 520 160") + bl(520,160) + `<rect x="526" y="150" width="8" height="40" rx="3" fill="#C8482F"/>` + xm(560,135))},
  {name:"Free hand on the table", text:"Touching the table with your free hand during a rally, or moving the table, loses the point. Leaning on it with the racket hand is fine.", art: side(`<circle cx="560" cy="140" r="14" fill="#2F6FD6"/><path d="M560 154v60M560 170l-24 26" stroke="#2F6FD6" stroke-width="9" stroke-linecap="round"/>` + xm(530,180))},
  {name:"Around the net", text:"In a rally, a ball can go around the net post instead of over it, even lower than the net, and still count if it lands on the table.", art: side(`<text x="334" y="150" text-anchor="middle" font-family="Barlow,sans-serif" font-size="16" fill="#A9B8AE">around the post</text>` + pth("M120 180Q330 200 460 196") + bl(460,196) + ok(470,160))},
  {name:"Let on the serve", text:"A serve that touches the net and still lands correctly is replayed. There's no limit to how many lets in a row.", art: side(pth("M120 196Q240 150 334 170Q400 150 470 196") + bl(334,168) + `<text x="334" y="145" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="24" fill="#F2C230">Let</text>`)}
];

const CLOCK = [
  {k:"g1", cls:"q", t:"Game 1", s:"to 11", info:["Games","Each game goes to 11 points, with a 2-point lead. Every rally scores, and the serve switches every 2 points."]},
  {k:"g2", cls:"q", t:"Game 2", s:"to 11", info:["Switching ends","Players switch ends after every game. Each player can take one 1-minute timeout per match."]},
  {k:"g3", cls:"q", t:"Game 3", s:"to 11", info:["Game 3","In a best-of-five match, winning three games wins the match, so a 3-0 sweep can be over in 20 minutes."]},
  {k:"g4", cls:"q", t:"Game 4", s:"to 11", info:["Game 4","Played if no one has three game wins yet."]},
  {k:"g5", cls:"ot", t:"Game 5", s:"Decider", info:["Deciding game","In the last possible game, players also switch ends when someone first reaches 5 points."]},
  {k:"g7", cls:"ot", t:"6 and 7", s:"Big events", info:["Best of seven","Major singles events, like the Olympics and World Championships, play best of seven, so games 6 and 7 may be needed."]}
];
const TRICKY = [
  ["Why does the serve switch every point at 10-10?","At deuce, the serve alternates after every point so neither player gets two serves in a row while the game hangs on a single point."],
  ["Can you hide the serve?","No. The ball must stay visible to the receiver from the toss until it's struck. The free arm has to move out of the way after the toss."],
  ["Does the serve have to go diagonally?","Only in doubles, from the server's right half to the receiver's right half. In singles, it can land anywhere on the receiver's side."],
  ["What happens if a game drags on?","If a game isn't finished after 10 minutes (unless both players have at least 9 points), the expedite system starts: the serve alternates every point, and the receiver wins the point by making 13 good returns."],
  ["Can the ball touch you?","If the ball touches you or anything you're wearing or carrying, other than your racket hand, before it bounces on your side, you lose the point."],
  ["What colors are rackets?","Each side of the racket must be covered with rubber, one side black and the other a bright color, so opponents can tell which side made the shot and expect the spin."]
];
const WORDS = [
  ["Topspin","Forward spin that makes the ball dip and kick forward after it bounces."],
  ["Backspin","Backward spin that makes the ball float and stay low, also called underspin."],
  ["Loop","A heavy topspin attacking stroke, the most common way to attack."],
  ["Chop","A defensive stroke with heavy backspin, played from far behind the table."],
  ["Push","A short, low backspin stroke over the table."],
  ["Flick","A quick attacking stroke over the table against a short ball."],
  ["Smash","A flat, fast kill shot against a high ball."],
  ["Edge ball","A ball that clips the edge of the table. It's good."],
  ["Let","A rally replayed with no point, such as a serve that clips the net."],
  ["Shakehand and penhold","The two main grips: holding the racket like a handshake, or like a pen."]
];

const edgeMini = () => side(pth("M200 150Q420 80 604 196") + bl(604,196)).replace('aria-hidden="true"', 'aria-hidden="true" style="width:280px;border-radius:8px"');
const sideMini = () => side(pth("M200 150Q470 90 610 206") + bl(610,206)).replace('aria-hidden="true"', 'aria-hidden="true" style="width:280px;border-radius:8px"');
const QUIZ = [
  {q:"How many points win a game?", o:["11","15","21","25"], a:0, why:"11 points, with at least a 2-point lead."},
  {q:"How often does the serve change hands?", o:["Every point","Every 2 points","Every 5 points","After each game"], a:1, why:"Every 2 points, until 10-10, when it changes after every point."},
  {q:"The score reaches 10-10. What happens?", o:["The next point wins","The game is replayed","A sudden-death serve","The serve alternates every point, and you must win by 2"], a:3, why:"That's deuce. The serve switches every point until someone leads by two."},
  {q:"A serve touches the net and lands on the receiver's side. What's the call?", o:["Point to the server","Fault","Let: serve again","Play continues"], a:2, why:"A serve that clips the net and lands correctly is a let and is replayed."},
  {q:"The ball clips the top edge of the table like this. What's the call?", visual: edgeMini, o:["Good: the point stands","Let","Out","Fault"], a:0, why:"An edge ball on the top edge counts as a good shot."},
  {q:"A player puts their free hand on the table during a rally. What happens?", o:["It's allowed","They lose the point","A let","A warning first"], a:1, why:"Touching the playing surface with the free hand loses the point."},
  {q:"How high must the ball be tossed on a serve?", o:["Any height","At least 50 cm","Above the head","At least 16 cm"], a:3, why:"At least 16 cm (about 6 inches), nearly straight up."},
  {q:"The ball hits the side of the table like this, below the edge. What's the call?", visual: sideMini, o:["In","Out","Let","Edge ball"], a:1, why:"Only the top edge counts. A ball hitting the vertical side of the table is out."},
  {q:"A player hits the ball over the table before it bounces on their side. What happens?", o:["They lose the point","It's a legal volley","A let","The opponent serves again"], a:0, why:"Volleying is not allowed in table tennis. The ball must bounce on your side first."},
  {q:"In singles, where can the serve land on the receiver's side?", o:["Right half only","Left half only","Anywhere on their side","Near the end line only"], a:2, why:"In singles the serve can go anywhere on the receiver's half. Only doubles serves go diagonally."}
];

function render(app){
  app.innerHTML = sportHero({id:"table-tennis", name:"Table tennis", alt:"The tabby cat in a red shirt, holding a table tennis paddle",
      lede:"Two players (or two pairs) hit a light ball back and forth across a small table divided by a low net. The ball must bounce once on the opponent's side before they return it. Every rally scores a point, and the first to 11 wins the game.",
      facts:[["11","points to win a game, by 2"],["2","serves each, then switch"],["16","cm: the minimum serve toss"],["2.7","grams: the weight of the ball"]]})
    + jumpNav([["tt-table","The table"],["tt-serve","The serve"],["tt-sim","Play a match"],["tt-rules","Rally rules"],["tt-clock","Games"],["tt-tricky","Tricky rules"],["tt-words","Words you'll hear"],["tt-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("tt-table","The table","Tap any part of the table to see what it does.",
        `<div class="fieldbox" id="ttTable">${tableSVG()}</div><div class="fieldrow"><div class="zonechips" id="ttChips"></div><div class="infopanel" id="ttInfo" aria-live="polite"></div></div>`)
    + section("tt-serve","Build a legal serve","The serve has the strictest rules in the game. Set up a serve, then hit it and see whether it's good, a let, or a fault.",
        `<div class="fieldbox">${serveSVG()}</div>
        <div class="oslab" style="margin-top:14px"><div class="osside">
            <label class="slider">Toss height <span id="slHval">20 cm</span><input id="slHR" type="range" min="0" max="40" step="1" value="20"></label>
            <label class="check"><input type="checkbox" id="sl_hide"> Hide the ball behind the body</label>
            <label class="check"><input type="checkbox" id="sl_front"> Hit it from over the table</label>
            <label class="check"><input type="checkbox" id="sl_net"> Clip the net on the way over</label>
            <div class="controls"><button class="btn primary" id="slGo" type="button">Serve</button></div></div>
          <div class="osside"><div class="osverdict"><span id="slVerdict" class="verdict on">Ready</span></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="slMsg">The ball must bounce once on your side, then once on the other side.</p></div></div></div>`)
    + section("tt-sim","Play a match","Award rallies and follow the score and the serve. Best of five games to 11.",
        `<div class="sim"><div class="tboardwrap"><div id="ttBoard"></div><div class="tcall"><small>Serve</small><b id="ttCall"></b></div></div>
          <div class="fieldbox">${tableMini()}</div>
          <div class="controls"><button class="btn" id="ttY" type="button">Rally to You</button><button class="btn" id="ttT" type="button">Rally to Them</button><button class="btn primary" id="ttR" type="button">Play a rally</button><button class="btn primary" id="ttNew" type="button" hidden>Start a new match</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="ttMsg">You serve first. Each player serves twice in a row before it switches.</p></div></div></div>`)
    + section("tt-rules","Rally rules","What's good and what isn't once the ball is in play. Green check is good, red X loses the point.",
        `<div class="scoring restarts">${RULES.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("tt-clock","Games","Table tennis has no game clock. Tap a game to learn more.",
        `<div class="timeline" id="ttTimeline"></div><div class="infopanel" id="ttClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("tt-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="ttFlips"></div>`)
    + section("tt-words","Words you'll hear","",`<dl class="gloss" id="ttGloss"></dl>`)
    + section("tt-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="ttQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the ITTF Laws of Table Tennis, used in international play. Casual games often play to 21 with five serves each, the old format.</footer></div>`;

  setupZones(document.getElementById("ttTable"), document.getElementById("ttChips"), document.getElementById("ttInfo"), ZONES, ZONE_ORDER, "net");
  serveLab(); gameSim();
  setupTimeline(document.getElementById("ttTimeline"), document.getElementById("ttClockInfo"), CLOCK,
    "Rallies are short and fast, so a best-of-five match usually takes 30 to 45 minutes.");
  flipCards(document.getElementById("ttFlips"), TRICKY);
  glossary(document.getElementById("ttGloss"), WORDS);
  makeQuiz(document.getElementById("ttQuiz"), QUIZ, [
    "Perfect game! Watch a match and count the serves to see when they switch.",
    "Nice rally. Try a few more serves in the serve builder and you'll have every rule down.",
    "Look over the serve builder and the rally rules again, then come back for another try.",
    "No worries. Start with the serve builder, then play a game in the simulator, and try again."]);
}

SPORT_PAGES["table-tennis"] = {render};
})();

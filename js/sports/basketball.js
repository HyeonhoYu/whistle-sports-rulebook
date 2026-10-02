/* Basketball. Rules follow the NBA; FIBA (international) and college differences are noted. */
(function(){

const W = "#F4F6F1", WOOD = "#D9A867", WOOD2 = "#CF9C5A", PAINT = "#2A6B3F";
/* One end of the court in feet x 10. Hoop center at (52.5, 250). Mirror with mx(). */
function endLines(mx){
  const L = `fill="none" stroke="${W}" stroke-width="4"`;
  const X = x => mx ? 940 - x : x;
  const sweep = mx ? 0 : 1;
  return `<rect x="${Math.min(X(0),X(190))}" y="170" width="190" height="160" fill="${PAINT}" stroke="${W}" stroke-width="4"/>
    <circle cx="${X(190)}" cy="250" r="60" ${L}/>
    <path d="M${X(0)} 30L${X(142)} 30A237.5 237.5 0 0 ${sweep} ${X(142)} 470L${X(0)} 470" ${L}/>
    <path d="M${X(40)} 210L${X(52.5)} 210A40 40 0 0 ${sweep} ${X(52.5)} 290L${X(40)} 290" ${L}/>
    <line x1="${X(40)}" y1="220" x2="${X(40)}" y2="280" stroke="${W}" stroke-width="7"/>
    <circle cx="${X(52.5)}" cy="250" r="9" fill="none" stroke="#E2683A" stroke-width="4"/>`;
}
function courtSVG(){
  let s = `<svg viewBox="-40 -40 1020 580" role="img" aria-label="Diagram of an NBA basketball court">`;
  s += `<rect x="-40" y="-40" width="1020" height="580" fill="#1C4D2C"/><rect width="940" height="500" fill="${WOOD}"/>`;
  for(let y=0;y<500;y+=50) s += `<rect x="0" y="${y}" width="940" height="25" fill="${WOOD2}" opacity=".5"/>`;
  s += endLines(false) + endLines(true);
  s += `<rect width="940" height="500" fill="none" stroke="${W}" stroke-width="5"/><line x1="470" y1="0" x2="470" y2="500" stroke="${W}" stroke-width="4"/><circle cx="470" cy="250" r="60" fill="none" stroke="${W}" stroke-width="4"/>`;
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const c = (z,cx,cy,rr) => `<circle class="hz" data-zone="${z}" cx="${cx}" cy="${cy}" r="${rr}"/>`;
  const three = mx => { const X = x => mx ? 940-x : x, sw = mx ? 0 : 1, sw2 = mx ? 1 : 0;
    return `<path class="hz" data-zone="three" d="M${X(0)} 18L${X(142)} 18A249.5 249.5 0 0 ${sw} ${X(142)} 482L${X(0)} 482L${X(0)} 458L${X(142)} 458A225.5 225.5 0 0 ${sw2} ${X(142)} 42L${X(0)} 42Z"/>`; };
  s += r("out",-40,-40,1020,40) + r("out",-40,500,1020,40) + r("out",-40,0,40,500) + r("out",940,0,40,500)
     + three(false) + three(true)
     + r("paint",8,170,182,160) + r("paint",750,170,182,160)
     + c("ftline",190,250,22) + c("ftline",750,250,22)
     + `<path class="hz" data-zone="restricted" d="M40 202L52.5 202A48 48 0 0 1 52.5 298L40 298Z"/><path class="hz" data-zone="restricted" d="M900 202L887.5 202A48 48 0 0 0 887.5 298L900 298Z"/>`
     + r("backboard",30,214,18,72) + r("backboard",892,214,18,72)
     + c("hoop",52.5,250,14) + c("hoop",887.5,250,14)
     + r("halfcourt",462,0,16,500) + c("center",470,250,60);
  return s + `</svg>`;
}
const ZONES = {
  hoop:{title:"Hoop", text:"10 feet (3.05 m) off the floor, 18 inches across. The ball must go through it from above to count."},
  backboard:{title:"Backboard", text:"The flat board behind the rim. Bank shots off the front of it count. If the ball hits the back of the board or its supports, it's out of bounds."},
  three:{title:"Three-point line", text:"A made shot from beyond this arc is worth 3. The line is 23 feet 9 inches from the hoop at the top and 22 feet in the corners, which is why the corner three is the shortest. Touching the line while shooting makes it a 2."},
  paint:{title:"The paint (lane)", text:"The painted rectangle under each hoop, 16 feet wide in the NBA. An offensive player can't stand in it for more than three seconds at a time. In the NBA, a defender can't camp there for three seconds either unless guarding someone."},
  ftline:{title:"Free-throw line", text:"15 feet from the backboard. After certain fouls, a player shoots unguarded free throws from here, each worth 1 point. Shooters can't cross the line until the ball hits the rim."},
  restricted:{title:"Restricted area", text:"The small arc under the hoop. A defender standing inside it can't draw a charging foul, so an attacker who runs into them isn't called for the foul."},
  halfcourt:{title:"Half-court line", text:"Once the offense brings the ball over this line, it can't go back into its own half. The NBA gives 8 seconds to get the ball across; college men's teams get 10."},
  center:{title:"Center circle", text:"The game starts with a jump ball here: the referee tosses the ball up between one player from each team, who try to tap it to a teammate."},
  out:{title:"Sidelines and baselines", chip:"Out of bounds", text:"The lines themselves are out of bounds. Step on one while holding the ball, or let the ball touch one, and the other team inbounds it from that spot."}
};
const ZONE_ORDER = ["hoop","backboard","three","paint","ftline","restricted","halfcourt","center","out"];

/* Shot chart: one half court, hoop on the left. Click anywhere to shoot. */
function shotSVG(){
  return `<svg viewBox="-20 -20 510 540" role="img" aria-label="Half court. Click a spot to take a shot." id="shotSvg" style="cursor:crosshair">
    <rect x="-20" y="-20" width="510" height="540" fill="#1C4D2C"/><rect width="470" height="500" fill="${WOOD}"/>
    ${Array.from({length:10},(_,i) => `<rect x="0" y="${i*50}" width="470" height="25" fill="${WOOD2}" opacity=".5"/>`).join("")}
    ${endLines(false)}
    <rect width="470" height="500" fill="none" stroke="${W}" stroke-width="5"/><path d="M470 190A60 60 0 0 0 470 310" fill="none" stroke="${W}" stroke-width="4"/>
    <g id="shotMarks"></g>
    <g id="shotHover" opacity="0"><circle r="12" fill="none" stroke="#18221D" stroke-width="3"/><text id="shotHoverT" x="18" y="6" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="26" fill="#18221D"></text></g>
    <g id="shotBall" opacity="0"><circle r="10" fill="#E2683A" stroke="#18221D" stroke-width="2.5"/><path d="M-10 0h20M0 -10v20" stroke="#18221D" stroke-width="1.5"/></g>
  </svg>`;
}
const HOOP = {x:52.5, y:250};
function shotValue(x, y){
  if(x < 40) return 0;
  if(x <= 142) return Math.abs(y - 250) >= 220 ? 3 : 2;
  return Math.hypot(x - HOOP.x, y - HOOP.y) > 237.5 ? 3 : 2;
}
function shotChart(){
  const svg = document.getElementById("shotSvg"), $ = id => document.getElementById(id);
  const S = {att:0, made:0, pts:0, busy:false};
  const toCourt = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  const inside = q => q.x >= 0 && q.x <= 470 && q.y >= 0 && q.y <= 500;
  svg.addEventListener("mousemove", e => {
    const q = toCourt(e); const h = $("shotHover");
    if(!inside(q)){ h.setAttribute("opacity", 0); return; }
    const v = shotValue(q.x, q.y);
    h.setAttribute("transform", `translate(${q.x} ${q.y})`); h.setAttribute("opacity", 1);
    $("shotHoverT").textContent = v ? `${v} pts` : "No angle";
    $("shotHoverT").setAttribute("x", q.x > 380 ? -80 : 18);
  });
  svg.addEventListener("mouseleave", () => $("shotHover").setAttribute("opacity", 0));
  svg.addEventListener("click", e => {
    const q = toCourt(e); if(!inside(q) || S.busy) return;
    const v = shotValue(q.x, q.y), ft = Math.hypot(q.x - HOOP.x, q.y - HOOP.y) / 10;
    if(!v){ $("shotMsg").textContent = "That's behind the backboard. There's no way to shoot into the hoop from there."; return; }
    const p = ft < 4 ? .62 : ft < 10 ? .44 : ft < 16 ? .41 : v === 2 ? .40 : ft < 27 ? .36 : ft < 32 ? .28 : .1;
    const make = Math.random() < p; S.busy = true;
    const ball = $("shotBall"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ball.setAttribute("opacity", 1);
    const t0 = performance.now(), dur = reduce ? 1 : 700, peak = 60 + ft*4;
    const end = make ? HOOP : {x: HOOP.x + 30, y: HOOP.y + (Math.random() < .5 ? -40 : 40)};
    (function step(t){
      const k = Math.min(1, (t - t0) / dur), x = q.x + (end.x - q.x)*k, y = q.y + (end.y - q.y)*k - Math.sin(Math.PI*k)*peak*.6;
      ball.setAttribute("transform", `translate(${x} ${y}) scale(${1 + Math.sin(Math.PI*k)*.5})`);
      if(k < 1) return requestAnimationFrame(step);
      ball.setAttribute("opacity", 0); S.busy = false;
      S.att++; if(make){ S.made++; S.pts += v; }
      $("shotMarks").insertAdjacentHTML("beforeend", make
        ? `<circle cx="${q.x}" cy="${q.y}" r="9" fill="${PAINT}" stroke="#fff" stroke-width="2.5"/>`
        : `<path d="M${q.x-7} ${q.y-7}l14 14M${q.x+7} ${q.y-7}l-14 14" stroke="#C8482F" stroke-width="4" stroke-linecap="round"/>`);
      $("shotPts").textContent = S.pts; $("shotRate").textContent = `${S.made} / ${S.att}`;
      $("shotMsg").textContent = `${make ? "Swish!" : "Missed."} A ${Math.round(ft)}-foot shot ${v === 3 ? "from beyond the arc, worth 3" : "inside the arc, worth 2"}. ${v === 3 ? (ft < 23 ? "Corner threes are the shortest threes on the court." : "Threes go in less often, but each one is worth 50% more.") : (ft < 6 ? "Shots right at the rim go in most often." : "Long twos are tough shots that pay only 2.")}`;
    })(t0);
  });
  $("shotReset").addEventListener("click", () => { Object.assign(S,{att:0,made:0,pts:0}); $("shotMarks").innerHTML = ""; $("shotPts").textContent = 0; $("shotRate").textContent = "0 / 0"; $("shotMsg").textContent = "Fresh court. Take a shot."; });
}

/* Shot clock demo */
function shotClock(){
  const $ = id => document.getElementById(id); let t = 24, timer = null;
  const show = (msg) => { $("scNum").textContent = Math.ceil(t); $("scNum").classList.toggle("low", t <= 5); if(msg) $("scMsg").textContent = msg; };
  const run = () => { clearInterval(timer); timer = setInterval(() => { t = Math.max(0, t - .1); show(); if(t <= 0){ clearInterval(timer); timer = null; show("Shot clock violation! The offense didn't get a shot to hit the rim in time, so the other team gets the ball."); } }, 100); };
  $("scStart").addEventListener("click", () => { t = 24; show("New possession: 24 seconds to get a shot off that hits the rim."); run(); });
  $("scRim").addEventListener("click", () => { t = 14; show("The shot hit the rim and the offense grabbed the rebound. The clock resets to 14 seconds."); run(); });
  $("scSteal").addEventListener("click", () => { t = 24; show("The defense took the ball. New possession for them, with a full 24 seconds."); run(); });
  $("scStop").addEventListener("click", () => { clearInterval(timer); timer = null; show("Clock paused. In a real game it stops whenever the ball is dead."); });
  show();
}

const miniCourt = body => `<svg viewBox="-8 -8 136 136" aria-hidden="true"><rect x="-8" y="-8" width="136" height="136" fill="#1C4D2C"/><rect width="120" height="120" fill="${WOOD}"/>
  <rect x="0" y="40.8" width="45.6" height="38.4" fill="${PAINT}" stroke="${W}" stroke-width="1.6"/><circle cx="45.6" cy="60" r="14.4" fill="none" stroke="${W}" stroke-width="1.6"/>
  <path d="M0 7.2L33.6 7.2A57 57 0 0 1 33.6 112.8L0 112.8" fill="none" stroke="${W}" stroke-width="1.6"/>
  <line x1="9.6" y1="52.8" x2="9.6" y2="67.2" stroke="${W}" stroke-width="2.5"/><circle cx="12.6" cy="60" r="3" fill="none" stroke="#E2683A" stroke-width="1.6"/>${body}</svg>`;
const bb = (x,y) => `<circle cx="${x}" cy="${y}" r="4" fill="#E2683A" stroke="#18221D" stroke-width="1.2"/>`;
const arcTo = (x,y) => `<path d="M${x} ${y}Q${(x+12.6)/2} ${Math.min(y,60)-28} 12.6 60" fill="none" stroke="#18221D" stroke-width="1.6" stroke-dasharray="4 3"/>`;
const SCORES = [
  {pts:1, name:"Free throw", text:"An unguarded shot from the free-throw line, awarded after certain fouls.", art: miniCourt(bb(45.6,60) + arcTo(45.6,60))},
  {pts:2, name:"Two-pointer", text:"Any made shot from inside the three-point line, or with a foot on it. Layups and dunks count 2.", art: miniCourt(bb(30,82) + arcTo(30,82))},
  {pts:3, name:"Three-pointer", text:"A made shot with both feet behind the arc when the player leaves the floor. Landing inside afterward is fine.", art: miniCourt(bb(82,40) + arcTo(82,40))},
  {pts:"+1", name:"And-one", text:"Fouled while scoring? The basket counts, and the shooter gets one extra free throw.", art: miniCourt(bb(24,70) + arcTo(24,70) + `<text x="70" y="104" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="22" fill="#18221D">+1</text>`)}
];

const CLOCK = [
  {k:"q1", cls:"q", t:"Q1", s:"12 min", info:["1st quarter","The game starts with a jump ball at center court. NBA quarters are 12 minutes; FIBA and WNBA quarters are 10. College men play two 20-minute halves."]},
  {k:"q2", cls:"q", t:"Q2", s:"12 min", info:["2nd quarter","Team fouls reset at the start of each quarter, so teams can be a little more physical early in a quarter."]},
  {k:"half", cls:"half", t:"Half", s:"15 min", info:["Halftime","A 15-minute break in the NBA. Teams switch baskets for the second half."]},
  {k:"q3", cls:"q", t:"Q3", s:"12 min", info:["3rd quarter","Possession to start the quarter alternates, based on who lost the opening jump ball."]},
  {k:"q4", cls:"q", t:"Q4", s:"12 min", info:["4th quarter","Close games slow down at the end: timeouts, fouls on purpose to stop the clock, and lots of free throws."]},
  {k:"ot", cls:"ot", t:"OT", s:"5 min", info:["Overtime","If the score is tied, teams play 5-minute overtime periods until someone is ahead at the end of one. There are no ties."]}
];

const CALLS = [
  {name:"Traveling", what:"Moving with the ball without dribbling: generally more than two steps after gathering it, or shifting the pivot foot.", cost:"Violation: the other team gets the ball.", arms:'<path d="M44 38l-8 12h26"/><path d="M56 38l8 18H38"/><path d="M74 44a10 10 0 1 1-4-8" stroke-width="2.5"/>'},
  {name:"Double dribble", what:"Dribbling with both hands at once, or starting a new dribble after stopping one.", cost:"Violation: the other team gets the ball.", arms:'<path d="M44 38l-10 18 4 8"/><path d="M56 38l10 14-4 8"/><path d="M28 80v-10M28 70l-3 4M28 70l3 4M72 70v10M72 80l-3-4M72 80l3-4" stroke-width="2.5"/>'},
  {name:"Three seconds", what:"An offensive player stays in the paint for more than three seconds in a row.", cost:"Violation: the other team gets the ball.", arms:'<path d="M56 38h30"/><path d="M86 38l6-8M86 38l8-2M86 38l7 5" stroke-width="3"/><path d="M44 38l-6 30"/>'},
  {name:"Shot clock violation", what:"The offense fails to get a shot off that hits the rim before the 24-second shot clock runs out.", cost:"Violation: the other team gets the ball.", arms:'<path d="M56 38l14-16-12-12"/><path d="M44 38l-6 30"/>'},
  {name:"Personal foul", what:"Illegal contact: pushing, holding, hitting, or blocking an opponent's path with the body.", cost:"The fouled team inbounds the ball, or shoots free throws once the fouling team is in the bonus.", arms:'<path d="M56 38l16-34"/><circle cx="73" cy="0" r="5" fill="currentColor"/><path d="M44 38l-6 30"/>'},
  {name:"Shooting foul", what:"Fouling a player in the act of shooting.", cost:"Missed shot: 2 or 3 free throws, matching the shot's value. Made shot: it counts, plus 1 free throw.", arms:'<path d="M56 38l16-34"/><circle cx="73" cy="0" r="5" fill="currentColor"/><path d="M44 38H16"/><path d="M16 38l-7-6M16 38l-8 1" stroke-width="3"/>'},
  {name:"Blocking foul", what:"A defender moves into the path of a dribbler or shooter too late, or isn't set, and causes contact.", cost:"Foul on the defender.", arms:'<path d="M44 38l-14 16 14 14"/><path d="M56 38l14 16-14 14"/>'},
  {name:"Technical foul", what:"Unsportsmanlike behavior without contact, like arguing with the referee, taunting, or hanging on the rim.", cost:"The other team shoots 1 free throw. Two technicals and you're ejected.", arms:'<path d="M56 38l28-12V-4"/><path d="M44 38l22-8 4-34h28"/>'}
];

const TRICKY = [
  ["Block or charge?","It depends on the defender. If the defender got to the spot first with both feet set and outside the restricted area, the attacker who runs into them is called for a charge. If the defender was still sliding in, it's a block."],
  ["Is a foot on the line a three?","No. The line belongs to the two-point area. A shooter needs both feet completely behind the line when leaving the floor. Where they land doesn't matter."],
  ["What's goaltending?","Touching a shot while it's on its way down toward the hoop, or while it's directly above the rim. If a defender does it, the basket counts anyway. If an attacker does it, the basket is canceled."],
  ["Why do teams foul on purpose at the end?","The clock stops on a foul. A trailing team fouls to save time and force the other team to make free throws, hoping they miss and the trailing team gets the ball back."],
  ["What does fouling out mean?","Each player has a foul limit: six personal fouls in the NBA, five in FIBA and college. Reach it and you must sit for the rest of the game, though your team keeps five players."],
  ["What's the bonus?","After a team commits a set number of fouls in a quarter (five in the NBA), every further defensive foul sends the other team to the free-throw line, even if no one was shooting."]
];
const WORDS = [
  ["Rebound","Grabbing the ball after a missed shot. Offensive rebounds give the shooting team another try."],
  ["Assist","A pass that leads directly to a teammate's basket."],
  ["Turnover","Losing the ball to the other team through a bad pass, a steal, or a violation."],
  ["Fast break","Racing up the court to score before the defense can set up."],
  ["Pick and roll","A teammate sets a screen for the ball handler, then cuts toward the basket for a pass."],
  ["Paint","The painted lane under each basket, where most close shots happen."],
  ["Buzzer-beater","A shot released just before time runs out that goes in after the buzzer."],
  ["Airball","A shot that misses everything: rim, net, and backboard."],
  ["Triple-double","Reaching 10 or more in three stat categories in one game, such as points, rebounds, and assists."],
  ["Inbound","Passing the ball in from out of bounds to restart play."]
];

const quizCourt = (x,y) => `<svg viewBox="-8 -8 136 136" style="width:180px" aria-hidden="true"><rect x="-8" y="-8" width="136" height="136" fill="#1C4D2C"/><rect width="120" height="120" fill="${WOOD}"/>
  <rect x="0" y="40.8" width="45.6" height="38.4" fill="${PAINT}" stroke="${W}" stroke-width="1.6"/><circle cx="45.6" cy="60" r="14.4" fill="none" stroke="${W}" stroke-width="1.6"/>
  <path d="M0 7.2L33.6 7.2A57 57 0 0 1 33.6 112.8L0 112.8" fill="none" stroke="${W}" stroke-width="2"/><line x1="9.6" y1="52.8" x2="9.6" y2="67.2" stroke="${W}" stroke-width="2.5"/><circle cx="12.6" cy="60" r="3" fill="none" stroke="#E2683A" stroke-width="1.6"/>
  <circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#F2C230" stroke-width="3"/><circle cx="${x}" cy="${y}" r="4" fill="#2F6FD6"/></svg>`;
const QUIZ = [
  {q:"A shot from the marked spot goes in. How many points?", visual:() => quizCourt(92,48), o:["1","2","4","3"], a:3, why:"The spot is outside the three-point arc, so a made shot is worth 3."},
  {q:"A shooter's toe is on the three-point line when they shoot, and it goes in. How many points?", o:["2","3","1","It doesn't count"], a:0, why:"The line is part of the two-point area. Both feet must be behind it for a three."},
  {q:"How long is the NBA shot clock?", o:["14 seconds","24 seconds","30 seconds","35 seconds"], a:1, why:"24 seconds to get a shot off that hits the rim. College basketball uses 30."},
  {q:"A player takes four steps holding the ball without dribbling. What's the call?", o:["Double dribble","Three seconds","Traveling","Backcourt"], a:2, why:"Moving with the ball without dribbling is traveling. The other team gets possession."},
  {q:"The referee makes this signal. What's the call?", visual:() => fig(CALLS[7].arms), o:["Technical foul","Timeout","Traveling","Jump ball"], a:0, why:"Hands forming a T means a technical foul, called for unsportsmanlike behavior. The other team gets a free throw."},
  {q:"A player is fouled while shooting a three-pointer and misses. How many free throws?", o:["1","2","None, just the ball","3"], a:3, why:"Free throws match the value of the shot that was fouled. A missed three earns three free throws."},
  {q:"A player is fouled on a layup, and the ball goes in anyway. What happens?", o:["The basket is canceled","The basket counts, plus 1 free throw","2 free throws instead","The play is replayed"], a:1, why:"That's an and-one. The basket counts, and the shooter gets one extra free throw."},
  {q:"How many personal fouls before an NBA player fouls out?", o:["4","5","6","7"], a:2, why:"Six in the NBA. FIBA and college players foul out after five."},
  {q:"A defender swats a shot that's already falling toward the rim. What happens?", o:["Great block, play on","Jump ball","The shot is retaken","Goaltending: the basket counts"], a:3, why:"Touching a shot on its way down toward the hoop is goaltending. The basket is awarded to the shooting team."},
  {q:"The offense has crossed half court, then dribbles back over the line into its own half. What's the call?", o:["Backcourt violation","Nothing, that's legal","Traveling","Technical foul"], a:0, why:"Once the ball is in the frontcourt, the offense can't take it back into the backcourt. The other team gets the ball."}
];

function render(app){
  app.innerHTML = sportHero({id:"basketball", name:"Basketball", alt:"The tabby cat in a red number 8 jersey, leaping for a dunk",
      lede:"Two teams of five try to shoot the ball through the other team's hoop. Players move the ball by dribbling or passing, never by running while holding it. Shots from farther out are worth more, and the team with more points when time runs out wins.",
      facts:[["5","players per side on the court"],["48","minutes in an NBA game"],["24","seconds to take a shot"],["3","points from beyond the arc"]]})
    + jumpNav([["b-court","The court"],["b-shot","Shot chart"],["b-score","Scoring"],["b-clock","The clocks"],["b-calls","Violations and fouls"],["b-tricky","Tricky rules"],["b-words","Words you'll hear"],["b-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("b-court","The court","Tap any part of the court to see what it does.",
        `<div class="fieldbox" id="court">${courtSVG()}</div><div class="fieldrow"><div class="zonechips" id="courtChips"></div><div class="infopanel" id="courtInfo" aria-live="polite"></div></div>`)
    + section("b-shot","Take your shot","Click anywhere on the court to shoot. Hover first to see what the shot is worth. Green dots are makes, red marks are misses.",
        `<div class="oslab"><div class="fieldbox">${shotSVG()}</div>
          <div class="osside">
            <div class="board" style="grid-template-columns:1fr 1fr"><div><small>Points</small><b id="shotPts">0</b></div><div><small>Made / taken</small><b id="shotRate">0 / 0</b></div></div>
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="shotMsg">Pick a spot. Close shots go in more often, but threes are worth more.</p></div>
            <div class="controls"><button class="btn" id="shotReset" type="button">Clear the court</button></div>
          </div></div>`)
    + section("b-score","Scoring","Every basket is worth 1, 2, or 3 points.",
        `<div class="scoring">${SCORES.map(s => `<div class="score">${s.art}<div class="pts">${s.pts}<small>${s.pts===1?"point":s.pts==="+1"?"free throw":"points"}</small></div><h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("b-clock","The clocks","Basketball runs on two clocks: the game clock and the shot clock.",
        `<div class="timeline" id="bTimeline"></div><div class="infopanel" id="bClockInfo" style="margin-top:14px" aria-live="polite"></div>
        <div class="shotclock">
          <div class="scface"><small>Shot clock</small><b id="scNum">24</b></div>
          <div class="osside">
            <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="scMsg">Start a possession and watch the clock run.</p></div>
            <div class="controls"><button class="btn primary" id="scStart" type="button">Start possession</button><button class="btn" id="scRim" type="button">Shot hits rim, offense rebounds</button><button class="btn" id="scSteal" type="button">Defense steals it</button><button class="btn" id="scStop" type="button">Pause</button></div>
          </div>
        </div>`)
    + section("b-calls","Violations and fouls","A violation breaks a rule about handling the ball, and the other team simply gets possession. A foul is illegal contact, and it can lead to free throws.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("b-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="bFlips"></div>`)
    + section("b-words","Words you'll hear","",`<dl class="gloss" id="bGloss"></dl>`)
    + section("b-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="bQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the NBA. FIBA (international), WNBA, and college games differ in quarter length, shot clock, three-point distance, and foul limits, as noted above.</footer></div>`;

  setupZones(document.getElementById("court"), document.getElementById("courtChips"), document.getElementById("courtInfo"), ZONES, ZONE_ORDER, "three");
  shotChart();
  setupTimeline(document.getElementById("bTimeline"), document.getElementById("bClockInfo"), CLOCK,
    "The game clock stops whenever the ball is dead: fouls, timeouts, the ball going out of bounds, and after made baskets late in a quarter. A 48-minute NBA game takes about two and a half hours.");
  shotClock();
  flipCards(document.getElementById("bFlips"), TRICKY);
  glossary(document.getElementById("bGloss"), WORDS);
  makeQuiz(document.getElementById("bQuiz"), QUIZ, [
    "Nothing but net. Turn on a game and see if you can spot the next goaltending call.",
    "Strong game. Take a few more shots in the shot chart, then try the quiz once more.",
    "Look over the violation and foul signals again, then come back for another try.",
    "No worries. Start with the court diagram and the scoring cards, then try again."]);
}

SPORT_PAGES["basketball"] = {render};
})();

/* Indoor volleyball. Rules follow FIVB (international); US college differences are small and noted. */
(function(){

const W = "#F4F6F1", FLOOR = "#E3A15C", FREE = "#2A6B3F";
/* Court 18 x 9 m at 50 units per meter. Net at x=450. Left side is "your" team. */
function courtBase(){
  let s = `<rect x="-90" y="-50" width="1080" height="550" fill="${FREE}"/>
    <rect width="900" height="450" fill="${FLOOR}"/><rect x="300" width="300" height="450" fill="#D9934E"/>
    <rect width="900" height="450" fill="none" stroke="${W}" stroke-width="5"/>
    <line x1="300" y1="0" x2="300" y2="450" stroke="${W}" stroke-width="5"/><line x1="600" y1="0" x2="600" y2="450" stroke="${W}" stroke-width="5"/>
    <path d="M300 -8v-30M300 458v30M600 -8v-30M600 458v30" stroke="${W}" stroke-width="4" stroke-dasharray="8 8"/>
    <line x1="450" y1="0" x2="450" y2="450" stroke="${W}" stroke-width="5"/>
    <line x1="450" y1="-34" x2="450" y2="484" stroke="#18221D" stroke-width="9"/>
    <circle cx="450" cy="-40" r="9" fill="#18221D"/><circle cx="450" cy="490" r="9" fill="#18221D"/>`;
  [0,450].forEach(y => { for(let k=0;k<4;k++) s += `<rect x="445" y="${y-14+k*7}" width="10" height="7" fill="${k%2 ? "#fff" : "#D9342B"}"/>`; });
  return s;
}
function courtSVG(){
  const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  return `<svg viewBox="-90 -50 1080 550" role="img" aria-label="Top-down diagram of a volleyball court">${courtBase()}
    ${r("free",-90,-50,1080,550)}${r("service",-90,0,84,450)}${r("service",906,0,84,450)}
    ${r("back",6,6,288,438)}${r("back",606,6,288,438)}${r("front",306,6,138,438)}${r("front",456,6,138,438)}
    ${r("lines",-6,-6,12,462)}${r("lines",894,-6,12,462)}${r("lines",-6,-6,912,12)}${r("lines",-6,444,912,12)}
    ${r("attack",292,-40,16,530)}${r("attack",592,-40,16,530)}
    ${r("net",440,-36,20,522)}${r("antenna",436,-22,28,30)}${r("antenna",436,442,28,30)}</svg>`;
}
const ZONES = {
  net:{title:"Net and center line", chip:"Net", text:"2.43 m (7 ft 11\u215d in) high for men and 2.24 m (7 ft 4\u215b in) for women. Touching the net while playing the ball is a fault. Under it runs the center line: a foot may cross it as long as part of the foot stays on or above the line."},
  antenna:{title:"Antennae", text:"Flexible striped rods on the net above each sideline. The ball must cross the net between them. A ball that touches an antenna is out."},
  front:{title:"Front zone", text:"Between the attack line and the net. Only the three front-row players may block, or attack the ball from above the top of the net, in this zone."},
  back:{title:"Back zone", text:"Behind the attack line. Back-row players can still attack, but if they hit the ball from above net height, they must take off from behind the attack line."},
  attack:{title:"Attack line", text:"3 m (about 10 ft) from the center line. It splits each side into front and back zones, and it extends past the sidelines as a dashed line."},
  lines:{title:"Boundary lines", text:"The court is 18 m by 9 m (about 59 by 30 ft). Lines are in: a ball that touches any part of a line is in."},
  service:{title:"Service zone", text:"The server stands behind the end line, anywhere across the width of the court, and has 8 seconds after the whistle to serve."},
  free:{title:"Free zone", text:"The space around the court. Players can chase a ball out here and keep it alive, as long as their team hasn't used up its three touches."}
};
const ZONE_ORDER = ["net","antenna","front","back","attack","lines","service","free"];

/* Rally simulator with rotation. Positions: 1 right back (server), 2 right front, 3 middle front, 4 left front, 5 left back, 6 middle back. */
const POS = {1:[75,375], 2:[375,375], 3:[375,225], 4:[375,75], 5:[75,75], 6:[75,225]};
function simSVG(){
  const pl = (i,n) => `<g class="mv" id="vp${i}"><circle r="26" fill="#2F6FD6" stroke="#0A110D" stroke-width="3"/><text y="8" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="24" fill="#fff">${n}</text></g>`;
  const opp = [[825,75],[825,225],[825,375],[525,75],[525,225],[525,375]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="22" fill="#C8482F" stroke="#0A110D" stroke-width="3" opacity=".85"/>`).join("");
  return `<svg viewBox="-90 -50 1080 550" role="img" aria-label="Your team's rotation on the court">${courtBase()}
    ${[1,2,3,4,5,6].map(p => `<text x="${POS[p][0]}" y="${POS[p][1]+52}" text-anchor="middle" font-family="Barlow,sans-serif" font-size="17" fill="#18221D" opacity=".6">Position ${p}</text>`).join("")}
    ${opp}${["7","3","11","5","9","1"].map((n,i) => pl(i,n)).join("")}
    <g class="mv" id="vBall"><circle r="13" fill="#fff" stroke="#0A110D" stroke-width="2.5"/><path d="M-13 0q13 -8 26 0M-6 -11q4 11 0 22" fill="none" stroke="#2F6FD6" stroke-width="2"/></g></svg>`;
}
function rallySim(){
  const $ = id => document.getElementById(id);
  const NUM = ["7","3","11","5","9","1"];
  const S = {pos:[1,2,3,4,5,6], us:0, them:0, setsUs:0, setsThem:0, set:1, serve:"us", over:false, matchOver:false};
  const place = (i,[x,y]) => $(`vp${i}`).style.transform = `translate(${x}px, ${y}px)`;
  function draw(){
    S.pos.forEach((p,i) => place(i, POS[p]));
    $("vBall").style.transform = S.serve === "us" ? "translate(-45px, 375px)" : "translate(945px, 75px)";
    $("vSets").textContent = `${S.setsUs} - ${S.setsThem}`; $("vPts").textContent = `${S.us} - ${S.them}`;
    $("vServe").textContent = S.serve === "us" ? `You (#${NUM[S.pos.indexOf(1)]})` : "Them";
    $("vTarget").textContent = `Set ${S.set}: first to ${S.set === 5 ? 15 : 25}, win by 2`;
    $("vRally").hidden = $("vRally5").hidden = S.over; $("vNext").hidden = !S.over;
    $("vNext").textContent = S.matchOver ? "Start a new match" : "Start the next set";
  }
  const WIN = {
    kill:"Kill! The attack hits the floor on their side.", block:"Stuff block! The front row sends their spike straight back down.",
    ace:"Ace! The serve lands without them touching it.", out:"They hit their attack long. Out, so the point is yours.",
    serr:"They serve into the net. A service error gives you the point.", four:"They take four touches. Only three are allowed.",
    net:"They touch the net while blocking. Net fault, point to you.", dbl:"Their setter touches the ball twice in a row. Double contact."
  };
  const LOSE = {
    kill:"They hammer a kill past your block.", block:"They block your attack straight down.", ace:"Their serve is an ace. Nobody touches it.",
    out:"Your attack sails past the end line. Out.", serr:"Your serve hits the net. Service error.", four:"Your team uses four touches. Fault.",
    net:"Your blocker brushes the net. Net fault.", dbl:"Your setter double-contacts the ball. Fault."
  };
  function rally(){
    if(S.over) return "";
    const serverWins = Math.random() < .42, winner = serverWins ? S.serve : (S.serve === "us" ? "them" : "us");
    let keys = ["kill","kill","kill","block","out","four","net","dbl"];
    if(winner === S.serve) keys.push("ace"); else keys.push("serr","serr");
    const k = keys[Math.floor(Math.random()*keys.length)];
    let msg = (winner === "us" ? WIN : LOSE)[k];
    winner === "us" ? S.us++ : S.them++;
    if(winner !== S.serve){
      S.serve = winner;
      if(winner === "us"){ S.pos = S.pos.map(p => p === 1 ? 6 : p - 1); msg += ` Side-out: you win the serve back, so everyone rotates one spot clockwise. #${NUM[S.pos.indexOf(1)]} moves to position 1 to serve.`; }
      else msg += " They win the serve. Your team stays put until you win it back.";
    }
    const target = S.set === 5 ? 15 : 25, a = S.us, b = S.them;
    if((a >= target || b >= target) && Math.abs(a - b) >= 2){
      S.over = true; const won = a > b; won ? S.setsUs++ : S.setsThem++;
      msg += ` That's set ${S.set}, ${a}-${b} to ${won ? "you" : "them"}.`;
      if(S.setsUs === 3 || S.setsThem === 3){ S.matchOver = true; msg += S.setsUs === 3 ? " You win the match!" : " They win the match."; }
    } else if(a >= target - 1 && b >= target - 1 && a === b) msg += " Tied late in the set: someone has to win by two.";
    return msg;
  }
  const show = (msg) => { $("vMsg").textContent = msg; const li = document.createElement("li"); li.textContent = `${S.us}-${S.them}: ${msg.split(/(?<=[.!]) /)[0]}`; const ul = $("vLog"); ul.prepend(li); while(ul.children.length > 6) ul.lastChild.remove(); draw(); };
  $("vRally").addEventListener("click", () => show(rally()));
  $("vRally5").addEventListener("click", () => { let m = ""; for(let i = 0; i < 5 && !S.over; i++) m = rally(); show(m); });
  $("vNext").addEventListener("click", () => {
    if(S.matchOver) Object.assign(S, {setsUs:0, setsThem:0, set:1, matchOver:false, pos:[1,2,3,4,5,6]}); else S.set++;
    Object.assign(S, {us:0, them:0, over:false, serve: S.set % 2 ? "us" : "them"});
    $("vMsg").textContent = S.set === 5 ? "Deciding fifth set! This one only goes to 15." : `Set ${S.set}. Fresh score, 0-0.`; $("vLog").innerHTML = ""; draw();
  });
  draw();
}

/* Side view for the skills cards. Floor y=100, net at x=100. */
const side = body => `<svg viewBox="0 0 200 110" aria-hidden="true"><rect width="200" height="110" fill="#1C4D2C"/><rect y="100" width="200" height="10" fill="${FLOOR}"/>
  <line x1="100" y1="44" x2="100" y2="100" stroke="${W}" stroke-width="1.5" stroke-dasharray="3 3"/><rect x="98" y="44" width="4" height="22" fill="#fff" opacity=".9"/>${body}</svg>`;
const who = (x, up) => `<g stroke="#2F6FD6" stroke-width="3" stroke-linecap="round" fill="none"><circle cx="${x}" cy="${up ? 58 : 66}" r="5" fill="#2F6FD6"/><path d="M${x} ${up ? 63 : 71}V${up ? 84 : 88}M${x} ${up ? 84 : 88}l-5 ${up ? 12 : 12}M${x} ${up ? 84 : 88}l5 12"/></g>`;
const vb = (x,y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#fff" stroke="#0A110D" stroke-width="1.2"/>`;
const arc = d => `<path d="${d}" fill="none" stroke="#F2C230" stroke-width="2" stroke-dasharray="5 4"/>`;
const SKILLS = [
  {name:"Serve", text:"Starts every rally from behind the end line. It must clear the net between the antennae and land in.", art: side(who(14) + arc("M20 62Q100 -6 170 98") + vb(20,62))},
  {name:"Pass", text:"Touch one. Usually a forearm bump that takes the sting off the serve and sends it up to the setter.", art: side(who(40) + arc("M150 20Q60 30 44 76") + arc("M44 76Q60 10 82 40") + vb(44,76))},
  {name:"Set", text:"Touch two. The setter pushes the ball up with the fingertips, placing it for a hitter. It must be a clean touch, not a catch.", art: side(who(80, true) + arc("M80 50Q86 2 94 34") + vb(80,50))},
  {name:"Attack", text:"Touch three. A hitter jumps and spikes the ball down into the other court. Tips and rolls count too.", art: side(who(90, true) + arc("M93 40L160 98") + vb(93,40))},
  {name:"Block", text:"Front-row players jump at the net to stop an attack. A block doesn't count as one of the three touches.", art: side(who(93, true) + arc("M165 28L103 44L135 98") + vb(103,44))},
  {name:"Dig", text:"Keeping a hard-hit attack off the floor, often with a dive. The ball is in play until it touches the ground.", art: side(who(36) + arc("M100 46L40 86L52 30") + vb(40,86))}
];

const CALLS = [
  {name:"Ball in", what:"An arm and hand pointed down at the floor on the side where the ball landed.", cost:"Point to the team that hit it there.", arms:'<path d="M56 38l26 40"/><path d="M44 38l-6 30"/>'},
  {name:"Ball out", what:"Both forearms raised straight up, palms facing the referee's body.", cost:"Point to the team that didn't touch it last.", arms:'<path d="M44 38l-10 14V24"/><path d="M56 38l10 14V24"/>'},
  {name:"Four hits", what:"Four fingers held up: a team touched the ball four times before sending it over.", cost:"Point to the other team.", arms:'<path d="M56 38l8-22"/><path d="M64 16l-4-10M64 16l-1-11M64 16l3-10M64 16l6-8" stroke-width="2.5"/><path d="M44 38l-6 30"/>'},
  {name:"Double contact", what:"Two fingers held up: one player touched the ball twice in a row.", cost:"Point to the other team.", arms:'<path d="M56 38l8-22"/><path d="M64 16l-2-11M64 16l4-10" stroke-width="2.5"/><path d="M44 38l-6 30"/>'},
  {name:"Held ball", what:"A palm slowly lifted: the ball was caught or thrown instead of cleanly hit.", cost:"Point to the other team.", arms:'<path d="M56 38l14 12 6-14"/><path d="M70 36h14" stroke-width="3"/><path d="M44 38l-6 30"/>'},
  {name:"Rotation fault", what:"A finger traced in a circle: a team was out of its rotation order when the ball was served.", cost:"Point to the other team, and the order is corrected.", arms:'<path d="M56 38l10-16"/><path d="M60 8a10 10 0 1 0 14 8" stroke-width="2.5"/><path d="M44 38l-6 30"/>'}
];

const CLOCK = [
  {k:"s1", cls:"q", t:"Set 1", s:"to 25", info:["Sets 1 to 4","Each set goes to 25 points, and a team must win by 2, so a set can run to 26-24, 30-28, or beyond. Every rally scores a point, no matter who served."]},
  {k:"s2", cls:"q", t:"Set 2", s:"to 25", info:["Set 2","Teams switch sides of the court after every set."]},
  {k:"s3", cls:"q", t:"Set 3", s:"to 25", info:["Set 3","A team that wins the first three sets wins the match 3-0, and the rest aren't played."]},
  {k:"s4", cls:"q", t:"Set 4", s:"to 25", info:["Set 4","Played only if neither team has three set wins yet."]},
  {k:"s5", cls:"ot", t:"Set 5", s:"to 15", info:["Deciding set","If the match is tied 2-2, a shorter fifth set goes to 15, still win by 2. Teams switch sides when the leader reaches 8 points."]}
];

const TRICKY = [
  ["Does a block count as a touch?","No. After a block, the blocking team still gets three more touches, and the blocker can even make the next one."],
  ["Is a ball on the line in?","Yes. If any part of the ball touches any part of the line, it's in."],
  ["Can you kick the ball?","Yes. In indoor volleyball the ball may touch any part of the body, feet included, as long as it's a clean hit and not a catch."],
  ["Why do players switch spots after the serve?","Rotation order only matters at the instant of the serve. Once the ball is struck, players move to their specialty spots, like the setter sliding to the right front."],
  ["What's the libero?","A defensive specialist in a different-colored jersey who plays only in the back row. The libero can't attack the ball from above net height and can't block, but can swap in and out freely."],
  ["Can one player touch the ball twice?","Not in a row, with two exceptions: right after a block, and on a team's first touch when the ball bounces off the body during one single action."]
];
const WORDS = [
  ["Ace","A serve that scores directly: the other team can't return it."],
  ["Kill","An attack that ends the rally with a point."],
  ["Dig","Saving a hard-driven attack before it hits the floor."],
  ["Side-out","Winning a rally while the other team serves, which earns your team the serve."],
  ["Setter","The playmaker who takes the second touch and sets up the hitters."],
  ["Outside hitter","An attacker who hits from the left front, often the team's busiest scorer."],
  ["Libero","The back-row defensive specialist in a different-colored jersey."],
  ["Tip","A soft push of the ball over or around the block instead of a hard spike."],
  ["Pancake","A dig made by sliding a flat hand along the floor so the ball bounces off the back of it."],
  ["Joust","Two players pushing on the ball above the net at the same moment."]
];

const lineMini = () => `<svg viewBox="0 0 240 150" style="width:220px;border-radius:8px" aria-hidden="true"><rect width="240" height="150" fill="${FREE}"/><rect x="20" y="20" width="200" height="110" fill="${FLOOR}"/>
  <rect x="20" y="20" width="200" height="110" fill="none" stroke="${W}" stroke-width="5"/><circle cx="160" cy="20" r="10" fill="#fff" stroke="#0A110D" stroke-width="2"/></svg>`;
const QUIZ = [
  {q:"How many players does each team have on the court?", o:["5","6","7","9"], a:1, why:"Six per side: three in the front row and three in the back row."},
  {q:"How many touches can a team use before the ball must go over?", o:["3","2","4","Unlimited"], a:0, why:"Three touches, usually pass, set, and attack. A block doesn't count as one."},
  {q:"How many points win a regular set?", o:["21","15","25, by 2","30"], a:2, why:"25 points, and you must lead by 2. The deciding fifth set goes to 15."},
  {q:"The ball lands like this, touching the line. What's the call?", visual: lineMini, o:["Out","Replay","Point to whoever served","In"], a:3, why:"Lines are in. Any part of the ball touching the line counts as in."},
  {q:"A team blocks the ball, then makes three more touches. Is that legal?", o:["Yes, the block doesn't count","No, that's four hits","Only for the libero","Only in the fifth set"], a:0, why:"A block isn't counted as a team touch, so three more are allowed."},
  {q:"The referee shows this signal. What's the call?", visual:() => fig(CALLS[2].arms), o:["Double contact","Four hits","Ball out","Timeout"], a:1, why:"Four fingers up means four hits: the team touched the ball too many times."},
  {q:"The match is tied two sets each. How long is the fifth set?", o:["25 points","21 points","15 points, by 2","Until time runs out"], a:2, why:"The deciding set goes to 15 and must still be won by 2."},
  {q:"Your team wins a rally while the other team was serving. What happens?", o:["Nothing changes","You rotate one spot clockwise and serve","They serve again","You get two points"], a:1, why:"That's a side-out. You score, win the serve, and rotate clockwise so a new player serves."},
  {q:"An attack clips the antenna on its way over. What's the call?", o:["Point continues","Ball in","Replay the point","Ball out"], a:3, why:"The antennae mark the crossing space. Touching one makes the ball out."},
  {q:"What can't the libero do?", o:["Pass the serve","Dig an attack","Block or attack from above net height","Play in the back row"], a:2, why:"The libero is a back-row defender who can't block or attack the ball from above the top of the net."}
];

function render(app){
  app.innerHTML = sportHero({id:"volleyball", name:"Volleyball", alt:"The tabby cat in a red jersey, jumping to spike a volleyball",
      lede:"Two teams of six face each other across a high net. Each side gets up to three touches to send the ball back over. A rally ends when the ball hits the floor, goes out, or someone commits a fault, and every rally scores a point for someone.",
      facts:[["6","players per side"],["3","touches to get it over"],["25","points to win a set"],["5","sets at most"]]})
    + jumpNav([["v-court","The court"],["v-sim","Play a set"],["v-skills","The touches"],["v-calls","Referee calls"],["v-clock","Sets"],["v-tricky","Tricky rules"],["v-words","Words you'll hear"],["v-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("v-court","The court","Tap any part of the court to see what it does.",
        `<div class="fieldbox" id="vCourt">${courtSVG()}</div><div class="fieldrow"><div class="zonechips" id="vChips"></div><div class="infopanel" id="vInfo" aria-live="polite"></div></div>`)
    + section("v-sim","Play a set","You're the blue team on the left. Play rallies and watch the score and your rotation. Every time you win the serve back, your players rotate one spot clockwise.",
        `<div class="sim"><div class="board"><div class="dd"><small id="vTarget">Set 1</small><b id="vPts">0 - 0</b></div><div><small>Sets</small><b id="vSets">0 - 0</b></div><div><small>Serving</small><b id="vServe" style="font-size:1.6rem">You</b></div></div>
          <div class="fieldbox">${simSVG()}</div>
          <div class="controls"><button class="btn primary" id="vRally" type="button">Play a rally</button><button class="btn" id="vRally5" type="button">Play 5 rallies</button><button class="btn primary" id="vNext" type="button" hidden>Start the next set</button></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="vMsg">You serve first. Player #7 is in position 1, the serving spot.</p><p class="hint">Front row: positions 4, 3, 2. Back row: positions 5, 6, 1.</p></div></div>
          <ul class="log" id="vLog"></ul></div>`)
    + section("v-skills","The touches","A typical rally: serve, then pass, set, attack. Blue is the player, yellow dashes show the ball.",
        `<div class="scoring restarts">${SKILLS.map(s => `<div class="score">${s.art}<h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>`)
    + section("v-calls","Referee calls","The first referee stands on a platform at the net and signals each fault.",
        `<div class="pens">${CALLS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("v-clock","Sets","Volleyball has no game clock. Matches are best of five sets. Tap a set to learn more.",
        `<div class="timeline" id="vTimeline"></div><div class="infopanel" id="vClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("v-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="vFlips"></div>`)
    + section("v-words","Words you'll hear","",`<dl class="gloss" id="vGloss"></dl>`)
    + section("v-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="vQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow FIVB, used in international play. US college and high school rules are very similar, with small differences in substitutions, the libero, and some best-of-three matches.</footer></div>`;

  setupZones(document.getElementById("vCourt"), document.getElementById("vChips"), document.getElementById("vInfo"), ZONES, ZONE_ORDER, "net");
  rallySim();
  setupTimeline(document.getElementById("vTimeline"), document.getElementById("vClockInfo"), CLOCK,
    "Each team gets two 30-second timeouts per set in international play. A typical best-of-five match takes about one and a half to two hours.");
  flipCards(document.getElementById("vFlips"), TRICKY);
  glossary(document.getElementById("vGloss"), WORDS);
  makeQuiz(document.getElementById("vQuiz"), QUIZ, [
    "Perfect set! Catch a match and try to spot the setter sliding into place after every serve.",
    "Nice rally. Play another set in the simulator to lock in the rotation.",
    "Look over the touches and referee signals again, then come back for another try.",
    "No worries. Start with the court diagram and play a set in the simulator, then try again."]);
}

SPORT_PAGES["volleyball"] = {render};
})();

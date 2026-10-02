/* American football. Rules follow the NFL; college and high school differences are noted. */
(function(){

const ZONES = {
  field:{title:"Field of play", text:"100 yards from one goal line to the other, and 53\u2153 yards wide. A line every 5 yards helps everyone track progress, and the numbers count up to 50 at midfield, then back down."},
  endzone:{title:"End zone", text:"The 10-yard area at each end. Carry the ball into it, or catch a pass inside it, and you score a touchdown. Each team defends one end zone and attacks the other."},
  goalline:{title:"Goal line", text:"The front edge of the end zone. The ball only has to touch or cross the plane of this line, like an invisible wall going straight up, for a touchdown. The player does not need to be fully in."},
  midfield:{title:"50-yard line", text:"Midfield. Yard lines are named by which half they're in: your own 30 is 30 yards from the goal line you defend; the opponent's 30 is 30 yards from the end zone you're attacking."},
  hashes:{title:"Hash marks", text:"Two rows of short lines near the middle. When a play ends close to the sideline, the ball is brought back in to the nearest hash mark, so the next play doesn't start squeezed against the edge."},
  sideline:{title:"Sidelines and out of bounds", chip:"Sidelines", text:"Step on or beyond the white border while holding the ball and the play is over. Going out of bounds also stops the game clock, which is why players head there late in close games."},
  goalpost:{title:"Goalposts", text:"Stand at the back of each end zone. Field goals and extra-point kicks must pass between the two uprights and above the crossbar."},
  scrimmage:{title:"Line of scrimmage (blue on TV)", chip:"Line of scrimmage", text:"Where the ball sits before a play. Neither team may cross it until the ball is snapped. The blue line is a broadcast graphic, not paint on the grass."},
  firstdown:{title:"First-down line (yellow on TV)", chip:"First-down line", text:"The spot the offense must reach to earn a fresh set of four downs. It's also a TV graphic. In the stadium, officials track it with a 10-yard chain on the sideline."}
};
const ZONE_ORDER = ["endzone","goalline","field","midfield","hashes","sideline","goalpost","scrimmage","firstdown"];

function fieldSVG(id, interactive){
  const T = (x,y,n,rot) => `<text x="${x}" y="${y}" fill="#F4F6F1" opacity=".9" font-family="Barlow Condensed,sans-serif" font-weight="600" font-size="46" text-anchor="middle"${rot ? ` transform="rotate(180 ${x} 48)"` : ""}>${n}</text>`;
  let s = `<svg viewBox="-40 -40 1280 614" role="img" aria-label="Diagram of an American football field">`;
  s += `<rect x="-40" y="-40" width="1280" height="614" fill="#1C4D2C"/><rect x="0" y="0" width="1200" height="534" fill="#2A6B3F"/>`;
  for(let i=0;i<10;i+=2) s += `<rect x="${100+i*100}" y="0" width="100" height="534" fill="#2F7546"/>`;
  s += `<rect x="0" y="0" width="100" height="534" fill="#245E37"/><rect x="1100" y="0" width="100" height="534" fill="#245E37"/>`;
  [[50,-90],[1150,90]].forEach(([x,r]) => s += `<text x="${x}" y="267" fill="#F4F6F1" opacity=".35" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="54" text-anchor="middle" dominant-baseline="middle" transform="rotate(${r} ${x} 267)">END ZONE</text>`);
  for(let y=0;y<=100;y+=5){ const x=100+y*10; s += `<line x1="${x}" y1="0" x2="${x}" y2="534" stroke="#F4F6F1" stroke-width="${y%100===0?6:3}"/>`; }
  for(let y=1;y<100;y++){ if(y%5===0) continue; const x=100+y*10;
    [[2,14],[520,532],[229,241],[292,304]].forEach(([a,b]) => s += `<line x1="${x}" y1="${a}" x2="${x}" y2="${b}" stroke="#F4F6F1" stroke-width="2"/>`); }
  for(let t=10;t<=90;t+=10){ const x=100+t*10, n=t<=50?t:100-t; s += T(x,470,n) + T(x,64,n,true); }
  s += `<rect x="0" y="0" width="1200" height="534" fill="none" stroke="#F4F6F1" stroke-width="6"/>`;
  [0,1200].forEach(x => { const d = x===0?-1:1; s += `<line x1="${x}" y1="236" x2="${x}" y2="298" stroke="#F2C230" stroke-width="7"/><line x1="${x}" y1="267" x2="${x+d*22}" y2="267" stroke="#F2C230" stroke-width="6"/>`; });
  s += `<g class="mv" id="${id}-fd"><rect x="97" y="0" width="7" height="534" fill="#F2C230"/></g>`;
  s += `<g class="mv" id="${id}-los"><rect x="97" y="0" width="7" height="534" fill="#2F6FD6"/></g>`;
  s += `<g class="mv" id="${id}-ball"><ellipse cx="100" cy="267" rx="16" ry="10" fill="#7A4521" stroke="#3E220F" stroke-width="2"/><path d="M93 267h14M96 264v6M100 264v6M104 264v6" stroke="#F4F6F1" stroke-width="1.6"/></g>`;
  if(interactive){
    const r = (z,x,y,w,h) => `<rect class="hz" data-zone="${z}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    s += r("field",100,0,1000,534) + r("hashes",100,222,1000,90) + r("endzone",0,0,100,534) + r("endzone",1100,0,100,534)
      + r("midfield",490,0,20,534) + r("goalline",92,0,16,534) + r("goalline",1092,0,16,534)
      + r("sideline",-40,-40,1280,40) + r("sideline",-40,534,1280,40) + r("sideline",-40,0,40,534) + r("sideline",1200,0,40,534)
      + r("goalpost",-30,226,44,82) + r("goalpost",1186,226,44,82) + r("scrimmage",342,0,22,534) + r("firstdown",442,0,22,534);
  }
  return s + `</svg>`;
}
function place(id, part, yard, show=true){
  const g = document.getElementById(`${id}-${part}`);
  g.style.transform = `translateX(${yard*10}px)`; g.style.opacity = show ? 1 : 0;
}

const mini = body => `<svg viewBox="0 0 200 100" aria-hidden="true"><rect width="200" height="100" fill="#2A6B3F"/>${body}</svg>`;
const ezRight = `<rect x="150" y="0" width="50" height="100" fill="#245E37"/><line x1="150" y1="0" x2="150" y2="100" stroke="#F4F6F1" stroke-width="3"/>`;
const ball = (x,y) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#7A4521" stroke="#3E220F" stroke-width="1.5"/>`;
const posts = `<rect width="200" height="100" fill="#8FB7D9"/><rect y="78" width="200" height="22" fill="#2A6B3F"/><path d="M100 100V58M70 58h60M70 58V8M130 58V8" stroke="#F2C230" stroke-width="5" fill="none"/>`;
const arrow = (x1,y1,x2,y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#F4F6F1" stroke-width="2.5" stroke-dasharray="6 5" fill="none"/>`;
const SCORES = [
  {pts:6, name:"Touchdown", text:"Carry the ball into the end zone, or catch a pass there.", art: mini(ezRight + arrow(40,55,160,45) + ball(168,44))},
  {pts:1, name:"Extra point", text:"After a touchdown, kick it through the uprights from short range.", art:`<svg viewBox="0 0 200 100" aria-hidden="true">${posts}${arrow(100,96,100,30)}${ball(100,26)}</svg>`},
  {pts:2, name:"Two-point try", text:"After a touchdown, run or pass into the end zone again from the 2-yard line instead of kicking.", art: mini(ezRight + `<line x1="130" y1="0" x2="130" y2="100" stroke="#F4F6F1" stroke-width="1.5" opacity=".5"/>` + arrow(126,50,165,50) + ball(170,50))},
  {pts:3, name:"Field goal", text:"Kick it through the uprights on any down, usually 4th down when a touchdown looks unlikely.", art:`<svg viewBox="0 0 200 100" aria-hidden="true">${posts}${arrow(20,96,100,22)}${ball(104,20)}</svg>`},
  {pts:2, name:"Safety", text:"The defense tackles the ball carrier in his own end zone. The defense scores, then also gets the ball back.", art: mini(`<rect x="0" y="0" width="50" height="100" fill="#245E37"/><line x1="50" y1="0" x2="50" y2="100" stroke="#F4F6F1" stroke-width="3"/>` + ball(28,50) + `<circle cx="28" cy="50" r="18" fill="none" stroke="#F2C230" stroke-width="3"/>` + arrow(90,50,50,50))}
];

const CLOCK = [
  {k:"q1", cls:"q", t:"Q1", s:"15 min", info:["1st quarter","Each quarter is 15 minutes of game clock. A coin toss decides who receives the opening kickoff. After the 1st and 3rd quarters, teams switch directions."]},
  {k:"q2", cls:"q", t:"Q2", s:"15 min", mark:true, info:["2nd quarter","Ends the first half. With two minutes left, play pauses for the two-minute warning, and teams start racing the clock."]},
  {k:"half", cls:"half", t:"Half", s:"Break", info:["Halftime","A break between the 2nd and 3rd quarters. The team that didn't get the ball to start the game usually receives the kickoff to open the second half."]},
  {k:"q3", cls:"q", t:"Q3", s:"15 min", info:["3rd quarter","Same as the 1st quarter. Each team still has three timeouts to use in this half."]},
  {k:"q4", cls:"q", t:"Q4", s:"15 min", mark:true, info:["4th quarter","The two-minute warning comes again. Expect lots of timeouts, passes to the sideline, and players running out of bounds to stop the clock."]},
  {k:"ot", cls:"ot", t:"OT", s:"If tied", info:["Overtime","Played only if the score is tied. In the NFL, each team usually gets at least one chance with the ball. The exact format differs between the regular season, the playoffs, and college."]}
];

const PENS = [
  {name:"Holding", what:"Grabbing or hooking an opponent to stop him, instead of blocking with hands inside the chest.", cost:"Offense: back 10 yards. Defense: 5 yards and an automatic first down.", arms:'<path d="M56 38l14 14H44"/><path d="M44 38l-8 16 10 0"/><circle cx="46" cy="53" r="4"/>'},
  {name:"False start", what:"An offensive player flinches or moves early after getting set, before the snap.", cost:"Offense: back 5 yards. The play never starts.", arms:'<path d="M44 38l-8 12h26"/><path d="M56 38l8 18H38"/><path d="M74 44a10 10 0 1 1-4-8" stroke-width="2.5"/>'},
  {name:"Offside", what:"A defender is across the line of scrimmage when the ball is snapped.", cost:"Defense: 5 yards toward its own goal.", arms:'<path d="M44 38l-14 16 14 14"/><path d="M56 38l14 16-14 14"/>'},
  {name:"Pass interference", what:"Illegal contact with a player while a pass is in the air, keeping him from making the catch.", cost:"Defense: ball moves to the spot of the foul, plus a first down. Offense: back 10 yards.", arms:'<path d="M44 38H20M20 28v20"/><path d="M56 38h24M80 28v20"/>'},
  {name:"Delay of game", what:"The offense doesn't snap the ball before the 40-second play clock runs out.", cost:"Offense: back 5 yards.", arms:'<path d="M44 38l-6 16h22"/><path d="M56 38l6 20H40"/>'},
  {name:"Personal foul", what:"A dangerous or needless hit, like a late hit after the whistle or a hit to the head of a defenseless player.", cost:"15 yards. If by the defense, also an automatic first down.", arms:'<path d="M44 38L30 20l28-14"/><path d="M56 38l14-18L42 6"/>'}
];

const TRICKY = [
  ["Why do teams kick on 4th down?","If the offense fails on 4th down, the other team gets the ball right there. Punting sends the ball far away first, so the opponent starts in a worse spot. Teams only go for it when they need a yard or two, or when they're running out of time."],
  ["What counts as a catch?","The receiver needs control of the ball, both feet (or a knee, hip, or other body part) down in bounds, and to hold on long enough to make a normal football move. In college, one foot in bounds is enough."],
  ["Why does the clock keep stopping?","The clock stops for incomplete passes, scores, timeouts, and penalties. A run out of bounds stops it too, and late in each half it stays stopped until the next snap. Each team also gets three timeouts per half."],
  ["What's a touchback?","When a kick goes into the end zone and the receiving team doesn't run it out, play stops and the ball is placed at a set yard line. It trades the chance of a big return for a safe starting spot."],
  ["Can the defense score?","Yes. If a defender intercepts a pass or picks up a fumble and runs it into the other end zone, that's a touchdown for the defense. A safety is the other way the defense scores."],
  ["What's the difference between a fumble and an incomplete pass?","A fumble is a live ball dropped after someone had control, and anyone can grab it. An incomplete pass hits the ground before it's caught, so the play is simply dead and nobody can recover it."]
];
const WORDS = [
  ["Snap","The center hands or tosses the ball back between his legs to start each play."],
  ["Down","One play, or one try. The offense gets four to gain 10 yards."],
  ["Drive","One team's whole series of plays, from getting the ball until it scores or gives it up."],
  ["Red zone","The last 20 yards before the opponent's end zone, where scoring chances are best."],
  ["Sack","The quarterback is tackled behind the line of scrimmage before he can throw."],
  ["Interception","A defender catches a pass meant for the offense. The defense takes over."],
  ["Fumble","A player loses control of the ball while it's live. Either team can recover it."],
  ["Turnover","Any time the offense loses the ball to the defense, by interception, fumble, or failing on 4th down."],
  ["Punt","A kick on 4th down that gives the ball away but pushes the other team far back."],
  ["Blitz","The defense sends extra players rushing at the quarterback."]
];
const QUIZ = [
  {q:"How many downs does the offense get to gain 10 yards?", o:["3","4","5","6"], a:1, why:"Four downs. Gain 10 yards within them and the count starts over with a new 1st down."},
  {q:"How many points is a touchdown worth by itself?", o:["3","6","7","8"], a:1, why:"A touchdown is 6. The 7 you often see comes from adding the 1-point kick right after."},
  {q:"The referee makes this signal. What's the call?", visual:() => fig(PENS[0].arms), o:["Offside","Delay of game","Holding","False start"], a:2, why:"Gripping one wrist in front of the body means holding: a player grabbed an opponent instead of blocking cleanly."},
  {q:"An offensive lineman flinches before the snap. What happens?", o:["Nothing, it's allowed","False start: back 5 yards","Offside: back 10 yards","The play is replayed"], a:1, why:"Moving early after getting set is a false start. The play never starts and the offense loses 5 yards."},
  {q:"What does the yellow line on a TV broadcast show?", o:["The line of scrimmage","Where the play must start","The first-down line","The edge of the end zone"], a:2, why:"Yellow marks how far the offense must reach for a first down. The blue line is where the ball starts."},
  {q:"Here's the situation. What do most teams do?", visual:() => `<div class="qboard"><div><small>Down and distance</small><b class="y">4th &amp; 12</b></div><div><small>Ball on</small><b>Own 30</b></div></div>`, o:["Run the ball","Throw deep","Punt","Kick a field goal"], a:2, why:"Twelve yards is a lot to gain on one try, and failing would hand the ball over deep in your own half. Punting pushes the other team far back first."},
  {q:"The defense tackles the ball carrier inside his own end zone. What is it?", o:["A touchback","A safety","A sack","A turnover on downs"], a:1, why:"That's a safety. The defense scores 2 points and also gets the ball back."},
  {q:"How many points is a field goal?", o:["1","2","3","4"], a:2, why:"A kick through the uprights during regular play counts 3. The 1-point kick only happens right after a touchdown."},
  {q:"After a touchdown, a team runs the ball in from the 2-yard line instead of kicking. If it works, they get...", o:["1 point","2 points","3 points","6 more points"], a:1, why:"That's a two-point try. It's riskier than the kick, so it's worth twice as much."},
  {q:"A pass hits the ground before anyone catches it. What happens next?", o:["Either team can grab it","It's a fumble","The other team gets the ball","The ball goes back to the same spot and a down is used"], a:3, why:"An incomplete pass ends the play. The ball returns to where the play started, the clock stops, and the offense moves to its next down."}
];

function render(app){
  app.innerHTML = sportHero({id:"american-football", name:"American football", alt:"The tabby cat in a red football uniform, about to throw",
      lede:"Two teams take turns trying to move the ball into the other team's end zone. The offense gets four tries, called downs, to gain 10 yards. Make it, and the four tries reset. Miss, and the ball goes to the other team.",
      facts:[["11","players per side on the field"],["4","downs to gain 10 yards"],["60","minutes of game clock"],["100","yards goal line to goal line"]]})
    + jumpNav([["f-field","The field"],["f-drive","How a drive works"],["f-score","Scoring"],["f-clock","The clock"],["f-pen","Penalties"],["f-tricky","Tricky rules"],["f-words","Words you'll hear"],["f-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("f-field","The field","Tap any part of the field to see what it does.",
        `<div class="fieldbox" id="fieldMain">${fieldSVG("fm", true)}</div><div class="fieldrow"><div class="zonechips" id="zoneChips"></div><div class="infopanel" id="zoneInfo" aria-live="polite"></div></div>`)
    + section("f-drive","How a drive works","You're on offense, starting at your own 25-yard line and heading right. Call plays and watch the blue line (where the ball is) chase the yellow line (where you need to get).",
        `<div class="sim"><div class="board"><div class="dd"><small>Down and distance</small><b id="sDD">1st &amp; 10</b></div><div><small>Ball on</small><b id="sSpot">Own 25</b></div><div><small>Your points</small><b id="sPts">0</b></div></div>
        <div class="fieldbox">${fieldSVG("fs", false)}</div>
        <div class="controls"><button class="btn" data-play="run" type="button">Run the ball</button><button class="btn" data-play="pass" type="button">Throw a pass</button><button class="btn" data-play="punt" type="button">Punt</button><button class="btn" data-play="fg" type="button">Try a field goal</button><button class="btn primary" id="newDrive" type="button" hidden>Start a new drive</button></div>
        <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="sMsg">First down and 10. Pick a play.</p><p class="hint" id="sHint">Gain 10 yards within four plays to earn a fresh set of downs.</p></div></div>
        <ul class="log" id="sLog"></ul></div>`)
    + section("f-score","Scoring","Five ways to put points on the board.",
        `<div class="scoring">${SCORES.map(s => `<div class="score">${s.art}<div class="pts">${s.pts}<small>${s.pts===1?"point":"points"}</small></div><h3>${s.name}</h3><p>${s.text}</p></div>`).join("")}</div>
        <p class="combo">That's why the same scores show up again and again. A touchdown plus the extra point is 7, a field goal is 3, so totals like 10, 14, 17, 21 and 24 are everywhere.</p>`)
    + section("f-clock","The clock","Tap a part of the game to learn what happens there.",
        `<div class="timeline" id="timeline"></div><div class="legend"><i></i> Two-minute warning</div><div class="infopanel" id="clockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("f-pen","Penalties","",
        `<div class="flagnote"><svg viewBox="0 0 34 40" aria-hidden="true"><path d="M5 3v35" stroke="currentColor" stroke-width="2.5"/><path d="M6 4h24l-5 8 5 8H6z" fill="var(--yellow)" stroke="currentColor" stroke-width="1.5"/></svg><p class="lede" style="margin:0">See a yellow flag thrown? An official spotted a foul. The referee then explains it with a hand signal like these.</p></div>
        <div class="pens">${PENS.map(p => `<div class="pen">${fig(p.arms)}<div><h3>${p.name}</h3><p>${p.what}</p><div class="cost">${p.cost}</div></div></div>`).join("")}</div>`)
    + section("f-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="flips"></div>`)
    + section("f-words","Words you'll hear","",`<dl class="gloss" id="gloss"></dl>`)
    + section("f-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="quiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the NFL. College and high school football differ in some details, which are noted where they matter most.</footer></div>`;

  place("fm","los",25); place("fm","fd",35); place("fm","ball",25);
  setupZones(document.getElementById("fieldMain"), document.getElementById("zoneChips"), document.getElementById("zoneInfo"), ZONES, ZONE_ORDER, "endzone");
  setupTimeline(document.getElementById("timeline"), document.getElementById("clockInfo"), CLOCK,
    "The game clock reads 60 minutes, but a game takes about three hours, because the clock stops so often. Between plays, the offense has 40 seconds to snap the ball.");
  flipCards(document.getElementById("flips"), TRICKY);
  glossary(document.getElementById("gloss"), WORDS);
  makeQuiz(document.getElementById("quiz"), QUIZ, [
    "You could call this one from the sideline. Watch a game and see how much you catch.",
    "You know the basics. Flip back through the cards you missed and you'll have it.",
    "Try the drive simulator once more, then take the quiz again. The down system clicks fast.",
    "No worries. Start with the field diagram and the scoring cards, then come back for another try."]);
  driveSim(app);
}

function driveSim(app){
  const S = {pos:25, down:1, target:35, pts:0, over:false};
  const $ = id => document.getElementById(id);
  const spot = p => { p = Math.round(p); return p===50 ? "Midfield" : p<50 ? `Own ${p}` : `Opp. ${100-p}`; };
  const ord = ["1st","2nd","3rd","4th"];
  const dd = () => `${ord[S.down-1]} & ${S.target>=100 ? "Goal" : Math.max(1, S.target-S.pos)}`;
  function draw(){
    place("fs","los",S.pos); place("fs","ball",S.pos); place("fs","fd",Math.min(S.target,100), S.target<100);
    $("sDD").textContent = S.over ? "Drive over" : dd(); $("sSpot").textContent = spot(S.pos); $("sPts").textContent = S.pts;
    app.querySelectorAll("[data-play]").forEach(b => b.disabled = S.over); $("newDrive").hidden = !S.over;
  }
  function hint(){
    if(S.over) return "Start a new drive to try again from your own 25.";
    if(S.down===4) return "4th down. Most teams punt here, or try a field goal if they're close enough, unless they need only a yard or two.";
    if(S.target>=100) return "Goal to go: there's no first-down line left. Reach the end zone in the downs you have.";
    if(S.down===3) return "3rd down. Teams usually throw here when they need a lot of yards.";
    return "Gain the yards to the yellow line before you run out of downs.";
  }
  function log(t){ const li = document.createElement("li"); li.textContent = t; const ul = $("sLog"); ul.prepend(li); while(ul.children.length>6) ul.lastChild.remove(); }
  function play(kind){
    if(S.over) return;
    const before = `${dd()} on ${spot(S.pos)}`; let gain = 0, msg = "";
    if(kind==="punt"){ S.over = true; msg = "You punt. The ball is kicked deep to the other team so they start far from your end zone. Your drive ends here."; }
    else if(kind==="fg"){
      const dist = (100-S.pos)+17, p = dist<=33?.95 : dist<=45?.8 : dist<=55?.55 : dist<=63?.2 : .03; S.over = true;
      if(Math.random()<p){ S.pts += 3; msg = `The ${dist}-yard field goal is good. 3 points.`; }
      else msg = `The ${dist}-yard field goal misses. The other team takes over.` + (dist>55 ? " Kicks that long are a big gamble." : "");
    } else {
      if(kind==="run"){ gain = pickOne([-2,-1,0,1,2,3,3,4,4,5,5,6,7,9,12,18]); msg = gain<0 ? `Run stopped behind the line for a loss of ${-gain}.` : gain===0 ? "Run for no gain." : `Run for ${gain} yard${gain===1?"":"s"}.`; }
      else { const r = Math.random();
        if(r<.36){ msg = "Incomplete pass. The ball goes back to where the play started, and the down is used up."; }
        else if(r<.41){ S.over = true; msg = "Intercepted! A defender caught your pass, so the other team gets the ball. That's a turnover."; }
        else if(r<.48){ gain = -rnd(4,8); msg = `Sacked. The quarterback was tackled before throwing, a loss of ${-gain}.`; }
        else { gain = rnd(6,24); msg = `Pass complete for ${gain} yards.`; } }
      if(!S.over){
        S.pos += gain;
        if(S.pos>=100){ S.pos = 100; S.pts += 7; S.over = true; msg += " Touchdown! 6 points, plus 1 for the extra-point kick."; }
        else if(S.pos<=0){ S.pos = 0; S.over = true; msg += " You were tackled in your own end zone. That's a safety: 2 points for the defense."; }
        else if(S.pos>=S.target){ S.down = 1; S.target = Math.min(S.pos+10,100); msg += " First down! You get four new tries."; }
        else { S.down++; if(S.down>4){ S.over = true; S.down = 4; msg += " That was 4th down, and you came up short. Turnover on downs: the other team takes over right here."; } }
      }
    }
    log(`${before}: ${msg.split(". ")[0].replace(/\.$/,"")}`);
    $("sMsg").textContent = msg; $("sHint").textContent = hint(); draw();
  }
  app.querySelectorAll("[data-play]").forEach(b => b.addEventListener("click", () => play(b.dataset.play)));
  $("newDrive").addEventListener("click", () => { Object.assign(S,{pos:25,down:1,target:35,over:false}); $("sMsg").textContent = "New drive. 1st and 10 from your own 25."; $("sHint").textContent = hint(); draw(); });
  draw();
}

SPORT_PAGES["american-football"] = {render};
})();

/* Field hockey. Rules follow the FIH. */
(function(){
const W="#F4F6F1", T="#2F6FD6";
const svg = `<svg viewBox="-30 -30 974 610" role="img" aria-label="Field hockey pitch from above"><rect x="-30" y="-30" width="974" height="610" fill="#1C4D2C"/><rect width="914" height="550" fill="${T}"/>
  <g fill="none" stroke="${W}" stroke-width="3"><rect width="914" height="550"/><line x1="457" y1="0" x2="457" y2="550"/><line x1="229" y1="0" x2="229" y2="550"/><line x1="685" y1="0" x2="685" y2="550"/>
  <path d="M0 129A146 146 0 0 1 146 275A146 146 0 0 1 0 421"/><path d="M914 129A146 146 0 0 0 768 275A146 146 0 0 0 914 421"/>
  <path d="M0 79A196 196 0 0 1 196 275A196 196 0 0 1 0 471" stroke-dasharray="12 12"/><path d="M914 79A196 196 0 0 0 718 275A196 196 0 0 0 914 471" stroke-dasharray="12 12"/></g>
  <circle cx="64" cy="275" r="4" fill="#fff"/><circle cx="850" cy="275" r="4" fill="#fff"/><rect x="-14" y="257" width="14" height="37" fill="#fff"/><rect x="914" y="257" width="14" height="37" fill="#fff"/>
  <line x1="100" y1="550" x2="100" y2="540" stroke="#fff" stroke-width="3"/>
  <path class="hz" data-zone="circle" d="M0 129A146 146 0 0 1 146 275A146 146 0 0 1 0 421Z"/><path class="hz" data-zone="circle" d="M914 129A146 146 0 0 0 768 275A146 146 0 0 0 914 421Z"/>
  <path class="hz hzs" data-zone="dashed" d="M0 79A196 196 0 0 1 196 275A196 196 0 0 1 0 471" style="stroke-width:14"/><path class="hz hzs" data-zone="dashed" d="M914 79A196 196 0 0 0 718 275A196 196 0 0 0 914 471" style="stroke-width:14"/>
  <rect class="hz" data-zone="spot" x="52" y="263" width="24" height="24"/><rect class="hz" data-zone="spot" x="838" y="263" width="24" height="24"/>
  <rect class="hz" data-zone="goal" x="-18" y="252" width="20" height="46"/><rect class="hz" data-zone="goal" x="912" y="252" width="20" height="46"/>
  <rect class="hz" data-zone="quarter" x="221" y="0" width="16" height="550"/><rect class="hz" data-zone="quarter" x="677" y="0" width="16" height="550"/><rect class="hz" data-zone="center" x="449" y="0" width="16" height="550"/>
  <rect class="hz" data-zone="back" x="-30" y="0" width="30" height="250"/><rect class="hz" data-zone="back" x="914" y="0" width="30" height="250"/></svg>`;
const ZONES = {
  circle:{title:"Shooting circle", text:"A goal only counts if the attacker touches the ball inside this 16-yard (14.63 m) circle. Shots from outside don't count, even if they go in."},
  dashed:{title:"Dashed line", text:"A dashed line 5 m outside the circle. Free hits close to the circle are moved out to it, and the ball must travel 5 m before entering the circle."},
  spot:{title:"Penalty spot", text:"Penalty strokes are taken from here, 6.4 m from goal, one-on-one against the goalkeeper."},
  goal:{title:"Goal", text:"3.66 m wide and 2.14 m high."},
  quarter:{title:"23-meter lines", text:"Divide each half. Long corners and some restarts are taken in relation to them."},
  center:{title:"Center line", text:"Each quarter, and play after every goal, starts with a pass back from the center."},
  back:{title:"Backline", text:"The end line. Penalty corners are taken from a spot on it, 10 m from the goalpost."}
};
const judge = scenarioJudge("fhJ", [
  {t:"An attacker scores with a hard shot from just outside the circle.", o:["Goal","No goal"], a:1, w:"Goals only count when the attacker touches the ball inside the shooting circle."},
  {t:"A defender stops the ball with their foot inside the circle.", o:["Play on","Penalty corner"], a:1, w:"Only the goalkeeper may use their feet. A deliberate foul by a defender in the circle gives a penalty corner."},
  {t:"A player hits the ball with the rounded back of the stick.", o:["Legal","Foul"], a:1, w:"Only the flat face of the stick (and its edges) may be used."},
  {t:"An attacker is standing behind the last defender when the ball is passed.", o:["Offside","Play on"], a:1, w:"Field hockey has no offside rule."},
  {t:"A defender's foul stops a certain goal.", o:["Penalty corner","Penalty stroke"], a:1, w:"A foul that prevents a probable goal gives a penalty stroke from the spot."}
]);
SPORT_PAGES["field-hockey"] = {render: app => sportPage(app, {id:"field-hockey", p:"fh", name:"Field hockey", alt:"The tabby cat dribbling a small ball with a hockey stick",
  lede:"Two teams of eleven use hooked sticks to pass and shoot a hard ball into the opponent's goal. Only the flat side of the stick may touch the ball, nobody but the goalkeeper may use their feet, and goals only count from inside the shooting circle.",
  facts:[["11","players per side"],["60","minutes in four quarters"],["16","yards: the shooting circle"],["0","offside rule"]],
  diagram:{title:"The pitch", svg, zones:ZONES, order:["circle","dashed","spot","goal","quarter","center","back"], first:"circle"},
  blocks:[{id:"judge", title:"Make the call", html:judge.html, init:judge.init},
    {id:"set", title:"Set pieces and cards", html: cards([{big:"PC", name:"Penalty corner", text:"For defensive fouls in the circle. An attacker pushes the ball from the backline, teammates stop it at the top of the circle and shoot, while five defenders rush out from behind the goal line."},{big:"PS", name:"Penalty stroke", text:"One shot from 6.4 m against the keeper, for a foul that stopped a likely goal."},{big:"Free hit", name:"Free hit", text:"For most fouls. The player can pass or dribble it themselves straight away (a self-pass)."},{big:"Green", name:"Green card", text:"Two minutes off the field."},{big:"Yellow", name:"Yellow card", text:"Five or ten minutes off the field, depending on the offense."},{big:"Red", name:"Red card", text:"Off for the rest of the match."}])}],
  clock:{segs:[{k:"q", cls:"q", t:"Q1-Q2", s:"15 min each", info:["First half","Four 15-minute quarters in all, with short breaks."]},{k:"h", cls:"half", t:"Half", s:"10 min", info:["Half-time","Teams switch ends."]},{k:"q2", cls:"q", t:"Q3-Q4", s:"15 min each", info:["Second half","The clock stops after goals and for penalty corners."]},{k:"so", cls:"ot", t:"Shootout", s:"If needed", info:["Shootout","In matches that need a winner, players get 8 seconds to score one-on-one, starting from the 23 m line."]}]},
  tricky:[["Why only the flat side?","It's tradition and safety. Sticks are flat on one side and rounded on the other, so players turn the stick over to play backhand."],["Can the ball be lifted?","Yes, with care. Lifting it dangerously into other players is a foul, but aerial passes are allowed."],["Why is the turf watered?","Wet artificial turf lets the ball roll fast and true."],["What does the goalkeeper wear?","Full protective padding, a helmet, and kickers. Only the keeper may kick the ball, inside their own circle."]],
  words:[["Penalty corner","The big set piece after a defensive foul in the circle."],["Drag flick","A powerful flicking shot used on penalty corners."],["Self-pass","Taking your own free hit by dribbling it."],["Reverse stick","Turning the stick over to play on the left side."],["Circle","The shooting circle."],["Aerial","A high lifted pass."]],
  quiz:[{q:"Where must a goal be scored from?",o:["Anywhere","Inside the shooting circle","The 23 m line","The penalty spot only"],a:1,why:"Inside the circle."},{q:"Which side of the stick may be used?",o:["Either side","Only the flat face (and edges)","Only the rounded side","The handle"],a:1,why:"The flat side."},{q:"Who may use their feet?",o:["Everyone","Only the goalkeeper","Defenders","Nobody"],a:1,why:"Only the goalkeeper, in their circle."},{q:"Is there offside in field hockey?",o:["Yes","No"],a:1,why:"No offside."},{q:"How many players per team on the field?",o:["7","10","11","15"],a:2,why:"Eleven."},{q:"A defender fouls on purpose inside the circle. What's given?",o:["Free hit","Penalty corner","Throw-in","Nothing"],a:1,why:"A penalty corner."},{q:"How long is a green card suspension?",o:["30 seconds","2 minutes","10 minutes","The rest of the game"],a:1,why:"Two minutes."},{q:"How long is a match?",o:["2 x 45 min","4 x 15 min","3 x 20 min","4 x 12 min"],a:1,why:"Four quarters of 15 minutes."},{q:"Where is a penalty stroke taken from?",o:["The center","The 23 m line","A spot 6.4 m from goal","The backline"],a:2,why:"6.4 m from the goal."},{q:"What's a self-pass?",o:["Passing to yourself off the boards","Taking your own free hit and dribbling it","A pass to the goalkeeper","A foul"],a:1,why:"Dribbling straight from a free hit."}],
  footer:"Rules on this page follow the FIH, used at the Olympics. Indoor hockey is a separate version with its own rules."})};
})();

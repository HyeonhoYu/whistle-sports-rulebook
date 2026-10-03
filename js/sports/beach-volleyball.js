/* Beach volleyball. Rules follow the FIVB. */
(function(){
const SAND="#E6CF94", W="#fff";
const svg = `<svg viewBox="-80 -60 960 520" role="img" aria-label="Beach volleyball court from above"><rect x="-80" y="-60" width="960" height="520" fill="#D9BE7E"/><rect width="800" height="400" fill="${SAND}"/>
  <rect width="800" height="400" fill="none" stroke="#2F6FD6" stroke-width="8"/><line x1="400" y1="-40" x2="400" y2="440" stroke="#18221D" stroke-width="8"/><circle cx="400" cy="-44" r="7" fill="#18221D"/><circle cx="400" cy="444" r="7" fill="#18221D"/>
  ${[0,400].map(y => `<rect x="395" y="${y - 14}" width="10" height="28" fill="#D9342B"/>`).join("")}
  <rect class="hz" data-zone="court" x="8" y="8" width="384" height="384"/><rect class="hz" data-zone="court" x="408" y="8" width="384" height="384"/>
  <rect class="hz hzs" data-zone="lines" x="0" y="0" width="800" height="400" style="stroke-width:16"/><rect class="hz" data-zone="net" x="390" y="-40" width="20" height="480"/>
  <rect class="hz" data-zone="serve" x="-78" y="0" width="70" height="400"/><rect class="hz" data-zone="serve" x="808" y="0" width="70" height="400"/>
  <rect class="hz" data-zone="free" x="-78" y="-58" width="956" height="50"/></svg>`;
const ZONES = {
  court:{title:"Court", text:"16 m by 8 m, smaller than indoor volleyball, with only two players a side covering it."},
  lines:{title:"Boundary lines", text:"Bands staked into the sand. A ball touching a line is in."},
  net:{title:"Net", text:"The same heights as indoor: 2.43 m for men, 2.24 m for women. There's no center line, so players may cross under the net as long as they don't interfere."},
  serve:{title:"Service zone", text:"Anywhere behind the end line. Players serve in a fixed order that alternates between teammates."},
  free:{title:"Free zone", text:"The sand around the court. Players chase balls far out here."}
};
const judge = scenarioJudge("bvJ", [
  {t:"A player softly pushes the ball over the block with open fingers.", o:["Legal tip","Fault"], a:1, w:"Open-hand tips are illegal on the beach. Players must use knuckles (a 'cobra'), the heel of the hand, or a poke."},
  {t:"A player blocks the ball, then her partner makes two more touches before sending it over.", o:["Legal","Fault: four touches"], a:1, w:"Unlike indoor, the block counts as one of the three touches on the beach."},
  {t:"The score is 4-3 in the first set and the teams change sides.", o:["Correct","Too early"], a:1, w:"Teams switch sides every 7 points in sets 1 and 2 (at 7, 14, 21 total points), and every 5 in set 3."},
  {t:"A player gets injured. Can a substitute come in?", o:["Yes","No"], a:1, w:"There are no substitutes in beach volleyball. A team that can't continue forfeits."},
  {t:"The ball lands on the boundary band.", o:["Out","In"], a:1, w:"Lines are in."}
]);
SPORT_PAGES["beach-volleyball"] = {render: app => sportPage(app, {id:"beach-volleyball", p:"bv", name:"Beach volleyball", alt:"The tabby cat diving across the sand for a dig",
  lede:"Two players a side play volleyball on sand. It's the same idea as indoor, three touches to get it over, but with only two players, no substitutes, stricter rules on handling the ball, and shorter sets to 21.",
  facts:[["2","players per side"],["21","points a set (15 in set 3)"],["3","touches, including the block"],["0","substitutes"]],
  diagram:{title:"The court", svg, zones:ZONES, order:["court","lines","net","serve","free"], first:"net"},
  blocks:[{id:"judge", title:"Make the call", lede:"Several beach rules differ from indoor volleyball. Can you spot them?", html:judge.html, init:judge.init},
    {id:"diff", title:"Beach versus indoor", html: cards([{big:"2 vs 6", name:"Players", text:"Two players a side, no libero, no subs."},{big:"21", name:"Shorter sets", text:"Best of three sets to 21, win by 2. The third set is to 15."},{big:"Block = 1", name:"Block counts", text:"The block uses one of the team's three touches."},{big:"No tips", name:"No open-hand tips", text:"Soft shots must be knuckled or poked."},{big:"Signals", name:"Hand signals", text:"Players signal behind their backs which shot they'll block: line or angle."}])}],
  clock:{segs:[{k:"s1", cls:"q", t:"Set 1", s:"to 21", info:["Set 1","First to 21, win by 2. Teams switch sides every 7 points so neither gets stuck facing sun or wind."]},{k:"s2", cls:"q", t:"Set 2", s:"to 21", info:["Set 2","Win both and the match is over."]},{k:"s3", cls:"ot", t:"Set 3", s:"to 15", info:["Deciding set","To 15, switching sides every 5 points."]}]},
  tricky:[["Why do players hold up fingers behind their backs?","They're telling their partner the blocking plan: one finger for blocking the line, two for the angle."],["Why do they switch sides so often?","Sun and wind make one side harder. Frequent switches keep it fair."],["Can you set the ball over the net?","Only straight in front or behind you, square to the direction you face. Beach setting is judged strictly for double contact."],["Is there a time limit?","No game clock, but serves must happen quickly after the whistle, and each team gets one timeout per set."]],
  words:[["Cobra","A knuckled poke shot over the block."],["Shot","A soft placed attack instead of a hard hit."],["Line","Blocking or hitting along the sideline."],["Angle","A cross-court attack."],["Side-out","Winning the serve back."],["Dig","Saving a hard attack off the sand."]],
  quiz:[{q:"How many players per side?",o:["2","4","6","9"],a:0,why:"Two."},{q:"How many points win a regular set?",o:["15","21","25","30"],a:1,why:"21, win by 2."},{q:"Does the block count as a touch?",o:["Yes","No"],a:0,why:"On the beach it does."},{q:"Can you tip with open fingers?",o:["Yes","No"],a:1,why:"Open-hand tips are faults."},{q:"How often do teams switch sides in set 1?",o:["Every point","Every 5","Every 7","Never"],a:2,why:"Every 7 points."},{q:"How many substitutes can a team use?",o:["0","1","2","6"],a:0,why:"None."},{q:"What's the third set played to?",o:["11","15","21","25"],a:1,why:"15."},{q:"How big is the court?",o:["18 x 9 m","16 x 8 m","12 x 6 m","20 x 10 m"],a:1,why:"16 x 8 m."},{q:"A ball touches the boundary band. In or out?",o:["In","Out"],a:0,why:"Lines are in."},{q:"What does one finger behind the back mean?",o:["Serve short","Block the line","Timeout","Switch sides"],a:1,why:"One finger: block the line."}],
  footer:"Rules on this page follow the FIVB for beach volleyball, used at the Olympics."})};
})();

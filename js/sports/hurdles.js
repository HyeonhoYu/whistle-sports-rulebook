/* Hurdles. Rules follow World Athletics. */
(function(){
/* 110 m hurdles lane: 7 units per meter. First hurdle 13.72 m, then every 9.14 m, last 14.02 m to finish. */
const K = 7, H = Array.from({length:10}, (_,i) => 13.72 + i*9.14);
const svg = `<svg viewBox="-20 0 820 170" role="img" aria-label="110 m hurdles lane"><rect x="-20" width="820" height="170" fill="#2B3831"/><rect x="0" y="40" width="${110*K}" height="90" fill="#C4553F"/>
  <line x1="0" y1="40" x2="${110*K}" y2="40" stroke="#fff" stroke-width="2"/><line x1="0" y1="130" x2="${110*K}" y2="130" stroke="#fff" stroke-width="2"/><line x1="0" y1="40" x2="0" y2="130" stroke="#F2C230" stroke-width="4"/><line x1="${110*K}" y1="40" x2="${110*K}" y2="130" stroke="#fff" stroke-width="5"/>
  ${H.map(m => `<rect x="${m*K - 3}" y="50" width="6" height="70" fill="#fff" stroke="#18221D" stroke-width="1.5"/>`).join("")}
  <text x="0" y="30" font-family="Barlow,sans-serif" font-size="13" fill="#EEF3EC">Start</text><text x="${110*K}" y="30" text-anchor="end" font-family="Barlow,sans-serif" font-size="13" fill="#EEF3EC">Finish (110 m)</text>
  <text x="${H[0]*K}" y="150" text-anchor="middle" font-family="Barlow,sans-serif" font-size="12" fill="#EEF3EC">13.72 m</text><text x="${(H[0]+H[1])/2*K}" y="150" text-anchor="middle" font-family="Barlow,sans-serif" font-size="12" fill="#EEF3EC">9.14 m apart</text><text x="${(H[9]+110)/2*K}" y="150" text-anchor="middle" font-family="Barlow,sans-serif" font-size="12" fill="#EEF3EC">14.02 m</text>
  <rect class="hz" data-zone="start" x="-6" y="40" width="20" height="90"/><rect class="hz" data-zone="first" x="${H[0]*K - 12}" y="40" width="24" height="90"/>
  ${H.slice(1,9).map(m => `<rect class="hz" data-zone="hurdle" x="${m*K - 12}" y="40" width="24" height="90"/>`).join("")}<rect class="hz" data-zone="last" x="${H[9]*K - 12}" y="40" width="24" height="90"/>
  <rect class="hz" data-zone="run" x="${H[9]*K + 14}" y="40" width="${(110 - H[9])*K - 20}" height="90"/><rect class="hz" data-zone="finish" x="${110*K - 8}" y="40" width="16" height="90"/><rect class="hz" data-zone="lane" x="20" y="126" width="${110*K - 40}" height="10"/></svg>`;
const ZONES = {
  start:{title:"Start", text:"Hurdlers start in blocks, under the same one-false-start rule as sprinters."},
  first:{title:"First hurdle", text:"13.72 m from the start in the men's 110 m. Most top hurdlers take eight strides to reach it."},
  hurdle:{title:"Hurdles", text:"Ten hurdles, 9.14 m apart in the men's 110 m, 1.067 m (42 in) high. The best hurdlers take exactly three strides between each one."},
  last:{title:"Last hurdle", text:"After the tenth hurdle, it's a flat sprint to the line."},
  run:{title:"Run-in", text:"14.02 m from the last hurdle to the finish. Races are often won or lost here."},
  finish:{title:"Finish", text:"As in sprinting, the torso decides the finish."},
  lane:{title:"Your lane", text:"Hurdlers must stay in their own lane and clear their own hurdles."}
};
const judge = scenarioJudge("hdJ", [
  {t:"A hurdler knocks down three hurdles but finishes first.", o:["Disqualified","Wins the race"], a:1, w:"Knocking hurdles over is allowed, as long as it isn't on purpose. It just slows you down."},
  {t:"A hurdler's trailing leg passes beside the hurdle, below the height of the bar, instead of over it.", o:["Legal","Disqualified"], a:1, w:"Every part of the body must go over the hurdle. A leg trailing around it is a disqualification."},
  {t:"A hurdler knocks down a hurdle in the next lane with their arm.", o:["Legal","Disqualified"], a:1, w:"Interfering with another lane's hurdle, or another runner, is a disqualification."},
  {t:"A hurdler moves before the gun.", o:["Warning","Disqualified"], a:1, w:"One false start and you're out, just like the sprints."}
]);
SPORT_PAGES["hurdles"] = {render: app => sportPage(app, {id:"hurdles", p:"hd", name:"Hurdles", alt:"The tabby cat clearing a hurdle in a running singlet",
  lede:"A sprint race with ten barriers in each lane. Runners must clear every hurdle in their own lane, keeping a perfect rhythm between them. Hitting a hurdle isn't illegal, but it costs time, and trailing a leg around it gets you disqualified.",
  facts:[["10","hurdles in every race"],["110","meters for men; 100 for women"],["3","strides between hurdles"],["400","meters: the long hurdles race"]],
  diagram:{title:"The 110 m hurdles lane", lede:"Drawn to scale. Tap a part of the lane.", svg, zones:ZONES, order:["start","first","hurdle","last","run","finish","lane"], first:"hurdle"},
  blocks:[{id:"judge", title:"Make the call", html:judge.html, init:judge.init},
    {id:"races", title:"The races", html: cards([{big:"110 m", name:"Men's sprint hurdles", text:"Ten hurdles 1.067 m high."},{big:"100 m", name:"Women's sprint hurdles", text:"Ten hurdles 0.838 m high, 8.5 m apart."},{big:"400 m", name:"400 m hurdles", text:"A full lap with ten hurdles, lower than the sprint hurdles, and staggered starts."}])}],
  tricky:[["Is it a foul to knock down hurdles?","No, unless it's done deliberately or with the hand. It just costs speed."],["Why three strides?","The 9.14 m gap fits exactly three running strides for elite men, plus the stride over the hurdle."],["Why are hurdles shaped like an L?","So they tip over forward when hit, which is safer."],["Do hurdlers jump?","They try not to. Good hurdling is sprinting over the barriers with as little height as possible."]],
  words:[["Lead leg","The first leg over the hurdle."],["Trail leg","The second leg, swung sideways over the hurdle."],["Three-step","Taking three strides between hurdles."],["Clearance","Getting over the hurdle."],["Run-in","The flat sprint after the last hurdle."],["Stagger","Different starting points in the 400 m hurdles."]],
  quiz:[{q:"How many hurdles are in the 110 m hurdles?",o:["8","10","12","15"],a:1,why:"Ten."},{q:"Is knocking down a hurdle a foul?",o:["Yes, always","No, unless deliberate"],a:1,why:"Only deliberate knocks are fouls."},{q:"What happens if a trailing leg goes around the hurdle?",o:["Nothing","Disqualification","A time penalty","Restart"],a:1,why:"Disqualified."},{q:"How far is the women's sprint hurdles race?",o:["100 m","110 m","200 m","400 m"],a:0,why:"100 m."},{q:"How many strides do elite hurdlers take between hurdles?",o:["2","3","5","7"],a:1,why:"Three."},{q:"How far is the first hurdle in the men's 110 m?",o:["9.14 m","10 m","13.72 m","20 m"],a:2,why:"13.72 m."},{q:"How many false starts are allowed?",o:["None","One warning","Two","Unlimited"],a:0,why:"One false start is a disqualification."},{q:"How many hurdles are in the 400 m hurdles?",o:["8","10","12","20"],a:1,why:"Ten."},{q:"Can you knock down a hurdle in another lane?",o:["Yes","No: disqualification"],a:1,why:"That's interference."},{q:"What decides the finish?",o:["The foot","The torso","The head","The hand"],a:1,why:"The torso."}],
  footer:"Rules on this page follow World Athletics."})};
})();

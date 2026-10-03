/* Karate (kumite). Rules follow the WKF. */
(function(){
const svg = `<svg viewBox="-60 -60 520 520" role="img" aria-label="Karate competition area" style="max-width:480px"><rect x="-60" y="-60" width="520" height="520" fill="#1C4D2C"/><rect x="-40" y="-40" width="480" height="480" fill="#D9342B"/><rect width="400" height="400" fill="#2F6FD6"/>
  <line x1="160" y1="200" x2="180" y2="200" stroke="#fff" stroke-width="6"/><line x1="220" y1="200" x2="240" y2="200" stroke="#fff" stroke-width="6"/><line x1="200" y1="150" x2="200" y2="166" stroke="#fff" stroke-width="5"/>
  <rect class="hz" data-zone="area" x="6" y="6" width="388" height="388"/><rect class="hz hzs" data-zone="edge" x="0" y="0" width="400" height="400" style="stroke-width:14"/><rect class="hz" data-zone="safety" x="-40" y="-40" width="480" height="34"/>
  <rect class="hz" data-zone="lines" x="150" y="188" width="100" height="24"/><rect class="hz" data-zone="ref" x="190" y="140" width="20" height="30"/></svg>`;
const ZONES = {
  area:{title:"Competition area", text:"An 8 m square of matting. Kumite (sparring) and kata (forms) both use it."},
  edge:{title:"Boundary", text:"Stepping out of the area is a penalty (jogai)."},
  safety:{title:"Safety area", text:"A 1 m border of a different color around the area."},
  lines:{title:"Starting lines", text:"Aka (red) and ao (blue) start each bout on these marks, facing each other."},
  ref:{title:"Referee's line", text:"The referee starts each exchange from here. Four judges sit at the corners with flags."}
};
function scorer(){
  const $ = id => document.getElementById(id); let S;
  const reset = () => { S = {p:[0,0], senshu:-1, over:false}; $("krMsg").textContent = "Award techniques to Aka (red) or Ao (blue). The first unopposed score earns senshu, the tiebreak advantage."; draw(); };
  const N = ["Aka","Ao"];
  function score(w, v, name){
    if(S.over) return; S.p[w] += v; let msg = `${name}: ${N[w]} +${v}.`;
    if(S.senshu < 0){ S.senshu = w; msg += ` ${N[w]} scored first and earns senshu.`; }
    if(S.p[w] - S.p[1-w] >= 8){ S.over = true; msg += ` An 8-point lead ends the bout. ${N[w]} wins.`; }
    $("krMsg").textContent = msg; draw();
  }
  function time(){
    if(S.over) return; S.over = true; const [a,b] = S.p;
    $("krMsg").textContent = a !== b ? `Time. ${N[a > b ? 0 : 1]} wins ${Math.max(a,b)}-${Math.min(a,b)}.` : S.senshu >= 0 ? `Time, tied ${a}-${b}. ${N[S.senshu]} had senshu, the first unopposed score, and wins.` : `Time, 0-0 with no senshu. The referee and judges decide by vote (hantei).`; draw();
  }
  function draw(){ $("krP0").textContent = S.p[0]; $("krP1").textContent = S.p[1]; $("krSen").textContent = S.senshu < 0 ? "None yet" : N[S.senshu]; document.querySelectorAll("[data-kr]").forEach(b => b.disabled = S.over); $("krT").disabled = S.over; $("krNew").hidden = !S.over; }
  document.querySelectorAll("[data-kr]").forEach(b => b.addEventListener("click", () => { const [w,v,n] = b.dataset.kr.split(":"); score(+w, +v, n); }));
  $("krT").addEventListener("click", time); $("krNew").addEventListener("click", reset); reset();
}
const T = [["1","Yuko","A punch to the head, face, neck, or body."],["2","Waza-ari","A kick to the body."],["3","Ippon","A kick to the head, or a scoring technique on an opponent who has been thrown or swept to the mat."]];
SPORT_PAGES["karate"] = {render: app => sportPage(app, {id:"karate", p:"kr", name:"Karate", alt:"The tabby cat in a white karate gi with a black belt, throwing a punch",
  lede:"In kumite, two karateka score points with controlled punches and kicks. Techniques must be fast, well-aimed, and stopped just short of hurting the opponent. Harder techniques like head kicks score more, and an 8-point lead ends the bout early.",
  facts:[["3","minutes per senior bout"],["1-3","points per technique"],["8","point lead wins outright"],["2","colors: aka and ao"]],
  diagram:{title:"The area", svg, zones:ZONES, order:["area","edge","safety","lines","ref"], first:"area", max:480},
  blocks:[{id:"pts", title:"Points", html: cards(T.map(([b,n,t]) => ({big:b, name:n, text:t})), 220)},
    {id:"sim", title:"Score a bout", lede:"Award techniques and see how senshu breaks ties.",
    html:`<div class="sim"><div class="board" style="grid-template-columns:1fr 1fr 1fr"><div><small>Aka (red)</small><b id="krP0">0</b></div><div class="dd"><small>Senshu</small><b id="krSen" style="font-size:1.6rem"></b></div><div><small>Ao (blue)</small><b id="krP1">0</b></div></div>
      ${[0,1].map(w => `<div class="controls"><b class="jlab" style="color:${w ? "#2F6FD6" : "#D9342B"}">${w ? "Ao" : "Aka"}</b>${T.map(([v,n]) => `<button class="btn" type="button" data-kr="${w}:${v}:${n}">${n} +${v}</button>`).join("")}</div>`).join("")}
      <div class="controls"><button class="btn primary" id="krT" type="button">Time runs out</button><button class="btn primary" id="krNew" type="button" hidden>New bout</button></div>
      <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><div><p id="krMsg"></p></div></div></div>`, init:scorer}],
  tricky:[["Why don't they knock each other out?","Control is part of scoring. Too much contact is a foul, and a technique must be stopped at the right distance to score."],["What is senshu?","The advantage for the first unopposed score. If the bout ends tied, senshu wins."],["What's kata?","The other competition: a solo performance of set patterns, scored by judges for technique and athleticism."],["Is karate in the Olympics?","It appeared once, at Tokyo 2020, but isn't on the 2024 or 2028 programs."]],
  words:[["Kumite","Sparring."],["Kata","A solo form of set movements."],["Aka and ao","Red and blue."],["Yuko","1 point."],["Waza-ari","2 points."],["Ippon","3 points."],["Senshu","First unopposed score advantage."],["Jogai","Stepping out of the area."]],
  quiz:[{q:"How many points is a punch?",o:["1","2","3","5"],a:0,why:"A yuko, 1 point."},{q:"How many points is a kick to the body?",o:["1","2","3","4"],a:1,why:"Waza-ari, 2."},{q:"How many points is a head kick?",o:["1","2","3","5"],a:2,why:"Ippon, 3."},{q:"What lead ends the bout early?",o:["5","6","8","10"],a:2,why:"Eight points."},{q:"What is senshu?",o:["A penalty","The first unopposed score advantage","A kick","The referee"],a:1,why:"It breaks ties."},{q:"A bout ends 4-4 and Ao had senshu. Who wins?",o:["Aka","Ao","Draw","Judges vote"],a:1,why:"Senshu wins ties."},{q:"What are aka and ao?",o:["Punch and kick","Red and blue","Start and stop","Win and loss"],a:1,why:"Red and blue."},{q:"Is heavy contact rewarded?",o:["Yes","No, control is required"],a:1,why:"Excessive contact is a foul."},{q:"What is kata?",o:["Sparring","A solo form judged for technique","A penalty","A belt"],a:1,why:"A solo form."},{q:"How long is a senior kumite bout?",o:["1 minute","2 minutes","3 minutes","5 minutes"],a:2,why:"Three minutes."}],
  footer:"Rules on this page follow the WKF for kumite. Karate styles and other organizations use different scoring."})};
})();

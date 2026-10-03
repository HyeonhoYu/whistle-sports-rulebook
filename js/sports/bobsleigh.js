/* Bobsleigh. Rules follow the IBSF. */
(function(){
const svg = `<svg viewBox="0 0 800 340" role="img" aria-label="A bobsleigh track, simplified"><rect width="800" height="340" fill="#2F7546"/>
  <path d="M60 60H300Q360 60 360 120T420 180H560Q640 180 640 240T720 300" fill="none" stroke="#C9D8E4" stroke-width="34" stroke-linecap="round"/><path d="M60 60H300Q360 60 360 120T420 180H560Q640 180 640 240T720 300" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 8"/>
  <rect x="40" y="38" width="20" height="44" fill="#D9342B"/><line x1="150" y1="40" x2="150" y2="80" stroke="#F2C230" stroke-width="4"/><rect x="706" y="284" width="30" height="34" fill="#2B3831"/>
  <rect class="hz" data-zone="start" x="34" y="34" width="32" height="52"/><rect class="hz" data-zone="push" x="70" y="40" width="74" height="40"/><rect class="hz" data-zone="startclock" x="142" y="36" width="16" height="48"/>
  <rect class="hz" data-zone="curves" x="330" y="70" width="60" height="110"/><rect class="hz" data-zone="curves" x="610" y="190" width="60" height="100"/><rect class="hz" data-zone="straight" x="420" y="164" width="140" height="34"/><rect class="hz" data-zone="finish" x="700" y="280" width="42" height="42"/></svg>`;
const ZONES = {
  start:{title:"Start", text:"The crew pushes the sled from a standstill. The clock starts when the sled breaks a beam about 15 m down the track."},
  push:{title:"Push zone", text:"Sprinting with the sled on ice, often in spiked shoes, then jumping in one at a time. A strong push can win the race."},
  startclock:{title:"Start time", text:"The first timing point. Fans watch start times closely because a tenth here can turn into more by the finish."},
  curves:{title:"Curves", text:"Banked turns where sleds climb high on the walls and riders feel huge g-forces. The pilot steers with ropes attached to the front runners."},
  straight:{title:"Straights", text:"Speeds reach over 140 km/h (85 mph). A clean line through the curves carries speed into the straights."},
  finish:{title:"Finish", text:"Times are measured to the hundredth of a second."}
};
function race(){
  const $ = id => document.getElementById(id); let S;
  const SLEDS = [{n:"Your sled", push:.5, drive:.5},{n:"Sled A", push:.7, drive:.4},{n:"Sled B", push:.3, drive:.7},{n:"Sled C", push:.55, drive:.55}];
  const reset = () => { S = {run:0, t:SLEDS.map(() => 0), last:SLEDS.map(() => null)}; $("bbMsg").textContent = "Four runs over two days. Every run's time is added; the lowest total wins. For your runs, choose to focus on the push or the drive."; draw(); };
  function run(focus){
    if(S.run >= 4) return; S.run++;
    S.last = SLEDS.map((s,i) => { const push = i === 0 ? (focus === 0 ? .75 : .45) : s.push, drive = i === 0 ? (focus === 1 ? .75 : .45) : s.drive;
      const crash = Math.random() < (i === 0 && focus === 1 ? .08 : .03); return +(51.2 - push*.35 - drive*.45 + Math.random()*.35 + (crash ? 1.2 : 0)).toFixed(2); });
    S.t = S.t.map((v,i) => +(v + S.last[i]).toFixed(2));
    const order = SLEDS.map((_,i) => i).sort((a,b) => S.t[a] - S.t[b]);
    let msg = `Run ${S.run}: your time ${S.last[0].toFixed(2)}. ${S.last[0] > 51.5 ? "A skid in the curves cost you. " : ""}After ${S.run} run${S.run > 1 ? "s" : ""} you're ${["1st","2nd","3rd","4th"][order.indexOf(0)]}, ${order[0] === 0 ? `leading by ${(S.t[order[1]] - S.t[0]).toFixed(2)}` : `${(S.t[0] - S.t[order[0]]).toFixed(2)} behind`}.`;
    if(S.run === 4) msg += order[0] === 0 ? " Gold! Four steady runs win bobsleigh." : " That's the final result. Gaps of hundredths add up over four runs.";
    $("bbMsg").textContent = msg; draw();
  }
  function draw(){
    const order = SLEDS.map((_,i) => i).sort((a,b) => S.t[a] - S.t[b]);
    $("bbTab").innerHTML = `<table class="rctab"><thead><tr><th>Sled</th><th>Last run</th><th>Total</th><th>Gap</th></tr></thead><tbody>${(S.run ? order : SLEDS.map((_,i) => i)).map(i => `<tr class="${i === 0 ? "hl" : ""}"><td>${SLEDS[i].n}</td><td>${S.last[i] ? S.last[i].toFixed(2) : ""}</td><td>${S.run ? S.t[i].toFixed(2) : ""}</td><td>${S.run ? (i === order[0] ? "" : "+" + (S.t[i] - S.t[order[0]]).toFixed(2)) : ""}</td></tr>`).join("")}</tbody></table>`;
    document.querySelectorAll("[data-bb]").forEach(b => b.hidden = S.run >= 4); $("bbNew").hidden = S.run < 4;
  }
  document.querySelectorAll("[data-bb]").forEach(b => b.addEventListener("click", () => run(+b.dataset.bb)));
  $("bbNew").addEventListener("click", reset); reset();
}
SPORT_PAGES["bobsleigh"] = {render: app => sportPage(app, {id:"bobsleigh", p:"bb", name:"Bobsleigh", alt:"The tabby cat in a red helmet riding a bobsled",
  lede:"Teams of one, two, or four push a sled at full sprint, jump in, and ride it down a twisting ice track at over 140 km/h. The pilot steers; the others push and then brake after the finish. Times from four runs are added, and the lowest total wins.",
  facts:[["4","runs added together"],["140+","km/h top speed"],["0.01","second: how close races get"],["1, 2, or 4","athletes per sled"]],
  diagram:{title:"The track", lede:"A simplified track. Tap the parts.", svg, zones:ZONES, order:["start","push","startclock","curves","straight","finish"], first:"push"},
  blocks:[{id:"race", title:"Race four runs", lede:"Choose where to focus each run. A big push is safe speed; an aggressive drive can be faster but riskier in the curves.", html:`<div id="bbTab"></div><div class="controls" style="margin-top:12px"><button class="btn" data-bb="0" type="button">Focus on the push</button><button class="btn" data-bb="1" type="button">Drive aggressively</button><button class="btn primary" id="bbNew" type="button" hidden>New race</button></div><div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="bbMsg"></p></div>`, init:race},
    {id:"events", title:"Events and roles", html: cards([{big:"1", name:"Monobob", text:"A women's event with one athlete in a standard sled that everyone shares the same design of."},{big:"2", name:"Two-man and two-woman", text:"A pilot and a brakeman."},{big:"4", name:"Four-man", text:"A pilot, two push athletes, and a brakeman."},{big:"Pilot", name:"Pilot", text:"Steers with ropes connected to the front runners."},{big:"Brake", name:"Brakeman", text:"Pushes hardest at the start and pulls the brake after the finish line. Braking before the finish isn't allowed in the race."}], 200)}],
  tricky:[["Why add four runs?","Track conditions change, so four runs reward consistent speed."],["Why do sleds have weight limits?","Heavier sleds go faster downhill, so the sled plus crew has a maximum weight, and lighter crews can add ballast."],["What happens if a sled tips over?","If the crew finishes the run in contact with the sled, the time can still count. Many crashes end their chances, though."],["Can ties happen?","Yes. Times are kept to the hundredth of a second, and sleds that tie share the place."]],
  words:[["Pilot","The driver who steers."],["Brakeman","The athlete at the back who brakes after the finish."],["Push","The sprint at the start."],["Runners","The steel blades under the sled."],["Monobob","The one-person women's event."],["Skid","Sliding sideways in a curve and losing speed."]],
  quiz:[{q:"How many runs are added together at the Olympics?",o:["1","2","3","4"],a:3,why:"Four."},{q:"Who steers the sled?",o:["The brakeman","The pilot","Nobody","A computer"],a:1,why:"The pilot."},{q:"How do pilots steer?",o:["A wheel","Ropes connected to the front runners","Leaning only","Pedals"],a:1,why:"With ropes."},{q:"When can the brake be used?",o:["Anytime","After the finish line","In the curves","At the start"],a:1,why:"After the finish."},{q:"How many athletes in a four-man sled?",o:["2","3","4","5"],a:2,why:"Four."},{q:"What's the monobob?",o:["A one-person women's event","A practice run","A two-person sled","A crash"],a:0,why:"One athlete."},{q:"How fast can sleds go?",o:["About 60 km/h","About 100 km/h","Over 140 km/h","Over 300 km/h"],a:2,why:"Over 140 km/h."},{q:"How is the winner decided?",o:["Judges","Lowest total time over all runs","Fastest single run","Best start"],a:1,why:"Lowest total."},{q:"Why are there weight limits?",o:["For safety only","Heavier sleds would go faster","To make sleds float","For TV"],a:1,why:"Weight is speed downhill."},{q:"How precise is timing?",o:["Tenths","Hundredths","Whole seconds","Thousandths only"],a:1,why:"Hundredths of a second."}],
  footer:"Rules on this page follow the IBSF, used at the Olympics."})};
})();

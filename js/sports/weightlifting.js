/* Weightlifting. Rules follow the IWF. */
(function(){
const svg = `<svg viewBox="0 0 700 320" role="img" aria-label="Weightlifting platform"><rect width="700" height="320" fill="#2B3831"/><rect x="150" y="60" width="400" height="200" fill="#C9A27A" stroke="#7A4521" stroke-width="6"/>
  <rect x="210" y="150" width="280" height="10" fill="#9AA"/><circle cx="220" cy="155" r="32" fill="#D9342B" stroke="#111" stroke-width="3"/><circle cx="480" cy="155" r="32" fill="#D9342B" stroke="#111" stroke-width="3"/>
  ${[0,1,2].map(i => `<circle cx="${300 + i*50}" cy="295" r="12" fill="#fff" stroke="#111" stroke-width="2"/>`).join("")}<rect x="590" y="70" width="80" height="50" rx="6" fill="#111"/><text x="630" y="103" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="24" fill="#F2C230">1:00</text>
  <rect x="40" y="200" width="60" height="40" rx="6" fill="#EEF3EC"/>
  <rect class="hz" data-zone="platform" x="150" y="60" width="400" height="200"/><rect class="hz" data-zone="bar" x="180" y="115" width="340" height="80"/><rect class="hz" data-zone="lights" x="280" y="278" width="140" height="34"/><rect class="hz" data-zone="clock" x="586" y="66" width="88" height="58"/><rect class="hz" data-zone="chalk" x="36" y="196" width="68" height="48"/></svg>`;
const ZONES = {
  platform:{title:"Platform", text:"A 4 m square wooden platform. The lifter must stay on it, and stepping off during a lift makes it a no-lift."},
  bar:{title:"Barbell and plates", text:"A 20 kg bar for men, 15 kg for women. Plates are color-coded by weight, so the crowd can read the total: red is 25 kg."},
  lights:{title:"Referee lights", text:"Three referees each give a white light for a good lift or red for a no-lift. Two white lights make it good."},
  clock:{title:"Clock", text:"Once called, a lifter has 1 minute to start the lift, or 2 minutes when following their own previous attempt."},
  chalk:{title:"Chalk", text:"Magnesium chalk on the hands keeps the grip dry."}
};
function meet(){
  const $ = id => document.getElementById(id); let S;
  const MAX = {s:150, c:185}, RIV = [{n:"Rival A", s:148, c:182},{n:"Rival B", s:152, c:180},{n:"Rival C", s:145, c:186}];
  const reset = () => { S = {lift:"s", n:0, next:140, best:{s:0, c:0}, log:{s:[], c:[]}, over:false}; $("wlMsg").textContent = "Snatch first. Choose your opening weight, then lift. Three attempts at each lift; the weight can only go up."; draw(); };
  const p = (w, m) => Math.max(.04, Math.min(.96, 1 - (w - m + 6)*.09));
  function lift(){
    if(S.over) return; const w = S.next, ok = Math.random() < p(w, MAX[S.lift]);
    const lights = ok ? (Math.random() < .8 ? "WWW" : "WWR") : (Math.random() < .7 ? "RRR" : "WRR");
    S.log[S.lift].push({w, ok}); if(ok) S.best[S.lift] = Math.max(S.best[S.lift], w); S.n++;
    let msg = `${w} kg: ${ok ? "good lift" : "no lift"}. Lights: ${lights.split("").map(l => l === "W" ? "white" : "red").join(", ")}.`;
    if(S.n === 3){
      if(S.lift === "s"){ if(!S.best.s) msg += " No successful snatch: you're out of the competition without a total, a 'bomb-out'."; else { S.lift = "c"; S.n = 0; S.next = Math.max(S.best.s + 20, 170); msg += ` Best snatch: ${S.best.s} kg. Now the clean and jerk.`; } }
      else S.over = true;
      if(!S.best.s && S.lift === "s") S.over = true;
    } else S.next = ok ? w + 2 : w;
    if(S.over){
      const tot = S.best.s && S.best.c ? S.best.s + S.best.c : 0;
      const field = [{n:"You", t:tot}, ...RIV.map(r => ({n:r.n, t: Math.round(r.s - 3 + Math.random()*5) + Math.round(r.c - 4 + Math.random()*6)}))].sort((a,b) => b.t - a.t);
      msg += tot ? ` Your total: ${S.best.s} + ${S.best.c} = ${tot} kg. You finish ${["1st","2nd","3rd","4th"][field.findIndex(f => f.n === "You")]}.` : " No total, no ranking.";
      $("wlField").innerHTML = `<table class="rctab"><thead><tr><th>Lifter</th><th>Total</th></tr></thead><tbody>${field.map(f => `<tr class="${f.n === "You" ? "hl" : ""}"><td>${f.n}</td><td>${f.t || "No total"}</td></tr>`).join("")}</tbody></table>`;
    }
    $("wlMsg").textContent = msg; draw();
  }
  function draw(){
    $("wlLift").textContent = S.over ? "Done" : S.lift === "s" ? `Snatch, attempt ${S.n + 1}` : `Clean and jerk, attempt ${S.n + 1}`;
    $("wlW").textContent = `${S.next} kg`; $("wlS").textContent = S.log.s.map(a => `${a.w}${a.ok ? "" : "x"}`).join("  ") || "-"; $("wlC").textContent = S.log.c.map(a => `${a.w}${a.ok ? "" : "x"}`).join("  ") || "-";
    ["wlUp","wlDn","wlGo"].forEach(id => $(id).hidden = S.over); $("wlNew").hidden = !S.over; if(!S.over) $("wlField").innerHTML = "";
  }
  const minW = () => { const l = S.log[S.lift]; return l.length ? l[l.length - 1].w + (l[l.length - 1].ok ? 1 : 0) : 100; };
  $("wlUp").addEventListener("click", () => { S.next += 1; draw(); }); $("wlDn").addEventListener("click", () => { S.next = Math.max(minW(), S.next - 1); draw(); });
  $("wlGo").addEventListener("click", lift); $("wlNew").addEventListener("click", reset); reset();
}
SPORT_PAGES["weightlifting"] = {render: app => sportPage(app, {id:"weightlifting", p:"wl", name:"Weightlifting", alt:"The tabby cat holding a loaded barbell overhead",
  lede:"Lifters compete in two lifts: the snatch, lifting the bar overhead in one motion, and the clean and jerk, lifting it to the shoulders and then overhead. Each lifter gets three attempts at each, and the best of each lift add up to the total. Heaviest total wins.",
  facts:[["2","lifts: snatch and clean and jerk"],["3","attempts at each"],["2 of 3","referees must approve"],["1","minute to start a lift"]],
  diagram:{title:"The platform", svg, zones:ZONES, order:["platform","bar","lights","clock","chalk"], first:"lights", max:700},
  blocks:[{id:"meet", title:"Plan your attempts", lede:"Choose each weight, then lift. Go too heavy and you risk missing; miss all three snatches and you have no total.",
    html:`<div class="oslab"><div class="osside"><div class="board" style="grid-template-columns:1fr 1fr"><div class="dd"><small id="wlLift"></small><b id="wlW"></b></div><div><small>Snatch / Clean and jerk</small><b style="font-size:1rem;display:block" id="wlS"></b><b style="font-size:1rem;display:block" id="wlC"></b></div></div>
      <div class="controls"><button class="btn" id="wlDn" type="button">-1 kg</button><button class="btn" id="wlUp" type="button">+1 kg</button><button class="btn primary" id="wlGo" type="button">Lift!</button><button class="btn primary" id="wlNew" type="button" hidden>New competition</button></div>
      <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="wlMsg"></p></div></div><div id="wlField"></div></div>`, init:meet},
    {id:"lifts", title:"The two lifts", html: cards([{big:"Snatch", name:"Snatch", text:"The bar goes from the floor to overhead in one continuous movement, usually catching it in a deep squat, then standing up."},{big:"C&J", name:"Clean and jerk", text:"First the clean, to the shoulders, then the jerk, driving it overhead with a split or squat of the legs. Heavier weights than the snatch."},{big:"Total", name:"The total", text:"Best snatch plus best clean and jerk. If two lifters tie, the one who reached the total first wins."}])}],
  tricky:[["What's a bomb-out?","Missing all three attempts in either lift. Without a total, the lifter doesn't place."],["Can the weight go down?","No. The bar can only stay the same or go up between attempts."],["What makes a no-lift?","Pressing out the arms, touching the platform with a knee, dropping the bar, or not holding it still overhead until the down signal."],["Why weight classes?","Lifters are grouped by body weight so they compete against similar-sized opponents."]],
  words:[["Snatch","One-motion lift to overhead."],["Clean","Lifting the bar to the shoulders."],["Jerk","Driving the bar overhead from the shoulders."],["Total","Best snatch plus best clean and jerk."],["Bomb-out","No successful lift in a discipline."],["Press-out","Pushing with the arms to finish a lift, which makes it a no-lift."]],
  quiz:[{q:"What are the two lifts?",o:["Bench and squat","Snatch and clean and jerk","Deadlift and press","Curl and row"],a:1,why:"Snatch, then clean and jerk."},{q:"How many attempts at each lift?",o:["1","2","3","5"],a:2,why:"Three."},{q:"How many referee white lights make a good lift?",o:["1","2","3","All 5"],a:1,why:"Two of three."},{q:"What is the total?",o:["Sum of all lifts","Best snatch plus best clean and jerk","Heaviest single lift","Average"],a:1,why:"Best of each, added."},{q:"Can the next attempt be lighter?",o:["Yes","No"],a:1,why:"Weights only go up."},{q:"What happens if all three snatches fail?",o:["Retry later","No total: a bomb-out","Lose 10 kg","Nothing"],a:1,why:"Bomb-out."},{q:"How long to start a lift after being called?",o:["30 s","1 minute","5 minutes","No limit"],a:1,why:"One minute (two for consecutive attempts)."},{q:"Two lifters have the same total. Who wins?",o:["The lighter one","The one who made it first","The older one","They share"],a:1,why:"Whoever reached it first."},{q:"What does a red plate weigh?",o:["10 kg","20 kg","25 kg","50 kg"],a:2,why:"25 kg."},{q:"How heavy is the men's bar?",o:["15 kg","20 kg","25 kg","10 kg"],a:1,why:"20 kg."}],
  footer:"Rules on this page follow the IWF, used at the Olympics. Powerlifting is a separate sport with squat, bench press, and deadlift."})};
})();

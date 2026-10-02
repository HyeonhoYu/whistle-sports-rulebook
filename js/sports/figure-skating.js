/* Figure skating. Rules follow the ISU Judging System for singles skating. */
(function(){

const INK = "#18221D";
/* Base values from the ISU Scale of Values (1 to 4 rotations). */
const JUMPS = {
  T:{name:"Toe loop", bv:[.40,1.30,4.20,9.50], take:"Backward", edge:"Outside edge", toe:true, note:"The easiest jump: a backward glide on the outside edge, a tap of the free foot's toe pick, and up. Often the second jump in a combination."},
  S:{name:"Salchow", bv:[.40,1.30,4.30,9.70], take:"Backward", edge:"Inside edge", toe:false, note:"Launched from a backward inside edge with a scooping swing of the free leg. No toe pick."},
  Lo:{name:"Loop", bv:[.50,1.70,4.90,10.50], take:"Backward", edge:"Outside edge", toe:false, note:"The skater takes off and lands on the same foot, from a backward outside edge, with legs almost crossed."},
  F:{name:"Flip", bv:[.50,1.80,5.30,11.00], take:"Backward", edge:"Inside edge", toe:true, note:"A backward inside edge plus a toe pick. Judges watch for a wrong edge, marked 'e' and penalized."},
  Lz:{name:"Lutz", bv:[.60,2.10,5.90,11.50], take:"Backward", edge:"Outside edge", toe:true, note:"Like a flip, but from a backward outside edge, curving the opposite way to the rotation. That counter-rotation makes it the hardest toe jump."},
  A:{name:"Axel", bv:[1.10,3.30,8.00,12.50], take:"Forward", edge:"Outside edge", toe:false, note:"The only jump with a forward takeoff, so it needs an extra half rotation: a triple Axel is 3.5 turns. The first quadruple Axel in competition was landed in 2022."}
};
const ORDER = ["T","S","Lo","F","Lz","A"];
const SPIN = [2.00,2.50,3.00,3.50], STEP = [1.80,2.60,3.30,3.90];
const r2 = x => Math.round(x*100)/100;

/* Jump explorer */
function jumpIcon(J){
  const edgeIn = J.edge.startsWith("Inside");
  return `<svg viewBox="0 0 320 150" aria-hidden="true" style="width:100%;max-width:360px"><rect width="320" height="150" rx="10" fill="#E9F1F7"/>
    <path d="M30 ${J.take === "Forward" ? 120 : 30}Q120 ${J.key === "Lz" ? 140 : 75} 170 75" fill="none" stroke="#2F6FD6" stroke-width="5" stroke-dasharray="${edgeIn ? "10 6" : "0"}"/>
    <circle cx="170" cy="75" r="9" fill="#F2C230" stroke="${INK}" stroke-width="2"/>
    ${J.toe ? `<path d="M156 92l-8 14" stroke="#D9342B" stroke-width="5" stroke-linecap="round"/><text x="96" y="112" text-anchor="end" font-family="Barlow,sans-serif" font-size="13" fill="#D9342B">toe pick</text><path d="M100 108l44 -4" stroke="#D9342B" stroke-width="1.5"/>` : ""}
    <path d="M190 55a28 28 0 1 1 -2 42" fill="none" stroke="${INK}" stroke-width="3"/><path d="M184 92l4 9 8 -6" fill="none" stroke="${INK}" stroke-width="3"/>
    <path d="M230 75Q270 70 300 ${J.key === "Lz" ? 50 : 100}" fill="none" stroke="#7A8C81" stroke-width="4"/>
    <text x="30" y="20" font-family="Barlow,sans-serif" font-size="12" fill="${INK}">${J.take} takeoff, ${J.edge.toLowerCase()}${edgeIn ? " (dashed)" : ""}</text>
    <text x="300" y="140" text-anchor="end" font-family="Barlow,sans-serif" font-size="12" fill="${INK}">lands backward, outside edge</text></svg>`;
}
function jumpExplorer(){
  const $ = id => document.getElementById(id);
  function show(k){
    const J = {...JUMPS[k], key:k};
    const max = 12.5;
    $("jxPanel").innerHTML = `<div class="jxgrid"><div>${jumpIcon(J)}<p>${J.note}</p></div>
      <div><dl class="csstats"><div><dt>Takeoff</dt><dd>${J.take}, ${J.edge.toLowerCase()}</dd></div><div><dt>Toe pick</dt><dd>${J.toe ? "Yes (toe jump)" : "No (edge jump)"}</dd></div></dl>
      <div class="bvbars">${J.bv.map((v,i) => `<div><span>${["Single","Double","Triple","Quad"][i]}${k === "A" ? ` (${i + 1.5} turns)` : ""}</span><i style="width:${v/max*100}%"></i><b>${v.toFixed(2)}</b></div>`).join("")}</div>
      <p class="note">Base values in points. Harder jumps are worth far more: a quad is worth more than double a triple.</p></div></div>`;
    document.querySelectorAll("[data-jx]").forEach(b => b.setAttribute("aria-pressed", b.dataset.jx === k));
  }
  document.querySelectorAll("[data-jx]").forEach(b => b.addEventListener("click", () => show(b.dataset.jx)));
  show("A");
}

/* Program builder: three jumps, a spin, and a step sequence, judged by nine judges. */
function judges(mean, fall){
  return Array.from({length:9}, () => fall ? -5 : Math.max(-5, Math.min(5, Math.round(mean + (Math.random()*2.2 - 1.1)))));
}
function trimmed(m){
  const s = m.slice().sort((a,b) => a - b), hiI = m.indexOf(s[8]), loI = m.indexOf(s[0]);
  const avg = s.slice(1,8).reduce((a,b) => a + b, 0)/7;
  return {avg, hiI, loI: loI === hiI ? m.lastIndexOf(s[0]) : loI};
}
function marksHTML(m, t){ return `<span class="marks">${m.map((v,i) => `<i class="${i === t.hiI || i === t.loI ? "x" : ""}">${v > 0 ? "+" + v : v}</i>`).join("")}</span>`; }
function programBuilder(){
  const $ = id => document.getElementById(id);
  const sel = (id, opts, def) => `<select id="${id}">${opts.map(([v,l]) => `<option value="${v}"${v === def ? " selected" : ""}>${l}</option>`).join("")}</select>`;
  const jumpOpts = []; [4,3,2].forEach(r => ORDER.forEach(k => jumpOpts.push([`${r}${k}`, `${r === 4 ? "Quad" : r === 3 ? "Triple" : "Double"} ${JUMPS[k].name} (${JUMPS[k].bv[r-1].toFixed(2)})`])));
  $("pbForm").innerHTML = `<label>Jump 1 ${sel("pbJ1", jumpOpts, "3A")}</label><label>Jump 2 ${sel("pbJ2", jumpOpts, "3Lz")}</label><label>Jump 3 ${sel("pbJ3", jumpOpts, "3F")}</label>
    <label>Spin ${sel("pbSp", [1,2,3,4].map(l => [String(l), `Level ${l} combination spin (${SPIN[l-1].toFixed(2)})`]), "4")}</label>
    <label>Steps ${sel("pbSt", [1,2,3,4].map(l => [String(l), `Level ${l} step sequence (${STEP[l-1].toFixed(2)})`]), "3")}</label>`;
  function skate(){
    let rows = [], tes = 0, falls = 0, notes = [];
    ["pbJ1","pbJ2","pbJ3"].forEach(id => {
      const code = $(id).value, rot = +code[0], k = code.slice(1); let bv = JUMPS[k].bv[rot-1];
      const risk = rot === 4 ? (k === "A" ? .5 : .28) : rot === 3 ? (k === "A" ? .2 : .11) : .04, q = Math.random();
      let out = "clean", label = code, mean = .6 + Math.random()*2.4;
      if(q < risk*.45){ out = "fall"; falls++; }
      else if(q < risk*.7){ out = "<"; label += "<"; bv = r2(bv*.8); mean = -2; }
      else if(q < risk*.8 && rot > 1){ out = "<<"; label += "<<"; bv = JUMPS[k].bv[rot-2]; mean = -3; }
      else if(q < risk){ out = "q"; label += "q"; mean = -1; }
      const m = judges(mean, out === "fall"), t = trimmed(m), goe = r2(t.avg*bv*.1), sc = r2(bv + goe);
      tes += sc; rows.push({label, bv, m, t, goe, sc, out});
      if(out === "fall") notes.push(`${code} was a fall: GOE drops to -5 and there's a deduction.`);
      if(out === "<") notes.push(`${code} was under-rotated (<): base value cut to 80%.`);
      if(out === "<<") notes.push(`${code} was downgraded (<<): it counts as a jump with one less rotation.`);
      if(out === "q") notes.push(`${code} landed a quarter short (q): full base value, but the judges lower the GOE.`);
    });
    [["CCoSp" + $("pbSp").value, SPIN[$("pbSp").value - 1]], ["StSq" + $("pbSt").value, STEP[$("pbSt").value - 1]]].forEach(([label,bv]) => {
      const m = judges(.8 + Math.random()*2), t = trimmed(m), goe = r2(t.avg*bv*.1), sc = r2(bv + goe); tes += sc; rows.push({label, bv, m, t, goe, sc});
    });
    tes = r2(tes);
    const comps = ["Composition","Presentation","Skating skills"].map(c => [c, r2(7 + Math.random()*1.8 - falls*.25)]);
    const pcs = r2(comps.reduce((a,[,v]) => a + v, 0)*1.33), ded = -falls, total = r2(tes + pcs + ded);
    $("pbOut").innerHTML = `<div class="cardwrap"><table class="bxcard pbtab"><thead><tr><th>Element</th><th>Base</th><th>Nine judges' GOE (highest and lowest dropped)</th><th>GOE</th><th>Score</th></tr></thead><tbody>
      ${rows.map(r => `<tr class="${r.out === "fall" ? "you" : ""}"><th>${r.label}${r.out === "fall" ? " F" : ""}</th><td>${r.bv.toFixed(2)}</td><td>${marksHTML(r.m, r.t)}</td><td>${r.goe > 0 ? "+" : ""}${r.goe.toFixed(2)}</td><td class="tot">${r.sc.toFixed(2)}</td></tr>`).join("")}
      </tbody></table></div>
      <div class="scorebar"><div><small>Technical (TES)</small><b>${tes.toFixed(2)}</b></div><span>+</span><div><small>Components (PCS)</small><b>${pcs.toFixed(2)}</b></div><span>${ded ? "-" : "+"}</span><div><small>Deductions</small><b>${Math.abs(ded).toFixed(2)}</b></div><span>=</span><div class="tot"><small>Total</small><b>${total.toFixed(2)}</b></div></div>
      <p class="note">Components: ${comps.map(([c,v]) => `${c} ${v.toFixed(2)}`).join(", ")}, added and multiplied by a factor (here 1.33).</p>`;
    $("pbMsg").textContent = `In the kiss and cry, the score comes up: ${total.toFixed(2)}. ` + (notes.length ? notes.join(" ") : "A clean skate! Every element landed, so the judges rewarded it with positive GOE.");
  }
  $("pbGo").addEventListener("click", skate);
}

const CALLS = [
  {name:"Fall", text:"A fall costs at least one point off the total, and the element gets the lowest GOE of -5. Repeated falls cost more."},
  {name:"Quarter short (q)", text:"A jump landed about a quarter turn short. It keeps its full base value, but the judges lower the GOE."},
  {name:"Under-rotated (<)", text:"Short by more than a quarter but less than half a turn. The base value drops to 80%."},
  {name:"Downgraded (<<)", text:"Short by half a turn or more. The jump is scored as if it had one rotation fewer: a triple counts as a double."},
  {name:"Wrong edge (e)", text:"A flip or Lutz taken off from the wrong edge. The base value is cut and the GOE goes down."},
  {name:"Time and costume", text:"Going over the program time limit, or a costume piece falling on the ice, brings a deduction."}
];
const CLOCK = [
  {k:"sp", cls:"q", t:"Short", s:"2:40", info:["Short program","About 2 minutes 40 seconds with seven required elements, including three jump elements. In ice dance this is the rhythm dance."]},
  {k:"kc", cls:"half", t:"Kiss and cry", s:"Scores", info:["Kiss and cry","Skaters sit with their coaches to wait for their scores, which arrive within a minute or two."]},
  {k:"fs", cls:"q", t:"Free", s:"4:00", info:["Free skate","About 4 minutes, with more freedom in the choice of elements: up to seven jump elements for singles skaters. Only the top skaters from the short program advance to it at major championships."]},
  {k:"tot", cls:"ot", t:"Total", s:"Medals", info:["Final result","The short program and free skate scores are added. The highest total wins, so a skater can win the free skate and still finish second overall."]}
];
const TRICKY = [
  ["How can you tell the jumps apart?","Watch the takeoff. A forward takeoff means an Axel. Then look for a toe pick: toe loop, flip, and Lutz use one; Salchow and loop don't. The edge sorts out the rest."],
  ["Why are judges' highest and lowest marks dropped?","Dropping the highest and lowest of the nine marks protects against one judge being much too generous or too harsh."],
  ["Who decides if a jump was under-rotated?","A separate technical panel, watching video replays, identifies each element, its level, and any under-rotation. The judges then grade how well it was done."],
  ["Can skaters use songs with lyrics?","Yes. Vocal music has been allowed in singles and pairs since the 2014-15 season."],
  ["Are backflips allowed?","They were banned for decades. Starting with the 2024-25 season the ISU allowed them, though a backflip doesn't count as a scoring element."],
  ["What makes a spin level 4?","Spins and step sequences earn levels 1 to 4 by including difficult features, like hard positions, changes of edge, or fast rotation. The technical panel counts the features and sets the level."]
];
const WORDS = [
  ["TES","Technical element score: the points for jumps, spins, and steps."],
  ["PCS","Program component score: the marks for composition, presentation, and skating skills."],
  ["GOE","Grade of execution, from -5 to +5, for how well each element was done."],
  ["Base value","The fixed points an element is worth before GOE."],
  ["Combination","Two or three jumps in a row, with no steps between them."],
  ["Quad","A jump with four rotations, or four and a half for the Axel."],
  ["Level","The difficulty grade, 1 to 4, given to spins and step sequences."],
  ["Kiss and cry","The area where skaters wait for their scores."],
  ["Technical panel","The officials who identify each element and its level."],
  ["Personal best","A skater's highest score at international competitions."]
];
const panelMini = () => { const m = [3,2,3,4,2,3,5,1,3], t = trimmed(m); return `<div class="pbmini">${marksHTML(m, t)}</div>`; };
const QUIZ = [
  {q:"How is a skater's score for a program made up?", o:["Judges' votes for a favorite","Technical score + component score - deductions","The fastest time","The number of jumps landed"], a:1, why:"TES plus PCS, minus any deductions."},
  {q:"Of the nine judges' GOE marks, which are dropped?", o:["None of them","The two highest","The highest and the lowest","A random one"], a:2, why:"The highest and lowest are dropped, and the other seven are averaged."},
  {q:"Which jump takes off forward?", o:["Lutz","Toe loop","Salchow","Axel"], a:3, why:"The Axel is the only forward-takeoff jump, which is why it has an extra half rotation."},
  {q:"How many rotations are in a triple Axel?", o:["3","3.5","4","2.5"], a:1, why:"Three and a half, because of the forward takeoff."},
  {q:"A skater falls on a jump. What happens?", o:["No penalty","Only a lower GOE","A deduction of at least 1 point, plus a GOE of -5","Disqualification"], a:2, why:"The element gets -5 GOE and the fall is deducted from the total."},
  {q:"What range do judges use for grade of execution?", o:["-5 to +5","0 to 10","-3 to +3","1 to 6"], a:0, why:"GOE runs from -5 to +5. Each step is worth 10% of the element's base value."},
  {q:"A jump is called under-rotated (<). What happens to its base value?", o:["Nothing","It drops to 80%","It drops to zero","It doubles"], a:1, why:"An under-rotated jump keeps 80% of its base value."},
  {q:"What are the two parts of a singles competition?", o:["One long program","The short program and the free skate","Three programs","A qualifier and a final run"], a:1, why:"The short program and the free skate scores are added together."},
  {q:"These are the nine judges' GOE marks for a jump. What's the panel's average?", visual: panelMini, o:["2.86","2.89","3.00","2.67"], a:0, why:"Drop the +5 and the +1. The other seven add up to 20, and 20 / 7 is 2.86."},
  {q:"What is the kiss and cry?", o:["A type of spin","The area where skaters wait for scores","A deduction for falls","The warm-up session"], a:1, why:"It's where skaters and coaches sit to hear their scores."}
];

function render(app){
  app.innerHTML = sportHero({id:"figure-skating", name:"Figure skating", alt:"The tabby cat gliding on one skate with arms spread",
      lede:"Skaters perform programs set to music, combining jumps, spins, and footwork. A technical panel identifies every element, nine judges grade how well each one is done and how well the whole program is skated, and the points add up to a score.",
      facts:[["6","types of jumps"],["9","judges on the panel"],["2","programs, scores added"],["-5 to +5","grade for each element"]]})
    + jumpNav([["fs-jumps","The six jumps"],["fs-build","Build a program"],["fs-score","How scoring works"],["fs-calls","Calls and deductions"],["fs-clock","The competition"],["fs-tricky","Tricky rules"],["fs-words","Words you'll hear"],["fs-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("fs-jumps","The six jumps","Pick a jump to see how it takes off and what it's worth.",
        `<div class="controls"><span class="chips">${ORDER.map(k => `<button class="chip" type="button" data-jx="${k}">${JUMPS[k].name}</button>`).join("")}</span></div>
        <div class="infopanel" id="jxPanel" style="margin-top:14px"></div>`)
    + section("fs-build","Build and skate a program","Choose three jumps, a spin, and a step sequence. Harder jumps are worth more but are riskier. Then skate it and see how the judges score you.",
        `<div class="pbform" id="pbForm"></div>
        <div class="controls" style="margin-top:12px"><button class="btn primary" id="pbGo" type="button">Skate it!</button></div>
        <div class="result narrator" style="margin:12px 0" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="pbMsg">Pick your elements, then skate. You can skate the same program again for a different result.</p></div>
        <div id="pbOut"></div>`)
    + section("fs-score","How scoring works","Two scores, added together, minus deductions.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
          <div class="score"><div class="pts">TES</div><h3>Technical elements</h3><p>Each jump, spin, and step sequence has a base value. Nine judges each give a grade of execution from -5 to +5; the highest and lowest are dropped, and each step of the average adds or removes 10% of the base value.</p></div>
          <div class="score"><div class="pts">PCS</div><h3>Program components</h3><p>Judges also mark three components out of 10: composition, presentation, and skating skills. These are added and multiplied by a factor for the event.</p></div>
          <div class="score"><div class="pts">-</div><h3>Deductions</h3><p>Points off the total for falls, time violations, costume problems, and other rule breaks.</p></div></div>`)
    + section("fs-calls","Calls and deductions","The technical panel marks these on the protocol, the detailed score sheet published after every skate.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${CALLS.map(d => `<div class="score"><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("fs-clock","The competition","Singles skaters perform two programs. Tap one to learn more.",
        `<div class="timeline" id="fsTimeline"></div><div class="infopanel" id="fsClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("fs-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="fsFlips"></div>`)
    + section("fs-words","Words you'll hear","",`<dl class="gloss" id="fsGloss"></dl>`)
    + section("fs-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="fsQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the ISU Judging System for singles skating. Pairs and ice dance use the same scoring idea with their own elements, such as lifts and throw jumps. Base values change slightly from season to season.</footer></div>`;

  jumpExplorer(); programBuilder();
  setupTimeline(document.getElementById("fsTimeline"), document.getElementById("fsClockInfo"), CLOCK,
    "Programs are skated in groups, with the top skaters from the short program skating last in the free skate.");
  flipCards(document.getElementById("fsFlips"), TRICKY);
  glossary(document.getElementById("fsGloss"), WORDS);
  makeQuiz(document.getElementById("fsQuiz"), QUIZ, [
    "A perfect program! Watch a competition and try to name each jump by its takeoff.",
    "A strong skate. Build a few more programs and the scoring will click.",
    "Look over the six jumps and the scoring cards again, then come back for another skate.",
    "No worries. Start with the six jumps and build a simple program, then try again."]);
}

SPORT_PAGES["figure-skating"] = {render};
})();

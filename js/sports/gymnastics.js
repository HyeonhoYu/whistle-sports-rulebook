/* Artistic gymnastics. Rules follow the FIG Code of Points. */
(function(){

const INK = "#18221D", MAT = "#3E7CB8", WOOD = "#C9A27A";
const ico = body => `<svg viewBox="0 0 220 140" aria-hidden="true"><rect width="220" height="140" rx="10" fill="#E9F1F7"/><rect y="118" width="220" height="22" fill="${MAT}"/>${body}</svg>`;
const APP = {
  w:[
    {name:"Vault", art: ico(`<rect x="20" y="108" width="40" height="10" rx="3" fill="${WOOD}"/><path d="M110 118V74" stroke="#5E6B64" stroke-width="8"/><rect x="88" y="60" width="64" height="16" rx="8" fill="#2F6FD6"/><path d="M30 100Q100 -10 180 110" fill="none" stroke="#D9342B" stroke-width="3" stroke-dasharray="7 5"/>`), text:"A sprint of up to 25 m, a springboard, hands on the vault table, and a flight with twists or flips. In qualification each gymnast does one vault; the vault final needs two different vaults, averaged."},
    {name:"Uneven bars", art: ico(`<path d="M60 118V40M150 118V70M60 40h-30M150 70h30" stroke="#5E6B64" stroke-width="5"/><line x1="30" y1="40" x2="90" y2="40" stroke="${WOOD}" stroke-width="6"/><line x1="120" y1="70" x2="180" y2="70" stroke="${WOOD}" stroke-width="6"/><path d="M60 40Q105 0 150 70" fill="none" stroke="#D9342B" stroke-width="3" stroke-dasharray="7 5"/>`), text:"Two bars at different heights. Gymnasts swing continuously, fly between the bars, and let go and re-catch in release moves. Pauses and extra swings cost points."},
    {name:"Balance beam", art: ico(`<rect x="20" y="58" width="180" height="10" rx="3" fill="${WOOD}"/><path d="M50 68V118M170 68V118" stroke="#5E6B64" stroke-width="5"/><text x="110" y="48" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="${INK}">10 cm wide, 5 m long</text>`), text:"A beam just 10 cm (4 inches) wide and 1.25 m off the floor. In under 90 seconds, gymnasts perform flips, leaps, jumps, and turns. Every wobble is a deduction."},
    {name:"Floor exercise", art: ico(`<path d="M30 112h160" stroke="#fff" stroke-width="3"/><path d="M40 108Q70 40 100 108Q130 40 160 108" fill="none" stroke="#D9342B" stroke-width="3" stroke-dasharray="7 5"/><text x="110" y="30" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="${INK}">12 m x 12 m, with music</text>`), text:"A 12 m square sprung floor. Women perform to music for up to 90 seconds, mixing tumbling passes with dance. Stepping out of bounds costs points."}
  ],
  m:[
    {name:"Floor exercise", art: ico(`<path d="M30 112h160" stroke="#fff" stroke-width="3"/><path d="M40 108Q70 40 100 108Q130 40 160 108" fill="none" stroke="#D9342B" stroke-width="3" stroke-dasharray="7 5"/><text x="110" y="30" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="${INK}">12 m x 12 m, no music</text>`), text:"The same 12 m square, but men perform without music for up to 70 seconds: powerful tumbling passes, strength holds, and balance."},
    {name:"Pommel horse", art: ico(`<rect x="50" y="62" width="120" height="22" rx="10" fill="#8C5A3C"/><path d="M90 62v-12M130 62v-12M90 50h8M130 50h8" stroke="#5E6B64" stroke-width="5"/><path d="M80 118V84M140 118V84" stroke="#5E6B64" stroke-width="5"/><ellipse cx="110" cy="40" rx="50" ry="10" fill="none" stroke="#D9342B" stroke-width="3" stroke-dasharray="7 5"/>`), text:"Only the hands may touch the horse. Gymnasts swing their legs in continuous circles and scissors, traveling along the whole horse. Many consider it the hardest event."},
    {name:"Rings", art: ico(`<path d="M80 6V60M140 6V60" stroke="#5E6B64" stroke-width="2"/><circle cx="80" cy="68" r="8" fill="none" stroke="${WOOD}" stroke-width="4"/><circle cx="140" cy="68" r="8" fill="none" stroke="${WOOD}" stroke-width="4"/><path d="M88 68h44" stroke="#2F6FD6" stroke-width="6"/>`), text:"Two rings hanging from cables. Gymnasts combine swings with strength holds like the iron cross, which must be held still for at least two seconds. The rings should barely move."},
    {name:"Vault", art: ico(`<rect x="20" y="108" width="40" height="10" rx="3" fill="${WOOD}"/><path d="M110 118V70" stroke="#5E6B64" stroke-width="8"/><rect x="88" y="56" width="64" height="16" rx="8" fill="#2F6FD6"/><path d="M30 100Q100 -10 180 110" fill="none" stroke="#D9342B" stroke-width="3" stroke-dasharray="7 5"/>`), text:"The same idea as the women's vault, on a slightly higher table: run, springboard, push off, fly, and land cleanly."},
    {name:"Parallel bars", art: ico(`<line x1="40" y1="56" x2="180" y2="56" stroke="${WOOD}" stroke-width="6"/><line x1="40" y1="66" x2="180" y2="66" stroke="${WOOD}" stroke-width="6" opacity=".6"/><path d="M60 66V118M160 66V118" stroke="#5E6B64" stroke-width="5"/><path d="M110 56V12" stroke="#2F6FD6" stroke-width="6"/>`), text:"Two bars side by side. Gymnasts swing through handstands above the bars, release and re-grasp, and work both above and below the bars."},
    {name:"High bar", art: ico(`<path d="M50 118V24M170 118V24" stroke="#5E6B64" stroke-width="5"/><line x1="50" y1="24" x2="170" y2="24" stroke="${WOOD}" stroke-width="5"/><circle cx="110" cy="24" r="56" fill="none" stroke="#D9342B" stroke-width="3" stroke-dasharray="7 5"/>`), text:"A single steel bar 2.8 m high. Giant swings around the bar build speed for spectacular release moves, flying over the bar and catching it again, and a big dismount."}
  ]
};
function apparatus(){
  const $ = id => document.getElementById(id);
  function show(g){
    $("apGrid").innerHTML = APP[g].map(a => `<div class="score">${a.art}<h3>${a.name}</h3><p>${a.text}</p></div>`).join("");
    document.querySelectorAll("[data-ap]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ap === g));
  }
  document.querySelectorAll("[data-ap]").forEach(b => b.addEventListener("click", () => show(b.dataset.ap)));
  show("w");
}

/* Execution judge: you watch a balance beam routine and take deductions. */
const EVENTS = [
  ["A leap reaches a full split, legs straight and toes pointed.", 0],
  ["A turn on one foot is smooth and finishes exactly as planned.", 0],
  ["Slightly bent knees in a jump.", .1],
  ["A small wobble: the arms move a little to keep balance.", .1],
  ["A leap falls a little short of a full 180-degree split.", .1],
  ["A big wobble: the upper body swings and the arms wave to stay on.", .3],
  ["Legs come apart during a back handspring.", .3],
  ["A hand grabs the beam to avoid falling off.", .5],
  ["The gymnast falls off the beam and remounts.", 1],
  ["A small step on the dismount landing.", .1],
  ["A large lunge on the landing, wider than shoulder width.", .3],
  ["The dismount landing is stuck: no movement at all.", 0]
];
function judgeGame(){
  const $ = id => document.getElementById(id); let S;
  function reset(){
    const pool = EVENTS.slice(0, 9).sort(() => Math.random() - .5).slice(0, 5);
    const dismount = pickOne(EVENTS.slice(9));
    S = {ev:[...pool, dismount], i:0, mine:[], d: Math.round((5.2 + Math.random()*1.1)*10)/10};
    $("jgOut").innerHTML = ""; show();
  }
  function show(){
    const e = S.ev[S.i];
    $("jgStep").textContent = `Skill ${S.i + 1} of ${S.ev.length}`;
    $("jgEvent").textContent = e[0];
    $("jgBtns").hidden = false; $("jgNew").hidden = true;
  }
  function pick(v){
    S.mine.push(v); S.i++;
    if(S.i < S.ev.length) return show();
    $("jgBtns").hidden = true; $("jgNew").hidden = false; $("jgStep").textContent = "Routine complete"; $("jgEvent").textContent = "Here's how your marks compare with the panel.";
    const truth = S.ev.map(e => e[1]);
    const opts = [0,.1,.3,.5,1];
    const panel = Array.from({length:5}, () => 10 - truth.reduce((a,t) => { let v = t; if(t !== 1 && Math.random() < .25){ const k = opts.indexOf(t) + (Math.random() < .5 ? -1 : 1); v = opts[Math.max(0, Math.min(3, k))]; } return a + v; }, 0));
    const sorted = panel.slice().sort((a,b) => a - b), e = sorted.slice(1,4).reduce((a,b) => a + b, 0)/3;
    const mineE = 10 - S.mine.reduce((a,b) => a + b, 0), total = S.d + e;
    const hi = panel.indexOf(sorted[4]), lo = panel.indexOf(sorted[0]) === hi ? panel.lastIndexOf(sorted[0]) : panel.indexOf(sorted[0]);
    const right = S.mine.filter((m,i) => m === truth[i]).length;
    $("jgOut").innerHTML = `<div class="cardwrap"><table class="bxcard"><thead><tr><th>Skill</th><th>Your deduction</th><th>Code of Points</th></tr></thead><tbody>
      ${S.ev.map((ev,i) => `<tr class="${S.mine[i] === truth[i] ? "" : "you"}"><th style="font-family:Barlow,sans-serif;font-size:.9rem;font-weight:500;white-space:normal">${ev[0]}</th><td>${S.mine[i].toFixed(1)}</td><td class="tot">${truth[i].toFixed(1)}</td></tr>`).join("")}</tbody></table></div>
      <div class="scorebar"><div><small>Your E-score</small><b>${mineE.toFixed(3)}</b></div><div><small>Panel E-scores</small><span class="marks">${panel.map((p,i) => `<i class="${i === hi || i === lo ? "x" : ""}">${p.toFixed(1)}</i>`).join("")}</span></div></div>
      <div class="scorebar"><div><small>D-score</small><b>${S.d.toFixed(3)}</b></div><span>+</span><div><small>E-score (middle 3 averaged)</small><b>${e.toFixed(3)}</b></div><span>=</span><div class="tot"><small>Final score</small><b>${total.toFixed(3)}</b></div></div>`;
    $("jgMsg").textContent = `You matched the Code of Points on ${right} of ${S.ev.length} skills. Real judges train for years to agree within a tenth or two, and the highest and lowest of the panel's scores are dropped.`;
  }
  document.querySelectorAll("[data-jg]").forEach(b => b.addEventListener("click", () => pick(+b.dataset.jg)));
  $("jgNew").addEventListener("click", () => { reset(); $("jgMsg").textContent = "A new routine. Take the deductions you think each moment deserves."; });
  reset();
}

const DEDS = [
  {n:"0.1", name:"Small error", text:"Slightly bent arms or knees, a little wobble, a small step on landing, feet not quite together."},
  {n:"0.3", name:"Medium error", text:"A clear bend, a big wobble, legs apart, or a large step or hop on landing."},
  {n:"0.5", name:"Large error", text:"A very bad body position, or grabbing the apparatus to avoid a fall."},
  {n:"1.0", name:"Fall", text:"Falling onto the mat, or onto the hands or knees on landing. It's the biggest single deduction."},
  {n:"0.1-0.3", name:"Out of bounds", text:"On floor and vault, touching outside the boundary costs 0.1 for a foot and 0.3 for both feet, a hand, or the body."},
  {n:"0.1+", name:"Time and other penalties", text:"Running over the time limit on beam or floor, leaving the competition area, or missing the judges' salute before or after the routine."}
];
const CLOCK = [
  {k:"q", cls:"q", t:"Qualifying", s:"Everyone", info:["Qualification","Every gymnast competes. Scores decide who reaches the team final, the all-around final, and each apparatus final. Only two gymnasts per country can reach each individual final."]},
  {k:"tf", cls:"q", t:"Team final", s:"Top 8 teams", info:["Team final","Three gymnasts per team compete on each apparatus, and all three scores count. One fall can cost a medal."]},
  {k:"aa", cls:"q", t:"All-around", s:"Every apparatus", info:["All-around final","Each gymnast competes on every apparatus: four for women, six for men. The highest total wins the title of best all-around gymnast."]},
  {k:"ef", cls:"ot", t:"Event finals", s:"Top 8 each", info:["Apparatus finals","The eight best on each apparatus compete for medals on that apparatus alone."]}
];
const TRICKY = [
  ["What happened to the perfect 10?","It was retired after 2005. The open-ended D-score rewards harder skills, so top scores today are usually in the 13s, 14s, and 15s."],
  ["How do skills get named after gymnasts?","A gymnast who first performs a new skill successfully at a major international competition, after submitting it in advance, can have it named after them in the Code of Points."],
  ["Why do judges drop scores?","On the execution panel, the highest and lowest scores are dropped and the rest averaged, so one unusually strict or generous judge can't swing the result."],
  ["What does 'stick the landing' mean?","Landing a dismount or vault without moving the feet at all. It avoids landing deductions and always gets a cheer."],
  ["Can a coach help during a routine?","Coaches set up equipment and can stand near the bars or vault for safety, but if a coach touches the gymnast during a skill, it's a big deduction and the skill doesn't count."],
  ["How are ties broken?","It depends on the round. In many finals, the gymnast with the higher execution score wins a tie, rewarding cleaner gymnastics over harder skills."]
];
const WORDS = [
  ["D-score","Difficulty score: the value of the hardest skills, connections, and requirements."],
  ["E-score","Execution score: starts at 10 and loses points for every error."],
  ["Code of Points","The rulebook listing every skill's value and every deduction."],
  ["Stick","A landing with no step or hop."],
  ["Release move","Letting go of the bar and catching it again."],
  ["Dismount","The final skill that brings the gymnast off the apparatus."],
  ["Salto","A flip in the air, forward, backward, or sideways."],
  ["Twist","A rotation around the body's long axis, often combined with a salto."],
  ["Hold","A strength position kept still, at least two seconds on rings."],
  ["All-around","Competing on every apparatus for one combined score."]
];
const floorMini = () => `<svg viewBox="0 0 220 140" style="width:220px;border-radius:8px" aria-hidden="true"><rect width="220" height="140" fill="#2B3831"/><rect x="20" y="20" width="160" height="100" fill="${MAT}"/><rect x="20" y="20" width="160" height="100" fill="none" stroke="#fff" stroke-width="4"/>
  <ellipse cx="190" cy="80" rx="8" ry="16" fill="#E8D5B5" stroke="${INK}" stroke-width="2"/><ellipse cx="162" cy="58" rx="8" ry="16" fill="#E8D5B5" stroke="${INK}" stroke-width="2"/></svg>`;
const QUIZ = [
  {q:"How is a gymnastics score calculated?", o:["Judges rank the gymnasts","D-score + E-score - penalties","The average of 10 judges","By the time taken"], a:1, why:"Difficulty plus execution, minus any neutral penalties."},
  {q:"Where does the execution score start?", o:["0","5.0","10.0","20.0"], a:2, why:"Every routine starts at 10.0 in execution, and judges take away points for errors."},
  {q:"How much is deducted for a fall?", o:["0.1","0.3","0.5","1.0"], a:3, why:"A fall costs a full point from the execution score."},
  {q:"How many apparatus do women compete on?", o:["3","4","6","8"], a:1, why:"Four: vault, uneven bars, balance beam, and floor. Men compete on six."},
  {q:"Which of these is a men's apparatus only?", o:["Balance beam","Uneven bars","Pommel horse","Vault"], a:2, why:"Pommel horse is men only. Beam and uneven bars are women only; vault is for both."},
  {q:"How wide is the balance beam?", o:["5 cm","10 cm","20 cm","30 cm"], a:1, why:"Just 10 cm, about 4 inches."},
  {q:"A gymnast takes a small step on landing. What's the usual deduction?", o:["0.1","0.3","0.5","1.0"], a:0, why:"A small step is a small error: 0.1."},
  {q:"Is there a maximum D-score?", o:["Yes, 10.0","Yes, 15.0","No: it's open-ended","Yes, 20.0"], a:2, why:"Difficulty is open-ended, so harder routines can always score more."},
  {q:"A gymnast's foot lands over the white line on floor, like this. What happens?", visual: floorMini, o:["No deduction","An out-of-bounds penalty","A fall deduction of 1.0","Disqualification"], a:1, why:"Touching outside the boundary is out of bounds: 0.1 for one foot, more for both feet or a hand."},
  {q:"How does a skill get named after a gymnast?", o:["By winning the most medals","By being the first to perform it at a major competition","The coach names it","By a vote of fans"], a:1, why:"The first gymnast to successfully perform a new, pre-submitted skill at a major international competition gets their name on it."}
];

function render(app){
  app.innerHTML = sportHero({id:"gymnastics", name:"Gymnastics", alt:"The tabby cat balancing on one foot on a balance beam",
      lede:"Gymnasts perform short routines on different apparatus, from the narrow balance beam to the spinning high bar. Each routine gets two scores: one for how difficult it is, and one for how well it's done. The highest combined score wins.",
      facts:[["4","apparatus for women"],["6","apparatus for men"],["10.0","where the execution score starts"],["1.0","deducted for a fall"]]})
    + jumpNav([["gy-app","The apparatus"],["gy-judge","Be the judge"],["gy-score","How scoring works"],["gy-ded","Deductions"],["gy-clock","The competition"],["gy-tricky","Tricky rules"],["gy-words","Words you'll hear"],["gy-quiz","Quiz"]])
    + `<div class="wrap">`
    + section("gy-app","The apparatus","Women and men compete on different apparatus. Red dashes show the kind of movement each one is known for.",
        `<div class="controls"><span class="chips"><button class="chip" type="button" data-ap="w">Women: 4 apparatus</button><button class="chip" type="button" data-ap="m">Men: 6 apparatus</button></span></div>
        <div class="scoring" id="apGrid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))"></div>`)
    + section("gy-judge","Be the execution judge","Watch a balance beam routine one moment at a time. For each one, take the deduction you think it deserves.",
        `<div class="sim"><div class="rtpanel" style="text-align:left"><small id="jgStep" style="color:#A9B8AE"></small><p id="jgEvent" style="color:#EEF3EC;font-size:1.25rem;font-weight:600;margin:6px 0 16px"></p>
            <div class="controls" id="jgBtns">${[0,.1,.3,.5,1].map(v => `<button class="btn" type="button" data-jg="${v}">${v ? "-" + v.toFixed(1) : "No deduction"}</button>`).join("")}</div>
            <div class="controls"><button class="btn rtgo" id="jgNew" type="button" hidden>Judge another routine</button></div></div>
          <div class="result narrator" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="jgMsg">Small errors cost 0.1, medium 0.3, large 0.5, and a fall 1.0.</p></div>
          <div id="jgOut"></div></div>`)
    + section("gy-score","How scoring works","Since 2006, scores have two parts instead of the old perfect 10.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
          <div class="score"><div class="pts">D</div><h3>Difficulty score</h3><p>Open-ended. It adds up the values of the hardest skills, bonus points for linking skills together, and required elements. A harder routine has a higher ceiling.</p></div>
          <div class="score"><div class="pts">E</div><h3>Execution score</h3><p>Starts at 10.0. Judges take away points for every bent knee, wobble, step, and fall. The highest and lowest judges' scores are dropped and the rest averaged.</p></div>
          <div class="score"><div class="pts">=</div><h3>Final score</h3><p>D-score plus E-score, minus any neutral penalties like stepping out of bounds or going over time. A typical top score is around 14 to 15.</p></div></div>`)
    + section("gy-ded","Deductions","The execution judges' main tools.",
        `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${DEDS.map(d => `<div class="score"><div class="pts" style="font-size:2.2rem">${d.n}</div><h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`)
    + section("gy-clock","The competition","Olympic and World Championship competitions run in rounds. Tap one to learn more.",
        `<div class="timeline" id="gyTimeline"></div><div class="infopanel" id="gyClockInfo" style="margin-top:14px" aria-live="polite"></div>`)
    + section("gy-tricky","Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="gyFlips"></div>`)
    + section("gy-words","Words you'll hear","",`<dl class="gloss" id="gyGloss"></dl>`)
    + section("gy-quiz","Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="gyQuiz" aria-live="polite"></div>`)
    + `<footer>Rules on this page follow the FIG Code of Points for artistic gymnastics, used at the Olympics and World Championships. US college (NCAA) gymnastics still scores out of a perfect 10.</footer></div>`;

  apparatus(); judgeGame();
  setupTimeline(document.getElementById("gyTimeline"), document.getElementById("gyClockInfo"), CLOCK,
    "Routines are short: about 90 seconds on beam and floor, under a minute on bars, and only a few seconds on vault.");
  flipCards(document.getElementById("gyFlips"), TRICKY);
  glossary(document.getElementById("gyGloss"), WORDS);
  makeQuiz(document.getElementById("gyQuiz"), QUIZ, [
    "A perfect routine! Watch a competition and try to spot each deduction before the score comes up.",
    "Nearly stuck. Judge another routine and the deduction sizes will become second nature.",
    "Look over the deductions and the scoring cards again, then come back for another try.",
    "No worries. Start with the apparatus and judge one routine, then try again."]);
}

SPORT_PAGES["gymnastics"] = {render};
})();

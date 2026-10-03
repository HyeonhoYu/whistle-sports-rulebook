/* Darts. Rules follow standard 501 double-out play used by the PDC and WDF. */
(function(){
const ORDER = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
const R = {bull:6.35, obull:15.9, tin:99, tout:107, din:162, dout:170};
function boardSVG(){
  let s = `<circle r="200" fill="#111"/>`;
  const wedge = (r1, r2, a1, a2, fill) => { const p = (r,a) => `${(r*Math.cos(a)).toFixed(2)} ${(-r*Math.sin(a)).toFixed(2)}`; return `<path d="M${p(r1,a1)}L${p(r2,a1)}A${r2} ${r2} 0 0 0 ${p(r2,a2)}L${p(r1,a2)}A${r1} ${r1} 0 0 1 ${p(r1,a1)}Z" fill="${fill}"/>`; };
  ORDER.forEach((n,k) => { const c = (90 - k*18)*Math.PI/180, a1 = c + 9*Math.PI/180, a2 = c - 9*Math.PI/180, even = k%2 === 0;
    s += wedge(R.din, R.dout, a2, a1, even ? "#D9342B" : "#2F7546") + wedge(R.tout, R.din, a2, a1, even ? "#111" : "#EFE3C8") + wedge(R.tin, R.tout, a2, a1, even ? "#D9342B" : "#2F7546") + wedge(R.obull, R.tin, a2, a1, even ? "#111" : "#EFE3C8");
    s += `<text x="${(186*Math.cos(c)).toFixed(1)}" y="${(-186*Math.sin(c) + 6).toFixed(1)}" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="17" fill="#fff">${n}</text>`; });
  return s + `<circle r="${R.obull}" fill="#2F7546"/><circle r="${R.bull}" fill="#D9342B"/>`;
}
function hit(x, y){
  const d = Math.hypot(x, y); if(d > R.dout) return {v:0, label:"Miss", dbl:false};
  if(d <= R.bull) return {v:50, label:"Bullseye (50)", dbl:true}; if(d <= R.obull) return {v:25, label:"Outer bull (25)", dbl:false};
  const ang = Math.atan2(-y, x)*180/Math.PI, k = ((Math.round((90 - ang)/18) % 20) + 20) % 20, n = ORDER[k];
  if(d >= R.din) return {v:2*n, label:`Double ${n}`, dbl:true}; if(d >= R.tin && d <= R.tout) return {v:3*n, label:`Treble ${n}`, dbl:false};
  return {v:n, label:`${n}`, dbl:false};
}
function game(){
  const $ = id => document.getElementById(id); const svg = $("dtBoard"); let S;
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5)*1.4;
  const reset = () => { const start = [40,32,50,61,81,100,121,170][Math.floor(Math.random()*8)]; S = {left:start, turnStart:start, darts:0, total:0, done:false}; $("dtMarks").innerHTML = ""; $("dtMsg").textContent = `Checkout practice: ${start} left. You must finish exactly on zero with a double (or the bullseye).${start === 170 ? " 170 is the biggest possible checkout: treble 20, treble 20, bullseye." : ""}`; draw(); };
  function draw(){ $("dtLeft").textContent = S.left; $("dtDarts").textContent = `${3 - S.darts} dart${3 - S.darts === 1 ? "" : "s"} left this turn`; $("dtNew").hidden = !S.done; }
  svg.addEventListener("click", e => {
    if(S.done) return; const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse());
    const x = q.x + gauss()*9, y = q.y + gauss()*9, h = hit(x, y); S.darts++; S.total++;
    $("dtMarks").insertAdjacentHTML("beforeend", `<circle cx="${x}" cy="${y}" r="4" fill="#F2C230" stroke="#111" stroke-width="1.5"/>`);
    const rem = S.left - h.v; let msg = `${h.label}. `;
    if(rem === 0 && h.dbl){ S.left = 0; S.done = true; msg += `Checkout! You finished on a double with ${S.total} dart${S.total === 1 ? "" : "s"}.`; }
    else if(rem < 0 || rem === 1 || (rem === 0 && !h.dbl)){ msg += `Bust! ${rem === 0 ? "You hit zero, but not with a double." : rem === 1 ? "You can't finish from 1, since there's no double 0.5." : "You went below zero."} Your score goes back to ${S.turnStart} and the turn ends.`; S.left = S.turnStart; S.darts = 0; setTimeout(() => $("dtMarks").innerHTML = "", 900); }
    else { S.left = rem; msg += `${rem} left.`; if(S.darts === 3){ S.darts = 0; S.turnStart = S.left; msg += " That's three darts: end of the turn."; setTimeout(() => $("dtMarks").innerHTML = "", 900); } }
    $("dtMsg").textContent = msg; draw();
  });
  $("dtNew").addEventListener("click", reset); reset();
}
const svg = `<svg viewBox="-220 -220 440 440" role="img" aria-label="Dartboard" style="max-width:440px">${boardSVG()}
  <circle class="hz hzs" data-zone="double" r="166" style="stroke-width:10"/><circle class="hz hzs" data-zone="treble" r="103" style="stroke-width:10"/><circle class="hz" data-zone="bull" r="15"/>
  <circle class="hz hzs" data-zone="single" r="60" style="stroke-width:60"/><circle class="hz hzs" data-zone="numbers" r="186" style="stroke-width:24"/></svg>`;
const ZONES = {
  numbers:{title:"Number ring", text:"Twenty sections numbered in a scrambled order, with 20 at the top. Big numbers sit next to small ones (20 between 5 and 1) to punish near-misses."},
  double:{title:"Double ring", text:"The thin outer ring scores double the number. A game of 501 must finish on a double."},
  treble:{title:"Treble ring", text:"The thin inner ring scores triple. Treble 20 (60) is the highest single dart, so three of them, 180, is the maximum turn."},
  single:{title:"Singles", text:"The wide areas score the number of the section."},
  bull:{title:"Bull", text:"The outer bull (green) scores 25; the inner bullseye (red) scores 50 and counts as a double for finishing."}
};
SPORT_PAGES["darts"] = {render: app => sportPage(app, {id:"darts", p:"dt", name:"Darts", alt:"The tabby cat throwing a dart at a dartboard",
  lede:"Players throw three darts per turn at a round board, counting their scores down from 501. The first to reach exactly zero wins the leg, but the final dart must land in a double or the bullseye. Go below zero, or end on 1, and the turn is a bust.",
  facts:[["501","starting score"],["3","darts per turn"],["180","the maximum turn"],["2.37","meters from the throwing line"]],
  diagram:{title:"The board", svg, zones:ZONES, order:["numbers","double","treble","single","bull"], first:"treble", max:460},
  blocks:[{id:"play", title:"Check out", lede:"Click the board to throw. Your darts wobble a little, like the real thing. Finish exactly on zero with a double.",
    html:`<div class="oslab"><div class="fieldbox" style="display:flex;justify-content:center"><svg viewBox="-220 -220 440 440" id="dtBoard" style="max-width:440px;width:100%;cursor:crosshair" role="img" aria-label="Dartboard. Click to throw.">${boardSVG()}<g id="dtMarks"></g></svg></div>
      <div class="osside"><div class="board" style="grid-template-columns:1fr"><div class="dd"><small>Score left</small><b id="dtLeft"></b><small id="dtDarts"></small></div></div><div class="narrator"><img src="${img("head.webp")}" alt=""><p id="dtMsg"></p></div><div class="controls"><button class="btn primary" id="dtNew" type="button" hidden>New checkout</button></div></div></div>`, init:game},
    {id:"rules", title:"Key rules", html: cards([{big:"501", name:"Count down", text:"Each leg starts at 501. Every turn's score is subtracted."},{big:"Double", name:"Double out", text:"The winning dart must hit a double or the bullseye and leave exactly zero."},{big:"Bust", name:"Bust", text:"Going below zero, leaving 1, or reaching zero without a double cancels the whole turn."},{big:"Legs", name:"Legs and sets", text:"A leg is one game of 501. Matches are best of a number of legs, or of sets made of legs."}])}],
  tricky:[["Why can't you finish on 1?","You need a double to finish, and there's no double worth 1."],["What's a nine-darter?","Finishing 501 in the minimum nine darts, darts' perfect game, for example 180, 180, then treble 20, treble 19, double 12."],["Why is 20 at the top?","Tradition. The scrambled order around it means a slightly wide 20 lands in a 1 or a 5."],["Do darts that bounce out count?","No. A dart must stay in the board to score."]],
  words:[["Oche","The throwing line, pronounced 'ockey'."],["Leg","One game of 501."],["Ton","A score of 100 or more in one turn."],["Bust","Going past zero or leaving 1."],["Checkout","Finishing a leg."],["Bed","A section of the board, like the treble 20 bed."]],
  quiz:[{q:"What score does a leg start from?",o:["101","301","501","1001"],a:2,why:"501."},{q:"How many darts per turn?",o:["1","2","3","5"],a:2,why:"Three."},{q:"What must the final dart hit?",o:["Any number","A treble","A double or the bullseye","The outer bull"],a:2,why:"A double."},{q:"What's the highest score in one turn?",o:["150","170","180","200"],a:2,why:"Three treble 20s: 180."},{q:"You have 32 left and hit double 16. What happens?",o:["Bust","You win the leg","You need another double","Nothing"],a:1,why:"Double 16 is 32: checkout."},{q:"You have 10 left and hit single 9. What happens?",o:["You win","Bust: you can't finish from 1","You score 9","Reset to 501"],a:1,why:"Leaving 1 is a bust."},{q:"What does the inner bullseye score?",o:["25","50","60","100"],a:1,why:"Fifty."},{q:"What number is at the top of the board?",o:["1","10","20","5"],a:2,why:"Twenty."},{q:"What's a ton?",o:["100 or more in a turn","A missed dart","A nine-dart finish","The bull"],a:0,why:"100 or more."},{q:"What's the biggest possible checkout?",o:["160","170","180","200"],a:1,why:"170: treble 20, treble 20, bullseye."}],
  footer:"Rules on this page follow standard 501 double-out play used in professional darts."})};
})();

/* Surfing. Rules follow the ISA and WSL judging format. */
(function(){
const svg = `<svg viewBox="0 0 800 320" role="img" aria-label="Surfing lineup from the side and above"><rect width="800" height="320" fill="#9CC7EE"/><rect y="120" width="800" height="200" fill="#3C8DC4"/><path d="M0 280Q400 250 800 290V320H0Z" fill="#E6CF94"/>
  <path d="M120 160Q260 70 340 160" fill="#2F6FD6" stroke="#EEF3EC" stroke-width="4"/><path d="M340 160Q420 120 520 165" fill="#4A99CF" stroke="#EEF3EC" stroke-width="3"/>
  ${[[200,150],[600,150],[660,140]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="5" fill="#F7A23B"/>`).join("")}<circle cx="720" cy="132" r="10" fill="#F2C230"/><path d="M720 142v14" stroke="#18221D" stroke-width="2"/>
  <rect x="60" y="20" width="110" height="40" rx="6" fill="#2B3831"/><text x="115" y="46" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="18" fill="#F2C230">Priority</text>
  <rect class="hz" data-zone="peak" x="230" y="70" width="110" height="70"/><rect class="hz" data-zone="face" x="130" y="100" width="100" height="60"/><rect class="hz" data-zone="shoulder" x="340" y="120" width="180" height="50"/>
  <rect class="hz" data-zone="lineup" x="560" y="120" width="140" height="50"/><circle class="hz" data-zone="buoy" cx="720" cy="140" r="18"/><rect class="hz" data-zone="board" x="56" y="16" width="118" height="48"/><rect class="hz" data-zone="beach" x="0" y="270" width="800" height="50"/></svg>`;
const ZONES = {
  peak:{title:"The peak", text:"The highest point of the wave, where it starts breaking. The surfer closest to it, called on the inside, normally has the right of way."},
  face:{title:"Wave face", text:"The steep, unbroken part where surfers do turns, airs, and barrels."},
  shoulder:{title:"Shoulder", text:"The flatter, unbroken part of the wave farther from the peak."},
  lineup:{title:"Lineup", text:"Where surfers wait for waves, beyond where they break."},
  buoy:{title:"Contest buoys", text:"Mark the competition area. Waves ridden outside it may not score."},
  board:{title:"Priority board", text:"In two-person heats, a priority system decides who gets first pick of waves. Once the priority surfer catches a wave, priority passes to the other surfer."},
  beach:{title:"Beach and judges' tower", text:"Judges watch from a tower on the beach and score every wave."}
};
function heat(){
  const $ = id => document.getElementById(id); let S;
  const reset = () => { S = {mine:[], rival:[], left:6, over:false}; $("sfMsg").textContent = "A 20-minute heat against one rival. Each wave is scored out of 10, and only your best two count. You have time for about six waves: choose which ones to ride."; draw(); };
  const ride = (kind) => { const r = Math.random(); if(kind === 2) return r < .45 ? +(1 + Math.random()*2).toFixed(2) : +(7 + Math.random()*2.9).toFixed(2); if(kind === 1) return r < .2 ? +(1.5 + Math.random()*2).toFixed(2) : +(5 + Math.random()*2.5).toFixed(2); return +(3 + Math.random()*2).toFixed(2); };
  const top2 = a => a.slice().sort((x,y) => y - x).slice(0,2);
  const sum = a => +top2(a).reduce((x,y) => x + y, 0).toFixed(2);
  function go(kind){
    if(S.over) return; const s = ride(kind); S.mine.push(s); S.rival.push(ride(Math.random() < .25 ? 2 : 1)); S.left--;
    let msg = `${["A small wave","A solid wave","A big, risky wave"][kind]}: judges give you ${s.toFixed(2)}${kind === 2 && s < 4 ? ". You fell on the big move" : ""}. `;
    msg += `Your best two now add to ${sum(S.mine).toFixed(2)}. ${S.left ? "" : ""}`;
    if(S.left === 0){ S.over = true; const a = sum(S.mine), b = sum(S.rival); msg += `Horn! Final: you ${a.toFixed(2)}, rival ${b.toFixed(2)}. ${a > b ? "You win the heat and advance!" : a < b ? "Your rival advances." : "Tied: the higher single wave breaks the tie."}`; }
    else { const need = +(top2(S.rival).reduce((x,y) => x + y, 0) - (top2(S.mine)[0] || 0)).toFixed(2); if(sum(S.rival) > sum(S.mine)) msg += `You need a ${Math.max(0, need + .01).toFixed(2)} to take the lead.`; }
    $("sfMsg").textContent = msg; draw();
  }
  function draw(){
    const row = (a, n) => { const t = top2(a); let used = t.slice(); return `<tr><th>${n}</th>${a.map(v => { const k = used.indexOf(v); const c = k >= 0 ? (used.splice(k,1), "tot") : ""; return `<td class="${c}">${v.toFixed(2)}</td>`; }).join("")}<td class="tot">${sum(a).toFixed(2)}</td></tr>`; };
    $("sfTab").innerHTML = `<table class="bxcard"><thead><tr><th></th>${Array.from({length:6}, (_,i) => `<th>Wave ${i+1}</th>`).join("")}<th>Best two</th></tr></thead><tbody>${row(S.mine,"You")}${row(S.rival,"Rival")}</tbody></table>`;
    document.querySelectorAll("[data-sf]").forEach(b => b.hidden = S.over); $("sfNew").hidden = !S.over;
  }
  document.querySelectorAll("[data-sf]").forEach(b => b.addEventListener("click", () => go(+b.dataset.sf)));
  $("sfNew").addEventListener("click", reset); reset();
}
SPORT_PAGES["surfing"] = {render: app => sportPage(app, {id:"surfing", p:"sf", name:"Surfing", alt:"The tabby cat riding a wave on a surfboard",
  lede:"Surfers compete in heats of two to four, riding as many waves as they like within a time limit. Judges score each wave from 0 to 10, and each surfer's best two waves are added up. Highest total wins the heat.",
  facts:[["10","points per wave at most"],["2","best waves count"],["20","out of 20: the perfect heat"],["5","judges per wave"]],
  diagram:{title:"The lineup", svg, zones:ZONES, order:["peak","face","shoulder","lineup","buoy","board","beach"], first:"peak"},
  blocks:[{id:"heat", title:"Surf a heat", lede:"Pick small, solid, or big waves. Big waves score high if you land your moves, but you might fall. Only your best two count, highlighted in yellow.", html:`<div class="cardwrap" id="sfTab"></div><div class="controls" style="margin-top:12px"><button class="btn" data-sf="0" type="button">Small wave</button><button class="btn" data-sf="1" type="button">Solid wave</button><button class="btn" data-sf="2" type="button">Big wave</button><button class="btn primary" id="sfNew" type="button" hidden>New heat</button></div><div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="sfMsg"></p></div>`, init:heat},
    {id:"judging", title:"What judges reward", html: cards([{name:"Commitment and difficulty", text:"Going for the most critical part of the wave."},{name:"Innovative maneuvers", text:"Airs, big turns, and new moves."},{name:"Variety", text:"A mix of different maneuvers on one wave."},{name:"Speed, power, and flow", text:"Linking moves smoothly at high speed."},{big:"Half", name:"Interference", text:"Dropping in on a surfer with right of way costs you: your second-best wave counts only half."}], 220)}],
  tricky:[["Why only two waves?","It rewards quality over quantity. One great ride can carry a whole heat."],["What's dropping in?","Taking off on a wave someone with right of way is already riding. It's an interference penalty."],["How are wave scores calculated?","Five judges score each wave; the highest and lowest are dropped and the middle three averaged."],["What's an excellent score?","Judges use 8 to 10 for excellent rides. A perfect 10 is a near-flawless wave."]],
  words:[["Heat","A timed contest between 2 to 4 surfers."],["Priority","The right to choose waves first."],["Barrel","Riding inside the curling wave."],["Air","Launching above the wave."],["Drop in","Taking a wave someone else has priority on."],["Combo","Needing two new wave scores to take the lead."]],
  quiz:[{q:"How many waves count toward a surfer's score?",o:["1","2","3","All"],a:1,why:"The best two."},{q:"What's the top score for one wave?",o:["5","10","20","100"],a:1,why:"Ten."},{q:"What's the highest possible heat total?",o:["10","20","30","100"],a:1,why:"Two perfect 10s: 20."},{q:"What is priority?",o:["The fastest surfer","The right to pick waves first","A type of turn","The final"],a:1,why:"First pick of waves."},{q:"What happens if you drop in on someone?",o:["Nothing","An interference penalty","Bonus points","Disqualification always"],a:1,why:"Interference halves your second wave."},{q:"How many judges score a wave?",o:["3","5","7","9"],a:1,why:"Five, with high and low dropped."},{q:"Can surfers ride as many waves as they want in a heat?",o:["Yes, within the time limit","No, only two"],a:0,why:"As many as they like."},{q:"What's a barrel?",o:["A fall","Riding inside the curling wave","A buoy","The judges' tower"],a:1,why:"Riding in the tube."},{q:"What's a heat?",o:["A timed contest of 2 to 4 surfers","The water temperature","A big wave","The final only"],a:0,why:"A timed contest."},{q:"Your best waves are 7.5 and 6.0. The rival has 8.0 and 6.5. What do you need on one more wave to lead?",o:["More than 7.0","More than 8.5","More than 14.5","More than 6.0"],a:0,why:"Replacing your 6.0: 7.5 + x > 14.5, so x > 7.0."}],
  footer:"Rules on this page follow the ISA and WSL judging format, used at the Olympics and on the professional tour."})};
})();

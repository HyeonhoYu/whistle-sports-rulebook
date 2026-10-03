/* Shared building blocks used by every sport page. */

window.SPORT_PAGES = window.SPORT_PAGES || {};

/* Timers and animation loops started by a page are stopped when you leave it. */
(function(){
  const timers = new Set(), si = window.setInterval.bind(window), st = window.setTimeout.bind(window), raf = window.requestAnimationFrame.bind(window);
  let token = 0;
  window.setInterval = (f, t, ...a) => { const id = si(f, t, ...a); timers.add(id); return id; };
  window.setTimeout = (f, t, ...a) => { const id = st(f, t, ...a); timers.add(id); return id; };
  window.requestAnimationFrame = cb => { const my = token; return raf(ts => { if(my === token) cb(ts); }); };
  window.__clearPageTimers = () => { timers.forEach(id => { clearInterval(id); clearTimeout(id); }); timers.clear(); token++; };
})();

/* Image paths. A single-file build can override these with window.INLINE_IMGS. */
function img(name){ return (window.INLINE_IMGS && window.INLINE_IMGS[name]) || `assets/img/${name}`; }
function catImg(id){ return img(`cats/${id}.webp`); }
const pickOne = arr => arr[Math.floor(Math.random()*arr.length)];
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));

/* Stick-figure referee. `arms` is extra SVG drawn on top of head, body and legs. */
function fig(arms){
  return `<svg viewBox="0 -14 100 134" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="50" cy="22" r="10"/><path d="M50 32v43M50 75l-12 38M50 75l12 38"/><path d="M42 34h16" stroke-width="3" opacity=".5"/>${arms}</svg>`;
}

/* Page header with title, intro, character image and four key numbers. */
function sportHero({id, name, lede, facts, alt}){
  return `<div class="wrap"><a class="back" href="#/">All sports</a>
    <div class="sport-hero"><div><h1>${name}</h1><p class="lede">${lede}</p></div>
      <img class="heroimg" src="${catImg(id)}" alt="${alt}">
      <div class="facts">${facts.map(([n,t]) => `<div><b>${n}</b><span>${t}</span></div>`).join("")}</div>
    </div></div>`;
}
function jumpNav(items){
  return `<nav class="jump" aria-label="On this page"><div class="wrap" style="display:flex;gap:6px;flex-wrap:wrap;padding:0 20px">
    ${items.map(([id,label]) => `<a href="#${id}">${label}</a>`).join("")}</div></nav>`;
}
function section(id, title, lede, body){
  return `<section class="block" id="${id}"><h2>${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ""}${body}</section>`;
}

/* Tap-to-explain diagram. Hit areas carry class "hz" and data-zone. */
function setupZones(diagram, chipsEl, infoEl, zones, order, first){
  chipsEl.innerHTML = order.map(z => `<button type="button" class="chip" aria-pressed="false" data-zone="${z}">${zones[z].chip || zones[z].title}</button>`).join("");
  diagram.querySelectorAll(".hz").forEach(r => { r.setAttribute("tabindex","0"); r.setAttribute("role","button"); r.setAttribute("aria-label", zones[r.dataset.zone].title); });
  const pick = z => {
    diagram.querySelectorAll(".hz").forEach(r => r.classList.toggle("on", r.dataset.zone === z));
    chipsEl.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.zone === z));
    infoEl.innerHTML = `<h3>${zones[z].title}</h3><p>${zones[z].text}</p>`;
  };
  diagram.addEventListener("click", e => { const r = e.target.closest(".hz"); if(r) pick(r.dataset.zone); });
  diagram.addEventListener("keydown", e => { const r = e.target.closest(".hz"); if(r && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); pick(r.dataset.zone); } });
  chipsEl.addEventListener("click", e => { const c = e.target.closest(".chip"); if(c) pick(c.dataset.zone); });
  pick(first);
}

/* Clickable game timeline. Segment: {k, cls:"q|half|ot", t, s, mark, info:[title,text]} */
function setupTimeline(el, infoEl, segs, footnote){
  el.innerHTML = segs.map(c => `<button type="button" class="seg ${c.cls}" data-k="${c.k}"><b>${c.t}</b><span>${c.s}</span>${c.mark ? '<span class="tmw" aria-hidden="true"></span>' : ""}</button>`).join("");
  const pick = k => {
    const c = segs.find(x => x.k === k);
    el.querySelectorAll(".seg").forEach(b => { b.classList.toggle("on", b.dataset.k === k); b.setAttribute("aria-pressed", b.dataset.k === k); });
    infoEl.innerHTML = `<h3>${c.info[0]}</h3><p>${c.info[1]}</p>${footnote ? `<p class="note" style="margin-top:8px">${footnote}</p>` : ""}`;
  };
  el.addEventListener("click", e => { const b = e.target.closest(".seg"); if(b) pick(b.dataset.k); });
  pick(segs[0].k);
}

function flipCards(el, items){
  el.innerHTML = items.map(([q,a]) => `<button type="button" class="flip" aria-pressed="false"><div class="inner"><div class="face front"><h3>${q}</h3><span>Tap to see the answer</span></div><div class="face back"><p>${a}</p></div></div></button>`).join("");
  el.addEventListener("click", e => { const f = e.target.closest(".flip"); if(!f) return; f.classList.toggle("on"); f.setAttribute("aria-pressed", f.classList.contains("on")); });
}
function glossary(el, words){
  el.innerHTML = words.map(([t,d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join("");
}

/* Quiz engine. Question: {q, o:[4 options], a:index, why, visual?: () => html} */
const QUIZ_RIGHT = ["Good call!","Right on the money.","That's the call.","Nailed it.","You've got a ref's eye."];
const QUIZ_WRONG = ["Flag on the play.","Not quite.","Let's review that one.","Close, but no."];
function makeQuiz(el, bank, endTips){
  let order, i, results;
  const start = () => { order = bank.map((_,k) => k).sort(() => Math.random() - .5); i = 0; results = []; show(); };
  const track = () => `<div class="qtrack" aria-hidden="true">${order.map((_,k) => `<i class="${k < results.length ? (results[k] ? "ok" : "no") : k === i ? "now" : ""}"></i>`).join("")}</div>`;
  function show(){
    const Q = bank[order[i]];
    el.innerHTML = track() + `<div class="qbody"><div class="qcount">Question ${i+1} of ${order.length}</div><h3>${Q.q}</h3>${Q.visual ? `<div class="qvisual">${Q.visual()}</div>` : ""}
      <div class="qopts">${Q.o.map((t,k) => `<button type="button" class="qopt" data-k="${k}"><b>${"ABCD"[k]}</b><span>${t}</span></button>`).join("")}</div><div class="qfeed"></div></div>`;
    el.querySelectorAll(".qopt").forEach(b => b.addEventListener("click", () => answer(+b.dataset.k)));
  }
  function answer(k){
    const Q = bank[order[i]], ok = k === Q.a; results.push(ok);
    el.querySelectorAll(".qopt").forEach(b => { b.disabled = true; const n = +b.dataset.k; if(n === Q.a) b.classList.add("right"); else if(n === k) b.classList.add("wrong"); });
    el.querySelector(".qtrack").outerHTML = track();
    const last = i === order.length - 1;
    el.querySelector(".qfeed").innerHTML = `<div class="narrator"><img src="${img("head.webp")}" alt=""><div><strong>${pickOne(ok ? QUIZ_RIGHT : QUIZ_WRONG)}</strong><p>${Q.why}</p></div></div>
      <button type="button" class="btn primary qnext">${last ? "See my score" : "Next question"}</button>`;
    const nx = el.querySelector(".qnext"); nx.focus({preventScroll:true});
    nx.addEventListener("click", () => { if(last) end(); else { i++; show(); } });
  }
  function end(){
    const score = results.filter(Boolean).length, n = results.length;
    const [title,msg] = score === n ? ["Perfect game!", endTips[0]]
      : score >= n*.7 ? ["Strong showing.", endTips[1]]
      : score >= n*.4 ? ["Getting there.", endTips[2]]
      : ["Rookie season.", endTips[3]];
    el.innerHTML = track() + `<div class="qend"><img src="${img("referee.webp")}" alt="The referee cat waving"><div>
      <div class="big">${score}<small> / ${n}</small></div><h3>${title}</h3><p>${msg}</p>
      <button type="button" class="btn primary qagain">Take the quiz again</button></div></div>`;
    el.querySelector(".qagain").addEventListener("click", start);
  }
  start();
}

/* ---------- Standard page builder ----------
   cfg: {id, name, alt, lede, facts, p (id prefix), diagram:{title, lede, svg, zones, order, first, max},
         blocks:[{id, nav, title, lede, html, init}], clock:{segs, foot}, tricky, words, quiz, tips, footer} */
function sportPage(app, c){
  const p = c.p, blocks = c.blocks || [];
  const nav = [];
  if(c.diagram) nav.push([`${p}-dia`, c.diagram.nav || c.diagram.title]);
  blocks.forEach(b => nav.push([`${p}-${b.id}`, b.nav || b.title]));
  if(c.clock) nav.push([`${p}-clock`, c.clock.nav || "The event"]);
  nav.push([`${p}-tricky`,"Tricky rules"],[`${p}-words`,"Words you'll hear"],[`${p}-quiz`,"Quiz"]);
  let html = sportHero({id:c.id, name:c.name, lede:c.lede, facts:c.facts, alt:c.alt}) + jumpNav(nav) + `<div class="wrap">`;
  if(c.diagram) html += section(`${p}-dia`, c.diagram.title, c.diagram.lede || "Tap any part to see what it does.",
    `<div class="fieldbox" id="${p}Dia"${c.diagram.max ? ` style="max-width:${c.diagram.max}px"` : ""}>${c.diagram.svg}</div><div class="fieldrow"><div class="zonechips" id="${p}DiaChips"></div><div class="infopanel" id="${p}DiaInfo" aria-live="polite"></div></div>`);
  blocks.forEach(b => html += section(`${p}-${b.id}`, b.title, b.lede || "", b.html));
  if(c.clock) html += section(`${p}-clock`, c.clock.title || "The event", c.clock.lede || "Tap a stage to learn more.", `<div class="timeline" id="${p}Timeline"></div><div class="infopanel" id="${p}ClockInfo" style="margin-top:14px" aria-live="polite"></div>`);
  html += section(`${p}-tricky`,"Tricky rules","The questions new fans ask most. Tap a card to flip it.",`<div class="flips" id="${p}Flips"></div>`)
    + section(`${p}-words`,"Words you'll hear","",`<dl class="gloss" id="${p}Gloss"></dl>`)
    + section(`${p}-quiz`,"Check what you learned","Ten quick questions. You'll see the right answer and why after each one.",`<div class="quiz" id="${p}Quiz" aria-live="polite"></div>`)
    + `<footer>${c.footer}</footer></div>`;
  app.innerHTML = html;
  const $ = id => document.getElementById(id);
  if(c.diagram) setupZones($(`${p}Dia`), $(`${p}DiaChips`), $(`${p}DiaInfo`), c.diagram.zones, c.diagram.order, c.diagram.first);
  blocks.forEach(b => b.init && b.init());
  if(c.clock) setupTimeline($(`${p}Timeline`), $(`${p}ClockInfo`), c.clock.segs, c.clock.foot);
  flipCards($(`${p}Flips`), c.tricky); glossary($(`${p}Gloss`), c.words);
  makeQuiz($(`${p}Quiz`), c.quiz, c.tips || ["A perfect score! Watch an event and put your new knowledge to work.","Strong result. Try the interactive section once more to lock it in.","Look over the diagram and the cards again, then come back for another try.","No worries. Start with the diagram and the interactive section, then try again."]);
}
const cards = (items, min = 230) => `<div class="scoring" style="grid-template-columns:repeat(auto-fill,minmax(${min}px,1fr))">${items.map(d => `<div class="score">${d.art || ""}${d.big !== undefined ? `<div class="pts"${String(d.big).length > 4 ? ' style="font-size:1.7rem"' : ""}>${d.big}</div>` : ""}<h3>${d.name}</h3><p>${d.text}</p></div>`).join("")}</div>`;

/* ---------- Scenario judge: read a situation, make the call ---------- */
function scenarioJudge(id, list){
  return {
    html: `<div class="rtpanel" style="text-align:left"><small id="${id}N" style="color:#A9B8AE"></small><p id="${id}T" style="color:#EEF3EC;font-size:1.2rem;font-weight:600;margin:6px 0 14px"></p><div class="controls" id="${id}B"></div></div>
      <div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="${id}M">Make the call.</p></div>
      <div class="controls" style="margin-top:10px"><button class="btn primary" id="${id}Next" type="button">Next situation</button></div>`,
    init(){
      const $ = x => document.getElementById(x); let i = 0, right = 0, done = 0;
      const show = () => { const s = list[i]; $(`${id}N`).textContent = `Situation ${i+1} of ${list.length}`; $(`${id}T`).textContent = s.t; $(`${id}M`).textContent = "Make the call.";
        $(`${id}B`).innerHTML = s.o.map((o,k) => `<button class="btn" type="button" data-k="${k}">${o}</button>`).join("");
        $(`${id}B`).querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
          if($(`${id}B`).dataset.done === String(i)) return; $(`${id}B`).dataset.done = String(i);
          const ok = +b.dataset.k === s.a; done++; if(ok) right++;
          $(`${id}B`).querySelectorAll("button").forEach(x => { x.disabled = true; if(+x.dataset.k === s.a) x.classList.add("primary"); });
          $(`${id}M`).textContent = `${ok ? "Good call!" : "Not quite."} ${s.w} (${right} of ${done} right so far.)`; })); };
      $(`${id}Next`).addEventListener("click", () => { i = (i + 1) % list.length; show(); }); show();
    }
  };
}

/* ---------- Attempts game for height events (high jump, pole vault) ---------- */
function attemptsGame(id, heights, unit, rivals, you){
  return {
    html: `<div class="cardwrap" id="${id}Tab"></div>
      <div class="controls" style="margin-top:12px"><button class="btn primary" id="${id}J" type="button">Jump</button><button class="btn" id="${id}P" type="button">Pass this height</button><button class="btn primary" id="${id}New" type="button" hidden>New competition</button></div>
      <div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="${id}M"></p></div>`,
    init(){
      const $ = x => document.getElementById(x); const names = ["You", ...rivals.map(r => r.n)], skill = [you, ...rivals.map(r => r.s)];
      let S;
      const reset = () => { S = {h:0, rec: names.map(() => []), out: names.map(() => false), tries: names.map(() => 0), best: names.map(() => -1), over:false}; $(`${id}M`).textContent = `The bar starts at ${heights[0].toFixed(2)} ${unit}. You get three tries at each height. Three misses in a row and you're out.`; draw(); };
      const pClear = (k, h) => Math.max(.04, Math.min(.96, .55 + (skill[k] - heights[h])*7));
      function runRivals(){ for(let k=1;k<names.length;k++){ if(S.out[k]) continue; let rec = ""; for(let t=0;t<3;t++){ if(Math.random() < pClear(k, S.h)){ rec += "O"; S.best[k] = S.h; break; } rec += "X"; }
          S.rec[k][S.h] = rec; if(rec === "XXX") S.out[k] = true; } }
      function jumpYou(pass){
        if(S.over) return; let msg;
        if(pass){ S.rec[0][S.h] = (S.rec[0][S.h] || "") + "-"; msg = `You pass ${heights[S.h].toFixed(2)} ${unit}, saving energy. Any misses you already had here still count toward three in a row.`; advance(msg); return; }
        const cur = S.rec[0][S.h] || "", ok = Math.random() < pClear(0, S.h); S.rec[0][S.h] = cur + (ok ? "O" : "X");
        const streak = (S.rec[0].join("").replace(/-/g,"").match(/X*$/) || [""])[0].length;
        if(ok){ S.best[0] = S.h; advance(`Cleared ${heights[S.h].toFixed(2)} ${unit}${cur.length ? ` on attempt ${cur.length + 1}` : " on the first try"}!`); return; }
        if(streak >= 3){ S.out[0] = true; advance(`Third miss in a row: you're out. Your best clearance counts.`); return; }
        if(S.rec[0][S.h].replace(/-/g,"").length >= 3){ S.out[0] = true; advance("Three misses: you're out."); return; }
        $(`${id}M`).textContent = `Miss at ${heights[S.h].toFixed(2)} ${unit}. Try again, or pass to the next height and use your remaining tries there.`; draw();
      }
      function advance(msg){
        runRivals();
        const alive = names.map((_,k) => !S.out[k] && S.rec[k][S.h] !== undefined && (S.rec[k][S.h].includes("O") || S.rec[k][S.h].includes("-")));
        if(S.h === heights.length - 1 || alive.filter(Boolean).length <= 1 && S.out[0]){ finish(msg); return; }
        if(S.out[0]){ while(S.h < heights.length - 1 && names.some((_,k) => k && !S.out[k])){ S.h++; runRivals(); } finish(msg); return; }
        S.h++; $(`${id}M`).textContent = `${msg} The bar goes up to ${heights[S.h].toFixed(2)} ${unit}.`; draw();
      }
      function finish(msg){
        S.over = true;
        const fails = k => S.rec[k].join("").replace(/[O-]/g,"").length, atBest = k => S.best[k] < 0 ? 9 : (S.rec[k][S.best[k]] || "").replace(/-/g,"").length;
        const order = names.map((_,k) => k).sort((a,b) => (S.best[b] - S.best[a]) || (atBest(a) - atBest(b)) || (fails(a) - fails(b)));
        const pl = order.indexOf(0) + 1, top = order[0], tied = order.length > 1 && S.best[order[1]] === S.best[top];
        $(`${id}M`).textContent = `${msg} Final: ${top === 0 ? "you win" : names[top] + " wins"}${S.best[top] >= 0 ? ` at ${heights[S.best[top]].toFixed(2)} ${unit}` : ""}. ${tied ? "Two athletes cleared the same height, so countback decided it: fewer misses at that height, then fewer misses overall." : ""} You finish ${["1st","2nd","3rd","4th","5th"][pl-1]}.`;
        draw();
      }
      function draw(){
        const upto = Math.min(heights.length, S.h + 1);
        $(`${id}Tab`).innerHTML = `<table class="bxcard"><thead><tr><th></th>${heights.slice(0, upto).map((h,i) => `<th class="${i === S.h && !S.over ? "now" : ""}">${h.toFixed(2)}</th>`).join("")}<th>Best</th></tr></thead><tbody>${names.map((n,k) => `<tr class="${k ? "" : "you"}"><th>${n}</th>${heights.slice(0, upto).map((_,i) => `<td>${S.rec[k][i] || ""}</td>`).join("")}<td class="tot">${S.best[k] >= 0 ? heights[S.best[k]].toFixed(2) : (S.out[k] ? "NM" : "")}</td></tr>`).join("")}</tbody></table>`;
        $(`${id}J`).hidden = $(`${id}P`).hidden = S.over || S.out[0]; $(`${id}New`).hidden = !S.over;
      }
      $(`${id}J`).addEventListener("click", () => jumpYou(false)); $(`${id}P`).addEventListener("click", () => jumpYou(true)); $(`${id}New`).addEventListener("click", reset); reset();
    }
  };
}

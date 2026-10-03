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

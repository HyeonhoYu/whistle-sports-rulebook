/* Home page: hero, filters, and sport cards. Filter choices persist while moving between pages. */
const filterState = {}; FILTERS.forEach(f => filterState[f.key] = new Set());

function renderHome(app){
  app.innerHTML = `<div class="wrap">
    <div class="home-hero">
      <div><h1>Know what you're watching.</h1>
        <p class="lede">Plain-language rules for ${SPORTS.length} sports, with diagrams you can tap. Narrow the list any way you like: pick options from as many groups as you want.</p></div>
      <figure class="ref"><img src="${img("referee.webp")}" alt="An orange tabby cat in a striped referee shirt, waving and holding a whistle">
        <figcaption class="bubble">Pick a sport. I'll explain every call.</figcaption></figure>
    </div>
    <div class="filters" id="filters">${FILTERS.map(f => `
      <div class="fgroup"><h3>${f.label}</h3><div class="chips">
        ${f.options.map(([v,l]) => `<button type="button" class="chip" aria-pressed="${filterState[f.key].has(v)}" data-k="${f.key}" data-v="${v}">${l}</button>`).join("")}
      </div></div>`).join("")}</div>
    <div class="resultbar"><span id="count"></span><button class="linkbtn" id="clear" type="button">Clear all filters</button></div>
    <div class="grid" id="grid"></div>
  </div>`;
  const filtersEl = app.querySelector("#filters");
  filtersEl.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if(!b) return;
    const s = filterState[b.dataset.k];
    s.has(b.dataset.v) ? s.delete(b.dataset.v) : s.add(b.dataset.v);
    b.setAttribute("aria-pressed", s.has(b.dataset.v));
    renderGrid();
  });
  app.querySelector("#clear").addEventListener("click", () => {
    FILTERS.forEach(f => filterState[f.key].clear());
    filtersEl.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed","false"));
    renderGrid();
  });
  renderGrid();
}

function renderGrid(){
  const list = SPORTS.filter(s => FILTERS.every(f => filterState[f.key].size === 0 || s[f.key].some(v => filterState[f.key].has(v))));
  const active = FILTERS.some(f => filterState[f.key].size);
  document.getElementById("clear").hidden = !active;
  document.getElementById("count").textContent = active ? `Showing ${list.length} of ${SPORTS.length} sports` : `All ${SPORTS.length} sports`;
  const grid = document.getElementById("grid");
  if(!list.length){ grid.innerHTML = `<p class="empty">No sport matches every filter you picked. Remove one or two options to widen the list.</p>`; return; }
  grid.innerHTML = list.map(s => {
    const live = !!SPORT_PAGES[s.id];
    const inner = `<img class="cardimg" src="${catImg(s.id)}" alt="" loading="lazy">
      <h3>${s.name}</h3><p class="blurb">${s.blurb}</p><div class="fact">${s.fact}</div>
      <div class="status">${live ? "Read the rules" : "Rules page in progress"}</div>`;
    return live ? `<a class="card live" href="#/${s.id}">${inner}</a>` : `<div class="card">${inner}</div>`;
  }).join("");
}

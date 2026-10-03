/* Router. Pages live at #/ (home) and #/<sport-id>. Links like #s-quiz jump within a page. */
const app = document.getElementById("app");
let current = null;

function route(){
  const h = location.hash;
  if(h && !h.startsWith("#/")) return;            // in-page jump, not a route
  const id = h.slice(2);
  const page = SPORT_PAGES[id];
  const key = page ? id : "home";
  if(key === current) return;
  current = key;
  if(window.__clearPageTimers) window.__clearPageTimers();
  if(page){ page.render(app); if(window.decorateRefs) decorateRefs(app); const s = SPORTS.find(x => x.id === id); document.title = `${s ? s.name : id} rules | Whistle`; }
  else { renderHome(app); document.title = "Whistle: Rules Made Easy"; }
  window.scrollTo(0, 0);
}

/* On-page jump links scroll smoothly and keep the route in the address bar. */
app.addEventListener("click", e => {
  const a = e.target.closest(".jump a"); if(!a) return;
  e.preventDefault();
  const target = document.querySelector(a.getAttribute("href"));
  if(target) target.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
});

window.addEventListener("hashchange", route);
route();

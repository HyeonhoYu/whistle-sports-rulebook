/* Marathon. Rules follow World Athletics road running rules. */
(function(){
const svg = `<svg viewBox="0 0 800 300" role="img" aria-label="A marathon course, simplified"><rect width="800" height="300" fill="#2F7546"/>
  <path d="M60 240C160 240 160 80 280 80S420 220 520 200S680 60 740 120" fill="none" stroke="#7A8C81" stroke-width="22" stroke-linecap="round"/><path d="M60 240C160 240 160 80 280 80S420 220 520 200S680 60 740 120" fill="none" stroke="#F4F6F1" stroke-width="2" stroke-dasharray="6 8"/>
  <rect x="30" y="220" width="40" height="40" fill="#2B3831"/><text x="50" y="280" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#fff">Start</text>
  <rect x="725" y="96" width="30" height="46" fill="#F2C230"/><text x="740" y="170" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#fff">Finish</text>
  ${[[200,150],[360,150],[520,200],[640,95]].map(([x,y]) => `<circle cx="${x}" cy="${y - 30}" r="10" fill="#2F6FD6" stroke="#fff" stroke-width="2"/>`).join("")}${[[280,80],[460,212]].map(([x,y]) => `<rect x="${x - 4}" y="${y - 14}" width="8" height="28" fill="#D9342B"/>`).join("")}
  <rect class="hz" data-zone="start" x="26" y="216" width="48" height="48"/><rect class="hz" data-zone="finish" x="720" y="92" width="40" height="54"/>
  ${[[200,150],[360,150],[520,200],[640,95]].map(([x,y]) => `<circle class="hz" data-zone="water" cx="${x}" cy="${y - 30}" r="14"/>`).join("")}${[[280,80],[460,212]].map(([x,y]) => `<rect class="hz" data-zone="mats" x="${x - 10}" y="${y - 18}" width="20" height="36"/>`).join("")}
  <path class="hz hzs" data-zone="course" d="M90 236C160 240 160 80 280 80S420 220 520 200S680 60 712 110" style="stroke-width:24"/></svg>`;
const ZONES = {
  start:{title:"Start", text:"Mass starts with elite runners at the front and thousands behind in corrals. Big races use chip timing, so each runner's own time starts when they cross the line."},
  course:{title:"The course", text:"Exactly 42.195 km (26.2 miles), measured along the shortest possible route a runner could take. Courses are certified so times can count."},
  water:{title:"Refreshment stations", text:"Water and sports drinks along the route, about every 5 km. Elite runners can have their own bottles placed at special tables."},
  mats:{title:"Timing mats", text:"Chips in runners' bibs record splits at checkpoints, which also confirms nobody took a shortcut."},
  finish:{title:"Finish", text:"First across the line wins. For records, the official time is gun time, from the starting gun."}
};
function pace(){
  const $ = id => document.getElementById(id); const D = 42.195;
  const fmt = s => { s = Math.round(s); const h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60; return h ? `${h}:${String(m).padStart(2,"0")}:${String(x).padStart(2,"0")}` : `${m}:${String(x).padStart(2,"0")}`; };
  function draw(){
    const t = +$("mrR").value*60, km = t/D, mi = km*1.609344;
    $("mrT").textContent = fmt(t); $("mrK").textContent = `${fmt(km)} per km`; $("mrM").textContent = `${fmt(mi)} per mile`;
    $("mrS").innerHTML = `<table class="rctab"><thead><tr><th>Checkpoint</th><th>Time</th></tr></thead><tbody>${[[5,"5 km"],[10,"10 km"],[21.0975,"Half marathon"],[30,"30 km"],[40,"40 km"],[D,"Finish"]].map(([d,l]) => `<tr><td>${l}</td><td>${fmt(km*d)}</td></tr>`).join("")}</tbody></table>`;
    $("mrMsg").textContent = t < 2*3600 + 300 ? "World-record territory: about 2 minutes 50 seconds per kilometer, the whole way. That's faster than most people can sprint for one block." : t < 3*3600 ? "Elite amateur pace. A sub-3-hour marathon is a famous goal for keen runners." : t < 4*3600 + 30*60 ? "A typical finish time for many recreational runners." : "A steady pace that gets you to the finish. Many big marathons keep the course open for 6 hours or more.";
  }
  $("mrR").addEventListener("input", draw); draw();
}
const judge = scenarioJudge("mrJ", [
  {t:"A runner takes a water bottle from a friend standing on the sidewalk.", o:["Allowed","Not allowed in elite races"], a:1, w:"Outside assistance is banned. Drinks must come from official stations."},
  {t:"A runner cuts across a corner by running on the grass.", o:["Smart running","Can be disqualified"], a:1, w:"Runners must stay on the marked course. Short-cutting leads to disqualification."},
  {t:"A race has pacemakers who run in front of the leaders for the first 30 km.", o:["Allowed","Not allowed"], a:0, w:"Pacemakers are allowed in many big-city marathons, but not in championship races like the Olympics."},
  {t:"A runner walks for a while in the middle of the race.", o:["Allowed","Disqualified"], a:0, w:"Walking is allowed. You just have to get to the finish."}
]);
SPORT_PAGES["marathon"] = {render: app => sportPage(app, {id:"marathon", p:"mr", name:"Marathon", alt:"The tabby cat running with a race bib and a cup of water",
  lede:"The marathon is a road race of 42.195 kilometers, or 26.2 miles. It's the simplest race to understand, first to the finish wins, but the rules about courses, drinks, and help along the way decide whether a time can count.",
  facts:[["42.195","kilometers"],["26.2","miles"],["2","hours: about the men's world record"],["1908","when the distance was fixed"]],
  diagram:{title:"The course", lede:"A simplified course map. Tap the parts.", svg, zones:ZONES, order:["start","course","water","mats","finish"], first:"course"},
  blocks:[{id:"pace", title:"Pace calculator", lede:"Pick a finish time and see the pace you'd need to hold for 42 km.", html:`<div class="oslab"><div class="osside"><label class="slider">Finish time <b id="mrT"></b><input id="mrR" type="range" min="120" max="360" step="1" value="240"></label>
      <div class="board" style="grid-template-columns:1fr 1fr"><div><small>Pace</small><b id="mrK" style="font-size:1.4rem"></b></div><div><small>Pace</small><b id="mrM" style="font-size:1.4rem"></b></div></div>
      <div class="narrator"><img src="${img("head.webp")}" alt=""><p id="mrMsg"></p></div></div><div id="mrS"></div></div>`, init:pace},
    {id:"judge", title:"Make the call", html:judge.html, init:judge.init}],
  tricky:[["Why 42.195 km?","The 1908 London Olympic course ran from Windsor Castle to the royal box in the stadium. That distance became the standard in 1921."],["What's a negative split?","Running the second half faster than the first, a sign of smart pacing."],["What's 'the wall'?","Around 30 km, many runners run low on stored energy and slow sharply. Eating and drinking during the race helps avoid it."],["Why don't some fast courses count for records?","Record courses can't drop too much in elevation or have the start and finish too far apart, so wind and downhill can't help too much."]],
  words:[["Split","The time at a checkpoint."],["Negative split","A faster second half."],["Pacer","A runner who sets a target pace."],["The wall","A sudden energy crash late in the race."],["Chip time","Your own time from crossing the start line."],["Gun time","Time from the starting gun."]],
  quiz:[{q:"How long is a marathon?",o:["26.2 km","42.195 km","50 km","40 km"],a:1,why:"42.195 km, or 26.2 miles."},{q:"How long in miles?",o:["13.1","26.2","30","42"],a:1,why:"26.2 miles."},{q:"Can a runner take a drink from a friend on the sidewalk in an elite race?",o:["Yes","No"],a:1,why:"Outside assistance is banned."},{q:"Can runners walk?",o:["Yes","No"],a:0,why:"Yes."},{q:"What happens if a runner cuts the course?",o:["Nothing","Disqualification"],a:1,why:"Disqualified."},{q:"What's a negative split?",o:["Running the second half faster","Finishing last","A missed checkpoint","A penalty"],a:0,why:"Faster second half."},{q:"Why is the distance 42.195 km?",o:["Ancient Greek tradition","The 1908 London Olympic course","It's 1/1000 of the Earth","Random"],a:1,why:"The 1908 London route."},{q:"About how fast is the men's world record?",o:["About 2 hours","About 2.5 hours","About 3 hours","About 1.5 hours"],a:0,why:"Just over 2 hours."},{q:"What's chip time?",o:["Time from the gun","Your own time from crossing the start line","A snack break","The winning time"],a:1,why:"Personal time from the start mat."},{q:"What is 'the wall'?",o:["The finish barrier","A late-race energy crash","A hill","A pacer"],a:1,why:"The energy crash around 30 km."}],
  footer:"Rules on this page follow World Athletics road running rules."})};
})();

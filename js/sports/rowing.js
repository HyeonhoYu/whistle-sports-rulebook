/* Rowing. Rules follow World Rowing. */
(function(){
const svg = `<svg viewBox="0 0 900 300" role="img" aria-label="A 2,000 m rowing course"><rect width="900" height="300" fill="#2F7546"/><rect x="0" y="40" width="900" height="220" fill="#3C8DC4"/>
  ${[1,2,3,4,5].map(i => `<line x1="40" y1="${40 + i*36.6}" x2="860" y2="${40 + i*36.6}" stroke="#F2C230" stroke-width="2" stroke-dasharray="3 9"/>`).join("")}
  <rect x="34" y="40" width="10" height="220" fill="#7A8C81"/>${[250,450,650].map(x => `<line x1="${x}" y1="40" x2="${x}" y2="260" stroke="#fff" stroke-width="1" stroke-dasharray="4 8"/>`).join("")}<line x1="860" y1="30" x2="860" y2="270" stroke="#D9342B" stroke-width="4"/>
  <text x="40" y="285" font-family="Barlow,sans-serif" font-size="13" fill="#fff">Start</text><text x="860" y="285" text-anchor="end" font-family="Barlow,sans-serif" font-size="13" fill="#fff">Finish (2,000 m)</text>
  <path d="M520 20h50l10 10h-70z" fill="#EEF3EC"/>
  <rect class="hz" data-zone="start" x="24" y="40" width="30" height="220"/><rect class="hz" data-zone="lanes" x="60" y="72" width="180" height="40"/><rect class="hz" data-zone="markers" x="440" y="40" width="20" height="220"/>
  <rect class="hz" data-zone="finish" x="850" y="30" width="20" height="240"/><rect class="hz" data-zone="umpire" x="505" y="8" width="80" height="30"/><rect class="hz" data-zone="course" x="60" y="140" width="370" height="110"/></svg>`;
const ZONES = {
  start:{title:"Start", text:"Boats line up with their sterns held at the start. The race begins on a light and horn."},
  lanes:{title:"Buoyed lanes", text:"Six lanes marked by small buoys. Crews must steer straight; wandering into another lane and getting in the way can mean disqualification."},
  markers:{title:"500 m markers", text:"Split times are taken every 500 m. Commentators compare crews at each one."},
  course:{title:"The course", text:"2,000 m of still water, ideally with no current and little wind."},
  umpire:{title:"Umpire's launch", text:"An umpire follows the race in a motorboat, warning crews who stray out of their lanes."},
  finish:{title:"Finish", text:"A crew finishes when the bow of the boat crosses the line. Photo finishes decide close races."}
};
const BOATS = {"1x":{n:"Single sculls", r:1, cox:0, scull:true}, "2x":{n:"Double sculls", r:2, cox:0, scull:true}, "4x":{n:"Quadruple sculls", r:4, cox:0, scull:true}, "2-":{n:"Pair", r:2, cox:0, scull:false}, "4-":{n:"Four", r:4, cox:0, scull:false}, "8+":{n:"Eight", r:8, cox:1, scull:false}};
function boats(){
  const $ = id => document.getElementById(id);
  function show(k){ const B = BOATS[k], L = 120 + B.r*52; let s = `<svg viewBox="0 0 ${L + 60} 160" style="width:100%;max-width:640px" aria-hidden="true"><rect width="${L + 60}" height="160" fill="#3C8DC4" rx="10"/><path d="M30 80Q${L/2 + 30} 60 ${L + 30} 80Q${L/2 + 30} 100 30 80Z" fill="#EEF3EC" stroke="#18221D" stroke-width="2"/>`;
      for(let i=0;i<B.r;i++){ const x = 90 + i*52;
        if(B.scull) s += `<line x1="${x}" y1="80" x2="${x - 18}" y2="20" stroke="#D7B98C" stroke-width="4"/><line x1="${x}" y1="80" x2="${x - 18}" y2="140" stroke="#D7B98C" stroke-width="4"/>`;
        else s += `<line x1="${x}" y1="80" x2="${x - 18}" y2="${i%2 ? 20 : 140}" stroke="#D7B98C" stroke-width="4"/>`;
        s += `<circle cx="${x}" cy="80" r="10" fill="#2F6FD6" stroke="#18221D" stroke-width="2"/>`; }
      if(B.cox) s += `<circle cx="50" cy="80" r="8" fill="#F2C230" stroke="#18221D" stroke-width="2"/>`;
      s += `<text x="${L + 22}" y="84" text-anchor="end" font-family="Barlow,sans-serif" font-size="11" fill="#18221D">bow</text></svg>`;
      $("rwBoat").innerHTML = `${s}<h3>${B.n} (${k})</h3><p>${B.r} rower${B.r > 1 ? "s" : ""}, ${B.scull ? "each with two oars (sculling)" : "each with one oar (sweep rowing)"}${B.cox ? ", plus a coxswain (yellow) who steers and calls the race" : ", no coxswain: one rower steers with a foot-operated rudder"}.</p>`;
      document.querySelectorAll("[data-rb]").forEach(b => b.setAttribute("aria-pressed", b.dataset.rb === k)); }
  document.querySelectorAll("[data-rb]").forEach(b => b.addEventListener("click", () => show(b.dataset.rb))); show("8+");
}
SPORT_PAGES["rowing"] = {render: app => sportPage(app, {id:"rowing", p:"rw", name:"Rowing", alt:"The tabby cat rowing a narrow boat with two oars",
  lede:"Crews of one to eight rowers race narrow boats over 2,000 meters of flat water, sitting backward and pulling oars in perfect rhythm. First bow across the line wins. The boat class tells you how many rowers and how many oars each one uses.",
  facts:[["2,000","meters per race"],["6","lanes"],["8","rowers in the biggest boat, plus a cox"],["0","rowers who face the finish (except the cox)"]],
  diagram:{title:"The course", svg, zones:ZONES, order:["start","lanes","markers","course","umpire","finish"], first:"lanes"},
  blocks:[{id:"boats", title:"Boat classes", lede:"Pick a boat. Sculling means two oars per rower; sweep means one.", html:`<div class="controls"><span class="chips">${Object.keys(BOATS).map(k => `<button class="chip" type="button" data-rb="${k}">${k}</button>`).join("")}</span></div><div class="infopanel" id="rwBoat" style="margin-top:14px"></div>`, init:boats},
    {id:"rules", title:"Key rules", html: cards([{big:"Bow", name:"Finish on the bow", text:"The race ends when the front of the boat crosses the line."},{big:"Lanes", name:"Stay in your lane", text:"Crews may stray, but must not impede another crew."},{big:"Rep", name:"Repechage", text:"Crews that miss qualifying in a heat get a second chance in a repechage race."},{big:"Cox", name:"Coxswain", text:"In eights, the cox steers, calls the rhythm, and must meet a minimum weight."}])}],
  clock:{segs:[{k:"h", cls:"q", t:"Heats", s:"Round 1", info:["Heats","The fastest crews in each heat go straight on."]},{k:"r", cls:"half", t:"Repechage", s:"Second chance", info:["Repechage","Everyone else races again for the remaining places."]},{k:"s", cls:"q", t:"Semifinals", s:"Top 12", info:["Semifinals","The top crews go to the A final."]},{k:"f", cls:"ot", t:"A final", s:"Medals", info:["Final","Six crews race for the medals, about 5 to 7 minutes of all-out effort."]}]},
  tricky:[["Why do rowers face backward?","Pulling the oar toward your body is the strongest motion, so rowers sit facing the stern."],["Who steers?","In boats with a cox, the cox. Otherwise one rower steers with a rudder cable attached to a shoe."],["What's a crab?","When an oar blade gets stuck in the water, it can jam the rower or even throw them out of the boat."],["What's the stroke rate?","Strokes per minute, usually 32 to 40 in a race, higher at the start and finish."]],
  words:[["Scull","A boat or rower using two oars each."],["Sweep","One oar per rower."],["Cox","The coxswain, who steers and calls the race."],["Stroke","The rower nearest the stern, who sets the rhythm."],["Bow","The front of the boat, and the rower nearest it."],["Catch","The moment the blade enters the water."]],
  quiz:[{q:"How long is an Olympic rowing race?",o:["1,000 m","2,000 m","5,000 m","500 m"],a:1,why:"2,000 m."},{q:"Which way do rowers face?",o:["Forward","Backward","Sideways","Up"],a:1,why:"Backward."},{q:"What does 8+ mean?",o:["Eight rowers plus a cox","Eight boats","Eighth place","Eight minutes"],a:0,why:"Eight rowers with a coxswain."},{q:"What's sculling?",o:["One oar per rower","Two oars per rower","Rowing with no oars","Steering"],a:1,why:"Two oars each."},{q:"What part of the boat must cross the line?",o:["The stern","The bow","The cox","The oars"],a:1,why:"The bow."},{q:"What's a repechage?",o:["A penalty","A second-chance race","A boat type","A stroke"],a:1,why:"A second chance."},{q:"In a pair (2-), how many oars per rower?",o:["One","Two","None","Four"],a:0,why:"One, sweep rowing."},{q:"Who steers a boat with no cox?",o:["Nobody","A rower with a foot-operated rudder","The umpire","A motorboat"],a:1,why:"A rower's foot steers."},{q:"How many lanes in a race?",o:["4","6","8","10"],a:1,why:"Six."},{q:"What's a crab?",o:["A stuck oar blade","A boat class","A winning move","The finish"],a:0,why:"A blade caught in the water."}],
  footer:"Rules on this page follow World Rowing for 2,000 m races. Coastal rowing and indoor rowing are separate events."})};
})();

/* Ski jumping. Rules follow FIS ski jumping competition rules. */
(function(){
const svg = `<svg viewBox="0 0 800 380" role="img" aria-label="Ski jumping hill profile"><rect width="800" height="380" fill="#9CC7EE"/>
  <path d="M40 20L220 150L250 150L300 175Q480 260 600 330L800 340V380H0V20Z" fill="#F3F7FA"/><path d="M40 20L220 150L250 150" fill="none" stroke="#5E6B64" stroke-width="6"/>
  <path d="M250 150Q420 70 560 300" fill="none" stroke="#D9342B" stroke-width="2" stroke-dasharray="7 6"/>
  <line x1="470" y1="245" x2="490" y2="270" stroke="#2F6FD6" stroke-width="5"/><line x1="560" y1="300" x2="580" y2="320" stroke="#D9342B" stroke-width="5"/>
  <text x="470" y="236" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" fill="#18221D">K-point</text><text x="584" y="300" font-family="Barlow,sans-serif" font-size="13" fill="#18221D">Hill size</text>
  <rect x="60" y="10" width="40" height="18" fill="#2B3831"/>
  <path class="hz hzs" data-zone="inrun" d="M60 34L218 148" style="stroke-width:24"/><rect class="hz" data-zone="table" x="212" y="136" width="44" height="26"/><rect class="hz" data-zone="flight" x="300" y="80" width="160" height="80"/>
  <rect class="hz" data-zone="k" x="455" y="230" width="40" height="44"/><rect class="hz" data-zone="hs" x="545" y="285" width="44" height="40"/><rect class="hz" data-zone="outrun" x="600" y="320" width="200" height="40"/><rect class="hz" data-zone="gate" x="56" y="6" width="48" height="26"/></svg>`;
const ZONES = {
  gate:{title:"Start gate", text:"Jurors can move the start gate up or down for safety and fairness as conditions change. Points are added or taken away to compensate."},
  inrun:{title:"Inrun", text:"An icy track where jumpers crouch to reach about 90 km/h (55 mph)."},
  table:{title:"Takeoff table", text:"The flat lip at the end of the inrun. Timing the jump here decides the whole flight."},
  flight:{title:"Flight", text:"Jumpers hold their skis in a V shape and lean forward to fly like a wing. Judges score how stable and controlled it is."},
  k:{title:"K-point", text:"The construction point. Landing exactly here earns 60 distance points; each meter farther or shorter adds or removes points."},
  hs:{title:"Hill size", text:"The farthest safe landing point and the name of the hill, like HS140. Landing beyond it is dangerous."},
  outrun:{title:"Outrun", text:"The flat area where jumpers slow down. A fall before the fall line affects the style marks."}
};
function calc(){
  const $ = id => document.getElementById(id);
  function draw(){
    const K = 125, mv = 1.8, d = +$("sjD").value, q = +$("sjQ").value, wind = +$("sjW").value, tele = $("sjT").checked;
    const dist = +(60 + (d - K)*mv).toFixed(1);
    const marks = Array.from({length:5}, (_,i) => Math.max(10, Math.min(20, Math.round((q - (tele ? 0 : 2) + [0,.5,-.5,1,-1][i])*2)/2)));
    const s = marks.slice().sort((a,b) => a - b), style = s.slice(1,4).reduce((a,b) => a + b, 0), hi = marks.indexOf(s[4]), lo = marks.indexOf(s[0]) === hi ? marks.lastIndexOf(s[0]) : marks.indexOf(s[0]);
    const total = +(dist + style + wind).toFixed(1);
    $("sjDv").textContent = `${d} m`; $("sjQv").textContent = q.toFixed(1); $("sjWv").textContent = `${wind > 0 ? "+" : ""}${wind.toFixed(1)}`;
    $("sjOut").innerHTML = `<div class="scorebar"><div><small>Distance points (K = 125 m)</small><b>${dist.toFixed(1)}</b></div><span>+</span><div><small>Style: 5 judges, middle 3 added</small><span class="marks">${marks.map((m,i) => `<i class="${i === hi || i === lo ? "x" : ""}">${m.toFixed(1)}</i>`).join("")}</span><b>${style.toFixed(1)}</b></div><span>+</span><div><small>Wind and gate</small><b>${wind.toFixed(1)}</b></div><span>=</span><div class="tot"><small>Jump score</small><b>${total.toFixed(1)}</b></div></div>`;
    $("sjMsg").textContent = `${d === K ? "Exactly on the K-point: 60 distance points." : d > K ? `${d - K} m past the K-point earns ${((d - K)*mv).toFixed(1)} extra points.` : `${K - d} m short of the K-point costs ${((K - d)*mv).toFixed(1)} points.`} ${tele ? "A clean telemark landing keeps the style marks high." : "No telemark landing: the judges take marks off."}`;
  }
  ["sjD","sjQ","sjW"].forEach(id => $(id).addEventListener("input", draw)); $("sjT").addEventListener("change", draw); draw();
}
SPORT_PAGES["ski-jumping"] = {render: app => sportPage(app, {id:"ski-jumping", p:"sj", name:"Ski jumping", alt:"The tabby cat in a jumpsuit and helmet flying through the air on skis",
  lede:"Jumpers race down a steep inrun, launch off a takeoff table, and fly as far as they can before landing on a steep hill. Each jump scores points for distance and for style from five judges, with adjustments for wind and the start gate. Two jumps are added together.",
  facts:[["60","points for landing on the K-point"],["5","style judges, 20 points each"],["2","jumps added together"],["90","km/h on the inrun"]],
  diagram:{title:"The hill", svg, zones:ZONES, order:["gate","inrun","table","flight","k","hs","outrun"], first:"k"},
  blocks:[{id:"calc", title:"Score a jump", lede:"On a large hill with the K-point at 125 m, each meter is worth 1.8 points.", html:`<div class="pbform"><label>Distance <span id="sjDv"></span><input id="sjD" type="range" min="105" max="142" step="0.5" value="131"></label><label>Flight and landing quality <span id="sjQv"></span><input id="sjQ" type="range" min="14" max="20" step="0.5" value="18.5"></label><label>Wind and gate points <span id="sjWv"></span><input id="sjW" type="range" min="-8" max="8" step="0.1" value="0"></label><label class="check" style="align-self:end"><input type="checkbox" id="sjT" checked> Telemark landing</label></div><div id="sjOut"></div><div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="sjMsg"></p></div>`, init:calc},
    {id:"hills", title:"Hills and events", html: cards([{big:"Normal", name:"Normal hill", text:"Hill sizes around 100 m."},{big:"Large", name:"Large hill", text:"Hill sizes around 140 m."},{big:"Flying", name:"Ski flying", text:"Giant hills where jumps go well beyond 200 m."},{big:"Team", name:"Team and mixed team", text:"Jumpers' scores are added together for their country."}])}],
  tricky:[["What's a telemark landing?","Landing with one ski in front of the other and knees bent, arms out. Judges expect it, and skipping it costs style points."],["Why do wind points exist?","Headwind helps jumpers fly farther; tailwind pushes them down. Points are added or subtracted so luck matters less."],["Why the V shape?","Spreading the ski tips makes the jumper and skis act like a wing, carrying them much farther."],["Can jumpers be disqualified for their suits?","Yes. Suits are checked for size and air permeability, because a looser suit can act like a sail."]],
  words:[["K-point","The target distance worth 60 points."],["HS","Hill size, the farthest safe distance."],["Telemark","The classic landing position."],["Inrun","The ramp down to the takeoff."],["Gate","The start position on the inrun."],["V-style","Holding the skis in a V during flight."]],
  quiz:[{q:"How many distance points for landing on the K-point?",o:["0","20","60","100"],a:2,why:"Sixty."},{q:"How many style judges are there?",o:["3","5","7","9"],a:1,why:"Five."},{q:"How many style marks count?",o:["All five","The middle three","The best two","Only the highest"],a:1,why:"Highest and lowest are dropped."},{q:"What's the maximum style mark per judge?",o:["10","15","20","60"],a:2,why:"Twenty."},{q:"What's a telemark landing?",o:["Landing on one ski","One ski ahead of the other, knees bent","A fall","A landing past the hill size"],a:1,why:"The classic landing."},{q:"Why are wind points added or removed?",o:["To reward bravery","To make conditions fairer","For style","For the crowd"],a:1,why:"To balance wind luck."},{q:"How many jumps in an individual event?",o:["1","2","3","4"],a:1,why:"Two."},{q:"What does HS mean?",o:["High speed","Hill size","Half score","Home start"],a:1,why:"Hill size."},{q:"Why do jumpers hold their skis in a V?",o:["Tradition","To fly farther, like a wing","To slow down","It's required"],a:1,why:"More lift."},{q:"On a large hill (1.8 points per meter), a jumper lands 5 m past the K-point. What are the distance points?",o:["60","65","69","78"],a:2,why:"60 + 5 x 1.8 = 69."}],
  footer:"Rules on this page follow FIS ski jumping rules. Meter values and K-points differ for each hill."})};
})();

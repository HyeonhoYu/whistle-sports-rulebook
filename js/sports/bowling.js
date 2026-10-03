/* Ten-pin bowling. Rules follow USBC and World Bowling scoring. */
(function(){
const WOOD="#D7B98C";
const pins = (x0,y0,s=1) => [[0,0],[1,-.5],[1,.5],[2,-1],[2,0],[2,1],[3,-1.5],[3,-.5],[3,.5],[3,1.5]].map(([c,r]) => `<circle cx="${x0 + c*22*s}" cy="${y0 + r*24*s}" r="${7*s}" fill="#fff" stroke="#18221D" stroke-width="1.5"/>`).join("");
const svg = `<svg viewBox="0 0 900 220" role="img" aria-label="Bowling lane from above"><rect width="900" height="220" fill="#2B3831"/><rect x="0" y="50" width="900" height="120" fill="${WOOD}"/><rect x="0" y="40" width="900" height="10" fill="#555"/><rect x="0" y="170" width="900" height="10" fill="#555"/>
  <rect x="0" y="50" width="140" height="120" fill="#E6CFA4"/><line x1="140" y1="50" x2="140" y2="170" stroke="#D9342B" stroke-width="4"/>
  ${[0,1,2,3,4,5,6].map(i => `<path d="M${300 + Math.abs(i-3)*10} ${62 + i*16}l10 4-10 4z" fill="#2B3831"/>`).join("")}${[0,1,2,3,4].map(i => `<circle cx="200" cy="${70 + i*20}" r="3" fill="#2B3831"/>`).join("")}
  ${pins(770,110)}<rect x="860" y="50" width="40" height="120" fill="#111"/>
  <rect class="hz" data-zone="approach" x="0" y="50" width="136" height="120"/><rect class="hz" data-zone="foul" x="134" y="50" width="12" height="120"/><rect class="hz" data-zone="arrows" x="280" y="56" width="80" height="110"/><rect class="hz" data-zone="dots" x="190" y="60" width="20" height="100"/>
  <rect class="hz" data-zone="lane" x="370" y="54" width="380" height="112"/><rect class="hz" data-zone="gutter" x="0" y="36" width="900" height="16"/><rect class="hz" data-zone="gutter" x="0" y="168" width="900" height="16"/><rect class="hz" data-zone="pins" x="755" y="64" width="90" height="92"/><rect class="hz" data-zone="pit" x="858" y="50" width="42" height="120"/></svg>`;
const ZONES = {
  approach:{title:"Approach", text:"Where bowlers take their steps before releasing the ball, about 15 feet long."},
  foul:{title:"Foul line", text:"Crossing or touching it on delivery is a foul: the roll counts as zero, even if pins fall."},
  dots:{title:"Guide dots", text:"Small dots a few feet past the foul line help bowlers place the ball."},
  arrows:{title:"Target arrows", text:"Arrows about 15 feet down the lane. Most bowlers aim at an arrow, not the pins, because it's closer."},
  lane:{title:"The lane", text:"60 feet from the foul line to the head pin, and oiled in patterns that make the ball skid, then hook."},
  gutter:{title:"Gutters", text:"A ball in the gutter knocks nothing down. Pins it hits afterward don't count."},
  pins:{title:"Pins", text:"Ten pins set in a triangle. The front one is the head pin; hitting just beside it, in the pocket, gives the best chance at a strike."},
  pit:{title:"Pit", text:"Where pins and the ball fall. Machines reset the pins and return the ball."}
};
function scorer(){
  const $ = id => document.getElementById(id); let rolls = [];
  function frames(){ /* returns array of frames with marks and cumulative scores */
    const out = []; let i = 0, total = 0;
    for(let f=0; f<10; f++){
      const fr = {marks:[], score:null};
      if(f < 9){
        if(rolls[i] === undefined){ out.push(fr); continue; }
        if(rolls[i] === 10){ fr.marks = ["","X"]; if(rolls[i+1] !== undefined && rolls[i+2] !== undefined){ total += 10 + rolls[i+1] + rolls[i+2]; fr.score = total; } i += 1; }
        else { fr.marks = [rolls[i] || "-", rolls[i+1] === undefined ? "" : rolls[i] + rolls[i+1] === 10 ? "/" : (rolls[i+1] || "-")];
          if(rolls[i+1] !== undefined){ if(rolls[i] + rolls[i+1] === 10){ if(rolls[i+2] !== undefined){ total += 10 + rolls[i+2]; fr.score = total; } } else { total += rolls[i] + rolls[i+1]; fr.score = total; } } i += 2; }
      } else {
        const r = rolls.slice(i, i + 3); const m = [];
        r.forEach((v,k) => { if(v === 10 && (k === 0 || m[k-1] === "X" || m[k-1] === "/")) m.push("X"); else if(k > 0 && m[k-1] !== "X" && m[k-1] !== "/" && r[k-1] + v === 10) m.push("/"); else m.push(v ? String(v) : "-"); });
        fr.marks = m; const done = r.length === 3 || (r.length === 2 && r[0] + r[1] < 10);
        if(done){ total += r.reduce((a,b) => a + b, 0); fr.score = total; } fr.tenth = true;
      }
      out.push(fr);
    }
    return out;
  }
  function state(){ /* which frame and how many pins are standing */
    let i = 0;
    for(let f=0; f<9; f++){ if(rolls[i] === undefined) return {f, pins:10}; if(rolls[i] === 10){ i++; continue; } if(rolls[i+1] === undefined) return {f, pins:10 - rolls[i]}; i += 2; }
    const r = rolls.slice(i); if(r.length === 0) return {f:9, pins:10};
    if(r.length === 1) return {f:9, pins: r[0] === 10 ? 10 : 10 - r[0]};
    if(r.length === 2){ if(r[0] + r[1] < 10 && r[0] !== 10) return {done:true}; if(r[0] === 10 && r[1] !== 10) return {f:9, pins:10 - r[1]}; return {f:9, pins:10}; }
    return {done:true};
  }
  function draw(msg){
    const fs = frames(), st = state();
    $("bwSheet").innerHTML = `<div class="bwsheet">${fs.map((fr,k) => `<div class="bwf${st.f === k && !st.done ? " now" : ""}"><small>${k+1}</small><div class="bwm">${(fr.tenth ? [0,1,2] : [0,1]).map(j => `<span>${fr.marks[j] ?? ""}</span>`).join("")}</div><b>${fr.score ?? ""}</b></div>`).join("")}</div>`;
    $("bwBtns").innerHTML = st.done ? "" : Array.from({length:st.pins + 1}, (_,n) => `<button class="btn" type="button" data-n="${n}">${n === 10 ? "Strike (10)" : n === st.pins && st.pins < 10 ? `${n} (spare)` : n}</button>`).join("");
    $("bwBtns").querySelectorAll("button").forEach(b => b.addEventListener("click", () => roll(+b.dataset.n)));
    if(msg) $("bwMsg").textContent = msg; $("bwNew").hidden = !st.done;
  }
  function roll(n){
    const before = state(); rolls.push(n); const st = state();
    let msg = n === 10 && before.pins === 10 ? "Strike! This frame scores 10 plus your next two rolls." : before.pins < 10 && n === before.pins ? "Spare! This frame scores 10 plus your next roll." : n === 0 ? "A miss: zero pins." : `${n} pin${n > 1 ? "s" : ""}.`;
    if(st.done){ const t = frames()[9].score; msg = `${n === 10 ? "Strike" : n ? n + " pins" : "A miss"} to finish. Game over: ${t}.${t === 300 ? " A perfect game: twelve strikes in a row!" : ""}`; }
    else if(st.f === 9 && before.f === 9 && st.pins === 10 && rolls.length) msg += " In the 10th frame, a strike or spare earns bonus rolls.";
    draw(msg);
  }
  $("bwNew").addEventListener("click", () => { rolls = []; draw("New game. Pick how many pins each roll knocks down."); });
  $("bwAuto").addEventListener("click", () => { rolls = Array(12).fill(10); draw("Twelve strikes in a row: 300, a perfect game. Each frame scored 10 plus the next two strikes, so 30 per frame."); });
  draw("Pick how many pins each roll knocks down, and watch the scoresheet fill in.");
}
SPORT_PAGES["bowling"] = {render: app => sportPage(app, {id:"bowling", p:"bw", name:"Bowling", alt:"The tabby cat rolling a bowling ball down a lane toward the pins",
  lede:"Bowlers roll a heavy ball down a 60-foot lane to knock over ten pins. A game has ten frames, with two rolls in each. Strikes and spares earn bonus points from the next rolls, which is why the scoring looks confusing at first and why a perfect game is 300.",
  facts:[["10","frames in a game"],["10","pins"],["60","feet to the head pin"],["300","a perfect game"]],
  diagram:{title:"The lane", svg, zones:ZONES, order:["approach","foul","dots","arrows","lane","gutter","pins","pit"], first:"arrows"},
  blocks:[{id:"score", title:"Keep score", lede:"Enter each roll and watch strikes and spares add their bonuses. This is the part of bowling everyone asks about.", html:`<div id="bwSheet"></div><div class="controls" id="bwBtns" style="margin-top:12px"></div><div class="controls" style="margin-top:8px"><button class="btn" id="bwAuto" type="button">Show a perfect game</button><button class="btn primary" id="bwNew" type="button" hidden>New game</button></div><div class="result narrator" style="margin-top:12px" aria-live="polite"><img src="${img("head.webp")}" alt=""><p id="bwMsg"></p></div>`, init:scorer},
    {id:"marks", title:"Scoring marks", html: cards([{big:"X", name:"Strike", text:"All ten pins on the first roll. Scores 10 plus the next two rolls."},{big:"/", name:"Spare", text:"All ten pins using both rolls. Scores 10 plus the next roll."},{big:"-", name:"Miss", text:"A roll that knocks down nothing."},{big:"F", name:"Foul", text:"Crossing the foul line. The roll counts as zero."},{big:"O", name:"Split", text:"After the first roll, two or more pins left with a gap between them, like the 7-10."}], 200)}],
  tricky:[["Why isn't a strike worth 10?","It's worth 10 plus whatever you knock down on your next two rolls, rewarding you for streaks."],["What happens in the 10th frame?","A strike or spare earns extra rolls so the bonus can be counted: up to three rolls in that frame."],["What's the 7-10 split?","Pins in the two back corners. Converting it means sliding one pin across into the other, and it's one of the hardest shots in sports."],["Why does the ball curve?","Bowlers spin it. The oil on the lane lets it skid first, then it grips the dry back end and hooks into the pocket."]],
  words:[["Pocket","The gap between the head pin and the pin beside it."],["Turkey","Three strikes in a row."],["Hook","A ball that curves late into the pins."],["Split","Pins left standing with a gap between."],["Open frame","A frame with no strike or spare."],["Clean game","A game with a strike or spare in every frame."]],
  quiz:[{q:"How many frames are in a game?",o:["8","10","12","20"],a:1,why:"Ten."},{q:"What does a strike score?",o:["10","10 plus the next roll","10 plus the next two rolls","20"],a:2,why:"10 plus the next two rolls."},{q:"What does a spare score?",o:["10","10 plus the next roll","10 plus the next two rolls","15"],a:1,why:"10 plus the next roll."},{q:"What's a perfect game?",o:["200","250","300","1000"],a:2,why:"300."},{q:"How many strikes in a row make 300?",o:["10","11","12","15"],a:2,why:"Twelve."},{q:"What happens if you cross the foul line?",o:["Nothing","The roll counts as zero","You lose the game","Extra roll"],a:1,why:"It's a foul."},{q:"What's a turkey?",o:["A split","Three strikes in a row","A gutter ball","A spare"],a:1,why:"Three straight strikes."},{q:"How far is it from the foul line to the head pin?",o:["40 ft","60 ft","80 ft","100 ft"],a:1,why:"Sixty feet."},{q:"What does the / mark mean?",o:["Strike","Spare","Foul","Miss"],a:1,why:"Spare."},{q:"Why do bowlers aim at the arrows?",o:["It's required","They're closer and easier to aim at","They show the score","They're the foul line"],a:1,why:"A closer target."}],
  footer:"Scoring on this page is traditional ten-pin scoring, used in leagues and most tournaments."})};
})();

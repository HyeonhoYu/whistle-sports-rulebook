/* Softball (fastpitch). Rules follow WBSC. */
(function(){
const W="#F4F6F1", INK="#18221D", DIRT="#C48A57", G="#2F7546";
const svg = `<svg viewBox="0 0 800 560" role="img" aria-label="Softball field from above"><rect width="800" height="560" fill="#1C4D2C"/>
  <path d="M400 520L140 260Q400 -40 660 260Z" fill="${G}"/><path d="M400 540L520 420Q400 250 280 420Z" fill="${DIRT}"/><path d="M400 500L480 420L400 340L320 420Z" fill="${G}"/>
  <circle cx="400" cy="430" r="24" fill="${DIRT}" stroke="#fff" stroke-width="2"/><rect x="393" y="428" width="14" height="4" fill="#fff"/>
  <path d="M400 520L140 260M400 520L660 260" stroke="#fff" stroke-width="3"/><path d="M140 260Q400 -40 660 260" fill="none" stroke="#F2C230" stroke-width="6"/>
  ${[[480,420],[400,340],[320,420]].map(([x,y]) => `<rect x="${x-7}" y="${y-7}" width="14" height="14" fill="#fff" transform="rotate(45 ${x} ${y})"/>`).join("")}<path d="M394 514h12v5l-6 6-6-6z" fill="#fff"/>
  <path class="hz" data-zone="foul" d="M0 0H800V560H0Z" style="fill-opacity:0"/><path class="hz" data-zone="outfield" d="M400 520L140 260Q400 -40 660 260Z"/><path class="hz" data-zone="infield" d="M400 540L520 420Q400 250 280 420Z"/>
  <circle class="hz" data-zone="circle" cx="400" cy="430" r="26"/>${[[480,420],[400,340],[320,420]].map(([x,y]) => `<circle class="hz" data-zone="bases" cx="${x}" cy="${y}" r="14"/>`).join("")}
  <circle class="hz" data-zone="plate" cx="400" cy="518" r="12"/><path class="hz hzs" data-zone="fence" d="M140 260Q400 -40 660 260" style="stroke-width:16"/></svg>`;
const ZONES = {
  plate:{title:"Home plate", text:"Where the batter stands. Runners score by reaching it after touching every base."},
  circle:{title:"Pitcher's circle", text:"The pitcher throws from a rubber 43 feet (13.1 m) from home plate, with an underhand windmill or slingshot motion."},
  bases:{title:"Bases", text:"Only 60 feet (18.3 m) apart, a third shorter than in baseball. Runners may not leave a base until the pitch is released."},
  infield:{title:"Infield", text:"With bases so close, infielders play shallow and plays happen fast."},
  outfield:{title:"Outfield", text:"Smaller than a baseball outfield, with fences about 220 feet (67 m) away at international level."},
  fence:{title:"Fence", text:"A fair ball over the fence is a home run."},
  foul:{title:"Foul territory", text:"Outside the foul lines. A foul ball is a strike unless the batter has two strikes, just like baseball."}
};
const judge = scenarioJudge("sbJ", [
  {t:"The pitcher's arm comes over the top, like a baseball pitch.", o:["Legal","Illegal pitch"], a:1, w:"Softball pitches must be underhand. An illegal pitch is a ball for the batter, and runners move up a base."},
  {t:"A runner on first takes off before the pitcher releases the ball.", o:["Legal steal","Runner is out"], a:1, w:"In fastpitch, runners can't leave the base until the pitch is released. Leaving early is an out."},
  {t:"The game is tied after 7 innings.", o:["It ends in a tie","Extra innings start with a runner on second"], a:1, w:"The international tiebreaker places a runner on second base at the start of each extra half-inning."},
  {t:"After 5 innings, one team leads by 8 runs.", o:["Keep playing","The game ends early"], a:1, w:"The run-ahead rule ends games early when a team leads by 7 or more after 5 innings (15 after 3, 10 after 4)."},
  {t:"A batter bunts the ball softly in front of the plate.", o:["Legal","Not allowed in softball"], a:0, w:"Bunting is a big part of softball. With short bases, a good bunt can beat the throw."}
]);
const QUIZ = [
  {q:"How many innings are in a regulation softball game?", o:["5","7","9","10"], a:1, why:"Seven innings."},
  {q:"How is the ball pitched?", o:["Overhand","Sidearm","Underhand","Any way"], a:2, why:"Underhand, with a windmill or slingshot motion."},
  {q:"How far apart are the bases?", o:["45 ft","60 ft","75 ft","90 ft"], a:1, why:"Sixty feet."},
  {q:"When may a runner leave the base to steal?", o:["Anytime","When the pitch is released","After the catcher catches it","Never"], a:1, why:"Not before the pitch is released."},
  {q:"What starts each extra inning in international softball?", o:["A coin toss","A runner on second base","A home run derby","A walk"], a:1, why:"The tiebreaker puts a runner on second."},
  {q:"How big is a softball compared to a baseball?", o:["Smaller","The same","Bigger, about 12 inches around","Twice as heavy"], a:2, why:"A softball is about 12 inches in circumference; a baseball about 9."},
  {q:"An illegal pitch is called. What happens?", o:["The batter is out","A ball is added and runners advance","Nothing","The pitcher is ejected"], a:1, why:"Ball to the batter, runners advance."},
  {q:"A team leads by 7 after 5 innings. What happens?", o:["The game continues","The game ends","A runner is added","Extra innings"], a:1, why:"The run-ahead rule."},
  {q:"How far is the pitcher from home plate in women's fastpitch?", o:["35 ft","43 ft","50 ft","60 ft 6 in"], a:1, why:"Forty-three feet."},
  {q:"Is softball in the 2028 Olympics?", o:["Yes","No"], a:0, why:"Softball returns at the 2028 Los Angeles Games."}
];
SPORT_PAGES["softball"] = {render: app => sportPage(app, {id:"softball", p:"sb", name:"Softball", alt:"The tabby cat winding up to pitch a yellow softball",
  lede:"Softball is baseball's close cousin: bat, run the bases, get three outs. But the field is smaller, the ball is bigger, and the pitcher throws underhand from close range, so the batter has even less time to react.",
  facts:[["7","innings"],["43","feet from pitcher to batter"],["60","feet between bases"],["12","inch ball"]],
  diagram:{title:"The field", svg, zones:ZONES, order:["plate","circle","bases","infield","outfield","fence","foul"], first:"circle", max:760},
  blocks:[{id:"judge", title:"Make the call", lede:"Five situations that trip up baseball fans.", html:judge.html, init:judge.init},
    {id:"diff", title:"Softball versus baseball", html: cards([{big:"Under", name:"Underhand pitch", text:"A fast windmill pitch can reach about 70 mph (110 km/h) from just 43 feet, as hard to hit as a baseball fastball."},{big:"60 ft", name:"Shorter bases", text:"Bunts and speed matter more. Infielders creep in close."},{big:"7", name:"Seven innings", text:"Games are shorter, so every run counts."},{big:"DP/Flex", name:"Designated player", text:"A team may use a designated player to bat for a fielder, with flexible substitution rules."}])}],
  clock:{segs:[{k:"r", cls:"q", t:"Innings 1-7", s:"3 outs each half", info:["Regulation","Seven innings, each with the visitors batting in the top and the home team in the bottom."]},{k:"m", cls:"half", t:"Run-ahead", s:"Mercy rule", info:["Run-ahead rule","15 runs after 3 innings, 10 after 4, or 7 after 5 ends the game early."]},{k:"x", cls:"ot", t:"Extra", s:"Runner on 2nd", info:["Extra innings","Each half-inning starts with a runner on second base until someone wins."]}]},
  tricky:[["Why underhand?","It's the defining rule. The underhand windmill puts less strain on the shoulder and creates rising and dropping pitches baseball can't copy."],["Can a pitcher hit the batter?","A hit batter gets first base, just like baseball."],["What's slapping?","A left-handed batter running toward first as they swing, chopping the ball into the ground to beat the throw."],["Is slow-pitch the same?","No. Slow-pitch is a recreational game with high, arcing pitches and different rules. Olympic softball is fastpitch."]],
  words:[["Windmill","The full circular pitching motion."],["Slapper","A batter who runs into the swing to beat out ground balls."],["Rise ball","A pitch that seems to jump upward."],["Circle","The pitcher's circle."],["DP","Designated player."],["Run-ahead","The mercy rule."]],
  quiz:QUIZ, footer:"Rules on this page follow WBSC fastpitch softball, used at the Olympics. US college softball is very similar."})};
})();

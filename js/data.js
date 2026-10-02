/* Sports list and filter groups for the home page.
   To publish a new sport page, add js/sports/<id>.js and a script tag in index.html.
   The card switches to "Read the rules" automatically once that page is registered. */

const FILTERS = [
  {key:"format", label:"Type of sport", options:[["ball","Ball and puck games"],["racket","Racket"],["combat","Combat"],["race","Races"],["target","Target"],["artistic","Judged artistry"]]},
  {key:"players", label:"Who competes", options:[["individual","Individual"],["h2h","One on one"],["team","Team"]]},
  {key:"venue", label:"Where it's played", options:[["indoor","Indoor"],["outdoor","Outdoor"],["water","Water"],["snow","Snow and ice"]]},
  {key:"win", label:"How you win", options:[["score","Outscore the other side"],["time","Fastest time"],["judges","Judges' scores"],["strokes","Fewest strokes"]]},
  {key:"olympic", label:"Olympics", options:[["summer","Summer Games"],["winter","Winter Games"],["none","Not an Olympic sport"]]},
  {key:"level", label:"How easy to follow", options:[["easy","Easy"],["moderate","Clicks after a game or two"],["complex","Worth reading up on"]]}
];

const SPORTS = [
  {id:"american-football", name:"American football", blurb:"Gain ground 10 yards at a time and reach the end zone.", fact:"11 players per side", format:["ball"], players:["team"], venue:["outdoor"], win:["score"], olympic:["none"], level:["complex"]},
  {id:"soccer", name:"Soccer", blurb:"Get the ball in the net without using your hands.", fact:"11 players per side", format:["ball"], players:["team"], venue:["outdoor"], win:["score"], olympic:["summer"], level:["easy"]},
  {id:"basketball", name:"Basketball", blurb:"Shoot through the hoop; shots from farther out count more.", fact:"5 players per side", format:["ball"], players:["team"], venue:["indoor"], win:["score"], olympic:["summer"], level:["moderate"]},
  {id:"baseball", name:"Baseball", blurb:"Hit, run the bases, and get three outs to switch sides.", fact:"9 innings", format:["ball"], players:["team"], venue:["outdoor"], win:["score"], olympic:["summer"], level:["complex"]},
  {id:"volleyball", name:"Volleyball", blurb:"Three touches to send it back over the net.", fact:"6 players per side", format:["ball"], players:["team"], venue:["indoor"], win:["score"], olympic:["summer"], level:["easy"]},
  {id:"ice-hockey", name:"Ice hockey", blurb:"Skate, pass, and shoot the puck into the net.", fact:"6 players per side", format:["ball"], players:["team"], venue:["indoor","snow"], win:["score"], olympic:["winter"], level:["moderate"]},
  {id:"tennis", name:"Tennis", blurb:"Points make games, games make sets.", fact:"Best of 3 or 5 sets", format:["racket"], players:["h2h"], venue:["outdoor","indoor"], win:["score"], olympic:["summer"], level:["moderate"]},
  {id:"badminton", name:"Badminton", blurb:"Keep the shuttle off your side of the court.", fact:"21 points a game", format:["racket"], players:["h2h"], venue:["indoor"], win:["score"], olympic:["summer"], level:["easy"]},
  {id:"table-tennis", name:"Table tennis", blurb:"Fast rallies on a small table.", fact:"11 points a game", format:["racket"], players:["h2h"], venue:["indoor"], win:["score"], olympic:["summer"], level:["easy"]},
  {id:"boxing", name:"Boxing", blurb:"Win by knockout or on the judges' scorecards.", fact:"Timed rounds", format:["combat"], players:["h2h"], venue:["indoor"], win:["judges"], olympic:["summer"], level:["moderate"]},
  {id:"judo", name:"Judo", blurb:"Throw or pin your opponent to score.", fact:"One clean throw can end it", format:["combat"], players:["h2h"], venue:["indoor"], win:["score"], olympic:["summer"], level:["moderate"]},
  {id:"swimming", name:"Swimming", blurb:"Four strokes, many distances, one clock.", fact:"4 strokes", format:["race"], players:["individual"], venue:["water","indoor"], win:["time"], olympic:["summer"], level:["easy"]},
  {id:"sprinting", name:"Sprinting", blurb:"Stay in your lane and don't leave early.", fact:"One false start and you're out", format:["race"], players:["individual"], venue:["outdoor"], win:["time"], olympic:["summer"], level:["easy"]},
  {id:"alpine-skiing", name:"Alpine skiing", blurb:"Race down the mountain through the gates.", fact:"Miss a gate, lose the run", format:["race"], players:["individual"], venue:["outdoor","snow"], win:["time"], olympic:["winter"], level:["easy"]},
  {id:"golf", name:"Golf", blurb:"Get the ball in the hole in as few shots as possible.", fact:"18 holes", format:["target"], players:["individual"], venue:["outdoor"], win:["strokes"], olympic:["summer"], level:["moderate"]},
  {id:"curling", name:"Curling", blurb:"Slide stones closest to the center of the house.", fact:"4 players per team", format:["target"], players:["team"], venue:["indoor","snow"], win:["score"], olympic:["winter"], level:["moderate"]},
  {id:"figure-skating", name:"Figure skating", blurb:"Jumps, spins, and footwork scored for difficulty and quality.", fact:"Two programs", format:["artistic"], players:["individual"], venue:["indoor","snow"], win:["judges"], olympic:["winter"], level:["complex"]},
  {id:"gymnastics", name:"Gymnastics", blurb:"Routines judged on difficulty and execution.", fact:"Scored to the thousandth", format:["artistic"], players:["individual"], venue:["indoor"], win:["judges"], olympic:["summer"], level:["complex"]}
];

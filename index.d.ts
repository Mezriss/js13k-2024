interface Element {
  x: number;
  y: number;
  z: number;
  r: number;
  t: "boost" | "wall";
  s: "sphere" | "pyramid";
  h?: number;
}

interface State {
  x: number;
  y: number;
  z: number;
  r: number;
  boosts: number;
  score: number;
  turn: number;
  lastFrame: number;
}

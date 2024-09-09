interface Entity {
  id: string;
  x: number;
  y: number;
  z: number;
  t: "boost" | "wall"; //todo enum
  s: "sphere" | "pyramid" | "box"; //todo enum
  r?: number;
  w?: number;
  h?: number;
  d?: number; //depth
}

interface State {
  alive: boolean;
  x: number;
  y: number;
  z: number;
  r: number;
  boosts: number;
  score: number;
  turn: number;
  lastFrame: number;
}

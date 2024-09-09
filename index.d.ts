interface Entity {
  id: string;
  x: number;
  y: number;
  z: number;
  r: number;
  t: "boost" | "wall"; //todo enum
  s: "sphere" | "pyramid"; //todo enum
  h?: number;
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

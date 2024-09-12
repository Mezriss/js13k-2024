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

interface Tween {
  id: string;
  key: string;
  from: number;
  delta: number;
  duration: number;
  delay: number;
  progress: number;
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

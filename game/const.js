import { splitmix32 } from "./util.js";
import { Sphere, Plane, Cube, Pyramid } from "../renderer/index.js";
import ship from "../assets/ship.js";

export const localStorageKey = "js13k13gate8bdb3b08a930";

export const maxR = 5; //maximum possible radius for collision quick checking

export const playerR = [0.1, 0.25, 0.5]; // player collision radius based on challenge level
export const scoreM = [0.75, 1, 1.25]; // score multiplier

export const levelLength = 300;

export const baseSpeed = 10;
export const speedIncrease = 2; //+speed per collected boost

export const maxTurn = 10;
export const turnVelocity = 20;
export const tiltFactor = 3;

export const jumpStrength = 12;

export const baseZ = 0.25;

//scoring
export const scorePickup = 100;
export const scoreBoost = 1000;
// y: 2, z: 0.3,
export const rendererDefaults = {
  clearColor: "#002B36",
  debug: true,
  light: { x: -0.3, y: 0.9, z: -0.9 },
  camera: { z: 1.2, y: -2.5, rx: 80, fov: 30 },
  ambient: 0.1,
  geometry: {
    sphere: Sphere,
    plane: Plane,
    cube: Cube,
    pyramid: Pyramid,
    shipBody: ship.body,
    shipFin: ship.fin,
    shipWing: ship.wing,
  },
};

export const stateDefaults = {
  alive: true,
  x: 0,
  y: 0,
  z: baseZ,
  boosts: 0,
  score: 0,
  turn: 0,
  vz: 0,

  lastFrame: 0,
};

export const m10 = 10 * 60 * 1000;

export const logo = [
  [, , 1, , 1, 1, 1, , 2, 2, 2, , 2, , 2],
  [, 1, 1, , , , 1, , , 2, , , 2, 2, 2],
  [, , 1, , , 1, 1, , , 2, , , 2, , 2],
  [, , 1, , , , 1, , , , , , , ,],
  [, , 1, , 1, 1, 1, , , , , , , ,],
  [, , , , , , , , , , , , , ,],
  [2, 2, 2, , 2, 2, 2, , 2, 2, 2, , 2, 2, 2],
  [2, , , , 2, , 2, , , 2, , , 2, ,],
  [2, , 2, , 2, 2, 2, , , 2, , , 2, 2],
  [2, , 2, , 2, , 2, , , 2, , , 2, ,],
  [2, 2, 2, , 2, , 2, , , 2, , , 2, 2, 2],
];

export const seededRng = [splitmix32(1), splitmix32(1), splitmix32(1), splitmix32(1), Math.random];

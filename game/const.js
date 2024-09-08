import { Sphere, Plane, Cube, Pyramid } from "../renderer/index.js";
import ship from "../assets/ship.js";

export const baseSpeed = 10;
export const speedIncrease = 2; //+speed per collected boost

export const maxTurn = 7;
export const turnVelocity = 20;
export const maxTilt = 20;

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
  x: 0,
  y: 0,
  z: 0,
  boosts: 0,
  score: 0,
  turn: 0,

  lastFrame: 0,
};

import { levelLength } from "./const.js";

export { initShip } from "./objects/ship.js";
export { initBoost } from "./objects/boost.js";
export { initSpike } from "./objects/spike.js";
export { initGate } from "./objects/gate.js";

import { gradient } from "./util.js";

/**
 * @param {W2} rend
 */
export const initFloor = (rend) => {
  rend.add("plane", {
    id: "floor",
    x: 0,
    y: levelLength / 2,
    z: 0,
    b: "#E6E6FA",
    w: 39,
    h: levelLength,
    t: gradient("#D3D3D3", "#E6E6FA", 0, 0.85),
  });
};

/**
 * @param {W2} rend
 */
export const initExit = (rend) => {
  rend.add("plane", {
    id: "exit",
    x: 0,
    y: levelLength - 1,
    z: 13,
    b: "#FFFF00",
    rx: 90,
    w: 13 * 3,
    h: 13 * 2,
  });
};

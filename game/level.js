import { gradient } from "./util.js";
import { initBoost, initSpike } from "./objects.js";

/**
 * @param seed
 * @param {W2} rend
 * @returns {*[]}
 */
export const generateLevel = (seed, rend) => {
  // rend.pyramid({ y: 8, rx: 90, x: 3, z: 1.5, b: "#ff00ff", g: 'test', w: 2, h: 3, d: 2, id: 'pyramid1', t: gradient('#8A2BE2', '#E6E6FA') });
  rend.add("plane", {
    id: "floor",
    x: 0,
    y: 500,
    z: 0,
    b: "#E6E6FA",
    w: 39,
    h: 1000,
    t: gradient("#D3D3D3", "#E6E6FA", 0, 0.85),
  });

  rend.add("cube", {
    id: "wall1",
    x: 0,
    y: 999,
    z: 13,
    b: "#FF6347",
    d: 26,
    w: 3,
    h: 3,
  });
  rend.add("cube", {
    id: "wall2",
    x: -3 * 5,
    y: 999,
    z: 13,
    b: "#FF6347",
    d: 26,
    w: 3,
    h: 3,
  });
  rend.add("cube", {
    id: "wall3",
    x: 3 * 4,
    y: 999,
    z: 13,
    b: "#FF6347",
    d: 26,
    w: 3,
    h: 3,
  });

  rend.add("plane", {
    id: "exit",
    x: 0,
    y: 1000,
    z: 13,
    b: "#FFFF00",
    rx: 90,
    w: 13 * 3,
    h: 13 * 2,
  });

  for (let i = 0; i < 100; i++) {
    initSpike(rend, 13 * 1.5 - Math.round(Math.random() * 13 * 3), 10 + i * 5);
  }

  initBoost(rend, 2, 6);

  for (let i = 0; i < 5; i++) {
    initBoost(rend, 13 * 1.5 - Math.round(Math.random() * 13 * 3), 16 + i * 30);
  }

  return [];
};

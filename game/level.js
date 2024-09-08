import { initBoost, initExit, initFloor, initSpike } from "./objects.js";

/**
 * @param seed
 * @param {W2} rend
 * @returns {Element[]}
 */
export const generateLevel = (seed, rend) => {
  const objects = [];
  // rend.pyramid({ y: 8, rx: 90, x: 3, z: 1.5, b: "#ff00ff", g: 'test', w: 2, h: 3, d: 2, id: 'pyramid1', t: gradient('#8A2BE2', '#E6E6FA') });

  initFloor(rend);
  initExit(rend);

  legacy(rend);

  objects.push(initBoost(rend, 2, 6));

  for (let i = 0; i < 15; i++) {
    objects.push(initBoost(rend, 13 * 1.5 - Math.round(Math.random() * 13 * 3), 16 + i * 30));
  }

  return objects.sort((o1, o2) => o1.y - o2.y);
};

const legacy = (rend) => {
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

  for (let i = 0; i < 100; i++) {
    initSpike(rend, 13 * 1.5 - Math.round(Math.random() * 13 * 3), 10 + i * 5);
  }
};

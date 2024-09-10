import { initBoost, initExit, initFloor, initSpike, initGate } from "./objects.js";
import { levelLength } from "./const.js";
import { shuffle } from "./util.js";

/**
 * @param seed
 * @param {W2} rend
 * @returns {Entity[], Tween[]}
 */
export const generateLevel = (seed, rend) => {
  const objects = [];
  const tweens = [];
  // rend.pyramid({ y: 8, rx: 90, x: 3, z: 1.5, b: "#ff00ff", g: 'test', w: 2, h: 3, d: 2, id: 'pyramid1', t: gradient('#8A2BE2', '#E6E6FA') });

  initFloor(rend);
  initExit(rend);

  objects.push(initBoost(rend, 2, 6));

  for (let i = 0; i < 15; i++) {
    objects.push(initBoost(rend, 13 * 1.5 - Math.round(Math.random() * 13 * 3), 16 + i * 30));
  }

  for (let i = 0; i < 100; i++) {
    objects.push(initSpike(rend, 13 * 1.5 - Math.round(Math.random() * 13 * 3), 10 + i * 5));
  }

  const gates = [];
  for (let i = 0; i < 13; i++) gates.push(i);
  shuffle(gates);
  gates.forEach((id, i) => {
    objects.push(initGate(rend, id, id * 3 - (13 * 3) / 2 + 1.5, levelLength, 30 + i * 5));
    const d = 2000 * i;
    tweens.push({
      id: "gate" + id + "c",
      key: "o",
      from: 0,
      delta: 1,
      duration: 2000,
      delay: d,
      progress: 0,
    });
    tweens.push({
      id: "gate" + id,
      key: "z",
      from: 20 + i * 2,
      delta: -(20 + i * 2),
      duration: 8000,
      delay: d,
      progress: 0,
    });
  });

  return [objects.sort((o1, o2) => o1.y - o2.y), tweens];
};

import { initBoost, initExit, initFloor, initSpike, initGate } from "./objects.js";
import { baseSpeed, levelLength, speedIncrease } from "./const.js";
import { shuffle } from "./util.js";

/**
 * @param {number} levelN
 * @param seed
 * @param {W2} rend
 * @param {function} prng
 * @returns [Entity[], Tween[]]
 */
export const generateLevel = (levelN, seed, rend, prng) => {
  const objects = [];
  const tweens = [];

  // first 5 seconds, it's empty, on second 4 - first collectible
  // base level length on level 1, +20% for each next level
  // timing for gates closing assumes that player gets and keeps X bonuses at equal interval
  // if X is reached player arrives at the end when last gate is 50% closed

  const obstacleOffset = baseSpeed * 5;
  const totalLength = levelLength * (1 + 0.2 * (levelN - 1));
  const targetBoosts = levelN * 2;

  const targetTime =
    Array.from({ length: targetBoosts + 1 })
      .fill(totalLength / (targetBoosts + 1))
      .map((n, i) => n / (baseSpeed + speedIncrease * i))
      .reduce((acc, n) => acc + n, 0) * 1000;

  initFloor(rend, totalLength);
  initExit(rend, totalLength);

  objects.push(initBoost(rend, 0, baseSpeed * 4));

  for (let i = 0; i < 15; i++) {
    objects.push(initBoost(rend, 13 * 1.5 - Math.round(prng() * 13 * 3), 16 + i * 20));
  }

  for (let i = 0; i < 100; i++) {
    objects.push(
      initSpike(
        rend,
        13 * 1.5 - Math.round(prng() * 13 * 3),
        10 + i * 5,
        Math.ceil(prng() * 4),
        Math.floor(prng() * 4) + 3,
      ),
    );
  }

  const gates = [];
  for (let i = 0; i < 13; i++) gates.push(i);
  shuffle(gates, prng);
  const closeStart = targetTime / 26;
  const closeDuration = (targetTime / 13) * 1.5;
  const offset = (targetTime - closeDuration) / 12;
  gates.forEach((id, i) => {
    objects.push(initGate(rend, id, id * 3 - (13 * 3) / 2 + 1.5, totalLength, 30 + i * 5));
    const delay = closeStart + offset * i;
    console.info(delay);
    tweens.push({
      id: "gate" + id + "c",
      key: "o",
      from: 0,
      delta: 1,
      duration: closeDuration * 0.2,
      delay: delay,
      progress: 0,
    });
    tweens.push({
      id: "gate" + id,
      key: "z",
      from: 20 + i * 2,
      delta: -(20 + i * 2),
      duration: closeDuration,
      delay: delay,
      progress: 0,
    });
  });

  return [objects.sort((o1, o2) => o1.y - o2.y), tweens];
};

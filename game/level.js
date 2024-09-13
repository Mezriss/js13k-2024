import { initBoost, initExit, initFloor, initSpike, initGate } from "./objects.js";
import { baseSpeed, levelLength, speedIncrease } from "./const.js";
import { shuffle } from "./util.js";
import { patterns } from "./patterns.js";

/**
 * @param {number} levelN
 * @param {W2} rend
 * @param {PRNG} prng
 * @returns [Entity[], Tween[]]
 */
export const generateLevel = (levelN, rend, prng) => {
  const objects = [];
  const tweens = [];

  // first 5 seconds, it's empty, on second 4 - first collectible
  // base level length on level 1, +20% for each next level
  // timing for gates closing assumes that player gets and keeps X bonuses at equal interval
  // if X is reached player arrives at the end when last gate is 50% closed

  const obstacleOffset = baseSpeed * 3;
  const totalLength = levelLength * (1 + 0.2 * (levelN - 1));
  const targetBoosts = levelN * 2;

  const targetTime =
    Array.from({ length: targetBoosts + 1 })
      .fill(totalLength / (targetBoosts + 1))
      .map((n, i) => n / (baseSpeed + speedIncrease * i))
      .reduce((acc, n) => acc + n, 0) * 1000;

  initFloor(rend, totalLength);
  initExit(rend, totalLength);

  objects.push(initBoost(rend, 0, baseSpeed * 2));

  for (let i = 1; i < (totalLength - obstacleOffset) / 15; i++) {
    objects.push(initBoost(rend, prng.r(-8, 8), obstacleOffset + i * 20));
  }

  // every Xm do a group
  // each group is N obstacles in a certain pattern;
  // pattern is a list of x,y,s,h offsets, where one of the params can be random

  const addGroup = (center) => {
    const groupAmount = prng.r(2, 2 + levelN);
    const spikes = [];

    const selectedPattern = patterns[prng.n(patterns.length - 1)];
    spikes.push(...selectedPattern(center, groupAmount, prng));

    spikes.forEach(([x, y, w, h]) => objects.push(initSpike(rend, x, y, w, h)));
  };

  for (let i = 0; i < (totalLength - obstacleOffset) / (25 - levelN); i++) {
    const cy = obstacleOffset + (25 - levelN) * i;
    switch (i % 3) {
      case 0:
        addGroup([prng.r(-14, -5), cy]);
        addGroup([prng.r(-5, 5), cy + 5]);
        addGroup([prng.r(5, 14), cy]);
        break;
      case 1:
        addGroup([prng.r(-14, -5), cy]);
        addGroup([prng.r(5, 14), cy]);
        break;
      case 2:
        addGroup([prng.r(-14, -5), cy]);
        addGroup([prng.r(-5, 5), cy - 5]);
        addGroup([prng.r(5, 14), cy]);
        break;
    }
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
